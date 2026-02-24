import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
}

export default function ResumeBuilderPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [resume, setResume] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAddProject = () => {
    if (!projectTitle.trim() || !projectDesc.trim()) {
      toast.error('Please fill in project details');
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      title: projectTitle.trim(),
      description: projectDesc.trim(),
    };

    setProjects([...projects, newProject]);
    setProjectTitle('');
    setProjectDesc('');
    toast.success('Project added!');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleGenerate = () => {
    if (!name.trim() || !email.trim() || !education.trim() || !skills.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    let resumeText = `${name.trim().toUpperCase()}
${email.trim()} | ${phone.trim() || 'Phone Number'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EDUCATION
${education.trim()}

SKILLS
${skills.trim()}`;

    if (projects.length > 0) {
      resumeText += `\n\nPROJECTS`;
      projects.forEach((project, index) => {
        resumeText += `\n\n${index + 1}. ${project.title}
   ${project.description}`;
      });
    }

    setResume(resumeText);
    toast.success('Resume created successfully!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resume);
    setCopied(true);
    toast.success('Resume copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-8 md:py-12 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">CV / Resume Builder</h1>
        <p className="text-lg text-muted-foreground">
          This tool is for students and freshers who need a simple resume
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., priya.sharma@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="e.g., +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Education & Skills</CardTitle>
              <CardDescription>Your academic background and abilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="education">Education *</Label>
                <Textarea
                  id="education"
                  placeholder="e.g., B.Tech in Computer Science&#10;XYZ University, 2023-2027&#10;CGPA: 8.5/10"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills *</Label>
                <Textarea
                  id="skills"
                  placeholder="e.g., Python, Java, HTML/CSS, Communication, Teamwork"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Projects (Optional)</CardTitle>
              <CardDescription>Add your academic or personal projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-title">Project Title</Label>
                <Input
                  id="project-title"
                  placeholder="e.g., Student Management System"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-desc">Project Description</Label>
                <Textarea
                  id="project-desc"
                  placeholder="Brief description of the project"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <Button onClick={handleAddProject} variant="secondary" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>

              {projects.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>Added Projects:</Label>
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-start gap-2 p-3 rounded-lg border bg-muted">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{project.title}</p>
                        <p className="text-xs text-muted-foreground">{project.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProject(project.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleGenerate} className="w-full" size="lg">
            Create Resume
          </Button>
        </div>

        {/* Generated Resume */}
        <Card className="border-2 lg:sticky lg:top-20 h-fit">
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
            <CardDescription>Preview and copy your resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resume ? (
              <>
                <div className="rounded-lg bg-muted p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {resume}
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
                      Copy Resume
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] text-center text-muted-foreground">
                <p>Fill in your details and click "Create Resume" to generate your resume</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
