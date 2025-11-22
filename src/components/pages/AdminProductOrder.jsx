import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { FiSearch, FiRefreshCw, FiUser } from 'react-icons/fi';
import Sidebar from '../Sidebar';

const AdminProductOrder = () => {
  const [activeSection, setActiveSection] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all orders (Admin only)
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please login to view orders');
        setLoading(false);
        return;
      }

      console.log('🔍 Admin fetching all orders...');
      const response = await fetch('https://mycomatrix.in/api/orders/all-orders/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403) {
        setError('Admin access required to view all orders');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log('📦 All orders response:', data);
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || 'Failed to load orders');
      }
      
    } catch (err) {
      console.error('❌ Error fetching all orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Format order data for display
// Format order data for display - FIXED VERSION
const formatOrdersForDisplay = () => {
  if (!Array.isArray(orders)) return [];
  
  return orders.flatMap(order => {
    // Handle orders with no items
    if (!order.items || order.items.length === 0) {
      return [{
        id: order.id,
        order_id: `ORD-${String(order.id).padStart(3, '0')}`,
        customer: order.user_details?.name || 'Customer',
        customer_email: order.user_details?.email || 'N/A',
        product: 'No items in order', // Placeholder
        quantity: 0,
        amount: 0,
        total_order_amount: parseFloat(order.total_amount || 0),
        status: order.status || 'pending',
        payment_status: order.payment_status || 'unpaid',
        date: new Date(order.created_at).toLocaleDateString('en-IN'),
        item_details: null,
        has_empty_items: true
      }];
    }
    
    // Normal orders with items
    return order.items.map(item => ({
      id: order.id,
      order_id: `ORD-${String(order.id).padStart(3, '0')}`,
      customer: order.user_details?.name || 'Customer',
      customer_email: order.user_details?.email || 'N/A',
      product: item.product?.name || 'Product',
      quantity: item.qty || 1,
      amount: parseFloat(item.price || 0) * (item.qty || 1),
      total_order_amount: parseFloat(order.total_amount || 0),
      status: order.status || 'pending',
      payment_status: order.payment_status || 'unpaid',
      date: new Date(order.created_at).toLocaleDateString('en-IN'),
      item_details: item
    }));
  });
};
  const displayOrders = formatOrdersForDisplay();

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

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusConfig = {
      paid: { variant: 'success', text: 'Paid' },
      unpaid: { variant: 'warning', text: 'Unpaid' },
      failed: { variant: 'danger', text: 'Failed' },
      refunded: { variant: 'info', text: 'Refunded' }
    };
    return statusConfig[paymentStatus] || { variant: 'secondary', text: paymentStatus };
  };

  const filteredOrders = displayOrders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
  const completedOrders = orders.filter(order => order.status === 'completed' || order.status === 'delivered').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole="admin" />
        <div className="main-content">
          <div className="dashboard-content">
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading all orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole="admin" />
      
      <div className="main-content">
        <div className="dashboard-content">
          <div className='mb-4'>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">All Orders</h2>
                <p className="text-muted mb-0">Manage and view all customer orders</p>
              </div>
              <Button 
                variant="outline-primary" 
                onClick={fetchAllOrders}
                disabled={loading}
              >
                <FiRefreshCw className={loading ? 'spinner' : ''} /> Refresh
              </Button>
            </div>
          </div>

          {/* Admin Statistics */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-primary mb-3">
                    <FiUser size={32} />
                  </div>
                  <div className="h3 text-primary mb-0">{totalOrders}</div>
                  <div className="text-muted">Total Orders</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-success mb-3">
                    <FiUser size={32} />
                  </div>
                  <div className="h3 text-success mb-0">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-muted">Total Revenue</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-info mb-3">
                    <FiUser size={32} />
                  </div>
                  <div className="h3 text-info mb-0">{completedOrders}</div>
                  <div className="text-muted">Completed</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-warning mb-3">
                    <FiUser size={32} />
                  </div>
                  <div className="h3 text-warning mb-0">{pendingOrders}</div>
                  <div className="text-muted">Pending</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {orders.length === 0 && !error && !loading && (
            <Alert variant="info" className="mb-4">
              <strong>No orders found!</strong> No customer orders have been placed yet.
            </Alert>
          )}

          {orders.length > 0 && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  All Customer Orders ({filteredOrders.length} items)
                </h6>
                <div className="d-flex gap-2">
                  <InputGroup style={{ width: '300px' }}>
                    <InputGroup.Text>
                      <FiSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search orders by customer, product, status..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                  <Form.Select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: '150px' }}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="amount">Amount</option>
                    <option value="customer">Customer</option>
                  </Form.Select>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3">Order ID</th>
                      <th className="border-0 py-3">Customer</th>
                      <th className="border-0 py-3">Product</th>
                      <th className="border-0 py-3">Qty</th>
                      <th className="border-0 py-3">Amount</th>
                      <th className="border-0 py-3">Status</th>
                      <th className="border-0 py-3">Payment</th>
                      <th className="border-0 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr key={`${order.id}-${index}`}>
                        <td className="py-3">
                          <strong>{order.order_id}</strong>
                        </td>
                        <td className="py-3">
                          <div>
                            <div className="fw-semibold">{order.customer}</div>
                            <small className="text-muted">
                              {order.customer_email}
                            </small>
                          </div>
                        </td>
                        <td className="py-3">
                          <div>
                            <div className="fw-semibold">{order.product}</div>
                            <small className="text-muted">
                              Total: ₹{order.total_order_amount}
                            </small>
                          </div>
                        </td>
                        <td className="py-3">{order.quantity}</td>
                        <td className="py-3">₹{order.amount.toFixed(2)}</td>
                        <td className="py-3">
                          <Badge bg={getStatusBadge(order.status).variant} className="px-3 py-2">
                            {getStatusBadge(order.status).text}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge bg={getPaymentStatusBadge(order.payment_status).variant} className="px-3 py-2">
                            {getPaymentStatusBadge(order.payment_status).text}
                          </Badge>
                        </td>
                        <td className="py-3">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductOrder;