import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitFormMutation } from "../../store/formApi";
import OnlineServeyQuestion from "./OnlineServeyQuestion.jsx";
import logo from "../../assets/logo.png";

const { formConfig, validationMessages } = OnlineServeyQuestion;

// Radio Component
// Radio Component
const RadioComponent = ({
  lang,
  comp,
  qId,
  compIdx,
  followupValues,
  setFollowupValues,
}) => {
  const value = followupValues?.[qId]?.[compIdx] || "";
  return (
    <div className="mb-4">
      <p className="text-base font-medium text-gray-800 mb-2 text-left">
        {lang === "mr" ? comp.question_mr : comp.question_en}
      </p>
      {comp.options.map((option, i) => (
        <div key={i} className="flex items-center space-x-3 mb-2">
          <input
            type="radio"
            id={`${qId}_${compIdx}_${i}`} // Unique ID for each radio input
            name={`${qId}_${compIdx}`}
            value={option.value}
            checked={value === option.value}
            onChange={(e) =>
              setFollowupValues({
                ...followupValues,
                [qId]: { ...followupValues[qId], [compIdx]: e.target.value },
              })
            }
            className="w-4 h-4 text-blue-600"
            aria-label={lang === "mr" ? option.label_mr : option.label_en}
          />
          <label
            htmlFor={`${qId}_${compIdx}_${i}`} // Link label to radio input
            className="text-base text-gray-600 cursor-pointer" // Add cursor-pointer for better UX
          >
            {lang === "mr" ? option.label_mr : option.label_en}
          </label>
        </div>
      ))}
    </div>
  );
};
// Input Component
const InputComponent = ({
  lang,
  comp,
  qId,
  compIdx,
  followupValues,
  setFollowupValues,
}) => {
  const value = followupValues?.[qId]?.[compIdx] || "";
  return (
    <div className="mb-4">
      <p className="text-base font-medium text-gray-800 mb-2 text-left">
        {lang === "mr" ? comp.question_mr : comp.question_en}
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) =>
          setFollowupValues({
            ...followupValues,
            [qId]: { ...followupValues[qId], [compIdx]: e.target.value },
          })
        }
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        aria-label={lang === "mr" ? comp.question_mr : comp.question_en}
      />
    </div>
  );
};

// Image Upload Component
const ImageUploadComponent = ({
  lang,
  comp,
  qId,
  compIdx,
  handleImageUpload,
}) => (
  <div className="mb-4">
    <p className="text-base font-medium text-gray-800 mb-2 text-left">
      {lang === "mr" ? comp.message_mr : comp.message_en}
    </p>
    <div className="flex justify-between items-center gap-4">
      {comp.image && (
        <img
          src={comp.image}
          alt="Question related visual"
          className="w-36 h-auto rounded"
        />
      )}
      <input
        type="file"
        accept="image/*"
        multiple={comp.multiple}
        onChange={(e) => handleImageUpload(e.target.files, qId, compIdx)}
        className="w-full text-gray-600 border border-gray-300 rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700"
        style={{
          fontSize: "16px",
          color: "#333",
          backgroundColor: "#fff",
        }}
        aria-label={lang === "mr" ? comp.message_mr : comp.message_en}
      />
    </div>
  </div>
);
// Checkbox Component
const CheckboxComponent = ({
  lang,
  comp,
  qId,
  compIdx,
  followupValues,
  setFollowupValues,
}) => {
  const values = followupValues?.[qId]?.[compIdx] || [];
  const handleChange = (value) => {
    const newValues = values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value];
    setFollowupValues({
      ...followupValues,
      [qId]: { ...followupValues[qId], [compIdx]: newValues },
    });
  };

  return (
    <div className="mb-4">
      <p className="text-base font-medium text-gray-800 mb-2">
        {lang === "mr" ? comp.question_mr : comp.question_en}
      </p>
      {comp.options.map((option, i) => (
        <div key={i} className="flex items-center space-x-3 mb-2">
          <input
            type="checkbox"
            name={`${qId}_${compIdx}`}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={() => handleChange(option.value)}
            className="w-4 h-4 text-blue-600"
            aria-label={lang === "mr" ? option.label_mr : option.label_en}
          />
          <label className="text-base text-gray-600">
            {lang === "mr" ? option.label_mr : option.label_en}
          </label>
        </div>
      ))}
    </div>
  );
};

// Render Field Function
const renderField = ({
  lang,
  field,
  formData,
  handleYesNoChange,
  followupValues,
  setFollowupValues,
  handleImageUpload,
}) => {
  const question = field[`question_${lang}`] || field.question_mr;
  const id = field.id;

  if (field.type === "yesno") {
    return (
      <div key={id} className="mb-6">
        <h3 className="text-lg font-medium text-left text-gray-800 mb-2">
          {question}
        </h3>
        {field.image && (
          <img
            src={field.image}
            alt="Question related visual"
            className="mb-4 max-w-full h-auto rounded"
          />
        )}
        <div className="flex flex-col space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name={id}
              checked={formData[id] === true}
              onChange={() => handleYesNoChange(id, "yes")}
              className="w-4 h-4 text-blue-600"
              aria-label={lang === "mr" ? "होय" : "Yes"}
            />
            <span
              className={`text-base ${
                formData[id] === true
                  ? "text-gray-800 font-medium"
                  : "text-gray-600"
              }`}
            >
              {lang === "mr" ? "होय" : "Yes"}
            </span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name={id}
              checked={formData[id] === false}
              onChange={() => handleYesNoChange(id, "no")}
              className="w-4 h-4 text-blue-600"
              aria-label={lang === "mr" ? "नाही" : "No"}
            />
            <span
              className={`text-base ${
                formData[id] === false
                  ? "text-gray-800 font-medium"
                  : "text-gray-600"
              }`}
            >
              {lang === "mr" ? "नाही" : "No"}
            </span>
          </label>
        </div>
        {formData[id] !== undefined &&
          field.followup &&
          (() => {
            const followupContent = renderFollowup(
              formData[id],
              field.followup,
              lang,
              id,
              followupValues,
              setFollowupValues,
              handleImageUpload
            );
            return followupContent ? (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                {followupContent}
              </div>
            ) : null;
          })()}
      </div>
    );
  }

  return null;
};

// Render Followup Function
const renderFollowup = (
  selectedAnswer,
  followup,
  lang,
  qId,
  followupValues,
  setFollowupValues,
  handleImageUpload
) => {
  const followupConfig = followup?.[selectedAnswer ? "yes" : "no"];
  if (!followupConfig) return null;

  if (followupConfig.type === "imageupload") {
    return (
      <ImageUploadComponent
        lang={lang}
        comp={followupConfig}
        qId={qId}
        compIdx={0}
        handleImageUpload={handleImageUpload}
      />
    );
  }

  if (followupConfig.type === "guide") {
    return (
      <div className="my-2 p-2 bg-red-50 border border-red-300 rounded">
        <p className="text-base text-gray-800">
          {lang === "mr"
            ? followupConfig.message_mr
            : followupConfig.message_en}
        </p>
      </div>
    );
  }

  if (followupConfig.type === "radio") {
    return (
      <RadioComponent
        lang={lang}
        comp={followupConfig}
        qId={qId}
        compIdx={0}
        followupValues={followupValues}
        setFollowupValues={setFollowupValues}
      />
    );
  }

  if (followupConfig.type === "input") {
    return (
      <InputComponent
        lang={lang}
        comp={followupConfig}
        qId={qId}
        compIdx={0}
        followupValues={followupValues}
        setFollowupValues={setFollowupValues}
      />
    );
  }

  if (followupConfig.type === "checkbox") {
    return (
      <CheckboxComponent
        lang={lang}
        comp={followupConfig}
        qId={qId}
        compIdx={0}
        followupValues={followupValues}
        setFollowupValues={setFollowupValues}
      />
    );
  }

  if (followupConfig.type === "multi") {
    return (
      <div>
        {followupConfig.components?.map((comp, idx) => {
          if (comp.type === "radio") {
            return (
              <RadioComponent
                key={idx}
                lang={lang}
                comp={comp}
                qId={qId}
                compIdx={idx}
                followupValues={followupValues}
                setFollowupValues={setFollowupValues}
              />
            );
          }
          if (comp.type === "input") {
            return (
              <InputComponent
                key={idx}
                lang={lang}
                comp={comp}
                qId={qId}
                compIdx={idx}
                followupValues={followupValues}
                setFollowupValues={setFollowupValues}
              />
            );
          }
          if (comp.type === "imageupload") {
            return (
              <ImageUploadComponent
                key={idx}
                lang={lang}
                comp={comp}
                qId={qId}
                compIdx={idx}
                handleImageUpload={handleImageUpload}
              />
            );
          }
          if (comp.type === "checkbox") {
            return (
              <CheckboxComponent
                key={idx}
                lang={lang}
                comp={comp}
                qId={qId}
                compIdx={idx}
                followupValues={followupValues}
                setFollowupValues={setFollowupValues}
              />
            );
          }
          return null;
        })}
      </div>
    );
  }

  return null;
};

// Question Renderer Component
const QuestionRenderer = ({
  lang,
  question,
  selectedAnswer,
  followupValues,
  setFollowupValues,
  handleAnswer,
  handleImageUpload,
  handleYesNoChange,
  formData,
}) => {
  const renderYesNo = () => (
    <div className="question">
      {renderField({
        lang,
        field: question,
        formData,
        handleYesNoChange,
        followupValues,
        setFollowupValues,
        handleImageUpload,
      })}
    </div>
  );

  const renderRadio = () => (
    <div className="question">
      <h3 className="text-lg font-medium text-left text-gray-800 mb-2">
        {lang === "mr" ? question.question_mr : question.question_en}
      </h3>
      {question.image && (
        <img
          src={question.image}
          alt="Question related visual"
          className="mb-4 max-w-full h-auto rounded"
        />
      )}
      <div className="flex flex-col space-y-2 items-start">
        {question.options.map((option, idx) => (
          <div key={idx} className="flex items-center space-x-3 mb-2">
            <input
              type="radio"
              id={option.value}
              name={question.question_mr || question.question_en}
              value={option.value}
              checked={selectedAnswer === option.value}
              onChange={() => handleAnswer(option.value)}
              className="w-4 h-4 text-blue-600"
              aria-label={lang === "mr" ? option.label_mr : option.label_en}
            />
            <label htmlFor={option.value} className="text-base text-gray-600">
              {lang === "mr" ? option.label_mr : option.label_en}
            </label>
          </div>
        ))}
      </div>
      {selectedAnswer &&
        question.followup &&
        renderFollowup(
          selectedAnswer,
          question.followup,
          lang,
          question.id,
          followupValues,
          setFollowupValues,
          handleImageUpload
        )}
    </div>
  );

  const renderInput = () => (
    <div className="question">
      <h3 className="text-lg font-medium text-left text-gray-800 mb-2">
        {lang === "mr" ? question.question_mr : question.question_en}
      </h3>
      <input
        type="text"
        value={followupValues[question.id]?.[0] || ""}
        onChange={(e) =>
          setFollowupValues({
            ...followupValues,
            [question.id]: {
              ...followupValues[question.id],
              0: e.target.value,
            },
          })
        }
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        aria-label={lang === "mr" ? question.question_mr : question.question_en}
      />
    </div>
  );

  const renderMulti = () => (
    <div className="question">
      <h3 className="text-lg font-medium text-left text-gray-800 mb-2">
        {lang === "mr" ? question.question_mr : question.question_en}
      </h3>
      {question.components.map((comp, idx) => {
        if (comp.type === "imageupload") {
          return (
            <ImageUploadComponent
              key={idx}
              lang={lang}
              comp={comp}
              qId={question.id}
              compIdx={idx}
              handleImageUpload={handleImageUpload}
            />
          );
        }
        return null;
      })}
    </div>
  );

  if (question.type === "yesno") return renderYesNo();
  if (question.type === "radio") return renderRadio();
  if (question.type === "input") return renderInput();
  if (question.type === "multi") return renderMulti();
  return null;
};

// Main Form Component
const OnlineServeForm = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lang, setLang] = useState("mr");
  const [answers, setAnswers] = useState({});
  const [followupValues, setFollowupValues] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [submitForm, { isLoading, error }] = useSubmitFormMutation();

  const questions = formConfig.fields;
  const currentQ = questions[currentIndex];
  const selectedAnswer = answers[currentQ.id];

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQ.id]: value });
    setFollowupValues({ ...followupValues, [currentQ.id]: {} });
    setUploadedFiles({ ...uploadedFiles, [currentQ.id]: {} });
  };

  const handleYesNoChange = (id, value) => {
    setAnswers({ ...answers, [id]: value === "yes" });
    setFollowupValues({ ...followupValues, [id]: {} });
    setUploadedFiles({ ...uploadedFiles, [id]: {} });
  };

  const handleImageUpload = (files, qId, compIdx) => {
    const fileArray = Array.from(files);
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [qId]: {
        ...prevFiles[qId],
        [compIdx]: [...(prevFiles[qId]?.[compIdx] || []), ...fileArray],
      },
    }));
  };
  const validateQuestion = (index) => {
    const question = questions[index];
    const answer = answers[question.id];
    const followupValue = followupValues[question.id] || {};
    const files = uploadedFiles[question.id] || {};

    if (question.type === "yesno" || question.type === "radio") {
      if (answer === undefined) {
        alert(validationMessages[lang].answerRequired);
        return false;
      }
    }

    if (question.type === "input" && !followupValue[0]?.trim()) {
      alert(validationMessages[lang].answerRequired);
      return false;
    }

    if (question.type === "multi") {
      for (let i = 0; i < question.components.length; i++) {
        const comp = question.components[i];
        if (
          comp.type === "imageupload" &&
          (!files[i] || files[i].length === 0)
        ) {
          alert(validationMessages[lang].imageRequired);
          return false;
        }
      }
    }

    if (answer !== undefined && question.followup) {
      const followup = question.followup[answer ? "yes" : "no"];
      if (!followup) return true;

      if (followup.type === "radio" && !followupValue[0]) {
        alert(validationMessages[lang].followupRequired);
        return false;
      }

      if (followup.type === "input" && !followupValue[0]?.trim()) {
        alert(validationMessages[lang].followupRequired);
        return false;
      }

      if (
        followup.type === "checkbox" &&
        (!followupValue[0] || followupValue[0].length === 0)
      ) {
        alert(validationMessages[lang].checkboxRequired);
        return false;
      }

      if (
        followup.type === "imageupload" &&
        (!files[0] || files[0].length === 0)
      ) {
        alert(validationMessages[lang].imageRequired);
        return false;
      }

      if (followup.type === "multi" && followup.components) {
        for (let i = 0; i < followup.components.length; i++) {
          const comp = followup.components[i];
          if (comp.type === "radio") {
            if (!followupValue[i]) {
              alert(validationMessages[lang].followupRequired);
              return false;
            }
            // Check if the selected radio option is an "इतर" variant
            const selectedOption = comp.options.find(
              (option) => option.value === followupValue[i]
            );
            const isOtherSelected =
              selectedOption &&
              selectedOption.label_mr &&
              selectedOption.label_mr.includes("इतर");
            // Check if the next component is an input field
            const nextComp =
              i + 1 < followup.components.length
                ? followup.components[i + 1]
                : null;
            const isNextCompInput = nextComp && nextComp.type === "input";
            if (
              isOtherSelected &&
              isNextCompInput && // Only apply validation if the next component is an input field
              (!followupValue[i + 1] || !followupValue[i + 1].trim()) // Check if the next input field is empty
            ) {
              alert(validationMessages[lang].inputRequired);
              return false;
            }
          }
          if (comp.type === "input") {
            // Only require the input if the previous radio selected an "इतर" variant and this is the input following it
            const previousComp = i > 0 ? followup.components[i - 1] : null;
            if (previousComp && previousComp.type === "radio") {
              const selectedOption = previousComp.options.find(
                (option) => option.value === followupValue[i - 1]
              );
              const isOtherSelected =
                selectedOption &&
                selectedOption.label_mr &&
                selectedOption.label_mr.includes("इतर");
              if (
                isOtherSelected &&
                (!followupValue[i] || !followupValue[i].trim())
              ) {
                alert(validationMessages[lang].inputRequired);
                return false;
              }
            }
          }
          if (
            comp.type === "checkbox" &&
            (!followupValue[i] || followupValue[i].length === 0)
          ) {
            alert(validationMessages[lang].checkboxRequired);
            return false;
          }
          if (
            comp.type === "imageupload" &&
            (!files[i] || files[i].length === 0)
          ) {
            alert(validationMessages[lang].imageRequired);
            return false;
          }
        }
      }

      if (followup.fields) {
        for (let i = 0; i < followup.fields.length; i++) {
          const comp = followup.fields[i];
          if (comp.type === "radio") {
            if (!followupValue[i]) {
              alert(validationMessages[lang].followupRequired);
              return false;
            }
            // Check if the selected radio option is an "इतर" variant
            const selectedOption = comp.options.find(
              (option) => option.value === followupValue[i]
            );
            const isOtherSelected =
              selectedOption &&
              selectedOption.label_mr &&
              selectedOption.label_mr.includes("इतर");
            // Check if the next component is an input field
            const nextComp =
              i + 1 < followup.fields.length ? followup.fields[i + 1] : null;
            const isNextCompInput = nextComp && nextComp.type === "input";
            if (
              isOtherSelected &&
              isNextCompInput && // Only apply validation if the next component is an input field
              (!followupValue[i + 1] || !followupValue[i + 1].trim()) // Check if the next input field is empty
            ) {
              alert(validationMessages[lang].inputRequired);
              return false;
            }
          }
          if (comp.type === "input") {
            // Only require the input if the previous radio selected an "इतर" variant
            const previousComp = i > 0 ? followup.fields[i - 1] : null;
            if (previousComp && previousComp.type === "radio") {
              const selectedOption = previousComp.options.find(
                (option) => option.value === followupValue[i - 1]
              );
              const isOtherSelected =
                selectedOption &&
                selectedOption.label_mr &&
                selectedOption.label_mr.includes("इतर");
              if (
                isOtherSelected &&
                (!followupValue[i] || !followupValue[i].trim())
              ) {
                alert(validationMessages[lang].inputRequired);
                return false;
              }
            }
          }
          if (
            comp.type === "checkbox" &&
            (!followupValue[i] || followupValue[i].length === 0)
          ) {
            alert(validationMessages[lang].checkboxRequired);
            return false;
          }
          if (
            comp.type === "imageupload" &&
            (!files[i] || files[i].length === 0)
          ) {
            alert(validationMessages[lang].imageRequired);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateQuestion(currentIndex)) {
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    for (let i = 0; i < questions.length; i++) {
      if (!validateQuestion(i)) {
        setCurrentIndex(i);
        return;
      }
    }

    const formData = new FormData();
    formData.append("formId", "online_survey");
    formData.append("language", lang);
    // Hardcoded user data - replace with dynamic data later
    formData.append("name", "Test User");
    formData.append("mobile", "1234567890");
    formData.append("branch", "Test Branch");

    questions.forEach((question) => {
      const questionText =
        lang === "mr" ? question.question_mr : question.question_en;
      let answer = answers[question.id];
      const followupValue = followupValues[question.id] || {};

      if (question.type === "yesno") {
        answer =
          answer === true
            ? lang === "mr"
              ? "होय"
              : "Yes"
            : answer === false
            ? lang === "mr"
              ? "नाही"
              : "No"
            : lang === "mr"
            ? "उत्तर दिले नाही"
            : "Not answered";
        formData.append(questionText, answer);

        if (
          answer !== (lang === "mr" ? "उत्तर दिले नाही" : "Not answered") &&
          question.followup
        ) {
          const followupConfig =
            question.followup[answers[question.id] ? "yes" : "no"];
          if (followupConfig) {
            if (
              followupConfig.type === "radio" ||
              followupConfig.type === "input"
            ) {
              formData.append(
                `${questionText} - Followup`,
                followupValue[0] || "Not answered"
              );
            } else if (followupConfig.type === "checkbox") {
              formData.append(
                `${questionText} - Followup`,
                followupValue[0]?.join(", ") || "Not answered"
              );
            } else if (
              followupConfig.type === "multi" &&
              followupConfig.components
            ) {
              followupConfig.components.forEach((comp, idx) => {
                const followupQuestion =
                  lang === "mr" ? comp.question_mr : comp.question_en;
                if (comp.type === "radio" || comp.type === "input") {
                  formData.append(
                    `${questionText} - ${followupQuestion}`,
                    followupValue[idx] || "Not answered"
                  );
                } else if (comp.type === "checkbox") {
                  formData.append(
                    `${questionText} - ${followupQuestion}`,
                    followupValue[idx]?.join(", ") || "Not answered"
                  );
                }
              });
            }
          }
        }
      } else if (question.type === "radio") {
        formData.append(
          questionText,
          answer || (lang === "mr" ? "उत्तर दिले नाही" : "Not answered")
        );
        if (answer && question.followup) {
          const followupConfig = question.followup[answer];
          if (followupConfig) {
            if (
              followupConfig.type === "radio" ||
              followupConfig.type === "input"
            ) {
              formData.append(
                `${questionText} - Followup`,
                followupValue[0] || "Not answered"
              );
            } else if (followupConfig.type === "checkbox") {
              formData.append(
                `${questionText} - Followup`,
                followupValue[0]?.join(", ") || "Not answered"
              );
            } else if (
              followupConfig.type === "multi" &&
              followupConfig.components
            ) {
              followupConfig.components.forEach((comp, idx) => {
                const followupQuestion =
                  lang === "mr" ? comp.question_mr : comp.question_en;
                if (comp.type === "radio" || comp.type === "input") {
                  formData.append(
                    `${questionText} - ${followupQuestion}`,
                    followupValue[idx] || "Not answered"
                  );
                } else if (comp.type === "checkbox") {
                  formData.append(
                    `${questionText} - ${followupQuestion}`,
                    followupValue[idx]?.join(", ") || "Not answered"
                  );
                }
              });
            }
          }
        }
      } else if (question.type === "input") {
        formData.append(
          questionText,
          followupValue[0] ||
            (lang === "mr" ? "उत्तर दिले नाही" : "Not answered")
        );
      }
    });

    Object.keys(uploadedFiles).forEach((qId) => {
      Object.keys(uploadedFiles[qId]).forEach((compIdx) => {
        uploadedFiles[qId][compIdx].forEach((file, fileIdx) => {
          formData.append(`files_${qId}_${compIdx}_${fileIdx}`, file);
        });
      });
    });

    try {
      await submitForm(formData).unwrap();
      alert(
        lang === "mr"
          ? "फॉर्म यशस्वीरीत्या सबमिट केला!"
          : "Form submitted successfully!"
      );
      setAnswers({});
      setFollowupValues({});
      setUploadedFiles({});
      setCurrentIndex(0);
      navigate("/shop-measurements");
    } catch (err) {
      alert(
        lang === "mr"
          ? `फॉर्म सबमिट करताना त्रुटी आली: ${
              err?.data?.message || "Unknown error"
            }`
          : `Error submitting form: ${err?.data?.message || "Unknown error"}`
      );
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLanguageToggle = () => {
    setLang(lang === "mr" ? "en" : "mr");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#e3f2fd] p-6 rounded-xl shadow-md">
        <div className="bg-white flex justify-between items-center mb-4 px-3 py-2 rounded">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="YNK Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold">YNK</h1>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleLanguageToggle}
              className="text-sm text-gray-600 underline hover:text-blue-600"
              disabled={isLoading}
            >
              {lang === "mr" ? "English" : "मराठी"}
            </button>
          </div>
        </div>

        <h2 className="text-lg text-center font-bold mb-4 text-gray-800">
          {lang === "mr" ? formConfig.title_mr : formConfig.title_en}
        </h2>

        <QuestionRenderer
          lang={lang}
          question={currentQ}
          selectedAnswer={selectedAnswer}
          followupValues={followupValues}
          setFollowupValues={setFollowupValues}
          handleAnswer={handleAnswer}
          handleImageUpload={handleImageUpload}
          handleYesNoChange={handleYesNoChange}
          formData={answers}
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={handleBack}
            className="text-gray-500 underline disabled:opacity-50 hover:text-blue-600"
            disabled={currentIndex === 0 || isLoading}
            aria-label={
              lang === "mr"
                ? formConfig.navigation_buttons.back_mr
                : formConfig.navigation_buttons.back_en
            }
          >
            {lang === "mr"
              ? formConfig.navigation_buttons.back_mr
              : formConfig.navigation_buttons.back_en}
          </button>

          {currentIndex < questions.length - 1 && (
            <button
              onClick={handleNext}
              className={`px-4 py-2 rounded text-white transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isLoading}
              aria-label={
                lang === "mr"
                  ? formConfig.navigation_buttons.next_mr
                  : formConfig.navigation_buttons.next_en
              }
            >
              {lang === "mr"
                ? formConfig.navigation_buttons.next_mr
                : formConfig.navigation_buttons.next_en}
            </button>
          )}
        </div>

        {currentIndex === questions.length - 1 && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 rounded text-white transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={isLoading}
              aria-label={
                isLoading
                  ? lang === "mr"
                    ? "सबमिट करत आहे..."
                    : "Submitting..."
                  : lang === "mr"
                  ? formConfig.submit_button_mr
                  : formConfig.submit_button_en
              }
            >
              {isLoading
                ? lang === "mr"
                  ? "सबमिट करत आहे..."
                  : "Submitting..."
                : lang === "mr"
                ? formConfig.submit_button_mr
                : formConfig.submit_button_en}
            </button>
          </div>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {lang === "mr"
              ? `त्रुटी: ${error?.data?.message || "Unknown error"}`
              :   `Error: ${error?.data?.message || "Unknown error"}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default OnlineServeForm;