import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { store } from "./lib/store";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Browse } from "./pages/Browse";
import { SkillDetail } from "./pages/SkillDetail";
import { Match } from "./pages/Match";
import { Sessions } from "./pages/Sessions";
import { Profile } from "./pages/Profile";
import { Leaderboard } from "./pages/Leaderboard";
import { Certificates } from "./pages/Certificates";
import { Premium } from "./pages/Premium";
import { NotFound } from "./pages/NotFound";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", store.getTheme() === "dark");
    store.getUsers();
    store.getSessions();
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/skill/:id" element={<SkillDetail />} />
            <Route path="/match" element={<Match />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
