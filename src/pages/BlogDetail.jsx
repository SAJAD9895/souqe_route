import { useParams, Link, Navigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { getBlogPost } from '../data/blogData';
import '../styles/animations.css';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import './BlogDetail.css';

function BlogDetail() {
    useScrollAnimations();
    const { slug } = useParams();
    const post = getBlogPost(slug);

    // If post not found, redirect to blog page
    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <div className="blog-detail-page">
            <SEO
                title={`${post.title} | SouqRoute Blog`}
                description={post.excerpt}
                keywords={`${post.category}, Saudi Arabia, industrial sector, ${post.title}`}
                url={`https://souqroute.com/blog/${post.slug}`}
                image={`https://souqroute.com${post.image}`}
                type="article"
            />

            {/* Hero Section */}
            <section className="blog-detail-hero">
                <div className="hero-image-wrapper">
                    <img src={post.image} alt={post.title} />
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="container">
                        <div className="breadcrumb animate-on-scroll fade-in-up">
                            <Link to="/">Home</Link> / <Link to="/blog">Blog</Link> / <span>{post.category}</span>
                        </div>
                        <span className="category-badge animate-on-scroll fade-in-up delay-100">{post.category}</span>
                        <h1 className="animate-on-scroll fade-in-up delay-200">{post.title}</h1>
                        <div className="post-meta animate-on-scroll fade-in-up delay-300">
                            <span className="author">By {post.author}</span>
                            <span className="separator">•</span>
                            <span className="date">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            <span className="separator">•</span>
                            <span className="read-time">{post.readTime}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="blog-content-section">
                <div className="container">
                    <div className="content-wrapper">
                        <article className="blog-article animate-on-scroll fade-in-up">
                            <div
                                className="article-content"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </article>

                        {/* Share Section */}
                        <div className="share-section animate-on-scroll fade-in-up">
                            <h3>Share this article</h3>
                            <div className="share-buttons">
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=https://souqroute.com/blog/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-btn linkedin"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?url=https://souqroute.com/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-btn twitter"
                                >
                                    Twitter
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=https://souqroute.com/blog/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-btn facebook"
                                >
                                    Facebook
                                </a>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="article-cta animate-on-scroll scale-in">
                            <h3>Ready to Transform Your Supply Chain?</h3>
                            <p>Join SouqRoute and connect with verified suppliers across Saudi Arabia</p>
                            <Link to="/" className="btn btn-primary">Get Started</Link>
                        </div>

                        {/* Back to Blog */}
                        <div className="back-to-blog animate-on-scroll fade-in-up">
                            <Link to="/blog" className="back-link">
                                ← Back to All Articles
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BlogDetail;
