import { Link } from 'react-router-dom';
import './Solutions.css';
import '../styles/animations.css';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

function Solutions() {
    useScrollAnimations();

    return (
        <div className="solutions-page">
            {/* Page Hero */}
            <section className="page-hero">
                <div className="hero-image">
                    <img
                        src="/images/about-team.png"
                        alt="Our Solutions"
                    />
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="container">
                        <div className="hero-text">
                            <h1>Our Solutions</h1>
                            <p>Strategic Role in Saudi Arabia's Industrial Transformation</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategic Impact */}
            <section className="impact-section">
                <div className="container">
                    <div className="section-header animate-on-scroll fade-in-up">
                        <h2>Strengthening the Supply Chain</h2>
                        <div className="divider"></div>
                        <p>Delivering Measurable Impact Across the Kingdom</p>
                    </div>

                    <div className="impact-grid">
                        <div className="impact-card animate-on-scroll scale-in">
                            <div className="impact-number">50%</div>
                            <h3>Faster Procurement</h3>
                            <p>Drastically reducing the time from request to delivery through automated workflows and digital negotiation.</p>
                        </div>
                        <div className="impact-card animate-on-scroll scale-in delay-100">
                            <div className="impact-number">60%</div>
                            <h3>Efficiency Gains</h3>
                            <p>Optimizing operational costs for both suppliers and buyers by removing traditional supply chain friction.</p>
                        </div>
                        <div className="impact-card animate-on-scroll scale-in delay-200">
                            <div className="impact-number">100%</div>
                            <h3>Transparency</h3>
                            <p>Complete visibility into pricing, availability, and supplier credentials for trusted transactions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Pillars */}
            <section className="pillars-section">
                <div className="container">
                    <div className="pillars-wrapper">

                        <div className="pillar-content animate-on-scroll fade-in-left">
                            <h3>For Buyers & Contractors</h3>
                            <p>We provide a unified platform to source all industrial requirements efficiently.</p>
                            <ul className="pillar-list">
                                <li>Access to verified manufacturers and distributors</li>
                                <li>Compare quotes easily</li>
                                <li>Secure payment and logistics support</li>
                            </ul>
                        </div>
                        <div className="pillar-image animate-on-scroll fade-in-right">
                            <img src="/images/equipment.png" alt="For Buyers" />
                        </div>
                    </div>

                    <div className="pillars-wrapper reverse">
                        <div className="pillar-content animate-on-scroll fade-in-right">
                            <h3>For Suppliers & Manufacturers</h3>
                            <p>We open new digital channels to reach customers across the Kingdom and beyond.</p>
                            <ul className="pillar-list">
                                <li>Digital storefront management</li>
                                <li>Direct access to RFQs from major projects</li>
                                <li>Market analytics and demand forecasting</li>
                            </ul>
                        </div>
                        <div className="pillar-image animate-on-scroll fade-in-left">
                            <img src="/images/logistics.png" alt="For Suppliers" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <div className="cta-content animate-on-scroll scale-in">
                        <h2>Join the Industrial Revolution</h2>
                        <p>Be part of the platform that is reshaping Saudi Arabia's industrial landscape.</p>
                        <Link to="/" className="btn btn-primary">Partner With Us</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Solutions;
