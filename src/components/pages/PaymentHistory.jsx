import React, { useState } from 'react';
import { Row, Col, Card, Table, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { FiSearch, FiDownload, FiCreditCard,FiCalendar } from 'react-icons/fi';
import {  FaMoneyBillWave } from "react-icons/fa";

import Sidebar from '../Sidebar';

const PaymentHistory = () => {
  const [activeSection, setActiveSection] = useState('payment');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const payments = [
    { id: 'PAY-001', orderId: 'ORD-001', customer: 'John Smith', amount: 2450, method: 'Credit Card', status: 'completed', date: '2025-01-10', fee: 49 },
    { id: 'PAY-002', orderId: 'ORD-002', customer: 'Sarah Johnson', amount: 2200, method: 'UPI', status: 'completed', date: '2025-01-12', fee: 22 },
    { id: 'PAY-003', orderId: 'ORD-003', customer: 'Mike Chen', amount: 2300, method: 'Net Banking', status: 'pending', date: '2025-01-12', fee: 23 },
    { id: 'PAY-004', orderId: 'ORD-004', customer: 'Emily Davis', amount: 2150, method: 'Credit Card', status: 'failed', date: '2025-01-13', fee: 0 },
    { id: 'PAY-005', orderId: 'ORD-005', customer: 'David Wilson', amount: 2800, method: 'UPI', status: 'completed', date: '2025-01-13', fee: 28 },
    { id: 'PAY-006', orderId: 'ORD-006', customer: 'Lisa Brown', amount: 1950, method: 'Wallet', status: 'completed', date: '2025-01-14', fee: 19 },
    { id: 'PAY-007', orderId: 'ORD-007', customer: 'Tom Wilson', amount: 3200, method: 'Credit Card', status: 'refunded', date: '2025-01-14', fee: -32 }
  ];

  const exportToCSV = () => {
    // Create CSV header
    const headers = ['Payment ID', 'Order ID', 'Customer', 'Amount (₹)', 'Payment Method', 'Status', 'Date', 'Fee (₹)'];
    
    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...payments.map(payment => 
        [
          `"${payment.id}"`,
          `"${payment.orderId}"`,
          `"${payment.customer}"`,
          payment.amount,
          `"${payment.method}"`,
          `"${getStatusBadge(payment.status).text}"`,
          `"${payment.date}"`,
          payment.fee
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
    link.setAttribute('download', `payment_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: 'success', text: 'Completed' },
      pending: { variant: 'warning', text: 'Pending' },
      failed: { variant: 'danger', text: 'Failed' },
      refunded: { variant: 'info', text: 'Refunded' }
    };
    return statusConfig[status] || { variant: 'secondary', text: status };
  };

  const getMethodIcon = (method) => {
    return <FiCreditCard className="me-2" />;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalFees = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.fee, 0);

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="main-content">
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Payment History</h2>
              <p className="text-muted mb-0">Track all payment transactions and revenue</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Welcome, Delicious Recipe</span>
              <div className="user-avatar">DR</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-content">
          {/* Revenue Stats */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-success mb-3">
                    <FaMoneyBillWave size={32} />
                  </div>
                  <div className="h3 text-success mb-0">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-muted">Total Revenue</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-primary mb-3">
                    <FiCreditCard size={32} />
                  </div>
                  <div className="h3 text-primary mb-0">{payments.filter(p => p.status === 'completed').length}</div>
                  <div className="text-muted">Successful Payments</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-4">
                  <div className="text-warning mb-3">
                    <FiCalendar size={32} />
                  </div>
                  <div className="h3 text-warning mb-0">{payments.filter(p => p.status === 'pending').length}</div>
                  <div className="text-muted">Pending Payments</div>
                </Card.Body>
              </Card>
            </Col>
          
          </Row>

          {/* Payment History Table */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
              <h6 className="mb-0">All Transactions</h6>
              <div className="d-flex gap-2">
                <Form.Select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </Form.Select>
                <InputGroup style={{ width: '300px' }}>
                  <InputGroup.Text>
                    <FiSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <Button className='border-0' style={{backgroundColor:"#15640d"}} onClick={exportToCSV}>
                  <FiDownload className="me-2" />
                  Export CSV
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3">Payment ID</th>
                    <th className="border-0 py-3">Order ID</th>
                    <th className="border-0 py-3">Customer</th>
                    <th className="border-0 py-3">Amount</th>
                    <th className="border-0 py-3">Method</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3">Date</th>
                    <th className="border-0 py-3">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="py-3">
                        <strong>{payment.id}</strong>
                      </td>
                      <td className="py-3">{payment.orderId}</td>
                      <td className="py-3">{payment.customer}</td>
                      <td className="py-3">
                        <strong>₹{payment.amount.toLocaleString()}</strong>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          {getMethodIcon(payment.method)}
                          {payment.method}
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge bg={getStatusBadge(payment.status).variant} className="px-3 py-2">
                          {getStatusBadge(payment.status).text}
                        </Badge>
                      </td>
                      <td className="py-3">{payment.date}</td>
                      <td className="py-3">
                        <span className={payment.fee < 0 ? 'text-danger' : 'text-success'}>
                          ₹{Math.abs(payment.fee)}
                        </span>
                      </td>
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

export default PaymentHistory;
