import React, { useState, useEffect } from "react";
import { useDemo } from "../context/DemoContext";
import {
  Stethoscope,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Save,
  Edit,
  ArrowRight,
  LayoutDashboard,
  ClipboardList,
  History,
  FolderOpen,
  Settings,
  Download,
  MessageSquare,
  Sparkles,
  Printer,
  Check,
  Search,
  Activity,
  TrendingUp,
  ShieldCheck,
  Heart,
  Calendar,
  Filter,
  Eye,
  Bell,
  Cpu,
  RefreshCw,
  Sliders,
  CheckCircle
} from "lucide-react";
import { generatePatientPDF } from "../utils/pdfGenerator";
import { mockSampleDocuments } from "../data/mockData";
import { jsPDF } from "jspdf";

export const DoctorDashboardPage = () => {
  const {
    activeQueue,
    setActiveQueue,
    patientData,
    setPatientData,
    setActiveTab,
    patientConversation
  } = useDemo();

  const [selectedPatient, setSelectedPatient] = useState(patientData);
  const [sidebarItem, setSidebarItem] = useState("queue"); // "dashboard", "queue", "history", "documents", "timeline", "settings"
  const [doctorNotes, setDoctorNotes] = useState("");
  const [activePanelTab, setActivePanelTab] = useState("summary"); // "summary", "chat"
  const [consultationStatus, setConsultationStatus] = useState("waiting");
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [docFilter, setDocFilter] = useState("all");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Settings State
  const [triageSensitivity, setTriageSensitivity] = useState("High (Standard Clinical Protocol)");
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(true);
  const [autoOpenNewIntakes, setAutoOpenNewIntakes] = useState(true);

  // Document & Record View Modals
  const [selectedDocModal, setSelectedDocModal] = useState(null);
  const [selectedHistoryModal, setSelectedHistoryModal] = useState(null);

  const handleDownloadSingleDoc = (docItem) => {
    try {
      const tempDoc = new jsPDF();
      tempDoc.setFont("helvetica", "bold");
      tempDoc.setFontSize(14);
      tempDoc.text(docItem.hospital || "CIVIL HOSPITAL OPD - MEDICAL RECORD", 14, 16);
      tempDoc.setFontSize(9);
      tempDoc.setFont("helvetica", "normal");
      tempDoc.text(`Document: ${docItem.title} | Date: ${docItem.date}`, 14, 22);
      tempDoc.text(`Physician: ${docItem.doctor || "Dr. K. S. Verma (MD)"}`, 14, 28);
      tempDoc.text(`Clinical Diagnosis: ${docItem.extractedData?.diagnosis || "OPD Case"}`, 14, 38);

      if (docItem.extractedData?.medications?.length > 0) {
        tempDoc.setFont("helvetica", "bold");
        tempDoc.text("Prescribed Medications (Rx):", 14, 48);
        tempDoc.setFont("helvetica", "normal");
        docItem.extractedData.medications.forEach((m, idx) => {
          tempDoc.text(`- ${m.name} ${m.dosage || ""} | ${m.frequency || "Regular"} | ${m.duration || ""}`, 18, 55 + idx * 7);
        });
      }

      if (docItem.extractedData?.investigations?.length > 0) {
        const invY = 55 + (docItem.extractedData?.medications?.length || 0) * 7 + 8;
        tempDoc.setFont("helvetica", "bold");
        tempDoc.text("Diagnostic Investigations & Tests:", 14, invY);
        tempDoc.setFont("helvetica", "normal");
        docItem.extractedData.investigations.forEach((inv, idx) => {
          tempDoc.text(`• ${inv}`, 18, invY + 7 + idx * 6);
        });
      }

      tempDoc.save(`${docItem.title.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDocInNewTab = (docItem) => {
    try {
      const tempDoc = new jsPDF();
      tempDoc.setFont("helvetica", "bold");
      tempDoc.setFontSize(14);
      tempDoc.text(docItem.hospital || "CIVIL HOSPITAL OPD - MEDICAL RECORD", 14, 16);
      tempDoc.setFontSize(9);
      tempDoc.setFont("helvetica", "normal");
      tempDoc.text(`Document: ${docItem.title} | Date: ${docItem.date}`, 14, 22);
      tempDoc.text(`Physician: ${docItem.doctor || "Dr. K. S. Verma (MD)"}`, 14, 28);
      tempDoc.text(`Clinical Diagnosis: ${docItem.extractedData?.diagnosis || "OPD Case"}`, 14, 38);

      if (docItem.extractedData?.medications?.length > 0) {
        tempDoc.setFont("helvetica", "bold");
        tempDoc.text("Prescribed Medications (Rx):", 14, 48);
        tempDoc.setFont("helvetica", "normal");
        docItem.extractedData.medications.forEach((m, idx) => {
          tempDoc.text(`- ${m.name} ${m.dosage || ""} | ${m.frequency || "Regular"} | ${m.duration || ""}`, 18, 55 + idx * 7);
        });
      }

      const blob = tempDoc.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      window.print();
    }
  };

  // Doctor inline patient edit state
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState("Male");

  const handleSaveDocPatient = () => {
    const updated = {
      ...selectedPatient,
      name: editName.trim() || selectedPatient.name,
      age: parseInt(editAge, 10) || selectedPatient.age,
      gender: editGender
    };
    setSelectedPatient(updated);
    if (selectedPatient.token === patientData.token) {
      setPatientData(updated);
    }
    setIsEditingPatient(false);
  };

  // Ensure newly arrived patient from Kiosk is selected
  useEffect(() => {
    if (patientData) {
      setSelectedPatient(patientData);
    }
  }, [patientData]);

  const handleDownloadPDF = (targetPatient = selectedPatient) => {
    try {
      const doc = generatePatientPDF(targetPatient, targetPatient.conversation || patientConversation);
      doc.save(`Doctor_Rx_${targetPatient.token || "105"}.pdf`);
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  const handleOpenPatientPDF = (targetPatient = selectedPatient, e) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    try {
      const doc = generatePatientPDF(targetPatient, targetPatient.conversation || patientConversation);
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error("PDF View error:", err);
      handleDownloadPDF(targetPatient);
    }
  };

  const handleCompleteConsultation = async () => {
    setConsultationStatus("completed");

    const updatedPatient = {
      ...selectedPatient,
      consultationStatus: "completed",
      doctorNotes: doctorNotes || "Consultation completed. Rx provided."
    };
    setSelectedPatient(updatedPatient);

    if (setActiveQueue) {
      setActiveQueue((prevQueue) => {
        const updated = prevQueue.map((p) =>
          p.token === selectedPatient.token
            ? { ...p, consultationStatus: "completed", doctorNotes: doctorNotes || "Consultation completed. Rx provided." }
            : p
        );
        localStorage.setItem("medikiosk_queue", JSON.stringify(updated));
        return updated;
      });
    }

    if (patientData && patientData.token === selectedPatient.token) {
      setPatientData(updatedPatient);
      localStorage.setItem("medikiosk_current_patient", JSON.stringify(updatedPatient));
    }

    try {
      await fetch(`/api/patient/${selectedPatient.token}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorNotes: doctorNotes || "Consultation completed. Rx provided." })
      });
    } catch (e) {
      console.warn("Server update notice:", e.message);
    }
    alert(`✅ Consultation for Patient Token #${selectedPatient.token} completed. Status updated to COMPLETED!`);
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "queue", label: "Patient Queue", icon: ClipboardList, badge: activeQueue.length },
    { id: "history", label: "Patient History", icon: History, badge: null },
    { id: "documents", label: "Documents", icon: FolderOpen, badge: "3" },
    { id: "timeline", label: "Timeline", icon: Clock, badge: null },
    { id: "settings", label: "Settings", icon: Settings, badge: null }
  ];

  // Completed patients mock for History
  const completedPatients = [
    {
      token: "098",
      name: "Harish Chandra",
      age: 52,
      gender: "Male",
      time: "09:15 AM",
      diagnosis: "Viral Upper Respiratory Infection",
      rx: "Tab. Paracetamol 650mg, Tab. Cetirizine 10mg, Steam inhalation",
      status: "Completed"
    },
    {
      token: "099",
      name: "Meena Kumari",
      age: 44,
      gender: "Female",
      time: "09:32 AM",
      diagnosis: "Type 2 Diabetes Routine Review",
      rx: "Tab. Metformin 500mg BD, Diet control advised",
      status: "Completed"
    },
    {
      token: "100",
      name: "Sanjay Dixit",
      age: 39,
      gender: "Male",
      time: "09:50 AM",
      diagnosis: "Acute Gastritis & Acid Reflux",
      rx: "Cap. Pantoprazole 40mg OD before breakfast x 14 days",
      status: "Completed"
    }
  ];

  const filteredHistory = completedPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
      p.token.includes(searchHistoryQuery) ||
      p.diagnosis.toLowerCase().includes(searchHistoryQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 min-h-[82vh]">
        {/* Left Sidebar */}
        <div className="w-full md:w-60 shrink-0 glass-card rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-1.5">
          <div className="flex items-center gap-3 p-3 mb-2 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Stethoscope size={20} />
            </div>
            <div>
              <span className="font-black text-base text-slate-900 block leading-tight">MediKiosk</span>
              <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest">Physician Desk</span>
            </div>
          </div>

          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = sidebarItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSidebarItem(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon size={17} className={isActive ? "text-white" : "text-slate-400"} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/25 text-white" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 rounded-2xl p-3.5 text-xs space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-blue-950 font-black text-[11px]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Kiosk #03 Connected</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                Live ABDM case channel synced with OPD Chamber #04.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-4">
          {/* Top Doctor Header Bar */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                DS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500 font-bold">OPD Chamber #04 • General Medicine</p>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Kiosk Sync
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 mt-0.5">Dr. Sharma, MD</h1>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2.5 text-xs">
              <div className="bg-amber-50/80 border border-amber-200/80 p-2.5 rounded-2xl text-center min-w-[75px]">
                <span className="text-xl font-black text-amber-700">
                  {activeQueue.filter((p) => p.consultationStatus !== "completed").length}
                </span>
                <br />
                <span className="text-slate-500 text-[10px] font-bold">Incomplete</span>
              </div>
              <div className="bg-emerald-50/80 border border-emerald-200/80 p-2.5 rounded-2xl text-center min-w-[75px]">
                <span className="text-xl font-black text-emerald-700">
                  {18 + activeQueue.filter((p) => p.consultationStatus === "completed").length}
                </span>
                <br />
                <span className="text-slate-500 text-[10px] font-bold">Completed</span>
              </div>
              <div className="bg-red-50/80 border border-red-200/80 p-2.5 rounded-2xl text-center min-w-[75px]">
                <span className="text-xl font-black text-red-600 animate-pulse">
                  {activeQueue.filter((p) => p.priority === "High Priority" || p.priority === "High").length}
                </span>
                <br />
                <span className="text-slate-500 text-[10px] font-bold">Priority</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-center min-w-[75px]">
                <span className="text-xl font-black text-slate-700">3.5m</span>
                <br />
                <span className="text-slate-500 text-[10px] font-bold">Avg / Pt</span>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 1. DASHBOARD VIEW: Analytics, OPD Load, Triage & Kiosk Metrics   */}
          {/* =============================================================== */}
          {sidebarItem === "dashboard" && (
            <div className="space-y-4">
              {/* Overview Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Footfall Today</span>
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">42</span>
                    <span className="text-xs text-emerald-600 font-bold">↑ +14% vs yesterday</span>
                  </div>
                  <p className="text-[11px] text-slate-400">36 through MediKiosk, 6 manual</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Time Saved / Patient</span>
                    <TrendingUp size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">4.8 min</span>
                    <span className="text-xs text-emerald-600 font-bold">Saved per case</span>
                  </div>
                  <p className="text-[11px] text-slate-400">History pre-collected before entry</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">High-Triage Alerts</span>
                    <AlertTriangle size={18} className="text-red-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-red-600">2</span>
                    <span className="text-xs text-red-600 font-bold">Immediate attention</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Chest pain + radiating symptoms</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Kiosk Intake Health</span>
                    <Cpu size={18} className="text-indigo-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-600">98.4%</span>
                    <span className="text-xs text-slate-500 font-bold">Completion</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Avg interview took 2.4 minutes</p>
                </div>
              </div>

              {/* Disease Distribution & Hourly Rush Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Clinical Categories Distribution */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Activity size={16} className="text-blue-600" />
                      <span>Today's Chief Complaint Trends</span>
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-slate-700">Cardiovascular & Chest Pain</span>
                        <span className="text-slate-900">32% (14 cases)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: "32%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-slate-700">Fever & Respiratory Illness</span>
                        <span className="text-slate-900">28% (12 cases)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-slate-700">Diabetes & Hypertension Routine</span>
                        <span className="text-slate-900">22% (9 cases)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "22%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-slate-700">Gastrointestinal & Acidity</span>
                        <span className="text-slate-900">18% (7 cases)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "18%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hourly Rush Heatmap & Queue Prediction */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      <span>OPD Rush by Hour</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold">Chamber #04</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {[
                      { hour: "08:00 - 09:00 AM", count: 8, level: "Moderate", bar: "50%", color: "bg-blue-400" },
                      { hour: "09:00 - 10:00 AM", count: 15, level: "Peak Rush", bar: "100%", color: "bg-red-500" },
                      { hour: "10:00 - 11:00 AM", count: 11, level: "High", bar: "75%", color: "bg-amber-500" },
                      { hour: "11:00 - 12:00 PM", count: 5, level: "Normal", bar: "35%", color: "bg-emerald-500" },
                      { hour: "12:00 - 01:00 PM", count: 3, level: "Low", bar: "20%", color: "bg-emerald-400" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700">
                        <span className="w-28 font-mono text-[11px] text-slate-500">{item.hour}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: item.bar }}></div>
                        </div>
                        <span className="w-12 text-right font-bold text-slate-900">{item.count} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kiosk Fleet & Network Status */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      <span>Hospital Kiosk Fleet</span>
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                      <div>
                        <strong className="text-emerald-950 block">Kiosk Unit #01 (Ground Floor)</strong>
                        <span className="text-[10px] text-emerald-700">OPD Main Entrance • 14 intakes</span>
                      </div>
                      <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        ONLINE
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                      <div>
                        <strong className="text-emerald-950 block">Kiosk Unit #02 (Cardiology Wing)</strong>
                        <span className="text-[10px] text-emerald-700">First Floor East • 9 intakes</span>
                      </div>
                      <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        ONLINE
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex justify-between items-center">
                      <div>
                        <strong className="text-blue-950 block">Kiosk Unit #03 (Chamber #04 Live)</strong>
                        <span className="text-[10px] text-blue-700">General OPD Corridor • Current</span>
                      </div>
                      <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                        SYNCED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 2. PATIENT QUEUE VIEW: Live Consultation Desk & Rx Writer        */}
          {/* =============================================================== */}
          {sidebarItem === "queue" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Left Column: Patient Queue Table */}
              <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Live OPD Patient Queue</h3>
                    <p className="text-[11px] text-slate-400">Select any patient to review their AI case sheet</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Search token or name..."
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs w-44 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500">
                        <th className="pb-2.5 font-bold">Token</th>
                        <th className="pb-2.5 font-bold">Patient Name</th>
                        <th className="pb-2.5 font-bold">Age/Sex</th>
                        <th className="pb-2.5 font-bold">Triage Priority</th>
                        <th className="pb-2.5 font-bold">Consultation Status</th>
                        <th className="pb-2.5 font-bold text-center">Case Sheet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeQueue.map((pt) => {
                        const isSelected = selectedPatient.token === pt.token;
                        const isLiveNew = pt.token === patientData.token;
                        const isCompleted = pt.consultationStatus === "completed";
                        return (
                          <tr
                            key={pt.token}
                            onClick={() => {
                              setSelectedPatient(pt);
                              setPatientData(pt);
                            }}
                            className={`border-b border-slate-100 cursor-pointer transition ${
                              isSelected
                                ? "bg-blue-50/90 font-medium"
                                : isLiveNew
                                ? "bg-emerald-50/60 hover:bg-emerald-50"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="py-3 font-mono font-bold text-slate-900 flex items-center gap-1.5">
                              {isLiveNew && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              )}
                              #{pt.token}
                            </td>
                            <td className="py-3">
                              <span className="font-bold text-slate-800 block">{pt.name}</span>
                              {isLiveNew && (
                                <span className="text-[10px] text-emerald-700 font-extrabold">
                                  Just Arrived from Kiosk
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-slate-600">
                              {pt.age}Y / {pt.gender?.[0] || "M"}
                            </td>
                            <td className="py-3">
                              {pt.priority === "High Priority" || pt.priority === "High" ? (
                                <span className="bg-red-100 text-red-700 font-extrabold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                                  <AlertTriangle size={10} /> High Priority
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">
                                  Standard
                                </span>
                              )}
                            </td>
                            <td className="py-3">
                              {isCompleted ? (
                                <span className="text-emerald-800 font-extrabold bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg text-[10px] inline-flex items-center gap-1 shadow-2xs">
                                  <CheckCircle2 size={11} className="text-emerald-600" /> Completed
                                </span>
                              ) : (
                                <span className="text-amber-800 font-bold bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-lg text-[10px] inline-flex items-center gap-1">
                                  <Clock size={11} className="text-amber-600" /> Incomplete
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-center">
                              <button
                                onClick={(e) => handleOpenPatientPDF(pt, e)}
                                className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                title="View Patient Case Sheet PDF in browser"
                              >
                                <Eye size={12} />
                                <span>View PDF ↗</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Patient Summary & Rx Panel */}
              <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                {/* Header with Tokens & PDF Download */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  {isEditingPatient ? (
                    <div className="space-y-2 flex-1 mr-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Patient Full Name"
                          className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          value={editAge}
                          onChange={(e) => setEditAge(e.target.value)}
                          placeholder="Age"
                          className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 w-16 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <select
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value)}
                          className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Male">M</option>
                          <option value="Female">F</option>
                          <option value="Other">O</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveDocPatient}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-3 py-1 rounded-lg cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditingPatient(false)}
                          className="bg-slate-200 text-slate-700 font-medium text-[11px] px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          TOKEN #{selectedPatient.token}
                        </span>
                        <span className="text-[10px] text-slate-400">ABHA: {selectedPatient.abhaId}</span>
                        {selectedPatient.consultationStatus === "completed" ? (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={11} className="text-emerald-600" /> Completed
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock size={11} className="text-amber-600" /> Incomplete
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <h3 className="font-black text-xl text-slate-900">{selectedPatient.name}</h3>
                        <button
                          onClick={() => {
                            setEditName(selectedPatient.name);
                            setEditAge(selectedPatient.age?.toString() || "48");
                            setEditGender(selectedPatient.gender || "Male");
                            setIsEditingPatient(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1 rounded-md text-[10px] font-bold flex items-center gap-0.5 transition cursor-pointer"
                          title="Edit Patient Name & Age"
                        >
                          <Edit size={12} /> Edit
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        {selectedPatient.age} Y / {selectedPatient.gender} • Intake Lang: {selectedPatient.language || "Hindi"}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenPatientPDF(selectedPatient)}
                      title="View Case Sheet PDF directly in browser"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs shadow-sm"
                    >
                      <Eye size={13} /> View PDF ↗
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(selectedPatient)}
                      title="Download Case Sheet PDF"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 p-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                    >
                      <Download size={15} />
                    </button>
                  </div>
                </div>

                {/* Priority Alert Banner */}
                {(selectedPatient.priority === "High Priority" || selectedPatient.priority === "High") && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-xs text-red-800 flex items-start gap-2">
                    <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Priority Triage Case:</strong>
                      <p className="text-[11px] mt-0.5">{selectedPatient.triageReason}</p>
                    </div>
                  </div>
                )}

                {/* Panel Tabs: Summary vs AI Chat Transcript */}
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  <button
                    onClick={() => setActivePanelTab("summary")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activePanelTab === "summary"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Structured Case
                  </button>
                  <button
                    onClick={() => setActivePanelTab("chat")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      activePanelTab === "chat"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <MessageSquare size={13} />
                    <span>Kiosk Chat Transcript</span>
                  </button>
                </div>

                {/* TAB 1: Structured Case Summary */}
                {activePanelTab === "summary" && (
                  <div className="space-y-2.5 text-xs">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <strong className="text-slate-500 block text-[10px] uppercase font-bold">
                        Chief Complaint (CC)
                      </strong>
                      <p className="text-slate-900 font-bold mt-0.5 text-sm">
                        {selectedPatient.chiefComplaint}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <strong className="text-slate-500 block text-[10px] uppercase font-bold">
                        History of Present Illness (HPI)
                      </strong>
                      <p className="text-slate-800 mt-0.5 leading-relaxed">
                        {selectedPatient.caseData?.hpi}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <strong className="text-slate-500 block text-[10px] uppercase font-bold">
                        Past History & Regular Medications
                      </strong>
                      <p className="text-slate-800 mt-0.5 font-medium">
                        {selectedPatient.caseData?.pastHistory}
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        Meds: {Array.isArray(selectedPatient.caseData?.currentMeds) ? selectedPatient.caseData.currentMeds.join(", ") : "None reported"}
                      </p>
                      <p className="text-red-700 font-bold mt-0.5">
                        Allergy: {Array.isArray(selectedPatient.caseData?.allergies) ? selectedPatient.caseData.allergies.join(", ") : "None reported"}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: Full Kiosk AI Chat Transcript */}
                {activePanelTab === "chat" && (
                  <div className="space-y-2 text-xs max-h-72 overflow-y-auto pr-1">
                    {selectedPatient.conversation && selectedPatient.conversation.length > 0 ? (
                      selectedPatient.conversation.map((msg, i) => (
                        <div
                          key={i}
                          className={`p-2.5 rounded-xl ${
                            msg.sender === "patient"
                              ? "bg-blue-50 border border-blue-200 text-blue-900 ml-4"
                              : "bg-slate-50 border border-slate-200 text-slate-800 mr-4"
                          }`}
                        >
                          <span className="text-[10px] font-bold block mb-0.5 text-slate-400">
                            {msg.sender === "patient" ? "👤 Patient" : "🤖 MediKiosk AI"} • {msg.time}
                          </span>
                          <p className="whitespace-pre-line font-medium">{msg.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-400">
                        <p>Kiosk interview recorded via standard voice protocol.</p>
                        <p className="text-[10px] mt-1">Review structured clinical case for details.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Doctor Prescription & Consultation Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <label className="text-[10px] font-bold uppercase text-slate-500 block">
                    Physician Rx / Clinical Advice:
                  </label>
                  <textarea
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="Type doctor advice, lab orders or prescription..."
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab("summary")}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Edit size={14} /> Edit Summary
                    </button>
                    {selectedPatient.consultationStatus === "completed" ? (
                      <button
                        onClick={() => alert(`Consultation for Token #${selectedPatient.token} is already completed!`)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                      >
                        <CheckCircle2 size={14} /> Consultation Completed ✓
                      </button>
                    ) : (
                      <button
                        onClick={handleCompleteConsultation}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                      >
                        <CheckCircle2 size={14} /> Complete Consultation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 3. PATIENT HISTORY VIEW: Search & Review Past Consultations      */}
          {/* =============================================================== */}
          {sidebarItem === "history" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Patient Consultation History & Records</h2>
                  <p className="text-xs text-slate-500">Search past completed cases, prescriptions & discharge notes</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchHistoryQuery}
                    onChange={(e) => setSearchHistoryQuery(e.target.value)}
                    placeholder="Search by name, token, or diagnosis..."
                    className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="pb-3 font-bold">Token</th>
                      <th className="pb-3 font-bold">Patient Name</th>
                      <th className="pb-3 font-bold">Age / Gender</th>
                      <th className="pb-3 font-bold">Consultation Time</th>
                      <th className="pb-3 font-bold">Diagnosis / Assessment</th>
                      <th className="pb-3 font-bold">Prescription Advice</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((item) => (
                      <tr key={item.token} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-mono font-bold text-slate-900">#{item.token}</td>
                        <td className="py-3 font-extrabold text-slate-800">{item.name}</td>
                        <td className="py-3 text-slate-600">{item.age} Y / {item.gender}</td>
                        <td className="py-3 text-slate-500">{item.time} Today</td>
                        <td className="py-3 font-semibold text-blue-900">{item.diagnosis}</td>
                        <td className="py-3 text-slate-600 max-w-xs truncate">{item.rx}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setSelectedHistoryModal(item)}
                            className="bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                          >
                            View Record
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 4. DOCUMENTS REPOSITORY VIEW: All Scanned Prescriptions & Reports*/}
          {/* =============================================================== */}
          {sidebarItem === "documents" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Digitized Medical Documents Repository</h2>
                  <p className="text-xs text-slate-500">All OCR scanned prescriptions, lab results & imaging reports</p>
                </div>

                <div className="flex gap-2 text-xs">
                  {["all", "prescriptions", "lab", "discharge"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDocFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition capitalize cursor-pointer ${
                        docFilter === cat
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockSampleDocuments.map((docItem) => (
                  <div
                    key={docItem.id}
                    className="bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-3xl p-5 space-y-3 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          {docItem.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{docItem.date}</span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-2">{docItem.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{docItem.hospital}</p>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Extracted Findings:</span>
                      <p className="font-semibold text-slate-800">{docItem.extractedData.diagnosis}</p>
                      <p className="text-[11px] text-slate-600">{docItem.extractedData.vitals}</p>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedDocModal(docItem)}
                        className="flex-1 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Eye size={13} /> View OCR
                      </button>
                      <button
                        onClick={() => handleDownloadSingleDoc(docItem)}
                        title="Download Document PDF"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-2 rounded-xl transition cursor-pointer"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 5. TIMELINE VIEW: Patient Longitudinal Health History            */}
          {/* =============================================================== */}
          {sidebarItem === "timeline" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Patient Longitudinal Health Timeline
                  </h2>
                  <p className="text-xs text-slate-500">
                    Chronological audit of {selectedPatient.name}'s prior hospital visits, ECGs, tests & prescriptions
                  </p>
                </div>
                <span className="bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-xl">
                  Token #{selectedPatient.token}
                </span>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-6 border-l-2 border-blue-200 space-y-6 my-4">
                {[
                  {
                    date: "15 Jan 2026",
                    title: "12-Lead ECG Investigation",
                    source: "District OPD OCR Scan",
                    summary: "Sinus Rhythm with mild ST segment elevation in II, III, aVF. Early cardiac review indicated.",
                    badge: "Verified Test"
                  },
                  {
                    date: "02 Oct 2025",
                    title: "Comprehensive Metabolic & Blood Panel",
                    source: "City Diagnostics Lab",
                    summary: "Hb: 14.2 g/dL (Normal), BP: 154/96 mmHg (Elevated Stage 2), HbA1c: 5.9% (Pre-diabetic).",
                    badge: "Lab Report"
                  },
                  {
                    date: "10 Jun 2025",
                    title: "General Medicine OPD Consultation",
                    source: "Government Hospital OPD",
                    summary: "Tab. Amlodipine 5mg OD + Tab. Telmisartan 40mg prescribed for persistent hypertension.",
                    badge: "Prescription"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-xs"></div>
                    <div className="bg-slate-50 hover:bg-blue-50/40 p-4 rounded-2xl border border-slate-200 transition space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="bg-blue-100 text-blue-900 font-extrabold px-2.5 py-0.5 rounded-lg text-[10px]">
                          {item.date}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.source}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 6. SETTINGS VIEW: Doctor Chamber & AI Triage Configuration       */}
          {/* =============================================================== */}
          {sidebarItem === "settings" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-lg font-black text-slate-900">OPD Chamber & AI Triage Configuration</h2>
                <p className="text-xs text-slate-500">Configure chamber credentials, AI sensitivity & kiosk alerts</p>
              </div>

              {settingsSaved && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span>Settings updated successfully! Changes applied to Chamber #04.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Doctor Credentials */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider block text-[11px]">
                    Doctor Profile & Chamber
                  </span>
                  <div>
                    <label className="text-slate-500 block mb-1">Doctor Name:</label>
                    <input
                      type="text"
                      defaultValue="Dr. Sharma, MD"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">MCI Registration Number:</label>
                    <input
                      type="text"
                      defaultValue="MCI-49821-DELHI"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Assigned OPD Chamber:</label>
                    <input
                      type="text"
                      defaultValue="Chamber #04 (General Medicine OPD)"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* AI Triage & Alert Preferences */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider block text-[11px]">
                    AI Kiosk Triage Settings
                  </span>

                  <div>
                    <label className="text-slate-500 block mb-1">Triage Sensitivity Level:</label>
                    <select
                      value={triageSensitivity}
                      onChange={(e) => setTriageSensitivity(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                    >
                      <option>High (Standard Clinical Protocol)</option>
                      <option>Medium (Urgent Symptoms Only)</option>
                      <option>Emergency Flagging Only</option>
                    </select>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableSoundAlerts}
                        onChange={(e) => setEnableSoundAlerts(e.target.checked)}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span className="font-bold text-slate-800">
                        Play Audio Chime on Priority Triage Detection
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoOpenNewIntakes}
                        onChange={(e) => setAutoOpenNewIntakes(e.target.checked)}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span className="font-bold text-slate-800">
                        Auto-select incoming kiosk patient in queue
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 2500);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Save size={15} /> Save Chamber Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Digtized Document Viewer Modal */}
      {selectedDocModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  {selectedDocModal.type}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{selectedDocModal.title}</h3>
                <p className="text-xs text-slate-500">{selectedDocModal.hospital} • {selectedDocModal.date}</p>
              </div>
              <button
                onClick={() => setSelectedDocModal(null)}
                className="bg-slate-100 hover:bg-slate-200 p-2 rounded-xl text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document Details Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Physician:</span>
                <strong className="text-slate-900">{selectedDocModal.doctor}</strong>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-slate-500">Clinical Diagnosis:</span>
                <strong className="text-blue-900">{selectedDocModal.extractedData?.diagnosis}</strong>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-slate-500">Vitals Recorded:</span>
                <span className="text-slate-800 font-mono">{selectedDocModal.extractedData?.vitals}</span>
              </div>
            </div>

            {/* Prescribed Medications */}
            {selectedDocModal.extractedData?.medications?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Prescribed Medications (Rx):
                </h4>
                <div className="space-y-1.5">
                  {selectedDocModal.extractedData.medications.map((m, idx) => (
                    <div key={idx} className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex justify-between text-xs">
                      <strong className="text-slate-900">{m.name} {m.dosage}</strong>
                      <span className="text-slate-600">{m.frequency} — {m.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investigations */}
            {selectedDocModal.extractedData?.investigations?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Lab Investigations & Findings:
                </h4>
                <div className="space-y-1">
                  {selectedDocModal.extractedData.investigations.map((inv, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{inv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                onClick={() => handleOpenDocInNewTab(selectedDocModal)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open in New Tab ↗</span>
              </button>
              <button
                onClick={() => handleDownloadSingleDoc(selectedDocModal)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Patient History Record Modal */}
      {selectedHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  Archived Consultation Record
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{selectedHistoryModal.name}</h3>
                <p className="text-xs text-slate-500">Token #{selectedHistoryModal.token} • {selectedHistoryModal.time} Today</p>
              </div>
              <button
                onClick={() => setSelectedHistoryModal(null)}
                className="bg-slate-100 hover:bg-slate-200 p-2 rounded-xl text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <p><strong>Age/Gender:</strong> {selectedHistoryModal.age} Y / {selectedHistoryModal.gender}</p>
              <p><strong>Primary Diagnosis:</strong> <span className="text-blue-900 font-bold">{selectedHistoryModal.diagnosis}</span></p>
              <p><strong>Prescription Issued:</strong> {selectedHistoryModal.rx}</p>
              <p><strong>Status:</strong> <span className="text-emerald-700 font-bold">✓ Consultation Completed</span></p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                Print Record
              </button>
              <button
                onClick={() => setSelectedHistoryModal(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
