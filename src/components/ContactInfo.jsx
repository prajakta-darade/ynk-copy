import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/context/UserContext";
import { User, Phone, Building, ChevronRight, Globe } from "lucide-react";
import logo from "../assets/logo.png";

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
    proceed: "Continue",
    error: "Please fill in all fields",
    validation: {
      nameRequired: "Name is required",
      mobileRequired: "Mobile number is required",
      mobileInvalid: "Please enter a valid 10-digit mobile number",
      branchRequired: "Branch is required",
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
    proceed: "पुढे चालू ठेवा",
    error: "कृपया सर्व फील्ड भरा",
    validation: {
      nameRequired: "नाव आवश्यक आहे",
      mobileRequired: "मोबाइल नंबर आवश्यक आहे",
      mobileInvalid: "कृपया वैध 10-अंकी मोबाइल नंबर प्रविष्ट करा",
      branchRequired: "शाखा आवश्यक आहे",
    },
  },
};

const ContactInfo = ({ language = "en" }) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!user.name?.trim()) {
      newErrors.name = labels[currentLanguage].validation.nameRequired;
    }

    if (!user.mobile?.trim()) {
      newErrors.mobile = labels[currentLanguage].validation.mobileRequired;
    } else if (!/^\d{10}$/.test(user.mobile.trim())) {
      newErrors.mobile = labels[currentLanguage].validation.mobileInvalid;
    }

    if (!user.branch?.trim()) {
      newErrors.branch = labels[currentLanguage].validation.branchRequired;
    }

    return newErrors;
  };

  const handleInputChange = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: field === "mobile" ? value.replace(/\D/g, "") : value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "mr" : "en"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const cleanedUser = {
      ...user,
      name: user.name.trim(),
      mobile: user.mobile.trim(),
      branch: user.branch.trim(),
    };

    setUser(cleanedUser);

    // Simulate API call
    setTimeout(() => {
      console.log("User data:", cleanedUser);
      setIsSubmitting(false);
      navigate("/terms-and-condition");
    }, 1500);
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
                <img
                  src={logo}
                  alt="YNK Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  YNK
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">
                {labels[currentLanguage].title}
              </h1>
              <p className="text-gray-600 text-sm">
                {labels[currentLanguage].subtitle}
              </p>
            </div>

            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 bg-gray-100 hover:bg-indigo-50 rounded-full"
              type="button"
            >
              <Globe className="w-4 h-4" />
              {currentLanguage === "mr" ? "English" : "मराठी"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                {labels[currentLanguage].nameLabel}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={user.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
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
              <label
                htmlFor="mobile"
                className="block text-sm font-semibold text-gray-700"
              >
                {labels[currentLanguage].mobileLabel}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="mobile"
                  type="tel"
                  value={user.mobile || ""}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                    errors.mobile
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
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
              <label
                htmlFor="branch"
                className="block text-sm font-semibold text-gray-700"
              >
                {labels[currentLanguage].branchLabel}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="branch"
                  type="text"
                  value={user.branch || ""}
                  onChange={(e) => handleInputChange("branch", e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                    errors.branch
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
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

          <div className="flex justify-center space-x-2 pt-4">
            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
