/**
 * Clinical Dialog Engine for MediKiosk
 * Provides context-aware, clinically accurate, empathetic responses in Hindi/Hinglish
 * based on the patient's exact symptoms, complaints, and conversation history.
 */

export const getAdaptiveClinicalResponse = (patientText, conversation = [], currentStep = 0) => {
  const text = (patientText || "").toLowerCase().trim();
  const allPatientText = conversation
    .filter((m) => m.sender === "patient")
    .map((m) => m.text.toLowerCase())
    .join(" ") + " " + text;

  // 0. PATIENT ASKS A QUESTION DIRECTLY (Reassurance + Clinical Pivot)
  if (
    text.includes("doctor") ||
    text.includes("kab") ||
    text.includes("aayenge") ||
    text.includes("serious") ||
    text.includes("kya karu") ||
    text.includes("dawa") ||
    text.includes("theek") ||
    text.includes("dar")
  ) {
    return {
      text: "Aap bilkul fikar na karein! OPD Chamber #04 mein Dr. Sharma aapko check karke sahi dawai denge. Abhi batayein — kya dard ya takleef ke saath bukhar, chakkar ya ulti jaisa lag raha hai?",
      options: ["Haan, bukhar bhi hai", "Ulti jaisa lagta hai", "Chakkar aate hain", "Sirf dard aur bechaini"]
    };
  }

  // 1. CHEST PAIN / HEART / RED FLAGS (Urgent Assessment)
  if (
    text.includes("chest") ||
    text.includes("seene") ||
    text.includes("dil") ||
    text.includes("heart") ||
    text.includes("ghabrahat") ||
    text.includes("palpitation") ||
    text.includes("pasina") ||
    text.includes("left arm") ||
    text.includes("baayein")
  ) {
    if (!allPatientText.includes("baayein") && !allPatientText.includes("peeth")) {
      return {
        text: "Dard kaisa mehsoos ho raha hai — bhaari dabav jaisa? Kya yeh baayein haath, jabde ya peeth ki taraf phail raha hai?",
        options: ["Baayein haath mein ja raha hai", "Seene par bhari dabav hai", "Pasina aur ghabrahat", "Sirf gas jaisa lag raha hai"]
      };
    }
    return {
      text: "Kya chalne ya seedhiyan chadhne par dard badhta hai aur baithne/aaram karne par rahat milti hai?",
      options: ["Chalne par badhta hai", "Aaram karne par theek rehta hai", "Lagataar bana hua hai", "Pehle se BP ki problem hai"]
    };
  }

  // 2. STOMACH / ABDOMEN / GI (Pet dard, ulti, dast, gas, acidity, kabz)
  if (
    text.includes("pet") ||
    text.includes("stomach") ||
    text.includes("ulti") ||
    text.includes("vomit") ||
    text.includes("dast") ||
    text.includes("loose") ||
    text.includes("gas") ||
    text.includes("acidity") ||
    text.includes("jalan") ||
    text.includes("kabz") ||
    text.includes("motion") ||
    text.includes("ainthan") ||
    text.includes("bhookh")
  ) {
    if (!allPatientText.includes("upar") && !allPatientText.includes("naabhi") && !allPatientText.includes("nichle")) {
      return {
        text: "Pet mein dard kis taraf zyada hai — upar chhati ke paas, naabhi ke ird-gird, ya pet ke nichle hisse mein? Aur ulti ya dast bhi hai kya?",
        options: ["Upar pet mein (Acidity jaisa)", "Naabhi ke paas", "Neeche pet mein", "Ulti aur dast dono hain"]
      };
    }
    if (!allPatientText.includes("khana") && !allPatientText.includes("jalan")) {
      return {
        text: "Khana khane ke baad dard badhta hai ya aaram milta hai? Aur kya pet mein tez jalan ya khatti dakaar bhi aati hai?",
        options: ["Khane ke baad badhta hai", "Khali pet zyada dard hota hai", "Pet phoola lagta hai", "Khatti dakaar aur jalan"]
      };
    }
    if (!allPatientText.includes("kab se") && !allPatientText.includes("din")) {
      return {
        text: "Yeh takleef kab se shuru hui hai aur kya pehle bhi kabhi acidity ya pathri (stone) ki problem rahi hai?",
        options: ["Aaj subah se shuru hui", "2-3 din se chal raha hai", "Pehle bhi hota raha hai", "Pehli baar hua hai"]
      };
    }
  }

  // 3. RESPIRATORY (Khansi, jukam, gala kharab, balgam, saans, chheenk)
  if (
    text.includes("khansi") ||
    text.includes("cough") ||
    text.includes("jukam") ||
    text.includes("cold") ||
    text.includes("gala") ||
    text.includes("throat") ||
    text.includes("balgam") ||
    text.includes("phlegm") ||
    text.includes("saans") ||
    text.includes("breath") ||
    text.includes("cheenk") ||
    text.includes("asthma")
  ) {
    if (!allPatientText.includes("balgam") && !allPatientText.includes("sookhi")) {
      return {
        text: "Khansi sookhi (dry) hai ya balgam (phlegm) nikal raha hai? Aur kya gale mein chubhan ya kharash bhi hai?",
        options: ["Sookhi khansi hai", "Peela/safed balgam aa raha hai", "Gale mein chubhan/kharash", "Thoda bukhar bhi lag raha hai"]
      };
    }
    if (!allPatientText.includes("phoolti") && !allPatientText.includes("jakdan")) {
      return {
        text: "Kya saans lene mein dikkat ya seene mein jakdan (wheezing) mehsoos hoti hai? Raat ko khansi badhti hai kya?",
        options: ["Saans phoolti hai", "Raat ko khansi badhti hai", "Naak band rehti hai", "Saans bilkul normal hai"]
      };
    }
    return {
      text: "Yeh khansi ya jukam kitne din se chal raha hai aur kya koi syrup ya goli li thi?",
      options: ["2-3 din se", "1 hafte se", "2 hafte se zyada", "Dawai lene par bhi aaram nahi"]
    };
  }

  // 4. FEVER / INFECTION (Bukhar, thand, kapkapi, badan dard, kamzori)
  if (
    text.includes("bukhar") ||
    text.includes("fever") ||
    text.includes("thand") ||
    text.includes("chills") ||
    text.includes("kapkapi") ||
    text.includes("badan") ||
    text.includes("sardi") ||
    text.includes("kamzori") ||
    text.includes("typhoid") ||
    text.includes("dengue") ||
    text.includes("malaria")
  ) {
    if (!allPatientText.includes("101") && !allPatientText.includes("kapkapi")) {
      return {
        text: "Bukhar kitna rehta hai aur kya thand ya kapkapi (chills) lagkar aata hai?",
        options: ["Tez bukhar (101° se zyada)", "Halka bukhar rehta hai", "Kapkapi/thand ke saath", "Dawai lene par utar jata hai"]
      };
    }
    if (!allPatientText.includes("sar dard") && !allPatientText.includes("badan dard")) {
      return {
        text: "Bukhar ke saath sar dard, badan dard ya aankhon ke peeche dard hai kya?",
        options: ["Poore badan mein tez dard", "Sar dard aur chakkar", "Ulti jaisa lagta hai", "Sirf bukhar hai"]
      };
    }
    return {
      text: "Kya pehle kabhi typhoid, malaria ya dengue ki jaanch (blood test) karwayi hai?",
      options: ["Abhi koi test nahi karaya", "Pehle typhoid hua tha", "Report normal aayi thi", "Pata nahi"]
    };
  }

  // 5. HEADACHE / NEUROLOGY / DIZZINESS (Sar dard, chakkar, migraine)
  if (
    text.includes("sar") ||
    text.includes("sir") ||
    text.includes("head") ||
    text.includes("headache") ||
    text.includes("chakkar") ||
    text.includes("dizzy") ||
    text.includes("migraine") ||
    text.includes("aankh")
  ) {
    if (!allPatientText.includes("aadhi") && !allPatientText.includes("poore sar")) {
      return {
        text: "Sar dard kis taraf hai — aage maathe par, aadhi taraf (one side), ya gardan ke peeche?",
        options: ["Aadhi taraf (one side)", "Poore sar mein bhaari-pan", "Maathe aur aankhon ke upar", "Gardan ke peeche"]
      };
    }
    return {
      text: "Kya ulti ka man, roshni/tez aawaz se pareshani, ya chakkar bhi aa rahe hain?",
      options: ["Chakkar aate hain", "Ulti jaisa lagta hai", "Roshni se pareshani hoti hai", "Sirf dard hai"]
    };
  }

  // 6. MUSCULOSKELETAL / BONES (Kamar dard, ghutne me dard, jodon ka dard, chot, sujan)
  if (
    text.includes("kamar") ||
    text.includes("back") ||
    text.includes("ghutna") ||
    text.includes("knee") ||
    text.includes("jod") ||
    text.includes("joint") ||
    text.includes("haddi") ||
    text.includes("sujan") ||
    text.includes("swelling") ||
    text.includes("chot") ||
    text.includes("injury") ||
    text.includes("moch")
  ) {
    if (!allPatientText.includes("sujan") && !allPatientText.includes("chalne")) {
      return {
        text: "Dard kis hisse mein zyada hai aur kya wahan sujan (swelling) ya chalne-uthne mein takleef ho rahi hai?",
        options: ["Ghutno mein dard aur sujan", "Kamar ke nichle hisse mein", "Chalne-uthne mein mushkil", "Chot lagne ki wajah se"]
      };
    }
    return {
      text: "Kya subah uthne par jodon mein akdan (stiffness) rehti hai jo thodi der chalne ke baad theek hoti hai?",
      options: ["Subah zyada akdan rehti hai", "Raat ko dard badhta hai", "Hamesha bana rehta hai", "Nahi, aisi akdan nahi"]
    };
  }

  // 7. SKIN / ALLERGY / RASH (Khujli, daane, allergy, skin)
  if (
    text.includes("khujli") ||
    text.includes("itch") ||
    text.includes("daane") ||
    text.includes("rash") ||
    text.includes("allergy") ||
    text.includes("chamdi") ||
    text.includes("foda") ||
    text.includes("funsi")
  ) {
    return {
      text: "Khujli ya daane shareer ke kis hisse mein hain aur kya kisi nayi dawai ya sabun ke baad yeh shuru hua?",
      options: ["Haath aur pairon par", "Poore shareer par", "Nayi dawai ke baad shuru hua", "2-3 din se chal raha hai"]
    };
  }

  // 8. URINARY / BURNING (Peshab me jalan)
  if (text.includes("peshab") || text.includes("urine") || text.includes("jalan") || text.includes("mutra")) {
    return {
      text: "Kya peshab mein jalan ke saath bukhar, thand ya peeth ke nichle hisse mein dard bhi hai?",
      options: ["Sirf peshab mein jalan", "Baar-baar peshab aana", "Halka bukhar bhi hai", "Kamar mein dard"]
    };
  }

  // =========================================================================
  // STEP-BASED PROGRESSION FOR GENERAL / FOLLOW-UP TURNS
  // =========================================================================

  // Step 3 or 4: Medical History (BP, Diabetes, Thyroid)
  if (currentStep === 3 || (!allPatientText.includes("sugar") && !allPatientText.includes("bp") && currentStep >= 3)) {
    return {
      text: "Kya aapko pehle se High BP, Sugar/Diabetes ya Thyroid ki koi bimari hai?",
      options: ["High BP ki problem hai", "Sugar/Diabetes hai", "Dono bimariyan hain", "Koi purani bimari nahi"]
    };
  }

  // Step 4 or 5: Medications & Drug Allergies
  if (currentStep === 4 || (!allPatientText.includes("dawai") && !allPatientText.includes("allergy") && currentStep >= 4)) {
    return {
      text: "Kya aap abhi koi regular dawai kha rahe hain, ya kisi dawai ya injection se koi allergy hai?",
      options: ["Rozana BP/Sugar ki dawai", "Koi dawai nahi chal rahi", "Penicillin ya dawai se allergy", "Pata nahi"]
    };
  }

  // Step 5 or 6: Family History & Habits
  if (currentStep === 5) {
    return {
      text: "Kya parivaar mein kisi ko Heart problem, Diabetes ya Asthama ki history rahi hai?",
      options: ["Family mein Diabetes hai", "Father/Mother ko Heart problem", "Dono nahi hain", "Pata nahi"]
    };
  }

  // Final Step: Wrap up and invite document scan
  return {
    text: "Shukriya! Aapka pura case vivran darj kar liya gaya hai. Ab aap purani parchi ya lab reports scan kar sakte hain, ya seedhe summary dekh sakte hain.",
    options: ["Scan Reports (रिपोर्ट्स स्कैन करें)", "Doctor Summary Dekhein"]
  };
};
