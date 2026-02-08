import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquarePlus } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitFeatureRequest } from '../hooks/useQueries';

export default function RequestFeaturePage() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const submitMutation = useSubmitFeatureRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please tell us what help you need');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        message: message.trim(),
        email: email.trim() || null,
      });

      toast.success('Thank you! Your request has been submitted.');
      setMessage('');
      setEmail('');
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Didn't find what you need?</h1>
        <p className="text-lg text-muted-foreground">
          Tell us what kind of help or tool you are looking for. If many students request it, we will add it to StudentSathi.
        </p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-6 w-6" />
            Request a New Feature
          </CardTitle>
          <CardDescription>
            This website grows based on student requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="message">What help do you need? *</Label>
              <Textarea
                id="message"
                placeholder="Describe the tool or feature you would like to see...&#10;&#10;Example: I need a tool to create flashcards for studying, or I need help with citation formatting."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Your Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll only use this to update you if we add your requested feature
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-accent/50 p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Your voice matters!</strong> We review all requests and prioritize features that help the most students.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
