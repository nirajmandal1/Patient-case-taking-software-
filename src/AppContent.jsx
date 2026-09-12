import React from "react";
import { useDemo } from "./context/DemoContext";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { DemoBanner } from "./components/layout/DemoBanner";

import { LandingPage } from "./pages/LandingPage";
import { KioskWelcome } from "./pages/KioskWelcome";
import { LanguageSelectPage } from "./pages/LanguageSelectPage";
import { ConsentPage } from "./pages/ConsentPage";
import { PatientAuth } from "./pages/PatientAuth";
import { AIInterviewPage } from "./pages/AIInterviewPage";
import { DocumentScannerPage } from "./pages/DocumentScannerPage";
import { OCRResultsPage } from "./pages/OCRResultsPage";
import { ClinicalSummaryPage } from "./pages/ClinicalSummaryPage";
import { DoctorDashboardPage } from "./pages/DoctorDashboardPage";
import { TimelinePage } from "./pages/TimelinePage";
import { AyushIntakePage } from "./pages/AyushIntakePage";
import { ArchitecturePage } from "./pages/ArchitecturePage";
import { SecurityPage } from "./pages/SecurityPage";

export const AppContent = () => {
  const { activeTab } = useDemo();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      <Header />
      <DemoBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === "landing" && <LandingPage />}
        {activeTab === "kiosk" && <KioskWelcome />}
        {activeTab === "language" && <LanguageSelectPage />}
        {activeTab === "consent" && <ConsentPage />}
        {activeTab === "auth" && <PatientAuth />}
        {activeTab === "interview" && <AIInterviewPage />}
        {activeTab === "scanner" && <DocumentScannerPage />}
        {activeTab === "ocr-results" && <OCRResultsPage />}
        {activeTab === "summary" && <ClinicalSummaryPage />}
        {activeTab === "doctor" && <DoctorDashboardPage />}
        {activeTab === "timeline" && <TimelinePage />}
        {activeTab === "ayush" && <AyushIntakePage />}
        {activeTab === "architecture" && <ArchitecturePage />}
        {activeTab === "security" && <SecurityPage />}
      </main>

      <Footer />
    </div>
  );
};
