import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitFormMutation } from "../../store/formApi";
import InspectionChecklistQuestion from "./InspectionChecklistQuestion";
import { useUser } from "../context/UserContext";
import useCurrentTime from "../hook/useCurrentTime";
import logo from "../../assets/logo.png"; // Adjust the path as necessary
const { firstImageData, secondImageData, thirdImageData, config } =
  InspectionChecklistQuestion;

function InspectionChecklist({ language, toggleLanguage }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentTable, setCurrentTable] = useState("first"); // 'first', 'second', or 'third'
  const [checklistStatus, setChecklistStatus] = useState({}); // Initialize empty to require manual selection
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitForm, { isLoading, error }] = useSubmitFormMutation();
  const { formatDateTime } = useCurrentTime();

  // Redirect if user data is missing
  useEffect(() => {
    if (!user.name || !user.mobile || !user.branch) {
      navigate("/contact-info");
    }
  }, [user, navigate]);

  const validateCurrentTable = () => {
    let dataToValidate = [];
    let tableName = "";
    if (currentTable === "first") {
      dataToValidate = firstImageData;
      tableName = "first";
    } else if (currentTable === "second") {
      dataToValidate = secondImageData;
      tableName = "second";
    } else if (currentTable === "third") {
      dataToValidate = thirdImageData;
      tableName = "third";
    }

    const unselectedItems = dataToValidate.filter((item, index) => {
      const groupKey = `${tableName}-${
        item.no !== undefined && item.no !== null && item.no !== ""
          ? item.no
          : `index${index}`
      }-${index}`;
      return (
        !checklistStatus[`${groupKey}-done`] &&
        !checklistStatus[`${groupKey}-pending`] &&
        !checklistStatus[`${groupKey}-notapplicable`]
      );
    });

    return unselectedItems.length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentTable()) {
      window.alert(config[language].validationMessage);
      return;
    }

    if (currentTable === "first") {
      setCurrentTable("second");
    } else if (currentTable === "second") {
      setCurrentTable("third");
    }
  };

  const handleBack = () => {
    if (currentTable === "third") {
      setCurrentTable("second");
    } else if (currentTable === "second") {
      setCurrentTable("first");
    }
  };

  const handleChecklistChange = (table, no, index, status) => {
    const groupKey = `${table}-${
      no !== undefined && no !== null && no !== "" ? no : `index${index}`
    }-${index}`;
    setChecklistStatus((prev) => {
      const newStatus = { ...prev };
      ["done", "pending", "notapplicable"].forEach((option) => {
        const key = `${groupKey}-${option}`;
        if (option === status) {
          newStatus[key] = true;
        } else {
          delete newStatus[key];
        }
      });
      return newStatus;
    });
  };

  const handleSubmit = async () => {
    if (!validateCurrentTable()) {
      window.alert(config[language].validationMessage);
      return;
    }

    const formattedData = new FormData();
    formattedData.append("formId", "inspection_checklist");
    formattedData.append("language", language);
    formattedData.append("name", user.name);
    formattedData.append("mobile", user.mobile);
    formattedData.append("branch", user.branch);

    // Format responses for all tables
    const tables = [
      { name: "first", data: firstImageData },
      { name: "second", data: secondImageData },
      { name: "third", data: thirdImageData },
    ];

    tables.forEach(({ name, data }) => {
      data.forEach((item, index) => {
        const groupKey = `${name}-${
          item.no !== undefined && item.no !== null && item.no !== ""
            ? item.no
            : `index${index}`
        }-${index}`;
        const question = language === "en" ? item.item_en : item.item_mr;
        const status = checklistStatus[`${groupKey}-done`]
          ? "Done"
          : checklistStatus[`${groupKey}-pending`]
          ? "Pending"
          : checklistStatus[`${groupKey}-notapplicable`]
          ? "Not Applicable"
          : "Not Selected";
        formattedData.append(
          `${question} (${name}-${item.no || `index${index}`})`,
          status
        );
      });
    });

    try {
      await submitForm(formattedData).unwrap();
      setIsSubmitted(true);
    } catch (err) {
      window.alert(
        language === "mr"
          ? `फॉर्म सबमिट करण्यात त्रुटी: ${
              err?.data?.message || "Unknown error"
            }`
          : `Error submitting form: ${err?.data?.message || "Unknown error"}`
      );
    }
  };

  const renderTable = (data, tableName, title) => (
    <>
      <table className="w-full border border-gray-300 text-sm mb-6">
        <thead className="bg-blue-100">
          <tr>
            {config[language].tableHeaders.map((header, idx) => (
              <th key={idx} className="border border-gray-300 p-2 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={`${
                item.no !== undefined && item.no !== null && item.no !== ""
                  ? item.no
                  : `index${index}`
              }-${index}`}
              className="hover:bg-blue-50"
            >
              <td className="border border-gray-300 p-2">{item.no}</td>
              <td className="border border-gray-300 p-2">
                {language === "en" ? item.item_en : item.item_mr}
              </td>
              <td className="border border-gray-300 p-2">
                {(language === "en"
                  ? item.checking_points_en
                  : item.checking_points_mr
                )?.length > 0
                  ? (language === "en"
                      ? item.checking_points_en
                      : item.checking_points_mr
                    ).join(", ")
                  : "-"}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="radio"
                  name={`${tableName}-${
                    item.no !== undefined && item.no !== null && item.no !== ""
                      ? item.no
                      : `index${index}`
                  }-${index}`}
                  checked={
                    checklistStatus[
                      `${tableName}-${
                        item.no !== undefined &&
                        item.no !== null &&
                        item.no !== ""
                          ? item.no
                          : `index${index}`
                      }-${index}-done`
                    ] || false
                  }
                  onChange={() =>
                    handleChecklistChange(tableName, item.no, index, "done")
                  }
                  className="accent-gray-600"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="radio"
                  name={`${tableName}-${
                    item.no !== undefined && item.no !== null && item.no !== ""
                      ? item.no
                      : `index${index}`
                  }-${index}`}
                  checked={
                    checklistStatus[
                      `${tableName}-${
                        item.no !== undefined &&
                        item.no !== null &&
                        item.no !== ""
                          ? item.no
                          : `index${index}`
                      }-${index}-pending`
                    ] || false
                  }
                  onChange={() =>
                    handleChecklistChange(tableName, item.no, index, "pending")
                  }
                  className="accent-gray-600"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="radio"
                  name={`${tableName}-${
                    item.no !== undefined && item.no !== null && item.no !== ""
                      ? item.no
                      : `index${index}`
                  }-${index}`}
                  checked={
                    checklistStatus[
                      `${tableName}-${
                        item.no !== undefined &&
                        item.no !== null &&
                        item.no !== ""
                          ? item.no
                          : `index${index}`
                      }-${index}-notapplicable`
                    ] || false
                  }
                  onChange={() =>
                    handleChecklistChange(
                      tableName,
                      item.no,
                      index,
                      "notapplicable"
                    )
                  }
                  className="accent-gray-600"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between px-4 text">
        <button
          onClick={handleBack}
          className={`underline text-gray-600 hover:text-blue-800 ${
            currentTable === "first" ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentTable === "first" || isLoading}
        >
          {config[language].backButton}
        </button>
        <div className="flex space-x-4">
          {currentTable !== "third" && (
            <button
              onClick={handleNext}
              className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {config[language].nextButton}
            </button>
          )}
          {currentTable === "third" && (
            <button
              onClick={handleSubmit}
              className={`bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading
                ? language === "mr"
                  ? "सबमिट करत आहे..."
                  : "Submitting..."
                : config[language].submitButton}
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="text-red-500 mt-4">
          {language === "mr"
            ? `त्रुटी: ${error?.data?.message || "Unknown error"}`
            : `Error: ${error?.data?.message || "Unknown error"}`}
        </p>
      )}
    </>
  );

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
            {language === "en"
              ? "Checklist Submitted!"
              : "चेकलिस्ट सबमिट झाले!"}
          </h2>
          <p className="text-gray-600 mb-4">
            {language === "en"
              ? "Inspection checklist has been submitted successfully."
              : "इन्स्पेक्शन चेकलिस्ट यशस्वीरित्या सबमिट झाले आहे."}
          </p>
          <p className="text-gray-500 mb-4">
            {language === "mr"
              ? `सबमिट केले: ${formatDateTime(language).replace("दिनांक:", "")}`
              : `Submitted: ${formatDateTime(language).replace("Date:", "")}`}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {language === "en" ? "Go to Dashboard" : "डॅशबोर्डवर जा"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#e3f2fd] p-6 rounded-xl border-blue-200">
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
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-left text-gray-700 mb-1">
            {currentTable === "first"
              ? config[language].titleFirst
              : currentTable === "second"
              ? config[language].titleSecond
              : config[language].titleThird}
          </h2>
          <div className="text-left text-gray-500 mb-6">
            <p>
              {config[language].branchName} {user.branch}
            </p>
            <p>
              {config[language].ownerName} {user.name}
            </p>
            <p>
              {config[language].dateLabel}{" "}
              {formatDateTime(language)
                .replace(language === "mr" ? "दिनांक:" : "Date:", "")
                .trim()}
            </p>
            <p>
              {config[language].mobileLabel} {user.mobile}
            </p>
          </div>

          {currentTable === "first" &&
            renderTable(firstImageData, "first", config[language].titleFirst)}
          {currentTable === "second" &&
            renderTable(
              secondImageData,
              "second",
              config[language].titleSecond
            )}
          {currentTable === "third" &&
            renderTable(thirdImageData, "third", config[language].titleThird)}
        </div>
      </div>
    </div>
  );
}

export default InspectionChecklist;
