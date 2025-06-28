import { Routes, Route, Navigate } from "react-router-dom";
import ContactInfo from "../ContactInfo";
import LoginForms from "../LoginFroms";
import TermsandCondition from "../TermsandCondition/TermsandCondition";
import ShopSetupChecklistForm from "../ShopSetupChecklistForm/ShopSetupChecklistForm";
import OnlineSurveyForm from "../OnlineSurveyForm/OnlineSurveyForm";
import CivilWorkChecklistForm from "../CivilWorkChecklistForm/CivilWorkChecklistForm";
import InternalDepartmentWorking from "../InternalDeprmentWorking/InternalDepermentWorking";
import MaterialChecklist from "../MaterialChecklist/MaterialChecklist";
import ShopMeasurementsForm from "../ShopMeasurementsForm/ShopMeasurementsForm";
import InspectionChecklist from "../InspectionChecklist/InspectionChecklist";
import ProjectWorkFollowup from "../ProjectWorkFollowup/ProjectWorkFollowup";
import Dashboard from "../dashboard/Dashboard";
import Admin from "../Admin";
import ForgotPassword from "../ForgotPassword";

import { useUser } from "../context/UserContext";
const AppRoutes = ({ language, toggleLanguage }) => {
  const { user } = useUser();

  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to={user.isAuthenticated ? "/dashboard" : "/login"} />} />

      {/* Public routes (no authentication required) */}
      <Route
        path="/contact-info"
        element={<ContactInfo language={language} toggleLanguage={toggleLanguage} />}
      />
      <Route
        path="/login"
        element={!user.isAuthenticated ? <LoginForms language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/forgot-password"
        element={!user.isAuthenticated ? <ForgotPassword language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/dashboard" />}
      />

      {/* Authenticated routes */}
      <Route
        path="/dashboard"
        element={user.isAuthenticated ? <Dashboard language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/login" />}
      />
      <Route
        path="/terms-and-condition"
        element={user.isAuthenticated ? <TermsandCondition language={language} /> : <Navigate to="/login" />}
      />
      <Route
        path="/shop-setup-checklist"
        element={user.isAuthenticated ? <ShopSetupChecklistForm language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/login" />}
      />
      <Route
        path="/online-survey"
        element={user.isAuthenticated ? <OnlineSurveyForm language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/login" />}
      />
      <Route
        path="/civil-work-checklist"
        element={user.isAuthenticated ? <CivilWorkChecklistForm language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/login" />}
      />
      <Route
        path="/shop-measurements"
        element={user.isAuthenticated ? <ShopMeasurementsForm language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/login" />}
      />
      <Route
        path="/service-process"
        element={user.isAuthenticated ? <InternalDepartmentWorking language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/login" />}
      />
      <Route
        path="/project-work-followup"
        element={user.isAuthenticated ? <ProjectWorkFollowup language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/login" />}
      />
      <Route
        path="/material-checklist"
        element={user.isAuthenticated ? <MaterialChecklist language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/login" />}
      />
      <Route
        path="/inspection-checklist"
        element={user.isAuthenticated ? <InspectionChecklist language={language} toggleLanguage={toggleLanguage} /> : <Navigate to="/login" />}
      />

      {/* Admin-only route */}
      <Route
        path="/admin"
        element={
          user.isAuthenticated && user.role === "admin" ? (
            <Admin language={language} toggleLanguage={toggleLanguage} />
          ) : (
            <Navigate to={user.isAuthenticated ? "/dashboard" : "/login"} />
          )
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to={user.isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default AppRoutes;