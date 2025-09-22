import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Nav, Tab, Image, Button, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/about.css';
import aboutMainImage from '../../assets/about-main.png';
import leafImage from '../../assets/leaf.png';
import mushroomImage from '../../assets/mushroom.png';

const MushroomInfo = () => {
  return (
    <section className="py-5" style={{ backgroundColor: "#f1fff0" }}>
      <Container>
        <h2 className="text-center mb-5 fw-bold color">
          Why Our Mushrooms Stay Fresh & Pure
        </h2>

        <Tab.Container defaultActiveKey="sensors">
          <Row>
            {/* Left Menu */}
            <Col md={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="sensors" className="fs-5 fw-semibold">
                    IoT Sensors
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="controls" className="fs-5 fw-semibold">
                    Growth Optimization
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="monitoring" className="fs-5 fw-semibold">
                    Real-time Monitoring
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            {/* Right Content */}
            <Col md={9}>
              <Tab.Content>
                {/* IoT Sensors */}
                <Tab.Pane eventKey="sensors">
                  <Row className="align-items-center">
                    <Col md={6}>
                      <Image
                        src="https://i.pinimg.com/474x/20/0e/1d/200e1d878dc3659da532e42580c0151c.jpg"
                        alt="IoT Sensors"
                        fluid
                        rounded
                        style={{height:"350px"}}
                        className="w-100 object-fit-cover"
                      />
                    </Col>
                    <Col md={6}>
                      <h4>IoT Sensors</h4>
                      <p>
                        IoT sensors work continuously to monitor key
                        environmental factors such as temperature, humidity,
                        CO₂, and light.
                      </p>
                      <p>
                        These sensors provide accurate, real-time data,
                        ensuring the growing conditions are always optimal.
                      </p>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* Automated Controls */}
                <Tab.Pane eventKey="controls">
                  <Row className="align-items-center">
                    <Col md={6}>
                      <Image
                        src="https://i.pinimg.com/736x/bf/99/c2/bf99c2a2665bf411e75dfb46ab85f687.jpg"
                        alt="Automated Controls"
                        fluid
                        rounded
                        style={{height:"350px"}}
                        className="w-100 object-fit-cover"
                      />
                    </Col>
                    <Col md={6}>
                      <h4>Growth Optimization</h4>
                      <p>
                      Our smart systems continuously fine-tune the growing environment, ensuring mushrooms receive the right balance of temperature, humidity, and light. By optimizing every stage of growth, we help mushrooms develop naturally, with better texture, freshness, and nutritional value..
                      </p>
                      <p>
                        This ensures mushrooms grow in the most favorable
                        conditions at all times.
                      </p>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* Real-time Monitoring */}
                <Tab.Pane eventKey="monitoring">
                  <Row className="align-items-center">
                    <Col md={6}>
                      <Image
                        src="https://i.pinimg.com/736x/05/aa/ec/05aaec6103b53ef221e7f84a394e5416.jpg"
                        alt="Real-time Monitoring"
                        fluid
                        rounded
                        style={{height:"350px"}}
                        className="w-100 object-fit-cover"
                      />
                    </Col>
                    <Col md={6}>
                      <h4>Real-time Monitoring</h4>
                      <p>
                        Real-time monitoring helps detect even the smallest
                        changes that could affect mushroom health.
                      </p>
                      <p>
                        Farmers receive instant alerts, enabling quick
                        decision-making and proactive actions.
                      </p>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </section>
  );
};
 

const About = () => {
  return (
    <div className="mushroom-site">
      {/* Hero Section */}
      <section 
        className="about-hero-section d-flex align-items-center text-white position-relative"
        style={{
     
          minHeight: '500px'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h1 className="fs-1 fw-bold mb-4">
                Farming Meets Technology – For Fresher, Safer Mushrooms.
              </h1>
              <p className="lead mb-4">
                From our farms to your table, we ensure sustainability, innovation, 
                and quality. Our farms are clean, safe, and full of nutrition and flavor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* From Simple Idea Section */}
      <section className=" my-5 section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <img 
                src={aboutMainImage} 
                alt="Mushroom growing facility" 
                className="img-fluid rounded shadow w-100"style={{height:"450px"}}
              />
            </div>
            <div className="col-lg-7 ps-lg-5">
              <h2 className="h1 mb-4 color">
                From a Simple Idea to a Smarter Farm
              </h2>
              <p className="mb-3">
                It all began with a simple dream – to make fresh, organic mushrooms accessible to every 
                household at affordable costs, instead of being limited to high-end restaurants.
              </p>
              <p className="mb-3">
                We saw the lack of smart technology in the industry who based their art of mushroom 
                cultivation. But we wanted more than just farming – we wanted precision, consistency, 
                and safety in every harvest.
              </p>
              <p>
                That's where we embraced IoT technology. Today, every mushroom we grow is harvested 
                under perfectly monitored conditions, ensuring you get the freshest, healthiest, and 
                safest mushrooms every single time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Our Mushrooms Section */}
  <MushroomInfo
  />

      {/* Our Values Section */}
      <section className=" my-5 section">
        <div className="container">
          <div className="text-center mb-5">
            <p className="mb-2 color">What We Stand For</p>
            <h2 className="h1 color">Our Values</h2>
          </div>
          
          <div className="row" style={{marginTop:"70px"}}>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <img src="../src/assets/icon1.png" className='img-size mb-3' alt="Fresh & Organic"/>
                </div>
                <h5 className="fw-semibold mb-3">Freshness First</h5>
                <p className="text-muted">
                  We harvest only at peak maturity for the best taste and longest shelf life.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <img src="../src/assets/icon2.png" className='img-size mb-3' alt="Fresh & Organic"/>
                </div>
                <h5 className="fw-semibold mb-3">Sustainability</h5>
                <p className="text-muted">
                  We minimize waste and use eco-friendly farming practices for a better tomorrow.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <img src="../src/assets/icon3.png" className='img-size mb-3' alt="Fresh & Organic"/>
                </div>
                <h5 className="fw-semibold mb-3">Transparency</h5>
                <p className="text-muted">
                  We believe you should know exactly how your food is grown.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <img src="../src/assets/icon4.png" className='img-size mb-3' alt="Fresh & Organic"/>
                </div>
                <h5 className="fw-semibold mb-3">Easy Grow Kits</h5>
                <p className="text-muted">
                  Grow mushrooms at home in 15 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="my-5 section" style={{ backgroundColor: '#f1fff0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="h1 color mb-3">Discover Frequently Asked Questions</h2>
          <p className="text-muted">
          Find quick answers before you reach out to us
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="fw-bold fs-5">
                  1. How does your IoT mushroom farming work?
                </Accordion.Header>
                <Accordion.Body>
                  Our IoT system continuously monitors temperature, humidity, CO₂ levels, and other 
                  environmental factors to ensure optimal growing conditions for mushrooms.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header className="fw-bold fs-5">
                  2. Are your mushrooms organic?
                </Accordion.Header>
                <Accordion.Body>
                  Yes, all our mushrooms are grown organically without the use of harmful pesticides or chemicals.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  3. Can I visit your farm?
                </Accordion.Header>
                <Accordion.Body>
                  We offer guided tours of our facilities. Please contact us to schedule a visit.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  4. How fresh are the mushrooms when delivered?
                </Accordion.Header>
                <Accordion.Body>
                  Our mushrooms are harvested and delivered within 24–48 hours to ensure maximum freshness.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>
    </section>

      {/* middle cta section */}
      <Container className="my-5" style={{ backgroundColor: '#f1fff0', padding: '60px 0' }}>
        <Row className="align-items-center">
          <Col md={8} className="text-center text-md-center">
            <img src={leafImage} className='leaf mb-3' alt="Leaf icon"/> 
            <h2 style={{ fontWeight: 'bold', color: '#006400' }}>
              Grow with Confidence
            </h2>
            <Button as={Link} to="/contact" className="button mt-3">
              We're Here to Help
            </Button>
          </Col>
          <Col md={4} className="text-end">
            <img
              src={mushroomImage}
              alt="Mushrooms"
              style={{ height:"200px", objectFit: 'cover' }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;