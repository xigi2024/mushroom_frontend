import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col, Container } from "react-bootstrap";
import "../styles/login.css";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        toast.success("Login successful!");
        setTimeout(() => navigate("/user-dashboard"), 1000);
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="login-container top pt-5">
      <ToastContainer position="top-right" autoClose={5000} />

      <Row className="login-card shadow p-0">
        {/* Left Side */}
        <Col md={6} className="login-left">
          <img
            src="https://i.pinimg.com/736x/c8/49/c7/c849c768b69aad92c49f990a1965ac8b.jpg"
            alt="Author"
            className="img-fluid mb-3"
            style={{ maxHeight: "500px" }}
          />
        </Col>

        {/* Right Side */}
        <Col md={6} className="login-right p-4">
          <h2 className="login-heading mb-3">Welcome back</h2>
          <p className="login-subtext mb-4">
            Welcome back! Please login to your account
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-input-group mb-3 position-relative">
              <label htmlFor="email" className="form-label fs-5">
                Email Address
              </label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <FiMail />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ps-5 pe-5 ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="login-input-group mb-3 position-relative">
              <label htmlFor="password" className="form-label fs-5">
                Password
              </label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <FiLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ps-5 pe-5 ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn border-0 bg-transparent position-absolute end-0 top-50 translate-middle-y me-3"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-muted" />
                  ) : (
                    <FiEye className="text-muted" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <p className="text-end mt-1">
              <span
                style={{ cursor: "pointer", fontSize: "0.9rem" }}
                onClick={() => navigate("/forgot-password")}
                className="color fw-semibold"
              >
                Forgot Password?
              </span>
            </p>

            <div className="text-center">
              <button
                type="submit"
                className="button p-2 border rounded w-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <span
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
              className="color fw-bold"
            >
              Register
            </span>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
