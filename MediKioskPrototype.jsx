import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  User,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Presentation,
  Layers,
  Cpu,
  Zap,
  Lock,
  Globe,
  Database,
  Activity,
  Check,
  AlertOctagon,
  Sparkles,
  HelpCircle,
  FileCheck
} from "lucide-react";

export default function MediKioskPrototype() {
  const [activeTab, setActiveTab] = useState("kiosk"); // "kiosk", "doctor", or "presentation"
  const [currentSlide, setCurrentSlide] = useState(1);
  const [language, setLanguage] = useState("Hindi");
  const [isListening, setIsListening] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedFiles, setScannedFiles] = useState([]);
  const chatEndRef = useRef(null);

  // Presentation slides content
  const totalSlides = 10;

  // Chat messages state
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Namaste! Main MediKiosk AI assistant hoon. Doctor se milne se pehle main aapki history note karunga. Aaj aapko kya takleef hai?",
      time: "10:00 AM",
    },
  ]);

  // Structured summary for doctor
  const [clinicalCase, setClinicalCase] = useState({
    patientName: "Ramesh Sharma",
    ageGender: "48 / Male",
    uhid: "ABHA-9821-4402",
    redFlagAlert: null,
    chiefComplaint: "Severe chest discomfort since 2 hours",
    hpi: "Onset 2 hours ago while resting. Patient describes heavy pressure in the mid-chest radiating to left arm. Accompanied by mild shortness of breath and sweating.",
    pastHistory: "Hypertension (diagnosed 4 years ago, irregular medication)",
    currentMeds: "Amlodipine 5mg (self-discontinued last week)",
    allergies: "NKDA (No Known Drug Allergies)",
    extractedReports: [
      { date: "15 Jan 2026", test: "ECG Normal, BP 150/90 mmHg", source: "District Hospital OPD" },
    ],
  });

  // Quick suggestions for quick touch input on kiosk
  const quickSuggestions = [
    "Mujhe seene mein dard hai",
    "Pichle 3 din se bukhar hai",
    "Pet mein tej dard aur vomiting",
    "Blood pressure check karwana hai",
  ];

  useEffect(() => {
    if (activeTab === "kiosk") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isProcessing, activeTab]);

  // Browser Speech-to-Text
  const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === "Hindi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputMessage(transcript);
    };

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
    }
  };

  // Simulated AI Adaptive Response Logic for Prototype Demo
  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { sender: "patient", text, time: userTime }]);
    setInputMessage("");
    setIsProcessing(true);

    setTimeout(() => {
      let aiReply = "Theek hai, kya aapko pehle se BP, Sugar ya koi purani bimari hai?";
      const lower = text.toLowerCase();

      // Clinical follow-up simulation
      if (lower.includes("chest") || lower.includes("dard") || lower.includes("seene")) {
        aiReply = "Yeh dard kab se shuru hua? Kya yeh dard baayein haath (left arm) ya gale ki taraf fail raha hai?";
        setClinicalCase((prev) => ({
          ...prev,
          redFlagAlert: "CRITICAL: Acute Chest Discomfort + Radiation to Left Arm. High priority triage required.",
          chiefComplaint: text,
        }));
      } else if (lower.includes("ghante") || lower.includes("hours") || lower.includes("din") || lower.includes("subah")) {
        aiReply = "Samajh gaya. Kya dard ke saath pasina (sweating) ya saans lene mein dikkat ho rahi hai?";
      } else if (lower.includes("bp") || lower.includes("dawa") || lower.includes("sugar")) {
        aiReply = "Note kar liya hai. Agar aapke paas koi purani parchi ya test report hai toh screen ke neeche 'Scan' button se upload karein.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsProcessing(false);
    }, 1200);
  };

  // Simulate Document Scanning (OCR Extraction)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScannedFiles((prev) => [...prev, file.name]);
      setClinicalCase((prev) => ({
        ...prev,
        extractedReports: [
          ...prev.extractedReports,
          {
            date: "Today (Scanned)",
            test: `Extracted from ${file.name}: Tab. Telmisartan 40mg prescribed, HbA1c 6.8%`,
            source: "Prescription OCR Pipeline",
          },
        ],
      }));
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Aapka document "${file.name}" scan ho gaya hai. Doctor ke liye dawa aur report extract kar li gayi hai.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  // Slide navigation keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== "presentation") return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Bar / Role Switcher */}
      <nav className="bg-white border-b px-6 py-3 flex flex-wrap justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-600 p-2 rounded-xl text-white">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-teal-900 leading-tight">MediKiosk</h1>
            <p className="text-xs text-slate-500">AI Clinical Intake & Triage System</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
          <button
            onClick={() => setActiveTab("presentation")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "presentation"
                ? "bg-teal-700 text-white shadow-sm"
                : "text-slate-600 hover:text-teal-700"
            }`}
          >
            <Presentation size={16} /> Pitch Deck (10 Slides)
          </button>
          <button
            onClick={() => setActiveTab("kiosk")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "kiosk"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-teal-700"
            }`}
          >
            <User size={16} /> 1. Patient Kiosk Screen
          </button>
          <button
            onClick={() => setActiveTab("doctor")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "doctor"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-teal-700"
            }`}
          >
            <Stethoscope size={16} /> 2. Doctor Dashboard
            {clinicalCase.redFlagAlert && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                !
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
        {activeTab === "presentation" ? (
          /* ==================== PITCH DECK PRESENTATION ==================== */
          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden flex flex-col min-h-[80vh] justify-between">
            {/* Slide Banner Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="bg-teal-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  SLIDE {currentSlide} OF {totalSlides}
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">Problem Statement ID: 26047 | Theme: Healthcare / AI</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))}
                  disabled={currentSlide === 1}
                  className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-white transition"
                  title="Previous Slide (Left Arrow)"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-mono text-slate-300 px-2">{currentSlide}/{totalSlides}</span>
                <button
                  onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))}
                  disabled={currentSlide === totalSlides}
                  className="p-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-30 rounded-lg text-white transition"
                  title="Next Slide (Right Arrow / Space)"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Slide Body Content */}
            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center bg-slate-50/40">
              {/* SLIDE 1 */}
              {currentSlide === 1 && (
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                  <div className="inline-flex bg-teal-100 text-teal-800 p-4 rounded-3xl mb-2">
                    <Stethoscope size={48} className="text-teal-700" />
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-teal-950 tracking-tight">MediKiosk</h1>
                  <h2 className="text-2xl font-bold text-slate-700">AI-Powered Patient Case-Taking Software</h2>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <span className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                      Problem ID: 26047
                    </span>
                    <span className="bg-teal-50 text-teal-700 border border-teal-200 px-4 py-1.5 rounded-full text-sm font-semibold">
                      Theme: Healthcare / AI / Digital Health
                    </span>
                  </div>
                  <blockquote className="text-xl italic font-medium text-teal-800 bg-teal-50/80 p-6 rounded-2xl border border-teal-100 mt-6">
                    “Right History. Less Waiting. Better Consultation.”
                  </blockquote>
                </div>
              )}

              {/* SLIDE 2 */}
              {currentSlide === 2 && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div className="border-b pb-4">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">Slide 2 — Problem Statement</span>
                    <h2 className="text-3xl font-extrabold text-slate-900">What is the Problem?</h2>
                  </div>
                  <p className="text-lg text-slate-700">
                    Indian government hospitals handle thousands of OPD patients every day. Doctors often have only a few minutes per patient to perform multiple critical tasks:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                    {["Take complete medical history", "Examine the patient", "Review previous reports", "Diagnose the problem", "Prescribe treatment", "Counsel the patient"].map((task, i) => (
                      <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs">
                        <CheckCircle2 size={16} className="text-teal-600 shrink-0" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 pt-2">Major Issues:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Incomplete patient history due to time constraints",
                      "Repeated questioning across different OPD visits",
                      "Paper-based medical records lost or damaged",
                      "Unorganized previous diagnostic reports",
                      "Language & literacy barriers in communication",
                      "Increased documentation workload on doctors",
                      "High risk of missing critical red-flag symptoms"
                    ].map((issue, idx) => (
                      <div key={idx} className="bg-red-50/60 border border-red-100 p-3 rounded-xl flex items-start gap-2.5 text-sm text-red-900">
                        <AlertOctagon size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLIDE 3 */}
              {currentSlide === 3 && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div className="border-b pb-4">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">Slide 3 — Our Solution</span>
                    <h2 className="text-3xl font-extrabold text-slate-900">Introducing MediKiosk</h2>
                    <p className="text-slate-600 text-sm mt-1">
                      An <strong>AI-powered patient-facing clinical intake platform</strong> that collects medical history <strong>before the doctor consultation</strong>.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: <Mic className="text-teal-600" size={24} />, title: "Voice Conversation", desc: "Speak in native language" },
                      { icon: <User className="text-teal-600" size={24} />, title: "Touchscreen UI", desc: "Easy quick tap buttons" },
                      { icon: <FileText className="text-teal-600" size={24} />, title: "Medical OCR", desc: "Scan reports & rx" },
                      { icon: <Cpu className="text-teal-600" size={24} />, title: "AI History Structuring", desc: "CC, HPI, Meds, Allergies" },
                      { icon: <AlertTriangle className="text-red-500" size={24} />, title: "Red-Flag Detection", desc: "Priority triage alerts" },
                      { icon: <CheckCircle2 className="text-emerald-600" size={24} />, title: "Doctor Summary", desc: "1-page instant view" },
                      { icon: <ShieldCheck className="text-teal-600" size={24} />, title: "Consent & Privacy", desc: "ABDM compliant" },
                      { icon: <Database className="text-teal-600" size={24} />, title: "ABDM/HIS Integration", desc: "Seamless workflow" },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-500 transition">
                        <div className="bg-slate-50 p-2.5 rounded-xl w-fit mb-2">{item.icon}</div>
                        <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-teal-700 text-white p-4 rounded-2xl font-semibold text-center flex items-center justify-center gap-3 shadow">
                    <Sparkles size={20} />
                    <span>Goal: Reduce documentation workload and give doctors a structured patient history within seconds.</span>
                  </div>
                </div>
              )}

              {/* SLIDE 4 */}
              {currentSlide === 4 && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div className="border-b pb-4">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">Slide 4 — How MediKiosk Works</span>
                    <h2 className="text-3xl font-extrabold text-slate-900">Step-by-Step Patient Journey</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center items-center">
                    {[
                      { step: "1", title: "Identify", desc: "Scan ABHA ID / Language" },
                      { step: "2", title: "Consent", desc: "ABDM privacy verification" },
                      { step: "3", title: "Converse", desc: "Voice or Touch AI intake" },
                      { step: "4", title: "Scan", desc: "Prescription OCR scan" },
                      { step: "5", title: "Analyze", desc: "Clinical entity extraction" },
                      { step: "6", title: "Summarize", desc: "Concise summary generated" },
                      { step: "7", title: "Consult", desc: "Doctor reviews & confirms" },
                    ].map((s, idx) => (
                      <React.Fragment key={idx}>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs h-full flex flex-col justify-center items-center">
                          <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center mb-1">
                            {s.step}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900">{s.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-1 leading-tight">{s.desc}</p>
                        </div>
                        {idx < 6 && (
                          <div className="hidden md:flex justify-center text-teal-600">
                            <ArrowRight size={14} />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-600 text-center border">
                    🔒 Integrated with hospital queue management & EMR/HIS systems.
                  </div>
                </div>
              )}

              {/* SLIDE 5 */}
              {currentSlide === 5 && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div className="border-b pb-4">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">Slide 5 — AI Conversational Engine</span>
                    <h2 className="text-3xl font-extrabold text-slate-900">Intelligent Clinical Interview</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="text-teal-600" size={18} /> Adaptive Questioning Example
                      </h3>
                      <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl text-xs text-teal-900">
                        <strong>Patient says:</strong> “Mujhe chest mein pain ho raha hai.”
                      </div>
                      <p className="text-xs font-bold text-slate-700">AI automatically follows up with clinical accuracy:</p>
                      <ul className="text-xs space-y-1.5 text-slate-600 pl-4 list-disc">
                        <li>When did the pain start? (Onset)</li>
                        <li>Where exactly is the pain? (Location)</li>
                        <li>What does the pain feel like? (Character)</li>
                        <li>Does it spread to another area like left arm/jaw? (Radiation)</li>
                        <li>Are there associated symptoms like sweating or breathlessness?</li>
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Mic className="text-teal-600" size={18} /> Dual Input: Voice + Touch
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Designed specifically for diverse Indian OPD demographics to overcome literacy and technology barriers.
                      </p>
                      <div className="space-y-2 text-xs">
                        {["Elderly patients who prefer speaking", "Low-literacy users", "First-time hospital visitors", "Patients uncomfortable with typing"].map((grp, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                            <Check size={14} className="text-teal-600" /> {grp}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 6 */}
              {currentSlide === 6 && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div className="border-b pb-4">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">Slide 6 — Medical Document Intelligence</span>
                    <h2 className="text-3xl font-extrabold text-slate-900">From Paper Reports to Digital Records</h2>
                  </div>
                  <div className="bg-teal-900 text-white p-5 rounded-2xl text-center font-mono text-xs md:text-sm flex flex-wrap justify-between items-center gap-2 shadow">
                    <span>Document</span> <ArrowRight size={14} /> <span>OCR</span> <ArrowRight size={14} /> <span>Text</span> <ArrowRight size={14} /> <span>Medical Entity Extraction</span> <ArrowRight size={14} /> <span>Structured Timeline</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-sm text-slate-900">Scannable Documents</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {["Prescriptions", "Blood Test Reports", "Discharge Summaries", "Investigation Reports", "Past Surgery Notes"].map((doc, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5">
                            <FileText size={14} className="text-teal-600" /> {doc}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-sm text-slate-900">Extracted Clinical Entities</h4>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {["Medicines & Dosages", "Diagnoses", "Lab Values (HbA1c, BP)", "Procedures", "Previous Surgeries", "Prescription Dates"].map((ent, i) => (
                          <span key={i} className="bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1.5 rounded-lg font-medium">
                            {ent}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 7 */}
              {currentSlide === 7 && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div className="border-b pb-4">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">Slide 7 — Doctor Dashboard & Red Flags</span>
                    <h2 className="text-3xl font-extrabold text-slate-900">Doctor-Ready Clinical Summary</h2>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex flex-wrap justify-around text-center gap-2">
                    <span>Chief Complaint</span> &bull; <span>HPI</span> &bull; <span>Past History</span> &bull; <span>Meds & Allergies</span> &bull; <span>Family/Personal</span> &bull; <span>ROS</span> &bull; <span>Investigations</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2 text-emerald-950">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-600" /> Doctor Remains in Control
                      </h4>
                      <p className="text-xs leading-relaxed">
                        The AI-generated summary is 100% <strong>Editable, Verifiable, and Acceptable/Rejectable</strong> by the treating doctor.
                      </p>
                      <div className="bg-white p-3 rounded-xl border border-emerald-300 text-xs font-bold text-emerald-900 text-center">
                        AI does NOT make the final diagnosis.
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-5 rounded-2xl space-y-2 text-red-950">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-600" /> Red-Flag Triage Detection
                      </h4>
                      <p className="text-xs leading-relaxed">
                        Identifies urgent symptoms during intake and alerts triage staff instantly.
                      </p>
                      <div className="bg-white p-3 rounded-xl border border-red-300 text-xs text-red-900">
                        <strong>Example:</strong> Severe chest pressure + left arm pain → <span className="text-red-600 font-bold uppercase">Priority Assessment Alert</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 8 */}
              {currentSlide === 8 && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div className="border-b pb-4">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">Slide 8 — Technology Stack</span>
                    <h2 className="text-3xl font-extrabold text-slate-900">Proposed Technology Architecture</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { layer: "Frontend", tech: "React / Flutter, Touch Kiosk UI, Multilingual support" },
                      { layer: "Backend", tech: "Python, FastAPI / Flask, High-throughput REST APIs" },
                      { layer: "AI & NLP", tech: "Indian Speech-to-Text, LLM Intake Engine, Medical NER & OCR" },
                      { layer: "Database", tech: "PostgreSQL / MySQL for structured clinical logs" },
                      { layer: "Integration", tech: "ABDM, FHIR Standards, Hospital HIS/EMR connectors" },
                      { layer: "Security", tech: "AES-256 Encryption, ABDM Consent, Role-based Access" },
                    ].map((stk, i) => (
                      <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wide">{stk.layer}</span>
                        <p className="text-xs font-semibold text-slate-800 mt-1">{stk.tech}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLIDE 9 */}
              {currentSlide === 9 && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div className="border-b pb-4">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">Slide 9 — Innovation & Impact</span>
                    <h2 className="text-3xl font-extrabold text-slate-900">What Makes MediKiosk Different?</h2>
                  </div>
                  <div className="bg-white rounded-2xl border overflow-hidden shadow-2xs text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b text-slate-700 font-bold">
                          <th className="p-3">Existing System</th>
                          <th className="p-3 bg-teal-50 text-teal-900">MediKiosk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-slate-600">
                        {[
                          ["Basic demographic registration", "Full clinical history collection"],
                          ["Manual document checking", "AI-powered OCR prescription scanning"],
                          ["Fixed form inputs", "Adaptive AI questioning engine"],
                          ["Text-heavy complex UI", "Voice + Touch multimodal input"],
                          ["Separate paper records", "Digital chronological medical timeline"],
                          ["Doctor spends time taking history", "Doctor reviews pre-structured history"],
                        ].map(([oldSys, newSys], i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-3 text-slate-500">{oldSys}</td>
                            <td className="p-3 bg-teal-50/50 font-medium text-teal-900">{newSys}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SLIDE 10 */}
              {currentSlide === 10 && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div className="border-b pb-4">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">Slide 10 — Future Scope & Conclusion</span>
                    <h2 className="text-3xl font-extrabold text-slate-900">Future Roadmap & Conclusion</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {[
                      { p: "Phase 1", t: "Hospital Pilot", d: "Deploy in selected district hospitals" },
                      { p: "Phase 2", t: "Language Scaling", d: "Expand to 12+ Indian regional languages" },
                      { p: "Phase 3", t: "AYUSH Modules", d: "Integrate Dashavidha Pariksha intake" },
                      { p: "Phase 4", t: "ABDM Interoperability", d: "Full FHIR data exchange ecosystem" },
                    ].map((phase, i) => (
                      <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-teal-600 uppercase">{phase.p}</span>
                        <h4 className="font-bold text-slate-900">{phase.t}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">{phase.d}</p>
                      </div>
                    ))}
                  </div>
                  <blockquote className="text-center text-lg italic font-semibold text-teal-900 bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-200 mt-4">
                    “Let AI collect and organize the history, so doctors can spend more time caring for the patient.”
                  </blockquote>
                </div>
              )}
            </div>

            {/* Slide Navigation Footer */}
            <div className="bg-white border-t px-6 py-4 flex justify-between items-center text-xs text-slate-500">
              <span>Use <strong>Left/Right Arrows</strong> or buttons to navigate slides</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("kiosk")}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition"
                >
                  <span>Launch Live Patient Kiosk</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === "kiosk" ? (
          /* ==================== PATIENT KIOSK SCREEN ==================== */
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col h-[82vh]">
            {/* Kiosk Header */}
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-4 flex justify-between items-center">
              <div>
                <span className="text-xs font-medium text-teal-200 uppercase tracking-wide">
                  OPD Intake Kiosk #03
                </span>
                <h2 className="text-lg font-bold">Patient Case Interview</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-teal-900/60 px-3 py-1.5 rounded-lg border border-teal-500/30">
                  Language: <strong>{language}</strong>
                </span>
                <button
                  onClick={() => setLanguage(language === "Hindi" ? "English" : "Hindi")}
                  className="text-xs bg-white text-teal-800 px-3 py-1.5 rounded-lg font-medium hover:bg-teal-50"
                >
                  Switch Language
                </button>
              </div>
            </div>

            {/* Chat Conversation */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              <div className="text-center my-2">
                <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full flex items-center inline-flex gap-1">
                  <ShieldCheck size={14} className="text-teal-600" /> ABDM Consent Verified &bull; Voice + Touch Enabled
                </span>
              </div>

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xl p-4 rounded-2xl shadow-sm text-base ${
                      msg.sender === "patient"
                        ? "bg-teal-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[10px] block text-right mt-1 ${
                        msg.sender === "patient" ? "text-teal-200" : "text-slate-400"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-slate-500 italic p-2">
                  <RefreshCw className="animate-spin text-teal-600" size={16} /> MediKiosk AI sooch raha hai...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Touch Suggestions (For low-literacy / quick tap) */}
            <div className="p-3 bg-slate-100 border-t flex gap-2 overflow-x-auto">
              <span className="text-xs font-semibold text-slate-500 py-1 flex items-center">Quick Tap:</span>
              {quickSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion)}
                  className="whitespace-nowrap text-xs bg-white hover:bg-teal-50 hover:text-teal-700 border border-slate-300 px-3 py-1.5 rounded-full transition shadow-2xs"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Kiosk Controls: Voice, Text & Document Scan */}
            <div className="p-4 bg-white border-t flex items-center gap-3">
              {/* Document Scan / OCR simulation */}
              <label
                className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 p-3.5 rounded-xl flex items-center justify-center border border-slate-300 transition"
                title="Scan Prescription / Report"
              >
                <UploadCloud size={22} className="text-teal-600" />
                <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,.pdf" />
              </label>

              {/* Speech-to-Text Button */}
              <button
                onClick={toggleSpeechRecognition}
                className={`p-3.5 rounded-xl text-white transition flex items-center justify-center shadow ${
                  isListening ? "bg-red-500 animate-pulse ring-4 ring-red-200" : "bg-teal-600 hover:bg-teal-700"
                }`}
                title="Voice Input"
              >
                {isListening ? <MicOff size={22} /> : <Mic size={22} />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={isListening ? "Listening... bolte rahiye..." : "Apni pareshani yahan likhein ya mic dabakar bolein..."}
                className="flex-1 bg-slate-50 border border-slate-300 text-slate-800 text-base rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-1 shadow transition"
              >
                <span>Bhejo</span>
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          /* ==================== DOCTOR DASHBOARD SCREEN ==================== */
          <div className="space-y-6">
            {/* Patient Bar */}
            <div className="bg-white p-5 rounded-2xl border shadow-sm flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">{clinicalCase.patientName}</h2>
                  <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-semibold">
                    {clinicalCase.ageGender}
                  </span>
                  <span className="bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-md font-semibold">
                    UHID: {clinicalCase.uhid}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                  <Clock size={14} /> Intake completed 4 mins ago via Kiosk #03
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert("Case rejected. Returning to OPD queue.")}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition"
                >
                  Discard / Retake
                </button>
                <button
                  onClick={() => alert("Case accepted and appended to Hospital HIS!")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-sm font-medium rounded-xl flex items-center gap-2 shadow transition"
                >
                  <CheckCircle2 size={16} /> Confirm & Save to HIS
                </button>
              </div>
            </div>

            {/* Red Flag Alert Banner */}
            {clinicalCase.redFlagAlert && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3 text-red-800 shadow-2xs animate-pulse">
                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={22} />
                <div>
                  <h4 className="font-bold text-sm">PRIORITY CLINICAL TRIAGE ALERT</h4>
                  <p className="text-sm">{clinicalCase.redFlagAlert}</p>
                </div>
              </div>
            )}

            {/* Clinical Intake Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Chief Complaint */}
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-800 text-sm tracking-wide">CHIEF COMPLAINT (CC)</h3>
                  <span className="text-xs text-slate-400">Editable</span>
                </div>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  rows={2}
                  defaultValue={clinicalCase.chiefComplaint}
                />
              </div>

              {/* Past History */}
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-800 text-sm tracking-wide">PAST MEDICAL & SURGICAL</h3>
                  <span className="text-xs text-slate-400">Editable</span>
                </div>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  rows={2}
                  defaultValue={clinicalCase.pastHistory}
                />
              </div>

              {/* HPI (Full Width) */}
              <div className="bg-white p-5 rounded-2xl border shadow-sm md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-800 text-sm tracking-wide">HISTORY OF PRESENT ILLNESS (HPI)</h3>
                  <span className="text-xs text-teal-600 font-medium">AI Synthesized</span>
                </div>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none leading-relaxed"
                  rows={3}
                  defaultValue={clinicalCase.hpi}
                />
              </div>

              {/* Current Meds & Allergies */}
              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide mb-2">CURRENT MEDICATIONS</h3>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  defaultValue={clinicalCase.currentMeds}
                />
              </div>

              <div className="bg-white p-5 rounded-2xl border shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide mb-2">KNOWN ALLERGIES</h3>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  defaultValue={clinicalCase.allergies}
                />
              </div>
            </div>

            {/* Medical Document Timeline (OCR Extracted) */}
            <div className="bg-white p-5 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm tracking-wide mb-3 flex items-center gap-2">
                <FileText size={18} className="text-teal-600" />
                DIGITAL MEDICAL TIMELINE (EXTRACTED VIA OCR)
              </h3>
              <div className="space-y-3">
                {clinicalCase.extractedReports.map((report, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-md shrink-0">
                      {report.date}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{report.test}</p>
                      <span className="text-xs text-slate-400">Source: {report.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
