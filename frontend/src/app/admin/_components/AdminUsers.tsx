'use client';
import { useState, useEffect } from 'react';
import { Trash2, Shield } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setUsers(data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const toggleRole = async (id: string, role: string) => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${id}`, { role: newRole });
      setUsers(u => u.map(usr => usr._id === id ? { ...usr, role: newRole } : usr));
      toast.success(`User role updated to ${newRole}`);
    } catch {
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="font-cormorant text-2xl font-semibold text-white">Users</h2>
      <div className="bg-[#1A1A1A] border border-white/5 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Email', 'Phone', 'Role', 'Verified', 'Joined', 'Action'].map(h => (
                  <th key={h} className="text-left font-poppins text-[10px] tracking-[2px] uppercase text-white/30 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 animate-pulse rounded" /></td>)}
                  </tr>
                ))
              ) : users.map(user => (
                <tr key={user._id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="px-4 py-3 font-manrope text-sm text-white">{user.name}</td>
                  <td className="px-4 py-3 font-manrope text-xs text-white/60">{user.email}</td>
                  <td className="px-4 py-3 font-manrope text-xs text-white/40">{user.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-poppins text-[10px] tracking-wider uppercase px-2 py-1 rounded ${user.role === 'admin' ? 'text-[#C89B3C] bg-[#C89B3C]/10' : 'text-white/40 bg-white/5'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-poppins text-[10px] ${user.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                      {user.isVerified ? '✓ Yes' : '✗ No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-manrope text-xs text-white/40">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRole(user._id, user.role)}
                      className="flex items-center gap-1 text-white/30 hover:text-[#C89B3C] transition-colors font-poppins text-[10px]"
                    >
                      <Shield size={12} /> {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
