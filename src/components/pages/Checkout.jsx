import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, getTotalPrice, getTotalItems, clearCart, isAuthenticated } = useCart();

  const locationState = location.state || {};
  const fromCart = locationState.fromCart || false;

  // ✅ FIXED: Add debug logging to see what's in locationState
  console.log('🔍 DEBUG - Location State:', locationState);
  console.log('🔍 DEBUG - From Cart:', fromCart);

  let cartTotal, totalItems, totalAmount;
  let orderItems = [];

  if (fromCart) {
    cartTotal = getTotalPrice();
    totalItems = getTotalItems();
    totalAmount = cartTotal;

    // ✅ FIXED: Enhanced cart items with proper product_id
    orderItems = cart?.items?.map(item => {
      const productId = item.product?.id || item.product_id;
      console.log('🔍 DEBUG - Cart Item:', item, 'Product ID:', productId);
      
      return {
        product: item.product?.name || 'Product',
        product_id: productId, // ✅ Ensure product_id is included
        quantity: item.qty || 1,
        price: parseFloat(item.price || item.product?.price || 0),
        total: (parseFloat(item.price || item.product?.price || 0) * (item.qty || 1))
      };
    }) || [];
  } else {
    cartTotal = locationState.total || 0;
    totalItems = locationState.quantity || 1;
    totalAmount = locationState.total || 0;

    // ✅ FIXED: Single product with proper product_id extraction
    const productId = locationState.product_id || locationState.id;
    console.log('🔍 DEBUG - Single Product ID:', productId);
    
    orderItems = [{
      product: locationState.product || locationState.name || 'Product',
      product_id: productId, // ✅ This is critical
      quantity: locationState.quantity || 1,
      price: locationState.price || 0,
      total: locationState.total || 0
    }];
  }

  // ✅ FIXED: Debug the final orderItems
  console.log('✅ FINAL Order Items:', orderItems);
  console.log('✅ First item product_id:', orderItems[0]?.product_id);

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

  // ✅ FIXED: Payment Success Handler
  const handlePaymentSuccess = (orderDetails) => {
    console.log('✅ Payment successful - Order Details:', orderDetails);

    if (fromCart) {
      clearCart();
    }

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

  // ✅ FIXED: Razorpay Script Load
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

  // ✅ FIXED: COD Order Creation
  const createCODOrder = async () => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('access');
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

      const response = await fetch('https://mycomatrix.in/api/create-cod-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(codOrderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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

  // ✅ FIXED: Payment Process with Enhanced Debugging
  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('💰 Starting payment process...');
      console.log('📦 Order items:', orderItems);
      console.log('💳 Total amount:', totalAmount);

      // ✅ FIXED: Validate product_id before proceeding
      const missingProductIds = orderItems.filter(item => !item.product_id);
      if (missingProductIds.length > 0) {
        console.error('❌ Missing product_id in items:', missingProductIds);
        setError('Product information is missing. Please try again.');
        setLoading(false);
        return;
      }

      // Step 1: Razorpay script load
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Payment system failed to load. Please refresh and try again.');
        setLoading(false);
        return;
      }

      // Step 2: Create Razorpay order in backend
      console.log('🔗 Creating Razorpay order...');
      const orderResponse = await fetch('https://mycomatrix.in/api/create-razorpay-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR'
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

      // Step 3: Razorpay options setup - FIXED VERSION
      const token = localStorage.getItem('access_token') || localStorage.getItem('access');
      
      const options = {
        key: 'rzp_live_RckdZPe20EQiap', // Your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MycoMatrix',
        description: fromCart ? `Order for ${totalItems} items` : `Order for ${locationState.product}`,
        order_id: orderData.order_id,

        // ✅ FIXED: Payment handler with complete payload
        handler: async function (response) {
          console.log('💰 Razorpay payment response:', response);

          try {
            // ✅ FIXED: Enhanced verification payload with validation
            const verifyPayload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              total_amount: totalAmount,
              items: orderItems.map(item => {
                console.log('🔍 Sending item to backend:', item);
                return {
                  product_id: item.product_id,
                  product: item.product,
                  quantity: item.quantity,
                  price: item.price
                };
              }),
              order_type: fromCart ? 'cart' : 'single_product'
            };

            console.log('📤 Sending verification payload:', verifyPayload);

            const verifyResponse = await fetch('https://mycomatrix.in/api/verify-payment/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(verifyPayload)
            });

            const result = await verifyResponse.json();
            console.log('📥 Verification response:', result);

            if (result.status === 'success') {
              console.log('✅ Payment verified successfully');
              
              handlePaymentSuccess({
                payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                db_order_id: result.db_order_id,
                db_payment_id: result.db_payment_id,
                amount: totalAmount,
                payment_method: 'razorpay',
                order_status: result.order_status || 'completed',
                payment_status: result.payment_status || 'paid'
              });
            } else {
              throw new Error(result.error || 'Payment verification failed');
            }
          } catch (verifyError) {
            console.error('❌ Verification API error:', verifyError);
            alert('❌ Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },

        // Prefill customer details
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },

        theme: {
          color: '#28a745'
        },

        modal: {
          ondismiss: function () {
            console.log('❌ Payment modal closed by user');
            setLoading(false);
          }
        }
      };

      // Step 4: Open Razorpay checkout
      console.log('🎯 Opening Razorpay checkout...');
      const razorpay = new window.Razorpay(options);
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

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (totalAmount === 0) {
      setError('Invalid order amount. Please try again.');
      return;
    }

    // Check authentication
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    if (!token) {
      setError('Please login to proceed with payment');
      navigate('/login');
      return;
    }

    // Handle COD Order
    if (formData.paymentMethod === 'cod') {
      try {
        setLoading(true);
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

      <Row>
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
                  placeholder="Enter your complete shipping address"
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
                />
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
            </Form>
          </Card>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
        </Col>

        <Col md={4}>
          <Card className="p-4">
            <h4 className="mb-4">
              Order Summary {fromCart ? `(${totalItems} items)` : ''}
            </h4>

            {orderItems.map((item, index) => (
              <div key={index} className="d-flex justify-content-between mb-2">
                <div className="flex-grow-1">
                  <div className="fw-semibold">{item.product}</div>
                  <small className="text-muted">
                    Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                  </small>
                  <br />
                  <small className="text-info">
                    Product ID: {item.product_id || 'Not available'}
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

            {formData.paymentMethod === 'cod' && (
              <Alert variant="info" className="small">
                <strong>Cash on Delivery:</strong> Pay when you receive your order
              </Alert>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;