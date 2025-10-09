import React, { Fragment, useState, useEffect } from 'react';
import { Container, Navbar, Nav, Row, Col, Card, Button, Carousel, Form, Spinner, Alert, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../../context/CartContext";
import "../styles/home.css"
import axios from "axios";

const PromisesSection = () => {
  const promises = [
    {
      icon: "/assets/img1.png",
      title: "IoT Monitoring",
      description: "Advanced sensors continuously track temperature, humidity, CO₂ levels, and light conditions in real-time.",
    },
    {
      icon: "/assets/img2.png",
      title: "Perfect Growth",
      description: "Automated systems adjust the environment instantly to maintain ideal conditions for mushroom cultivation.",
    },
    {
      icon: "/assets/img3.png",
      title: "Fresh Delivery",
      description: "Mushrooms are harvested at peak freshness and delivered directly to your door within hours.",
    },
  ];
  return (
    <section className="py-5 my-5 position-relative">
      <Container>
        {/* Section Header */}
        <Row className="text-center mb-5">
          <Col>
            <p className="color subtext fw-semibold mb-2">
              Nature Meets Technology for Perfect Mushrooms.
            </p>
            <h2 className="fw-bold color head">Freshness Delivered Daily</h2>
          </Col>
        </Row>
        {/* Promises Cards - 3 columns with curved lines */}
        <Row className="justify-content-center position-relative">
          {/* Curved line SVG overlay */}
          <div className="curved-lines-container d-none d-lg-block">
            <svg
              width="100%"
              height="200"
              className="position-absolute"
              style={{ top: '84px', left: '0', zIndex: 10, pointerEvents: 'auto' }}
              viewBox="0 0 1200 200"
            >
              <defs>
                {/* Mask to hide lines behind center icon */}
                <mask id="centerIconMask">
                  <rect width="1200" height="200" fill="white" />
                  <circle cx="600" cy="100" r="70" fill="black" />
                </mask>
              </defs>

              {/* Left to Center curved line */}
              <path
                d="M225 100 Q400 40 600 100"
                stroke="#2d5016"
                strokeWidth="4"
                strokeDasharray="12,8"
                fill="none"
                opacity="0.8"
                mask="url(#centerIconMask)"
              />
              {/* Center to Right curved line */}
              <path
                d="M600 100 Q900 160 975 100"
                stroke="#2d5016"
                strokeWidth="4"
                strokeDasharray="12,8"
                fill="none"
                opacity="0.8"
                mask="url(#centerIconMask)"
              />
            </svg>
          </div>

          {promises.map((promise, index) => (
            <Col lg={4} md={6} className="mb-4" key={index}>
              <Card className="h-100 border-0 text-center promise-card position-relative" style={{ zIndex: 5, background: 'transparent' }}>
                <Card.Body className="p-4">
                  <div className="promise-icon mb-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{ width: "180px", height: "180px" }}
                    >
                      {/* ✅ Render image instead of span */}
                      <img
                        src={promise.icon}
                        alt={promise.title}
                        style={{ width: "130px", height: "150px", objectFit: "contain" }}
                      />
                    </div>
                  </div>

                  <Card.Title className="h4 titles mb-3">{promise.title}</Card.Title>
                  <Card.Text className="text-muted  para">
                    {promise.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <style jsx="true">{`
    .curved-lines-container {
      position: absolute;
      top: -80px;
      left: 0;
      right: 0;
      height: 100%;
    }
    
    .promise-card {
      background: transparent !important;
    }
    
    .curved-lines-container svg path {
      filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
    }
    
    .promise-icon {
      position: relative;
      z-index: 15;
    }
    
    @media (max-width: 991.98px) {
      .curved-lines-container {
        display: none !important;
      }
    }
  `}</style>
    </section>
  );
};

const FavouriteProducts = () => {
  const { addToCart, isAuthenticated } = useCart();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for guest after add-to-cart
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/products/");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

    
        const productsData = await response.json();
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    console.log(
      "🛒 Adding product to cart:",
      product.name,
      "User authenticated:",
      isAuthenticated
    );

    setAddingToCart(product.id);

    try {
      const result = await addToCart(product);

      // result shape may vary; keep original check
      if (result?.success) {
        // always show success toast
        toast.success(`${product.name} added to cart!`);

        if (!isAuthenticated) {
          // for guest users show modal (ask to login/register)
          setModalProduct(product);
          setShowGuestModal(true);
        }
      } else {
        toast.error("Failed to add product to cart. Please try again.");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart. Please try again.");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.category || 1}/${product.id}`);
  };

  // Chunk logic with looping (keeps original behavior)
  const chunkProducts = (arr, size) => {
    let chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      let chunk = arr.slice(i, i + size);
      // If last chunk < size, append from start
      if (chunk.length < size) {
        chunk = [...chunk, ...arr.slice(0, size - chunk.length)];
      }
      chunks.push(chunk);
    }
    return chunks;
  };

  const productChunks = chunkProducts(products, 4);

  if (loading) {
    return (
      <section style={{ backgroundColor: "#f1fff0" }} className="py-5 my-5">
        <Container>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "300px" }}
          >
            <Spinner animation="border" role="status" variant="success">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ backgroundColor: "#f1fff0" }} className="py-5 my-5">
        <Container>
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Error Loading Products</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Alert>
        </Container>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section style={{ backgroundColor: "#f1fff0" }} className="py-5 my-5">
        <Container>
          <div className="text-center py-5">
            <h4>No products available</h4>
            <p className="text-muted">Check back later for our latest products</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <section style={{ backgroundColor: "#f1fff0" }} className="favourites my-5">
        <Container>

          <Row className="align-items-center carousel mb-5">
            <div className='d-flex justify-content-between align-items-center'>
              <h2 className="fw-bold color">
                Don't Miss These  Collection
              </h2>

              <Link to="/products" className="btn button mt-3">
                View More Products
              </Link>
            </div>
          </Row>
          {/* Carousel Section */}
          <Carousel interval={3000} controls={false} indicators={true}>
            {productChunks.map((chunk, index) => (
              <Carousel.Item key={index}>
                <Row className="justify-content-center">
                  {chunk.map((product, idx) => (
                    <Col key={`${index}-${idx}`} md={3} sm={6} className="mb-4">
                      <Card className="h-100 text-center shadow-sm border-0 rounded-4">
                        <Card.Img
                          variant="top"
                          src={
                            product.image ||
                            product.images?.[0]?.image ||
                            "https://via.placeholder.com/300x200/28a745/ffffff?text=Mushroom"
                          }
                          alt={product.name}
                          style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                          onClick={() => handleViewDetails(product)}
                        />
                        <Card.Body className='card-texts'>
                          <Card.Title
                            className="fw-semibold mt-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleViewDetails(product)}
                          >
                            {product.name}
                          </Card.Title>
                          {product.description && (
    <Card.Text className="text-muted small mb-2">
      {product.description.length > 60
        ? product.description.slice(0, 60) + "..."
        : product.description}
    </Card.Text>
  )}
                          {/* <div className="d-flex justify-content-center gap-2 mb-3">
                            {product.size && (
                              <span className="badge bg-light text-dark border">{product.size}</span>
                            )}
                            {product.serves && (
                              <span className="badge bg-light text-dark border">{product.serves}</span>
                            )}
                          </div>

                          <p className="fw-bold text-success">₹{parseFloat(product.price).toFixed(2)}</p> */}

                          <Button
                            className="w-100 mt-2 mb-2 button"
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCart === product.id}
                          >
                            {addingToCart === product.id ? "Adding..." : "Add to Cart"}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* Guest Modal (shown after guest adds product to cart) */}
      <Modal
        show={showGuestModal}
        onHide={() => setShowGuestModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Item added to cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ marginBottom: 0 }}>
            <strong>{modalProduct?.name}</strong> added to cart!
          </p>
          <p className="text-muted mt-2" style={{ fontSize: "0.95rem" }}>
            Create an account to save your cart permanently. Would you like to
            login/register now?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGuestModal(false)}>
            Continue Shopping
          </Button>
          <Button
            variant="success"
            onClick={() => {
              setShowGuestModal(false);
              navigate("/login");
            }}
          >
            Login / Register
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/category/");

        console.log("API Response:", response.data); // Debug log

        // API response structure check
        let categories = [];

        if (Array.isArray(response.data)) {
          // If response is directly an array
          categories = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // If response has data property with array
          categories = response.data.data;
        } else if (response.data.categories && Array.isArray(response.data.categories)) {
          // If response has categories property
          categories = response.data.categories;
        } else {
          throw new Error("Unexpected API response structure");
        }

        const mapped = categories.map((item) => ({
          title: item.name || item.title || "No Name",
          img: item.image || item.img || "https://i.pinimg.com/736x/df/93/0d/df930daeefab65061ff7482893534831.jpg",
          desc: item.description || item.desc || "No description available",
        }));

        setProducts(mapped);
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load categories");
        // Keep empty array if API fails
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <Container fluid className="pt-5" style={{ backgroundColor: "#f1fff0" }}>
        <Row className="align-items-center">
          <Col md={4} className="text-content p-0 d-flex flex-column justify-content-between">
            <div className="p-4">
              <p className="text-muted small mb-2">
                The best of our collection, ready for you
              </p>
              <h2 className="fw-bold mb-3" style={{ color: "#136d2b", fontSize: "40px" }}>
                Don't Miss These <br /> Favourite
              </h2>
              <p className="text-muted small mb-2">
                Discover the joy of growing your own mushrooms with our starter kits.
              </p>

            </div>

          </Col>
          <Col md={8}>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container fluid className="pt-5" style={{ backgroundColor: "#f1fff0" }}>
        <Row className="align-items-center">
          <Col md={4} className="text-content p-0 d-flex flex-column justify-content-between">
            <div className="p-4">
              <p className="text-muted small mb-2">
                The best of our collection, ready for you
              </p>
              <h2 className="fw-bold mb-3" style={{ color: "#136d2b", fontSize: "40px" }}>
                Don't Miss These <br /> Favourite
              </h2>
            </div>
            <div className="mt-4 text-left mb-5">
              <img
                src="/assets/mushroom-left.png"
                alt="Mushroom"
                style={{ maxWidth: "100%", height: "350px" }}
              />
            </div>
          </Col>
          <Col md={8}>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
              <div className="alert alert-warning text-center">
                <p>{error}</p>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Show empty state
  if (products.length === 0) {
    return (
      <Container fluid className="pt-5" style={{ backgroundColor: "#f1fff0" }}>
        <Row className="align-items-center">
          <Col md={4} className="text-content p-0 d-flex flex-column justify-content-between">
            <div className="p-4">
              <p className="text-muted small mb-2">
                The best of our collection, ready for you
              </p>
              <h2 className="fw-bold mb-3" style={{ color: "#136d2b", fontSize: "40px" }}>
                Don't Miss These <br /> Favourite
              </h2>
            </div>
            <div className="mt-4 text-left mb-5">
              <img
                src="/assets/mushroom-left.png"
                alt="Mushroom"
                style={{ maxWidth: "100%", height: "350px" }}
              />
            </div>
          </Col>
          <Col md={8}>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
              <div className="text-center text-muted">
                <p>No categories available at the moment.</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className=" favourite-section" style={{ backgroundColor: "#f1fff0" }}>
      <Container>
        <Row className="align-items-center">
          {/* Left Side Content */}
          <Col
            md={4}
            className="text-content p-0 d-flex flex-column justify-content-between"
            style={{ height: "100%" }}
          >

            <div className="p-4">
              <h2
                className="fw-bold mb-3"
                style={{ color: "#136d2b", fontSize: "40px" }}
              >
                Don't Miss Our <br /> Favourite Kit
              </h2>
              <p className="text-muted para mb-4">
                Discover the joy of growing your own mushrooms with our premium starter kits. Whether you're a seasoned grower or a beginner, we have everything you need to start your mushroom farming journey today!
              </p>
              <button className="login-btn" onClick={() => window.location.href = '/products'}>
                Shop Now
              </button>

            </div>


          </Col>

          {/* Right Side Marquee */}
          <Col md={8}>
            <div className="marquee-slider">
              <div className="marquee-track">
                {/* Repeat items twice for seamless loop */}
                {[...Array(2)].map((_, i) => (
                  <Fragment key={i}>
                    {products.map((product, idx) => (
                      <div
                        className="marquee-item"
                        key={`${i}-${idx}`}
                        style={{ height: "400px" }}
                      >
                        <Card className="custom-card h-100 shadow-sm border-0">
                          <div className="card-image-container">
                            <Card.Img
                              className="service-img"
                              src={product.img}
                              alt={product.title}
                              onError={(e) => {
                                e.target.src = "https://i.pinimg.com/736x/df/93/0d/df930daeefab65061ff7482893534831.jpg";
                              }}
                            />
                          </div>
                          <Card.Body>
                            <h5 className="fw-semibold">{product.title}</h5>
                            <Card.Text className="text-muted small">
                              {product.desc}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const carouselData = [
    {
      id: 1,
      title: "Smart Farming.Grown with Care & Technology.",
      subtitle: "From IoT monitored farms to your doorstep - organic, fresh, and safe.",
      buttonText: "Shop Fresh Mushrooms",
      backgroundImage: "https://i.pinimg.com/1200x/d0/ab/7d/d0ab7de881fafee37fed4bc1600a6510.jpg"

    },
    {
      id: 2,
      title: "Premium Quality Mushrooms. Sustainably Grown.",
      subtitle: "Advanced cultivation techniques ensuring the highest quality organic mushrooms.",
      buttonText: "Start Your Journey",
      backgroundImage: "/assets/banner.png"
    },
    {
      id: 3,
      title: "Farm to Table Excellence. Technology Driven Growth.",
      subtitle: "Experience the future of farming with our IoT-enabled mushroom cultivation.",
      buttonText: "Learn More",
      backgroundImage: "https://i.pinimg.com/736x/66/dd/56/66dd5689bfc908c6f33bedae71ceb505.jpg"
    }
  ];

  // Auto slide change every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselData.length]);

  const handleRedirect = (buttonText) => {
    if (buttonText === "Shop Fresh Mushrooms") {
      navigate("/products");
    } else if (buttonText === "Start Your Journey") {
      navigate("/contact");
    } else if (buttonText === "Learn More") {
      navigate("/about");
    }
  };

  const goPrev = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselData.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  return (
    <section className="hero-carousel">
      <div className="carousel-container">
        {carouselData.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.backgroundImage})` }}
          >
            <div className="slide-content">
              <div className="container">
                <div className="row">
                  <div className="col-lg-8 col-xl-7">
                    <h1 className="mb-3 pb-0"> {slide.title} </h1>
                    <p className="subtitle">{slide.subtitle}</p>
                    <button
                      className="login-btn cursor-pointer border-none"
                      onClick={() => handleRedirect(slide.buttonText)}
                    >
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ✅ Controls */}
        <button className="carousel-controls carousel-prev" onClick={goPrev}>
          ‹
        </button>
        <button className="carousel-controls carousel-next" onClick={goNext}>
          ›
        </button>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Kaveen",
      location: "",
      text: '"Mushroom made our first import seamless and stress-free. Their guidance and support were invaluable throughout the entire process."',
      image:
        "https://i.pinimg.com/736x/c7/61/cb/c761cbf39d8c6f6eb3c38248b5b47209.jpg",
    },
    {
      id: 2,
      name: "Priya",
      location: "Chennai",
      text: '"I never knew mushrooms could be this fresh! The IoT thing really works - every batch tastes amazing."',
      image:
        "https://i.pinimg.com/736x/2c/e0/c8/2ce0c8e9423351561f91c33645141120.jpg",
    },
    {
      id: 3,
      name: "Rahul",
      location: "Bangalore",
      text: '"The quality of mushrooms is consistently excellent. Their delivery is always on time and the packaging is eco-friendly!"',
      image:
        "https://i.pinimg.com/736x/62/7d/7a/627d7ac2d198b462f5a558ac49ecfc9f.jpg",
    },
    {
      id: 4,
      name: "Anjali",
      location: "Mumbai",
      text: '"As a restaurant owner, I rely on consistent quality. These mushrooms have never disappointed me and my customers love them!"',
      image:
        "https://i.pinimg.com/736x/79/aa/91/79aa91c2fb118b0be550f6b3a26da1ea.jpg",
    },
  ];

  // Dynamically group testimonials based on screen size
  const groupSize = isMobile ? 1 : 2;
  const testimonialGroups = [];
  for (let i = 0; i < testimonials.length; i += groupSize) {
    testimonialGroups.push(testimonials.slice(i, i + groupSize));
  }

  return (
    <section className="favourites my-5" style={{ backgroundColor: "#f0fff0" }}>
      <Container>
        <Row className="mb-5 py-5">
          <Col>
            <h2 className="text-center color subtext">
              People trust other buyers more than marketing text.
            </h2>
            <p className="head fw-bold text-center color">
              Build trust through real user feedback
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={12}>
            <Carousel
            className=''
              activeIndex={index}
              onSelect={handleSelect}
              indicators={false}
              variant="dark"
            >
              {testimonialGroups.map((group, groupIndex) => (
                <Carousel.Item key={groupIndex}>
                  <Row className="justify-content-center">
                    {group.map((testimonial) => (
                      <Col
                        key={testimonial.id}
                        xs={12}
                        md={6}
                        className="mb-4 d-flex justify-content-center"
                      >
                        <Card
                          className="h-100 border-0 shadow-sm"
                          
                        >
                          <div className="d-flex flex-column flex-md-row align-items-center h-100">
                            <div className="text-center">
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="img-fluid rounded testimonial-img"

                              />
                            </div>
                            <Card.Body className="text-center text-md-start py-4">
                              <Card.Text className=" mb-3">
                                {testimonial.text}
                              </Card.Text>
                              <strong className="fs-5">
                                {testimonial.name}
                                {testimonial.location &&
                                  `, ${testimonial.location}`}
                              </strong>
                            </Card.Body>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </section>
  );
};


const NewsletterSection = () => {
  return (
    <section className="py-5 my-5">
      <Container className='final shadow-sm'>
        <Row className="h-100 align-items-stretch">
          {/* Image Section */}
          <Col lg={5} className="text-center mb-4 mb-lg-0 p-0 d-flex">
            <div className="w-100" >
              <img
                src="/assets/cta.jpeg"
                alt="cta"
                className="img-fluid w-100 cta-img "
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Col>

          {/* Content Section */}
          <Col lg={7} className="p-0 d-flex">
            <Card className="border-0 shadow-sm w-100">
              <Card.Body
                className="p-4 p-lg-5 d-flex flex-column justify-content-center"
                style={{ backgroundColor: "#f0fff0" }}
              >
                <div className="text-center text-lg-start">
                  {/* Heading */}
                  <h4 className="fw-bold mb-4 color fs-2">
                    Grow Your Own Mushrooms at Home
                  </h4>

                  <p className="text-muted mb-4 para describe">
  Discover our best-selling mushroom grow kits — easy to use, beginner-friendly, and 100% organic. Start your home cultivation journey today! Experience the joy of harvesting fresh mushrooms
</p>


                  {/* CTA Button */}
                  <div>
                    <button className="login-btn" onClick={() => window.location.href = '/products'}>
                      Reach out
                    </button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};


const Home = () => {
  return (
    <div className="">
      {/* Hero Section */}

      <HeroCarousel />

      {/* Promises Section */}
      <section className="py-5 my-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="subtext color">Our four promises to you for quality and freshness.</h2>
              <p className="color head">Fresh, Safe & Straight to You</p>
            </Col>
          </Row>
          <Row>
            <Col md={3} className="text-center mb-4">
              <img src="/assets/icon1.png" className='img-size mb-4' alt="Fresh & Organic" />
              <h5 className='titles'>Fresh & Organic</h5>
              <p className="text-muted para">No Chemicals, Just Nature</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <img src="/assets/icon2.png" className='img-size mb-4' alt="IoT Monitored" />
              <h5 className='titles'>IoT Monitored</h5>
              <p className="text-muted para">Every Mushroom Grown Under Ideal Conditions</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <img src="/assets/icon3.png" className='img-size mb-4' alt="Direct to You" />
              <h5 className='titles'>Direct to You</h5>
              <p className="text-muted para">Farm-to-door delivery without middlemen.</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <img src="/assets/icon4.png" className='img-size mb-4' alt="Easy Grow Kits" />
              <h5 className='titles'>Easy Grow Kits</h5>
              <p className="text-muted para">Grow mushrooms at home in 15 days.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <ProductSection />

      <PromisesSection />

      {/* middle cta section */}
      <Container className="my-5 py-5" style={{ backgroundColor: '#f1fff0' }}>
        <Row className="align-items-center text-center text-md-start">
          {/* ✅ Text + Button Section */}
          <Col className="mb-4 mb-md-0 text-center">
            <img src="/assets/leaf.png" className="leaf mb-3 object-fit-cover" alt="Leaf icon" style={{ width: "60px", height: "60px" }} />
            <h2 style={{ fontWeight: 'bold', color: '#006400' }}>
              Grow with Confidence
            </h2>
            <p className='mx-auto describes'>Discover our best-selling mushroom grow kits — easy to use, beginner-friendly, and 100% organic. Start your home cultivation journey today! Experience the joy of harvesting fresh mushrooms right from your kitchen.</p>
            <Button as={Link} to="/contact" className="button mt-3">
              We're Here to Help
            </Button>
          </Col>

      
        </Row>
      </Container>

      {/* Favourite Products */}
      <FavouriteProducts />

      {/* 🌐 IoT Section */}
      <section className="py-5 section my-5" >
        <Container>
          <Row className="align-items-center gy-5 gx-lg-5">
            {/* 🖼️ Left Image */}
            <Col lg={6} className="text-center">
              <img
                src="/assets/iot.png"
                alt="IoT Monitoring"
                className="img-fluid rounded w-100 iot-image"
              />
            </Col>

            {/* 🧠 Right Content */}
            <Col lg={6}>
              <p className="subtext color">
                We combine cutting edge IoT technology with natural cultivation to grow healthier, fresher mushrooms.
              </p>
              <h2 className="fw-bold mb-4 farm color">
                Smart Farming Powered by IoT & Nature
              </h2>

              {/* Feature 1 */}
              <div className="d-flex mb-4 align-items-start">
                <img src="/assets/monitor.png" alt="24/7 Monitoring" className="img-sizes me-3" />
                <div>
                  <h5 className="fw-semibold">24/7 Monitoring</h5>
                  <p className="mb-0">
                    Sensors track temperature, humidity, CO₂, and light to maintain perfect growth conditions.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="d-flex mb-4 align-items-start">
                <img src="/assets/automate.png" alt="Automated Adjustments" className="img-sizes me-3" />
                <div>
                  <h5 className="fw-semibold">Automated Adjustments</h5>
                  <p className="mb-0">
                    IoT systems instantly regulate climate and airflow, removing guesswork and ensuring consistency.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="d-flex align-items-start">
                <img src="/assets/growth.png" alt="Healthier Growth" className="img-sizes me-3" />
                <div>
                  <h5 className="fw-semibold">Healthier, Faster Growth</h5>
                  <p className="mb-0">
                    Controlled environments reduce contamination risk and boost yield quality.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

       <NewsletterSection/>

    </div>
  );
};

export default Home;