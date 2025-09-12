import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge } from 'react-bootstrap';
import { FiSettings, FiMonitor, FiSave } from 'react-icons/fi';
import Sidebar from '../Sidebar';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('settings');

  const iotSettings = [
    { sensor: 'Temperature Sensors', status: 'connected', lastUpdate: '2 mins ago', location: 'All Rooms' },
    { sensor: 'Humidity Sensors', status: 'connected', lastUpdate: '1 min ago', location: 'All Rooms' },
    { sensor: 'CO2 Monitors', status: 'warning', lastUpdate: '5 mins ago', location: 'Room 3,7' },
    { sensor: 'Light Sensors', status: 'connected', lastUpdate: '3 mins ago', location: 'All Rooms' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      connected: { variant: 'success', text: 'Connected' },
      warning: { variant: 'warning', text: 'Warning' },
      disconnected: { variant: 'danger', text: 'Disconnected' }
    };
    return statusConfig[status] || { variant: 'secondary', text: status };
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="main-content">
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Settings</h2>
              <p className="text-muted mb-0">Configure system preferences and IoT settings</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Welcome, Delicious Recipe</span>
              <div className="user-avatar">DR</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-content">
          <Row>
            <Col md={6}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                  <div className="d-flex align-items-center">
                    <FiSettings className="me-2 text-primary" />
                    <h6 className="mb-0">System Configuration</h6>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Data Update Interval</Form.Label>
                          <Form.Select>
                            <option value="30">30 seconds</option>
                            <option value="60">1 minute</option>
                            <option value="300">5 minutes</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Temperature Unit</Form.Label>
                          <Form.Select>
                            <option value="celsius">Celsius (°C)</option>
                            <option value="fahrenheit">Fahrenheit (°F)</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Alert Threshold</Form.Label>
                          <Form.Select>
                            <option value="low">Low Sensitivity</option>
                            <option value="medium">Medium Sensitivity</option>
                            <option value="high">High Sensitivity</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Backup Frequency</Form.Label>
                          <Form.Select>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button className='border-0' style={{backgroundColor:"#15640d"}}>
                      <FiSave className="me-2" />
                      Update Settings
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h6 className="mb-3 pt-4 fs-5">IoT Device Status</h6>
              </div>
            
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3">Sensor Type</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3">Last Update</th>
                    <th className="border-0 py-3">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {iotSettings.map((device, index) => (
                    <tr key={index}>
                      <td className="py-3">
                        <strong>{device.sensor}</strong>
                      </td>
                      <td className="py-3">
                        <Badge bg={getStatusBadge(device.status).variant} className="px-3 py-2">
                          {getStatusBadge(device.status).text}
                        </Badge>
                      </td>
                      <td className="py-3">{device.lastUpdate}</td>
                      <td className="py-3">{device.location}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
