import { Helmet } from 'react-helmet-async';

export const SEO = ({
    title = 'SouqRoute - Saudi Arabia\'s Premier Industrial Supply Chain Platform',
    description = 'SouqRoute connects verified suppliers with buyers across MEP, construction, electrical, and industrial equipment sectors in Saudi Arabia. Supporting Vision 2030.',
    keywords = 'Saudi Arabia, industrial supply chain, MEP suppliers, construction materials, electrical supplies, Vision 2030, B2B marketplace, verified suppliers, industrial procurement',
    image = 'https://souqroute.com/images/og-image.png',
    url = 'https://souqroute.com',
    type = 'website'
}) => {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="SouqRoute" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <meta name="author" content="SouqRoute" />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* Geo Tags for Saudi Arabia */}
            <meta name="geo.region" content="SA" />
            <meta name="geo.placename" content="Saudi Arabia" />

            {/* Schema.org for Google */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "SouqRoute",
                    "description": description,
                    "url": "https://souqroute.com",
                    "logo": "https://souqroute.com/images/logo.png",
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "email": "info@souqroute.com",
                        "contactType": "Customer Service",
                        "areaServed": "SA"
                    },
                    "sameAs": [
                        "https://www.linkedin.com/company/souqroute",
                        "https://twitter.com/souqroute"
                    ]
                })}
            </script>
        </Helmet>
    );
};
