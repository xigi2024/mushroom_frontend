import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TermsConditions = () => {
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
            <h1 className="mb-3 fw-bold" style={styles.heading}>Terms & Conditions</h1>
            <p className="lead text-muted">
              Last updated: {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          {/* Introduction */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold" style={styles.heading}>Welcome to MyComatrix</h5>
              <p className="card-text">
                Welcome to MyComatrix! By accessing and using our website{" "}
                <a href="https://mycomatrix.in" style={styles.link}>
                  https://mycomatrix.in
                </a>
                , you acknowledge that you have read, understood, and agree to be bound by the following terms and conditions of use. If you disagree with any part of these terms, please do not use our website.
              </p>
            </div>
          </div>

          {/* Terms List */}
          <div className="terms-content">
            <div className="term-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                1. Acceptance of Terms
              </h5>
              <p>
                By accessing this website, you are deemed to have accepted these terms and conditions in full. Do not continue to use MyComatrix's website if you do not accept all of the terms and conditions stated on this page.
              </p>
            </div>

            <div className="term-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                2. User Account Responsibilities
              </h5>
              <p>
                <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
              </p>
              <p>
                <strong>Accurate Information:</strong> You must provide accurate, current, and complete information during the registration process and update your information to keep it accurate.
              </p>
            </div>

            <div className="term-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                3. Prohibited Activities
              </h5>
              <p>You agree not to use the website for any of the following:</p>
              <ul className="list-group  mb-3">
                <li className="list-group-item border-start" style={styles.listItem}>Any unlawful, fraudulent, or malicious purpose</li>
                <li className="list-group-item border-start" style={styles.listItem}> Posting or transmitting harmful material (viruses, malware, etc.)</li>
                <li className="list-group-item border-start" style={styles.listItem}> Attempting to gain unauthorized access to other accounts or systems</li>
                <li className="list-group-item border-start" style={styles.listItem}> Harassing, abusing, or harming other persons</li>
                <li className="list-group-item border-start" style={styles.listItem}> Violating any applicable laws or regulations</li>
              </ul>
            </div>

            <div className="term-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                4. Intellectual Property Rights
              </h5>
              <p>
                Unless otherwise stated, MyComatrix and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access this from MyComatrix for your personal use subjected to restrictions set in these terms and conditions.
              </p>
              <p>
                <strong style={{color: customGreen}}>You must not:</strong>
              </p>
              <ul>
                <li>Republish material from MyComatrix</li>
                <li>Sell, rent, or sub-license material from the website</li>
                <li>Reproduce, duplicate, or copy material from the website</li>
                <li>Redistribute content from MyComatrix</li>
              </ul>
            </div>

            <div className="term-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                5. Third-Party Links and Content
              </h5>
              <p>
                Our website may contain links to third-party websites or services that are not owned or controlled by MyComatrix. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </div>

            <div className="term-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                6. Disclaimer of Warranties
              </h5>
              <p>
                This website is provided "as is" without any representations or warranties, express or implied. MyComatrix makes no representations or warranties in relation to this website or the information and materials provided on this website.
              </p>
            </div>

            <div className="term-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                7. Limitation of Liability
              </h5>
              <p>
                MyComatrix will not be liable to you (whether under the law of contract, the law of torts, or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special, or consequential loss.
              </p>
            </div>

            <div className="term-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                8. Governing Law & Jurisdiction
              </h5>
              <p>
                These terms and conditions will be governed by and construed in accordance with the laws of India, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of India.
              </p>
            </div>

            <div className="term-section mb-4">
              <h5 className="mb-3 fw-bold" style={styles.sectionTitle}>
                9. Changes to Terms
              </h5>
              <p>
                MyComatrix reserves the right to revise these terms and conditions at any time without notice. By using this website, you are expected to review these terms regularly to ensure you understand all terms and conditions governing use of the website.
              </p>
            </div>

       
          </div>

          {/* Acceptance Section */}
          <div className="card mt-5" style={styles.cardBorder}>
            <div className="card-body text-center">
              <h6 className="card-title fw-bold" style={styles.heading}>
                By using our website, you hereby consent to our Terms and Conditions and agree to its terms.
              </h6>
              <p className="text-muted small mt-2">
                This document supersedes all prior communications, representations, or agreements, whether oral or written, between you and MyComatrix.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;