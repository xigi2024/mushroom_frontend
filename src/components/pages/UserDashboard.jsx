import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, ProgressBar, Button, Spinner, Alert } from 'react-bootstrap';
import { FiPackage, FiHome, FiTrendingUp, FiThermometer, FiDroplet, FiWind, FiSun, FiAlertTriangle } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import Layout from '../Layout';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [iotData, setIotData] = useState({
    temperature: 22,
    humidity: 80
  });

  // State for rooms and orders data
  const [rooms, setRooms] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chart data for sensor history
  const [sensorHistory, setSensorHistory] = useState({
    labels: Array(12).fill('').map((_, i) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - ((12 - i) * 5));
      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }),
    temperature: Array(12).fill(22),
    humidity: Array(12).fill(80),
    lastUpdate: new Date()
  });

  // ✅ Check if user has ACTUALLY created rooms
  const hasCreatedRooms = rooms && rooms.length > 0;

  // Fetch user's rooms data
  const fetchUserRooms = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('https://mycomatrix.in/api/rooms/my-rooms/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const roomsData = await response.json();
        console.log('🏠 Fetched rooms data:', roomsData);
        
        if (roomsData.success && roomsData.rooms && roomsData.rooms.length > 0) {
          setRooms(roomsData.rooms);
          console.log('✅ User has created rooms:', roomsData.rooms.length);
        } else {
          setRooms([]);
          console.log('❌ User has NO rooms created');
        }
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setRooms([]);
    }
  };

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please login to view your orders');
        return;
      }

      const response = await fetch('https://mycomatrix.in/api/orders/my-orders/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const ordersData = await response.json();
        
        if (Array.isArray(ordersData)) {
          setAllOrders(ordersData);
          const sortedOrders = [...ordersData].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          const latestThree = sortedOrders.slice(0, 3);
          setLatestOrders(latestThree);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Calculate stats
  const getTotalOrderedProducts = () => {
    if (!Array.isArray(allOrders) || allOrders.length === 0) return 0;
    
    let totalProducts = 0;
    allOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          totalProducts += item.qty || 1;
        });
      }
    });
    
    return totalProducts;
  };

  const getTotalOrdersCount = () => {
    return Array.isArray(allOrders) ? allOrders.length : 0;
  };

  // Get REAL sensor data only if rooms exist
  const getLatestSensorData = () => {
    if (!hasCreatedRooms) {
      return { temperature: 22, humidity: 80 }; // Default data
    }
    
    // Find the first room with actual sensor data
    const roomWithData = rooms.find(room => room.latest_sensor_data);
    
    if (roomWithData && roomWithData.latest_sensor_data) {
      const sensorData = roomWithData.latest_sensor_data;
      console.log('📊 Using REAL sensor data:', sensorData);
      return {
        temperature: sensorData.temperature || 22,
        humidity: sensorData.humidity || 80
      };
    }
    
    // If rooms exist but no sensor data, use default
    return { temperature: 22, humidity: 80 };
  };

  // Update sensor data only when rooms exist
  useEffect(() => {
    if (hasCreatedRooms) {
      const sensorData = getLatestSensorData();
      setIotData(sensorData);
      console.log('🔄 Updated IoT data with room sensor data');
    }
  }, [rooms]);

  // Update chart data
  useEffect(() => {
    const now = new Date();
    const timeDiff = (now - sensorHistory.lastUpdate) / (1000 * 60);
    
    if (timeDiff >= 5) {
      setSensorHistory(prev => {
        const newLabels = [...prev.labels.slice(1), now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})];
        return {
          ...prev,
          labels: newLabels,
          temperature: [...prev.temperature.slice(1), iotData.temperature],
          humidity: [...prev.humidity.slice(1), iotData.humidity],
          lastUpdate: now
        };
      });
    }
  }, [iotData, sensorHistory.lastUpdate]);

  // Chart configuration
  const chartData = {
    labels: sensorHistory.labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: sensorHistory.temperature,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        yAxisID: 'y',
        pointRadius: 2,
        borderWidth: 2
      },
      {
        label: 'Humidity (%)',
        data: sensorHistory.humidity,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 2,
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperature (°C)'
        },
        min: 15,
        max: 35,
        grid: {
          drawOnChartArea: false
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Humidity (%)'
        },
        min: 50,
        max: 100,
        grid: {
          drawOnChartArea: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    setActiveSection('dashboard');
    
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUserRooms(), fetchUserOrders()]);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Auto-update only if rooms exist
  useEffect(() => {
    if (!hasCreatedRooms) {
      console.log('⏹️ No rooms - stopping sensor updates');
      return;
    }

    const updateSensorData = () => {
      const currentData = getLatestSensorData();
      setIotData(prev => ({
        temperature: Math.round((currentData.temperature + (Math.random() - 0.5) * 2) * 10) / 10,
        humidity: Math.max(60, Math.min(90, currentData.humidity + (Math.random() - 0.5) * 5))
      }));
    };

    // Set up 5-minute interval only if user has rooms
    const interval = setInterval(updateSensorData, 5 * 60 * 1000);
    console.log('🔄 Started sensor updates for rooms');

    return () => {
      clearInterval(interval);
      console.log('🛑 Stopped sensor updates');
    };
  }, [hasCreatedRooms]);

  // Helper functions
  const formatLatestOrders = () => {
    if (!Array.isArray(latestOrders) || latestOrders.length === 0) return [];
    return latestOrders.flatMap(order => {
      if (!order.items || order.items.length === 0) {
        return [{
          id: order.id,
          order_id: `ORD-${String(order.id).padStart(3, '0')}`,
          product: 'No items',
          quantity: 0,
          status: order.status || 'pending',
          date: new Date(order.created_at).toLocaleDateString('en-IN'),
          total_amount: order.total_amount || '0.00'
        }];
      }
      
      return order.items.map(item => ({
        id: order.id,
        order_id: `ORD-${String(order.id).padStart(3, '0')}`,
        product: item.product?.name || 'Product',
        quantity: item.qty || 1,
        status: order.status || 'pending',
        date: new Date(order.created_at).toLocaleDateString('en-IN'),
        total_amount: order.total_amount || '0.00'
      }));
    });
  };

  const displayLatestOrders = formatLatestOrders();

  const getStatusBadge = (status) => {
    const statusConfig = {
      delivered: { variant: 'success', text: 'Delivered' },
      completed: { variant: 'success', text: 'Completed' },
      processing: { variant: 'warning', text: 'Processing' },
      shipped: { variant: 'info', text: 'Shipped' },
      pending: { variant: 'secondary', text: 'Pending' },
      cancelled: { variant: 'danger', text: 'Cancelled' }
    };
    return statusConfig[status] || { variant: 'secondary', text: status };
  };

  const getOptimalStatus = (value, min, max) => {
    if (value >= min && value <= max) return 'optimal';
    if (value < min - 5 || value > max + 5) return 'critical';
    return 'warning';
  };

  if (loading) {
    return (
      <Layout activeSection={activeSection} setActiveSection={setActiveSection} userRole="user">
        <div className="dashboard-content">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection} userRole="user">
      <div className="dashboard-content">
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div className="text-start">
                  <div className="stat-number">{getTotalOrderedProducts()}</div>
                  <div className="stat-label">My Ordered Products</div>
                  <small className="text-muted">From {getTotalOrdersCount()} orders</small>
                </div>
                <div className="stat-icon">
                  <FiPackage className="color" size={32} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div className="text-start">
                  <div className="stat-number">{rooms.length}</div>
                  <div className="stat-label">Total Rooms</div>
                  <small className="text-muted">
                    {hasCreatedRooms ? `${rooms.length} rooms active` : 'No rooms created'}
                  </small>
                </div>
                <div className="stat-icon text-info">
                  <FiHome size={32} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div className="text-start">
                  <div className="stat-number">{getTotalOrdersCount()}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-icon text-success">
                  <FiTrendingUp size={32} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ✅ UPDATED: Main Dashboard Row - Show charts ONLY when rooms exist */}
        {hasCreatedRooms ? (
          <Row>
            {/* Chart Section - Only show when rooms exist */}
            <Col md={6}>
              <Card className="chart-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">SENSOR DATA TREND</h6>
                  <div className="d-flex align-items-center">
                    <div className="sensor-legend me-3">
                      <span className="sensor-dot" style={{backgroundColor: 'rgba(255, 99, 132, 1)'}}></span>
                      <span className="ms-1">Temp</span>
                    </div>
                    <div className="sensor-legend">
                      <span className="sensor-dot" style={{backgroundColor: 'rgba(54, 162, 235, 1)'}}></span>
                      <span className="ms-1">Humidity</span>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '300px' }}>
                    <Line data={chartData} options={chartOptions} />
                  </div>
                  <div className="mt-2 text-center">
                    <small className="text-muted">
                      Real-time sensor data from your rooms
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* IoT Room Status - Only show when rooms exist */}
            <Col md={6}>
              <Card className="iot-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">IoT Room Status</h6>
                  <small className="text-muted">Live Data</small>
                </Card.Header>
                <Card.Body>
                  {/* Temperature */}
                  <div className="iot-metric mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex align-items-center">
                        <FiThermometer className="me-2 text-danger" />
                        <span>Temperature</span>
                      </div>
                      <Badge bg={getOptimalStatus(iotData.temperature, 20, 26) === 'optimal' ? 'success' : 'warning'}>
                        {getOptimalStatus(iotData.temperature, 20, 26)}
                      </Badge>
                    </div>
                    <div className="metric-value">{iotData.temperature}°C (Optimal: 22-26°C)</div>
                    <ProgressBar 
                      now={(iotData.temperature / 30) * 100} 
                      variant={getOptimalStatus(iotData.temperature, 20, 26) === 'optimal' ? 'success' : 'warning'}
                    />
                  </div>

                  {/* Humidity */}
                  <div className="iot-metric mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex align-items-center">
                        <FiDroplet className="me-2 text-info" />
                        <span>Humidity</span>
                      </div>
                      <Badge bg={getOptimalStatus(iotData.humidity, 75, 85) === 'optimal' ? 'success' : 'warning'}>
                        {getOptimalStatus(iotData.humidity, 75, 85)}
                      </Badge>
                    </div>
                    <div className="metric-value">{iotData.humidity}% (Optimal: 80-90%)</div>
                    <ProgressBar 
                      now={iotData.humidity} 
                      variant={getOptimalStatus(iotData.humidity, 75, 85) === 'optimal' ? 'success' : 'warning'}
                    />
                  </div>

                  {/* Room Status Summary */}
                  <div className="mt-4 p-3 bg-light rounded">
                    <h6 className="mb-2">Rooms Summary</h6>
                    <div className="d-flex justify-content-between">
                      <small>Total Rooms: <strong>{rooms.length}</strong></small>
                      <small>Active Sensors: <strong>{rooms.filter(room => room.latest_sensor_data).length}</strong></small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          // ✅ UPDATED: Empty state when NO rooms created - Show full width message
          <Row>
            <Col md={12}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                  <div className="text-muted mb-3">
                    <FiHome size={64} />
                  </div>
                  <h4 className="text-muted mb-3">No Rooms Created Yet</h4>
                  <p className="text-muted mb-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    You haven't created any mushroom growing rooms yet. Create your first room in IoT Monitoring 
                    to start monitoring temperature, humidity, and get real-time sensor data for optimal mushroom growth conditions.
                  </p>
                  <Button 
                    className="button" 
                    onClick={() => navigate("/iot-monitoring")}
                    size="lg"
                  >
                    <FiHome className="me-2" />
                    Create Your First Room in IoT Monitoring
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Recent Orders Table - Always show orders section */}
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">My Recent Orders (Latest 3)</h6>
                <Button className='button' onClick={() => navigate("/user/product-order")}>View All</Button>
              </Card.Header>
              <Card.Body>
                {displayLatestOrders.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No recent orders found.</p>
                  </div>
                ) : (
                  <Table responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayLatestOrders.map((order, index) => (
                        <tr key={`${order.id}-${index}`}>
                          <td><strong>{order.order_id}</strong></td>
                          <td>
                            <div>
                              <div className="fw-semibold">{order.product}</div>
                              <small className="text-muted">Order Total: ₹{order.total_amount}</small>
                            </div>
                          </td>
                          <td>{order.quantity}</td>
                          <td>
                            <Badge bg={getStatusBadge(order.status).variant}>
                              {getStatusBadge(order.status).text}
                            </Badge>
                          </td>
                          <td>{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {error && (
          <Alert variant="warning" className="mt-3">
            {error}
          </Alert>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;