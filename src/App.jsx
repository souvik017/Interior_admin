import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppShell } from './components/layout/Shell'
import { DashboardSkeleton } from './components/feedback/Skeleton'
import { ErrorBoundary } from './components/feedback/ErrorBoundary'

// Lazy loaded page components
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('./pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
)
const RegisterPage = lazy(() =>
  import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
const SiteSettingsPage = lazy(() =>
  import('./pages/SiteSettingsPage').then((m) => ({ default: m.SiteSettingsPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ProjectStudioPage = lazy(() =>
  import('./pages/ProjectStudioPage').then((m) => ({ default: m.ProjectStudioPage })),
)
const TaskBoardPage = lazy(() =>
  import('./pages/TaskBoardPage').then((m) => ({ default: m.TaskBoardPage })),
)
const SiteManagerPage = lazy(() =>
  import('./pages/SiteManagerPage').then((m) => ({ default: m.SiteManagerPage })),
)
const RoomManagementPage = lazy(() =>
  import('./pages/RoomManagementPage').then((m) => ({ default: m.RoomManagementPage })),
)
const PurchaseApprovalPage = lazy(() =>
  import('./pages/PurchaseApprovalPage').then((m) => ({ default: m.PurchaseApprovalPage })),
)
const ProjectAnalyticsPage = lazy(() =>
  import('./pages/ProjectAnalyticsPage').then((m) => ({ default: m.ProjectAnalyticsPage })),
)
const QuotationViewPage = lazy(() =>
  import('./pages/QuotationViewPage').then((m) => ({ default: m.QuotationViewPage })),
)
const QuotationFormPage = lazy(() =>
  import('./pages/QuotationFormPage').then((m) => ({ default: m.QuotationFormPage })),
)
const QuotationPreviewPage = lazy(() =>
  import('./pages/QuotationPreviewPage').then((m) => ({ default: m.QuotationPreviewPage })),
)
const NewProjectPage = lazy(() =>
  import('./pages/NewProjectPage').then((m) => ({ default: m.NewProjectPage })),
)
const AddTaskPage = lazy(() =>
  import('./pages/AddTaskPage').then((m) => ({ default: m.AddTaskPage })),
)
const NotificationsPage = lazy(() =>
  import('./pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })),
)
const ProjectsListPage = lazy(() =>
  import('./pages/ProjectsListPage').then((m) => ({ default: m.ProjectsListPage })),
)
const ClientsPage = lazy(() =>
  import('./pages/ClientsPage').then((m) => ({ default: m.ClientsPage })),
)
const VendorsPage = lazy(() =>
  import('./pages/VendorsPage').then((m) => ({ default: m.VendorsPage })),
)
const TeamPage = lazy(() =>
  import('./pages/TeamPage').then((m) => ({ default: m.TeamPage })),
)
const CalendarPage = lazy(() =>
  import('./pages/CalendarPage').then((m) => ({ default: m.CalendarPage })),
)
const DocumentsPage = lazy(() =>
  import('./pages/DocumentsPage').then((m) => ({ default: m.DocumentsPage })),
)
const InvoicesPage = lazy(() =>
  import('./pages/InvoicesPage').then((m) => ({ default: m.InvoicesPage })),
)
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)


function ProtectedRoute({ children }) {
  const status = useSelector((state) => state.auth.status)

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ErrorBoundary>
                  <DashboardPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/new-project"
              element={
                <ErrorBoundary>
                  <NewProjectPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/add-task"
              element={
                <ErrorBoundary>
                  <AddTaskPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/project-studio"
              element={
                <ErrorBoundary>
                  <ProjectStudioPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/task-board"
              element={
                <ErrorBoundary>
                  <TaskBoardPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/site-manager"
              element={
                <ErrorBoundary>
                  <SiteManagerPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/room-management"
              element={
                <ErrorBoundary>
                  <RoomManagementPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/purchase-approval"
              element={
                <ErrorBoundary>
                  <PurchaseApprovalPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/project-analytics"
              element={
                <ErrorBoundary>
                  <ProjectAnalyticsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/quotation-view"
              element={
                <ErrorBoundary>
                  <QuotationViewPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/quotation-new"
              element={
                <ErrorBoundary>
                  <QuotationFormPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/quotation-view/:id"
              element={
                <ErrorBoundary>
                  <QuotationPreviewPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/notifications"
              element={
                <ErrorBoundary>
                  <NotificationsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/profile"
              element={
                <ErrorBoundary>
                  <ProfilePage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/site-settings"
              element={
                <ErrorBoundary>
                  <SiteSettingsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/projects"
              element={
                <ErrorBoundary>
                  <ProjectsListPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/clients"
              element={
                <ErrorBoundary>
                  <ClientsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/vendors"
              element={
                <ErrorBoundary>
                  <VendorsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/team"
              element={
                <ErrorBoundary>
                  <TeamPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/calendar"
              element={
                <ErrorBoundary>
                  <CalendarPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/documents"
              element={
                <ErrorBoundary>
                  <DocumentsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/invoices"
              element={
                <ErrorBoundary>
                  <InvoicesPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/settings"
              element={
                <ErrorBoundary>
                  <SettingsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="*"
              element={
                <ErrorBoundary>
                  <NotFoundPage />
                </ErrorBoundary>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
