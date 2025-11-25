// components/IoTMonitoring.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, ProgressBar, Button, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { FiThermometer, FiDroplet, FiHome, FiMonitor, FiX, FiRefreshCw } from 'react-icons/fi';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useIoTKitVerification } from '../../hooks/useIoTKitVerification';

const API_BASE_URL = "https://mycomatrix.in/api";

const IoTMonitoring = ({ userRole = 'admin' }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, loading: authLoading } = useAuth();
  
  const { hasIoTKit, loading: verificationLoading, error: verificationError, userOrders } = useIoTKitVerification(token);

  const [activeSection, setActiveSection] = useState('iot-monitoring');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const [totalStats, setTotalStats] = useState({
    totalRooms: 0,
    totalSensors: 0,
  });

  const [newRoom, setNewRoom] = useState({
    name: '',
    kit_id: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // ✅ NEW: Check if user has rooms directly from API (bypass IoT kit verification)
  const [hasRoomsDirect, setHasRoomsDirect] = useState(false);

  console.log('🔍 IoT Kit Verification Status:', {
    hasIoTKit,
    verificationLoading,
    verificationError,
    user: user?.id,
    isAuthenticated
  });

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
      console.log('Fetching rooms with sensor data...');
      
      const response = await axios.get(`${API_BASE_URL}/rooms/my-rooms/`, {
        headers: getAuthHeaders()
      });
      
      console.log('✅ Rooms with sensor data:', response.data);
      
      if (response.data.success) {
        const roomsWithData = response.data.rooms;
        setRooms(roomsWithData);
        
        // ✅ NEW: Set hasRoomsDirect based on actual rooms data
        setHasRoomsDirect(roomsWithData.length > 0);
        
        const roomsWithSensors = roomsWithData.filter(room => room.latest_sensor_data);

        setTotalStats({
          totalRooms: roomsWithData.length,
          totalSensors: roomsWithSensors.length * 2,
        });

        return roomsWithData;
      }
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

  // ✅ Simple refresh function
  const handleRefresh = async () => {
    setRefreshLoading(true);
    await fetchRooms();
    setRefreshLoading(false);
    setFormSuccess('Rooms refreshed successfully!');
    setTimeout(() => setFormSuccess(''), 3000);
  };

  useEffect(() => {
    // ✅ UPDATED: Fetch rooms regardless of IoT kit verification
    // This allows users with existing rooms to access their data
    if (!verificationLoading) {
      console.log('Fetching rooms...');
      fetchRooms();
    }
  }, [verificationLoading]);

  // ✅ Handle Add Room with authentication
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    
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
        // Refresh rooms after adding new room
        fetchRooms();
      }, 1000);
    } catch (error) {
      console.error('❌ Error adding room:', error);
      if (error.response?.status === 401) {
        setFormError('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.response?.data?.error) {
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
      // Refresh rooms after deletion
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

  const getStatusBadge = (sensorData) => {
    if (!sensorData) {
      return { variant: 'secondary', text: 'No Data' };
    }

    const temp = sensorData.temperature;
    const humidity = sensorData.humidity;

    const isTempOptimal = temp >= 22 && temp <= 26;
    const isHumidityOptimal = humidity >= 75 && humidity <= 85;

    if (isTempOptimal && isHumidityOptimal) {
      return { variant: 'success', text: 'Optimal' };
    }

    const isTempCritical = temp < 17 || temp > 31;
    const isHumidityCritical = humidity < 70 || humidity > 90;

    if (isTempCritical || isHumidityCritical) {
      return { variant: 'danger', text: 'Critical' };
    }

    return { variant: 'warning', text: 'Warning' };
  };

  const getProgressVariant = (value, min, max) => {
    if (!value) return 'secondary';
    if (value >= min && value <= max) return 'success';
    if (value < min - 5 || value > max + 5) return 'danger';
    return 'warning';
  };

  // Show loading while checking authentication and IoT verification
  if (authLoading || verificationLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Verifying IoT access...</span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // ✅ UPDATED: Show purchase prompt ONLY if user doesn't have IoT kit AND doesn't have any rooms
  if (!hasIoTKit && !hasRoomsDirect && !verificationLoading && !loading) {
    return (
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />
        <div className="main-content">
          <div className="dashboard-content">
            <Container>
              <Row className="justify-content-start">
                <Col md={12} lg={12}>
                  <Card className="border-0 shadow-sm py-5">
                    <Card.Body>
                      <h3 className="text-warning mb-3">IoT Controller Required</h3>
                      <p className="text-muted mb-4">
                        You need to purchase an IoT Controller to access real-time monitoring features. 
                        Our IoT controllers provide accurate temperature, humidity, and environmental monitoring for optimal mushroom growth.
                      </p>
                      
                      <div className="mb-4">
                        <h5>Available IoT Controllers:</h5>
                        <ul className="list-unstyled text-start">
                          <li>✅ <strong>IOT CONTROLLER FOR (TEMPERATURE,HUMIDITY)</strong> - Basic monitoring</li>
                          <li>✅ <strong>IOT CONTROLLER (TEMPERATURE,HUMIDITY,CO2)</strong> - Advanced monitoring</li>
                          <li>✅ <strong>HUMIDIFIER</strong> - Climate control</li>
                        </ul>
                      </div>

                      <div className="mb-4 p-3 bg-light rounded">
                        <h6>Why IoT Monitoring?</h6>
                        <small className="text-muted">
                          • Real-time temperature & humidity tracking<br/>
                          • Automated climate control<br/>
                          • Historical data analysis<br/>
                          • Mobile alerts and notifications<br/>
                          • Optimal growth condition maintenance
                        </small>
                      </div>

                      {verificationError && (
                        <div className="alert alert-warning mb-3">
                          <small>Verification issue: {verificationError}</small>
                        </div>
                      )}

                      <div className="d-flex gap-3 justify-content-start">
                        <Button 
                          onClick={() => navigate('/products')}
                          className="button"
                        >
                          Buy IoT Controller Now
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (verificationError && !hasIoTKit && !hasRoomsDirect) {
    return (
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />
        <div className="main-content">
          <div className="dashboard-content">
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="text-center">
                <div className="text-danger mb-3">
                  <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4>Verification Failed</h4>
                <p className="text-muted mb-3">{verificationError}</p>
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while fetching rooms
  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />
        <div className="main-content">
          <div className="dashboard-content">
            <div className="d-flex justify-content-center align-items-center vh-100">
              <Spinner animation="border" variant="primary" />
              <span className="ms-2">Loading rooms...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ UPDATED: MAIN IOT MONITORING CONTENT 
  // Now shown if user has IoT kit OR has existing rooms
  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />

      <div className="main-content">
        <div className="dashboard-content">
          <div className='mb-4'>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h2 className="mb-1">IoT Monitoring</h2>
                <p className="text-muted mb-0">Real-time monitoring of all mushroom growing rooms</p>
                <small className="text-info">Welcome, {user?.name || user?.email}!</small>
                {/* ✅ NEW: Show access type */}
                {hasRoomsDirect && !hasIoTKit && (
                  <small className="text-warning d-block">
                    🔄 Accessing existing rooms (IoT kit verification pending)
                  </small>
                )}
              </div>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshLoading}
                className="d-flex align-items-center gap-1"
              >
                <FiRefreshCw className={refreshLoading ? 'spinner' : ''} />
                {refreshLoading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>
            <div className="mt-2">
              <Badge bg="info" className="me-2">
                Rooms: {totalStats.totalRooms}
              </Badge>
              <Badge bg="success" className="me-2">
                Sensors: {totalStats.totalSensors}
              </Badge>
              <small className="text-muted">
                Data updates automatically from IoT devices • Click refresh to get latest data
              </small>
            </div>
          </div>

          {formError && (
            <Alert variant="danger" className="mb-3">
              {formError}
            </Alert>
          )}

          {formSuccess && (
            <Alert variant="success" className="mb-3">
              {formSuccess}
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
          </Row>

          <div className='d-flex gap-4 mb-4 justify-content-between align-items-center'>
            <h3>Our Rooms</h3>
            <div className="d-flex gap-2">  
              <button className='button' onClick={() => setShowAddRoomModal(true)}>Add Room</button>
            </div>
          </div>

          {/* Room Cards */}
          <Row>
            {rooms.length === 0 ? (
              <Col className="text-center py-5">
                <p className="text-muted">No rooms found. Add your first room to get started.</p>
              </Col>
            ) : (
              rooms.map(roomData => {
                const room = roomData.room;
                const sensorData = roomData.latest_sensor_data;
                const currentTemp = sensorData?.temperature || room.temperature;
                const currentHumidity = sensorData?.humidity || room.humidity;
                
                return (
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
                          <Badge bg={getStatusBadge(sensorData).variant} className="px-3 py-2">
                            {getStatusBadge(sensorData).text}
                          </Badge>
                        </div>
                        <small className="text-muted">Kit ID: {room.kit_id}</small>
                      </Card.Header>
                      <Card.Body>
                        {/* Temperature */}
                        <div className="sensor-metric mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span><FiThermometer className="me-2 text-danger" />Temp</span>
                            <span>{currentTemp ? `${currentTemp}°C` : '--'}</span>
                          </div>
                          <ProgressBar 
                            now={currentTemp ? (currentTemp / 30) * 100 : 0} 
                            variant={getProgressVariant(currentTemp, 22, 26)} 
                          />
                          <small className="text-muted">Optimal: 22-26°C</small>
                        </div>

                        {/* Humidity */}
                        <div className="sensor-metric">
                          <div className="d-flex justify-content-between mb-1">
                            <span><FiDroplet className="me-2 text-info" />Humidity</span>
                            <span>{currentHumidity ? `${currentHumidity}%` : '--'}</span>
                          </div>
                          <ProgressBar 
                            now={currentHumidity || 0} 
                            variant={getProgressVariant(currentHumidity, 75, 85)} 
                          />
                          <small className="text-muted">Optimal: 75-85%</small>
                        </div>

                        {/* Last Updated */}
                        {sensorData && (
                          <div className="mt-3 pt-2 border-top">
                            <small className="text-muted">
                              Last updated: {new Date(sensorData.timestamp).toLocaleTimeString()}
                            </small>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
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