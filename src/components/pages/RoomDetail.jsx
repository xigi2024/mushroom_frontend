import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiThermometer, FiDroplet, FiWind, FiSun } from 'react-icons/fi';
import Sidebar from '../Sidebar';
import '../styles/detail.css';

// Mock data generator
const generateMockData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    data.push({
      time: time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      temperature: Math.round((Math.random() * 5) + 20), // 20-25°C
      humidity: Math.round((Math.random() * 20) + 60),   // 60-80%
      co2: Math.round((Math.random() * 500) + 800),      // 800-1300 ppm
      light: Math.round((Math.random() * 500) + 800)     // 800-1300 lux (more realistic)
    });
  }
  return data;
};

const RoomDetail = ({ match }) => {
  const [sensorData, setSensorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  
  // Get room ID from URL params or use default
  const roomId = match?.params?.id || '1';
  const roomName = `Mushroom Growth Chamber ${roomId}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call for room data
        // In a real app, you would fetch based on roomId
        const roomResponse = {
          id: roomId,
          name: roomName,
          status: 'optimal',
          lastUpdated: new Date().toISOString()
        };
        
        setRoomInfo(roomResponse);
        
        // Simulate sensor data fetch
        const sensorDataResponse = generateMockData();
        setSensorData(sensorDataResponse);
        
      } catch (err) {
        console.error('Error fetching room data:', err);
        setError('Failed to load room data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up polling (every 5 minutes)
    const interval = setInterval(fetchData, 300000);
    
    return () => clearInterval(interval);
  }, [roomId, roomName]);

  const renderChart = (dataKey, color, name, unit = '') => (
    <Card className="mb-4 chart-card">
      <Card.Header className="bg-white">
        <Card.Title className="text-center mb-0">
          {name} {sensorData.length > 0 && `(${sensorData[0][dataKey]}${unit})`}
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sensorData}
              margin={{
                top: 5,
                right: 20,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                formatter={(value) => [`${value}${unit}`, name]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5, fill: color }}
                name={name}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );

  const renderCurrentStats = () => (
    <Row className="mb-4 g-3">
      <Col md={3} sm={6}>
        <Card className="stat-cards h-100 rounded-0 border-0">
          <Card.Body className="text-center p-3">
            <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <FiThermometer size={24} className="text-primary" />
            </div>
            <h5 className="text-muted mb-1">Temperature</h5>
            <h3 className="text-primary mb-2">
              {sensorData.length > 0 ? `${sensorData[0].temperature}°C` : '--'}
            </h3>
            <small className="text-muted">Optimal: 20-25°C</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3} sm={6}>
        <Card className="stat-cards h-100 rounded-0 border-0">
          <Card.Body className="text-center p-3">
            <div className="bg-info bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <FiDroplet size={24} className="text-info" />
            </div>
            <h5 className="text-muted mb-1">Humidity</h5>
            <h3 className="text-info mb-2">
              {sensorData.length > 0 ? `${sensorData[0].humidity}%` : '--'}
            </h3>
            <small className="text-muted">Optimal: 60-80%</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3} sm={6}>
        <Card className="stat-cards h-100 rounded-0 border-0">
          <Card.Body className="text-center p-3">
            <div className="bg-success bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <FiWind size={24} className="text-success" />
            </div>
            <h5 className="text-muted mb-1">CO₂ Level</h5>
            <h3 className="text-success mb-2">
              {sensorData.length > 0 ? `${sensorData[0].co2}ppm` : '--'}
            </h3>
            <small className="text-muted">Optimal: 800-1300ppm</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3} sm={6}>
        <Card className="stat-cards h-100 rounded-0 border-0">
          <Card.Body className="text-center p-3">
            <div className="bg-warning bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <FiSun size={24} className="text-warning" />
            </div>
            <h5 className="text-muted mb-1">Light Intensity</h5>
            <h3 className="text-warning mb-2">
              {sensorData.length > 0 ? `${sensorData[0].light}lux` : '--'}
            </h3>
            <small className="text-muted">Optimal: 800-1300lux</small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  if (isLoading) {
    return (
      <div className="d-flex">
        <Sidebar activeSection="iot-monitoring" />
        <div className="flex-grow-1 p-4" style={{ marginLeft: '250px' }}>
          <div className="text-center my-5">
            <Spinner animation="border" role="status" className="mb-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Loading sensor data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex">
        <Sidebar activeSection="iot-monitoring" />
        <div className="flex-grow-1 p-4" style={{ marginLeft: '250px' }}>
          <Alert variant="danger" className="my-4">
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar activeSection="iot-monitoring" />
      
      {/* Main Content */}
<div className='main-content'>
      <div className="flex-grow-1 p-4" >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">{roomName}</h2>
            {roomInfo && (
              <p className="text-muted mb-0">
                Last updated: {new Date(roomInfo.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <div>
            <span className={`badge bg-${
              roomInfo?.status === 'optimal' ? 'success' : 
              roomInfo?.status === 'warning' ? 'warning' : 'danger'
            } p-2`}>
              {roomInfo?.status?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
        </div>
        
        {/* Current Statistics */}
        {renderCurrentStats()}
        
        {/* Charts */}
        <Row>
          <Col lg={6} className="mb-4">
            {renderChart('temperature', '#ff6b6b', 'Temperature', '°C')}
          </Col>
          <Col lg={6} className="mb-4">
            {renderChart('humidity', '#4dabf7', 'Humidity', '%')}
          </Col>
        </Row>
        
        <Row>
          <Col lg={6} className="mb-4">
            {renderChart('co2', '#20c997', 'CO₂ Level', 'ppm')}
          </Col>
          <Col lg={6} className="mb-4">
            {renderChart('light', '#ffd43b', 'Light Intensity', 'lux')}
          </Col>
        </Row>
      </div>
      </div>
    </div>
  );
};

export default RoomDetail;