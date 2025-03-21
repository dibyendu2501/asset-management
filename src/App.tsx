import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/dashboard";
import Transfer from "./components/asset-request";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: "24px", backgroundColor: "#f5f5f5" }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transfer/request" element={<Transfer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App
