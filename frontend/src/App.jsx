import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Recommendation from "./pages/Recommendation";
import ResumeUpload from "./pages/ResumeUpload";
import SkillGap from "./pages/SkillGap";
import Trends from "./pages/Trends";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/recommendations" element={<Recommendation />} />
                <Route path="/resume" element={<ResumeUpload />} />
                <Route path="/skill-gap" element={<SkillGap />} />
                <Route path="/trends" element={<Trends />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
