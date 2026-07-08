'use client';
import { useState, useEffect } from 'react';
import { Trash2, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';
interface Subscriber { _id: string; email: string; isActive: boolean; subscribedAt: string; }
export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/newsletter/subscribers').then(({ data }) => setSubscribers(data.subscribers)).catch(() => toast.error('Failed to load subscribers')).finally(() => setLoading(false)); }, []);
  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    try { await api.delete(`/newsletter/${id}`); setSubscribers(s => s.filter(sub => sub._id !== id)); toast.success('Subscriber removed'); } catch { toast.error('Failed to remove'); }
  };
  const activeCount = subscribers.filter(s => s.isActive).length;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-cormorant text-2xl font-semibold text-white">Newsletter Subscribers</h2>
        <div className="text-right">
          <p className="font-cormorant text-xl text-[#C89B3C] font-semibold">{activeCount}</p>
          <p className="font-poppins text-[10px] tracking-wider text-white/30 uppercase">Active subscribers</p>
        </div>
      </div>
      <div className="bg-[#1A1A1A] border border-white/5 rounded overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-white/5 animate-pulse rounded" />)}</div> : subscribers.length === 0 ? (
          <div className="py-12 text-center font-manrope text-sm text-white/30">No subscribers yet</div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{['Email', 'Status', 'Subscribed On', 'Action'].map(h => <th key={h} className="text-left font-poppins text-[10px] tracking-[2px] uppercase text-white/30 px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{subscribers.map(sub => (
              <tr key={sub._id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-4 py-3"><div className="flex items-center gap-2"><Mail size={12} className="text-white/30" /><span className="font-manrope text-sm text-white">{sub.email}</span></div></td>
                <td className="px-4 py-3"><span className={`font-poppins text-[10px] px-2 py-0.5 rounded ${sub.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>{sub.isActive ? 'Active' : 'Unsubscribed'}</span></td>
                <td className="px-4 py-3 font-manrope text-xs text-white/40">{formatDate(sub.subscribedAt)}</td>
                <td className="px-4 py-3"><button onClick={() => handleDelete(sub._id)} className="text-white/30 hover:text-red-400 transition-colors" aria-label="Remove"><Trash2 size={14} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
