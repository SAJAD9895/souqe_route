import { useState, useEffect } from 'react';
import './WelcomeModal.css';

function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already seen the modal in this session
        const hasSeenModal = sessionStorage.getItem('souqroute_modal_seen');

        if (!hasSeenModal) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('souqroute_modal_seen', 'true');
            }, 3000); // Show after 3 seconds

            return () => clearTimeout(timer);
        }
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
