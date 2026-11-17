'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  UploadCloud,
  Check,
} from 'lucide-react';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'ed9cd2830c7038c0b9ba40977ad448f4';

const CATEGORIES = [
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
];

export default function AddMenuItemPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Classic Pizzas');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState(user?.businessName ? 'New York, NY' : '');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const isPremium =
    user?.subscriptionPlan === 'premium' &&
    (!user?.subscriptionExpiresAt ||
      new Date(user.subscriptionExpiresAt) > new Date());

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading('Uploading to ImgBB...');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.data?.url) {
        setImageUrl(data.data.url);
        toast.success('Image uploaded.', { id: toastId });
      } else {
        toast.error('Failed to upload image to ImgBB.', { id: toastId });
      }
    } catch (err) {
      console.error('ImgBB upload error:', err);
      toast.error('Network error uploading image.', { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      toast.error('Please upload an image file.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName,
          category,
          description,
          price: parseFloat(price),
          location,
          images: [imageUrl],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          setLimitReached(true);
          toast.error(data.message || 'Free plan item limit reached.');
        } else {
          toast.error(data.message || 'Failed to submit menu item.');
        }
      } else {
        toast.success('Item submitted for admin review.');
        router.push('/dashboard/vendor/menu');
      }
    } catch (err) {
      toast.error('Network error submitting item.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
        <h1 className="text-xl font-semibold text-stone-900 dark:text-white tracking-tight">
          Add menu item
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Submitted items require administrator review before appearing on the public menu.
        </p>
      </div>

      {!isPremium && (
        <div className="p-3.5 rounded-lg bg-stone-100 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
          <span>Free tier allows up to 3 active menu items.</span>
          <Link
            href="/dashboard/vendor/subscription"
            className="text-stone-900 dark:text-white font-medium hover:underline ml-2 shrink-0"
          >
            Upgrade plan →
          </Link>
        </div>
      )}

      {limitReached && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300 space-y-2">
          <p className="font-medium">Free plan limit reached (3 items maximum)</p>
          <p className="text-red-600 dark:text-red-400">
            Upgrade your restaurant subscription to publish unlimited menu items.
          </p>
          <Link
            href="/dashboard/vendor/subscription"
            className="inline-block px-3 py-1.5 rounded bg-stone-900 text-white font-medium"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl bg-white dark:bg-[#19191b] border border-black/[0.06] dark:border-white/[0.08] space-y-4 text-xs"
      >
        <div>
          <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
            Item name *
          </label>
          <input
            type="text"
            required
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Margherita D.O.P."
            className="w-full px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Price (USD) *
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="18.50"
              className="w-full px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
            Kitchen location (Area / City) *
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Manhattan, New York"
            className="w-full px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
            Description & ingredients *
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail sauce, dough fermentation, cheese and toppings..."
            className="w-full px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* ImgBB file upload */}
        <div>
          <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
            Photo (ImgBB upload) *
          </label>

          <div className="p-4 rounded-lg border border-dashed border-black/[0.12] dark:border-white/[0.12] flex flex-col items-center justify-center space-y-2 text-center">
            {imageUrl ? (
              <div className="space-y-2 flex flex-col items-center">
                <img src={imageUrl} alt="Uploaded item" className="w-32 h-24 rounded-lg object-cover" />
                <div className="flex items-center space-x-1.5 text-stone-600 dark:text-stone-400">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span>Hosted on ImgBB</span>
                </div>
                <label className="cursor-pointer text-stone-500 hover:underline">
                  Replace image
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <>
                <UploadCloud className="w-5 h-5 text-stone-400" />
                <label className="cursor-pointer font-medium text-stone-900 dark:text-white hover:underline">
                  {uploadingImage ? 'Uploading...' : 'Choose image file'}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-stone-400">PNG, JPG, or WEBP up to 10MB</span>
              </>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting || uploadingImage || !imageUrl}
            className="py-2.5 px-4 rounded-lg bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit for review'}
          </button>
        </div>
      </form>
    </div>
  );
}
