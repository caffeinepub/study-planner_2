import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Copy, Check, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cleanAndFormatNotes } from '@/utils/notesCleanerFormat';
import { downloadNotesAsTxt } from '@/utils/notesCleanerTxtDownload';

export default function NotesCleanerPage() {
  const [roughNotes, setRoughNotes] = useState('');
  const [cleanedNotes, setCleanedNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [convertToBullets, setConvertToBullets] = useState(true);
  const [convertToDefinitionStyle, setConvertToDefinitionStyle] = useState(false);
  const [autoDetectHeadings, setAutoDetectHeadings] = useState(false);
  const [customFileName, setCustomFileName] = useState('');

  const hasOutput = cleanedNotes.trim() !== '';

  const handleCleanNotes = () => {
    if (!roughNotes.trim()) {
      toast.error('Please enter some notes to clean');
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      // Clear previous output before generating new one
      setCleanedNotes('');
      setCustomFileName('');
      setCopied(false);

      // Clean and format the notes using the utility
      const cleaned = cleanAndFormatNotes(
        roughNotes, 
        convertToBullets, 
        convertToDefinitionStyle,
        autoDetectHeadings
      );

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

  const handleDownload = () => {
    downloadNotesAsTxt(cleanedNotes, customFileName);
    toast.success('Notes downloaded successfully!');
  };

  const handleClearOutput = () => {
    setCleanedNotes('');
    setCustomFileName('');
    setCopied(false);
    toast.success('Output cleared');
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
            
            {/* Basic Bullet Formatting Checkbox */}
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="convert-bullets"
                checked={convertToBullets}
                onCheckedChange={(checked) => setConvertToBullets(checked === true)}
              />
              <Label
                htmlFor="convert-bullets"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Basic Bullet Formatting
              </Label>
            </div>

            {/* Definition Style Format Checkbox */}
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="convert-definition"
                checked={convertToDefinitionStyle}
                onCheckedChange={(checked) => setConvertToDefinitionStyle(checked === true)}
              />
              <Label
                htmlFor="convert-definition"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Definition Style Format
              </Label>
            </div>

            {/* Headings Auto Detect Checkbox */}
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="auto-detect-headings"
                checked={autoDetectHeadings}
                onCheckedChange={(checked) => setAutoDetectHeadings(checked === true)}
              />
              <Label
                htmlFor="auto-detect-headings"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Headings Auto Detect
              </Label>
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

            {/* Copy and Clear Output Buttons Row - Always visible */}
            <div className="flex flex-col sm:flex-row gap-3 min-h-[52px]">
              <Button
                onClick={handleCopy}
                disabled={!hasOutput}
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
                    Copy
                  </>
                )}
              </Button>

              <Button
                onClick={handleClearOutput}
                disabled={!hasOutput}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Clear Output
              </Button>
            </div>

            {/* File Name Input - Always visible */}
            <div className="space-y-2">
              <Label htmlFor="file-name">File Name</Label>
              <Input
                id="file-name"
                type="text"
                placeholder="Enter file name (optional)"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                className="font-mono text-sm"
                disabled={!hasOutput}
              />
            </div>

            {/* Download TXT Button - Always visible */}
            <Button
              onClick={handleDownload}
              disabled={!hasOutput}
              variant="default"
              className="w-full"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download TXT
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-2 bg-accent/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">How it works:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• When "Headings Auto Detect" is enabled, detects and formats topic headings: if the first line has 1-5 words with no ending punctuation, it becomes a Main Heading in Title Case; lines starting with keywords (definition, process, types, advantages, disadvantages, uses, causes, effects, importance, examples) become formatted subheadings with proper spacing</li>
            <li>• Removes extra spaces and blank lines</li>
            <li>• Treats each non-empty line as a separate note</li>
            <li>• When "Definition Style Format" is enabled, converts patterns like "Definition:", "Process:", etc. into heading label format with description on the next line</li>
            <li>• Splits paragraphs into individual sentences, with each sentence becoming one bullet point</li>
            <li>• Capitalizes the first letter of each sentence</li>
            <li>• Adds proper punctuation at the end</li>
            <li>• Converts each line to a dash bullet point ("- ") when "Basic Bullet Formatting" is enabled</li>
            <li>• Priority order: Headings Detect → Definition Style → Sentence Splitting → Bullet Formatting</li>
            <li>• Maintains original wording without merging or summarizing</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
