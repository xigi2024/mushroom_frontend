import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);

    // 🟢 Dummy success message (no API)
    setTimeout(() => {
      toast.success("Password reset successful! (Demo Only)");
      setSubmitting(false);
      setPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  return (
    <div
      style={{
        background: "#f9fafb",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <ToastContainer />
      <Card style={{ width: "100%", maxWidth: 450, padding: 30 }}>
        <h3 className="text-center mb-4">Reset Your Password</h3>
        <Form onSubmit={handleReset}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={submitting}>
            {submitting ? "Resetting..." : "Reset Password"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
