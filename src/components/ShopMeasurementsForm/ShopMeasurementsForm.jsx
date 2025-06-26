import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitFormMutation } from "../../store/formApi";
import formConfig from "./ShopMeasurementsFormQuestion";
import logo from "../../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationMessages = {
  en: {
    answerRequired: "Please provide an answer to the question.",
    followupRequired: "Please provide a value for the follow-up question.",
    imageRequired: "Please upload at least one image or video.",
    checkboxRequired: "Please select at least one option.",
    inputRequired: "Please specify details for 'Other'.",
    submitError: "Failed to submit the form. Please try again.",
    submitSuccess: "Form submitted successfully!",
    invalidDateFormat: "Please enter a valid date (YYYY-MM-DD)",
    invalidDate: "Please enter a valid date",
    pastDate: "Date cannot be in the past",
  },
  mr: {
    answerRequired: "कृपया प्रश्नाचे उत्तर द्या.",
    followupRequired: "कृपया फॉलो-अप प्रश्नासाठी मूल्य प्रदान करा.",
    imageRequired: "कृपया किमान एक प्रतिमा किंवा व्हिडिओ अपलोड करा.",
    checkboxRequired: "कृपया किमान एक पर्याय निवडा.",
    inputRequired: "कृपया 'इतर' साठी तपशील निर्दिष्ट करा.",
    submitError: "फॉर्म सबमिट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
    submitSuccess: "फॉर्म यशस्वीपणे सबमिट झाला!",
    invalidDateFormat: "कृपया वैध तारीख प्रविष्ट करा (YYYY-MM-DD)",
    invalidDate: "कृपया वैध तारीख प्रविष्ट करा",
    pastDate: "तारीख भूतकाळातील असू शकत नाही",
  },
};

export default function ShopMeasurementsForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [language, setLanguage] = useState("mr");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitForm, { isLoading, error }] = useSubmitFormMutation();
  const totalQuestions = formConfig.fields.length;

  // Placeholder user data (replace with actual user context or state)
  const user = {
    name: "Test User",
    mobile: "1234567890",
    branch: "Test Branch",
  };

  useEffect(() => {
    const initialFormData = {};
    formConfig.fields.forEach((field) => {
      if (field.subfields) {
        field.subfields.forEach((subfield) => {
          const fieldId = `${field.id}_${subfield.id}`;
          initialFormData[fieldId] = "";
        });
      } else {
        initialFormData[field.id] = ""; // For the new "other" field
      }
    });
    setFormData(initialFormData);
  }, []);

  const validateField = (field, fieldId, value) => {
    const errors = {};
    if (field?.required && !value.trim()) {
      errors[fieldId] = validationMessages[language].answerRequired;
    } else if (
      ["length", "width", "height"].includes(fieldId.split("_").pop()) &&
      value !== ""
    ) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        errors[fieldId] = validationMessages[language].inputRequired;
      }
    } else if (field?.type === "text" && value && !/^[a-zA-Z\s]+$/.test(value.trim())) {
      errors[fieldId] = validationMessages[language].invalidDateFormat;
    }
    return errors;
  };

  const handleInputChange = (fieldId, value) => {
    const currentField = formConfig.fields[currentQuestionIndex];
    const subfield = currentField.subfields?.find((sf) => `${currentField.id}_${sf.id}` === fieldId);
    const newErrors = validateField(subfield || currentField, fieldId, value);

    setFormData((prev) => {
      const newFormData = { ...prev, [fieldId]: value };

      // Calculate total sqft when any dimension changes
      const subId = fieldId.split("_").pop();
      if (subId === "length" || subId === "width" || subId === "height") {
        const mainId = fieldId.substring(0, fieldId.lastIndexOf("_"));
        const totalSqftId = `${mainId}_total_sqft`;

        const length = parseFloat(newFormData[`${mainId}_length`]) || 0;
        const width = parseFloat(newFormData[`${mainId}_width`]) || 0;
        const height = parseFloat(newFormData[`${mainId}_height`]) || 0;

        if (length > 0 && width > 0 && height > 0) {
          newFormData[totalSqftId] = (length * width * height).toFixed(2);
        } else if (length > 0 && width > 0) {
          newFormData[totalSqftId] = (length * width).toFixed(2);
        } else if (length > 0 && height > 0) {
          newFormData[totalSqftId] = (length * height).toFixed(2);
        } else {
          newFormData[totalSqftId] = "";
        }
      }

      return newFormData;
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const handleLanguageToggle = () => {
    setLanguage(language === "mr" ? "en" : "mr");
  };

  const validateForm = () => {
    const currentField = formConfig.fields[currentQuestionIndex];
    const newErrors = {};
    if (currentField.subfields) {
      currentField.subfields.forEach((subfield) => {
        const fieldId = `${currentField.id}_${subfield.id}`;
        if (subfield.required && !formData[fieldId]?.trim()) {
          newErrors[fieldId] = validationMessages[language].answerRequired;
        } else if (
          ["length", "width", "height"].includes(subfield.id) &&
          formData[fieldId] !== ""
        ) {
          const numValue = parseFloat(formData[fieldId]);
          if (isNaN(numValue) || numValue <= 0) {
            newErrors[fieldId] = validationMessages[language].inputRequired;
          }
        }
      });
    } else if (currentField.required && !formData[currentField.id]?.trim()) {
      newErrors[currentField.id] = validationMessages[language].answerRequired;
    }
    console.log("Validation Errors:", newErrors); // Debug log
    return newErrors;
  };

  const handleNext = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      toast.error(
        Object.values(newErrors)[0] || validationMessages[language].answerRequired,
        { position: "top-right", autoClose: 3000 }
      );
      setErrors(newErrors);
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setErrors({}); // Clear errors when moving to next question
      console.log("Moving to next question:", currentQuestionIndex + 1); // Debug log
    } else {
      const formattedData = new FormData();
      formattedData.append("formId", "shop_measurements");
      formattedData.append("language", language);
      formattedData.append("name", user.name || "Test User");
      formattedData.append("mobile", user.mobile || "1234567890");
      formattedData.append("branch", user.branch || "Test Branch");
      formattedData.append("submitted_at", new Date().toISOString());

      // Structure each response as a separate FormData entry
      formConfig.fields.forEach((field, index) => {
        let answer = "No data provided";
        if (field.subfields) {
          const subfieldResponses = field.subfields.map((subfield) => {
            const fieldId = `${field.id}_${subfield.id}`;
            const subfieldLabel = subfield[`label_${language}`] || subfield.label_mr;
            const value = formData[fieldId] || "0";
            return `${subfieldLabel}: ${value.trim()}`;
          }).filter(Boolean).join(", ");
          answer = subfieldResponses
            ? `${subfieldResponses}, ${language === "mr" ? "एकूण चौरस फूट" : "Total sq ft"}: ${
                formData[`${field.id}_total_sqft`] || "0"
              }`
            : answer;
        } else {
          answer = formData[field.id] || answer;
        }
        const response = {
          questionId: `${field[`question_${language}`] || field.question_mr}_${field.id}`.replace(/\s+/g, "_"),
          questionText: field[`question_${language}`] || field.question_mr,
          answer: answer.trim(),
          images: [],
          videos: [],
        };
        formattedData.append(`response_${index}`, JSON.stringify(response));
      });

      console.log("Formatted Data being sent:", [...formattedData.entries()]); // Debug log

      try {
        const result = await submitForm(formattedData).unwrap();
        setIsSubmitted(true);
        toast.success(validationMessages[language].submitSuccess, {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/project-work-followup");
      } catch (err) {
        console.error("Submission Error:", err); // Debug log
        toast.error(
          `${validationMessages[language].submitError}: ${err?.data?.message || "Unknown error"}`,
          { position: "top-right", autoClose: 3000 }
        );
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setErrors({}); // Clear errors when moving back
      console.log("Moving to previous question:", currentQuestionIndex - 1); // Debug log
    }
  };

  const renderMeasurementField = (field) => {
    const question = field[`question_${language}`] || field.question_mr;

    return (
      <div className="mb-6">
        <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
          {question}
        </p>
        {field.subfields ? (
          <div className="flex flex-wrap gap-4">
            {field.subfields.map((subfield) => {
              if (subfield.id === "total_sqft") return null; // Don't show total_sqft as an input field

              const subfieldLabel = subfield[`label_${language}`] || subfield.label_mr;
              const fieldId = `${field.id}_${subfield.id}`;

              return (
                <div key={fieldId} className="flex flex-col min-w-[120px] flex-1">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {subfieldLabel}
                  </label>
                  <input
                    type={subfield.type === "text" ? "text" : "number"}
                    step={subfield.type === "number" ? "0.01" : undefined}
                    name={fieldId}
                    value={formData[fieldId] || ""}
                    onChange={(e) => handleInputChange(fieldId, e.target.value)}
                    placeholder={subfield[`placeholder_${language}`] || "0"}
                    className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded focus:ring-blue-500 focus:border-blue-500 ${
                      errors[fieldId] ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  />
                  {errors[fieldId] && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors[fieldId]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col">
            <textarea
              name={field.id}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field[`placeholder_${language}`] || "Enter details"}
              className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded focus:ring-blue-500 focus:border-blue-500 ${
                errors[field.id] ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors[field.id] && (
              <span className="text-red-500 text-xs mt-1">
                {errors[field.id]}
              </span>
            )}
          </div>
        )}

        {/* Display the calculated total_sqft if the field has it */}
        {field.subfields?.some((sf) => sf.id === "total_sqft") && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm font-medium text-gray-700">
              {language === "mr" ? "एकूण चौरस फूट" : "Total sq ft"}:
              <span className="ml-2 font-bold">
                {formData[`${field.id}_total_sqft`] || "0"}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
        <div className="bg-[#e3f2fd] p-4 sm:p-6 rounded-xl shadow-md border border-blue-200 w-full max-w-sm sm:max-w-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
            {language === "mr" ? "धन्यवाद!" : "Thank You!"}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
            {formConfig[`submission_message_${language}`] || validationMessages[language].submitSuccess}
          </p>
          <button
            onClick={() => navigate("/project-work-followup")}
            className="text-sm sm:text-base text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {language === "mr" ? "पुढे जा" : "Continue"}
          </button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  const currentField = formConfig.fields[currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-xl bg-[#e3f2fd] p-4 sm:p-6 rounded-xl shadow-md border border-blue-200">
        <div className="bg-white flex justify-between items-center mb-4 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="YNK Logo"
              className="h-10 w-10"
              onError={(e) => {
                console.error("Failed to load logo:", e);
                e.target.src = "https://via.placeholder.com/40";
              }}
            />
            <h1 className="text-xl font-bold">YNK</h1>
          </div>
          <button
            onClick={handleLanguageToggle}
            className="text-sm text-gray-600 underline hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
            disabled={isLoading}
            aria-label={
              language === "mr" ? "Switch to English" : "Switch to Marathi"
            }
          >
            {language === "mr" ? "English" : "मराठी"}
          </button>
        </div>

        <h2 className="text-center text-base sm:text-lg font-semibold mb-6 text-gray-800">
          {formConfig[`title_${language}`]}
        </h2>

        <div className="mb-6">{renderMeasurementField(currentField)}</div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-sm sm:text-base text-gray-500 underline disabled:text-gray-300 hover:text-blue-600"
            disabled={currentQuestionIndex === 0 || isLoading}
            aria-label={language === "mr" ? "मागे" : "Back"}
          >
            {formConfig.navigation_buttons?.[`back_${language}`] ||
              (language === "mr" ? "मागे" : "Back")}
          </button>

          <button
            onClick={handleNext}
            className={`text-sm sm:text-base text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded transition-colors ${
              currentQuestionIndex < totalQuestions - 1
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } ${isLoading || Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading || Object.keys(errors).length > 0}
            aria-label={
              currentQuestionIndex < totalQuestions - 1
                ? language === "mr"
                  ? "पुढे"
                  : "Next"
                : language === "mr"
                ? "सबमिट करा"
                : "Submit"
            }
          >
            {isLoading
              ? language === "mr"
                ? "सबमिट करत आहे..."
                : "Submitting..."
              : currentQuestionIndex < totalQuestions - 1
              ? formConfig.navigation_buttons?.[`next_${language}`] ||
                (language === "mr" ? "पुढे" : "Next")
              : formConfig[`submit_button_${language}`]}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded">
            <p className="text-red-700 text-sm sm:text-base">
              {validationMessages[language].submitError}
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}