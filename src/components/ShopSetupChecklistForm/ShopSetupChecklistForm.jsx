import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitFormMutation } from "../../store/formApi";
import { useUser } from "../context/UserContext";
import ShopSetupChecklistFormQuestion from "./ShopSetupChecklistFormQuestion";
import useCurrentTime from "../hook/useCurrentTime";
import logo from "../../assets/logo.png"; // Assuming you have a logo image in this path
const { formConfig, validationMessages } = ShopSetupChecklistFormQuestion;

export default function ShopSetupChecklistForm() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [language, setLanguage] = useState('en'); // डिफॉल्ट इंग्लिश
  const [formData, setFormData] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitForm, { isLoading, error: apiError }] = useSubmitFormMutation();
  const { formatDateTime } = useCurrentTime();
  const totalQuestions = formConfig.fields.length;

  // भाषा टॉगल फंक्शन
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
  };

  // वापरकर्ता माहिती गहाळ असल्यास रीडायरेक्ट करा
  useEffect(() => {
    if (!user?.name || !user?.mobile || !user?.branch) {
      navigate("/contact-info");
    }
  }, [user, navigate]);

  const validateCurrentField = (field) => {
    const newErrors = {};
    const id = field.id;

    if (field.required && (formData[id] === undefined || formData[id] === "")) {
      newErrors[id] = validationMessages[language]?.answerRequired || "उत्तर आवश्यक आहे";
    }

    if ((id === "call_date" || id === "vacate_call_date") && formData[id]) {
      const error = validateDate(formData[id]);
      if (error) newErrors[id] = error;
    }

    if (field.type === "file" && field.required && !formData[id]) {
      newErrors[id] = validationMessages[language]?.imageRequired || "प्रतिमा आवश्यक आहे";
    }

    if (field.followup && formData[id] !== undefined) {
      const followup =
        field.followup[formData[id] ? "yes" : "no"]?.fields || [];
      followup.forEach((subField) => {
        if (
          subField.required &&
          (formData[subField.id] === undefined || formData[subField.id] === "")
        ) {
          newErrors[subField.id] = validationMessages[language]?.answerRequired || "उत्तर आवश्यक आहे";
        }
        if (
          subField.type === "file" &&
          subField.required &&
          !formData[subField.id]
        ) {
          newErrors[subField.id] = validationMessages[language]?.imageRequired || "प्रतिमा आवश्यक आहे";
        }
        if (
          subField.type === "radio" &&
          subField.options &&
          formData[subField.id]
        ) {
          const selectedOption = subField.options.find(
            (opt) => opt.value === formData[subField.id]
          );
          if (selectedOption?.followup?.fields) {
            selectedOption.followup.fields.forEach((nestedField) => {
              if (
                nestedField.required &&
                (formData[nestedField.id] === undefined ||
                  formData[nestedField.id] === "")
              ) {
                newErrors[nestedField.id] =
                  validationMessages[language]?.answerRequired || "उत्तर आवश्यक आहे";
              }
              if (nestedField.type === "text" && formData[nestedField.id]) {
                const error = validateDate(formData[nestedField.id]);
                if (error) newErrors[nestedField.id] = error;
              }
            });
          }
        }
      });
    }

    return newErrors;
  };

  const validateDate = (dateStr) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return validationMessages[language]?.invalidDateFormat || "अवैध तारीख स्वरूप";
    }

    const inputDate = new Date(dateStr);
    const today = new Date("2025-06-12"); // आजची तारीख (संदर्भानुसार)
    if (isNaN(inputDate.getTime())) {
      return validationMessages[language]?.invalidDate || "अवैध तारीख";
    }

    if (inputDate < today) {
      return validationMessages[language]?.pastDate || "तारीख भूतकाळातील असू शकत नाही";
    }

    return null;
  };

  const handleYesNoChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value === "yes",
    }));
    setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const handleRadioChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const handleTextChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: validateDate(value),
    }));
  };

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [id]: file,
    }));
    setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const handleNext = async () => {
    const currentField = formConfig.fields[currentQuestionIndex];
    const validationErrors = validateCurrentField(currentField);

    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      alert(errorMessages);
      setErrors(validationErrors);
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setErrors({});
    } else {
      // सबमिशनआधी वापरकर्ता माहिती व्हॅलिडेट करा
      if (!user.name || !user.mobile || !user.branch) {
        alert(
          language === 'mr'
            ? 'वापरकर्ता माहिती अपूर्ण आहे. कृपया आपली माहिती भरा.'
            : 'User information is incomplete. Please fill in your details.'
        );
        navigate('/contact-info');
        return;
      }

      // भाषा व्हॅलिडेट करा
      if (!['en', 'mr'].includes(language)) {
        alert(
          language === 'mr'
            ? 'अवैध भाषा निवड. कृपया इंग्लिश किंवा मराठी निवडा.'
            : 'Invalid language selection. Please choose English or Marathi.'
        );
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("formId", "shop_setup_checklist");
      formDataToSend.append("language", language);
      formDataToSend.append("name", user.name);
      formDataToSend.append("mobile", user.mobile);
      formDataToSend.append("branch", user.branch);

      formConfig.fields.forEach((field) => {
        const question = field[`question_${language}`] || field.question_mr || field.question_en;
        const id = field.id;

        if (field.type === "yesno") {
          const answer =
            formData[id] === true
              ? language === "mr"
                ? "होय"
                : "Yes"
              : formData[id] === false
              ? language === "mr"
                ? "नाही"
                : "No"
              : language === "mr"
              ? "उत्तर दिले नाही"
              : "Not answered";
          formDataToSend.append(question, answer);

          if (formData[id] !== undefined && field.followup) {
            const followup = field.followup[formData[id] ? "yes" : "no"];
            if (followup?.fields) {
              followup.fields.forEach((subField) => {
                const subQuestion =
                  subField[`question_${language}`] || subField.question_mr || subField.question_en;
                if (subField.type === "text" || subField.type === "radio") {
                  formDataToSend.append(
                    `${question} - ${subQuestion}`,
                    formData[subField.id] || "Not provided"
                  );
                } else if (subField.type === "file" && formData[subField.id]) {
                  formDataToSend.append(
                    `media[${question} - ${subQuestion}]`,
                    formData[subField.id],
                    formData[subField.id].name
                  );
                }
                if (
                  subField.type === "radio" &&
                  subField.options &&
                  formData[subField.id]
                ) {
                  const selectedOption = subField.options.find(
                    (opt) => opt.value === formData[subField.id]
                  );
                  if (selectedOption?.followup?.fields) {
                    selectedOption.followup.fields.forEach((nestedField) => {
                      const nestedQuestion =
                        nestedField[`question_${language}`] ||
                        nestedField.question_mr || nestedField.question_en;
                      formDataToSend.append(
                        `${question} - ${subQuestion} - ${nestedQuestion}`,
                        formData[nestedField.id] || "Not provided"
                      );
                    });
                  }
                }
              });
            }
          }
        } else if (field.type === "radio") {
          formDataToSend.append(
            question,
            formData[id] ||
              (language === "mr" ? "उत्तर दिले नाही" : "Not answered")
          );
          if (formData[id] && field.followup) {
            const selectedOption = field.options.find(
              (opt) => opt.value === formData[id]
            );
            if (selectedOption?.followup?.fields) {
              selectedOption.followup.fields.forEach((subField) => {
                const subQuestion =
                  subField[`question_${language}`] || subField.question_mr || subField.question_en;
                formDataToSend.append(
                  `${question} - ${subQuestion}`,
                  formData[subField.id] || "Not provided"
                );
              });
            }
          }
        } else if (field.type === "text") {
          formDataToSend.append(
            question,
            formData[id] ||
              (language === "mr" ? "उत्तर दिले नाही" : "Not answered")
          );
        } else if (field.type === "file" && formData[id]) {
          formDataToSend.append(
            `media[${question}]`,
            formData[id],
            formData[id].name
          );
        }
      });

      // डीबगिंगसाठी FormData लॉग करा
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }

      try {
        const response = await submitForm(formDataToSend).unwrap();
        console.log('फॉर्म सबमिशन यशस्वी:', response);
        setIsSubmitted(true);
      } catch (err) {
        console.error('सबमिशन एरर:', err);
        alert(
          language === "mr"
            ? `फॉर्म सबमिट करण्यात त्रुटी: ${err?.data?.message || "अज्ञात त्रुटी"}`
            : `Error submitting form: ${err?.data?.message || "Unknown error"}`
        );
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setErrors({});
    }
  };

  const renderField = (field) => {
    const question = field[`question_${language}`] || field.question_mr || field.question_en || "प्रश्न सापडला नाही";
    const id = field.id;

    return (
      <div key={id} className="mb-6">
        <h3 className="text-lg font-medium text-left text-gray-800 mb-2">
          {question}
        </h3>
        {field.type === "yesno" && (
          <div className="flex flex-col space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name={id}
                checked={formData[id] === true}
                onChange={() => handleYesNoChange(id, "yes")}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                disabled={isLoading}
                aria-label={`${question} - Yes`}
              />
              <span
                className={`text-base ${
                  formData[id] === true
                    ? "text-gray-800 font-medium"
                    : "text-gray-600"
                }`}
              >
                {language === "mr" ? "होय" : "Yes"}
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name={id}
                checked={formData[id] === false}
                onChange={() => handleYesNoChange(id, "no")}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                disabled={isLoading}
                aria-label={`${question} - No`}
              />
              <span
                className={`text-base ${
                  formData[id] === false
                    ? "text-gray-800 font-medium"
                    : "text-gray-600"
                }`}
              >
                {language === "mr" ? "नाही" : "No"}
              </span>
            </label>
          </div>
        )}

        {field.type === "radio" && (
          <div className="flex flex-col space-y-4">
            {field.options?.map((option) => (
              <label key={option.value} className="flex cursor-pointer">
                <div className="flex items-center px-4 py-2 rounded-lg transition-all">
                  <input
                    type="radio"
                    name={id}
                    checked={formData[id] === option.value}
                    onChange={() => handleRadioChange(id, option.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={isLoading}
                    aria-label={`${question} - ${
                      option[`label_${language}`] || option.label_mr || option.label_en
                    }`}
                  />
                  <span
                    className={`ml-2 text-base ${
                      formData[id] === option.value
                        ? "text-gray-700 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {option[`label_${language}`] || option.label_mr || option.label_en}
                  </span>
                </div>
                {formData[id] === option.value && option.followup && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 w-full">
                    {option.followup.fields?.map((subField) =>
                      renderField(subField)
                    )}
                  </div>
                )}
              </label>
            ))}
          </div>
        )}

        {field.type === "text" && (
          <div>
            <input
              type="text"
              name={id}
              placeholder={
                field[`placeholder_${language}`] || field.placeholder_mr || field.placeholder_en || "मजकूर प्रविष्ट करा"
              }
              value={formData[id] || ""}
              onChange={(e) => handleTextChange(id, e.target.value)}
              className={`w-full border-2 rounded-lg p-3 transition-colors ${
                errors[id]
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              disabled={isLoading}
              aria-label={question}
            />
           
          </div>
        )}
{field.type === "file" && (
        <div className="mb-4">
         
          <input
            type="file"
            id={id}
            name={id}
            onChange={(e) => handleFileChange(id, e)}
            className={`w-full text-gray-600 border rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 ${
              errors[id] ? "border-red-500" : "border-blue-200"
            }`}
            accept={id.includes("video") ? "video/*" : "image/*"}
            disabled={isLoading}
            aria-label={`Upload file for ${question}`}
          />
          {formData[id] && (
            <p className="mt-2 text-gray-600 text-sm">
              {language === "mr" ? "फाइल निवडली: " : "File selected: "}
              {formData[id].name}
            </p>
          )}
         
        </div>
      )}
        {formData[id] !== undefined &&
          field.followup &&
          field.type === "yesno" && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700 mb-2">
                {
                  field.followup[formData[id] ? "yes" : "no"]?.[
                    `message_${language}`
                  ] || field.followup[formData[id] ? "yes" : "no"]?.message_mr || field.followup[formData[id] ? "yes" : "no"]?.message_en
                }
              </p>
              {field.followup[formData[id] ? "yes" : "no"]?.fields?.map(
                (subField) => renderField(subField)
              )}
            </div>
          )}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e3f2fd]">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
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
          <h2 className="text-lg font-bold mb-2">
            {language === "mr" ? "धन्यवाद!" : "Thank You!"}
          </h2>
          <p className="text-gray-600 mb-4 whitespace-pre-line">
            {formConfig[`submission_message_${language}`] ||
              validationMessages[language]?.submitSuccess ||
              "फॉर्म यशस्वीरित्या सबमिट झाला!"}
          </p>
          <p className="text-gray-500 mb-4">
            {language === "mr"
              ? `सबमिट केले: ${formatDateTime(language).replace("दिनांक:", "")}`
              : `Submitted: ${formatDateTime(language).replace("Date:", "")}`}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
          >
            {language === "mr" ? "पुढे जा" : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  const currentField = formConfig.fields[currentQuestionIndex];
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#e3f2fd] p-6 rounded-xl shadow-md">
 
  <div className="bg-white flex justify-between items-center mb-4 px-3 py-2 rounded">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="YNK Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold">YNK</h1>
          </div>
          <button
             onClick={toggleLanguage}
            className="text-sm text-gray-600 underline hover:text-blue-600" disabled={isLoading}
          >
            {language === 'mr' ? 'English' : 'मराठी'}
          </button>
        </div>

















        <h2 className="text-lg text-center font-bold mb-2">
          {formConfig[`title_${language}`] || formConfig.title_mr || formConfig.title_en || "दुकान सेटअप चेकलिस्ट"}
        </h2>
        <div className="mb-4">{renderField(currentField)}</div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleBack}
            className="text-gray-500 underline disabled:text-gray-300 hover:text-blue-600 disabled:opacity-50"
            disabled={currentQuestionIndex === 0 || isLoading}
            aria-label="मागे जा"
          >
            {formConfig.navigation_buttons?.[`back_${language}`] || (language === "mr" ? "मागे" : "Back")}
          </button>
          <button
            onClick={handleNext}
            className={`${
              currentQuestionIndex < totalQuestions - 1
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 rounded font-medium flex items-center space-x-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            aria-label={
              currentQuestionIndex < totalQuestions - 1 ? "पुढे" : "सबमिट करा"
            }
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l-4 4H4z"
                />
              </svg>
            )}
            <span>
              {isLoading
                ? language === "mr"
                  ? "सबमिट करत आहे..."
                  : "Submitting..."
                : currentQuestionIndex < totalQuestions - 1
                ? formConfig.navigation_buttons?.[`next_${language}`] || (language === "mr" ? "पुढे" : "Next")
                : formConfig[`submit_button_${language}`] || (language === "mr" ? "सबमिट करा" : "Submit")}
            </span>
          </button>
        </div>
        {apiError && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {language === "mr"
              ? `त्रुटी: ${apiError?.data?.message || "अज्ञात त्रुटी"}`
              : `Error: ${apiError?.data?.message || "Unknown error"}`}
          </p>
        )}
      </div>
    </div>
  );
}