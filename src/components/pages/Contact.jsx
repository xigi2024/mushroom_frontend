import React, { useState } from 'react';
import "../styles/contact.css";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert('Message sent successfully!');
        setFormData({ name: '', phone: '', email: '', message: '' });
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
                                    Feel free to contact us via form or drop an enquiry. Fresh, local, and safe.
                                </p>

                                {/* Address */}
                                <div className="contact-item d-flex align-items-center mb-3">
                                    <div className="contact-icon">
                                        <FaMapMarkerAlt className="color" />
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-1">Address</h6>
                                        <p className="mb-0 text-muted">Kamloops, Thailand 24300</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="contact-item d-flex align-items-center mb-3">
                                    <div className="contact-icon">
                                        <FaPhoneAlt className="color" />
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-1">Phone Number</h6>
                                        <p className="mb-0 text-muted">+66 893944939</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="contact-item d-flex align-items-center mb-3">
                                    <div className="contact-icon">
                                        <FaEnvelope className="color" />
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-1">E-Mail</h6>
                                        <p className="mb-0 text-muted">freshfood72@gmail.com</p>
                                    </div>
                                </div>

                                <hr className='border-3 mt-5' />

                                <div className="mt-5">
                                    <h6 className="mb-3">Follow Us</h6>
                                    <div className="social-icons  d-flex gap-3">
                                        <a href="#" className="text-primary"><FaFacebookF size={22} /></a>
                                        <a href="#" className="text-info"><FaTwitter size={22} /></a>
                                        <a href="#" className="text-danger"><FaYoutube size={22} /></a>
                                        <a href="#" className="text-warning"><FaInstagram size={22} /></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="col-lg-6">
                            <div className="contact-form h-100">
                                <h3 className="color">Send a Message</h3>

                                <div>
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
                                        ></textarea>
                                    </div>

                                    <button
                                        type="button"
                                        className="button"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="map-container">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31434.82269165303!2d77.48321278561961!3d9.987685134958271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cd54b1b8970d%3A0x9b5e8b3b7b0b0b0b!2sXigi%20Tech%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1756549550207!5m2!1sen!2sin"
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
