import { useState } from 'react';
import './Home.css';

function Home() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        role: '',
        category: '',
        message: ''
    });

    const [submitStatus, setSubmitStatus] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // -------------------------------------------------------------------------
        // TODO: Replace this URL with your actual Google Apps Script Web App URL
        // See GOOGLE_SHEETS_SETUP.md for instructions
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzMSCV-i9PWMo7NMoXtlS2cCZQTSACkRLNzENADx45GSEg3FfrozyidIdZOwvXD_TaO/exec';
        // -------------------------------------------------------------------------

        try {
            // 1. Store in localStorage (Backup)
            const existingData = JSON.parse(localStorage.getItem('souqroute_leads') || '[]');
            const newLead = {
                ...formData,
                id: Date.now(),
                timestamp: new Date().toISOString()
            };
            existingData.push(newLead);
            localStorage.setItem('souqroute_leads', JSON.stringify(existingData));

            // 2. Send to Google Sheets
            if (GOOGLE_SCRIPT_URL !== 'PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE') {
                // Use no-cors mode to bypass CORS restriction.
                // Note: We won't get a readable response JSON, but it will submit.
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                console.warn('Google Script URL not set. Data saved to local storage only.');
            }

            // Assume success
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                role: '',
                category: '',
                message: ''
            });

            // Show success message
            alert('Thank you! Your message has been received. We will contact you soon.');

            setTimeout(() => setSubmitStatus(''), 3000);

        } catch (error) {
            console.error('Error:', error);
            // Even if fetch fails (rare in no-cors), we saved to localStorage
            setSubmitStatus('success');
            setTimeout(() => setSubmitStatus(''), 3000);
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-image">
                    <img
                        src="/images/hero-bg.png"
                        alt="Industrial Supply Chain"
                    />
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="container">
                        <div className="hero-text">
                            <h1>Saudi Arabia's Premier Industrial Supply Chain Platform</h1>
                            <p>Connecting Verified Suppliers with Buyers for MEP, Construction & Electrical Products</p>
                            <div className="hero-buttons">
                                <a href="#contact" className="btn btn-primary">Request Quote</a>
                                <a href="#services" className="btn btn-secondary">Our Services</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="stats-bar">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">Verified Suppliers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">50%</div>
                            <div className="stat-label">Faster Procurement</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">60%</div>
                            <div className="stat-label">Efficiency Gain</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Platform Access</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section" id="about">
                <div className="container">
                    <div className="section-header">
                        <h2>About SouqRoute</h2>
                        <div className="divider"></div>
                        <p>The Kingdom's First Digital Industrial Ecosystem</p>
                    </div>
                    <div className="about-content">
                        <div className="about-text">
                            <h3>Transforming Saudi Arabia's Industrial Supply Chain</h3>
                            <p>SouqRoute is a pioneering digital platform revolutionizing the industrial supply chain ecosystem in Saudi Arabia. We connect verified suppliers with buyers through an intelligent, transparent, and efficient marketplace that supports the Kingdom's Vision 2030 transformation goals.</p>
                            <p>Our platform specializes in MEP (Mechanical, Electrical & Plumbing), construction materials, industrial equipment, and electrical products, serving contractors, developers, and industrial projects across the Kingdom.</p>
                            <ul className="features-list">
                                <li><span className="checkmark">✓</span> 100% Verified Supplier Network</li>
                                <li><span className="checkmark">✓</span> Streamlined RFQ Management</li>
                                <li><span className="checkmark">✓</span> Smart Supplier Matching</li>
                                <li><span className="checkmark">✓</span> Direct Communication Tools</li>
                            </ul>
                            <a href="/about" className="btn btn-outline">Learn More About Us</a>
                        </div>
                        <div className="about-image">
                            <img
                                src="/images/about-building.png"
                                alt="Industrial Facility"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section" id="services">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Services</h2>
                        <div className="divider"></div>
                        <p>Comprehensive Solutions for Industrial Procurement</p>
                    </div>
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">
                                <img src="/images/icon-verification.png" alt="Verification" />
                            </div>
                            <h3>Supplier Verification</h3>
                            <p>Rigorous verification of business licenses, compliance certifications, and operational capabilities ensuring complete trust and reliability.</p>
                            <ul className="service-features">
                                <li>License Validation</li>
                                <li>Compliance Checks</li>
                                <li>Quality Certifications</li>
                            </ul>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">
                                <img src="/images/icon-connectivity.png" alt="Connectivity" />
                            </div>
                            <h3>Direct Connectivity</h3>
                            <p>Seamless connection between buyers and suppliers through advanced search, RFQ systems, and direct messaging platforms.</p>
                            <ul className="service-features">
                                <li>Smart Search Tools</li>
                                <li>RFQ Management</li>
                                <li>Direct Messaging</li>
                            </ul>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">
                                <img src="/images/icon-insights.png" alt="Insights" />
                            </div>
                            <h3>Marketplace Insights</h3>
                            <p>Data-driven insights and analytics to optimize procurement strategies and make informed business decisions.</p>
                            <ul className="service-features">
                                <li>Market Analytics</li>
                                <li>Performance Metrics</li>
                                <li>Pricing Trends</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Categories */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Product Categories</h2>
                        <div className="divider"></div>
                        <p>Wide Range of Industrial & Construction Products</p>
                    </div>
                    <div className="categories-grid">
                        <div className="category-item">
                            <div className="category-image">
                                <img
                                    src="/images/equipment.png"
                                    alt="MEP Equipment"
                                />
                            </div>
                            <h3>MEP Equipment</h3>
                            <p>Mechanical, Electrical & Plumbing systems and components</p>
                        </div>
                        <div className="category-item">
                            <div className="category-image">
                                <img
                                    src="/images/warehouse.png"
                                    alt="Construction Materials"
                                />
                            </div>
                            <h3>Construction Materials</h3>
                            <p>Building materials, steel, concrete, and finishing products</p>
                        </div>
                        <div className="category-item">
                            <div className="category-image">
                                <img
                                    src="/images/logistics.png"
                                    alt="Electrical Supplies"
                                />
                            </div>
                            <h3>Electrical Supplies</h3>
                            <p>Cables, panels, transformers, and electrical components</p>
                        </div>
                        <div className="category-item">
                            <div className="category-image">
                                <img
                                    src="/images/about-team.png"
                                    alt="Industrial Equipment"
                                />
                            </div>
                            <h3>Industrial Equipment</h3>
                            <p>Machinery, tools, and industrial automation systems</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision 2030 Section */}
            <section className="vision-section">
                <div className="container">
                    <div className="vision-content">
                        <div className="vision-badge">
                            <img
                                src="/images/vision2030.png"
                                alt="Vision 2030"
                                style={{ maxWidth: '150px' }}
                            />
                        </div>
                        <h2>Aligned with Saudi Vision 2030</h2>
                        <p>Supporting the Kingdom's transformation through digital innovation, industrial development, and economic diversification</p>
                        <div className="vision-points">
                            <div className="vision-point">
                                <h4>Mega-Projects Support</h4>
                                <p>Enabling NEOM, Qiddiya, and other transformative developments</p>
                            </div>
                            <div className="vision-point">
                                <h4>SME Empowerment</h4>
                                <p>Providing equal marketplace access for small and medium enterprises</p>
                            </div>
                            <div className="vision-point">
                                <h4>Digital Transformation</h4>
                                <p>Modernizing traditional supply chains with innovative technology</p>
                            </div>
                        </div>
                        <a href="/vision-2030" className="btn btn-primary">Learn More</a>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section" id="contact">
                <div className="container">
                    <div className="section-header">
                        <h2>Get in Touch</h2>
                        <div className="divider"></div>
                        <p>Request a quote or connect with our team</p>
                    </div>
                    <div className="contact-content">
                        <div className="contact-info-box">
                            <h3>Contact Information</h3>
                            <div className="info-item">
                                <strong>Email:</strong>
                                <p>info@souqroute.com</p>
                            </div>
                            <div className="info-item">
                                <strong>Phone:</strong>
                                <p>+966 55 543 2866</p>
                            </div>
                            <div className="info-item">
                                <strong>Location:</strong>
                                <p>Saudi Arabia</p>
                            </div>
                            <div className="info-item">
                                <strong>Working Hours:</strong>
                                <p>Sunday - Thursday: 8:00 AM - 5:00 PM</p>
                            </div>
                        </div>
                        <div className="contact-form-box">
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="company">Company Name *</label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="role">I am a *</label>
                                        <select
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="buyer">Buyer/Purchaser</option>
                                            <option value="supplier">Supplier/Vendor</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="category">Product Category</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select category...</option>
                                            <option value="mep">MEP Equipment</option>
                                            <option value="construction">Construction Materials</option>
                                            <option value="electrical">Electrical Supplies</option>
                                            <option value="industrial">Industrial Equipment</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className={`btn btn-primary btn-block ${submitStatus}`}
                                >
                                    {submitStatus === 'success' ? '✓ Message Sent!' :
                                        submitStatus === 'error' ? 'Error - Try Again' :
                                            'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
