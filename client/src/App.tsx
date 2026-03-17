import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Members from "./pages/public/Members";
import Announcements from "./pages/public/Announcements";
import Events from "./pages/public/Events";
import Gallery from "./pages/public/Gallery";
import Contact from "./pages/public/Contact";
// Auth Pages
import AdminLogin from "./pages/auth/AdminLogin";
// Admin Layout & Pages
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageMembers from "./pages/admin/ManageMembers";
import AddMember from "./pages/admin/AddMember";
import EditMember from "./pages/admin/EditMember";
import Contributions from "./pages/admin/Contributions";
import FinanceReport from "./pages/admin/FinanceReport";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";
import ManageEvents from "./pages/admin/ManageEvents";
import MeetingMinutes from "./pages/admin/MeetingMinutes";
import ManageGallery from "./pages/admin/ManageGallery";
import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/members" component={Members} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/events" component={Events} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />

      {/* Auth Routes */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* Admin Routes - all wrapped with AdminLayout */}
      <Route path="/admin/dashboard" component={() => (
        <ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>
      )} />
      <Route path="/admin/members" component={() => (
        <ProtectedRoute><AdminLayout><ManageMembers /></AdminLayout></ProtectedRoute>
      )} />
      <Route path="/admin/members/add" component={() => (
        <ProtectedRoute><AdminLayout><AddMember /></AdminLayout></ProtectedRoute>
      )} />
      <Route path="/admin/members/edit/:id" component={(props: any) => (
        <ProtectedRoute><AdminLayout><EditMember memberId={parseInt(props.params?.id || '0')} /></AdminLayout></ProtectedRoute>
      )} />
      <Route path="/admin/contributions" component={() => (
        <ProtectedRoute><AdminLayout><Contributions /></AdminLayout></ProtectedRoute>
      )} />
      <Route path="/admin/finance" component={() => (
        <ProtectedRoute><AdminLayout><FinanceReport /></AdminLayout></ProtectedRoute>
      )} />
      <Route path="/admin/announcements" component={() => (
        <ProtectedRoute><AdminLayout><ManageAnnouncements /></AdminLayout></ProtectedRoute>
      )} />
      <Route path="/admin/events" component={() => (
        <ProtectedRoute><AdminLayout><ManageEvents /></AdminLayout></ProtectedRoute>
      )} />
      <Route path="/admin/minutes" component={() => (
        <ProtectedRoute><AdminLayout><MeetingMinutes /></AdminLayout></ProtectedRoute>
      )} />
      <Route path="/admin/gallery" component={() => (
        <ProtectedRoute><AdminLayout><ManageGallery /></AdminLayout></ProtectedRoute>
      )} />
      <Route path="/admin/settings" component={() => (
        <ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>
      )} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;