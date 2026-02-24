import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Upload, 
  Download,
  FileText,
  Loader2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

type ChatLanguage = 'english' | 'urdu' | 'romanUrdu' | 'hindi' | 'arabic' | 'chinese' | 'japanese' | 'french' | 'russian';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  hasDownloads?: boolean;
  downloadContent?: string;
}

interface AssignmentChatbotProps {
  onInsertContent?: (content: string) => void;
}

// Tesseract.js types
interface TesseractWorker {
  load(): Promise<void>;
  loadLanguage(lang: string): Promise<void>;
  initialize(lang: string): Promise<void>;
  recognize(image: File | string): Promise<{ data: { text: string } }>;
  terminate(): Promise<void>;
}

interface TesseractModule {
  createWorker(options?: { logger?: (m: any) => void }): Promise<TesseractWorker>;
}

declare global {
  interface Window {
    Tesseract?: TesseractModule;
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

const CHATBOT_TRANSLATIONS = {
  english: {
    title: 'Assignment Assistant',
    placeholder: 'Ask me anything about assignments...',
    send: 'Send',
    listening: 'Listening...',
    processing: 'Processing...',
    suggestions: [
      'What should I write in introduction?',
      'How do I format references?',
      'Create assignment on Physics motion',
      'What is the next step?'
    ],
    downloadPDF: 'Download PDF',
    downloadWord: 'Download Word',
    downloadText: 'Download Text',
    uploadImage: 'Upload Image',
    voiceInput: 'Voice Input',
    voiceOutput: 'Voice Output',
  },
  urdu: {
    title: 'اسائنمنٹ اسسٹنٹ',
    placeholder: 'اسائنمنٹ کے بارے میں کچھ بھی پوچھیں...',
    send: 'بھیجیں',
    listening: 'سن رہا ہے...',
    processing: 'پروسیسنگ...',
    suggestions: [
      'تعارف میں کیا لکھوں؟',
      'حوالہ جات کیسے فارمیٹ کریں؟',
      'فزکس موشن پر اسائنمنٹ بنائیں',
      'اگلا قدم کیا ہے؟'
    ],
    downloadPDF: 'PDF ڈاؤن لوڈ',
    downloadWord: 'Word ڈاؤن لوڈ',
    downloadText: 'Text ڈاؤن لوڈ',
    uploadImage: 'تصویر اپ لوڈ',
    voiceInput: 'آواز ان پٹ',
    voiceOutput: 'آواز آؤٹ پٹ',
  },
  romanUrdu: {
    title: 'Assignment Assistant',
    placeholder: 'Assignment ke baare mein kuch bhi poochein...',
    send: 'Bhejein',
    listening: 'Sun raha hai...',
    processing: 'Processing...',
    suggestions: [
      'Introduction mein kya likhun?',
      'References kaise format karein?',
      'Physics motion par assignment banao',
      'Agla step kya hai?'
    ],
    downloadPDF: 'PDF Download',
    downloadWord: 'Word Download',
    downloadText: 'Text Download',
    uploadImage: 'Tasveer Upload',
    voiceInput: 'Awaaz Input',
    voiceOutput: 'Awaaz Output',
  },
  hindi: {
    title: 'असाइनमेंट सहायक',
    placeholder: 'असाइनमेंट के बारे में कुछ भी पूछें...',
    send: 'भेजें',
    listening: 'सुन रहा है...',
    processing: 'प्रोसेसिंग...',
    suggestions: [
      'परिचय में क्या लिखूं?',
      'संदर्भ कैसे फॉर्मेट करें?',
      'भौतिकी गति पर असाइनमेंट बनाएं',
      'अगला कदम क्या है?'
    ],
    downloadPDF: 'PDF डाउनलोड',
    downloadWord: 'Word डाउनलोड',
    downloadText: 'Text डाउनलोड',
    uploadImage: 'छवि अपलोड',
    voiceInput: 'वॉयस इनपुट',
    voiceOutput: 'वॉयस आउटपुट',
  },
  arabic: {
    title: 'مساعد المهام',
    placeholder: 'اسأل أي شيء عن المهام...',
    send: 'إرسال',
    listening: 'الاستماع...',
    processing: 'المعالجة...',
    suggestions: [
      'ماذا أكتب في المقدمة؟',
      'كيف أقوم بتنسيق المراجع؟',
      'إنشاء مهمة عن حركة الفيزياء',
      'ما هي الخطوة التالية؟'
    ],
    downloadPDF: 'تنزيل PDF',
    downloadWord: 'تنزيل Word',
    downloadText: 'تنزيل Text',
    uploadImage: 'تحميل صورة',
    voiceInput: 'إدخال صوتي',
    voiceOutput: 'إخراج صوتي',
  },
  chinese: {
    title: '作业助手',
    placeholder: '询问有关作业的任何问题...',
    send: '发送',
    listening: '正在听...',
    processing: '处理中...',
    suggestions: [
      '引言中应该写什么？',
      '如何格式化参考文献？',
      '创建物理运动作业',
      '下一步是什么？'
    ],
    downloadPDF: '下载 PDF',
    downloadWord: '下载 Word',
    downloadText: '下载 Text',
    uploadImage: '上传图片',
    voiceInput: '语音输入',
    voiceOutput: '语音输出',
  },
  japanese: {
    title: '課題アシスタント',
    placeholder: '課題について何でも聞いてください...',
    send: '送信',
    listening: '聞いています...',
    processing: '処理中...',
    suggestions: [
      '序論に何を書けばいいですか？',
      '参考文献をどのようにフォーマットしますか？',
      '物理学の運動に関する課題を作成',
      '次のステップは何ですか？'
    ],
    downloadPDF: 'PDFダウンロード',
    downloadWord: 'Wordダウンロード',
    downloadText: 'Textダウンロード',
    uploadImage: '画像をアップロード',
    voiceInput: '音声入力',
    voiceOutput: '音声出力',
  },
  french: {
    title: 'Assistant de devoir',
    placeholder: 'Posez des questions sur les devoirs...',
    send: 'Envoyer',
    listening: 'Écoute...',
    processing: 'Traitement...',
    suggestions: [
      'Que dois-je écrire dans l\'introduction?',
      'Comment formater les références?',
      'Créer un devoir sur le mouvement physique',
      'Quelle est la prochaine étape?'
    ],
    downloadPDF: 'Télécharger PDF',
    downloadWord: 'Télécharger Word',
    downloadText: 'Télécharger Text',
    uploadImage: 'Télécharger une image',
    voiceInput: 'Entrée vocale',
    voiceOutput: 'Sortie vocale',
  },
  russian: {
    title: 'Помощник по заданиям',
    placeholder: 'Спросите что-угодно о заданиях...',
    send: 'Отправить',
    listening: 'Слушаю...',
    processing: 'Обработка...',
    suggestions: [
      'Что писать во введении?',
      'Как форматировать ссылки?',
      'Создать задание по физике движения',
      'Какой следующий шаг?'
    ],
    downloadPDF: 'Скачать PDF',
    downloadWord: 'Скачать Word',
    downloadText: 'Скачать Text',
    uploadImage: 'Загрузить изображение',
    voiceInput: 'Голосовой ввод',
    voiceOutput: 'Голосовой вывод',
  },
};

// Load Tesseract.js from CDN
const loadTesseract = (): Promise<TesseractModule> => {
  return new Promise((resolve, reject) => {
    if (window.Tesseract) {
      resolve(window.Tesseract);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.async = true;
    script.onload = () => {
      if (window.Tesseract) {
        resolve(window.Tesseract);
      } else {
        reject(new Error('Tesseract failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Tesseract script'));
    document.head.appendChild(script);
  });
};

export default function AssignmentChatbot({ onInsertContent }: AssignmentChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<ChatLanguage>('english');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = CHATBOT_TRANSLATIONS[language];

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          toast.error('Voice recognition failed');
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakText = (text: string) => {
    if (!voiceOutputEnabled) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();

    // Page-aware guidance
    if (lowerMessage.includes('board') || lowerMessage.includes('university')) {
      return 'The Board/University selector helps format your assignment according to specific requirements. FBISE, Punjab, Sindh, KPK, and Balochistan boards have similar formats, while AIOU and VU have their own styles. Choose the one that matches your institution.';
    }

    if (lowerMessage.includes('title page') || lowerMessage.includes('cover page')) {
      return 'The title page is automatically generated with your details. Fill in your name, roll number, subject, teacher name, institute, and date. The format will adjust based on your selected board/university.';
    }

    if (lowerMessage.includes('format') || lowerMessage.includes('font') || lowerMessage.includes('spacing')) {
      return 'Use the Format Settings to choose your font (Times New Roman, Arial, or Calibri), line spacing (1.0, 1.5, or 2.0), and page numbering position. These settings apply when you download your assignment.';
    }

    if (lowerMessage.includes('reference') || lowerMessage.includes('citation') || lowerMessage.includes('bibliography')) {
      return 'Check the Reference Helper section on the right side. It shows APA and MLA citation formats for books, journals, and websites. Copy the format and replace the placeholders with your actual source information.';
    }

    if (lowerMessage.includes('heading') || lowerMessage.includes('subject heading')) {
      return 'Use the Subject Headings panel to insert pre-made headings for Science, Computer Science, or Arts/Commerce. Click any heading to insert it at your cursor position in the editor.';
    }

    if (lowerMessage.includes('checklist') || lowerMessage.includes('requirement')) {
      return 'The Teacher Checklist helps ensure you meet all requirements. Check off each item as you complete it: cover page, table of contents, introduction, organized content, word count, references, formatting, and proofreading.';
    }

    if (lowerMessage.includes('download') || lowerMessage.includes('save')) {
      return 'You can download your assignment in three formats: PDF (for printing), Word (.docx for editing), or Text (.txt for plain text). The editor will reset after download, but your draft is auto-saved in your browser.';
    }

    if (lowerMessage.includes('image') || lowerMessage.includes('upload') || lowerMessage.includes('photo')) {
      return 'Upload an image of your notes or questions using the Image Upload section. The text will be extracted automatically and inserted into your editor. This works best with clear, well-lit photos.';
    }

    if (lowerMessage.includes('improve') || lowerMessage.includes('ai') || lowerMessage.includes('grammar')) {
      return 'The "Improve with AI" button fixes grammar, spacing, and common typos in your assignment. It enhances clarity while maintaining your original content and academic tone.';
    }

    if (lowerMessage.includes('introduction') || lowerMessage.includes('intro')) {
      return 'Your introduction should briefly explain the topic, state the purpose of the assignment, and outline what you will cover. Keep it clear and concise - about 1-2 paragraphs is usually enough.';
    }

    if (lowerMessage.includes('conclusion')) {
      return 'The conclusion should summarize your main points and provide final thoughts or recommendations. Don\'t introduce new information here - just wrap up what you\'ve already discussed.';
    }

    if (lowerMessage.includes('next step') || lowerMessage.includes('what now')) {
      return 'Here\'s what to do next: 1) Fill in your title page details, 2) Write your assignment content in the editor, 3) Use subject headings to organize sections, 4) Add references, 5) Check the teacher checklist, 6) Download your assignment!';
    }

    // Assignment generation requests
    if (lowerMessage.includes('create') || lowerMessage.includes('generate') || lowerMessage.includes('bana') || lowerMessage.includes('assignment')) {
      const topic = userMessage.replace(/create|generate|bana|do|assignment|on|ka|par/gi, '').trim();
      
      if (topic.length > 3) {
        return `I've created a basic assignment structure on "${topic}". Here's what I generated:\n\n**ASSIGNMENT: ${topic.toUpperCase()}**\n\n**1. INTRODUCTION**\nThis assignment explores the topic of ${topic}. The purpose is to understand the key concepts and their practical applications.\n\n**2. MAIN CONTENT**\n\n**2.1 Overview**\n${topic} is an important subject that requires careful study and understanding.\n\n**2.2 Key Concepts**\n- Concept 1: [Add details]\n- Concept 2: [Add details]\n- Concept 3: [Add details]\n\n**2.3 Analysis**\n[Add your analysis and explanations here]\n\n**3. CONCLUSION**\nIn conclusion, ${topic} demonstrates important principles that are relevant to our studies.\n\n**4. REFERENCES**\n[Add your references here in APA or MLA format]`;
      }
    }

    // Default helpful response
    return 'I\'m here to help with your assignment! You can ask me about:\n\n• How to use any section of this page\n• What to write in different parts\n• How to format references\n• Tips for better assignments\n• Or ask me to create an assignment on any topic!\n\nTry clicking one of the suggestions below, or just type your question.';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const responseText = await generateResponse(inputValue);
      
      // Check if this is a generated assignment
      const isGeneratedAssignment = responseText.includes('**ASSIGNMENT:') || responseText.includes('INTRODUCTION');
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        hasDownloads: isGeneratedAssignment,
        downloadContent: isGeneratedAssignment ? responseText : undefined,
      };

      setMessages(prev => [...prev, assistantMessage]);
      speakText(responseText.substring(0, 200)); // Speak first 200 chars
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsProcessing(true);

    try {
      const Tesseract = await loadTesseract();
      const worker = await Tesseract.createWorker();

      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      if (text.trim()) {
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: '[Uploaded image with text]',
          timestamp: new Date(),
        };

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I extracted this text from your image:\n\n${text.trim()}\n\nWould you like me to help format this into an assignment?`,
          timestamp: new Date(),
          hasDownloads: true,
          downloadContent: text.trim(),
        };

        setMessages(prev => [...prev, userMessage, assistantMessage]);
        toast.success('Text extracted from image');
      } else {
        toast.error('No text found in image');
      }
    } catch (error) {
      console.error('OCR error:', error);
      toast.error('Failed to extract text from image');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = (content: string, format: 'pdf' | 'word' | 'text') => {
    if (format === 'text') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chatbot-assignment.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Downloaded as text file');
    } else if (format === 'word') {
      const rtfContent = `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0 Times New Roman;}}\n\\f0\\fs24\n${content.replace(/\n/g, '\\par\n')}\n}`;
      const blob = new Blob([rtfContent], { type: 'application/rtf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chatbot-assignment.rtf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Downloaded as Word document');
    } else {
      toast.info('Opening print dialog - save as PDF');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Assignment</title>
            <style>
              body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; padding: 1in; }
              pre { white-space: pre-wrap; word-wrap: break-word; font-family: 'Times New Roman', Times, serif; }
            </style>
          </head>
          <body><pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></body>
          </html>
        `);
        printWindow.document.close();
        printWindow.onload = () => printWindow.print();
      }
    }
  };

  const handleInsertToEditor = (content: string) => {
    if (onInsertContent) {
      onInsertContent(content);
      toast.success('Content inserted into editor');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-primary/50"
        aria-label="Open chatbot"
      >
        <img 
          src="/assets/generated/chatbot-avatar-transparent.dim_48x48.png" 
          alt="Chatbot" 
          className="w-16 h-16 rounded-full"
        />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] shadow-2xl border-2 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/chatbot-avatar-transparent.dim_48x48.png" 
            alt="Chatbot" 
            className="w-10 h-10 rounded-full bg-white p-1"
          />
          <div>
            <h3 className="font-semibold text-lg">{t.title}</h3>
            <Select value={language} onValueChange={(value) => setLanguage(value as ChatLanguage)}>
              <SelectTrigger className="h-6 text-xs border-0 bg-primary-foreground/20 text-primary-foreground w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="urdu">اردو</SelectItem>
                <SelectItem value="romanUrdu">Roman Urdu</SelectItem>
                <SelectItem value="hindi">हिन्दी</SelectItem>
                <SelectItem value="arabic">العربية</SelectItem>
                <SelectItem value="chinese">中文</SelectItem>
                <SelectItem value="japanese">日本語</SelectItem>
                <SelectItem value="french">Français</SelectItem>
                <SelectItem value="russian">Русский</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
        <Button
          variant={voiceEnabled ? 'default' : 'outline'}
          size="sm"
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className="text-xs"
        >
          {voiceEnabled ? <Mic className="h-3 w-3 mr-1" /> : <MicOff className="h-3 w-3 mr-1" />}
          {t.voiceInput}
        </Button>
        <Button
          variant={voiceOutputEnabled ? 'default' : 'outline'}
          size="sm"
          onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)}
          className="text-xs"
        >
          {voiceOutputEnabled ? <Volume2 className="h-3 w-3 mr-1" /> : <VolumeX className="h-3 w-3 mr-1" />}
          {t.voiceOutput}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="text-xs ml-auto"
        >
          <Upload className="h-3 w-3 mr-1" />
          {t.uploadImage}
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="text-center text-sm text-muted-foreground mb-4">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p>Hi! I'm your assignment assistant. Ask me anything!</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Try these:</p>
              {t.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start h-auto py-2 px-3"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block max-w-[85%] rounded-lg p-3 text-sm ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {message.hasDownloads && message.downloadContent && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs flex-1"
                      onClick={() => handleDownload(message.downloadContent!, 'pdf')}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs flex-1"
                      onClick={() => handleDownload(message.downloadContent!, 'word')}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Word
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs flex-1"
                      onClick={() => handleDownload(message.downloadContent!, 'text')}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Text
                    </Button>
                  </div>
                  {onInsertContent && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs w-full"
                      onClick={() => handleInsertToEditor(message.downloadContent!)}
                    >
                      Insert to Editor
                    </Button>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}

        {isProcessing && (
          <div className="text-left mb-4">
            <div className="inline-block bg-muted rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? t.listening : t.placeholder}
            disabled={isProcessing || isListening}
            className="flex-1"
          />
          {voiceEnabled && (
            <Button
              variant={isListening ? 'destructive' : 'outline'}
              size="icon"
              onClick={handleVoiceInput}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
