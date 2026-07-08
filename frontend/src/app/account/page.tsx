'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, Lock, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { formatPrice, formatDate } from '@/lib/utils';
import { Order } from '@/types';
import api from '@/lib/api';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { toast } from 'sonner';
import Link from 'next/link';

const TABS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'password', label: 'Change Password', icon: Lock },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50',
  packed: 'text-blue-600 bg-blue-50',
  shipped: 'text-indigo-600 bg-indigo-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
};

export default function AccountPage() {
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account');
    } else if (user) {
      setProfileData({ name: user.name || '', phone: user.phone || '' });
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      setOrdersLoading(true);
      api.get('/orders/my-orders')
        .then(({ data }) => setOrders(data.orders))
        .catch(() => toast.error('Failed to load orders'))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, isAuthenticated]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/profile', profileData);
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="font-poppins text-[11px] tracking-[4px] text-gold uppercase mb-2">My Account</p>
          <h1 className="font-cormorant text-4xl font-semibold text-dark">
            Welcome, {user.name.split(' ')[0]}
          </h1>
          <GoldDivider align="left" className="mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Avatar card */}
            <div className="text-center p-6 bg-dark mb-4">
              <div className="w-16 h-16 bg-gold flex items-center justify-center mx-auto mb-3">
                <span className="font-cormorant text-2xl font-semibold text-white">
                  {user.name[0].toUpperCase()}
                </span>
              </div>
              <p className="font-cormorant text-lg font-semibold text-white">{user.name}</p>
              <p className="font-manrope text-xs text-white/50 mt-1">{user.email}</p>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="mt-3 inline-block font-poppins text-[10px] tracking-wider uppercase bg-gold/20 text-gold px-3 py-1 border border-gold/30 hover:bg-gold hover:text-white transition-colors"
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Nav tabs */}
            <nav className="space-y-0.5">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 font-poppins text-xs tracking-wider uppercase transition-all ${
                      isActive
                        ? 'bg-gold text-white'
                        : 'text-brown hover:bg-off-white hover:text-gold'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="flex-1 text-left">{tab.label}</span>
                    {isActive && <ChevronRight size={12} />}
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 font-poppins text-xs tracking-wider uppercase text-red-400 hover:bg-red-50 transition-all"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </nav>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* PROFILE */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-cormorant text-2xl font-semibold text-dark mb-6">My Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Full Name</label>
                    <input
                      value={profileData.name}
                      onChange={e => setProfileData(d => ({ ...d, name: e.target.value }))}
                      className="luxury-input"
                      id="profile-name-input"
                    />
                  </div>
                  <div>
                    <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Email</label>
                    <input value={user.email} disabled className="luxury-input opacity-50 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Phone</label>
                    <input
                      value={profileData.phone}
                      onChange={e => setProfileData(d => ({ ...d, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="luxury-input"
                      id="profile-phone-input"
                    />
                  </div>
                  <button type="submit" className="btn-gold" id="profile-save-btn">Save Changes</button>
                </form>
              </motion.div>
            )}

            {/* ORDERS */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-cormorant text-2xl font-semibold text-dark mb-6">My Orders</h2>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-24 shimmer rounded" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center border border-off-white">
                    <Package size={48} className="text-brown/20 mx-auto mb-4" />
                    <p className="font-cormorant text-2xl text-dark mb-2">No orders yet</p>
                    <p className="font-manrope text-sm text-brown/60 mb-6">Start exploring our collections</p>
                    <Link href="/shop" className="btn-gold">Explore Shop</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order._id} className="border border-off-white p-5 hover:border-gold/30 transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-poppins text-[10px] tracking-[2px] text-brown/40 uppercase mb-1">Order ID</p>
                            <p className="font-cormorant text-lg font-semibold text-dark">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-manrope text-xs text-brown/40 mb-1">{formatDate(order.createdAt)}</p>
                            <p className="font-cormorant text-xl font-semibold gold-text">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {order.orderItems?.slice(0, 2).map((item, i) => (
                              <span key={i} className="font-manrope text-xs text-brown/60">
                                {typeof item.product === 'object' ? item.product.name : item.name}
                                {i < Math.min((order.orderItems?.length || 0), 2) - 1 ? ',' : ''}
                              </span>
                            ))}
                            {(order.orderItems?.length || 0) > 2 && (
                              <span className="font-manrope text-xs text-brown/40">+{(order.orderItems?.length || 0) - 2} more</span>
                            )}
                          </div>
                          <span className={`font-poppins text-[10px] tracking-wider uppercase px-3 py-1.5 ${STATUS_STYLES[order.shippingStatus] || 'text-gray-600 bg-gray-50'}`}>
                            {order.shippingStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* WISHLIST */}
            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-cormorant text-2xl font-semibold text-dark mb-6">My Wishlist</h2>
                <p className="font-manrope text-brown/60 mb-6">
                  View and manage all the pieces you&apos;ve saved.
                </p>
                <Link href="/wishlist" className="btn-gold inline-flex items-center gap-2">
                  <Heart size={14} /> View Full Wishlist
                </Link>
              </motion.div>
            )}

            {/* ADDRESSES */}
            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-cormorant text-2xl font-semibold text-dark mb-6">Saved Addresses</h2>
                <p className="font-manrope text-brown/60">
                  Manage your delivery addresses here. Saved addresses will be available during checkout.
                </p>
              </motion.div>
            )}

            {/* PASSWORD */}
            {activeTab === 'password' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-cormorant text-2xl font-semibold text-dark mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData(d => ({ ...d, currentPassword: e.target.value }))}
                      className="luxury-input"
                      id="current-password-input"
                    />
                  </div>
                  <div>
                    <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData(d => ({ ...d, newPassword: e.target.value }))}
                      className="luxury-input"
                      id="new-password-input"
                    />
                  </div>
                  <div>
                    <label className="font-poppins text-[10px] tracking-[2px] uppercase text-brown/50 block mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData(d => ({ ...d, confirmPassword: e.target.value }))}
                      className="luxury-input"
                      id="confirm-password-input"
                    />
                  </div>
                  <button type="submit" className="btn-gold" id="password-change-btn">Update Password</button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
