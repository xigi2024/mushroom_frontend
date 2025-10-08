import React, { useState } from 'react';
import "../styles/contact.css";
import { FaFacebookF, FaYoutube, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

    // EmailJS configuration
    const EMAILJS_SERVICE_ID = 'service_inaxkqf'; // replace with your own
    const EMAILJS_TEMPLATE_ID = 'template_2wnj26b'; // replace with your own
    const EMAILJS_PUBLIC_KEY = 'MpRGXsPoOqv-UtGo0'; // replace with your own

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: '', message: '' });

        try {
            const templateParams = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                to_name: 'MyComatrix Team'
            };

            const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            console.log('Email sent successfully:', result);

            setSubmitStatus({
                type: 'success',
                message: 'Thank you! Your message has been sent successfully.'
            });

            setFormData({ name: '', phone: '', email: '', message: '' });
        } catch (error) {
            console.error('Failed to send email:', error);
            setSubmitStatus({
                type: 'danger',
                message: 'Sorry, there was an error sending your message. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">

            {/* Hero Section */}
            <div className="hero-section">
                <div className="container">
                    <h1 className="hero-title">Contact Us</h1>
                    <p className="hero-subtitle">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </div>

            {/* Contact Section */}
            <div className="contact-section">
                <div className="container">
                    <div className="row">

                        {/* Contact Info */}
                        <div className="col-lg-6 col-md-6">
                            <div className="h-100 p-5">
                                <h3 className="color">Get In Touch</h3>
                                <p className="text-muted mb-4">
                                    Feel free to contact us via form or drop an enquiry.
                                </p>

                                {/* Address */}
                                <div className="contact-item d-flex align-items-center mb-3">
                                    <div className="contact-icon">
                                        <FaMapMarkerAlt className="color" />
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-1">Address</h6>
                                        <p className="mb-0 text-muted">1/1/16 Ambalakar Street, Vadugapatti, Periyakulam-625 603, Theni, Tamil Nadu</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="contact-item d-flex align-items-center mb-3">
                                    <div className="contact-icon">
                                        <FaPhoneAlt className="color" />
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-1">Phone Number</h6>
                                        <p className="mb-0 text-muted">+91 9884248531</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="contact-item d-flex align-items-center mb-3">
                                    <div className="contact-icon">
                                        <FaEnvelope className="color" />
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-1">E-Mail</h6>
                                        <p className="mb-0 text-muted">mycomatrix1@gmail.com</p>
                                    </div>
                                </div>

                                <hr className='border-3 mt-5' />

                                <div className="mt-5">
                                    <h6 className="mb-3">Follow Us</h6>
                                    <div className="social-icons d-flex gap-3">
                                        <a href="https://www.youtube.com/@mycomatrix"><FaYoutube size={24} color="#FF0000" /></a>
                                        <a href="https://www.instagram.com/myco_matrix_mushroom"><FaInstagram size={24} color="#E1306C" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="col-lg-6">
                            <div className="contact-form h-100">
                                <h3 className="color">Send a Message</h3>

                                {submitStatus.message && (
                                    <div className={`alert alert-${submitStatus.type}`} role="alert">
                                        {submitStatus.message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Your full name"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Your phone number"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Your email address"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea
                                            className="form-control"
                                            id="message"
                                            name="message"
                                            rows="4"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Enter your message here..."
                                            required
                                            disabled={isSubmitting}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="button"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Submit'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="map-container">
                                <iframe
                                    src="https://www.google.com/maps?q=1/1/16 Ambalakar Street, Vadugapatti, Periyakulam, Theni&output=embed"
                                    title="Location Map"
                                    width="100%"
                                    height="450"
                                    style={{ border: 0, borderRadius: '8px' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;