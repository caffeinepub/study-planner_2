import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { X, Mic, MicOff, Image as ImageIcon, Send, Download, FileText, FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGenerateAssignment, useConfirmAssignmentGeneration, useSaveConversationEntry, type AssignmentParams } from '@/hooks/useQueries';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'assignment' | 'confirmation';
  isVoiceMessage?: boolean;
  assignmentData?: {
    title: string;
    content: string;
  };
  confirmationData?: AssignmentParams;
}

interface StudentSathiAssistantProps {
  onClose?: () => void;
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
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

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

export default function StudentSathiAssistant({ onClose }: StudentSathiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [pendingConfirmation, setPendingConfirmation] = useState<AssignmentParams | null>(null);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  const generateAssignmentMutation = useGenerateAssignment();
  const confirmAssignmentMutation = useConfirmAssignmentGeneration();
  const saveConversationMutation = useSaveConversationEntry();

  // Auto-scroll to bottom when new messages arrive (only if user hasn't scrolled up)
  useEffect(() => {
    if (messagesContainerRef.current && shouldAutoScroll) {
      const container = messagesContainerRef.current;
      requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }, [messages, shouldAutoScroll]);

  // Detect manual scrolling to pause auto-scroll
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    if (Math.abs(scrollTop - lastScrollTopRef.current) > 5) {
      lastScrollTopRef.current = scrollTop;
      setShouldAutoScroll(isNearBottom);
    }
  };

  // Show welcome message on mount
  useEffect(() => {
    if (showWelcome && isOpen) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Hello! I can help you create assignments on any topic. Just tell me what you need - for example: "Create an assignment on Climate Change" or "mujhe Computer Networks par assignment chahiye". I will generate it in clean academic English for you.',
        type: 'text',
        isVoiceMessage: false,
      };
      setMessages([welcomeMessage]);
      setShowWelcome(false);
    }
  }, [showWelcome, isOpen]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceMessageSend(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        toast.error('Voice recognition failed');
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const detectLanguage = (text: string): 'urdu' | 'roman-urdu' | 'english' => {
    if (/[\u0600-\u06FF]/.test(text)) return 'urdu';
    
    const romanUrduPatterns = ['aap', 'mujhe', 'kaise', 'kya', 'hai', 'ho', 'bana', 'do', 'kar', 'ke', 'par', 'chahiye'];
    const lowerText = text.toLowerCase();
    const matchCount = romanUrduPatterns.filter(pattern => lowerText.includes(pattern)).length;
    if (matchCount >= 2) return 'roman-urdu';
    
    return 'english';
  };

  const isAssignmentRequest = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    const assignmentKeywords = [
      'assignment', 'bana', 'likho', 'create', 'generate', 'write',
      'chahiye', 'kar do', 'likh do', 'banao', 'likhna', 'project'
    ];
    return assignmentKeywords.some(keyword => lowerText.includes(keyword));
  };

  const isConfirmation = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    return lowerText === 'yes' || lowerText === 'haan' || lowerText === 'han' || lowerText === 'y';
  };

  const generateFullAssignment = (params: AssignmentParams): string => {
    const { topic, level, length } = params;
    
    // Determine content depth based on length
    const isShort = length === 'Short';
    
    return `ASSIGNMENT

INTRODUCTION

This assignment explores the topic of ${topic}. The purpose is to provide a comprehensive understanding of the key concepts, their significance, and practical applications in real-world scenarios. Through this study, we aim to develop a deeper insight into ${topic} and its relevance in today's context.

MAIN CONTENT

Background

${topic} is an important subject that has gained significant attention in recent years. Understanding its fundamentals is essential for anyone studying this field. The background of ${topic} involves various historical developments and theoretical foundations that have shaped our current understanding.

${isShort ? '' : `The evolution of ${topic} can be traced back through various stages of development. Early research and studies laid the groundwork for modern interpretations and applications. Over time, advancements in technology and methodology have enhanced our ability to study and apply concepts related to ${topic}.`}

Key Concepts

The fundamental concepts of ${topic} include several important elements that form the basis of this subject:

1. Core Principles: The basic principles that govern ${topic} are essential for understanding how it functions and why it matters.

2. Theoretical Framework: Various theories and models help explain the mechanisms and processes involved in ${topic}.

3. Practical Applications: Understanding how ${topic} is applied in real-world situations helps bridge the gap between theory and practice.

${isShort ? '' : `4. Current Trends: Modern developments and emerging trends in ${topic} continue to shape the field and open new avenues for research and application.

5. Challenges and Opportunities: Like any field of study, ${topic} presents both challenges that need to be addressed and opportunities for innovation and growth.`}

Analysis and Discussion

A detailed analysis of ${topic} reveals several important insights. The subject demonstrates complexity and requires careful consideration of multiple factors. When examining ${topic}, it is important to consider various perspectives and approaches.

${isShort ? '' : `Different scholars and practitioners have contributed unique viewpoints on ${topic}. These diverse perspectives enrich our understanding and help identify areas where further research is needed. The interdisciplinary nature of ${topic} means that insights from various fields can contribute to a more complete picture.

Critical evaluation of ${topic} involves assessing both strengths and limitations. While there are many positive aspects and benefits associated with ${topic}, it is equally important to acknowledge areas where improvements can be made or where questions remain unanswered.`}

Examples and Applications

Real-world examples help illustrate the practical relevance of ${topic}:

- In educational settings, ${topic} plays a crucial role in shaping learning outcomes and student development.
- Professional applications of ${topic} demonstrate its value in solving practical problems and improving processes.
- Research in ${topic} continues to generate new knowledge and innovative solutions.

${isShort ? '' : `Case studies from various contexts show how ${topic} has been successfully implemented. These examples provide valuable lessons and demonstrate best practices that can be adapted to different situations. Learning from both successes and failures helps refine our approach to ${topic}.`}

CONCLUSION

In conclusion, ${topic} represents an important area of study with significant implications for theory and practice. This assignment has explored the fundamental concepts, analyzed key aspects, and examined practical applications of ${topic}.

The study of ${topic} reveals its multifaceted nature and demonstrates why it deserves careful attention and continued research. As we move forward, understanding ${topic} will remain essential for students, researchers, and practitioners alike.

${isShort ? '' : `Future developments in ${topic} promise to bring new insights and opportunities. By building on current knowledge and addressing existing challenges, we can advance our understanding and application of ${topic} in meaningful ways.`}

REFERENCES

1. Academic textbooks and journals related to ${topic}
2. Research papers and scholarly articles on ${topic}
3. Online educational resources and databases
4. Expert opinions and professional publications

Note: Please add specific references in APA or MLA format as required by your institution.`;
  };

  const generateContextualResponse = (userInput: string, detectedLang: 'urdu' | 'roman-urdu' | 'english'): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('help') || lowerInput.includes('madad') || lowerInput.includes('kaise')) {
      if (detectedLang === 'english') {
        return 'I can help you create complete assignments on any topic. Just tell me the topic, and I will generate a full assignment in academic English for you automatically. You can also ask me about any feature on this page!';
      }
      return 'Main aapke liye kisi bhi topic par complete assignment bana sakta hoon. Bas topic bata do, aur main academic English mein poora assignment generate kar dunga. Aap mujhse is page ke kisi bhi feature ke baare mein bhi pooch sakte ho!';
    }

    if (detectedLang === 'english') {
      return 'I am here to help you create assignments. Tell me what topic you need an assignment on, and I will generate it for you in proper academic English. You can also ask me about any feature on this page.';
    }
    return 'Main yahan aapki assignment banane mein madad ke liye hoon. Mujhe batao kis topic par assignment chahiye, aur main aapke liye proper academic English mein bana dunga. Aap is page ke kisi bhi feature ke baare mein bhi pooch sakte ho.';
  };

  const speakText = (text: string, detectedLang: 'urdu' | 'roman-urdu' | 'english') => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    isSpeakingRef.current = false;

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (detectedLang === 'urdu' || detectedLang === 'roman-urdu') {
      utterance.lang = 'ur-PK';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
    } else {
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
    }

    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceMessageSend = async (transcript: string) => {
    if (!transcript.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: transcript,
      type: 'text',
      isVoiceMessage: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setShouldAutoScroll(true);
    setIsProcessing(true);

    await processMessage(transcript, true);
    setIsProcessing(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'text',
      isVoiceMessage: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setShouldAutoScroll(true);
    const messageContent = input;
    setInput('');
    setIsProcessing(true);

    await processMessage(messageContent, false);
    setIsProcessing(false);
  };

  const processMessage = async (messageContent: string, isVoice: boolean) => {
    const detectedLang = detectLanguage(messageContent);

    // Check if this is a confirmation response
    if (pendingConfirmation && isConfirmation(messageContent)) {
      try {
        await confirmAssignmentMutation.mutateAsync(messageContent);
        
        // Generate full assignment using pending confirmation params
        const assignmentContent = generateFullAssignment(pendingConfirmation);
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: detectedLang === 'english'
            ? 'Perfect! I have generated your complete assignment in academic English. You can download it using the buttons below.'
            : 'Bilkul! Maine aapka complete assignment academic English mein bana diya hai. Aap neeche ke buttons se download kar sakte ho.',
          type: 'assignment',
          isVoiceMessage: false,
          assignmentData: {
            title: pendingConfirmation.topic,
            content: assignmentContent,
          },
        };

        setMessages(prev => [...prev, assistantMessage]);
        setPendingConfirmation(null);
        
        if (isVoice) {
          speakText(assistantMessage.content, detectedLang);
        }

        // Save conversation (silently fail if error)
        try {
          await saveConversationMutation.mutateAsync({
            question: messageContent,
            answer: assistantMessage.content,
          });
        } catch (error) {
          // Silently ignore conversation save errors
          console.log('Conversation save skipped');
        }
      } catch (error: any) {
        const errorMsg = error?.message || '';
        
        let responseContent: string;
        if (errorMsg.includes('ERR:')) {
          // Handle backend validation errors gracefully
          responseContent = detectedLang === 'english'
            ? 'Please reply with YES to confirm the assignment generation.'
            : 'Assignment generate karne ke liye YES reply karo.';
        } else {
          // Generic friendly error
          responseContent = detectedLang === 'english'
            ? 'Let me help you with that assignment. Please reply YES to confirm, or tell me what changes you need.'
            : 'Main aapki assignment mein madad karta hoon. YES reply karo confirm karne ke liye, ya batao kya change chahiye.';
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          type: 'text',
          isVoiceMessage: false,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
      return;
    }

    // Check if user wants to change confirmation details
    if (pendingConfirmation && !isConfirmation(messageContent)) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: detectedLang === 'english'
          ? 'Please tell me what you would like to change, or say YES to proceed with the current settings.'
          : 'Batao kya change karna hai, ya YES kaho current settings ke saath proceed karne ke liye.',
        type: 'text',
        isVoiceMessage: false,
      };
      setMessages(prev => [...prev, assistantMessage]);
      return;
    }

    // Check if this is an assignment request
    if (isAssignmentRequest(messageContent)) {
      try {
        const result = await generateAssignmentMutation.mutateAsync(messageContent);
        
        if (result.needsConfirmation) {
          // Show confirmation message
          setPendingConfirmation(result.params);
          
          const confirmationMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: detectedLang === 'english'
              ? `I will create an assignment on "${result.params.topic}" for ${result.params.level} level in ${result.params.language}. The assignment will be ${result.params.length}. Reply YES to confirm.`
              : `Main "${result.params.topic}" par ${result.params.level} level ke liye ${result.params.language} mein assignment banaunga. Assignment ${result.params.length} hoga. Confirm karne ke liye YES reply karo.`,
            type: 'confirmation',
            isVoiceMessage: false,
            confirmationData: result.params,
          };
          
          setMessages(prev => [...prev, confirmationMessage]);
          
          if (isVoice) {
            speakText(confirmationMessage.content, detectedLang);
          }
        } else {
          // Generate immediately without confirmation
          const assignmentContent = generateFullAssignment(result.params);
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: detectedLang === 'english'
              ? 'I have generated your complete assignment in academic English. You can download it using the buttons below.'
              : 'Maine aapka complete assignment academic English mein bana diya hai. Aap neeche ke buttons se download kar sakte ho.',
            type: 'assignment',
            isVoiceMessage: false,
            assignmentData: {
              title: result.params.topic,
              content: assignmentContent,
            },
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          
          if (isVoice) {
            speakText(assistantMessage.content, detectedLang);
          }
        }

        // Save conversation (silently fail if error)
        try {
          await saveConversationMutation.mutateAsync({
            question: messageContent,
            answer: 'Assignment generated successfully',
          });
        } catch (error) {
          // Silently ignore conversation save errors
          console.log('Conversation save skipped');
        }
      } catch (error) {
        console.error('Assignment generation error:', error);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: detectedLang === 'english'
            ? 'I encountered an issue. Please try again or rephrase your request.'
            : 'Kuch masla ho gaya. Phir se try karo ya apna request dobara likho.',
          type: 'text',
          isVoiceMessage: false,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } else {
      // General conversation
      const responseContent = generateContextualResponse(messageContent, detectedLang);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        type: 'text',
        isVoiceMessage: false,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (isVoice) {
        speakText(responseContent, detectedLang);
      }

      // Save conversation (silently fail if error)
      try {
        await saveConversationMutation.mutateAsync({
          question: messageContent,
          answer: responseContent,
        });
      } catch (error) {
        // Silently ignore conversation save errors
        console.log('Conversation save skipped');
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isProcessing) return;

    setIsProcessing(true);
    toast.info('Processing image...');

    try {
      const Tesseract = await loadTesseract();
      const worker = await Tesseract.createWorker({
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            if (progress % 20 === 0) {
              toast.info(`Processing: ${progress}%`);
            }
          }
        },
      });

      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      if (text.trim()) {
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: `[Image uploaded] ${text}`,
          type: 'text',
          isVoiceMessage: false,
        };

        setMessages(prev => [...prev, userMessage]);
        setShouldAutoScroll(true);
        await processMessage(text, false);
        toast.success('Image processed successfully!');
      } else {
        toast.error('No text found in image');
      }
    } catch (error) {
      console.error('Image processing error:', error);
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in your browser');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.info('Listening...');
      } catch (error) {
        console.error('Voice recognition error:', error);
        toast.error('Failed to start voice recognition');
      }
    }
  };

  const handleDownloadTxt = (title: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_assignment.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Assignment downloaded as TXT!');
  };

  const handleDownloadDocx = (title: string, content: string) => {
    // Simple DOCX-like format (actually RTF for better compatibility)
    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Times New Roman;}}
\\f0\\fs24
${content.replace(/\n/g, '\\par\n')}
}`;
    
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_assignment.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Assignment downloaded as RTF (compatible with Word)!');
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
          aria-label="Open Student Sathi Assistant"
        >
          <img
            src="/assets/generated/chatbot-avatar-transparent.dim_48x48.png"
            alt="Assistant"
            className="h-10 w-10"
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] shadow-2xl flex flex-col">
          <CardHeader className="flex-shrink-0 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/generated/chatbot-avatar-transparent.dim_48x48.png"
                  alt="Assistant"
                  className="h-8 w-8"
                />
                <CardTitle className="text-lg">Student Sathi Assistant</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.type === 'assignment' && message.assignmentData ? (
                      <div className="space-y-3">
                        <p className="text-sm">{message.content}</p>
                        <Separator />
                        <div className="space-y-2">
                          <p className="font-semibold text-sm">
                            {message.assignmentData.title}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDownloadTxt(
                                  message.assignmentData!.title,
                                  message.assignmentData!.content
                                )
                              }
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              TXT
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDownloadDocx(
                                  message.assignmentData!.title,
                                  message.assignmentData!.content
                                )
                              }
                            >
                              <FileDown className="h-3 w-3 mr-1" />
                              Word
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    {message.isVoiceMessage && (
                      <span className="text-xs opacity-70 mt-1 block">🎤 Voice</span>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 border-t p-4 space-y-2">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="min-h-[60px] resize-none"
                  disabled={isProcessing}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isProcessing}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={isRecording ? 'destructive' : 'outline'}
                    onClick={handleVoiceToggle}
                    disabled={isProcessing}
                  >
                    {isRecording ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
