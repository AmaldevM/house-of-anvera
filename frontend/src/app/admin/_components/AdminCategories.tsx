'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Category { _id: string; name: string; slug: string; isActive: boolean; sortOrder: number; }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    api.get('/categories/admin/all')
      .then(({ data }) => setCategories(data.categories))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const { data } = await api.post('/categories', { name: newName });
      setCategories(c => [...c, data.category]);
      setNewName('');
      toast.success('Category created');
    } catch { toast.error('Failed to create category'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(c => c.filter(cat => cat._id !== id));
      toast.success('Category deleted');
    } catch { toast.error('Failed to delete category'); }
  };

  return (
    <div className="space-y-5">
      <h2 className="font-cormorant text-2xl font-semibold text-white">Categories</h2>
      <form onSubmit={handleCreate} className="flex gap-2 max-w-md">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New category name..." className="flex-1 bg-[#1A1A1A] border border-white/10 text-white placeholder-white/30 font-manrope text-sm px-4 py-2.5 focus:outline-none focus:border-[#C89B3C]" id="new-category-input" />
        <button type="submit" className="flex items-center gap-2 bg-[#C89B3C] text-white font-poppins text-xs tracking-wider px-4 py-2.5 hover:bg-[#b8892c] transition-colors shrink-0"><Plus size={14} /> Add</button>
      </form>
      <div className="bg-[#1A1A1A] border border-white/5 rounded overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-white/5 animate-pulse rounded" />)}</div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{['Name', 'Slug', 'Status', 'Action'].map(h => <th key={h} className="text-left font-poppins text-[10px] tracking-[2px] uppercase text-white/30 px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="px-4 py-3 font-manrope text-sm text-white">{cat.name}</td>
                  <td className="px-4 py-3 font-manrope text-xs text-white/40">{cat.slug}</td>
                  <td className="px-4 py-3"><span className={`font-poppins text-[10px] px-2 py-0.5 rounded ${cat.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>{cat.isActive ? 'Active' : 'Hidden'}</span></td>
                  <td className="px-4 py-3"><button onClick={() => handleDelete(cat._id)} className="text-white/30 hover:text-red-400 transition-colors" aria-label="Delete"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
