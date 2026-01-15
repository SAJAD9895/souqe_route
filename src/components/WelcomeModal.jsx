import { useState, useEffect } from 'react';
import './WelcomeModal.css';

function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show modal every time the home page is visited
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000); // 1 second delay for smooth entry

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleRegisterClick = () => {
        setIsOpen(false);
        const registerSection = document.getElementById('about');
        if (registerSection) {
            registerSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close" onClick={handleClose}>×</button>
                <div className="modal-content">
                    <div className="modal-header">
                        <span className="modal-badge">New Platform</span>
                        <h2>Welcome to SouqRoute</h2>
                    </div>
                    <p>
                        Saudi Arabia's verified industrial marketplace is now live.
                        Join suppliers and buyers connecting directly for <strong>MEP, Electrical, and Construction</strong> materials.
                    </p>
                    <ul className="modal-benefits">
                        <li>✓ Verified Supplier Network</li>
                        <li>✓ Instant RFQ Requests</li>
                        <li>✓ Direct Messaging</li>
                    </ul>
                    <button className="btn btn-primary btn-block btn-pulse" onClick={handleRegisterClick}>
                        Register Free Now
                    </button>
                    <button className="btn-link" onClick={handleClose}>
                        I'll browse first
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WelcomeModal;
