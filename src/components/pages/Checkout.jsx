import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'card'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Order placed successfully!');
    // Here you would typically handle the order processing
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Checkout</h2>
      
      <Row>
        {/* Shipping Information */}
        <Col md={8}>
          <Card className="p-4 mb-4">
            <h4 className="mb-4">Shipping Information</h4>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City *</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pincode *</Form.Label>
                    <Form.Control
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <h5 className="mt-4 mb-3">Payment Method</h5>
              <Form.Group className="mb-4">
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  label="Credit/Debit Card"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  label="UPI Payment"
                  value="upi"
                  checked={formData.paymentMethod === 'upi'}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  label="Cash on Delivery"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
              </Form.Group>
              
              <Button type="submit" variant="success" size="lg" className="w-100">
                Place Order
              </Button>
            </Form>
          </Card>
        </Col>
        
        {/* Order Summary */}
        <Col md={4}>
          <Card className="p-4">
            <h4 className="mb-4">Order Summary</h4>
            
            <div className="d-flex justify-content-between mb-3">
              <span>Button Mushroom Kit × 1</span>
              <span>₹280.00</span>
            </div>
            
            <hr />
            
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>₹280.00</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span className="text-success">FREE</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <span>Tax</span>
              <span>₹25.20</span>
            </div>
            
            <hr />
            
            <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
              <span>Total</span>
              <span>₹305.20</span>
            </div>
            
            <Alert variant="info" className="small">
              <strong>Free shipping</strong> on orders above ₹500
            </Alert>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;