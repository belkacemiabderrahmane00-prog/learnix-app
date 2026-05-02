import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportDiplomaPdf(
  elementId: string,
  filename: string,
  landscape = true,
) {
  const el = document.getElementById(elementId);
  if (!el) throw new Error("Element diplôme introuvable");

  const canvas = await html2canvas(el, {
    scale: 2.5,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  if (landscape) {
    // A4 paysage : 297 x 210 mm
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    pdf.addImage(imgData, "JPEG", 0, 0, 297, 210, undefined, "FAST");
    pdf.save(filename);
  } else {
    // A4 portrait : 210 x 297 mm
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    pdf.save(filename);
  }
}
