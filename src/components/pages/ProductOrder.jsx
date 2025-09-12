import React, { useState } from 'react';
import { Row, Col, Card, Table, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { FiSearch, FiFilter, FiMoreVertical } from 'react-icons/fi';
import Sidebar from '../Sidebar';

const ProductOrder = ({ userRole = 'admin' }) => {
  const [activeSection, setActiveSection] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const orders = [
    { id: 'ORD-001', customer: 'John Smith', product: 'Organic Shiitake Mushrooms', quantity: 2, amount: 2450, status: 'delivered', date: '2025-01-10' },
    { id: 'ORD-002', customer: 'Sarah Johnson', product: 'Button Mushrooms', quantity: 5, amount: 2200, status: 'processing', date: '2025-01-12' },
    { id: 'ORD-003', customer: 'Mike Chen', product: 'Oyster Mushrooms', quantity: 3, amount: 2300, status: 'shipped', date: '2025-01-12' },
    { id: 'ORD-004', customer: 'Emily Davis', product: 'Mixed Mushroom Pack', quantity: 1, amount: 2150, status: 'pending', date: '2025-01-13' },
    { id: 'ORD-005', customer: 'David Wilson', product: 'Premium Shiitake', quantity: 4, amount: 2800, status: 'processing', date: '2025-01-13' },
    { id: 'ORD-006', customer: 'Mike Chen', product: 'Oyster Mushrooms', quantity: 3, amount: 2300, status: 'delivered', date: '2025-01-13' },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      delivered: { variant: 'success', text: 'Delivered' },
      processing: { variant: 'warning', text: 'Processing' },
      shipped: { variant: 'info', text: 'Shipped' },
      pending: { variant: 'secondary', text: 'Pending' }
    };
    return statusConfig[status] || { variant: 'secondary', text: status };
  };

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />
      
      <div className="main-content">

        
        <div className="dashboard-content">
        <div className='mb-4'>
              <h2 className="mb-1">Orders</h2>
              <p className="text-muted mb-0">Manage all orders</p>
            </div>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
              <h6 className="mb-0">All Orders</h6>
              <div className="d-flex gap-2">
                <InputGroup style={{ width: '300px' }}>
                  <InputGroup.Text>
                    <FiSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search..."
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
                    <th className="border-0 py-3">Customer</th>
                    <th className="border-0 py-3">Product</th>
                    <th className="border-0 py-3">Quantity</th>
                    <th className="border-0 py-3">Amount</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3">
                        <strong>{order.id}</strong>
                      </td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.product}</td>
                      <td className="py-3">{order.quantity}</td>
                      <td className="py-3">₹{order.amount}</td>
                      <td className="py-3">
                        <Badge bg={getStatusBadge(order.status).variant} className="px-3 py-2">
                          {getStatusBadge(order.status).text}
                        </Badge>
                      </td>
                      <td className="py-3">{order.date}</td>
                     
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

export default ProductOrder;
