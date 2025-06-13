import React from "react";
import { Link } from "react-router-dom";
import useCurrentTime from "../hook/useCurrentTime";
import logo from "../../assets/logo.png";
import {
  ClipboardList,
  Building2,
  Ruler,
  FileText,
  Settings,
  CheckSquare,
  Package,
  Search,
  Globe,
  Clock,
  ArrowRight,
  Menu,
  Bell,
  User,
} from "lucide-react";

const Dashboard = ({ language, toggleLanguage }) => {
  const { formatDateTime } = useCurrentTime();

  const menuItems = [
    {
      path: "/online-survey",
      titleEn: "Online Survey",
      titleMr: "ऑनलाइन सर्वेक्षण",
      icon: FileText,
      color: "bg-blue-500 hover:bg-blue-600",
      description:
        language === "en"
          ? "Conduct surveys and collect feedback"
          : "सर्वेक्षण करा आणि अभिप्राय गोळा करा",
    },
    {
      path: "/civil-work-checklist",
      titleEn: "Civil Work Checklist",
      titleMr: "सिव्हिल वर्क चेकलिस्ट",
      icon: Building2,
      color: "bg-green-500 hover:bg-green-600",
      description:
        language === "en"
          ? "Track civil construction progress"
          : "सिव्हिल बांधकाम प्रगती ट्रॅक करा",
    },
    {
      path: "/shop-measurements",
      titleEn: "Shop Measurements",
      titleMr: "शॉप मोजमाप",
      icon: Ruler,
      color: "bg-purple-500 hover:bg-purple-600",
      description:
        language === "en"
          ? "Record and manage shop dimensions"
          : "शॉप परिमाणे रेकॉर्ड आणि व्यवस्थापित करा",
    },
    {
      path: "/shop-setup-checklist",
      titleEn: "Shop Setup Checklist",
      titleMr: "शॉप सेटअप चेकलिस्ट",
      icon: CheckSquare,
      color: "bg-orange-500 hover:bg-orange-600",
      description:
        language === "en"
          ? "Complete shop setup requirements"
          : "शॉप सेटअप आवश्यकता पूर्ण करा",
    },
    {
      path: "/material-checklist",
      titleEn: "Material Checklist",
      titleMr: "साहित्य चेकलिस्ट",
      icon: Package,
      color: "bg-red-500 hover:bg-red-600",
      description:
        language === "en"
          ? "Manage material inventory"
          : "साहित्य यादी व्यवस्थापित करा",
    },
    {
      path: "/inspection-checklist",
      titleEn: "Inspection Checklist",
      titleMr: "तपासणी चेकलिस्ट",
      icon: Search,
      color: "bg-teal-500 hover:bg-teal-600",
      description:
        language === "en"
          ? "Perform quality inspections"
          : "गुणवत्ता तपासणी करा",
    },
  ];

  const quickStats = [
    {
      label: language === "en" ? "Active Projects" : "सक्रिय प्रकल्प",
      value: "12",
      change: "+2.5%",
      color: "text-blue-600",
    },
    {
      label: language === "en" ? "Completed Tasks" : "पूर्ण कार्ये",
      value: "48",
      change: "+12%",
      color: "text-green-600",
    },
    {
      label: language === "en" ? "Pending Reviews" : "प्रलंबित पुनरावलोकने",
      value: "6",
      change: "-8%",
      color: "text-orange-600",
    },
    {
      label: language === "en" ? "Total Surveys" : "एकूण सर्वेक्षणे",
      value: "156",
      change: "+18%",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Main Container - Centered and Rounded */}
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-15 h-15 rounded-lg flex items-center justify-center p-1">
                    <img
                      src={logo}
                      alt="YNK Logo"
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      YNK Dashboard
                    </h1>
                    <p className="text-sm text-gray-500">
                      {language === "en"
                        ? "Project Management System"
                        : "प्रकल्प व्यवस्थापन प्रणाली"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span>{formatDateTime(language)}</span>
                </div>

                <button
                  onClick={toggleLanguage}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === "en" ? "मराठी" : "English"}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">
                  {language === "en" ? "Welcome Back!" : "पुन्हा स्वागत आहे!"}
                </h2>
                <p className="text-blue-100 text-lg">
                  {language === "en"
                    ? "Manage your projects efficiently with our comprehensive dashboard"
                    : "आमच्या सर्वसमावेशक डॅशबोर्डसह आपले प्रकल्प कार्यक्षमतेने व्यवस्थापित करा"}
                </p>
              </div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
              <div className="absolute bottom-0 right-8 -mb-8 w-32 h-32 bg-white opacity-5 rounded-full"></div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`text-sm font-medium ${stat.color}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Navigation Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {language === "en" ? "Quick Actions" : "द्रुत क्रिया"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className="group bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`${item.color} p-3 rounded-lg transition-colors`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                          {language === "en" ? item.titleEn : item.titleMr}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-700 font-medium group-hover:text-gray-900">
                          <span>{language === "en" ? "Open" : "उघडा"}</span>
                          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Additional Links Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {language === "en" ? "Recent Activities" : "अलीकडील क्रियाकलाप"}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {language === "en"
                      ? "Survey completed for Project A"
                      : "प्रकल्प A साठी सर्वेक्षण पूर्ण"}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {language === "en"
                      ? "New measurement added"
                      : "नवीन मोजमाप जोडले"}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {language === "en"
                      ? "Inspection pending review"
                      : "तपासणी पुनरावलोकन प्रलंबित"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {language === "en" ? "Quick Links" : "द्रुत दुवे"}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/service-process"
                  className="flex items-center space-x-2 p-3 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>
                    {language === "en" ? "Service Process" : "सेवा प्रक्रिया"}
                  </span>
                </Link>
                <Link
                  to="/project-work-followup"
                  className="flex items-center space-x-2 p-3 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>{language === "en" ? "Follow-up" : "पाठपुरावा"}</span>
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 p-3 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>
                    {language === "en" ? "Admin Panel" : "प्रशासक पॅनेल"}
                  </span>
                </Link>
                <Link
                  to="/terms-and-condition"
                  className="flex items-center space-x-2 p-3 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>{language === "en" ? "Terms" : "अटी"}</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
