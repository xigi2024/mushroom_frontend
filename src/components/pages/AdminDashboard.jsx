import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, ProgressBar, Button } from 'react-bootstrap';
import { FiPackage, FiHome, FiTrendingUp, FiThermometer, FiDroplet, FiWind, FiSun, FiAlertTriangle } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Sidebar from '../Sidebar'; // Import the separate Sidebar component
import '../styles/dashboard.css';

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

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [iotData, setIotData] = useState({
    temperature: 22,
    humidity: 80,
    co2Level: 800,
    lightIntensity: 1200
  });

  // Chart data for sensor history
  const [sensorHistory, setSensorHistory] = useState({
    labels: Array(12).fill('').map((_, i) => {
      // Generate time labels for 5-minute intervals (last hour)
      const date = new Date();
      date.setMinutes(date.getMinutes() - ((12 - i) * 5));
      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }),
    temperature: Array(12).fill(22),
    humidity: Array(12).fill(80),
    co2: Array(12).fill(800),
    light: Array(12).fill(1200),
    lastUpdate: new Date()
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

  // Update chart data when iotData changes
  useEffect(() => {
    const now = new Date();
    const timeDiff = (now - sensorHistory.lastUpdate) / (1000 * 60); // in minutes
    
    // Only update if 5 minutes have passed since last update
    if (timeDiff >= 5) {
      setSensorHistory(prev => {
        const newLabels = [...prev.labels.slice(1), now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})];
        return {
          ...prev,
          labels: newLabels,
          temperature: [...prev.temperature.slice(1), iotData.temperature],
          humidity: [...prev.humidity.slice(1), iotData.humidity],
          co2: [...prev.co2.slice(1), iotData.co2Level],
          light: [...prev.light.slice(1), iotData.lightIntensity],
          lastUpdate: now
        };
      });
    }
  }, [iotData, sensorHistory.lastUpdate]);

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
      },
      {
        label: 'CO2 (ppm)',
        data: sensorHistory.co2,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.4,
        yAxisID: 'y2',
        pointRadius: 2,
        borderWidth: 2
      },
      {
        label: 'Light (lux)',
        data: sensorHistory.light,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        yAxisID: 'y3',
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
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
              if (label.includes('°C')) label = label.replace('°C', ' °C');
              if (label.includes('%')) label = label.replace('%', ' %');
              if (label.includes('ppm')) label = label.replace('ppm', ' ppm');
              if (label.includes('lux')) label = label.replace('lux', ' lux');
            }
            return label;
          }
        }
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
      y2: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'CO2 (ppm)'
        },
        min: 500,
        max: 1500,
        grid: {
          drawOnChartArea: false
        }
      },
      y3: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Light (lux)'
        },
        min: 500,
        max: 2000,
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
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">SENSOR DATA TREND</h6>
                <div className="d-flex align-items-center">
                  <div className="sensor-legend me-3">
                    <span className="sensor-dot" style={{backgroundColor: 'rgba(255, 99, 132, 1)'}}></span>
                    <span className="ms-1">Temp</span>
                  </div>
                  <div className="sensor-legend me-3">
                    <span className="sensor-dot" style={{backgroundColor: 'rgba(54, 162, 235, 1)'}}></span>
                    <span className="ms-1">Humidity</span>
                  </div>
                  <div className="sensor-legend me-3">
                    <span className="sensor-dot" style={{backgroundColor: 'rgba(255, 159, 64, 1)'}}></span>
                    <span className="ms-1">CO₂</span>
                  </div>
                  <div className="sensor-legend">
                    <span className="sensor-dot" style={{backgroundColor: 'rgba(75, 192, 192, 1)'}}></span>
                    <span className="ms-1">Light</span>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
                <div className="mt-2 text-center">
                  <small className="text-muted">Real-time sensor data (updates every 3 seconds)</small>
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
        {/* Dashboard Content */}
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;