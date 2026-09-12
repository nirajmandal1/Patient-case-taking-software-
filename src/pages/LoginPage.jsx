import React, { useState } from "react";
import { useDemo } from "../context/DemoContext";
import {
  Stethoscope,
  User,
  ShieldCheck,
  ArrowRight,
  Lock,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  Sparkles,
  Zap,
  KeyRound,
  FileCheck
} from "lucide-react";

export const LoginPage = () => {
  const {
    setUserRole,
    switchRole,
    setActiveTab,
    setPatientData,
    latestToken
  } = useDemo();

  // Active Login Tab: "patient" or "doctor"
  const [loginRole, setLoginRole] = useState("patient");

  // Patient Login Form State
  const [patientAuthType, setPatientAuthType] = useState("walkin"); // "abha" or "walkin"
  const [patientName, setPatientName] = useState("Ramesh Sharma");
  const [patientAge, setPatientAge] = useState("48");
  const [patientGender, setPatientGender] = useState("Male");
  const [patientAbha, setPatientAbha] = useState("91-8842-1092-4402");
  const [patientMobile, setPatientMobile] = useState("9876543210");
  const [patientLang, setPatientLang] = useState("Hindi");

  // Doctor Login Form State
  const [doctorId, setDoctorId] = useState("dr.sharma@hospital.gov.in");
  const [doctorPin, setDoctorPin] = useState("123456");
  const [doctorChamber, setDoctorChamber] = useState("OPD Chamber #04 - General Medicine");
  const [loginSuccessMsg, setLoginSuccessMsg] = useState("");

  // Handle Patient Login / Kiosk Start
  const handlePatientLogin = (e) => {
    e.preventDefault();
    setLoginSuccessMsg("Patient Verified! Generating token and launching intake interview...");

    const newPatient = {
      token: (latestToken + 1).toString(),
      patientId: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientName.trim() || "Walk-in Patient",
      age: parseInt(patientAge, 10) || 45,
      gender: patientGender,
      abhaId: patientAuthType === "abha" ? patientAbha : "91-PENDING-REG",
      language: patientLang,
      chiefComplaint: "Awaiting AI Clinical Intake",
      historyStatus: "In Progress",
      priority: "Normal",
      triageReason: "Kiosk Self-Check-in",
      caseData: {
        hpi: "Patient logged into intake kiosk.",
        pastHistory: "To be assessed by AI interview.",
        currentMeds: [],
        allergies: [],
        familyHistory: "Nil reported"
      },
      conversation: []
    };

    setTimeout(() => {
      setPatientData(newPatient);
      switchRole("patient");
      setActiveTab("interview");
    }, 700);
  };

  // Handle Doctor Login
  const handleDoctorLogin = (e) => {
    e.preventDefault();
    setLoginSuccessMsg("Doctor Credentials Verified! Opening OPD Chamber #04...");

    setTimeout(() => {
      switchRole("doctor");
      setActiveTab("doctor");
    }, 700);
  };

  // Quick Demo Auto-fillers
  const fillSamplePatient = () => {
    setPatientName("Sushila Devi");
    setPatientAge("62");
    setPatientGender("Female");
    setPatientAbha("91-3829-5511-9022");
    setPatientMobile("9811223344");
    setPatientLang("Hindi");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-black">
          <ShieldCheck size={14} className="text-blue-600" />
          <span>MediKiosk Secure Role-Based Access Control (RBAC)</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Select Your Login Portal
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
          Choose whether you are a patient entering the self-service intake kiosk or a hospital doctor accessing the OPD chamber.
        </p>
      </div>

      {/* Success Notification Alert */}
      {loginSuccessMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl text-emerald-900 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md animate-pulse">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>{loginSuccessMsg}</span>
        </div>
      )}

      {/* Portal Selection Switch Buttons */}
      <div className="flex justify-center">
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex gap-2">
          <button
            type="button"
            onClick={() => setLoginRole("patient")}
            className={`px-6 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 transition cursor-pointer ${
              loginRole === "patient"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <User size={16} />
            <span>👤 Patient Kiosk (मरीज सेवा)</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginRole("doctor")}
            className={`px-6 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 transition cursor-pointer ${
              loginRole === "doctor"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Stethoscope size={16} />
            <span>🩺 Doctor Portal (चिकित्सक लॉगिन)</span>
          </button>
        </div>
      </div>

      {/* =============================================================== */}
      {/* 1. PATIENT LOGIN / INTAKE CARD                                  */}
      {/* =============================================================== */}
      {loginRole === "patient" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6 max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-between items-start border-b pb-4 gap-2">
            <div>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                PATIENT SELF-SERVICE INTAKE
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Patient Kiosk Identification
              </h2>
              <p className="text-xs text-slate-500">
                Identify yourself using ABHA ID or enter your details for a new OPD token.
              </p>
            </div>

            <button
              type="button"
              onClick={fillSamplePatient}
              className="text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              ⚡ Auto-Fill Demo Patient
            </button>
          </div>

          {/* Sub-Tabs: ABHA vs Walk-in Registration */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setPatientAuthType("walkin")}
              className={`py-2 rounded-xl transition cursor-pointer ${
                patientAuthType === "walkin"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Standard OPD Walk-in
            </button>
            <button
              type="button"
              onClick={() => setPatientAuthType("abha")}
              className={`py-2 rounded-xl transition cursor-pointer ${
                patientAuthType === "abha"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Ayushman ABHA / Aadhaar
            </button>
          </div>

          <form onSubmit={handlePatientLogin} className="space-y-4 text-xs">
            {patientAuthType === "abha" ? (
              <div className="space-y-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    ABHA ID (Ayushman Bharat Health Account Number):
                  </label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={patientAbha}
                      onChange={(e) => setPatientAbha(e.target.value)}
                      placeholder="91-XXXX-XXXX-XXXX"
                      required
                      className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Registered Mobile Number:
                  </label>
                  <div className="relative">
                    <Smartphone size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      value={patientMobile}
                      onChange={(e) => setPatientMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      required
                      className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* General Patient Demographics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name:</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  required
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Age (Years):</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 48"
                  required
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Gender:</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (महिला)</option>
                  <option value="Other">Other (अन्य)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Preferred Language:</label>
                <select
                  value={patientLang}
                  onChange={(e) => setPatientLang(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="English">English</option>
                  <option value="Bengali">বাংলা (Bengali)</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 text-sm cursor-pointer"
              >
                <span>Generate OPD Token & Start AI Interview</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =============================================================== */}
      {/* 2. DOCTOR LOGIN CARD                                            */}
      {/* =============================================================== */}
      {loginRole === "doctor" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6 max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-between items-start border-b pb-4 gap-2">
            <div>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                PHYSICIAN OPD ACCESS PORTAL
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Doctor Chamber Login
              </h2>
              <p className="text-xs text-slate-500">
                Sign in to your assigned hospital OPD chamber desk & queue.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setDoctorId("dr.sharma@hospital.gov.in");
                setDoctorPin("123456");
                setDoctorChamber("OPD Chamber #04 - General Medicine");
              }}
              className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              ⚡ 1-Click Demo Login
            </button>
          </div>

          <form onSubmit={handleDoctorLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Doctor Email / Medical Registration Number (MCI/NMC):
              </label>
              <div className="relative">
                <Stethoscope size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder="e.g. dr.sharma@hospital.gov.in or MCI-49821"
                  required
                  className="w-full bg-slate-50 border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Chamber Security PIN / Password:
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={doctorPin}
                  onChange={(e) => setDoctorPin(e.target.value)}
                  placeholder="••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Assigned OPD Chamber / Specialty:
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <select
                  value={doctorChamber}
                  onChange={(e) => setDoctorChamber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="OPD Chamber #04 - General Medicine">
                    Chamber #04 — General Medicine (Dr. Sharma, MD)
                  </option>
                  <option value="OPD Chamber #07 - Cardiology">
                    Chamber #07 — Cardiology & Triage (Dr. K. S. Verma)
                  </option>
                  <option value="OPD Chamber #02 - AYUSH & Traditional">
                    Chamber #02 — AYUSH & Integrative Medicine
                  </option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 text-sm cursor-pointer"
              >
                <span>Login to Doctor OPD Chamber</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security & Compliance Badges */}
      <div className="flex flex-wrap justify-center items-center gap-6 text-[11px] text-slate-400 pt-2 font-medium">
        <span className="flex items-center gap-1">
          <ShieldCheck size={14} className="text-blue-600" /> ABDM & FHIR Compliant
        </span>
        <span className="flex items-center gap-1">
          <Lock size={14} className="text-blue-600" /> 256-bit Encrypted Session
        </span>
        <span className="flex items-center gap-1">
          <FileCheck size={14} className="text-blue-600" /> Role-Based Access Isolation
        </span>
      </div>
    </div>
  );
};
