import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './RegistrationForm.css';

function RegistrationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        company: '',
        businessActivity: '',
        brands: '',
        phone: '',
        mobile: '',
        email: '',
        website: '',
        officeNo: '',
        buildingName: '',
        street: '',
        locality: '',
        poBox: '',
        city: '',
        country: '',
        message: ''
    });

    const [submitStatus, setSubmitStatus] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateStep = (step) => {
        if (step === 1) {
            return formData.firstName && formData.lastName && formData.email && formData.phone;
        }
        if (step === 2) {
            return formData.company && formData.businessActivity;
        }
        if (step === 3) {
            return formData.city && formData.country;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        } else {
            alert('Please fill in all required fields marked with *');
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(3)) {
            alert('Please fill in all required fields marked with *');
            return;
        }

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
            // Note: Ensure your Supabase table has these columns created!
            const { error } = await supabase
                .from('leads')
                .insert([
                    {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        company: formData.company,
                        business_activity: formData.businessActivity,
                        brands_represented: formData.brands,
                        phone: formData.phone,
                        mobile_number: formData.mobile,
                        email: formData.email,
                        website: formData.website,
                        office_no: formData.officeNo,
                        building_name: formData.buildingName,
                        street: formData.street,
                        locality: formData.locality,
                        po_box: formData.poBox,
                        city: formData.city,
                        country: formData.country,
                        message: formData.message
                    }
                ]);

            if (error) throw error;

            // Assume success
            setSubmitStatus('success');
            setTimeout(() => {
                setSubmitStatus('');
                setCurrentStep(1); // Reset to start
                setFormData({
                    firstName: '',
                    lastName: '',
                    company: '',
                    businessActivity: '',
                    brands: '',
                    phone: '',
                    mobile: '',
                    email: '',
                    website: '',
                    officeNo: '',
                    buildingName: '',
                    street: '',
                    locality: '',
                    poBox: '',
                    city: '',
                    country: '',
                    message: ''
                });
                alert('Thank you! Your registration has been received. We will contact you soon.');
            }, 1000);


        } catch (error) {
            console.error('Error:', error);
            setSubmitStatus('error');
            alert('An error occurred. Please try again. (Data saved offline)');
        }
    };

    return (
        <div className="registration-form-container">
            <h3>Register Now</h3>
            <p>Join Saudi Arabia's Premier Industrial Platform</p>

            {/* Progress Indicator */}
            <div className="step-indicator-container">
                <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <span>Personal</span>
                </div>
                <div className="step-line"></div>
                <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <span>Company</span>
                </div>
                <div className="step-line"></div>
                <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <span>Address</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="registration-form">

                {/* Step 1: Personal Details */}
                {currentStep === 1 && (
                    <div className="form-step fade-in">
                        <h4 className="form-section-title">Personal Details</h4>
                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name *</label>
                                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First Name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name *</label>
                                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last Name" />
                            </div>
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
                            </div>
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+966..." />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mobile">Mobile Number</label>
                                <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+966..." />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Company Details */}
                {currentStep === 2 && (
                    <div className="form-step fade-in">
                        <h4 className="form-section-title">Company Details</h4>
                        <div className="form-group">
                            <label htmlFor="company">Company Name *</label>
                            <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required placeholder="Company Name" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="businessActivity">Business Activity *</label>
                            <input type="text" id="businessActivity" name="businessActivity" value={formData.businessActivity} onChange={handleChange} required placeholder="e.g. Construction, MEP, Trading" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="brands">Brands You Represent</label>
                            <input type="text" id="brands" name="brands" value={formData.brands} onChange={handleChange} placeholder="e.g. 3M, Bosch (Optional)" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="website">Website</label>
                            <input type="url" id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
                        </div>
                    </div>
                )}

                {/* Step 3: Address & Info */}
                {currentStep === 3 && (
                    <div className="form-step fade-in">
                        <h4 className="form-section-title">Address Details</h4>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="city">City *</label>
                                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="Riyadh" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Country *</label>
                                <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} required placeholder="Saudi Arabia" />
                            </div>
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="officeNo">Office No</label>
                                <input type="text" id="officeNo" name="officeNo" value={formData.officeNo} onChange={handleChange} placeholder="Optional" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="buildingName">Building Name</label>
                                <input type="text" id="buildingName" name="buildingName" value={formData.buildingName} onChange={handleChange} placeholder="Optional" />
                            </div>
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="street">Street</label>
                                <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} placeholder="Optional" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="locality">Locality</label>
                                <input type="text" id="locality" name="locality" value={formData.locality} onChange={handleChange} placeholder="Optional" />
                            </div>
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="poBox">P.O. Box</label>
                                <input type="text" id="poBox" name="poBox" value={formData.poBox} onChange={handleChange} placeholder="Optional" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Note (Optional)</label>
                            <textarea id="message" name="message" rows="2" value={formData.message} onChange={handleChange} placeholder="Any additional info..."></textarea>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="form-navigation">
                    {currentStep > 1 && (
                        <button type="button" className="btn btn-outline" onClick={prevStep}>
                            Back
                        </button>
                    )}

                    {currentStep < 3 ? (
                        <button type="button" className="btn btn-primary" onClick={nextStep} style={{ flex: 1 }}>
                            Continue
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className={`btn btn-primary ${submitStatus}`}
                            style={{ flex: 1 }}
                        >
                            {submitStatus === 'success' ? '✓ Submitted' :
                                submitStatus === 'error' ? 'Retry' :
                                    'Complete Registration'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default RegistrationForm;
