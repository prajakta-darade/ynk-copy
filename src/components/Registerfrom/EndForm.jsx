import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceProcessForm = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("mr");
  const [currentTable] = useState("process");

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === "mr" ? "en" : "mr"));
  };

  const config = {
    mr: {
      titleProcess: "सेवा प्रक्रिया माहिती",
      branchName: "शाखा: टेस्ट शाखा",
      ownerName: "मालक: टेस्ट मालक",
      dateLabel: `दिनांक: ${new Date().toLocaleDateString("mr-IN")}`,
      mobileLabel: "मोबाइल: 1234567890",
      processPoints: [
        "ऑनलाइन सेवा फोन कॉल करण्यासाठी त्यामध्ये असलेली सेवामाहिती franchisee owner ला द्यावी लागते.",
        "सेवेसाठी कंपनीकडून एक engineer निवडला जाईल.",
        "हा फॉर्म सबमिट झाल्यानंतर पुढील 24 तासांमध्ये (कार्यरत तास) आपल्या शॉपची सेवा पूर्ण केली जाईल.",
        "इंजिनियरच्या सेवेची तपशीलवार माहिती तुम्हाला पाठवली जाईल.",
        "इंजिनियरचा सेवा अहवाल सबमिट झाल्यानंतर विक्री विभागाकडून तुम्हाला कोटेशन पाठवले जाईल.",
        "तुम्ही मला दिलेली माहिती मी फॉर्ममध्ये नोंदवली आहे. त्याची लिंक मी तुम्हाला पाठवत आहे.",
        "तुमच्या मंजुरीनंतरच हा फॉर्म सबमिट होईल. तुमच्या मंजुरीनंतर वेळेची गणना सुरु होईल.",
      ],
      closingMessage: "पुन्हा एकदा तुमचे खूप खूप अभिनंदन आणि पुढील व्यवसायासाठी शुभेच्छा.",
      continueButton: "पुढे जा",
    },
    en: {
      titleProcess: "Service Process Information",
      branchName: "Branch: Test Branch",
      ownerName: "Owner: Test Owner",
      dateLabel: `Date: ${new Date().toLocaleDateString("en-IN")}`,
      mobileLabel: "Mobile: 1234567890",
      processPoints: [
        "For online service phone calls, the service information must be provided to the franchisee owner.",
        "An engineer will be selected by the company for the service.",
        "After submitting this form, your shop's service will be completed within 24 working hours.",
        "The engineer's service details will be sent to you.",
        "After the engineer submits the service report, the sales department will send you a quotation.",
        "I have recorded the information you provided in the form. I'm sharing the link with you.",
        "This form will only be submitted after your approval. The timeline will begin after your approval.",
      ],
      closingMessage: "Once again, congratulations and best wishes for your business.",
      continueButton: "Continue",
    },
  };

  const renderProcessContent = () => {
    return (
      <div className="space-y-4">
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          {config[language].processPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ol>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="font-semibold text-blue-800">
            {config[language].closingMessage}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#e3f2fd] p-6 rounded-xl border-blue-200">
        <div className="bg-white flex justify-between items-center mb-4 px-3 py-2 rounded">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold">YNK</h1>
          </div>
          <button
            onClick={handleLanguageToggle}
            className="text-sm text-gray-600 underline hover:text-blue-800"
          >
            {language === "mr" ? "English" : "मराठी"}
          </button>
        </div>

        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-left text-gray-700 mb-1">
            {config[language].titleProcess}
          </h2>
          <div className="text-left text-gray-500 mb-6">
            <p>{config[language].branchName}</p>
            <p>{config[language].ownerName}</p>
            <p>{config[language].dateLabel}</p>
            <p>{config[language].mobileLabel}</p>
          </div>

          {currentTable === "process" && renderProcessContent()}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate("/project-work-followup")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {config[language].continueButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProcessForm;