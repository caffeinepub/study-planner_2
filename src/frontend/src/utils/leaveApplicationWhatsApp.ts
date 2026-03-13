import type { Language } from "./leaveApplicationLetterTemplate";
import { getTranslatedReason } from "./leaveApplicationLetterTemplate";

interface WhatsAppStrings {
  greeting: string;
  intro: string;
  reasonLabel: string;
  dateLabel: string;
  studentLabel: string;
  classLabel: string;
  thankyou: string;
}

const WA_STRINGS: Record<Language, WhatsAppStrings> = {
  English: {
    greeting: "Dear Sir/Madam,",
    intro: "I respectfully request leave for the following reason.",
    reasonLabel: "Reason",
    dateLabel: "Date",
    studentLabel: "Student Name",
    classLabel: "Class",
    thankyou: "Thank you.",
  },
  Urdu: {
    greeting: "محترم سر / میڈم،",
    intro: "میں درج ذیل وجہ کی بنا پر رخصت کی درخواست کرتا ہوں۔",
    reasonLabel: "وجہ",
    dateLabel: "تاریخ",
    studentLabel: "طالب علم",
    classLabel: "جماعت",
    thankyou: "شکریہ۔",
  },
  Hindi: {
    greeting: "आदरणीय सर/मैडम,",
    intro: "मैं निम्न कारण से अवकाश का अनुरोध करता हूँ।",
    reasonLabel: "कारण",
    dateLabel: "तिथि",
    studentLabel: "छात्र का नाम",
    classLabel: "कक्षा",
    thankyou: "धन्यवाद।",
  },
  Arabic: {
    greeting: "حضرة السيد/السيدة،",
    intro: "أتقدم باحترام بطلب إجازة للسبب التالي.",
    reasonLabel: "السبب",
    dateLabel: "التاريخ",
    studentLabel: "اسم الطالب",
    classLabel: "الفصل",
    thankyou: "شكراً جزيلاً.",
  },
  French: {
    greeting: "Madame, Monsieur,",
    intro: "Je sollicite respectueusement un congé pour la raison suivante.",
    reasonLabel: "Raison",
    dateLabel: "Date",
    studentLabel: "Nom de l'élève",
    classLabel: "Classe",
    thankyou: "Merci.",
  },
  Spanish: {
    greeting: "Estimado/a señor/señora,",
    intro: "Solicito respetuosamente permiso por el siguiente motivo.",
    reasonLabel: "Motivo",
    dateLabel: "Fecha",
    studentLabel: "Nombre del alumno",
    classLabel: "Clase",
    thankyou: "Gracias.",
  },
  German: {
    greeting: "Sehr geehrte Damen und Herren,",
    intro: "Ich beantrage höflich Urlaub aus folgendem Grund.",
    reasonLabel: "Grund",
    dateLabel: "Datum",
    studentLabel: "Name des Schülers",
    classLabel: "Klasse",
    thankyou: "Danke.",
  },
  Portuguese: {
    greeting: "Prezado(a) Senhor(a),",
    intro: "Solicito respeitosamente licença pelo seguinte motivo.",
    reasonLabel: "Motivo",
    dateLabel: "Data",
    studentLabel: "Nome do aluno",
    classLabel: "Turma",
    thankyou: "Obrigado.",
  },
  Bengali: {
    greeting: "মহোদয়/মহোদয়া,",
    intro: "আমি নিম্নলিখিত কারণে ছুটির জন্য বিনম্রভাবে আবেদন করছি।",
    reasonLabel: "কারণ",
    dateLabel: "তারিখ",
    studentLabel: "শিক্ষার্থীর নাম",
    classLabel: "শ্রেণী",
    thankyou: "ধন্যবাদ।",
  },
  Punjabi: {
    greeting: "ਸ੍ਰੀਮਾਨ/ਸ੍ਰੀਮਤੀ ਜੀ,",
    intro: "ਮੈਂ ਹੇਠ ਲਿਖੇ ਕਾਰਨ ਕਰਕੇ ਛੁੱਟੀ ਲਈ ਬੇਨਤੀ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।",
    reasonLabel: "ਕਾਰਨ",
    dateLabel: "ਮਿਤੀ",
    studentLabel: "ਵਿਦਿਆਰਥੀ ਦਾ ਨਾਮ",
    classLabel: "ਜਮਾਤ",
    thankyou: "ਧੰਨਵਾਦ।",
  },
  Turkish: {
    greeting: "Sayın Yetkili,",
    intro: "Aşağıdaki nedenle saygıyla izin talep ediyorum.",
    reasonLabel: "Neden",
    dateLabel: "Tarih",
    studentLabel: "Öğrenci Adı",
    classLabel: "Sınıf",
    thankyou: "Teşekkürler.",
  },
  Persian: {
    greeting: "جناب آقا/خانم محترم،",
    intro: "اینجانب به دلیل زیر درخواست مرخصی دارم.",
    reasonLabel: "دلیل",
    dateLabel: "تاریخ",
    studentLabel: "نام دانش‌آموز",
    classLabel: "کلاس",
    thankyou: "با تشکر.",
  },
  Russian: {
    greeting: "Уважаемый(ая),",
    intro: "Прошу предоставить мне отпуск по следующей причине.",
    reasonLabel: "Причина",
    dateLabel: "Дата",
    studentLabel: "Имя ученика",
    classLabel: "Класс",
    thankyou: "Спасибо.",
  },
  Chinese: {
    greeting: "尊敬的老师/领导：",
    intro: "我申请请假，原因如下。",
    reasonLabel: "原因",
    dateLabel: "日期",
    studentLabel: "学生姓名",
    classLabel: "班级",
    thankyou: "谢谢。",
  },
  Japanese: {
    greeting: "拝啓、",
    intro: "以下の理由により、休暇をお願い申し上げます。",
    reasonLabel: "理由",
    dateLabel: "日付",
    studentLabel: "生徒氏名",
    classLabel: "クラス",
    thankyou: "よろしくお願いいたします。",
  },
  Korean: {
    greeting: "존경하는 선생님께,",
    intro: "다음 사유로 휴가를 신청합니다.",
    reasonLabel: "사유",
    dateLabel: "날짜",
    studentLabel: "학생 이름",
    classLabel: "학급",
    thankyou: "감사합니다.",
  },
  Italian: {
    greeting: "Gentile Signore/Signora,",
    intro: "Richiedo rispettosamente un congedo per il seguente motivo.",
    reasonLabel: "Motivo",
    dateLabel: "Data",
    studentLabel: "Nome dello studente",
    classLabel: "Classe",
    thankyou: "Grazie.",
  },
  Dutch: {
    greeting: "Geachte heer/mevrouw,",
    intro: "Ik verzoek respectvol verlof om de volgende reden.",
    reasonLabel: "Reden",
    dateLabel: "Datum",
    studentLabel: "Naam student",
    classLabel: "Klas",
    thankyou: "Dank u.",
  },
  Polish: {
    greeting: "Szanowny Panie/Szanowna Pani,",
    intro: "Uprzejmie proszę o udzielenie urlopu z następującego powodu.",
    reasonLabel: "Powód",
    dateLabel: "Data",
    studentLabel: "Imię i nazwisko ucznia",
    classLabel: "Klasa",
    thankyou: "Dziękuję.",
  },
  Swedish: {
    greeting: "Ärade herre/fru,",
    intro: "Jag ansöker respektfullt om ledighet av följande anledning.",
    reasonLabel: "Anledning",
    dateLabel: "Datum",
    studentLabel: "Elevens namn",
    classLabel: "Klass",
    thankyou: "Tack.",
  },
};

export interface WhatsAppMessageParams {
  studentName: string;
  className: string;
  reason: string;
  startDate: Date;
  language: Language;
}

export function generateWhatsAppMessage(params: WhatsAppMessageParams): string {
  const { studentName, className, reason, startDate, language } = params;
  const wa = WA_STRINGS[language] ?? WA_STRINGS.English;
  const reasonDisplay = getTranslatedReason(reason, language);
  const dateDisplay = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return [
    wa.greeting,
    "",
    wa.intro,
    "",
    `${wa.reasonLabel}: ${reasonDisplay}`,
    `${wa.dateLabel}: ${dateDisplay}`,
    `${wa.studentLabel}: ${studentName}`,
    `${wa.classLabel}: ${className}`,
    "",
    wa.thankyou,
  ].join("\n");
}
