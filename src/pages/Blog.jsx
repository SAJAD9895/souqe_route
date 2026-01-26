import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { blogPosts } from '../data/blogData';
import '../styles/animations.css';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import './Blog.css';

function Blog() {
    useScrollAnimations();

    return (
        <div className="blog-page">
            <SEO
                title="Blog - Industrial Insights & News | SouqRoute"
                description="Stay updated with the latest insights on Saudi Arabia's industrial sector, Vision 2030, procurement best practices, and supply chain innovations."
                keywords="industrial blog, Saudi Arabia industry news, Vision 2030 updates, MEP insights, procurement tips, supply chain trends"
                url="https://souqroute.com/blog"
            />

            {/* Page Hero */}
            <section className="page-hero blog-hero">
                <div className="hero-image">
                    <img src="/images/blog-hero.png" alt="SouqRoute Blog" />
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="container">
                        <div className="hero-text">
                            <h1>Industry Insights & News</h1>
                            <p>Expert perspectives on Saudi Arabia's industrial transformation</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="blog-content">
                <div className="container">
                    <div className="blog-grid">
                        {blogPosts.map((post, index) => (
                            <article
                                key={post.id}
                                className={`blog-card animate-on-scroll scale-in delay-${index % 3}00`}
                            >
                                <div className="blog-image">
                                    <img src={post.image} alt={post.title} />
                                    <span className="blog-category">{post.category}</span>
                                </div>
                                <div className="blog-content-wrapper">
                                    <div className="blog-meta">
                                        <span className="blog-date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="blog-read-time">{post.readTime}</span>
                                    </div>
                                    <h2>{post.title}</h2>
                                    <p>{post.excerpt}</p>
                                    <Link to={`/blog/${post.slug}`} className="read-more">
                                        Read More →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="blog-cta">
                <div className="container">
                    <div className="cta-content animate-on-scroll fade-in-up">
                        <h2>Ready to Transform Your Supply Chain?</h2>
                        <p>Join SouqRoute and connect with verified suppliers across Saudi Arabia</p>
                        <Link to="/" className="btn btn-primary">Get Started</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Blog;
