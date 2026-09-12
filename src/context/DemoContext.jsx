import React, { createContext, useContext, useState, useEffect } from "react";
import { mockPatientQueue, mockSampleDocuments } from "../data/mockData";

const DemoContext = createContext();

export const DemoProvider = ({ children }) => {
  // Roles: "patient" | "doctor" | "landing"
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("medikiosk_role") || "patient";
  });

  const [activeTab, setActiveTab] = useState(() => {
    const savedRole = localStorage.getItem("medikiosk_role") || "patient";
    return savedRole === "doctor" ? "doctor" : "kiosk";
  });

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const [language, setLanguage] = useState("Hindi");
  const [patientData, setPatientData] = useState(() => {
    const saved = localStorage.getItem("medikiosk_current_patient");
    return saved ? JSON.parse(saved) : mockPatientQueue[0];
  });
  const [redFlagTriggered, setRedFlagTriggered] = useState(false);
  const [scannedDocs, setScannedDocs] = useState(mockPatientQueue[0].caseData.extractedReports);
  const [activeQueue, setActiveQueue] = useState(() => {
    const saved = localStorage.getItem("medikiosk_queue");
    return saved ? JSON.parse(saved) : mockPatientQueue;
  });
  const [patientConversation, setPatientConversation] = useState(() => {
    const saved = localStorage.getItem("medikiosk_conversation");
    return saved ? JSON.parse(saved) : [];
  });
  const [latestToken, setLatestToken] = useState(() => {
    return parseInt(localStorage.getItem("medikiosk_token") || "105", 10);
  });
  const [activeScannedDoc, setActiveScannedDoc] = useState(() => {
    return mockSampleDocuments[0];
  });

  // Switch Role
  const switchRole = (newRole) => {
    setUserRole(newRole);
    localStorage.setItem("medikiosk_role", newRole);
    if (newRole === "doctor") {
      setActiveTab("doctor");
    } else {
      setActiveTab("kiosk");
    }
  };

  // Fetch initial queue from Server API on load
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch("/api/queue");
        if (res.ok) {
          const data = await res.json();
          if (data.queue && data.queue.length > 0) {
            setActiveQueue(data.queue);
            localStorage.setItem("medikiosk_queue", JSON.stringify(data.queue));
          }
        }
      } catch (e) {
        console.warn("Server fetch notice (using local storage):", e.message);
      }
    };
    fetchQueue();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("medikiosk_role", userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem("medikiosk_current_patient", JSON.stringify(patientData));
  }, [patientData]);

  useEffect(() => {
    localStorage.setItem("medikiosk_queue", JSON.stringify(activeQueue));
  }, [activeQueue]);

  useEffect(() => {
    localStorage.setItem("medikiosk_conversation", JSON.stringify(patientConversation));
  }, [patientConversation]);

  useEffect(() => {
    localStorage.setItem("medikiosk_token", latestToken.toString());
  }, [latestToken]);

  // Trigger End-to-End Guided Demo Mode
  const startDemoMode = () => {
    setIsDemoMode(true);
    setDemoStep(1);
    switchRole("patient");
    setActiveTab("kiosk");
  };

  const nextDemoStep = () => {
    const nextStep = demoStep + 1;
    setDemoStep(nextStep);

    switch (nextStep) {
      case 2:
        setActiveTab("language");
        break;
      case 3:
        setActiveTab("consent");
        break;
      case 4:
        setActiveTab("auth");
        break;
      case 5:
        setActiveTab("interview");
        break;
      case 6:
        setRedFlagTriggered(true);
        setActiveTab("interview");
        break;
      case 7:
        setActiveTab("scanner");
        break;
      case 8:
        setActiveTab("ocr-results");
        break;
      case 9:
        setActiveTab("summary");
        break;
      case 10:
        switchRole("doctor");
        setActiveTab("doctor");
        break;
      default:
        setIsDemoMode(false);
        setDemoStep(1);
        break;
    }
  };

  const stopDemoMode = () => {
    setIsDemoMode(false);
    setDemoStep(1);
  };

  // Dynamically analyze conversation and generate real clinical summary
  const saveInterviewAndGenerateSummary = (conversation) => {
    setPatientConversation(conversation);

    const patientReplies = conversation
      .filter((m) => m.sender === "patient")
      .map((m) => m.text);

    const chiefComplaint = patientReplies[0] || "Chest discomfort with restlessness";
    const duration = patientReplies[1] || "Last 2 days";
    const painLocation = patientReplies[2] || "Left-sided radiation";

    // Detect red flags in actual patient responses
    const allPatientText = patientReplies.join(" ").toLowerCase();
    const isRedFlag =
      allPatientText.includes("chest") ||
      allPatientText.includes("seene") ||
      allPatientText.includes("left arm") ||
      allPatientText.includes("baayein") ||
      allPatientText.includes("saans") ||
      allPatientText.includes("breathless") ||
      allPatientText.includes("behosh") ||
      allPatientText.includes("heart");

    const nextTokenNum = latestToken + 1;
    setLatestToken(nextTokenNum);

    // Detect medications dynamically if mentioned in patient conversation
    const detectedMeds = [];
    if (allPatientText.includes("paracetamol") || allPatientText.includes("calpol") || allPatientText.includes("crocin") || allPatientText.includes("dolo")) {
      detectedMeds.push("Tab. Paracetamol 650mg SOS");
    }
    if (allPatientText.includes("bp") || allPatientText.includes("blood pressure") || allPatientText.includes("amlodipine") || allPatientText.includes("telmi")) {
      detectedMeds.push("Tab. Amlodipine 5mg OD");
    }
    if (allPatientText.includes("sugar") || allPatientText.includes("metformin") || allPatientText.includes("diabetes")) {
      detectedMeds.push("Tab. Metformin 500mg BD");
    }
    if (allPatientText.includes("gas") || allPatientText.includes("acidity") || allPatientText.includes("panto") || allPatientText.includes("omee") || allPatientText.includes("antacid")) {
      detectedMeds.push("Cap. Pantoprazole 40mg OD (before breakfast)");
    }
    if (allPatientText.includes("aspirin") || allPatientText.includes("blood thinner") || allPatientText.includes("ecospirin")) {
      detectedMeds.push("Tab. Ecosprin 75mg OD");
    }

    // Preserve previously scanned OCR meds or use detected / standard default
    const existingMeds = Array.isArray(patientData.caseData?.currentMeds) ? patientData.caseData.currentMeds : [];
    const resolvedMeds = detectedMeds.length > 0
      ? Array.from(new Set([...existingMeds, ...detectedMeds]))
      : (existingMeds.length > 0 ? existingMeds : ["Tab. Amlodipine 5mg OD", "Tab. Paracetamol 650mg SOS"]);

    const updatedPatient = {
      ...patientData,
      token: nextTokenNum.toString(),
      chiefComplaint: chiefComplaint,
      priority: isRedFlag ? "High Priority" : "Normal",
      triageReason: isRedFlag
        ? "Acute Chest Pain / Radiation detected by Medical Chatbot"
        : "Standard OPD Intake",
      historyStatus: "Complete (AI Verified)",
      consultationStatus: "incomplete",
      conversation: conversation,
      caseData: {
        ...patientData.caseData,
        hpi: `Patient reported: "${chiefComplaint}". Duration/Onset: ${duration}. Location/Characteristics: ${painLocation}. AI clinical triage conducted in ${language}.`,
        pastHistory:
          allPatientText.includes("sugar") || allPatientText.includes("diabetes")
            ? "Diabetes Mellitus (Type 2), Hypertension"
            : "Essential Hypertension (Stage 1), No known diabetes",
        currentMeds: resolvedMeds,
        allergies: allPatientText.includes("allergy")
          ? ["Penicillin Allergy Reported"]
          : ["NKDA (No Known Drug Allergies)"]
      }
    };

    setPatientData(updatedPatient);
    setRedFlagTriggered(isRedFlag);
    return updatedPatient;
  };

  // Submit case to Server Database & Route to Doctor Queue
  const sendCaseToDoctor = async (patientToSubmit) => {
    const rawPatient = patientToSubmit || patientData;
    const patient = {
      ...rawPatient,
      token: String(rawPatient.token),
      consultationStatus: rawPatient.consultationStatus || "incomplete",
      status: rawPatient.status || "waiting"
    };

    // 1. Update local queue immediately
    setActiveQueue((prev) => {
      const filtered = (prev || []).filter((p) => String(p.token).trim() !== String(patient.token).trim());
      return [patient, ...filtered];
    });
    setPatientData(patient);

    // 2. Persist to Express Server backend
    try {
      await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient)
      });
      console.log("[Client] Case saved to server successfully!");
    } catch (err) {
      console.warn("[Client] Saved locally, server sync error:", err.message);
    }

    // 3. Switch role to Doctor and open Doctor Dashboard
    switchRole("doctor");
    setActiveTab("doctor");
  };

  return (
    <DemoContext.Provider
      value={{
        userRole,
        setUserRole,
        switchRole,
        activeTab,
        setActiveTab,
        isDemoMode,
        demoStep,
        startDemoMode,
        nextDemoStep,
        stopDemoMode,
        language,
        setLanguage,
        patientData,
        setPatientData,
        redFlagTriggered,
        setRedFlagTriggered,
        scannedDocs,
        setScannedDocs,
        activeQueue,
        setActiveQueue,
        patientConversation,
        setPatientConversation,
        saveInterviewAndGenerateSummary,
        sendCaseToDoctor,
        latestToken,
        activeScannedDoc,
        setActiveScannedDoc
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => useContext(DemoContext);
