'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Store,
  Sparkles,
  Shield,
  Save,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProfileSettingsPage() {
  const { user, token, updateUser, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
      setBusinessName(user.businessName || '');
    }
  }, [user]);

  if (isLoading || !user) {
    return <LoadingSpinner fullScreen message="Loading your profile settings..." />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Saving profile changes...');

    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          image,
          businessName: user.role === 'vendor' ? businessName : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        updateUser(data.user);
        toast.success('Profile updated successfully!', { id: toastId });
      } else {
        toast.error(data.message || 'Failed to update profile.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error updating profile.', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          Profile Settings
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Manage your personal identity, contact display, and kitchen branding.
        </p>
      </div>

      {/* Security Rule Card */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-pizza-500" />
          <span className="text-stone-600 dark:text-stone-300">
            Account Role: <strong className="capitalize text-stone-900 dark:text-white">{user.role}</strong>
          </span>
        </div>
        {user.role === 'vendor' && (
          <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
            ⭐ {user.subscriptionPlan === 'premium' ? 'Premium Plan' : 'Free Tier'}
          </span>
        )}
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6"
      >
        {/* Avatar Preview */}
        <div className="flex items-center space-x-4">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-pizza-400 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-pizza-600 text-white flex items-center justify-center font-bold text-2xl uppercase shrink-0">
              {name.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-white">{name}</h3>
            <p className="text-xs text-stone-400">{user.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
            Email Address (Read-only)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800/50 text-stone-500 text-sm cursor-not-allowed"
            />
          </div>
        </div>

        {user.role === 'vendor' && (
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Restaurant / Business Brand Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Store className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
            Profile Image URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="py-3 px-6 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-md shadow-pizza-500/20 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
