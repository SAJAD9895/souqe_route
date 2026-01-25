# Sitemap Configuration

## 📍 Sitemap Location
`/sitemap.xml`

## 🗺️ All Routes Included

### 1. **Home Page**
- **URL**: `https://souqroute.com/`
- **Priority**: 1.0 (Highest)
- **Change Frequency**: Daily
- **Description**: Main landing page with registration form

### 2. **About Page**
- **URL**: `https://souqroute.com/about`
- **Priority**: 0.8
- **Change Frequency**: Monthly
- **Description**: Company information, mission, vision, and values

### 3. **Services Page**
- **URL**: `https://souqroute.com/services`
- **Priority**: 0.8
- **Change Frequency**: Monthly
- **Description**: Detailed services offered

### 4. **Solutions Page**
- **URL**: `https://souqroute.com/solutions`
- **Priority**: 0.8
- **Change Frequency**: Monthly
- **Description**: Strategic solutions for buyers and suppliers

### 5. **Vision 2030 Page**
- **URL**: `https://souqroute.com/vision-2030`
- **Priority**: 0.7
- **Change Frequency**: Monthly
- **Description**: Alignment with Saudi Vision 2030

## 📊 Priority Levels Explained

- **1.0** - Home page (most important)
- **0.8** - Main content pages (About, Services, Solutions)
- **0.7** - Supporting pages (Vision 2030)

## 🔄 Change Frequencies

- **Daily** - Home page (frequently updated with new leads)
- **Monthly** - Content pages (updated occasionally)

## 🚀 SEO Benefits

1. **Better Indexing** - Search engines can easily discover all pages
2. **Crawl Efficiency** - Helps search bots prioritize important pages
3. **Update Notifications** - `lastmod` tells when pages were last updated
4. **Priority Signals** - Indicates which pages are most important

## 📝 How to Submit Sitemap

### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (souqroute.com)
3. Go to "Sitemaps" in the left menu
4. Enter: `https://souqroute.com/sitemap.xml`
5. Click "Submit"

### Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Go to "Sitemaps"
4. Submit: `https://souqroute.com/sitemap.xml`

### robots.txt
Add this line to your `robots.txt`:
```
Sitemap: https://souqroute.com/sitemap.xml
```

## 🔧 Updating the Sitemap

When you add new pages, update the sitemap with:

```xml
<url>
  <loc>https://souqroute.com/new-page</loc>
  <lastmod>YYYY-MM-DDTHH:MM:SS+00:00</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

## ✅ Validation

Validate your sitemap at:
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- Google Search Console (after submission)

---

**Your sitemap is now complete and SEO-optimized!** 🎉
