import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Trainings from "./AdminDashboardTabs/Trainings";
import Tests from "./AdminDashboardTabs/Tests";
import Candidate from "./AdminDashboardTabs/Candidate";



function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#111827] text-green-400">
      {/* ✅ Header navbar */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#1f2937] shadow-md border-b border-green-600">
        <h1 className="text-xl font-semibold tracking-wide">Admin Dashboard</h1>

        <nav className="flex items-center space-x-4">
  <button
    onClick={() => setActiveTab("trainings")}
    className={`px-3 py-1.5 rounded-md font-medium transition-all duration-300 text-sm shadow-md ${
      activeTab === "trainings"
        ? "bg-green-400 text-black hover:bg-green-600"
        : "bg-green-600 text-black hover:bg-green-500"
    }`}
  >
    Trainings
  </button>

  <button
    onClick={() => setActiveTab("tests")}
    className={`px-3 py-1.5 rounded-md font-medium transition-all duration-300 text-sm shadow-md ${
      activeTab === "tests"
        ? "bg-green-400 text-black hover:bg-green-600"
        : "bg-green-600 text-black hover:bg-green-500"
    }`}
  >
    Tests
  </button>

  <button
  onClick={() => setActiveTab("candidates")}
  className={`px-3 py-1.5 rounded-md font-medium transition-all duration-300 text-sm shadow-md ${
    activeTab === "candidates"
      ? "bg-green-400 text-black hover:bg-green-600"
      : "bg-green-600 text-black hover:bg-green-500"
  }`}
>
  Candidates
</button>

  <button
    onClick={handleLogout}
    className="px-3 py-1.5 rounded-md font-medium text-white bg-red-600 hover:bg-red-500 transition-all duration-300 shadow-md text-sm"
  >
    Logout
  </button>

  

</nav>

      </header>

      {/* ✅ Main content → no padding, full */}
      <main className="w-full h-full">
        {activeTab === "dashboard" && (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-base md:text-lg">
              Welcome to Admin Dashboard! Select a tab to manage.
            </p>
          </div>
        )}

        {activeTab === "trainings" && (
          <div className="w-full h-full">
            <Trainings />
          </div>
        )}

        {activeTab === "tests" && (
          <div className="w-full h-full">
            <Tests />
          </div>
        )}

        {activeTab === "candidates" && (
          <div className="w-full h-full">
            <Candidate />
          </div>
        )}


      </main>
    </div>
  );
}

export default AdminDashboard;
