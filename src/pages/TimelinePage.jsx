import React from "react";
import { useDemo } from "../context/DemoContext";
import { Clock, FileText, CheckCircle2, Calendar, Stethoscope } from "lucide-react";

export const TimelinePage = () => {
  const { patientData } = useDemo();
  const reports = patientData.caseData.extractedReports;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Patient History
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">Medical History Timeline</h1>
        <p className="text-slate-600 text-sm">
          Chronological record of past hospital OPD visits, prescriptions, and lab diagnostic reports.
        </p>
      </div>

      {/* Vertical Timeline Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative">
        <div className="absolute left-10 top-12 bottom-12 w-0.5 bg-blue-200"></div>

        <div className="space-y-8 relative">
          {reports.map((item, idx) => (
            <div key={idx} className="flex items-start gap-6">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0 z-10 shadow">
                <Calendar size={18} />
              </div>

              <div className="flex-1 bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 hover:border-blue-400 transition">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-lg">
                    {item.date}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{item.source}</span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">{item.type}</h3>
                <p className="text-xs text-slate-700 font-medium">{item.test}</p>

                <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-200/80">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 size={14} /> OCR Digitized & Verified
                  </span>
                  <span className="font-mono">Status: {item.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
