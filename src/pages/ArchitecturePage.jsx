import React from "react";
import { Cpu, ArrowRight, Database, Globe, Lock, ShieldCheck, Layers, FileText } from "lucide-react";

export const ArchitecturePage = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          System Overview
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">How MediKiosk Works</h1>
        <p className="text-slate-600 text-sm">
          Technical Architecture & Flow from Patient Kiosk to Hospital EMR / ABDM Ecosystem.
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
        <h3 className="text-lg font-extrabold text-blue-400 border-b border-slate-800 pb-3">
          End-to-End Technical Pipeline Flow Diagram
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center items-center text-xs font-mono">
          {[
            "Patient",
            "Voice / Touch",
            "Speech-to-Text",
            "Conversational AI",
            "History Engine",
            "Medical OCR",
            "Structured Record",
            "AI Summary",
            "Doctor Dashboard",
            "HIS / ABDM / FHIR"
          ].map((item, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl font-bold text-blue-200">
                {item}
              </div>
              {idx < arr.length - 1 && (
                <div className="hidden sm:block text-blue-500 font-bold">&rarr;</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Technology Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {[
          { title: "Frontend Kiosk UI", desc: "React, Tailwind CSS, Touch & Audio controls, Multilingual support" },
          { title: "Backend Engine", desc: "Python, FastAPI / Flask, High-throughput REST API gateway" },
          { title: "AI & NLP Pipeline", desc: "Indian Language ASR Speech-to-text, Clinical LLM intake, NER" },
          { title: "Medical OCR", desc: "Tesseract / Vision AI fine-tuned on handwritten Indian prescriptions" },
          { title: "Database Layer", desc: "PostgreSQL with encrypted JSONB clinical timeline logs" },
          { title: "Interoperability", desc: "ABDM Health Repository APIs, FHIR R4 JSON Payload standard" }
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Stack Layer #{i + 1}</span>
            <h4 className="font-extrabold text-base text-slate-900">{card.title}</h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
