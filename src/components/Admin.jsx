import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import {
  useGetResponsesQuery,
  useDeleteResponseMutation,
  useDeleteUserMutation,
  useUpdateResponseMutation,
} from "../store/formApi";
import axios from "axios";

const labels = {
  en: {
    title: "YNK Admin",
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
    totalUsers: "Total Users",
    totalSubmissions: "Total Submissions",
    viewImage: "View Image",
    playVideo: "Play Video",
    delete: "Delete",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete this?",
    confirmDeleteUser: "Are you sure you want to delete this user and all their submissions?",
    loggedInAs: "Logged in as",
    showMySubmissions: "Show My Submissions Only",
    showAllSubmissions: "Show All Submissions",
    addQuestion: "Add New Question",
    newQuestion: "New Question",
    newAnswer: "New Answer",
    add: "Add",
    languageOptions: { en: "English", mr: "Marathi" },
    showMarathiOnly: "Show Marathi Only",
    showAllLanguages: "Show All Languages",
  },
  mr: {
    title: "YNK ॲडमिन",
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
    totalUsers: "एकूण वापरकर्ते",
    totalSubmissions: "एकूण सबमिशन्स",
    viewImage: "प्रतिमा पहा",
    playVideo: "व्हिडीओ प्ले करा",
    delete: "हटवा",
    edit: "संपादन करा",
    save: "जतन करा",
    cancel: "रद्द करा",
    confirmDelete: "तुम्हाला हे हटवायचे आहे का?",
    confirmDeleteUser: "तुम्हाला हा वापरकर्ता आणि त्यांचे सर्व सबमिशन्स हटवायचे आहेत का?",
    loggedInAs: "लॉग इन केलेले",
    showMySubmissions: "फक्त माझे सबमिशन्स दाखवा",
    showAllSubmissions: "सर्व सबमिशन्स दाखवा",
    addQuestion: "नवीन प्रश्न जोडा",
    newQuestion: "नवीन प्रश्न",
    newAnswer: "नवीन उत्तर",
    add: "जोडा",
    languageOptions: { en: "इंग्लिश", mr: "मराठी" },
    showMarathiOnly: "फक्त मराठी दाखवा",
    showAllLanguages: "सर्व भाषा दाखवा",
  },
};

const Admin = ({ language = "en", toggleLanguage }) => {
  const [fetchLanguage, setFetchLanguage] = useState(null); // New state for language filter
  const { data: responses, isLoading: loading, isFetching, error: fetchError } = useGetResponsesQuery(fetchLanguage ? { language: fetchLanguage } : {});
  const [deleteResponse] = useDeleteResponseMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateResponse] = useUpdateResponseMutation();

  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [expandedUsers, setExpandedUsers] = useState({});
  const [stats, setStats] = useState({ totalUsers: 0, totalSubmissions: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingResponse, setEditingResponse] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMySubmissions, setShowMySubmissions] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  // Fetch current user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/session", { withCredentials: true });
        console.log("Session Response:", response.data);
        if (response.data.isAuthenticated) {
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchSession();
  }, []);

  // Process responses
  useEffect(() => {
    if (responses) {
      console.log("Raw Responses:", JSON.stringify(responses, null, 2));
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

      const filteredUsers = showMySubmissions && currentUser
        ? uniqueUsers.filter((user) => user._id === currentUser.id)
        : uniqueUsers;

      setUsers(filteredUsers);
      setStats({
        totalUsers: filteredUsers.length,
        totalSubmissions: showMySubmissions && currentUser
          ? responses.filter((submission) => submission.userId._id === currentUser.id).length
          : totalSubmissions,
      });

      const submissionsByUser = {};
      filteredUsers.forEach((user) => {
        submissionsByUser[user._id] = responses.filter((submission) => submission.userId._id === user._id);
      });
      console.log("Submissions by User:", JSON.stringify(submissionsByUser, null, 2));
      setSubmissions(submissionsByUser);
    }
  }, [responses, showMySubmissions, currentUser]);

  const toggleUser = (userId) => {
    setExpandedUsers((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(language === "mr" ? "mr-IN" : "en-IN");
  };

  const getLanguageDisplayName = (lang) => {
    return labels[language].languageOptions[lang] || lang;
  };

  const handleDeleteResponse = async (id) => {
    if (window.confirm(labels[language].confirmDelete)) {
      await deleteResponse(id);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm(labels[language].confirmDeleteUser)) {
      await deleteUser(id);
    }
  };

  const handleEditResponse = (submission) => {
    setEditingResponse(submission._id);
    setEditFormData({
      language: submission.language,
      responses: submission.responses.map((resp) => ({ ...resp })),
    });
  };

  const handleSaveEdit = async (id) => {
    const hasEmptyFields = editFormData.responses.some((resp) => !resp.questionText.trim() || !resp.answer.trim());
    if (hasEmptyFields) {
      alert("Question and answer fields cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      await updateResponse({ id, ...editFormData }).unwrap();
      setEditingResponse(null);
      setEditFormData({});
    } catch (error) {
      console.error("Error saving edit:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingResponse(null);
    setEditFormData({});
  };

  const handleInputChange = (responseIndex, field, value) => {
    console.log("Updating:", { responseIndex, field, value });
    const updatedResponses = [...editFormData.responses];
    updatedResponses[responseIndex] = { ...updatedResponses[responseIndex], [field]: value };
    setEditFormData({ ...editFormData, responses: updatedResponses });
  };

  const handleLanguageChange = (value) => {
    setEditFormData({ ...editFormData, language: value });
  };

  const handleAddQuestion = async (submissionId) => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      alert("New question and answer cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      const submission = submissions[Object.keys(submissions)[0]].find((sub) => sub._id === submissionId);
      const updatedResponses = [
        ...submission.responses,
        {
          questionId: newQuestion.replace(/\s+/g, "_"),
          questionText: newQuestion,
          answer: newAnswer,
          images: [],
          videos: [],
        },
      ];
      await updateResponse({ id: submissionId, language: submission.language, responses: updatedResponses }).unwrap();
      setNewQuestion("");
      setNewAnswer("");
      setAddingQuestion(null);
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question.");
    } finally {
      setIsSaving(false);
    }
  };

  const ImageModal = ({ src, alt, onClose }) => {
    if (!src) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white text-xl hover:text-gray-300 bg-gray-800 rounded-full p-1"
          >
            ✕
          </button>
          <img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      </div>
    );
  };

  if (loading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">{labels[language].loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* Test Marathi Rendering */}
    
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="YNK Logo" className="h-12 w-12 object-contain" />
            <h1 className="text-3xl font-bold">{labels[language].title}</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
            {currentUser && (
              <span className="text-sm md:text-base font-medium">
                {labels[language].loggedInAs}: {currentUser.name} ({currentUser.mobile})
              </span>
            )}
            {toggleLanguage && (
              <button
                onClick={toggleLanguage}
                className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100 transition font-medium"
                type="button"
              >
                {language === "mr" ? "English" : "मराठी"}
              </button>
            )}
            {currentUser && (
              <button
                onClick={() => setShowMySubmissions(!showMySubmissions)}
                className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100 transition font-medium"
                type="button"
              >
                {showMySubmissions ? labels[language].showAllSubmissions : labels[language].showMySubmissions}
              </button>
            )}
            <button
              onClick={() => setFetchLanguage(fetchLanguage === "mr" ? null : "mr")}
              className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100 transition font-medium"
              type="button"
            >
              {fetchLanguage === "mr" ? labels[language].showAllLanguages : labels[language].showMarathiOnly}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 bg-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-600 font-semibold">{labels[language].totalUsers}</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-600 font-semibold">{labels[language].totalSubmissions}</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalSubmissions}</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {fetchError && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg m-6">
            {`${labels[language].error}: ${fetchError?.data?.message || labels[language].unknownError}`}
          </div>
        )}

        {/* Users List */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">{labels[language].userList}</h2>
          {users.length > 0 ? (
            <div className="space-y-6">
              {users.map((user) => (
                <div key={user._id} className="border rounded-xl bg-white shadow-md">
                  {/* User Header */}
                  <div
                    className="p-6 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => toggleUser(user._id)}
                  >
                    <div className="flex flex-col md:flex-row md:space-x-6">
                      <div className="mb-2 md:mb-0">
                        <span className="text-gray-500 font-medium">{labels[language].name}:</span>
                        <span className="ml-2 font-semibold">{user?.name || labels[language].notProvided}</span>
                      </div>
                      <div className="mb-2 md:mb-0">
                        <span className="text-gray-500 font-medium">{labels[language].mobile}:</span>
                        <span className="ml-2 font-semibold">{user?.mobile || labels[language].notProvided}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">{labels[language].branch}:</span>
                        <span className="ml-2 font-semibold">{user?.branch || labels[language].notProvided}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        {submissions[user._id]?.length || 0} {labels[language].submissions}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user._id);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
                      >
                        {labels[language].delete}
                      </button>
                      <span className={`transform transition-transform ${expandedUsers[user._id] ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Expanded Submissions */}
                  {expandedUsers[user._id] && (
                    <div className="p-6 bg-gray-50">
                      <h3 className="text-xl font-medium mb-4 text-gray-800">{labels[language].submissions}</h3>
                      {submissions[user._id]?.length > 0 ? (
                        <div className="space-y-6">
                          {submissions[user._id].map((submission) => (
                            <div key={submission._id} className="p-6 bg-white rounded-xl border shadow-sm">
                              {/* Submission Meta */}
                              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                                <div className="flex flex-col md:flex-row md:space-x-6">
                                  <div className="mb-2 md:mb-0">
                                    <span className="text-gray-500 font-medium">{labels[language].formId}:</span>
                                    <span className="ml-2">{submission.formId}</span>
                                  </div>
                                  <div className="mb-2 md:mb-0">
                                    <span className="text-gray-500 font-medium">{labels[language].language}:</span>
                                    {editingResponse === submission._id ? (
                                      <select
                                        value={editFormData.language}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                        className="ml-2 border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      >
                                        <option value="en">{labels[language].languageOptions.en}</option>
                                        <option value="mr">{labels[language].languageOptions.mr}</option>
                                      </select>
                                    ) : (
                                      <span className="ml-2">{getLanguageDisplayName(submission.language)}</span>
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-gray-500 font-medium">{labels[language].submittedAt}:</span>
                                    <span className="ml-2">{formatDate(submission.submittedAt)}</span>
                                  </div>
                                </div>
                                <div className="flex space-x-3 mt-4 md:mt-0">
                                  {editingResponse === submission._id ? (
                                    <>
                                      <button
                                        onClick={() => handleSaveEdit(submission._id)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition disabled:opacity-50"
                                        disabled={isSaving}
                                      >
                                        {isSaving ? "Saving..." : labels[language].save}
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition disabled:opacity-50"
                                        disabled={isSaving}
                                      >
                                        {labels[language].cancel}
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleEditResponse(submission)}
                                        className="bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700 transition"
                                      >
                                        {labels[language].edit}
                                      </button>
                                      <button
                                        onClick={() => handleDeleteResponse(submission._id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
                                      >
                                        {labels[language].delete}
                                      </button>
                                      <button
                                        onClick={() => setAddingQuestion(submission._id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                                      >
                                        {labels[language].addQuestion}
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Add New Question Form */}
                              {addingQuestion === submission._id && (
                                <div className="p-4 bg-gray-100 rounded-lg mb-4">
                                  <h4 className="text-lg font-medium mb-3 text-gray-800">{labels[language].addQuestion}</h4>
                                  <div className="flex flex-col md:flex-row md:space-x-4 mb-3">
                                    <input
                                      type="text"
                                      placeholder={labels[language].newQuestion}
                                      value={newQuestion}
                                      onChange={(e) => setNewQuestion(e.target.value)}
                                      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                      type="text"
                                      placeholder={labels[language].newAnswer}
                                      value={newAnswer}
                                      onChange={(e) => setNewAnswer(e.target.value)}
                                      className="border rounded px-3 py-2 w-full mt-2 md:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div className="flex space-x-3">
                                    <button
                                      onClick={() => handleAddQuestion(submission._id)}
                                      className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition disabled:opacity-50"
                                      disabled={isSaving}
                                    >
                                      {isSaving ? "Adding..." : labels[language].add}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setAddingQuestion(null);
                                        setNewQuestion("");
                                        setNewAnswer("");
                                      }}
                                      className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition disabled:opacity-50"
                                      disabled={isSaving}
                                    >
                                      {labels[language].cancel}
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Responses */}
                              <div className="space-y-4">
                                {submission.responses.map((response, index) => (
                                  <div key={index} className="border-t pt-4">
                                    <div className="mb-3">
                                      <span className="font-medium text-gray-700">{labels[language].question}:</span>
                                      {editingResponse === submission._id ? (
                                        <input
                                          type="text"
                                          value={editFormData.responses[index]?.questionText || ""}
                                          onChange={(e) => handleInputChange(index, "questionText", e.target.value)}
                                          className="ml-2 border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      ) : (
                                        <span className="ml-2">{response.questionText}</span>
                                      )}
                                    </div>
                                    <div className="mb-3">
                                      <span className="font-medium text-gray-700">{labels[language].answer}:</span>
                                      {editingResponse === submission._id ? (
                                        <input
                                          type="text"
                                          value={editFormData.responses[index]?.answer || ""}
                                          onChange={(e) => handleInputChange(index, "answer", e.target.value)}
                                          className="ml-2 border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      ) : (
                                        <span className="ml-2">{response.answer}</span>
                                      )}
                                    </div>
                                    {response.images?.length > 0 && (
                                      <div className="mb-3">
                                        <span className="font-medium text-gray-700">{labels[language].images}:</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {response.images.map((image, imgIndex) => (
                                            <img
                                              key={imgIndex}
                                              src={image}
                                              alt={`${labels[language].submissionImage} ${imgIndex + 1}`}
                                              className="w-28 h-28 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                                              onClick={() => setSelectedImage(image)}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {response.videos?.length > 0 && (
                                      <div>
                                        <span className="font-medium text-gray-700">{labels[language].videos}:</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {response.videos.map((video, vidIndex) => (
                                            <video
                                              key={vidIndex}
                                              controls
                                              className="w-48 h-32 rounded-lg"
                                              preload="metadata"
                                            >
                                              <source src={video} type="video/mp4" />
                                              {labels[language].videoNotSupported}
                                            </video>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6 text-gray-600">{labels[language].noSubmissions}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-600">{labels[language].noUsers}</div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal src={selectedImage} alt={labels[language].submissionImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default Admin;