import React, { useState, useEffect } from "react";
import { useDemo } from "../context/DemoContext";
import {
  Play,
  LogIn,
  HelpCircle,
  Volume2,
  Sparkles,
  ShieldCheck,
  Clock,
  Mic,
  FileText,
  Activity,
  ArrowRight,
  CheckCircle2,
  Building2,
  Zap,
  QrCode
} from "lucide-react";

export const KioskWelcome = () => {
  const { setActiveTab, isDemoMode, nextDemoStep, switchRole, patientData } = useDemo();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-6 sm:py-10 space-y-8 max-w-6xl mx-auto px-4">
      {/* Top Kiosk Terminal Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:px-6 rounded-2xl border border-slate-200/80 shadow-2xs text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-extrabold text-slate-800">Kiosk Terminal #03 • Active</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium">Govt. General Hospital OPD Wing</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-blue-600" />
            <strong className="text-slate-800 font-mono">{currentTime}</strong>
          </span>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck size={12} /> ABDM Certified
          </span>
        </div>
      </div>

      {/* Main Kiosk Hero Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Core Value & Large Touch CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black px-3.5 py-1 rounded-full">
              <Sparkles size={14} className="text-blue-600" />
              <span>Next-Gen OPD Case Taking Software</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Right History. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Zero OPD Delay.
              </span> <br />
              Better Consultation.
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Apni bhasha mein bolkar ya likhkar takleef batayein. AI turant doctor ke liye structured OPD parchi taiyar karta hai taaki kam se kam samay mein behtar ilaaj ho sake.
            </p>
          </div>

          {/* Primary Touch CTAs */}
          <div className="space-y-3.5 pt-2">
            <button
              onClick={() => {
                switchRole("patient");
                if (isDemoMode) nextDemoStep();
                else setActiveTab("language");
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25 transition-all transform active:scale-[0.98] text-base cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Play size={16} fill="white" />
              </div>
              <span className="tracking-tight">Start Patient Assessment (जाँच शुरू करें)</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  switchRole("doctor");
                  setActiveTab("doctor");
                }}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold py-3 px-5 rounded-xl flex items-center gap-2 transition cursor-pointer text-xs shadow-2xs hover:border-slate-400"
              >
                <LogIn size={15} className="text-blue-600" />
                <span>Doctor Consultation Login</span>
              </button>

              <button
                onClick={() => setActiveTab("auth")}
                className="bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-blue-800 font-bold py-3 px-5 rounded-xl flex items-center gap-2 transition cursor-pointer text-xs"
              >
                <QrCode size={15} className="text-blue-600" />
                <span>Quick ABHA / OPD Registration</span>
              </button>
            </div>
          </div>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/70">
            {[
              { label: "6 Indian Languages", desc: "Speech & Text", icon: Mic, color: "text-blue-600 bg-blue-50" },
              { label: "Red-Flag Triage", desc: "Emergency Alert", icon: Activity, color: "text-rose-600 bg-rose-50" },
              { label: "Rx OCR Scanner", desc: "Reports & Slips", icon: FileText, color: "text-indigo-600 bg-indigo-50" },
              { label: "ABDM Health ID", desc: "Govt. Compliant", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50" }
            ].map((f, i) => (
              <div key={i} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${f.color}`}>
                  <f.icon size={16} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">{f.label}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Digital Smart Token & Case Preview Card */}
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden border border-slate-700/60">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-slate-700/60 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                    OPD SMART INTAKE SLIP
                  </span>
                  <h3 className="text-xl font-black mt-0.5 tracking-tight">AIIMS / District Civil OPD</h3>
                </div>
                <div className="bg-blue-600 text-white font-mono font-black text-sm px-3 py-1 rounded-xl shadow-xs">
                  TOKEN #105
                </div>
              </div>

              {/* Sample Live Patient Snapshot */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Live Intake Patient:</span>
                  <strong className="text-white text-sm">Ramesh Sharma (48Y / M)</strong>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-2">
                  <span className="text-slate-300">Chief Complaint:</span>
                  <span className="text-amber-300 font-bold">Chest Discomfort & Acidity</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-2">
                  <span className="text-slate-300">Triage Classification:</span>
                  <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                    Standard OPD Intake
                  </span>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 text-center">
                  <span className="text-2xl font-black text-emerald-400">4.2 min</span>
                  <span className="block text-[10px] text-slate-300 mt-0.5">Average Time Saved per Patient</span>
                </div>
                <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 text-center">
                  <span className="text-2xl font-black text-blue-400">98.8%</span>
                  <span className="block text-[10px] text-slate-300 mt-0.5">Clinical Accuracy Score</span>
                </div>
              </div>

              {/* Quick Prompt bar */}
              <div className="p-3 bg-blue-900/40 rounded-xl border border-blue-500/30 flex items-center gap-2 text-xs text-blue-200">
                <Zap size={15} className="text-blue-400 shrink-0" />
                <span>Tap "Start Patient Assessment" to begin voice interview.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
