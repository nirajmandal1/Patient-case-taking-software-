export const pitchDeckSlides = [
  {
    id: 1,
    title: "MediKiosk",
    subtitle: "AI-Powered Patient Case-Taking Software",
    category: "Cover & Overview",
    content: {
      tagline: "“Right History. Less Waiting. Better Consultation.”",
      problemStatementId: "SIH Problem Statement: 26047",
      theme: "Healthcare / AI / Digital Health",
      bulletPoints: [
        "Patient history collection before doctor consultation",
        "Multilingual voice & touch interaction for OPD kiosks",
        "Medical document digitization via OCR pipeline",
        "Physician-ready structured clinical summary generator"
      ]
    }
  },
  {
    id: 2,
    title: "The OPD History-Taking Challenge",
    subtitle: "Understanding the Problem in Indian Public Hospitals",
    category: "Problem Statement",
    content: {
      description: "Indian public hospitals handle thousands of OPD patients daily. Doctors have only 2–4 minutes per consultation to execute critical steps:",
      challenges: [
        { title: "High Patient Volume", desc: "Thousands of patients in OPD daily creating overwhelming queues." },
        { title: "Limited Consultation Time", desc: "Doctors rush history collection to manage time constraints." },
        { title: "Fragmented Paper Records", desc: "Patients carry loose, unorganized prescriptions & laboratory reports." },
        { title: "Language & Literacy Barriers", desc: "Patients struggle with typing or complex digital hospital forms." },
        { title: "Repeated Documentation", desc: "Patients repeat the same medical history across multiple department visits." }
      ],
      flow: ["Patient Queue", "Limited Doctor Time", "Manual History", "Paper Records", "Delayed Consultation"]
    }
  },
  {
    id: 3,
    title: "Meet MediKiosk — The Solution",
    subtitle: "AI-Assisted Clinical Intake Platform",
    category: "Solution Overview",
    content: {
      summary: "MediKiosk collects structured patient history and digitizes past records in the waiting room, transforming raw patient inputs into concise physician summaries.",
      features: [
        { title: "🎙️ Multilingual Voice", desc: "Speak naturally in Hindi, Bengali, Marathi, Tamil, Telugu, English." },
        { title: "👆 Touchscreen UI", desc: "Large accessible buttons designed for elderly & low-literacy users." },
        { title: "📄 Medical OCR", desc: "Scans prescriptions, discharge summaries, and lab test reports." },
        { title: "🧠 Clinical AI Engine", desc: "Structures complaints into CC, HPI, Meds, Allergies & ROS." },
        { title: "🚨 Red-Flag Triage", desc: "Detects priority emergency symptoms instantly." },
        { title: "📋 Doctor Summary", desc: "1-page editable clinical summary ready before patient enters chamber." }
      ]
    }
  },
  {
    id: 4,
    title: "Step-by-Step Patient Journey",
    subtitle: "How MediKiosk Operates in a Hospital Workflow",
    category: "Workflow",
    content: {
      steps: [
        { num: 1, title: "Identity", desc: "Enter ABHA ID or Register as New Patient" },
        { num: 2, title: "Consent", desc: "Simple low-literacy consent screen with audio read-aloud" },
        { num: 3, title: "AI Interview", desc: "Voice or touch response to dynamic clinical prompts" },
        { num: 4, title: "Report Scanning", desc: "Place past reports on kiosk camera / scanner" },
        { num: 5, title: "OCR Extraction", desc: "Medicines, lab results, and past diagnoses extracted" },
        { num: 6, title: "AI Summary", desc: "Structured HPI and timeline generated" },
        { num: 7, title: "Doctor Review", desc: "Physician verifies, edits, and saves to HIS" }
      ]
    }
  },
  {
    id: 5,
    title: "Adaptive AI Health Interview",
    subtitle: "Dynamic Clinical Questioning Engine",
    category: "AI Technology",
    content: {
      description: "Unlike static forms, MediKiosk uses an adaptive clinical graph model that narrows down symptoms dynamically based on clinical protocols.",
      exampleFlow: [
        "Chief Complaint: Seene mein dard (Chest Pain)",
        "Onset: When did it start? (2 hours ago)",
        "Location: Mid-chest radiating to left arm",
        "Associated Symptoms: Diaphoresis & breathlessness",
        "Past History: Hypertension with irregular medication"
      ],
      safetyNote: "AI-assisted history collection — final clinical assessment is performed by a qualified healthcare professional."
    }
  },
  {
    id: 6,
    title: "Medical Document OCR Intelligence",
    subtitle: "Digitizing Handwritten & Printed Reports",
    category: "OCR & Vision AI",
    content: {
      highlights: [
        "Multilingual OCR for Indian hospital prescriptions & laboratory sheets",
        "Named Entity Recognition (NER) for medicine names, dosages, & lab values",
        "Extraction confidence scores (e.g. 96% accuracy)",
        "Side-by-side human verification layout for safety & accuracy"
      ],
      scannables: ["Prescriptions", "Blood Reports", "Discharge Summaries", "X-Ray / MRI Reports"]
    }
  },
  {
    id: 7,
    title: "Doctor Dashboard & Red-Flag Triage",
    subtitle: "Empowering Physicians While Safeguarding Patients",
    category: "Clinical Interface",
    content: {
      features: [
        "Instant 1-page summary review saving up to 70% of documentation time",
        "Red-Flag emergency detection (e.g. acute coronary syndrome, severe dyspnea)",
        "Full doctor editability — doctor accepts, modifies, or retakes history",
        "Direct export to Hospital Information Systems (HIS) and ABDM FHIR records"
      ]
    }
  },
  {
    id: 8,
    title: "System Architecture & Interoperability",
    subtitle: "Built for Modern Digital Health Ecosystems",
    category: "Architecture",
    content: {
      stack: [
        { label: "Frontend", tech: "React, Tailwind CSS, Web Speech API, Kiosk Touch Controls" },
        { label: "AI & NLP", tech: "Multilingual ASR, Clinical NLP LLM, Medical OCR Engine" },
        { label: "Backend", tech: "Python FastAPI, High-Throughput REST APIs" },
        { label: "Standards", tech: "ABDM Ecosystem, FHIR Compliance, ISO/IEC Data Security" }
      ]
    }
  },
  {
    id: 9,
    title: "Privacy, Security & ABDM Readiness",
    subtitle: "Consent-First Data Handling",
    category: "Security",
    content: {
      securityPoints: [
        "Consent-first workflow before any health data collection",
        "End-to-end encryption for transmitted medical records",
        "Role-based access control (Kiosk mode vs Doctor Dashboard)",
        "Designed to support applicable privacy and health-data requirements (ABDM ready)"
      ]
    }
  },
  {
    id: 10,
    title: "AYUSH Integration & Conclusion",
    subtitle: "Inclusive OPD Care for Traditional & Modern Medicine",
    category: "Roadmap & Impact",
    content: {
      ayushFeatures: [
        "Specialized AYUSH intake module for Dashavidha Pariksha (Prakriti, Agni, Sara, etc.)",
        "Universal OPD deployment capability across District & Medical College Hospitals",
        "Empowering doctors to focus on patient care, examination, and treatment."
      ],
      conclusionQuote: "“Let AI collect and organize the history, so doctors can spend more time caring for the patient.”"
    }
  }
];
