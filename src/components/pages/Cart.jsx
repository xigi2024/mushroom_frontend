import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Image } from 'react-bootstrap';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Button Mushroom Kit',
      price: 280,
      quantity: 2,
      image: 'https://i.pinimg.com/1200x/2b/17/79/2b177957681d4d3e6c7294e31b8a4a21.jpg'
    },
    {
      id: 2,
      name: 'Premium Spawns',
      price: 200,
      quantity: 1,
      image: 'https://via.placeholder.com/100x100'
    }
  ]);

  // 🔹 Increase quantity
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // 🔹 Decrease quantity (min 1)
  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  // 🔹 Remove item
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // 🔹 Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // 🔹 Get totals
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <Card className="text-center p-5">
          <h4>Your cart is empty</h4>
          <p className="text-muted mb-4">Add some products to get started</p>
          <Button variant="success" href="/products">
            Continue Shopping
          </Button>
        </Card>
      ) : (
        <Row>
          <Col md={8}>
            <Card className="p-4 mb-4">
              <Table responsive>
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
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Image
                            src={item.image}
                            width="60"
                            height="60"
                            className="me-3"
                            style={{ objectFit: 'cover' }}
                          />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            -
                          </Button>
                          <span className="mx-3">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>

            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" href="/products">
                Continue Shopping
              </Button>
              <Button variant="outline-danger" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </Col>

          <Col md={4}>
            <Card className="p-4">
              <h4 className="mb-4">Order Summary</h4>

              <div className="d-flex justify-content-between mb-2">
                <span>Items ({getTotalItems()})</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className="text-success">FREE</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>₹{(getTotalPrice() * 0.09).toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
                <span>Total</span>
                <span>₹{(getTotalPrice() * 1.09).toFixed(2)}</span>
              </div>

              <Button variant="success" size="lg" className="w-100 mb-3" href="/checkout">
                Proceed to Checkout
              </Button>

              <Button variant="outline-primary" className="w-100">
                Continue Shopping
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
