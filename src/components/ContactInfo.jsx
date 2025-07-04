import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { User, Phone, Building, ChevronRight, Globe, Lock } from "lucide-react";
import logo from "../assets/logo.png";
import api from "../api/Api";
import useCurrentTime from "./hook/useCurrentTime";

const labels = {
  en: {
    title: "Enter Your Details",
    subtitle: "Please provide your information to continue",
    nameLabel: "Full Name",
    namePlaceholder: "Enter your full name",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter your mobile number",
    branchLabel: "Branch",
    branchPlaceholder: "Enter your branch location",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    reenterPasswordLabel: "Re-enter Password",
    reenterPasswordPlaceholder: "Re-enter your password",
    proceed: "Register",
    login: "Already have an account? Login",
    error: "Please fill in all fields",
    validation: {
      nameRequired: "Name is required",
      nameInvalid: "Name can only contain letters and spaces",
      mobileRequired: "Mobile number is required",
      mobileInvalid: "Please enter a valid 10-digit mobile number",
      branchRequired: "Branch is required",
      passwordRequired: "Password is required",
      passwordInvalid:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      reenterPasswordRequired: "Re-enter password is required",
      passwordsMismatch: "Passwords do not match",
    },
  },
  mr: {
    title: "तुमची माहिती प्रविष्ट करा",
    subtitle: "पुढे जाण्यासाठी कृपया तुमची माहिती द्या",
    nameLabel: "पूर्ण नाव",
    namePlaceholder: "तुमचे पूर्ण नाव प्रविष्ट करा",
    mobileLabel: "मोबाइल नंबर",
    mobilePlaceholder: "तुमचा मोबाइल नंबर प्रविष्ट करा",
    branchLabel: "शाखा",
    branchPlaceholder: "तुमची शाखा स्थान प्रविष्ट करा",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "तुमचा पासवर्ड प्रविष्ट करा",
    reenterPasswordLabel: "पासवर्ड पुन्हा प्रविष्ट करा",
    reenterPasswordPlaceholder: "पासवर्ड पुन्हा प्रविष्ट करा",
    proceed: "नोंदणी करा",
    login: "आधीपासून खाते आहे? लॉगिन करा",
    error: "कृपया सर्व फील्ड भरा",
    validation: {
      nameRequired: "नाव आवश्यक आहे",
      nameInvalid: "नावात फक्त अक्षरे आणि रिक्त जागा असू शकतात",
      mobileRequired: "मोबाइल नंबर आवश्यक आहे",
      mobileInvalid: "कृपया वैध 10-अंकी मोबाइल नंबर प्रविष्ट करा",
      branchRequired: "शाखा आवश्यक आहे",
      passwordRequired: "पासवर्ड आवश्यक आहे",
      passwordInvalid:
        "पासवर्ड कमीतकमी 8 वर्णांचा असावा आणि मोठे अक्षर, लहान अक्षर, संख्या आणि विशेष चिन्ह असणे आवश्यक आहे",
      reenterPasswordRequired: "पासवर्ड पुन्हा प्रविष्ट करणे आवश्यक आहे",
      passwordsMismatch: "पासवर्ड जुळत नाहीत",
    },
  },
};

const ContactInfo = ({ language = "en", toggleLanguage }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { formatDateTime } = useCurrentTime();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    branch: "",
    password: "",
    reenterPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = labels[currentLanguage].validation.nameRequired;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = labels[currentLanguage].validation.nameInvalid;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = labels[currentLanguage].validation.mobileRequired;
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = labels[currentLanguage].validation.mobileInvalid;
    }

    if (!formData.branch.trim()) {
      newErrors.branch = labels[currentLanguage].validation.branchRequired;
    }

    if (!formData.password.trim()) {
      newErrors.password = labels[currentLanguage].validation.passwordRequired;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password.trim()
      )
    ) {
      newErrors.password = labels[currentLanguage].validation.passwordInvalid;
    }

    if (!formData.reenterPassword.trim()) {
      newErrors.reenterPassword = labels[currentLanguage].validation.reenterPasswordRequired;
    } else if (formData.password !== formData.reenterPassword) {
      newErrors.reenterPassword = labels[currentLanguage].validation.passwordsMismatch;
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let sanitizedValue = value;
    if (name === "name") {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "mobile") {
      sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const toggleLanguageHandler = () => {
    const newLanguage = currentLanguage === "en" ? "mr" : "en";
    setCurrentLanguage(newLanguage);
    toggleLanguage(newLanguage);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("handleSubmit triggered"); // Confirm function is called
  setIsSubmitting(true);

  const validationErrors = validateForm();
  console.log("Validation errors:", validationErrors); // Log validation errors
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setIsSubmitting(false);
    return;
  }

  const cleanedData = {
    name: formData.name.trim(),
    mobile: formData.mobile.trim(),
    branch: formData.branch.trim(),
    password: formData.password.trim(),
  };


  try {
 
    const response = await api.post("/api/auth/register", cleanedData);
  

    setUser({ ...response.data.user, isAuthenticated: true });
    setIsSubmitting(false);
    alert("Registration successful! Redirecting to login..."); // Feedback
    navigate("/login");
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    }); // Log any errors
    setErrors({
      submit: error.response?.data?.message || "Failed to submit user data",
    });
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 space-y-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                <img src={logo} alt="YNK Logo" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  YNK
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">{labels[currentLanguage].title}</h1>
              <p className="text-gray-600 text-sm">{labels[currentLanguage].subtitle}</p>
              <p className="text-gray-500 text-xs">{formatDateTime(currentLanguage)}</p>
            </div>

            <button
              onClick={toggleLanguageHandler}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 bg-gray-100 hover:bg-indigo-50 rounded-full"
              type="button"
            >
              <Globe className="w-4 h-4" />
              {currentLanguage === "mr" ? "English" : "मराठी"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                {labels[currentLanguage].nameLabel}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder={labels[currentLanguage].namePlaceholder}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700">
                {labels[currentLanguage].mobileLabel}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                    errors.mobile ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder={labels[currentLanguage].mobilePlaceholder}
                  maxLength="10"
                  autoComplete="tel"
                />
              </div>
              {errors.mobile && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.mobile}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="branch" className="block text-sm font-semibold text-gray-700">
                {labels[currentLanguage].branchLabel}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="branch"
                  name="branch"
                  type="text"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                    errors.branch ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder={labels[currentLanguage].branchPlaceholder}
                  autoComplete="organization"
                />
              </div>
              {errors.branch && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.branch}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                {labels[currentLanguage].passwordLabel}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                    errors.password ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder={labels[currentLanguage].passwordPlaceholder}
                  autoComplete="new-password"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="reenterPassword" className="block text-sm font-semibold text-gray-700">
                {labels[currentLanguage].reenterPasswordLabel}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="reenterPassword"
                  name="reenterPassword"
                  type="password"
                  value={formData.reenterPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                    errors.reenterPassword ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder={labels[currentLanguage].reenterPasswordPlaceholder}
                  autoComplete="new-password"
                />
              </div>
              {errors.reenterPassword && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.reenterPassword}
                </p>
              )}
            </div>

            {errors.submit && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.submit}
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
                <>
                  {labels[currentLanguage].proceed}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            {labels[currentLanguage].login.split("Login")[0]}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer transition-all duration-200"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;