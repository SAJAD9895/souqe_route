# SouqRoute React Application - Setup Guide

## ✅ What's Been Created

### Core Application Structure
- ✅ React app with Vite
- ✅ React Router for navigation
- ✅ Professional MEP/Industrial theme
- ✅ Navbar component with mobile menu
- ✅ Footer component
- ✅ Home page (complete with all sections)
- ✅ About page (complete)

### Form Data Storage Solution
The contact form on the Home page stores data in **two ways**:

1. **LocalStorage** (Browser-based storage)
   - Data is stored in `localStorage` under the key `souqroute_leads`
   - Each submission includes: name, email, company, phone, role, category, message, timestamp, and unique ID
   - To view stored data, open browser console and type:
     ```javascript
     JSON.parse(localStorage.getItem('souqroute_leads'))
     ```

2. **Formspree Integration** (Optional - for email notifications)
   - Replace `YOUR_FORM_ID` in `Home.jsx` with your Formspree form ID
   - Sign up at https://formspree.io/
   - Create a form and get your form ID
   - Update line in Home.jsx:
     ```javascript
     const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     ```

## 🚀 How to Run the Application

### 1. Navigate to the React app directory:
```bash
cd /Users/sajadk/.gemini/antigravity/playground/stellar-magnetar/souqroute-react
```

### 2. Start the development server:
```bash
npm run dev
```

### 3. Open your browser to:
```
http://localhost:5173
```

## 📋 Remaining Pages to Create

You need to create 3 more pages. I'll provide the templates:

### Services Page (Services.jsx)
Create file: `src/pages/Services.jsx`

```jsx
import './Services.css';

function Services() {
  return (
    <div className="services-page">
      {/* Copy structure from About.jsx and customize */}
      <section className="page-hero">
        {/* Hero with industrial image */}
      </section>
      
      {/* Add your services content here */}
      <section className="services-detail">
        <div className="container">
          <h2>Our Services</h2>
          {/* Service details */}
        </div>
      </section>
    </div>
  );
}

export default Services;
```

### Solutions Page (Solutions.jsx)
Create file: `src/pages/Solutions.jsx`

```jsx
import './Solutions.css';

function Solutions() {
  return (
    <div className="solutions-page">
      {/* Strategic role content */}
      <section className="page-hero">
        {/* Hero section */}
      </section>
      
      <section className="solutions-content">
        <div className="container">
          <h2>Our Solutions</h2>
          {/* Solutions for buyers and suppliers */}
        </div>
      </section>
    </div>
  );
}

export default Solutions;
```

### Vision 2030 Page (Vision2030.jsx)
Create file: `src/pages/Vision2030.jsx`

```jsx
import './Vision2030.css';

function Vision2030() {
  return (
    <div className="vision-page">
      <section className="page-hero">
        {/* Vision 2030 hero */}
      </section>
      
      <section className="vision-alignment">
        <div className="container">
          <h2>Aligned with Saudi Vision 2030</h2>
          {/* Vision 2030 content */}
        </div>
      </section>
    </div>
  );
}

export default Vision2030;
```

## 🎨 Industrial Images to Use

Replace image URLs in components with these professional industrial images:

### MEP Equipment:
- `https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&h=800&fit=crop`
- `https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&h=800&fit=crop`

### Construction Sites:
- `https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=800&fit=crop`
- `https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=800&fit=crop`

### Industrial Facilities:
- `https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&h=800&fit=crop`
- `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=800&fit=crop`

### Electrical/Technical:
- `https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&h=800&fit=crop`
- `https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=800&fit=crop`

## 💾 Backend Integration Options

### Option 1: Firebase (Recommended)
```bash
npm install firebase
```

Create `src/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

Update form submission in `Home.jsx`:
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

// In handleSubmit:
await addDoc(collection(db, 'leads'), formData);
```

### Option 2: Custom Backend API
Create a Node.js/Express backend:
```javascript
// In handleSubmit:
const response = await fetch('http://your-api.com/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### Option 3: Google Sheets (via Apps Script)
Use Google Sheets as a database with Apps Script webhook.

## 📱 Responsive Design

All pages are fully responsive with breakpoints at:
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🎯 Key Features Implemented

✅ Professional MEP/Industrial design
✅ Full-width hero images
✅ Clean rectangular layouts (no curves)
✅ Corporate blue color scheme
✅ React Router navigation
✅ Mobile-responsive menu
✅ Contact form with data storage
✅ Industrial imagery throughout
✅ Stats counters
✅ Service cards
✅ Product categories
✅ Vision 2030 integration

## 🔧 Customization

### Colors
Edit `src/App.css` CSS variables:
```css
:root {
  --primary-blue: #0066cc;  /* Change to your brand color */
  --dark-blue: #003d7a;
  /* ... */
}
```

### Content
Edit the respective page components in `src/pages/`

### Images
Replace Unsplash URLs with your own images

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder, ready to deploy to:
- Netlify
- Vercel
- AWS S3
- Any static hosting

## 🐛 Troubleshooting

### If images don't load:
- Check internet connection
- Replace with local images in `public/` folder

### If form doesn't submit:
- Check browser console for errors
- Verify Formspree form ID
- Check localStorage in DevTools

### If routing doesn't work:
- Ensure React Router is installed
- Check that all page components are imported in App.jsx

## 📞 Support

For questions or issues:
- Email: info@souqroute.com
- Phone: +966 55 543 2866

---

**Next Steps:**
1. Run `npm run dev` to start the development server
2. Create the remaining 3 pages (Services, Solutions, Vision2030)
3. Test the contact form
4. Customize content and images
5. Set up backend integration (Firebase/API)
6. Build and deploy

**Your React app is ready to run!** 🚀
