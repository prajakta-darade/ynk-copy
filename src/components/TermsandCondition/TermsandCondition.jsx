
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitFormMutation } from "../../store/formApi";
import { useUser } from "../context/UserContext";
import { TermsandConditionQuestion as config, terms } from "./TermsandConditionQuestion";
import useCurrentTime from "../hook/useCurrentTime";
import logo from "../../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TermsandCondition() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [agreement, setAgreement] = useState(null);
  const [checkedTerms, setCheckedTerms] = useState({});
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const errorRef = useRef(null);

  const [submitForm, { isLoading, error: apiError }] = useSubmitFormMutation();
  const { formatDateTime } = useCurrentTime();

  useEffect(() => {
    if (!user || !user.isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!user.name || !user.mobile || !user.branch) {
      navigate("/contact-info");
    }
    console.log("Current user session:", user);
  }, [user, navigate]);

  const handleAgreementChange = (value) => {
    setAgreement(value);
    setError("");
  };

  const handleCheckboxChange = (id) => {
    setCheckedTerms((prev) => ({ ...prev, [id]: !prev[id] }));
    setError("");
  };

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === "en" ? "mr" : "en"));
    setError("");
  };

 const handleSubmit = async () => {
  const allChecked = terms.every((term) => checkedTerms[term.id]);
  if (!allChecked || !agreement || agreement === "no") {
    const errorMessage = language === "en" ? "Please agree to all terms." : "कृपया सर्व अटींना सहमती द्या.";
    setError(errorMessage);
    toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    errorRef.current?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const formData = new FormData();
  formData.append("formId", "terms_and_conditions");
  formData.append("language", language);
  formData.append("name", user.name || "");
  formData.append("mobile", user.mobile || "");
  formData.append("branch", user.branch || "");
  // Remove submitted_at from formData
  // formData.append("submitted_at", formatDateTime(language)); // Commented out
  Object.entries(checkedTerms).forEach(([key, value]) => {
    formData.append(`term_${key}`, value ? "yes" : "no");
  });
  formData.append("agreement", agreement);

  try {
    console.log("Submitting form data:", Object.fromEntries([...formData]));
    const result = await submitForm(formData).unwrap();
    setIsSubmitted(true);
    toast.success(
      language === "en" ? "Terms accepted successfully!" : "अटी यशस्वीपणे स्वीकारल्या!",
      { position: "top-right", autoClose: 3000 }
    );
  } catch (err) {
    const errorMessage = err?.data?.message || "Unknown error";
    console.error("Form submission error:", err.data || err.message, err.status);
    setError(errorMessage);
    toast.error(
      language === "en" ? `Error: ${errorMessage}` : `त्रुटी: ${errorMessage}`,
      { position: "top-right", autoClose: 3000 }
    );
    if (errorMessage.includes("Access denied") || errorMessage.includes("no session")) {
      navigate("/login");
    }
  }
};

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#dbeeff]">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-2">
            {language === "en" ? "Terms Accepted!" : "अटी स्वीकारल्या!"}
          </h2>
          <p className="text-gray-600 mb-4">
            {language === "en" ? "Thank you for agreeing to the terms and conditions." : "अटी आणि शर्तींना सहमती दिल्याबद्दल धन्यवाद."}
          </p>
          <p className="text-gray-500 mb-4">
            {language === "mr" ? `सबमिट केले: ${formatDateTime(language).replace("दिनांक:", "")}` : `Submitted: ${formatDateTime(language).replace("Date:", "")}`}
          </p>
          <button
            onClick={() => navigate("/shop-setup-checklist")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            {language === "en" ? "Continue" : "पुढे जा"}
          </button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#dbeeff] p-6 rounded-xl border border-blue-200">
        <div className="bg-white flex justify-between items-center mb-4 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="YNK Logo"
              className="h-10 w-10"
              onError={(e) => { console.error("Logo load error:", e); e.target.src = "https://via.placeholder.com/40"; }}
            />
            <h1 className="text-xl font-bold">YNK</h1>
          </div>
          <button
            onClick={handleLanguageToggle}
            className="text-sm text-gray-600 underline hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
            aria-label={language === "mr" ? "Switch to English" : "Switch to Marathi"}
            disabled={isLoading}
          >
            {language === "mr" ? "English" : "मराठी"}
          </button>
        </div>

        <div className="px-6 py-6 bg-[#dbeeff]">
          <h2 className="text-xl font-bold text-center text-gray-700 mb-2">{config[language].title}</h2>
          <p className="text-center text-sm text-gray-600 mb-4">
            {Object.keys(checkedTerms).length} / {terms.length} {language === "en" ? "terms accepted" : "अटी स्वीकारल्या"}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm mb-6 min-w-[400px]">
              <thead className="bg-blue-100">
                <tr>
                  {config[language].tableHeaders.map((header, idx) => (
                    <th key={idx} className="border p-2">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {terms.map((term) => (
                  <tr key={term.id}>
                    <td className="border p-2 text-center">{term.id}</td>
                    <td className="border p-2">{language === "en" ? term.description_en : term.description_mr}</td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={!!checkedTerms[term.id]}
                        onChange={() => handleCheckboxChange(term.id)}
                        className="w-4 h-4 accent-blue-600"
                        disabled={isLoading}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-6 mb-6 flex-wrap">
            <p className="text-gray-700">{config[language].question}</p>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="agreement"
                checked={agreement === "yes"}
                onChange={() => handleAgreementChange("yes")}
                disabled={isLoading}
              />
              {config[language].yes}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="agreement"
                checked={agreement === "no"}
                onChange={() => handleAgreementChange("no")}
                disabled={isLoading}
              />
              {config[language].no}
            </label>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-2 rounded text-white transition-colors duration-200 ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isLoading
                ? language === "en" ? "Submitting..." : "सबमिट करत आहे..."
                : config[language].submit}
            </button>
          </div>

          <div ref={errorRef}>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            {apiError && (
              <p className="text-red-500 mt-4 text-center">
                {language === "mr"
                  ? `त्रुटी: ${apiError?.data?.message || "Unknown error"}`
                  : `Error: ${apiError?.data?.message || "Unknown error"}`}
              </p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default TermsandCondition;