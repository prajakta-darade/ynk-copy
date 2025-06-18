import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { 
  useGetResponsesQuery, 
  useDeleteResponseMutation, 
  useDeleteUserMutation, 
  useUpdateResponseMutation 
} from "../store/formApi";

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
    languageOptions: {
      en: "English",
      mr: "Marathi",
    },
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
    languageOptions: {
      en: "इंग्लिश",
      mr: "मराठी",
    },
  },
};

const Admin = ({ language = "en", toggleLanguage }) => {
  const { data: responses, isLoading: loading, error: fetchError } = useGetResponsesQuery({
    language: language,
  });
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(
      language === "mr" ? "mr-IN" : "en-IN"
    );
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
    await updateResponse({ id, ...editFormData });
    setEditingResponse(null);
    setEditFormData({});
  };

  const handleCancelEdit = () => {
    setEditingResponse(null);
    setEditFormData({});
  };

  const handleInputChange = (responseIndex, field, value) => {
    const updatedResponses = [...editFormData.responses];
    updatedResponses[responseIndex] = {
      ...updatedResponses[responseIndex],
      [field]: value,
    };
    setEditFormData({ ...editFormData, responses: updatedResponses });
  };

  const handleLanguageChange = (value) => {
    setEditFormData({ ...editFormData, language: value });
  };

  const ImageModal = ({ src, alt, onClose }) => {
    if (!src) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-white text-xl hover:text-gray-300"
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{labels[language].loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="YNK Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-semibold">{labels[language].title}</h1>
          </div>
          {toggleLanguage && (
            <button
              onClick={toggleLanguage}
              className="bg-white text-blue-500 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
              type="button"
            >
              {language === "mr" ? "English" : "मराठी"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-gray-600">{labels[language].totalUsers}</h3>
              <p className="text-2xl font-semibold">{stats.totalUsers}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-gray-600">{labels[language].totalSubmissions}</h3>
              <p className="text-2xl font-semibold">{stats.totalSubmissions}</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {fetchError && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg m-4">
            {`${labels[language].error}: ${fetchError?.data?.message || labels[language].unknownError}`}
          </div>
        )}

        {/* Users List */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">{labels[language].userList}</h2>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="border rounded-lg bg-white shadow-sm"
                >
                  {/* User Header */}
                  <div
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleUser(user._id)}
                  >
                    <div className="flex space-x-4">
                      <div>
                        <span className="text-gray-500">{labels[language].name}:</span>
                        <span className="ml-2 font-medium">{user?.name || labels[language].notProvided}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">{labels[language].mobile}:</span>
                        <span className="ml-2 font-medium">{user?.mobile || labels[language].notProvided}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">{labels[language].branch}:</span>
                        <span className="ml-2 font-medium">{user?.branch || labels[language].notProvided}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">
                        {submissions[user._id]?.length || 0} {labels[language].submissions}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user._id);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                      >
                        {labels[language].delete}
                      </button>
                      <span
                        className={`transform transition-transform ${expandedUsers[user._id] ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Expanded Submissions */}
                  {expandedUsers[user._id] && (
                    <div className="p-4 bg-gray-50">
                      <h3 className="text-lg font-medium mb-3">{labels[language].submissions}</h3>
                      {submissions[user._id]?.length > 0 ? (
                        <div className="space-y-4">
                          {submissions[user._id].map((submission) => (
                            <div
                              key={submission._id}
                              className="p-4 bg-white rounded-lg border"
                            >
                              {/* Submission Meta */}
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex space-x-4">
                                  <div>
                                    <span className="text-gray-500">{labels[language].formId}:</span>
                                    <span className="ml-2">{submission.formId}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">{labels[language].language}:</span>
                                    {editingResponse === submission._id ? (
                                      <select
                                        value={editFormData.language}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                        className="ml-2 border rounded px-2 py-1"
                                      >
                                        <option value="en">{labels[language].languageOptions.en}</option>
                                        <option value="mr">{labels[language].languageOptions.mr}</option>
                                      </select>
                                    ) : (
                                      <span className="ml-2">{getLanguageDisplayName(submission.language)}</span>
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">{labels[language].submittedAt}:</span>
                                    <span className="ml-2">{formatDate(submission.submittedAt)}</span>
                                  </div>
                                </div>
                                <div className="space-x-2">
                                  {editingResponse === submission._id ? (
                                    <>
                                      <button
                                        onClick={() => handleSaveEdit(submission._id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                                      >
                                        {labels[language].save}
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition"
                                      >
                                        {labels[language].cancel}
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleEditResponse(submission)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                                      >
                                        {labels[language].edit}
                                      </button>
                                      <button
                                        onClick={() => handleDeleteResponse(submission._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                      >
                                        {labels[language].delete}
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Responses */}
                              <div className="space-y-3">
                                {submission.responses.map((response, index) => (
                                  <div key={index} className="border-t pt-3">
                                    <div className="mb-2">
                                      <span className="font-medium">{labels[language].question}:</span>
                                      {editingResponse === submission._id ? (
                                        <input
                                          type="text"
                                          value={editFormData.responses[index].questionText}
                                          onChange={(e) =>
                                            handleInputChange(index, 'questionText', e.target.value)
                                          }
                                          className="ml-2 border rounded px-2 py-1 w-full"
                                        />
                                      ) : (
                                        <span className="ml-2">{response.questionText}</span>
                                      )}
                                    </div>
                                    <div className="mb-2">
                                      <span className="font-medium">{labels[language].answer}:</span>
                                      {editingResponse === submission._id ? (
                                        <input
                                          type="text"
                                          value={editFormData.responses[index].answer}
                                          onChange={(e) =>
                                            handleInputChange(index, 'answer', e.target.value)
                                          }
                                          className="ml-2 border rounded px-2 py-1 w-full"
                                        />
                                      ) : (
                                        <span className="ml-2">{response.answer}</span>
                                      )}
                                    </div>
                                    {response.images?.length > 0 && (
                                      <div className="mb-2">
                                        <span className="font-medium">{labels[language].images}:</span>
                                        <div className="flex space-x-2 mt-1">
                                          {response.images.map((image, imgIndex) => (
                                            <img
                                              key={imgIndex}
                                              src={image}
                                              alt={`${labels[language].submissionImage} ${imgIndex + 1}`}
                                              className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                                              onClick={() => setSelectedImage(image)}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {response.videos?.length > 0 && (
                                      <div>
                                        <span className="font-medium">{labels[language].videos}:</span>
                                        <div className="flex space-x-2 mt-1">
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
                        <div className="text-center p-4 text-gray-600">
                          {labels[language].noSubmissions}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-600">
              {labels[language].noUsers}
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