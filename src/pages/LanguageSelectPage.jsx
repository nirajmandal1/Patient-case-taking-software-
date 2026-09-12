import React, { useState } from "react";
import { useDemo } from "../context/DemoContext";
import { Check, ArrowRight, Volume2, ShieldCheck, Globe, Sparkles, HeartPulse, CheckCircle2 } from "lucide-react";

export const LanguageSelectPage = () => {
  const { language, setLanguage, setActiveTab, isDemoMode, nextDemoStep } = useDemo();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [consentGiven, setConsentGiven] = useState(true);

  const languages = [
    { code: "Hindi", native: "हिंदी", sub: "Hindi", flag: "🇮🇳" },
    { code: "English", native: "English", sub: "English", flag: "🇬🇧" },
    { code: "Bengali", native: "বাংলা", sub: "Bengali", flag: "🇮🇳" },
    { code: "Marathi", native: "मराठी", sub: "Marathi", flag: "🇮🇳" },
    { code: "Tamil", native: "தமிழ்", sub: "Tamil", flag: "🇮🇳" },
    { code: "Telugu", native: "తెలుగు", sub: "Telugu", flag: "🇮🇳" }
  ];

  const handleContinue = () => {
    if (isDemoMode) nextDemoStep(); else setActiveTab("auth");
  };

  const handleReadAloud = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);

    const speechText = language === "English"
      ? "Welcome to MediKiosk. We will ask you questions about your health and medical records to prepare a summary for the doctor. Your data is protected under ABDM guidelines."
      : "मेडीकियोस्क में आपका स्वागत है। हम आपके स्वास्थ्य और पुरानी रिपोर्ट से जुड़े सवाल पूछेंगे ताकि डॉक्टर के लिए आपका केस तैयार हो सके। आपकी जानकारी पूरी तरह सुरक्षित रहेगी।";

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = language === "English" ? "en-IN" : "hi-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      {/* Top Breadcrumb & Step Indicator */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200/80">
            <Globe size={13} className="text-blue-600" /> Step 1 of 6
          </span>
          <span className="text-xs font-semibold text-slate-500">Patient Onboarding</span>
        </div>
        <div className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600" /> ABDM Consent-First Architecture
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden shadow-xl border border-slate-200/80">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white p-6 sm:p-7 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Globe size={24} className="text-blue-200" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">
                Hospital Kiosk Intake Terminal
              </span>
              <h1 className="text-2xl font-black tracking-tight">Language & Patient Consent</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold">
            <span className="text-blue-200 font-normal">Active:</span>
            <span className="text-white font-extrabold">{language}</span>
          </div>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Language Selection */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">Choose Your Language</h2>
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-bold">
                  Touch Screen
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-1">
                कृपया अपनी पसंदीदा भाषा चुनें • Select your preferred language
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {languages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 group ${
                      isSelected
                        ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50/40 ring-4 ring-blue-100 shadow-md transform -translate-y-0.5"
                        : "border-slate-200/90 hover:border-blue-300 bg-white hover:bg-slate-50/80 shadow-2xs"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-3xl drop-shadow-xs">{l.flag}</span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-200 group-hover:border-blue-300"></span>
                      )}
                    </div>
                    <div>
                      <span className={`text-base font-black block leading-snug ${isSelected ? "text-blue-900" : "text-slate-800"}`}>
                        {l.native}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{l.sub}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
              <Sparkles size={18} className="text-blue-600 shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                The AI conversational intake & questions will automatically adapt to your chosen language.
              </p>
            </div>
          </div>

          {/* Right Column: Consent */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 bg-slate-50/70">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Before We Begin</h2>
              <p className="text-slate-500 text-xs mt-1">
                Kiosk data usage & privacy agreement
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <HeartPulse size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  We will ask focused clinical questions regarding your chief complaints and past medical records.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  This pre-consultation summary will be directly transmitted to the consulting doctor to reduce your waiting time.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleReadAloud}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isPlayingAudio
                      ? "bg-blue-600 text-white animate-pulse"
                      : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  <Volume2 size={15} />
                  <span>{isPlayingAudio ? "Speaking..." : "Read Aloud (बोलकर सुनाएं)"}</span>
                </button>
                <span className="text-[10px] text-slate-400 font-mono">Hindi / English Audio</span>
              </div>
            </div>

            {/* Consent Checkbox */}
            <label
              className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                consentGiven
                  ? "bg-white border-blue-600 shadow-xs ring-2 ring-blue-100"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
              <div className="space-y-1 text-xs">
                <span className="font-extrabold text-slate-900 block leading-snug">
                  I give consent to participate
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  I understand that my health data will be safely digitized in accordance with ABDM guidelines.
                </p>
              </div>
            </label>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/70 border border-slate-200/80 px-3.5 py-2.5 rounded-xl">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span className="font-semibold text-[11px]">256-bit encrypted • Hospital Intranet only</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 sm:p-6 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            onClick={() => setActiveTab("kiosk")}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer order-2 sm:order-1"
          >
            ← Back to Home Screen
          </button>
          <button
            onClick={handleContinue}
            disabled={!consentGiven}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black px-9 py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/25 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer order-1 sm:order-2"
          >
            <span className="text-sm">Proceed to Patient Identification</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
