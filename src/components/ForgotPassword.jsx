
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Globe, Key } from "lucide-react";
import logo from "../assets/logo.png";

const labels = {
  en: {
    title: "Reset Your Password",
    subtitle: {
      step1: "Enter your mobile number to receive an OTP",
      step2: "Enter the OTP sent to your mobile number",
      step3: "Set your new password",
    },
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter your mobile number",
    otpLabel: "OTP",
    otpPlaceholder: "Enter the 6-digit OTP",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Enter your new password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your new password",
    submit: {
      step1: "Send OTP",
      step2: "Verify OTP",
      step3: "Reset Password",
    },
    backToLogin: "Back to Login",
    success: {
      step1: "OTP sent to your mobile number.",
      step2: "OTP verified successfully.",
      step3: "Password reset successfully! Redirecting to login...",
    },
    error: {
      mobile: "Please enter a valid 10-digit mobile number",
      otp: "Invalid OTP. Please try again.",
      password: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      confirmPassword: "Passwords do not match",
      generic: "An error occurred. Please try again.",
    },
  },
  mr: {
    title: "तुमचा पासवर्ड रीसेट करा",
    subtitle: {
      step1: "OTP प्राप्त करण्यासाठी तुमचा मोबाइल नंबर प्रविष्ट करा",
      step2: "तुमच्या मोबाइल नंबरवर पाठवलेला OTP प्रविष्ट करा",
      step3: "तुमचा नवीन पासवर्ड सेट करा",
    },
    mobileLabel: "मोबाइल नंबर",
    mobilePlaceholder: "तुमचा मोबाइल नंबर प्रविष्ट करा",
    otpLabel: "OTP",
    otpPlaceholder: "6-अंकी OTP प्रविष्ट करा",
    newPasswordLabel: "नवीन पासवर्ड",
    newPasswordPlaceholder: "तुमचा नवीन पासवर्ड प्रविष्ट करा",
    confirmPasswordLabel: "पासवर्डची पुष्टी करा",
    confirmPasswordPlaceholder: "नवीन पासवर्ड पुन्हा प्रविष्ट करा",
    submit: {
      step1: "OTP पाठवा",
      step2: "OTP सत्यापित करा",
      step3: "पासवर्ड रीसेट करा",
    },
    backToLogin: "लॉगिनवर परत जा",
    success: {
      step1: "OTP तुमच्या मोबाइल नंबरवर पाठवला आहे.",
      step2: "OTP यशस्वीरित्या सत्यापित झाला.",
      step3: "पासवर्ड यशस्वीरित्या रीसेट झाला! लॉगिनवर रीडायरेक्ट होत आहे...",
    },
    error: {
      mobile: "कृपया वैध 10-अंकी मोबाइल नंबर प्रविष्ट करा",
      otp: "अवैध OTP. कृपया पुन्हा प्रयत्न करा.",
      password: "पासवर्ड कमीतकमी 8 वर्णांचा असावा आणि मोठे अक्षर, लहान अक्षर, संख्या आणि विशेष चिन्ह असणे आवश्यक आहे",
      confirmPassword: "पासवर्ड जुळत नाहीत",
      generic: "एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा.",
    },
  },
};

const ForgotPassword = ({ language = "en", toggleLanguage }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateMobile = () => {
    if (!mobile.trim() || !/^\d{10}$/.test(mobile.trim())) {
      setError(labels[language].error.mobile);
      return false;
    }
    return true;
  };

  const validateOtp = () => {
    if (!otp.trim() || !/^\d{6}$/.test(otp.trim())) {
      setError(labels[language].error.otp);
      return false;
    }
    return true;
  };

  const validatePasswords = () => {
    if (
      !newPassword.trim() ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword.trim())
    ) {
      setError(labels[language].error.password);
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError(labels[language].error.confirmPassword);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    if (step === 1) {
      if (!validateMobile()) {
        setIsSubmitting(false);
        return;
      }
      try {
        // Simulate sending OTP
        // Replace with actual API: await sendOtpApi({ mobile });
        setTimeout(() => {
          setSuccess(labels[language].success.step1);
          setStep(2);
          setIsSubmitting(false);
        }, 1000);
      } catch (err) {
        setError(labels[language].error.generic);
        setIsSubmitting(false);
      }
    } else if (step === 2) {
      if (!validateOtp()) {
        setIsSubmitting(false);
        return;
      }
      try {
        // Simulate OTP verification
        // Replace with actual API: await verifyOtpApi({ mobile, otp });
        setTimeout(() => {
          setSuccess(labels[language].success.step2);
          setStep(3);
          setIsSubmitting(false);
        }, 1000);
      } catch (err) {
        setError(labels[language].error.otp);
        setIsSubmitting(false);
      }
    } else if (step === 3) {
      if (!validatePasswords()) {
        setIsSubmitting(false);
        return;
      }
      try {
        // Simulate password reset
        // Replace with actual API: await resetPasswordApi({ mobile, newPassword });
        setTimeout(() => {
          setSuccess(labels[language].success.step3);
          setIsSubmitting(false);
          setTimeout(() => navigate("/login"), 2000); // Redirect to login
        }, 1000);
      } catch (err) {
        setError(labels[language].error.generic);
        setIsSubmitting(false);
      }
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
            <p className="text-gray-600 text-sm">{labels[language].subtitle[`step${step}`]}</p>
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
            {step === 1 && (
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
            )}

            {step === 2 && (
              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
                  {labels[language].otpLabel}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                      error ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                    placeholder={labels[language].otpPlaceholder}
                    maxLength="6"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
                    {labels[language].newPasswordLabel}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                        error ? "border-red-300 bg-red-50" : "border-gray-200"
                      }`}
                      placeholder={labels[language].newPasswordPlaceholder}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                    {labels[language].confirmPasswordLabel}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 placeholder-gray-400 ${
                        error ? "border-red-300 bg-red-50" : "border-gray-200"
                      }`}
                      placeholder={labels[language].confirmPasswordPlaceholder}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                {success}
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
                labels[language].submit[`step${step}`]
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text hover:bg-clip-text hover:text-transparent transition-all duration-200"
            >
              {labels[language].backToLogin}
            </span>
          </p>

       
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
