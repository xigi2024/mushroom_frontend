import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';

const AddRoom = ({ rooms, setRooms }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    temperature: 23,
    humidity: 80,
    co2Level: 1000,
    lightIntensity: 1200,
    status: 'optimal'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      setError('Room name is required.');
      return;
    }

    const newRoom = {
      id: rooms.length + 1,
      ...formData,
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      co2Level: parseFloat(formData.co2Level),
      lightIntensity: parseFloat(formData.lightIntensity)
    };

    setRooms([...rooms, newRoom]);
    setSuccess('Room added successfully!');

    setFormData({
      name: '',
      temperature: 23,
      humidity: 80,
      co2Level: 1000,
      lightIntensity: 1200,
      status: 'optimal'
    });

    setTimeout(() => {
      navigate('/iot-monitoring');
    }, 2000);
  };

  return (
    <div className="dashboard-container d-flex">
      <Sidebar activeSection="iot-monitoring" />

      <div className="main-content flex-grow-1 p-4">
        <h3 className="mb-3">Add New Room</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card className="shadow-sm border-0">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="roomName">
                    <Form.Label>Room Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter room name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="optimal">Optimal</option>
                      <option value="warning">Warning</option>
                      <option value="critical">Critical</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group controlId="temperature">
                    <Form.Label>Temperature (°C)</Form.Label>
                    <Form.Control
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="humidity">
                    <Form.Label>Humidity (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="co2Level">
                    <Form.Label>CO2 Level (ppm)</Form.Label>
                    <Form.Control
                      type="number"
                      name="co2Level"
                      value={formData.co2Level}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="lightIntensity">
                    <Form.Label>Light Intensity (lux)</Form.Label>
                    <Form.Control
                      type="number"
                      name="lightIntensity"
                      value={formData.lightIntensity}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-end">
                <Button variant="primary" type="submit">
                  Add Room
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AddRoom;
