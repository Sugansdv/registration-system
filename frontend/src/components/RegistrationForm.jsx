import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/RegistrationForm.css";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(val => val.trim() !== "").length;
    setProgress(Math.floor((filledFields / totalFields) * 100));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const { confirmPassword, ...userData } = formData;
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, userData);
        if (res.status === 201) {
          setShowModal(true);
          setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setTimeout(() => setShowModal(false), 3000);
        }
      } catch (error) {
        if (error.response?.status === 409) {
          setErrors({ email: "Email already exists" });
        } else {
          alert("Error: " + error.message);
        }
      }
    }
  };

  return (
    <>
      <div className="card p-4 shadow animate-form" style={{ width: "100%", maxWidth: "500px", borderRadius: "10px" }}>
        <h3 className="text-center mb-4">REGISTRATION FORM</h3>

        {/* Progress bar */}
        <div className="progress mb-4">
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className={`form-control ${errors.fullName ? "is-invalid animate-shake" : ""}`}
              value={formData.fullName}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.fullName}</div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid animate-shake" : ""}`}
              value={formData.email}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.email}</div>
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`form-control ${errors.password ? "is-invalid animate-shake" : ""}`}
              value={formData.password}
              onChange={handleChange}
            />
            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-eye`}
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "10px", top: "38px", cursor: "pointer" }}
            ></i>
            <div className="invalid-feedback">{errors.password}</div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3 position-relative">
            <label className="form-label">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? "is-invalid animate-shake" : ""}`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <i
              className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} toggle-eye`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: "absolute", right: "10px", top: "38px", cursor: "pointer" }}
            ></i>
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          </div>

          <button type="submit" className="btn btn-danger w-100">REGISTER</button>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content animate-modal text-center">
            <i className="bi bi-check-circle-fill text-success mb-3" style={{ fontSize: "3rem" }}></i>
            <h4 className="text-success">Registration Successful</h4>
            <p>Thank you for registering.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrationForm;
