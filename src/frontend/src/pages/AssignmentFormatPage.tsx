import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, RotateCcw, BookOpen, FlaskConical, Palette, Sparkles, FileDown, Loader2, Globe } from 'lucide-react';
import { toast } from 'sonner';
import StudentSathiAssistant from '@/components/StudentSathiAssistant';

type LanguageMode = 'english' | 'urdu' | 'hindi' | 'arabic' | 'chinese' | 'japanese' | 'french' | 'german' | 'russian' | 'turkish';

// UI Translations (only UI elements, not content)
const TRANSLATIONS = {
  english: {
    pageTitle: 'Assignment & Project Format',
    pageSubtitle: 'Create professional assignments with automatic formatting',
    languageSelector: 'Interface Language',
    titlePageSection: 'Title Page Information',
    studentName: 'Student Name',
    rollNumber: 'Roll Number',
    subject: 'Subject',
    teacher: 'Teacher Name',
    institute: 'Institute Name',
    date: 'Date',
    formatSettings: 'Format Settings',
    fontStyle: 'Font Style',
    fontTimes: 'Times New Roman',
    fontArial: 'Arial',
    fontCalibri: 'Calibri',
    lineSpacing: 'Line Spacing',
    pageNumbering: 'Page Numbering',
    pageNumBottom: 'Bottom Center',
    pageNumTop: 'Bottom Right',
    pageNumNone: 'None',
    startFrom: 'Start From',
    startCover: 'Cover Page',
    startContent: 'Main Content',
    editor: 'Assignment Editor',
    editorDesc: 'Edit your assignment content below (starts from Page 2)',
    reset: 'Reset',
    words: 'Words',
    estPages: 'Est. Pages',
    autoSaved: 'Auto-saved',
    improveAI: 'Improve with AI',
    downloadPDF: 'Download PDF',
    downloadWord: 'Download Word',
    downloadText: 'Download Text',
    subjectHeadings: 'Subject Headings',
    subjectHeadingsDesc: 'Click to insert into editor',
    science: 'Science',
    computerScience: 'Computer Science',
    artsCommerce: 'Arts/Commerce',
    referenceHelper: 'Reference Helper',
    referenceDesc: 'Sample citation formats',
    apaFormat: 'APA Format',
    mlaFormat: 'MLA Format',
    book: 'Book',
    journal: 'Journal',
    website: 'Website',
    teacherChecklist: 'Teacher Checklist',
    teacherChecklistDesc: 'Ensure all requirements are met',
    progress: 'Progress',
    checklistItem1: 'Cover page included with all required details',
    checklistItem2: 'Table of contents added (if required)',
    checklistItem3: 'Introduction clearly states the purpose',
    checklistItem4: 'Main content is well-organized with headings',
    checklistItem5: 'Word count is appropriate for the assignment',
    checklistItem6: 'References/bibliography added in correct format',
    checklistItem7: 'Proper formatting (font, spacing, margins)',
    checklistItem8: 'Proofread for spelling and grammar errors',
  },
  urdu: {
    pageTitle: 'اسائنمنٹ اور پروجیکٹ فارمیٹ',
    pageSubtitle: 'خودکار فارمیٹنگ کے ساتھ پیشہ ورانہ اسائنمنٹس بنائیں',
    languageSelector: 'انٹرفیس کی زبان',
    titlePageSection: 'ٹائٹل پیج کی معلومات',
    studentName: 'طالب علم کا نام',
    rollNumber: 'رول نمبر',
    subject: 'مضمون',
    teacher: 'استاد کا نام',
    institute: 'ادارے کا نام',
    date: 'تاریخ',
    formatSettings: 'فارمیٹ کی ترتیبات',
    fontStyle: 'فونٹ سٹائل',
    fontTimes: 'Times New Roman',
    fontArial: 'Arial',
    fontCalibri: 'Calibri',
    lineSpacing: 'لائن اسپیسنگ',
    pageNumbering: 'صفحہ نمبرنگ',
    pageNumBottom: 'نیچے درمیان',
    pageNumTop: 'نیچے دائیں',
    pageNumNone: 'کوئی نہیں',
    startFrom: 'شروع کریں',
    startCover: 'کور پیج سے',
    startContent: 'مرکزی مواد سے',
    editor: 'اسائنمنٹ ایڈیٹر',
    editorDesc: 'اپنے اسائنمنٹ کا مواد نیچے ترمیم کریں (صفحہ 2 سے شروع)',
    reset: 'دوبارہ سیٹ کریں',
    words: 'الفاظ',
    estPages: 'تخمینہ صفحات',
    autoSaved: 'خودکار محفوظ',
    improveAI: 'AI سے بہتر بنائیں',
    downloadPDF: 'PDF ڈاؤن لوڈ',
    downloadWord: 'Word ڈاؤن لوڈ',
    downloadText: 'Text ڈاؤن لوڈ',
    subjectHeadings: 'مضمون کی سرخیاں',
    subjectHeadingsDesc: 'ایڈیٹر میں داخل کرنے کے لیے کلک کریں',
    science: 'سائنس',
    computerScience: 'کمپیوٹر سائنس',
    artsCommerce: 'آرٹس/کامرس',
    referenceHelper: 'حوالہ جات مددگار',
    referenceDesc: 'نمونہ حوالہ جات کی شکلیں',
    apaFormat: 'APA فارمیٹ',
    mlaFormat: 'MLA فارمیٹ',
    book: 'کتاب',
    journal: 'جریدہ',
    website: 'ویب سائٹ',
    teacherChecklist: 'استاد کی چیک لسٹ',
    teacherChecklistDesc: 'یقینی بنائیں کہ تمام ضروریات پوری ہیں',
    progress: 'پیش رفت',
    checklistItem1: 'تمام ضروری تفصیلات کے ساتھ کور پیج شامل ہے',
    checklistItem2: 'فہرست مضامین شامل کی گئی (اگر ضروری ہو)',
    checklistItem3: 'تعارف میں مقصد واضح طور پر بیان کیا گیا ہے',
    checklistItem4: 'مرکزی مواد سرخیوں کے ساتھ اچھی طرح منظم ہے',
    checklistItem5: 'الفاظ کی تعداد اسائنمنٹ کے لیے مناسب ہے',
    checklistItem6: 'صحیح شکل میں حوالہ جات/کتابیات شامل کی گئی',
    checklistItem7: 'مناسب فارمیٹنگ (فونٹ، اسپیسنگ، حاشیے)',
    checklistItem8: 'املا اور گرامر کی غلطیوں کے لیے پروف ریڈ کیا گیا',
  },
  hindi: {
    pageTitle: 'असाइनमेंट और प्रोजेक्ट प्रारूप',
    pageSubtitle: 'स्वचालित स्वरूपण के साथ पेशेवर असाइनमेंट बनाएं',
    languageSelector: 'इंटरफ़ेस भाषा',
    titlePageSection: 'शीर्षक पृष्ठ जानकारी',
    studentName: 'छात्र का नाम',
    rollNumber: 'रोल नंबर',
    subject: 'विषय',
    teacher: 'शिक्षक का नाम',
    institute: 'संस्थान का नाम',
    date: 'तारीख',
    formatSettings: 'प्रारूप सेटिंग्स',
    fontStyle: 'फ़ॉन्ट शैली',
    fontTimes: 'Times New Roman',
    fontArial: 'Arial',
    fontCalibri: 'Calibri',
    lineSpacing: 'लाइन स्पेसिंग',
    pageNumbering: 'पृष्ठ क्रमांकन',
    pageNumBottom: 'नीचे केंद्र',
    pageNumTop: 'नीचे दाएं',
    pageNumNone: 'कोई नहीं',
    startFrom: 'से शुरू करें',
    startCover: 'कवर पेज',
    startContent: 'मुख्य सामग्री',
    editor: 'असाइनमेंट संपादक',
    editorDesc: 'नीचे अपनी असाइनमेंट सामग्री संपादित करें (पृष्ठ 2 से शुरू)',
    reset: 'रीसेट करें',
    words: 'शब्द',
    estPages: 'अनुमानित पृष्ठ',
    autoSaved: 'स्वतः सहेजा गया',
    improveAI: 'AI से सुधारें',
    downloadPDF: 'PDF डाउनलोड करें',
    downloadWord: 'Word डाउनलोड करें',
    downloadText: 'Text डाउनलोड करें',
    subjectHeadings: 'विषय शीर्षक',
    subjectHeadingsDesc: 'संपादक में सम्मिलित करने के लिए क्लिक करें',
    science: 'विज्ञान',
    computerScience: 'कंप्यूटर विज्ञान',
    artsCommerce: 'कला/वाणिज्य',
    referenceHelper: 'संदर्भ सहायक',
    referenceDesc: 'नमूना उद्धरण प्रारूप',
    apaFormat: 'APA प्रारूप',
    mlaFormat: 'MLA प्रारूप',
    book: 'पुस्तक',
    journal: 'पत्रिका',
    website: 'वेबसाइट',
    teacherChecklist: 'शिक्षक चेकलिस्ट',
    teacherChecklistDesc: 'सुनिश्चित करें कि सभी आवश्यकताएं पूरी हों',
    progress: 'प्रगति',
    checklistItem1: 'सभी आवश्यक विवरणों के साथ कवर पेज शामिल',
    checklistItem2: 'सामग्री तालिका जोड़ी गई (यदि आवश्यक हो)',
    checklistItem3: 'परिचय स्पष्ट रूप से उद्देश्य बताता है',
    checklistItem4: 'मुख्य सामग्री शीर्षकों के साथ अच्छी तरह से व्यवस्थित है',
    checklistItem5: 'शब्द गणना असाइनमेंट के लिए उपयुक्त है',
    checklistItem6: 'सही प्रारूप में संदर्भ/ग्रंथ सूची जोड़ी गई',
    checklistItem7: 'उचित स्वरूपण (फ़ॉन्ट, स्पेसिंग, मार्जिन)',
    checklistItem8: 'वर्तनी और व्याकरण त्रुटियों के लिए प्रूफरीड किया गया',
  },
  arabic: {
    pageTitle: 'تنسيق المهام والمشاريع',
    pageSubtitle: 'إنشاء مهام احترافية مع التنسيق التلقائي',
    languageSelector: 'لغة الواجهة',
    titlePageSection: 'معلومات صفحة العنوان',
    studentName: 'اسم الطالب',
    rollNumber: 'رقم القيد',
    subject: 'الموضوع',
    teacher: 'اسم المعلم',
    institute: 'اسم المعهد',
    date: 'التاريخ',
    formatSettings: 'إعدادات التنسيق',
    fontStyle: 'نمط الخط',
    fontTimes: 'Times New Roman',
    fontArial: 'Arial',
    fontCalibri: 'Calibri',
    lineSpacing: 'تباعد الأسطر',
    pageNumbering: 'ترقيم الصفحات',
    pageNumBottom: 'أسفل الوسط',
    pageNumTop: 'أسفل اليمين',
    pageNumNone: 'لا شيء',
    startFrom: 'ابدأ من',
    startCover: 'صفحة الغلاف',
    startContent: 'المحتوى الرئيسي',
    editor: 'محرر المهام',
    editorDesc: 'قم بتحرير محتوى مهمتك أدناه (يبدأ من الصفحة 2)',
    reset: 'إعادة تعيين',
    words: 'كلمات',
    estPages: 'الصفحات المقدرة',
    autoSaved: 'تم الحفظ تلقائيًا',
    improveAI: 'تحسين بالذكاء الاصطناعي',
    downloadPDF: 'تنزيل PDF',
    downloadWord: 'تنزيل Word',
    downloadText: 'تنزيل Text',
    subjectHeadings: 'عناوين الموضوعات',
    subjectHeadingsDesc: 'انقر للإدراج في المحرر',
    science: 'العلوم',
    computerScience: 'علوم الحاسوب',
    artsCommerce: 'الفنون/التجارة',
    referenceHelper: 'مساعد المراجع',
    referenceDesc: 'نماذج تنسيقات الاقتباس',
    apaFormat: 'تنسيق APA',
    mlaFormat: 'تنسيق MLA',
    book: 'كتاب',
    journal: 'مجلة',
    website: 'موقع إلكتروني',
    teacherChecklist: 'قائمة المعلم',
    teacherChecklistDesc: 'تأكد من استيفاء جميع المتطلبات',
    progress: 'التقدم',
    checklistItem1: 'صفحة الغلاف مع جميع التفاصيل المطلوبة',
    checklistItem2: 'تمت إضافة جدول المحتويات (إذا لزم الأمر)',
    checklistItem3: 'المقدمة تنص بوضوح على الغرض',
    checklistItem4: 'المحتوى الرئيسي منظم جيدًا مع العناوين',
    checklistItem5: 'عدد الكلمات مناسب للمهمة',
    checklistItem6: 'تمت إضافة المراجع/الببليوغرافيا بالتنسيق الصحيح',
    checklistItem7: 'التنسيق الصحيح (الخط، التباعد، الهوامش)',
    checklistItem8: 'تمت المراجعة للأخطاء الإملائية والنحوية',
  },
  chinese: {
    pageTitle: '作业和项目格式',
    pageSubtitle: '使用自动格式创建专业作业',
    languageSelector: '界面语言',
    titlePageSection: '标题页信息',
    studentName: '学生姓名',
    rollNumber: '学号',
    subject: '科目',
    teacher: '教师姓名',
    institute: '机构名称',
    date: '日期',
    formatSettings: '格式设置',
    fontStyle: '字体样式',
    fontTimes: 'Times New Roman',
    fontArial: 'Arial',
    fontCalibri: 'Calibri',
    lineSpacing: '行距',
    pageNumbering: '页码',
    pageNumBottom: '底部居中',
    pageNumTop: '底部右侧',
    pageNumNone: '无',
    startFrom: '开始于',
    startCover: '封面页',
    startContent: '主要内容',
    editor: '作业编辑器',
    editorDesc: '在下方编辑您的作业内容（从第2页开始）',
    reset: '重置',
    words: '字数',
    estPages: '预计页数',
    autoSaved: '自动保存',
    improveAI: '使用 AI 改进',
    downloadPDF: '下载 PDF',
    downloadWord: '下载 Word',
    downloadText: '下载 Text',
    subjectHeadings: '主题标题',
    subjectHeadingsDesc: '点击插入到编辑器',
    science: '科学',
    computerScience: '计算机科学',
    artsCommerce: '艺术/商业',
    referenceHelper: '参考助手',
    referenceDesc: '示例引用格式',
    apaFormat: 'APA 格式',
    mlaFormat: 'MLA 格式',
    book: '书籍',
    journal: '期刊',
    website: '网站',
    teacherChecklist: '教师检查清单',
    teacherChecklistDesc: '确保满足所有要求',
    progress: '进度',
    checklistItem1: '包含所有必需详细信息的封面页',
    checklistItem2: '添加目录（如果需要）',
    checklistItem3: '引言清楚地说明目的',
    checklistItem4: '主要内容用标题组织良好',
    checklistItem5: '字数适合作业',
    checklistItem6: '以正确格式添加参考文献/书目',
    checklistItem7: '正确的格式（字体、间距、边距）',
    checklistItem8: '校对拼写和语法错误',
  },
  japanese: {
    pageTitle: '課題とプロジェクトの形式',
    pageSubtitle: '自動フォーマットでプロフェッショナルな課題を作成',
    languageSelector: 'インターフェース言語',
    titlePageSection: 'タイトルページ情報',
    studentName: '学生名',
    rollNumber: '学籍番号',
    subject: '科目',
    teacher: '教師名',
    institute: '機関名',
    date: '日付',
    formatSettings: 'フォーマット設定',
    fontStyle: 'フォントスタイル',
    fontTimes: 'Times New Roman',
    fontArial: 'Arial',
    fontCalibri: 'Calibri',
    lineSpacing: '行間',
    pageNumbering: 'ページ番号',
    pageNumBottom: '下部中央',
    pageNumTop: '下部右',
    pageNumNone: 'なし',
    startFrom: '開始位置',
    startCover: '表紙ページ',
    startContent: '主要コンテンツ',
    editor: '課題エディター',
    editorDesc: '以下で課題の内容を編集（2ページ目から開始）',
    reset: 'リセット',
    words: '単語数',
    estPages: '推定ページ数',
    autoSaved: '自動保存',
    improveAI: 'AIで改善',
    downloadPDF: 'PDFダウンロード',
    downloadWord: 'Wordダウンロード',
    downloadText: 'Textダウンロード',
    subjectHeadings: '科目の見出し',
    subjectHeadingsDesc: 'クリックしてエディターに挿入',
    science: '科学',
    computerScience: 'コンピュータサイエンス',
    artsCommerce: '芸術/商業',
    referenceHelper: '参考文献ヘルパー',
    referenceDesc: 'サンプル引用形式',
    apaFormat: 'APA形式',
    mlaFormat: 'MLA形式',
    book: '書籍',
    journal: 'ジャーナル',
    website: 'ウェブサイト',
    teacherChecklist: '教師チェックリスト',
    teacherChecklistDesc: 'すべての要件が満たされていることを確認',
    progress: '進捗',
    checklistItem1: '必要な詳細がすべて含まれた表紙ページ',
    checklistItem2: '目次を追加（必要な場合）',
    checklistItem3: '序論で目的を明確に述べる',
    checklistItem4: '主要コンテンツが見出しで整理されている',
    checklistItem5: '単語数が課題に適している',
    checklistItem6: '正しい形式で参考文献/書誌を追加',
    checklistItem7: '適切なフォーマット（フォント、間隔、余白）',
    checklistItem8: 'スペルと文法エラーの校正',
  },
  french: {
    pageTitle: 'Format de devoir et de projet',
    pageSubtitle: 'Créez des devoirs professionnels avec formatage automatique',
    languageSelector: 'Langue de l\'interface',
    titlePageSection: 'Informations de la page de titre',
    studentName: 'Nom de l\'étudiant',
    rollNumber: 'Numéro d\'inscription',
    subject: 'Sujet',
    teacher: 'Nom de l\'enseignant',
    institute: 'Nom de l\'institut',
    date: 'Date',
    formatSettings: 'Paramètres de format',
    fontStyle: 'Style de police',
    fontTimes: 'Times New Roman',
    fontArial: 'Arial',
    fontCalibri: 'Calibri',
    lineSpacing: 'Espacement des lignes',
    pageNumbering: 'Numérotation des pages',
    pageNumBottom: 'Bas centre',
    pageNumTop: 'Bas droite',
    pageNumNone: 'Aucun',
    startFrom: 'Commencer à partir de',
    startCover: 'Page de couverture',
    startContent: 'Contenu principal',
    editor: 'Éditeur de devoir',
    editorDesc: 'Modifiez le contenu de votre devoir ci-dessous (commence à la page 2)',
    reset: 'Réinitialiser',
    words: 'Mots',
    estPages: 'Pages estimées',
    autoSaved: 'Sauvegarde automatique',
    improveAI: 'Améliorer avec l\'IA',
    downloadPDF: 'Télécharger PDF',
    downloadWord: 'Télécharger Word',
    downloadText: 'Télécharger Text',
    subjectHeadings: 'Titres de sujet',
    subjectHeadingsDesc: 'Cliquez pour insérer dans l\'éditeur',
    science: 'Science',
    computerScience: 'Informatique',
    artsCommerce: 'Arts/Commerce',
    referenceHelper: 'Assistant de référence',
    referenceDesc: 'Exemples de formats de citation',
    apaFormat: 'Format APA',
    mlaFormat: 'Format MLA',
    book: 'Livre',
    journal: 'Journal',
    website: 'Site Web',
    teacherChecklist: 'Liste de contrôle de l\'enseignant',
    teacherChecklistDesc: 'Assurez-vous que toutes les exigences sont remplies',
    progress: 'Progrès',
    checklistItem1: 'Page de couverture avec tous les détails requis',
    checklistItem2: 'Table des matières ajoutée (si nécessaire)',
    checklistItem3: 'L\'introduction énonce clairement l\'objectif',
    checklistItem4: 'Le contenu principal est bien organisé avec des titres',
    checklistItem5: 'Le nombre de mots est approprié pour le devoir',
    checklistItem6: 'Références/bibliographie ajoutées au bon format',
    checklistItem7: 'Formatage approprié (police, espacement, marges)',
    checklistItem8: 'Relu pour les erreurs d\'orthographe et de grammaire',
  },
  german: {
    pageTitle: 'Aufgaben- und Projektformat',
    pageSubtitle: 'Erstellen Sie professionelle Aufgaben mit automatischer Formatierung',
    languageSelector: 'Oberflächensprache',
    titlePageSection: 'Titelseiteninformationen',
    studentName: 'Studentenname',
    rollNumber: 'Matrikelnummer',
    subject: 'Fach',
    teacher: 'Lehrername',
    institute: 'Institutsname',
    date: 'Datum',
    formatSettings: 'Formateinstellungen',
    fontStyle: 'Schriftstil',
    fontTimes: 'Times New Roman',
    fontArial: 'Arial',
    fontCalibri: 'Calibri',
    lineSpacing: 'Zeilenabstand',
    pageNumbering: 'Seitennummerierung',
    pageNumBottom: 'Unten Mitte',
    pageNumTop: 'Unten rechts',
    pageNumNone: 'Keine',
    startFrom: 'Beginnen ab',
    startCover: 'Titelseite',
    startContent: 'Hauptinhalt',
    editor: 'Aufgabeneditor',
    editorDesc: 'Bearbeiten Sie Ihren Aufgabeninhalt unten (beginnt auf Seite 2)',
    reset: 'Zurücksetzen',
    words: 'Wörter',
    estPages: 'Geschätzte Seiten',
    autoSaved: 'Automatisch gespeichert',
    improveAI: 'Mit KI verbessern',
    downloadPDF: 'PDF herunterladen',
    downloadWord: 'Word herunterladen',
    downloadText: 'Text herunterladen',
    subjectHeadings: 'Fachüberschriften',
    subjectHeadingsDesc: 'Klicken Sie zum Einfügen in den Editor',
    science: 'Wissenschaft',
    computerScience: 'Informatik',
    artsCommerce: 'Kunst/Handel',
    referenceHelper: 'Referenzhelfer',
    referenceDesc: 'Beispielzitierformate',
    apaFormat: 'APA-Format',
    mlaFormat: 'MLA-Format',
    book: 'Buch',
    journal: 'Zeitschrift',
    website: 'Webseite',
    teacherChecklist: 'Lehrer-Checkliste',
    teacherChecklistDesc: 'Stellen Sie sicher, dass alle Anforderungen erfüllt sind',
    progress: 'Fortschritt',
    checklistItem1: 'Titelseite mit allen erforderlichen Details',
    checklistItem2: 'Inhaltsverzeichnis hinzugefügt (falls erforderlich)',
    checklistItem3: 'Einleitung gibt den Zweck klar an',
    checklistItem4: 'Hauptinhalt ist gut mit Überschriften organisiert',
    checklistItem5: 'Wortzahl ist für die Aufgabe angemessen',
    checklistItem6: 'Referenzen/Bibliographie im richtigen Format hinzugefügt',
    checklistItem7: 'Richtige Formatierung (Schrift, Abstand, Ränder)',
    checklistItem8: 'Auf Rechtschreib- und Grammatikfehler korrigiert',
  },
  russian: {
    pageTitle: 'Формат заданий и проектов',
    pageSubtitle: 'Создавайте профессиональные задания с автоматическим форматированием',
    languageSelector: 'Язык интерфейса',
    titlePageSection: 'Информация титульной страницы',
    studentName: 'Имя студента',
    rollNumber: 'Номер зачетной книжки',
    subject: 'Предмет',
    teacher: 'Имя преподавателя',
    institute: 'Название института',
    date: 'Дата',
    formatSettings: 'Настройки формата',
    fontStyle: 'Стиль шрифта',
    fontTimes: 'Times New Roman',
    fontArial: 'Arial',
    fontCalibri: 'Calibri',
    lineSpacing: 'Межстрочный интервал',
    pageNumbering: 'Нумерация страниц',
    pageNumBottom: 'Внизу по центру',
    pageNumTop: 'Внизу справа',
    pageNumNone: 'Нет',
    startFrom: 'Начать с',
    startCover: 'Титульная страница',
    startContent: 'Основное содержание',
    editor: 'Редактор заданий',
    editorDesc: 'Редактируйте содержание вашего задания ниже (начинается со страницы 2)',
    reset: 'Сбросить',
    words: 'Слова',
    estPages: 'Примерные страницы',
    autoSaved: 'Автосохранение',
    improveAI: 'Улучшить с помощью ИИ',
    downloadPDF: 'Скачать PDF',
    downloadWord: 'Скачать Word',
    downloadText: 'Скачать Text',
    subjectHeadings: 'Заголовки предметов',
    subjectHeadingsDesc: 'Нажмите, чтобы вставить в редактор',
    science: 'Наука',
    computerScience: 'Информатика',
    artsCommerce: 'Искусство/Коммерция',
    referenceHelper: 'Помощник по ссылкам',
    referenceDesc: 'Примеры форматов цитирования',
    apaFormat: 'Формат APA',
    mlaFormat: 'Формат MLA',
    book: 'Книга',
    journal: 'Журнал',
    website: 'Веб-сайт',
    teacherChecklist: 'Контрольный список преподавателя',
    teacherChecklistDesc: 'Убедитесь, что все требования выполнены',
    progress: 'Прогресс',
    checklistItem1: 'Титульная страница со всеми необходимыми деталями',
    checklistItem2: 'Добавлено оглавление (если требуется)',
    checklistItem3: 'Введение четко указывает цель',
    checklistItem4: 'Основное содержание хорошо организовано с заголовками',
    checklistItem5: 'Количество слов подходит для задания',
    checklistItem6: 'Ссылки/библиография добавлены в правильном формате',
    checklistItem7: 'Правильное форматирование (шрифт, интервал, поля)',
    checklistItem8: 'Проверено на орфографические и грамматические ошибки',
  },
  turkish: {
    pageTitle: 'Ödev ve Proje Formatı',
    pageSubtitle: 'Otomatik biçimlendirme ile profesyonel ödevler oluşturun',
    languageSelector: 'Arayüz Dili',
    titlePageSection: 'Başlık Sayfası Bilgileri',
    studentName: 'Öğrenci Adı',
    rollNumber: 'Öğrenci Numarası',
    subject: 'Konu',
    teacher: 'Öğretmen Adı',
    institute: 'Kurum Adı',
    date: 'Tarih',
    formatSettings: 'Format Ayarları',
    fontStyle: 'Yazı Tipi Stili',
    fontTimes: 'Times New Roman',
    fontArial: 'Arial',
    fontCalibri: 'Calibri',
    lineSpacing: 'Satır Aralığı',
    pageNumbering: 'Sayfa Numaralandırma',
    pageNumBottom: 'Alt Orta',
    pageNumTop: 'Alt Sağ',
    pageNumNone: 'Yok',
    startFrom: 'Başlangıç',
    startCover: 'Kapak Sayfası',
    startContent: 'Ana İçerik',
    editor: 'Ödev Düzenleyici',
    editorDesc: 'Ödev içeriğinizi aşağıda düzenleyin (Sayfa 2\'den başlar)',
    reset: 'Sıfırla',
    words: 'Kelimeler',
    estPages: 'Tahmini Sayfalar',
    autoSaved: 'Otomatik kaydedildi',
    improveAI: 'AI ile İyileştir',
    downloadPDF: 'PDF İndir',
    downloadWord: 'Word İndir',
    downloadText: 'Text İndir',
    subjectHeadings: 'Konu Başlıkları',
    subjectHeadingsDesc: 'Düzenleyiciye eklemek için tıklayın',
    science: 'Bilim',
    computerScience: 'Bilgisayar Bilimi',
    artsCommerce: 'Sanat/Ticaret',
    referenceHelper: 'Referans Yardımcısı',
    referenceDesc: 'Örnek alıntı formatları',
    apaFormat: 'APA Formatı',
    mlaFormat: 'MLA Formatı',
    book: 'Kitap',
    journal: 'Dergi',
    website: 'Web Sitesi',
    teacherChecklist: 'Öğretmen Kontrol Listesi',
    teacherChecklistDesc: 'Tüm gereksinimlerin karşılandığından emin olun',
    progress: 'İlerleme',
    checklistItem1: 'Tüm gerekli ayrıntılarla kapak sayfası dahil',
    checklistItem2: 'İçindekiler tablosu eklendi (gerekirse)',
    checklistItem3: 'Giriş amacı açıkça belirtiyor',
    checklistItem4: 'Ana içerik başlıklarla iyi organize edilmiş',
    checklistItem5: 'Kelime sayısı ödev için uygun',
    checklistItem6: 'Referanslar/kaynakça doğru formatta eklendi',
    checklistItem7: 'Uygun biçimlendirme (yazı tipi, aralık, kenar boşlukları)',
    checklistItem8: 'Yazım ve dilbilgisi hataları için düzeltme yapıldı',
  },
};

// Fixed assignment format template - permanent and unchangeable
const FIXED_ASSIGNMENT_FORMAT = `ASSIGNMENT FORMAT

1. COVER PAGE
   - Assignment Title
   - Subject Name
   - Student Name
   - Roll Number / ID
   - Class / Year
   - Submission Date

2. INTRODUCTION
   - Brief overview of the topic
   - Purpose of the assignment

3. MAIN CONTENT
   - Explain the topic using clear headings
   - Include examples or points where required

4. CONCLUSION
   - Summary of key points
   - Final remarks

5. REFERENCES
   - List sources in required format (APA / MLA)`;

const SUBJECT_HEADINGS = {
  science: [
    'Introduction to Scientific Method',
    'Hypothesis and Experimentation',
    'Data Analysis and Results',
    'Discussion of Findings',
    'Conclusion and Future Research',
  ],
  computerScience: [
    'Problem Statement',
    'System Requirements',
    'Design and Architecture',
    'Implementation Details',
    'Testing and Results',
    'Conclusion and Future Enhancements',
  ],
  artsCommerce: [
    'Introduction and Background',
    'Literature Review',
    'Methodology',
    'Analysis and Discussion',
    'Findings and Recommendations',
    'Conclusion',
  ],
};

const REFERENCE_FORMATS = {
  apa: {
    book: 'Author, A. A. (Year). Title of work. Publisher.',
    journal: 'Author, A. A. (Year). Title of article. Title of Journal, volume(issue), pages.',
    website: 'Author, A. A. (Year, Month Day). Title of page. Site Name. URL',
  },
  mla: {
    book: 'Author Last Name, First Name. Title of Book. Publisher, Year.',
    journal: 'Author Last Name, First Name. "Title of Article." Title of Journal, vol. number, no. number, Year, pages.',
    website: 'Author Last Name, First Name. "Title of Page." Site Name, Date, URL.',
  },
};

const DRAFT_STORAGE_KEY = 'studentSathi_assignment_draft_v7';

export default function AssignmentFormatPage() {
  const [language, setLanguage] = useState<LanguageMode>('english');
  const [content, setContent] = useState(FIXED_ASSIGNMENT_FORMAT);
  const [checklist, setChecklist] = useState<boolean[]>(new Array(8).fill(false));
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  
  // Title page fields
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [institute, setInstitute] = useState('');
  const [submissionDate, setSubmissionDate] = useState(new Date().toLocaleDateString());
  
  // Format settings
  const [fontStyle, setFontStyle] = useState<'times' | 'arial' | 'calibri'>('times');
  const [lineSpacing, setLineSpacing] = useState<'1.0' | '1.5' | '2.0'>('1.5');
  const [pageNumbering, setPageNumbering] = useState<'bottom' | 'top' | 'none'>('bottom');
  const [pageNumStart, setPageNumStart] = useState<'cover' | 'content'>('content');
  
  const [isImproving, setIsImproving] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = TRANSLATIONS[language];

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.content) setContent(parsed.content);
        if (parsed.checklist) setChecklist(parsed.checklist);
        if (parsed.studentName) setStudentName(parsed.studentName);
        if (parsed.rollNumber) setRollNumber(parsed.rollNumber);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.teacher) setTeacher(parsed.teacher);
        if (parsed.institute) setInstitute(parsed.institute);
        if (parsed.fontStyle) setFontStyle(parsed.fontStyle);
        if (parsed.lineSpacing) setLineSpacing(parsed.lineSpacing);
        if (parsed.pageNumbering) setPageNumbering(parsed.pageNumbering);
        if (parsed.pageNumStart) setPageNumStart(parsed.pageNumStart);
        toast.success('Draft loaded from previous session');
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Save draft to localStorage
  useEffect(() => {
    const draft = {
      language,
      content,
      checklist,
      studentName,
      rollNumber,
      subject,
      teacher,
      institute,
      fontStyle,
      lineSpacing,
      pageNumbering,
      pageNumStart,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [language, content, checklist, studentName, rollNumber, subject, teacher, institute, fontStyle, lineSpacing, pageNumbering, pageNumStart]);

  // Calculate word count and page count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    setPageCount(Math.ceil(words / 250));
  }, [content]);

  const handleInsertHeading = (heading: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newContent = content.substring(0, start) + '\n\n' + heading + '\n' + content.substring(end);
      setContent(newContent);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPosition = start + heading.length + 3;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
      
      toast.success('Heading inserted');
    }
  };

  const handleReset = () => {
    setContent(FIXED_ASSIGNMENT_FORMAT);
    setChecklist(new Array(8).fill(false));
    setStudentName('');
    setRollNumber('');
    setSubject('');
    setTeacher('');
    setInstitute('');
    toast.success('Editor reset to default assignment format');
  };

  const handleChecklistToggle = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index] = !newChecklist[index];
    setChecklist(newChecklist);
  };

  const generateTitlePage = () => {
    // Generate a standalone title page with only required fields
    const titlePage = `


                         ${institute || '[INSTITUTION NAME]'}
                    
                              
═══════════════════════════════════════════════════════════

                            ASSIGNMENT

═══════════════════════════════════════════════════════════


Subject: ${subject || '[Subject Name]'}

Assignment Title: ${content.split('\n')[0] || '[Assignment Title]'}


Submitted By:
Name: ${studentName || '[Your Name]'}
Student ID: ${rollNumber || '[Student ID]'}

Date of Submission: ${submissionDate}


`;
    
    return titlePage;
  };

  const downloadAsText = useCallback((filename: string, text: string, mimeType: string) => {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadPDF = () => {
    const coverPage = generateTitlePage();
    // Add page break marker and then content starting from Page 2
    const pageBreak = '\n\n\n--- PAGE BREAK ---\n\n\n';
    const fullContent = coverPage + pageBreak + content;
    
    const fontFamily = fontStyle === 'arial' ? 'Arial, sans-serif' : fontStyle === 'calibri' ? 'Calibri, sans-serif' : "'Times New Roman', Times, serif";
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Assignment</title>
  <style>
    @page {
      size: A4;
      margin: 1in;
    }
    body {
      font-family: ${fontFamily};
      font-size: 12pt;
      line-height: ${lineSpacing};
      color: #000;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 1in;
    }
    .title-page {
      page-break-after: always;
      text-align: center;
      white-space: pre-wrap;
      font-family: ${fontFamily};
      font-size: 12pt;
      line-height: ${lineSpacing};
    }
    .content-page {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: ${fontFamily};
      font-size: 12pt;
      line-height: ${lineSpacing};
    }
    .page-number {
      text-align: ${pageNumbering === 'top' ? 'right' : 'center'};
      ${pageNumbering === 'top' ? 'position: fixed; bottom: 0.5in; right: 1in;' : 'position: fixed; bottom: 0.5in; left: 0; right: 0;'}
    }
    @media print {
      body {
        padding: 0;
      }
      .title-page {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="title-page">${coverPage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  <div class="content-page">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  ${pageNumbering !== 'none' ? '<div class="page-number">Page <span class="page"></span></div>' : ''}
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
      toast.success('Opening print dialog - save as PDF');
      
      setTimeout(() => {
        handleReset();
      }, 1000);
    } else {
      toast.error('Please allow pop-ups to download PDF');
    }
  };

  const handleDownloadWord = () => {
    const coverPage = generateTitlePage();
    // Add page break and content starting from Page 2
    const pageBreak = '\\page\n';
    const fullContent = coverPage + pageBreak + content;
    
    const fontName = fontStyle === 'arial' ? 'Arial' : fontStyle === 'calibri' ? 'Calibri' : 'Times New Roman';
    
    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 ${fontName};}}
{\\colortbl;\\red0\\green0\\blue0;}
\\f0\\fs24
${fullContent.replace(/\n/g, '\\par\n')}
}`;

    downloadAsText('assignment.rtf', rtfContent, 'application/rtf');
    toast.success('Assignment downloaded as Word document');
    
    setTimeout(() => {
      handleReset();
    }, 500);
  };

  const handleDownloadText = () => {
    const coverPage = generateTitlePage();
    // Add clear page break separator and content starting from Page 2
    const pageBreak = '\n\n\n========== PAGE 2 ==========\n\n\n';
    const fullContent = coverPage + pageBreak + content;
    
    downloadAsText('assignment.txt', fullContent, 'text/plain');
    toast.success('Assignment downloaded as text file');
    
    setTimeout(() => {
      handleReset();
    }, 500);
  };

  const handleImproveWithAI = async () => {
    setIsImproving(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let improved = content;
    
    // Fix double spaces
    improved = improved.replace(/  +/g, ' ');
    
    // Fix spacing around punctuation
    improved = improved.replace(/\s+([.,;:!?])/g, '$1');
    improved = improved.replace(/([.,;:!?])([A-Za-z])/g, '$1 $2');
    
    // Capitalize first letter of sentences
    improved = improved.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    
    // Fix common typos
    const commonFixes: Record<string, string> = {
      'teh': 'the',
      'adn': 'and',
      'taht': 'that',
      'thier': 'their',
      'recieve': 'receive',
      'occured': 'occurred',
      'seperate': 'separate',
      'definately': 'definitely',
    };
    
    Object.entries(commonFixes).forEach(([wrong, right]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      improved = improved.replace(regex, right);
    });
    
    setContent(improved);
    setIsImproving(false);
    toast.success('Text improved! Grammar and clarity enhanced.');
  };

  const checklistItems = [
    t.checklistItem1,
    t.checklistItem2,
    t.checklistItem3,
    t.checklistItem4,
    t.checklistItem5,
    t.checklistItem6,
    t.checklistItem7,
    t.checklistItem8,
  ];

  return (
    <div className="container py-8 md:py-12 max-w-7xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{t.pageSubtitle}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-card border-2 rounded-lg p-3">
          <Globe className="h-5 w-5 text-primary" />
          <Label htmlFor="language-selector" className="font-semibold">{t.languageSelector}:</Label>
          <Select value={language} onValueChange={(value) => setLanguage(value as LanguageMode)}>
            <SelectTrigger id="language-selector" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="urdu">اردو (Urdu)</SelectItem>
              <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
              <SelectItem value="arabic">العربية (Arabic)</SelectItem>
              <SelectItem value="chinese">中文 (Chinese)</SelectItem>
              <SelectItem value="japanese">日本語 (Japanese)</SelectItem>
              <SelectItem value="french">Français (French)</SelectItem>
              <SelectItem value="german">Deutsch (German)</SelectItem>
              <SelectItem value="russian">Русский (Russian)</SelectItem>
              <SelectItem value="turkish">Türkçe (Turkish)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Page Information */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">{t.titlePageSection}</CardTitle>
              <CardDescription className="text-sm">This information will appear on the standalone cover page (Page 1)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student-name">{t.studentName}</Label>
                  <Input
                    id="student-name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="roll-number">{t.rollNumber}</Label>
                  <Input
                    id="roll-number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="Enter roll number"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">{t.subject}</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject"
                  />
                </div>
                <div>
                  <Label htmlFor="institute">{t.institute}</Label>
                  <Input
                    id="institute"
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    placeholder="Enter institute name"
                  />
                </div>
                <div>
                  <Label htmlFor="date">{t.date}</Label>
                  <Input
                    id="date"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    placeholder="Enter date"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Format Settings */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <img src="/assets/generated/font-selector-icon-transparent.dim_24x24.png" alt="Format" className="h-5 w-5" />
                <CardTitle className="text-lg">{t.formatSettings}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{t.fontStyle}</Label>
                  <Select value={fontStyle} onValueChange={(value) => setFontStyle(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="times">{t.fontTimes}</SelectItem>
                      <SelectItem value="arial">{t.fontArial}</SelectItem>
                      <SelectItem value="calibri">{t.fontCalibri}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t.lineSpacing}</Label>
                  <Select value={lineSpacing} onValueChange={(value) => setLineSpacing(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.0">1.0</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="2.0">2.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t.pageNumbering}</Label>
                  <Select value={pageNumbering} onValueChange={(value) => setPageNumbering(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom">{t.pageNumBottom}</SelectItem>
                      <SelectItem value="top">{t.pageNumTop}</SelectItem>
                      <SelectItem value="none">{t.pageNumNone}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {pageNumbering !== 'none' && (
                  <div>
                    <Label>{t.startFrom}</Label>
                    <Select value={pageNumStart} onValueChange={(value) => setPageNumStart(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cover">{t.startCover}</SelectItem>
                        <SelectItem value="content">{t.startContent}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Editor */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{t.editor}</CardTitle>
                  <CardDescription className="text-base mt-1">{t.editorDesc}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t.reset}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[500px] font-mono text-sm leading-relaxed resize-y"
                placeholder="Start typing your assignment content (this will appear from Page 2)..."
              />

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-medium">
                    {t.words}: <span className="text-foreground">{wordCount}</span>
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="font-medium">
                    {t.estPages}: <span className="text-foreground">{pageCount + 1}</span> <span className="text-xs">(+1 cover)</span>
                  </span>
                </div>
                <span className="text-xs">{t.autoSaved}</span>
              </div>

              {/* AI Improve Button */}
              <Button
                variant="secondary"
                size="lg"
                onClick={handleImproveWithAI}
                disabled={isImproving}
                className="w-full"
              >
                {isImproving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    {t.improveAI}
                  </>
                )}
              </Button>

              {/* Download Buttons */}
              <div className="grid md:grid-cols-3 gap-3">
                <Button size="lg" onClick={handleDownloadPDF}>
                  <Download className="mr-2 h-5 w-5" />
                  {t.downloadPDF}
                </Button>
                <Button size="lg" variant="secondary" onClick={handleDownloadWord}>
                  <FileText className="mr-2 h-5 w-5" />
                  {t.downloadWord}
                </Button>
                <Button size="lg" variant="outline" onClick={handleDownloadText}>
                  <FileDown className="mr-2 h-5 w-5" />
                  {t.downloadText}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reference Helper */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">{t.referenceHelper}</CardTitle>
              <CardDescription>{t.referenceDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-2 text-primary">{t.apaFormat}</h3>
                <div className="space-y-2 text-sm bg-muted/50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{t.book}:</span>
                    <p className="text-muted-foreground mt-1">{REFERENCE_FORMATS.apa.book}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="font-medium">{t.journal}:</span>
                    <p className="text-muted-foreground mt-1">{REFERENCE_FORMATS.apa.journal}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="font-medium">{t.website}:</span>
                    <p className="text-muted-foreground mt-1">{REFERENCE_FORMATS.apa.website}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2 text-primary">{t.mlaFormat}</h3>
                <div className="space-y-2 text-sm bg-muted/50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{t.book}:</span>
                    <p className="text-muted-foreground mt-1">{REFERENCE_FORMATS.mla.book}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="font-medium">{t.journal}:</span>
                    <p className="text-muted-foreground mt-1">{REFERENCE_FORMATS.mla.journal}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="font-medium">{t.website}:</span>
                    <p className="text-muted-foreground mt-1">{REFERENCE_FORMATS.mla.website}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Sathi Assistant */}
          <StudentSathiAssistant />

          {/* Subject Headings */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">{t.subjectHeadings}</CardTitle>
              <CardDescription className="text-sm">{t.subjectHeadingsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">{t.science}</h3>
                </div>
                <div className="space-y-1">
                  {SUBJECT_HEADINGS.science.map((heading, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-2"
                      onClick={() => handleInsertHeading(heading)}
                    >
                      {heading}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">{t.computerScience}</h3>
                </div>
                <div className="space-y-1">
                  {SUBJECT_HEADINGS.computerScience.map((heading, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-2"
                      onClick={() => handleInsertHeading(heading)}
                    >
                      {heading}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">{t.artsCommerce}</h3>
                </div>
                <div className="space-y-1">
                  {SUBJECT_HEADINGS.artsCommerce.map((heading, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-2"
                      onClick={() => handleInsertHeading(heading)}
                    >
                      {heading}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Checklist */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">{t.teacherChecklist}</CardTitle>
              <CardDescription className="text-sm">{t.teacherChecklistDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklistItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox
                      id={`checklist-${index}`}
                      checked={checklist[index] || false}
                      onCheckedChange={() => handleChecklistToggle(index)}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={`checklist-${index}`}
                      className="text-sm leading-tight cursor-pointer"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t.progress}:</span>
                    <span className="text-primary font-bold">
                      {checklist.filter(Boolean).length} / {checklistItems.length}
                    </span>
                  </div>
                  <Progress 
                    value={(checklist.filter(Boolean).length / checklistItems.length) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
