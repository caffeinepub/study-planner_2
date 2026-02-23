import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Download, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { formatLeaveDuration } from '@/utils/leaveApplicationDateFormat';
import { LEAVE_REASONS, LeaveReason, getReasonSentence } from '@/utils/leaveApplicationReasons';
import { generateLeaveApplicationLetter } from '@/utils/leaveApplicationLetterTemplate';
import { downloadLeaveApplicationAsPDF } from '@/utils/leaveApplicationPdfExport';

export default function LeaveApplicationPage() {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedReason, setSelectedReason] = useState<LeaveReason>('sick');
  const [customReason, setCustomReason] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate letter in real-time
  const generatedLetter = useMemo(() => {
    // Check if all required fields are filled
    if (!name.trim() || !school.trim() || !classGrade.trim() || !dateRange?.from) {
      return '';
    }

    const dateDuration = formatLeaveDuration(dateRange.from, dateRange.to);
    const reasonText = getReasonSentence(selectedReason, customReason);

    if (!reasonText.trim()) {
      return '';
    }

    return generateLeaveApplicationLetter({
      name: name.trim(),
      school: school.trim(),
      classGrade: classGrade.trim(),
      dateDuration,
      reasonText,
    });
  }, [name, school, classGrade, dateRange, selectedReason, customReason]);

  const handleCopy = () => {
    if (!generatedLetter) {
      toast.error('Please fill in all fields first');
      return;
    }
    
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast.success('Application copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!generatedLetter) {
      toast.error('Please fill in all fields first');
      return;
    }

    downloadLeaveApplicationAsPDF(generatedLetter, name);
    toast.success('Opening print dialog...');
  };

  const formatDateRangeDisplay = () => {
    if (!dateRange?.from) return 'Select date(s)';
    
    if (!dateRange.to || dateRange.from.toDateString() === dateRange.to.toDateString()) {
      return format(dateRange.from, 'PPP');
    }
    
    return `${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}`;
  };

  return (
    <div className="container py-8 md:py-12 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Student Leave Application Generator</h1>
        <p className="text-lg text-muted-foreground">
          Smart guided tool to create professional leave letters instantly
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
            <CardDescription>Fill in your information - letter updates in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Rahul Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">School / College Name *</Label>
              <Input
                id="school"
                placeholder="e.g., Delhi Public School"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class / Grade *</Label>
              <Input
                id="class"
                placeholder="e.g., Class 10-A or B.Tech 2nd Year"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Leave Date(s) *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateRangeDisplay()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Select a single date or a date range for multiple days
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave *</Label>
              <Select value={selectedReason} onValueChange={(value) => setSelectedReason(value as LeaveReason)}>
                <SelectTrigger id="reason">
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

            {selectedReason === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="customReason">Custom Reason *</Label>
                <Textarea
                  id="customReason"
                  placeholder="Enter your reason for leave..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Preview Panel */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>Your letter updates automatically as you type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedLetter ? (
              <>
                <div className="rounded-lg bg-muted p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {generatedLetter}
                  </pre>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleCopy} 
                    variant="secondary" 
                    className="flex-1"
                    size="lg"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-5 w-5" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleDownloadPDF} 
                    variant="default"
                    className="flex-1"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download as PDF
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] text-center text-muted-foreground px-4">
                <div className="space-y-2">
                  <p className="text-lg font-medium">Fill in all required fields</p>
                  <p className="text-sm">Your leave application will appear here automatically</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-2 bg-accent/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">📝 Important Notes:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All fields marked with * are required</li>
            <li>• The letter updates automatically as you fill in the details</li>
            <li>• You can select a single date or a date range for multiple days</li>
            <li>• Print the letter or write it neatly by hand</li>
            <li>• Get it signed by your parent/guardian if required</li>
            <li>• Submit it to your class teacher or principal's office</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
