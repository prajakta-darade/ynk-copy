import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitFormMutation } from "../../store/formApi";
import MaterialCheckListQuestion from "./MaterialCheckListQuestion";
import { useUser } from "../context/UserContext";
import useCurrentTime from "../hook/useCurrentTime";
import logo from "../../assets/logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.error(config[language].availabilityError, {
        position: "top-right",
        autoClose: 5000,
        closeButton: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        rtl: false, // Force LTR for proper Marathi layout
      });
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
      toast.error(config[language].availabilityError, {
        position: "top-right",
        autoClose: 5000,
        closeButton: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        rtl: false, // Force LTR for proper Marathi layout
      });
      return;
    }

    if (currentCategoryIndex === categories.length - 1 && agreement === null) {
      toast.error(config[language].agreementError, {
        position: "top-right",
        autoClose: 5000,
        closeButton: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        rtl: false, // Force LTR for proper Marathi layout
      });
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

    try {
      await submitForm(formattedData).unwrap();
      setIsSubmitted(true);
      toast.success(
        language === "mr"
          ? "सामग्री चेकलिस्ट यशस्वीरित्या सबमिट झाले आहे!"
          : "Material checklist submitted successfully!",
        {
          position: "top-right",
          autoClose: 5000,
          closeButton: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          rtl: false, // Force LTR for proper Marathi layout
        }
      );
    } catch (err) {
      toast.error(
        language === "mr"
          ? `फॉर्म सबमिट करण्यात त्रुटी: ${err?.data?.message || "सर्व्हरशी कनेक्ट होऊ शकत नाही"
          }`
          : `Error submitting form: ${err?.data?.message || "Unable to connect to server"
          }`,
        {
          position: "top-right",
          autoClose: 5000,
          closeButton: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          rtl: false, // Force LTR for proper Marathi layout
        }
      );
    }
  };

  if (isSubmitted) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false} // Set to false for LTR (Marathi is LTR)
          pauseOnFocusLoss
          draggable
          closeButton={true}
          theme="light"
        />
        <div className="min-h-screen flex items-center justify-center bg-[#dbeeff] p-2 sm:p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-xs sm:max-w-md text-center border border-blue-200">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 sm:w-8 h-6 sm:h-8 text-green-600"
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
            <h2 className="text-base sm:text-lg font-bold mb-2 text-gray-800">
              {language === "en"
                ? "Checklist Submitted!"
                : "चेकलिस्ट सबमिट झाले!"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {language === "en"
                ? "Material checklist has been submitted successfully."
                : "सामग्री चेकलिस्ट यशस्वीरित्या सबमिट झाले आहे."}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              {language === "mr"
                ? `सबमिट केले: ${formatDateTime(language).replace("दिनांक:", "")}`
                : `Submitted: ${formatDateTime(language).replace("Date:", "")}`}
            </p>
            <button
              onClick={() => navigate("/inspection-checklist")}
              className="text-sm sm:text-base bg-blue-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded hover:bg-blue-700"
              aria-label={
                language === "en"
                  ? "Proceed to Inspection Checklist"
                  : "तपासणी चेकलिस्टवर जा"
              }
            >
              {language === "en"
                ? "Proceed to Inspection Checklist"
                : "तपासणी चेकलिस्टवर जा"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false} // Set to false for LTR (Marathi is LTR)
        pauseOnFocusLoss
        draggable
        closeButton={true}
        theme="light"
      />
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-full sm:max-w-5xl bg-[#dbeeff] p-4 sm:p-6 rounded-xl border border-blue-200 shadow-md">
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
              onClick={toggleLanguage}
              className="text-sm text-gray-600 underline hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
              disabled={isLoading}
              aria-label={
                language === "mr" ? "Switch to English" : "Switch to Marathi"
              }
            >
              {language === "mr" ? "English" : "मराठी"}
            </button>
          </div>
          <div className="px-2 sm:px-6 py-4 sm:py-6">
            <h2 className="text-lg sm:text-xl font-bold text-left text-gray-700 mb-1">
              {config[language].title}
            </h2>
            <div className="text-left text-gray-500 mb-4 sm:mb-6 text-xs sm:text-sm">
              <p>
                <span className="font-bold">{config[language].branchLabel || "Branch"}:</span> {user.branch}
              </p>
              <p>
                <span className="font-bold">{config[language].ownerNameLabel || "Owner Name"}:</span> {user.name}
              </p>
              <p>
                <span className="font-bold">{config[language].mobileLabel || "Mobile No"}:</span> {user.mobile}
              </p>
              <p>
                <span className="font-bold">{config[language].dateLabel || "Date"}:</span>{" "}
                {formatDateTime(language)
                  .replace(language === "mr" ? "दिनांक:" : "Date:", "")
                  .trim()}
              </p>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
              {currentCategory}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-xs sm:text-sm mb-6">
                <thead className="bg-blue-100">
                  <tr>
                    {config[language].tableHeaders.map((header, idx) => (
                      <th
                        key={idx}
                        className="border border-gray-300 p-1 sm:p-2 text-center font-medium text-gray-700"
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
                      <td className="border border-gray-300 p-1 sm:p-2 text-gray-600">
                        {item.no}
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-gray-600">
                        {language === "en"
                          ? item.particulars_en
                          : item.particulars_mr}
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-gray-600">
                        {item.size}
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-gray-600">
                        {item.qty}
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-center">
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
                            className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                            aria-label={config[language].availabilityYes}
                          />
                          <span className="text-sm sm:text-base text-gray-600">
                            {config[language].availabilityYes}
                          </span>
                        </label>
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-center">
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
                                "no"
                              )
                            }
                            className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                            aria-label={config[language].availabilityNo}
                          />
                          <span className="text-sm sm:text-base text-gray-600">
                            {config[language].availabilityNo}
                          </span>
                        </label>
                      </td>
                      <td className="border border-gray-300 p-1 sm:p-2 text-gray-600">
                        {language === "en" ? item.remarks_en : item.remarks_mr}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-6 gap-4">
              <button
                onClick={handleBack}
                disabled={currentCategoryIndex === 0 || isLoading}
                className={`text-sm sm:text-base px-2 sm:px-6 py-1 sm:py-2 text-gray-600 underline hover:text-blue-600 ${currentCategoryIndex === 0 || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                  }`}
                aria-label={config[language].back}
              >
                {config[language].back}
              </button>
              <button
                onClick={handleNext}
                disabled={currentCategoryIndex === categories.length - 1 || isLoading}
                className={`text-sm sm:text-base px-4 sm:px-6 py-1.5 sm:py-2 rounded text-white ${currentCategoryIndex === categories.length - 1 || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
                aria-label={config[language].next}
              >
                {config[language].next}
              </button>
            </div>

            {currentCategoryIndex === categories.length - 1 && (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base text-gray-700 font-medium">
                    {config[language].question}
                  </p>
                  <div className="flex gap-4 sm:gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="agreement"
                        checked={agreement === "yes"}
                        onChange={() => handleAgreementChange("yes")}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        disabled={isLoading}
                        aria-label={config[language].yes}
                      />
                      <span className="text-sm sm:text-base text-gray-600">
                        {config[language].yes}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="agreement"
                        checked={agreement === "no"}
                        onChange={() => handleAgreementChange("no")}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        disabled={isLoading}
                        aria-label={config[language].no}
                      />
                      <span className="text-sm sm:text-base text-gray-600">
                        {config[language].no}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-center px-2 sm:px-4">
                  <button
                    onClick={handleSubmit}
                    className={`text-sm sm:text-base bg-green-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded hover:bg-green-700 transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    disabled={isLoading}
                    aria-label={config[language].submit}
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
          </div>
        </div>
      </div>
    </>
  );
}

export default MaterialChecklist;