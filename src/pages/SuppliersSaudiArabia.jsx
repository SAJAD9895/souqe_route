import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './SuppliersSaudiArabia.css';
import '../styles/animations.css';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

function SuppliersSaudiArabia() {
    useScrollAnimations();

    return (
        <>
            <Helmet>
                <title>Supplier in Saudi Arabia | Verified Industrial Suppliers | SouqRoute</title>
                <meta name="description" content="Find verified suppliers in Saudi Arabia for industrial, construction, MEP, and electrical supplies. Connect with trusted Saudi suppliers through SouqRoute's B2B platform." />
                <meta name="keywords" content="supplier in Saudi Arabia, Saudi suppliers, industrial suppliers Saudi Arabia, construction suppliers, MEP suppliers, electrical suppliers, verified suppliers KSA, B2B suppliers Saudi" />

                {/* Open Graph */}
                <meta property="og:title" content="Supplier in Saudi Arabia | Verified Industrial Suppliers | SouqRoute" />
                <meta property="og:description" content="Find verified suppliers in Saudi Arabia for industrial, construction, MEP, and electrical supplies. Connect with trusted Saudi suppliers through SouqRoute's B2B platform." />
                <meta property="og:url" content="https://souqroute.com/supplier-in-saudi-arabia" />
                <meta property="og:type" content="website" />

                {/* Twitter */}
                <meta name="twitter:title" content="Supplier in Saudi Arabia | Verified Industrial Suppliers | SouqRoute" />
                <meta name="twitter:description" content="Find verified suppliers in Saudi Arabia for industrial, construction, MEP, and electrical supplies. Connect with trusted Saudi suppliers through SouqRoute's B2B platform." />

                {/* Canonical URL */}
                <link rel="canonical" href="https://souqroute.com/supplier-in-saudi-arabia" />

                {/* Schema.org structured data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Supplier in Saudi Arabia",
                        "description": "Find verified suppliers in Saudi Arabia for industrial, construction, MEP, and electrical supplies.",
                        "url": "https://souqroute.com/supplier-in-saudi-arabia",
                        "mainEntity": {
                            "@type": "ItemList",
                            "name": "Supplier Categories in Saudi Arabia",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "MEP Suppliers"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "name": "Construction Material Suppliers"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 3,
                                    "name": "Electrical Suppliers"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 4,
                                    "name": "Industrial Equipment Suppliers"
                                }
                            ]
                        }
                    })}
                </script>
            </Helmet>

            <div className="suppliers-saudi-page">
                {/* Hero Section */}
                <section className="page-hero">
                    <div className="hero-image">
                        <img
                            src="/images/warehouse.png"
                            alt="Supplier in Saudi Arabia"
                        />
                        <div className="hero-overlay"></div>
                    </div>
                    <div className="hero-content">
                        <div className="container">
                            <div className="hero-text">
                                <h1>Supplier in Saudi Arabia</h1>
                                <p>Connect with Verified Industrial Suppliers Across the Kingdom</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Introduction Section */}
                <section className="intro-section">
                    <div className="container">
                        <div className="intro-content animate-on-scroll fade-in-up">
                            <h2>Your Gateway to Trusted Suppliers in Saudi Arabia</h2>
                            <div className="divider"></div>
                            <p className="lead-text">
                                SouqRoute is Saudi Arabia's premier digital marketplace connecting buyers with verified suppliers across all industrial sectors. Whether you're looking for a supplier in Saudi Arabia for construction materials, MEP equipment, electrical supplies, or industrial machinery, our platform provides direct access to the Kingdom's most reliable suppliers.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why Choose Saudi Suppliers Section */}
                <section className="why-choose-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Why Choose Suppliers in Saudi Arabia?</h2>
                            <div className="divider"></div>
                        </div>
                        <div className="benefits-grid">
                            <div className="benefit-card animate-on-scroll fade-in-left">
                                <div className="benefit-icon">🏭</div>
                                <h3>Local Expertise</h3>
                                <p>Saudi suppliers understand local regulations, standards, and market requirements, ensuring compliance and quality.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-up delay-100">
                                <div className="benefit-icon">⚡</div>
                                <h3>Faster Delivery</h3>
                                <p>Reduced shipping times and logistics costs with local suppliers across major Saudi cities.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-right delay-200">
                                <div className="benefit-icon">🤝</div>
                                <h3>Vision 2030 Aligned</h3>
                                <p>Support the Kingdom's economic diversification by partnering with local Saudi suppliers.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-left delay-300">
                                <div className="benefit-icon">✓</div>
                                <h3>100% Verified</h3>
                                <p>All suppliers on SouqRoute undergo rigorous verification including license validation and quality checks.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-up delay-400">
                                <div className="benefit-icon">💬</div>
                                <h3>Direct Communication</h3>
                                <p>Connect directly with suppliers through our bilingual platform (English/Arabic).</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-right delay-500">
                                <div className="benefit-icon">📊</div>
                                <h3>Competitive Pricing</h3>
                                <p>Access competitive quotes from multiple suppliers and negotiate the best deals.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Supplier Categories Section */}
                <section className="categories-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Find Suppliers by Category</h2>
                            <div className="divider"></div>
                            <p>Browse verified suppliers across key industrial sectors in Saudi Arabia</p>
                        </div>
                        <div className="supplier-categories-grid">
                            <div className="category-card animate-on-scroll scale-in">
                                <div className="category-image">
                                    <img src="/images/equipment.png" alt="MEP Suppliers in Saudi Arabia" />
                                </div>
                                <h3>MEP Suppliers</h3>
                                <p>Mechanical, Electrical & Plumbing equipment and systems for construction and industrial projects.</p>
                                <ul className="category-items">
                                    <li>HVAC Systems</li>
                                    <li>Plumbing Fixtures</li>
                                    <li>Fire Protection Systems</li>
                                    <li>Building Automation</li>
                                </ul>
                            </div>

                            <div className="category-card animate-on-scroll scale-in delay-100">
                                <div className="category-image">
                                    <img src="/images/warehouse.png" alt="Construction Material Suppliers Saudi Arabia" />
                                </div>
                                <h3>Construction Material Suppliers</h3>
                                <p>High-quality building materials for residential, commercial, and mega-project developments.</p>
                                <ul className="category-items">
                                    <li>Steel & Rebar</li>
                                    <li>Cement & Concrete</li>
                                    <li>Insulation Materials</li>
                                    <li>Finishing Products</li>
                                </ul>
                            </div>

                            <div className="category-card animate-on-scroll scale-in delay-200">
                                <div className="category-image">
                                    <img src="/images/logistics.png" alt="Electrical Suppliers Saudi Arabia" />
                                </div>
                                <h3>Electrical Suppliers</h3>
                                <p>Comprehensive electrical components and systems for industrial and commercial applications.</p>
                                <ul className="category-items">
                                    <li>Cables & Wiring</li>
                                    <li>Switchgear & Panels</li>
                                    <li>Transformers</li>
                                    <li>Lighting Solutions</li>
                                </ul>
                            </div>

                            <div className="category-card animate-on-scroll scale-in delay-300">
                                <div className="category-image">
                                    <img src="/images/about-team.png" alt="Industrial Equipment Suppliers Saudi Arabia" />
                                </div>
                                <h3>Industrial Equipment Suppliers</h3>
                                <p>Advanced machinery and equipment for manufacturing and industrial operations.</p>
                                <ul className="category-items">
                                    <li>Manufacturing Machinery</li>
                                    <li>Industrial Tools</li>
                                    <li>Automation Systems</li>
                                    <li>Safety Equipment</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="how-it-works-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>How to Connect with Suppliers in Saudi Arabia</h2>
                            <div className="divider"></div>
                            <p>Simple steps to find and connect with verified suppliers</p>
                        </div>
                        <div className="steps-grid">
                            <div className="step-card animate-on-scroll fade-in-left">
                                <div className="step-number">1</div>
                                <h3>Register on SouqRoute</h3>
                                <p>Create your free account and complete your business profile to access our supplier network.</p>
                            </div>
                            <div className="step-card animate-on-scroll fade-in-up delay-100">
                                <div className="step-number">2</div>
                                <h3>Search & Browse</h3>
                                <p>Use our smart search to find suppliers by category, location, or specific product requirements.</p>
                            </div>
                            <div className="step-card animate-on-scroll fade-in-right delay-200">
                                <div className="step-number">3</div>
                                <h3>Request Quotes</h3>
                                <p>Submit RFQs to multiple suppliers and receive competitive quotes directly on the platform.</p>
                            </div>
                            <div className="step-card animate-on-scroll fade-in-left delay-300">
                                <div className="step-number">4</div>
                                <h3>Connect & Negotiate</h3>
                                <p>Communicate directly with suppliers, negotiate terms, and finalize your procurement.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Regional Coverage Section */}
                <section className="regional-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Supplier Coverage Across Saudi Arabia</h2>
                            <div className="divider"></div>
                        </div>
                        <div className="regions-grid">
                            <div className="region-card animate-on-scroll scale-in">
                                <h3>Riyadh Region</h3>
                                <p>Access suppliers in the capital and central region serving major government and private sector projects.</p>
                            </div>
                            <div className="region-card animate-on-scroll scale-in delay-100">
                                <h3>Eastern Province</h3>
                                <p>Connect with suppliers in Dammam, Khobar, and Jubail supporting the petrochemical and industrial sectors.</p>
                            </div>
                            <div className="region-card animate-on-scroll scale-in delay-200">
                                <h3>Western Region</h3>
                                <p>Find suppliers in Jeddah and Makkah serving commercial developments and infrastructure projects.</p>
                            </div>
                            <div className="region-card animate-on-scroll scale-in delay-300">
                                <h3>NEOM & Mega Projects</h3>
                                <p>Specialized suppliers supporting Vision 2030 mega-projects including NEOM, Qiddiya, and Red Sea Project.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Integration Section */}
                <section className="blog-integration-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Learn More About Suppliers in Saudi Arabia</h2>
                            <div className="divider"></div>
                            <p>Explore our blog for insights, best practices, and industry trends</p>
                        </div>
                        <div className="blog-cards-grid">
                            <Link to="/blog/supplier-verification-importance" className="blog-card-link animate-on-scroll fade-in-left">
                                <div className="blog-card-mini">
                                    <h4>The Importance of Supplier Verification</h4>
                                    <p>Learn why verified suppliers are crucial for project success in Saudi Arabia.</p>
                                    <span className="read-more">Read Article →</span>
                                </div>
                            </Link>
                            <Link to="/blog/vision-2030-industrial-growth" className="blog-card-link animate-on-scroll fade-in-up delay-100">
                                <div className="blog-card-mini">
                                    <h4>Vision 2030 & Industrial Growth</h4>
                                    <p>How Saudi suppliers are supporting the Kingdom's transformation goals.</p>
                                    <span className="read-more">Read Article →</span>
                                </div>
                            </Link>
                            <Link to="/blog/mep-procurement-best-practices" className="blog-card-link animate-on-scroll fade-in-right delay-200">
                                <div className="blog-card-mini">
                                    <h4>MEP Procurement Best Practices</h4>
                                    <p>Expert tips for sourcing MEP supplies from Saudi suppliers.</p>
                                    <span className="read-more">Read Article →</span>
                                </div>
                            </Link>
                        </div>
                        <div className="blog-cta animate-on-scroll fade-in-up delay-300">
                            <Link to="/blog" className="btn btn-outline">View All Articles</Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="container">
                        <div className="cta-content animate-on-scroll scale-in">
                            <h2>Ready to Connect with Verified Suppliers in Saudi Arabia?</h2>
                            <p>Join SouqRoute today and access Saudi Arabia's most comprehensive network of verified industrial suppliers.</p>
                            <div className="cta-buttons">
                                <a href="/#contact" className="btn btn-primary">Register Now</a>
                                <Link to="/about" className="btn btn-secondary">Learn More About Us</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="faq-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Frequently Asked Questions</h2>
                            <div className="divider"></div>
                        </div>
                        <div className="faq-grid">
                            <div className="faq-item animate-on-scroll fade-in-up">
                                <h3>How are suppliers verified on SouqRoute?</h3>
                                <p>All suppliers undergo comprehensive verification including commercial registration validation, quality certificate checks, financial health assessment, and operational capacity verification.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-100">
                                <h3>Can I connect with suppliers in specific Saudi cities?</h3>
                                <p>Yes, our platform allows you to search and filter suppliers by location, including major cities like Riyadh, Jeddah, Dammam, and regions supporting mega-projects.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-200">
                                <h3>Is there a fee to connect with suppliers?</h3>
                                <p>Registration on SouqRoute is free for buyers. You can browse suppliers, submit RFQs, and communicate directly without any platform fees.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-300">
                                <h3>What types of suppliers are available?</h3>
                                <p>Our platform features suppliers across all industrial sectors including MEP, construction materials, electrical supplies, industrial equipment, and specialized services for mega-projects.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default SuppliersSaudiArabia;
