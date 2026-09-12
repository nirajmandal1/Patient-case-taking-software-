import React from "react";
import { Stethoscope } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-4 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-white text-blue-900 p-1.5 rounded-lg">
            <Stethoscope size={16} />
          </div>
          <span className="font-extrabold text-sm">MediKiosk</span>
          <span className="text-blue-300 text-xs">|</span>
          <span className="text-blue-200 text-xs">AI-Powered Patient Case-Taking Software</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-blue-200 font-medium">
          <span>Digital India</span>
          <span className="text-blue-500">|</span>
          <span>Better Healthcare</span>
          <span className="text-blue-500">|</span>
          <span>Healthier Tomorrow</span>
        </div>
      </div>
    </footer>
  );
};
