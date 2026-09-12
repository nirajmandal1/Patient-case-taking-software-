import React from "react";
import { useDemo } from "../context/DemoContext";
import { AudioPlayer } from "../components/common/AudioPlayer";
import { ShieldCheck, Lock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export const ConsentPage = () => {
  const { setActiveTab, isDemoMode, nextDemoStep } = useDemo();

  const consentTextHindi =
    "Hum aapke swasthya se jude sawal puchhenge aur purani medical report scan kar sakte hain. Yeh jankari sirf doctor ke liye tayar ki jayegi taaki aapka ilaaj jaldi ho sake. Aapki jankari surakshit rahegi.";

  const handleConsent = () => {
    if (isDemoMode) {
      nextDemoStep();
    } else {
      setActiveTab("auth");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Step 2: Patient Consent & Privacy
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">Before We Begin / shuru karne se pehle</h1>
        <p className="text-slate-600 text-sm">
          Please review how MediKiosk protects and uses your health information.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-base">
            <ShieldCheck size={22} className="text-blue-600" />
            <span>Low-Literacy Friendly Patient Consent</span>
          </div>
          <AudioPlayer text={consentTextHindi} label="🔊 Read Consent Aloud" />
        </div>

        <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-2xl space-y-3">
          <p className="text-slate-800 text-base leading-relaxed font-medium">
            “{consentTextHindi}”
          </p>
          <p className="text-xs text-slate-500 italic">
            English: "We will ask questions about your health and may scan your previous medical reports. Your information will be used strictly to prepare your medical history for the doctor."
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Why do we collect this info?</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0" /> Reduce OPD waiting time for you
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0" /> Provide full history to doctor
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0" /> Digitize paper prescriptions & tests
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0" /> Detect priority triage symptoms
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock size={16} className="text-blue-600" />
            <span>🔒 ABDM Consent-First Architecture Enabled</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => alert("Assessment cancelled. Returning to main menu.")}
              className="px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition flex-1 sm:flex-none"
            >
              Decline
            </button>
            <button
              onClick={handleConsent}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition flex-1 sm:flex-none"
            >
              <span>I Understand & Give Consent</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
