import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Solutions from './pages/Solutions';
import Vision2030 from './pages/Vision2030';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Admin from './pages/Admin';
import SuppliersSaudiArabia from './pages/SuppliersSaudiArabia';
import SuppliesCompaniesSaudi from './pages/SuppliesCompaniesSaudi';
import WholesalerSupplierSaudi from './pages/WholesalerSupplierSaudi';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            // Default options
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1a202c',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              fontSize: '14px',
              fontWeight: '500',
            },
            // Success toast
            success: {
              duration: 4000,
              style: {
                background: '#10b981',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            // Error toast
            error: {
              duration: 4000,
              style: {
                background: '#ef4444',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
            // Loading toast
            loading: {
              style: {
                background: '#3b82f6',
                color: '#fff',
              },
            },
          }}
        />
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/vision-2030" element={<Vision2030 />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/supplier-in-saudi-arabia" element={<SuppliersSaudiArabia />} />
            <Route path="/supplies-companies-saudi-arabia" element={<SuppliesCompaniesSaudi />} />
            <Route path="/wholesaler-supplier-saudi-arabia" element={<WholesalerSupplierSaudi />} />
            <Route path="/souquerootadmin" element={<Admin />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}


export default App;

