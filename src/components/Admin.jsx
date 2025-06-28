import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useGetResponsesQuery, useDeleteResponseMutation, useDeleteUserMutation, useUpdateResponseMutation } from "../store/formApi";
import { useUser } from "../components/context/UserContext";
import { useNavigate } from "react-router-dom";

const labels = {
  en: {
    title: "Admin Dashboard",
    loading: "Loading...",
    error: "Error",
    unknownError: "An unknown error occurred",
    loggedInAs: "Logged in as",
    notProvided: "Not Provided",
    name: "Name",
    mobile: "Mobile",
    password: "Password",
    branch: "Branch",
    roleLabel: "Role",
    rolePlaceholder: "Select role",
    admin: "Admin",
    user: "User",
    layer1: "Layer 1",
    layer2: "Layer 2",
    layer3: "Layer 3",
    layer4: "Layer 4",
    layer5: "Layer 5",
    layer6: "Layer 6",
    layer7: "Layer 7",
    add: "Add",
    delete: "Delete",
    edit: "Edit",
    addUser: "Add New User",
    userList: "User List",
    totalUsers: "Total Users",
    totalSubmissions: "Total Submissions",
    submissions: "Submissions",
    noUsers: "No users found.",
    noSubmissions: "No submissions found.",
    showMySubmissions: "Show My Submissions",
    showAllSubmissions: "Show All Submissions",
    showMarathiOnly: "Show Marathi Only",
    showAllLanguages: "Show All Languages",
    formId: "Form ID",
    language: "Language",
    submittedAt: "Submitted At",
    question: "Question",
    answer: "Answer",
    images: "Images",
    videos: "Videos",
    submissionImage: "Submission Image",
    videoNotSupported: "Your browser does not support the video tag.",
    addQuestion: "Add Question",
    newQuestion: "Enter new question",
    newAnswer: "Enter new answer",
    cancel: "Cancel",
    loggedInUsers: "Logged-In Users",
    noLoggedInUsers: "No users currently logged in.",
    logout: "Logout",
    back: "Back",
  },
  mr: {
    title: "प्रशासक डॅशबोर्ड",
    loading: "लोड होत आहे...",
    error: "त्रुटी",
    unknownError: "अज्ञात त्रुटी आली",
    loggedInAs: "लॉग इन केलेले",
    notProvided: "पुरवले नाही",
    name: "नाव",
    mobile: "मोबाइल",
    password: "पासवर्ड",
    branch: "शाखा",
    roleLabel: "भूमिका",
    rolePlaceholder: "भूमिका निवडा",
    admin: "प्रशासक",
    user: "वापरकर्ता",
    layer1: "स्तर 1",
    layer2: "स्तर 2",
    layer3: "स्तर 3",
    layer4: "स्तर 4",
    layer5: "स्तर 5",
    layer6: "स्तर 6",
    layer7: "स्तर 7",
    add: "जोडा",
    delete: "हटवा",
    edit: "संपादित करा",
    addUser: "नवीन वापरकर्ता जोडा",
    userList: "वापरकर्ता यादी",
    totalUsers: "एकूण वापरकर्ते",
    totalSubmissions: "एकूण सबमिशन्स",
    submissions: "सबमिशन्स",
    noUsers: "वापरकर्ते सापडले नाहीत.",
    noSubmissions: "सबमिशन्स सापडले नाहीत.",
    showMySubmissions: "माझ्या सबमिशन्स दाखवा",
    showAllSubmissions: "सर्व सबमिशन्स दाखवा",
    showMarathiOnly: "फक्त मराठी दाखवा",
    showAllLanguages: "सर्व भाषा दाखवा",
    formId: "फॉर्म आयडी",
    language: "भाषा",
    submittedAt: "सबमिट केलेले वेळ",
    question: "प्रश्न",
    answer: "उत्तर",
    images: "प्रतिमा",
    videos: "व्हिडिओ",
    submissionImage: "सबमिशन प्रतिमा",
    videoNotSupported: "आपला ब्राउझर व्हिडिओ टॅग समर्थित करत नाही.",
    addQuestion: "प्रश्न जोडा",
    newQuestion: "नवीन प्रश्न प्रविष्ट करा",
    newAnswer: "नवीन उत्तर प्रविष्ट करा",
    cancel: "रद्द करा",
    loggedInUsers: "लॉग इन केलेले वापरकर्ते",
    noLoggedInUsers: "सध्या कोणतेही वापरकर्ते लॉग इन केलेले नाहीत.",
    logout: "लॉगआउट",
    back: "मागे",
  },
};

const Admin = ({ language = "en", toggleLanguage }) => {
  const { user: currentUser, logout } = useUser(); // Added logout from useUser
  const navigate = useNavigate();
  const [fetchLanguage, setFetchLanguage] = useState(null);
  const { data: responses = [], isLoading, isFetching, error: fetchError } = useGetResponsesQuery(
    fetchLanguage ? { language: fetchLanguage } : {}
  );
  const [deleteResponse] = useDeleteResponseMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateResponse] = useUpdateResponseMutation();

  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [expandedUsers, setExpandedUsers] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [stats, setStats] = useState({ totalUsers: 0, totalSubmissions: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingResponse, setEditingResponse] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showMySubmissions, setShowMySubmissions] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [addUserForm, setAddUserForm] = useState({ name: "", mobile: "", password: "", branch: "", role: "user" });
  const [addUserError, setAddUserError] = useState("");

  // Use UserContext's user instead of separate axios call
  useEffect(() => {
    if (!currentUser) {
      setUsers([]);
      setSubmissions({});
      setStats({ totalUsers: 0, totalSubmissions: 0 });
    }
  }, [currentUser]);

  // Process responses into users and submissions
  useEffect(() => {
    if (responses && currentUser) {
      const uniqueUsers = [];
      const userIds = new Set();
      let totalSubmissions = 0;

      responses.forEach((submission) => {
        const user = submission.userId || {};
        if (user._id && !userIds.has(user._id)) {
          userIds.add(user._id);
          uniqueUsers.push({ ...user, _id: user._id }); // Ensure _id is included
        }
        totalSubmissions++;
      });

      const filteredUsers = showMySubmissions
        ? uniqueUsers.filter((user) => user._id === currentUser.id)
        : uniqueUsers;

      setUsers(filteredUsers);
      setStats({
        totalUsers: filteredUsers.length,
        totalSubmissions: showMySubmissions
          ? responses.filter((submission) => submission.userId?._id === currentUser.id).length
          : totalSubmissions,
      });

      const submissionsByUser = {};
      filteredUsers.forEach((user) => {
        submissionsByUser[user._id] = responses.filter((submission) => submission.userId?._id === user._id) || [];
      });
      setSubmissions(submissionsByUser);
    }
  }, [responses, showMySubmissions, currentUser]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return labels[language].notProvided;
    const date = new Date(dateString);
    return date.toLocaleString(language === "mr" ? "mr-IN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to get language display name
  const getLanguageDisplayName = (lang) => {
    return lang === "mr" ? "Marathi" : lang === "en" ? "English" : lang || "N/A";
  };

  // Toggle user expansion
  const toggleUser = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Toggle question expansion
  const toggleQuestion = (submissionId, questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [`${submissionId}_${questionId}`]: !prev[`${submissionId}_${questionId}`],
    }));
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm(labels[language].delete + " " + labels[language].user + "?")) {
      try {
        await deleteUser(userId).unwrap();
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        setSubmissions((prev) => {
          const newSubmissions = { ...prev };
          delete newSubmissions[userId];
          return newSubmissions;
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(labels[language].error + ": " + (error?.data?.message || labels[language].unknownError));
      }
    }
  };

  // Handle delete response
  const handleDeleteResponse = async (responseId) => {
    if (window.confirm(labels[language].delete + " " + labels[language].submission + "?")) {
      try {
        await deleteResponse(responseId).unwrap();
        setSubmissions((prev) => {
          const newSubmissions = {};
          Object.keys(prev).forEach((userId) => {
            newSubmissions[userId] = prev[userId].filter((sub) => sub._id !== responseId);
          });
          return newSubmissions;
        });
      } catch (error) {
        console.error("Error deleting response:", error);
        alert(labels[language].error + ": " + (error?.data?.message || labels[language].unknownError));
      }
    }
  };

  // Handle edit response
  const handleEditResponse = (submission) => {
    setEditingResponse(submission._id);
    setEditFormData({
      ...submission.responses.reduce((acc, resp) => ({ ...acc, [resp.questionId]: resp.answer }), {}),
    });
  };

  // Handle save edited response
  const handleSaveEdit = async () => {
    if (!editingResponse) return;
    setIsSaving(true);
    try {
      await updateResponse({
        id: editingResponse,
        responses: Object.entries(editFormData).map(([questionId, answer]) => ({ questionId, answer })),
      }).unwrap();
      setEditingResponse(null);
      setEditFormData({});
    } catch (error) {
      console.error("Error updating response:", error);
      alert(labels[language].error + ": " + (error?.data?.message || labels[language].unknownError));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle add question
  const handleAddQuestion = async (submissionId) => {
    if (!newQuestion || !newAnswer) {
      alert(labels[language].error + ": " + labels[language].newQuestion + " and " + labels[language].newAnswer + " are required.");
      return;
    }
    setIsSaving(true);
    try {
      await updateResponse({
        id: submissionId,
        responses: [
          ...responses.find((sub) => sub._id === submissionId).responses,
          { questionText: newQuestion, answer: newAnswer, isSubQuestion: false },
        ],
      }).unwrap();
      setAddingQuestion(null);
      setNewQuestion("");
      setNewAnswer("");
    } catch (error) {
      console.error("Error adding question:", error);
      alert(labels[language].error + ": " + (error?.data?.message || labels[language].unknownError));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/admin/add-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addUserForm),
      });
      const data = await response.json();
      console.log("Add User Response:", data);
      if (!response.ok) throw new Error(data.message || "Failed to add user");
      setAddUserForm({ name: "", mobile: "", password: "", branch: "", role: "user" });
      setAddUserError("");
      alert(labels[language].addUser + " successful!");
    } catch (error) {
      console.error("Error adding user:", error);
      setAddUserError(error.message || "Failed to add user.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
      alert(labels[language].error + ": " + (error?.message || labels[language].unknownError));
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page (e.g., /dashboard)
  };

  const ImageModal = ({ src, alt, onClose }) => {
    if (!src) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl max-h-full">
          <button onClick={onClose} className="absolute top-2 right-2 text-white text-xl hover:text-gray-300 bg-gray-800 rounded-full p-1">✕</button>
          <img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      </div>
    );
  };

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">{labels[language].loading}</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-red-100 p-8 rounded-2xl shadow-xl">
          <p className="text-red-700 text-lg">{`${labels[language].error}: ${fetchError?.data?.message || labels[language].unknownError}`}</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">Access Denied: Only admins can view this page.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
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
                {labels[language].loggedInAs}: {currentUser.name || labels[language].notProvided} ({currentUser.mobile || labels[language].notProvided})
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
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition font-medium"
              type="button"
            >
              {labels[language].logout}
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition font-medium"
              type="button"
            >
              {labels[language].back}
            </button>
          </div>
        </div>

        {/* Add User Form */}
        <div className="p-6 bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">{labels[language].addUser}</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">{labels[language].name}</label>
                <input
                  type="text"
                  value={addUserForm.name}
                  onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={labels[language].name}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">{labels[language].mobile}</label>
                <input
                  type="tel"
                  value={addUserForm.mobile}
                  onChange={(e) => setAddUserForm({ ...addUserForm, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={labels[language].mobile}
                  maxLength="10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">{labels[language].password}</label>
                <input
                  type="password"
                  value={addUserForm.password}
                  onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={labels[language].password}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">{labels[language].branch}</label>
                <input
                  type="text"
                  value={addUserForm.branch}
                  onChange={(e) => setAddUserForm({ ...addUserForm, branch: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={labels[language].branch}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">{labels[language].roleLabel}</label>
                <select
                  value={addUserForm.role}
                  onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">{labels[language].admin}</option>
                  <option value="user">{labels[language].user}</option>
                  <option value="layer1">{labels[language].layer1}</option>
                  <option value="layer2">{labels[language].layer2}</option>
                  <option value="layer3">{labels[language].layer3}</option>
                  <option value="layer4">{labels[language].layer4}</option>
                  <option value="layer5">{labels[language].layer5}</option>
                  <option value="layer6">{labels[language].layer6}</option>
                  <option value="layer7">{labels[language].layer7}</option>
                </select>
              </div>
            </div>
            {addUserError && <p className="text-sm text-red-600">{addUserError}</p>}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
              {labels[language].add}
            </button>
          </form>
        </div>

        {/* Stats and Users List */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-600 font-semibold">{labels[language].totalUsers}</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-600 font-semibold">{labels[language].totalSubmissions}</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalSubmissions}</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">{labels[language].userList}</h2>
          {users.length > 0 ? (
            <div className="space-y-6">
              {users.map((user) => (
                <div key={user._id} className="border rounded-xl bg-white shadow-md">
                  <div
                    className="p-6 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => toggleUser(user._id)}
                  >
                    <div className="flex flex-col md:flex-row md:space-x-6">
                      <span>
                        <span className="text-gray-500 font-medium">{labels[language].name}:</span>
                        <span className="ml-2 font-semibold">{user.name || labels[language].notProvided}</span>
                      </span>
                      <span>
                        <span className="text-gray-500 font-medium">{labels[language].mobile}:</span>
                        <span className="ml-2 font-semibold">{user.mobile || labels[language].notProvided}</span>
                      </span>
                      <span>
                        <span className="text-gray-500 font-medium">{labels[language].branch}:</span>
                        <span className="ml-2 font-semibold">{user.branch || labels[language].notProvided}</span>
                      </span>
                      <span>
                        <span className="text-gray-500 font-medium">{labels[language].roleLabel}:</span>
                        <span className="ml-2 font-semibold">{labels[language][user.role] || labels[language].notProvided}</span>
                      </span>
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
                      <span className={`transform transition-transform ${expandedUsers[user._id] ? "rotate-180" : ""}`}>▼</span>
                    </div>
                  </div>
                  {expandedUsers[user._id] && (
                    <div className="p-6 bg-gray-50">
                      <h3 className="text-xl font-medium mb-4 text-gray-800">{labels[language].submissions}</h3>
                      {submissions[user._id]?.length > 0 ? (
                        <div className="space-y-6">
                          {submissions[user._id].map((submission) => (
                            <div key={submission._id} className="p-6 bg-white rounded-xl border shadow-sm">
                              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                                <div className="flex flex-col md:flex-row md:space-x-6">
                                  <span>
                                    <span className="text-gray-500 font-medium">{labels[language].formId}:</span>
                                    <span className="ml-2">{submission.formId || "N/A"}</span>
                                  </span>
                                  <span>
                                    <span className="text-gray-500 font-medium">{labels[language].language}:</span>
                                    <span className="ml-2">{getLanguageDisplayName(submission.language) || "N/A"}</span>
                                  </span>
                                  <span>
                                    <span className="text-gray-500 font-medium">{labels[language].submittedAt}:</span>
                                    <span className="ml-2">{formatDate(submission.submittedAt)}</span>
                                  </span>
                                </div>
                                <div className="flex space-x-3 mt-4 md:mt-0">
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
                                </div>
                              </div>
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
                              {editingResponse === submission._id && (
                                <div className="p-4 bg-gray-100 rounded-lg mb-4">
                                  <h4 className="text-lg font-medium mb-3 text-gray-800">{labels[language].edit}</h4>
                                  {submission.responses
                                    .filter((resp) => !resp.isSubQuestion)
                                    .map((resp) => (
                                      <div key={resp.questionId} className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">{resp.questionText}</label>
                                        <input
                                          type="text"
                                          value={editFormData[resp.questionId] || ""}
                                          onChange={(e) =>
                                            setEditFormData({ ...editFormData, [resp.questionId]: e.target.value })
                                          }
                                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                    ))}
                                  <div className="flex space-x-3">
                                    <button
                                      onClick={handleSaveEdit}
                                      className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition disabled:opacity-50"
                                      disabled={isSaving}
                                    >
                                      {isSaving ? "Saving..." : labels[language].save}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingResponse(null);
                                        setEditFormData({});
                                      }}
                                      className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition disabled:opacity-50"
                                      disabled={isSaving}
                                    >
                                      {labels[language].cancel}
                                    </button>
                                  </div>
                                </div>
                              )}
                              <div className="space-y-4">
                                {submission.responses
                                  ?.filter((response) => !response.isSubQuestion)
                                  .map((response, index) => (
                                    <div key={index} className="border-t pt-4">
                                      <div
                                        className="cursor-pointer flex items-center justify-between"
                                        onClick={() => toggleQuestion(submission._id, response.questionId)}
                                      >
                                        <span className="font-medium text-gray-700">{labels[language].question}:</span>
                                        <span className="ml-2">{response.questionText || "N/A"}</span>
                                        <span
                                          className={`transform transition-transform ${
                                            expandedQuestions[`${submission._id}_${response.questionId}`] ? "rotate-180" : ""
                                          }`}
                                        >
                                          ▼
                                        </span>
                                      </div>
                                      {expandedQuestions[`${submission._id}_${response.questionId}`] && (
                                        <div className="ml-4">
                                          <div className="mb-3">
                                            <span className="font-medium text-gray-700">{labels[language].answer}:</span>
                                            <span className="ml-2">{response.answer || "N/A"}</span>
                                          </div>
                                          {(response.images?.length > 0 || response.videos?.length > 0) && (
                                            <div className="mt-2">
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
                                          )}
                                          {submission.responses
                                            .filter(
                                              (subResp) => subResp.isSubQuestion && subResp.parentQuestionId === response.questionId
                                            )
                                            .map((subResponse, subIndex) => (
                                              <div key={subIndex} className="ml-6 border-l-2 border-blue-200 pl-4 mt-4">
                                                <div className="mb-3">
                                                  <span className="font-medium text-gray-700">{labels[language].question} (Subquestion):</span>
                                                  <span className="ml-2">{subResponse.questionText || "N/A"}</span>
                                                </div>
                                                <div className="mb-3">
                                                  <span className="font-medium text-gray-700">{labels[language].answer}:</span>
                                                  <span className="ml-2">{subResponse.answer || "N/A"}</span>
                                                </div>
                                                {(subResponse.images?.length > 0 || subResponse.videos?.length > 0) && (
                                                  <div className="mt-2">
                                                    {subResponse.images?.length > 0 && (
                                                      <div className="mb-3">
                                                        <span className="font-medium text-gray-700">{labels[language].images}:</span>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                          {subResponse.images.map((image, imgIndex) => (
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
                                                    {subResponse.videos?.length > 0 && (
                                                      <div>
                                                        <span className="font-medium text-gray-700">{labels[language].videos}:</span>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                          {subResponse.videos.map((video, vidIndex) => (
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
                                                )}
                                              </div>
                                            ))}
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

        <ImageModal src={selectedImage} alt={labels[language].submissionImage} onClose={() => setSelectedImage(null)} />
      </div>
    </div>
  );
};

export default Admin;