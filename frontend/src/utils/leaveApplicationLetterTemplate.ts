import { formatSingleDate } from './leaveApplicationDateFormat';

export type RecipientType = 'principal' | 'teacher';
export type DurationType = 'full' | 'half';
export type Language = 'english' | 'urdu' | 'hindi' | 'arabic' | 'french' | 'spanish' | 'german' | 'portuguese' | 'turkish' | 'indonesian' | 'malay' | 'bengali' | 'tamil' | 'chinese' | 'japanese' | 'korean' | 'russian' | 'italian' | 'dutch' | 'swahili';

export interface LetterParams {
  recipientType: RecipientType;
  name: string;
  school: string;
  classGrade: string;
  parentName: string;
  dateDuration: string;
  reasonText: string;
  reason: string;
  medicalCertificate: boolean;
  durationType: DurationType;
  absentSinceDate?: Date;
  language: Language;
}

interface Translation {
  date: string;
  to: string;
  principal: string;
  teacher: string;
  subject: string;
  subjectText: string;
  greeting: string;
  intro: (name: string, classGrade: string, school: string) => string;
  requestLeave: (dateDuration: string) => string;
  requestHalfLeave: string;
  absentSince: (date: string, reason: string) => string;
  medicalCert: string;
  closing: string;
  thankyou: string;
  signature: string;
  parentSignature: string;
  parentName: string;
}

/** Returns true if the given language uses RTL text direction */
export function isRTLLanguage(language: Language): boolean {
  return language === 'arabic' || language === 'urdu';
}

/**
 * Format a date in a fully localized way for the given language.
 * For RTL languages (Arabic, Urdu) we use locale-aware formatting.
 */
function formatDateForLanguage(date: Date, language: Language): string {
  const localeMap: Partial<Record<Language, string>> = {
    arabic: 'ar',
    urdu: 'ur',
    hindi: 'hi',
    french: 'fr',
    spanish: 'es',
    german: 'de',
    portuguese: 'pt',
    turkish: 'tr',
    indonesian: 'id',
    malay: 'ms',
    bengali: 'bn',
    tamil: 'ta',
    chinese: 'zh',
    japanese: 'ja',
    korean: 'ko',
    russian: 'ru',
    italian: 'it',
    dutch: 'nl',
    swahili: 'sw',
    english: 'en',
  };
  const locale = localeMap[language] ?? 'en';
  try {
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return formatSingleDate(date);
  }
}

const translations: Record<Language, Translation> = {
  english: {
    date: 'Date',
    to: 'To',
    principal: 'The Principal',
    teacher: 'The Class Teacher',
    subject: 'Subject',
    subjectText: 'Application for Leave',
    greeting: 'Respected Sir/Madam',
    intro: (name, classGrade, school) => `I am ${name}, a student of ${classGrade} in your esteemed institution.`,
    requestLeave: (dateDuration) => `I am writing to request leave ${dateDuration}.`,
    requestHalfLeave: 'I request leave for half of the school day.',
    absentSince: (date, reason) => `I have been absent from school since ${date} due to ${reason}.`,
    medicalCert: 'I will provide a medical certificate if required.',
    closing: 'I kindly request you to grant me leave for the mentioned period. I will ensure to complete all missed assignments and catch up with the coursework upon my return.',
    thankyou: 'Thank you for your understanding and consideration.',
    signature: 'Yours sincerely',
    parentSignature: "Parent's Signature",
    parentName: 'Name',
  },
  urdu: {
    date: 'تاریخ',
    to: 'بنام',
    principal: 'پرنسپل صاحب',
    teacher: 'کلاس ٹیچر صاحب',
    subject: 'موضوع',
    subjectText: 'چھٹی کی درخواست',
    greeting: 'محترم جناب',
    intro: (name, classGrade, school) => `میں ${name} ہوں، آپ کے معزز ادارے میں ${classGrade} کا طالب علم ہوں۔`,
    requestLeave: (dateDuration) => `میں ${dateDuration} کے لیے چھٹی کی درخواست کر رہا ہوں۔`,
    requestHalfLeave: 'میں اسکول کے آدھے دن کی چھٹی کی درخواست کرتا ہوں۔',
    absentSince: (date, reason) => `میں ${date} سے ${reason} کی وجہ سے اسکول سے غیر حاضر ہوں۔`,
    medicalCert: 'اگر ضرورت ہو تو میں طبی سرٹیفکیٹ فراہم کروں گا۔',
    closing: 'میں آپ سے گزارش کرتا ہوں کہ مجھے مذکورہ مدت کے لیے چھٹی عطا فرمائیں۔ میں واپسی پر تمام چھوٹے ہوئے کام مکمل کروں گا۔',
    thankyou: 'آپ کی سمجھ اور توجہ کا شکریہ۔',
    signature: 'آپ کا مخلص',
    parentSignature: 'والدین کے دستخط',
    parentName: 'نام',
  },
  hindi: {
    date: 'दिनांक',
    to: 'सेवा में',
    principal: 'प्रधानाचार्य महोदय',
    teacher: 'कक्षा अध्यापक महोदय',
    subject: 'विषय',
    subjectText: 'अवकाश के लिए आवेदन',
    greeting: 'आदरणीय महोदय/महोदया',
    intro: (name, classGrade, school) => `मैं ${name}, आपके प्रतिष्ठित संस्थान में ${classGrade} का छात्र हूं।`,
    requestLeave: (dateDuration) => `मैं ${dateDuration} के लिए अवकाश का अनुरोध कर रहा हूं।`,
    requestHalfLeave: 'मैं स्कूल के आधे दिन की छुट्टी का अनुरोध करता हूं।',
    absentSince: (date, reason) => `मैं ${date} से ${reason} के कारण स्कूल से अनुपस्थित हूं।`,
    medicalCert: 'यदि आवश्यक हो तो मैं चिकित्सा प्रमाण पत्र प्रदान करूंगा।',
    closing: 'मैं आपसे विनम्र निवेदन करता हूं कि मुझे उल्लिखित अवधि के लिए अवकाश प्रदान करें। मैं वापसी पर सभी छूटे हुए कार्य पूरे करूंगा।',
    thankyou: 'आपकी समझ और विचार के लिए धन्यवाद।',
    signature: 'आपका आज्ञाकारी',
    parentSignature: 'अभिभावक के हस्ताक्षर',
    parentName: 'नाम',
  },
  arabic: {
    date: 'التاريخ',
    to: 'إلى',
    principal: 'السيد مدير المدرسة المحترم',
    teacher: 'السيد معلم الصف المحترم',
    subject: 'الموضوع',
    subjectText: 'طلب إجازة',
    greeting: 'السيد المحترم / السيدة المحترمة',
    intro: (name, classGrade, school) => `أنا ${name}، طالب في ${classGrade} في مؤسستكم الموقرة.`,
    requestLeave: (dateDuration) => `أتقدم بطلب إجازة ${dateDuration}.`,
    requestHalfLeave: 'أطلب إجازة لنصف اليوم الدراسي.',
    absentSince: (date, reason) => `لقد كنت غائباً عن المدرسة منذ ${date} بسبب ${reason}.`,
    medicalCert: 'سأقدم شهادة طبية إذا لزم الأمر.',
    closing: 'أرجو منكم التكرم بمنحي إجازة للفترة المذكورة. سأحرص على إكمال جميع الواجبات الفائتة واللحاق بالدروس عند عودتي.',
    thankyou: 'شكراً جزيلاً لتفهمكم واهتمامكم.',
    signature: 'مع خالص التحية والاحترام',
    parentSignature: 'توقيع ولي الأمر',
    parentName: 'الاسم',
  },
  french: {
    date: 'Date',
    to: 'À',
    principal: 'Monsieur le Directeur',
    teacher: 'Monsieur le Professeur Principal',
    subject: 'Objet',
    subjectText: 'Demande de congé',
    greeting: 'Monsieur/Madame',
    intro: (name, classGrade, school) => `Je suis ${name}, élève de ${classGrade} dans votre établissement.`,
    requestLeave: (dateDuration) => `Je vous écris pour demander un congé ${dateDuration}.`,
    requestHalfLeave: "Je demande un congé pour une demi-journée d'école.",
    absentSince: (date, reason) => `Je suis absent de l'école depuis le ${date} en raison de ${reason}.`,
    medicalCert: 'Je fournirai un certificat médical si nécessaire.',
    closing: "Je vous prie de bien vouloir m'accorder ce congé pour la période mentionnée. Je m'engage à rattraper tous les devoirs manqués à mon retour.",
    thankyou: 'Je vous remercie de votre compréhension et considération.',
    signature: 'Cordialement',
    parentSignature: 'Signature du parent',
    parentName: 'Nom',
  },
  spanish: {
    date: 'Fecha',
    to: 'A',
    principal: 'El Director',
    teacher: 'El Profesor de Clase',
    subject: 'Asunto',
    subjectText: 'Solicitud de permiso',
    greeting: 'Estimado Señor/Señora',
    intro: (name, classGrade, school) => `Soy ${name}, estudiante de ${classGrade} en su estimada institución.`,
    requestLeave: (dateDuration) => `Le escribo para solicitar permiso ${dateDuration}.`,
    requestHalfLeave: 'Solicito permiso por medio día escolar.',
    absentSince: (date, reason) => `He estado ausente de la escuela desde el ${date} debido a ${reason}.`,
    medicalCert: 'Proporcionaré un certificado médico si es necesario.',
    closing: 'Le ruego me conceda el permiso para el período mencionado. Me aseguraré de completar todas las tareas perdidas a mi regreso.',
    thankyou: 'Gracias por su comprensión y consideración.',
    signature: 'Atentamente',
    parentSignature: 'Firma del padre/tutor',
    parentName: 'Nombre',
  },
  german: {
    date: 'Datum',
    to: 'An',
    principal: 'Den Schulleiter',
    teacher: 'Den Klassenlehrer',
    subject: 'Betreff',
    subjectText: 'Antrag auf Beurlaubung',
    greeting: 'Sehr geehrte Damen und Herren',
    intro: (name, classGrade, school) => `Ich bin ${name}, Schüler der ${classGrade} an Ihrer geschätzten Einrichtung.`,
    requestLeave: (dateDuration) => `Ich schreibe, um eine Beurlaubung ${dateDuration} zu beantragen.`,
    requestHalfLeave: 'Ich beantrage eine Beurlaubung für einen halben Schultag.',
    absentSince: (date, reason) => `Ich bin seit dem ${date} aufgrund von ${reason} nicht in der Schule.`,
    medicalCert: 'Ich werde bei Bedarf ein ärztliches Attest vorlegen.',
    closing: 'Ich bitte Sie höflich, mir die Beurlaubung für den genannten Zeitraum zu gewähren. Ich werde sicherstellen, dass ich alle versäumten Aufgaben bei meiner Rückkehr nachhole.',
    thankyou: 'Vielen Dank für Ihr Verständnis und Ihre Berücksichtigung.',
    signature: 'Mit freundlichen Grüßen',
    parentSignature: 'Unterschrift der Eltern',
    parentName: 'Name',
  },
  portuguese: {
    date: 'Data',
    to: 'Para',
    principal: 'O Diretor',
    teacher: 'O Professor de Turma',
    subject: 'Assunto',
    subjectText: 'Pedido de licença',
    greeting: 'Prezado Senhor/Senhora',
    intro: (name, classGrade, school) => `Eu sou ${name}, estudante da ${classGrade} em sua estimada instituição.`,
    requestLeave: (dateDuration) => `Escrevo para solicitar licença ${dateDuration}.`,
    requestHalfLeave: 'Solicito licença por meio período escolar.',
    absentSince: (date, reason) => `Estou ausente da escola desde ${date} devido a ${reason}.`,
    medicalCert: 'Fornecerei um atestado médico se necessário.',
    closing: 'Peço gentilmente que me conceda licença pelo período mencionado. Garantirei completar todas as tarefas perdidas ao retornar.',
    thankyou: 'Obrigado pela sua compreensão e consideração.',
    signature: 'Atenciosamente',
    parentSignature: 'Assinatura do responsável',
    parentName: 'Nome',
  },
  turkish: {
    date: 'Tarih',
    to: 'Sayın',
    principal: 'Okul Müdürü',
    teacher: 'Sınıf Öğretmeni',
    subject: 'Konu',
    subjectText: 'İzin Başvurusu',
    greeting: 'Sayın Yetkili',
    intro: (name, classGrade, school) => `Ben ${name}, değerli kurumunuzda ${classGrade} öğrencisiyim.`,
    requestLeave: (dateDuration) => `${dateDuration} için izin talep etmek üzere yazıyorum.`,
    requestHalfLeave: 'Yarım gün okul izni talep ediyorum.',
    absentSince: (date, reason) => `${date} tarihinden beri ${reason} nedeniyle okulda bulunmuyorum.`,
    medicalCert: 'Gerekirse sağlık raporu sunacağım.',
    closing: 'Belirtilen süre için bana izin vermenizi rica ederim. Dönüşümde tüm eksik ödevleri tamamlayacağımdan emin olacağım.',
    thankyou: 'Anlayışınız ve ilginiz için teşekkür ederim.',
    signature: 'Saygılarımla',
    parentSignature: 'Veli İmzası',
    parentName: 'İsim',
  },
  indonesian: {
    date: 'Tanggal',
    to: 'Kepada',
    principal: 'Kepala Sekolah',
    teacher: 'Wali Kelas',
    subject: 'Perihal',
    subjectText: 'Permohonan Izin',
    greeting: 'Yang Terhormat Bapak/Ibu',
    intro: (name, classGrade, school) => `Saya ${name}, siswa ${classGrade} di institusi yang terhormat ini.`,
    requestLeave: (dateDuration) => `Saya menulis untuk memohon izin ${dateDuration}.`,
    requestHalfLeave: 'Saya memohon izin setengah hari sekolah.',
    absentSince: (date, reason) => `Saya telah tidak hadir di sekolah sejak ${date} karena ${reason}.`,
    medicalCert: 'Saya akan menyediakan surat keterangan dokter jika diperlukan.',
    closing: 'Saya mohon dengan hormat agar diberikan izin untuk periode yang disebutkan. Saya akan memastikan menyelesaikan semua tugas yang tertinggal saat kembali.',
    thankyou: 'Terima kasih atas pengertian dan pertimbangan Anda.',
    signature: 'Hormat saya',
    parentSignature: 'Tanda Tangan Orang Tua',
    parentName: 'Nama',
  },
  malay: {
    date: 'Tarikh',
    to: 'Kepada',
    principal: 'Pengetua',
    teacher: 'Guru Kelas',
    subject: 'Perkara',
    subjectText: 'Permohonan Cuti',
    greeting: 'Tuan/Puan Yang Dihormati',
    intro: (name, classGrade, school) => `Saya ${name}, pelajar ${classGrade} di institusi yang mulia ini.`,
    requestLeave: (dateDuration) => `Saya menulis untuk memohon cuti ${dateDuration}.`,
    requestHalfLeave: 'Saya memohon cuti separuh hari persekolahan.',
    absentSince: (date, reason) => `Saya telah tidak hadir ke sekolah sejak ${date} kerana ${reason}.`,
    medicalCert: 'Saya akan menyediakan sijil perubatan jika diperlukan.',
    closing: 'Saya memohon dengan hormatnya agar diberi cuti untuk tempoh yang dinyatakan. Saya akan memastikan menyiapkan semua tugasan yang tertinggal apabila kembali.',
    thankyou: 'Terima kasih atas kefahaman dan pertimbangan anda.',
    signature: 'Yang benar',
    parentSignature: 'Tandatangan Ibu Bapa',
    parentName: 'Nama',
  },
  bengali: {
    date: 'তারিখ',
    to: 'প্রতি',
    principal: 'প্রধান শিক্ষক',
    teacher: 'শ্রেণী শিক্ষক',
    subject: 'বিষয়',
    subjectText: 'ছুটির আবেদন',
    greeting: 'মাননীয় মহোদয়/মহোদয়া',
    intro: (name, classGrade, school) => `আমি ${name}, আপনার সম্মানিত প্রতিষ্ঠানের ${classGrade} এর ছাত্র।`,
    requestLeave: (dateDuration) => `আমি ${dateDuration} এর জন্য ছুটির আবেদন করছি।`,
    requestHalfLeave: 'আমি স্কুলের অর্ধেক দিনের ছুটির অনুরোধ করছি।',
    absentSince: (date, reason) => `আমি ${date} থেকে ${reason} কারণে স্কুলে অনুপস্থিত আছি।`,
    medicalCert: 'প্রয়োজন হলে আমি চিকিৎসা সনদপত্র প্রদান করব।',
    closing: 'আমি বিনীতভাবে অনুরোধ করছি যে উল্লিখিত সময়ের জন্য আমাকে ছুটি প্রদান করুন। আমি ফিরে এসে সমস্ত মিস করা কাজ সম্পূর্ণ করব।',
    thankyou: 'আপনার বোঝাপড়া এবং বিবেচনার জন্য ধন্যবাদ।',
    signature: 'বিনীত',
    parentSignature: 'অভিভাবকের স্বাক্ষর',
    parentName: 'নাম',
  },
  tamil: {
    date: 'தேதி',
    to: 'பெறுநர்',
    principal: 'தலைமை ஆசிரியர்',
    teacher: 'வகுப்பாசிரியர்',
    subject: 'பொருள்',
    subjectText: 'விடுப்பு விண்ணப்பம்',
    greeting: 'மதிப்பிற்குரிய ஐயா/அம்மா',
    intro: (name, classGrade, school) => `நான் ${name}, உங்கள் மதிப்பிற்குரிய நிறுவனத்தில் ${classGrade} மாணவன்.`,
    requestLeave: (dateDuration) => `நான் ${dateDuration} விடுப்பு கோருகிறேன்.`,
    requestHalfLeave: 'நான் பள்ளியின் அரை நாள் விடுப்பு கோருகிறேன்.',
    absentSince: (date, reason) => `நான் ${date} முதல் ${reason} காரணமாக பள்ளியில் இல்லை.`,
    medicalCert: 'தேவைப்பட்டால் மருத்துவ சான்றிதழ் வழங்குவேன்.',
    closing: 'குறிப்பிட்ட காலத்திற்கு எனக்கு விடுப்பு வழங்குமாறு பணிவுடன் கேட்டுக்கொள்கிறேன். திரும்பி வரும்போது தவறிய அனைத்து பணிகளையும் முடிப்பேன்.',
    thankyou: 'உங்கள் புரிதலுக்கும் கவனத்திற்கும் நன்றி.',
    signature: 'உங்கள் உண்மையுள்ள',
    parentSignature: 'பெற்றோர் கையொப்பம்',
    parentName: 'பெயர்',
  },
  chinese: {
    date: '日期',
    to: '致',
    principal: '校长',
    teacher: '班主任',
    subject: '主题',
    subjectText: '请假申请',
    greeting: '尊敬的先生/女士',
    intro: (name, classGrade, school) => `我是${name}，贵校${classGrade}的学生。`,
    requestLeave: (dateDuration) => `我写信申请${dateDuration}的假期。`,
    requestHalfLeave: '我申请半天假。',
    absentSince: (date, reason) => `我自${date}起因${reason}未到校。`,
    medicalCert: '如有需要，我将提供医疗证明。',
    closing: '恳请批准我在上述期间的请假。我将确保在返校后完成所有落下的作业。',
    thankyou: '感谢您的理解和考虑。',
    signature: '此致敬礼',
    parentSignature: '家长签名',
    parentName: '姓名',
  },
  japanese: {
    date: '日付',
    to: '宛先',
    principal: '校長先生',
    teacher: '担任の先生',
    subject: '件名',
    subjectText: '欠席届',
    greeting: '拝啓',
    intro: (name, classGrade, school) => `私は${name}と申します。貴校${classGrade}の生徒です。`,
    requestLeave: (dateDuration) => `${dateDuration}の欠席をお願いしたく、お手紙を差し上げました。`,
    requestHalfLeave: '半日の欠席をお願いいたします。',
    absentSince: (date, reason) => `${date}より${reason}のため欠席しております。`,
    medicalCert: '必要であれば診断書を提出いたします。',
    closing: '上記期間の欠席をお認めいただきますようお願い申し上げます。復帰後は遅れた課題をすべて完了いたします。',
    thankyou: 'ご理解とご配慮をいただき、ありがとうございます。',
    signature: '敬具',
    parentSignature: '保護者署名',
    parentName: '氏名',
  },
  korean: {
    date: '날짜',
    to: '수신',
    principal: '교장 선생님',
    teacher: '담임 선생님',
    subject: '제목',
    subjectText: '결석계',
    greeting: '존경하는 선생님께',
    intro: (name, classGrade, school) => `저는 귀교 ${classGrade}에 재학 중인 ${name}입니다.`,
    requestLeave: (dateDuration) => `${dateDuration} 결석을 신청하고자 합니다.`,
    requestHalfLeave: '반일 결석을 신청합니다.',
    absentSince: (date, reason) => `저는 ${date}부터 ${reason}로 인해 결석하고 있습니다.`,
    medicalCert: '필요시 진단서를 제출하겠습니다.',
    closing: '명시된 기간 동안 결석을 허락해 주시기를 정중히 요청드립니다. 복귀 후 모든 과제를 완료하겠습니다.',
    thankyou: '이해와 배려에 감사드립니다.',
    signature: '올림',
    parentSignature: '학부모 서명',
    parentName: '이름',
  },
  russian: {
    date: 'Дата',
    to: 'Кому',
    principal: 'Директору школы',
    teacher: 'Классному руководителю',
    subject: 'Тема',
    subjectText: 'Заявление на отпуск',
    greeting: 'Уважаемый господин/госпожа',
    intro: (name, classGrade, school) => `Я ${name}, ученик ${classGrade} вашего уважаемого учреждения.`,
    requestLeave: (dateDuration) => `Пишу с просьбой предоставить отпуск ${dateDuration}.`,
    requestHalfLeave: 'Прошу предоставить отпуск на полдня.',
    absentSince: (date, reason) => `Я отсутствую в школе с ${date} по причине ${reason}.`,
    medicalCert: 'При необходимости предоставлю медицинскую справку.',
    closing: 'Прошу предоставить мне отпуск на указанный период. Я обязуюсь выполнить все пропущенные задания по возвращении.',
    thankyou: 'Благодарю за понимание и внимание.',
    signature: 'С уважением',
    parentSignature: 'Подпись родителя',
    parentName: 'Имя',
  },
  italian: {
    date: 'Data',
    to: 'A',
    principal: 'Il Preside',
    teacher: "L'Insegnante di Classe",
    subject: 'Oggetto',
    subjectText: 'Richiesta di permesso',
    greeting: 'Egregio Signore/Signora',
    intro: (name, classGrade, school) => `Sono ${name}, studente della ${classGrade} presso la vostra stimata istituzione.`,
    requestLeave: (dateDuration) => `Scrivo per richiedere un permesso ${dateDuration}.`,
    requestHalfLeave: 'Richiedo un permesso per mezza giornata scolastica.',
    absentSince: (date, reason) => `Sono assente da scuola dal ${date} a causa di ${reason}.`,
    medicalCert: 'Fornirò un certificato medico se necessario.',
    closing: 'Chiedo gentilmente di concedermi il permesso per il periodo menzionato. Mi assicurerò di completare tutti i compiti persi al mio ritorno.',
    thankyou: 'Grazie per la vostra comprensione e considerazione.',
    signature: 'Cordiali saluti',
    parentSignature: 'Firma del genitore',
    parentName: 'Nome',
  },
  dutch: {
    date: 'Datum',
    to: 'Aan',
    principal: 'De Directeur',
    teacher: 'De Klassenleraar',
    subject: 'Onderwerp',
    subjectText: 'Verlofaanvraag',
    greeting: 'Geachte heer/mevrouw',
    intro: (name, classGrade, school) => `Ik ben ${name}, een leerling van ${classGrade} op uw gewaardeerde instelling.`,
    requestLeave: (dateDuration) => `Ik schrijf om verlof aan te vragen ${dateDuration}.`,
    requestHalfLeave: 'Ik vraag verlof aan voor een halve schooldag.',
    absentSince: (date, reason) => `Ik ben sinds ${date} afwezig van school vanwege ${reason}.`,
    medicalCert: 'Ik zal indien nodig een medisch attest verstrekken.',
    closing: 'Ik verzoek u vriendelijk om mij verlof te verlenen voor de genoemde periode. Ik zal ervoor zorgen dat ik alle gemiste opdrachten bij mijn terugkeer inhaal.',
    thankyou: 'Bedankt voor uw begrip en overweging.',
    signature: 'Met vriendelijke groet',
    parentSignature: 'Handtekening ouder',
    parentName: 'Naam',
  },
  swahili: {
    date: 'Tarehe',
    to: 'Kwa',
    principal: 'Mkuu wa Shule',
    teacher: 'Mwalimu wa Darasa',
    subject: 'Mada',
    subjectText: 'Ombi la Likizo',
    greeting: 'Mheshimiwa',
    intro: (name, classGrade, school) => `Mimi ni ${name}, mwanafunzi wa ${classGrade} katika taasisi yako inayoheshimika.`,
    requestLeave: (dateDuration) => `Ninaandika kuomba likizo ${dateDuration}.`,
    requestHalfLeave: 'Ninaomba likizo ya nusu siku ya shule.',
    absentSince: (date, reason) => `Nimekuwa nikukosea shule tangu ${date} kwa sababu ya ${reason}.`,
    medicalCert: 'Nitatoa cheti cha daktari ikiwa itahitajika.',
    closing: 'Ninaomba kwa heshima upate ruhusa ya likizo kwa kipindi kilichotajwa. Nitahakikisha kukamilisha kazi zote zilizokosekana ninapporudi.',
    thankyou: 'Asante kwa uelewa na kuzingatia kwako.',
    signature: 'Wako kwa uaminifu',
    parentSignature: 'Sahihi ya Mzazi',
    parentName: 'Jina',
  },
};

export function generateLeaveApplicationLetter(params: LetterParams): string {
  const {
    recipientType,
    name,
    school,
    classGrade,
    parentName,
    dateDuration,
    reasonText,
    reason,
    medicalCertificate,
    durationType,
    absentSinceDate,
    language,
  } = params;

  const t = translations[language];
  const today = new Date();
  const formattedDate = formatDateForLanguage(today, language);

  const recipient = recipientType === 'principal' ? t.principal : t.teacher;

  let letter = '';

  letter += `${t.date}: ${formattedDate}\n\n`;
  letter += `${t.to},\n`;
  letter += `${recipient},\n`;
  letter += `${school}\n\n`;
  letter += `${t.subject}: ${t.subjectText}\n\n`;
  letter += `${t.greeting},\n\n`;
  letter += `${t.intro(name, classGrade, school)}\n\n`;

  if (durationType === 'half') {
    letter += `${t.requestHalfLeave}\n`;
  }

  letter += `${t.requestLeave(dateDuration)}\n\n`;

  if (absentSinceDate) {
    const formattedAbsentDate = formatDateForLanguage(absentSinceDate, language);
    letter += `${t.absentSince(formattedAbsentDate, reasonText)}\n\n`;
  }

  if (medicalCertificate && reason === 'sick') {
    letter += `${t.medicalCert}\n\n`;
  }

  letter += `${t.closing}\n\n`;
  letter += `${t.thankyou}\n\n`;
  letter += `${t.signature},\n`;
  letter += `${name}\n`;
  letter += `${classGrade}\n\n`;
  letter += `${t.parentSignature}:\n`;
  letter += `${t.parentName}: ${parentName}\n`;

  return letter;
}
