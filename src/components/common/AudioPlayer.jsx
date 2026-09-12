import React, { useState } from "react";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";

export const AudioPlayer = ({ text, label = "Read Aloud" }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      onClick={toggleSpeak}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-2xs ${
        isPlaying
          ? "bg-amber-500 text-white animate-pulse"
          : "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
      }`}
      title="Speech Accessibility Output"
    >
      {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
      <span>{isPlaying ? "Stop Reading" : label}</span>
    </button>
  );
};
