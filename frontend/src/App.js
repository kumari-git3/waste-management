import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import WasteManagementApp from "./WasteManagementApp";
import AdminPage from "./AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPage />} />


        {/* MAIN DASHBOARD */}
        <Route path="/dashboard" element={<WasteManagementApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
