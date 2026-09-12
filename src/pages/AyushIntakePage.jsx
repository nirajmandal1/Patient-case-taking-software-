import React, { useState } from "react";
import { useDemo } from "../context/DemoContext";
import { Sparkles, Check, Save, HeartPulse, Apple, Moon, Smile, ShieldAlert } from "lucide-react";

export const AyushIntakePage = () => {
  const [selectedBodyType, setSelectedBodyType] = useState("Pitta (Acidity / Garmi)");
  const [selectedProblem, setSelectedProblem] = useState("Hazma Kharab / Gas");
  const [selectedStrength, setSelectedStrength] = useState("Mazboot Sharir (Good Strength)");
  const [selectedDigestion, setSelectedDigestion] = useState("Medium (Theek-thaak pachan)");
  const [selectedSleep, setSelectedSleep] = useState("6-8 Ghante Achi Neend");

  const bodyTypes = [
    { label: "Vata", desc: "Gas, pet fulna, jodo me dard" },
    { label: "Pitta", desc: "Acidity, jalan, jald gussa aana" },
    { label: "Kapha", desc: "Sardi, balgam, vazan badhna" },
    { label: "Mix (Vata-Pitta)", desc: "Gas aur acidity dono ki samasya" },
    { label: "Santulit (Balanced)", desc: "Sharir me sab theek rehta hai" }
  ];

  const mainProblems = [
    { label: "Hazma Kharab / Gas", desc: "Khana hazam na hona, pet bhara lagna" },
    { label: "Acidity aur Seene me Jalan", desc: "Khatti dakar, pait me jalan" },
    { label: "Purani Sardi / Balgam", desc: "Baar-baar gale me kharash aur jukham" },
    { label: "Jodo aur Kamar ka Dard", desc: "Ghutno, pith ya jodo me dard" },
    { label: "Thakan aur Kamzori", desc: "Bina mehnat ke sharir me susti" }
  ];

  const strengthTypes = [
    { label: "Mazboot Sharir", desc: "Takat acchi hai, bimari kam hoti hai" },
    { label: "Theek-Thaak", desc: "Normal takat hai" },
    { label: "Kamzor Sharir", desc: "Jaldi thak jaate hain, susti rehti hai" },
    { label: "Mansik Stress", desc: "Chinta, bechaini aur darr lagna" }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 border border-emerald-200">
          <Sparkles size={14} /> Ayurvedic & Traditional Assessment
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Ayurveda Swasthya Jaanch (आयुर्वेदिक जाँच)
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Ayurvedic doctor ke liye aapke sharir ki prakriti, hazma shakti aur rozmarra ki aadat ki aasan jankari.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Sharir ki Prakriti / Body Type */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <HeartPulse size={18} className="text-emerald-600" />
              <label className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider block">
                1. Sharir ka Swabhaav (Body Type)
              </label>
            </div>
            <p className="text-[11px] text-slate-500">Aapko aamtaur par kis tarah ki pareshani rehti hai?</p>
            <div className="space-y-2 pt-1">
              {bodyTypes.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSelectedBodyType(item.label)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    selectedBodyType === item.label
                      ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-400"
                      : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[11px] text-slate-500 font-normal">{item.desc}</span>
                  </div>
                  {selectedBodyType === item.label && <Check size={16} className="text-emerald-600 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Asal Samasya / Imbalance */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-emerald-600" />
              <label className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider block">
                2. Asal Takleef (Main Problem)
              </label>
            </div>
            <p className="text-[11px] text-slate-500">Sabse zyada pareshan karne wali samasya chunein:</p>
            <div className="space-y-2 pt-1">
              {mainProblems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSelectedProblem(item.label)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    selectedProblem === item.label
                      ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-400"
                      : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[11px] text-slate-500 font-normal">{item.desc}</span>
                  </div>
                  {selectedProblem === item.label && <Check size={16} className="text-emerald-600 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Bhook aur Pachan / Digestion */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Apple size={18} className="text-emerald-600" />
              <label className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider block">
                3. Bhook aur Pachan (Digestion)
              </label>
            </div>
            <p className="text-[11px] text-slate-500">Khana hazam kaise hota hai?</p>
            <select
              value={selectedDigestion}
              onChange={(e) => setSelectedDigestion(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option>Bahut Achi Bhook (Khana jaldi hazam hota hai)</option>
              <option>Medium (Theek-thaak pachan)</option>
              <option>Kam Bhook (Khana khane ka mann nahi karta / Bhari pet)</option>
              <option>Kabhi Tez Kabhi Kam (Aniyamit bhook)</option>
            </select>
          </div>

          {/* 4. Sharir ki Taakat / Physical State */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Smile size={18} className="text-emerald-600" />
              <label className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider block">
                4. Sharirik Taakat (Body Strength)
              </label>
            </div>
            <p className="text-[11px] text-slate-500">Aapki physical energy kaisi rehti hai?</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {strengthTypes.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSelectedStrength(item.label)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    selectedStrength === item.label
                      ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                      : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                  }`}
                >
                  <span className="text-xs font-bold block">{item.label}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Neend ki sthiti */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Moon size={18} className="text-emerald-600" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">5. Neend (Sleep Routine)</span>
              <span className="text-[11px] text-slate-500">Raat me kitni der sote hain?</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["6-8 Ghante Achi Neend", "Kam Neend / Bechaini", "Neend me Pareshani"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSleep(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedSleep === s
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-300 hover:border-emerald-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs text-slate-500">
            Yeh data Ayurvedic OPD doctor ke consultation summary me attach ho jayega.
          </span>
          <button
            onClick={() => alert("✅ Ayurvedic jaanch save ho gayi hai aur doctor dashboard par bhej di gayi hai!")}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-xl flex items-center gap-2 shadow transition text-xs cursor-pointer"
          >
            <Save size={16} /> Save Ayurvedic Record
          </button>
        </div>
      </div>
    </div>
  );
};
