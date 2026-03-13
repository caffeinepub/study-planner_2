import { Copy, Download, FileText, MessageCircle, Trash2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  type Language,
  type LetterParams,
  type RecipientType,
  generateLeaveApplicationLetter,
  generateLeaveApplicationText,
  isRTLLanguage,
} from "../utils/leaveApplicationLetterTemplate";
import { generateWhatsAppMessage } from "../utils/leaveApplicationWhatsApp";

const LANGUAGES: Language[] = [
  "English",
  "Urdu",
  "Hindi",
  "Arabic",
  "French",
  "Spanish",
  "German",
  "Portuguese",
  "Bengali",
  "Punjabi",
  "Turkish",
  "Persian",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Italian",
  "Dutch",
  "Polish",
  "Swedish",
];

const RECIPIENT_TYPES: { value: RecipientType; label: string }[] = [
  { value: "principal", label: "Principal" },
  { value: "teacher", label: "Class Teacher" },
  { value: "hod", label: "Head of Department" },
  { value: "manager", label: "Manager" },
  { value: "hr", label: "HR Manager" },
];

// Predefined reasons — "other" triggers custom text input and is never auto-translated
const LEAVE_REASONS = [
  { value: "sick", label: "Sick Leave" },
  { value: "family", label: "Family Function" },
  { value: "personal", label: "Personal Work" },
  { value: "emergency", label: "Emergency" },
  { value: "medical", label: "Medical Appointment" },
  { value: "other", label: "Other (Custom)" },
];

type DurationType = "full" | "half";
type ApplicationType = "school" | "college" | "university" | "office";

const REASON_EXPAND_MAP: Record<string, string> = {
  fever: "Severe fever and doctor advised rest for recovery.",
  headache: "Severe headache and medical rest required.",
  cold: "Common cold with fever requiring rest and recovery.",
  cough: "Persistent cough requiring medical rest.",
  flu: "Influenza symptoms requiring bed rest and medical care.",
  stomach: "Stomach pain and illness requiring medical attention.",
  injury: "Physical injury requiring medical attention and rest.",
  surgery: "Scheduled surgery requiring absence and recovery time.",
  hospital: "Hospitalization for medical treatment and recovery.",
  "family function": "Important family function requiring my presence.",
  "family event": "Important family event requiring my presence.",
  wedding: "Family wedding ceremony requiring my attendance.",
  funeral: "Bereavement due to loss of a family member.",
  "death in family": "Bereavement due to death in the family.",
  emergency: "Urgent family emergency requiring immediate attention.",
  "personal work": "Important personal matters requiring my attention.",
  "personal matter": "Urgent personal matter requiring my immediate attention.",
  travel: "Out-of-town travel for urgent personal reasons.",
  "out of station": "Out of station due to urgent personal reasons.",
  exam: "Appearing in an important examination on the specified date.",
  "entrance exam":
    "Appearing in an entrance examination on the specified date.",
  interview: "Attending an important job or college interview.",
  "visa appointment":
    "Attending a scheduled visa appointment at the consulate.",
  "bank work": "Important banking matters requiring personal presence.",
  "government work":
    "Government-related documentation work requiring presence.",
  "medical appointment":
    "Scheduled medical check-up and consultation with doctor.",
  "doctor appointment": "Scheduled appointment with a medical specialist.",
  "eye checkup": "Routine eye examination and vision check-up appointment.",
  "dental appointment": "Scheduled dental consultation and treatment.",
  "mental health":
    "Mental health concerns requiring rest and professional support.",
  fatigue: "Extreme fatigue and exhaustion requiring medical rest.",
  allergy: "Severe allergic reaction requiring medical treatment.",
  "food poisoning": "Food poisoning with symptoms requiring rest and recovery.",
  vomiting: "Vomiting and nausea requiring medical rest at home.",
  diarrhea: "Stomach illness with diarrhea requiring rest and hydration.",
  migraine: "Severe migraine attack requiring complete rest.",
  "back pain": "Severe back pain requiring medical rest and treatment.",
  "knee pain": "Knee pain and discomfort requiring rest and physiotherapy.",
  accident: "Road accident injuries requiring medical attention and rest.",
  pregnancy: "Medical appointment related to pregnancy and prenatal care.",
};

export default function LeaveApplicationPage() {
  const [applicationType, setApplicationType] =
    useState<ApplicationType>("school");
  const [studentName, setStudentName] = useState("");
  const [parentGuardianName, setParentGuardianName] = useState("");
  const [className, setClassName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [recipientType, setRecipientType] =
    useState<RecipientType>("principal");
  const [reason, setReason] = useState("sick");
  const [customReason, setCustomReason] = useState("");
  const [aiAssistEnabled, setAiAssistEnabled] = useState(false);
  const [assistedReason, setAssistedReason] = useState("");
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");
  const [durationType, setDurationType] = useState<DurationType>("full");
  const [absentSinceDate, setAbsentSinceDate] = useState("");
  const [language, setLanguage] = useState<Language>("English");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-set recipient based on application type
  useEffect(() => {
    if (applicationType === "office") {
      setRecipientType("manager");
    } else {
      setRecipientType("principal");
    }
  }, [applicationType]);

  // AI Reason Assist expansion
  useEffect(() => {
    if (!aiAssistEnabled) {
      setAssistedReason("");
      return;
    }
    const normalized = customReason.trim().toLowerCase();
    if (!normalized) {
      setAssistedReason("");
      return;
    }
    // Only assist short keywords (≤5 words, no terminal punctuation)
    const wordCount = normalized.split(/\s+/).length;
    const hasTerminalPunct = /[.?!]$/.test(normalized);
    if (wordCount > 5 || hasTerminalPunct) {
      setAssistedReason("");
      return;
    }
    // Exact match
    if (REASON_EXPAND_MAP[normalized]) {
      setAssistedReason(REASON_EXPAND_MAP[normalized]);
      return;
    }
    // Partial match
    const key = Object.keys(REASON_EXPAND_MAP).find(
      (k) => normalized.includes(k) || k.includes(normalized),
    );
    setAssistedReason(key ? REASON_EXPAND_MAP[key] : "");
  }, [customReason, aiAssistEnabled]);

  const handleGenerate = () => {
    if (
      !studentName.trim() ||
      !parentGuardianName.trim() ||
      !className.trim() ||
      !schoolName.trim() ||
      !startDateStr
    ) {
      alert(
        "Please fill in all required fields (Student Name, Parent/Guardian Name, Class, School, and Start Date).",
      );
      return;
    }

    setIsGenerating(true);

    // For "other": use assistedReason if AI assist is on, otherwise raw custom text
    const finalReason =
      reason === "other"
        ? aiAssistEnabled && assistedReason
          ? assistedReason
          : customReason.trim()
        : reason;

    if (!finalReason) {
      alert("Please enter a reason for leave.");
      setIsGenerating(false);
      return;
    }

    const startDate = new Date(`${startDateStr}T00:00:00`);
    const endDate = endDateStr ? new Date(`${endDateStr}T00:00:00`) : startDate;

    const resolvedDurationType: "single" | "range" =
      endDateStr && endDateStr !== startDateStr ? "range" : "single";

    const params: LetterParams = {
      studentName: studentName.trim(),
      className: className.trim(),
      schoolName: schoolName.trim(),
      recipientType,
      recipientName: "",
      reason: finalReason,
      startDate,
      endDate,
      durationType: resolvedDurationType,
      halfDay: durationType === "half",
      language,
      parentName: parentGuardianName.trim(),
    };

    try {
      const html = generateLeaveApplicationLetter(params);
      const text = generateLeaveApplicationText(params);
      setGeneratedLetter(html);
      setGeneratedText(text);
    } catch (e) {
      console.error("Error generating letter:", e);
      alert(
        "Failed to generate letter. Please check your inputs and try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = generatedText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownloadText = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Leave_Application.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleWhatsAppShare = () => {
    if (!generatedLetter) {
      alert("Please generate the application first.");
      return;
    }

    // Resolve the final reason key (predefined key or custom text)
    const finalReason =
      reason === "other"
        ? aiAssistEnabled && assistedReason
          ? assistedReason
          : customReason.trim()
        : reason;

    const startDate = startDateStr
      ? new Date(`${startDateStr}T00:00:00`)
      : new Date();

    const message = generateWhatsAppMessage({
      studentName: studentName.trim(),
      className: className.trim(),
      reason: finalReason,
      startDate,
      language,
    });

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDownloadPdf = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isGeneratingPdf) return;

    if (!generatedLetter) {
      alert("Please generate the application first.");
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const studentNameVal = studentName.trim() || "Student";
      const isRTLVal = isRTLLanguage(language);

      // Use Google Fonts for Urdu (Noto Nastaliq) and Hindi (Noto Sans Devanagari)
      const fontLinks = `
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&family=Noto+Sans+Devanagari&family=Noto+Naskh+Arabic&display=swap" rel="stylesheet" />
      `;

      const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
${fontLinks}
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Arial', 'Noto Nastaliq Urdu', 'Noto Sans Devanagari', 'Noto Naskh Arabic', sans-serif;
    margin: 0;
    padding: 32px 36px;
    font-size: 13px;
    line-height: 1.8;
    color: #1a1a1a;
    direction: ${isRTLVal ? "rtl" : "ltr"};
    background: #fff;
  }
  p { margin-bottom: 0; }
</style>
</head>
<body>${generatedLetter}</body>
</html>`;

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.top = "-9999px";
      iframe.style.left = "-9999px";
      iframe.style.width = "794px";
      iframe.style.height = "1123px";
      iframe.style.border = "none";
      iframe.style.visibility = "hidden";
      document.body.appendChild(iframe);

      await new Promise<void>((resolve) => {
        iframe.onload = () => resolve();
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(htmlDoc);
          doc.close();
        }
        setTimeout(resolve, 1000);
      });

      // Extra wait for fonts to load
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      const iframeBody = iframe.contentDocument?.body;
      if (!iframeBody) throw new Error("iframe body not available");

      // biome-ignore lint/suspicious/noExplicitAny: CDN globals from index.html
      const html2canvasFn = (window as any).html2canvas as (
        el: HTMLElement,
        opts?: Record<string, unknown>,
      ) => Promise<HTMLCanvasElement>;

      // biome-ignore lint/suspicious/noExplicitAny: CDN globals from index.html
      const { jsPDF } = (window as any).jspdf;

      const canvas = await html2canvasFn(iframeBody, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 794,
        width: 794,
        logging: false,
      });

      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeightMm = (canvas.height * pageWidth) / canvas.width;

      if (imgHeightMm <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeightMm);
      } else {
        let yOffset = 0;
        while (yOffset < imgHeightMm) {
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -yOffset, pageWidth, imgHeightMm);
          yOffset += pageHeight;
        }
      }

      pdf.save(`Leave_Application_${studentNameVal}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      try {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          const isRTLVal = isRTLLanguage(language);
          printWindow.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>Leave Application</title>
<style>body{font-family:Arial,sans-serif;margin:40px;font-size:13px;line-height:1.6;direction:${isRTLVal ? "rtl" : "ltr"};}</style>
</head><body>${generatedLetter}<script>window.onload=function(){window.print();window.close();}<\/script></body></html>`);
          printWindow.document.close();
        }
      } catch {
        alert(
          "PDF generation failed. Please try the Download TXT option instead.",
        );
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleClearOutput = () => {
    setGeneratedLetter("");
    setGeneratedText("");
    setCopySuccess(false);
    setStudentName("");
    setParentGuardianName("");
    setClassName("");
    setSchoolName("");
    setReason("sick");
    setCustomReason("");
    setAiAssistEnabled(false);
    setAssistedReason("");
    setStartDateStr("");
    setEndDateStr("");
    setAbsentSinceDate("");
    setRecipientType("principal");
    setDurationType("full");
    setLanguage("English");
    setApplicationType("school");
  };

  const isRTL = isRTLLanguage(language);

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/assets/generated/leave-icon.dim_64x64.png"
            alt="Leave"
            className="w-12 h-12"
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Leave Application Generator
            </h1>
            <p className="text-muted-foreground text-sm">
              Generate professional leave applications in multiple languages
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Application Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Application Type — first, full width */}
              <div className="col-span-2">
                <label
                  htmlFor="applicationType"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Application Type
                </label>
                <select
                  id="applicationType"
                  data-ocid="leave.apptype.select"
                  value={applicationType}
                  onChange={(e) =>
                    setApplicationType(e.target.value as ApplicationType)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="school">School</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                  <option value="office">Office</option>
                </select>
              </div>

              {/* Row 1: Student Name + Parent/Guardian Name */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="studentName"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Student Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="studentName"
                  data-ocid="leave.studentname.input"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="parentGuardianName"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Parent / Guardian Name{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  id="parentGuardianName"
                  data-ocid="leave.parentname.input"
                  type="text"
                  value={parentGuardianName}
                  onChange={(e) => setParentGuardianName(e.target.value)}
                  placeholder="Parent or guardian name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Row 2: School Name + Class/Grade */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="schoolName"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  School / Institution Name{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  id="schoolName"
                  data-ocid="leave.schoolname.input"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Government High School"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="className"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Class / Grade <span className="text-destructive">*</span>
                </label>
                <input
                  id="className"
                  data-ocid="leave.classname.input"
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Class 10-A"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Row 3: Recipient Type + Language */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="recipientType"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Recipient Type <span className="text-destructive">*</span>
                </label>
                <select
                  id="recipientType"
                  data-ocid="leave.recipienttype.select"
                  value={recipientType}
                  onChange={(e) =>
                    setRecipientType(e.target.value as RecipientType)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {RECIPIENT_TYPES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Language
                </label>
                <select
                  id="language"
                  data-ocid="leave.language.select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason for Leave */}
              <div className="col-span-2">
                <label
                  htmlFor="leaveReason"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Reason for Leave <span className="text-destructive">*</span>
                </label>
                <select
                  id="leaveReason"
                  data-ocid="leave.reason.select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {LEAVE_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {reason === "other" && (
                  <>
                    <input
                      data-ocid="leave.customreason.input"
                      type="text"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Describe your reason (will not be translated)..."
                      className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="aiAssist"
                        checked={aiAssistEnabled}
                        onChange={(e) => setAiAssistEnabled(e.target.checked)}
                        className="accent-primary"
                        data-ocid="leave.aiassist.checkbox"
                      />
                      <label
                        htmlFor="aiAssist"
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        ✨ AI Reason Assist{" "}
                        <span className="text-xs">
                          (auto-expand short keywords)
                        </span>
                      </label>
                    </div>
                    {aiAssistEnabled && assistedReason && (
                      <div className="mt-1 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 text-sm text-foreground">
                        <span className="text-xs text-muted-foreground font-medium">
                          Expanded:{" "}
                        </span>
                        {assistedReason}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Leave Start Date */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Leave Start Date <span className="text-destructive">*</span>
                </label>
                <input
                  id="startDate"
                  data-ocid="leave.startdate.input"
                  type="date"
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Leave End Date */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Leave End Date{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </label>
                <input
                  id="endDate"
                  data-ocid="leave.enddate.input"
                  type="date"
                  value={endDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Leave Duration Type */}
              <div className="col-span-2">
                <span className="block text-sm font-medium text-foreground mb-2">
                  Leave Duration Type
                </span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="durationType"
                      value="full"
                      checked={durationType === "full"}
                      onChange={() => setDurationType("full")}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">Full Day</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="durationType"
                      value="half"
                      checked={durationType === "half"}
                      onChange={() => setDurationType("half")}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">Half Day</span>
                  </label>
                </div>
              </div>

              {/* Absent Since (Date) */}
              <div className="col-span-2">
                <label
                  htmlFor="absentSinceDate"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Absent Since (Date){" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </label>
                <input
                  id="absentSinceDate"
                  data-ocid="leave.absentsince.input"
                  type="date"
                  value={absentSinceDate}
                  onChange={(e) => setAbsentSinceDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              data-ocid="leave.generate.primary_button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-5 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Generating..." : "Generate Leave Application"}
            </button>
          </div>

          {/* Output Section */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Application Preview
              </h2>

              {/* Preview Box */}
              <div
                className="border border-border rounded-lg bg-white overflow-y-auto"
                style={{ height: "420px" }}
              >
                {generatedLetter ? (
                  <div
                    id="leaveAppPdfContent"
                    ref={previewRef}
                    dir={isRTL ? "rtl" : "ltr"}
                    className="p-4 text-sm leading-relaxed"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted generated HTML
                    dangerouslySetInnerHTML={{ __html: generatedLetter }}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 px-4 text-center">
                    <FileText className="w-12 h-12 opacity-30" />
                    <p className="text-sm">
                      Fill in the details and click Generate to preview your
                      leave application.
                    </p>
                  </div>
                )}
              </div>

              {/* Output Buttons */}
              <div
                style={{
                  marginTop: "15px",
                  paddingTop: "10px",
                  borderTop: "1px solid #eee",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  data-ocid="leave.copy.button"
                  onClick={handleCopyText}
                  disabled={!generatedLetter}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Copy className="w-4 h-4" />
                  {copySuccess ? "Copied!" : "Copy Text"}
                </button>

                <button
                  type="button"
                  data-ocid="leave.downloadtxt.button"
                  onClick={handleDownloadText}
                  disabled={!generatedLetter}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Download TXT
                </button>

                <button
                  type="button"
                  data-ocid="leave.whatsapp.button"
                  onClick={handleWhatsAppShare}
                  disabled={!generatedLetter}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-4 h-4" />📲 WhatsApp
                </button>

                <button
                  type="button"
                  id="downloadBtn"
                  data-ocid="leave.downloadpdf.button"
                  onClick={handleDownloadPdf}
                  disabled={!generatedLetter || isGeneratingPdf}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  {isGeneratingPdf ? "Generating..." : "Download PDF"}
                </button>

                <button
                  type="button"
                  data-ocid="leave.clear.button"
                  onClick={handleClearOutput}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm hover:bg-muted transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
