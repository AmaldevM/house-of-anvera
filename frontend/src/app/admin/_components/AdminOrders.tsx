'use client';
import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Order {
  _id: string;
  user?: { name: string; email: string };
  total: number;
  paymentStatus: string;
  shippingStatus: string;
  paymentMethod: string;
  createdAt: string;
  orderItems: any[];
}

const SHIPPING_STATUSES = ['pending', 'packed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-400 bg-amber-400/10',
  packed: 'text-blue-400 bg-blue-400/10',
  shipped: 'text-indigo-400 bg-indigo-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
  paid: 'text-green-400 bg-green-400/10',
  unpaid: 'text-red-400 bg-red-400/10',
  failed: 'text-red-400 bg-red-400/10',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.append('status', statusFilter);
      const { data } = await api.get(`/orders/admin/all?${params}`);
      setOrders(data.orders);
      setTotalPages(data.pages || 1);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, shippingStatus: string) => {
    try {
      await api.put(`/orders/admin/${orderId}/status`, { shippingStatus });
      setOrders(o => o.map(ord => ord._id === orderId ? { ...ord, shippingStatus } : ord));
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-cormorant text-2xl font-semibold text-white">Orders</h2>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-[#1A1A1A] border border-white/10 text-white/60 font-poppins text-xs tracking-wider px-4 py-2.5 focus:outline-none focus:border-[#C89B3C]"
          id="admin-order-filter"
        >
          <option value="">All Statuses</option>
          {SHIPPING_STATUSES.map(s => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left font-poppins text-[10px] tracking-[2px] uppercase text-white/30 px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-white/5 animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 font-manrope text-sm text-white/30">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-4 py-3 font-poppins text-xs text-[#C89B3C] font-semibold">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-manrope text-sm text-white">{order.user?.name || 'Guest'}</p>
                      <p className="font-manrope text-xs text-white/40">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-manrope text-sm text-white/60">
                      {order.orderItems?.length || 0}
                    </td>
                    <td className="px-4 py-3 font-cormorant text-base font-semibold text-[#C89B3C]">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-poppins text-[10px] tracking-wider uppercase px-2 py-1 rounded ${STATUS_COLORS[order.paymentStatus] || 'text-white/40 bg-white/5'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-poppins text-[10px] tracking-wider uppercase px-2 py-1 rounded ${STATUS_COLORS[order.shippingStatus] || 'text-white/40 bg-white/5'}`}>
                        {order.shippingStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-manrope text-xs text-white/40">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.shippingStatus}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        className="bg-[#252525] border border-white/10 text-white/60 font-poppins text-[10px] tracking-wider px-2 py-1.5 focus:outline-none focus:border-[#C89B3C] capitalize"
                      >
                        {SHIPPING_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="font-poppins text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
            >
              ← Prev
            </button>
            <span className="font-poppins text-xs text-white/30">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="font-poppins text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
