import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge, ProgressBar, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiThermometer, FiDroplet, FiWind, FiSun, FiClock, FiActivity, FiArrowLeft } from 'react-icons/fi';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = "https://mycomatrix.in/api";

const RoomDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  
  const [sensorData, setSensorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [activeSection, setActiveSection] = useState('iot-monitoring');

  // ✅ Configure axios headers with auth token
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // ✅ Fetch room details with sensor data
  const fetchRoomData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // ✅ Get room data from navigation state
      const roomDataFromState = location.state?.roomData;
      
      if (roomDataFromState) {
        console.log('📦 Room data from state:', roomDataFromState);
        
        // ✅ Use actual room data from IoTMonitoring
        const roomResponse = {
          id: roomDataFromState.id,
          name: roomDataFromState.name,
          kit_id: roomDataFromState.kit_id,
          status: roomDataFromState.status || 'optimal',
          type: 'Shiitake',
          capacity: '500kg',
          lastUpdated: new Date().toISOString(),
          currentStats: {
            temperature: roomDataFromState.temperature || 23,
            humidity: roomDataFromState.humidity || 80,
            co2: roomDataFromState.co2_level || 1000,
            light: roomDataFromState.light_intensity || 1200
          }
        };
        
        setRoomInfo(roomResponse);
        
        // ✅ Try to fetch real sensor data from API
        try {
          console.log('🔍 Fetching sensor data for kit_id:', roomDataFromState.kit_id);
          const sensorResponse = await axios.get(
            `${API_BASE_URL}/rooms/kit/${roomDataFromState.kit_id}/`,
            { headers: getAuthHeaders() }
          );
          
          console.log('✅ Real sensor data:', sensorResponse.data);
          
          if (sensorResponse.data.success && sensorResponse.data.latest_sensor_data) {
            // ✅ Use real sensor data
            const realData = sensorResponse.data.latest_sensor_data;
            setSensorData([{
              time: new Date().toLocaleTimeString(),
              temperature: realData.temperature,
              humidity: realData.humidity,
              co2: realData.co2 || 1000,
              light: realData.light || 1200
            }]);
          } else {
            // ✅ Fallback to mock data
            console.log('📊 Using mock data - no real sensor data available');
            const mockData = generateMockData(
              roomDataFromState.temperature || 23,
              roomDataFromState.humidity || 80,
              roomDataFromState.co2_level || 1000,
              roomDataFromState.light_intensity || 1200
            );
            setSensorData(mockData);
          }
        } catch (sensorError) {
          console.log('❌ Sensor API error, using mock data:', sensorError);
          // ✅ Fallback to mock data if API fails
          const mockData = generateMockData(
            roomDataFromState.temperature || 23,
            roomDataFromState.humidity || 80,
            roomDataFromState.co2_level || 1000,
            roomDataFromState.light_intensity || 1200
          );
          setSensorData(mockData);
        }
      } else {
        // ✅ If no state data, try to fetch from API using room ID
        console.log('🔍 No state data, fetching from API with room ID:', id);
        try {
          const roomResponse = await axios.get(
            `${API_BASE_URL}/rooms/detail/${id}/`,
            { headers: getAuthHeaders() }
          );
          
          console.log('✅ Room data from API:', roomResponse.data);
          setRoomInfo({
            ...roomResponse.data,
            currentStats: {
              temperature: roomResponse.data.temperature || 23,
              humidity: roomResponse.data.humidity || 80,
              co2: roomResponse.data.co2_level || 1000,
              light: roomResponse.data.light_intensity || 1200
            }
          });
          
          // Generate mock data based on room data
          const mockData = generateMockData(
            roomResponse.data.temperature || 23,
            roomResponse.data.humidity || 80,
            roomResponse.data.co2_level || 1000,
            roomResponse.data.light_intensity || 1200
          );
          setSensorData(mockData);
        } catch (apiError) {
          console.error('❌ API Error:', apiError);
          setError('Failed to load room data from server.');
        }
      }
      
    } catch (err) {
      console.error('❌ Error fetching room data:', err);
      setError('Failed to load room data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Mock data generator (fallback)
  const generateMockData = (baseTemp, baseHumidity, baseCO2, baseLight) => {
    const data = [];
    const timeSlots = [
      '08:22 AM', '09:22 AM', '10:22 AM', '11:22 AM', '12:22 PM',
      '01:22 PM', '02:22 PM', '03:22 PM', '04:22 PM', '05:22 PM',
      '06:22 PM', '07:22 PM', '08:22 PM'
    ];
    
    timeSlots.forEach((time, index) => {
      data.push({
        time: time,
        temperature: Math.round((Math.random() * 3) + (baseTemp - 1)),
        humidity: Math.round((Math.random() * 10) + (baseHumidity - 5)),
        co2: Math.round((Math.random() * 200) + (baseCO2 - 100)),
        light: Math.round((Math.random() * 300) + (baseLight - 150))
      });
    });
    return data;
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }
    
    fetchRoomData();
    
    // Set up polling every 2 minutes for real-time updates
    const interval = setInterval(fetchRoomData, 120000);
    
    return () => clearInterval(interval);
  }, [id, location.state, isAuthenticated, token, navigate]);

  // ✅ Handle back to monitoring page
  const handleBackClick = () => {
    navigate('/iot-monitoring');
  };

  // ✅ Refresh sensor data
  const handleRefresh = () => {
    fetchRoomData();
  };

  // Render different chart types
  const renderChart = (dataKey, color, name, unit = '', chartType = 'line') => {
    const ChartComponent = chartType === 'area' ? AreaChart : chartType === 'bar' ? BarChart : LineChart;
    const DataComponent = chartType === 'area' ? Area : chartType === 'bar' ? Bar : Line;

    return (
      <Card className="mb-4 chart-card border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom-0 pb-2">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">{name}</h6>
            <Badge bg="light" text="dark" className="px-2 py-1">
              {sensorData.length > 0 && `${sensorData[sensorData.length - 1][dataKey]}${unit}`}
            </Badge>
          </div>
        </Card.Header>  
        <Card.Body className="pt-0">
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ChartComponent
                data={sensorData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip 
                  formatter={(value) => [`${value}${unit}`, name]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <DataComponent
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  fill={chartType === 'area' ? `${color}20` : undefined}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4, fill: color }}
                  name={name}
                />
              </ChartComponent>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderCurrentStats = () => (
    <Row className="mb-4 g-3">
      <Col md={3} sm={6}>
        <Card className="stat-card h-100 border-0 shadow-sm">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">
                <FiThermometer size={20} className="text-danger" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Temperature</h6>
                <h4 className="text-danger mb-0">
                  {roomInfo?.currentStats?.temperature || '--'}°C
                </h4>
              </div>
            </div>
            <ProgressBar 
              now={((roomInfo?.currentStats?.temperature - 20) / 10) * 100} 
              variant="danger"
              className="mb-1"
              style={{ height: '6px' }}
            />
            <small className="text-muted">Optimal: 22-26°C</small>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6}>
        <Card className="stat-card h-100 border-0 shadow-sm">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                <FiDroplet size={20} className="text-info" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Humidity</h6>
                <h4 className="text-info mb-0">
                  {roomInfo?.currentStats?.humidity || '--'}%
                </h4>
              </div>
            </div>
            <ProgressBar 
              now={roomInfo?.currentStats?.humidity} 
              variant="info"
              className="mb-1"
              style={{ height: '6px' }}
            />
            <small className="text-muted">Optimal: 60-80%</small>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6}>
        <Card className="stat-card h-100 border-0 shadow-sm">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                <FiWind size={20} className="text-success" />
              </div>
              <div>
                <h6 className="text-muted mb-0">CO₂ Level</h6>
                <h4 className="text-success mb-0">
                  {roomInfo?.currentStats?.co2 || '--'}ppm
                </h4>
              </div>
            </div>
            <ProgressBar 
              now={(roomInfo?.currentStats?.co2 / 1500) * 100} 
              variant="success"
              className="mb-1"
              style={{ height: '6px' }}
            />
            <small className="text-muted">Optimal: 800-1300ppm</small>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6}>
        <Card className="stat-card h-100 border-0 shadow-sm">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                <FiSun size={20} className="text-warning" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Light Intensity</h6>
                <h4 className="text-warning mb-0">
                  {roomInfo?.currentStats?.light || '--'}lux
                </h4>
              </div>
            </div>
            <ProgressBar 
              now={(roomInfo?.currentStats?.light / 1500) * 100} 
              variant="warning"
              className="mb-1"
              style={{ height: '6px' }}
            />
            <small className="text-muted">Optimal: 800-1300lux</small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="main-content">
          <div className="dashboard-content">
            <div className="text-center my-5">
              <Spinner animation="border" role="status" className="mb-3">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Loading room sensor data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="main-content">
          <div className="dashboard-content">
            <Alert variant="danger" className="my-4">
              {error}
            </Alert>
            <Button variant="primary" onClick={handleBackClick}>
              <FiArrowLeft className="me-2" />
              Back to Monitoring
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!roomInfo) {
    return (
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="main-content">
          <div className="dashboard-content">
            <Alert variant="warning" className="my-4">
              Room information not available.
            </Alert>
          
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="main-content">
        <div className="dashboard-content">
          {/* Header with Back Button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
         
              <div>
                <h2 className="mb-1">{roomInfo.name}</h2>
                <p className="text-muted mb-0">
                  <FiClock className="me-1" />
                  Last updated: {new Date(roomInfo.lastUpdated).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={handleRefresh}
              >
                Refresh Data
              </Button>
              <Badge bg="success" className="px-3 py-2">
                <FiActivity className="me-1" />
                {roomInfo?.status?.toUpperCase() || 'OPTIMAL'}
              </Badge>
            </div>
          </div>
          
          {/* Current Statistics */}
          {renderCurrentStats()}
          
          {/* Charts Grid */}
          <Row>
            <Col lg={6} className="mb-4">
              {renderChart('temperature', '#ff6b6b', 'Temperature', '°C', 'area')}
            </Col>
            <Col lg={6} className="mb-4">
              {renderChart('humidity', '#4dabf7', 'Humidity', '%', 'area')}
            </Col>
          </Row>
          
          <Row>
            <Col lg={6} className="mb-4">
              {renderChart('co2', '#20c997', 'CO₂ Level', 'ppm', 'line')}
            </Col>
            <Col lg={6} className="mb-4">
              {renderChart('light', '#ffd43b', 'Light Intensity', 'lux', 'line')}
            </Col>
          </Row>

          {/* Room Information */}
          <Row>
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom-0">
                  <h6 className="mb-0 fw-bold">Room Information</h6>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <small className="text-muted">Room Type</small>
                      <div className="fw-bold">{roomInfo.type}</div>
                    </div>
                    <div className="col-6 mb-3">
                      <small className="text-muted">Capacity</small>
                      <div className="fw-bold">{roomInfo.capacity}</div>
                    </div>
                    <div className="col-6 mb-3">
                      <small className="text-muted">Room ID</small>
                      <div className="fw-bold">{roomInfo.id}</div>
                    </div>
                    <div className="col-6 mb-3">
                      <small className="text-muted">Kit ID</small>
                      <div className="fw-bold">{roomInfo.kit_id}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom-0">
                  <h6 className="mb-0 fw-bold">Optimal Ranges</h6>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <small className="text-muted">Temperature</small>
                      <div className="fw-bold">22-26°C</div>
                    </div>
                    <div className="col-6 mb-3">
                      <small className="text-muted">Humidity</small>
                      <div className="fw-bold">60-80%</div>
                    </div>
                    <div className="col-6 mb-3">
                      <small className="text-muted">CO₂ Level</small>
                      <div className="fw-bold">800-1300ppm</div>
                    </div>
                    <div className="col-6 mb-3">
                      <small className="text-muted">Light Intensity</small>
                      <div className="fw-bold">800-1300lux</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;