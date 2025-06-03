import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let res;
    if (email.toLowerCase().startsWith("cand")) {
      // Candidate login
      res = await axios.post(`${API_BASE_URL}/api/candidate/login`, {
        candidateId: email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/candidate-dashboard");
    } else {
      // Admin login
      res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/admin-dashboard");
    }
  } catch (err) {
    alert("Invalid credentials");
  }
};




  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* ✅ full-screen dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>

      <div className="flex items-center justify-center min-h-screen">
        <form
          onSubmit={handleSubmit}
           className="animate-slide-in glance-effect bg-gray-900 text-green-400 rounded-xl w-96 p-10 border border-green-700 shadow-[0_0_25px_rgba(34,197,94,0.7)]"
>
          <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Login</h2>
          <input
            type="text"
            placeholder="Candidate ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-green-700 rounded-lg mb-4 bg-gray-800 text-green-300 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            required
          />
          <div className="relative mb-6">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full p-3 pr-10 border border-green-700 rounded-lg bg-gray-800 text-green-300 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
    required
  />
  <div
    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-green-400"
    onClick={() => setShowPassword((prev) => !prev)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </div>
</div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-black font-semibold p-3 rounded-lg shadow-lg hover:from-green-500 hover:to-green-400 hover:shadow-xl transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
