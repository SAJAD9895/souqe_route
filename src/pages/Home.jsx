import { useState, useEffect } from 'react';
import './Home.css';
import RegistrationForm from '../components/RegistrationForm';
import WelcomeModal from '../components/WelcomeModal';
import { supabase } from '../lib/supabaseClient';

function Home() {
    useEffect(() => {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        // Observe all elements with animate-on-scroll class
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));

        return () => {
            animatedElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    return (
        <div className="home-page">
            <WelcomeModal />
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
                            <p>Connecting Verified Suppliers with Buyers for Construction & Electrical
                                Products- change this to Connecting Buyers & Suppliers Across All Industries
                                in Saudi Arabia.</p>
                            <div className="hero-buttons">
                                <a href="#about" className="btn btn-primary btn-pulse">Register Now</a>
                                {/* <a href="#services" className="btn btn-secondary">Our Services</a> */}
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
                    <div className="section-header animate-on-scroll fade-in-up">
                        <h2>About SouqRoute</h2>
                        <div className="divider"></div>
                        <p>The Kingdom's First Digital Industrial Ecosystem</p>
                    </div>
                    <div className="about-content">
                        <div className="about-text animate-on-scroll fade-in-left">
                            <h3>Transforming Saudi Arabia's Industrial Supply Chain</h3>
                            <p>SouqRoute is a pioneering digital platform revolutionizing the industrial supply chain ecosystem in Saudi Arabia. We connect verified suppliers with buyers through an intelligent, transparent, and efficient marketplace that supports the Kingdom's Vision 2030 transformation goals.</p>
                            <p>Our platform specializes in MEP (Mechanical, Electrical & Plumbing), construction materials, industrial equipment, and electrical products, serving contractors, developers, and industrial projects across the Kingdom.</p>
                            <ul className="features-list">
                                <li><span className="checkmark">✓</span> 100% Verified Supplier Network</li>
                                {/* <li><span className="checkmark">✓</span> Streamlined RFQ Management</li> */}
                                <li><span className="checkmark">✓</span> Smart Supplier Matching</li>
                                <li><span className="checkmark">✓</span> Direct Communication Tools</li>
                            </ul>
                            <a href="/about" className="btn btn-outline">Learn More About Us</a>
                        </div>
                        <div className="about-image animate-on-scroll fade-in-right">
                            <RegistrationForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            {/* Services Section */}
            {/* <section className="services-section" id="services">
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
            </section> */}

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
                    <div className="contact-content centered">
                        <div className="contact-info-box full-width">
                            <h3>Contact Information</h3>
                            <div className="contact-grid-info">
                                <div className="info-item">
                                    <strong>Email:</strong>
                                    <p>info@souqroute.com</p>
                                </div>
                                {/* <div className="info-item">
                                    <strong>Phone:</strong>
                                    <p>+966 55 543 2866</p>
                                </div> */}
                                <div className="info-item">
                                    <strong>Location:</strong>
                                    <p>Saudi Arabia</p>
                                </div>
                                {/* <div className="info-item">
                                    <strong>Working Hours:</strong>
                                    <p>Sunday - Thursday: 8:00 AM - 5:00 PM</p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
