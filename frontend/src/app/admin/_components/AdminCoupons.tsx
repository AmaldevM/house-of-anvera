'use client';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';
interface Coupon { _id: string; code: string; type: string; value: number; usedCount: number; usageLimit?: number; isActive: boolean; expiresAt: string; }
export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/coupons').then(({ data }) => setCoupons(data.coupons)).catch(() => toast.error('Failed to load coupons')).finally(() => setLoading(false)); }, []);
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try { await api.delete(`/coupons/${id}`); setCoupons(c => c.filter(co => co._id !== id)); toast.success('Coupon deleted'); } catch { toast.error('Failed to delete'); }
  };
  return (
    <div className="space-y-5">
      <h2 className="font-cormorant text-2xl font-semibold text-white">Coupons</h2>
      <div className="bg-[#1A1A1A] border border-white/5 rounded overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-white/5 animate-pulse rounded" />)}</div> : (
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{['Code', 'Type', 'Value', 'Used', 'Status', 'Expires', 'Action'].map(h => <th key={h} className="text-left font-poppins text-[10px] tracking-[2px] uppercase text-white/30 px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{coupons.length === 0 ? <tr><td colSpan={7} className="text-center py-12 font-manrope text-sm text-white/30">No coupons yet</td></tr> : coupons.map(coupon => (
              <tr key={coupon._id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-4 py-3 font-poppins text-sm text-[#C89B3C] font-semibold tracking-wider">{coupon.code}</td>
                <td className="px-4 py-3 font-manrope text-xs text-white/60 capitalize">{coupon.type}</td>
                <td className="px-4 py-3 font-manrope text-sm text-white">{coupon.type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)}</td>
                <td className="px-4 py-3 font-manrope text-sm text-white/60">{coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</td>
                <td className="px-4 py-3"><span className={`font-poppins text-[10px] px-2 py-0.5 rounded ${coupon.isActive && new Date(coupon.expiresAt) > new Date() ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>{coupon.isActive && new Date(coupon.expiresAt) > new Date() ? 'Active' : 'Expired'}</span></td>
                <td className="px-4 py-3 font-manrope text-xs text-white/40">{formatDate(coupon.expiresAt)}</td>
                <td className="px-4 py-3"><button onClick={() => handleDelete(coupon._id)} className="text-white/30 hover:text-red-400 transition-colors" aria-label="Delete"><Trash2 size={14} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
