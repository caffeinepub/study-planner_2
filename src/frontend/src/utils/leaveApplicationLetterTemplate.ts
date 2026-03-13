export type RecipientType = "principal" | "teacher" | "hod" | "manager" | "hr";
export type DurationType = "single" | "range";
export type Language =
  | "English"
  | "Urdu"
  | "Hindi"
  | "Arabic"
  | "French"
  | "Spanish"
  | "German"
  | "Portuguese"
  | "Bengali"
  | "Punjabi"
  | "Turkish"
  | "Persian"
  | "Russian"
  | "Chinese"
  | "Japanese"
  | "Korean"
  | "Italian"
  | "Dutch"
  | "Polish"
  | "Swedish";

export function isRTLLanguage(language: Language): boolean {
  return ["Urdu", "Arabic", "Persian"].includes(language);
}

interface LetterParams {
  studentName: string;
  className: string;
  recipientType: RecipientType;
  recipientName: string;
  schoolName: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  durationType: DurationType;
  halfDay?: boolean;
  language: Language;
  parentName?: string;
}

interface LanguageStrings {
  dateLabel: string;
  toLabel: string;
  subjectLabel: string;
  subjectText: string;
  salutation: string;
  bodyIntro: string;
  bodyDuration: string;
  bodyOutro: string;
  signOff: string;
  studentLabel: string;
  classLabel: string;
  parentSignatureLabel: string;
  parentNameLabel: string;
  recipientTitle: string;
}

// ─── Reason Translations ─────────────────────────────────────────────────────
// Maps predefined reason keys to their display form in each language.
// If a reason key is NOT found here, it is treated as a custom/other reason
// and used as-is (no translation).

const REASON_TRANSLATIONS: Record<string, Record<Language, string>> = {
  sick: {
    English: "sick leave",
    Urdu: "بیماری کی رخصت",
    Hindi: "बीमारी की छुट्टी",
    Arabic: "مرض",
    French: "maladie",
    Spanish: "enfermedad",
    German: "Krankheit",
    Portuguese: "doença",
    Bengali: "অসুস্থতা",
    Punjabi: "ਬਿਮਾਰੀ",
    Turkish: "hastalık",
    Persian: "بیماری",
    Russian: "болезнь",
    Chinese: "生病",
    Japanese: "病気",
    Korean: "질병",
    Italian: "malattia",
    Dutch: "ziekte",
    Polish: "choroba",
    Swedish: "sjukdom",
  },
  family: {
    English: "a family function",
    Urdu: "خاندانی تقریب",
    Hindi: "पारिवारिक कार्यक्रम",
    Arabic: "مناسبة عائلية",
    French: "une fonction familiale",
    Spanish: "una función familiar",
    German: "eine Familienfeier",
    Portuguese: "uma função familiar",
    Bengali: "পারিবারিক অনুষ্ঠান",
    Punjabi: "ਪਰਿਵਾਰਕ ਸਮਾਰੋਹ",
    Turkish: "aile töreni",
    Persian: "مراسم خانوادگی",
    Russian: "семейное мероприятие",
    Chinese: "家庭活动",
    Japanese: "家族の行事",
    Korean: "가족 행사",
    Italian: "una funzione familiare",
    Dutch: "een familiebijeenkomst",
    Polish: "uroczystość rodzinna",
    Swedish: "familjehögtid",
  },
  personal: {
    English: "personal work",
    Urdu: "ذاتی کام",
    Hindi: "व्यक्तिगत कार्य",
    Arabic: "عمل شخصي",
    French: "travail personnel",
    Spanish: "trabajo personal",
    German: "persönliche Angelegenheiten",
    Portuguese: "trabalho pessoal",
    Bengali: "ব্যক্তিগত কাজ",
    Punjabi: "ਨਿੱਜੀ ਕੰਮ",
    Turkish: "kişisel iş",
    Persian: "کار شخصی",
    Russian: "личные дела",
    Chinese: "个人事务",
    Japanese: "個人的な用事",
    Korean: "개인 업무",
    Italian: "lavoro personale",
    Dutch: "persoonlijk werk",
    Polish: "sprawy osobiste",
    Swedish: "personliga ärenden",
  },
  emergency: {
    English: "an emergency",
    Urdu: "ہنگامی صورتحال",
    Hindi: "आपात स्थिति",
    Arabic: "حالة طارئة",
    French: "une urgence",
    Spanish: "una emergencia",
    German: "einen Notfall",
    Portuguese: "uma emergência",
    Bengali: "জরুরি পরিস্থিতি",
    Punjabi: "ਐਮਰਜੈਂਸੀ",
    Turkish: "acil durum",
    Persian: "اضطرار",
    Russian: "экстренная ситуация",
    Chinese: "紧急情况",
    Japanese: "緊急事態",
    Korean: "긴급 상황",
    Italian: "un'emergenza",
    Dutch: "een noodgeval",
    Polish: "sytuacja awaryjna",
    Swedish: "nödsituation",
  },
  medical: {
    English: "a medical appointment",
    Urdu: "طبی معائنہ",
    Hindi: "चिकित्सकीय अपॉइंटमेंट",
    Arabic: "موعد طبي",
    French: "un rendez-vous médical",
    Spanish: "una cita médica",
    German: "einen Arzttermin",
    Portuguese: "uma consulta médica",
    Bengali: "চিকিৎসা অ্যাপয়েন্টমেন্ট",
    Punjabi: "ਡਾਕਟਰੀ ਮੁਲਾਕਾਤ",
    Turkish: "tıbbi randevu",
    Persian: "قرار ملاقات پزشکی",
    Russian: "медицинский приём",
    Chinese: "医疗预约",
    Japanese: "医療予約",
    Korean: "의료 예약",
    Italian: "un appuntamento medico",
    Dutch: "een medische afspraak",
    Polish: "wizyta lekarska",
    Swedish: "läkarbesök",
  },
};

// Heading name (without suffix) per reason per language
const REASON_HEADING_NAMES: Record<string, Record<Language, string>> = {
  sick: {
    English: "Sick Leave",
    Urdu: "بیماری کی رخصت",
    Hindi: "बीमारी की छुट्टी",
    Arabic: "إجازة مرضية",
    French: "Congé maladie",
    Spanish: "Permiso por enfermedad",
    German: "Krankenurlaub",
    Portuguese: "Licença médica",
    Bengali: "অসুস্থতার ছুটি",
    Punjabi: "ਬਿਮਾਰੀ ਦੀ ਛੁੱਟੀ",
    Turkish: "Hastalık İzni",
    Persian: "مرخصی بیماری",
    Russian: "Больничный отпуск",
    Chinese: "病假",
    Japanese: "病気欠席",
    Korean: "병가",
    Italian: "Congedo per malattia",
    Dutch: "Ziekteverlof",
    Polish: "Urlop chorobowy",
    Swedish: "Sjukledighet",
  },
  family: {
    English: "Family Function",
    Urdu: "خاندانی تقریب",
    Hindi: "पारिवारिक कार्यक्रम",
    Arabic: "مناسبة عائلية",
    French: "Fonction Familiale",
    Spanish: "Función Familiar",
    German: "Familienfeier",
    Portuguese: "Função Familiar",
    Bengali: "পারিবারিক অনুষ্ঠান",
    Punjabi: "ਪਰਿਵਾਰਕ ਸਮਾਰੋਹ",
    Turkish: "Aile Töreni",
    Persian: "مراسم خانوادگی",
    Russian: "Семейное Мероприятие",
    Chinese: "家庭活动",
    Japanese: "家族行事",
    Korean: "가족 행사",
    Italian: "Funzione Familiare",
    Dutch: "Familiebijeenkomst",
    Polish: "Uroczystość Rodzinna",
    Swedish: "Familjehögtid",
  },
  personal: {
    English: "Personal Leave",
    Urdu: "ذاتی کام",
    Hindi: "व्यक्तिगत कार्य",
    Arabic: "إجازة شخصية",
    French: "Congé Personnel",
    Spanish: "Permiso Personal",
    German: "Persönlicher Urlaub",
    Portuguese: "Licença Pessoal",
    Bengali: "ব্যক্তিগত ছুটি",
    Punjabi: "ਨਿੱਜੀ ਛੁੱਟੀ",
    Turkish: "Kişisel İzin",
    Persian: "مرخصی شخصی",
    Russian: "Личный Отпуск",
    Chinese: "个人假期",
    Japanese: "個人的な休暇",
    Korean: "개인 휴가",
    Italian: "Permesso Personale",
    Dutch: "Persoonlijk Verlof",
    Polish: "Urlop Osobisty",
    Swedish: "Personlig Ledighet",
  },
  emergency: {
    English: "Emergency Leave",
    Urdu: "ہنگامی صورتحال",
    Hindi: "आपात स्थिति",
    Arabic: "إجازة طارئة",
    French: "Congé d'urgence",
    Spanish: "Permiso de Emergencia",
    German: "Notfall-Urlaub",
    Portuguese: "Licença de Emergência",
    Bengali: "জরুরি ছুটি",
    Punjabi: "ਐਮਰਜੈਂਸੀ ਛੁੱਟੀ",
    Turkish: "Acil İzin",
    Persian: "مرخصی اضطراری",
    Russian: "Экстренный Отпуск",
    Chinese: "紧急假期",
    Japanese: "緊急休暇",
    Korean: "긴급 휴가",
    Italian: "Permesso per Emergenza",
    Dutch: "Noodverlof",
    Polish: "Urlop Awaryjny",
    Swedish: "Nödledighet",
  },
  medical: {
    English: "Medical Appointment",
    Urdu: "طبی معائنہ",
    Hindi: "चिकित्सकीय अपॉइंटमेंट",
    Arabic: "موعد طبي",
    French: "Rendez-vous Médical",
    Spanish: "Cita Médica",
    German: "Arzttermin",
    Portuguese: "Consulta Médica",
    Bengali: "চিকিৎসা অ্যাপয়েন্টমেন্ট",
    Punjabi: "ਡਾਕਟਰੀ ਮੁਲਾਕਾਤ",
    Turkish: "Tıbbi Randevu",
    Persian: "قرار ملاقات پزشکی",
    Russian: "Медицинский Приём",
    Chinese: "医疗预约",
    Japanese: "医療予約",
    Korean: "의료 예약",
    Italian: "Appuntamento Medico",
    Dutch: "Medische Afspraak",
    Polish: "Wizyta Lekarska",
    Swedish: "Läkarbesök",
  },
};

// Application suffix per language (appended after the reason heading name)
const HEADING_SUFFIX: Record<Language, string> = {
  English: " Application",
  Urdu: " کی درخواست",
  Hindi: " के लिए आवेदन",
  Arabic: " - طلب",
  French: " - Demande",
  Spanish: " - Solicitud",
  German: " - Antrag",
  Portuguese: " - Pedido",
  Bengali: " - আবেদন",
  Punjabi: " - ਅਰਜ਼ੀ",
  Turkish: " - Talep",
  Persian: " - درخواست",
  Russian: " - Заявление",
  Chinese: " 申请",
  Japanese: " 申請",
  Korean: " 신청",
  Italian: " - Richiesta",
  Dutch: " - Aanvraag",
  Polish: " - Wniosek",
  Swedish: " - Ansökan",
};

// Generic "Leave Application" heading per language (for custom/other reasons)
const GENERIC_HEADING: Record<Language, string> = {
  English: "Leave Application",
  Urdu: "رخصت کی درخواست",
  Hindi: "छुट्टी के लिए आवेदन",
  Arabic: "طلب إجازة",
  French: "Demande de Congé",
  Spanish: "Solicitud de Permiso",
  German: "Urlaubsantrag",
  Portuguese: "Pedido de Licença",
  Bengali: "ছুটির আবেদন",
  Punjabi: "ਛੁੱਟੀ ਲਈ ਅਰਜ਼ੀ",
  Turkish: "İzin Talebi",
  Persian: "درخواست مرخصی",
  Russian: "Заявление на Отпуск",
  Chinese: "请假申请",
  Japanese: "欠席届",
  Korean: "휴가 신청서",
  Italian: "Richiesta di Congedo",
  Dutch: "Verlofaanvraag",
  Polish: "Wniosek o Urlop",
  Swedish: "Ledighetsansökan",
};

/**
 * Returns the translated reason text for use in the application body.
 * For predefined reasons: returns the translated text in the given language.
 * For custom/other reasons: returns the text exactly as entered (no translation).
 */
export function getTranslatedReason(
  reason: string,
  language: Language,
): string {
  const translations = REASON_TRANSLATIONS[reason.trim()];
  if (translations) {
    return translations[language] ?? translations.English;
  }
  // Custom/other reason — return as-is
  return reason.trim();
}

/**
 * Returns the full application heading translated to the given language.
 * E.g. for "sick" + "Urdu" → "بیماری کی رخصت کی درخواست"
 * For custom reasons → generic "Leave Application" in that language.
 */
export function getApplicationHeading(
  reason: string,
  language: Language = "English",
): string {
  const trimmed = reason.trim();
  const headingNames = REASON_HEADING_NAMES[trimmed];
  if (headingNames) {
    const name = headingNames[language] ?? headingNames.English;
    const suffix = HEADING_SUFFIX[language] ?? " Application";
    return name + suffix;
  }
  // Custom reason: use generic heading in the selected language
  return GENERIC_HEADING[language] ?? "Leave Application";
}

// ─────────────────────────────────────────────────────────────────────────────

function getRecipientTitle(
  recipientType: RecipientType,
  language: Language,
): string {
  const titles: Record<RecipientType, Record<Language, string>> = {
    principal: {
      English: "The Principal",
      Urdu: "پرنسپل صاحب",
      Hindi: "प्रधानाचार्य महोदय",
      Arabic: "مدير المدرسة",
      French: "Le Directeur",
      Spanish: "El Director",
      German: "Der Schulleiter",
      Portuguese: "O Diretor",
      Bengali: "অধ্যক্ষ মহোদয়",
      Punjabi: "ਪ੍ਰਿੰਸੀਪਲ ਸਾਹਿਬ",
      Turkish: "Okul Müdürü",
      Persian: "مدیر مدرسه",
      Russian: "Директор",
      Chinese: "校长",
      Japanese: "校長先生",
      Korean: "교장 선생님",
      Italian: "Il Preside",
      Dutch: "De Directeur",
      Polish: "Dyrektor",
      Swedish: "Rektor",
    },
    teacher: {
      English: "The Class Teacher",
      Urdu: "کلاس ٹیچر",
      Hindi: "कक्षा अध्यापक",
      Arabic: "معلم الفصل",
      French: "Le Professeur Principal",
      Spanish: "El Profesor de Clase",
      German: "Der Klassenlehrer",
      Portuguese: "O Professor de Turma",
      Bengali: "শ্রেণী শিক্ষক",
      Punjabi: "ਕਲਾਸ ਟੀਚਰ",
      Turkish: "Sınıf Öğretmeni",
      Persian: "معلم کلاس",
      Russian: "Классный руководитель",
      Chinese: "班主任",
      Japanese: "担任の先生",
      Korean: "담임 선생님",
      Italian: "L'Insegnante di Classe",
      Dutch: "De Klassenleraar",
      Polish: "Wychowawca Klasy",
      Swedish: "Klassläraren",
    },
    hod: {
      English: "The Head of Department",
      Urdu: "ڈیپارٹمنٹ ہیڈ",
      Hindi: "विभागाध्यक्ष",
      Arabic: "رئيس القسم",
      French: "Le Chef de Département",
      Spanish: "El Jefe de Departamento",
      German: "Der Abteilungsleiter",
      Portuguese: "O Chefe de Departamento",
      Bengali: "বিভাগীয় প্রধান",
      Punjabi: "ਵਿਭਾਗ ਮੁਖੀ",
      Turkish: "Bölüm Başkanı",
      Persian: "رئیس بخش",
      Russian: "Заведующий кафедрой",
      Chinese: "系主任",
      Japanese: "学科長",
      Korean: "학과장",
      Italian: "Il Capo Dipartimento",
      Dutch: "Het Afdelingshoofd",
      Polish: "Kierownik Działu",
      Swedish: "Avdelningschef",
    },
    manager: {
      English: "The Manager",
      Urdu: "مینیجر",
      Hindi: "प्रबंधक",
      Arabic: "المدير",
      French: "Le Directeur",
      Spanish: "El Gerente",
      German: "Der Manager",
      Portuguese: "O Gerente",
      Bengali: "ম্যানেজার",
      Punjabi: "ਮੈਨੇਜਰ",
      Turkish: "Müdür",
      Persian: "مدیر",
      Russian: "Менеджер",
      Chinese: "经理",
      Japanese: "マネージャー",
      Korean: "매니저",
      Italian: "Il Manager",
      Dutch: "De Manager",
      Polish: "Kierownik",
      Swedish: "Chefen",
    },
    hr: {
      English: "The HR Manager",
      Urdu: "ایچ آر مینیجر",
      Hindi: "एचआर प्रबंधक",
      Arabic: "مدير الموارد البشرية",
      French: "Le Responsable RH",
      Spanish: "El Gerente de RRHH",
      German: "Der HR-Manager",
      Portuguese: "O Gerente de RH",
      Bengali: "এইচআর ম্যানেজার",
      Punjabi: "ਐਚਆਰ ਮੈਨੇਜਰ",
      Turkish: "İK Müdürü",
      Persian: "مدیر منابع انسانی",
      Russian: "HR-менеджер",
      Chinese: "人力资源经理",
      Japanese: "人事マネージャー",
      Korean: "HR 매니저",
      Italian: "Il Responsabile delle Risorse Umane",
      Dutch: "De HR-Manager",
      Polish: "Kierownik HR",
      Swedish: "HR-chefen",
    },
  };
  return (
    titles[recipientType]?.[language] ??
    titles[recipientType]?.English ??
    "The Principal"
  );
}

function getLanguageStrings(params: LetterParams): LanguageStrings {
  const {
    language,
    recipientType,
    reason,
    startDate,
    endDate,
    durationType,
    halfDay,
  } = params;

  const formattedStart = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEnd = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const recipientTitle = getRecipientTitle(recipientType, language);

  // Translated reason — predefined keys get translated; custom text stays as-is
  const reasonDisplay = getTranslatedReason(reason, language);

  const strings: Record<Language, LanguageStrings> = {
    English: {
      dateLabel: "Date",
      toLabel: "To",
      subjectLabel: "Subject",
      subjectText: "Application for Leave",
      salutation: "Respected Sir/Madam,",
      bodyIntro: `I am writing to respectfully request ${halfDay ? "a half-day leave" : "leave"} on ${formattedStart}${durationType === "range" ? ` to ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `The total duration of my leave will be ${diffDays} days.`
          : "",
      bodyOutro: `The reason for my leave is: ${reasonDisplay}. I kindly request you to grant me leave for the mentioned period. I will ensure that all pending work is completed upon my return.`,
      signOff: "Yours sincerely,",
      studentLabel: "Name",
      classLabel: "Class/Roll No.",
      parentSignatureLabel: "Parent's / Guardian's Signature",
      parentNameLabel: "Parent's Name",
      recipientTitle,
    },
    Urdu: {
      dateLabel: "تاریخ",
      toLabel: "بخدمت",
      subjectLabel: "موضوع",
      subjectText: "درخواست برائے رخصت",
      salutation: "جناب / محترمہ،",
      bodyIntro: `میں ${formattedStart}${durationType === "range" ? ` سے ${formattedEnd}` : ""} تک ${halfDay ? "نصف دن کی " : ""}رخصت کی درخواست کرتا/کرتی ہوں۔`,
      bodyDuration:
        durationType === "range"
          ? `میری رخصت کی کل مدت ${diffDays} دن ہوگی۔`
          : "",
      bodyOutro: `رخصت کی وجہ: ${reasonDisplay}۔ براہ کرم مجھے مذکورہ مدت کے لیے رخصت عنایت فرمائیں۔ واپسی پر تمام زیر التواء کام مکمل کر لوں گا/گی۔`,
      signOff: "آپ کا/کی مخلص،",
      studentLabel: "نام",
      classLabel: "جماعت/رول نمبر",
      parentSignatureLabel: "والدین / سرپرست کے دستخط",
      parentNameLabel: "والدین کا نام",
      recipientTitle,
    },
    Hindi: {
      dateLabel: "दिनांक",
      toLabel: "सेवा में",
      subjectLabel: "विषय",
      subjectText: "अवकाश हेतु प्रार्थना पत्र",
      salutation: "महोदय/महोदया,",
      bodyIntro: `मैं ${formattedStart}${durationType === "range" ? ` से ${formattedEnd}` : ""} तक ${halfDay ? "आधे दिन के " : ""}अवकाश के लिए निवेदन करता/करती हूँ।`,
      bodyDuration:
        durationType === "range"
          ? `मेरी छुट्टी की कुल अवधि ${diffDays} दिन होगी।`
          : "",
      bodyOutro: `अवकाश का कारण: ${reasonDisplay}। कृपया मुझे उक्त अवधि के लिए अवकाश प्रदान करें। वापसी पर सभी लंबित कार्य पूर्ण कर लूँगा/लूँगी।`,
      signOff: "आपका/आपकी आज्ञाकारी,",
      studentLabel: "नाम",
      classLabel: "कक्षा/रोल नं.",
      parentSignatureLabel: "अभिभावक के हस्ताक्षर",
      parentNameLabel: "अभिभावक का नाम",
      recipientTitle,
    },
    Arabic: {
      dateLabel: "التاريخ",
      toLabel: "إلى",
      subjectLabel: "الموضوع",
      subjectText: "طلب إجازة",
      salutation: "حضرة السيد/السيدة المحترم/ة،",
      bodyIntro: `أتقدم بطلب ${halfDay ? "إجازة نصف يوم" : "إجازة"} من ${formattedStart}${durationType === "range" ? ` إلى ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `مدة الإجازة الإجمالية ${diffDays} أيام.`
          : "",
      bodyOutro: `سبب الإجازة: ${reasonDisplay}. أرجو التكرم بمنحي الإجازة للمدة المذكورة، وسأحرص على إنجاز جميع الأعمال المتأخرة فور عودتي.`,
      signOff: "مع التقدير،",
      studentLabel: "الاسم",
      classLabel: "الفصل/رقم القيد",
      parentSignatureLabel: "توقيع ولي الأمر",
      parentNameLabel: "اسم ولي الأمر",
      recipientTitle,
    },
    French: {
      dateLabel: "Date",
      toLabel: "À",
      subjectLabel: "Objet",
      subjectText: "Demande de congé",
      salutation: "Madame, Monsieur,",
      bodyIntro: `Je me permets de solliciter un ${halfDay ? "congé de demi-journée le" : "congé du"} ${formattedStart}${durationType === "range" ? ` au ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `La durée totale de mon congé sera de ${diffDays} jours.`
          : "",
      bodyOutro: `La raison de mon absence est : ${reasonDisplay}. Je vous prie de bien vouloir m'accorder ce congé. Je veillerai à rattraper tout le travail en retard à mon retour.`,
      signOff: "Veuillez agréer mes salutations distinguées,",
      studentLabel: "Nom",
      classLabel: "Classe/N° de rôle",
      parentSignatureLabel: "Signature du parent/tuteur",
      parentNameLabel: "Nom du parent",
      recipientTitle,
    },
    Spanish: {
      dateLabel: "Fecha",
      toLabel: "A",
      subjectLabel: "Asunto",
      subjectText: "Solicitud de permiso",
      salutation: "Estimado/a señor/señora,",
      bodyIntro: `Me dirijo a usted para solicitar ${halfDay ? "permiso de medio día el" : "permiso desde el"} ${formattedStart}${durationType === "range" ? ` hasta el ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `La duración total de mi permiso será de ${diffDays} días.`
          : "",
      bodyOutro: `El motivo de mi ausencia es: ${reasonDisplay}. Le ruego que me conceda el permiso para el período mencionado. Me aseguraré de completar todo el trabajo pendiente a mi regreso.`,
      signOff: "Atentamente,",
      studentLabel: "Nombre",
      classLabel: "Clase/N° de lista",
      parentSignatureLabel: "Firma del padre/tutor",
      parentNameLabel: "Nombre del padre",
      recipientTitle,
    },
    German: {
      dateLabel: "Datum",
      toLabel: "An",
      subjectLabel: "Betreff",
      subjectText: "Antrag auf Beurlaubung",
      salutation: "Sehr geehrte Damen und Herren,",
      bodyIntro: `Ich bitte um ${halfDay ? "halbstündige Beurlaubung am" : "Beurlaubung vom"} ${formattedStart}${durationType === "range" ? ` bis ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `Die Gesamtdauer meines Urlaubs beträgt ${diffDays} Tage.`
          : "",
      bodyOutro: `Der Grund für meinen Urlaub ist: ${reasonDisplay}. Ich bitte Sie, mir für den genannten Zeitraum Urlaub zu gewähren. Ich werde dafür sorgen, dass alle ausstehenden Arbeiten nach meiner Rückkehr erledigt werden.`,
      signOff: "Mit freundlichen Grüßen,",
      studentLabel: "Name",
      classLabel: "Klasse/Matrikelnr.",
      parentSignatureLabel:
        "Unterschrift des Elternteils/Erziehungsberechtigten",
      parentNameLabel: "Name des Elternteils",
      recipientTitle,
    },
    Portuguese: {
      dateLabel: "Data",
      toLabel: "Para",
      subjectLabel: "Assunto",
      subjectText: "Pedido de licença",
      salutation: "Prezado(a) Senhor(a),",
      bodyIntro: `Venho por meio desta solicitar ${halfDay ? "licença de meio período em" : "licença de"} ${formattedStart}${durationType === "range" ? ` a ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `A duração total da minha licença será de ${diffDays} dias.`
          : "",
      bodyOutro: `O motivo da minha ausência é: ${reasonDisplay}. Solicito gentilmente que me conceda licença pelo período mencionado. Garantirei que todo o trabalho pendente seja concluído após meu retorno.`,
      signOff: "Atenciosamente,",
      studentLabel: "Nome",
      classLabel: "Turma/N° de chamada",
      parentSignatureLabel: "Assinatura do pai/responsável",
      parentNameLabel: "Nome do pai",
      recipientTitle,
    },
    Bengali: {
      dateLabel: "তারিখ",
      toLabel: "বরাবর",
      subjectLabel: "বিষয়",
      subjectText: "ছুটির আবেদন",
      salutation: "মহোদয়/মহোদয়া,",
      bodyIntro: `আমি ${formattedStart}${durationType === "range" ? ` থেকে ${formattedEnd}` : ""} পর্যন্ত ${halfDay ? "অর্ধদিনের " : ""}ছুটির জন্য আবেদন করছি।`,
      bodyDuration:
        durationType === "range"
          ? `আমার ছুটির মোট সময়কাল ${diffDays} দিন হবে।`
          : "",
      bodyOutro: `ছুটির কারণ: ${reasonDisplay}। অনুগ্রহ করে উল্লিখিত সময়ের জন্য আমাকে ছুটি মঞ্জুর করুন। ফিরে আসার পর সমস্ত বকেয়া কাজ সম্পন্ন করব।`,
      signOff: "আপনার বিশ্বস্ত,",
      studentLabel: "নাম",
      classLabel: "শ্রেণী/রোল নং",
      parentSignatureLabel: "অভিভাবকের স্বাক্ষর",
      parentNameLabel: "অভিভাবকের নাম",
      recipientTitle,
    },
    Punjabi: {
      dateLabel: "ਮਿਤੀ",
      toLabel: "ਸੇਵਾ ਵਿੱਚ",
      subjectLabel: "ਵਿਸ਼ਾ",
      subjectText: "ਛੁੱਟੀ ਲਈ ਅਰਜ਼ੀ",
      salutation: "ਸ੍ਰੀਮਾਨ/ਸ੍ਰੀਮਤੀ ਜੀ,",
      bodyIntro: `ਮੈਂ ${formattedStart}${durationType === "range" ? ` ਤੋਂ ${formattedEnd}` : ""} ਤੱਕ ${halfDay ? "ਅੱਧੇ ਦਿਨ ਦੀ " : ""}ਛੁੱਟੀ ਲਈ ਬੇਨਤੀ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।`,
      bodyDuration:
        durationType === "range"
          ? `ਮੇਰੀ ਛੁੱਟੀ ਦੀ ਕੁੱਲ ਮਿਆਦ ${diffDays} ਦਿਨ ਹੋਵੇਗੀ।`
          : "",
      bodyOutro: `ਛੁੱਟੀ ਦਾ ਕਾਰਨ: ${reasonDisplay}। ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੀ ਮਿਆਦ ਲਈ ਛੁੱਟੀ ਦਿਓ। ਵਾਪਸ ਆਉਣ 'ਤੇ ਸਾਰਾ ਬਕਾਇਆ ਕੰਮ ਪੂਰਾ ਕਰ ਲਵਾਂਗਾ/ਲਵਾਂਗੀ।`,
      signOff: "ਤੁਹਾਡਾ/ਤੁਹਾਡੀ ਵਿਸ਼ਵਾਸਪਾਤਰ,",
      studentLabel: "ਨਾਮ",
      classLabel: "ਜਮਾਤ/ਰੋਲ ਨੰ.",
      parentSignatureLabel: "ਮਾਤਾ-ਪਿਤਾ / ਸਰਪ੍ਰਸਤ ਦੇ ਦਸਤਖਤ",
      parentNameLabel: "ਮਾਤਾ-ਪਿਤਾ ਦਾ ਨਾਮ",
      recipientTitle,
    },
    Turkish: {
      dateLabel: "Tarih",
      toLabel: "Kime",
      subjectLabel: "Konu",
      subjectText: "İzin Talebi",
      salutation: "Sayın Yetkili,",
      bodyIntro: `${formattedStart}${durationType === "range" ? ` - ${formattedEnd}` : ""} tarihleri arasında ${halfDay ? "yarım günlük izin talep ediyorum" : "izin talep ediyorum"}.`,
      bodyDuration:
        durationType === "range"
          ? `İzin sürem toplam ${diffDays} gün olacaktır.`
          : "",
      bodyOutro: `İzin nedenim: ${reasonDisplay}. Belirtilen süre için izin verilmesini saygıyla talep ederim. Dönüşümde tüm bekleyen işleri tamamlayacağım.`,
      signOff: "Saygılarımla,",
      studentLabel: "Ad Soyad",
      classLabel: "Sınıf/Öğrenci No.",
      parentSignatureLabel: "Veli / Vasi İmzası",
      parentNameLabel: "Veli Adı",
      recipientTitle,
    },
    Persian: {
      dateLabel: "تاریخ",
      toLabel: "به",
      subjectLabel: "موضوع",
      subjectText: "درخواست مرخصی",
      salutation: "جناب آقا/خانم محترم،",
      bodyIntro: `اینجانب درخواست ${halfDay ? "نیم‌روز مرخصی در تاریخ" : "مرخصی از تاریخ"} ${formattedStart}${durationType === "range" ? ` تا ${formattedEnd}` : ""} را دارم.`,
      bodyDuration:
        durationType === "range"
          ? `مدت کل مرخصی اینجانب ${diffDays} روز خواهد بود.`
          : "",
      bodyOutro: `دلیل مرخصی: ${reasonDisplay}. خواهشمندم مرخصی برای مدت ذکر شده اعطا فرمایید. پس از بازگشت تمام کارهای معوق را انجام خواهم داد.`,
      signOff: "با احترام،",
      studentLabel: "نام",
      classLabel: "کلاس/شماره دانش‌آموزی",
      parentSignatureLabel: "امضای والدین / سرپرست",
      parentNameLabel: "نام والدین",
      recipientTitle,
    },
    Russian: {
      dateLabel: "Дата",
      toLabel: "Кому",
      subjectLabel: "Тема",
      subjectText: "Заявление на отпуск",
      salutation: "Уважаемый(ая),",
      bodyIntro: `Прошу предоставить мне ${halfDay ? "отгул на полдня" : "отпуск с"} ${formattedStart}${durationType === "range" ? ` по ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `Общая продолжительность отпуска составит ${diffDays} дней.`
          : "",
      bodyOutro: `Причина отпуска: ${reasonDisplay}. Прошу предоставить отпуск на указанный период. По возвращении я выполню всю незавершённую работу.`,
      signOff: "С уважением,",
      studentLabel: "Имя",
      classLabel: "Класс/№ студ. билета",
      parentSignatureLabel: "Подпись родителя/опекуна",
      parentNameLabel: "Имя родителя",
      recipientTitle,
    },
    Chinese: {
      dateLabel: "日期",
      toLabel: "致",
      subjectLabel: "主题",
      subjectText: "请假申请",
      salutation: "尊敬的老师/领导：",
      bodyIntro: `我申请从 ${formattedStart}${durationType === "range" ? ` 至 ${formattedEnd}` : ""} ${halfDay ? "半天假" : "请假"}。`,
      bodyDuration:
        durationType === "range" ? `请假总时长为 ${diffDays} 天。` : "",
      bodyOutro: `请假原因：${reasonDisplay}。请批准我上述时间段的假期申请。返回后，我将确保完成所有未完成的工作。`,
      signOff: "此致，",
      studentLabel: "姓名",
      classLabel: "班级/学号",
      parentSignatureLabel: "家长/监护人签名",
      parentNameLabel: "家长姓名",
      recipientTitle,
    },
    Japanese: {
      dateLabel: "日付",
      toLabel: "宛先",
      subjectLabel: "件名",
      subjectText: "欠席届",
      salutation: "拝啓、",
      bodyIntro: `${formattedStart}${durationType === "range" ? `から${formattedEnd}` : ""}まで${halfDay ? "半休を申請いたします" : "休暇を申請いたします"}。`,
      bodyDuration:
        durationType === "range"
          ? `休暇の合計期間は${diffDays}日間となります。`
          : "",
      bodyOutro: `休暇の理由：${reasonDisplay}。上記の期間について休暇をお認めいただきますようお願い申し上げます。帰校後は未完了の課題を必ず完了いたします。`,
      signOff: "敬具、",
      studentLabel: "氏名",
      classLabel: "クラス/出席番号",
      parentSignatureLabel: "保護者署名",
      parentNameLabel: "保護者名",
      recipientTitle,
    },
    Korean: {
      dateLabel: "날짜",
      toLabel: "수신",
      subjectLabel: "제목",
      subjectText: "결석 신청서",
      salutation: "존경하는 선생님께,",
      bodyIntro: `${formattedStart}${durationType === "range" ? `부터 ${formattedEnd}` : ""}까지 ${halfDay ? "반차를 신청합니다" : "휴가를 신청합니다"}.`,
      bodyDuration:
        durationType === "range" ? `휴가 총 기간은 ${diffDays}일입니다.` : "",
      bodyOutro: `휴가 사유: ${reasonDisplay}. 해당 기간 동안 휴가를 허락해 주시기 바랍니다. 복귀 후 모든 미완료 과제를 완료하겠습니다.`,
      signOff: "감사합니다,",
      studentLabel: "이름",
      classLabel: "학급/학번",
      parentSignatureLabel: "학부모/보호자 서명",
      parentNameLabel: "학부모 이름",
      recipientTitle,
    },
    Italian: {
      dateLabel: "Data",
      toLabel: "A",
      subjectLabel: "Oggetto",
      subjectText: "Richiesta di congedo",
      salutation: "Gentile Signore/Signora,",
      bodyIntro: `Con la presente richiedo ${halfDay ? "un permesso di mezza giornata il" : "un congedo dal"} ${formattedStart}${durationType === "range" ? ` al ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `La durata totale del mio congedo sarà di ${diffDays} giorni.`
          : "",
      bodyOutro: `Il motivo della mia assenza è: ${reasonDisplay}. La prego di concedermi il congedo per il periodo indicato. Al mio rientro provvederò a completare tutto il lavoro arretrato.`,
      signOff: "Distinti saluti,",
      studentLabel: "Nome",
      classLabel: "Classe/N° di matricola",
      parentSignatureLabel: "Firma del genitore/tutore",
      parentNameLabel: "Nome del genitore",
      recipientTitle,
    },
    Dutch: {
      dateLabel: "Datum",
      toLabel: "Aan",
      subjectLabel: "Onderwerp",
      subjectText: "Verlofaanvraag",
      salutation: "Geachte heer/mevrouw,",
      bodyIntro: `Hierbij verzoek ik ${halfDay ? "een halve dag verlof op" : "verlof van"} ${formattedStart}${durationType === "range" ? ` tot ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `De totale duur van mijn verlof zal ${diffDays} dagen zijn.`
          : "",
      bodyOutro: `De reden voor mijn verlof is: ${reasonDisplay}. Ik verzoek u vriendelijk mij verlof te verlenen voor de genoemde periode. Na mijn terugkeer zal ik al het achterstallige werk inhalen.`,
      signOff: "Met vriendelijke groet,",
      studentLabel: "Naam",
      classLabel: "Klas/Studentnr.",
      parentSignatureLabel: "Handtekening ouder/voogd",
      parentNameLabel: "Naam ouder",
      recipientTitle,
    },
    Polish: {
      dateLabel: "Data",
      toLabel: "Do",
      subjectLabel: "Temat",
      subjectText: "Wniosek o urlop",
      salutation: "Szanowny Panie/Szanowna Pani,",
      bodyIntro: `Zwracam się z prośbą o udzielenie ${halfDay ? "urlopu na pół dnia" : "urlopu od"} ${formattedStart}${durationType === "range" ? ` do ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `Łączny czas urlopu wyniesie ${diffDays} dni.`
          : "",
      bodyOutro: `Powód urlopu: ${reasonDisplay}. Proszę o udzielenie urlopu na wskazany okres. Po powrocie uzupełnię wszystkie zaległe prace.`,
      signOff: "Z poważaniem,",
      studentLabel: "Imię i nazwisko",
      classLabel: "Klasa/Nr indeksu",
      parentSignatureLabel: "Podpis rodzica/opiekuna",
      parentNameLabel: "Imię rodzica",
      recipientTitle,
    },
    Swedish: {
      dateLabel: "Datum",
      toLabel: "Till",
      subjectLabel: "Ämne",
      subjectText: "Ansökan om ledighet",
      salutation: "Ärade herre/fru,",
      bodyIntro: `Jag ansöker härmed ${halfDay ? "om halvdagsledighet" : "om ledighet från"} ${formattedStart}${durationType === "range" ? ` till ${formattedEnd}` : ""}.`,
      bodyDuration:
        durationType === "range"
          ? `Den totala ledigheten kommer att vara ${diffDays} dagar.`
          : "",
      bodyOutro: `Anledningen till min ledighet är: ${reasonDisplay}. Jag ber er vänligen bevilja mig ledighet för den nämnda perioden. Jag kommer att se till att allt utestående arbete slutförs vid min återkomst.`,
      signOff: "Med vänliga hälsningar,",
      studentLabel: "Namn",
      classLabel: "Klass/Studentnr.",
      parentSignatureLabel: "Förälder/vårdnadshavares underskrift",
      parentNameLabel: "Förälders namn",
      recipientTitle,
    },
  };

  return strings[language] ?? strings.English;
}

export function generateLeaveApplicationLetter(params: LetterParams): string {
  const {
    studentName,
    className,
    recipientName,
    schoolName,
    parentName,
    startDate,
    language,
    reason,
  } = params;

  const s = getLanguageStrings(params);
  const isRTL = isRTLLanguage(language);

  // formattedDate — only the value, no label
  const formattedDate = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dir = isRTL ? "rtl" : "ltr";
  const textAlign = isRTL ? "right" : "left";
  const dateAlign = isRTL ? "left" : "right";

  // Heading translated to the selected language
  const applicationHeading = getApplicationHeading(reason, language);

  // Professional PDF layout with improved spacing and RTL support
  return `
<div style="font-family: 'Arial', 'Noto Nastaliq Urdu', 'Noto Sans Devanagari', sans-serif; max-width: 680px; margin: 0 auto; padding: 40px 36px; direction: ${dir}; color: #1a1a1a; background: #fff;">

  <!-- Heading -->
  <div style="text-align: center; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 2px solid #2563eb;">
    <h2 style="font-size: 1.3em; font-weight: 700; letter-spacing: 0.01em; margin: 0; color: #1e3a5f;">${applicationHeading}</h2>
  </div>

  <!-- Date -->
  <div style="text-align: ${dateAlign}; margin-bottom: 24px;">
    <span style="font-size: 0.95em;"><strong>${s.dateLabel}:</strong> ${formattedDate}</span>
  </div>

  <!-- Recipient Block -->
  <div style="margin-bottom: 24px; padding: 12px 16px; background: #f0f6ff; border-${isRTL ? "right" : "left"}: 4px solid #2563eb; border-radius: 4px; text-align: ${textAlign};">
    <p style="margin: 0 0 4px; font-weight: 600;">${s.toLabel},</p>
    <p style="margin: 0 0 4px;">${s.recipientTitle}</p>
    ${recipientName.trim() ? `<p style="margin: 0 0 4px;">${recipientName.trim()}</p>` : ""}
    ${schoolName.trim() ? `<p style="margin: 0;">${schoolName.trim()}</p>` : ""}
  </div>

  <!-- Subject Box -->
  <div style="margin-bottom: 24px; background: #e8f0fe; padding: 10px 16px; border-radius: 4px; text-align: ${textAlign};">
    <span style="font-weight: 700; font-size: 0.97em;">${s.subjectLabel}: ${s.subjectText}</span>
  </div>

  <!-- Salutation -->
  <p style="margin-bottom: 16px; font-size: 0.97em; text-align: ${textAlign};">${s.salutation}</p>

  <!-- Body -->
  <p style="margin-bottom: 14px; line-height: 1.8; text-align: justify;">${s.bodyIntro}${s.bodyDuration ? ` ${s.bodyDuration}` : ""}</p>

  <p style="margin-bottom: 28px; line-height: 1.8; text-align: justify;">${s.bodyOutro}</p>

  <!-- Sign-off -->
  <div style="text-align: ${dateAlign}; margin-top: 8px;">
    <p style="margin: 0 0 4px;">${s.signOff}</p>
    <p style="margin: 6px 0 2px; font-weight: 700; font-size: 1em;">${studentName.trim()}</p>
    ${className.trim() ? `<p style="margin: 0; font-size: 0.93em;">${s.classLabel}: ${className.trim()}</p>` : ""}
  </div>

  <!-- Parent Signature -->
  <div style="margin-top: 36px; border-top: 1px dashed #9ca3af; padding-top: 16px; text-align: ${textAlign};">
    <p style="margin: 0 0 8px;"><strong>${s.parentSignatureLabel}:</strong> ___________________</p>
    ${parentName?.trim() ? `<p style="margin: 0; font-size: 0.95em;"><strong>${s.parentNameLabel}:</strong> ${parentName.trim()}</p>` : ""}
  </div>

</div>
  `.trim();
}

export function generateLeaveApplicationText(params: LetterParams): string {
  const {
    studentName,
    className,
    recipientName,
    schoolName,
    parentName,
    startDate,
    language,
    reason,
  } = params;

  const s = getLanguageStrings(params);

  const formattedDate = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Heading translated to the selected language
  const applicationHeading = getApplicationHeading(reason, language);

  const lines: string[] = [];

  lines.push(applicationHeading);
  lines.push("");
  lines.push(`${s.dateLabel}: ${formattedDate}`);
  lines.push("");
  lines.push(`${s.toLabel},`);
  lines.push(s.recipientTitle);
  if (recipientName.trim()) lines.push(recipientName.trim());
  if (schoolName.trim()) lines.push(schoolName.trim());
  lines.push("");
  lines.push(`${s.subjectLabel}: ${s.subjectText}`);
  lines.push("");
  lines.push(s.salutation);
  lines.push("");
  lines.push(`${s.bodyIntro}${s.bodyDuration ? ` ${s.bodyDuration}` : ""}`);
  lines.push("");
  lines.push(s.bodyOutro);
  lines.push("");
  lines.push(s.signOff);
  lines.push(studentName.trim());
  if (className.trim()) lines.push(`${s.classLabel}: ${className.trim()}`);
  lines.push("");
  lines.push(`${s.parentSignatureLabel}: ___________________`);
  if (parentName?.trim())
    lines.push(`${s.parentNameLabel}: ${parentName.trim()}`);

  return lines.join("\n");
}

export type { LetterParams };
