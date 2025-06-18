
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/context/UserContext";
import { Lock, User, Globe } from "lucide-react";
import logo from "../assets/logo.png";

const labels = {
  en: {
    title: "Login to Your Account",
    subtitle: "Enter your credentials to access your account",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter your mobile number",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    login: "Login",
    register: "Don't have an account? Register",
    forgotPassword: "Forgot Password?",
    error: "Invalid mobile number or password",
  },
  mr: {
    title: "तुमच्या खात्यात लॉगिन करा",
    subtitle: "तुमच्या खात्यात प्रवेश करण्यासाठी तुमची क्रेडेंशियल्स प्रविष्ट करा",
    mobileLabel: "मोबाइल नंबर",
    mobilePlaceholder: "तुमचा मोबाइल नंबर प्रविष्ट करा",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "तुमचा पासवर्ड प्रविष्ट करा",
    login: "लॉगिन",
    register: "खाते नाही? नोंदणी करा",
    forgotPassword: "पासवर्ड विसरलात?",
    error: "अवैध मोबाइल नंबर किंवा पासवर्ड",
  },
};

const LoginForms = ({ language = "en", toggleLanguage }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Basic validation
    if (!mobile.trim() || !password.trim()) {
      setError(labels[language].error);
      setIsSubmitting(false);
      return;
    }

    try {
      // Replace with your actual login API call
      // Example: const response = await loginApi({ mobile, password });
      // For now, we'll simulate a successful login
      setUser({ mobile, isAuthenticated: true });
      setIsSubmitting(false);
      navigate("/dashboard");
    } catch (err) {
      setError(labels[language].error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 space-y-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
              <img src={logo} alt="YNK Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              YNK
            </h2>
            <h1 className="text-2xl font-bold text-gray-800">{labels[language].title}</h1>
            <p className="text-gray-600 text-sm">{labels[language].subtitle}</p>
            <button
              onClick={() => toggleLanguage(language === "en" ? "mr" : "en")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 bg-gray-100 hover:bg-indigo-50 rounded-full"
              type="button"
            >
              <Globe className="w-4 h-4" />
              {language === "mr" ? "English" : "मराठी"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700">
                {labels[language].mobileLabel}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                    error ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder={labels[language].mobilePlaceholder}
                  maxLength="10"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                {labels[language].passwordLabel}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                    error ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder={labels[language].passwordPlaceholder}
                  autoComplete="current-password"
                />
              </div>
              <div className="text-right">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text hover:bg-clip-text hover:text-transparent transition-all duration-200"
                >
                  {labels[language].forgotPassword}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 group disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                labels[language].login
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            {labels[language].register.split("Register")[0]}
            <span
              onClick={() => navigate("/contact-info")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text hover:bg-clip-text hover:text-transparent transition-all duration-200"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForms;
