import { useEffect, useState } from 'react';
import { findCategoryByName, listProductCategories, OTHER_CATEGORY, submitLead } from '../lib/leads';
import { MAX_IMAGE_BYTES, parseTagList, uploadProductImage } from '../lib/products';
import { PUBLIC_SUPABASE_ENV } from '../lib/supabaseClient';
import './RegistrationForm.css';
import toast from 'react-hot-toast';

const TOTAL_STEPS = 4;

const EMPTY_FORM = {
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
    message: '',
    // Step 4 — the product (required). Becomes a PENDING_REVIEW product in
    // the souqroute_panel (under a company built from this registration).
    productName: '',
    productCategory: '',
    // Used when productCategory === OTHER_CATEGORY.
    productCategoryOther: '',
    productDescription: '',
    productKeywords: ''
};

const EMPTY_IMAGES = { primary: null, secondary: null };

// Turns a Supabase/Postgres error into something a visitor can act on.
const describeSubmitError = (error) => {
    const message = error?.message || '';
    if (message.startsWith('INVALID_PRODUCT:') || message.startsWith('INVALID_LEAD:')) {
        return message.split(':').slice(1).join(':').trim();
    }
    // 23514 = check_violation: a field failed a length/format constraint.
    if (error?.code === '23514') {
        return 'Some details look invalid or too long. Please check your email and fields.';
    }
    return null;
};

function RegistrationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [productImages, setProductImages] = useState(EMPTY_IMAGES);
    // Bumped on reset so the uncontrolled file inputs are remounted (cleared).
    const [fileInputKey, setFileInputKey] = useState(0);
    const [categories, setCategories] = useState([]);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);

    const [submitStatus, setSubmitStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        const file = files?.[0] || null;
        if (file && !file.type.startsWith('image/')) {
            toast.error(`"${file.name}" is not an image.`);
            e.target.value = '';
            return;
        }
        if (file && file.size > MAX_IMAGE_BYTES) {
            toast.error(`"${file.name}" is larger than 5MB.`);
            e.target.value = '';
            return;
        }
        setProductImages((prev) => ({ ...prev, [name]: file }));
    };

    // Load the category dropdown the first time the visitor reaches step 4.
    useEffect(() => {
        if (currentStep !== 4 || categoriesLoaded) return;
        setCategoriesLoaded(true);
        listProductCategories(PUBLIC_SUPABASE_ENV)
            .then(setCategories)
            .catch((error) => {
                console.error('Could not load categories:', error);
                toast.error('Could not load product categories. Please try again later.');
            });
    }, [currentStep, categoriesLoaded]);

    // A typed "Other" category that already exists is filed under the existing
    // one instead (the RPC does the same check server-side).
    const isOtherCategory = formData.productCategory === OTHER_CATEGORY;
    const matchedCategory = isOtherCategory
        ? findCategoryByName(categories, formData.productCategoryOther)
        : null;

    const validateStep = (step) => {
        if (step === 1) {
            if (!formData.firstName) {
                toast.error('First name is required');
                return false;
            }
            if (!formData.lastName) {
                toast.error('Last name is required');
                return false;
            }
            if (!formData.email) {
                toast.error('Email is required');
                return false;
            }
            if (!formData.phone) {
                toast.error('Phone number is required');
                return false;
            }
            return true;
        }
        if (step === 2) {
            if (!formData.company) {
                toast.error('Company name is required');
                return false;
            }
            if (!formData.businessActivity) {
                toast.error('Business activity is required');
                return false;
            }
            return true;
        }
        if (step === 3) {
            if (!formData.city) {
                toast.error('City is required');
                return false;
            }
            if (!formData.country) {
                toast.error('Country is required');
                return false;
            }
            return true;
        }
        if (step === 4) {
            if (!formData.productName.trim()) {
                toast.error('Product name is required');
                return false;
            }
            if (!formData.productCategory) {
                toast.error('Please choose a product category');
                return false;
            }
            const otherName = formData.productCategoryOther.trim();
            if (isOtherCategory && (otherName.length < 2 || otherName.length > 80)) {
                toast.error('Please type your category name (2–80 characters)');
                return false;
            }
            return true;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
            toast.success('Step completed!');
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Enter in an earlier step's field advances instead of submitting.
        if (currentStep < TOTAL_STEPS) {
            nextStep();
            return;
        }

        if (isSubmitting || !validateStep(TOTAL_STEPS)) {
            return;
        }

        setIsSubmitting(true);

        // Show loading toast
        const loadingToast = toast.loading('Submitting your registration...');

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

            // 2. Upload the product's images, then build its payload.
            const [imagePrimaryUrl, imageSecondaryUrl] = await Promise.all([
                uploadProductImage(PUBLIC_SUPABASE_ENV, productImages.primary),
                uploadProductImage(PUBLIC_SUPABASE_ENV, productImages.secondary)
            ]);
            const product = {
                name: formData.productName.trim(),
                description: formData.productDescription.trim(),
                // Either an existing category, or a new name the RPC files under
                // a matching existing category or creates once.
                ...(isOtherCategory && !matchedCategory
                    ? { new_category_name: formData.productCategoryOther.trim() }
                    : { category_id: matchedCategory ? matchedCategory.id : formData.productCategory }),
                image_primary_url: imagePrimaryUrl,
                image_secondary_url: imageSecondaryUrl,
                search_keywords: parseTagList(formData.productKeywords)
            };

            // 3. Send to Supabase. The submit_website_lead RPC inserts the
            // lead and the product in one transaction.
            // Keys are snake_case to match supabase/website_leads.sql — keep
            // both in sync when adding a field.
            await submitLead(PUBLIC_SUPABASE_ENV, {
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim(),
                company: formData.company.trim(),
                business_activity: formData.businessActivity.trim(),
                brands_represented: formData.brands.trim(),
                phone: formData.phone.trim(),
                mobile_number: formData.mobile.trim(),
                email: formData.email.trim(),
                website: formData.website.trim(),
                office_no: formData.officeNo.trim(),
                building_name: formData.buildingName.trim(),
                street: formData.street.trim(),
                locality: formData.locality.trim(),
                po_box: formData.poBox.trim(),
                city: formData.city.trim(),
                country: formData.country.trim(),
                message: formData.message.trim()
            }, product);

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            // Show success toast
            toast.success('🎉 Registration successful! We will contact you soon.', {
                duration: 5000,
                icon: '✅',
            });

            // Reset form
            setSubmitStatus('success');
            setTimeout(() => {
                setSubmitStatus('');
                setCurrentStep(1); // Reset to start
                setFormData(EMPTY_FORM);
                setProductImages(EMPTY_IMAGES);
                setFileInputKey((key) => key + 1);
            }, 1000);


        } catch (error) {
            console.error('Error:', error);

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            // Show error toast
            const reason = describeSubmitError(error);
            toast.error(
                reason
                    ? `${reason} (Data saved offline)`
                    : 'Failed to submit. Please try again. (Data saved offline)',
                { duration: 5000 }
            );

            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
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
                <div className="step-line"></div>
                <div className={`step-item ${currentStep >= 4 ? 'active' : ''}`}>
                    <div className="step-number">4</div>
                    <span>Product</span>
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
                                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} maxLength={100} required placeholder="First Name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name *</label>
                                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} maxLength={100} required placeholder="Last Name" />
                            </div>
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} maxLength={254} required placeholder="email@example.com" />
                            </div>
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} maxLength={40} required placeholder="+966..." />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mobile">Mobile Number</label>
                                <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} maxLength={40} placeholder="+966..." />
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
                            <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} maxLength={200} required placeholder="Company Name" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="businessActivity">Business Activity *</label>
                            <input type="text" id="businessActivity" name="businessActivity" value={formData.businessActivity} onChange={handleChange} maxLength={200} required placeholder="e.g. Construction, MEP, Trading" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="brands">Brands You Represent</label>
                            <input type="text" id="brands" name="brands" value={formData.brands} onChange={handleChange} maxLength={500} placeholder="e.g. 3M, Bosch (Optional)" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="website">Website</label>
                            <input type="url" id="website" name="website" value={formData.website} onChange={handleChange} maxLength={300} placeholder="https://..." />
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
                                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} maxLength={100} required placeholder="Riyadh" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Country *</label>
                                <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} maxLength={100} required placeholder="Saudi Arabia" />
                            </div>
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="officeNo">Office No</label>
                                <input type="text" id="officeNo" name="officeNo" value={formData.officeNo} onChange={handleChange} maxLength={100} placeholder="Optional" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="buildingName">Building Name</label>
                                <input type="text" id="buildingName" name="buildingName" value={formData.buildingName} onChange={handleChange} maxLength={200} placeholder="Optional" />
                            </div>
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="street">Street</label>
                                <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} maxLength={200} placeholder="Optional" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="locality">Locality</label>
                                <input type="text" id="locality" name="locality" value={formData.locality} onChange={handleChange} maxLength={200} placeholder="Optional" />
                            </div>
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="poBox">P.O. Box</label>
                                <input type="text" id="poBox" name="poBox" value={formData.poBox} onChange={handleChange} maxLength={50} placeholder="Optional" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Note (Optional)</label>
                            <textarea id="message" name="message" rows="2" value={formData.message} onChange={handleChange} maxLength={2000} placeholder="Any additional info..."></textarea>
                        </div>
                    </div>
                )}

                {/* Step 4: Product (required) */}
                {currentStep === 4 && (
                    <div className="form-step fade-in">
                        <h4 className="form-section-title">Your Product</h4>
                        <p className="product-opt-in-hint">Tell us about a product you supply. Our team reviews it before it is listed.</p>

                        <div className="form-group">
                            <label htmlFor="productName">Product Name *</label>
                            <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleChange} maxLength={200} placeholder="e.g. 3-Core Copper Cable 4mm" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="productCategory">Category *</label>
                            <select id="productCategory" name="productCategory" value={formData.productCategory} onChange={handleChange}>
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.label}</option>
                                ))}
                                <option value={OTHER_CATEGORY}>Other (not listed)…</option>
                            </select>
                        </div>

                        {isOtherCategory && (
                            <div className="form-group">
                                <label htmlFor="productCategoryOther">Your Category *</label>
                                <input type="text" id="productCategoryOther" name="productCategoryOther" value={formData.productCategoryOther} onChange={handleChange} maxLength={80} placeholder="e.g. Fire Fighting Equipment" autoFocus />
                                {matchedCategory ? (
                                    <p className="product-opt-in-hint category-match">
                                        &ldquo;{matchedCategory.label}&rdquo; already exists — your product will be listed under it.
                                    </p>
                                ) : formData.productCategoryOther.trim().length >= 2 && (
                                    <p className="product-opt-in-hint">This will be added as a new category.</p>
                                )}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="productDescription">Description</label>
                            <textarea id="productDescription" name="productDescription" rows="2" value={formData.productDescription} onChange={handleChange} maxLength={2000} placeholder="Specs, sizes, certifications..."></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="productKeywords">Keywords</label>
                            <input type="text" id="productKeywords" name="productKeywords" value={formData.productKeywords} onChange={handleChange} maxLength={500} placeholder="cable, copper, 3-core (comma separated)" />
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group">
                                <label htmlFor="productImagePrimary">Main Image</label>
                                <input key={`primary-${fileInputKey}`} type="file" id="productImagePrimary" name="primary" accept="image/*" onChange={handleImageChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="productImageSecondary">Second Image</label>
                                <input key={`secondary-${fileInputKey}`} type="file" id="productImageSecondary" name="secondary" accept="image/*" onChange={handleImageChange} />
                            </div>
                        </div>
                        <p className="product-opt-in-hint">Images up to 5MB each.</p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="form-navigation">
                    {currentStep > 1 && (
                        <button type="button" className="btn btn-outline" onClick={prevStep}>
                            Back
                        </button>
                    )}

                    {/* Distinct keys are load-bearing: without them React reuses one
                        <button> for both, flips it to type="submit" mid-click when
                        Continue reaches the last step, and the browser then submits
                        the form from that same click. */}
                    {currentStep < TOTAL_STEPS ? (
                        <button key="continue" type="button" className="btn btn-primary" onClick={nextStep} style={{ flex: 1 }}>
                            Continue
                        </button>
                    ) : (
                        <button
                            key="submit"
                            type="submit"
                            className={`btn btn-primary ${submitStatus}`}
                            style={{ flex: 1 }}
                            disabled={isSubmitting}
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
