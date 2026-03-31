import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  BarChart2,
  Briefcase,
  Camera,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  FolderOpen,
  Github,
  Globe,
  GraduationCap,
  Link2,
  Linkedin,
  Loader2,
  Mail,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  User,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
type Template = "modern" | "professional" | "minimal";

interface Education {
  id: string;
  degree: string;
  institute: string;
  duration: string;
  cgpa: string;
}

interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
}

interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: string;
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  summary: string;
  education: Education[];
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  achievements: Achievement[];
  links: { linkedin: string; github: string; portfolio: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const SKILL_PCT: Record<SkillLevel, number> = {
  Beginner: 33,
  Intermediate: 66,
  Advanced: 100,
};

const EMPTY_DATA: ResumeData = {
  name: "",
  email: "",
  phone: "",
  photo: null,
  summary: "",
  education: [{ id: uid(), degree: "", institute: "", duration: "", cgpa: "" }],
  skills: [],
  experience: [],
  projects: [{ id: uid(), title: "", description: "" }],
  achievements: [],
  links: { linkedin: "", github: "", portfolio: "" },
};

// Predefined sample data — completely separate from user data
const SAMPLE_RESUME_DATA: ResumeData = {
  name: "Ahmed Raza",
  email: "ahmed.raza@email.com",
  phone: "+92-300-1234567",
  photo: null,
  summary:
    "Motivated Computer Science graduate with 2+ years of hands-on experience building scalable web applications. Passionate about clean code, user experience, and solving real-world problems through technology. Strong foundation in both frontend and backend development.",
  education: [
    {
      id: uid(),
      degree: "BS Computer Science",
      institute: "FAST University, Lahore",
      duration: "2019–2023",
      cgpa: "3.7 / 4.0",
    },
  ],
  skills: [
    { id: uid(), name: "React", level: "Advanced" },
    { id: uid(), name: "JavaScript", level: "Advanced" },
    { id: uid(), name: "TypeScript", level: "Intermediate" },
    { id: uid(), name: "Python", level: "Intermediate" },
    { id: uid(), name: "Node.js", level: "Intermediate" },
    { id: uid(), name: "SQL / PostgreSQL", level: "Beginner" },
  ],
  experience: [
    {
      id: uid(),
      company: "TechCorp Solutions",
      role: "Frontend Developer",
      duration: "Jan 2023 – Present",
      description:
        "Developed responsive web applications using React and TypeScript. Collaborated with cross-functional teams to deliver pixel-perfect interfaces and improve page load performance by 40%.",
    },
  ],
  projects: [
    {
      id: uid(),
      title: "Student Management System",
      description:
        "Built a full-stack web application for managing student records, attendance, and grades using React, Node.js, and PostgreSQL. Served 500+ active users.",
    },
    {
      id: uid(),
      title: "E-Commerce Platform",
      description:
        "Developed an online shopping platform with Stripe payment integration, real-time inventory management, and an admin dashboard.",
    },
  ],
  achievements: [
    {
      id: uid(),
      title: "Dean's List Award",
      organization: "FAST University",
      year: "2022",
    },
    {
      id: uid(),
      title: "1st Place – Hackathon",
      organization: "NUST Tech Fest",
      year: "2023",
    },
  ],
  links: {
    linkedin: "linkedin.com/in/ahmedraza",
    github: "github.com/ahmedraza",
    portfolio: "ahmedraza.dev",
  },
};

// ─── Print-based PDF download ─────────────────────────────────────────────

function downloadPDFViaPrint(): void {
  const preview = document.querySelector("#live-preview");
  if (!preview) {
    alert("Preview not found");
    return;
  }
  const originalContent = document.body.innerHTML;
  document.body.innerHTML = (preview as HTMLElement).outerHTML;
  window.print();
  document.body.innerHTML = originalContent;
  location.reload();
}

// ─── Section Card ─────────────────────────────────────────────────────────────

interface SectionCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function SectionCard({
  id,
  icon,
  title,
  open,
  onToggle,
  children,
}: SectionCardProps) {
  return (
    <div
      data-ocid={`${id}.panel`}
      className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden self-start"
    >
      <button
        data-ocid={`${id}.toggle`}
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-150 text-left"
      >
        <span className="text-primary flex-shrink-0">{icon}</span>
        <span className="font-semibold text-sm text-slate-800 flex-1">
          {title}
        </span>
        <span
          className="text-slate-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown size={16} />
        </span>
      </button>
      <div style={{ display: open ? "block" : "none" }}>
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Field Helper ─────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[13px] font-medium text-slate-600">{label}</Label>
      {children}
    </div>
  );
}

const inputCls =
  "h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 w-full";

// ─── Resume Section Helper ────────────────────────────────────────────────────

function Section({
  title,
  accent,
  children,
}: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h2
        className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${accent}`}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Resume Previews ──────────────────────────────────────────────────────────

function ModernPreview({ data }: { data: ResumeData }) {
  return (
    <div className="text-[11px] leading-relaxed">
      <div className="bg-primary rounded-lg px-4 py-4 text-primary-foreground mb-4">
        <div className="flex items-center gap-3">
          {data.photo ? (
            <img
              src={data.photo}
              alt=""
              className="w-14 h-14 rounded-full object-cover border-2 border-white/30"
            />
          ) : data.name ? (
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {data.name.charAt(0)}
            </div>
          ) : null}
          <div>
            <h1 className="text-lg font-bold leading-tight">
              {data.name || "Your Name"}
            </h1>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 opacity-90 text-[10px]">
              {data.email && (
                <span className="flex items-center gap-1">
                  <Mail size={9} />
                  {data.email}
                </span>
              )}
              {data.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={9} />
                  {data.phone}
                </span>
              )}
              {data.links.github && (
                <span className="flex items-center gap-1">
                  <Github size={9} />
                  {data.links.github}
                </span>
              )}
              {data.links.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin size={9} />
                  {data.links.linkedin}
                </span>
              )}
              {data.links.portfolio && (
                <span className="flex items-center gap-1">
                  <Globe size={9} />
                  {data.links.portfolio}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {data.summary && (
        <Section
          title="Professional Summary"
          accent="border-l-2 border-primary pl-3"
        >
          <p className="text-slate-600">{data.summary}</p>
        </Section>
      )}
      {data.skills.length > 0 && (
        <Section title="Skills" accent="border-l-2 border-primary pl-3">
          <div className="space-y-1.5">
            {data.skills.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between mb-0.5">
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <span className="text-slate-400">{s.level}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${SKILL_PCT[s.level]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
      {data.education.some((e) => e.degree) && (
        <Section title="Education" accent="border-l-2 border-primary pl-3">
          {data.education
            .filter((e) => e.degree)
            .map((e) => (
              <div key={e.id} className="mb-2">
                <p className="font-semibold text-slate-800">{e.degree}</p>
                <p className="text-slate-600">{e.institute}</p>
                <div className="flex gap-3 text-slate-400 text-[10px]">
                  {e.duration && <span>{e.duration}</span>}
                  {e.cgpa && <span>CGPA: {e.cgpa}</span>}
                </div>
              </div>
            ))}
        </Section>
      )}
      {data.experience.some((e) => e.company) && (
        <Section
          title="Work Experience"
          accent="border-l-2 border-primary pl-3"
        >
          {data.experience
            .filter((e) => e.company)
            .map((e) => (
              <div key={e.id} className="mb-2">
                <p className="font-semibold text-slate-800">{e.role}</p>
                <p className="text-slate-600">
                  {e.company} · {e.duration}
                </p>
                {e.description && (
                  <p className="text-slate-500 mt-0.5">{e.description}</p>
                )}
              </div>
            ))}
        </Section>
      )}
      {data.projects.some((p) => p.title) && (
        <Section title="Projects" accent="border-l-2 border-primary pl-3">
          {data.projects
            .filter((p) => p.title)
            .map((p) => (
              <div key={p.id} className="mb-2">
                <p className="font-semibold text-slate-800">{p.title}</p>
                {p.description && (
                  <p className="text-slate-500">{p.description}</p>
                )}
              </div>
            ))}
        </Section>
      )}
      {data.achievements.some((a) => a.title) && (
        <Section
          title="Achievements & Certifications"
          accent="border-l-2 border-primary pl-3"
        >
          {data.achievements
            .filter((a) => a.title)
            .map((a) => (
              <div key={a.id} className="mb-1 flex justify-between">
                <div>
                  <p className="font-medium text-slate-800">{a.title}</p>
                  {a.organization && (
                    <p className="text-slate-500">{a.organization}</p>
                  )}
                </div>
                {a.year && (
                  <span className="text-slate-400 shrink-0 ml-2">{a.year}</span>
                )}
              </div>
            ))}
        </Section>
      )}
    </div>
  );
}

function ProfessionalPreview({ data }: { data: ResumeData }) {
  return (
    <div className="text-[11px] leading-relaxed">
      <div className="bg-slate-800 px-4 py-4 rounded-lg text-white mb-4">
        <div className="flex items-center gap-3">
          {data.photo ? (
            <img
              src={data.photo}
              alt=""
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-600"
            />
          ) : data.name ? (
            <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-xl font-bold">
              {data.name.charAt(0)}
            </div>
          ) : null}
          <div>
            <h1 className="text-lg font-bold tracking-wide">
              {data.name || "Your Name"}
            </h1>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-slate-300 text-[10px]">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>{data.phone}</span>}
              {data.links.linkedin && <span>{data.links.linkedin}</span>}
              {data.links.github && <span>{data.links.github}</span>}
            </div>
          </div>
        </div>
      </div>

      {data.summary && (
        <Section title="PROFILE" accent="border-b border-slate-300 pb-1 mb-2">
          <p className="text-slate-600">{data.summary}</p>
        </Section>
      )}
      {data.skills.length > 0 && (
        <Section
          title="TECHNICAL SKILLS"
          accent="border-b border-slate-300 pb-1 mb-2"
        >
          <div className="space-y-1.5">
            {data.skills.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between mb-0.5">
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <span className="text-slate-400 text-[10px]">{s.level}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full">
                  <div
                    className="h-full bg-slate-700 rounded-full"
                    style={{ width: `${SKILL_PCT[s.level]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
      {data.education.some((e) => e.degree) && (
        <Section title="EDUCATION" accent="border-b border-slate-300 pb-1 mb-2">
          {data.education
            .filter((e) => e.degree)
            .map((e) => (
              <div key={e.id} className="mb-2">
                <p className="font-semibold text-slate-800">{e.degree}</p>
                <p className="text-slate-600">{e.institute}</p>
                <p className="text-slate-400 text-[10px]">
                  {e.duration}
                  {e.cgpa ? ` · CGPA: ${e.cgpa}` : ""}
                </p>
              </div>
            ))}
        </Section>
      )}
      {data.experience.some((e) => e.company) && (
        <Section
          title="EXPERIENCE"
          accent="border-b border-slate-300 pb-1 mb-2"
        >
          {data.experience
            .filter((e) => e.company)
            .map((e) => (
              <div key={e.id} className="mb-2">
                <p className="font-semibold text-slate-800">
                  {e.role} — {e.company}
                </p>
                <p className="text-slate-400 text-[10px]">{e.duration}</p>
                {e.description && (
                  <p className="text-slate-500 mt-0.5">{e.description}</p>
                )}
              </div>
            ))}
        </Section>
      )}
      {data.projects.some((p) => p.title) && (
        <Section title="PROJECTS" accent="border-b border-slate-300 pb-1 mb-2">
          {data.projects
            .filter((p) => p.title)
            .map((p) => (
              <div key={p.id} className="mb-2">
                <p className="font-semibold text-slate-800">{p.title}</p>
                {p.description && (
                  <p className="text-slate-500">{p.description}</p>
                )}
              </div>
            ))}
        </Section>
      )}
      {data.achievements.some((a) => a.title) && (
        <Section
          title="CERTIFICATIONS & ACHIEVEMENTS"
          accent="border-b border-slate-300 pb-1 mb-2"
        >
          {data.achievements
            .filter((a) => a.title)
            .map((a) => (
              <div key={a.id} className="mb-1">
                <p className="font-medium text-slate-800">
                  {a.title} {a.year ? `(${a.year})` : ""}
                </p>
                {a.organization && (
                  <p className="text-slate-500">{a.organization}</p>
                )}
              </div>
            ))}
        </Section>
      )}
    </div>
  );
}

function MinimalPreview({ data }: { data: ResumeData }) {
  return (
    <div className="text-[11px] leading-relaxed">
      <div className="text-center pb-3 border-b border-slate-200 mb-4">
        {data.photo && (
          <img
            src={data.photo}
            alt=""
            className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
          />
        )}
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {data.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-slate-500 text-[10px]">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.links.github && <span>{data.links.github}</span>}
          {data.links.portfolio && <span>{data.links.portfolio}</span>}
        </div>
      </div>

      {data.summary && (
        <Section
          title="Summary"
          accent="text-slate-900 font-semibold text-xs tracking-wide mb-1"
        >
          <p className="text-slate-600">{data.summary}</p>
        </Section>
      )}
      {data.skills.length > 0 && (
        <Section
          title="Skills"
          accent="text-slate-900 font-semibold text-xs tracking-wide mb-1"
        >
          <div className="space-y-1.5">
            {data.skills.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-slate-700">{s.name}</span>
                  <span className="text-slate-400">{s.level}</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full">
                  <div
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${SKILL_PCT[s.level]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
      {data.education.some((e) => e.degree) && (
        <Section
          title="Education"
          accent="text-slate-900 font-semibold text-xs tracking-wide mb-1"
        >
          {data.education
            .filter((e) => e.degree)
            .map((e) => (
              <div key={e.id} className="mb-2">
                <p className="font-medium text-slate-800">{e.degree}</p>
                <p className="text-slate-500">
                  {e.institute} · {e.duration}
                </p>
                {e.cgpa && (
                  <p className="text-slate-400 text-[10px]">CGPA: {e.cgpa}</p>
                )}
              </div>
            ))}
        </Section>
      )}
      {data.experience.some((e) => e.company) && (
        <Section
          title="Experience"
          accent="text-slate-900 font-semibold text-xs tracking-wide mb-1"
        >
          {data.experience
            .filter((e) => e.company)
            .map((e) => (
              <div key={e.id} className="mb-2">
                <p className="font-medium text-slate-800">{e.role}</p>
                <p className="text-slate-500">
                  {e.company} · {e.duration}
                </p>
                {e.description && (
                  <p className="text-slate-400 mt-0.5">{e.description}</p>
                )}
              </div>
            ))}
        </Section>
      )}
      {data.projects.some((p) => p.title) && (
        <Section
          title="Projects"
          accent="text-slate-900 font-semibold text-xs tracking-wide mb-1"
        >
          {data.projects
            .filter((p) => p.title)
            .map((p) => (
              <div key={p.id} className="mb-1.5">
                <p className="font-medium text-slate-800">{p.title}</p>
                {p.description && (
                  <p className="text-slate-500">{p.description}</p>
                )}
              </div>
            ))}
        </Section>
      )}
      {data.achievements.some((a) => a.title) && (
        <Section
          title="Achievements"
          accent="text-slate-900 font-semibold text-xs tracking-wide mb-1"
        >
          {data.achievements
            .filter((a) => a.title)
            .map((a) => (
              <div key={a.id} className="mb-1">
                <p className="font-medium text-slate-800">
                  {a.title} {a.year ? `· ${a.year}` : ""}
                </p>
                {a.organization && (
                  <p className="text-slate-400">{a.organization}</p>
                )}
              </div>
            ))}
        </Section>
      )}
    </div>
  );
}

function ResumePreview({
  data,
  template,
}: { data: ResumeData; template: Template }) {
  const hasContent =
    data.name ||
    data.summary ||
    data.skills.length > 0 ||
    data.education.some((e) => e.degree) ||
    data.experience.some((e) => e.company) ||
    data.projects.some((p) => p.title);

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
        <FileText size={40} strokeWidth={1} />
        <p className="text-sm">Fill in the form to see your resume</p>
      </div>
    );
  }

  if (template === "modern") return <ModernPreview data={data} />;
  if (template === "professional") return <ProfessionalPreview data={data} />;
  return <MinimalPreview data={data} />;
}

// ─── Score Modal ──────────────────────────────────────────────────────────────

function ScoreModal({
  data,
  onClose,
}: { data: ResumeData; onClose: () => void }) {
  const checks = [
    { label: "Full Name", ok: !!data.name.trim(), pts: 10 },
    { label: "Email Address", ok: !!data.email.trim(), pts: 10 },
    { label: "Professional Summary", ok: data.summary.length > 20, pts: 15 },
    { label: "At least 1 Skill", ok: data.skills.length > 0, pts: 15 },
    {
      label: "Education Details",
      ok: data.education.some((e) => e.degree.trim()),
      pts: 15,
    },
    {
      label: "Work Experience",
      ok: data.experience.some((e) => e.company.trim()),
      pts: 10,
    },
    {
      label: "Projects",
      ok: data.projects.some((p) => p.title.trim()),
      pts: 10,
    },
    {
      label: "Social Links",
      ok: !!(data.links.linkedin || data.links.github || data.links.portfolio),
      pts: 15,
    },
  ];
  const score = checks.reduce((acc, c) => acc + (c.ok ? c.pts : 0), 0);
  const missing = checks.filter((c) => !c.ok);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      data-ocid="score.modal"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Resume Score</h2>
          <button
            type="button"
            data-ocid="score.close_button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-center mb-5">
          <div className="text-5xl font-bold text-primary mb-1">
            {score}
            <span className="text-2xl text-slate-400">/100</span>
          </div>
          <p className="text-sm text-slate-500">
            {score >= 80
              ? "Excellent! Your resume is strong."
              : score >= 50
                ? "Good start. A few improvements will help."
                : "Your resume needs more content."}
          </p>
          <div className="mt-3">
            <Progress value={score} className="h-3" />
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-2 text-sm">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  c.ok
                    ? "bg-green-100 text-green-600"
                    : "bg-red-50 text-red-400"
                }`}
              >
                {c.ok ? <Check size={12} /> : <X size={12} />}
              </span>
              <span className={c.ok ? "text-slate-700" : "text-slate-400"}>
                {c.label}
              </span>
              <span className="ml-auto text-xs text-slate-400">
                +{c.pts} pts
              </span>
            </div>
          ))}
        </div>

        {missing.length > 0 && (
          <div className="bg-amber-50 rounded-lg p-3 text-sm">
            <p className="font-medium text-amber-800 mb-1">💡 Suggestions</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-700 text-xs">
              {missing.map((m) => (
                <li key={m.label}>
                  Add {m.label.toLowerCase()} to gain +{m.pts} points
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          data-ocid="score.confirm_button"
          onClick={onClose}
          className="w-full mt-4"
        >
          Got it!
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResumeBuilderPage() {
  const [data, setData] = useState<ResumeData>(EMPTY_DATA);
  const [template, setTemplate] = useState<Template>("modern");
  const [showScore, setShowScore] = useState(false);
  const [basicOpen, setBasicOpen] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [educationOpen, setEducationOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);

  // Button loading states

  const [isImproving, setIsImproving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSampling, setIsSampling] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Generic field setter
  const set = useCallback(
    <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // ── Photo upload ────────────────────────────────────────────────────────────
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("photo", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Generate Summary with AI ────────────────────────────────────────────────
  const handleGenerateSummary = () => {
    console.log("Generate Summary button working");
    const skills =
      data.skills.map((s) => s.name).join(", ") || "various technologies";
    const degree = data.education[0]?.degree || "technology";
    const summary = `A motivated ${degree} student with expertise in ${skills}. Passionate about software development with a strong academic background. Seeking opportunities to apply skills and contribute to innovative projects while growing professionally.`;
    set("summary", summary);
    setSummaryOpen(true);
    toast.success("Summary generated! Review and personalize it.");
  };

  // ── IMPROVE RESUME (fully rebuilt) ─────────────────────────────────────────
  const handleImproveResume = async () => {
    console.log("Improve Resume button working");
    if (isImproving) return;
    setIsImproving(true);

    // Simulate processing delay for feedback
    await new Promise((r) => setTimeout(r, 1000));

    setData((prev) => {
      const improved = { ...prev };

      // Improve summary — rewrite professionally with keywords
      const skillList =
        prev.skills.map((s) => s.name).join(", ") || "software development";
      if (prev.summary.trim()) {
        improved.summary = `Results-driven professional with demonstrated expertise in ${skillList}. ${prev.summary.trim()} Proven ability to deliver high-quality solutions through analytical thinking and collaborative problem-solving, consistently meeting project deadlines while maintaining code quality.`;
      } else {
        improved.summary = `Results-driven and highly motivated professional with strong expertise in ${skillList}. Adept at designing scalable solutions and collaborating cross-functionally to achieve impactful results. Eager to leverage technical proficiency and creative thinking in a dynamic, growth-oriented environment.`;
      }

      // Improve projects — prefix descriptions with action verbs if not already starting with one
      const actionVerbs = [
        "Built",
        "Developed",
        "Designed",
        "Engineered",
        "Created",
        "Implemented",
        "Launched",
        "Architected",
      ];
      improved.projects = prev.projects.map((p, i) => {
        if (!p.description.trim()) return p;
        const firstWord = p.description.trim().split(" ")[0];
        const alreadyHasVerb = actionVerbs.some(
          (v) => v.toLowerCase() === firstWord.toLowerCase(),
        );
        const verb = actionVerbs[i % actionVerbs.length];
        const newDesc = alreadyHasVerb
          ? p.description
          : `${verb} ${p.description.charAt(0).toLowerCase()}${p.description.slice(1)}`;
        return { ...p, description: newDesc };
      });

      // Improve experience — add impact phrases
      improved.experience = prev.experience.map((e) => {
        if (!e.description.trim()) return e;
        const impact =
          "Collaborated cross-functionally to improve team productivity and deliver measurable results.";
        const alreadyHasImpact =
          e.description.includes("collaborat") ||
          e.description.includes("productiv");
        return {
          ...e,
          description: alreadyHasImpact
            ? e.description
            : `${e.description.trimEnd()}. ${impact}`,
        };
      });

      return improved;
    });

    setIsImproving(false);
    toast.success("✨ Resume professionally improved!");
  };

  // ── SAMPLE RESUME — loads hardcoded demo data, clears user data ─────────────
  const handleSampleResume = async () => {
    console.log("Sample Resume button clicked");
    if (isSampling) return;
    setIsSampling(true);
    await new Promise((r) => setTimeout(r, 600));

    // Deep-clone with fresh IDs so React sees new objects
    const fresh: ResumeData = {
      ...SAMPLE_RESUME_DATA,
      education: SAMPLE_RESUME_DATA.education.map((e) => ({ ...e, id: uid() })),
      skills: SAMPLE_RESUME_DATA.skills.map((s) => ({ ...s, id: uid() })),
      experience: SAMPLE_RESUME_DATA.experience.map((e) => ({
        ...e,
        id: uid(),
      })),
      projects: SAMPLE_RESUME_DATA.projects.map((p) => ({ ...p, id: uid() })),
      achievements: SAMPLE_RESUME_DATA.achievements.map((a) => ({
        ...a,
        id: uid(),
      })),
      links: { ...SAMPLE_RESUME_DATA.links },
    };

    // Completely replace ALL state — no old data preserved
    setData(fresh);

    // Open all sections so user can see everything populated
    setBasicOpen(true);
    setSummaryOpen(true);
    setEducationOpen(true);
    setSkillsOpen(true);
    setProjectsOpen(true);
    setExperienceOpen(true);
    setAchievementsOpen(true);
    setSocialOpen(true);

    setIsSampling(false);
    toast.success("Sample resume loaded! All fields filled with demo data.");
  };

  // ── GENERATE FULL RESUME — uses ONLY current user input ─────────────────────
  const handleGenerateFullResume = async () => {
    console.log("Generate Full Resume button clicked");
    if (isGenerating) return;
    setIsGenerating(true);

    // Force DOM re-render via display trick
    const preview = document.querySelector(
      "#live-preview",
    ) as HTMLElement | null;
    if (preview) {
      preview.style.display = "none";
      await new Promise((r) => setTimeout(r, 100));
      preview.style.display = "block";
    }

    setData((prev) => {
      const updated = { ...prev };
      if (!updated.summary.trim()) {
        const skills =
          prev.skills.map((s) => s.name).join(", ") || "various technologies";
        const degree = prev.education[0]?.degree || "Computer Science";
        updated.summary = `A motivated ${degree} graduate with expertise in ${skills}. Passionate about building impactful software solutions with a strong academic and practical foundation.`;
      }
      return { ...updated };
    });

    setBasicOpen(true);
    setSummaryOpen(true);
    setEducationOpen(true);
    setSkillsOpen(true);
    setProjectsOpen(true);
    setExperienceOpen(true);
    setAchievementsOpen(true);
    setSocialOpen(true);

    setIsGenerating(false);
    toast.success("Resume generated! Preview updated on the right.");
  };

  // ── DOWNLOAD PDF — browser print method ───────────────────────────────────
  const handleDownloadPDFTop = () => {
    console.log("Download PDF clicked");
    downloadPDFViaPrint();
  };
  const handleDownloadPDFMiddle = () => {
    console.log("Download PDF clicked");
    downloadPDFViaPrint();
  };
  const handleDownloadPDFBottom = () => {
    console.log("Download PDF clicked");
    downloadPDFViaPrint();
  };

  // ── Copy resume text to clipboard ────────────────────────────────────────────
  const handleCopyResume = () => {
    console.log("Copy Resume button working");
    if (!previewRef.current) return;
    const text = previewRef.current.innerText;
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Resume copied to clipboard!"))
      .catch(() => toast.error("Could not copy. Please try manually."));
  };

  // ── List mutators ─────────────────────────────────────────────────────────────
  const addEdu = () =>
    set("education", [
      ...data.education,
      { id: uid(), degree: "", institute: "", duration: "", cgpa: "" },
    ]);
  const removeEdu = (id: string) =>
    set(
      "education",
      data.education.filter((e) => e.id !== id),
    );
  const updateEdu = (id: string, field: keyof Education, value: string) =>
    set(
      "education",
      data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );

  const addSkill = () =>
    set("skills", [
      ...data.skills,
      { id: uid(), name: "", level: "Intermediate" as SkillLevel },
    ]);
  const removeSkill = (id: string) =>
    set(
      "skills",
      data.skills.filter((s) => s.id !== id),
    );
  const updateSkill = (id: string, field: keyof Skill, value: string) =>
    set(
      "skills",
      data.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );

  const addExp = () =>
    set("experience", [
      ...data.experience,
      { id: uid(), company: "", role: "", duration: "", description: "" },
    ]);
  const removeExp = (id: string) =>
    set(
      "experience",
      data.experience.filter((e) => e.id !== id),
    );
  const updateExp = (id: string, field: keyof Experience, value: string) =>
    set(
      "experience",
      data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );

  const addProject = () =>
    set("projects", [
      ...data.projects,
      { id: uid(), title: "", description: "" },
    ]);
  const removeProject = (id: string) =>
    set(
      "projects",
      data.projects.filter((p) => p.id !== id),
    );
  const updateProject = (id: string, field: keyof Project, value: string) =>
    set(
      "projects",
      data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );

  const addAchievement = () =>
    set("achievements", [
      ...data.achievements,
      { id: uid(), title: "", organization: "", year: "" },
    ]);
  const removeAch = (id: string) =>
    set(
      "achievements",
      data.achievements.filter((a) => a.id !== id),
    );
  const updateAch = (id: string, field: keyof Achievement, value: string) =>
    set(
      "achievements",
      data.achievements.map((a) =>
        a.id === id ? { ...a, [field]: value } : a,
      ),
    );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-none">
                AI Resume Builder
              </h1>
              <p className="text-xs text-slate-400">StudentSathi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              data-ocid="resume.sample_button"
              variant="outline"
              size="sm"
              onClick={handleSampleResume}
              disabled={isSampling}
              className="text-xs"
            >
              {isSampling ? (
                <Loader2 size={13} className="mr-1 animate-spin" />
              ) : (
                <Sparkles size={13} className="mr-1" />
              )}
              {isSampling ? "Loading..." : "Sample Resume"}
            </Button>
            <Button
              data-ocid="resume.download_button"
              size="sm"
              onClick={handleDownloadPDFTop}
              className="text-xs"
            >
              <Download size={13} className="mr-1" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main 3-col grid ─────────────────────────────────────── */}
      <main className="max-w-[1400px] mx-auto px-5 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_380px] gap-6 items-start">
          {/* ── FORM GRID (spans cols 1+2) ───────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* 2-col form grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Row 1 */}
              <SectionCard
                id="basic"
                icon={<User size={16} />}
                title="Basic Information"
                open={basicOpen}
                onToggle={() => setBasicOpen((v) => !v)}
              >
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="w-14 h-14 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors overflow-hidden flex-shrink-0"
                      onClick={() => fileRef.current?.click()}
                      data-ocid="basic.upload_button"
                    >
                      {data.photo ? (
                        <img
                          src={data.photo}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera size={18} className="text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">
                        Profile photo (optional)
                      </p>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="text-xs text-primary hover:underline"
                      >
                        Upload photo
                      </button>
                      {data.photo && (
                        <button
                          type="button"
                          onClick={() => set("photo", null)}
                          className="text-xs text-red-400 hover:underline ml-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhoto}
                    />
                  </div>

                  <Field label="Full Name">
                    <Input
                      data-ocid="basic.name_input"
                      className={inputCls}
                      value={data.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Ahmed Khan"
                    />
                  </Field>
                  <Field label="Email Address">
                    <Input
                      data-ocid="basic.email_input"
                      className={inputCls}
                      type="email"
                      value={data.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="ahmed@email.com"
                    />
                  </Field>
                  <Field label="Phone Number">
                    <Input
                      data-ocid="basic.phone_input"
                      className={inputCls}
                      value={data.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+92 300 0000000"
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard
                id="summary"
                icon={<FileText size={16} />}
                title="Professional Summary"
                open={summaryOpen}
                onToggle={() => setSummaryOpen((v) => !v)}
              >
                <div className="space-y-3 mt-2">
                  <Field label="Summary">
                    <Textarea
                      data-ocid="summary.textarea"
                      className="min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 w-full"
                      value={data.summary}
                      onChange={(e) => set("summary", e.target.value)}
                      placeholder="Write a short professional summary..."
                    />
                  </Field>
                  <Button
                    data-ocid="summary.ai_button"
                    type="button"
                    size="sm"
                    onClick={handleGenerateSummary}
                    className="w-full"
                  >
                    <Sparkles size={14} className="mr-1.5" /> Generate Summary
                    with AI
                  </Button>
                </div>
              </SectionCard>

              {/* Row 2 */}
              <SectionCard
                id="education"
                icon={<GraduationCap size={16} />}
                title="Education"
                open={educationOpen}
                onToggle={() => setEducationOpen((v) => !v)}
              >
                <div className="space-y-4 mt-2">
                  {data.education.map((edu, idx) => (
                    <div
                      key={edu.id}
                      className="space-y-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-500">
                          Entry {idx + 1}
                        </p>
                        {data.education.length > 1 && (
                          <button
                            data-ocid={`education.delete_button.${idx + 1}`}
                            type="button"
                            onClick={() => removeEdu(edu.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <Field label="Degree">
                        <Input
                          className={inputCls}
                          value={edu.degree}
                          onChange={(e) =>
                            updateEdu(edu.id, "degree", e.target.value)
                          }
                          placeholder="B.Sc Computer Science"
                        />
                      </Field>
                      <Field label="Institute">
                        <Input
                          className={inputCls}
                          value={edu.institute}
                          onChange={(e) =>
                            updateEdu(edu.id, "institute", e.target.value)
                          }
                          placeholder="FAST-NUCES"
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Duration">
                          <Input
                            className={inputCls}
                            value={edu.duration}
                            onChange={(e) =>
                              updateEdu(edu.id, "duration", e.target.value)
                            }
                            placeholder="2021–2025"
                          />
                        </Field>
                        <Field label="CGPA / %">
                          <Input
                            className={inputCls}
                            value={edu.cgpa}
                            onChange={(e) =>
                              updateEdu(edu.id, "cgpa", e.target.value)
                            }
                            placeholder="3.5 / 4.0"
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                  <Button
                    data-ocid="education.add_button"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEdu}
                    className="w-full"
                  >
                    <Plus size={13} className="mr-1" /> Add Education
                  </Button>
                </div>
              </SectionCard>

              <SectionCard
                id="skills"
                icon={<Zap size={16} />}
                title="Skills"
                open={skillsOpen}
                onToggle={() => setSkillsOpen((v) => !v)}
              >
                <div className="space-y-2 mt-2">
                  {data.skills.map((skill, idx) => (
                    <div key={skill.id} className="flex gap-2 items-center">
                      <Input
                        data-ocid={`skills.input.${idx + 1}`}
                        className={`${inputCls} flex-1`}
                        value={skill.name}
                        onChange={(e) =>
                          updateSkill(skill.id, "name", e.target.value)
                        }
                        placeholder="React, Python..."
                      />
                      <select
                        data-ocid={`skills.select.${idx + 1}`}
                        value={skill.level}
                        onChange={(e) =>
                          updateSkill(skill.id, "level", e.target.value)
                        }
                        className="h-10 rounded-lg border border-slate-200 px-2 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-primary/20"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                      <button
                        data-ocid={`skills.delete_button.${idx + 1}`}
                        type="button"
                        onClick={() => removeSkill(skill.id)}
                        className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {data.skills.length === 0 && (
                    <p className="text-xs text-slate-400 py-2 text-center">
                      No skills added yet
                    </p>
                  )}
                  <Button
                    data-ocid="skills.add_button"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSkill}
                    className="w-full"
                  >
                    <Plus size={13} className="mr-1" /> Add Skill
                  </Button>
                  {data.skills.filter((s) => s.name).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {data.skills
                        .filter((s) => s.name)
                        .map((s) => (
                          <Badge
                            key={s.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {s.name} · {s.level}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Row 3 */}
              <SectionCard
                id="projects"
                icon={<FolderOpen size={16} />}
                title="Projects"
                open={projectsOpen}
                onToggle={() => setProjectsOpen((v) => !v)}
              >
                <div className="space-y-4 mt-2">
                  {data.projects.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="space-y-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-500">
                          Project {idx + 1}
                        </p>
                        <button
                          data-ocid={`projects.delete_button.${idx + 1}`}
                          type="button"
                          onClick={() => removeProject(proj.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <Field label="Project Title">
                        <Input
                          className={inputCls}
                          value={proj.title}
                          onChange={(e) =>
                            updateProject(proj.id, "title", e.target.value)
                          }
                          placeholder="My Cool Project"
                        />
                      </Field>
                      <Field label="Description">
                        <Textarea
                          className="min-h-[70px] rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none w-full focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          value={proj.description}
                          onChange={(e) =>
                            updateProject(
                              proj.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Describe what this project does..."
                        />
                      </Field>
                    </div>
                  ))}
                  {data.projects.length === 0 && (
                    <p className="text-xs text-slate-400 py-2 text-center">
                      No projects added yet
                    </p>
                  )}
                  <Button
                    data-ocid="projects.add_button"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProject}
                    className="w-full"
                  >
                    <Plus size={13} className="mr-1" /> Add Project
                  </Button>
                </div>
              </SectionCard>

              <SectionCard
                id="experience"
                icon={<Briefcase size={16} />}
                title="Work Experience"
                open={experienceOpen}
                onToggle={() => setExperienceOpen((v) => !v)}
              >
                <div className="space-y-4 mt-2">
                  {data.experience.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="space-y-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-500">
                          Experience {idx + 1}
                        </p>
                        <button
                          data-ocid={`experience.delete_button.${idx + 1}`}
                          type="button"
                          onClick={() => removeExp(exp.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <Field label="Company">
                        <Input
                          className={inputCls}
                          value={exp.company}
                          onChange={(e) =>
                            updateExp(exp.id, "company", e.target.value)
                          }
                          placeholder="TechCorp Ltd."
                        />
                      </Field>
                      <Field label="Role / Title">
                        <Input
                          className={inputCls}
                          value={exp.role}
                          onChange={(e) =>
                            updateExp(exp.id, "role", e.target.value)
                          }
                          placeholder="Frontend Developer"
                        />
                      </Field>
                      <Field label="Duration">
                        <Input
                          className={inputCls}
                          value={exp.duration}
                          onChange={(e) =>
                            updateExp(exp.id, "duration", e.target.value)
                          }
                          placeholder="Jun 2023 – Aug 2023"
                        />
                      </Field>
                      <Field label="Description">
                        <Textarea
                          className="min-h-[70px] rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none w-full focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          value={exp.description}
                          onChange={(e) =>
                            updateExp(exp.id, "description", e.target.value)
                          }
                          placeholder="What did you accomplish?"
                        />
                      </Field>
                    </div>
                  ))}
                  {data.experience.length === 0 && (
                    <p className="text-xs text-slate-400 py-2 text-center">
                      No experience added yet
                    </p>
                  )}
                  <Button
                    data-ocid="experience.add_button"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExp}
                    className="w-full"
                  >
                    <Plus size={13} className="mr-1" /> Add Experience
                  </Button>
                </div>
              </SectionCard>

              {/* Row 4 */}
              <SectionCard
                id="achievements"
                icon={<Award size={16} />}
                title="Achievements & Certifications"
                open={achievementsOpen}
                onToggle={() => setAchievementsOpen((v) => !v)}
              >
                <div className="space-y-3 mt-2">
                  {data.achievements.map((ach, idx) => (
                    <div
                      key={ach.id}
                      className="space-y-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-500">
                          Item {idx + 1}
                        </p>
                        <button
                          data-ocid={`achievements.delete_button.${idx + 1}`}
                          type="button"
                          onClick={() => removeAch(ach.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <Field label="Title">
                        <Input
                          className={inputCls}
                          value={ach.title}
                          onChange={(e) =>
                            updateAch(ach.id, "title", e.target.value)
                          }
                          placeholder="Dean's List Award"
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Organization">
                          <Input
                            className={inputCls}
                            value={ach.organization}
                            onChange={(e) =>
                              updateAch(ach.id, "organization", e.target.value)
                            }
                            placeholder="University"
                          />
                        </Field>
                        <Field label="Year">
                          <Input
                            className={inputCls}
                            value={ach.year}
                            onChange={(e) =>
                              updateAch(ach.id, "year", e.target.value)
                            }
                            placeholder="2024"
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                  {data.achievements.length === 0 && (
                    <p className="text-xs text-slate-400 py-2 text-center">
                      No achievements added yet
                    </p>
                  )}
                  <Button
                    data-ocid="achievements.add_button"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAchievement}
                    className="w-full"
                  >
                    <Plus size={13} className="mr-1" /> Add Achievement
                  </Button>
                </div>
              </SectionCard>

              <SectionCard
                id="links"
                icon={<Link2 size={16} />}
                title="Social Links"
                open={socialOpen}
                onToggle={() => setSocialOpen((v) => !v)}
              >
                <div className="space-y-3 mt-2">
                  <Field label="LinkedIn">
                    <div className="relative">
                      <Linkedin
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <Input
                        data-ocid="links.linkedin_input"
                        className={`${inputCls} pl-8`}
                        value={data.links.linkedin}
                        onChange={(e) =>
                          set("links", {
                            ...data.links,
                            linkedin: e.target.value,
                          })
                        }
                        placeholder="linkedin.com/in/yourname"
                      />
                    </div>
                  </Field>
                  <Field label="GitHub">
                    <div className="relative">
                      <Github
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <Input
                        data-ocid="links.github_input"
                        className={`${inputCls} pl-8`}
                        value={data.links.github}
                        onChange={(e) =>
                          set("links", {
                            ...data.links,
                            github: e.target.value,
                          })
                        }
                        placeholder="github.com/yourusername"
                      />
                    </div>
                  </Field>
                  <Field label="Portfolio Website">
                    <div className="relative">
                      <Globe
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <Input
                        data-ocid="links.portfolio_input"
                        className={`${inputCls} pl-8`}
                        value={data.links.portfolio}
                        onChange={(e) =>
                          set("links", {
                            ...data.links,
                            portfolio: e.target.value,
                          })
                        }
                        placeholder="yourportfolio.dev"
                      />
                    </div>
                  </Field>
                </div>
              </SectionCard>
            </div>
            {/* end 2-col form grid */}

            {/* ── Template Selector ─────────────────────────────── */}
            <div
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
              data-ocid="template.panel"
            >
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                Resume Template
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    {
                      id: "modern" as Template,
                      label: "Modern",
                      color: "bg-primary",
                      desc: "Blue accents",
                    },
                    {
                      id: "professional" as Template,
                      label: "Professional",
                      color: "bg-slate-700",
                      desc: "Dark & formal",
                    },
                    {
                      id: "minimal" as Template,
                      label: "Minimal",
                      color: "bg-slate-400",
                      desc: "Clean & simple",
                    },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    data-ocid={`template.${t.id}_button`}
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    className={`relative rounded-xl border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                      template === t.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {template === t.id && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </span>
                    )}
                    <div className={`w-8 h-1 ${t.color} rounded-full mb-2`} />
                    <p className="text-xs font-semibold text-slate-800">
                      {t.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {t.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* ── AI Actions ─────────────────────────────────────── */}
            <div
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
              data-ocid="ai.panel"
            >
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                AI Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  data-ocid="ai.generate_summary_button"
                  onClick={handleGenerateSummary}
                  className="justify-start gap-2"
                  size="sm"
                >
                  <Sparkles size={14} /> Generate Summary
                </Button>
                <Button
                  data-ocid="ai.improve_button"
                  onClick={handleImproveResume}
                  variant="secondary"
                  className="justify-start gap-2"
                  size="sm"
                  disabled={isImproving}
                >
                  {isImproving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  {isImproving ? "Improving..." : "Improve My Resume"}
                </Button>
                <Button
                  data-ocid="ai.score_button"
                  onClick={() => setShowScore(true)}
                  variant="outline"
                  className="justify-start gap-2"
                  size="sm"
                >
                  <BarChart2 size={14} /> Check Resume Score
                </Button>
              </div>
            </div>

            {/* ── Download Section ───────────────────────────────── */}
            <div
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
              data-ocid="download.panel"
            >
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                Download & Export
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  data-ocid="download.generate_button"
                  onClick={handleGenerateFullResume}
                  variant="outline"
                  className="justify-start gap-2"
                  size="sm"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <FileText size={14} />
                  )}
                  {isGenerating ? "Generating..." : "Generate Full Resume"}
                </Button>
                <Button
                  data-ocid="download.pdf_button"
                  onClick={handleDownloadPDFBottom}
                  className="justify-start gap-2"
                  size="sm"
                >
                  <Download size={14} />
                  Download PDF
                </Button>
                <Button
                  data-ocid="download.copy_button"
                  onClick={handleCopyResume}
                  variant="outline"
                  className="justify-start gap-2"
                  size="sm"
                >
                  <Copy size={14} /> Copy Resume
                </Button>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 py-2">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                caffeine.ai
              </a>
            </p>
          </div>
          {/* end form + actions col */}

          {/* ── LIVE PREVIEW (sticky col 3) ──────────────────────── */}
          <div className="lg:sticky lg:top-20">
            <div
              className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5"
              data-ocid="preview.panel"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700">
                  Live Preview
                </h2>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400">Real-time</span>
                </div>
              </div>
              {/* This div is the PDF capture target */}
              <div
                ref={previewRef}
                id="live-preview"
                className="min-h-[200px] bg-white"
              >
                <ResumePreview data={data} template={template} />
              </div>
            </div>
          </div>
        </div>
        {/* end 3-col grid */}
      </main>

      {/* ── Floating Action Buttons ─────────────────────────────── */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-40">
        <button
          data-ocid="fab.improve_button"
          type="button"
          onClick={handleImproveResume}
          disabled={isImproving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm font-medium disabled:opacity-70"
        >
          {isImproving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          {isImproving ? "Improving..." : "Improve Resume"}
        </button>
        <button
          data-ocid="fab.download_button"
          type="button"
          onClick={handleDownloadPDFMiddle}
          className="flex items-center gap-2 bg-white text-primary border-2 border-primary px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm font-medium"
        >
          <Download size={15} />
          Download PDF
        </button>
      </div>

      {/* ── Score Modal ─────────────────────────────────────────── */}
      {showScore && (
        <ScoreModal data={data} onClose={() => setShowScore(false)} />
      )}
    </div>
  );
}
