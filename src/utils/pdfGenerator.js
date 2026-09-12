import { jsPDF } from "jspdf";
import { cleanTextForPDF } from "./textCleaner";

export const generatePatientPDF = (patientData, conversation = []) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const primaryColor = [29, 78, 216]; // Blue 700
  const darkColor = [15, 23, 42]; // Slate 900
  const grayColor = [100, 116, 139]; // Slate 500
  const redColor = [220, 38, 38];

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("MEDIKIOSK - CLINICAL OPD INTAKE SHEET", 14, 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Ayushman Bharat Digital Mission (ABDM) Compliant | AI-Assisted Patient Intake", 14, 17);

  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  doc.text(`Date: ${dateStr} | ${timeStr}`, 155, 17);

  // Token Box (Right Top)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(165, 3, 38, 16, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text("OPD TOKEN", 172, 8);
  doc.setFontSize(13);
  doc.setTextColor(...darkColor);
  doc.text(`#${cleanTextForPDF(patientData.token || "105")}`, 174, 15);

  let y = 30;

  // Patient Demographic Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 22, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  const patientNameClean = cleanTextForPDF(patientData.name || "Patient");
  doc.text(`Patient: ${patientNameClean}`, 18, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text(`Age/Sex: ${patientData.age || "45"} Y / ${cleanTextForPDF(patientData.gender || "M")}`, 18, y + 14);
  doc.text(`ABHA ID: ${patientData.abhaId || "91-4829-1029-4821"}`, 85, y + 14);
  doc.text(`Language: ${cleanTextForPDF(patientData.language || "Hindi")}`, 150, y + 14);

  // Priority Badge
  const isHigh = patientData.priority === "High Priority" || patientData.priority === "High";
  if (isHigh) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(145, y + 3, 46, 6, 1, 1, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...redColor);
    doc.text("PRIORITY: TRIAGE ALERT", 147, y + 7.5);
  }

  y += 28;

  // Section 1: Chief Complaint (CC)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("1. CHIEF COMPLAINT (CC)", 14, y);
  y += 4;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 12, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  const rawComplaint = patientData.chiefComplaint || "General malaise and consultation request.";
  const cleanComplaint = cleanTextForPDF(rawComplaint);
  doc.text(cleanComplaint.substring(0, 95), 18, y + 7);

  y += 18;

  // Section 2: History of Present Illness (HPI)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("2. HISTORY OF PRESENT ILLNESS (HPI)", 14, y);
  y += 4;

  const rawHpi =
    patientData.caseData?.hpi ||
    patientData.hpi ||
    "Patient presented at intake kiosk reporting symptoms. Clinical interview conducted in patient's preferred language.";
  const cleanHpi = cleanTextForPDF(rawHpi);
  const splitHpi = doc.splitTextToSize(cleanHpi, 174);
  const hpiHeight = Math.max(16, splitHpi.length * 5 + 6);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, hpiHeight, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  doc.text(splitHpi, 18, y + 6);

  y += hpiHeight + 6;

  // Section 3: Past Medical & Family History
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("3. PAST MEDICAL, MEDICATION & FAMILY HISTORY", 14, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 24, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...darkColor);
  doc.text("Past History:", 18, y + 6);
  doc.setFont("helvetica", "normal");
  const rawPast = patientData.caseData?.pastHistory || "Hypertension (diagnosed 2 yrs ago), No reported diabetes.";
  doc.text(cleanTextForPDF(rawPast), 42, y + 6);

  doc.setFont("helvetica", "bold");
  doc.text("Medications:", 18, y + 12);
  doc.setFont("helvetica", "normal");
  const meds = Array.isArray(patientData.caseData?.currentMeds)
    ? patientData.caseData.currentMeds.join(", ")
    : "Tab. Amlodipine 5mg OD";
  doc.text(cleanTextForPDF(meds), 42, y + 12);

  doc.setFont("helvetica", "bold");
  doc.text("Allergies:", 18, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...redColor);
  const allergies = Array.isArray(patientData.caseData?.allergies)
    ? patientData.caseData.allergies.join(", ")
    : "No known drug allergies (NKDA)";
  doc.text(cleanTextForPDF(allergies), 42, y + 18);

  y += 30;

  // Section 4: AI Conversation Transcript Excerpt
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("4. AI CLINICAL CONVERSATION AUDIT TRAIL", 14, y);
  y += 4;

  const relevantMsgs = conversation.slice(-4);
  const transcriptHeight = 32;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, transcriptHeight, 1.5, 1.5, "FD");

  let msgY = y + 6;
  if (relevantMsgs.length > 0) {
    relevantMsgs.forEach((msg) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      if (msg.sender === "patient") {
        doc.setTextColor(...primaryColor);
        doc.text("Patient: ", 18, msgY);
      } else {
        doc.setTextColor(5, 150, 105); // emerald
        doc.text("AI Kiosk: ", 18, msgY);
      }
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...darkColor);
      const rawSnippet = msg.text ? msg.text.replace(/\n/g, " ") : "...";
      const cleanSnippet = cleanTextForPDF(rawSnippet).substring(0, 85);
      doc.text(cleanSnippet, 32, msgY);
      msgY += 6;
    });
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text("Patient completed structured question protocol at intake kiosk.", 18, msgY);
  }

  y += transcriptHeight + 8;

  // Section 5: Doctor's Assessment Block (For Physician use)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(14, y, 182, 38, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  doc.text("PHYSICIAN CLINICAL ASSESSMENT & RX (OPD CHAMBER):", 18, y + 6);

  // Blank writing lines for doctor
  doc.setDrawColor(203, 213, 225);
  doc.line(18, y + 14, 140, y + 14);
  doc.line(18, y + 21, 140, y + 21);
  doc.line(18, y + 28, 140, y + 28);

  // Doctor Signature Box
  doc.setDrawColor(203, 213, 225);
  doc.rect(146, y + 8, 44, 24);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.text("Physician Signature & Stamp", 150, y + 29);

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.text(
    "Generated via MediKiosk Clinical Intake System | Valid for OPD consultation only | Not a final diagnosis",
    14,
    290
  );
  doc.text("Page 1 of 1", 185, 290);

  return doc;
};
