import React, { useState } from "react";
import { useDemo } from "../context/DemoContext";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer,
  Download,
  Eye,
  Send,
  User,
  Clock,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  ExternalLink,
  Edit
} from "lucide-react";
import { generatePatientPDF } from "../utils/pdfGenerator";

export const ClinicalSummaryPage = () => {
  const {
    setActiveTab,
    isDemoMode,
    nextDemoStep,
    patientData,
    setPatientData,
    patientConversation,
    sendCaseToDoctor
  } = useDemo();

  const [activeView, setActiveView] = useState("pdf"); // "pdf" or "structured"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [editName, setEditName] = useState(patientData?.name || "Ramesh Sharma");
  const [editAge, setEditAge] = useState(patientData?.age?.toString() || "48");
  const [editGender, setEditGender] = useState(patientData?.gender || "Male");

  // Current Medications Edit State
  const [isEditingMeds, setIsEditingMeds] = useState(false);
  const [medsList, setMedsList] = useState(
    Array.isArray(patientData?.caseData?.currentMeds) && patientData.caseData.currentMeds.length > 0
      ? patientData.caseData.currentMeds
      : ["Tab. Amlodipine 5mg OD", "Tab. Paracetamol 650mg SOS"]
  );
  const [newMedInput, setNewMedInput] = useState("");

  const handleSavePatientDetails = () => {
    setPatientData((prev) => ({
      ...prev,
      name: editName.trim() || prev.name,
      age: parseInt(editAge, 10) || prev.age,
      gender: editGender
    }));
    setIsEditingPatient(false);
  };

  const handleSaveMeds = () => {
    setPatientData((prev) => ({
      ...prev,
      caseData: {
        ...prev.caseData,
        currentMeds: medsList
      }
    }));
    setIsEditingMeds(false);
  };

  const handleAddMed = (medName) => {
    const text = (medName || newMedInput).trim();
    if (!text) return;
    if (!medsList.includes(text)) {
      setMedsList([...medsList, text]);
    }
    setNewMedInput("");
  };

  const handleRemoveMed = (index) => {
    setMedsList(medsList.filter((_, i) => i !== index));
  };

  // Real PDF Download
  const handleDownloadPDF = () => {
    try {
      const doc = generatePatientPDF(patientData, patientConversation);
      doc.save(`MediKiosk_Intake_Token_${patientData.token || "105"}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      window.print();
    }
  };

  // Open PDF directly in browser
  const handleOpenPDF = () => {
    try {
      const doc = generatePatientPDF(patientData, patientConversation);
      const pdfBlob = doc.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error("Open PDF error:", err);
      window.print();
    }
  };

  // Submit to Doctor's Chamber Queue
  const handleSubmitToDoctor = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        sendCaseToDoctor(patientData);
      }, 900);
    }, 600);
  };

  const isHighPriority =
    patientData.priority === "High Priority" || patientData.priority === "High";

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 animate-fade-in">
      {/* Top Action Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-5 border border-blue-600/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="bg-white/20 backdrop-blur-md text-blue-100 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider border border-white/30">
              CLINICAL INTAKE CASE SHEET
            </span>
            <span className="text-xs bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 px-3 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Token #{patientData.token || "105"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Patient Case Summary & OPD Sheet
          </h1>
          <p className="text-blue-200 text-xs font-medium">
            AI-assisted intake complete • Digitized & encrypted under ABDM protocol
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          {/* Edit Name & Age quick button */}
          <button
            onClick={() => {
              setEditName(patientData.name);
              setEditAge(patientData.age ? patientData.age.toString() : "48");
              setEditGender(patientData.gender || "Male");
              setIsEditingPatient(true);
            }}
            className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-md shadow-sm active:scale-95"
          >
            <Edit size={14} className="text-blue-300" /> ✏️ Edit Name & Age
          </button>

          {/* Edit Medications quick button */}
          <button
            onClick={() => {
              setMedsList(Array.isArray(patientData?.caseData?.currentMeds) ? patientData.caseData.currentMeds : []);
              setIsEditingMeds(true);
            }}
            className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-md shadow-sm active:scale-95"
          >
            <Edit size={14} className="text-emerald-300" /> ✏️ Edit Meds (दवाइयाँ)
          </button>

          {/* Open PDF in New Tab */}
          <button
            onClick={handleOpenPDF}
            className="bg-white text-blue-900 hover:bg-blue-50 border border-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
            title="Open generated PDF in new tab"
          >
            <ExternalLink size={15} className="text-blue-700" /> Open PDF (खोलें ↗)
          </button>

          {/* Download PDF button */}
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/50 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
          >
            <Download size={15} className="text-blue-200" /> Download PDF
          </button>

          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-md shadow-sm active:scale-95"
          >
            <Printer size={15} className="text-blue-300" /> Print
          </button>

          {/* Submit to Doctor button */}
          <button
            onClick={handleSubmitToDoctor}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Send size={15} />
            <span>{isSubmitting ? "Sending..." : "Send to Doctor (डॉक्टर को भेजें)"}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {isSubmitted && (
        <div className="bg-emerald-50/90 border-2 border-emerald-400 p-4 rounded-2xl text-emerald-900 text-sm font-bold flex items-center gap-3 shadow-md animate-pulse">
          <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
          <div>
            <p className="font-extrabold">
              Case Token #{patientData.token} successfully routed to Dr. Sharma's OPD chamber!
            </p>
            <p className="text-xs text-emerald-700 font-normal">
              Redirecting to Doctor Dashboard now...
            </p>
          </div>
        </div>
      )}

      {/* Priority Warning */}
      {isHighPriority && (
        <div className="bg-red-50/90 border-2 border-red-300 p-4 rounded-2xl flex items-center gap-3 text-red-900 text-xs shadow-xs">
          <AlertTriangle size={22} className="text-red-600 shrink-0 animate-bounce" />
          <div>
            <strong className="font-black text-sm text-red-800">TRIAGE ALERT: Priority Assessment Required</strong>
            <p className="mt-0.5 text-red-700 font-medium">
              Patient reported potentially urgent symptoms: "{patientData.chiefComplaint}". Routed with high priority badge.
            </p>
          </div>
        </div>
      )}

      {/* Toggle View: PDF Sheet View vs Structured Card View */}
      <div className="glass-card flex justify-between items-center p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("pdf")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeView === "pdf"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText size={14} /> Hospital OPD Sheet (Paper View)
          </button>
          <button
            onClick={() => setActiveView("structured")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeView === "structured"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Eye size={14} /> Structured Health Cards
          </button>
        </div>

        <span className="text-[11px] text-slate-500 hidden sm:block font-medium pr-2">
          Click <strong className="text-emerald-700">"Send to Doctor"</strong> to transmit this case to Dr. Sharma's desk
        </span>
      </div>

      {/* VIEW 1: Authentic Hospital Case Sheet (PDF Preview) */}
      {activeView === "pdf" && (
        <div className="relative bg-white rounded-3xl border-2 border-slate-300/90 shadow-2xl overflow-hidden p-6 sm:p-12 font-sans max-w-4xl mx-auto space-y-6">
          {/* Subtle Watermark Stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <span className="text-9xl font-black uppercase transform -rotate-12 text-slate-900">
              ABDM OPD
            </span>
          </div>

          {/* Hospital Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-wrap justify-between items-start gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-blue-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-widest">
                  GOVT. GENERAL HOSPITAL / AIIMS OPD
                </span>
                <span className="text-[10px] text-slate-500 font-bold">DEPT. OF GENERAL MEDICINE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                Clinical Case Intake Sheet
              </h2>
              <p className="text-[11px] text-slate-600 font-semibold">
                Ayushman Bharat Digital Mission (ABDM) • Integrated Kiosk Intake Unit #03
              </p>
            </div>

            <div className="text-right border-2 border-slate-900 rounded-2xl p-3.5 bg-slate-50 min-w-[130px] shadow-xs">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">OPD TOKEN</span>
              <span className="text-3xl font-black text-blue-700 font-mono">
                #{patientData.token || "105"}
              </span>
              <span className="text-[10px] text-slate-600 font-bold block mt-0.5">
                {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Patient Demographic Bar with Edit Option */}
          {isEditingPatient ? (
            <div className="bg-blue-50/70 rounded-2xl p-4 border-2 border-blue-300 space-y-3">
              <div className="flex justify-between items-center">
                <strong className="text-xs font-black text-blue-900 uppercase">
                  Edit Patient Details (मरीज का नाम व उम्र बदलें)
                </strong>
                <span className="text-[10px] text-slate-500 font-medium">Updates clinical sheet & PDF</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Full Name (नाम):</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Age (उम्र):</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Gender (लिंग):</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Female">Female (महिला)</option>
                    <option value="Other">Other (अन्य)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingPatient(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePatientDetails}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-1.5 rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Save & Update Sheet
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-2xl p-4 border border-slate-300 flex flex-wrap justify-between items-center gap-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs flex-1">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Patient Name</span>
                  <strong className="text-slate-900 font-extrabold text-sm">{patientData.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Age / Gender</span>
                  <strong className="text-slate-900">{patientData.age} Y / {patientData.gender}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">ABHA ID</span>
                  <strong className="text-slate-900 font-mono">{patientData.abhaId}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Triage Status</span>
                  <strong className={isHighPriority ? "text-red-700 font-black" : "text-emerald-700 font-bold"}>
                    {isHighPriority ? "🚨 HIGH PRIORITY" : "STANDARD OPD"}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditName(patientData.name);
                  setEditAge(patientData.age.toString());
                  setEditGender(patientData.gender);
                  setIsEditingPatient(true);
                }}
                className="bg-white hover:bg-blue-50 text-blue-700 border border-slate-300 font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <Edit size={13} /> Edit Name & Age
              </button>
            </div>
          )}

          {/* Clinical Sections */}
          <div className="space-y-4 text-xs">
            {/* 1. Chief Complaint */}
            <div className="border border-slate-300 rounded-xl p-4 bg-white">
              <span className="font-extrabold text-blue-800 uppercase tracking-wider block text-[11px] mb-1">
                1. CHIEF COMPLAINT (CC)
              </span>
              <p className="text-sm font-bold text-slate-900">
                {patientData.chiefComplaint}
              </p>
            </div>

            {/* 2. History of Present Illness */}
            <div className="border border-slate-300 rounded-xl p-4 bg-white space-y-1">
              <span className="font-extrabold text-blue-800 uppercase tracking-wider block text-[11px]">
                2. HISTORY OF PRESENT ILLNESS (HPI)
              </span>
              <p className="text-slate-800 leading-relaxed text-xs">
                {patientData.caseData?.hpi || "Patient presented via intake kiosk reporting acute symptoms. Conversation history captured via speech-to-text."}
              </p>
            </div>

            {/* 3. Past Medical & Medication */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-300 rounded-xl p-4 bg-white">
                <span className="font-extrabold text-blue-800 uppercase tracking-wider block text-[11px] mb-1">
                  3. PAST MEDICAL HISTORY
                </span>
                <p className="text-slate-800 font-medium">
                  {patientData.caseData?.pastHistory}
                </p>
              </div>

              <div className="border border-slate-300 rounded-xl p-4 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold text-blue-800 uppercase tracking-wider block text-[11px]">
                    4. MEDICATIONS & ALLERGIES
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMedsList(Array.isArray(patientData?.caseData?.currentMeds) ? patientData.caseData.currentMeds : []);
                      setIsEditingMeds(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer bg-blue-50 px-2 py-0.5 rounded-md"
                  >
                    <Edit size={11} /> Edit Meds
                  </button>
                </div>
                <p className="text-slate-800 font-medium">
                  Meds: {Array.isArray(patientData.caseData?.currentMeds) && patientData.caseData.currentMeds.length > 0 ? patientData.caseData.currentMeds.join(", ") : "None reported"}
                </p>
                <p className="text-red-700 font-bold mt-1">
                  Allergies: {Array.isArray(patientData.caseData?.allergies) ? patientData.caseData.allergies.join(", ") : "NKDA"}
                </p>
              </div>
            </div>

            {/* 4. AI Chat Conversation Transcript Excerpt */}
            {patientConversation && patientConversation.length > 0 && (
              <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center gap-1.5 text-blue-800 font-extrabold text-[11px] uppercase">
                  <MessageSquare size={14} />
                  <span>5. Kiosk AI Conversation Transcript Audit Trail</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2">
                  {patientConversation.slice(-4).map((msg, idx) => (
                    <div key={idx} className="text-[11px] flex gap-2">
                      <strong className={msg.sender === "patient" ? "text-blue-700 w-14 shrink-0" : "text-emerald-700 w-14 shrink-0"}>
                        {msg.sender === "patient" ? "Patient:" : "AI Kiosk:"}
                      </strong>
                      <span className="text-slate-700">{msg.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Doctor Assessment & Prescription Area (Blank for Physician) */}
            <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50/50 space-y-3 overflow-hidden">
              {/* Rubber Stamp Graphic */}
              <div className="absolute right-8 top-3 transform -rotate-12 border-4 border-blue-700/60 rounded-xl px-4 py-1.5 text-center pointer-events-none select-none opacity-80">
                <span className="text-[9px] font-black text-blue-700/80 uppercase tracking-widest block">AIIMS / ABDM INTAKE</span>
                <span className="text-xs font-black text-blue-800 uppercase tracking-wider block">PRE-TRIAGE VERIFIED</span>
                <span className="text-[8px] font-bold text-blue-600/70 font-mono block">KIOSK-03 • DIGITALLY LOGGED</span>
              </div>

              <span className="font-black text-slate-800 uppercase tracking-wider block text-[11px]">
                PHYSICIAN CLINICAL ASSESSMENT & RX (DR. SHARMA, OPD CHAMBER #04):
              </span>
              <div className="h-16 border-b border-slate-200"></div>
              <div className="flex justify-between items-end pt-2 text-[10px] text-slate-400 font-medium">
                <span>ABDM Linked Case Sheet • Valid for Today's Consultation • Token #{patientData.token || "105"}</span>
                <div className="border-t border-slate-400 w-48 text-center pt-1 font-bold text-slate-700">
                  Physician Signature & Stamp
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Structured Card View */}
      {activeView === "structured" && (
        <div className="space-y-5">
          {/* Patient Demographic Bar */}
          {isEditingPatient ? (
            <div className="bg-blue-50/70 rounded-3xl p-6 border-2 border-blue-300 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <strong className="text-sm font-black text-blue-900 uppercase">
                  ✏️ Edit Patient Details (मरीज का नाम व उम्र बदलें)
                </strong>
                <span className="text-xs text-slate-500 font-medium">Updates both card view & PDF sheet</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name (मरीज का नाम):</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Age in Years (उम्र):</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gender (लिंग):</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Female">Female (महिला)</option>
                    <option value="Other">Other (अन्य)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingPatient(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePatientDetails}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
                >
                  Save & Update Details
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-lg">
                  {patientData.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-slate-900">{patientData.name}</h2>
                    <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-bold">
                      {patientData.age} / {patientData.gender}
                    </span>
                    <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded-lg font-bold">
                      ABHA: {patientData.abhaId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
                    <Clock size={14} /> Intake completed via Kiosk #03 • Preferred Language: {patientData.language}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditName(patientData.name);
                  setEditAge(patientData.age ? patientData.age.toString() : "48");
                  setEditGender(patientData.gender || "Male");
                  setIsEditingPatient(true);
                }}
                className="bg-slate-100 hover:bg-blue-50 text-blue-700 border border-slate-200 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <Edit size={14} /> ✏️ Edit Name & Age
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">CHIEF COMPLAINT (CC)</h3>
              <p className="text-sm font-bold text-slate-900 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {patientData.chiefComplaint}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">PAST MEDICAL HISTORY</h3>
              <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {patientData.caseData?.pastHistory}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2 md:col-span-2">
              <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">
                HISTORY OF PRESENT ILLNESS (HPI)
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-medium">
                {patientData.caseData?.hpi}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">CURRENT MEDICATIONS</h3>
                <button
                  type="button"
                  onClick={() => {
                    setMedsList(Array.isArray(patientData?.caseData?.currentMeds) ? patientData.caseData.currentMeds : []);
                    setIsEditingMeds(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 transition cursor-pointer border border-blue-200"
                >
                  <Edit size={12} /> Edit / Add Meds (दवाइयाँ जोड़ें)
                </button>
              </div>
              <ul className="list-disc pl-4 text-xs font-semibold text-slate-800 space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {patientData.caseData?.currentMeds && patientData.caseData.currentMeds.length > 0 ? (
                  patientData.caseData.currentMeds.map((med, i) => (
                    <li key={i}>{med}</li>
                  ))
                ) : (
                  <li className="list-none text-slate-400 italic">None reported (कोई दवाई नहीं)</li>
                )}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">KNOWN ALLERGIES & LIFESTYLE</h3>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-red-700">Allergies: {patientData.caseData?.allergies?.join(", ")}</p>
                <p className="text-slate-600">Family History: {patientData.caseData?.familyHistory}</p>
                <p className="text-slate-600">Lifestyle: {patientData.caseData?.lifestyle}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Current Medications Modal */}
      {isEditingMeds && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Current Medications (मरीज की चालू दवाइयाँ)</h3>
                <p className="text-xs text-slate-500">Add or edit regular medicines for the doctor's record</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingMeds(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* List of active medicines */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Current Medicine List:</label>
              {medsList.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3.5 rounded-xl border border-dashed border-slate-300 text-center">
                  No medications entered yet. Type below or choose from suggestions.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {medsList.map((med, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-blue-50/80 border border-blue-200 px-3.5 py-2.5 rounded-xl text-xs">
                      <span className="font-bold text-blue-950">💊 {med}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMed(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer"
                        title="Remove medicine"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add custom medicine input */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">Add New Medicine (दवाई का नाम व डोज़ लिखें):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMedInput}
                  onChange={(e) => setNewMedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMed();
                    }
                  }}
                  placeholder="e.g. Tab. Pantocid 40mg OD, Insulin 10 units..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddMed()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-xl text-xs transition cursor-pointer shrink-0 shadow-sm"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 block">Quick Suggestions (टैप करके जोड़ें):</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Tab. Pantoprazole 40mg OD",
                  "Tab. Paracetamol 650mg SOS",
                  "Tab. Metformin 500mg BD",
                  "Tab. Amlodipine 5mg OD",
                  "Tab. Telmisartan 40mg OD",
                  "Cap. Multivitamin OD"
                ].map((sugg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddMed(sugg)}
                    className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditingMeds(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMeds}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-2 rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                Save Medications (सेव करें)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap justify-between items-center pt-4 border-t border-slate-200 gap-3">
        <button
          onClick={() => setActiveTab("interview")}
          className="text-slate-600 hover:text-slate-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          ← Retake AI Interview
        </button>

        <button
          onClick={handleSubmitToDoctor}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg transition transform active:scale-95 cursor-pointer"
        >
          <Stethoscope size={18} />
          <span>Send Case to Doctor & Open Dashboard</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
