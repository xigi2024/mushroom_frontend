// Cart.js
import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Image, Spinner, Alert } from 'react-bootstrap';
import { FaShoppingBag, FaSignInAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    cart,
    loading,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    fetchCart,
    isAuthenticated
  } = useCart();

  const navigate = useNavigate();

  // Fetch cart when component mounts or auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Remove debug logs after confirming fix works
  // useEffect(() => {
  //   console.log('Cart component - Current cart data:', cart);
  //   console.log('Cart items:', cart?.items);
  //   console.log('Total items:', getTotalItems());
  //   console.log('Total price:', getTotalPrice());
  // }, [cart]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Loading your cart...</p>
      </Container>
    );
  }

  // Check if cart exists and has items
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container className="my-5">
        <Card className="text-center p-5">
          <div className="mb-4">
            <FaShoppingBag size={48} className="text-muted mb-3" />
            <h4>Your cart is empty</h4>
            <p className="text-muted mb-4">Add some delicious mushrooms to get started</p>
            {!isAuthenticated && (
              <Alert variant="info" className="mb-4">
                <FaExclamationTriangle className="me-2" />
                Login to view your saved cart items
              </Alert>
            )}
          </div>
          <div className="d-flex justify-content-center gap-3">
            {!isAuthenticated && (
              <Button 
                onClick={() => navigate('/login', { state: { from: '/cart' } })}
                className="d-flex align-items-center justify-content-center button"
                style={{ minWidth: '150px' }}
              >
                <FaSignInAlt className="me-2" /> Login
              </Button>
            )}
            <Button 
              variant="outline-secondary"
              onClick={() => navigate('/products')}
              className="d-flex align-items-center justify-content-center"
              style={{ minWidth: '150px' }}
            >
              <FaShoppingBag className="me-2" /> Continue Shopping
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  const handleQuantityUpdate = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeFromCart(itemId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price || item.product?.price || 0);
    const quantity = item.qty || 0;
    return (price * quantity).toFixed(2);
  };

  const subtotal = getTotalPrice();
  const total = subtotal; // Total is same as subtotal (no tax)

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Shopping Cart</h2>
        <div className="text-muted">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
        </div>
      </div>

      <Row>
        {/* Cart Items */}
        <Col md={8}>
          <Card className="p-4 mb-4">
            <Table responsive className="mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => {
                  const product = item.product || {};
                  const price = parseFloat(item.price || product.price || 0);
                  const quantity = item.qty || 0;
                  
                  return (
                    <tr key={item.id || `${product.id}_${Date.now()}`}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            onClick={() => navigate(`/product/${product.id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Image
                              src={product.image ? `http://localhost:8000${product.image}` : (product.images?.[0]?.image ? `http://localhost:8000${product.images[0].image}` : 'https://via.placeholder.com/100x100/28a745/ffffff?text=Product')}
                              width="60"
                              height="60"
                              className="me-3 rounded"
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x100/28a745/ffffff?text=Product';
                              }}
                            />
                          </div>
                          <div>
                            <div 
                              className="fw-semibold" 
                              onClick={() => navigate(`/product/${product.id}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              {product.name || 'Unknown Product'}
                            </div>
                            {product.size && (
                              <small className="text-muted">Size: {product.size}</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <strong>₹{price.toFixed(2)}</strong>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityUpdate(item.id, quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="mx-3 fw-semibold">{quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityUpdate(item.id, quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="align-middle">
                        <strong>₹{calculateItemTotal(item)}</strong>
                      </td>
                      <td className="align-middle">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>

          <div className="d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </div>
        </Col>

        {/* Order Summary */}
        <Col md={4}>
          <Card className="p-4">
            <h4 className="mb-4">Order Summary</h4>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <Button 
              className="w-100 mb-3 button" 
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>

            <Button 
              className="w-100 border text-center py-2 rounded cursor-pointer"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>

            {/* Login Prompt for Guest Users */}
            {!isAuthenticated && (
              <div className="mt-4">
                <Alert variant="warning" className="mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>
                      <h6 className="alert-heading mb-1">Guest User</h6>
                      <p className="mb-0">Please login to save your cart and access it from any device.</p>
                    </div>
                  </div>
                </Alert>
                <Button 
                  className="w-100 mb-3 button"
                  onClick={() => navigate('/login', { state: { from: '/cart' } })}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login to Save Your Cart
                </Button>
                <div className="text-center text-muted small">
                  Your cart will be saved temporarily in this browser.
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;