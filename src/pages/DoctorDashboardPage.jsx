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

const isPatientCompleted = (p) => {
  if (!p) return false;
  return p.consultationStatus === "completed" || String(p.status).toLowerCase() === "completed";
};

const isTokenMatch = (t1, t2) => {
  if (t1 === undefined || t1 === null || t2 === undefined || t2 === null) return false;
  return String(t1).trim() === String(t2).trim();
};

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
  const [sidebarItem, setSidebarItem] = useState("queue"); // "dashboard", "queue", "history", "documents", "settings"
  const [doctorNotes, setDoctorNotes] = useState("");
  const [activePanelTab, setActivePanelTab] = useState("summary"); // "summary", "chat"
  const [consultationStatus, setConsultationStatus] = useState("waiting");
  const [queueFilter, setQueueFilter] = useState("all"); // "all", "incomplete", "completed"
  const [searchQueueQuery, setSearchQueueQuery] = useState("");
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
      tempDoc.text(`Document: ${docItem.title} | Hospital Visit Date: ${docItem.visitDate || docItem.date}`, 14, 22);
      tempDoc.text(`Consulting Physician: ${docItem.doctor || "Dr. K. S. Verma (MD)"}`, 14, 28);
      tempDoc.text(`Clinical Diagnosis: ${docItem.extractedData?.diagnosis || "OPD Case"}`, 14, 38);

      let currentY = 48;
      if (docItem.extractedData?.medications?.length > 0) {
        tempDoc.setFont("helvetica", "bold");
        tempDoc.text("Doctor Prescribed Medications (Rx):", 14, currentY);
        currentY += 7;
        tempDoc.setFont("helvetica", "normal");
        docItem.extractedData.medications.forEach((m) => {
          tempDoc.text(`- ${m.name} ${m.dosage || ""} | ${m.frequency || "Regular"} | Duration: ${m.duration || ""}`, 18, currentY);
          currentY += 7;
        });
        currentY += 3;
      }

      if (docItem.extractedData?.investigations?.length > 0) {
        tempDoc.setFont("helvetica", "bold");
        tempDoc.text("Diagnostic Investigations & Tests:", 14, currentY);
        currentY += 7;
        tempDoc.setFont("helvetica", "normal");
        docItem.extractedData.investigations.forEach((inv) => {
          tempDoc.text(`• ${inv}`, 18, currentY);
          currentY += 6;
        });
        currentY += 3;
      }

      if (docItem.extractedData?.doctorAdvice) {
        tempDoc.setFont("helvetica", "bold");
        tempDoc.text("Doctor Advice / Instructions:", 14, currentY);
        currentY += 7;
        tempDoc.setFont("helvetica", "normal");
        tempDoc.text(docItem.extractedData.doctorAdvice, 18, currentY);
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
      tempDoc.text(`Document: ${docItem.title} | Hospital Visit Date: ${docItem.visitDate || docItem.date}`, 14, 22);
      tempDoc.text(`Consulting Physician: ${docItem.doctor || "Dr. K. S. Verma (MD)"}`, 14, 28);
      tempDoc.text(`Clinical Diagnosis: ${docItem.extractedData?.diagnosis || "OPD Case"}`, 14, 38);

      let currentY = 48;
      if (docItem.extractedData?.medications?.length > 0) {
        tempDoc.setFont("helvetica", "bold");
        tempDoc.text("Doctor Prescribed Medications (Rx):", 14, currentY);
        currentY += 7;
        tempDoc.setFont("helvetica", "normal");
        docItem.extractedData.medications.forEach((m) => {
          tempDoc.text(`- ${m.name} ${m.dosage || ""} | ${m.frequency || "Regular"} | Duration: ${m.duration || ""}`, 18, currentY);
          currentY += 7;
        });
        currentY += 3;
      }

      if (docItem.extractedData?.investigations?.length > 0) {
        tempDoc.setFont("helvetica", "bold");
        tempDoc.text("Diagnostic Investigations & Tests:", 14, currentY);
        currentY += 7;
        tempDoc.setFont("helvetica", "normal");
        docItem.extractedData.investigations.forEach((inv) => {
          tempDoc.text(`• ${inv}`, 18, currentY);
          currentY += 6;
        });
        currentY += 3;
      }

      if (docItem.extractedData?.doctorAdvice) {
        tempDoc.setFont("helvetica", "bold");
        tempDoc.text("Doctor Advice / Instructions:", 14, currentY);
        currentY += 7;
        tempDoc.setFont("helvetica", "normal");
        tempDoc.text(docItem.extractedData.doctorAdvice, 18, currentY);
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
    if (isTokenMatch(selectedPatient?.token, patientData?.token)) {
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

  const handleToggleConsultationStatus = (token, e, explicitStatus = null) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    const currentQueue = activeQueue || [];
    const target =
      currentQueue.find((p) => isTokenMatch(p.token, token)) ||
      (isTokenMatch(selectedPatient?.token, token) ? selectedPatient : null) ||
      selectedPatient;
    if (!target) return;

    const currentCompleted = isPatientCompleted(target);
    const newStatus =
      explicitStatus !== null
        ? explicitStatus
        : currentCompleted
        ? "incomplete"
        : "completed";
    const notes = doctorNotes || target.doctorNotes || "Consultation completed. Rx provided.";

    const updatedPatient = {
      ...target,
      consultationStatus: newStatus,
      status: newStatus,
      doctorNotes: notes
    };

    if (isTokenMatch(selectedPatient?.token, token)) {
      setSelectedPatient(updatedPatient);
    }
    if (patientData && isTokenMatch(patientData.token, token)) {
      setPatientData(updatedPatient);
      localStorage.setItem("medikiosk_current_patient", JSON.stringify(updatedPatient));
    }

    if (setActiveQueue) {
      setActiveQueue((prevQueue) => {
        const next = prevQueue.map((p) =>
          isTokenMatch(p.token, token)
            ? { ...p, consultationStatus: newStatus, status: newStatus, doctorNotes: notes }
            : p
        );
        localStorage.setItem("medikiosk_queue", JSON.stringify(next));
        return next;
      });
    }

    try {
      fetch(`/api/patient/${token}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorNotes: notes, consultationStatus: newStatus, status: newStatus })
      }).catch((err) => console.warn("Background API sync notice:", err));
    } catch (err) {
      console.warn("Server update notice:", err.message);
    }
  };

  const handleCompleteConsultation = (e) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    if (!selectedPatient) return;
    setConsultationStatus("completed");
    handleToggleConsultationStatus(selectedPatient.token, e, "completed");
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "queue", label: "Patient Queue", icon: ClipboardList, badge: activeQueue.length },
    { id: "history", label: "Patient History", icon: History, badge: null },
    { id: "documents", label: "Documents", icon: FolderOpen, badge: "3" },
    { id: "settings", label: "Settings", icon: Settings, badge: null }
  ];

  // Base Completed patients for History (18 completed consultations with full data)
  const baseCompletedPatients = [
    {
      token: "100",
      name: "Sanjay Dixit",
      age: 39,
      gender: "Male",
      time: "09:50 AM",
      diagnosis: "Acute Gastritis & Acid Reflux",
      rx: "Cap. Pantoprazole 40mg OD before breakfast x 14 days, Syr. Digene 10ml TDS",
      status: "Completed",
      caseData: {
        chiefComplaint: "Severe burning in epigastrium and acid regurgitation",
        pastHistory: "Occasional dyspepsia, heavy tea consumption",
        currentMeds: ["Cap. Pantoprazole 40mg OD", "Syr. Digene 10ml TDS"],
        allergies: ["None"],
        familyHistory: "No significant history"
      }
    },
    {
      token: "099",
      name: "Meena Kumari",
      age: 44,
      gender: "Female",
      time: "09:35 AM",
      diagnosis: "Type 2 Diabetes Mellitus Routine Review",
      rx: "Tab. Metformin 500mg BD after meals, Dietary lifestyle counseling",
      status: "Completed",
      caseData: {
        chiefComplaint: "Routine 3-month follow-up for diabetes blood sugar check",
        pastHistory: "T2DM x 5 years",
        currentMeds: ["Tab. Metformin 500mg BD", "Tab. Atorvastatin 10mg HS"],
        allergies: ["None"],
        familyHistory: "Mother diabetic"
      }
    },
    {
      token: "098",
      name: "Harish Chandra",
      age: 52,
      gender: "Male",
      time: "09:20 AM",
      diagnosis: "Viral Upper Respiratory Tract Infection",
      rx: "Tab. Paracetamol 650mg TDS x 3d, Tab. Cetirizine 10mg HS x 5d, Steam inhalation",
      status: "Completed",
      caseData: {
        chiefComplaint: "Fever, running nose and sore throat since 2 days",
        pastHistory: "Hypertension on Telmisartan 40mg",
        currentMeds: ["Tab. Telmisartan 40mg OD", "Tab. Paracetamol 650mg"],
        allergies: ["Sulpha drugs"],
        familyHistory: "Father had CAD"
      }
    },
    {
      token: "097",
      name: "Sunita Agarwal",
      age: 49,
      gender: "Female",
      time: "09:05 AM",
      diagnosis: "Essential Hypertension (Stage 1)",
      rx: "Tab. Telmisartan 40mg OD morning, Low sodium diet, BP log chart",
      status: "Completed",
      caseData: {
        chiefComplaint: "Mild occipital headache and morning heaviness",
        pastHistory: "New onset high BP (148/92 mmHg)",
        currentMeds: ["Tab. Telmisartan 40mg OD"],
        allergies: ["None"],
        familyHistory: "Hypertensive parents"
      }
    },
    {
      token: "096",
      name: "Vikram Malhotra",
      age: 34,
      gender: "Male",
      time: "08:52 AM",
      diagnosis: "Acute Lumbar Muscle Strain",
      rx: "Tab. Aceclofenac + Paracetamol BD x 5d, Tab. Thiocolchicoside 4mg BD, Hot compress",
      status: "Completed",
      caseData: {
        chiefComplaint: "Lower back pain after lifting luggage yesterday",
        pastHistory: "No prior spine issue",
        currentMeds: ["Tab. Aceclofenac 100mg + Paracetamol 325mg"],
        allergies: ["None"],
        familyHistory: "Unremarkable"
      }
    },
    {
      token: "095",
      name: "Kavita Joshi",
      age: 28,
      gender: "Female",
      time: "08:40 AM",
      diagnosis: "Iron Deficiency Anemia",
      rx: "Tab. Ferrous Ascorbate + Folic Acid OD after dinner x 2 months, High iron diet",
      status: "Completed",
      caseData: {
        chiefComplaint: "Easy fatigue, pale conjunctiva, lethargy for 1 month",
        pastHistory: "Heavy menstrual bleeding",
        currentMeds: ["Tab. Ferrous Ascorbate 100mg OD"],
        allergies: ["None"],
        familyHistory: "No history"
      }
    },
    {
      token: "094",
      name: "Rajeshwar Pandey",
      age: 63,
      gender: "Male",
      time: "08:30 AM",
      diagnosis: "Bilateral Knee Osteoarthritis (Grade 2)",
      rx: "Tab. Glucosamine + Chondroitin OD, Paracetamol 650mg SOS for joint pain, Physiotherapy",
      status: "Completed",
      caseData: {
        chiefComplaint: "Knee pain worse on climbing stairs and morning stiffness",
        pastHistory: "Osteoarthritis x 3 years",
        currentMeds: ["Tab. Calcium + Vit D3 OD", "Paracetamol SOS"],
        allergies: ["None"],
        familyHistory: "Mother had joint arthritis"
      }
    },
    {
      token: "093",
      name: "Anita Mukherjee",
      age: 36,
      gender: "Female",
      time: "08:18 AM",
      diagnosis: "Primary Tension Headache",
      rx: "Tab. Naproxen 250mg SOS, Sleep hygiene counseling, Stress reduction",
      status: "Completed",
      caseData: {
        chiefComplaint: "Band-like dull headache in frontal region after screen work",
        pastHistory: "Recurrent stress headaches",
        currentMeds: ["Tab. Naproxen 250mg SOS"],
        allergies: ["Aspirin"],
        familyHistory: "None"
      }
    },
    {
      token: "092",
      name: "Mohan Lal Gupta",
      age: 58,
      gender: "Male",
      time: "08:05 AM",
      diagnosis: "Dyslipidemia & Fatty Liver (Grade 1)",
      rx: "Tab. Rosuvastatin 10mg HS, Liver function follow-up in 6 weeks, 45 min brisk walk",
      status: "Completed",
      caseData: {
        chiefComplaint: "Routine executive health review, elevated total cholesterol 242 mg/dL",
        pastHistory: "Sedentary lifestyle",
        currentMeds: ["Tab. Rosuvastatin 10mg HS"],
        allergies: ["None"],
        familyHistory: "Brother had premature CAD"
      }
    },
    {
      token: "091",
      name: "Pooja Verma",
      age: 24,
      gender: "Female",
      time: "07:55 AM",
      diagnosis: "Acute Bacterial Pharyngitis",
      rx: "Tab. Amoxicillin-Clavulanate 625mg BD x 5d, Warm salt gargles, Paracetamol 650mg BD",
      status: "Completed",
      caseData: {
        chiefComplaint: "Severe throat pain with difficulty swallowing for 2 days",
        pastHistory: "Recurrent tonsillitis in childhood",
        currentMeds: ["Tab. Augmentin 625mg BD", "Tab. Paracetamol 650mg"],
        allergies: ["None"],
        familyHistory: "None"
      }
    },
    {
      token: "090",
      name: "Deepak Choudhary",
      age: 41,
      gender: "Male",
      time: "07:44 AM",
      diagnosis: "Allergic Rhinitis & Sinus Congestion",
      rx: "Nasal Fluticasone Spray 2 puffs OD x 14d, Tab. Bilastine 20mg OD HS",
      status: "Completed",
      caseData: {
        chiefComplaint: "Sneezing attacks, nasal blockage and itchy eyes every morning",
        pastHistory: "Seasonal allergy x 6 years",
        currentMeds: ["Fluticasone nasal spray", "Tab. Bilastine 20mg OD"],
        allergies: ["Dust mite, pollen"],
        familyHistory: "Father had bronchial asthma"
      }
    },
    {
      token: "089",
      name: "Shanti Devi",
      age: 67,
      gender: "Female",
      time: "07:35 AM",
      diagnosis: "Primary Hypothyroidism Routine Follow-up",
      rx: "Tab. Levothyroxine 75mcg OD empty stomach 30 min before tea, Serum TSH in 2 months",
      status: "Completed",
      caseData: {
        chiefComplaint: "Thyroid medication dose titration, reports mild constipation",
        pastHistory: "Hypothyroidism x 8 years (TSH 5.8 mIU/L)",
        currentMeds: ["Tab. Thyronorm 75mcg OD"],
        allergies: ["None"],
        familyHistory: "Daughter has thyroid disorder"
      }
    },
    {
      token: "088",
      name: "Amitabh Sen",
      age: 46,
      gender: "Male",
      time: "07:22 AM",
      diagnosis: "Mild Bronchial Asthma Exacerbation",
      rx: "Inhaler Budesonide + Formoterol 200/6 2 puffs BD with spacer, Tab. Montelukast 10mg HS",
      status: "Completed",
      caseData: {
        chiefComplaint: "Nocturnal dry cough and mild wheezing past 3 nights",
        pastHistory: "Bronchial asthma diagnosed in 2018",
        currentMeds: ["Foracort 200 Inhaler BD", "Tab. Montelukast 10mg HS"],
        allergies: ["Cold air, pet dander"],
        familyHistory: "Mother had allergic bronchitis"
      }
    },
    {
      token: "087",
      name: "Rekha Sharma",
      age: 33,
      gender: "Female",
      time: "07:12 AM",
      diagnosis: "Acute Uncomplicated Cystitis (UTI)",
      rx: "Tab. Nitrofurantoin 100mg BD x 5d, Syr. Potassium Citrate 15ml TDS in water, High fluid intake",
      status: "Completed",
      caseData: {
        chiefComplaint: "Burning micturition, increased urinary frequency since yesterday",
        pastHistory: "No prior kidney stone",
        currentMeds: ["Tab. Nitrofurantoin 100mg BD"],
        allergies: ["Ciprofloxacin"],
        familyHistory: "Unremarkable"
      }
    },
    {
      token: "086",
      name: "Gopal Krishna",
      age: 55,
      gender: "Male",
      time: "07:02 AM",
      diagnosis: "Chronic Plaque Psoriasis",
      rx: "Clobetasol + Salicylic acid ointment topically BD, Calcipotriol cream OD, Emollient moisturizers",
      status: "Completed",
      caseData: {
        chiefComplaint: "Silvery scaly red patches over bilateral elbows and extensor knees",
        pastHistory: "Psoriasis vulgaris x 7 years",
        currentMeds: ["Topical steroid ointment", "Liquid paraffin moisturizer"],
        allergies: ["None"],
        familyHistory: "Paternal uncle had psoriasis"
      }
    },
    {
      token: "085",
      name: "Manju Singhal",
      age: 51,
      gender: "Female",
      time: "06:50 AM",
      diagnosis: "Post-Viral Asthenia & Myalgia",
      rx: "Tab. Multivitamin with Methylcobalamin OD x 30d, Adequate hydration and protein intake",
      status: "Completed",
      caseData: {
        chiefComplaint: "Generalized weakness and calf muscle ache following viral fever last week",
        pastHistory: "Recent episode of dengue (recovered, platelets 2.1 lakh)",
        currentMeds: ["Multivitamin capsules OD"],
        allergies: ["None"],
        familyHistory: "None"
      }
    },
    {
      token: "084",
      name: "Naresh Yadav",
      age: 38,
      gender: "Male",
      time: "06:40 AM",
      diagnosis: "Mild Conjunctivitis (Bacterial)",
      rx: "Moxifloxacin 0.5% Eye Drops 1 drop 4 times daily x 5d, Cold eye compress, Hand hygiene",
      status: "Completed",
      caseData: {
        chiefComplaint: "Redness, grittiness and mild yellow discharge in right eye since morning",
        pastHistory: "No visual acuity reduction",
        currentMeds: ["Moxifloxacin eye drops"],
        allergies: ["None"],
        familyHistory: "None"
      }
    },
    {
      token: "083",
      name: "Bimla Devi",
      age: 72,
      gender: "Female",
      time: "06:30 AM",
      diagnosis: "Senile Osteopenia & Vitamin D Deficiency",
      rx: "Sachet Cholecalciferol 60,000 IU once weekly x 8 weeks with milk, Tab. Calcium Carbonate 500mg OD",
      status: "Completed",
      caseData: {
        chiefComplaint: "Generalized body aches and bone pain, low Vitamin D (11 ng/mL)",
        pastHistory: "Post-menopausal osteoporosis",
        currentMeds: ["Cholecalciferol 60k sachet weekly", "Tab. Shelcal 500mg OD"],
        allergies: ["None"],
        familyHistory: "No fracture history"
      }
    }
  ];

  // Dynamically include any completed patients from active queue
  const queueCompleted = (activeQueue || [])
    .filter((p) => isPatientCompleted(p))
    .map((p) => ({
      token: p.token,
      name: p.name,
      age: p.age,
      gender: p.gender,
      time: p.intakeTime || "Just Now",
      diagnosis: p.chiefComplaint || "OPD Consultation",
      rx: p.doctorNotes || "Consultation Completed",
      status: "Completed",
      patientObj: p
    }));

  const allCompletedPatients = [...queueCompleted, ...baseCompletedPatients];

  const filteredHistory = allCompletedPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
      p.token.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
      (p.diagnosis && p.diagnosis.toLowerCase().includes(searchHistoryQuery.toLowerCase()))
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
              <span className="font-black text-base text-slate-900 block leading-tight">MedSync</span>
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
                  {activeQueue.filter((p) => !isPatientCompleted(p)).length}
                </span>
                <br />
                <span className="text-slate-500 text-[10px] font-bold">Incomplete</span>
              </div>
              <div className="bg-emerald-50/80 border border-emerald-200/80 p-2.5 rounded-2xl text-center min-w-[75px]">
                <span className="text-xl font-black text-emerald-700">
                  {allCompletedPatients.length}
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
                  <p className="text-[11px] text-slate-400">36 through MedSync, 6 manual</p>
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
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              {/* Left Column: Patient Queue Table */}
              <div className="xl:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5 min-w-0">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Live OPD Patient Queue</h3>
                    <p className="text-[11px] text-slate-400">Select any patient or click status to mark complete</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
                      <button
                        onClick={() => setQueueFilter("all")}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          queueFilter === "all" ? "bg-white text-blue-700 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        All ({activeQueue.length})
                      </button>
                      <button
                        onClick={() => setQueueFilter("incomplete")}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                          queueFilter === "incomplete" ? "bg-white text-amber-700 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Clock size={11} className="text-amber-600" />
                        Incomplete ({activeQueue.filter((p) => !isPatientCompleted(p)).length})
                      </button>
                      <button
                        onClick={() => setQueueFilter("completed")}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                          queueFilter === "completed" ? "bg-white text-emerald-700 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        Completed ({activeQueue.filter((p) => isPatientCompleted(p)).length})
                      </button>
                    </div>

                    <input
                      type="text"
                      value={searchQueueQuery}
                      onChange={(e) => setSearchQueueQuery(e.target.value)}
                      placeholder="Search token / name..."
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-xs w-36 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[560px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500 bg-slate-50/70">
                        <th className="px-3 py-2.5 font-extrabold whitespace-nowrap rounded-l-xl w-16">Token</th>
                        <th className="px-3 py-2.5 font-extrabold min-w-[130px]">Patient Name</th>
                        <th className="px-3 py-2.5 font-extrabold whitespace-nowrap w-20">Age / Sex</th>
                        <th className="px-3 py-2.5 font-extrabold whitespace-nowrap w-28">Triage Priority</th>
                        <th className="px-3 py-2.5 font-extrabold whitespace-nowrap w-36">Consultation Status</th>
                        <th className="px-3 py-2.5 font-extrabold whitespace-nowrap text-center rounded-r-xl w-24">Case Sheet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeQueue
                        .filter((pt) => {
                          const matchesSearch =
                            pt.name.toLowerCase().includes(searchQueueQuery.toLowerCase()) ||
                            String(pt.token).toLowerCase().includes(searchQueueQuery.toLowerCase());
                          if (!matchesSearch) return false;
                          if (queueFilter === "incomplete") return !isPatientCompleted(pt);
                          if (queueFilter === "completed") return isPatientCompleted(pt);
                          return true;
                        })
                        .map((pt) => {
                          const isSelected = isTokenMatch(selectedPatient?.token, pt.token);
                          const isLiveNew = isTokenMatch(patientData?.token, pt.token);
                          const isCompleted = isPatientCompleted(pt);
                          return (
                            <tr
                              key={pt.token}
                              onClick={() => {
                                setSelectedPatient(pt);
                                setPatientData(pt);
                              }}
                              className={`cursor-pointer transition ${
                                isSelected
                                  ? "bg-blue-50/90 font-medium border-l-4 border-l-blue-600"
                                  : isCompleted
                                  ? "bg-emerald-50/20 hover:bg-emerald-50/40 border-l-4 border-l-emerald-500"
                                  : isLiveNew
                                  ? "bg-emerald-50/60 hover:bg-emerald-50"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              <td className="px-3 py-3.5 whitespace-nowrap">
                                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                                  {isCompleted ? (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Completed"></span>
                                  ) : isLiveNew ? (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                                  ) : null}
                                  <span>#{pt.token}</span>
                                </div>
                              </td>
                              <td className="px-3 py-3.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-extrabold text-slate-800 text-xs">
                                    {pt.name}
                                  </span>
                                  {isCompleted && (
                                    <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded inline-flex items-center gap-0.5 whitespace-nowrap">
                                      <Check size={10} strokeWidth={3} /> Done
                                    </span>
                                  )}
                                  {isLiveNew && !isCompleted && (
                                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded whitespace-nowrap">
                                      Live Intake
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-3.5 text-slate-600 whitespace-nowrap font-medium text-xs">
                                {pt.age}Y / {pt.gender?.[0] || "M"}
                              </td>
                              <td className="px-3 py-3.5 whitespace-nowrap">
                                {pt.priority === "High Priority" || pt.priority === "High" ? (
                                  <span className="bg-red-100 text-red-700 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1 whitespace-nowrap border border-red-200">
                                    <AlertTriangle size={10} className="shrink-0" /> High Priority
                                  </span>
                                ) : (
                                  <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                                    Standard
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-3.5 whitespace-nowrap">
                                {isCompleted ? (
                                  <button
                                    onClick={(e) => handleToggleConsultationStatus(pt.token, e, "incomplete")}
                                    className="text-emerald-800 font-extrabold bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-2.5 py-1 rounded-lg text-[10px] inline-flex items-center gap-1 shadow-2xs transition cursor-pointer whitespace-nowrap"
                                    title="Click to toggle back to incomplete"
                                  >
                                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                                    <span>Completed ✓</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => handleToggleConsultationStatus(pt.token, e, "completed")}
                                    className="text-amber-800 font-bold bg-amber-50 hover:bg-emerald-600 hover:text-white border border-amber-300 hover:border-emerald-600 px-2.5 py-1 rounded-lg text-[10px] inline-flex items-center gap-1 transition cursor-pointer group shadow-2xs whitespace-nowrap"
                                    title="Click to mark consultation as complete"
                                  >
                                    <Clock size={11} className="text-amber-600 group-hover:hidden shrink-0" />
                                    <Check size={11} className="hidden group-hover:inline text-white shrink-0" />
                                    <span className="group-hover:hidden">⏳ Incomplete</span>
                                    <span className="hidden group-hover:inline font-black">Mark Complete ✓</span>
                                  </button>
                                )}
                              </td>
                              <td className="px-3 py-3.5 text-center whitespace-nowrap">
                                <button
                                  onClick={(e) => handleOpenPatientPDF(pt, e)}
                                  className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap shadow-2xs"
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
              <div className="xl:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5 min-w-0">
                {/* Header with Tokens, ABHA & PDF Buttons */}
                <div className="border-b border-slate-100 pb-3 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-lg whitespace-nowrap">
                        TOKEN #{selectedPatient.token}
                      </span>
                      {isPatientCompleted(selectedPatient) ? (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                          <CheckCircle2 size={11} className="text-emerald-600" /> Completed
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                          <Clock size={11} className="text-amber-600" /> Incomplete
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenPatientPDF(selectedPatient)}
                        title="View Case Sheet PDF directly in browser"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs shadow-xs whitespace-nowrap"
                      >
                        <Eye size={13} /> View PDF ↗
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(selectedPatient)}
                        title="Download Case Sheet PDF"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 p-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold shrink-0"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Patient Name & Edit */}
                  {isEditingPatient ? (
                    <div className="space-y-2 pt-1">
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
                        <h3 className="font-black text-xl text-slate-900 leading-tight">{selectedPatient.name}</h3>
                        <button
                          onClick={() => {
                            setEditName(selectedPatient.name);
                            setEditAge(selectedPatient.age?.toString() || "48");
                            setEditGender(selectedPatient.gender || "Male");
                            setIsEditingPatient(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1 rounded-md text-[10px] font-bold flex items-center gap-0.5 transition cursor-pointer shrink-0"
                          title="Edit Patient Name & Age"
                        >
                          <Edit size={12} /> Edit
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>{selectedPatient.age} Y / {selectedPatient.gender}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-600 font-semibold bg-slate-100 px-1.5 py-0.2 rounded">
                          ABHA: {selectedPatient.abhaId}
                        </span>
                        <span>•</span>
                        <span>Lang: {selectedPatient.language || "Hindi"}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Consultation Status Banner */}
                {isPatientCompleted(selectedPatient) ? (
                  <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl flex items-center justify-between text-xs shadow-2xs gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-black text-emerald-950 block text-xs whitespace-nowrap">
                          CONSULTATION COMPLETED ✓
                        </span>
                        <span className="text-[10px] text-emerald-700 truncate block">
                          Patient case verified & marked complete
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleConsultationStatus(selectedPatient.token, null, "incomplete")}
                      className="bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
                    >
                      Undo / Re-open
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl flex items-center justify-between text-xs shadow-2xs gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock size={18} className="text-amber-600 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-extrabold text-amber-950 block text-xs whitespace-nowrap">
                          Consultation In Progress ⏳
                        </span>
                        <span className="text-[10px] text-amber-700 truncate block">
                          Mark as complete after reviewing case
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleConsultationStatus(selectedPatient.token, null, "completed")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-xs whitespace-nowrap shrink-0"
                    >
                      <Check size={12} /> Mark Complete ✓
                    </button>
                  </div>
                )}

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
                            {msg.sender === "patient" ? "👤 Patient" : "🤖 MedSync AI"} • {msg.time}
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
                    {isPatientCompleted(selectedPatient) ? (
                      <button
                        onClick={() => handleToggleConsultationStatus(selectedPatient.token, null, "incomplete")}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                        title="Click to toggle back to incomplete if needed"
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

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-left text-slate-500">
                      <th className="py-3 px-3.5 font-bold w-24">Token</th>
                      <th className="py-3 px-3.5 font-bold">Patient Name</th>
                      <th className="py-3 px-3.5 font-bold">Age / Gender</th>
                      <th className="py-3 px-3.5 font-bold">Consultation Time</th>
                      <th className="py-3 px-3.5 font-bold">Diagnosis / Assessment</th>
                      <th className="py-3 px-3.5 font-bold">Prescription Advice</th>
                      <th className="py-3 px-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredHistory.map((item) => (
                      <tr key={item.token} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-extrabold">
                            #{item.token}
                          </span>
                        </td>
                        <td className="py-3.5 px-3.5 font-extrabold text-slate-800 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="py-3.5 px-3.5 text-slate-600 whitespace-nowrap">
                          {item.age} Y / {item.gender}
                        </td>
                        <td className="py-3.5 px-3.5 text-slate-500 whitespace-nowrap">
                          {item.time} Today
                        </td>
                        <td className="py-3.5 px-3.5 font-semibold text-blue-900 max-w-xs">
                          {item.diagnosis}
                        </td>
                        <td className="py-3.5 px-3.5 text-slate-600 max-w-xs truncate" title={item.rx}>
                          {item.rx}
                        </td>
                        <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                const pt = item.patientObj || activeQueue.find((p) => isTokenMatch(p.token, item.token)) || {
                                  token: item.token,
                                  name: item.name,
                                  age: item.age,
                                  gender: item.gender,
                                  chiefComplaint: item.diagnosis,
                                  caseData: item.caseData || { pastHistory: "Normal", currentMeds: [item.rx], allergies: ["None"] }
                                };
                                handleOpenPatientPDF(pt);
                              }}
                              className="bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-extrabold px-2.5 py-1 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="View Patient OPD Case Sheet PDF in browser"
                            >
                              <Eye size={12} /> View PDF ↗
                            </button>
                            <button
                              onClick={() => setSelectedHistoryModal(item)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-xs transition cursor-pointer"
                            >
                              Record
                            </button>
                          </div>
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
                {mockSampleDocuments
                  .filter((docItem) => {
                    if (docFilter === "all") return true;
                    if (docFilter === "prescriptions") return docItem.type.toLowerCase().includes("prescription");
                    if (docFilter === "lab") return docItem.type.toLowerCase().includes("blood") || docItem.type.toLowerCase().includes("lab");
                    if (docFilter === "discharge") return docItem.type.toLowerCase().includes("discharge");
                    return true;
                  })
                  .map((docItem) => (
                    <div
                      key={docItem.id}
                      className="bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-3xl p-5 space-y-3.5 transition flex flex-col justify-between shadow-2xs hover:shadow-sm"
                    >
                      <div className="space-y-3">
                        {/* Top Badge + Visit Date */}
                        <div className="flex justify-between items-center">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                            {docItem.type}
                          </span>
                          <span className="bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                            <Calendar size={12} className="text-blue-600" />
                            <span>Visit: {docItem.visitDate || docItem.date}</span>
                          </span>
                        </div>

                        <div>
                          <h3 className="font-black text-slate-900 text-sm leading-snug">{docItem.title}</h3>
                          <p className="text-[11px] text-slate-700 font-bold mt-1 flex items-center gap-1">
                            <Stethoscope size={13} className="text-blue-600 shrink-0" />
                            <span className="truncate">{docItem.doctor}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{docItem.hospital}</p>
                        </div>

                        {/* Prescribed Medicines Box */}
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider flex items-center gap-1">
                              💊 Doctor Prescribed Medicines
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                              {docItem.extractedData?.medications?.length || 0} Meds
                            </span>
                          </div>

                          <div className="space-y-1">
                            {(docItem.extractedData?.medications || []).slice(0, 3).map((m, idx) => (
                              <div key={idx} className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                                <div className="truncate pr-1">
                                  <span className="font-bold text-slate-800 block truncate">{m.name} {m.dosage}</span>
                                  <span className="text-[10px] text-slate-500">{m.frequency?.split("(")[0]}</span>
                                </div>
                                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded shrink-0">
                                  {m.duration}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-slate-100 pt-1.5 text-[11px]">
                            <strong className="text-slate-500 text-[10px] uppercase block">Clinical Diagnosis:</strong>
                            <p className="font-bold text-blue-900 leading-snug mt-0.5">{docItem.extractedData.diagnosis}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setSelectedDocModal(docItem)}
                          className="flex-1 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          <Eye size={13} /> View OCR & Rx
                        </button>
                        <button
                          onClick={() => handleDownloadSingleDoc(docItem)}
                          title="Download Document PDF"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-2 rounded-xl transition cursor-pointer flex items-center justify-center"
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
          {/* 5. SETTINGS VIEW: Doctor Chamber & AI Triage Configuration       */}
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
                <p className="text-xs text-slate-500">{selectedDocModal.hospital}</p>
              </div>
              <button
                onClick={() => setSelectedDocModal(null)}
                className="bg-slate-100 hover:bg-slate-200 p-2 rounded-xl text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Hospital Visit Date Banner */}
            <div className="bg-blue-50/90 border border-blue-200 p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-blue-950 block text-xs">
                    Patient Hospital Visit Date (अस्पताल आने की तारीख):
                  </span>
                  <span className="text-[11px] text-blue-700">Official medical record timestamp</span>
                </div>
              </div>
              <span className="font-black text-blue-800 bg-white px-3 py-1.5 rounded-xl border border-blue-200 text-xs font-mono shadow-2xs">
                {selectedDocModal.visitDate || selectedDocModal.date}
              </span>
            </div>

            {/* Document Details Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Consulting Physician:</span>
                <strong className="text-slate-900 font-extrabold">{selectedDocModal.doctor}</strong>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-slate-500">Hospital / Facility:</span>
                <span className="text-slate-800 font-semibold">{selectedDocModal.hospital}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-slate-500">Clinical Diagnosis:</span>
                <strong className="text-blue-900 font-extrabold">{selectedDocModal.extractedData?.diagnosis}</strong>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-slate-500">Vitals Recorded on Visit:</span>
                <span className="text-slate-800 font-mono font-bold">{selectedDocModal.extractedData?.vitals}</span>
              </div>
            </div>

            {/* Prescribed Medications */}
            {selectedDocModal.extractedData?.medications?.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    💊 Doctor Prescribed Medications (डॉक्टर द्वारा दी गई दवाइयाँ):
                  </h4>
                  <span className="text-[11px] text-blue-700 font-bold">
                    {selectedDocModal.extractedData.medications.length} Prescribed
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedDocModal.extractedData.medications.map((m, idx) => (
                    <div key={idx} className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-900 text-sm font-black">{m.name} {m.dosage}</strong>
                        <span className="bg-blue-100 text-blue-800 font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                          {m.duration}
                        </span>
                      </div>
                      <p className="text-blue-900 font-medium text-[11px]">
                        <strong>Frequency & Timing:</strong> {m.frequency}
                      </p>
                      {m.instruction && (
                        <p className="text-slate-500 text-[10px]">
                          <strong>Special Instruction:</strong> {m.instruction}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investigations */}
            {selectedDocModal.extractedData?.investigations?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Lab Investigations & Diagnostic Findings:
                </h4>
                <div className="space-y-1">
                  {selectedDocModal.extractedData.investigations.map((inv, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>{inv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctor Advice / Recommendations */}
            {selectedDocModal.extractedData?.doctorAdvice && (
              <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl text-xs space-y-1">
                <strong className="text-amber-900 font-extrabold block uppercase text-[10px]">
                  Doctor Advice & Precautions (डॉक्टर की सलाह):
                </strong>
                <p className="text-amber-950 font-medium leading-relaxed">
                  {selectedDocModal.extractedData.doctorAdvice}
                </p>
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

            <div className="flex flex-wrap justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => {
                  const pt = selectedHistoryModal.patientObj || activeQueue.find((p) => isTokenMatch(p.token, selectedHistoryModal.token)) || {
                    token: selectedHistoryModal.token,
                    name: selectedHistoryModal.name,
                    age: selectedHistoryModal.age,
                    gender: selectedHistoryModal.gender,
                    chiefComplaint: selectedHistoryModal.diagnosis,
                    caseData: selectedHistoryModal.caseData || { pastHistory: "Normal", currentMeds: [selectedHistoryModal.rx], allergies: ["None"] }
                  };
                  handleOpenPatientPDF(pt);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Eye size={13} /> View OPD Case Sheet PDF ↗
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                Print Record
              </button>
              <button
                onClick={() => setSelectedHistoryModal(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
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
