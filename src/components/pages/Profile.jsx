import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiSave, FiCamera } from 'react-icons/fi';
import axios from 'axios';
import '../styles/dashboard.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '123 Farm Street, Green Valley, Tamil Nadu',
    joinDate: '2024-01-15'
  });

  // 🔹 Fetch user profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token'); // ✅ FIXED

        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const userData = response.data.user;
          setUser(userData);
          setUserProfile({
            name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            email: userData.email || '',
            phone: userData.phone || '',
            address: '123 Farm Street, Green Valley, Tamil Nadu',
            joinDate: '2024-01-15'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
        
        // 🔹 Fallback to localStorage if API fails
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
          setUserProfile({
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            email: user.email || '',
            phone: user.phone || '',
            address: '123 Farm Street, Green Valley, Tamil Nadu',
            joinDate: '2024-01-15'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 User initials for avatar
  const getUserInitials = () => {
    if (!user) return 'DR';
    const { first_name, last_name } = user;
    if (first_name && last_name) {
      return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase();
    } else if (first_name) {
      return first_name.charAt(0).toUpperCase();
    } else if (last_name) {
      return last_name.charAt(0).toUpperCase();
    }
    return 'DR';
  };

  // 🔹 User display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    const { first_name, last_name } = user;
    if (first_name && last_name) {
      return `${first_name} ${last_name}`;
    } else if (first_name) {
      return first_name;
    } else if (last_name) {
      return last_name;
    }
    return user.email || 'User';
  };

  // 🔹 Save profile
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token'); // ✅ FIXED

      const updateData = {
        first_name: userProfile.name.split(' ')[0],
        last_name: userProfile.name.split(' ').slice(1).join(' '),
        email: userProfile.email,
        phone: userProfile.phone
      };

      const response = await axios.put('http://127.0.0.1:8000/api/profile/', updateData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setIsEditing(false);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);

        const updatedUser = {
          ...JSON.parse(localStorage.getItem('user') || '{}'),
          first_name: updateData.first_name,
          last_name: updateData.last_name,
          email: updateData.email,
          phone: updateData.phone
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="profile-container" >
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-1">Profile</h2>
            <p className="text-muted mb-0">Manage your personal information</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {showAlert && (
        <Alert variant="success" className="mb-4">
          Profile updated successfully!
        </Alert>
      )}

      <Row>
        <Col md={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="text-center py-5">
              <div className="position-relative d-inline-block mb-3">
                <div className="user-avatar-large mx-auto">{getUserInitials()}</div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="position-absolute bottom-0 end-0 rounded-circle p-2"
                  style={{ width: '35px', height: '35px' }}
                  disabled={true}
                >
                  <FiCamera size={14} />
                </Button>
              </div>
              <h5 className="mb-1">{getUserDisplayName()}</h5>
              <p className="text-muted mb-3">Mushroom Farmer</p>
              <Badge bg="success" className="px-3 py-2">Active Member</Badge>
              <div className="mt-4">
                <small className="text-muted">Member since {userProfile.joinDate}</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Personal Information</h6>
              <Button 
                variant={isEditing ? "success" : "outline-primary"} 
                size="sm"
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : isEditing ? (
                  <><FiSave className="me-2" />Save</>
                ) : (
                  <><FiEdit className="me-2" />Edit</>
                )}
              </Button>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={userProfile.name}
                        disabled={!isEditing || loading}
                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={userProfile.email}
                        disabled={!isEditing || loading}
                        onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        value={userProfile.phone}
                        disabled={!isEditing || loading}
                        onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Join Date</Form.Label>
                      <Form.Control
                        type="text"
                        value={userProfile.joinDate}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={userProfile.address}
                    disabled={!isEditing || loading}
                    onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile; 
