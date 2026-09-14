import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const doc = new jsPDF();
try {
  autoTable(doc, {
    head: [['Name']],
    body: [['John']],
  });
  console.log("autoTable succeeded!");
  console.log("finalY:", (doc as any).lastAutoTable.finalY);
} catch (e) {
  console.error("autoTable failed:", e);
}
