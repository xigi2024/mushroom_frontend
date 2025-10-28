import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, getTotalPrice, getTotalItems, clearCart, isAuthenticated } = useCart();
  
  // ✅ IMPORTANT: Location state check pannu
  const locationState = location.state || {};
  const fromCart = locationState.fromCart || false;
  
  // ✅ Check which route la irukkom
  let cartTotal, totalItems, totalAmount;
  let orderItems = [];

  if (fromCart) {
    // ✅ Cart la irundhu vanthom - cart data use pannu
    cartTotal = getTotalPrice();
    totalItems = getTotalItems();
    totalAmount = cartTotal;
    
    // Cart items prepare pannu
    orderItems = cart?.items?.map(item => ({
      product: item.product?.name || 'Product',
      product_id: item.product?.id,
      quantity: item.qty || 1,
      price: parseFloat(item.price || item.product?.price || 0),
      total: (parseFloat(item.price || item.product?.price || 0) * (item.qty || 1))
    })) || [];
  } else {
    // ✅ Product details la irundhu vanthom - location state use pannu
    cartTotal = locationState.total || 0;
    totalItems = locationState.quantity || 1;
    totalAmount = locationState.total || 0;
    
    // Single product prepare pannu
    orderItems = [{
      product: locationState.product || 'Product',
      product_id: locationState.product_id,
      quantity: locationState.quantity || 1,
      price: locationState.price || 0,
      total: locationState.total || 0
    }];
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'card'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Auto-fill user data if logged in
  useEffect(() => {
    if (isAuthenticated) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setFormData(prev => ({
        ...prev,
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        email: userData.email || '',
        phone: userData.phone || ''
      }));
    }
  }, [isAuthenticated]);

  // ✅ Check if user directly checkout ku vantha (cart empty ah iruntha)
  useEffect(() => {
    if (fromCart && totalItems === 0) {
      alert('Your cart is empty. Redirecting to products page.');
      navigate('/products');
    }
  }, [fromCart, totalItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Payment success la cart clear pannu (only for cart checkout)
  const handlePaymentSuccess = (orderDetails) => {
    console.log('✅ Payment successful - Order Details:', orderDetails);
    
    if (fromCart) {
      clearCart(); // Cart clear pannu only if from cart
    }
    
    // Show success message with order details
    const successMessage = orderDetails.payment_method === 'cod' 
      ? `🎉 COD Order Placed Successfully! 
Order ID: ORD-${orderDetails.db_order_id}
Amount: ₹${orderDetails.amount}
We will contact you for delivery.`
      : `🎉 Payment Successful! 
Order ID: ORD-${orderDetails.db_order_id}
Amount: ₹${orderDetails.amount}
Thank you for your purchase!`;
    
    alert(successMessage);
    
    navigate('/order-success', { 
      state: { 
        orderDetails,
        orderItems,
        shippingAddress: formData
      }
    });
  };

  // ✅ Razorpay Script Load Pannu
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('✅ Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // ✅ COD Order Create Pannu - FIXED VERSION
  const createCODOrder = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('User not authenticated for COD order');
      }

      console.log('🔄 Creating COD order...');
      
      const codOrderPayload = {
        order_type: fromCart ? 'cart' : 'single_product',
        total_amount: totalAmount,
        items: orderItems,
        shipping_address: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode
        }
      };

      console.log('📤 COD Order Payload:', codOrderPayload);

      const response = await fetch('http://127.0.0.1:8000/api/create-cod-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(codOrderPayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const orderData = await response.json();
      console.log('📥 COD Order Response:', orderData);

      if (orderData.success) {
        return {
          success: true,
          order_id: orderData.order_id,
          db_order_id: orderData.db_order_id,
          amount: totalAmount,
          payment_method: 'cod',
          order_status: orderData.order_status || 'pending',
          payment_status: orderData.payment_status || 'pending'
        };
      } else {
        throw new Error(orderData.error || 'Failed to create COD order');
      }
    } catch (error) {
      console.error('❌ COD Order Creation Error:', error);
      throw error;
    }
  };

  // ✅ Payment Process
  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('💰 Starting payment process...');
      console.log('📦 Order items:', orderItems);
      console.log('💳 Total amount:', totalAmount);

      // Step 1: Razorpay script load
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Payment system failed to load. Please refresh and try again.');
        return;
      }

      // Step 2: Create Razorpay order in backend
      console.log('🔗 Creating Razorpay order...');
      const orderResponse = await fetch('http://127.0.0.1:8000/api/create-razorpay-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          cart_id: fromCart ? cart?.id : null,
          order_type: fromCart ? 'cart' : 'single_product'
        })
      });

      if (!orderResponse.ok) {
        throw new Error(`HTTP error! status: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();
      console.log('📄 Razorpay order response:', orderData);
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create Razorpay order');
      }

      // Step 3: Razorpay options setup
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Mushroom Store',
        description: fromCart ? `Order for ${totalItems} items` : `Order for ${locationState.product}`,
        order_id: orderData.order_id,
        
        // ✅ Payment Success Handler - UPDATED WITH ORDER CONFIRMATION
        handler: async function (response) {
          console.log('💰 Razorpay payment response:', response);
          
          try {
            // Step 4: Verify payment with backend and CREATE ORDER
            const token = localStorage.getItem('access_token');
            console.log('🔐 Using token for verification:', token ? 'Token present' : 'No token');
            
            const verifyPayload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              total_amount: totalAmount,
              order_type: fromCart ? 'cart' : 'single_product',
              items: orderItems,
              user_email: formData.email,
              shipping_address: {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode
              }
            };
            
            console.log('📤 Sending verification & order creation payload:', verifyPayload);

            const verifyResponse = await fetch('http://127.0.0.1:8000/api/verify-payment/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(verifyPayload)
            });

            if (!verifyResponse.ok) {
              throw new Error(`HTTP error! status: ${verifyResponse.status}`);
            }

            const verifyData = await verifyResponse.json();
            console.log('📥 Verification & Order Creation Response:', verifyData);
            
            if (verifyData.status === 'success') {
              console.log('✅ Payment verified and ORDER CREATED successfully');
              
              // ✅ IMPORTANT: Check if order actually created in database
              if (verifyData.db_order_id) {
                console.log('🎉 Order confirmed in database with ID:', verifyData.db_order_id);
                
                handlePaymentSuccess({
                  payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  db_order_id: verifyData.db_order_id,
                  amount: totalAmount,
                  payment_method: 'razorpay',
                  order_status: verifyData.order_status || 'completed',
                  payment_status: verifyData.payment_status || 'paid',
                  created_at: verifyData.created_at || new Date().toISOString()
                });
              } else {
                console.error('❌ Order creation failed - no db_order_id received');
                alert('❌ Order creation failed. Please contact support with payment ID: ' + response.razorpay_payment_id);
                setLoading(false);
              }
            } else {
              console.error('❌ Payment verification failed:', verifyData.error);
              alert(`❌ Payment Verification Failed: ${verifyData.error}`);
              setLoading(false);
            }
          } catch (verifyError) {
            console.error('❌ Verification API error:', verifyError);
            alert('❌ Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        
        // ✅ Prefill customer details
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        
        // ✅ Theme
        theme: {
          color: '#28a745'
        },
        
        // ✅ Modal close handler
        modal: {
          ondismiss: function() {
            console.log('❌ Payment modal closed by user');
            setLoading(false);
          }
        }
      };

      // Step 5: Open Razorpay checkout
      console.log('🎯 Opening Razorpay checkout...');
      const razorpay = new window.Razorpay(options);
      
      // ✅ Payment failed handler
      razorpay.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        alert(`❌ Payment Failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpay.open();
      
    } catch (error) {
      console.error('❌ Payment process error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Form submitted:', formData);
    
    // Form validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      setError('Please fill all required fields');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Amount zero ah iruntha stop pannu
    if (totalAmount === 0) {
      setError('Invalid order amount. Please try again.');
      return;
    }

    // Check if user is authenticated for online payments
    if (formData.paymentMethod !== 'cod' && !isAuthenticated) {
      setError('Please login to proceed with online payment');
      return;
    }

    // Handle COD Order
    if (formData.paymentMethod === 'cod') {
      try {
        setLoading(true);
        
        if (!isAuthenticated) {
          setError('Please login to place COD order');
          setLoading(false);
          return;
        }

        console.log('🔄 Processing COD order...');
        const codResult = await createCODOrder();
        
        if (codResult.success) {
          console.log('✅ COD order created successfully:', codResult);
          handlePaymentSuccess(codResult);
        } else {
          throw new Error('COD order creation failed');
        }
      } catch (codError) {
        console.error('❌ COD order failed:', codError);
        setError(codError.message || 'Failed to place COD order. Please try again.');
        setLoading(false);
      }
      return;
    }
    
    // Online payment
    await handlePayment();
  };

  // Check if amount is zero or invalid
  if (totalAmount === 0) {
    return (
      <Container className="my-5">
        <Card className="text-center p-5">
          <h4>Invalid Order</h4>
          <p className="text-muted mb-4">Please add items to your cart or select a product</p>
          <Button 
            className="button"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Checkout</h2>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Row>
        {/* Shipping Information */}
        <Col md={8}>
          <Card className="p-4 mb-4">
            <h4 className="mb-4">Shipping Information</h4>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      className='px-3 py-2'
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      className='px-3 py-2'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  className='px-3 py-2'
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter 10-digit phone number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
                <Form.Text className="text-muted">
                  Must be 10 digits without country code
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  className='px-3 py-2'
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your complete shipping address with street, area, and landmark"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City *</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      className='px-3 py-2'
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your city"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pincode *</Form.Label>
                    <Form.Control
                      type="text"
                      name="pincode"
                      className='px-3 py-2'
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter pincode"
                      pattern="[0-9]{6}"
                      maxLength="6"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h5 className="mt-4 mb-3">Payment Method</h5>
              <Form.Group className="mb-4">
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  label="Credit/Debit Card (Razorpay)"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  label="UPI Payment (Razorpay)"
                  value="upi"
                  checked={formData.paymentMethod === 'upi'}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  label="Cash on Delivery"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  disabled={!isAuthenticated}
                />
                {!isAuthenticated && (
                  <small className="text-muted d-block mt-1">
                    Login required for Cash on Delivery
                  </small>
                )}
              </Form.Group>
              
              <Button 
                type="submit" 
                className="button mt-3 w-100"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {formData.paymentMethod === 'cod' ? 'Placing Order...' : 'Processing Payment...'}
                  </>
                ) : (
                  formData.paymentMethod === 'cod'
                    ? `Place Order (COD) - ₹${totalAmount.toFixed(2)}`
                    : `Proceed to Pay ₹${totalAmount.toFixed(2)}`
                )}
              </Button>

              {/* Debug Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-3 p-2 bg-light rounded">
                  <small className="text-muted">
                    <strong>Debug Info:</strong><br />
                    Auth: {isAuthenticated ? 'Yes' : 'No'} | 
                    Items: {orderItems.length} | 
                    Total: ₹{totalAmount} |
                    From Cart: {fromCart ? 'Yes' : 'No'} |
                    Payment Method: {formData.paymentMethod}
                  </small>
                </div>
              )}
            </Form>
          </Card>
        </Col>
        
        {/* 🟢 Order Summary */}
        <Col md={4}>
          <Card className="p-4">
            <h4 className="mb-4">
              Order Summary {fromCart ? `(${totalItems} items)` : ''}
            </h4>
            
            {/* Order Items List */}
            {orderItems.map((item, index) => (
              <div key={index} className="d-flex justify-content-between mb-2">
                <div className="flex-grow-1">
                  <div className="fw-semibold">{item.product}</div>
                  <small className="text-muted">
                    Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                  </small>
                </div>
                <span className="fw-semibold">₹{item.total.toFixed(2)}</span>
              </div>
            ))}
            
            <hr />
            
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal {fromCart ? `(${totalItems} items)` : ''}</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span className="text-success">FREE</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <span>Tax</span>
              <span className="text-muted">Included</span>
            </div>
            
            <hr />
            
            <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
              <span>Total Amount</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            
            {!isAuthenticated && formData.paymentMethod !== 'cod' && (
              <Alert variant="warning" className="small">
                <strong>Login Required:</strong> Please login to save your order history
              </Alert>
            )}
            
            {formData.paymentMethod === 'cod' && (
              <Alert variant="info" className="small">
                <strong>Cash on Delivery:</strong> Pay when you receive your order
              </Alert>
            )}
            
            <Alert variant="info" className="small">
              <strong>Test Mode:</strong> Use Razorpay test cards for payment
              <br />
              <small>Card: 4111 1111 1111 1111 | Expiry: 12/25 | CVV: 123</small>
            </Alert>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;