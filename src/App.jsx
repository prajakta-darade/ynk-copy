import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./components/context/UserContext";
import AppRoutes from "./components/routing/AppRoutes";
import "./index.css";

function App() {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "mr" : "en"));
  };

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <AppRoutes language={language} toggleLanguage={toggleLanguage} />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
