import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PrivacyPolicy = () => {
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
      backgroundColor: customGreen + "10" 
    },
    listItem: {
      borderLeftColor: customGreen
    }
  };
  return (
    <div className="container py-5 border rounded my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className="mb-3 fw-bold" style={styles.heading}>Privacy Policy</h1>
            <p className="lead text-muted">
              Last updated: {new Date().toLocaleDateString('en-IN')}
            </p>
            <p className="text-muted">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>

          {/* Introduction */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold" style={styles.heading}>Welcome to MyComatrix Privacy Policy</h5>
              <p className="card-text">
                At MyComatrix, accessible from{" "}
                <a href="https://mycomatrix.in" style={styles.link}>
                  https://mycomatrix.in
                </a>
                , your privacy is one of our main priorities. This Privacy Policy document contains types of information 
                that is collected and recorded by MyComatrix and how we use it. If you have additional questions or 
                require more information about our Privacy Policy, do not hesitate to contact us.
              </p>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="privacy-content">
            <div className="privacy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                1. Information We Collect
              </h5>
              <p>
                We collect several different types of information for various purposes to provide and improve our service to you.
              </p>
              
              <h6 className="mt-3 fw-bold" style={{color: customGreen}}>Personal Information</h6>
              <p>While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you:</p>
              <ul className="list-group  mb-3">
                <li className="list-group-item border-start" style={styles.listItem}>Full name and contact details</li>
                <li className="list-group-item border-start" style={styles.listItem}> Email address and phone number</li>
                <li className="list-group-item border-start" style={styles.listItem}> Shipping and billing addresses</li>
                <li className="list-group-item border-start" style={styles.listItem}> Payment information (processed securely through payment gateways)</li>
                <li className="list-group-item border-start" style={styles.listItem}> Order history and preferences</li>
              </ul>

              <h6 className="mt-3 fw-bold" style={{color: customGreen}}>Automatically Collected Information</h6>
              <p>We automatically collect certain information when you visit our website:</p>
              <ul>
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on site</li>
                <li>Referring website and search terms</li>
              </ul>
            </div>

            <div className="privacy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                2. How We Use Your Information
              </h5>
              <p>We use the collected information for various purposes:</p>
              <div className="table-responsive">
                <table className="table  mt-3">
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th>Purpose</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Order Processing</td>
                      <td>To process and fulfill your orders and deliveries</td>
                    </tr>
                    <tr>
                      <td>Customer Service</td>
                      <td>To provide support and respond to inquiries</td>
                    </tr>
                    <tr>
                      <td>Personalization</td>
                      <td>To customize your shopping experience</td>
                    </tr>
                    <tr>
                      <td>Marketing</td>
                      <td>To send promotional emails (with your consent)</td>
                    </tr>
                    <tr>
                      <td>Improvements</td>
                      <td>To analyze and enhance our services</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="privacy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                3. Cookies and Tracking Technologies
              </h5>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information.
              </p>
              
              <h6 className="mt-3 fw-bold" style={{color: customGreen}}>Types of Cookies We Use</h6>
              <ul>
                <li><strong style={{color: customGreen}}>Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong style={{color: customGreen}}>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong style={{color: customGreen}}>Functionality Cookies:</strong> Remember your preferences and settings</li>
                <li><strong style={{color: customGreen}}>Advertising Cookies:</strong> Deliver relevant advertisements</li>
              </ul>

              <p className="mt-3">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </div>

            <div className="privacy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                4. Data Security and Protection
              </h5>
              <p>
                We implement industry-standard security measures to protect your personal data against unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
              
              <h6 className="mt-3 fw-bold" style={{color: customGreen}}>Security Measures Include:</h6>
              <ul>
                <li>SSL encryption for data transmission</li>
                <li>Secure payment gateways (Razorpay, Stripe, etc.)</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication protocols</li>
                <li>Data encryption at rest and in transit</li>
              </ul>
            </div>

            <div className="privacy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                5. Data Sharing and Disclosure
              </h5>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share information with:
              </p>
              <ul>
                <li><strong style={{color: customGreen}}>Service Providers:</strong> Payment processors, shipping partners, analytics providers</li>
                <li><strong style={{color: customGreen}}>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong style={{color: customGreen}}>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
              
              <p className="mt-3 text-muted small">
                All third-party service providers are required to maintain the confidentiality and security of your information.
              </p>
            </div>

            <div className="privacy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                6. Data Retention
              </h5>
              <p>
                We will retain your personal information only for as long as necessary for the purposes set out in this Privacy Policy.
              </p>
              <ul>
                <li><strong style={{color: customGreen}}>Account Information:</strong> Until account deletion request</li>
                <li><strong style={{color: customGreen}}>Order Information:</strong> 7 years for tax and legal purposes</li>
                <li><strong style={{color: customGreen}}>Marketing Data:</strong> Until consent withdrawal</li>
                <li><strong style={{color: customGreen}}>Analytics Data:</strong> 26 months maximum</li>
              </ul>
            </div>

            <div className="privacy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                7. Your Rights and Choices
              </h5>
              <p>You have the following rights regarding your personal data:</p>
              <div className="row">
                <div className="col-md-6">
                  <ul>
                    <li>Right to access your data</li>
                    <li>Right to correction</li>
                    <li>Right to deletion</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                  </ul>
                </div>
              </div>
              <p>
                To exercise these rights, please contact us at{" "}
                <a href="mailto:mycomatrix1@gmail.com" style={styles.link}>
                  mycomatrix1@gmail.com
                </a>
              </p>
            </div>

            <div className="privacy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                8. Third-Party Links
              </h5>
              <p>
                Our service may contain links to other sites that are not operated by us. If you click on a third-party link, 
                you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
              </p>
            </div>

            <div className="privacy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                9. Children's Privacy
              </h5>
              <p>
                Our service does not address anyone under the age of 13. We do not knowingly collect personally 
                identifiable information from children under 13. If you are a parent or guardian and you are aware 
                that your child has provided us with personal data, please contact us.
              </p>
            </div>

            <div className="privacy-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                10. Changes to This Policy
              </h5>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-muted small">
                You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </div>

          {/* Consent Section */}
          <div className="alert mt-4" style={styles.alertBorder}>
            <h6 className="alert-heading fw-bold" style={styles.heading}>
              Your Consent
            </h6>
            <p className="mb-0">
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>

          {/* Contact Section */}
          <div className="card mt-5" style={styles.cardBorder}>
            <div className="card-body text-start">
              <h6 className="card-title fw-bold" style={styles.heading}>Contact Us</h6>
              <p className="mb-3">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <p className="mb-2">
                <strong style={{color: customGreen}}>Email:</strong> mycomatrix1@gmail.com
              </p>
              <p className="mb-2">
                <strong style={{color: customGreen}}>Phone:</strong> +91-9884248531
              </p>
              <p className="mb-0">
                <strong style={{color: customGreen}}>Address:</strong> 1/1/16 Ambalakar Street,<br />Vadugapatti,Periyakulam-625 603<br />Theni, Tamil Nadu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;