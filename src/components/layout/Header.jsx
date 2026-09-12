import React from "react";
import { useDemo } from "../../context/DemoContext";
import {
  Stethoscope,
  Globe,
  User,
  FileText,
  Clock,
  Sparkles,
  MessageSquare,
  UploadCloud,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  Activity,
  ArrowUpRight
} from "lucide-react";

export const Header = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    userRole,
    switchRole,
    patientData
  } = useDemo();

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Clinical Brand Identity */}
        <div
          onClick={() => (userRole === "doctor" ? setActiveTab("doctor") : setActiveTab("kiosk"))}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div
            className={`w-10 h-10 rounded-2xl text-white flex items-center justify-center transition-all duration-300 shadow-md ${
              userRole === "doctor"
                ? "bg-gradient-to-tr from-indigo-700 to-indigo-500 shadow-indigo-500/25 group-hover:scale-105"
                : "bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 shadow-blue-500/25 group-hover:scale-105"
            }`}
          >
            <Stethoscope size={20} className="transition-transform group-hover:rotate-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                MediKiosk
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200/60">
                  AI 2.0
                </span>
              </span>
              <span
                className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border tracking-wide ${
                  userRole === "doctor"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {userRole === "doctor" ? "👨‍⚕️ Physician Portal" : "👤 Patient Self-Intake"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {userRole === "doctor"
                ? "OPD Chamber #04 • Dr. Sharma Desk"
                : `Live Kiosk #03 • Token #${patientData?.token || "105"}`}
            </p>
          </div>
        </div>

        {/* Dynamic Segmented Navigation */}
        <nav className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 max-w-full overflow-x-auto text-xs font-semibold">
          {userRole === "patient" ? (
            <>
              <button
                onClick={() => setActiveTab("kiosk")}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "kiosk" || activeTab === "language" || activeTab === "consent"
                    ? "bg-white text-blue-700 font-extrabold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User size={14} /> Intake Home
              </button>

              <button
                onClick={() => setActiveTab("auth")}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "auth"
                    ? "bg-white text-blue-700 font-extrabold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserCheck size={14} /> Patient Details
              </button>

              <button
                onClick={() => setActiveTab("interview")}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "interview"
                    ? "bg-white text-blue-700 font-extrabold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MessageSquare size={14} /> AI Interview
              </button>

              <button
                onClick={() => setActiveTab("scanner")}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "scanner" || activeTab === "ocr-results"
                    ? "bg-white text-blue-700 font-extrabold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UploadCloud size={14} /> Scan Reports
              </button>

              <button
                onClick={() => setActiveTab("summary")}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "summary"
                    ? "bg-white text-blue-700 font-extrabold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText size={14} /> Case Summary & PDF
              </button>

              <button
                onClick={() => setActiveTab("ayush")}
                className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "ayush"
                    ? "bg-emerald-600 text-white font-extrabold shadow-xs"
                    : "text-emerald-700 hover:bg-emerald-50/60"
                }`}
              >
                <Sparkles size={13} /> AYUSH
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab("doctor")}
                className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "doctor"
                    ? "bg-white text-indigo-700 font-extrabold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard size={14} /> OPD Consultation Desk
              </button>
            </>
          )}
        </nav>

        {/* Global Controls & Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative inline-flex items-center text-xs bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-2xs hover:border-slate-300 transition">
            <Globe size={13} className="text-slate-400 mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Role Switcher Button */}
          {userRole === "patient" ? (
            <button
              onClick={() => {
                switchRole("doctor");
                setActiveTab("doctor");
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-[0.98] cursor-pointer"
            >
              <Stethoscope size={14} className="text-indigo-300" />
              <span>Doctor Portal</span>
            </button>
          ) : (
            <button
              onClick={() => {
                switchRole("patient");
                setActiveTab("kiosk");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition active:scale-[0.98] cursor-pointer"
            >
              <User size={14} className="text-blue-200" />
              <span>Patient Kiosk</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
