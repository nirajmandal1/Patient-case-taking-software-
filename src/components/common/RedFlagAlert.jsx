import React from "react";
import { AlertTriangle, Bell, ShieldAlert, X } from "lucide-react";

export const RedFlagAlert = ({ onNotifyTriage, onDismiss }) => {
  return (
    <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-5 shadow-lg mb-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="bg-red-500 text-white p-3 rounded-xl shrink-0">
          <AlertTriangle size={28} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              PRIORITY CLINICAL ASSESSMENT RECOMMENDED
            </span>
            {onDismiss && (
              <button onClick={onDismiss} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            )}
          </div>
          <h3 className="text-lg font-extrabold text-red-950 mt-1">
            Emergency Symptom Pattern Detected
          </h3>
          <p className="text-sm text-red-800 mt-1 leading-relaxed">
            Some symptoms you reported (Severe chest discomfort & breathlessness) may require prompt medical assessment by triage staff.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onNotifyTriage}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow transition"
            >
              <Bell size={16} /> Notify Triage Staff Immediately
            </button>
            <button
              onClick={onDismiss}
              className="bg-white hover:bg-red-100 border border-red-300 text-red-900 font-bold text-xs px-4 py-2.5 rounded-xl transition"
            >
              Continue Assessment
            </button>
          </div>

          <div className="mt-3 text-[11px] text-red-600 font-semibold border-t border-red-200 pt-2">
            ⚠️ This system does not provide a final diagnosis. Prototype Red-Flag Simulation.
          </div>
        </div>
      </div>
    </div>
  );
};
