import './About.css';
import '../styles/animations.css';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

function About() {
    useScrollAnimations();

    return (
        <div className="about-page">
            {/* Page Hero */}
            <section className="page-hero">
                <div className="hero-image">
                    <img
                        src="/images/about-building.png"
                        alt="About SouqRoute"
                    />
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="container">
                        <div className="hero-text">
                            <h1>About SouqRoute</h1>
                            <p>The Kingdom's First Digital Industrial Ecosystem</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Corporate Identity */}
            <section className="corporate-identity">
                <div className="container">
                    <div className="section-header animate-on-scroll fade-in-up">
                        <h2>Corporate Identity</h2>
                        <div className="divider"></div>
                        <p>Pioneering Digital Transformation in Saudi Arabia's Industrial Sector</p>
                    </div>
                    <div className="identity-content">
                        <div className="identity-text animate-on-scroll fade-in-left">
                            <p>SouqRoute is Saudi Arabia's first comprehensive digital platform dedicated to transforming the industrial supply chain ecosystem. We serve as the critical link between verified suppliers and buyers across the MEP, construction, electrical, and industrial equipment sectors.</p>
                            <p>Our platform addresses the Kingdom's growing infrastructure and development needs by providing a transparent, efficient, and reliable marketplace that supports Vision 2030's ambitious transformation goals.</p>
                            <div className="identity-stats">
                                <div className="stat-box">
                                    <h3>Our Mission</h3>
                                    <p>To revolutionize industrial procurement in Saudi Arabia by creating a trusted, efficient digital ecosystem that connects verified suppliers with buyers, enabling faster project delivery and economic growth.</p>
                                </div>
                                <div className="stat-box">
                                    <h3>Our Vision</h3>
                                    <p>To become the leading industrial supply chain platform in the Middle East, setting the standard for digital transformation, transparency, and efficiency in the industrial sector.</p>
                                </div>
                            </div>
                        </div>
                        <div className="identity-image animate-on-scroll fade-in-right">
                            <img
                                src="/images/about-team.png"
                                alt="Modern Industrial Facility"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Challenges Solved */}
            <section className="challenges-section">
                <div className="container">
                    <div className="section-header animate-on-scroll fade-in-up">
                        <h2>Challenges We Solve</h2>
                        <div className="divider"></div>
                        <p>Transforming Traditional Pain Points into Digital Solutions</p>
                    </div>
                    <div className="challenges-grid">
                        <div className="challenge-card animate-on-scroll scale-in">
                            <div className="challenge-before">
                                <h3>❌ Before SouqRoute</h3>
                                <h4>Fragmented Market</h4>
                                <p>Suppliers and buyers struggled to find each other, leading to inefficiencies and missed opportunities.</p>
                            </div>
                            <div className="challenge-arrow">→</div>
                            <div className="challenge-after">
                                <h3>✓ With SouqRoute</h3>
                                <h4>Unified Marketplace</h4>
                                <p>Centralized platform connecting thousands of verified suppliers with buyers nationwide.</p>
                            </div>
                        </div>

                        <div className="challenge-card animate-on-scroll scale-in delay-100">
                            <div className="challenge-before">
                                <h3>❌ Before SouqRoute</h3>
                                <h4>Limited Reliability</h4>
                                <p>No standardized verification process, creating trust issues and quality concerns.</p>
                            </div>
                            <div className="challenge-arrow">→</div>
                            <div className="challenge-after">
                                <h3>✓ With SouqRoute</h3>
                                <h4>100% Verified Network</h4>
                                <p>Rigorous verification ensuring all suppliers meet compliance and quality standards.</p>
                            </div>
                        </div>

                        <div className="challenge-card animate-on-scroll scale-in delay-200">
                            <div className="challenge-before">
                                <h3>❌ Before SouqRoute</h3>
                                <h4>Inefficient Processes</h4>
                                <p>Manual procurement taking weeks with multiple intermediaries and high costs.</p>
                            </div>
                            <div className="challenge-arrow">→</div>
                            <div className="challenge-after">
                                <h3>✓ With SouqRoute</h3>
                                <h4>50% Faster Procurement</h4>
                                <p>Automated RFQ systems and direct communication reducing time and costs significantly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="values-section">
                <div className="container">
                    <div className="section-header animate-on-scroll fade-in-up">
                        <h2>Our Core Values</h2>
                        <div className="divider"></div>
                        <p>Principles That Guide Our Operations</p>
                    </div>
                    <div className="values-grid">
                        <div className="value-card animate-on-scroll scale-in">
                            <div className="value-icon">🎯</div>
                            <h3>Trust & Transparency</h3>
                            <p>We maintain the highest standards of verification and provide complete transparency in all transactions and communications.</p>
                        </div>
                        <div className="value-card animate-on-scroll scale-in delay-100">
                            <div className="value-icon">⚡</div>
                            <h3>Efficiency & Innovation</h3>
                            <p>We continuously innovate to streamline processes and deliver faster, more efficient procurement solutions.</p>
                        </div>
                        <div className="value-card animate-on-scroll scale-in delay-200">
                            <div className="value-icon">🤝</div>
                            <h3>Partnership & Collaboration</h3>
                            <p>We foster strong relationships between suppliers and buyers, creating a collaborative ecosystem for mutual growth.</p>
                        </div>
                        <div className="value-card animate-on-scroll scale-in delay-300">
                            <div className="value-icon">🌟</div>
                            <h3>Quality & Excellence</h3>
                            <p>We are committed to delivering exceptional service quality and maintaining the highest industry standards.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="container">
                    <div className="section-header animate-on-scroll fade-in-up">
                        <h2>Why Choose SouqRoute</h2>
                        <div className="divider"></div>
                        <p>Your Trusted Partner in Industrial Procurement</p>
                    </div>
                    <div className="benefits-grid">
                        <div className="benefit-item animate-on-scroll fade-in-left">
                            <h4>✓ Verified Supplier Network</h4>
                            <p>Access to 100% verified suppliers with validated credentials and compliance certifications.</p>
                        </div>
                        <div className="benefit-item animate-on-scroll fade-in-right">
                            <h4>✓ Time & Cost Savings</h4>
                            <p>Reduce procurement cycles by 50% and lower costs through competitive pricing and efficiency.</p>
                        </div>
                        <div className="benefit-item animate-on-scroll fade-in-left delay-100">
                            <h4>✓ Smart Matching Technology</h4>
                            <p>AI-powered algorithms connect you with the perfect suppliers for your specific needs.</p>
                        </div>
                        <div className="benefit-item animate-on-scroll fade-in-right delay-100">
                            <h4>✓ 24/7 Platform Access</h4>
                            <p>Round-the-clock access to the marketplace from anywhere in the Kingdom.</p>
                        </div>
                        <div className="benefit-item animate-on-scroll fade-in-left delay-200">
                            <h4>✓ Direct Communication</h4>
                            <p>Seamless messaging and negotiation tools for faster deal closure.</p>
                        </div>
                        <div className="benefit-item animate-on-scroll fade-in-right delay-200">
                            <h4>✓ Market Insights</h4>
                            <p>Data-driven analytics and pricing trends to inform your procurement decisions.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
