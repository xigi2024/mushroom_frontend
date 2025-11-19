import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Image, ListGroup, Carousel, Spinner, Alert } from "react-bootstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

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
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productResponse = await fetch(`https://mycomatrix.in/api/products/`);
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
        const categoryResponse = await fetch('https://mycomatrix.in/api/category/');
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
          {/* Product Images with Thumbnails */}
          <Col md={6}>
            <div className="d-flex">
              {/* Thumbnails - Vertical on the left */}
              <div className="d-flex flex-column me-3" style={{ 
                width: '80px',
                minWidth: '80px' // Prevent width changes
              }}>
                {productImages.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`mb-2 overflow-hidden ${activeImage === idx ? "border border-success" : "border"}`}
                    style={{ 
                      width: "80px", 
                      height: "80px",
                      cursor: "pointer",
                      borderRadius: '0.25rem',
                      flexShrink: 0 // Prevent shrinking
                    }}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Main Image - Fixed dimensions container */}
              <div className="p-0"style={{
                flex: '1 1 auto',
                minWidth: 0, // Prevent flex item from overflowing
                position: 'relative',
                height: '430px',
              }}>
                <img
                  src={productImages[activeImage]}
                  alt={`Product view ${activeImage + 1}`}
                  className="border rounded"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    
                  }}
                />
              </div>
            </div>
          </Col>

          {/* Product Details */}
          <Col md={6}>
            <h3 className="color fs-2">{product.name}</h3>
            <div className="mb-2"><span className="text-warning">★★★★★</span></div>
            <hr className="text-gray" />
            <h4 className="color subtext fs-4 favourite-head">Product Description</h4>
            <p className="para">{product.product_info || product.description}</p>

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
            <p className="mb-4 mt-4"style={{fontSize:"24px"}}><strong>Price: </strong> ₹ {totalPrice.toFixed(2)}</p>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
<Button
  className="me-2 button w-50"
  onClick={() =>
    navigate("/checkout", {
      state: {
        product: product.name,
        price: parseFloat(product.price),
        quantity: quantity,
        total: totalPrice
      }
    })
  }
>
  Buy Now
</Button>
<Button
  variant="outline-secondary w-50"
  onClick={async () => {
    const result = await addToCart(product, quantity);

    if (result.success) {
      navigate("/cart");  // Cart page ku redirect
    } else {
      alert("Failed to add product to cart");
    }
  }}
>
  Add to Cart
</Button>
            </div>
          </Col>
        </Row>

        {/* Product Information */}
        <Row className="mt-5">
          <Col>
            <h5 className="color fw-semibold fs-4">Product Information</h5>
            <p className="para">{product.product_info || product.description}</p>

            {product.carbohydrates || product.protein || product.calories ? (
              <>
                <h6 className="color fw-semibold fs-5">Nutritional Information</h6>
                <ul className="para">
                  {product.carbohydrates && <li>Total Carbohydrates: {product.carbohydrates}</li>}
                  {product.protein && <li>Protein: {product.protein}</li>}
                  {product.calories && <li>Calories: {product.calories}</li>}
                </ul>
              </>
            ) : null}

            {product.shelf_life && (
              <>
                <h6 className="color fw-semibold fs-5">Shelf Life</h6>
                <p className="para">{product.shelf_life}</p>
              </>
            )}

            {product.storage_info && (
              <>
                <h6 className="color fw-semibold fs-5">Storage Tip</h6>
                <p className="para">{product.storage_info}</p>
              </>
            )}

            {product.disclaimer && (
              <>
                <h6 className="color fw-semibold fs-5">Disclaimer</h6>
                <p className="para">{product.disclaimer}</p>
              </>
            )}
          </Col>
        </Row>
      </Container>

{/* 🟢 Other Products Section */}
{relatedProducts.length > 0 && (
  <div className="py-5 other-products" style={{ backgroundColor: "#F1FFF0", marginTop: "3rem" }}>
    <Container className="py-5">
      <Row>
        <Col>
          <h4 className="text-center mb-4">
            Other Products from {category.name}
          </h4>
        </Col>
      </Row>

      <Row className="g-4 mt-3">
        {relatedProducts.slice(0, 4).map((product) => (
          <Col key={product.id} md={6} lg={3}>
            <Card
              className="h-100 border-0 shadow-sm product-card"
              style={{ transition: "transform 0.2s", cursor: "pointer" }}
              onClick={() => navigate(`/product/${category.id}/${product.id}`)}
            >
              {/* 🖼 Image Section */}
              <div className="overflow-hidden position-relative" style={{ height: "200px" }}>
                <Card.Img
                  variant="top"
                  src={
                    product.image ||
                    product.images?.[0]?.image ||
                    "https://via.placeholder.com/300x200/28a745/ffffff?text=Mushroom"
                  }
                  alt={product.name}
                  className="w-100 h-100"
                  style={{ objectFit: "cover", transition: "transform 0.3s" }}
                />
              </div>

              {/* 🟢 Card Body */}
              <Card.Body className="d-flex flex-column p-3">
                <Card.Title
                  className="mb-1 titles"
                  style={{ fontSize: "1.1rem" }}
                >
                  {product.name}
                </Card.Title>

                {/* Ratings and Reviews */}
                <div className="d-flex align-items-center mb-2">
                  <div className="d-flex align-items-center me-2">
                    <span className="text-warning">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star${i < Math.floor(product.rating || 0) ? ' text-warning' : '-o'}`}
                          style={{ fontSize: '0.8rem' }}
                        />
                      ))}
                    </span>
                    <span className="text-muted small ms-1">
                      ({product.rating ? parseFloat(product.rating).toFixed(1) : '0.0'})
                    </span>
                  </div>
                  <span className="text-muted small">
                    {product.review || 0} reviews
                  </span>
                </div>

                {product.description && (
                  <Card.Text className="carousel-text mb-3 flex-grow-1">
                    {product.description.length > 80
                      ? product.description.slice(0, 80) + "..."
                      : product.description}
                  </Card.Text>
                )}

                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold color fs-5">
                      ₹{parseFloat(product.price).toFixed(2)}
                    </span>
                   
                  </div>
                  <Button
                    className="w-100 button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${category.id}/${product.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
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