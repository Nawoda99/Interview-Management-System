import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/login";
import TopBar from "./pages/global/TopBar";
import Sidebar from "./pages/global/Sidebar";
import UserManagement from "./pages/Users";
import Create from "./pages/Users/create";
import InterviewSessionForm from "./pages/InterviewSessionForm";
import ViewProfile from "./pages/profileView";
import EditProfile from "./pages/profileEdit";
import ChangePassword from "./pages/changePassword";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <Router>
      <TopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/create" element={<Create />} />
        <Route path="/interview" element={<InterviewSessionForm />} />
        <Route path="/view-profile" element={<ViewProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen text-2xl font-bold">
              404 Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
