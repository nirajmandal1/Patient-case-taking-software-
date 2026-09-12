export const mockPatientQueue = [
  {
    token: "OPD-101",
    patientId: "P-8801",
    name: "Ramesh Sharma",
    age: 48,
    gender: "Male",
    abhaId: "91-8842-1092-4402",
    language: "Hindi",
    chiefComplaint: "Severe chest discomfort radiating to left arm since 2 hours",
    historyStatus: "Complete",
    consultationStatus: "incomplete",
    documentsCount: 3,
    priority: "High Priority",
    triageReason: "Acute chest pain + sweating + left arm radiation",
    intakeTime: "10:14 AM",
    duration: "4 mins",
    caseData: {
      hpi: "Patient reports sudden onset of retrosternal heavy crushing chest pain while resting at 8:15 AM. Pain radiates to left shoulder and arm. Accompanied by mild diaphoresis and shortness of breath. No past history of MI.",
      pastHistory: "Hypertension x 4 years (on Amlodipine 5mg, reports non-compliance past week). No history of Diabetes or Asthma.",
      currentMeds: ["Tab. Amlodipine 5mg OD (Irregular)", "Tab. Aspirin 75mg (Self-administered 1 hour ago)"],
      allergies: ["NKDA (No Known Drug Allergies)"],
      familyHistory: "Father died of sudden cardiac arrest at age 54.",
      lifestyle: "Non-smoker, mild alcohol consumption occasionally.",
      reviewOfSystems: {
        cardiovascular: "Chest pain, palpitations (+)",
        respiratory: "Mild breathlessness on exertion (+)",
        gastrointestinal: "No nausea or vomiting (-)",
        neurological: "No dizziness, no syncope (-)"
      },
      extractedReports: [
        { id: "REP-01", date: "15 Jan 2026", type: "ECG Report", test: "Sinus Rhythm, Mild ST elevation in II, III, aVF", source: "District OPD OCR Scan", status: "Verified" },
        { id: "REP-02", date: "02 Oct 2025", type: "Blood Investigation", test: "Hb: 14.2 g/dL, BP: 154/96 mmHg, HbA1c: 5.9%", source: "City Diagnostics", status: "Verified" },
        { id: "REP-03", date: "10 Jun 2025", type: "Prescription", test: "Amlodipine 5mg + Telmisartan 40mg prescribed", source: "Government Hospital", status: "Verified" }
      ]
    }
  },
  {
    token: "OPD-102",
    patientId: "P-8802",
    name: "Sunita Devi",
    age: 56,
    gender: "Female",
    abhaId: "44-1102-9844-3310",
    language: "Hindi",
    chiefComplaint: "High grade fever with body ache and chills for 3 days",
    historyStatus: "Complete",
    consultationStatus: "completed",
    documentsCount: 2,
    priority: "Normal",
    triageReason: "Stable vitals, acute febrile illness",
    intakeTime: "10:22 AM",
    duration: "3 mins",
    caseData: {
      hpi: "56-year-old female presents with 3-day history of high fever (102°F) associated with severe chills, frontal headache, and generalized myalgia.",
      pastHistory: "Type 2 Diabetes Mellitus x 6 years (on Metformin 500mg BD).",
      currentMeds: ["Tab. Metformin 500mg BD", "Tab. Paracetamol 650mg SOS"],
      allergies: ["Penicillin (Rash)"],
      familyHistory: "Mother had Type 2 Diabetes.",
      lifestyle: "Vegetarian, sedentary.",
      reviewOfSystems: {
        cardiovascular: "Normal (-)",
        respiratory: "Dry cough (+)",
        gastrointestinal: "Mild loss of appetite (+)",
        neurological: "Frontal headache (+)"
      },
      extractedReports: [
        { id: "REP-04", date: "10 Feb 2026", type: "Complete Blood Count", test: "Platelets: 1.8 Lakhs, WBC: 11,400 /mm³", source: "Private Diagnostic Lab", status: "Verified" },
        { id: "REP-05", date: "12 Dec 2025", type: "Diabetic Profile", test: "Fasting Blood Glucose: 138 mg/dL, HbA1c: 7.1%", source: "Hospital Lab", status: "Verified" }
      ]
    }
  },
  {
    token: "OPD-103",
    patientId: "P-8803",
    name: "Ananya Banerjee",
    age: 29,
    gender: "Female",
    abhaId: "82-3341-9011-5521",
    language: "Bengali",
    chiefComplaint: "Severe epigastric pain and persistent vomiting after meals",
    historyStatus: "Complete",
    consultationStatus: "incomplete",
    documentsCount: 1,
    priority: "Normal",
    triageReason: "Moderate abdominal discomfort, non-emergency",
    intakeTime: "10:30 AM",
    duration: "5 mins",
    caseData: {
      hpi: "29-year-old female complaining of burning epigastric discomfort radiating to chest for 5 days, aggravated by spicy food and lying flat.",
      pastHistory: "GERD symptoms for past 1 year.",
      currentMeds: ["Cap. Pantoprazole 40mg OD"],
      allergies: ["NKDA"],
      familyHistory: "No significant family medical history.",
      lifestyle: "High stress corporate job, irregular meal timing.",
      reviewOfSystems: {
        cardiovascular: "Normal (-)",
        respiratory: "Normal (-)",
        gastrointestinal: "Epigastric tenderness, heartburn (+)",
        neurological: "Normal (-)"
      },
      extractedReports: [
        { id: "REP-06", date: "01 Aug 2025", type: "USG Abdomen", test: "Normal liver, gallbladder and pancreas. Mild gastritis signs.", source: "Apollo Clinic", status: "Verified" }
      ]
    }
  },
  {
    token: "OPD-104",
    patientId: "P-8804",
    name: "Subhash Patil",
    age: 62,
    gender: "Male",
    abhaId: "12-9988-7711-0023",
    language: "Marathi",
    chiefComplaint: "Shortness of breath on walking and bilateral ankle swelling",
    historyStatus: "In Progress",
    consultationStatus: "incomplete",
    documentsCount: 4,
    priority: "High Priority",
    triageReason: "Dyspnea on exertion + edema in elderly patient",
    intakeTime: "10:35 AM",
    duration: "6 mins",
    caseData: {
      hpi: "62-year-old male with progressive breathlessness over 2 weeks, worsening to NYHA Grade II. Associated with pitting pedal edema.",
      pastHistory: "Known case of IHD, post-PTCA in 2021. Hypertension x 10 years.",
      currentMeds: ["Tab. Atorvastatin 20mg", "Tab. Metoprolol 25mg", "Tab. Furosemide 20mg"],
      allergies: ["NKDA"],
      familyHistory: "Hypertension in both parents.",
      lifestyle: "Ex-smoker (quit 5 years ago).",
      reviewOfSystems: {
        cardiovascular: "Orthopnea (+), Pedal edema (+)",
        respiratory: "Bilateral basal crepitations noted in past visit",
        gastrointestinal: "Normal (-)",
        neurological: "Normal (-)"
      },
      extractedReports: [
        { id: "REP-07", date: "11 Nov 2025", type: "2D Echo Report", test: "LVEF: 45%, Grade 1 Diastolic Dysfunction", source: "District Hospital Cardiology", status: "Verified" }
      ]
    }
  }
];

export const mockSampleDocuments = [
  {
    id: "doc-1",
    title: "OPD Prescription - General Medicine",
    date: "12 Aug 2026",
    type: "Prescription",
    confidence: "96%",
    doctor: "Dr. K. S. Verma (MD)",
    hospital: "District Civil Hospital, Bhopal",
    extractedData: {
      diagnosis: "Essential Hypertension & Mild Angina (उच्च रक्तचाप व सीने में जकड़न)",
      problems: [
        "सीने में भारीपन व बेचैनी (Chest discomfort on brisk exertion)",
        "अनियंत्रित उच्च रक्तचाप (Elevated Blood Pressure: 148/92 mmHg)",
        "चलने या सीढ़ियाँ चढ़ने पर जल्दी सांस फूलना (Exertional breathlessness)"
      ],
      relatedQueries: [
        { query: "तकलीफ कब से है? (Duration / Onset)", detail: "पिछले 10-15 दिनों से लगातार चलने पर महसूस हो रही है" },
        { query: "समस्या कब बढ़ती है? (Aggravating Factors)", detail: "सीढ़ियाँ चढ़ने या भारी काम करने पर सीने पर दबाव बढ़ता है" },
        { query: "क्या आराम करने से राहत मिलती है? (Relieving Factor)", detail: "बैठ जाने या 5 मिनट रुकने पर दर्द कम हो जाता है" },
        { query: "परिवार में कोई हृदय रोग इतिहास? (Family History)", detail: "पिताजी को 54 वर्ष की उम्र में हृदय रोग रहा है" }
      ],
      doctorQueries: [
        "क्या ईसीजी के अलावा टीएमटी (TMT) या 2D-Echo जांच की आवश्यकता है?",
        "नमक और खान-पान में किन चीजों का परहेज अनिवार्य रूप से रखना होगा?"
      ],
      investigations: ["ECG 12-Lead", "Serum Creatinine", "Lipid Profile"],
      vitals: "BP: 148/92 mmHg, Pulse: 78 bpm, SpO2: 98%"
    }
  },
  {
    id: "doc-2",
    title: "Laboratory Diagnostic Report",
    date: "10 Jan 2026",
    type: "Blood Test",
    confidence: "94%",
    doctor: "Pathology Dept",
    hospital: "Central Diagnostics & Research Center",
    extractedData: {
      diagnosis: "Metabolic Panel Summary",
      medications: [],
      investigations: [
        "Hemoglobin: 13.8 g/dL (Normal)",
        "Fasting Blood Sugar: 142 mg/dL (Elevated)",
        "HbA1c: 6.9% (Pre-diabetic / Controlled)",
        "Total Cholesterol: 215 mg/dL (Borderline High)",
        "Serum Creatinine: 0.9 mg/dL (Normal)"
      ],
      vitals: "N/A"
    }
  },
  {
    id: "doc-3",
    title: "Hospital Discharge Summary",
    date: "24 Nov 2025",
    type: "Discharge Summary",
    confidence: "92%",
    doctor: "Dr. A. R. Mehta (DM Cardiology)",
    hospital: "Government Medical College Hospital",
    extractedData: {
      diagnosis: "Acute Gastritis & Non-cardiac Chest Discomfort",
      medications: [
        { name: "Cap. Rabeprazole", dosage: "20 mg", frequency: "Once daily before breakfast", duration: "14 Days" },
        { name: "Syr. Mucaine Gel", dosage: "10 ml", frequency: "TID after meals", duration: "7 Days" }
      ],
      investigations: ["Troponin-I: Negative (<0.01 ng/mL)", "Normal ECG", "Endoscopy: Mild antral erythema"],
      vitals: "BP on discharge: 124/80 mmHg"
    }
  }
];

export const mockAyushSchema = {
  prakriti: ["Vata", "Pitta", "Kapha", "Vata-Pitta", "Pitta-Kapha", "Vata-Kapha", "Sama"],
  vikriti: ["Vata Dushti", "Pitta Dushti", "Kapha Dushti", "Rakta Dhatu Dushti", "Agni Mandya"],
  sara: ["Twak Sara", "Rakta Sara", "Mamsa Sara", "Meda Sara", "Asthi Sara", "Majja Sara", "Shukra Sara", "Satwa Sara"],
  samhanana: ["Su-samhat (Compact/Strong)", "Madhyama (Medium)", "Visamhata (Loose/Weak)"],
  pramana: ["Pravara (Superior)", "Madhyama (Medium)", "Avara (Inferior)"],
  satmya: ["Eka-rasa Satmya", "Sarva-rasa Satmya (Balanced)", "Ouka Satmya"],
  sattva: ["Pravara Sattva (High mental strength)", "Madhyama Sattva", "Avara Sattva (Low tolerance)"],
  aharaShakti: ["Abhavaharana Shakti High", "Jarana Shakti (Digestive capacity) High", "Moderate", "Low"],
  vyayamaShakti: ["High endurance", "Moderate endurance", "Low endurance"],
  vaya: ["Bala (Childhood)", "Madhyama (Adult)", "Vardhakya (Elderly)"],
  aharaVihara: ["Katu-Lavan Pradhan", "Sheetal Ahara", "Snigdha Ahara", "Irregular sleep patterns"]
};
