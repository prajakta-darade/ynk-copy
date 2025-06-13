import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitFormMutation } from "../../store/formApi";
import CivilWorkChecklistFormQuestion from "./CivilWorkChecklistFormQuestion";
import logo from "../../assets/logo.png";
const {
  equipmentConfig,
  questions,
  tableData1,
  tableData2,
  tableData3,
  tableData4,
  tableData5,
  tableData6,
  tableData7,
  tableData8,
  tableData9,
  tableData10,
  config,
} = CivilWorkChecklistFormQuestion;
export default function CivilWorkChecklistForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cctv_understood: null,
    internet_understood: null,
    speaker_understood: null,
    painting_understood: null,
    plumber_understood: null,
    electrician_switch_socket_understood: null,
    electrician_material_understood: null,
    electrician_wire_understood: null,
    pop_tiles_understood: null,
    gas_piping_understood: null,
  });
  const [language, setLanguage] = useState("mr");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitForm, { isLoading, error }] = useSubmitFormMutation();

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === "mr" ? "en" : "mr"));
  };

  const handleYesNoChange = (stepKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [stepKey]: null,
    }));
  };

  const validateCurrentStep = () => {
    const stepKey = questions[step - 1].key;
    const newErrors = {};

    if (formData[stepKey] === null) {
      newErrors[stepKey] =
        language === "mr"
          ? "कृपया प्रश्नाचे उत्तर द्या!"
          : "Please answer the question!";
    }

    return newErrors;
  };

  const validateAllQuestions = () => {
    const newErrors = {};
    questions.forEach((q) => {
      if (formData[q.key] === null) {
        newErrors[q.key] =
          language === "mr"
            ? `प्रश्न "${q[`question_${language}`]}" चे उत्तर द्या!`
            : `Please answer the question "${q[`question_${language}`]}"!`;
      }
    });
    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validateCurrentStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert(validationErrors[questions[step - 1].key]);
      return;
    }

    if (step < questions.length) {
      setStep((prev) => prev + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      setErrors({});
    }


    
  };
  const handleSubmit = async () => {
    const validationErrors = validateAllQuestions();
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      alert(
        language === "mr"
          ? `कृपया खालील प्रश्नांची उत्तरे द्या:\n${errorMessages}`
          : `Please answer the following questions:\n${errorMessages}`
      );
      const firstUnanswered = questions.find((q) => formData[q.key] === null);
      if (firstUnanswered) {
        setStep(questions.findIndex((q) => q.key === firstUnanswered.key) + 1);
      }
      return;
    }

    setIsSubmitting(true);

    const formattedData = new FormData();
    formattedData.append("formId", "civil_work_checklist");
    formattedData.append("language", language);
    // Hardcoded user data - replace with dynamic data later
    formattedData.append("name", "Test User");
    formattedData.append("mobile", "1234567890");
    formattedData.append("branch", "Test Branch");

    questions.forEach((q) => {
      const question = q[`question_${language}`];
      const answer =
        formData[q.key] === true
          ? language === "mr"
            ? "होय"
            : "Yes"
          : formData[q.key] === false
          ? language === "mr"
            ? "नाही"
            : "No"
          : language === "mr"
          ? "उत्तर दिले नाही"
          : "Not answered";
      formattedData.append(question, answer);
    });

    try {
      await submitForm(formattedData).unwrap();
      alert(
        language === "mr"
          ? "फॉर्म यशस्वीरित्या सबमिट झाला!"
          : "Form submitted successfully!"
      );
      navigate("/material-checklist");
    } catch (err) {
      alert(
        language === "mr"
          ? `फॉर्म सबमिट करण्यात त्रुटी: ${err?.data?.message || "Unknown error"}`
          : `Error submitting form: ${err?.data?.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTable = (data, step) => {
    const showWorkColumn = [5, 6, 8, 9, 10].includes(step);
    const headers = showWorkColumn
      ? config[language].tableHeaders
      : config[language].tableHeaders.slice(0, -1);

    return (
      <div className="overflow-x-auto mt-2">
        <table className="table-auto w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="border px-4 py-2 text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{row.item}</td>
                <td className="border px-4 py-2">{row.company}</td>
                <td className="border px-4 py-2">{row.specification}</td>
                <td className="border px-4 py-2">{row.qty}</td>
                {showWorkColumn && (
                  <td className="border px-4 py-2">{row.work || "-"}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const yesNoQuestion = (stepKey, questionText) => (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
      <p className="text-md font-medium mb-2 sm:mb-0">{questionText}</p>
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={stepKey}
            checked={formData[stepKey] === true}
            onChange={() => handleYesNoChange(stepKey, true)}
            className="w-4 h-4 text-blue-600"
            aria-label={language === "mr" ? "होय" : "Yes"}
          />
          {language === "mr" ? "होय" : "Yes"}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={stepKey}
            checked={formData[stepKey] === false}
            onChange={() => handleYesNoChange(stepKey, false)}
            className="w-4 h-4 text-blue-600"
            aria-label={language === "mr" ? "नाही" : "No"}
          />
          {language === "mr" ? "नाही" : "No"}
        </label>
      </div>
    </div>
  );

  const stepConfig = [
    {
      step: 1,
      title: config[language].title1,
      table: tableData1,
      questionKey: "cctv_understood",
    },
    {
      step: 2,
      title: config[language].title2,
      table: tableData2,
      questionKey: "internet_understood",
    },
    {
      step: 3,
      title: config[language].title3,
      table: tableData3,
      questionKey: "speaker_understood",
    },
    {
      step: 4,
      title: config[language].title4,
      table: tableData4,
      questionKey: "painting_understood",
    },
    {
      step: 5,
      title: config[language].title5,
      table: tableData5,
      questionKey: "plumber_understood",
    },
    {
      step: 6,
      title: config[language].title6,
      table: tableData6,
      questionKey: "electrician_switch_socket_understood",
    },
    {
      step: 7,
      title: config[language].title7,
      table: tableData7,
      questionKey: "electrician_material_understood",
    },
    {
      step: 8,
      title: config[language].title8,
      table: tableData8,
      questionKey: "electrician_wire_understood",
    },
    {
      step: 9,
      title: config[language].title9,
      table: tableData9,
      questionKey: "pop_tiles_understood",
    },
    {
      step: 10,
      title: config[language].title10,
      table: tableData10,
      questionKey: "gas_piping_understood",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl bg-[#e3f2fd] p-6 rounded-xl shadow-md">


<div className="bg-white flex justify-between items-center mb-4 px-3 py-2 rounded">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="YNK Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold">YNK</h1>
          </div>
          <button
              onClick={handleLanguageToggle}
            className="text-sm text-gray-600 underline hover:text-blue-600" disabled={isLoading}
          >
            {language === 'mr' ? 'English' : 'मराठी'}
          </button>
        </div>







        <h2 className="text-center text-lg font-semibold mb-6">
          {equipmentConfig[`title_${language}`]}
        </h2>

        {stepConfig.map(
          (config) =>
            step === config.step && (
              <div key={config.step}>
                <h3 className="mb-3 font-medium text-gray-700">
                  {config.title}
                </h3>
                {renderTable(config.table, config.step)}
                {yesNoQuestion(
                  config.questionKey,
                  questions[config.step - 1][`question_${language}`]
                )}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handleBack}
                    disabled={step === 1 || isSubmitting}
                    className="text-gray-600 px-4 py-2 bg-transparent border-none hover:text-blue-600 hover:underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={equipmentConfig[`back_button_${language}`]}
                  >
                    {equipmentConfig[`back_button_${language}`]}
                  </button>
                  {step === questions.length ? (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isLoading}
                      className={`bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none ${
                        (isSubmitting || isLoading) ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label={equipmentConfig[`submit_button_${language}`]}
                    >
                      {isSubmitting || isLoading
                        ? language === "mr"
                          ? "सबमिट करत आहे..."
                          : "Submitting..."
                        : equipmentConfig[`submit_button_${language}`]}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={isSubmitting || isLoading}
                      className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none ${
                        (isSubmitting || isLoading) ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label={equipmentConfig[`next_button_${language}`]}
                    >
                      {equipmentConfig[`next_button_${language}`]}
                    </button>
                  )}
                </div>
                {error && (
                  <p className="text-red-500 mt-4">
                    {language === "mr"
                      ? `त्रुटी: ${error?.data?.message || 'Unknown error'}`
                      : `Error: ${error?.data?.message || 'Unknown error'}`}
                  </p>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
}