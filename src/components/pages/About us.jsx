import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Nav, Tab, Image, Button, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/about.css';
import aboutMainImage from '/assets/about-main.png';


const features = [
  {
    title: "IoT Sensors",
    desc: "IoT sensors work continuously to monitor key environmental factors such as temperature, humidity, CO₂, and light. This smart technology brings efficiency and peace of mind to your cultivation process.",
    image: "/assets/iot controller.jpg"
  },
  {
    title: "Growth Optimization",
    desc: "Our smart systems continuously fine-tune the growing environment, ensuring mushrooms receive the right balance of temperature, humidity, and light. This ensures mushrooms grow in the most favorable conditions at all times.",
    image: "https://i.pinimg.com/736x/bf/99/c2/bf99c2a2665bf411e75dfb46ab85f687.jpg"
  },
  {
    title: "Real-time Monitoring",
    desc: "Real-time monitoring helps detect even the smallest changes that could affect mushroom health. Farmers receive instant alerts, enabling quick decision-making and proactive actions. This minimizes crop loss and ensures consistent quality throughout the growing cycle.",
    image: "https://i.pinimg.com/736x/05/aa/ec/05aaec6103b53ef221e7f84a394e5416.jpg"
  }
];

const MushroomInfo = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-5" style={{ backgroundColor: "#f1fff0" }}>
      <Container>
        <h2 className="text-center mb-5 fw-bold head color">
          Why Our Mushrooms Stay Fresh & Pure
        </h2>

        <div className="row align-items-center">
          {/* Left: Features List */}
          <div className="col-md-6 order-2 order-md-1">
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl transition-all duration-300 ease-in-out flex items-start gap-4 ${
                    activeIndex === idx ? " scale-[1.02]" : "hover:bg-gray-50"
                  }`}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div className="w-16 h-16 bg-[#e8f1ff] p-2.5 rounded-lg flex-shrink-0">
                    <div className="w-full h-full rounded bg-gray-200" />
                  </div>
                  <div>
                    <h3 className="titles text-dark  mb-2">
                      {feature.title}
                    </h3>
                    {activeIndex === idx && (
                      <p className="para text-dark">
                        {feature.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="col-md-6 order-1 order-md-2 mb-4 mb-md-0">
            <div className="position-relative" style={{ height: '400px' ,objectFit:"cover"}}>
              <Image
                src={features[activeIndex].image}
                alt={features[activeIndex].title}
                className="w-100 h-100 object-cover rounded-3"
                style={{ objectPosition: 'center',objectFit:"cover" }}
              />
            </div>
          </div>
        </div>
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
                Farming Meets Technology. For Fresher, Safer Mushrooms.
              </h1>
              <p className="lead text-white mb-4">
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
            <div className="col-lg-5 mb-5">
              <img 
                src={aboutMainImage} 
                alt="Mushroom growing facility" 
                className="img-fluid facility rounded shadow w-100"style={{height:"450px"}}
              />
            </div>
            <div className="col-lg-7 ps-lg-5">
              <h2 className="h1 mb-4 color head favourite-head">
                From a Simple Idea to a Smarter Farm
              </h2>
              <p className="mb-3 para">
                It all began with a simple dream – to make fresh, organic mushrooms accessible to every 
                household at affordable costs, instead of being limited to high-end restaurants.
              </p>
              <p className="mb-3 para">
                We saw the lack of smart technology in the industry who based their art of mushroom 
                cultivation. But we wanted more than just farming – we wanted precision, consistency, 
                and safety in every harvest.
              </p>
              <p className="para">
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
                <img src="/assets/icon1.png" className='img-size mb-3' alt="Fresh & Organic"/>
                </div>
                <h5 className="fw-semibold mb-3 mt-3 titles">Freshness First</h5>
                <p className="text-muted para">
                  We harvest only at peak maturity for the best taste and longest shelf life.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <img src="/assets/icon2.png" className='img-size mb-3' alt="Fresh & Organic"/>
                </div>
                <h5 className="fw-semibold mb-3 mt-3 titles">Sustainability</h5>
                <p className="text-muted para">
                  We minimize waste and use eco-friendly farming practices for a better tomorrow.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <img src="/assets/icon3.png" className='img-size mb-3' alt="Fresh & Organic"/>
                </div>
                <h5 className="fw-semibold mb-3 mt-3 titles">Transparency</h5>
                <p className="text-muted para">
                  We believe you should know exactly how your food is grown.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <img src="/assets/icon4.png" className='img-size mb-3' alt="Fresh & Organic"/>
                </div>
                <h5 className="fw-semibold mb-3 mt-3 titles">Easy Grow Kits</h5>
                <p className="text-muted para">
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
          <p className="para">
          Find quick answers before you reach out to us
          </p>
        </div>
<div className="row justify-content-center">
  <div className="col-lg-8">
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header className="fw-bold fs-5 titles">
          1. How does your IoT mushroom farming work?
        </Accordion.Header>
        <Accordion.Body className="para">
          Our IoT system continuously monitors temperature, humidity, CO₂ levels, and other 
          environmental factors to ensure optimal growing conditions for mushrooms.
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="1">
        <Accordion.Header className="fw-bold fs-5 titles">
          2. Are your mushrooms organic?
        </Accordion.Header>
        <Accordion.Body className="para">
          Yes, all our mushrooms are grown organically without the use of harmful pesticides or chemicals.
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="2">
      <Accordion.Header className="fw-bold fs-5 titles">
  3. What data does your IoT system collect?
</Accordion.Header>
<Accordion.Body className="para">
  Our IoT devices track essential parameters like temperature, humidity, CO₂, and light intensity. 
  These readings are analyzed to maintain the best environment for mushroom growth.
</Accordion.Body>

      </Accordion.Item>

      <Accordion.Item eventKey="3">
        <Accordion.Header className="fw-bold fs-5 titles">
          4. How fresh are the mushrooms when delivered?
        </Accordion.Header>
        <Accordion.Body className="para">
          Our mushrooms are harvested and delivered within 24–48 hours to ensure maximum freshness.
        </Accordion.Body>
      </Accordion.Item>

      {/* New Question - IoT Focus */}
      <Accordion.Item eventKey="4">
        <Accordion.Header className="fw-bold fs-5 titles">
          5. Can I monitor my mushroom growth through the IoT system?
        </Accordion.Header>
        <Accordion.Body className="para">
          Yes! With our IoT dashboard, you can track temperature, humidity, and growth status 
          in real-time from your mobile or desktop. It helps ensure your mushrooms grow perfectly.
        </Accordion.Body>
      </Accordion.Item>

      {/* New Question - eCommerce Focus */}
      <Accordion.Item eventKey="5">
        <Accordion.Header className="fw-bold fs-5 titles">
          6. What payment and delivery options are available?
        </Accordion.Header>
        <Accordion.Body className="para">
          We accept secure online payments through major cards, UPI, and wallets. 
          Our delivery partners ensure safe, fast, and temperature-controlled delivery to your doorstep.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </div>
</div>

      </div>
    </section>

 {/* 🌿 Middle CTA Section */}
   <Container className="my-5 py-5" style={{ backgroundColor: '#f1fff0' }}>
        <Row className="align-items-center text-center text-md-start">
          {/* ✅ Text + Button Section */}
          <Col className="mb-4 mb-md-0 text-center">
            <img src="/assets/leaf.png" className="leaf mb-3 object-fit-cover" alt="Leaf icon" style={{ width: "60px", height: "60px" }} />
            <h2 style={{ fontWeight: 'bold', color: '#006400' }}>
              Grow with Confidence
            </h2>
            <p className='mx-auto para describes'>Discover our best-selling mushroom grow kits — easy to use, beginner-friendly, and 100% organic. Start your home cultivation journey today! Experience the joy of harvesting fresh mushrooms right from your kitchen.</p>
            <Button as={Link} to="/contact" className="button mt-3">
              We're Here to Help
            </Button>
          </Col>

      
        </Row>
      </Container>

    </div>
  );
};

export default About;