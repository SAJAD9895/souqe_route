import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="top-bar">
                <div className="container">
                    <div className="top-bar-content">
                        <div className="contact-info">
                            <span>📞 +966 55 543 2866</span>
                            <span>✉️ info@souqroute.com</span>
                        </div>
                        <div className="top-links">
                            <Link to="/about">About</Link>
                            <a href="#contact">Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="navbar">
                <div className="container">
                    <div className="nav-container">
                        <Link to="/" className="logo" onClick={closeMenu}>
                            <img src="/images/logo-black.png" alt="Souq Route" className="logo-image" />
                        </Link>
                        <button
                            className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                            <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
                            <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
                            <li><Link to="/solutions" onClick={closeMenu}>Solutions</Link></li>
                            <li><Link to="/vision-2030" onClick={closeMenu}>Vision 2030</Link></li>
                            <li><a href="#about" className="btn-contact" onClick={closeMenu}>Register Now</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
