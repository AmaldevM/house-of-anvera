'use client';
import { useState, useEffect } from 'react';
import { Trash2, Globe } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';
interface Blog { _id: string; title: string; isPublished: boolean; views: number; category: string; author?: { name: string }; createdAt: string; }
export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/blogs/admin/all').then(({ data }) => setBlogs(data.blogs)).catch(() => toast.error('Failed to load blogs')).finally(() => setLoading(false)); }, []);
  const togglePublish = async (id: string, current: boolean) => {
    try { await api.put(`/blogs/${id}`, { isPublished: !current }); setBlogs(b => b.map(bl => bl._id === id ? { ...bl, isPublished: !current } : bl)); toast.success(current ? 'Blog unpublished' : 'Blog published'); } catch { toast.error('Failed to update'); }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    try { await api.delete(`/blogs/${id}`); setBlogs(b => b.filter(bl => bl._id !== id)); toast.success('Blog deleted'); } catch { toast.error('Failed to delete'); }
  };
  return (
    <div className="space-y-5">
      <h2 className="font-cormorant text-2xl font-semibold text-white">Blogs</h2>
      <div className="bg-[#1A1A1A] border border-white/5 rounded overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-white/5 animate-pulse rounded" />)}</div> : (
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{['Title', 'Category', 'Views', 'Status', 'Date', 'Actions'].map(h => <th key={h} className="text-left font-poppins text-[10px] tracking-[2px] uppercase text-white/30 px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{blogs.map(blog => (
              <tr key={blog._id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-4 py-3 font-manrope text-sm text-white max-w-xs truncate">{blog.title}</td>
                <td className="px-4 py-3 font-poppins text-[10px] text-white/40 capitalize">{blog.category}</td>
                <td className="px-4 py-3 font-manrope text-sm text-white/60">{blog.views}</td>
                <td className="px-4 py-3"><span className={`font-poppins text-[10px] px-2 py-0.5 rounded ${blog.isPublished ? 'text-green-400 bg-green-400/10' : 'text-amber-400 bg-amber-400/10'}`}>{blog.isPublished ? 'Published' : 'Draft'}</span></td>
                <td className="px-4 py-3 font-manrope text-xs text-white/40">{formatDate(blog.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => togglePublish(blog._id, blog.isPublished)} className="text-white/30 hover:text-[#C89B3C] transition-colors" aria-label="Toggle publish"><Globe size={14} /></button>
                    <button onClick={() => handleDelete(blog._id)} className="text-white/30 hover:text-red-400 transition-colors" aria-label="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
