import type { LetterParams } from './leaveApplicationLetterTemplate';
import { isRTLLanguage } from './leaveApplicationLetterTemplate';

declare const html2pdf: any;

function getLanguageLabel(language: string): { dateLabel: string; toLabel: string; subjectLabel: string; signOffLabel: string; classLabel: string; parentSigLabel: string; parentNameLabel: string; recipientTitle: string } {
  const labels: Record<string, { dateLabel: string; toLabel: string; subjectLabel: string; signOffLabel: string; classLabel: string; parentSigLabel: string; parentNameLabel: string; recipientTitle: string }> = {
    English: { dateLabel: 'Date', toLabel: 'To', subjectLabel: 'Subject', signOffLabel: 'Yours sincerely,', classLabel: 'Class/Roll No.', parentSigLabel: "Parent's / Guardian's Signature", parentNameLabel: "Parent's Name", recipientTitle: '' },
    Urdu: { dateLabel: 'تاریخ', toLabel: 'بخدمت', subjectLabel: 'موضوع', signOffLabel: 'آپ کا/کی مخلص،', classLabel: 'جماعت/رول نمبر', parentSigLabel: 'والدین / سرپرست کے دستخط', parentNameLabel: 'والدین کا نام', recipientTitle: '' },
    Hindi: { dateLabel: 'दिनांक', toLabel: 'सेवा में', subjectLabel: 'विषय', signOffLabel: 'आपका/आपकी आज्ञाकारी,', classLabel: 'कक्षा/रोल नं.', parentSigLabel: 'अभिभावक के हस्ताक्षर', parentNameLabel: 'अभिभावक का नाम', recipientTitle: '' },
    Arabic: { dateLabel: 'التاريخ', toLabel: 'إلى', subjectLabel: 'الموضوع', signOffLabel: 'مع التقدير،', classLabel: 'الفصل/رقم القيد', parentSigLabel: 'توقيع ولي الأمر', parentNameLabel: 'اسم ولي الأمر', recipientTitle: '' },
    French: { dateLabel: 'Date', toLabel: 'À', subjectLabel: 'Objet', signOffLabel: 'Veuillez agréer mes salutations distinguées,', classLabel: 'Classe/N° de rôle', parentSigLabel: 'Signature du parent/tuteur', parentNameLabel: 'Nom du parent', recipientTitle: '' },
    Spanish: { dateLabel: 'Fecha', toLabel: 'A', subjectLabel: 'Asunto', signOffLabel: 'Atentamente,', classLabel: 'Clase/N° de lista', parentSigLabel: 'Firma del padre/tutor', parentNameLabel: 'Nombre del padre', recipientTitle: '' },
    German: { dateLabel: 'Datum', toLabel: 'An', subjectLabel: 'Betreff', signOffLabel: 'Mit freundlichen Grüßen,', classLabel: 'Klasse/Matrikelnr.', parentSigLabel: 'Unterschrift des Elternteils/Erziehungsberechtigten', parentNameLabel: 'Name des Elternteils', recipientTitle: '' },
    Portuguese: { dateLabel: 'Data', toLabel: 'Para', subjectLabel: 'Assunto', signOffLabel: 'Atenciosamente,', classLabel: 'Turma/N° de chamada', parentSigLabel: 'Assinatura do pai/responsável', parentNameLabel: 'Nome do pai', recipientTitle: '' },
    Bengali: { dateLabel: 'তারিখ', toLabel: 'বরাবর', subjectLabel: 'বিষয়', signOffLabel: 'আপনার বিশ্বস্ত,', classLabel: 'শ্রেণী/রোল নং', parentSigLabel: 'অভিভাবকের স্বাক্ষর', parentNameLabel: 'অভিভাবকের নাম', recipientTitle: '' },
    Punjabi: { dateLabel: 'ਮਿਤੀ', toLabel: 'ਸੇਵਾ ਵਿੱਚ', subjectLabel: 'ਵਿਸ਼ਾ', signOffLabel: 'ਤੁਹਾਡਾ/ਤੁਹਾਡੀ ਵਿਸ਼ਵਾਸਪਾਤਰ,', classLabel: 'ਜਮਾਤ/ਰੋਲ ਨੰ.', parentSigLabel: 'ਮਾਤਾ-ਪਿਤਾ / ਸਰਪ੍ਰਸਤ ਦੇ ਦਸਤਖਤ', parentNameLabel: 'ਮਾਤਾ-ਪਿਤਾ ਦਾ ਨਾਮ', recipientTitle: '' },
    Turkish: { dateLabel: 'Tarih', toLabel: 'Kime', subjectLabel: 'Konu', signOffLabel: 'Saygılarımla,', classLabel: 'Sınıf/Öğrenci No.', parentSigLabel: 'Veli / Vasi İmzası', parentNameLabel: 'Veli Adı', recipientTitle: '' },
    Persian: { dateLabel: 'تاریخ', toLabel: 'به', subjectLabel: 'موضوع', signOffLabel: 'با احترام،', classLabel: 'کلاس/شماره دانش‌آموزی', parentSigLabel: 'امضای والدین / سرپرست', parentNameLabel: 'نام والدین', recipientTitle: '' },
    Russian: { dateLabel: 'Дата', toLabel: 'Кому', subjectLabel: 'Тема', signOffLabel: 'С уважением,', classLabel: 'Класс/№ студ. билета', parentSigLabel: 'Подпись родителя/опекуна', parentNameLabel: 'Имя родителя', recipientTitle: '' },
    Chinese: { dateLabel: '日期', toLabel: '致', subjectLabel: '主题', signOffLabel: '此致，', classLabel: '班级/学号', parentSigLabel: '家长/监护人签名', parentNameLabel: '家长姓名', recipientTitle: '' },
    Japanese: { dateLabel: '日付', toLabel: '宛先', subjectLabel: '件名', signOffLabel: '敬具、', classLabel: 'クラス/出席番号', parentSigLabel: '保護者署名', parentNameLabel: '保護者名', recipientTitle: '' },
    Korean: { dateLabel: '날짜', toLabel: '수신', subjectLabel: '제목', signOffLabel: '감사합니다,', classLabel: '학급/학번', parentSigLabel: '학부모/보호자 서명', parentNameLabel: '학부모 이름', recipientTitle: '' },
    Italian: { dateLabel: 'Data', toLabel: 'A', subjectLabel: 'Oggetto', signOffLabel: 'Distinti saluti,', classLabel: 'Classe/N° di matricola', parentSigLabel: 'Firma del genitore/tutore', parentNameLabel: 'Nome del genitore', recipientTitle: '' },
    Dutch: { dateLabel: 'Datum', toLabel: 'Aan', subjectLabel: 'Onderwerp', signOffLabel: 'Met vriendelijke groet,', classLabel: 'Klas/Studentnr.', parentSigLabel: 'Handtekening ouder/voogd', parentNameLabel: 'Naam ouder', recipientTitle: '' },
    Polish: { dateLabel: 'Data', toLabel: 'Do', subjectLabel: 'Temat', signOffLabel: 'Z poważaniem,', classLabel: 'Klasa/Nr indeksu', parentSigLabel: 'Podpis rodzica/opiekuna', parentNameLabel: 'Imię rodzica', recipientTitle: '' },
    Swedish: { dateLabel: 'Datum', toLabel: 'Till', subjectLabel: 'Ämne', signOffLabel: 'Med vänliga hälsningar,', classLabel: 'Klass/Studentnr.', parentSigLabel: 'Förälder/vårdnadshavares underskrift', parentNameLabel: 'Förälders namn', recipientTitle: '' },
  };
  return labels[language] ?? labels['English'];
}

export async function exportLeaveApplicationAsPdf(params: LetterParams): Promise<void> {
  const {
    studentName,
    className,
    recipientType,
    recipientName,
    schoolName,
    reason,
    startDate,
    endDate,
    durationType,
    language,
    parentName,
  } = params;

  const isRTL = isRTLLanguage(language);
  const dir = isRTL ? 'rtl' : 'ltr';
  const labels = getLanguageLabel(language);

  // formattedDate contains ONLY the date value — no "Date:" label
  const formattedDate = startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedStart = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedEnd = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const recipientTitles: Record<string, Record<string, string>> = {
    principal: { English: 'The Principal', Urdu: 'پرنسپل صاحب', Hindi: 'प्रधानाचार्य महोदय', Arabic: 'مدير المدرسة', French: 'Le Directeur', Spanish: 'El Director', German: 'Der Schulleiter', Portuguese: 'O Diretor', Bengali: 'অধ্যক্ষ মহোদয়', Punjabi: 'ਪ੍ਰਿੰਸੀਪਲ ਸਾਹਿਬ', Turkish: 'Okul Müdürü', Persian: 'مدیر مدرسه', Russian: 'Директор', Chinese: '校长', Japanese: '校長先生', Korean: '교장 선생님', Italian: 'Il Preside', Dutch: 'De Directeur', Polish: 'Dyrektor', Swedish: 'Rektor' },
    teacher: { English: 'The Class Teacher', Urdu: 'کلاس ٹیچر', Hindi: 'कक्षा अध्यापक', Arabic: 'معلم الفصل', French: 'Le Professeur Principal', Spanish: 'El Profesor de Clase', German: 'Der Klassenlehrer', Portuguese: 'O Professor de Turma', Bengali: 'শ্রেণী শিক্ষক', Punjabi: 'ਕਲਾਸ ਟੀਚਰ', Turkish: 'Sınıf Öğretmeni', Persian: 'معلم کلاس', Russian: 'Классный руководитель', Chinese: '班主任', Japanese: '担任の先生', Korean: '담임 선생님', Italian: "L'Insegnante di Classe", Dutch: 'De Klassenleraar', Polish: 'Wychowawca Klasy', Swedish: 'Klassläraren' },
    hod: { English: 'The Head of Department', Urdu: 'ڈیپارٹمنٹ ہیڈ', Hindi: 'विभागाध्यक्ष', Arabic: 'رئيس القسم', French: 'Le Chef de Département', Spanish: 'El Jefe de Departamento', German: 'Der Abteilungsleiter', Portuguese: 'O Chefe de Departamento', Bengali: 'বিভাগীয় প্রধান', Punjabi: 'ਵਿਭਾਗ ਮੁਖੀ', Turkish: 'Bölüm Başkanı', Persian: 'رئیس بخش', Russian: 'Заведующий кафедрой', Chinese: '系主任', Japanese: '学科長', Korean: '학과장', Italian: 'Il Capo Dipartimento', Dutch: 'Het Afdelingshoofd', Polish: 'Kierownik Działu', Swedish: 'Avdelningschef' },
    manager: { English: 'The Manager', Urdu: 'مینیجر', Hindi: 'प्रबंधक', Arabic: 'المدير', French: 'Le Directeur', Spanish: 'El Gerente', German: 'Der Manager', Portuguese: 'O Gerente', Bengali: 'ম্যানেজার', Punjabi: 'ਮੈਨੇਜਰ', Turkish: 'Müdür', Persian: 'مدیر', Russian: 'Менеджер', Chinese: '经理', Japanese: 'マネージャー', Korean: '매니저', Italian: 'Il Manager', Dutch: 'De Manager', Polish: 'Kierownik', Swedish: 'Chefen' },
    hr: { English: 'The HR Manager', Urdu: 'ایچ آر مینیجر', Hindi: 'एचआर प्रबंधक', Arabic: 'مدير الموارد البشرية', French: 'Le Responsable RH', Spanish: 'El Gerente de RRHH', German: 'Der HR-Manager', Portuguese: 'O Gerente de RH', Bengali: 'এইচআর ম্যানেজার', Punjabi: 'ਐਚਆਰ ਮੈਨੇਜਰ', Turkish: 'İK Müdürü', Persian: 'مدیر منابع انسانی', Russian: 'HR-менеджер', Chinese: '人力资源经理', Japanese: '人事マネージャー', Korean: 'HR 매니저', Italian: 'Il Responsabile delle Risorse Umane', Dutch: 'De HR-Manager', Polish: 'Kierownik HR', Swedish: 'HR-chefen' },
  };

  const recipientTitle = recipientTitles[recipientType]?.[language] ?? recipientTitles[recipientType]?.['English'] ?? 'The Principal';

  const bodyIntroMap: Record<string, string> = {
    English: `I am writing to respectfully request leave from ${formattedStart}${durationType === 'range' ? ` to ${formattedEnd}` : ''}.`,
    Urdu: `میں ${formattedStart}${durationType === 'range' ? ` سے ${formattedEnd}` : ''} تک رخصت کی درخواست کرتا/کرتی ہوں۔`,
    Hindi: `मैं ${formattedStart}${durationType === 'range' ? ` से ${formattedEnd}` : ''} तक अवकाश के लिए निवेदन करता/करती हूँ।`,
    Arabic: `أتقدم بطلب إجازة من ${formattedStart}${durationType === 'range' ? ` إلى ${formattedEnd}` : ''}.`,
    French: `Je me permets de solliciter un congé du ${formattedStart}${durationType === 'range' ? ` au ${formattedEnd}` : ''}.`,
    Spanish: `Me dirijo a usted para solicitar permiso desde el ${formattedStart}${durationType === 'range' ? ` hasta el ${formattedEnd}` : ''}.`,
    German: `Ich bitte um Beurlaubung vom ${formattedStart}${durationType === 'range' ? ` bis ${formattedEnd}` : ''}.`,
    Portuguese: `Venho por meio desta solicitar licença de ${formattedStart}${durationType === 'range' ? ` a ${formattedEnd}` : ''}.`,
    Bengali: `আমি ${formattedStart}${durationType === 'range' ? ` থেকে ${formattedEnd}` : ''} পর্যন্ত ছুটির জন্য আবেদন করছি।`,
    Punjabi: `ਮੈਂ ${formattedStart}${durationType === 'range' ? ` ਤੋਂ ${formattedEnd}` : ''} ਤੱਕ ਛੁੱਟੀ ਲਈ ਬੇਨਤੀ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।`,
    Turkish: `${formattedStart}${durationType === 'range' ? ` - ${formattedEnd}` : ''} tarihleri arasında izin talep ediyorum.`,
    Persian: `اینجانب درخواست مرخصی از تاریخ ${formattedStart}${durationType === 'range' ? ` تا ${formattedEnd}` : ''} را دارم.`,
    Russian: `Прошу предоставить мне отпуск с ${formattedStart}${durationType === 'range' ? ` по ${formattedEnd}` : ''}.`,
    Chinese: `我申请从 ${formattedStart}${durationType === 'range' ? ` 至 ${formattedEnd}` : ''} 请假。`,
    Japanese: `${formattedStart}${durationType === 'range' ? `から${formattedEnd}` : ''}まで休暇を申請いたします。`,
    Korean: `${formattedStart}${durationType === 'range' ? `부터 ${formattedEnd}` : ''}까지 휴가를 신청합니다。`,
    Italian: `Con la presente richiedo un congedo dal ${formattedStart}${durationType === 'range' ? ` al ${formattedEnd}` : ''}.`,
    Dutch: `Hierbij verzoek ik verlof van ${formattedStart}${durationType === 'range' ? ` tot ${formattedEnd}` : ''}.`,
    Polish: `Zwracam się z prośbą o udzielenie urlopu od ${formattedStart}${durationType === 'range' ? ` do ${formattedEnd}` : ''}.`,
    Swedish: `Jag ansöker härmed om ledighet från ${formattedStart}${durationType === 'range' ? ` till ${formattedEnd}` : ''}.`,
  };

  const bodyDurationMap: Record<string, string> = {
    English: durationType === 'range' ? `The total duration of my leave will be ${diffDays} days.` : '',
    Urdu: durationType === 'range' ? `میری رخصت کی کل مدت ${diffDays} دن ہوگی۔` : '',
    Hindi: durationType === 'range' ? `मेरी छुट्टी की कुल अवधि ${diffDays} दिन होगी।` : '',
    Arabic: durationType === 'range' ? `مدة الإجازة الإجمالية ${diffDays} أيام.` : '',
    French: durationType === 'range' ? `La durée totale de mon congé sera de ${diffDays} jours.` : '',
    Spanish: durationType === 'range' ? `La duración total de mi permiso será de ${diffDays} días.` : '',
    German: durationType === 'range' ? `Die Gesamtdauer meines Urlaubs beträgt ${diffDays} Tage.` : '',
    Portuguese: durationType === 'range' ? `A duração total da minha licença será de ${diffDays} dias.` : '',
    Bengali: durationType === 'range' ? `আমার ছুটির মোট সময়কাল ${diffDays} দিন হবে।` : '',
    Punjabi: durationType === 'range' ? `ਮੇਰੀ ਛੁੱਟੀ ਦੀ ਕੁੱਲ ਮਿਆਦ ${diffDays} ਦਿਨ ਹੋਵੇਗੀ।` : '',
    Turkish: durationType === 'range' ? `İzin sürem toplam ${diffDays} gün olacaktır.` : '',
    Persian: durationType === 'range' ? `مدت کل مرخصی اینجانب ${diffDays} روز خواهد بود.` : '',
    Russian: durationType === 'range' ? `Общая продолжительность отпуска составит ${diffDays} дней.` : '',
    Chinese: durationType === 'range' ? `请假总时长为 ${diffDays} 天。` : '',
    Japanese: durationType === 'range' ? `休暇の合計期間は${diffDays}日間となります。` : '',
    Korean: durationType === 'range' ? `휴가 총 기간은 ${diffDays}일입니다.` : '',
    Italian: durationType === 'range' ? `La durata totale del mio congedo sarà di ${diffDays} giorni.` : '',
    Dutch: durationType === 'range' ? `De totale duur van mijn verlof zal ${diffDays} dagen zijn.` : '',
    Polish: durationType === 'range' ? `Łączny czas urlopu wyniesie ${diffDays} dni.` : '',
    Swedish: durationType === 'range' ? `Den totala ledigheten kommer att vara ${diffDays} dagar.` : '',
  };

  const bodyOutroMap: Record<string, string> = {
    English: `The reason for my leave is: ${reason.trim()}. I kindly request you to grant me leave for the mentioned period. I will ensure that all pending work is completed upon my return.`,
    Urdu: `رخصت کی وجہ یہ ہے: ${reason.trim()}۔ براہ کرم مجھے مذکورہ مدت کے لیے رخصت عنایت فرمائیں۔ واپسی پر تمام زیر التواء کام مکمل کر لوں گا/گی۔`,
    Hindi: `अवकाश का कारण: ${reason.trim()}। कृपया मुझे उक्त अवधि के लिए अवकाश प्रदान करें। वापसी पर सभी लंबित कार्य पूर्ण कर लूँगा/लूँगी।`,
    Arabic: `سبب الإجازة: ${reason.trim()}. أرجو التكرم بمنحي الإجازة للمدة المذكورة، وسأحرص على إنجاز جميع الأعمال المتأخرة فور عودتي.`,
    French: `La raison de mon absence est : ${reason.trim()}. Je vous prie de bien vouloir m'accorder ce congé. Je veillerai à rattraper tout le travail en retard à mon retour.`,
    Spanish: `El motivo de mi ausencia es: ${reason.trim()}. Le ruego que me conceda el permiso para el período mencionado. Me aseguraré de completar todo el trabajo pendiente a mi regreso.`,
    German: `Der Grund für meinen Urlaub ist: ${reason.trim()}. Ich bitte Sie, mir für den genannten Zeitraum Urlaub zu gewähren. Ich werde dafür sorgen, dass alle ausstehenden Arbeiten nach meiner Rückkehr erledigt werden.`,
    Portuguese: `O motivo da minha ausência é: ${reason.trim()}. Solicito gentilmente que me conceda licença pelo período mencionado. Garantirei que todo o trabalho pendente seja concluído após meu retorno.`,
    Bengali: `ছুটির কারণ: ${reason.trim()}। অনুগ্রহ করে উল্লিখিত সময়ের জন্য আমাকে ছুটি মঞ্জুর করুন। ফিরে আসার পর সমস্ত বকেয়া কাজ সম্পন্ন করব।`,
    Punjabi: `ਛੁੱਟੀ ਦਾ ਕਾਰਨ: ${reason.trim()}। ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੀ ਮਿਆਦ ਲਈ ਛੁੱਟੀ ਦਿਓ। ਵਾਪਸ ਆਉਣ 'ਤੇ ਸਾਰਾ ਬਕਾਇਆ ਕੰਮ ਪੂਰਾ ਕਰ ਲਵਾਂਗਾ/ਲਵਾਂਗੀ।`,
    Turkish: `İzin nedenim: ${reason.trim()}. Belirtilen süre için izin verilmesini saygıyla talep ederim. Dönüşümde tüm bekleyen işleri tamamlayacağım.`,
    Persian: `دلیل مرخصی: ${reason.trim()}. خواهشمندم مرخصی برای مدت ذکر شده اعطا فرمایید. پس از بازگشت تمام کارهای معوق را انجام خواهم داد.`,
    Russian: `Причина отпуска: ${reason.trim()}. Прошу предоставить отпуск на указанный период. По возвращении я выполню всю незавершённую работу.`,
    Chinese: `请假原因：${reason.trim()}。请批准我上述时间段的假期申请。返回后，我将确保完成所有未完成的工作。`,
    Japanese: `休暇の理由：${reason.trim()}。上記の期間について休暇をお認めいただきますようお願い申し上げます。帰校後は未完了の課題を必ず完了いたします。`,
    Korean: `휴가 사유: ${reason.trim()}. 해당 기간 동안 휴가를 허락해 주시기 바랍니다. 복귀 후 모든 미완료 과제를 완료하겠습니다.`,
    Italian: `Il motivo della mia assenza è: ${reason.trim()}. La prego di concedermi il congedo per il periodo indicato. Al mio rientro provvederò a completare tutto il lavoro arretrato.`,
    Dutch: `De reden voor mijn verlof is: ${reason.trim()}. Ik verzoek u vriendelijk mij verlof te verlenen voor de genoemde periode. Na mijn terugkeer zal ik al het achterstallige werk inhalen.`,
    Polish: `Powód urlopu: ${reason.trim()}. Proszę o udzielenie urlopu na wskazany okres. Po powrocie uzupełnię wszystkie zaległe prace.`,
    Swedish: `Anledningen till min ledighet är: ${reason.trim()}. Jag ber er vänligen bevilja mig ledighet för den nämnda perioden. Jag kommer att se till att allt utestående arbete slutförs vid min återkomst.`,
  };

  const salutationMap: Record<string, string> = {
    English: 'Respected Sir/Madam,',
    Urdu: 'جناب / محترمہ،',
    Hindi: 'महोदय/महोदया,',
    Arabic: 'حضرة السيد/السيدة المحترم/ة،',
    French: 'Madame, Monsieur,',
    Spanish: 'Estimado/a señor/señora,',
    German: 'Sehr geehrte Damen und Herren,',
    Portuguese: 'Prezado(a) Senhor(a),',
    Bengali: 'মহোদয়/মহোদয়া,',
    Punjabi: 'ਸ੍ਰੀਮਾਨ/ਸ੍ਰੀਮਤੀ ਜੀ,',
    Turkish: 'Sayın Yetkili,',
    Persian: 'جناب آقا/خانم محترم،',
    Russian: 'Уважаемый(ая),',
    Chinese: '尊敬的老师/领导：',
    Japanese: '拝啓、',
    Korean: '존경하는 선생님께,',
    Italian: 'Gentile Signore/Signora,',
    Dutch: 'Geachte heer/mevrouw,',
    Polish: 'Szanowny Panie/Szanowna Pani,',
    Swedish: 'Ärade herre/fru,',
  };

  const subjectTextMap: Record<string, string> = {
    English: 'Application for Leave',
    Urdu: 'درخواست برائے رخصت',
    Hindi: 'अवकाश हेतु प्रार्थना पत्र',
    Arabic: 'طلب إجازة',
    French: 'Demande de congé',
    Spanish: 'Solicitud de permiso',
    German: 'Antrag auf Beurlaubung',
    Portuguese: 'Pedido de licença',
    Bengali: 'ছুটির আবেদন',
    Punjabi: 'ਛੁੱਟੀ ਲਈ ਅਰਜ਼ੀ',
    Turkish: 'İzin Talebi',
    Persian: 'درخواست مرخصی',
    Russian: 'Заявление на отпуск',
    Chinese: '请假申请',
    Japanese: '欠席届',
    Korean: '결석 신청서',
    Italian: 'Richiesta di congedo',
    Dutch: 'Verlofaanvraag',
    Polish: 'Wniosek o urlop',
    Swedish: 'Ansökan om ledighet',
  };

  const bodyIntro = bodyIntroMap[language] ?? bodyIntroMap['English'];
  const bodyDuration = bodyDurationMap[language] ?? '';
  const bodyOutro = bodyOutroMap[language] ?? bodyOutroMap['English'];
  const salutation = salutationMap[language] ?? salutationMap['English'];
  const subjectText = subjectTextMap[language] ?? subjectTextMap['English'];

  const htmlContent = `
<!DOCTYPE html>
<html lang="${language.toLowerCase()}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <title>Leave Application</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Georgia', serif;
      font-size: 13px;
      line-height: 1.7;
      color: #1a1a1a;
      padding: 40px;
      direction: ${dir};
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #2563eb;
    }
    .header-icon {
      font-size: 28px;
      margin-bottom: 4px;
    }
    .header-title {
      font-size: 18px;
      font-weight: bold;
      color: #2563eb;
      letter-spacing: 0.5px;
    }
    .header-subtitle {
      font-size: 11px;
      color: #6b7280;
      margin-top: 2px;
    }
    .date-block {
      text-align: right;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .recipient-block {
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 3px solid #2563eb;
    }
    .subject-block {
      margin-bottom: 16px;
      background: #eff6ff;
      padding: 10px 14px;
      border-radius: 4px;
    }
    .body-text {
      margin-bottom: 10px;
      text-align: justify;
    }
    .signature-block {
      text-align: right;
      margin-top: 24px;
    }
    .parent-sig-block {
      margin-top: 32px;
      border-top: 1px dashed #9ca3af;
      padding-top: 16px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-icon">📄</div>
    <div class="header-title">StudentSathi</div>
    <div class="header-subtitle">Leave Application Generator</div>
  </div>

  <div class="date-block">
    <strong>${labels.dateLabel}:</strong> ${formattedDate}
  </div>

  <div class="recipient-block">
    <p><strong>${labels.toLabel},</strong></p>
    <p>${recipientTitle}</p>
    ${recipientName.trim() ? `<p>${recipientName.trim()}</p>` : ''}
    ${schoolName.trim() ? `<p>${schoolName.trim()}</p>` : ''}
  </div>

  <div class="subject-block">
    <strong>${labels.subjectLabel}:</strong> ${subjectText}
  </div>

  <p class="body-text">${salutation}</p>

  <p class="body-text">${bodyIntro}${bodyDuration ? ' ' + bodyDuration : ''}</p>

  <p class="body-text">${bodyOutro}</p>

  <div class="signature-block">
    <p>${labels.signOffLabel}</p>
    <p><strong>${studentName.trim()}</strong></p>
    ${className.trim() ? `<p>${labels.classLabel}: ${className.trim()}</p>` : ''}
  </div>

  <div class="parent-sig-block">
    <p><strong>${labels.parentSigLabel}:</strong> ___________________</p>
    ${parentName?.trim() ? `<p style="margin-top:8px;"><strong>${labels.parentNameLabel}:</strong> ${parentName.trim()}</p>` : ''}
  </div>
</body>
</html>
  `.trim();

  // Try html2pdf first, fall back to print dialog
  if (typeof html2pdf !== 'undefined') {
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    try {
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `leave-application-${studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(container)
        .save();
    } finally {
      document.body.removeChild(container);
    }
  } else {
    // Fallback: open in new window for print-to-PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }
}
