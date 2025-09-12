import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, ProgressBar, Button, Alert, Modal, Form } from 'react-bootstrap';
import { FiThermometer, FiDroplet, FiWind, FiSun, FiAlertTriangle, FiPlus, FiSettings, FiHome, FiMonitor, FiX } from 'react-icons/fi';
import Sidebar from '../Sidebar';

const IoTMonitoring = ({ userRole = 'admin' }) => {
  const navigate = useNavigate();
  
  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };
  
  const [activeSection, setActiveSection] = useState('iot-monitoring');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: 'Shiitake Growing Room',
      temperature: 23,
      humidity: 83,
      co2Level: 950,
      lightIntensity: 1200,
      status: 'optimal'
    },
    {
      id: 2,
      name: 'Room Name',
      temperature: 25,
      humidity: 78,
      co2Level: 1100,
      lightIntensity: 1350,
      status: 'warning'
    },
    {
      id: 3,
      name: 'Room Name',
      temperature: 21,
      humidity: 85,
      co2Level: 1200,
      lightIntensity: 1150,
      status: 'optimal'
    },
    {
      id: 4,
      name: 'Room Name',
      temperature: 24,
      humidity: 82,
      co2Level: 1050,
      lightIntensity: 1300,
      status: 'optimal'
    },
    {
      id: 5,
      name: 'Room Name',
      temperature: 26,
      humidity: 76,
      co2Level: 1150,
      lightIntensity: 1250,
      status: 'warning'
    },
  ]);

  const [totalStats, setTotalStats] = useState({
    totalRooms: 20,
    totalSensors: 1893,
    activeAlerts: 18,
    offlineRooms: 2
  });

  // Add Room Form State
  const [newRoom, setNewRoom] = useState({
    name: '',
    temperature: 23,
    humidity: 80,
    co2Level: 1000,
    lightIntensity: 1200,
    status: 'optimal'
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({
      ...newRoom,
      [name]: value
    });
  };

  // Handle form submission
  const handleAddRoom = (e) => {
    e.preventDefault();
    
    if (!newRoom.name) {
      setFormError('Room name is required');
      return;
    }
    
    const roomToAdd = {
      id: rooms.length + 1,
      name: newRoom.name,
      temperature: parseFloat(newRoom.temperature),
      humidity: parseFloat(newRoom.humidity),
      co2Level: parseFloat(newRoom.co2Level),
      lightIntensity: parseFloat(newRoom.lightIntensity),
      status: newRoom.status
    };
    
    setRooms([...rooms, roomToAdd]);
    setFormSuccess('Room added successfully!');
    
    // Reset form
    setNewRoom({
      name: '',
      temperature: 23,
      humidity: 80,
      co2Level: 1000,
      lightIntensity: 1200,
      status: 'optimal'
    });
    
    // Close modal after 2 seconds
    setTimeout(() => {
      setShowAddRoomModal(false);
      setFormSuccess('');
    }, 2000);
  };

  // Simulate real-time IoT data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms(prevRooms => 
        prevRooms.map(room => ({
          ...room,
          temperature: Math.round((room.temperature + (Math.random() - 0.5) * 2) * 10) / 10,
          humidity: Math.round(Math.max(60, Math.min(90, room.humidity + (Math.random() - 0.5) * 3)) * 10) / 10,
          co2Level: Math.round(Math.max(600, Math.min(1500, room.co2Level + (Math.random() - 0.5) * 50)) * 10) / 10,
          lightIntensity: Math.round(Math.max(800, Math.min(1500, room.lightIntensity + (Math.random() - 0.5) * 100)) * 10) / 10,
          status: getRandomStatus()
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRandomStatus = () => {
    const statuses = ['optimal', 'warning', 'critical'];
    const weights = [0.7, 0.2, 0.1];
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) return statuses[i];
    }
    return 'optimal';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      optimal: { variant: 'success', text: 'Optimal' },
      warning: { variant: 'warning', text: 'Warning' },
      critical: { variant: 'danger', text: 'Critical' }
    };
    return statusConfig[status] || { variant: 'secondary', text: status };
  };

  const getProgressVariant = (value, min, max) => {
    if (value >= min && value <= max) return 'success';
    if (value < min - 5 || value > max + 5) return 'danger';
    return 'warning';
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />
      
      <div className="main-content">
        
        <div className="dashboard-content">
          <div className='mb-4'> <h2 className="mb-1">IoT Monitoring</h2>
          <p className="text-muted mb-0">Real-time monitoring of all mushroom growing rooms</p>
     </div>
       
          {/* Stats Overview */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-primary mb-3">
                    <FiHome size={32} />
                  </div>
                  <div className="h3 text-primary mb-0">{totalStats.totalRooms}</div>
                  <div className="text-muted">Total Rooms</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-success mb-3">
                    <FiMonitor size={32} />
                  </div>
                  <div className="h3 text-success mb-0">{totalStats.totalSensors}</div>
                  <div className="text-muted">Active Sensors</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-warning mb-3">
                    <FiAlertTriangle size={32} />
                  </div>
                  <div className="h3 text-warning mb-0">{totalStats.activeAlerts}</div>
                  <div className="text-muted">Active Rooms</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-danger mb-3">
                    <FiWind size={32} />
                  </div>
                  <div className="h3 text-danger mb-0">{totalStats.offlineRooms}</div>
                  <div className="text-muted">Deactive Rooms</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className='d-flex gap-4 mb-4 justify-content-end align-items-center'>
            <button 
              className='button'
              onClick={() => setShowAddRoomModal(true)}
            >
              Add Room
            </button>

            <button 
              className='btn btn-outline-secondary rounded px-3 py-2'
              onClick={() => navigate('/settings')}
            >
              Settings
            </button>
          </div>

          {/* Room Grid */}
          <Row>
            {rooms.map(room => (
              <Col lg={4} md={6} className="mb-4" key={room.id}>
                <Card 
                  className="mb-4 room-card h-100 border-0 shadow-sm"
                  onClick={() => handleRoomClick(room.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Header className="bg-white border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">{room.name}</h6>
                      <Badge bg={getStatusBadge(room.status).variant} className="px-3 py-2">
                        {getStatusBadge(room.status).text}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body className="pt-3">
                    {/* Temperature */}
                    <div className="sensor-metric mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <FiThermometer className="me-2 text-danger" size={18} />
                          <span className="fw-medium">Temperature</span>
                        </div>
                        <span className="text-end fw-bold">{room.temperature}°C</span>
                      </div>
                      <ProgressBar 
                        now={(room.temperature / 30) * 100} 
                        variant={getProgressVariant(room.temperature, 22, 26)}
                        className="mb-1"
                        style={{ height: '6px' }}
                      />
                      <small className="text-muted">Optimal: 22-26°C</small>
                    </div>

                    {/* Humidity */}
                    <div className="sensor-metric mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <FiDroplet className="me-2 text-info" size={18} />
                          <span className="fw-medium">Humidity</span>
                        </div>
                        <span className="text-end fw-bold">{room.humidity.toFixed(1)}%</span>
                      </div>
                      <ProgressBar 
                        now={room.humidity} 
                        variant={getProgressVariant(room.humidity, 80, 90)}
                        className="mb-1"
                        style={{ height: '6px' }}
                      />
                      <small className="text-muted">Optimal: 80-90%</small>
                    </div>

                    {/* CO2 Level */}
                    <div className="sensor-metric mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <FiWind className="me-2 text-warning" size={18} />
                          <span className="fw-medium">CO2 Level</span>
                        </div>
                        <span className="text-end fw-bold">{room.co2Level.toFixed(1)} ppm</span>
                      </div>
                      <ProgressBar 
                        now={(room.co2Level / 1500) * 100} 
                        variant={getProgressVariant(room.co2Level, 800, 1200)}
                        className="mb-1"
                        style={{ height: '6px' }}
                      />
                      <small className="text-muted">Optimal: 800-1200 ppm</small>
                    </div>

                    {/* Light Intensity */}
                    <div className="sensor-metric mb-0">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <FiSun className="me-2 text-warning" size={18} />
                          <span className="fw-medium">Light Intensity</span>
                        </div>
                        <span className="text-end fw-bold">{room.lightIntensity.toFixed(1)} lux</span>
                      </div>
                      <ProgressBar 
                        now={(room.lightIntensity / 1500) * 100} 
                        variant={getProgressVariant(room.lightIntensity, 1000, 1400)}
                        className="mb-1"
                        style={{ height: '6px' }}
                      />
                      <small className="text-muted">Optimal: 1000-1400 lux</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Alerts Section */}
          <Row className="mt-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h6 className="mb-0 fw-bold">Recent Alerts</h6>
                </Card.Header>
                <Card.Body>
                  <Alert variant="warning" className="d-flex align-items-center mb-3">
                    <FiAlertTriangle className="me-2" />
                    <div>
                      <strong>High CO2 Level Warning</strong> - Room 7: CO2 level has reached 1300 ppm, approaching critical threshold.
                      <small className="d-block text-muted mt-1">2 minutes ago</small>
                    </div>
                  </Alert>
                  <Alert variant="info" className="d-flex align-items-center mb-3">
                    <FiThermometer className="me-2" />
                    <div>
                      <strong>Temperature Fluctuation</strong> - Room 2: Temperature has been fluctuating between 24-26°C in the last hour.
                      <small className="d-block text-muted mt-1">15 minutes ago</small>
                    </div>
                  </Alert>
                  <Alert variant="secondary" className="d-flex align-items-center mb-0">
                    <FiDroplet className="me-2" />
                    <div>
                      <strong>Humidity Adjustment</strong> - Room 5: Humidity system automatically adjusted to maintain optimal levels.
                      <small className="d-block text-muted mt-1">1 hour ago</small>
                    </div>
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Add Room Modal */}
      <Modal show={showAddRoomModal} onHide={() => setShowAddRoomModal(false)} size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
          
          <Form onSubmit={handleAddRoom}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="roomName">
                  <Form.Label>Room Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter room name"
                    name="name"
                    value={newRoom.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={newRoom.status}
                    onChange={handleInputChange}
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
                    value={newRoom.temperature}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="humidity">
                  <Form.Label>Humidity (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="humidity"
                    value={newRoom.humidity}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="co2Level">
                  <Form.Label>CO2 Level (ppm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="co2Level"
                    value={newRoom.co2Level}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="lightIntensity">
                  <Form.Label>Light Intensity (lux)</Form.Label>
                  <Form.Control
                    type="number"
                    name="lightIntensity"
                    value={newRoom.lightIntensity}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end mt-4">
              <Button variant="outline-secondary" className="me-2" onClick={() => setShowAddRoomModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Room
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default IoTMonitoring;