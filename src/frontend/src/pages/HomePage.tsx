import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, FileEdit, Mail, FileUser, MessageSquarePlus } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Assignment & Project Format',
      description: 'Get clear assignment structure and formatting guidelines',
      icon: FileText,
      path: '/assignment-format',
      image: '/assets/generated/assignment-icon.dim_64x64.png',
    },
    {
      title: 'Study Planner',
      description: 'Plan your daily or weekly study schedule easily',
      icon: Calendar,
      path: '/study-planner',
      image: '/assets/generated/planner-icon.dim_64x64.png',
    },
    {
      title: 'Notes Cleaner',
      description: 'Convert rough notes to clean, readable format',
      icon: FileEdit,
      path: '/notes-cleaner',
      image: '/assets/generated/notes-icon.dim_64x64.png',
    },
    {
      title: 'Leave Application',
      description: 'Generate ready-to-use leave letters for school/college',
      icon: Mail,
      path: '/leave-application',
      image: '/assets/generated/leave-icon.dim_64x64.png',
    },
    {
      title: 'Resume Builder',
      description: 'Create a simple resume for students and freshers',
      icon: FileUser,
      path: '/resume-builder',
      image: '/assets/generated/resume-icon.dim_64x64.png',
    },
    {
      title: 'Request a Feature',
      description: 'Tell us what tool you need and we will add it',
      icon: MessageSquarePlus,
      path: '/request-feature',
      image: '/assets/generated/request-icon.dim_64x64.png',
    },
  ];

  return (
    <div className="container py-8 md:py-12">
      {/* Hero Section */}
      <section className="mb-12 md:mb-16">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-full max-w-3xl">
            <img
              src="/assets/generated/hero-students.dim_800x400.png"
              alt="Students studying together"
              className="w-full h-auto rounded-2xl shadow-lg mb-8"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            StudentSathi – Simple Help for Everyday Student Work
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Assignments, study planning, notes cleaning, resumes, and student applications — all in one place.
          </p>
          <p className="text-base md:text-lg text-muted-foreground font-medium">
            No confusion. No pressure. Just simple help.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.path}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                onClick={() => navigate({ to: tool.path })}
              >
                <CardHeader>
                  <div className="mb-4 flex items-center justify-center">
                    <div className="rounded-xl bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center">{tool.title}</CardTitle>
                  <CardDescription className="text-center text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button size="lg" className="w-full max-w-xs">
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
