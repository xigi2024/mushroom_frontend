import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Form, Button, Card } from "react-bootstrap";
import { FiMail } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Hardcoded demo response (simulating backend response)
      const demoResponse = {
        message: "Password reset link sent to your email",
        reset_link: "https://example.com/reset-password?token=demo_token_123",
        name: "Demo User",
        user_email: email
      };

      toast.success(demoResponse.message);

      // Simulate email sending (frontend only - no actual email sent)
      console.log("Simulating email sent to:", email);
      console.log("Reset link:", demoResponse.reset_link);
      console.log("Recipient name:", demoResponse.name);
      
      toast.info("Check your console for demo reset link details");
      
      setIsSubmitting(false);
    }, 2000); // 2 second delay to simulate network request
  };

  return (
    <div
      style={{
        background: "#f1f5f9",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <ToastContainer />
      <Card
        style={{
          maxWidth: "450px",
          width: "100%",
          padding: "30px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          border: "none"
        }}
      >
        <div className="text-center mb-4">
          <FiMail size={40} className="color mb-2" />
          <h3 className=" fw-semibold">Forgot Password?</h3>
          <p className="text-muted">We'll send you a reset link</p>
          
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              disabled={isSubmitting}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "12px" }}
            />
          </Form.Group>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-100"
            variant="primary"
            style={{ 
              padding: "12px", 
              backgroundColor: "#0d6efd",
              border: "none"
            }}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </Form>
        
      </Card>
    </div>
  );
};

export default ForgotPassword;