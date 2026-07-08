'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, Package, ShoppingCart, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
}

interface MonthlyData {
  _id: { month: number; year: number };
  revenue: number;
  orders: number;
}

interface LowStock {
  _id: string;
  name: string;
  stock: number;
  SKU?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [lowStock, setLowStock] = useState<LowStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/admin/stats')
      .then(({ data }) => {
        setStats(data.stats);
        setMonthly(data.monthlyRevenue || []);
        setLowStock(data.lowStockProducts || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-white/5 animate-pulse rounded" />)}
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-[#C89B3C]', bg: 'bg-[#C89B3C]/10' },
    { label: 'Total Orders', value: stats?.totalOrders?.toLocaleString() || '0', icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Pending Orders', value: stats?.pendingOrders?.toLocaleString() || '0', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Delivered', value: stats?.deliveredOrders?.toLocaleString() || '0', icon: Package, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Total Users', value: stats?.totalUsers?.toLocaleString() || '0', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Products', value: stats?.totalProducts?.toLocaleString() || '0', icon: Package, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-[#1A1A1A] border border-white/5 rounded p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 ${card.bg} flex items-center justify-center rounded`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <p className="font-cormorant text-2xl font-semibold text-white">{card.value}</p>
              <p className="font-poppins text-[10px] tracking-wider uppercase text-white/40 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly Revenue Chart (simple bar) */}
      {monthly.length > 0 && (
        <div className="bg-[#1A1A1A] border border-white/5 rounded p-6">
          <h3 className="font-cormorant text-xl font-semibold text-white mb-6">Monthly Revenue</h3>
          <div className="flex items-end gap-2 h-32">
            {monthly.map((m, i) => {
              const maxRevenue = Math.max(...monthly.map(d => d.revenue));
              const height = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#C89B3C]/70 hover:bg-[#C89B3C] transition-colors rounded-t relative group"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#C89B3C] text-white text-[9px] font-poppins px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatPrice(m.revenue)}
                    </div>
                  </div>
                  <span className="font-poppins text-[10px] text-white/30">
                    {MONTHS[m._id.month - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Low Stock Warning */}
      {lowStock.length > 0 && (
        <div className="bg-[#1A1A1A] border border-amber-500/20 rounded p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="font-cormorant text-xl font-semibold text-white">Low Stock Alert</h3>
          </div>
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="font-manrope text-sm text-white">{p.name}</p>
                  {p.SKU && <p className="font-manrope text-xs text-white/40">SKU: {p.SKU}</p>}
                </div>
                <span className={`font-poppins text-xs font-bold px-2 py-1 rounded ${p.stock === 0 ? 'text-red-400 bg-red-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                  {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
