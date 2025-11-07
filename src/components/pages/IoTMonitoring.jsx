import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, ProgressBar, Button, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { FiThermometer, FiDroplet, FiWind, FiSun, FiAlertTriangle, FiHome, FiMonitor, FiX } from 'react-icons/fi';
import Sidebar from '../Sidebar';
import axios from 'axios';

const API_BASE_URL = "https://mycomatrix.in/api";

const IoTMonitoring = ({ userRole = 'admin' }) => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('iot-monitoring');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalStats, setTotalStats] = useState({
    totalRooms: 0,
    totalSensors: 0,
    activeAlerts: 0,
    offlineRooms: 0
  });

  const [newRoom, setNewRoom] = useState({
    name: '',
    temperature: 23,
    humidity: 80,
    co2_level: 1000,
    light_intensity: 1200,
    status: 'optimal'
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // ✅ Fetch rooms from backend
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/rooms/list/`);
      setRooms(response.data);
      setTotalStats({
        totalRooms: response.data.length,
        totalSensors: response.data.length * 5,
        activeAlerts: response.data.filter(r => r.status === 'warning').length,
        offlineRooms: response.data.filter(r => r.status === 'critical').length
      });
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ✅ Handle Add Room
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.name) {
      setFormError('Room name is required');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/rooms/create/`, newRoom);
      setFormSuccess('Room added successfully!');
      setFormError('');
      setNewRoom({ name: '', temperature: 23, humidity: 80, co2_level: 1000, light_intensity: 1200, status: 'optimal' });
      setTimeout(() => {
        setShowAddRoomModal(false);
        setFormSuccess('');
        fetchRooms(); // ✅ Refresh list
      }, 1000);
    } catch (error) {
      console.error(error);
      setFormError('Failed to add room');
    }
  };

  // ✅ Delete Room
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/rooms/delete/${roomId}/`);
      fetchRooms(); // ✅ Refresh after delete
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room');
    }
  };

  // ✅ Handle Room Card Click - Navigate to Room Detail with room data
  const handleRoomClick = (room) => {
    navigate(`/room/${room.id}`, { 
      state: { 
        roomData: room // ✅ Pass entire room data to detail page
      }
    });
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />

      <div className="main-content">
        <div className="dashboard-content">
          <div className='mb-4'>
            <h2 className="mb-1">IoT Monitoring</h2>
            <p className="text-muted mb-0">Real-time monitoring of all mushroom growing rooms</p>
          </div>

          {/* Stats Overview */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center py-4">
                <Card.Body>
                  <div className="text-primary mb-3"><FiHome size={32} /></div>
                  <div className="h3 text-primary mb-0">{totalStats.totalRooms}</div>
                  <div className="text-muted">Total Rooms</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center py-4">
                <Card.Body>
                  <div className="text-success mb-3"><FiMonitor size={32} /></div>
                  <div className="h3 text-success mb-0">{totalStats.totalSensors}</div>
                  <div className="text-muted">Active Sensors</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center py-4">
                <Card.Body>
                  <div className="text-warning mb-3"><FiAlertTriangle size={32} /></div>
                  <div className="h3 text-warning mb-0">{totalStats.activeAlerts}</div>
                  <div className="text-muted">Active Rooms</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center py-4">
                <Card.Body>
                  <div className="text-danger mb-3"><FiWind size={32} /></div>
                  <div className="h3 text-danger mb-0">{totalStats.offlineRooms}</div>
                  <div className="text-muted">Deactive Rooms</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className='d-flex gap-4 mb-4 justify-content-between align-items-center'>
            <h3>Our Rooms</h3>
            <button className='button' onClick={() => setShowAddRoomModal(true)}>Add Room</button>
          </div>

          {/* Room Cards */}
          <Row>
            {rooms.map(room => (
              <Col lg={4} md={6} className="mb-4" key={room.id}>
                <Card 
                  className="h-100 border-0 shadow-sm position-relative cursor-pointer"
                  onClick={() => handleRoomClick(room)} // ✅ Pass entire room object
                  style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <FiX 
                    className="position-absolute top-0 end-0 m-2 text-danger cursor-pointer" 
                    size={20} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRoom(room.id);
                    }}
                    title="Delete Room"
                    style={{ 
                      cursor: 'pointer',
                      zIndex: 10,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      padding: '2px'
                    }}
                  />
                  <Card.Header className="bg-white border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">{room.name}</h6>
                      <Badge bg={getStatusBadge(room.status).variant} className="px-3 py-2">
                        {getStatusBadge(room.status).text}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {/* Temperature */}
                    <div className="sensor-metric mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span><FiThermometer className="me-2 text-danger" />Temp</span>
                        <span>{room.temperature}°C</span>
                      </div>
                      <ProgressBar now={(room.temperature / 30) * 100} variant={getProgressVariant(room.temperature, 22, 26)} />
                    </div>

                    {/* Humidity */}
                    <div className="sensor-metric mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span><FiDroplet className="me-2 text-info" />Humidity</span>
                        <span>{room.humidity}%</span>
                      </div>
                      <ProgressBar now={room.humidity} variant={getProgressVariant(room.humidity, 80, 90)} />
                    </div>

                    {/* CO2 */}
                    <div className="sensor-metric mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span><FiWind className="me-2 text-warning" />CO₂</span>
                        <span>{room.co2_level} ppm</span>
                      </div>
                      <ProgressBar now={(room.co2_level / 1500) * 100} variant={getProgressVariant(room.co2_level, 800, 1200)} />
                    </div>

                    {/* Light */}
                    <div className="sensor-metric">
                      <div className="d-flex justify-content-between mb-1">
                        <span><FiSun className="me-2 text-warning" />Light</span>
                        <span>{room.light_intensity} lux</span>
                      </div>
                      <ProgressBar now={(room.light_intensity / 1500) * 100} variant={getProgressVariant(room.light_intensity, 1000, 1400)} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Add Room Modal */}
      <Modal show={showAddRoomModal} onHide={() => setShowAddRoomModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

          <Form onSubmit={handleAddRoom}>
            <Form.Group controlId="roomName" className="mb-3">
              <Form.Label>Room Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter room name" 
                name="name"
                value={newRoom.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowAddRoomModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Add Room</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default IoTMonitoring;