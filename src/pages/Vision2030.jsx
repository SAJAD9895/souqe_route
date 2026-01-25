import { Link } from 'react-router-dom';
import './Vision2030.css';
import '../styles/animations.css';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

function Vision2030() {
    useScrollAnimations();

    return (
        <div className="vision-page">
            {/* Page Hero */}
            <section className="page-hero">
                <div className="hero-image">
                    <img
                        src="/images/vision-hero.png"
                        alt="Saudi Vision 2030"
                    />
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="container">
                        <img
                            src="/images/vision2030.png"
                            alt="Vision 2030 Logo"
                            className="vision-logo-hero"
                        />
                        <h1>Driving National Transformation</h1>
                        <p>Building the Future of Supply Chain in Saudi Arabia</p>
                    </div>
                </div>
            </section>

            {/* Alignment Section */}
            <section className="alignment-section">
                <div className="container">
                    <div className="section-header animate-on-scroll fade-in-up">
                        <h2>Aligned with Vision 2030</h2>
                        <div className="divider"></div>
                        <p>Supporting the Kingdom's Ambitious Goals</p>
                    </div>

                    <div className="vision-intro animate-on-scroll fade-in-up delay-100">
                        <p>
                            SouqRoute is proud to be a key enabler of Saudi Vision 2030's National Industrial Development and Logistics Program (NIDLP). We are committed to transforming the Kingdom into a leading industrial powerhouse and a global logistics hub by digitizing the supply chain ecosystem.
                        </p>
                    </div>

                    <div className="goals-grid">
                        <div className="goal-card animate-on-scroll scale-in">
                            <div className="goal-icon">🏭</div>
                            <h3>Industrial Growth</h3>
                            <p>Supporting the "Made in Saudi" initiative by prioritizing local manufacturers and suppliers.</p>
                        </div>
                        <div className="goal-card animate-on-scroll scale-in delay-100">
                            <div className="goal-icon">🌐</div>
                            <h3>Digital Economy</h3>
                            <p>Accelerating digital transformation in the B2B sector through our advanced marketplace technology.</p>
                        </div>
                        <div className="goal-card animate-on-scroll scale-in delay-200">
                            <div className="goal-icon">📈</div>
                            <h3>SME Empowerment</h3>
                            <p>Providing small and medium enterprises with equal access to major projects and market opportunities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mega Projects */}
            <section className="mega-projects-section">
                <div className="container">
                    <div className="projects-content animate-on-scroll fade-in-up">
                        <h2>Supporting Giga-Projects</h2>
                        <p>SouqRoute's scalable infrastructure is designed to meet the massive supply chain demands of the Kingdom's giga-projects, ensuring timely delivery of materials and equipment.</p>
                        <div className="project-tags">
                            <span>NEOM</span>
                            <span>The Red Sea</span>
                            <span>Qiddiya</span>
                            <span>Roshn</span>
                            <span>Diriyah Gate</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Vision2030;
