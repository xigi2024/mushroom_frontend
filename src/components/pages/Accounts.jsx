import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge, Modal, InputGroup } from 'react-bootstrap';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiTrash2, FiPlus, FiShield, FiSearch } from 'react-icons/fi';
import Sidebar from '../Sidebar';

const Accounts = () => {
  const [activeSection, setActiveSection] = useState('accounts');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const userProfile = {
    name: 'Delicious Recipe',
    email: 'delicious@mushroomsite.com',
    phone: '+91 98765 43210',
    address: '123 Farm Street, Green Valley, Tamil Nadu',
    role: 'Farm Manager',
    joinDate: '2024-01-15'
  };

  const teamMembers = [
    { id: 1, name: 'John Smith', email: 'john@mushroomsite.com', phone: '+91 98765 43211', role: 'IoT Specialist', status: 'active', lastLogin: '2 hours ago' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@mushroomsite.com', phone: '+91 98765 43212', role: 'Quality Manager', status: 'active', lastLogin: '1 day ago' },
    { id: 3, name: 'Mike Chen', email: 'mike@mushroomsite.com', phone: '+91 98765 43213', role: 'Farm Worker', status: 'inactive', lastLogin: '3 days ago' },
    { id: 4, name: 'Emily Davis', email: 'emily@mushroomsite.com', phone: '+91 98765 43214', role: 'Sales Manager', status: 'active', lastLogin: '5 hours ago' }
  ];

  // Filter team members based on search term
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.phone && member.phone.includes(searchTerm))
  );

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="main-content">
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Accounts</h2>
              <p className="text-muted mb-0">Manage user accounts and permissions</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Welcome, {userProfile.name}</span>
              <div className="user-avatar">DR</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-content">
          <Row>
            <Col md={12}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                  <h6 className="my-2 px-3 color fs-3">Users</h6>
                  <div className="d-flex gap-2">
                    <InputGroup className="w-auto">
                      <InputGroup.Text>
                        <FiSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                    
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 py-3 text-center">S.No</th>
                        <th className="border-0 py-3">Name</th>
                        <th className="border-0 py-3">Email</th>
                        <th className="border-0 py-3">Phone</th>
                        <th className="border-0 py-3">Status</th>
                        <th className="border-0 py-3">Last Login</th>
                        <th className="border-0 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member, index) => (
                        <tr key={member.id}>
                          <td className="py-3 text-center">
                            <strong>{index + 1}</strong>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="user-avatar-sm me-2">{member.name.charAt(0)}</div>
                              <div>
                                <strong>{member.name}</strong>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">{member.email}</td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <FiPhone className="me-1 text-muted" size={14} />
                              {member.phone}
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge bg={member.status === 'active' ? 'success' : 'secondary'}>
                              {member.status}
                            </Badge>
                          </td>
                          <td className="py-3">{member.lastLogin}</td>
                          <td className="py-3 text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <Button variant="outline-primary" size="sm" className="p-1">
                                <FiEdit size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" className="p-1">
                                <FiTrash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Accounts;