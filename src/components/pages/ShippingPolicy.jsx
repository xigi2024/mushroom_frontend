import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ShippingPolicy = () => {
  // Define the custom green color
  const customGreen = "#136d2b";

  const styles = {
    heading: {
      color: customGreen,
      fontWeight: "bold"
    },
    sectionTitle: {
      color: customGreen,
      fontWeight: "600"
    },
    link: {
      color: customGreen,
      fontWeight: "600",
      textDecoration: "none"
    },
    cardBorder: {
      borderColor: customGreen
    },
    tableHeader: {
      backgroundColor: customGreen + "20", // Light green background
      color: customGreen,
      fontWeight: "600"
    },
    alertBorder: {
      borderColor: customGreen,
      backgroundColor: customGreen + "10" // Very light green background
    }
  };

  return (
    <div className="container py-5 border rounded my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className="mb-3 fw-bold" style={styles.heading}>Shipping Policy</h1>
            <p className="lead text-muted">
              Last updated: {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          {/* Introduction */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold" style={styles.heading}>Welcome to MyComatrix Shipping</h5>
              <p className="card-text">
                At MyComatrix, we are committed to ensuring that all products are delivered 
                promptly and in perfect condition. This shipping policy outlines our delivery 
                processes, timelines, and what you can expect when you place an order with us.
              </p>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="policy-content">
            <div className="policy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                1. Order Processing & Delivery Timeline
              </h5>
              <p>
                <strong style={{color: customGreen}}>Processing Time:</strong> All orders are processed within 1-2 business days 
                (excluding weekends and public holidays) after order confirmation.
              </p>
              <p>
                <strong style={{color: customGreen}}>Shipping Time:</strong> Orders are usually shipped within 3–5 business days 
                after processing. Delivery times may vary based on your location and shipping method.
              </p>
              <div className="table-responsive">
                <table className="table table-bordered mt-3">
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th>Location</th>
                      <th>Estimated Delivery Time</th>
                      <th>Shipping Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Metro Cities</td>
                      <td>3-5 business days</td>
                      <td>Standard/Express</td>
                    </tr>
                    <tr>
                      <td>Tier 2 Cities</td>
                      <td>5-7 business days</td>
                      <td>Standard</td>
                    </tr>
                    <tr>
                      <td>Remote Areas</td>
                      <td>7-10 business days</td>
                      <td>Standard</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="policy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                2. Shipping Charges & Methods
              </h5>
              <p>
                Shipping charges, if applicable, will be clearly displayed at checkout before 
                payment confirmation. We offer various shipping options to suit your needs:
              </p>
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item border-start" style={{borderLeftColor: customGreen}}>
                  <strong style={{color: customGreen}}>Standard Shipping:</strong> Free on orders above ₹999 | ₹49 for orders below
                </li>
                <li className="list-group-item border-start" style={{borderLeftColor: customGreen}}>
                  <strong style={{color: customGreen}}>Express Shipping:</strong> ₹99 (Delivery within 2-3 business days)
                </li>
                <li className="list-group-item border-start" style={{borderLeftColor: customGreen}}>
                  <strong style={{color: customGreen}}>Same-Day Delivery:</strong> ₹149 (Available in select metro cities)
                </li>
              </ul>
            </div>

            <div className="policy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                3. Order Tracking & Updates
              </h5>
              <p>
                Once your order is shipped, you will receive tracking details via email and/or SMS. 
                You can track your order in real-time through:
              </p>
              <ul>
                <li>Our website's "Track Order" section</li>
                <li>Shipping partner's tracking portal</li>
                <li>Mobile app notifications (if applicable)</li>
              </ul>
              <p className="text-muted small">
                <strong style={{color: customGreen}}>Note:</strong> Tracking information may take 12-24 hours to update after shipment.
              </p>
            </div>

            <div className="policy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                4. Damaged or Defective Products
              </h5>
              <p>
                We take utmost care in packaging your products. However, if you receive a damaged 
                or defective product, please follow these steps:
              </p>
              <ol>
                <li>Do not accept the package if visible damage is apparent</li>
                <li>Take photos of the damaged product and packaging</li>
                <li>Contact us within 24 hours of delivery</li>
                <li>Provide your order details and photos</li>
              </ol>
              <p>
                Contact us immediately at{" "}
                <a href="mailto:mycomatrix1@gmail.com" style={styles.link}>
                  mycomatrix1@gmail.com
                </a>{" "}
                or call us at <strong style={{color: customGreen}}>+91-9884248531</strong>
              </p>
            </div>

            <div className="policy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                5. Failed Delivery Attempts
              </h5>
              <p>
                In case of failed delivery attempts due to incorrect address, recipient unavailable, 
                or other reasons:
              </p>
              <ul>
                <li>We will make 2 additional delivery attempts</li>
                <li>After 3 failed attempts, the order will be returned to our warehouse</li>
                <li>Re-shipping charges may apply for re-delivery</li>
              </ul>
            </div>

            <div className="policy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                6. International Shipping
              </h5>
              <p>
                Currently, we ship only within India. International shipping services will be 
                launched soon. Subscribe to our newsletter for updates on international expansion.
              </p>
            </div>

            <div className="policy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                7. Holiday Shipping Schedule
              </h5>
              <p>
                Please note that orders placed during public holidays or festive seasons may 
                experience delayed processing and shipping. Major holidays affecting our schedule:
              </p>
              <ul>
                <li>National holidays (Republic Day, Independence Day, Gandhi Jayanti)</li>
                <li>Festive seasons (Diwali, Christmas, Eid)</li>
                <li>State-specific holidays</li>
              </ul>
            </div>

            <div className="policy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                8. Shipping Restrictions
              </h5>
              <p>
                Some areas may have shipping restrictions due to:
              </p>
              <ul>
                <li>Remote location accessibility</li>
                <li>Weather conditions</li>
                <li>Local regulations</li>
                <li>Security concerns</li>
              </ul>
              <p className="text-muted small">
                If your location is not serviceable, we will notify you during checkout.
              </p>
            </div>

            <div className="policy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                9. Address Changes & Modifications
              </h5>
              <p>
                Need to change your delivery address? You can modify your shipping address:
              </p>
              <ul>
                <li>Within 2 hours of order placement - Free of charge</li>
                <li>After 2 hours but before shipment - ₹50 processing fee</li>
                <li>After shipment - Cannot be modified</li>
              </ul>
            </div>
          </div>

          {/* Important Notes */}
          <div className="alert mt-4" style={styles.alertBorder}>
            <h6 className="alert-heading fw-bold" style={styles.heading}>
              Important Notes
            </h6>
            <ul className="mb-0">
              <li>Delivery dates are estimates and not guaranteed</li>
              <li>Please ensure someone is available to receive the package</li>
              <li>Keep your order confirmation email for reference</li>
              <li>Contact us for any shipping-related queries</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="card mt-5" style={styles.cardBorder}>
            <div className="card-body text-center">
              <h6 className="card-title fw-bold" style={styles.heading}>Need Help with Shipping?</h6>
              <p className="mb-2">
                <strong style={{color: customGreen}}>Email:</strong> mycomatrix1@gmail.com | 
                <strong style={{color: customGreen}}> Phone:</strong> +91-9884248531 | 
                <strong style={{color: customGreen}}> Hours:</strong> Mon-Sat, 9 AM - 6 PM
              </p>
              <p className="text-muted small mt-2">
                We're here to ensure your MyComatrix experience is smooth and satisfactory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;