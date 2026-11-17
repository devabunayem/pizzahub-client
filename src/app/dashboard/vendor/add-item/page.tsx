'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  PlusCircle,
  UploadCloud,
  Pizza,
  MapPin,
  Sparkles,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

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

  // File upload to ImgBB
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading('Uploading photo to ImgBB cloud...');

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
        toast.success('Image successfully uploaded!', { id: toastId });
      } else {
        toast.error('Failed to upload image to ImgBB.', { id: toastId });
      }
    } catch (err) {
      console.error('ImgBB upload error:', err);
      toast.error('Network error uploading image to ImgBB.', { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      toast.error('Item image is required. Please upload an image file using ImgBB.');
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
        toast.success('Pizza submitted! Awaiting administrator review.');
        router.push('/dashboard/vendor/menu');
      }
    } catch (err) {
      toast.error('Network error submitting item.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          Add New Menu Item
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Publish a new pizza or side. Submitted items will be reviewed and approved by platform administrators.
        </p>
      </div>

      {/* Free Plan Notice */}
      {user?.subscriptionPlan === 'free' && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              You are on the <strong>Free Plan</strong> (Maximum 3 active items). Want unlimited items?
            </span>
          </div>
          <Link
            href="/dashboard/vendor/subscription"
            className="font-bold underline text-pizza-600 hover:text-pizza-700 ml-2 shrink-0"
          >
            Upgrade to Premium →
          </Link>
        </div>
      )}

      {limitReached && (
        <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 space-y-3">
          <h3 className="font-bold text-red-700 dark:text-red-300">
            Free Plan Limit Reached (3 Items Maximum)
          </h3>
          <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
            Your restaurant has reached the free tier limit of 3 active/pending menu items. To
            publish unlimited pizzas and gain a verified Premium badge, upgrade your plan.
          </p>
          <Link
            href="/dashboard/vendor/subscription"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-pizza-600 text-white font-bold text-xs shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            <span>Upgrade to Premium</span>
          </Link>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6"
      >
        {/* Item Name */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
            Item Name *
          </label>
          <input
            type="text"
            required
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Woodfired Truffle Prosciutto Pizza"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
          />
        </div>

        {/* Category & Price Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Price (USD $) *
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 18.99"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
            Kitchen Location (Area / City) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Brooklyn, New York"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
            Ingredients & Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the sauce, dough fermentation, cheese blend, and signature toppings..."
            className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
          />
        </div>

        {/* ImgBB File Upload (Required by assignment specifications) */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
            Pizza Photo (Required — Upload file to ImgBB) *
          </label>

          <div className="p-6 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-pizza-500 transition-colors flex flex-col items-center justify-center space-y-3 text-center">
            {imageUrl ? (
              <div className="space-y-3 w-full flex flex-col items-center">
                <div className="relative w-48 h-32 rounded-xl overflow-hidden shadow-md">
                  <img src={imageUrl} alt="Uploaded Pizza" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center space-x-2 text-xs text-green-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Image hosted on ImgBB successfully!</span>
                </div>
                <label className="cursor-pointer text-xs font-semibold text-pizza-600 hover:text-pizza-700 underline">
                  Upload another photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-pizza-50 dark:bg-pizza-950/60 text-pizza-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <label className="cursor-pointer font-bold text-sm text-pizza-600 hover:text-pizza-700 underline">
                    {uploadingImage ? 'Uploading to ImgBB...' : 'Click to select pizza image file'}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-stone-400 mt-1">PNG, JPG, or WEBP up to 10MB</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            type="submit"
            disabled={submitting || uploadingImage || !imageUrl}
            className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-pizza-600 to-pizza-500 hover:from-pizza-700 hover:to-pizza-600 text-white font-bold text-sm shadow-md shadow-pizza-500/20 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Submit Menu Item for Approval</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
