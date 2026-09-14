import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const doc = new jsPDF();
autoTable(doc, {
  head: [['Name', 'Email']],
  body: [['John', 'john@example.com']],
});
console.log(Object.keys(doc).filter(k => k.toLowerCase().includes('table')));
console.log((doc as any).lastAutoTable ? "Has lastAutoTable" : "No lastAutoTable");
console.log((doc as any).autoTable ? "Has autoTable" : "No autoTable");
if ((doc as any).autoTable) {
    console.log(Object.keys((doc as any).autoTable));
}
