import React from "react";
import { Lock, ShieldCheck, UserCheck, Key, Clock, FileCheck } from "lucide-react";

export const SecurityPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Data Governance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy & Security</h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          MedSync is designed around privacy, consent, and controlled access to sensitive health information.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { icon: <Lock className="text-blue-600" size={24} />, title: "Consent-First Design", desc: "Explicit patient opt-in required before any health history collection or document scanning." },
          { icon: <ShieldCheck className="text-blue-600" size={24} />, title: "Encrypted Data Transmission", desc: "TLS 1.3 encryption in transit and AES-256 encryption for stored report images." },
          { icon: <UserCheck className="text-blue-600" size={24} />, title: "Role-Based Access Control", desc: "Strict separation between kiosk intake mode and physician dashboard access." },
          { icon: <Clock className="text-blue-600" size={24} />, title: "Secure Session Management", desc: "Automatic session wipe after patient completes intake or walks away from kiosk." },
          { icon: <FileCheck className="text-blue-600" size={24} />, title: "Audit Logs", desc: "Immutable logs tracking data creation, OCR extraction, and physician confirmation." },
          { icon: <Key className="text-blue-600" size={24} />, title: "Minimum Necessary Access", desc: "Only treating doctor receives case summary for current active OPD token." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <div className="p-3 bg-slate-50 rounded-2xl w-fit">{item.icon}</div>
            <h3 className="font-extrabold text-base text-slate-900">{item.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-100 p-4 rounded-2xl text-center text-xs text-slate-600 font-semibold border border-slate-200">
        Designed to support applicable privacy and health-data requirements (ABDM Interoperability Ready).
      </div>
    </div>
  );
};
