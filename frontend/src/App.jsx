import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlassLayout from "./components/GlassLayout";
import Sidebar from "./components/Sidebar";

// import pages using correct casing to match filenames
import Home from "./pages/home";
import Subjects from "./pages/subjects";
import Topics from "./pages/topics";
import Quiz from "./pages/Quiz";
import Module from "./pages/Module";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <GlassLayout>
        <Sidebar />
        <div className="glass-page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/module" element={<Module />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
          </Routes>
        </div>
      </GlassLayout>
    </BrowserRouter>
  );
}

export default App;
