'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UploadCloud, Check, ArrowRight } from 'lucide-react';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '';

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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="border-b border-stone-200 pb-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
          New Creation
        </span>
        <h1 className="font-display mt-1 text-3xl uppercase tracking-tight text-[#18120E]">
          Add Menu Item
        </h1>
        <p className="mt-1 text-sm text-[#6E6259]">
          Submitted items require administrator approval before appearing on the public menu.
        </p>
      </div>

      {!isPremium && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-xs text-[#6E6259] shadow-sm">
          <span>Free tier allows up to 3 active menu items.</span>
          <Link
            href="/dashboard/vendor/subscription"
            className="inline-flex items-center gap-1 font-bold text-[#D91E18] hover:underline"
          >
            <span>Upgrade Plan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {limitReached && (
        <div className="space-y-2.5 rounded-2xl border border-red-200 bg-red-50 p-5 text-xs text-[#D91E18]">
          <p className="text-sm font-extrabold">Free plan limit reached (3 items maximum)</p>
          <p className="text-[#6E6259]">
            Upgrade your restaurant subscription to publish unlimited menu items.
          </p>
          <Link
            href="/dashboard/vendor/subscription"
            className="inline-block rounded-full bg-[#D91E18] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#b81712]"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm"
      >
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
            Item name *
          </label>
          <input
            type="text"
            required
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Margherita D.O.P."
            className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
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
              className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
            Kitchen location (Area / City) *
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Manhattan, New York"
            className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
            Description &amp; ingredients *
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail sauce, dough fermentation, cheese and toppings..."
            className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:bg-white focus:outline-none"
          />
        </div>

        {/* ImgBB file upload */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
            Photo (ImgBB upload) *
          </label>

          <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border-2 border-dashed border-stone-300 bg-[#FAF7F2] p-6 text-center transition hover:border-[#9A4A12]">
            {imageUrl ? (
              <div className="flex flex-col items-center space-y-2">
                <img src={imageUrl} alt="Uploaded item" className="h-28 w-36 rounded-2xl border border-stone-200 object-cover" />
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700">
                  <Check className="h-4 w-4" />
                  <span>Hosted on ImgBB</span>
                </div>
                <label className="cursor-pointer text-xs font-bold text-[#D91E18] hover:underline">
                  Replace image
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#9A4A12] shadow-sm">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <label className="cursor-pointer text-sm font-bold text-[#18120E] hover:text-[#D91E18] hover:underline">
                  {uploadingImage ? 'Uploading...' : 'Choose image file'}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-[#6E6259]">PNG, JPG, or WEBP up to 10MB</span>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-stone-100 pt-4">
          <button
            type="submit"
            disabled={submitting || uploadingImage || !imageUrl}
            className="cursor-pointer rounded-2xl bg-[#D91E18] px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-[#b81712] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
