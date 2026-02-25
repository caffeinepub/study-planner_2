import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Check, Download, CalendarIcon, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { formatLeaveDuration } from '@/utils/leaveApplicationDateFormat';
import { LEAVE_REASONS, LeaveReason, getReasonSentence } from '@/utils/leaveApplicationReasons';
import { generateLeaveApplicationLetter, RecipientType, DurationType, Language, isRTLLanguage } from '@/utils/leaveApplicationLetterTemplate';
import { downloadLeaveApplicationAsPDF } from '@/utils/leaveApplicationPdfExport';

export default function LeaveApplicationPage() {
  const [recipientType, setRecipientType] = useState<RecipientType>('principal');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [parentName, setParentName] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedReason, setSelectedReason] = useState<LeaveReason>('sick');
  const [customReason, setCustomReason] = useState('');
  const [medicalCertificate, setMedicalCertificate] = useState(false);
  const [durationType, setDurationType] = useState<DurationType>('full');
  const [absentSinceDate, setAbsentSinceDate] = useState<Date | undefined>();
  const [language, setLanguage] = useState<Language>('english');
  const [copied, setCopied] = useState(false);

  // Manual generation: output is only set when the button is clicked
  const [generatedLetter, setGeneratedLetter] = useState('');

  // Date picker popover open states (to allow controlled closing)
  const [leaveDateOpen, setLeaveDateOpen] = useState(false);
  const [absentSinceDateOpen, setAbsentSinceDateOpen] = useState(false);

  // Month navigation state for date pickers
  const [leaveDateMonth, setLeaveDateMonth] = useState<Date>(new Date());
  const [absentSinceDateMonth, setAbsentSinceDateMonth] = useState<Date>(new Date());

  const handleCreateApplication = () => {
    if (!name.trim() || !school.trim() || !classGrade.trim() || !parentName.trim() || !dateRange?.from) {
      toast.error('Please fill in all required fields (Name, Parent Name, School, Class, and Leave Date)');
      return;
    }

    const dateDuration = formatLeaveDuration(dateRange.from, dateRange.to);
    const reasonText = getReasonSentence(selectedReason, customReason);

    if (!reasonText.trim()) {
      toast.error('Please enter a reason for leave');
      return;
    }

    const letter = generateLeaveApplicationLetter({
      recipientType,
      name: name.trim(),
      school: school.trim(),
      classGrade: classGrade.trim(),
      parentName: parentName.trim(),
      dateDuration,
      reasonText,
      reason: selectedReason,
      medicalCertificate: selectedReason === 'sick' ? medicalCertificate : false,
      durationType,
      absentSinceDate,
      language,
    });

    setGeneratedLetter(letter);
    toast.success('Application created successfully!');
  };

  const handleCopy = () => {
    if (!generatedLetter) {
      toast.error('No application generated yet. Click "Create Application" first.');
      return;
    }
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast.success('Application copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!generatedLetter) {
      toast.error('No application generated yet. Click "Create Application" first.');
      return;
    }
    downloadLeaveApplicationAsPDF(generatedLetter, name, language);
    toast.success('Opening print dialog...');
  };

  const handleClearOutput = () => {
    setGeneratedLetter('');
    toast.success('Output cleared.');
  };

  const formatDateRangeDisplay = () => {
    if (!dateRange?.from) return 'Select date(s)';
    if (!dateRange.to || dateRange.from.toDateString() === dateRange.to.toDateString()) {
      return format(dateRange.from, 'PPP');
    }
    return `${format(dateRange.from, 'PPP')} – ${format(dateRange.to, 'PPP')}`;
  };

  const formatAbsentSinceDateDisplay = () => {
    if (!absentSinceDate) return 'Select date (optional)';
    return format(absentSinceDate, 'PPP');
  };

  const isRTL = isRTLLanguage(language);

  return (
    <div className="container py-8 md:py-12 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Professional Global Leave Application System</h1>
        <p className="text-lg text-muted-foreground">
          Create professional leave letters in 20+ languages with advanced options
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
            <CardDescription>Fill in your information and click "Create Application" to generate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* 3-column grid layout for form fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Row 1: Recipient Type | Language | Your Name */}
              <div className="space-y-1.5">
                <Label htmlFor="recipient">Recipient Type *</Label>
                <Select value={recipientType} onValueChange={(value) => setRecipientType(value as RecipientType)}>
                  <SelectTrigger id="recipient" className="w-full">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principal">Principal</SelectItem>
                    <SelectItem value="teacher">Class Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="language">Language *</Label>
                <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="urdu">Urdu</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="portuguese">Portuguese</SelectItem>
                    <SelectItem value="turkish">Turkish</SelectItem>
                    <SelectItem value="indonesian">Indonesian</SelectItem>
                    <SelectItem value="malay">Malay</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                    <SelectItem value="russian">Russian</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="dutch">Dutch</SelectItem>
                    <SelectItem value="swahili">Swahili</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Rahul Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Row 2: Parent/Guardian Name | School/College Name | Class/Grade */}
              <div className="space-y-1.5">
                <Label htmlFor="parentName">Parent / Guardian Name *</Label>
                <Input
                  id="parentName"
                  placeholder="e.g., Mr. Rajesh Kumar"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="school">School / College Name *</Label>
                <Input
                  id="school"
                  placeholder="e.g., Delhi Public School"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="class">Class / Grade *</Label>
                <Input
                  id="class"
                  placeholder="e.g., Class 10-A"
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Row 3: Leave Date(s) | Leave Duration Type | Reason for Leave */}
              <div className="space-y-1.5">
                <Label>Leave Date(s) *</Label>
                <Popover open={leaveDateOpen} onOpenChange={setLeaveDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal text-xs px-2"
                    >
                      <CalendarIcon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{formatDateRangeDisplay()}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range);
                      }}
                      month={leaveDateMonth}
                      onMonthChange={setLeaveDateMonth}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground leading-tight">
                  Single date or range
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Leave Duration Type *</Label>
                <RadioGroup value={durationType} onValueChange={(value) => setDurationType(value as DurationType)} className="pt-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="font-normal cursor-pointer text-sm">Full Day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="half" id="half" />
                    <Label htmlFor="half" className="font-normal cursor-pointer text-sm">Half Day</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reason">Reason for Leave *</Label>
                <Select value={selectedReason} onValueChange={(value) => setSelectedReason(value as LeaveReason)}>
                  <SelectTrigger id="reason" className="w-full">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Row 4: Absent Since (Date) | Medical Certificate Checkbox | empty */}
              <div className="space-y-1.5">
                <Label>Absent Since (Date)</Label>
                <Popover open={absentSinceDateOpen} onOpenChange={setAbsentSinceDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal text-xs px-2"
                    >
                      <CalendarIcon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{formatAbsentSinceDateDisplay()}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={absentSinceDate}
                      onSelect={(date) => {
                        setAbsentSinceDate(date);
                        setAbsentSinceDateOpen(false);
                      }}
                      month={absentSinceDateMonth}
                      onMonthChange={setAbsentSinceDateMonth}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground leading-tight">
                  Optional: if already absent
                </p>
              </div>

              {/* Medical Certificate Checkbox — only shown when sick is selected */}
              <div className="space-y-1.5">
                {selectedReason === 'sick' ? (
                  <>
                    <Label className="text-sm">Medical Certificate</Label>
                    <div className="flex items-start space-x-2 pt-1">
                      <Checkbox
                        id="medicalCertificate"
                        checked={medicalCertificate}
                        onCheckedChange={(checked) => setMedicalCertificate(checked === true)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="medicalCertificate" className="font-normal cursor-pointer text-xs leading-snug">
                        I will attach a medical certificate if required
                      </Label>
                    </div>
                  </>
                ) : (
                  /* Empty placeholder to maintain grid structure */
                  <div aria-hidden="true" />
                )}
              </div>

              {/* Third column of Row 4 — intentionally empty */}
              <div aria-hidden="true" />

            </div>

            {/* Custom Reason textarea — full width, shown conditionally below grid */}
            {selectedReason === 'other' && (
              <div className="space-y-1.5">
                <Label htmlFor="customReason">Custom Reason *</Label>
                <Textarea
                  id="customReason"
                  placeholder="Enter your reason for leave..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="min-h-[80px] w-full"
                  required
                />
              </div>
            )}

            {/* Create Application Button */}
            <div className="pt-1">
              <Button
                onClick={handleCreateApplication}
                className="w-full"
                size="lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                Create Application
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output / Preview Panel */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Application Preview</CardTitle>
            <CardDescription>Click "Create Application" to generate your leave letter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Preview area */}
            <div
              className="rounded-lg bg-muted p-6 min-h-[400px] max-h-[500px] overflow-y-auto"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {generatedLetter ? (
                <pre
                  className="whitespace-pre-wrap font-sans text-sm leading-relaxed"
                  style={{ textAlign: isRTL ? 'right' : 'left' }}
                >
                  {generatedLetter}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[340px] text-center text-muted-foreground px-4">
                  <div className="space-y-2">
                    <p className="text-lg font-medium">No application generated yet</p>
                    <p className="text-sm">Fill in the required fields and click "Create Application"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons - always visible, compact spacing */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleCopy}
                variant="secondary"
                className="flex-1"
                size="default"
                disabled={false}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>

              <Button
                onClick={handleDownloadPDF}
                variant="default"
                className="flex-1"
                size="default"
                disabled={false}
              >
                <Download className="mr-2 h-4 w-4" />
                Download as PDF
              </Button>

              <Button
                onClick={handleClearOutput}
                variant="outline"
                className="flex-1"
                size="default"
                disabled={false}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Output
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-2 bg-accent/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">📝 Important Notes:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All fields marked with * are required</li>
            <li>• Fill in all details and click "Create Application" to generate your letter</li>
            <li>• Choose your preferred language for the application letter</li>
            <li>• The letter will be professionally formatted and ready to submit</li>
            <li>• For sick leave, you may mention a medical certificate if applicable</li>
            <li>• Use "Absent Since" if you've already been absent and are writing retroactively</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
