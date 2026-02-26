import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Subjects from "./pages/Subjects";
import Topics from "./pages/Topics";
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
