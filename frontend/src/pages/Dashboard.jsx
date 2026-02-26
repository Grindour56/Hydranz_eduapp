import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Subjects from "./pages/Subjects";
import Topics from "./pages/Topics";
import Quiz from "./pages/Quiz";
import Module from "./pages/Module";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/module" element={<Module />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/progress" element={<Dashboard />} />
        <Route path="/profile" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;