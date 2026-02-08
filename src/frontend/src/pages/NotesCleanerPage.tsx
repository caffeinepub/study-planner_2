import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function NotesCleanerPage() {
  const [roughNotes, setRoughNotes] = useState('');
  const [cleanedNotes, setCleanedNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCleanNotes = () => {
    if (!roughNotes.trim()) {
      toast.error('Please enter some notes to clean');
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      // Clean and format the notes
      const lines = roughNotes.split('\n');
      const cleaned = lines
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          // Capitalize first letter
          if (line.length > 0) {
            line = line.charAt(0).toUpperCase() + line.slice(1);
          }
          // Add period if missing
          if (line.length > 0 && !line.match(/[.!?]$/)) {
            line += '.';
          }
          return line;
        })
        .join('\n\n');

      setCleanedNotes(cleaned);
      setIsProcessing(false);
      toast.success('Notes cleaned successfully!');
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedNotes);
    setCopied(true);
    toast.success('Cleaned notes copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-8 md:py-12 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Notes Cleaner</h1>
        <p className="text-lg text-muted-foreground">
          Convert your rough notes into clean, readable format
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Rough Notes</CardTitle>
            <CardDescription>Paste or type your rough notes here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rough-notes">Your Notes</Label>
              <Textarea
                id="rough-notes"
                placeholder="Enter your rough notes here...&#10;&#10;Example:&#10;photosynthesis - plants make food using sunlight&#10;chlorophyll - green pigment in leaves&#10;oxygen released as byproduct"
                value={roughNotes}
                onChange={(e) => setRoughNotes(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <Button
              onClick={handleCleanNotes}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Clean Notes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Cleaned Notes</CardTitle>
            <CardDescription>Your formatted, readable notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cleaned-notes">Cleaned Output</Label>
              <Textarea
                id="cleaned-notes"
                value={cleanedNotes}
                readOnly
                placeholder="Your cleaned notes will appear here..."
                className="min-h-[300px] font-mono text-sm bg-muted"
              />
            </div>
            <Button
              onClick={handleCopy}
              disabled={!cleanedNotes}
              variant="secondary"
              className="w-full"
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
                  Copy Cleaned Notes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-2 bg-accent/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">How it works:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Removes extra spaces and blank lines</li>
            <li>• Capitalizes the first letter of each line</li>
            <li>• Adds proper punctuation</li>
            <li>• Formats text for better readability</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
