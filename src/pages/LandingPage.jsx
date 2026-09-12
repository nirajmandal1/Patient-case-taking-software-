import React from "react";
import { useDemo } from "../context/DemoContext";
import {
  Stethoscope,
  Mic,
  FileText,
  ShieldCheck,
  Play,
  ArrowRight,
  Clock,
  Globe,
  AlertOctagon,
  CheckCircle2,
  Upload,
  Cpu,
  Lock
} from "lucide-react";

export const LandingPage = () => {
  const { setActiveTab, startDemoMode } = useDemo();

  return (
    <div className="space-y-16 py-6">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-50/70 via-white to-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-900 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs">
            <SparklesIcon /> AI-Powered Clinical Intake Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            AI-Powered Patient <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600">
              Case-Taking Platform
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            MediKiosk collects patient history, digitizes medical documents, and prepares a structured clinical summary before the doctor consultation.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab("kiosk")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-md transition transform hover:-translate-y-0.5"
            >
              <span>Start Patient Assessment</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => setActiveTab("doctor")}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-2xs transition"
            >
              <Stethoscope size={18} className="text-blue-600" />
              <span>View Doctor Dashboard</span>
            </button>
            <button
              onClick={startDemoMode}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-black px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-md transition"
            >
              <Play size={18} fill="currentColor" />
              <span>🚀 Launch Pitch Demo</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-semibold text-slate-600">
            <div className="flex items-center justify-center gap-1.5 p-2 bg-white/60 rounded-xl border border-slate-200/60">
              <Globe size={16} className="text-blue-600" /> Multilingual
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 bg-white/60 rounded-xl border border-slate-200/60">
              <Mic size={16} className="text-blue-600" /> Voice + Touch
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 bg-white/60 rounded-xl border border-slate-200/60">
              <Cpu size={16} className="text-blue-600" /> AI-Assisted
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 bg-white/60 rounded-xl border border-slate-200/60">
              <CheckCircle2 size={16} className="text-blue-600" /> Doctor Verified
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 bg-white/60 rounded-xl border border-slate-200/60 col-span-2 sm:col-span-1">
              <ShieldCheck size={16} className="text-blue-600" /> Privacy First
            </div>
          </div>
        </div>

        {/* Realistic Hero Visual Kiosk Illustration */}
        <div className="mt-10 max-w-5xl mx-auto bg-slate-900 rounded-3xl p-4 md:p-6 shadow-2xl border border-slate-800 text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-xs text-slate-400 font-mono ml-2">MediKiosk OPD Intake Unit #03</span>
            </div>
            <span className="text-xs bg-blue-900 text-blue-300 font-bold px-3 py-1 rounded-full border border-blue-700">
              LIVE KIOSK PREVIEW
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visual 1: Voice & Intake */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                <Mic size={16} /> 1. Voice Interaction
              </div>
              <p className="text-xs text-slate-300">"Mujhe 2 din se bukhar aur chest mein dard hai."</p>
              <div className="bg-blue-950/80 border border-blue-800 p-2.5 rounded-xl text-[11px] text-blue-200">
                🎙️ AI: "Dard kab se ho raha hai? Baayein haath mein fail raha hai?"
              </div>
            </div>

            {/* Visual 2: Document OCR */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                <FileText size={16} /> 2. Medical OCR Scanning
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                <span>Blood_Report_Aug2026.pdf</span>
                <span className="text-emerald-400 font-mono text-[10px]">96% OCR</span>
              </div>
              <p className="text-[11px] text-slate-400">Extracted: Hb 14.2 g/dL, BP 150/96, Tab. Amlodipine 5mg</p>
            </div>

            {/* Visual 3: Doctor Dashboard */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                <Stethoscope size={16} /> 3. Doctor Summary
              </div>
              <div className="bg-red-950/60 border border-red-800 p-2 rounded-lg text-[10px] text-red-300 font-bold">
                🚨 PRIORITY: Acute Chest Discomfort
              </div>
              <p className="text-[11px] text-slate-300">1-Page Structured History ready on doctor screen</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">The Clinical Challenge</span>
          <h2 className="text-3xl font-extrabold text-slate-900">The OPD History-Taking Challenge</h2>
          <p className="text-slate-600 text-sm">
            High patient loads in public hospitals compress doctor consultation time.
          </p>
        </div>

        {/* Process Flow Visualization */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-wrap justify-between items-center text-center gap-2">
          {["Patient Queue", "Limited Doctor Time", "Manual History", "Paper Records", "Delayed Consultation"].map((step, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold">
                {step}
              </div>
              {idx < arr.length - 1 && <ArrowRight size={16} className="text-blue-400 hidden md:block" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "High Patient Volume",
              desc: "Thousands of patients visit large public hospital OPDs daily, creating overwhelming waiting rooms."
            },
            {
              title: "Limited Consultation Time",
              desc: "Doctors have only 2–4 minutes per patient to collect history, review reports, and prescribe."
            },
            {
              title: "Fragmented Records",
              desc: "Patients carry loose prescriptions and lab reports in plastic bags, making historical tracking hard."
            },
            {
              title: "Language & Literacy Barriers",
              desc: "Many patients struggle with typing, reading complex medical terminology, or filling digital forms."
            },
            {
              title: "Repeated Documentation",
              desc: "Patients must repeatedly explain the same medical history across different department visits."
            }
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-400 transition">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold mb-3">
                <AlertOctagon size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{card.title}</h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-blue-400 font-bold text-xs uppercase tracking-wider">Our Solution</span>
          <h2 className="text-3xl font-extrabold">Meet MediKiosk</h2>
          <p className="text-slate-300 text-sm">
            “MediKiosk is an AI-assisted clinical intake platform that collects structured patient history before consultation and prepares a physician-ready summary.”
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🎙️", title: "Voice Conversation", desc: "Patients answer naturally in Hindi, English, Bengali, Marathi, Tamil, etc." },
            { icon: "👆", title: "Touch Interaction", desc: "Every question can also be answered using simple high-contrast touchscreen controls." },
            { icon: "📄", title: "Medical OCR", desc: "Scan prescriptions, lab test reports and discharge summaries seamlessly." },
            { icon: "🧠", title: "Clinical AI", desc: "Converts patient responses into structured clinical history (CC, HPI, Meds, ROS)." },
            { icon: "🚨", title: "Red-Flag Detection", desc: "Identifies potentially urgent symptoms and alerts hospital triage staff." },
            { icon: "📋", title: "Doctor Summary", desc: "Generates an editable, physician-verifiable 1-page clinical summary." },
            { icon: "🔐", title: "Consent & Privacy", desc: "Consent-first data handling and secure encrypted patient sessions." },
            { icon: "🏥", title: "ABDM Ready", desc: "Designed for interoperability with hospital systems (HIS) and ABDM/FHIR workflows." }
          ].map((feat, idx) => (
            <div key={idx} className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl hover:border-blue-400 transition">
              <div className="text-2xl mb-2">{feat.icon}</div>
              <h4 className="font-bold text-sm text-white">{feat.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const SparklesIcon = () => (
  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582a1 1 0 01.582.582L17.123 10.5A1 1 0 0116 11.5h-1.323l-1.582 3.954a1 1 0 01-.582.582L10 17.5a1 1 0 01-1-1v-1.323l-3.954-1.582a1 1 0 01-.582-.582L2.877 10.5A1 1 0 014 9.5h1.323l1.582-3.954a1 1 0 01.582-.582L10 2.5V2z" />
  </svg>
);
