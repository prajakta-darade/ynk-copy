import { Routes, Route, Navigate } from "react-router-dom";
import ContactInfo from "../ContactInfo";
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

const AppRoutes = ({ language, toggleLanguage }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/contact-info" />} />
      <Route
        path="/contact-info"
        element={<ContactInfo language={language} toggleLanguage={toggleLanguage} />}
      />
      <Route
        path="/terms-and-condition"
        element={<TermsandCondition language={language} />}
      />
      <Route
        path="/shop-setup-checklist"
        element={<ShopSetupChecklistForm language={language} />}
      />
      <Route
        path="/dashboard"
        element={<Dashboard language={language} toggleLanguage={toggleLanguage} />}
      />
      <Route
        path="/online-survey"
        element={<OnlineSurveyForm language={language} toggleLanguage={toggleLanguage} />}
      />
      <Route
        path="/civil-work-checklist"
        element={<CivilWorkChecklistForm language={language} toggleLanguage={toggleLanguage} />}
      />
      <Route
        path="/shop-measurements"
        element={<ShopMeasurementsForm language={language} toggleLanguage={toggleLanguage} />}
      />
      <Route
        path="/service-process"
        element={<InternalDepartmentWorking language={language} toggleLanguage={toggleLanguage} />}
      />
      <Route
        path="/project-work-followup"
        element={<ProjectWorkFollowup language={language} toggleLanguage={toggleLanguage} />}
      />
      <Route
        path="/material-checklist"
        element={<MaterialChecklist language={language} toggleLanguage={toggleLanguage} />}
      />
      <Route
        path="/inspection-checklist"
        element={<InspectionChecklist language={language} toggleLanguage={toggleLanguage} />}
      />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
};

export default AppRoutes;
