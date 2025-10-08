import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const RefundPolicy = () => {
  // Custom green color
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
    }
  };

  return (
    <div className="container py-5 border rounded my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className="fw-bold mb-3" style={styles.heading}>
              Cancellation & Refund Policy
            </h1>
            <p className="lead text-muted">
              Last updated: {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>

          {/* Introduction */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold" style={styles.heading}>
                Overview
              </h5>
              <p className="card-text">
                At MyComatrix, we aim to ensure complete customer satisfaction.
                However, if you wish to cancel your order or request a refund,
                please review the following terms carefully.
              </p>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3" style={styles.sectionTitle}>
              1. Cancellation Policy
            </h5>
            <p>
              Orders can be canceled within <strong>24 hours</strong> of
              placement by contacting our support team. Once processing begins,
              cancellations may not be accepted.
            </p>
          </div>

          {/* Refund Policy */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3" style={styles.sectionTitle}>
              2. Refund Policy
            </h5>
            <p>
              Refunds are processed only for eligible cancellations and will be
              credited within <strong>7–10 business days</strong> to the original
              payment method used at purchase.
            </p>
          </div>

          {/* Non-Refundable Items */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3" style={styles.sectionTitle}>
              3. Non-Refundable Items
            </h5>
            <p>
              Certain digital services, customized products, or once-delivered
              items may not be eligible for a refund due to their nature. Such
              items will be clearly marked as non-refundable at the time of
              purchase.
            </p>
          </div>

          {/* Contact Support */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3" style={styles.sectionTitle}>
              4. Contact for Support
            </h5>
            <p>
              For any questions regarding cancellations or refunds, please reach
              out to us at{" "}
              <a href="mailto:mycomatrix1@gmail.com" style={styles.link}>
                mycomatrix1@gmail.com
              </a>
              .
            </p>
          </div>

          {/* Closing Card */}
          <div className="card mt-5" style={styles.cardBorder}>
            <div className="card-body text-center">
              <h6 className="fw-bold" style={styles.heading}>
                By purchasing or using our services, you agree to abide by our
                Cancellation and Refund Policy.
              </h6>
              <p className="text-muted small mt-2">
                This policy may be updated at any time without prior notice. Please
                check this page periodically for the latest version.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
