'use client';
import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';
interface Contact { _id: string; name: string; email: string; subject?: string; message: string; status: string; createdAt: string; }
const STATUS_COLORS: Record<string, string> = { inbox: 'text-blue-400 bg-blue-400/10', read: 'text-white/40 bg-white/5', replied: 'text-green-400 bg-green-400/10', archived: 'text-white/20 bg-white/5' };
export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/contacts').then(({ data }) => setContacts(data.contacts)).catch(() => toast.error('Failed to load contacts')).finally(() => setLoading(false)); }, []);
  const updateStatus = async (id: string, status: string) => {
    try { await api.put(`/contacts/${id}`, { status }); setContacts(c => c.map(co => co._id === id ? { ...co, status } : co)); } catch { toast.error('Failed to update'); }
  };
  return (
    <div className="space-y-5">
      <h2 className="font-cormorant text-2xl font-semibold text-white">Contact Messages</h2>
      <div className="bg-[#1A1A1A] border border-white/5 rounded overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-white/5 animate-pulse rounded" />)}</div> : contacts.length === 0 ? (
          <div className="py-12 text-center font-manrope text-sm text-white/30">No messages yet</div>
        ) : (
          <div className="divide-y divide-white/5">
            {contacts.map(c => (
              <div key={c._id} className="p-4 hover:bg-white/2 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-manrope text-sm font-semibold text-white">{c.name}</p>
                    <p className="font-manrope text-xs text-white/40">{c.email} · {formatDate(c.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-poppins text-[10px] tracking-wider uppercase px-2 py-0.5 rounded ${STATUS_COLORS[c.status] || 'text-white/30'}`}>{c.status}</span>
                    <select value={c.status} onChange={e => updateStatus(c._id, e.target.value)} className="bg-[#252525] border border-white/10 text-white/40 font-poppins text-[10px] px-2 py-1 focus:outline-none">
                      {['inbox', 'read', 'replied', 'archived'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                {c.subject && <p className="font-poppins text-[11px] tracking-wider text-[#C89B3C] uppercase mb-1">{c.subject}</p>}
                <p className="font-manrope text-sm text-white/60 line-clamp-2">{c.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
