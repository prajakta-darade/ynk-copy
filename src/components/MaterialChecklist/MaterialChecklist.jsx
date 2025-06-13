import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitFormMutation } from "../../store/formApi";
import MaterialCheckListQuestion from "./MaterialCheckListQuestion";
import { useUser } from "../context/UserContext";
import useCurrentTime from "../hook/useCurrentTime";
import logo from "../../assets/logo.png";

function MaterialChecklist({ language, toggleLanguage }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [agreement, setAgreement] = useState(null);
  const [materialAvailability, setMaterialAvailability] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitForm, { isLoading, error }] = useSubmitFormMutation();
  const { formatDateTime } = useCurrentTime();

  const { categories, checklistData, config } = MaterialCheckListQuestion;

  const currentCategory = categories[currentCategoryIndex];
  const filteredItems = checklistData.filter(
    (item) => item.category === currentCategory
  );

  // Redirect if user data is missing
  useEffect(() => {
    if (!user.name || !user.mobile || !user.branch) {
      navigate("/contact-info");
    }
  }, [user, navigate]);

  const handleAgreementChange = (value) => {
    setAgreement(value);
  };

  const handleAvailabilityChange = (category, no, value) => {
    setMaterialAvailability((prev) => ({
      ...prev,
      [`${category}-${no}`]: value,
    }));
  };

  const handleNext = () => {
    const currentItems = checklistData.filter(
      (item) => item.category === currentCategory
    );
    const allCurrentItemsSelected = currentItems.every(
      (item) =>
        materialAvailability[`${item.category}-${item.no}`] !== undefined
    );
    if (!allCurrentItemsSelected) {
      alert(config[language].availabilityError);
      return;
    }
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const allMaterialsSelected = checklistData.every(
      (item) =>
        materialAvailability[`${item.category}-${item.no}`] !== undefined
    );
    if (!allMaterialsSelected) {
      alert(config[language].availabilityError);
      return;
    }

    if (currentCategoryIndex === categories.length - 1 && agreement === null) {
      alert(config[language].agreementError);
      return;
    }

    const formattedData = new FormData();
    formattedData.append("formId", "material_checklist");
    formattedData.append("language", language);
    formattedData.append("name", user.name);
    formattedData.append("mobile", user.mobile);
    formattedData.append("branch", user.branch);

    checklistData.forEach((item) => {
      const particular = item[`particulars_${language}`] || item.particulars_en;
      const availability =
        materialAvailability[`${item.category}-${item.no}`] === "yes"
          ? config[language].availabilityYes
          : materialAvailability[`${item.category}-${item.no}`] === "no"
          ? config[language].availabilityNo
          : language === "mr"
          ? "उत्तर दिले नाही"
          : "Not answered";
      formattedData.append(
        `${particular} (${item.category}-${item.no})`,
        availability
      );
    });

    formattedData.append(
      config[language].question,
      agreement === "yes"
        ? config[language].yes
        : agreement === "no"
        ? config[language].no
        : language === "mr"
        ? "उत्तर दिले नाही"
        : "Not answered"
    );

    // Log FormData for debugging
    for (let [key, value] of formattedData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await submitForm(formattedData).unwrap();
      console.log("Submission response:", response);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      alert(
        language === "mr"
          ? `फॉर्म सबमिट करण्यात त्रुटी: ${
              err?.data?.message || "सर्व्हरशी कनेक्ट होऊ शकत नाही"
            }`
          : `Error submitting form: ${
              err?.data?.message || "Unable to connect to server"
            }`
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#dbeeff]">
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
            {language === "en"
              ? "Checklist Submitted!"
              : "चेकलिस्ट सबमिट झाले!"}
          </h2>
          <p className="text-gray-600 mb-4">
            {language === "en"
              ? "Material checklist has been submitted successfully."
              : "सामग्री चेकलिस्ट यशस्वीरित्या सबमिट झाले आहे."}
          </p>
          <p className="text-gray-500 mb-4">
            {language === "mr"
              ? `सबमिट केले: ${formatDateTime(language).replace("दिनांक:", "")}`
              : `Submitted: ${formatDateTime(language).replace("Date:", "")}`}
          </p>
          <button
            onClick={() => navigate("/inspection-checklist")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {language === "en"
              ? "Proceed to Inspection Checklist"
              : "तपासणी चेकलिस्टवर जा"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#dbeeff] p-6 rounded-xl border border-blue-200">
        <div className="bg-white flex justify-between items-center mb-4 px-3 py-2 rounded">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="YNK Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold">YNK</h1>
          </div>
          <button
            onClick={toggleLanguage}
            className="text-sm text-gray-600 underline hover:text-blue-600"
            disabled={isLoading}
          >
            {language === "mr" ? "English" : "मराठी"}
          </button>
        </div>
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-left text-gray-700 mb-1">
            {config[language].title}
          </h2>
          <div className="text-left text-gray-500 mb-4">
            <p>
              {config[language].branchName} {user.branch}
            </p>
            <p>
              {config[language].ownerName} {user.name}
            </p>
            <p>
              {config[language].dateLabel}{" "}
              {formatDateTime(language).replace(
                language === "mr" ? "दिनांक:" : "Date:",
                ""
              )}
            </p>
            <p>
              {config[language].mobileLabel} {user.mobile}
            </p>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {currentCategory}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm mb-6">
              <thead className="bg-blue-100">
                <tr>
                  {config[language].tableHeaders.map((header, idx) => (
                    <th
                      key={idx}
                      className={`border border-gray-300 p-2 text-center`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={`${item.category}-${item.no}`}
                    className="hover:bg-blue-50"
                  >
                    <td className="border border-gray-300 p-2">{item.no}</td>
                    <td className="border border-gray-300 p-2">
                      {language === "en"
                        ? item.particulars_en
                        : item.particulars_mr}
                    </td>
                    <td className="border border-gray-300 p-2">{item.size}</td>
                    <td className="border border-gray-300 p-2">{item.qty}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <label className="flex items-center justify-center gap-2">
                        <input
                          type="radio"
                          name={`availability-${item.category}-${item.no}`}
                          checked={
                            materialAvailability[
                              `${item.category}-${item.no}`
                            ] === "yes"
                          }
                          onChange={() =>
                            handleAvailabilityChange(
                              item.category,
                              item.no,
                              "yes"
                            )
                          }
                          disabled={isLoading}
                        />
                        <span className="text-gray-800">
                          {config[language].availabilityYes}
                        </span>
                      </label>
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <label className="flex items-center justify-center gap-2">
                        <input
                          type="radio"
                          name={`availability-${item.category}-${item.no}`}
                          checked={
                            materialAvailability[
                              `${item.category}-${item.no}`
                            ] === "no"
                          }
                          onChange={() =>
                            handleAvailabilityChange(
                              item.category,
                              item.no,
                              "noirono"
                            )
                          }
                          disabled={isLoading}
                        />
                        <span className="text-gray-800">
                          {config[language].availabilityNo}
                        </span>
                      </label>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {language === "en" ? item.remarks_en : item.remarks_mr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mb-6">
            <button
              onClick={handleBack}
              disabled={currentCategoryIndex === 0 || isLoading}
              className={`px-6 text-gray-500 underline hover:text-blue-600 ${
                currentCategoryIndex === 0 || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {config[language].back}
            </button>
            <button
              onClick={handleNext}
              disabled={
                currentCategoryIndex === categories.length - 1 || isLoading
              }
              className={`px-6 py-2 rounded text-white ${
                currentCategoryIndex === categories.length - 1 || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {config[language].next}
            </button>
          </div>

          {currentCategoryIndex === categories.length - 1 && (
            <>
              <div className="flex items-center gap-6 mb-6">
                <p className="text-gray-700 font-medium">
                  {config[language].question}
                </p>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="agreement"
                    checked={agreement === "yes"}
                    onChange={() => handleAgreementChange("yes")}
                    disabled={isLoading}
                  />
                  <span className="text-gray-800">{config[language].yes}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="agreement"
                    checked={agreement === "no"}
                    onChange={() => handleAgreementChange("no")}
                    disabled={isLoading}
                  />
                  <span className="text-gray-800">{config[language].no}</span>
                </label>
              </div>
              <div className="flex justify-center px-4">
                <button
                  onClick={handleSubmit}
                  className={`bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading
                    ? language === "mr"
                      ? "सबमिट करत आहे..."
                      : "Submitting..."
                    : config[language].submit}
                </button>
              </div>
            </>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {language === "mr"
                ? `त्रुटी: ${
                    error?.data?.message || "सर्व्हरशी कनेक्ट होऊ शकत नाही"
                  }`
                : `Error: ${
                    error?.data?.message || "Unable to connect to server"
                  }`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaterialChecklist;
