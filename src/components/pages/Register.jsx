import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/register.css";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Row, Col } from 'react-bootstrap';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Enter valid email';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (formData.phone.replace(/\D/g, '').length !== 10) newErrors.phone = 'Enter valid 10-digit phone number';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!formData.confirm_password) newErrors.confirm_password = 'Confirm password';
    else if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { alert('Please fix the form errors'); return; }

    setIsSubmitting(true);

    try {
      const res = await axios.post("https://mycomatrix.in/api/register/", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (res.data.success) {
        setSuccess(true);
        alert("Registration successful!");
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          password: '',
          confirm_password: '',
        });
        navigate("/login");
      }
    } catch (error) {
      alert("Server error during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <Row className="register-card">
          {/* Image Section - col-md-4 */}
          <Col md={4} className="register-left p-0">
            <img
              src="/assets/register.jpg"
              alt="Register"
              className="register-img w-100 h-100 object-fit-cover"
              style={{ objectFit: 'cover', height: '100%' }}
            />
          </Col>

          {/* Form Section - col-md-8 */}
          <Col md={8} className="register-right">
            {success && (
              <div className="alert alert-success mb-3">
                <strong>🎉 Registration Successful!</strong>
              </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* First & Last Name */}
              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <label>First name</label>
                    <div className="input-with-icon">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        name="first_name"
                        placeholder="First name"
                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                        value={formData.first_name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.first_name && <div className="error-text">{errors.first_name}</div>}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="form-group">
                    <label>Last name</label>
                    <div className="input-with-icon">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Last name"
                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                        value={formData.last_name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.last_name && <div className="error-text">{errors.last_name}</div>}
                  </div>
                </Col>
              </Row>

              {/* Email & Phone */}
              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <label>Email address</label>
                    <div className="input-with-icon">
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        placeholder="yourmail@example.com"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && <div className="error-text">{errors.email}</div>}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="form-group">
                    <label>Phone number</label>
                    <div className="input-with-icon">
                      <FiPhone className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 9876 543 210"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.phone && <div className="error-text">{errors.phone}</div>}
                  </div>
                </Col>
              </Row>

              {/* Password & Confirm Password */}
              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <label>Create password</label>
                    <div className="input-with-icon">
                      <FiLock className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                    {errors.password && <div className="error-text">{errors.password}</div>}
                    <div className="password-hint">Your password must be a minimum of 6 characters</div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="form-group">
                    <label>Repeat password</label>
                    <div className="input-with-icon">
                      <FiLock className="input-icon" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        placeholder="••••••••"
                        className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                        value={formData.confirm_password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                    {errors.confirm_password && <div className="error-text">{errors.confirm_password}</div>}
                  </div>
                </Col>
              </Row>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="login-redirect text-decoration-none">
              Already a user? <a href="/login">Login</a>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Register;