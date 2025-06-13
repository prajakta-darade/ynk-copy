import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitFormMutation } from "../../store/formApi";
import ProjectWorkFollowupQuestion from "./ProjectWorkFollowupQuestion";
import logo from "../../assets/logo.png"; // Adjust the path as necessary
const { formConfig ,validationMessages} = ProjectWorkFollowupQuestion;



export default function ProjectWorkFollowup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [language, setLanguage] = useState("mr");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitForm, { isLoading, error }] = useSubmitFormMutation();

  const totalQuestions = formConfig.fields.length;

  const handleYesNoChange = (id, value, parentId = null) => {
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      if (parentId) {
        newFormData[parentId] = {
          ...newFormData[parentId],
          subQuestions: {
            ...newFormData[parentId]?.subQuestions,
            [id]: {
              ...newFormData[parentId]?.subQuestions?.[id],
              answer: value === "yes" ? true : false,
              reason:
                value === "no"
                  ? undefined
                  : newFormData[parentId]?.subQuestions?.[id]?.reason,
              media:
                value === "yes" &&
                formConfig.fields
                  .find((f) => f.id === parentId)
                  ?.subQuestions?.find((sq) => sq.id === id)?.type ===
                  "yesno_with_media"
                  ? newFormData[parentId]?.subQuestions?.[id]?.media
                  : undefined,
            },
          },
        };
      } else {
        newFormData[id] = {
          ...newFormData[id],
          answer: value === "yes" ? true : false,
          reason: value === "no" ? undefined : newFormData[id]?.reason,
          media:
            value === "yes" &&
            formConfig.fields.find((f) => f.id === id)?.type ===
              "yesno_with_media"
              ? newFormData[id]?.media
              : undefined,
        };
      }
      return newFormData;
    });
  };

  const handleInputChange = (id, field, value, parentId = null) => {
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      if (parentId) {
        newFormData[parentId] = {
          ...newFormData[parentId],
          subQuestions: {
            ...newFormData[parentId]?.subQuestions,
            [id]: {
              ...newFormData[parentId]?.subQuestions?.[id],
              [field]: value,
            },
          },
        };
      } else {
        newFormData[id] = {
          ...newFormData[id],
          [field]: value,
        };
      }
      return newFormData;
    });
  };

  const handleLanguageToggle = () => {
    setLanguage(language === "mr" ? "en" : "mr");
  };

  const validateField = (field, fieldData, parentId = null) => {
    const errorMessages = [];
    const isYesSelected = fieldData?.answer === true;

    if (fieldData?.answer === undefined) {
      errorMessages.push(validationMessages[language].answerRequired);
    }

    if (fieldData?.answer === false && field.hasReason) {
      if (!fieldData?.reason || fieldData.reason.trim() === "") {
        errorMessages.push(validationMessages[language].inputRequired);
      }
    }

    if (isYesSelected) {
      if (field.type === "yesno_with_media" && !fieldData?.media) {
        errorMessages.push(validationMessages[language].imageRequired);
      }

      if (field.hasChannelSize) {
        if (!fieldData?.channelSize) {
          errorMessages.push(validationMessages[language].followupRequired);
        }
        if (!fieldData?.supportSize) {
          errorMessages.push(validationMessages[language].followupRequired);
        }
      }

      if (field.hasSpecialInfo) {
        if (!fieldData?.specialInfo || fieldData.specialInfo.trim() === "") {
          errorMessages.push(validationMessages[language].inputRequired);
        }
        if (!fieldData?.shopVideo || fieldData.shopVideo.trim() === "") {
          errorMessages.push(validationMessages[language].inputRequired);
        }
        if (!fieldData?.infoBoard || fieldData.infoBoard.trim() === "") {
          errorMessages.push(validationMessages[language].inputRequired);
        }
      }
    }

    if (field.subQuestions && fieldData?.answer === true) {
      field.subQuestions.forEach((subQ) => {
        const subFieldData = fieldData?.subQuestions?.[subQ.id];
        const subErrorMessages = validateField(subQ, subFieldData, field.id);
        errorMessages.push(...subErrorMessages);
      });
    }

    return errorMessages;
  };

  const handleNext = async () => {
    const currentField = formConfig.fields[currentQuestionIndex];
    const currentFieldData = formData[currentField.id];
    const errorMessages = validateField(currentField, currentFieldData);

    if (errorMessages.length > 0) {
      window.alert(errorMessages.join("\n"));
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const formattedData = new FormData();
      formattedData.append('formId', 'project_work_followup');
      formattedData.append('language', language);
      // Hardcoded user data - replace with dynamic data later
      formattedData.append('name', 'Test User');
      formattedData.append('mobile', '1234567890');
      formattedData.append('branch', 'Test Branch');

      formConfig.fields.forEach((field, fieldIndex) => {
        const fieldData = formData[field.id];
        const question = field[`question_${language}`] || field.question_mr;
        const answer = fieldData?.answer === true
          ? (language === "mr" ? "होय" : "Yes")
          : fieldData?.answer === false
          ? (language === "mr" ? "नाही" : "No")
          : (language === "mr" ? "उत्तर दिले नाही" : "Not answered");
        
        formattedData.append(question, answer);

        if (fieldData?.answer !== undefined) {
          if (fieldData.answer === false && field.hasReason) {
            formattedData.append(`${question} - Reason`, fieldData.reason || "Not provided");
          }
          if (fieldData.answer === true) {
            if (field.type === "yesno_with_media" && fieldData.media) {
              formattedData.append(`${question} - Media`, fieldData.media);
            }
            if (field.hasChannelSize) {
              formattedData.append(`${question} - Channel Size`, fieldData.channelSize || "Not provided");
              formattedData.append(`${question} - Support Size`, fieldData.supportSize || "Not provided");
            }
            if (field.hasSpecialInfo) {
              formattedData.append(`${question} - Special Info (CCTV, Serial No., Password)`, fieldData.specialInfo || "Not provided");
              formattedData.append(`${question} - Shop Video`, fieldData.shopVideo || "Not provided");
              formattedData.append(`${question} - Info Board`, fieldData.infoBoard || "Not provided");
            }
            if (field.subQuestions) {
              field.subQuestions.forEach((subQ, subIndex) => {
                const subFieldData = fieldData.subQuestions?.[subQ.id];
                const subQuestion = subQ[`question_${language}`] || subQ.question_mr;
                const subAnswer = subFieldData?.answer === true
                  ? (language === "mr" ? "होय" : "Yes")
                  : subFieldData?.answer === false
                  ? (language === "mr" ? "नाही" : "No")
                  : (language === "mr" ? "उत्तर दिले नाही" : "Not answered");
                
                formattedData.append(`${question} - ${subQuestion}`, subAnswer);

                if (subFieldData?.answer !== undefined) {
                  if (subFieldData.answer === false && subQ.hasReason) {
                    formattedData.append(`${question} - ${subQuestion} - Reason`, subFieldData.reason || "Not provided");
                  }
                  if (subFieldData.answer === true && subQ.type === "yesno_with_media" && subFieldData.media) {
                    formattedData.append(`${question} - ${subQuestion} - Media`, subFieldData.media);
                  }
                }
              });
            }
          }
        }
      });

      try {
        await submitForm(formattedData).unwrap();
        window.alert(validationMessages[language].submitSuccess);
        navigate('/material-checklist');
      } catch (err) {
        window.alert(
          language === "mr"
            ? `फॉर्म सबमिट करण्यात त्रुटी: ${err?.data?.message || 'Unknown error'}`
            : `Error submitting form: ${err?.data?.message || 'Unknown error'}`
        );
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const renderField = (field, parentId = null) => {
    const question = field[`question_${language}`] || field.question_mr;
    const id = field.id;
    const currentFieldData = parentId
      ? formData[parentId]?.subQuestions?.[id]
      : formData[id];
    const isYesSelected = currentFieldData?.answer === true;

    return (
      <div className="">
        <p className="text-gray-700 text-base mb-4 leading-relaxed">
          {question}
        </p>

        <div className="space-y-3 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name={parentId ? `${parentId}-${id}` : id}
              checked={currentFieldData?.answer === true}
              onChange={() => handleYesNoChange(id, "yes", parentId)}
              className="w-4 h-4 focus:ring-gray-400 accent-gray-500"
              disabled={isLoading}
            />
            <span className="ml-3 text-gray-700">
              {language === "mr" ? "होय" : "Yes"}
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name={parentId ? `${parentId}-${id}` : id}
              checked={currentFieldData?.answer === false}
              onChange={() => handleYesNoChange(id, "no", parentId)}
              className="w-4 h-4 accent-gray-500"
              disabled={isLoading}
            />
            <span className="ml-3 text-gray-700">
              {language === "mr" ? "नाही" : "No"}
            </span>
          </label>
        </div>

        {(isYesSelected || currentFieldData?.answer === false) && (
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg mt-4">
            {isYesSelected && field.hasChannelSize && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {language === "mr" ? "चॅनल साईझ" : "Channel Size"}
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    value={currentFieldData?.channelSize || ""}
                    onChange={(e) =>
                      handleInputChange(
                        id,
                        "channelSize",
                        e.target.value,
                        parentId
                      )
                    }
                    disabled={isLoading}
                  >
                    <option value="">
                      {language === "mr" ? "निवडा" : "Select"}
                    </option>
                    {(field.channelSizes || []).map((size, index) => (
                      <option key={index} value={size}>
                        {size}"
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {language === "mr" ? "सपोर्ट साईझ" : "Support Size"}
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    value={currentFieldData?.supportSize || ""}
                    onChange={(e) =>
                      handleInputChange(
                        id,
                        "supportSize",
                        e.target.value,
                        parentId
                      )
                    }
                    disabled={isLoading}
                  >
                    <option value="">
                      {language === "mr" ? "निवडा" : "Select"}
                    </option>
                    {(field.supportSizes || []).map((size, index) => (
                      <option key={index} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {isYesSelected && field.hasSpecialInfo && (
              <div className="space-y-3">
                <div>
                  <textarea
                    placeholder={
                      language === "mr"
                        ? "CCTV, सिरीयल नं. आणि पासवर्ड"
                        : "CCTV, Serial No. and Password"
                    }
                    className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    value={currentFieldData?.specialInfo || ""}
                    onChange={(e) =>
                      handleInputChange(
                        id,
                        "specialInfo",
                        e.target.value,
                        parentId
                      )
                    }
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <textarea
                    placeholder={
                      language === "mr"
                        ? "पूर्ण शॉप चा विडिओ"
                        : "Complete shop video"
                    }
                    className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    value={currentFieldData?.shopVideo || ""}
                    onChange={(e) =>
                      handleInputChange(
                        id,
                        "shopVideo",
                        e.target.value,
                        parentId
                      )
                    }
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <textarea
                    placeholder={
                      language === "mr"
                        ? "पूर्ण शॉप मध्ये माहिती बोर्ड लावले का?"
                        : "Information board installed in complete shop?"
                    }
                    className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    value={currentFieldData?.infoBoard || ""}
                    onChange={(e) =>
                      handleInputChange(
                        id,
                        "infoBoard",
                        e.target.value,
                        parentId
                      )
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
{isYesSelected && field.type === "yesno_with_media" && (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {language === "mr" ? "फोटो किंवा व्हिडिओ" : "Photo or Video"}
    </label>
    <div className="flex justify-between items-center gap-4">
      {field.image && (
        <img
          src={field.image}
          alt="Question related visual"
          className="w-36 h-auto rounded"
        />
      )}
      <input
        type="file"
        accept="image/*,video/*"
        className="w-full text-gray-600 border border-gray-300 rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          fontSize: "16px",
          color: "#333",
          backgroundColor: "#fff",
        }}
        onChange={(e) =>
          handleInputChange(id, "media", e.target.files[0], parentId)
        }
        disabled={isLoading}
        aria-label={language === "mr" ? "फोटो किंवा व्हिडिओ" : "Photo or Video"}
      />
    </div>
  </div>
)}

{(isYesSelected || currentFieldData?.answer === false) && field.hasReason && (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {language === "mr" ? "कारण" : "Reason"}
    </label>
    <textarea
      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows="3"
      placeholder={language === "mr" ? "कारण लिहा..." : "Write reason..."}
      value={currentFieldData?.reason || ""}
      onChange={(e) =>
        handleInputChange(id, "reason", e.target.value, parentId)
      }
      disabled={isLoading}
    />
  </div>
)}

{formData[id] === "other" && (
  <div className="ml-6 mb-4">
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {language === "mr" ? "तपशील" : "Other Details"}
    </label>
    <input
      type="text"
      value={formData[`${id}_other`] || ""}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          [`${id}_other`]: e.target.value,
        }))
      }
      placeholder={language === "mr" ? "तपशील लिहा" : "Please specify"}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)}


            {isYesSelected && field.subQuestions && (
              <div className="ml-4 border-l-2 border-gray-200 pl-4 mt-4">
                {field.subQuestions.map((subQ) => (
                  <div key={subQ.id} className="mb-4">
                    {renderField(subQ, id)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
                     onClick={handleLanguageToggle}
                    className="text-sm text-gray-600 underline hover:text-blue-600" disabled={isLoading}
                  >
                    {language === 'mr' ? 'English' : 'मराठी'}
                  </button>
                </div>
        
       
        <h2 className="text-center text-lg font-semibold mb-6 text-gray-800">
          {formConfig[`title_${language}`]}
        </h2>

        <div className="mb-6">{renderField(currentField)}</div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
           className="text-gray-500 underline disabled:text-gray-300 hover:text-blue-600"
            disabled={currentQuestionIndex === 0 || isLoading}
          >
            {language === "mr" ? "मागे" : "Back"}
          </button>
          <button
            onClick={handleNext}
            className={`${
              currentQuestionIndex < totalQuestions - 1
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-6 py-2 rounded transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading
              ? language === "mr"
                ? "सबमिट करत आहे..."
                : "Submitting..."
              : currentQuestionIndex < totalQuestions - 1
              ? language === "mr"
                ? "पुढे"
                : "Next"
              : language === "mr"
              ? "सबमिट करा"
              : "Submit"}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {language === "mr"
              ? `त्रुटी: ${error?.data?.message || 'Unknown error'}`
              : `Error: ${error?.data?.message || 'Unknown error'}`}
          </p>
        )}
      </div>
    </div>
  );
}