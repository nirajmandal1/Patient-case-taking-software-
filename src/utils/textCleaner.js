// Medical and general Hindi/Devanagari to English phonetic transliteration dictionary
const PHRASE_DICTIONARY = [
  // Common medical symptoms & phrases
  ["पसीने के साथ चक्कर आ रहा है", "Pasina aur Chakkar (Sweating & Dizziness)"],
  ["पसीने के साथ चक्कर", "Pasina aur Chakkar (Sweating with Dizziness)"],
  ["सीने में दर्द हो रहा है", "Chest Pain (Seene me dard)"],
  ["सीने में दर्द", "Chest Pain (Seene me dard)"],
  ["सीने में जलन", "Heartburn / Chest burning sensation"],
  ["सांस लेने में तकलीफ", "Shortness of Breath (Dyspnea)"],
  ["सांस फूल रही है", "Breathlessness (Shortness of breath)"],
  ["चक्कर आ रहा है", "Feeling Dizzy (Chakkar / Vertigo)"],
  ["चक्कर आ रहे हैं", "Feeling Dizzy (Chakkar / Vertigo)"],
  ["घबराहट हो रही है", "Palpitations / Anxiety (Ghabrahat)"],
  ["उल्टी जैसा लग रहा है", "Nausea (Ulti jaisa lagna)"],
  ["उल्टी और दस्त", "Vomiting and Loose Stools (Diarrhea)"],
  ["सिर में बहुत तेज दर्द है", "Severe Headache (Cephalea)"],
  ["सिरदर्द हो रहा है", "Headache (Sirdard)"],
  ["पेट में दर्द है", "Abdominal Pain (Pet dard)"],
  ["बहुत कमजोरी लग रही है", "Severe Weakness / Fatigue"],
  ["तेज बुखार और बदन दर्द", "High Fever and Body Ache"],
  ["खांसी और जुकाम", "Cough and Cold"],
  ["बाएं हाथ में दर्द", "Pain radiating to left arm"],
  ["हाथ पैर कांप रहे हैं", "Tremors / Shivering in limbs"],
  ["बीपी बढ़ा हुआ है", "High Blood Pressure (Hypertension)"],
  ["शुगर की बीमारी", "Diabetes Mellitus"],

  // Single medical & common words
  ["पसीना", "Pasina (Sweating)"],
  ["पसीने", "Pasine (Sweat)"],
  ["चक्कर", "Chakkar (Dizziness)"],
  ["सीने", "Chest (Seene)"],
  ["सीना", "Chest (Seena)"],
  ["दर्द", "Dard (Pain)"],
  ["सांस", "Saans (Breathing)"],
  ["बुखार", "Bukhar (Fever)"],
  ["खांसी", "Khansi (Cough)"],
  ["उल्टी", "Ulti (Vomiting)"],
  ["दस्त", "Dast (Loose Motions)"],
  ["कमजोरी", "Kamjori (Weakness)"],
  ["घबराहट", "Ghabrahat (Restlessness)"],
  ["बेहोश", "Behosh (Unconscious)"],
  ["बेहोशी", "Behoshi (Syncope)"],
  ["दवा", "Dawa (Medicine)"],
  ["दवाई", "Dawai (Medicine)"],
  ["दवाइयां", "Dawaiyaan (Medicines)"],
  ["दवाइयाँ", "Dawaiyaan (Medicines)"],
  ["अस्पताल", "Hospital"],
  ["डॉक्टर", "Doctor"],
  ["मरीज", "Patient"],

  // Conversational greetings & time
  ["नमस्ते", "Namaste"],
  ["आज आपको क्या तकलीफ है", "Aaj aapko kya takleef hai?"],
  ["आज आपको क्या तकलीफ़ है", "Aaj aapko kya takleef hai?"],
  ["कृपया बताइए", "Kripya bataiye"],
  ["आज से", "From today (Aaj se)"],
  ["कुछ दिनों से", "Since a few days (Kuch dino se)"],
  ["एक हफ्ते से", "Since 1 week (Ek hafte se)"],
  ["याद नहीं", "Not sure / Can't recall (Yaad nahi)"],
  ["हां", "Haan (Yes)"],
  ["हाँ", "Haan (Yes)"],
  ["नहीं", "Nahi (No)"],
  ["बहुत", "Bahut (Very high/Severe)"],
  ["थोड़ा", "Thoda (Mild)"],
  ["शुक्रिया", "Shukriya (Thank you)"],
  ["धन्यवाद", "Dhanyawad (Thank you)"]
];

const DEVANAGARI_CHAR_MAP = {
  '\u0905': 'a', '\u0906': 'aa', '\u0907': 'i', '\u0908': 'ee', '\u0909': 'u', '\u090A': 'oo',
  '\u090B': 'ri', '\u090F': 'e', '\u0910': 'ai', '\u0913': 'o', '\u0914': 'au',
  '\u0915': 'k', '\u0916': 'kh', '\u0917': 'g', '\u0918': 'gh', '\u0919': 'ng',
  '\u091A': 'ch', '\u091B': 'chh', '\u091C': 'j', '\u091D': 'jh', '\u091E': 'ny',
  '\u091F': 't', '\u0920': 'th', '\u0921': 'd', '\u0922': 'dh', '\u0923': 'n',
  '\u0924': 't', '\u0925': 'th', '\u0926': 'd', '\u0927': 'dh', '\u0928': 'n',
  '\u092A': 'p', '\u092B': 'ph', '\u092C': 'b', '\u092D': 'bh', '\u092E': 'm',
  '\u092F': 'y', '\u0930': 'r', '\u0932': 'l', '\u0935': 'v', '\u0936': 'sh',
  '\u0937': 'sh', '\u0938': 's', '\u0939': 'h',
  '\u093E': 'aa', '\u093F': 'i', '\u0940': 'ee', '\u0941': 'u', '\u0942': 'oo',
  '\u0943': 'ri', '\u0947': 'e', '\u0948': 'ai', '\u094B': 'o', '\u094C': 'au',
  '\u094D': '', '\u0902': 'n', '\u0901': 'n', '\u0903': 'h'
};

/**
 * Cleanly transliterates Hindi / Devanagari text into clear, readable Latin/English
 * so that standard PDF fonts (Helvetica) render properly without mojibake garble.
 */
export const cleanTextForPDF = (text) => {
  if (!text) return "";
  let str = String(text);

  // 1. Replace known medical phrases and words
  for (const [hindi, latin] of PHRASE_DICTIONARY) {
    if (str.includes(hindi)) {
      str = str.split(hindi).join(latin);
    }
  }

  // 2. Transliterate any remaining Devanagari characters
  if (/[\u0900-\u097F]/.test(str)) {
    let converted = "";
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (DEVANAGARI_CHAR_MAP[ch] !== undefined) {
        converted += DEVANAGARI_CHAR_MAP[ch];
      } else {
        converted += ch;
      }
    }
    str = converted;
  }

  // 3. Clean up any weird unprintable ASCII characters
  str = str.replace(/[^\x20-\x7E\n\r\t]/g, " ");

  // 4. Remove multiple consecutive spaces
  str = str.replace(/ {2,}/g, " ").trim();

  return str;
};
