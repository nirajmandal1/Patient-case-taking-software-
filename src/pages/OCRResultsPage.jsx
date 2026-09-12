import React, { useState, useEffect } from "react";
import { useDemo } from "../context/DemoContext";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  ArrowLeft,
  Calendar,
  Building2,
  UserCheck,
  Stethoscope,
  ExternalLink,
  Download,
  Eye,
  Check,
  Activity,
  HelpCircle,
  HeartPulse
} from "lucide-react";
import { mockSampleDocuments } from "../data/mockData";
import { jsPDF } from "jspdf";

export const OCRResultsPage = () => {
  const {
    setActiveTab,
    isDemoMode,
    nextDemoStep,
    activeScannedDoc,
    setPatientData,
    patientData
  } = useDemo();

  const doc = activeScannedDoc || mockSampleDocuments[0];
  const [blobUrl, setBlobUrl] = useState(null);

  // Convert Base64 data URL to reliable Blob URL for seamless browser viewing
  useEffect(() => {
    if (doc?.previewUrl?.startsWith("data:")) {
      try {
        fetch(doc.previewUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
          })
          .catch(() => setBlobUrl(doc.previewUrl));
      } catch {
        setBlobUrl(doc.previewUrl);
      }
    } else {
      setBlobUrl(doc?.previewUrl || null);
    }
  }, [doc]);

  // Open Document in Full Screen or New Tab reliably
  const handleOpenDocument = () => {
    if (blobUrl) {
      window.open(blobUrl, "_blank");
    } else {
      // Generate clean PDF view on the fly
      try {
        const tempDoc = new jsPDF();
        tempDoc.setFont("helvetica", "bold");
        tempDoc.setFontSize(14);
        tempDoc.text(doc.hospital || "CIVIL HOSPITAL OPD - MEDICAL RECORD", 14, 16);
        tempDoc.setFontSize(9);
        tempDoc.setFont("helvetica", "normal");
        tempDoc.text(`Document: ${doc.title || "Prescription Scan"} | Date: ${doc.date || "Today"}`, 14, 22);
        tempDoc.text(`Physician: ${doc.doctor || "Dr. K. S. Verma (MD)"}`, 14, 28);
        tempDoc.text(`Clinical Diagnosis: ${doc.extractedData?.diagnosis || "Routine OPD"}`, 14, 38);

        const problems = doc.extractedData?.problems || [
          "Chest discomfort on brisk exertion",
          "Elevated Blood Pressure readings: 148/92 mmHg"
        ];
        tempDoc.setFont("helvetica", "bold");
        tempDoc.text("Reported Problems & Symptoms:", 14, 48);
        tempDoc.setFont("helvetica", "normal");
        problems.forEach((p, idx) => {
          tempDoc.text(`• ${p}`, 18, 55 + idx * 7);
        });

        const probY = 55 + problems.length * 7 + 6;
        if (doc.extractedData?.investigations?.length > 0) {
          tempDoc.setFont("helvetica", "bold");
          tempDoc.text("Diagnostic Investigations & Tests:", 14, probY);
          tempDoc.setFont("helvetica", "normal");
          doc.extractedData.investigations.forEach((inv, idx) => {
            tempDoc.text(`• ${inv}`, 18, probY + 7 + idx * 6);
          });
        }

        const blob = tempDoc.output("blob");
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } catch (e) {
        console.error("Open doc error:", e);
        window.print();
      }
    }
  };

  // Download the document directly to user's device
  const handleDownloadDoc = () => {
    try {
      if (blobUrl) {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${(doc.title || "Medical_Document").replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const tempDoc = new jsPDF();
        tempDoc.setFont("helvetica", "bold");
        tempDoc.setFontSize(14);
        tempDoc.text(doc.title || "Medical Prescription", 14, 16);
        tempDoc.setFontSize(9);
        tempDoc.setFont("helvetica", "normal");
        tempDoc.text(`Hospital: ${doc.hospital || "Civil Hospital"}`, 14, 24);
        tempDoc.text(`Doctor: ${doc.doctor || "Dr. Sharma"}`, 14, 30);
        tempDoc.text(`Diagnosis: ${doc.extractedData?.diagnosis || "OPD"}`, 14, 40);
        tempDoc.save(`${doc.title || "Medical_Document"}.pdf`);
      }
    } catch (e) {
      console.error("Download error:", e);
    }
  };

  const handleProceed = () => {
    // Merge extracted medications into patient's case
    if (doc.extractedData?.medications?.length > 0) {
      const medList = doc.extractedData.medications.map(
        (m) => `${m.name} ${m.dosage || ""}`.trim()
      );
      setPatientData((prev) => ({
        ...prev,
        caseData: {
          ...prev.caseData,
          currentMeds: Array.from(
            new Set([...(prev.caseData?.currentMeds || []), ...medList])
          )
        }
      }));
    }

    if (isDemoMode) nextDemoStep();
    else setActiveTab("summary");
  };

  const isPdfFile = doc.isPdf || doc.title?.toLowerCase().endsWith(".pdf") || doc.previewUrl?.startsWith("data:application/pdf");

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center bg-white p-5 rounded-3xl border border-slate-200 shadow-sm gap-4">
        <div>
          <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            OCR Document Digitization
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Extracted Document Information
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            File: <strong className="text-slate-800">{doc.title || "Prescription Scan"}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenDocument}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
          >
            <ExternalLink size={14} />
            <span>Open Document (फाइल खोलें)</span>
          </button>

          <button
            onClick={handleDownloadDoc}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
          >
            <Download size={14} />
            <span>Download</span>
          </button>

          <button
            onClick={handleProceed}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <span>Attach & Proceed to Summary</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer Alert */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3 text-blue-900 text-xs shadow-2xs">
        <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-sm font-extrabold">
            Automated OCR Extraction Verification (ABDM Standard)
          </strong>
          <span>
            Clinical entities below were extracted using MedSync OCR. The physician will review both original document and structured findings before final prescription.
          </span>
        </div>
      </div>

      {/* Side-by-Side Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Authentic Document Preview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              <span>Scanned Medical Document</span>
            </h3>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-bold">
              {doc.date || "Today"}
            </span>
          </div>

          {/* Real PDF or Image or Authentic Medical Prescription Paper */}
          {isPdfFile && blobUrl ? (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner h-[480px] bg-slate-100">
                <iframe
                  src={blobUrl}
                  title={doc.title || "PDF Document"}
                  className="w-full h-full border-0"
                />
              </div>
              <div className="text-center">
                <button
                  onClick={handleOpenDocument}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink size={12} /> Having trouble viewing? Click here to open PDF in new tab
                </button>
              </div>
            </div>
          ) : doc.previewUrl && !isPdfFile ? (
            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 min-h-[380px] max-h-[500px] flex items-center justify-center p-3">
              <img
                src={doc.previewUrl}
                alt="Uploaded Medical Document"
                className="max-h-[460px] w-auto object-contain rounded-xl shadow-xs"
              />
            </div>
          ) : (
            /* High-Fidelity Authentic Medical Prescription Paper Slip */
            <div className="bg-[#fcfdfd] border-2 border-slate-300 rounded-2xl p-6 min-h-[460px] shadow-inner space-y-4 font-sans text-xs relative overflow-hidden">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none text-6xl font-black text-slate-900 -rotate-12">
                HOSPITAL OPD RECORD
              </div>

              {/* Hospital Header Banner */}
              <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-start">
                <div>
                  <h4 className="font-black text-slate-900 text-base uppercase tracking-tight">
                    {doc.hospital || "Government District Civil Hospital, Bhopal"}
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Department of General Medicine & OPD Services • ABDM Reg. #48291
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Consulting Physician: <strong className="text-slate-800">{doc.doctor || "Dr. K. S. Verma (MD, General Medicine)"}</strong>
                  </p>
                </div>
                <div className="text-right bg-slate-100 p-2 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-mono block">OPD SLIP</span>
                  <span className="text-xs font-black text-blue-700 font-mono">#{doc.id || "DOC-01"}</span>
                </div>
              </div>

              {/* Patient details line */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Patient Name</span>
                  <strong className="text-slate-800">{patientData?.name || "Ramesh Sharma"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Age / Gender</span>
                  <strong className="text-slate-800">{patientData?.age || 48}Y / {patientData?.gender || "Male"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Document Date</span>
                  <strong className="text-slate-800">{doc.date || "12 Aug 2026"}</strong>
                </div>
              </div>

              {/* Reported Patient Problems & Symptoms Section */}
              <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5 text-blue-900 font-black text-xs uppercase tracking-wider">
                  <Activity size={14} className="text-red-500" />
                  <span>Reported Health Problems & Symptoms (मुख्य समस्याएं)</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {(doc.extractedData?.problems || [
                    "सीने में भारीपन व बेचैनी (Chest discomfort on brisk exertion)",
                    "अनियंत्रित उच्च रक्तचाप (High Blood Pressure readings: 148/92 mmHg)",
                    "चलने पर हल्का सांस फूलना (Exertional breathlessness)"
                  ]).map((prob, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] border-b border-slate-100 pb-1.5 text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                      <span className="font-semibold">{prob}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Clinical Queries & Evaluation Factors */}
              <div className="space-y-2 bg-blue-50/50 p-3.5 rounded-xl border border-blue-200 text-xs">
                <div className="flex items-center gap-1.5 text-blue-900 font-black text-[10px] uppercase tracking-wider">
                  <HelpCircle size={13} className="text-blue-600" />
                  <span>Problem-Related Queries & History (समस्या से जुड़े सवाल)</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {(doc.extractedData?.relatedQueries || [
                    { query: "तकलीफ कब से है? (Duration)", detail: "पिछले 10-15 दिनों से लगातार महसूस हो रही है" },
                    { query: "समस्या कब बढ़ती है? (Triggers)", detail: "सीढ़ियाँ चढ़ने या भारी काम करने पर सीने पर दबाव बढ़ता है" },
                    { query: "क्या आराम करने से राहत मिलती है?", detail: "बैठ जाने या 5 मिनट रुकने पर दर्द कम हो जाता है" }
                  ]).map((q, i) => (
                    <div key={i} className="bg-white/80 p-2 rounded-lg border border-blue-100/60">
                      <span className="text-blue-800 font-bold block">{typeof q === 'string' ? q : q.query}</span>
                      {typeof q !== 'string' && q.detail && (
                        <span className="text-slate-600 text-[10px] block mt-0.5">{q.detail}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic Tests / Lab Findings */}
              {doc.extractedData?.investigations?.length > 0 && (
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <strong className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                    Lab Investigations & Clinical Values:
                  </strong>
                  <div className="space-y-1 text-[11px]">
                    {doc.extractedData.investigations.map((inv, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-800">
                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                        <span className="font-semibold">{inv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stamp & Footer */}
              <div className="flex justify-between items-end pt-3 border-t border-slate-200 text-[10px] text-slate-400">
                <div>
                  <span>Digitized via MedSync OCR Engine</span>
                  <span className="block text-[9px] text-slate-400">Verification Status: Verified ✓</span>
                </div>
                <div className="border-2 border-dashed border-blue-300 bg-blue-50/50 p-2 rounded-xl text-center min-w-[120px]">
                  <span className="text-[9px] font-bold text-blue-900 block">OFFICIAL CLINICAL STAMP</span>
                  <span className="text-[8px] text-slate-500">OPD Civil Hospital</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Extracted Structured Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-base">Extracted Medical Entities</h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={14} /> Confidence: {doc.confidence || "96%"}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Document Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">
                  Document Date
                </span>
                <span className="text-slate-900 font-extrabold text-sm">
                  {doc.date || "12 Aug 2026"}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">
                  Doctor / Facility
                </span>
                <span className="text-slate-900 font-bold text-xs truncate block">
                  {doc.hospital || "Civil Hospital OPD"}
                </span>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200">
              <span className="font-bold text-blue-800 block uppercase tracking-wider text-[10px]">
                Clinical Findings / Diagnosis
              </span>
              <span className="text-slate-900 font-extrabold text-base block mt-0.5">
                {doc.extractedData?.diagnosis || "OPD Clinical Consultation"}
              </span>
            </div>

            {/* Patient Problem & Symptoms Assessment */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Activity size={13} className="text-red-500" />
                  Patient's Health Problems & Symptoms (स्वास्थ्य समस्या)
                </span>
                <span className="text-[10px] bg-red-100 text-red-700 font-black px-2.5 py-0.5 rounded-full">
                  Under Evaluation
                </span>
              </div>
              <div className="space-y-2">
                {(doc.extractedData?.problems || [
                  "सीने में भारीपन व बेचैनी (Chest discomfort on brisk exertion)",
                  "उच्च रक्तचाप की समस्या (Elevated Blood Pressure: 148/92 mmHg)",
                  "चलने पर सांस फूलना व थकान (Exertional breathlessness)"
                ]).map((prob, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                    <strong className="text-slate-800 text-xs font-bold leading-relaxed">{prob}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem-Related Clinical Queries & History */}
            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-2.5">
              <span className="font-extrabold text-blue-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <HelpCircle size={13} className="text-blue-600" />
                Problem-Related Queries & Clarifications (समस्या से जुड़ी पूछताछ)
              </span>
              <div className="space-y-2">
                {(doc.extractedData?.relatedQueries || [
                  { query: "तकलीफ कब से है? (Duration / Onset)", detail: "पिछले 10-15 दिनों से, धीरे-धीरे बढ़ रही है" },
                  { query: "परेशानी कब बढ़ती है? (Aggravating triggers)", detail: "सीढ़ियाँ चढ़ने या भोजन के बाद भारीपन लगता है" },
                  { query: "क्या आराम करने से राहत मिलती है? (Relieving factor)", detail: "बैठ जाने पर 5-10 मिनट में सुधार होता है" }
                ]).map((item, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                    <strong className="text-blue-950 text-xs block font-extrabold">{typeof item === 'string' ? item : item.query}</strong>
                    {typeof item !== 'string' && item.detail && (
                      <p className="text-[11px] text-slate-600 font-medium">{item.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Queries For Doctor Consultation */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
              <span className="font-extrabold text-emerald-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Key Queries For Consulting Doctor (डॉक्टर से परामर्श के लिए मुख्य सवाल)
              </span>
              <ul className="space-y-1.5 text-[11px] text-emerald-950 font-semibold">
                <li className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-emerald-600">🔹</span> क्या ईसीजी के अलावा टीएमटी (TMT) या 2D-Echo जांच की आवश्यकता है?
                </li>
                <li className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-emerald-600">🔹</span> बीपी नियंत्रण और सीने की तकलीफ के लिए खान-पान में क्या सावधानी बरतें?
                </li>
              </ul>
            </div>

            {/* Doctor Prescribed Medications */}
            {doc.extractedData?.medications?.length > 0 && (
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-blue-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    💊 Prescribed Medicines (डॉक्टर द्वारा दी गई दवाइयाँ)
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded-full">
                    {doc.extractedData.medications.length} Meds
                  </span>
                </div>
                <div className="space-y-1.5">
                  {doc.extractedData.medications.map((m, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-xl border border-blue-100 flex justify-between items-center text-[11px] shadow-2xs">
                      <div>
                        <strong className="text-slate-900 block">{m.name} {m.dosage}</strong>
                        <span className="text-[10px] text-slate-500">{m.frequency}</span>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-lg">
                        {m.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investigations */}
            {doc.extractedData?.investigations?.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                  Extracted Lab Tests & Observations
                </span>
                <ul className="space-y-1.5">
                  {doc.extractedData.investigations.map((inv, i) => (
                    <li key={i} className="bg-white p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 text-[11px] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vitals */}
            {doc.extractedData?.vitals && doc.extractedData.vitals !== "N/A" && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Recorded Vitals
                </span>
                <strong className="text-slate-900 font-mono text-xs">
                  {doc.extractedData.vitals}
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
