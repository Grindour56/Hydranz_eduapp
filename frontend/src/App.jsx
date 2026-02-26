import { BrowserRouter, Routes, Route } from "react-router-dom";

import Quiz from "./pages/Quiz";
import Module from "./pages/Module";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/module" element={<Module />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
