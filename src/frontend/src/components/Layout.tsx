import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Heart } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/assignment-format', label: 'Assignment Format' },
    { path: '/study-planner', label: 'Study Planner' },
    { path: '/notes-cleaner', label: 'Notes Cleaner' },
    { path: '/leave-application', label: 'Leave Application' },
    { path: '/resume-builder', label: 'Resume Builder' },
    { path: '/request-feature', label: 'Request Feature' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">StudentSathi</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                onClick={() => navigate({ to: link.path })}
                className="text-sm"
              >
                {link.label}
              </Button>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <nav className="flex flex-col space-y-2 mt-8">
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    variant="ghost"
                    onClick={() => navigate({ to: link.path })}
                    className="justify-start text-base"
                  >
                    {link.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/30 py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Built to make student life easier.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © 2025. Built with <Heart className="h-4 w-4 text-accent fill-accent" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
