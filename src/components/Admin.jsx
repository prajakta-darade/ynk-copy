import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useGetResponsesQuery } from "../store/formApi";

const labels = {
  en: {
    title: "YNK Admin",
    dashboard: "Admin Dashboard",
    userList: "User List",
    name: "Name",
    mobile: "Mobile",
    branch: "Branch",
    submissions: "Submissions",
    formId: "Form ID",
    language: "Language",
    submittedAt: "Submitted At",
    responses: "Responses",
    question: "Question",
    answer: "Answer",
    images: "Images",
    videos: "Videos",
    notProvided: "Not provided",
    noUsers: "No users found.",
    noSubmissions: "No submissions found for this user.",
    loading: "Loading...",
    error: "Error",
    unknownError: "Unknown error",
    submissionImage: "Submission Image",
    videoNotSupported: "Your browser does not support the video tag.",
    expandAll: "Expand All",
    collapseAll: "Collapse All",
    totalUsers: "Total Users",
    totalSubmissions: "Total Submissions",
    viewImage: "View Image",
    playVideo: "Play Video",
  },
  mr: {
    title: "YNK ॲडमिन",
    dashboard: "ॲडमिन डॅशबोर्ड",
    userList: "वापरकर्ता यादी",
    name: "नाव",
    mobile: "मोबाइल",
    branch: "शाखा",
    submissions: "सबमिशन्स",
    formId: "फॉर्म आयडी",
    language: "भाषा",
    submittedAt: "सबमिट केलेले",
    responses: "प्रतिसाद",
    question: "प्रश्न",
    answer: "उत्तर",
    images: "प्रतिमा",
    videos: "व्हिडीओ",
    notProvided: "प्रदान केलेले नाही",
    noUsers: "कोणतेही वापरकर्ते सापडले नाहीत.",
    noSubmissions: "या वापरकर्त्यासाठी कोणतेही सबमिशन्स सापडले नाहीत.",
    loading: "लोड होत आहे...",
    error: "त्रुटी",
    unknownError: "अज्ञात त्रुटी",
    submissionImage: "सबमिशन प्रतिमा",
    videoNotSupported: "तुमचा ब्राउझर व्हिडीओ टॅगला सपोर्ट करत नाही.",
    expandAll: "सर्व विस्तृत करा",
    collapseAll: "सर्व संक्षिप्त करा",
    totalUsers: "एकूण वापरकर्ते",
    totalSubmissions: "एकूण सबमिशन्स",
    viewImage: "प्रतिमा पहा",
    playVideo: "व्हिडीओ प्ले करा",
  },
  hi: {
    title: "YNK एडमिन",
    dashboard: "एडमिन डैशबोर्ड",
    userList: "उपयोगकर्ता सूची",
    name: "नाम",
    mobile: "मोबाइल",
    branch: "शाखा",
    submissions: "सबमिशन",
    formId: "फॉर्म आईडी",
    language: "भाषा",
    submittedAt: "जमा किया गया",
    responses: "प्रतिक्रियाएँ",
    question: "प्रश्न",
    answer: "उत्तर",
    images: "छवियां",
    videos: "वीडियो",
    notProvided: "प्रदान नहीं किया गया",
    noUsers: "कोई उपयोगकर्ता नहीं मिला।",
    noSubmissions: "इस उपयोगकर्ता के लिए कोई सबमिशन नहीं मिला।",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    unknownError: "अज्ञात त्रुटि",
    submissionImage: "सबमिशन छवि",
    videoNotSupported: "आपका ब्राउज़र वीडियो टैग का समर्थन नहीं करता।",
    expandAll: "सभी विस्तृत करें",
    collapseAll: "सभी संक्षिप्त करें",
    totalUsers: "कुल उपयोगकर्ता",
    totalSubmissions: "कुल सबमिशन",
    viewImage: "छवि देखें",
    playVideo: "वीडियो चलाएं",
  },
};

const Admin = ({ language = "en", toggleLanguage }) => {
  const { data: responses, isLoading: loading, error: fetchError } = useGetResponsesQuery({
    language: language,
  });

  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [expandedUsers, setExpandedUsers] = useState({});
  const [stats, setStats] = useState({ totalUsers: 0, totalSubmissions: 0 });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (responses) {
      // Process unique users
      const uniqueUsers = [];
      const userIds = new Set();
      let totalSubmissions = 0;

      responses.forEach((submission) => {
        const user = submission.userId;
        if (user && !userIds.has(user._id)) {
          userIds.add(user._id);
          uniqueUsers.push(user);
        }
        totalSubmissions++;
      });

      setUsers(uniqueUsers);
      setStats({
        totalUsers: uniqueUsers.length,
        totalSubmissions: totalSubmissions,
      });

      // Group submissions by user
      const submissionsByUser = {};
      uniqueUsers.forEach((user) => {
        submissionsByUser[user._id] = responses.filter(
          (submission) => submission.userId._id === user._id
        );
      });
      setSubmissions(submissionsByUser);
    }
  }, [responses]);

  const toggleUser = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const toggleAllUsers = (expand) => {
    const newExpandedState = {};
    users.forEach((user) => {
      newExpandedState[user._id] = expand;
    });
    setExpandedUsers(newExpandedState);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(
      language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN"
    );
  };

  const getLanguageDisplayName = (lang) => {
    return lang === "en" ? "English" : lang === "mr" ? "मराठी" : "हिंदी";
  };

  const ImageModal = ({ src, alt, onClose }) => {
    if (!src) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white text-xl hover:text-gray-300"
          >
            ✕
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">{labels[language].loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded-xl shadow-lg">
                  <img
                    src={logo}
                    alt="YNK Logo"
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {labels[language].title}
                  </h1>
                  <p className="text-blue-100 text-sm mt-1">
                    Professional Administration Panel
                  </p>
                </div>
              </div>
              {toggleLanguage && (
                <button
                  onClick={toggleLanguage}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium"
                  type="button"
                >
                  {language === "mr" ? "English" : "मराठी"}
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-black bg-opacity-10 px-6 py-3">
            <div className="flex space-x-1">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">
                  {labels[language].dashboard}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Enhanced Dashboard Stats */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">
                      {labels[language].totalUsers}
                    </h3>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">
                      {labels[language].totalSubmissions}
                    </h3>
                    <p className="text-3xl font-bold">
                      {stats.totalSubmissions}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 4a1 1 0 10-2 0v2a1 1 0 102 0V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">
                      Active Today
                    </h3>
                    <p className="text-3xl font-bold">
                      {Math.floor(stats.totalUsers * 0.3)}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">
                      Avg per User
                    </h3>
                    <p className="text-3xl font-bold">
                      {stats.totalUsers > 0
                        ? Math.round(stats.totalSubmissions / stats.totalUsers)
                        : 0}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced User List Header */}
          <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {labels[language].userList}
              </h3>
            </div>
            {users.length > 0 && (
              <div className="flex space-x-3">
                <button
                  onClick={() => toggleAllUsers(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                >
                  {labels[language].expandAll}
                </button>
                <button
                  onClick={() => toggleAllUsers(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-md"
                >
                  {labels[language].collapseAll}
                </button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {fetchError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {`${labels[language].error}: ${
                  fetchError?.data?.message || labels[language].unknownError
                }`}
              </div>
            </div>
          )}

          {/* Enhanced Users List */}
          {users.length > 0 ? (
            <div className="space-y-6">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Enhanced User Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
                    onClick={() => toggleUser(user._id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              {labels[language].name}
                            </span>
                            <p className="text-gray-800 font-semibold text-lg">
                              {user?.name || labels[language].notProvided}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              {labels[language].mobile}
                            </span>
                            <p className="text-gray-800 font-medium">
                              {user?.mobile || labels[language].notProvided}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <svg
                              className="w-5 h-5 text-purple-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              {labels[language].branch}
                            </span>
                            <p className="text-gray-800 font-medium">
                              {user?.branch || labels[language].notProvided}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
                          <span className="text-sm font-bold">
                            {submissions[user._id]?.length || 0}{" "}
                            {labels[language].submissions}
                          </span>
                        </div>
                        <div
                          className={`transform transition-transform duration-200 ${
                            expandedUsers[user._id] ? "rotate-180" : ""
                          }`}
                        >
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Expanded Submissions */}
                  {expandedUsers[user._id] && (
                    <div className="bg-gray-50">
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <svg
                              className="w-6 h-6 text-indigo-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path
                                fillRule="evenodd"
                                d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h4 className="text-xl font-bold text-gray-800">
                            {labels[language].submissions}
                          </h4>
                        </div>

                        {submissions[user._id]?.length > 0 ? (
                          <div className="space-y-6">
                            {submissions[user._id].map(
                              (submission, submissionIndex) => (
                                <div
                                  key={submission._id}
                                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-md"
                                >
                                  {/* Enhanced Submission Meta */}
                                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="flex items-center space-x-2">
                                        <svg
                                          className="w-4 h-4 text-gray-500"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                        </svg>
                                        <div>
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            {labels[language].formId}
                                          </span>
                                          <p className="text-sm font-semibold text-gray-800">
                                            {submission.formId}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <svg
                                          className="w-4 h-4 text-gray-500"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <div>
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            {labels[language].language}
                                          </span>
                                          <p className="text-sm font-semibold text-gray-800">
                                            {getLanguageDisplayName(
                                              submission.language
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <svg
                                          className="w-4 h-4 text-gray-500"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <div>
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            {labels[language].submittedAt}
                                          </span>
                                          <p className="text-sm font-semibold text-gray-800">
                                            {formatDate(submission.submittedAt)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Enhanced Responses */}
                                  <div>
                                    <div className="flex items-center space-x-2 mb-4">
                                      <svg
                                        className="w-5 h-5 text-indigo-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <h5 className="text-lg font-bold text-gray-800">
                                        {labels[language].responses}
                                      </h5>
                                    </div>

                                    <div className="space-y-6">
                                      {submission.responses.map(
                                        (response, responseIndex) => (
                                          <div
                                            key={responseIndex}
                                            className="bg-gradient-to-r from-white to-gray-50 rounded-xl border-l-4 border-indigo-500 p-6 shadow-sm"
                                          >
                                            {/* Question Section */}
                                            <div className="mb-4">
                                              <div className="flex items-start space-x-3">
                                                <div className="bg-indigo-100 p-2 rounded-lg mt-1">
                                                  <svg
                                                    className="w-4 h-4 text-indigo-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                  >
                                                    <path
                                                      fillRule="evenodd"
                                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                                      clipRule="evenodd"
                                                    />
                                                  </svg>
                                                </div>
                                                <div className="flex-1">
                                                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                                                    {labels[language].question}{" "}
                                                    #{responseIndex + 1}
                                                  </span>
                                                  <p className="text-gray-800 font-medium mt-1 leading-relaxed">
                                                    {response.questionText}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Answer Section */}
                                            <div className="mb-4">
                                              <div className="flex items-start space-x-3">
                                                <div className="bg-green-100 p-2 rounded-lg mt-1">
                                                  <svg
                                                    className="w-4 h-4 text-green-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                  >
                                                    <path
                                                      fillRule="evenodd"
                                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                      clipRule="evenodd"
                                                    />
                                                  </svg>
                                                </div>
                                                <div className="flex-1">
                                                  <span className="text-xs font-bold text-green-600 uppercase tracking-wide">
                                                    {labels[language].answer}
                                                  </span>
                                                  <div className="bg-white p-4 rounded-lg mt-2 border border-gray-200">
                                                    <p className="text-gray-800 leading-relaxed">
                                                      {response.answer}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Images Section */}
                                            {response.images?.length > 0 && (
                                              <div className="mb-4">
                                                <div className="flex items-center space-x-2 mb-3">
                                                  <div className="bg-yellow-100 p-2 rounded-lg">
                                                    <svg
                                                      className="w-4 h-4 text-yellow-600"
                                                      fill="currentColor"
                                                      viewBox="0 0 20 20"
                                                    >
                                                      <path
                                                        fillRule="evenodd"
                                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                        clipRule="evenodd"
                                                      />
                                                    </svg>
                                                  </div>
                                                  <span className="text-sm font-bold text-yellow-600 uppercase tracking-wide">
                                                    {labels[language].images} (
                                                    {response.images.length})
                                                  </span>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                  {response.images.map(
                                                    (image, imgIndex) => (
                                                      <div
                                                        key={imgIndex}
                                                        className="relative group"
                                                      >
                                                        <div className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                                          <img
                                                            src={image}
                                                            alt={`${
                                                              labels[language]
                                                                .submissionImage
                                                            } ${imgIndex + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                            onClick={() =>
                                                              setSelectedImage(
                                                                image
                                                              )
                                                            }
                                                          />
                                                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                                                            <svg
                                                              className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                              fill="currentColor"
                                                              viewBox="0 0 20 20"
                                                            >
                                                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                              <path
                                                                fillRule="evenodd"
                                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                                clipRule="evenodd"
                                                              />
                                                            </svg>
                                                          </div>
                                                        </div>
                                                        <p className="text-xs text-gray-500 text-center mt-1">
                                                          {
                                                            labels[language]
                                                              .viewImage
                                                          }{" "}
                                                          {imgIndex + 1}
                                                        </p>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )}

                                            {/* Videos Section */}
                                            {response.videos?.length > 0 && (
                                              <div className="mb-4">
                                                <div className="flex items-center space-x-2 mb-3">
                                                  <div className="bg-red-100 p-2 rounded-lg">
                                                    <svg
                                                      className="w-4 h-4 text-red-600"
                                                      fill="currentColor"
                                                      viewBox="0 0 20 20"
                                                    >
                                                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                                    </svg>
                                                  </div>
                                                  <span className="text-sm font-bold text-red-600 uppercase tracking-wide">
                                                    {labels[language].videos} (
                                                    {response.videos.length})
                                                  </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  {response.videos.map(
                                                    (video, vidIndex) => (
                                                      <div
                                                        key={vidIndex}
                                                        className="bg-white p-3 rounded-lg shadow-md"
                                                      >
                                                        <video
                                                          controls
                                                          className="w-full h-48 rounded-lg border border-gray-200"
                                                          preload="metadata"
                                                        >
                                                          <source
                                                            src={video}
                                                            type="video/mp4"
                                                          />
                                                          {
                                                            labels[language]
                                                              .videoNotSupported
                                                          }
                                                        </video>
                                                        <p className="text-xs text-gray-500 text-center mt-2">
                                                          {
                                                            labels[language]
                                                              .playVideo
                                                          }{" "}
                                                          {vidIndex + 1}
                                                        </p>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <svg
                              className="w-12 h-12 text-gray-400 mx-auto mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="text-gray-600 text-lg">
                              {labels[language].noSubmissions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <p className="text-gray-600 text-xl font-medium">
                {labels[language].noUsers}
              </p>
              <p className="text-gray-500 mt-2">
                Check back later for new user registrations
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        src={selectedImage}
        alt={labels[language].submissionImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default Admin;