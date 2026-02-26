import { BrowserRouter, Routes, Route } from "react-router-dom";

// import pages using correct casing to match filenames
import Home from "./pages/home";
import Subjects from "./pages/subjects";
import Topics from "./pages/topics";
import Quiz from "./pages/Quiz";
import Module from "./pages/Module";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/module" element={<Module />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
