import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SetupPage from "./pages/SetupPage.jsx";
import ScorerPage from "./pages/ScorerPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import TossPage from "./pages/TossPage.jsx";
import InningsBreak from "./pages/InningsBreak.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import { useAuth } from "./context/authContext.jsx";
import { Navigate } from "react-router-dom";

export default function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex min-h-svh items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/history" /> : <Navigate to="/login" />
            }
          />
        <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <SetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/toss"
            element={
              <ProtectedRoute>
                <TossPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scorer"
            element={
              <ProtectedRoute>
                <ScorerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/innings-break"
            element={
              <ProtectedRoute>
                <InningsBreak />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
