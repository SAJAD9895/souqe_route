import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <img src="/images/logo-white.png" alt="Souq Route" className="footer-logo" />
                        <p>Saudi Arabia's Premier Industrial Supply Chain Platform</p>
                        <div className="footer-badge">
                            <img
                                src="/images/vision2030.png"
                                alt="Vision 2030"
                                style={{ maxWidth: '100px', opacity: 0.8 }}
                            />
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/services">Services</Link></li>
                            <li><Link to="/solutions">Solutions</Link></li>
                            <li><Link to="/vision-2030">Vision 2030</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/supplier-in-saudi-arabia">Suppliers</Link></li>
                            <li><Link to="/supplies-companies-saudi-arabia">Supplies Companies</Link></li>
                            <li><Link to="/wholesaler-supplier-saudi-arabia">Wholesalers</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#supplier-verification">Supplier Verification</a></li>
                            <li><a href="#rfq-management">RFQ Management</a></li>
                            <li><a href="#smart-matching">Smart Matching</a></li>
                            <li><a href="#market-insights">Market Insights</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <ul>
                            <li>Email: info@souqroute.com</li>
                            {/* <li>Phone: +966 55 543 2866</li> */}
                            <li>Saudi Arabia</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 SouqRoute. All rights reserved. | <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a></p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
