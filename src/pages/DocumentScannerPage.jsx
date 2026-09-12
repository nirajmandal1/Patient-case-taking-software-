import React, { useState, useRef, useEffect } from "react";
import { useDemo } from "../context/DemoContext";
import {
  UploadCloud,
  Camera,
  FileText,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Image as ImageIcon,
  X,
  Sparkles,
  Zap,
  Eye,
  AlertCircle
} from "lucide-react";
import { mockSampleDocuments } from "../data/mockData";

export const DocumentScannerPage = () => {
  const {
    setActiveTab,
    isDemoMode,
    nextDemoStep,
    activeScannedDoc,
    setActiveScannedDoc,
    patientData,
    setPatientData
  } = useDemo();

  const [scanState, setScanState] = useState("idle"); // "idle" | "scanning" | "done"
  const [progress, setProgress] = useState(0);
  const [scanStep, setScanStep] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedDocName, setSelectedDocName] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Process Document and trigger OCR animation
  const runOCR = (docData, previewUrl = null) => {
    setScanState("scanning");
    setProgress(0);
    setScanStep("Image Enhancement & Binarization");

    if (previewUrl) {
      setPreviewImage(previewUrl);
    }
    setSelectedDocName(docData.title || "Uploaded Document");

    setTimeout(() => {
      setProgress(35);
      setScanStep("Text Recognition (OCR Engine)");
    }, 400);

    setTimeout(() => {
      setProgress(68);
      setScanStep("Medical Entity Extraction (Rx / Lab values)");
    }, 900);

    setTimeout(() => {
      setProgress(90);
      setScanStep("Structuring & ABDM Formatting");
    }, 1400);

    setTimeout(() => {
      setProgress(100);
      setScanStep("Extraction Complete!");
      setScanState("done");

      // Save document into activeScannedDoc & patient's reports
      const finalDoc = {
        ...docData,
        previewUrl: previewUrl || docData.previewUrl || null,
        scannedAt: new Date().toLocaleTimeString()
      };
      setActiveScannedDoc(finalDoc);

      // Auto-attach extracted meds/vitals to patient data
      if (docData.extractedData?.medications?.length > 0) {
        const medNames = docData.extractedData.medications.map(
          (m) => `${m.name} ${m.dosage || ""}`.trim()
        );
        setPatientData((prev) => ({
          ...prev,
          caseData: {
            ...prev.caseData,
            currentMeds: Array.from(
              new Set([...(prev.caseData?.currentMeds || []), ...medNames])
            )
          }
        }));
      }
    }, 1900);
  };

  // Helper to extract realistic clinical data based on uploaded file
  const analyzeUploadedFile = (file, dataUrl) => {
    const name = file.name.toLowerCase();
    const isPdf = file.type.includes("pdf") || name.endsWith(".pdf");

    let docType = "Medical Prescription";
    let doctor = "Dr. Sharma, MD (General Medicine)";
    let hospital = "Govt. General Hospital / AIIMS OPD";
    let diagnosis = "OPD Clinical Consultation & Evaluation";
    let medications = [
      { name: "Tab. Amlodipine", dosage: "5 mg", frequency: "Once daily (Morning)", duration: "30 Days" },
      { name: "Tab. Telmisartan", dosage: "40 mg", frequency: "Once daily (Night)", duration: "30 Days" },
      { name: "Tab. Paracetamol", dosage: "650 mg", frequency: "SOS for body ache", duration: "As needed" }
    ];
    let investigations = ["ECG 12-Lead", "Serum Creatinine", "Lipid Profile"];
    let vitals = "BP: 142/90 mmHg, Pulse: 78 bpm, SpO2: 98%";
    let confidence = "98%";
    let problems = [
      "सीने में भारीपन व बेचैनी (Chest discomfort on brisk exertion)",
      "अनियंत्रित उच्च रक्तचाप (Elevated Blood Pressure: 148/92 mmHg)",
      "चलने या सीढ़ियाँ चढ़ने पर जल्दी सांस फूलना (Exertional breathlessness)"
    ];
    let relatedQueries = [
      { query: "तकलीफ कब से है? (Duration / Onset)", detail: "पिछले 10-15 दिनों से लगातार चलने पर महसूस हो रही है" },
      { query: "समस्या कब बढ़ती है? (Aggravating Factors)", detail: "सीढ़ियाँ चढ़ने या भारी काम करने पर सीने पर दबाव बढ़ता है" },
      { query: "क्या आराम करने से राहत मिलती है? (Relieving Factor)", detail: "बैठ जाने या 5 मिनट रुकने पर दर्द कम हो जाता है" }
    ];
    let doctorQueries = [
      "क्या ईसीजी के अलावा टीएमटी (TMT) या 2D-Echo जांच की आवश्यकता है?",
      "बीपी और सीने की तकलीफ के लिए खान-पान में क्या सावधानी बरतें?"
    ];

    if (name.includes("blood") || name.includes("lab") || name.includes("test")) {
      docType = "Laboratory Diagnostic Report";
      doctor = "Biochemistry & Pathology Dept";
      hospital = "District Central Diagnostics Lab";
      diagnosis = "Complete Blood Count & Metabolic Profile";
      medications = [];
      problems = [
        "उच्च रक्त शर्करा स्तर (Fasting Blood Sugar elevated: 142 mg/dL)",
        "कमजोरी व बार-बार प्यास लगना (Fatigue and increased thirst)",
        "कोलेस्ट्रॉल बॉर्डरलाइन हाई (Borderline high lipid markers)"
      ];
      relatedQueries = [
        { query: "शुगर की जांच कब कराई थी?", detail: "सुबह खाली पेट (Fasting 12 hours)" },
        { query: "क्या चक्कर या धुंधलापन महसूस होता है?", detail: "दोपहर में थकावट ज्यादा होती है" }
      ];
      doctorQueries = [
        "क्या HbA1c के बाद नियमित डायबिटीज़ दवा शुरू करनी होगी?",
        "डाइट प्लान में कार्बोहाइड्रेट्स और मीठे का क्या नियंत्रण रखें?"
      ];
      investigations = [
        "Hemoglobin: 14.2 g/dL (Normal: 13.0 - 17.0)",
        "Fasting Blood Glucose: 126 mg/dL (Borderline)",
        "HbA1c: 6.2% (Pre-diabetic range)",
        "Platelet Count: 245,000 /mcL"
      ];
      vitals = "Sample: Fasting Serum | Collected: 08:30 AM";
      confidence = "97%";
    } else if (name.includes("discharge") || name.includes("summary")) {
      docType = "Hospital Discharge Summary";
      doctor = "Dr. K. S. Verma (Chief Medical Officer)";
      hospital = "District Civil Hospital & Trauma Center";
      diagnosis = "Acute Febrile Illness & Observation - Discharged Stable";
      medications = [
        { name: "Tab. Cefixime", dosage: "200 mg", frequency: "Twice daily (BD)", duration: "5 Days" },
        { name: "Tab. Pantoprazole", dosage: "40 mg", frequency: "Once daily before food", duration: "10 Days" },
        { name: "Syp. Multivitamin", dosage: "10 ml", frequency: "Once daily at night", duration: "15 Days" }
      ];
      problems = [
        "वायरल बुखार व शरीर दर्द का इतिहास (Past history of acute febrile illness)",
        "रिकवरी के बाद की सामान्य कमजोरी (Post-illness recovery fatigue)"
      ];
      relatedQueries = [
        { query: "बुखार कितने दिन रहा?", detail: "3 दिन तेज बुखार रहा था, अब सामान्य है" },
        { query: "भूख और पाचन की स्थिति?", detail: "भूख सामान्य हो रही है" }
      ];
      doctorQueries = [
        "क्या रूटीन जांच में कोई फॉलो-अप ब्लड टेस्ट कराना है?",
        "सामान्य दिनचर्या और काम पर कब से लौट सकते हैं?"
      ];
      investigations = ["Chest X-Ray PA View (Clear)", "Urine Routine (Normal)"];
      vitals = "BP: 122/80 mmHg, Pulse: 72 bpm, Afebrile";
      confidence = "96%";
    }

    return {
      id: `upload-${Date.now()}`,
      title: file.name,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      type: docType,
      isPdf: isPdf,
      confidence: confidence,
      doctor: doctor,
      hospital: hospital,
      previewUrl: dataUrl,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      extractedData: {
        diagnosis: diagnosis,
        problems: problems,
        relatedQueries: relatedQueries,
        doctorQueries: doctorQueries,
        medications: medications,
        investigations: investigations,
        vitals: vitals
      }
    };
  };

  // Handle Real File Upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const customDoc = analyzeUploadedFile(file, dataUrl);
      runOCR(customDoc, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag and Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const customDoc = analyzeUploadedFile(file, dataUrl);
        runOCR(customDoc, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera Scanner Functions
  const startCamera = async () => {
    setCameraError("");
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera access was denied or not supported on this device.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");

    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);

    const docFromCamera = {
      id: `cam-${Date.now()}`,
      title: "Camera Capture Slip",
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      type: "Kiosk Camera Scan",
      confidence: "96%",
      doctor: "Dr. K. S. Verma (MD)",
      hospital: "District Civil Hospital",
      previewUrl: dataUrl,
      extractedData: {
        diagnosis: "Essential Hypertension & Routine Checkup",
        medications: [
          {
            name: "Tab. Amlodipine",
            dosage: "5 mg",
            frequency: "Morning",
            duration: "30 Days"
          },
          {
            name: "Tab. Telmisartan",
            dosage: "40 mg",
            frequency: "Night",
            duration: "30 Days"
          }
        ],
        investigations: ["Lipid Profile", "ECG"],
        vitals: "BP: 140/90 mmHg, Pulse: 76 bpm"
      }
    };
    runOCR(docFromCamera, dataUrl);
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf"
        className="hidden"
      />

      {/* Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl font-bold text-xs">
            MedSync
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900">Medical Document OCR Scanner</h1>
            <p className="text-[11px] text-slate-500">
              Digitize old prescriptions, discharge summaries & lab test reports
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Step 3 of 5</span>
          <button
            onClick={() => setActiveTab("summary")}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
          >
            Skip to Summary →
          </button>
        </div>
      </div>

      {/* Main Grid: Upload Area vs OCR Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Upload & Camera Controls */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-black text-slate-900">Upload or Scan Document</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an image/PDF from your device or use the live camera.
            </p>
          </div>

          {/* Drag and Drop Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-blue-300 hover:border-blue-600 rounded-3xl p-8 bg-blue-50/40 hover:bg-blue-50/80 cursor-pointer transition text-center space-y-3 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-100 group-hover:bg-blue-200 text-blue-600 flex items-center justify-center mx-auto transition shadow-xs">
              <UploadCloud size={32} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">
                Click to browse or drag file here
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Supports JPG, PNG, WEBP, PDF (Max 15MB)
              </p>
            </div>
            <span className="inline-block bg-blue-600 text-white text-[11px] font-extrabold px-4 py-1.5 rounded-xl shadow-xs">
              Choose File from Device
            </span>
          </div>

          {/* Camera Scanner Button */}
          <button
            onClick={startCamera}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer text-xs"
          >
            <Camera size={18} />
            <span>Open Kiosk Camera Scanner (कैमरा से फोटो लें)</span>
          </button>

          {/* Sample Presets for Instant Testing */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 block tracking-wider">
              Or Click a Sample Document to Test Instantly:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => runOCR(mockSampleDocuments[0])}
                className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-2xl p-3 text-center transition cursor-pointer"
              >
                <FileText size={18} className="text-blue-600 mx-auto mb-1" />
                <span className="text-[11px] font-extrabold text-slate-800 block">
                  Prescription
                </span>
                <span className="text-[9px] text-slate-400">Dr. Verma</span>
              </button>

              <button
                onClick={() => runOCR(mockSampleDocuments[1])}
                className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-2xl p-3 text-center transition cursor-pointer"
              >
                <FileText size={18} className="text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-extrabold text-slate-800 block">
                  Blood Report
                </span>
                <span className="text-[9px] text-slate-400">Hb & Glucose</span>
              </button>

              <button
                onClick={() => runOCR(mockSampleDocuments[2])}
                className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-2xl p-3 text-center transition cursor-pointer"
              >
                <FileText size={18} className="text-indigo-600 mx-auto mb-1" />
                <span className="text-[11px] font-extrabold text-slate-800 block">
                  Discharge
                </span>
                <span className="text-[9px] text-slate-400">Hospital Slip</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Live Scanning & Progress */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5">
          {/* IDLE STATE */}
          {scanState === "idle" && (
            <div className="space-y-3 max-w-xs text-slate-400">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <FileText size={36} />
              </div>
              <h3 className="font-extrabold text-slate-700 text-sm">
                No Document Scanned Yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload a photo of your doctor's slip or select one of the sample presets to test the OCR engine.
              </p>
            </div>
          )}

          {/* SCANNING STATE */}
          {scanState === "scanning" && (
            <div className="space-y-5 w-full">
              {/* Circular Gauge */}
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#2563eb"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-blue-700">{progress}%</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">OCR Progress</span>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-base">{selectedDocName}</h4>
                <p className="text-xs text-blue-600 font-bold mt-0.5">{scanStep}</p>
              </div>

              {/* Step Checklist */}
              <div className="space-y-2 text-xs text-left max-w-sm mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {[
                  "Image Enhancement & Binarization",
                  "Text Recognition (OCR Engine)",
                  "Medical Entity Extraction (Rx / Lab values)",
                  "Structuring & ABDM Formatting"
                ].map((stepName, i) => {
                  const isDone = progress >= (i + 1) * 25;
                  const isCurrent = !isDone && progress >= i * 25;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-2 p-1.5 rounded-lg font-medium transition ${
                        isDone
                          ? "text-emerald-700 font-bold"
                          : isCurrent
                          ? "text-blue-700 font-extrabold bg-blue-50"
                          : "text-slate-400"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw size={15} className="text-blue-600 animate-spin shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0" />
                      )}
                      <span>{stepName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DONE STATE */}
          {scanState === "done" && (
            <div className="space-y-4 w-full">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-300">
                  OCR Complete • 96% Accuracy
                </span>
                <h3 className="font-black text-slate-900 text-lg mt-1">
                  Extracted from: {selectedDocName}
                </h3>
                <p className="text-xs text-slate-500">
                  Prescriptions, lab values and doctor advice digitized successfully.
                </p>
              </div>

              {/* Preview Thumbnail if available */}
              {previewImage && (
                <div className="max-w-[220px] mx-auto rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xs bg-slate-50 p-2">
                  {previewImage.startsWith("data:application/pdf") || selectedDocName.toLowerCase().endsWith(".pdf") ? (
                    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                      <FileText size={24} className="text-red-600 shrink-0" />
                      <div className="text-left truncate">
                        <span className="font-extrabold block truncate">{selectedDocName}</span>
                        <span className="text-[10px] text-red-600 font-bold uppercase">PDF Document</span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={previewImage}
                      alt="Document preview"
                      className="w-full max-h-32 object-contain rounded-xl"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                <button
                  onClick={() => setActiveTab("ocr-results")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Eye size={15} />
                  <span>View Extracted Entities (परिणाम देखें)</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => setActiveTab("summary")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <span>Proceed to Case Sheet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CAMERA POPUP MODAL */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <Camera size={20} className="text-blue-600" />
                <h3 className="font-black text-slate-900 text-base">
                  Kiosk Document Camera Scanner
                </h3>
              </div>
              <button
                onClick={closeCamera}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {cameraError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs space-y-2">
                <p className="font-bold">{cameraError}</p>
                <p>You can still upload a photo directly using the file picker.</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Viewfinder Overlay Grid */}
                <div className="absolute inset-4 border-2 border-dashed border-white/70 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                  <span className="text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded self-start font-mono">
                    Align prescription inside box
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={closeCamera}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                disabled={!!cameraError}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <Camera size={16} /> Capture & Run OCR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
