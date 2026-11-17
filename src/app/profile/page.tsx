'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Store,
  Shield,
  Save,
  Image as ImageIcon,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from '@/lib/toast';

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
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Profile settings
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Manage your personal details, contact display, and kitchen information.
        </p>
      </div>

      {/* Account Info Strip */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Shield className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-600 dark:text-stone-400">
            Account role: <span className="capitalize font-medium text-stone-900 dark:text-stone-100">{user.role}</span>
          </span>
        </div>
        {user.role === 'vendor' && (
          <span className="font-medium text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 px-2 py-0.5 rounded">
            {user.subscriptionPlan === 'premium' ? 'Premium partner' : 'Free tier'}
          </span>
        )}
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-5"
      >
        {/* Avatar Preview */}
        <div className="flex items-center space-x-3.5">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-14 h-14 rounded-xl object-cover border border-stone-200 dark:border-stone-800 shrink-0 bg-stone-100 dark:bg-stone-800"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center font-semibold text-lg uppercase shrink-0">
              {name.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">{name}</h3>
            <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Full name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Email address (read-only)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 text-stone-400 text-xs cursor-not-allowed"
            />
          </div>
        </div>

        {user.role === 'vendor' && (
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Restaurant brand name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Store className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Profile image URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="py-2 px-4 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
