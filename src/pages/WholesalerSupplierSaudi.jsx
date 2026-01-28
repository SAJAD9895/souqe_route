import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './WholesalerSupplierSaudi.css';
import '../styles/animations.css';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

function WholesalerSupplierSaudi() {
    useScrollAnimations();

    return (
        <>
            <Helmet>
                <title>Wholesaler & Supplier in Saudi Arabia | Bulk Industrial Suppliers | SouqRoute</title>
                <meta name="description" content="Connect with verified wholesalers and suppliers in Saudi Arabia for bulk industrial, construction, MEP, and electrical supplies. Access wholesale pricing through SouqRoute's B2B platform." />
                <meta name="keywords" content="wholesaler supplier Saudi Arabia, wholesale suppliers Saudi, bulk suppliers KSA, industrial wholesalers Saudi Arabia, construction wholesalers, MEP wholesalers, wholesale distributors Saudi" />

                {/* Open Graph */}
                <meta property="og:title" content="Wholesaler & Supplier in Saudi Arabia | Bulk Industrial Suppliers | SouqRoute" />
                <meta property="og:description" content="Connect with verified wholesalers and suppliers in Saudi Arabia for bulk industrial, construction, MEP, and electrical supplies. Access wholesale pricing through SouqRoute's B2B platform." />
                <meta property="og:url" content="https://souqroute.com/wholesaler-supplier-saudi-arabia" />
                <meta property="og:type" content="website" />

                {/* Twitter */}
                <meta name="twitter:title" content="Wholesaler & Supplier in Saudi Arabia | Bulk Industrial Suppliers | SouqRoute" />
                <meta name="twitter:description" content="Connect with verified wholesalers and suppliers in Saudi Arabia for bulk industrial, construction, MEP, and electrical supplies. Access wholesale pricing through SouqRoute's B2B platform." />

                {/* Canonical URL */}
                <link rel="canonical" href="https://souqroute.com/wholesaler-supplier-saudi-arabia" />

                {/* Schema.org structured data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Wholesaler & Supplier in Saudi Arabia",
                        "description": "Connect with verified wholesalers and suppliers in Saudi Arabia for bulk industrial and construction supplies.",
                        "url": "https://souqroute.com/wholesaler-supplier-saudi-arabia",
                        "mainEntity": {
                            "@type": "ItemList",
                            "name": "Wholesale Supplier Categories in Saudi Arabia",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "Industrial Wholesalers"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "name": "Construction Material Wholesalers"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 3,
                                    "name": "MEP Equipment Wholesalers"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 4,
                                    "name": "Electrical Supplies Wholesalers"
                                }
                            ]
                        }
                    })}
                </script>
            </Helmet>

            <div className="wholesaler-supplier-page">
                {/* Hero Section */}
                <section className="page-hero">
                    <div className="hero-image">
                        <img
                            src="/images/logistics.png"
                            alt="Wholesaler & Supplier in Saudi Arabia"
                        />
                        <div className="hero-overlay"></div>
                    </div>
                    <div className="hero-content">
                        <div className="container">
                            <div className="hero-text">
                                <h1>Wholesaler & Supplier in Saudi Arabia</h1>
                                <p>Access Verified Wholesalers for Bulk Industrial & Construction Supplies</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Introduction Section */}
                <section className="intro-section">
                    <div className="container">
                        <div className="intro-content animate-on-scroll fade-in-up">
                            <h2>Saudi Arabia's Premier Wholesale Supplier Network</h2>
                            <div className="divider"></div>
                            <p className="lead-text">
                                SouqRoute connects you with trusted wholesalers and suppliers in Saudi Arabia offering competitive bulk pricing for industrial, construction, MEP, and electrical supplies. Whether you're a contractor, developer, or business owner, find verified wholesale suppliers who can meet your large-scale project requirements with quality products and reliable delivery.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Benefits of Wholesale Section */}
                <section className="wholesale-benefits-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Benefits of Working with Wholesalers in Saudi Arabia</h2>
                            <div className="divider"></div>
                        </div>
                        <div className="benefits-grid">
                            <div className="benefit-card animate-on-scroll fade-in-left">
                                <div className="benefit-icon">💰</div>
                                <h3>Competitive Wholesale Pricing</h3>
                                <p>Access bulk pricing and volume discounts from wholesalers, reducing your overall project costs significantly.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-up delay-100">
                                <div className="benefit-icon">📦</div>
                                <h3>Large Volume Supply</h3>
                                <p>Wholesalers maintain extensive inventory to fulfill large orders for mega-projects and ongoing construction needs.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-right delay-200">
                                <div className="benefit-icon">🚚</div>
                                <h3>Reliable Logistics</h3>
                                <p>Established distribution networks ensure timely delivery of bulk orders across Saudi Arabia.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-left delay-300">
                                <div className="benefit-icon">🤝</div>
                                <h3>Long-term Partnerships</h3>
                                <p>Build lasting relationships with wholesalers for consistent supply and preferential pricing.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-up delay-400">
                                <div className="benefit-icon">✓</div>
                                <h3>Quality Assurance</h3>
                                <p>All wholesalers verified for quality certifications, SASO compliance, and product authenticity.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-right delay-500">
                                <div className="benefit-icon">💳</div>
                                <h3>Flexible Payment Terms</h3>
                                <p>Negotiate favorable payment terms including credit facilities for established businesses.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Wholesaler Categories */}
                <section className="categories-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Wholesale Supplier Categories</h2>
                            <div className="divider"></div>
                            <p>Find wholesalers across all major industrial sectors</p>
                        </div>
                        <div className="wholesaler-categories-grid">
                            <div className="category-card animate-on-scroll scale-in">
                                <div className="category-badge">Wholesale</div>
                                <div className="category-image">
                                    <img src="/images/equipment.png" alt="Industrial Wholesalers Saudi Arabia" />
                                </div>
                                <h3>Industrial Equipment Wholesalers</h3>
                                <p>Bulk suppliers of machinery, tools, and industrial equipment for manufacturing facilities.</p>
                                <ul className="category-features">
                                    <li>Manufacturing Machinery</li>
                                    <li>Industrial Tools & Equipment</li>
                                    <li>Safety Equipment (PPE)</li>
                                    <li>Automation Systems</li>
                                    <li>Maintenance Supplies</li>
                                </ul>
                                <div className="category-highlight">
                                    <span>✓ Bulk Discounts Available</span>
                                </div>
                            </div>

                            <div className="category-card animate-on-scroll scale-in delay-100">
                                <div className="category-badge">Wholesale</div>
                                <div className="category-image">
                                    <img src="/images/warehouse.png" alt="Construction Wholesalers Saudi Arabia" />
                                </div>
                                <h3>Construction Material Wholesalers</h3>
                                <p>Large-scale suppliers of building materials for construction and infrastructure projects.</p>
                                <ul className="category-features">
                                    <li>Steel & Rebar (Bulk Orders)</li>
                                    <li>Cement & Concrete</li>
                                    <li>Insulation Materials</li>
                                    <li>Finishing Products</li>
                                    <li>Aggregates & Sand</li>
                                </ul>
                                <div className="category-highlight">
                                    <span>✓ Volume Pricing</span>
                                </div>
                            </div>

                            <div className="category-card animate-on-scroll scale-in delay-200">
                                <div className="category-badge">Wholesale</div>
                                <div className="category-image">
                                    <img src="/images/about-team.png" alt="MEP Wholesalers Saudi Arabia" />
                                </div>
                                <h3>MEP Equipment Wholesalers</h3>
                                <p>Wholesale distributors of mechanical, electrical, and plumbing systems and components.</p>
                                <ul className="category-features">
                                    <li>HVAC Systems (Bulk)</li>
                                    <li>Plumbing Fixtures & Pipes</li>
                                    <li>Fire Protection Systems</li>
                                    <li>Building Automation</li>
                                    <li>Ventilation Equipment</li>
                                </ul>
                                <div className="category-highlight">
                                    <span>✓ Project Pricing</span>
                                </div>
                            </div>

                            <div className="category-card animate-on-scroll scale-in delay-300">
                                <div className="category-badge">Wholesale</div>
                                <div className="category-image">
                                    <img src="/images/logistics.png" alt="Electrical Wholesalers Saudi Arabia" />
                                </div>
                                <h3>Electrical Supplies Wholesalers</h3>
                                <p>Bulk distributors of electrical components, cables, and lighting solutions.</p>
                                <ul className="category-features">
                                    <li>Cables & Wiring (Reels)</li>
                                    <li>Switchgear & Panels</li>
                                    <li>Transformers</li>
                                    <li>Lighting Solutions (Bulk)</li>
                                    <li>Electrical Accessories</li>
                                </ul>
                                <div className="category-highlight">
                                    <span>✓ Contractor Rates</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How Wholesale Works */}
                <section className="how-wholesale-works">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>How to Work with Wholesalers on SouqRoute</h2>
                            <div className="divider"></div>
                        </div>
                        <div className="wholesale-process">
                            <div className="process-step animate-on-scroll fade-in-left">
                                <div className="step-icon">1</div>
                                <div className="step-content">
                                    <h3>Register Your Business</h3>
                                    <p>Create a business account on SouqRoute with your company details and requirements.</p>
                                </div>
                            </div>
                            <div className="process-arrow">→</div>
                            <div className="process-step animate-on-scroll fade-in-up delay-100">
                                <div className="step-icon">2</div>
                                <div className="step-content">
                                    <h3>Browse Wholesalers</h3>
                                    <p>Search verified wholesalers by product category, location, and minimum order quantities.</p>
                                </div>
                            </div>
                            <div className="process-arrow">→</div>
                            <div className="process-step animate-on-scroll fade-in-right delay-200">
                                <div className="step-icon">3</div>
                                <div className="step-content">
                                    <h3>Request Bulk Quotes</h3>
                                    <p>Submit RFQs with your volume requirements and receive competitive wholesale pricing.</p>
                                </div>
                            </div>
                            <div className="process-arrow">→</div>
                            <div className="process-step animate-on-scroll fade-in-left delay-300">
                                <div className="step-icon">4</div>
                                <div className="step-content">
                                    <h3>Negotiate & Order</h3>
                                    <p>Discuss terms, negotiate pricing, and place your bulk orders directly with wholesalers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Wholesale vs Retail */}
                <section className="comparison-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Wholesale vs Retail: Understanding the Difference</h2>
                            <div className="divider"></div>
                        </div>
                        <div className="comparison-table animate-on-scroll scale-in">
                            <div className="comparison-header">
                                <div className="comparison-col">Feature</div>
                                <div className="comparison-col highlight">Wholesale Suppliers</div>
                                <div className="comparison-col">Retail Suppliers</div>
                            </div>
                            <div className="comparison-row">
                                <div className="comparison-col">Pricing</div>
                                <div className="comparison-col highlight">✓ Bulk discounts (20-40% lower)</div>
                                <div className="comparison-col">Standard retail prices</div>
                            </div>
                            <div className="comparison-row">
                                <div className="comparison-col">Minimum Order</div>
                                <div className="comparison-col highlight">✓ Large quantities required</div>
                                <div className="comparison-col">Small quantities accepted</div>
                            </div>
                            <div className="comparison-row">
                                <div className="comparison-col">Payment Terms</div>
                                <div className="comparison-col highlight">✓ Credit facilities available</div>
                                <div className="comparison-col">Immediate payment</div>
                            </div>
                            <div className="comparison-row">
                                <div className="comparison-col">Delivery</div>
                                <div className="comparison-col highlight">✓ Bulk logistics & scheduling</div>
                                <div className="comparison-col">Quick small deliveries</div>
                            </div>
                            <div className="comparison-row">
                                <div className="comparison-col">Best For</div>
                                <div className="comparison-col highlight">✓ Projects, contractors, businesses</div>
                                <div className="comparison-col">Individual needs</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Regional Wholesalers */}
                <section className="regional-wholesalers">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Wholesalers Across Saudi Arabia</h2>
                            <div className="divider"></div>
                            <p>Find wholesale suppliers in major Saudi cities</p>
                        </div>
                        <div className="regions-grid">
                            <div className="region-card animate-on-scroll fade-in-left">
                                <div className="region-icon">🏙️</div>
                                <h3>Riyadh Wholesalers</h3>
                                <p>Central region's largest wholesale hub serving government and private sector mega-projects.</p>
                                <span className="region-count">500+ Wholesalers</span>
                            </div>
                            <div className="region-card animate-on-scroll fade-in-up delay-100">
                                <div className="region-icon">🌊</div>
                                <h3>Jeddah Wholesalers</h3>
                                <p>Western region's commercial center with import/export wholesale distributors.</p>
                                <span className="region-count">400+ Wholesalers</span>
                            </div>
                            <div className="region-card animate-on-scroll fade-in-right delay-200">
                                <div className="region-icon">⚡</div>
                                <h3>Dammam & Eastern Province</h3>
                                <p>Industrial heartland with specialized wholesalers for petrochemical and energy sectors.</p>
                                <span className="region-count">350+ Wholesalers</span>
                            </div>
                            <div className="region-card animate-on-scroll fade-in-left delay-300">
                                <div className="region-icon">🏗️</div>
                                <h3>Jubail Industrial City</h3>
                                <p>Major industrial hub with wholesalers supporting manufacturing and processing facilities.</p>
                                <span className="region-count">200+ Wholesalers</span>
                            </div>
                            <div className="region-card animate-on-scroll fade-in-up delay-400">
                                <div className="region-icon">🕌</div>
                                <h3>Makkah & Madinah</h3>
                                <p>Holy cities with wholesalers serving hospitality and religious infrastructure projects.</p>
                                <span className="region-count">150+ Wholesalers</span>
                            </div>
                            <div className="region-card animate-on-scroll fade-in-right delay-500">
                                <div className="region-icon">🌆</div>
                                <h3>NEOM & Future Cities</h3>
                                <p>Emerging regions with wholesalers supporting Vision 2030 mega-project developments.</p>
                                <span className="region-count">Growing Network</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Verification Standards */}
                <section className="verification-section">
                    <div className="container">
                        <div className="verification-content">
                            <div className="verification-text animate-on-scroll fade-in-left">
                                <h2>Verified Wholesaler Standards</h2>
                                <div className="divider"></div>
                                <p className="verification-intro">
                                    Every wholesaler and supplier on SouqRoute undergoes comprehensive verification to ensure quality, reliability, and compliance with Saudi regulations.
                                </p>
                                <div className="verification-checklist">
                                    <div className="check-item">
                                        <span className="check-mark">✓</span>
                                        <div>
                                            <h4>Commercial Registration</h4>
                                            <p>Valid CR from Ministry of Commerce with wholesale license</p>
                                        </div>
                                    </div>
                                    <div className="check-item">
                                        <span className="check-mark">✓</span>
                                        <div>
                                            <h4>SASO Compliance</h4>
                                            <p>Saudi Standards certification for all products</p>
                                        </div>
                                    </div>
                                    <div className="check-item">
                                        <span className="check-mark">✓</span>
                                        <div>
                                            <h4>Financial Capacity</h4>
                                            <p>Verified ability to handle large-scale orders</p>
                                        </div>
                                    </div>
                                    <div className="check-item">
                                        <span className="check-mark">✓</span>
                                        <div>
                                            <h4>Warehouse Facilities</h4>
                                            <p>Adequate storage and inventory management systems</p>
                                        </div>
                                    </div>
                                    <div className="check-item">
                                        <span className="check-mark">✓</span>
                                        <div>
                                            <h4>Delivery Network</h4>
                                            <p>Established logistics for bulk order fulfillment</p>
                                        </div>
                                    </div>
                                    <div className="check-item">
                                        <span className="check-mark">✓</span>
                                        <div>
                                            <h4>Track Record</h4>
                                            <p>Proven history of successful bulk supply projects</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="verification-image animate-on-scroll fade-in-right">
                                <div className="stats-box">
                                    <div className="stat-item">
                                        <div className="stat-number">100%</div>
                                        <div className="stat-label">Verified Wholesalers</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">1000+</div>
                                        <div className="stat-label">Wholesale Suppliers</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">30%+</div>
                                        <div className="stat-label">Average Savings</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">24/7</div>
                                        <div className="stat-label">Platform Access</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Integration */}
                <section className="blog-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Wholesale Supplier Insights</h2>
                            <div className="divider"></div>
                            <p>Expert guidance on working with wholesalers</p>
                        </div>
                        <div className="blog-cards-grid">
                            <Link to="/blog/supplier-verification-importance" className="blog-card-link animate-on-scroll fade-in-left">
                                <div className="blog-card-mini">
                                    <div className="blog-tag">Verification</div>
                                    <h4>The Importance of Supplier Verification</h4>
                                    <p>Why verified wholesalers are crucial for large-scale projects in Saudi Arabia.</p>
                                    <span className="read-more">Read Article →</span>
                                </div>
                            </Link>
                            <Link to="/blog/mep-procurement-best-practices" className="blog-card-link animate-on-scroll fade-in-up delay-100">
                                <div className="blog-card-mini">
                                    <div className="blog-tag">Procurement</div>
                                    <h4>MEP Procurement Best Practices</h4>
                                    <p>Guidelines for bulk procurement from MEP wholesalers in Saudi Arabia.</p>
                                    <span className="read-more">Read Article →</span>
                                </div>
                            </Link>
                            <Link to="/blog/neom-giga-projects-supply-chain" className="blog-card-link animate-on-scroll fade-in-right delay-200">
                                <div className="blog-card-mini">
                                    <div className="blog-tag">Mega Projects</div>
                                    <h4>NEOM & Giga Projects Supply Chain</h4>
                                    <p>How wholesalers are supporting Saudi Arabia's mega-project developments.</p>
                                    <span className="read-more">Read Article →</span>
                                </div>
                            </Link>
                        </div>
                        <div className="blog-cta animate-on-scroll fade-in-up delay-300">
                            <Link to="/blog" className="btn btn-outline">Explore All Articles</Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="container">
                        <div className="cta-content animate-on-scroll scale-in">
                            <h2>Ready to Access Wholesale Pricing?</h2>
                            <p>Join SouqRoute today and connect with verified wholesalers and suppliers across Saudi Arabia. Get bulk pricing, flexible terms, and reliable delivery for your projects.</p>
                            <div className="cta-buttons">
                                <a href="/#contact" className="btn btn-primary">Register for Wholesale Access</a>
                                <Link to="/supplier-in-saudi-arabia" className="btn btn-secondary">Browse All Suppliers</Link>
                            </div>
                            <div className="cta-features">
                                <span>✓ Free Registration</span>
                                <span>✓ Instant Access</span>
                                <span>✓ Verified Wholesalers</span>
                                <span>✓ Competitive Pricing</span>
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
                                <h3>What is the minimum order quantity for wholesalers?</h3>
                                <p>Minimum order quantities vary by wholesaler and product type. Most industrial wholesalers require orders suitable for project-scale requirements. Specific MOQs can be discussed directly with each wholesaler through our platform.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-100">
                                <h3>How much can I save with wholesale pricing?</h3>
                                <p>Wholesale pricing typically offers 20-40% savings compared to retail prices, depending on order volume, product category, and payment terms. Larger orders generally receive better discounts.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-200">
                                <h3>Do wholesalers offer credit terms?</h3>
                                <p>Many established wholesalers on SouqRoute offer credit facilities to verified businesses with good track records. Payment terms can be negotiated based on order size and business relationship.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-300">
                                <h3>Can I get samples before placing bulk orders?</h3>
                                <p>Yes, most wholesalers provide product samples for quality verification before large orders. Sample policies and costs vary by supplier and can be arranged through our platform.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-400">
                                <h3>How are wholesalers verified on SouqRoute?</h3>
                                <p>All wholesalers undergo comprehensive verification including commercial registration, SASO compliance, financial capacity assessment, warehouse facility inspection, and track record verification.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-500">
                                <h3>Do wholesalers deliver across Saudi Arabia?</h3>
                                <p>Yes, most wholesalers on our platform have established logistics networks covering major Saudi cities and can arrange delivery for bulk orders nationwide. Delivery terms are discussed during quotation.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default WholesalerSupplierSaudi;
