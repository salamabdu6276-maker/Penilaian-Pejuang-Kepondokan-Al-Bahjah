import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post("/api/generate-avatar", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `A minimalist, clean, flat-design avatar for a user named '${name}'. Simple shapes, professional color palette, no text.`;
      
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          aspectRatio: "1:1"
        }
      });

      if (!response.generatedImages || response.generatedImages.length === 0) {
         return res.status(500).json({ error: "No image generated" });
      }
      
      const base64Image = response.generatedImages[0].image.imageBytes;
      const avatarUrl = `data:image/jpeg;base64,${base64Image}`;

      res.json({ avatarUrl });
    } catch (error: any) {
      console.error("Error generating avatar:", error);
      res.status(500).json({ error: error.message || "Failed to generate avatar" });
    }
  });

  app.post("/api/generate-insights", async (req, res) => {
    try {
      const { submissions, period } = req.body;
      if (!submissions || !Array.isArray(submissions)) {
        return res.status(400).json({ error: "Invalid submissions data" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are an AI Coaching Assistant for a religious organization's performance system. 
Analyze the following underperforming submissions for the period: ${period}. 
Identify common patterns in the low scores, suggest specific coaching focus points for the Lead Divisi, and provide actionable advice. Keep it concise, professional, and empathetic. Format your response in Markdown.

Submissions data:
${JSON.stringify(submissions.slice(0, 50), null, 2)}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error generating insights:", error);
      res.status(500).json({ error: error.message || "Failed to generate insights" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
