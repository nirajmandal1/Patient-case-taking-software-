import React, { useState } from "react";
import { useDemo } from "../context/DemoContext";
import {
  UserCheck,
  QrCode,
  UserPlus,
  Info,
  ArrowRight,
  HelpCircle,
  User,
  Calendar,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  Minus,
  Activity
} from "lucide-react";

export const PatientAuth = () => {
  const {
    setActiveTab,
    isDemoMode,
    nextDemoStep,
    patientData,
    setPatientData
  } = useDemo();

  // Controlled states for Name, Age, Gender, ABHA
  const [name, setName] = useState(patientData?.name && patientData?.name !== "Ramesh Sharma" ? patientData.name : "");
  const [age, setAge] = useState(patientData?.age ? patientData.age.toString() : "25");
  const [gender, setGender] = useState(patientData?.gender || "Male");
  const [abhaInput, setAbhaInput] = useState(patientData?.abhaId && patientData?.abhaId !== "91-8842-1092-4402" ? patientData.abhaId : "");
  const [mobile, setMobile] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("quick"); // "quick" | "abha"

  const handleAuthSubmit = (e) => {
    e?.preventDefault();

    const updated = {
      ...patientData,
      name: name.trim() || "Patient",
      age: parseInt(age, 10) || 25,
      gender: gender,
      abhaId: abhaInput.trim() || "91-1123-8822-7711"
    };

    setPatientData(updated);

    if (isDemoMode) {
      nextDemoStep();
    } else {
      setActiveTab("interview");
    }
  };

  const adjustAge = (delta) => {
    const current = parseInt(age, 10) || 45;
    const next = Math.max(1, Math.min(115, current + delta));
    setAge(next.toString());
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="bg-blue-100 text-blue-800 text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
            Step 2: Patient Registration & Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Enter Patient Information / मरीज का विवरण
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Apna Naam aur Umar darj karein taaki doctor ki parchi aur clinical history sahi bane.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>ABDM Verified Gateway</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Registration Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Method Selection Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMethod("quick")}
              className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                selectedMethod === "quick"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User size={15} /> Direct OPD Registration (नाम व उम्र)
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod("abha")}
              className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                selectedMethod === "abha"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <QrCode size={15} /> Ayushman ABHA ID Card
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Patient Full Name / मरीज का पूरा नाम <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Niraj Kumar / मरीज का नाम लिखें"
                  required
                  className="w-full bg-slate-50/80 border border-slate-300 text-slate-900 pl-10 pr-4 py-3 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Age & Gender Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Age with Stepper */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Age (Years) / उम्र <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustAge(-1)}
                    className="w-11 h-11 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-700 transition cursor-pointer shrink-0"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 48"
                    min="1"
                    max="120"
                    required
                    className="w-full text-center bg-slate-50/80 border border-slate-300 text-slate-900 py-2.5 rounded-xl text-base font-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => adjustAge(1)}
                    className="w-11 h-11 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-700 transition cursor-pointer shrink-0"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Gender Radio Segment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Gender / लिंग <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                        gender === g
                          ? "bg-white text-blue-700 shadow-2xs font-extrabold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {g === "Male" ? "Male" : g === "Female" ? "Female" : "Other"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ABHA or Mobile Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                {selectedMethod === "abha" ? "Ayushman ABHA Health ID Number" : "Mobile Phone Number"}
              </label>
              <div className="relative">
                {selectedMethod === "abha" ? (
                  <CreditCard size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                ) : (
                  <Smartphone size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                )}
                <input
                  type="text"
                  value={selectedMethod === "abha" ? abhaInput : mobile}
                  onChange={(e) =>
                    selectedMethod === "abha"
                      ? setAbhaInput(e.target.value)
                      : setMobile(e.target.value)
                  }
                  placeholder={selectedMethod === "abha" ? "91-XXXX-XXXX-XXXX" : "10-digit mobile number"}
                  className="w-full bg-slate-50/80 border border-slate-300 text-slate-900 pl-10 pr-4 py-3 rounded-2xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Action Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition transform active:scale-[0.98] text-sm cursor-pointer"
              >
                <span>Save Profile & Start Medical Chatbot</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Real-Time Digital ABHA Smart Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Live Digital Health ID Preview
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Auto-Synced
            </span>
          </div>

          {/* Digital Smart Card */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 border border-blue-500/30 relative overflow-hidden">
            {/* Hologram Gradient Glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/15 rounded-full blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="relative z-10 flex justify-between items-start border-b border-white/15 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-blue-900 flex items-center justify-center font-black text-xs">
                  GOI
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-white">
                    Ayushman Bharat Health Account
                  </h3>
                  <p className="text-[10px] text-blue-200 font-medium">
                    National Health Authority (NHA) • ABDM
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-[10px] font-mono text-yellow-300">
                CHIP
              </div>
            </div>

            {/* Patient Name & Demographics in real time */}
            <div className="relative z-10 space-y-3">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-blue-300 font-bold block">
                  Patient Full Name
                </span>
                <p className="text-xl font-black text-white tracking-tight">
                  {name || "Patient Name (मरीज का नाम)"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-white/10 p-3 rounded-xl border border-white/10 text-xs">
                <div>
                  <span className="text-[9px] text-blue-200 block uppercase">Age</span>
                  <strong className="text-white text-sm">{age || "25"} Yrs</strong>
                </div>
                <div>
                  <span className="text-[9px] text-blue-200 block uppercase">Gender</span>
                  <strong className="text-white text-sm">{gender || "Male"}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-blue-200 block uppercase">OPD Token</span>
                  <strong className="text-cyan-300 text-sm font-mono">#{patientData?.token || "105"}</strong>
                </div>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-widest text-blue-300 font-bold block">
                  ABHA Health Address Number
                </span>
                <p className="text-base font-mono font-black text-cyan-200 tracking-wider">
                  {abhaInput || "91-1123-8822-7711"}
                </p>
              </div>
            </div>

            {/* Card Footer with QR Code */}
            <div className="relative z-10 flex justify-between items-center pt-3 border-t border-white/15 text-[10px] text-blue-200">
              <div>
                <span>Secured by ABDM Token</span>
                <p className="text-[9px] text-slate-400">Valid for today's consultation</p>
              </div>
              <div className="bg-white p-1 rounded-lg">
                <QrCode size={36} className="text-slate-900" />
              </div>
            </div>
          </div>

          <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <p>
              Ye details aapki clinical case sheet aur prescription par print hongi. Agle step mein AI aapse takleef ke baare mein sawaal poochega.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
