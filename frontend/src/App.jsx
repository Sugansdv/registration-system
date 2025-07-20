import React from "react";
import RegistrationForm from "./components/RegistrationForm";

const App = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(to right, #00c6ff, #bc00dd)",
      }}
    >
      <RegistrationForm />
    </div>
  );
};

export default App;
