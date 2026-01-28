import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './SuppliesCompaniesSaudi.css';
import '../styles/animations.css';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

function SuppliesCompaniesSaudi() {
    useScrollAnimations();

    return (
        <>
            <Helmet>
                <title>Supplies Companies Saudi Arabia | Industrial & Construction Supplies | SouqRoute</title>
                <meta name="description" content="Discover top supplies companies in Saudi Arabia for industrial, construction, MEP, and electrical supplies. Connect with verified supplies companies through SouqRoute's B2B marketplace." />
                <meta name="keywords" content="supplies companies Saudi Arabia, industrial supplies companies, construction supplies Saudi, MEP supplies companies, electrical supplies Saudi Arabia, building supplies companies KSA, industrial equipment suppliers" />

                {/* Open Graph */}
                <meta property="og:title" content="Supplies Companies Saudi Arabia | Industrial & Construction Supplies | SouqRoute" />
                <meta property="og:description" content="Discover top supplies companies in Saudi Arabia for industrial, construction, MEP, and electrical supplies. Connect with verified supplies companies through SouqRoute's B2B marketplace." />
                <meta property="og:url" content="https://souqroute.com/supplies-companies-saudi-arabia" />
                <meta property="og:type" content="website" />

                {/* Twitter */}
                <meta name="twitter:title" content="Supplies Companies Saudi Arabia | Industrial & Construction Supplies | SouqRoute" />
                <meta name="twitter:description" content="Discover top supplies companies in Saudi Arabia for industrial, construction, MEP, and electrical supplies. Connect with verified supplies companies through SouqRoute's B2B marketplace." />

                {/* Canonical URL */}
                <link rel="canonical" href="https://souqroute.com/supplies-companies-saudi-arabia" />

                {/* Schema.org structured data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Supplies Companies Saudi Arabia",
                        "description": "Discover top supplies companies in Saudi Arabia for industrial, construction, MEP, and electrical supplies.",
                        "url": "https://souqroute.com/supplies-companies-saudi-arabia",
                        "mainEntity": {
                            "@type": "ItemList",
                            "name": "Types of Supplies Companies in Saudi Arabia",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "Industrial Supplies Companies"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "name": "Construction Supplies Companies"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 3,
                                    "name": "MEP Supplies Companies"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 4,
                                    "name": "Electrical Supplies Companies"
                                }
                            ]
                        }
                    })}
                </script>
            </Helmet>

            <div className="supplies-companies-page">
                {/* Hero Section */}
                <section className="page-hero">
                    <div className="hero-image">
                        <img
                            src="/images/equipment.png"
                            alt="Supplies Companies Saudi Arabia"
                        />
                        <div className="hero-overlay"></div>
                    </div>
                    <div className="hero-content">
                        <div className="container">
                            <div className="hero-text">
                                <h1>Supplies Companies Saudi Arabia</h1>
                                <p>Your Complete Directory of Industrial & Construction Supplies Companies</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Introduction Section */}
                <section className="intro-section">
                    <div className="container">
                        <div className="intro-content animate-on-scroll fade-in-up">
                            <h2>Leading Supplies Companies in Saudi Arabia</h2>
                            <div className="divider"></div>
                            <p className="lead-text">
                                SouqRoute connects you with Saudi Arabia's most trusted supplies companies across all industrial sectors. Whether you need industrial supplies, construction materials, MEP equipment, or electrical components, our platform provides direct access to verified supplies companies throughout the Kingdom. Find the right supplies company in Saudi Arabia for your project needs.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Types of Supplies Companies */}
                <section className="types-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Types of Supplies Companies in Saudi Arabia</h2>
                            <div className="divider"></div>
                            <p>Comprehensive range of supplies companies for every industry need</p>
                        </div>
                        <div className="types-grid">
                            <div className="type-card animate-on-scroll scale-in">
                                <div className="type-icon">🏭</div>
                                <h3>Industrial Supplies Companies</h3>
                                <p>Companies providing machinery, tools, safety equipment, and industrial automation systems for manufacturing and production facilities.</p>
                                <ul className="type-features">
                                    <li>Manufacturing Equipment</li>
                                    <li>Industrial Tools & Machinery</li>
                                    <li>Safety & PPE Supplies</li>
                                    <li>Automation Systems</li>
                                    <li>Maintenance Supplies</li>
                                </ul>
                            </div>

                            <div className="type-card animate-on-scroll scale-in delay-100">
                                <div className="type-icon">🏗️</div>
                                <h3>Construction Supplies Companies</h3>
                                <p>Leading companies supplying building materials, steel, concrete, and finishing products for construction projects across Saudi Arabia.</p>
                                <ul className="type-features">
                                    <li>Steel & Rebar Supplies</li>
                                    <li>Cement & Concrete</li>
                                    <li>Insulation Materials</li>
                                    <li>Finishing Products</li>
                                    <li>Scaffolding & Formwork</li>
                                </ul>
                            </div>

                            <div className="type-card animate-on-scroll scale-in delay-200">
                                <div className="type-icon">⚙️</div>
                                <h3>MEP Supplies Companies</h3>
                                <p>Specialized companies providing Mechanical, Electrical, and Plumbing supplies for commercial and residential developments.</p>
                                <ul className="type-features">
                                    <li>HVAC Systems & Components</li>
                                    <li>Plumbing Fixtures & Pipes</li>
                                    <li>Fire Protection Systems</li>
                                    <li>Building Automation</li>
                                    <li>Ventilation Equipment</li>
                                </ul>
                            </div>

                            <div className="type-card animate-on-scroll scale-in delay-300">
                                <div className="type-icon">⚡</div>
                                <h3>Electrical Supplies Companies</h3>
                                <p>Companies offering comprehensive electrical components, cables, panels, and lighting solutions for all applications.</p>
                                <ul className="type-features">
                                    <li>Cables & Wiring Systems</li>
                                    <li>Switchgear & Distribution Panels</li>
                                    <li>Transformers & Generators</li>
                                    <li>Lighting Solutions</li>
                                    <li>Electrical Accessories</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Saudi Supplies Companies */}
                <section className="why-choose-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Why Partner with Supplies Companies in Saudi Arabia?</h2>
                            <div className="divider"></div>
                        </div>
                        <div className="benefits-grid">
                            <div className="benefit-card animate-on-scroll fade-in-left">
                                <div className="benefit-number">01</div>
                                <h3>Local Market Knowledge</h3>
                                <p>Saudi supplies companies understand local regulations, standards (SASO), and market dynamics, ensuring compliance and quality.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-up delay-100">
                                <div className="benefit-number">02</div>
                                <h3>Quick Delivery & Logistics</h3>
                                <p>Local supplies companies offer faster delivery times, reduced shipping costs, and better inventory management.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-right delay-200">
                                <div className="benefit-number">03</div>
                                <h3>After-Sales Support</h3>
                                <p>Access to local technical support, warranty services, and maintenance from supplies companies based in Saudi Arabia.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-left delay-300">
                                <div className="benefit-number">04</div>
                                <h3>Competitive Pricing</h3>
                                <p>Direct access to supplies companies means better pricing, volume discounts, and flexible payment terms.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-up delay-400">
                                <div className="benefit-number">05</div>
                                <h3>Vision 2030 Alignment</h3>
                                <p>Support Saudi Arabia's economic diversification by partnering with local supplies companies.</p>
                            </div>
                            <div className="benefit-card animate-on-scroll fade-in-right delay-500">
                                <div className="benefit-number">06</div>
                                <h3>Bilingual Communication</h3>
                                <p>Seamless communication in both Arabic and English with local supplies companies.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Industry Sectors Served */}
                <section className="industries-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Industries Served by Supplies Companies</h2>
                            <div className="divider"></div>
                            <p>Supplies companies in Saudi Arabia serve diverse sectors</p>
                        </div>
                        <div className="industries-grid">
                            <div className="industry-item animate-on-scroll fade-in-left">
                                <div className="industry-icon">🏢</div>
                                <h3>Commercial Construction</h3>
                                <p>Office buildings, retail centers, and commercial developments</p>
                            </div>
                            <div className="industry-item animate-on-scroll fade-in-up delay-100">
                                <div className="industry-icon">🏘️</div>
                                <h3>Residential Projects</h3>
                                <p>Housing developments, villas, and apartment complexes</p>
                            </div>
                            <div className="industry-item animate-on-scroll fade-in-right delay-200">
                                <div className="industry-icon">🏭</div>
                                <h3>Industrial Facilities</h3>
                                <p>Manufacturing plants, warehouses, and logistics centers</p>
                            </div>
                            <div className="industry-item animate-on-scroll fade-in-left delay-300">
                                <div className="industry-icon">🏗️</div>
                                <h3>Infrastructure Projects</h3>
                                <p>Roads, bridges, utilities, and public infrastructure</p>
                            </div>
                            <div className="industry-item animate-on-scroll fade-in-up delay-400">
                                <div className="industry-icon">⚡</div>
                                <h3>Energy & Utilities</h3>
                                <p>Power plants, water treatment, and energy infrastructure</p>
                            </div>
                            <div className="industry-item animate-on-scroll fade-in-right delay-500">
                                <div className="industry-icon">🌆</div>
                                <h3>Mega Projects</h3>
                                <p>NEOM, Qiddiya, Red Sea Project, and other Vision 2030 initiatives</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How to Find Supplies Companies */}
                <section className="how-to-find-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>How to Find the Right Supplies Company</h2>
                            <div className="divider"></div>
                            <p>Simple process to connect with verified supplies companies</p>
                        </div>
                        <div className="process-timeline">
                            <div className="timeline-item animate-on-scroll fade-in-left">
                                <div className="timeline-marker">1</div>
                                <div className="timeline-content">
                                    <h3>Define Your Requirements</h3>
                                    <p>Identify the specific supplies you need, quantities, quality standards, and delivery timelines for your project.</p>
                                </div>
                            </div>
                            <div className="timeline-item animate-on-scroll fade-in-right delay-100">
                                <div className="timeline-marker">2</div>
                                <div className="timeline-content">
                                    <h3>Search on SouqRoute</h3>
                                    <p>Use our platform to browse verified supplies companies by category, location, and specialization.</p>
                                </div>
                            </div>
                            <div className="timeline-item animate-on-scroll fade-in-left delay-200">
                                <div className="timeline-marker">3</div>
                                <div className="timeline-content">
                                    <h3>Compare & Evaluate</h3>
                                    <p>Review company profiles, certifications, past projects, and customer ratings to make informed decisions.</p>
                                </div>
                            </div>
                            <div className="timeline-item animate-on-scroll fade-in-right delay-300">
                                <div className="timeline-marker">4</div>
                                <div className="timeline-content">
                                    <h3>Request Quotations</h3>
                                    <p>Submit RFQs to multiple supplies companies and receive competitive quotes directly on the platform.</p>
                                </div>
                            </div>
                            <div className="timeline-item animate-on-scroll fade-in-left delay-400">
                                <div className="timeline-marker">5</div>
                                <div className="timeline-content">
                                    <h3>Connect & Negotiate</h3>
                                    <p>Communicate directly with supplies companies, negotiate terms, and finalize your procurement.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Regional Coverage */}
                <section className="regional-coverage-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Supplies Companies Across Saudi Arabia</h2>
                            <div className="divider"></div>
                            <p>Find supplies companies in major Saudi cities and regions</p>
                        </div>
                        <div className="cities-grid">
                            <div className="city-card animate-on-scroll scale-in">
                                <h3>Riyadh</h3>
                                <p>Capital region with extensive supplies companies serving government and private sector projects.</p>
                            </div>
                            <div className="city-card animate-on-scroll scale-in delay-100">
                                <h3>Jeddah</h3>
                                <p>Commercial hub with supplies companies specializing in construction and infrastructure.</p>
                            </div>
                            <div className="city-card animate-on-scroll scale-in delay-200">
                                <h3>Dammam & Eastern Province</h3>
                                <p>Industrial center with supplies companies supporting petrochemical and energy sectors.</p>
                            </div>
                            <div className="city-card animate-on-scroll scale-in delay-300">
                                <h3>Khobar & Jubail</h3>
                                <p>Industrial cities with specialized supplies companies for manufacturing and processing.</p>
                            </div>
                            <div className="city-card animate-on-scroll scale-in delay-400">
                                <h3>Makkah & Madinah</h3>
                                <p>Holy cities with supplies companies serving religious and hospitality projects.</p>
                            </div>
                            <div className="city-card animate-on-scroll scale-in delay-500">
                                <h3>NEOM & Tabuk</h3>
                                <p>Emerging region with supplies companies supporting mega-project developments.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quality & Verification */}
                <section className="quality-section">
                    <div className="container">
                        <div className="quality-content">
                            <div className="quality-text animate-on-scroll fade-in-left">
                                <h2>Verified Supplies Companies You Can Trust</h2>
                                <div className="divider"></div>
                                <p>All supplies companies on SouqRoute undergo rigorous verification to ensure quality, reliability, and compliance.</p>
                                <div className="verification-points">
                                    <div className="verification-item">
                                        <span className="check-icon">✓</span>
                                        <div>
                                            <h4>Commercial Registration</h4>
                                            <p>Valid CR from Ministry of Commerce</p>
                                        </div>
                                    </div>
                                    <div className="verification-item">
                                        <span className="check-icon">✓</span>
                                        <div>
                                            <h4>Quality Certifications</h4>
                                            <p>ISO, SASO, and industry-specific certifications</p>
                                        </div>
                                    </div>
                                    <div className="verification-item">
                                        <span className="check-icon">✓</span>
                                        <div>
                                            <h4>Financial Stability</h4>
                                            <p>Assessment of financial health and capacity</p>
                                        </div>
                                    </div>
                                    <div className="verification-item">
                                        <span className="check-icon">✓</span>
                                        <div>
                                            <h4>Track Record</h4>
                                            <p>Verified past projects and customer references</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="quality-image animate-on-scroll fade-in-right">
                                <img src="/images/about-team.png" alt="Verified Supplies Companies" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Integration */}
                <section className="blog-section">
                    <div className="container">
                        <div className="section-header animate-on-scroll fade-in-up">
                            <h2>Learn More About Supplies Companies</h2>
                            <div className="divider"></div>
                            <p>Expert insights and industry knowledge</p>
                        </div>
                        <div className="blog-cards-grid">
                            <Link to="/blog/digital-transformation-saudi-industrial-sector" className="blog-card-link animate-on-scroll fade-in-left">
                                <div className="blog-card-mini">
                                    <h4>Digital Transformation in Saudi Industrial Sector</h4>
                                    <p>How supplies companies are embracing digital technologies for better service delivery.</p>
                                    <span className="read-more">Read Article →</span>
                                </div>
                            </Link>
                            <Link to="/blog/mep-procurement-best-practices" className="blog-card-link animate-on-scroll fade-in-up delay-100">
                                <div className="blog-card-mini">
                                    <h4>MEP Procurement Best Practices</h4>
                                    <p>Guidelines for sourcing MEP supplies from reliable companies in Saudi Arabia.</p>
                                    <span className="read-more">Read Article →</span>
                                </div>
                            </Link>
                            <Link to="/blog/neom-giga-projects-supply-chain" className="blog-card-link animate-on-scroll fade-in-right delay-200">
                                <div className="blog-card-mini">
                                    <h4>NEOM & Giga Projects Supply Chain</h4>
                                    <p>How supplies companies are supporting Saudi Arabia's mega-project developments.</p>
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
                            <h2>Connect with Top Supplies Companies in Saudi Arabia</h2>
                            <p>Join SouqRoute today and access Saudi Arabia's largest network of verified supplies companies for all your industrial and construction needs.</p>
                            <div className="cta-buttons">
                                <a href="/#contact" className="btn btn-primary">Get Started Now</a>
                                <Link to="/supplier-in-saudi-arabia" className="btn btn-secondary">Browse Suppliers</Link>
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
                                <h3>What types of supplies companies are available on SouqRoute?</h3>
                                <p>SouqRoute features industrial supplies companies, construction supplies companies, MEP supplies companies, electrical supplies companies, and specialized equipment suppliers across all major Saudi cities.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-100">
                                <h3>How are supplies companies verified?</h3>
                                <p>All supplies companies undergo comprehensive verification including commercial registration validation, quality certifications (ISO, SASO), financial assessment, and track record verification.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-200">
                                <h3>Can I request quotes from multiple supplies companies?</h3>
                                <p>Yes, SouqRoute allows you to submit RFQs to multiple supplies companies simultaneously and compare quotes to get the best pricing and terms.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-300">
                                <h3>Do supplies companies offer delivery across Saudi Arabia?</h3>
                                <p>Most supplies companies on our platform offer delivery services across major Saudi cities. Delivery terms and costs can be discussed directly with each company.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-400">
                                <h3>Is there a minimum order requirement?</h3>
                                <p>Minimum order requirements vary by supplies company and product type. You can discuss specific requirements directly with each company through our platform.</p>
                            </div>
                            <div className="faq-item animate-on-scroll fade-in-up delay-500">
                                <h3>How do I register to access supplies companies?</h3>
                                <p>Registration is free and simple. Visit our homepage, fill out the registration form with your business details, and gain immediate access to our network of verified supplies companies.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default SuppliesCompaniesSaudi;
