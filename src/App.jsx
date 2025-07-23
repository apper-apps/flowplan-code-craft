import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import TasksPage from "@/components/pages/TasksPage";
import SchedulePage from "@/components/pages/SchedulePage";
import AnalyticsPage from "@/components/pages/AnalyticsPage";
import SettingsPage from "@/components/pages/SettingsPage";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-surface-gray">
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose} />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
            <Header onMobileMenuToggle={handleMobileMenuToggle} />
            
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<TasksPage />} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="!z-[9999]"
        />
      </div>
    </Router>
  );
}

export default App;