import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../features/auth/LoginPage";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import PublicOnlyRoute from "../features/auth/PublicOnlyRoute";
import RegisterPage from "../features/auth/RegisterPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import ResumeUploadPage from "../features/resume/ResumeUploadPage";
import ParsedSkillsPage from "../features/skills/ParsedSkillsPage";
import RecommendationsPage from "../features/recommendations/RecommendationsPage";
import SkillGapPage from "../features/skills/SkillGapPage";
import MarketTrendsPage from "../features/market/MarketTrendsPage";
import LearningRoadmapPage from "../features/roadmap/LearningRoadmapPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: "/dashboard", element: <DashboardPage /> },
              { path: "/resume", element: <ResumeUploadPage /> },
              { path: "/skills", element: <ParsedSkillsPage /> },
              { path: "/recommendations", element: <RecommendationsPage /> },
              { path: "/skill-gap", element: <SkillGapPage /> },
              { path: "/market-trends", element: <MarketTrendsPage /> },
              { path: "/roadmap", element: <LearningRoadmapPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
