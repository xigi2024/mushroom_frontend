import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Image, ListGroup, Carousel, Spinner, Alert } from "react-bootstrap";
import { useNavigate, Link, useParams } from "react-router-dom";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id, subId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productResponse = await fetch(`http://127.0.0.1:8000/api/products/`);
        if (!productResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productResponse.json();
        const foundProduct = productsData.find(p => p.id === parseInt(subId));
        
        if (!foundProduct) {
          throw new Error('Product not found');
        }
        
        setProduct(foundProduct);
        
        // Fetch all categories and find the one with matching ID
        const categoryResponse = await fetch('http://127.0.0.1:8000/api/category/');
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoryData = await categoryResponse.json();
        const foundCategory = categoryData.find(cat => cat.id === parseInt(id));
        
        if (!foundCategory) {
          throw new Error('Category not found');
        }
        
        setCategory(foundCategory);
        
        // Filter related products by category
        const categoryProducts = productsData.filter(product => 
          product.category === parseInt(id) && product.id !== parseInt(subId)
        );
        
        setRelatedProducts(categoryProducts);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, subId]);

  const increase = () => setQuantity(quantity + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
      <Spinner animation="border" role="status" variant="success">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
  
  if (error) return (
    <Container className="my-5">
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Error Loading Product</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Alert>
    </Container>
  );
  
  if (!product) return <div className="text-center mt-5">Product not found</div>;
  if (!category) return <div className="text-center mt-5">Category not found</div>;

  // Prepare images for carousel
  const productImages = product.images && product.images.length > 0 
  ? product.images.map(img => img.image) 
  : product.image 
    ? [product.image] 
    : ['https://via.placeholder.com/600x400/28a745/ffffff?text=Mushroom'];

  const totalPrice = parseFloat(product.price) * quantity;

  return (
    <>
      <Container className="mt-4">
        {/* Breadcrumb */}
        <p className="mb-4">
          <Link to="/" className="text-decoration-none text-success">Home</Link> /{" "}
          <Link to="/products" className="text-decoration-none text-success">Products</Link> /{" "}
          <Link to={`/products/${category.id}`} className="text-decoration-none text-success">{category.name}</Link> / {product.name}
        </p>

        {/* Product Section */}
        <Row className="gx-5 gy-4">
          {/* Product Images with Carousel */}
          <Col md={6}>
            <Carousel
              activeIndex={activeImage}
              onSelect={(i) => setActiveImage(i)}
              interval={3000}
              indicators={false}
              className="position-relative"
            >
              {productImages.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <Image
                    src={img}
                    className="w-100 object-fit-cover"
                    fluid
                    rounded
                    alt={`Slide ${idx + 1}`}
                    style={{ height: "400px" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>

            {/* Thumbnails */}
            <div className="d-flex mt-3 justify-content-center">
              {productImages.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  thumbnail
                  className={`me-2 ${activeImage === idx ? "border border-success" : ""}`}
                  style={{ width: "80px", height: "80px", cursor: "pointer" }}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          </Col>

          {/* Product Details */}
          <Col md={6}>
            <h3 className="color fs-2">{product.name}</h3>
            <div className="mb-2"><span className="text-warning">★★★★★</span></div>
            <hr className="text-gray" />
            <h4 className="color subtext fs-4">Product Description</h4>
            <p>{product.product_info || product.description}</p>

            <ListGroup className="mb-3 d-flex flex-row justify-content-between align-items-center">
              {product.size && <ListGroup.Item><strong>Size:</strong> {product.size}</ListGroup.Item>}
              {product.serves && <ListGroup.Item><strong>Serves:</strong> {product.serves}</ListGroup.Item>}
            </ListGroup>
            <hr className="text-gray" />

            {/* Quantity Selector */}
            <div className="mb-3">
              <strong>Quantity:</strong>
              <div className="d-flex mt-2" style={{ width: "150px" }}>
                <button type="button" onClick={decrease} className="btn border rounded-0" style={{ flex: 1 }}>–</button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="text-center"
                  style={{ flex: 1, margin: "0 5px", border: "1px solid #0B5345", borderRadius: "0.25rem", width: "50px" }}
                />
                <button type="button" onClick={increase} className="btn border rounded-0" style={{ flex: 1 }}>+</button>
              </div>
            </div>

            {/* Price */}
            <p className="mb-4"><strong>Price: </strong> ₹ {totalPrice.toFixed(2)}</p>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <Button className="me-2 button w-50" onClick={() => navigate("/checkout")}>Buy Now</Button>
              <Button variant="outline-secondary w-50" onClick={() => navigate("/cart")}>Add to Cart</Button>
            </div>
          </Col>
        </Row>

        {/* Product Information */}
        <Row className="mt-5">
          <Col>
            <h5 className="color fs-4">Product Information</h5>
            <p>{product.product_info || product.description}</p>

            {product.carbohydrates || product.protein || product.calories ? (
              <>
                <h6 className="color fs-5">Nutritional Information</h6>
                <ul>
                  {product.carbohydrates && <li>Total Carbohydrates: {product.carbohydrates}</li>}
                  {product.protein && <li>Protein: {product.protein}</li>}
                  {product.calories && <li>Calories: {product.calories}</li>}
                </ul>
              </>
            ) : null}

            {product.shelf_life && (
              <>
                <h6 className="color fs-5">Shelf Life</h6>
                <p>{product.shelf_life}</p>
              </>
            )}

            {product.storage_info && (
              <>
                <h6 className="color fs-5">Storage Tip</h6>
                <p>{product.storage_info}</p>
              </>
            )}

            {product.disclaimer && (
              <>
                <h6 className="color fs-5">Disclaimer</h6>
                <p>{product.disclaimer}</p>
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* Other Products */}
      {relatedProducts.length > 0 && (
        <div className="py-5 other-products" style={{ backgroundColor: "#F1FFF0", marginTop: "3rem" }}>
          <Container className="py-5">
            <Row>
              <Col><h4 className="text-center mb-4">Other Products from {category.name}</h4></Col>
            </Row>
            <Row>
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Col key={relatedProduct.id} md={3}>
                  <Card className="mb-3">
                    <Card.Img 
                      variant="top" 
                      src={relatedProduct.image || 'https://via.placeholder.com/300x200/28a745/ffffff?text=Mushroom'} 
                      style={{ height: "200px", objectFit: "cover" }} 
                    />
                    <Card.Body className="text-center">
                      <Card.Title>{relatedProduct.name}</Card.Title>
                      <Card.Text>₹ {relatedProduct.price}</Card.Text>
                      <Button
                        className="button w-100"
                        onClick={() => navigate(`/product/${category.id}/${relatedProduct.id}`)}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default ProductDetail;