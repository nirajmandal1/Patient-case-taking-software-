# MediKiosk (AI-Powered Patient Case-Taking Software)

MediKiosk is an intelligent, ABDM-compliant hospital touch-kiosk and pre-consultation software designed for outpatient departments (OPD). It streamlines patient registration, conducts empathetic conversational AI clinical history-taking, extracts data from previous medical records, identifies red-flag triage conditions, and delivers a structured case summary directly to the doctor's desk.

## 🚀 Key Features

- **Touch Kiosk Interface**: High-contrast, tactile UI optimized for hospital kiosks and touchscreens.
- **ABDM-Compliant Registration**: Live digital ABHA Smart Card with real-time patient name, age, and QR code preview.
- **Multilingual Support**: Supports 6 major Indian languages (Hindi, English, Bengali, Marathi, Tamil, Telugu) with native "Read Aloud" voice consent.
- **AI Conversational Clinical Interview**: Adaptive history-taking powered by Google Gemini API covering Chief Complaint, Onset, Duration, Severity, and Associated Symptoms.
- **Red-Flag Triage Engine**: Real-time detection of high-risk medical complaints (chest pain, radiation, breathlessness) with high-priority doctor alerts.
- **Medical Document Scanner & Entity Extraction**: High-fidelity OCR simulation and report digitizer.
- **Hospital OPD Case Sheet & Vector PDF**: Generates realistic official hospital OPD case sheets with vector PDF downloads and instant print support.
- **Doctor Portal & Chamber Queue**: Real-time patient queue management, live kiosk sync, KPI analytics, and electronic medical records.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, jsPDF
- **AI Engine**: Google Gemini API (`@google/generative-ai`)
- **Backend**: Node.js, Express.js

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/nirajmandal1/Patient-case-taking-software-.git
   cd Patient-case-taking-software-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env` and add your Gemini API key:
   ```bash
   cp .env.example .env
   ```
   Add your key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```

4. Run Backend & Frontend:
   ```bash
   # Start backend server
   node server.js

   # Start frontend (in a separate terminal)
   npm run dev
   ```

5. Open your browser at `http://localhost:5173/`
