import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
<Route path="/dashboard" element={<Dashboard/>} />
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>} />
        
      </Routes>
    </BrowserRouter>
  );
}