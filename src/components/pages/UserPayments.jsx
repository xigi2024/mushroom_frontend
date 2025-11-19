import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FiSearch, FiDownload, FiCreditCard, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import { FaMoneyBillWave } from "react-icons/fa";
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserPayments = () => {
  const [activeSection, setActiveSection] = useState('payment');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const fetchMyPayments = async () => {
    if (!isAuthenticated || !token) {
      console.log('User not authenticated, redirecting to login...');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Fetching my orders with payments...');
const response = await fetch('https://mycomatrix.in/api/payments/my-payments/', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('access_token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ My orders with payments API response:', data);
      
     if (data.success) {
  setPayments(data.payments || []);
} else {
  setError(data.error || 'Failed to fetch payment history');
}
    } catch (err) {
      console.error('Error fetching payment history:', err);
      setError('Failed to load payment history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyPayments();
    } else {
      // If not authenticated, redirect to login
      navigate('/login');
    }
  }, [isAuthenticated]);


  const exportToCSV = () => {
    if (payments.length === 0) {
      alert('No payment data to export');
      return;
    }

    // Create CSV header
    const headers = ['Payment ID', 'Razorpay ID', 'Order ID', 'Amount (₹)', 'Payment Method', 'Status', 'Date', 'Currency'];
    
    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...payments.map(payment => 
        [
          `"${payment.id}"`,
          `"${payment.razorpay_payment_id || 'N/A'}"`,
          `"${payment.order || 'N/A'}"`,
          payment.amount || 0,
          `"${payment.payment_method || 'razorpay'}"`,
          `"${getStatusBadge(payment.status).text}"`,
          `"${formatDate(payment.created_at)}"`,
          `"${payment.currency || 'INR'}"`
        ].join(',')
      )
    ];
    
    // Create CSV string
    const csvString = csvRows.join('\n');
    
    // Create download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `my_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: 'success', text: 'Completed' },
      captured: { variant: 'success', text: 'Captured' },
      pending: { variant: 'warning', text: 'Pending' },
      failed: { variant: 'danger', text: 'Failed' },
      refunded: { variant: 'info', text: 'Refunded' },
      created: { variant: 'secondary', text: 'Created' }
    };
    return statusConfig[status] || { variant: 'secondary', text: status || 'Unknown' };
  };

  const getMethodIcon = (method) => {
    return <FiCreditCard className="me-2" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // ✅ FIXED: Convert paymentId to string before using .toLowerCase()
  const filteredPayments = payments.filter(payment => {
    const paymentId = String(payment.razorpay_payment_id || payment.id || '');
    const orderId = String(payment.order?.toString() || '');
    
    const matchesSearch = paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // ✅ Calculate totals from actual API data
  const totalSpent = payments
    .filter(p => p.status === 'completed' || p.status === 'captured')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  
  const successfulPayments = payments.filter(p => p.status === 'completed' || p.status === 'captured').length;
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'created').length;

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole="user" />
        <div className="main-content">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" variant="success" />
            <span className="ms-2">Loading your payments...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole="user" />
      
      <div className="main-content">
        <div className="dashboard-content">
          {/* Payment Stats */}
          <div className='mb-4'>
            <h2 className="mb-1">My Payments</h2>
            <p className="text-muted mb-0">Track your payment history and transactions</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
              <Button 
                variant="link" 
                className="p-0 ms-2" 
                onClick={fetchMyPayments}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Revenue Stats */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-success mb-3">
                    <FaMoneyBillWave size={32} />
                  </div>
                  <div className="h3 text-success mb-0">₹{totalSpent.toLocaleString()}</div>
                  <div className="text-muted">Total Spent</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-primary mb-3">
                    <FiCreditCard size={32} />
                  </div>
                  <div className="h3 text-primary mb-0">{successfulPayments}</div>
                  <div className="text-muted">Successful Payments</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-warning mb-3">
                    <FiCalendar size={32} />
                  </div>
                  <div className="h3 text-warning mb-0">{pendingPayments}</div>
                  <div className="text-muted">Pending Payments</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Payment History Table */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                My Transaction History 
                <Badge bg="secondary" className="ms-2">
                  {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
                </Badge>
              </h6>
              <div className="d-flex gap-2">
                <Form.Select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="captured">Captured</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </Form.Select>
                <InputGroup style={{ width: '250px' }}>
                  <InputGroup.Text>
                    <FiSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <Button 
                  className='border-0 button' 
                
                  onClick={exportToCSV}
                  disabled={payments.length === 0}
                >
                  <FiDownload className="me-2" />
                  Export CSV
                </Button>
                <Button variant="outline-success" onClick={fetchMyPayments}>
                  <FiRefreshCw className="me-2" />
                  Refresh
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredPayments.length === 0 && payments.length > 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No payments match your search criteria</p>
                  <Button variant="outline-secondary" onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No payments found</p>
                  <p className="text-muted small">Your payment history will appear here after you make a purchase.</p>
                  <Button variant="success" onClick={() => navigate('/products')}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3">Payment ID</th>
                      <th className="border-0 py-3">Razorpay ID</th>
                      <th className="border-0 py-3">Order ID</th>
                      <th className="border-0 py-3">Amount</th>
                      <th className="border-0 py-3">Method</th>
                      <th className="border-0 py-3">Status</th>
                      <th className="border-0 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="py-3">
                          <strong className="text-primary">{payment.id}</strong>
                        </td>
                        <td className="py-3">
                          <code className="text-muted small">
                            {payment.razorpay_payment_id || 'N/A'}
                          </code>
                        </td>
                        <td className="py-3">
                          {payment.order ? (
                            <Badge bg="light" text="dark">
                              Order #{payment.order}
                            </Badge>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="py-3">
                          <div className="fw-bold text-success">
                            ₹{(parseFloat(payment.amount) || 0).toLocaleString()}
                          </div>
                          <small className="text-muted">{payment.currency}</small>
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center">
                            {getMethodIcon(payment.payment_method)}
                            <span className="text-capitalize">
                              {payment.payment_method || 'razorpay'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge 
                            bg={getStatusBadge(payment.status).variant} 
                            className="px-3 py-2"
                          >
                            {getStatusBadge(payment.status).text}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <small className="text-muted">
                            {formatDate(payment.created_at)}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>      
        </div>
      </div>
    </div>
  );
};

export default UserPayments;