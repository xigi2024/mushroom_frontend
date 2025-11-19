import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge, Modal, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiTrash2, FiPlus, FiShield, FiSearch, FiClock } from 'react-icons/fi';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = "https://mycomatrix.in/api";

const Accounts = () => {
  const [activeSection, setActiveSection] = useState('accounts');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user: currentUser } = useAuth();

  // ✅ Configure axios headers with auth token
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // ✅ Fetch all users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching users list...');
      const response = await axios.get(`${API_BASE_URL}/users/list/`, {
        headers: getAuthHeaders()
      });
      
      console.log('✅ Users fetched successfully:', response.data);
      
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError(response.data.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(error.response?.data?.error || 'Failed to load users. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // ✅ Get status badge
  const getStatusBadge = (user) => {
    if (!user.is_active) {
      return <Badge bg="danger">Inactive</Badge>;
    }
    return <Badge bg="success">Active</Badge>;
  };

  // ✅ Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      'admin': { variant: 'danger', text: 'Admin' },
      'user': { variant: 'primary', text: 'User' }
    };
    const config = roleConfig[role] || { variant: 'secondary', text: role };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  // ✅ Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  // ✅ Handle user deletion
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user: ${userName}?`)) {
      return;
    }

    try {
      // You'll need to create a delete user API endpoint
      await axios.delete(`${API_BASE_URL}/users/delete/${userId}/`, {
        headers: getAuthHeaders()
      });
      
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="main-content">
          <div className="dashboard-content">
            <div className="text-center my-5">
              <Spinner animation="border" role="status" className="mb-3">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Loading users...</p>
            </div>
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
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Row>
            <Col md={12}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                  <h6 className="my-2 px-3 color fs-3">Users Management</h6>
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
                    
                    <Button 
                      variant="primary" 
                      className="d-flex align-items-center gap-2"
                      onClick={() => setShowModal(true)}
                    >
                      <FiPlus size={16} />
                      Add User
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 py-3 text-center">ID</th>
                        <th className="border-0 py-3">User</th>
                        <th className="border-0 py-3">Email</th>
                        <th className="border-0 py-3">Phone</th>
                        <th className="border-0 py-3">Role</th>
                        <th className="border-0 py-3">Status</th>
                        <th className="border-0 py-3">Joined Date</th>
                        <th className="border-0 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-4 text-muted">
                            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="py-3 text-center">
                              <strong>{user.id}</strong>
                            </td>
                            <td className="py-3">
                              <div className="d-flex align-items-center">
                                <div className="user-avatar-sm bg-primary text-white me-2 d-flex align-items-center justify-content-center rounded-circle" style={{width: '32px', height: '32px', fontSize: '14px'}}>
                                  {user.first_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <strong>
                                    {user.first_name && user.last_name 
                                      ? `${user.first_name} ${user.last_name}`
                                      : user.email.split('@')[0]
                                    }
                                  </strong>
                                  {!user.first_name && (
                                    <div>
                                      <small className="text-muted">Name not set</small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="d-flex align-items-center">
                                <FiMail className="me-1 text-muted" size={14} />
                                {user.email}
                              </div>
                            </td>
                            <td className="py-3">
                              {user.phone ? (
                                <div className="d-flex align-items-center">
                                  <FiPhone className="me-1 text-muted" size={14} />
                                  {user.phone}
                                </div>
                              ) : (
                                <span className="text-muted">Not set</span>
                              )}
                            </td>
                            <td className="py-3">
                              {getRoleBadge(user.role)}
                            </td>
                            <td className="py-3">
                              {getStatusBadge(user)}
                            </td>
                            <td className="py-3">
                              <div className="d-flex align-items-center">
                                <FiClock className="me-1 text-muted" size={14} />
                                {formatDate(user.created_at)}
                              </div>
                            </td>
                            <td className="py-3 text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="p-1"
                                  title="Edit User"
                                >
                                  <FiEdit size={14} />
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm" 
                                  className="p-1"
                                  onClick={() => handleDeleteUser(user.id, user.email)}
                                  title="Delete User"
                                  disabled={user.role === 'admin' || user.id === currentUser?.id}
                                >
                                  <FiTrash2 size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>

                  {/* Summary */}
                  <div className="p-3 border-top bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Showing {filteredUsers.length} of {users.length} users
                      </small>
                      <div className="d-flex gap-3">
                        <small className="text-muted">
                          <Badge bg="success" className="me-1">
                            {users.filter(u => u.is_active).length}
                          </Badge>
                          Active
                        </small>
                        <small className="text-muted">
                          <Badge bg="danger" className="me-1">
                            {users.filter(u => !u.is_active).length}
                          </Badge>
                          Inactive
                        </small>
                        <small className="text-muted">
                          <Badge bg="primary" className="me-1">
                            {users.filter(u => u.role === 'user').length}
                          </Badge>
                          Users
                        </small>
                        <small className="text-muted">
                          <Badge bg="danger" className="me-1">
                            {users.filter(u => u.role === 'admin').length}
                          </Badge>
                          Admins
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

      {/* Add User Modal (You can implement this later) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Add user form will be implemented here.</p>
          {/* You can add a form here for creating new users */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Accounts;