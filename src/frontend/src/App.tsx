import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AssignmentFormatPage from './pages/AssignmentFormatPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import NotesCleanerPage from './pages/NotesCleanerPage';
import LeaveApplicationPage from './pages/LeaveApplicationPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import RequestFeaturePage from './pages/RequestFeaturePage';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const assignmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assignment-format',
  component: AssignmentFormatPage,
});

const studyPlannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/study-planner',
  component: StudyPlannerPage,
});

const notesCleanerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes-cleaner',
  component: NotesCleanerPage,
});

const leaveApplicationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leave-application',
  component: LeaveApplicationPage,
});

const resumeBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resume-builder',
  component: ResumeBuilderPage,
});

const requestFeatureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request-feature',
  component: RequestFeaturePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  assignmentRoute,
  studyPlannerRoute,
  notesCleanerRoute,
  leaveApplicationRoute,
  resumeBuilderRoute,
  requestFeatureRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
