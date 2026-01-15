import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './RegistrationForm.css';

function RegistrationForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        role: '',
        category: '',
        message: ''
    });

    const [submitStatus, setSubmitStatus] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. Store in localStorage (Backup)
            const existingData = JSON.parse(localStorage.getItem('souqroute_leads') || '[]');
            const newLead = {
                ...formData,
                id: Date.now(),
                timestamp: new Date().toISOString()
            };
            existingData.push(newLead);
            localStorage.setItem('souqroute_leads', JSON.stringify(existingData));

            // 2. Send to Supabase
            const { error } = await supabase
                .from('leads')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        company: formData.company,
                        phone: formData.phone,
                        role: formData.role,
                        category: formData.category,
                        message: formData.message
                    }
                ]);

            if (error) throw error;

            // Assume success
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                role: '',
                category: '',
                message: ''
            });

            // Show success message
            alert('Thank you! Your registration has been received. We will contact you soon.');

            setTimeout(() => setSubmitStatus(''), 3000);

        } catch (error) {
            console.error('Error:', error);
            setSubmitStatus('error');
            alert('An error occurred. Please try again. (Data saved offline)');
            setTimeout(() => setSubmitStatus(''), 3000);
        }
    };

    return (
        <div className="registration-form-container">
            <h3>Register Now</h3>
            <p>Join Saudi Arabia's Premier Industrial Platform</p>
            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@company.com"
                    />
                </div>

                <div className="form-row-compact">
                    <div className="form-group">
                        <label htmlFor="company">Company *</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            placeholder="Company Name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+966..."
                        />
                    </div>
                </div>

                <div className="form-row-compact">
                    <div className="form-group">
                        <label htmlFor="role">I am a *</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Role...</option>
                            <option value="buyer">Buyer/Purchaser</option>
                            <option value="supplier">Supplier/Vendor</option>
                            <option value="both">Both</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select Category...</option>
                            <option value="mep">MEP Equipment</option>
                            <option value="construction">Construction Materials</option>
                            <option value="electrical">Electrical Supplies</option>
                            <option value="industrial">Industrial Equipment</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message (Optional)</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your requirements..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary btn-block ${submitStatus}`}
                >
                    {submitStatus === 'success' ? '✓ Registered Successfully!' :
                        submitStatus === 'error' ? 'Error - Try Again' :
                            'Register Now'}
                </button>
            </form>
        </div>
    );
}

export default RegistrationForm;
