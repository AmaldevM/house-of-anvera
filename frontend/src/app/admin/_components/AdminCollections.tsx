'use client';
import { useState, useEffect } from 'react';
import { Trash2, Star } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
interface Collection { _id: string; name: string; slug: string; isActive: boolean; isFeatured: boolean; }
export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/collections/admin/all').then(({ data }) => setCollections(data.collections)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false)); }, []);
  const toggleFeatured = async (id: string, current: boolean) => {
    try { await api.put(`/collections/${id}`, { isFeatured: !current }); setCollections(c => c.map(col => col._id === id ? { ...col, isFeatured: !current } : col)); } catch { toast.error('Failed to update'); }
  };
  return (
    <div className="space-y-5">
      <h2 className="font-cormorant text-2xl font-semibold text-white">Collections</h2>
      <div className="bg-[#1A1A1A] border border-white/5 rounded overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-white/5 animate-pulse rounded" />)}</div> : (
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{['Name', 'Slug', 'Status', 'Featured', 'Action'].map(h => <th key={h} className="text-left font-poppins text-[10px] tracking-[2px] uppercase text-white/30 px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{collections.map(col => (
              <tr key={col._id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-4 py-3 font-manrope text-sm text-white">{col.name}</td>
                <td className="px-4 py-3 font-manrope text-xs text-white/40">{col.slug}</td>
                <td className="px-4 py-3"><span className={`font-poppins text-[10px] px-2 py-0.5 rounded ${col.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>{col.isActive ? 'Active' : 'Hidden'}</span></td>
                <td className="px-4 py-3"><button onClick={() => toggleFeatured(col._id, col.isFeatured)} className={`font-poppins text-[10px] ${col.isFeatured ? 'text-[#C89B3C]' : 'text-white/30 hover:text-white/60'}`}>{col.isFeatured ? '★ Yes' : '☆ No'}</button></td>
                <td className="px-4 py-3"><button className="text-white/30 hover:text-red-400 transition-colors" aria-label="Delete"><Trash2 size={14} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
