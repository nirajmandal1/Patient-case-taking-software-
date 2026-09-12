import React, { useState, useEffect, useRef } from "react";
import { useDemo } from "../context/DemoContext";
import { RedFlagAlert } from "../components/common/RedFlagAlert";
import {
  Mic,
  MicOff,
  Send,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Zap,
  Sparkles,
  Stethoscope,
  Volume2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAdaptiveClinicalResponse } from "../utils/clinicalDialogEngine";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are MedSync AI, an empathetic clinical history-taking assistant at an Indian hospital OPD kiosk.
The patient is speaking to you in Hindi, Hinglish, or English.

CRITICAL INSTRUCTIONS:
1. Focus directly on the patient's EXACT symptom or statement. Your next question MUST be clinically relevant to what they just reported.
   - If stomach/abdomen: ask exact location (upper/lower/navel), vomiting, loose motions, or relation to food.
   - If cough/cold: ask if dry or phlegm (balgam), sore throat, fever, or breathlessness.
   - If fever: ask high vs mild, chills/kapkapi, body ache, or duration.
   - If chest pain: ask if radiating to left arm/back, pressure sensation, or sweating (RED FLAG).
   - If headache/dizziness: ask which side, vomiting sensation, light sensitivity.
   - If body/joint/back: ask exact joint, swelling, morning stiffness, or injury.
2. If the patient asks a direct question or expresses worry (e.g. "kya ye serious hai?", "doctor kab aayenge?", "kaunsi dawa lu?"), give a 1-sentence warm reassurance first, then ask the clinical question.
3. Keep question concise (under 28 words) in simple, conversational Hinglish.
4. Always provide 4 quick-tap options at the end in this format:
[Your concise clinical question]
OPTIONS: opt1 | opt2 | opt3 | opt4`;

const CLINICAL_STEPS = [
  "Chief Complaint",
  "Pain / Symptoms",
  "Duration",
  "Medical History",
  "Current Meds",
  "Summary"
];

export const AIInterviewPage = () => {
  const {
    setActiveTab,
    language,
    isDemoMode,
    nextDemoStep,
    redFlagTriggered,
    setRedFlagTriggered,
    saveInterviewAndGenerateSummary,
    patientData
  } = useDemo();

  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dynamicOptions, setDynamicOptions] = useState([
    "पेट में तेज दर्द है",
    "बुखार और ठंड लग रही है",
    "खांसी और गले में खराश",
    "सीने में भारीपन / घबराहट"
  ]);
  const chatEndRef = useRef(null);

  const [conversation, setConversation] = useState([
    {
      sender: "ai",
      text: `नमस्ते ${patientData?.name ? patientData.name.split(" ")[0] : ""} जी! आज आपको क्या तकलीफ है? कृपया अपनी परेशानी बताइए।`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isThinking]);

  const parseOptions = (text) => {
    const match = text.match(/OPTIONS:\s*(.+)/i);
    if (match) {
      const opts = match[1].split("|").map(o => o.trim()).filter(Boolean);
      return { cleanText: text.replace(/OPTIONS:.+/i, "").trim(), options: opts };
    }
    return { cleanText: text, options: [] };
  };

  const checkRedFlag = (text) => {
    const lower = text.toLowerCase();
    return ["chest", "seene", "left arm", "baayein", "saans", "breathless", "behosh", "heart", "dil", "chakkar"].some(k => lower.includes(k));
  };

  // Call Gemini with multi-model fallback or smart clinical engine
  const fetchAIResponse = async (patientMessage, conversationHistory, stepIndex) => {
    const candidateModels = ["gemini-flash-lite-latest", "gemini-flash-latest", "gemini-3.6-flash"];

    const contents = [];
    conversationHistory.forEach((msg) => {
      if (msg.text) {
        contents.push({
          role: msg.sender === "patient" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    });
    contents.push({
      role: "user",
      parts: [{ text: patientMessage }]
    });

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Gemini timeout")), 5500)
        );

        const responsePromise = model.generateContent({
          contents: contents.slice(-8),
          generationConfig: {
            maxOutputTokens: 120,
            temperature: 0.3
          }
        });

        const result = await Promise.race([responsePromise, timeoutPromise]);
        const replyText = result.response.text().trim();

        if (replyText) {
          const { cleanText, options } = parseOptions(replyText);
          return {
            text: cleanText,
            options: options.length > 0 ? options : ["हाँ, यह है", "नहीं, ऐसा नहीं", "कुछ समय से", "पता नहीं"]
          };
        }
      } catch (err) {
        console.warn(`Model ${modelName} notice:`, err.message);
      }
    }

    return getAdaptiveClinicalResponse(patientMessage, conversationHistory, stepIndex);
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isThinking) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updatedConv = [...conversation, { sender: "patient", text, time: timeStr }];
    setConversation(updatedConv);
    setInputText("");
    setIsThinking(true);

    if (checkRedFlag(text)) {
      setRedFlagTriggered(true);
    }

    const nextStepIdx = Math.min(currentStep + 1, CLINICAL_STEPS.length - 1);
    setCurrentStep(nextStepIdx);

    const aiTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setConversation(prev => [...prev, { sender: "ai", text: "", time: aiTime, streaming: true }]);

    try {
      const { text: aiResponseText, options: newOptions } = await fetchAIResponse(
        text,
        updatedConv,
        nextStepIdx
      );

      setIsThinking(false);
      setConversation(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          sender: "ai",
          text: aiResponseText,
          time: aiTime,
          streaming: false
        };
        return copy;
      });

      if (newOptions && newOptions.length > 0) {
        setDynamicOptions(newOptions);
      }
    } catch (e) {
      console.error("Clinical response error:", e);
      const fallback = getAdaptiveClinicalResponse(text, updatedConv, nextStepIdx);
      setIsThinking(false);
      setConversation(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          sender: "ai",
          text: fallback.text,
          time: aiTime,
          streaming: false
        };
        return copy;
      });
      setDynamicOptions(fallback.options);
    }
  };

  const toggleMic = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = language === "Hindi" ? "hi-IN" : "en-IN";
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e) => setInputText(e.results[0][0].transcript);
    rec.onerror = () => setIsListening(false);
    if (isListening) rec.stop();
    else rec.start();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-4">
      {/* Clinical Stepper & Status Header */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">Medical Chatbot (Clinical Intake)</h2>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Gemini Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Patient: <strong className="text-slate-800">{patientData?.name || "Ramesh Sharma"}</strong> ({patientData?.age || 48}Y / {patientData?.gender || "Male"})
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 block">
              Step {currentStep + 1} of {CLINICAL_STEPS.length}: <strong className="text-blue-700">{CLINICAL_STEPS[currentStep]}</strong>
            </span>
          </div>
        </div>

        {/* Multi-step progress bar */}
        <div className="grid grid-cols-6 gap-1.5 pt-1">
          {CLINICAL_STEPS.map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx <= currentStep ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
              <span className={`hidden sm:block text-[9px] truncate font-bold text-center ${
                idx <= currentStep ? "text-blue-700 font-extrabold" : "text-slate-400"
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {redFlagTriggered && (
        <RedFlagAlert
          onNotifyTriage={() => {
            alert("🚨 Triage staff notified!");
            setRedFlagTriggered(false);
          }}
          onDismiss={() => setRedFlagTriggered(false)}
        />
      )}

      {/* Main Chat Canvas */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col h-[520px] overflow-hidden">
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/60 to-white">
          {conversation.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 text-xs font-bold mt-1">
                  AI
                </div>
              )}
              
              <div
                className={`max-w-lg p-4 rounded-3xl text-sm leading-relaxed transition-all shadow-xs ${
                  msg.sender === "patient"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs font-semibold"
                    : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs font-medium"
                }`}
              >
                {msg.text ? (
                  <p className="whitespace-pre-line">{msg.text}</p>
                ) : (
                  <div className="flex items-center gap-2 py-1 px-1 text-slate-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="ml-1 text-[11px] font-bold text-slate-500">Clinical AI is thinking...</span>
                  </div>
                )}
                <span
                  className={`text-[10px] block text-right mt-1.5 ${
                    msg.sender === "patient" ? "text-blue-200 font-mono" : "text-slate-400 font-mono"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Interactive Bottom Control Panel */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3.5">
          {/* Microphone & Voice Waveform Visualizer */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative flex items-center justify-center">
              {isListening && (
                <div className="absolute w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
              )}
              <button
                onClick={toggleMic}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all transform active:scale-95 cursor-pointer z-10 ${
                  isListening
                    ? "bg-rose-600 ring-4 ring-rose-200 shadow-rose-500/30"
                    : "bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30"
                }`}
                title={isListening ? "Stop Recording" : "Tap to Speak"}
              >
                {isListening ? <MicOff size={28} /> : <Mic size={28} />}
              </button>
            </div>

            {/* Audio Waveform Effect when recording */}
            {isListening ? (
              <div className="flex items-center gap-1 h-7">
                <span className="w-1 bg-rose-500 rounded-full animate-wave-1" />
                <span className="w-1 bg-rose-500 rounded-full animate-wave-2" />
                <span className="w-1 bg-rose-600 rounded-full animate-wave-3" />
                <span className="w-1 bg-rose-500 rounded-full animate-wave-4" />
                <span className="w-1 bg-rose-500 rounded-full animate-wave-5" />
                <span className="text-xs text-rose-600 font-bold ml-2">Listening... bolte rahiye</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 font-medium">
                Tap Mic to Speak (बोलकर बताएं) ya neeche option chunein
              </p>
            )}
          </div>

          {/* Dynamic Option Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {dynamicOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSend(opt)}
                disabled={isThinking}
                className="bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 hover:border-blue-300 font-bold text-xs px-4 py-2 rounded-xl transition transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs hover:-translate-y-0.5"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Text Input Row */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Apni takleef ya sawal yahan type karein..."
              className="flex-1 bg-slate-50/80 border border-slate-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
            />
            <button
              onClick={() => handleSend()}
              disabled={isThinking || !inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3.5 rounded-2xl transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav Actions */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <button
          onClick={() => setActiveTab("auth")}
          className="text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Name & Age
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              saveInterviewAndGenerateSummary(conversation);
              setActiveTab("scanner");
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            Scan Old Documents (Optional)
          </button>

          <button
            onClick={() => {
              saveInterviewAndGenerateSummary(conversation);
              if (isDemoMode) nextDemoStep();
              else setActiveTab("summary");
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition transform active:scale-95 cursor-pointer"
          >
            <span>View Case Summary & PDF (समरी देखें)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
