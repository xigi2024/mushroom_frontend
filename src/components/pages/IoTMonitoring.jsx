import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, ProgressBar, Button, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { FiThermometer, FiDroplet, FiWind, FiSun, FiAlertTriangle, FiHome, FiMonitor, FiX } from 'react-icons/fi';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = "https://mycomatrix.in/api";

const IoTMonitoring = ({ userRole = 'admin' }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, loading: authLoading } = useAuth();

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
    kit_id: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // ✅ Configure axios headers with auth token
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // ✅ Fetch rooms from backend with authentication
  const fetchRooms = async () => {
    if (!isAuthenticated || !token) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching rooms with token:', token);
      
      const response = await axios.get(`${API_BASE_URL}/rooms/list/`, {
        headers: getAuthHeaders()
      });
      
      console.log('Rooms fetched successfully:', response.data);
      setRooms(response.data);
      setTotalStats({
        totalRooms: response.data.length,
        totalSensors: response.data.length * 5,
        activeAlerts: response.data.filter(r => r.status === 'warning').length,
        offlineRooms: response.data.filter(r => r.status === 'critical').length
      });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      if (error.response?.status === 401) {
        console.log('Token expired, redirecting to login');
        navigate('/login');
      } else if (error.response?.status === 403) {
        setFormError('You do not have permission to access rooms');
      } else {
        setFormError('Failed to fetch rooms. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        navigate('/login');
      } else {
        console.log('User authenticated, fetching rooms...');
        fetchRooms();
      }
    }
  }, [isAuthenticated, authLoading, navigate]);

  // ✅ Handle Add Room with authentication - SIMPLIFIED
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    
    // Check authentication
    if (!isAuthenticated || !token) {
      setFormError('Authentication required. Please login again.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (!newRoom.name) {
      setFormError('Room name is required');
      return;
    }

    if (!newRoom.kit_id) {
      setFormError('Kit ID is required');
      return;
    }

    try {
      // ✅ IMPORTANT: Send ONLY name and kit_id
      // Backend will automatically assign user from token
      const roomData = {
        name: newRoom.name,
        kit_id: newRoom.kit_id
      };

      console.log('🚀 Sending room data to backend:', roomData);
      
      const response = await axios.post(`${API_BASE_URL}/rooms/create/`, roomData, {
        headers: getAuthHeaders()
      });
      
      console.log('✅ Room added successfully:', response.data);
      setFormSuccess('Room added successfully!');
      setFormError('');
      
      // Reset form
      setNewRoom({ 
        name: '', 
        kit_id: ''
      });
      
      setTimeout(() => {
        setShowAddRoomModal(false);
        setFormSuccess('');
        fetchRooms(); // Refresh list
      }, 1000);
    } catch (error) {
      console.error('❌ Error adding room:', error);
      if (error.response?.status === 401) {
        setFormError('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.response?.data?.error) {
        // Show backend error message (like "Kit ID already exists")
        setFormError(error.response.data.error);
      } else if (error.response?.data) {
        setFormError(error.response.data.message || 'Failed to add room');
      } else {
        setFormError('Failed to add room. Please try again.');
      }
    }
  };

  // ✅ Delete Room with authentication
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    
    if (!isAuthenticated || !token) {
      alert('Authentication required. Please login again.');
      navigate('/login');
      return;
    }

    try {
      console.log('Deleting room:', roomId);
      await axios.delete(`${API_BASE_URL}/rooms/delete/${roomId}/`, {
        headers: getAuthHeaders()
      });
      console.log('Room deleted successfully');
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else {
        alert(error.response?.data?.message || 'Failed to delete room');
      }
    }
  };

  // ✅ Handle Room Card Click
  const handleRoomClick = (room) => {
    navigate(`/room/${room.id}`, {
      state: {
        roomData: room
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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Checking authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading rooms...</span>
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
            <small className="text-info">Welcome, {user?.name || user?.email}!</small>


              {/* ✅ Add debug info */}
  <div className="mt-2 p-2 bg-light rounded">
    <small className="text-muted">
      Debug: User ID: {user?.id} | Email: {user?.email} | Token: {token ? 'Yes' : 'No'}
    </small>
  </div>

          </div>

          

          {formError && (
            <Alert variant="danger" className="mb-3">
              {formError}
            </Alert>
          )}

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
                  <div className="text-muted">Active Alerts</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm text-center py-4">
                <Card.Body>
                  <div className="text-danger mb-3"><FiWind size={32} /></div>
                  <div className="h3 text-danger mb-0">{totalStats.offlineRooms}</div>
                  <div className="text-muted">Offline Rooms</div>
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
            {rooms.length === 0 ? (
              <Col className="text-center py-5">
                <p className="text-muted">No rooms found. Add your first room to get started.</p>
              </Col>
            ) : (
              rooms.map(room => (
                <Col lg={4} md={6} className="mb-4" key={room.id}>
                  <Card
                    className="h-100 border-0 shadow-sm position-relative cursor-pointer"
                    onClick={() => handleRoomClick(room)}
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
              ))
            )}
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
            <Form.Group controlId="kitId" className="mb-3">
              <Form.Label>Kit ID *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Kit ID"
                name="kit_id"
                value={newRoom.kit_id}
                onChange={handleInputChange}
                className='px-2'
                required
              />
            </Form.Group>
            <Form.Group controlId="roomName" className="mb-3">
              <Form.Label>Room Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter room name"
                name="name"
                value={newRoom.name}
                onChange={handleInputChange}
                className='px-2'
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" className='text-white' onClick={() => setShowAddRoomModal(false)}>Cancel</Button>
              <Button type="submit" className='button'>Add Room</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default IoTMonitoring;