import re

with open('server.ts', 'r') as f:
    content = f.read()

target = """  // Vite middleware for development"""

replacement = """  app.post("/api/generate-insights", async (req, res) => {
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

  // Vite middleware for development"""

content = content.replace(target, replacement)

with open('server.ts', 'w') as f:
    f.write(content)
