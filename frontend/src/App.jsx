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
import Login from "./pages/login";
import Signup from "./pages/signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from './context/UserContext';
import UserHeader from './components/UserHeader';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>  {/* Move BrowserRouter here, wrapping everything */}
        <GlassLayout>
          <Sidebar />
          <div className="glass-page" style={{ position: 'relative' }}>
            <UserHeader />
            <div style={{ marginTop: '60px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* protected routes */}
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                />
                <Route
                  path="/subjects"
                  element={<ProtectedRoute><Subjects /></ProtectedRoute>}
                />
                <Route
                  path="/topics"
                  element={<ProtectedRoute><Topics /></ProtectedRoute>}
                />
                <Route
                  path="/quiz"
                  element={<ProtectedRoute><Quiz /></ProtectedRoute>}
                />
                <Route
                  path="/module"
                  element={<ProtectedRoute><Module /></ProtectedRoute>}
                />

                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </div>
        </GlassLayout>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
