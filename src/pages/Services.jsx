import { Link } from 'react-router-dom';
import './Services.css';
import '../styles/animations.css';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

function Services() {
    useScrollAnimations();

    return (
        <div className="services-page">
            {/* Page Hero */}
            <section className="page-hero">
                <div className="hero-image">
                    <img
                        src="/images/warehouse.png"
                        alt="Our Services"
                    />
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="container">
                        <h1>Our Services</h1>
                        <p>Comprehensive Industrial Supply Chain Solutions</p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="services-content-section">
                <div className="container">
                    <div className="section-header animate-on-scroll fade-in-up">
                        <h2>What We Do</h2>
                        <div className="divider"></div>
                        <p>Empowering the Industrial Ecosystem</p>
                    </div>

                    <div className="detailed-services-grid">
                        <div className="detailed-service-card animate-on-scroll fade-in-left">
                            <div className="service-img-wrapper">
                                <img src="/images/icon-verification.png" alt="Supplier Verification" />
                            </div>
                            <div className="service-text-content">
                                <h3>Supplier Verification</h3>
                                <p>We conduct rigorous due diligence on all suppliers to ensure they meet the highest standards of quality, financial stability, and operational capability.</p>
                                <ul>
                                    <li>Commercial Registration Verification</li>
                                    <li>Quality Certificates Validation</li>
                                    <li>Financial Health Assessment</li>
                                    <li>Operational Capacity Check</li>
                                </ul>
                            </div>
                        </div>

                        <div className="detailed-service-card animate-on-scroll fade-in-right delay-100">
                            <div className="service-img-wrapper">
                                <img src="/images/icon-connectivity.png" alt="Smart Connectivity" />
                            </div>
                            <div className="service-text-content">
                                <h3>Smart Connectivity</h3>
                                <p>Our platform uses advanced algorithms to connect buyers with the most suitable suppliers based on project requirements, location, and specialization.</p>
                                <ul>
                                    <li>Intelligent Supplier Matching</li>
                                    <li>Automated RFQ Processing</li>
                                    <li>Real-time Chat & Negotiation</li>
                                    <li>Bilingual Support (English/Arabic)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="detailed-service-card animate-on-scroll fade-in-left delay-200">
                            <div className="service-img-wrapper">
                                <img src="/images/icon-insights.png" alt="Market Intelligence" />
                            </div>
                            <div className="service-text-content">
                                <h3>Market Intelligence</h3>
                                <p>We provide actionable insights and data analytics to help businesses make informed procurement decisions and optimize their supply chain strategies.</p>
                                <ul>
                                    <li>Pricing Trends & Analysis</li>
                                    <li>Supply & Demand Forecasting</li>
                                    <li>Supplier Performance Metrics</li>
                                    <li>Market Opportunity Identification</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="cta-box animate-on-scroll scale-in delay-300">
                        <h3>Ready to optimize your supply chain?</h3>
                        <p>Join SouqRoute today and experience the future of industrial procurement.</p>
                        <div className="cta-buttons">
                            <a href="/#contact" className="btn btn-primary">Get Started</a>
                            <Link to="/" className="btn btn-secondary">Back to Home</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Services;
