import React, { useState, useRef } from 'react';
import { Copy, Download, FileText, Trash2 } from 'lucide-react';
import {
  generateLeaveApplicationLetter,
  generateLeaveApplicationText,
  isRTLLanguage,
  type LetterParams,
  type Language,
  type RecipientType,
} from '../utils/leaveApplicationLetterTemplate';

const LANGUAGES: Language[] = [
  'English', 'Urdu', 'Hindi', 'Arabic', 'French', 'Spanish',
  'German', 'Portuguese', 'Bengali', 'Punjabi', 'Turkish', 'Persian',
  'Russian', 'Chinese', 'Japanese', 'Korean', 'Italian', 'Dutch',
  'Polish', 'Swedish',
];

const RECIPIENT_TYPES: { value: RecipientType; label: string }[] = [
  { value: 'principal', label: 'Principal' },
  { value: 'teacher', label: 'Class Teacher' },
  { value: 'hod', label: 'Head of Department' },
  { value: 'manager', label: 'Manager' },
  { value: 'hr', label: 'HR Manager' },
];

const LEAVE_REASONS = [
  { value: 'sick', label: 'Sick Leave' },
  { value: 'family', label: 'Family Function' },
  { value: 'personal', label: 'Personal Work' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'other', label: 'Other' },
];

type DurationType = 'full' | 'half';

export default function LeaveApplicationPage() {
  const [studentName, setStudentName] = useState('');
  const [parentGuardianName, setParentGuardianName] = useState('');
  const [className, setClassName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [recipientType, setRecipientType] = useState<RecipientType>('principal');
  const [reason, setReason] = useState('sick');
  const [customReason, setCustomReason] = useState('');
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');
  const [durationType, setDurationType] = useState<DurationType>('full');
  const [absentSinceDate, setAbsentSinceDate] = useState('');
  const [language, setLanguage] = useState<Language>('English');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!studentName.trim() || !parentGuardianName.trim() || !className.trim() || !schoolName.trim() || !startDateStr) {
      alert('Please fill in all required fields (Student Name, Parent/Guardian Name, Class, School, and Start Date).');
      return;
    }

    setIsGenerating(true);

    const finalReason = reason === 'other' ? customReason.trim() : reason;
    if (!finalReason) {
      alert('Please enter a reason for leave.');
      setIsGenerating(false);
      return;
    }

    // Convert string dates to Date objects
    // Use T00:00:00 to avoid timezone offset issues
    const startDate = new Date(startDateStr + 'T00:00:00');
    const endDate = endDateStr ? new Date(endDateStr + 'T00:00:00') : startDate;

    const resolvedDurationType: 'single' | 'range' =
      endDateStr && endDateStr !== startDateStr ? 'range' : 'single';

    const params: LetterParams = {
      studentName: studentName.trim(),
      className: className.trim(),
      schoolName: schoolName.trim(),
      recipientType,
      recipientName: '',
      reason: finalReason,
      startDate,
      endDate,
      durationType: resolvedDurationType,
      language,
      parentName: parentGuardianName.trim(),
    };

    try {
      const html = generateLeaveApplicationLetter(params);
      const text = generateLeaveApplicationText(params);
      setGeneratedLetter(html);
      setGeneratedText(text);
    } catch (e) {
      console.error('Error generating letter:', e);
      alert('Failed to generate letter. Please check your inputs and try again.');
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
      const ta = document.createElement('textarea');
      ta.value = generatedText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownloadText = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Leave_Application.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isGeneratingPdf) return;
    if (!generatedLetter) return;

    setIsGeneratingPdf(true);

    try {
      const html2pdfLib = (window as any).html2pdf;
      if (!html2pdfLib) {
        alert('PDF library not loaded. Please refresh the page and try again.');
        return;
      }

      const pdfContent = document.getElementById('leaveAppPdfContent');
      if (!pdfContent) {
        return;
      }

      await new Promise<void>((resolve, reject) => {
        try {
          html2pdfLib()
            .set({
              margin: 0.5,
              filename: 'Leave_Application.pdf',
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            })
            .from(pdfContent)
            .save()
            .then(() => resolve())
            .catch((err: any) => reject(err));
        } catch (err) {
          reject(err);
        }
      });
    } catch (e) {
      console.error('PDF generation error:', e);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleClearOutput = () => {
    setGeneratedLetter('');
    setGeneratedText('');
    setCopySuccess(false);
  };

  const isRTL = isRTLLanguage(language);

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <img src="/assets/generated/leave-icon.dim_64x64.png" alt="Leave" className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leave Application Generator</h1>
            <p className="text-muted-foreground text-sm">Generate professional leave applications in multiple languages</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Application Details</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* FIX 1 & 2: Row 1 — Student Name + Parent/Guardian Name */}
              {/* Student Name */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Student Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* FIX 1: Parent / Guardian Name — same row as Student Name */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Parent / Guardian Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={parentGuardianName}
                  onChange={e => setParentGuardianName(e.target.value)}
                  placeholder="Parent or guardian name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* FIX 2: Row 2 — School Name + Class/Grade */}
              {/* School Name */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  School / Institution Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  placeholder="e.g. Government High School"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* FIX 2: Class / Grade — moved to right of School Name */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Class / Grade <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  placeholder="e.g. Class 10-A"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* FIX 3: Recipient Type + Language on same row */}
              {/* Recipient Type */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Recipient Type <span className="text-destructive">*</span>
                </label>
                <select
                  value={recipientType}
                  onChange={e => setRecipientType(e.target.value as RecipientType)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {RECIPIENT_TYPES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* FIX 3: Language — moved to same row as Recipient Type */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value as Language)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Reason for Leave <span className="text-destructive">*</span>
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {LEAVE_REASONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {reason === 'other' && (
                  <input
                    type="text"
                    value={customReason}
                    onChange={e => setCustomReason(e.target.value)}
                    placeholder="Describe your reason..."
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                )}
              </div>

              {/* Leave Start Date */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Leave Start Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={startDateStr}
                  onChange={e => setStartDateStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Leave End Date */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Leave End Date{' '}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <input
                  type="date"
                  value={endDateStr}
                  onChange={e => setEndDateStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Leave Duration Type — untouched */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Leave Duration Type
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="durationType"
                      value="full"
                      checked={durationType === 'full'}
                      onChange={() => setDurationType('full')}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">Full Day</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="durationType"
                      value="half"
                      checked={durationType === 'half'}
                      onChange={() => setDurationType('half')}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">Half Day</span>
                  </label>
                </div>
              </div>

              {/* Absent Since (Date) — untouched */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Absent Since (Date){' '}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <input
                  type="date"
                  value={absentSinceDate}
                  onChange={e => setAbsentSinceDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-5 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Leave Application'}
            </button>
          </div>

          {/* Output Section */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-4">Application Preview</h2>

              {/* Preview Box — fixed 420px height, scrollable */}
              <div
                className="border border-border rounded-lg bg-white overflow-y-auto"
                style={{ height: '420px' }}
              >
                {generatedLetter ? (
                  <div
                    id="leaveAppPdfContent"
                    ref={previewRef}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="p-4 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: generatedLetter }}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 px-4 text-center">
                    <FileText className="w-12 h-12 opacity-30" />
                    <p className="text-sm">Fill in the details and click Generate to preview your leave application.</p>
                  </div>
                )}
              </div>

              {/* Output Buttons — visually separated from preview */}
              <div
                style={{
                  marginTop: '15px',
                  paddingTop: '10px',
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Copy */}
                <button
                  onClick={handleCopyText}
                  disabled={!generatedLetter}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Copy className="w-4 h-4" />
                  {copySuccess ? 'Copied!' : 'Copy Text'}
                </button>

                {/* Download TXT */}
                <button
                  onClick={handleDownloadText}
                  disabled={!generatedLetter}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Download TXT
                </button>

                {/* FIX 5: Download PDF — async with loading state, no freeze */}
                <button
                  id="downloadBtn"
                  onClick={handleDownloadPdf}
                  disabled={!generatedLetter || isGeneratingPdf}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
                </button>

                {/* FIX 4: Clear button — clears preview only, no page reload, no input reset */}
                <button
                  onClick={handleClearOutput}
                  disabled={!generatedLetter}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
