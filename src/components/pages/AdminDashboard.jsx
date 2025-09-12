import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, ProgressBar, Button } from 'react-bootstrap';
import { FiPackage, FiHome, FiTrendingUp, FiThermometer, FiDroplet, FiWind, FiSun, FiAlertTriangle } from 'react-icons/fi';
import Sidebar from '../Sidebar'; // Import the separate Sidebar component
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [iotData, setIotData] = useState({
    temperature: 22,
    humidity: 80,
    co2Level: 800,
    lightIntensity: 1200
  });

  // Simulate real-time IoT data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIotData(prev => ({
        temperature: Math.round((prev.temperature + (Math.random() - 0.5) * 2) * 10) / 10,
        humidity: Math.max(60, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        co2Level: Math.max(600, Math.min(1200, prev.co2Level + (Math.random() - 0.5) * 100)),
        lightIntensity: Math.max(800, Math.min(1500, prev.lightIntensity + (Math.random() - 0.5) * 200))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const recentOrders = [
    { id: '001', product: 'Organic Shiitake', quantity: '2kg', status: 'delivered', date: '2024-01-15' },
    { id: '002', product: 'Organic Shiitake', quantity: '2kg', status: 'delivered', date: '2024-01-15' },
    { id: '003', product: 'Organic Shiitake', quantity: '2kg', status: 'delivered', date: '2024-01-15' },
    { id: '004', product: 'Organic Shiitake', quantity: '2kg', status: 'delivered', date: '2024-01-15' },
    { id: '005', product: 'Organic Shiitake', quantity: '2kg', status: 'delivered', date: '2024-01-15' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      delivered: { variant: 'success', text: 'delivered' },
      pending: { variant: 'warning', text: 'pending' },
      processing: { variant: 'info', text: 'processing' }
    };
    return statusConfig[status] || { variant: 'secondary', text: status };
  };

  const getOptimalStatus = (value, min, max) => {
    if (value >= min && value <= max) return 'optimal';
    if (value < min - 5 || value > max + 5) return 'critical';
    return 'warning';
  };

  const renderDashboardContent = () => {
    return (
      <>
    {/* Stats Cards */}
<Row className="mb-4">
  <Col md={4}>
    <Card className="stat-card">
      <Card.Body className="d-flex justify-content-between align-items-center">
          <div className="text-start">
            <div className="stat-number">156</div>
            <div className="stat-label">My ordered Product</div>
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
          <div className="stat-number">2</div>
          <div className="stat-label">Total Room</div>
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
          <div className="stat-number">285 kg</div>
          <div className="stat-label">Mushrooms Produced</div>
          <div className="stat-label-sub">this month</div>
        </div>
        <div className="stat-icon text-success">
          <FiTrendingUp size={32} />
        </div>
      </Card.Body>
    </Card>
  </Col>
</Row>
        {/* Main Dashboard Row */}
        <Row>
          {/* Chart Section */}
          <Col md={6}>
            <Card className="chart-card">
              <Card.Header>
                <h6 className="mb-0">ASSET GENERATED</h6>
              </Card.Header>
              <Card.Body>
                <div className="chart-value">128,7K</div>
                <div className="chart-change text-success">
                  <span>220,342.76</span>
                  <span className="ms-2">+3.4%</span>
                </div>
                {/* Simple chart representation */}
                <div className="simple-chart mt-3">
                  <div className="chart-line"></div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* IoT Room Status */}
          <Col md={6}>
            <Card className="iot-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">IoT Room Status</h6>
                <small className="text-muted">Last 7 Days</small>
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
                  <div className="metric-value">Optimal Range: 22-26°C</div>
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
                  <div className="metric-value">Optimal Range: 80-90%</div>
                  <ProgressBar 
                    now={iotData.humidity} 
                    variant={getOptimalStatus(iotData.humidity, 75, 85) === 'optimal' ? 'success' : 'warning'}
                  />
                </div>

                {/* CO2 Level */}
                <div className="iot-metric mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center">
                      <FiWind className="me-2 text-warning" />
                      <span>Co2 Level</span>
                    </div>
                    <Badge bg={getOptimalStatus(iotData.co2Level, 800, 1200) === 'optimal' ? 'success' : 'warning'}>
                      Warning
                    </Badge>
                  </div>
                  <div className="metric-value">Optimal Range: 800-1500 ppm</div>
                  <ProgressBar 
                    now={(iotData.co2Level / 1500) * 100} 
                    variant="warning"
                  />
                </div>

                {/* Light Intensity */}
                <div className="iot-metric mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center">
                      <FiSun className="me-2 text-warning" />
                      <span>Light Intensity</span>
                    </div>
                    <Badge bg={getOptimalStatus(iotData.lightIntensity, 1000, 1400) === 'optimal' ? 'success' : 'warning'}>
                      {getOptimalStatus(iotData.lightIntensity, 1000, 1400)}
                    </Badge>
                  </div>
                  <ProgressBar 
                    now={(iotData.lightIntensity / 1500) * 100} 
                    variant={getOptimalStatus(iotData.lightIntensity, 1000, 1400) === 'optimal' ? 'success' : 'warning'}
                  />
                </div>

                {/* Alert */}
                <div className="alert alert-warning d-flex align-items-center mt-3">
                  <FiAlertTriangle className="me-2" />
                  <small>1 Alert: CO2 levels approaching upper threshold in Room 1</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Orders Table */}
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">My Recent Orders</h6>
                <Button variant="outline-secondary" size="sm">Today ▼</Button>
              </Card.Header>
              <Card.Body>
                <Table responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>S-no</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Date ↑</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.product}</td>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const renderContent = () => {
    return renderDashboardContent();
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Component */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole="admin" />

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Admin Dashboard</h2>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Welcome, Delicious Recipe</span>
              <div className="user-avatar">DR</div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;