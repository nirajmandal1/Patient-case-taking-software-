import React from "react";
import { DemoProvider } from "./context/DemoContext";
import { AppContent } from "./AppContent";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MediKiosk UI Caught Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
              !
            </div>
            <h2 className="text-xl font-black text-slate-900">Application Recovered</h2>
            <p className="text-xs text-slate-600">
              A temporary interface issue occurred. Click the button below to reload the clean view.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-[11px] font-mono text-slate-700 max-h-24 overflow-auto">
              {this.state.error?.message || "Unknown error"}
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-6 rounded-2xl shadow-md transition cursor-pointer text-xs"
            >
              🔄 Refresh & Reload MediKiosk
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <DemoProvider>
        <AppContent />
      </DemoProvider>
    </ErrorBoundary>
  );
}
