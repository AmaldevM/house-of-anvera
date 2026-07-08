'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Tag, Layers, ShoppingCart,
  Users, BookOpen, Mail, Percent, MessageSquare, LogOut,
  TrendingUp, AlertTriangle, ChevronRight, Menu, X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

// Admin sub-pages (lazy)
import AdminOverview from './_components/AdminOverview';
import AdminProducts from './_components/AdminProducts';
import AdminOrders from './_components/AdminOrders';
import AdminUsers from './_components/AdminUsers';
import AdminCategories from './_components/AdminCategories';
import AdminCollections from './_components/AdminCollections';
import AdminBlogs from './_components/AdminBlogs';
import AdminCoupons from './_components/AdminCoupons';
import AdminContacts from './_components/AdminContacts';
import AdminNewsletter from './_components/AdminNewsletter';

const NAV = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'collections', label: 'Collections', icon: Layers },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'blogs', label: 'Blogs', icon: BookOpen },
  { id: 'coupons', label: 'Coupons', icon: Percent },
  { id: 'contacts', label: 'Contacts', icon: MessageSquare },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
];

export default function AdminPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out');
  };

  if (!user || user.role !== 'admin') return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview />;
      case 'products': return <AdminProducts />;
      case 'orders': return <AdminOrders />;
      case 'users': return <AdminUsers />;
      case 'categories': return <AdminCategories />;
      case 'collections': return <AdminCollections />;
      case 'blogs': return <AdminBlogs />;
      case 'coupons': return <AdminCoupons />;
      case 'contacts': return <AdminContacts />;
      case 'newsletter': return <AdminNewsletter />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-white/5 flex flex-col transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/5">
          <Link href="/" className="font-cormorant text-lg font-semibold text-white tracking-[0.1em] uppercase">
            House of <span className="text-[#C89B3C]">Anvera</span>
          </Link>
          <p className="font-poppins text-[10px] tracking-[2px] text-white/30 uppercase mt-0.5">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-poppins text-xs tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]/30'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight size={12} />}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[#C89B3C] flex items-center justify-center rounded-full">
              <span className="font-cormorant text-sm font-bold text-white">{user.name[0]}</span>
            </div>
            <div>
              <p className="font-manrope text-xs font-semibold text-white">{user.name}</p>
              <p className="font-manrope text-[10px] text-white/40">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 font-poppins text-xs text-red-400 hover:bg-red-400/10 rounded transition-colors"
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/50 hover:text-white"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-cormorant text-lg font-semibold text-white capitalize">
              {NAV.find(n => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          <Link
            href="/"
            target="_blank"
            className="font-poppins text-[10px] tracking-wider text-white/40 hover:text-[#C89B3C] transition-colors uppercase"
          >
            View Site →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
