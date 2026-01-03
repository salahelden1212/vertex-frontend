import { Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

// Layouts (load immediately as they're needed for structure)
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Protected Route
import ProtectedRoute from './components/admin/ProtectedRoute';

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin border-t-amber-500 mx-auto"></div>
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-gray-500 mx-auto absolute top-2 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">جاري التحميل...</p>
    </div>
  </div>
);

// Lazy load Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const Packages = lazy(() => import('./pages/public/Packages'));
const Projects = lazy(() => import('./pages/public/Projects'));
const ProjectDetails = lazy(() => import('./pages/public/ProjectDetails'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Lazy load Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const PackagesManagement = lazy(() => import('./pages/admin/PackagesManagement'));
const ProjectsManagement = lazy(() => import('./pages/admin/ProjectsManagement'));
const ClientsManagement = lazy(() => import('./pages/admin/ClientsManagement'));
const PropertiesManagement = lazy(() => import('./pages/admin/PropertiesManagement'));
const PaymentsManagement = lazy(() => import('./pages/admin/PaymentsManagement'));
const ContactMessages = lazy(() => import('./pages/admin/ContactMessages'));
const SettingsManagement = lazy(() => import('./pages/admin/SettingsManagement'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const Timeline = lazy(() => import('./pages/admin/Timeline'));

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="packages" element={<Packages />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="packages" element={<PackagesManagement />} />
          <Route path="projects" element={<ProjectsManagement />} />
          <Route path="clients" element={<ClientsManagement />} />
          <Route path="properties" element={<PropertiesManagement />} />
          <Route path="payments" element={<PaymentsManagement />} />
          <Route path="messages" element={<ContactMessages />} />
          <Route path="settings" element={<SettingsManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="timeline" element={<Timeline />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
