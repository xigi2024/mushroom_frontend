import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import Sidebar from '../Sidebar';

const ProductOrder = ({ userRole = 'admin' }) => {
  const [activeSection, setActiveSection] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's orders
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please login to view your orders');
        setLoading(false);
        return;
      }

      const response = await fetch('https://mycomatrix.in/api/orders/my-orders/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const ordersData = await response.json();
      console.log('📦 User orders:', ordersData);
      setOrders(ordersData);
      
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  // Format order data for display
  const formatOrdersForDisplay = () => {
    return orders.flatMap(order => 
      order.items.map(item => ({
        id: order.id,
        order_id: `ORD-${String(order.id).padStart(3, '0')}`,
        customer: `${order.user_details?.first_name || 'User'} ${order.user_details?.last_name || ''}`.trim() || 'Customer',
        product: item.product?.name || 'Product',
        quantity: item.qty || 1,
        amount: parseFloat(item.price || 0) * (item.qty || 1),
        total_order_amount: parseFloat(order.total_amount || 0),
        status: order.status || 'pending',
        payment_status: order.payment_status || 'unpaid',
        date: new Date(order.created_at).toLocaleDateString('en-IN'),
        item_details: item
      }))
    );
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
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />
        <div className="main-content">
          <div className="dashboard-content">
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />
      
      <div className="main-content">
        <div className="dashboard-content">
          <div className='mb-4'>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">My Orders</h2>
                <p className="text-muted mb-0">View your order history and status</p>
              </div>
              <Button 
                variant="outline-primary" 
                onClick={fetchUserOrders}
                disabled={loading}
              >
                <FiRefreshCw className={loading ? 'spinner' : ''} /> Refresh
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {orders.length === 0 && !error && !loading && (
            <Alert variant="info" className="mb-4">
              <strong>No orders found!</strong> You haven't placed any orders yet.
            </Alert>
          )}

          {orders.length > 0 && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  Order History ({filteredOrders.length} items)
                </h6>
                <div className="d-flex gap-2">
                  <InputGroup style={{ width: '300px' }}>
                    <InputGroup.Text>
                      <FiSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search orders..."
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
                  </Form.Select>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3">Order ID</th>
                      <th className="border-0 py-3">Product</th>
                      <th className="border-0 py-3">Quantity</th>
                      <th className="border-0 py-3">Item Amount</th>
                      <th className="border-0 py-3">Order Status</th>
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
                            <div className="fw-semibold">{order.product}</div>
                            <small className="text-muted">
                              Order Total: ₹{order.total_order_amount}
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

export default ProductOrder;