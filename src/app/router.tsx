import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AppLayout } from "../components/layout/AppLayout";
import { AdminRoute } from "../components/route/AdminRoute";
import { ProtectedRoute } from "../components/route/ProtectedRoute";
import { routes } from "../config/routes";
import { LoginPage } from "../pages/auth/LoginPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { ClinicalEvaluationPage } from "../pages/evaluations/ClinicalEvaluationPage";
import { HistoryPage } from "../pages/history/HistoryPage";
import { PatientHistoryPage } from "../pages/history/PatientHistoryPage";
import { KnowledgeBasePage } from "../pages/knowledge/KnowledgeBasePage";
import { OwnerDetailPage } from "../pages/owners/OwnerDetailPage";
import { OwnerFormPage } from "../pages/owners/OwnerFormPage";
import { OwnersPage } from "../pages/owners/OwnersPage";
import { PatientDetailPage } from "../pages/patients/PatientDetailPage";
import { PatientFormPage } from "../pages/patients/PatientFormPage";
import { PatientsPage } from "../pages/patients/PatientsPage";
import { PlaceholderPage } from "../pages/placeholder/PlaceholderPage";
import { ResultsPage } from "../pages/results/ResultsPage";
import { RulesAdminPage } from "../pages/rules/RulesAdminPage";
import { SettingsPage } from "../pages/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: "/", element: <DashboardPage /> },
              { path: "owners", element: <OwnersPage /> },
              { path: "owners/new", element: <OwnerFormPage /> },
              { path: "owners/:ownerId/edit", element: <OwnerFormPage /> },
              { path: "owners/:ownerId", element: <OwnerDetailPage /> },
              { path: "patients", element: <PatientsPage /> },
              { path: "patients/new", element: <PatientFormPage /> },
              { path: "patients/:patientId", element: <PatientDetailPage /> },
              { path: "patients/:patientId/edit", element: <PatientFormPage /> },
              { path: "patients/:patientId/history", element: <PatientHistoryPage /> },
              { path: "evaluations", element: <ClinicalEvaluationPage /> },
              { path: "results", element: <ResultsPage /> },
              { path: "history", element: <HistoryPage /> },
              { path: "knowledge", element: <KnowledgeBasePage /> },
              {
                element: <AdminRoute />,
                children: [{ path: "rules", element: <RulesAdminPage /> }],
              },
              { path: "settings", element: <SettingsPage /> },
              ...routes
                .filter(
                  (route) =>
                    route.path !== "/" &&
                    route.path !== "/owners" &&
                    route.path !== "/patients" &&
                    route.path !== "/evaluations" &&
                    route.path !== "/results" &&
                    route.path !== "/history" &&
                    route.path !== "/knowledge" &&
                    route.path !== "/rules" &&
                    route.path !== "/settings"
                )
                .map((route) => ({
                  path: route.path.replace("/", ""),
                  element: <PlaceholderPage title={route.label} icon={route.icon} />,
                })),
            ],
          },
        ],
      },
    ],
  },
]);
