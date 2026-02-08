import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function LeaveApplicationPage() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [application, setApplication] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!name.trim() || !date.trim() || !reason.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const letter = `Date: ${today}

To,
The Principal/Class Teacher
[School/College Name]

Subject: Application for Leave

Respected Sir/Madam,

I am ${name.trim()}, a student of your institution. I am writing to request leave from ${date.trim()}.

${reason.trim()}

I kindly request you to grant me leave for the mentioned period. I will ensure to complete all missed assignments and catch up with the coursework.

Thank you for your understanding and consideration.

Yours sincerely,
${name.trim()}`;

    setApplication(letter);
    toast.success('Leave application generated!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(application);
    setCopied(true);
    toast.success('Application copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-8 md:py-12 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Student Leave Application</h1>
        <p className="text-lg text-muted-foreground">
          Generate ready-to-use leave letters for school or college
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Enter Details</CardTitle>
            <CardDescription>Fill in your information to generate the letter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Rahul Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Leave Date/Period *</Label>
              <Input
                id="date"
                placeholder="e.g., 5th February 2025 or 5-7 February 2025"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave *</Label>
              <Textarea
                id="reason"
                placeholder="e.g., I am not feeling well and need to rest at home. / I have a family function to attend."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <Button onClick={handleGenerate} className="w-full" size="lg">
              Generate Application
            </Button>
          </CardContent>
        </Card>

        {/* Generated Letter */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Generated Letter</CardTitle>
            <CardDescription>Copy and use this letter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {application ? (
              <>
                <div className="rounded-lg bg-muted p-6 min-h-[300px]">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {application}
                  </pre>
                </div>
                <Button onClick={handleCopy} variant="secondary" className="w-full" size="lg">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-5 w-5" />
                      Copy Application
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] text-center text-muted-foreground">
                <p>Fill in the details and click "Generate Application" to create your letter</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-2 bg-accent/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Important Notes:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Remember to add your school/college name in the letter</li>
            <li>• Print the letter or write it neatly by hand</li>
            <li>• Get it signed by your parent/guardian if required</li>
            <li>• Submit it to your class teacher or principal's office</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
