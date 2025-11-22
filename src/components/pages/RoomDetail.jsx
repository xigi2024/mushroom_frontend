import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge, ProgressBar, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiThermometer, FiDroplet, FiClock, FiActivity, FiArrowLeft, FiRefreshCw, FiRadio } from 'react-icons/fi';
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
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Refs for intervals
  const pollingIntervalRef = useRef(null);
  const dataCheckIntervalRef = useRef(null);

  // ✅ Configure axios headers with auth token
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // ✅ Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (dataCheckIntervalRef.current) {
        clearInterval(dataCheckIntervalRef.current);
      }
    };
  }, []);

  // ✅ Fetch latest sensor data (lightweight - only checks for new data)
  const fetchLatestSensorData = async () => {
    try {
      const roomDataFromState = location.state?.roomData;
      
      if (!roomDataFromState) return;

      const response = await axios.get(
        `${API_BASE_URL}/rooms/kit/${roomDataFromState.kit_id}/`,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        const roomData = response.data.room;
        const latestSensorData = response.data.latest_sensor_data;

        // Check if we have new data by comparing timestamps
        const currentLatestTimestamp = roomInfo?.currentStats?.timestamp;
        const newTimestamp = latestSensorData?.timestamp;

        if (newTimestamp && currentLatestTimestamp !== newTimestamp) {
          console.log('🔄 New sensor data detected, updating...');
          
          // Update room info with new data
          setRoomInfo(prev => ({
            ...prev,
            status: roomData.status || 'optimal',
            lastUpdated: roomData.updated_at,
            currentStats: {
              temperature: latestSensorData?.temperature || roomData.temperature,
              humidity: latestSensorData?.humidity || roomData.humidity,
              timestamp: newTimestamp
            }
          }));

          // Fetch updated historical data for charts
          await fetchHistoricalData(roomData.id);
          setLastUpdateTime(new Date().toLocaleTimeString());
        }
      }
    } catch (error) {
      console.log('❌ Error checking latest data:', error);
    }
  };

  // ✅ Fetch historical data for charts
  const fetchHistoricalData = async (roomId) => {
    try {
      const sensorHistoryResponse = await axios.get(
        `${API_BASE_URL}/sensor-data/list/`,
        { headers: getAuthHeaders() }
      );

      // Filter data for this specific room
      const allRoomData = sensorHistoryResponse.data
        .filter(data => data.room === roomId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      console.log(`📊 Found ${allRoomData.length} data points for room ${roomId}`);

      // Create 5-minute interval data points
      const roomSensorData = create5MinuteIntervalData(allRoomData);

      if (roomSensorData.length > 0) {
        setSensorData(roomSensorData);
      }
    } catch (historyError) {
      console.log('❌ Error fetching historical data:', historyError);
    }
  };

  // ✅ Main data fetching function
  const fetchRoomData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      if (!isRefresh) setIsLoading(true);
      setError(null);
      
      const roomDataFromState = location.state?.roomData;
      
      if (roomDataFromState) {
        console.log('📦 Room data from state:', roomDataFromState);
        
        // ✅ 1. Get room details with latest sensor data
        try {
          const roomResponse = await axios.get(
            `${API_BASE_URL}/rooms/kit/${roomDataFromState.kit_id}/`,
            { headers: getAuthHeaders() }
          );
          
          console.log('✅ Room with sensor data:', roomResponse.data);
          
          if (roomResponse.data.success) {
            const roomData = roomResponse.data.room;
            const latestSensorData = roomResponse.data.latest_sensor_data;
            
            // ✅ Set room info with real data
            setRoomInfo({
              id: roomData.id,
              name: roomData.name,
              kit_id: roomData.kit_id,
              status: roomData.status || 'optimal',
              type: 'Shiitake Mushroom',
              capacity: '500kg',
              lastUpdated: roomData.updated_at,
              currentStats: {
                temperature: latestSensorData?.temperature || roomData.temperature,
                humidity: latestSensorData?.humidity || roomData.humidity,
                timestamp: latestSensorData?.timestamp
              }
            });
            
            // ✅ 2. Get historical sensor data for charts
            await fetchHistoricalData(roomData.id);
            
            // ✅ 3. Start auto-refresh polling after initial load
            if (!isRefresh) {
              startAutoRefresh();
            }
          }
        } catch (sensorError) {
          console.log('❌ Sensor API error:', sensorError);
          setError('Failed to load sensor data from server.');
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
              temperature: roomResponse.data.temperature || 0,
              humidity: roomResponse.data.humidity || 0
            }
          });
          
          // Set empty sensor data
          setSensorData([]);
          
          // Start auto-refresh
          if (!isRefresh) {
            startAutoRefresh();
          }
        } catch (apiError) {
          console.error('❌ API Error:', apiError);
          setError('Failed to load room data from server.');
        }
      }
      
    } catch (err) {
      console.error('❌ Error fetching room data:', err);
      setError('Failed to load room data. Please try again later.');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // ✅ Start automatic data polling
  const startAutoRefresh = () => {
    // Clear existing intervals
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    if (dataCheckIntervalRef.current) {
      clearInterval(dataCheckIntervalRef.current);
    }

    // Poll every 10 seconds for new data
    pollingIntervalRef.current = setInterval(() => {
      if (autoRefreshEnabled) {
        fetchLatestSensorData();
      }
    }, 10000); // 10 seconds

    // Additional check every 30 seconds for data consistency
    dataCheckIntervalRef.current = setInterval(() => {
      if (autoRefreshEnabled && roomInfo?.id) {
        fetchHistoricalData(roomInfo.id);
      }
    }, 30000); // 30 seconds

    console.log('🔄 Auto-refresh started (10s intervals)');
  };

  // ✅ Stop automatic data polling
  const stopAutoRefresh = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (dataCheckIntervalRef.current) {
      clearInterval(dataCheckIntervalRef.current);
      dataCheckIntervalRef.current = null;
    }
    console.log('🛑 Auto-refresh stopped');
  };

  // ✅ Toggle auto refresh
  const toggleAutoRefresh = () => {
    if (autoRefreshEnabled) {
      stopAutoRefresh();
      setAutoRefreshEnabled(false);
    } else {
      setAutoRefreshEnabled(true);
      startAutoRefresh();
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }
    
    fetchRoomData();
    
    return () => {
      stopAutoRefresh();
    };
  }, [id, location.state, isAuthenticated, token, navigate]);

  // ✅ Handle back to monitoring page
  const handleBackToMonitoring = () => {
    navigate('/user/iot-monitoring');
  };

  // ✅ Refresh sensor data manually
  const handleRefresh = () => {
    fetchRoomData(true);
  };

  // ✅ Fixed 5-minute interval data processing
  const create5MinuteIntervalData = (rawData) => {
    if (!rawData || rawData.length === 0) return [];
    
    console.log(`🕒 Processing ${rawData.length} raw data points into 5-minute intervals`);
    
    // Sort by timestamp (newest first)
    const sortedData = [...rawData].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Take only the last 6-8 data points for clean display (like reference image)
    const recentData = sortedData.slice(0, 8);
    
    console.log(`📊 Using ${recentData.length} most recent data points`);
    
    // Create exact 5-minute interval points
    const intervalData = [];
    const intervalMs = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    // Start from the most recent data point and go backwards in 5-minute intervals
    if (recentData.length > 0) {
      const latestTimestamp = new Date(recentData[0].timestamp);
      
      // Create 6 data points at 5-minute intervals going backwards
      for (let i = 0; i < 6; i++) {
        const pointTime = new Date(latestTimestamp.getTime() - (i * intervalMs));
        
        // Find the closest data point to this time
        const closestData = recentData.reduce((closest, current) => {
          const currentTime = new Date(current.timestamp);
          const currentDiff = Math.abs(currentTime - pointTime);
          const closestDiff = closest ? Math.abs(new Date(closest.timestamp) - pointTime) : Infinity;
          
          return currentDiff < closestDiff ? current : closest;
        }, null);
        
        if (closestData) {
          intervalData.unshift({
            time: pointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temperature: closestData.temperature,
            humidity: closestData.humidity,
            timestamp: pointTime.toISOString(),
            isEstimated: Math.abs(new Date(closestData.timestamp) - pointTime) > intervalMs / 2
          });
        }
      }
    }
    
    console.log(`✅ Created ${intervalData.length} exact 5-minute interval data points`);
    console.log('📅 Time points:', intervalData.map(d => d.time));
    
    return intervalData;
  };

  // Render different chart types
  const renderChart = (dataKey, color, name, unit = '', chartType = 'line') => {
    const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
    const DataComponent = chartType === 'area' ? Area : Line;

    return (
      <Card className="mb-4 chart-card border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom-0 pb-2">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">{name}</h6>
            <div className="d-flex align-items-center gap-2">
              <Badge bg="light" text="dark" className="px-2 py-1">
                {sensorData.length > 0 ? `${sensorData[sensorData.length - 1][dataKey]}${unit}` : `--${unit}`}
              </Badge>
              {lastUpdateTime && (
                <small className="text-muted" title="Last auto-update">
                  <FiRadio size={12} className="text-success me-1" />
                  {lastUpdateTime}
                </small>
              )}
            </div>
          </div>
        </Card.Header>  
        <Card.Body className="pt-0">
          <div style={{ height: '200px' }}>
            {sensorData.length > 0 ? (
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
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}${unit}`, name]}
                    labelFormatter={(label) => {
                      const dataPoint = sensorData.find(d => d.time === label);
                      return `Time: ${label}`;
                    }}
                  />
                  <DataComponent
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    fill={chartType === 'area' ? `${color}20` : undefined}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5, fill: color }}
                    name={name}
                  />
                </ChartComponent>
              </ResponsiveContainer>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100">
                <p className="text-muted">No sensor data available</p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderCurrentStats = () => (
    <Row className="mb-4 g-3">
      <Col md={6}>
        <Card className="stat-card h-100 border-0 shadow-sm">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">
                <FiThermometer size={20} className="text-danger" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Temperature</h6>
                <h4 className="text-danger mb-0">
                  {roomInfo?.currentStats?.temperature ? `${roomInfo.currentStats.temperature}°C` : '--'}
                </h4>
              </div>
            </div>
            <ProgressBar 
              now={roomInfo?.currentStats?.temperature ? ((roomInfo.currentStats.temperature - 20) / 10) * 100 : 0} 
              variant={
                roomInfo?.currentStats?.temperature >= 22 && roomInfo?.currentStats?.temperature <= 26 ? 'success' : 
                roomInfo?.currentStats?.temperature >= 18 && roomInfo?.currentStats?.temperature <= 28 ? 'warning' : 'danger'
              }
              className="mb-1"
              style={{ height: '6px' }}
            />
            <small className="text-muted">Optimal: 22-26°C</small>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={6}>
        <Card className="stat-card h-100 border-0 shadow-sm">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                <FiDroplet size={20} className="text-info" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Humidity</h6>
                <h4 className="text-info mb-0">
                  {roomInfo?.currentStats?.humidity ? `${roomInfo.currentStats.humidity}%` : '--'}
                </h4>
              </div>
            </div>
            <ProgressBar 
              now={roomInfo?.currentStats?.humidity || 0} 
              variant={
                roomInfo?.currentStats?.humidity >= 75 && roomInfo?.currentStats?.humidity <= 85 ? 'success' : 
                roomInfo?.currentStats?.humidity >= 70 && roomInfo?.currentStats?.humidity <= 90 ? 'warning' : 'danger'
              }
              className="mb-1"
              style={{ height: '6px' }}
            />
            <small className="text-muted">Optimal: 75-85%</small>
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
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={handleBackToMonitoring}
                className="me-3"
              >
                <FiArrowLeft className="me-1" />
                Back
              </Button>
              <div>
                <h2 className="mb-1">{roomInfo.name}</h2>
                <p className="text-muted mb-0">
                  <FiClock className="me-1" />
                  Last updated: {roomInfo.lastUpdated ? new Date(roomInfo.lastUpdated).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant={autoRefreshEnabled ? "success" : "outline-secondary"}
                size="sm"
                onClick={toggleAutoRefresh}
                title={autoRefreshEnabled ? "Auto-refresh enabled" : "Auto-refresh disabled"}
              >
                <FiRadio className={autoRefreshEnabled ? "text-white" : ""} />
                {autoRefreshEnabled ? ' Live' : ' Off'}
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <FiRefreshCw className={refreshing ? 'spinner' : ''} />
                {refreshing ? ' Refreshing...' : ' Refresh'}
              </Button>
              <Badge bg={
                roomInfo?.status === 'optimal' ? 'success' : 
                roomInfo?.status === 'warning' ? 'warning' : 'danger'
              } className="px-3 py-2">
                <FiActivity className="me-1" />
                {roomInfo?.status ? roomInfo.status.toUpperCase() : 'NO DATA'}
              </Badge>
            </div>
          </div>
          
          {/* Auto-refresh Status */}
          {autoRefreshEnabled && (
            <Alert variant="info" className="py-2 mb-3">
              <div className="d-flex align-items-center">
                <FiRadio className="me-2" />
                <small>
                  <strong>Live Updates:</strong> Data refreshes automatically every 10 seconds
                  {lastUpdateTime && ` • Last update: ${lastUpdateTime}`}
                </small>
              </div>
            </Alert>
          )}
          
          {/* Current Statistics */}
          {renderCurrentStats()}
          
          {/* Charts Grid - ONLY TEMP & HUMIDITY */}
          <Row>
            <Col lg={6} className="mb-4">
              {renderChart('temperature', '#ff6b6b', 'Temperature', '°C', 'area')}
            </Col>
            <Col lg={6} className="mb-4">
              {renderChart('humidity', '#4dabf7', 'Humidity', '%', 'area')}
            </Col>
          </Row>

          {/* Room Information */}
          <Row>
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
                      <small className="text-muted">
                        Current: {roomInfo?.currentStats?.temperature ? `${roomInfo.currentStats.temperature}°C` : '--'}
                      </small>
                    </div>
                    <div className="col-6 mb-3">
                      <small className="text-muted">Humidity</small>
                      <div className="fw-bold">75-85%</div>
                      <small className="text-muted">
                        Current: {roomInfo?.currentStats?.humidity ? `${roomInfo.currentStats.humidity}%` : '--'}
                      </small>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="alert alert-info mb-0">
                        <small>
                          <strong>Status Guide:</strong><br/>
                          • <Badge bg="success">Optimal</Badge>: Temp 22-26°C & Humidity 75-85%<br/>
                          • <Badge bg="warning">Warning</Badge>: Temp 18-28°C & Humidity 70-90%<br/>
                          • <Badge bg="danger">Critical</Badge>: Outside optimal ranges
                        </small>
                      </div>
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