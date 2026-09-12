import React from "react";
import { useDemo } from "../../context/DemoContext";
import { ArrowRight } from "lucide-react";

export const DemoBanner = () => {
  const { isDemoMode, demoStep, nextDemoStep, stopDemoMode } = useDemo();
  if (!isDemoMode) return null;

  const stepLabels = ["1. Kiosk Welcome","2. Language & Consent","3. Language & Consent","4. ABHA Identification","5. AI Health Interview","6. Red-Flag Triage","7. Document Scanner","8. OCR Results","9. AI Clinical Summary","10. Doctor Dashboard"];

  return (
    <div className="bg-blue-900 text-white px-4 py-2.5 shadow-md flex flex-wrap justify-between items-center text-xs border-b border-blue-800 sticky top-[61px] z-40">
      <div className="flex items-center gap-3">
        <span className="bg-red-500 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px] animate-pulse">DEMO MODE</span>
        <span className="font-semibold text-blue-200">Step {demoStep} of 10: <strong className="text-white">{stepLabels[demoStep - 1]}</strong></span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={nextDemoStep} className="bg-white text-blue-900 font-extrabold px-4 py-1 rounded-lg flex items-center gap-1.5 transition hover:bg-blue-50"><span>Next Step</span><ArrowRight size={14} /></button>
        <button onClick={stopDemoMode} className="text-blue-300 hover:text-white px-2 py-1 underline text-[11px]">Close Demo</button>
      </div>
    </div>
  );
};
