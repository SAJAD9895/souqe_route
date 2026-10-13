import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
    createCategory,
    createProduct,
    deleteProduct,
    formatTagList,
    listCategories,
    listProducts,
    parseHashtagList,
    parseTagList,
    updateProduct,
    uploadProductImage
} from '../lib/products';
import { getSupabaseEnv } from '../lib/supabaseClient';
import './ProductManager.css';

const EMPTY_FORM = {
    name: '',
    description: '',
    categoryId: '',
    keywords: '',
    hashtags: ''
};

// One upload slot. Shows a preview of either a newly picked File or the
// image already stored on the product being edited.
function ImageSlot({ id, label, file, existingUrl, onPick, onClear }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return undefined;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const shown = preview || existingUrl;

    const handleClear = () => {
        if (inputRef.current) inputRef.current.value = '';
        onClear();
    };

    return (
        <div className="product-image-slot">
            <label htmlFor={id}>{label}</label>
            {shown ? (
                <div className="product-image-preview">
                    <img src={shown} alt={label} />
                    <button type="button" onClick={handleClear} title="Remove image">
                        Remove
                    </button>
                </div>
            ) : (
                <div className="product-image-empty">No image selected</div>
            )}
            <input
                ref={inputRef}
                id={id}
                type="file"
                accept="image/*"
                onChange={(e) => onPick(e.target.files?.[0] || null)}
            />
        </div>
    );
}

function ProductManager({ env }) {
    const [view, setView] = useState('add');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [primaryFile, setPrimaryFile] = useState(null);
    const [secondaryFile, setSecondaryFile] = useState(null);
    const [existingImages, setExistingImages] = useState({ primary: null, secondary: null });

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [addingCategory, setAddingCategory] = useState(false);

    const [search, setSearch] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const envLabel = useMemo(() => getSupabaseEnv(env).label, [env]);

    // Match on PostgREST error codes rather than message text, so a missing
    // table and a missing foreign-key relationship don't get reported as the
    // same problem — they need different fixes.
    const describeError = (error) => {
        const message = error?.message || 'Something went wrong.';
        const setupHint = `Run supabase/product_catalog.sql on ${envLabel} (Supabase dashboard → SQL Editor).`;

        switch (error?.code) {
            case 'PGRST205': // table not in schema cache
            case '42P01': // relation does not exist
                return `The catalog tables don't exist in ${envLabel} yet. ${setupHint}`;
            case 'PGRST200': // no relationship between the two tables
                return `catalog_products and catalog_categories aren't linked in ${envLabel}. ${setupHint}`;
            case '42703': // column does not exist
                return `A catalog column is missing in ${envLabel} — the tables exist but are the wrong shape. ${setupHint}`;
            case '42501': // insufficient privilege
                return `${envLabel} rejected that write (row-level security). Check the policies in supabase/product_catalog.sql.`;
            default:
                break;
        }

        if (/bucket/i.test(message) && /not found/i.test(message)) {
            return `The product_images bucket is missing in ${envLabel}. ${setupHint}`;
        }
        return message;
    };

    const loadCategories = useCallback(async () => {
        try {
            setCategories(await listCategories(env));
        } catch (error) {
            console.error('Error loading categories:', error);
            toast.error(describeError(error));
        }
        // describeError is derived from env; re-creating it per env is intended.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [env]);

    const loadProducts = useCallback(async (term) => {
        setLoading(true);
        try {
            setProducts(await listProducts(env, { search: term }));
        } catch (error) {
            console.error('Error loading products:', error);
            toast.error(describeError(error));
            setProducts([]);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [env]);

    // Switching environment means a different database — reset everything.
    useEffect(() => {
        setProducts([]);
        setCategories([]);
        setSearch('');
        setAppliedSearch('');
        resetForm();
        loadCategories();
        loadProducts('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [env]);

    function resetForm() {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setPrimaryFile(null);
        setSecondaryFile(null);
        setExistingImages({ primary: null, secondary: null });
        setShowAddCategory(false);
        setNewCategory('');
    }

    const handleField = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleAddCategory = async () => {
        const name = newCategory.trim();
        if (!name) {
            toast.error('Enter a category name.');
            return;
        }

        setAddingCategory(true);
        try {
            const created = await createCategory(env, name);
            setCategories((prev) =>
                [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
            );
            setForm((prev) => ({ ...prev, categoryId: created.id }));
            setNewCategory('');
            setShowAddCategory(false);
            toast.success(`Category "${created.name}" added.`);
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error(describeError(error));
        } finally {
            setAddingCategory(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error('Product name is required.');
            return;
        }

        setSaving(true);
        try {
            // Upload only the slots that got a new file; keep existing URLs otherwise.
            const [primaryUrl, secondaryUrl] = await Promise.all([
                primaryFile ? uploadProductImage(env, primaryFile) : existingImages.primary,
                secondaryFile ? uploadProductImage(env, secondaryFile) : existingImages.secondary
            ]);

            const payload = {
                name: form.name.trim(),
                description: form.description.trim() || null,
                category_id: form.categoryId || null,
                image_primary_url: primaryUrl,
                image_secondary_url: secondaryUrl,
                search_keywords: parseTagList(form.keywords),
                hashtags: parseHashtagList(form.hashtags)
            };

            if (editingId) {
                await updateProduct(env, editingId, payload);
                toast.success(`"${payload.name}" updated in ${envLabel}.`);
            } else {
                await createProduct(env, payload);
                toast.success(`"${payload.name}" added to ${envLabel}.`);
            }

            resetForm();
            loadProducts(appliedSearch);
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(describeError(error));
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (product) => {
        setForm({
            name: product.name || '',
            description: product.description || '',
            categoryId: product.category_id || '',
            keywords: formatTagList(product.search_keywords),
            hashtags: formatTagList(product.hashtags)
        });
        setEditingId(product.id);
        setPrimaryFile(null);
        setSecondaryFile(null);
        setExistingImages({
            primary: product.image_primary_url || null,
            secondary: product.image_secondary_url || null
        });
        setView('add');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setAppliedSearch(search);
        loadProducts(search);
    };

    const handleClearSearch = () => {
        setSearch('');
        setAppliedSearch('');
        loadProducts('');
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteProduct(env, deleteTarget);
            setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
            toast.success(`"${deleteTarget.name}" deleted.`);
            if (editingId === deleteTarget.id) resetForm();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error(describeError(error));
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className="product-manager">
            <div className="product-view-toggle">
                <button
                    type="button"
                    className={view === 'add' ? 'active' : ''}
                    onClick={() => setView('add')}
                >
                    {editingId ? 'Edit Product' : 'Add Product'}
                </button>
                <button
                    type="button"
                    className={view === 'manage' ? 'active' : ''}
                    onClick={() => setView('manage')}
                >
                    Manage Products ({products.length})
                </button>
            </div>

            {view === 'add' && (
                <form className="product-form" onSubmit={handleSubmit}>
                    {editingId && (
                        <div className="product-editing-banner">
                            Editing an existing product.
                            <button type="button" onClick={resetForm}>Cancel edit</button>
                        </div>
                    )}

                    <div className="product-form-group">
                        <label htmlFor="productName">Product Name *</label>
                        <input
                            id="productName"
                            type="text"
                            value={form.name}
                            onChange={handleField('name')}
                            placeholder="e.g. 3-Core Armoured Copper Cable"
                            required
                        />
                    </div>

                    <div className="product-form-group">
                        <label htmlFor="productDescription">Description</label>
                        <textarea
                            id="productDescription"
                            rows={4}
                            value={form.description}
                            onChange={handleField('description')}
                            placeholder="Specifications, sizes, certifications…"
                        />
                    </div>

                    <div className="product-form-group">
                        <label htmlFor="productCategory">Category</label>
                        <div className="product-category-row">
                            <select
                                id="productCategory"
                                value={form.categoryId}
                                onChange={handleField('categoryId')}
                            >
                                <option value="">— Select a category —</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="product-add-category-btn"
                                onClick={() => setShowAddCategory((prev) => !prev)}
                            >
                                {showAddCategory ? 'Close' : '+ Add'}
                            </button>
                        </div>

                        {showAddCategory && (
                            <div className="product-new-category">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="e.g. Electrical Cable Accessories"
                                    onKeyDown={(e) => {
                                        // Enter must not submit the outer product form.
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCategory();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    disabled={addingCategory}
                                >
                                    {addingCategory ? 'Adding…' : 'Save Category'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="product-image-row">
                        <ImageSlot
                            id="productImage1"
                            label="Image 1"
                            file={primaryFile}
                            existingUrl={existingImages.primary}
                            onPick={setPrimaryFile}
                            onClear={() => {
                                setPrimaryFile(null);
                                setExistingImages((prev) => ({ ...prev, primary: null }));
                            }}
                        />
                        <ImageSlot
                            id="productImage2"
                            label="Image 2"
                            file={secondaryFile}
                            existingUrl={existingImages.secondary}
                            onPick={setSecondaryFile}
                            onClear={() => {
                                setSecondaryFile(null);
                                setExistingImages((prev) => ({ ...prev, secondary: null }));
                            }}
                        />
                    </div>

                    <div className="product-form-group">
                        <label htmlFor="productKeywords">Search Keywords</label>
                        <input
                            id="productKeywords"
                            type="text"
                            value={form.keywords}
                            onChange={handleField('keywords')}
                            placeholder="cable, copper, armoured, 3 core"
                        />
                        <p className="product-hint">
                            Comma separated. Searched alongside the name and description.
                        </p>
                    </div>

                    <div className="product-form-group">
                        <label htmlFor="productHashtags">Hashtags</label>
                        <input
                            id="productHashtags"
                            type="text"
                            value={form.hashtags}
                            onChange={handleField('hashtags')}
                            placeholder="#electrical, #mep"
                        />
                        <p className="product-hint">
                            Optional, comma separated. The leading # is stored stripped.
                        </p>
                    </div>

                    <button type="submit" className="product-submit-btn" disabled={saving}>
                        {saving
                            ? 'Saving…'
                            : editingId
                                ? 'Update Product'
                                : `Add Product to ${envLabel}`}
                    </button>
                </form>
            )}

            {view === 'manage' && (
                <div className="product-manage">
                    <form className="product-search" onSubmit={handleSearch}>
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, description, keywords or hashtags…"
                        />
                        <button type="submit">Search</button>
                        {appliedSearch && (
                            <button type="button" onClick={handleClearSearch}>
                                Clear
                            </button>
                        )}
                    </form>

                    {appliedSearch && !loading && (
                        <p className="product-hint">
                            {products.length} result{products.length === 1 ? '' : 's'} for
                            {' '}<strong>{appliedSearch}</strong>
                        </p>
                    )}

                    {loading ? (
                        <div className="product-empty">Loading products…</div>
                    ) : products.length === 0 ? (
                        <div className="product-empty">
                            {appliedSearch
                                ? 'No products match that search.'
                                : `No products in ${envLabel} yet.`}
                        </div>
                    ) : (
                        <div className="product-grid">
                            {products.map((product) => (
                                <div className="product-card" key={product.id}>
                                    <div className="product-card-image">
                                        {product.image_primary_url ? (
                                            <img
                                                src={product.image_primary_url}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <span>No image</span>
                                        )}
                                    </div>
                                    <div className="product-card-body">
                                        <h3>{product.name}</h3>
                                        {product.category?.name && (
                                            <span className="product-card-category">
                                                {product.category.name}
                                            </span>
                                        )}
                                        {product.description && (
                                            <p className="product-card-description">
                                                {product.description}
                                            </p>
                                        )}
                                        {product.search_keywords?.length > 0 && (
                                            <p className="product-card-tags">
                                                {formatTagList(product.search_keywords)}
                                            </p>
                                        )}
                                        {product.hashtags?.length > 0 && (
                                            <p className="product-card-hashtags">
                                                {product.hashtags
                                                    .map((tag) => `#${tag}`)
                                                    .join(' ')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="product-card-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="danger"
                                            onClick={() => setDeleteTarget(product)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {deleteTarget && (
                <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Confirm Delete</h2>
                        </div>
                        <div className="modal-body">
                            <p>
                                Delete <strong>{deleteTarget.name}</strong> from{' '}
                                <strong>{envLabel}</strong>?
                            </p>
                            <p className="warning-text">
                                This also removes its images and cannot be undone.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </button>
                            <button className="btn-delete" onClick={handleConfirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductManager;
