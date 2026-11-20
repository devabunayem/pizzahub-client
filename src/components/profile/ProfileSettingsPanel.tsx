'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Store,
  Shield,
  Save,
  Crown,
  Image as ImageIcon,
  Camera,
  ArrowLeft,
} from 'lucide-react';
import { toast } from '@/lib/toast';
import { BrushHighlight } from '@/components/ui/BrushHighlight';
import { ProfileSettingsSkeleton } from '@/components/ui/Skeleton';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '';

interface ProfileSettingsPanelProps {
  inDashboard?: boolean;
}

export function ProfileSettingsPanel({ inDashboard = false }: ProfileSettingsPanelProps) {
  const { user, token, updateUser, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
      setBusinessName(user.businessName || '');
    }
  }, [user]);

  if (isLoading || !user) {
    return <ProfileSettingsSkeleton />;
  }

  const isPremiumVendor =
    user.role === 'vendor' &&
    user.subscriptionPlan === 'premium' &&
    (!user.subscriptionExpiresAt ||
      new Date(user.subscriptionExpiresAt) > new Date());

  const dashboardHome =
    user.role === 'admin'
      ? '/dashboard/admin'
      : user.role === 'vendor'
      ? '/dashboard/vendor'
      : '/dashboard/customer';

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading('Uploading profile photo...');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        setImage(data.data.url);
        toast.success('Photo ready — click Save Changes to apply!', { id: toastId });
      } else {
        toast.error('Failed to upload image to ImgBB.', { id: toastId });
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      toast.error('Network error uploading photo.', { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

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
    <div className={inDashboard ? 'mx-auto max-w-4xl space-y-6' : 'mx-auto max-w-3xl space-y-6'}>
      {!inDashboard && (
        <Link
          href={dashboardHome}
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      )}

      {/* Bold Charred Espresso Identity Command Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-[#18120E] p-7 sm:p-9 text-[#FAF7F2] shadow-[0_24px_56px_-22px_rgba(24,18,14,0.38)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#E50916]/15 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {image ? (
                <img
                  src={image}
                  alt={name || user.name}
                  className="h-20 w-20 rounded-3xl border-2 border-white/15 bg-stone-900 object-cover shadow-lg"
                />
              ) : (
                <div className="font-display flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-white/15 bg-[#D91E18] text-3xl uppercase text-white shadow-lg">
                  {(name || user.name).charAt(0) || 'P'}
                </div>
              )}

              <label
                title="Upload profile photo"
                className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-[#18120E] text-white shadow-md transition hover:bg-[#E50916]"
              >
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D97706]">
                  <Shield className="h-3 w-3 text-[#E50916]" />
                  <span>{user.role} Account</span>
                </span>
                {user.role === 'vendor' && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      isPremiumVendor
                        ? 'bg-[#9A4A12] text-white'
                        : 'border border-white/15 bg-white/5 text-stone-300'
                    }`}
                  >
                    {isPremiumVendor && <Crown className="h-3 w-3 text-amber-200" />}
                    <span>{isPremiumVendor ? 'Premium Partner' : 'Free Tier'}</span>
                  </span>
                )}
              </div>

              <h1 className="leading-[0.98] tracking-tight text-white">
                <span className="font-display text-2xl uppercase sm:text-3xl">
                  PROFILE{' '}
                </span>
                <BrushHighlight immediate color="#E50916" secondaryColor="#D97706" delay={0.15}>
                  <span className="font-editorial text-2xl italic font-normal lowercase text-[#FAF7F2] sm:text-3xl">
                    identity
                  </span>
                </BrushHighlight>
              </h1>
              <p className="mt-1.5 truncate text-xs text-stone-300 sm:text-sm">
                {name || user.name} • {user.email}
              </p>
            </div>
          </div>

          <label className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#E50916] hover:border-[#E50916] sm:self-auto">
            <Camera className="h-3.5 w-3.5" />
            <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploadingImage}
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
              Full name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
              Email address (read-only)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full cursor-not-allowed rounded-xl border border-stone-200 bg-stone-100 py-2.5 pl-10 pr-4 text-sm text-[#6E6259]"
              />
            </div>
          </div>
        </div>

        {user.role === 'vendor' && (
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
              Restaurant brand name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                <Store className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
            Profile image URL (or use Upload Photo above)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
              <ImageIcon className="h-4 w-4" />
            </div>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-5">
          <p className="text-xs text-[#6E6259]">
            Changes reflect across your dashboard, navbar avatar, and reviews immediately.
          </p>

          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="flex cursor-pointer items-center space-x-2 rounded-2xl bg-[#D91E18] px-6 py-3 text-xs font-bold text-white shadow-[0_12px_28px_-10px_rgba(217,30,24,0.5)] transition-colors hover:bg-[#b81712] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
