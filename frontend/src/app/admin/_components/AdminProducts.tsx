'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2, X, Upload, ImagePlus, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Product {
  _id: string; name: string; price: number; discountPrice?: number;
  stock: number; isActive: boolean; isFeatured: boolean; isNewArrival: boolean;
  isBestSeller: boolean; category?: { _id: string; name: string };
  images?: { url: string }[]; SKU?: string; createdAt: string;
  material?: string; stone?: string; weight?: string; color?: string;
  description?: string; shortDescription?: string; slug?: string;
}
interface Category { _id: string; name: string; slug: string; }

const EMPTY_FORM = {
  name: '', slug: '', shortDescription: '', description: '', price: '',
  discountPrice: '', stock: '', SKU: '', material: '', stone: '',
  weight: '', color: '', category: '',
  isFeatured: false, isBestSeller: false, isNewArrival: false, isActive: true,
};

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; publicId: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products/admin/all');
      setProducts(data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories || []);
    } catch { /* silent */ }
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm({ ...EMPTY_FORM });
    setPreviewImages([]); setUploadedImages([]);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name, slug: p.slug || '', shortDescription: p.shortDescription || '',
      description: p.description || '', price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : '',
      stock: String(p.stock), SKU: p.SKU || '',
      material: p.material || '', stone: p.stone || '',
      weight: p.weight || '', color: p.color || '',
      category: p.category?._id || '',
      isFeatured: p.isFeatured, isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival, isActive: p.isActive,
    });
    setPreviewImages(p.images?.map(i => i.url) || []);
    setUploadedImages(p.images?.map(i => ({ url: i.url, publicId: '' })) || []);
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const newImages: { url: string; publicId: string }[] = [];
      const newPreviews: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        newImages.push({ url: data.url, publicId: data.publicId });
        newPreviews.push(data.url);
      }
      setUploadedImages(prev => [...prev, ...newImages]);
      setPreviewImages(prev => [...prev, ...newPreviews]);
      toast.success(`${files.length} image(s) uploaded`);
    } catch { toast.error('Image upload failed. Check Cloudinary settings.'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const removeImage = (idx: number) => {
    setPreviewImages(p => p.filter((_, i) => i !== idx));
    setUploadedImages(p => p.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock || !form.category) {
      toast.error('Name, Price, Stock, and Category are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        shortDescription: form.shortDescription,
        description: form.description,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock: Number(form.stock),
        SKU: form.SKU,
        material: form.material, stone: form.stone,
        weight: form.weight, color: form.color,
        category: form.category,
        isFeatured: form.isFeatured, isBestSeller: form.isBestSeller,
        isNewArrival: form.isNewArrival, isActive: form.isActive,
        images: uploadedImages.map((img, i) => ({ url: img.url, publicId: img.publicId, alt: `${form.name} ${i + 1}` })),
      };
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this product?')) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts(p => p.filter(pr => pr._id !== id));
      toast.success('Product archived');
    } catch { toast.error('Failed to archive'); }
    finally { setDeleting(null); }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await api.put(`/products/${id}`, { isFeatured: !current });
      setProducts(p => p.map(pr => pr._id === id ? { ...pr, isFeatured: !current } : pr));
    } catch { toast.error('Failed to update'); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.SKU?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const F = (key: string, val: string | boolean) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-cormorant text-2xl font-semibold text-white">Products</h2>
          <p className="font-manrope text-xs text-white/30 mt-0.5">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#C89B3C] text-white font-poppins text-xs tracking-wider px-4 py-2.5 hover:bg-[#b8892c] transition-colors" id="add-product-btn">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU..."
          className="w-full bg-[#1A1A1A] border border-white/10 text-white placeholder-white/30 font-manrope text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#C89B3C]" id="admin-product-search" />
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left font-poppins text-[10px] tracking-[2px] uppercase text-white/30 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 animate-pulse rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 font-manrope text-sm text-white/30">No products found</td></tr>
              ) : (
                filtered.map(product => (
                  <tr key={product._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 shrink-0 overflow-hidden rounded-sm"
                          style={product.images?.[0] ? { backgroundImage: `url(${product.images[0].url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}} />
                        <div>
                          <p className="font-manrope text-sm text-white line-clamp-1">{product.name}</p>
                          {!product.isActive && <span className="font-poppins text-[9px] text-red-400 tracking-wider uppercase">Archived</span>}
                          {product.isNewArrival && <span className="font-poppins text-[9px] text-blue-400 tracking-wider uppercase ml-1">New</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-manrope text-xs text-white/40">{product.SKU || '—'}</td>
                    <td className="px-4 py-3 font-manrope text-xs text-white/60">{product.category?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <p className="font-manrope text-sm text-[#C89B3C] font-medium">{formatPrice(product.discountPrice || product.price)}</p>
                      {product.discountPrice && <p className="font-manrope text-xs text-white/30 line-through">{formatPrice(product.price)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-poppins text-xs px-2 py-0.5 rounded ${product.stock === 0 ? 'text-red-400 bg-red-400/10' : product.stock <= 5 ? 'text-amber-400 bg-amber-400/10' : 'text-green-400 bg-green-400/10'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleFeatured(product._id, product.isFeatured)}
                        className={`font-poppins text-[10px] tracking-wider px-2 py-1 transition-colors ${product.isFeatured ? 'text-[#C89B3C] bg-[#C89B3C]/10' : 'text-white/20 hover:text-white/50'}`}>
                        {product.isFeatured ? '★ Yes' : '☆ No'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(product)} className="text-white/40 hover:text-[#C89B3C] transition-colors" aria-label="Edit"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(product._id)} disabled={deleting === product._id} className="text-white/40 hover:text-red-400 transition-colors" aria-label="Delete">
                          {deleting === product._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-white/5">
            <p className="font-manrope text-xs text-white/30">Showing {filtered.length} of {products.length} products</p>
          </div>
        )}
      </div>

      {/* ─── ADD / EDIT MODAL ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="bg-[#111] border border-white/10 w-full max-w-3xl my-8 rounded">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-cormorant text-2xl font-semibold text-white">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">

              {/* Images */}
              <div>
                <p className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 mb-3">Product Images</p>
                <div className="flex flex-wrap gap-3 mb-3">
                  {previewImages.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 bg-white/5 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <X size={16} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => fileRef.current?.click()}
                    className="w-20 h-20 border-2 border-dashed border-white/20 hover:border-[#C89B3C] flex flex-col items-center justify-center gap-1 transition-colors">
                    {uploading ? <Loader2 size={20} className="text-white/40 animate-spin" /> : <ImagePlus size={20} className="text-white/40" />}
                    <span className="font-poppins text-[9px] text-white/30">{uploading ? 'Uploading...' : 'Add'}</span>
                  </button>
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                <p className="font-manrope text-xs text-white/30">Upload to Cloudinary. First image = main image.</p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 block mb-1">Product Name *</label>
                  <input value={form.name} onChange={e => { F('name', e.target.value); F('slug', slugify(e.target.value)); }}
                    placeholder="e.g. Rani Haar Necklace" className="w-full bg-[#1A1A1A] border border-white/10 text-white font-manrope text-sm px-3 py-2.5 focus:outline-none focus:border-[#C89B3C]" id="prod-name" />
                </div>
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 block mb-1">SKU</label>
                  <input value={form.SKU} onChange={e => F('SKU', e.target.value)}
                    placeholder="e.g. HOA-NK-001" className="w-full bg-[#1A1A1A] border border-white/10 text-white font-manrope text-sm px-3 py-2.5 focus:outline-none focus:border-[#C89B3C]" id="prod-sku" />
                </div>
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 block mb-1">Category *</label>
                  <select value={form.category} onChange={e => F('category', e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 text-white font-manrope text-sm px-3 py-2.5 focus:outline-none focus:border-[#C89B3C]" id="prod-category">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 block mb-1">Slug</label>
                  <input value={form.slug} onChange={e => F('slug', e.target.value)}
                    placeholder="auto-generated" className="w-full bg-[#1A1A1A] border border-white/10 text-white/60 font-manrope text-sm px-3 py-2.5 focus:outline-none focus:border-[#C89B3C]" id="prod-slug" />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 block mb-1">Short Description</label>
                <input value={form.shortDescription} onChange={e => F('shortDescription', e.target.value)}
                  placeholder="One line description shown in cards..." className="w-full bg-[#1A1A1A] border border-white/10 text-white font-manrope text-sm px-3 py-2.5 focus:outline-none focus:border-[#C89B3C]" id="prod-shortdesc" />
              </div>

              {/* Full Description */}
              <div>
                <label className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 block mb-1">Full Description</label>
                <textarea value={form.description} onChange={e => F('description', e.target.value)}
                  rows={4} placeholder="Detailed product description..."
                  className="w-full bg-[#1A1A1A] border border-white/10 text-white font-manrope text-sm px-3 py-2.5 focus:outline-none focus:border-[#C89B3C] resize-none" id="prod-desc" />
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 block mb-1">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => F('price', e.target.value)}
                    placeholder="0" className="w-full bg-[#1A1A1A] border border-white/10 text-white font-manrope text-sm px-3 py-2.5 focus:outline-none focus:border-[#C89B3C]" id="prod-price" />
                </div>
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 block mb-1">Discount Price (₹)</label>
                  <input type="number" value={form.discountPrice} onChange={e => F('discountPrice', e.target.value)}
                    placeholder="Leave empty for no discount" className="w-full bg-[#1A1A1A] border border-white/10 text-white font-manrope text-sm px-3 py-2.5 focus:outline-none focus:border-[#C89B3C]" id="prod-discount" />
                </div>
                <div>
                  <label className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 block mb-1">Stock *</label>
                  <input type="number" value={form.stock} onChange={e => F('stock', e.target.value)}
                    placeholder="0" className="w-full bg-[#1A1A1A] border border-white/10 text-white font-manrope text-sm px-3 py-2.5 focus:outline-none focus:border-[#C89B3C]" id="prod-stock" />
                </div>
              </div>

              {/* Material Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'material', label: 'Material', placeholder: '22KT Gold' },
                  { key: 'stone', label: 'Stone', placeholder: 'Diamond, Ruby' },
                  { key: 'weight', label: 'Weight', placeholder: '10g' },
                  { key: 'color', label: 'Color', placeholder: 'Gold' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 block mb-1">{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => F(f.key, e.target.value)}
                      placeholder={f.placeholder} className="w-full bg-[#1A1A1A] border border-white/10 text-white font-manrope text-sm px-3 py-2.5 focus:outline-none focus:border-[#C89B3C]" id={`prod-${f.key}`} />
                  </div>
                ))}
              </div>

              {/* Toggles */}
              <div>
                <p className="font-poppins text-[10px] tracking-[2px] uppercase text-white/40 mb-3">Labels</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'isFeatured', label: '⭐ Featured' },
                    { key: 'isBestSeller', label: '🔥 Best Seller' },
                    { key: 'isNewArrival', label: '✨ New Arrival' },
                    { key: 'isActive', label: '👁️ Active / Visible' },
                  ].map(t => (
                    <button key={t.key} type="button"
                      onClick={() => F(t.key, !(form as any)[t.key])}
                      className={`font-poppins text-xs px-3 py-1.5 border transition-all ${(form as any)[t.key] ? 'border-[#C89B3C] text-[#C89B3C] bg-[#C89B3C]/10' : 'border-white/10 text-white/30 hover:border-white/30'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="font-poppins text-xs text-white/40 hover:text-white px-4 py-2.5 border border-white/10 hover:border-white/30 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-[#C89B3C] text-white font-poppins text-xs tracking-wider px-6 py-2.5 hover:bg-[#b8892c] transition-colors disabled:opacity-50" id="save-product-btn">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <>{editProduct ? 'Update Product' : 'Create Product'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
