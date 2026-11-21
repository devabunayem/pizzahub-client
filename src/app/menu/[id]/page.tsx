'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  ArrowLeft,
  AlertCircle,
  Crown,
  X,
  ArrowUpRight,
  Flame,
  Heart,
  Star,
  MessageSquare,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { ItemDetailSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/lib/toast';
import { useFavorites } from '@/hooks/useFavorites';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token, isLoading: authLoading } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [ordering, setOrdering] = useState<boolean>(false);

  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=/menu/${id}`);
    }
  }, [user, authLoading, router, id]);

  useEffect(() => {
    if (authLoading || !user || !id) return;

    const fetchItem = async () => {
      setErrorMsg(null);
      setLoading(true);
      try {
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await fetch(`${API_BASE}/menu/${id}`, { headers });
        const data = await res.json();
        if (data.success && data.item) {
          setItem(data.item);
        } else {
          setErrorMsg(data.message || 'Menu item not found.');
        }
      } catch (err: any) {
        setErrorMsg('Failed to load menu item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, token, user, authLoading]);

  useEffect(() => {
    if (!item || !user) return;
    const existingReview = (item.reviews || []).find(
      (r: any) => String(r.userId) === String(user._id)
    );
    if (existingReview) {
      setReviewRating(existingReview.rating);
      setReviewComment(existingReview.comment);
    }
  }, [item, user]);

  if (authLoading || (loading && !errorMsg)) {
    return (
      <div className="min-h-[80vh] bg-[#FAF7F2]">
        <ItemDetailSkeleton />
      </div>
    );
  }

  if (errorMsg || !item) {
    return (
      <div className="min-h-[80vh] bg-[#FAF7F2] py-16">
        <div className="site-container">
          <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-[0_18px_40px_-20px_rgba(24,18,14,0.16)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#D91E18]">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl uppercase text-[#18120E]">
              Item Not Found
            </h2>
            <p className="text-sm text-[#6E6259]">
              {errorMsg || 'The menu item you are looking for does not exist or has been removed.'}
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-[#18120E] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#D91E18]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Browse Menu</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isVendor = user?.role === 'vendor';
  const isVendorOfItem = user?._id === item.vendorId?._id;
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';
  const isApproved = item.status === 'approved';
  const isPremiumVendor =
    item.vendorId?.subscriptionPlan === 'premium' &&
    (!item.vendorId?.subscriptionExpiresAt ||
      new Date(item.vendorId.subscriptionExpiresAt) > new Date());

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAddress = deliveryAddress.trim();
    const cleanMessage = message.trim();

    if (!deliveryDate || !cleanAddress) {
      toast.error(
        !deliveryDate
          ? 'Please specify a delivery date.'
          : 'Delivery address cannot be empty.'
      );
      return;
    }

    if (cleanAddress.length > 300) {
      toast.error('Delivery address must be 300 characters or fewer.');
      return;
    }

    if (cleanMessage.length > 500) {
      toast.error('Special instructions must be 500 characters or fewer.');
      return;
    }

    setOrdering(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: item._id,
          deliveryDate,
          deliveryAddress: cleanAddress,
          message: cleanMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Failed to place order.');
      } else {
        toast.success('Order placed successfully.');
        setOrderModalOpen(false);
        router.push('/dashboard/customer');
      }
    } catch (err) {
      toast.error('Network error. Unable to place order.');
    } finally {
      setOrdering(false);
    }
  };

  const images =
    item.images && item.images.length > 0
      ? item.images
      : ['/images/cat-classic.jpg'];

  const vendorName = item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen';
  const favorited = isFavorite(item._id);
  const reviews: any[] = Array.isArray(item.reviews)
    ? [...item.reviews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];
  const hasReviewed = Boolean(
    user && reviews.some((r) => String(r.userId) === String(user._id))
  );

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanComment = reviewComment.trim();
    if (!cleanComment) {
      toast.error('Please write a comment before submitting your review.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE}/menu/${item._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: cleanComment,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Could not submit review.');
      } else {
        setItem(data.item);
        toast.success(hasReviewed ? 'Your review was updated.' : 'Thanks for reviewing!');
      }
    } catch {
      toast.error('Network error while submitting review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <section className="min-h-[78vh] bg-[#FAF7F2] py-7 md:py-10">
      <div className="site-container space-y-6">
        {/* Back Link */}
        <div className="mx-auto max-w-5xl">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-bold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Browse Menu</span>
          </Link>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-7 lg:grid-cols-12">
          {/* Left Gallery */}
          <div className="space-y-3 lg:col-span-6">
            <div className="relative aspect-[4/3] max-h-[420px] w-full overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_20px_40px_-22px_rgba(24,18,14,0.18)]">
              <img
                src={images[activeImageIndex]}
                alt={item.itemName}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3.5 top-3.5 rounded-full bg-[#18120E]/85 px-3 py-1 text-[11px] font-semibold text-[#FAF7F2] backdrop-blur-md">
                {item.category}
              </span>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#D91E18] shadow-sm'
                        : 'border-stone-200 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`view-${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Editorial Info Card */}
          <div className="lg:col-span-6">
            <div className="space-y-5 rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[0_18px_40px_-22px_rgba(24,18,14,0.14)]">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
                    <Flame className="h-3.5 w-3.5 text-[#D91E18]" />
                    <span>{item.category}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(item._id, item.itemName)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition cursor-pointer ${
                      favorited
                        ? 'border-[#E50916]/30 bg-rose-50 text-[#E50916]'
                        : 'border-stone-200 bg-[#FAF7F2] text-[#6E6259] hover:border-[#E50916]/40 hover:text-[#E50916]'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${favorited ? 'fill-[#E50916]' : ''}`} />
                    <span>{favorited ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                <h1 className="font-display text-[clamp(1.75rem,2.8vw,2.3rem)] uppercase leading-[1.02] tracking-tight text-[#18120E]">
                  {item.itemName}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="font-display text-2xl tracking-wide text-[#D91E18] tabular-nums">
                    {formatPrice(item.price)}
                  </div>
                  {(item.reviewCount ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-[#9A4A12] tabular-nums">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(item.averageRating || 0).toFixed(1)}</span>
                      <span className="font-medium text-[#6E6259]">
                        ({item.reviewCount} {item.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </span>
                  )}
                </div>

                <p className="pt-0.5 text-sm leading-relaxed text-[#6E6259]">
                  {item.description}
                </p>
              </div>

              {/* Kitchen Card */}
              <div className="space-y-2 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-[#18120E]">
                    {vendorName}
                  </span>
                  {isPremiumVendor && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#9A4A12] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      <Crown className="h-3 w-3 text-amber-200" />
                      <span>Premium</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs font-medium text-[#6E6259]">
                  <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0 text-[#D91E18]" />
                  <span>{item.location}</span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="pt-1">
                {!isApproved ? (
                  <div className="rounded-xl border border-stone-200 bg-[#FAF7F2] p-3.5 text-xs font-medium text-[#6E6259]">
                    This item is currently under admin review or inactive.
                  </div>
                ) : isVendorOfItem ? (
                  <div className="rounded-xl border border-stone-200 bg-[#FAF7F2] p-3.5 text-xs font-medium text-[#6E6259]">
                    You own this listing. Restaurant kitchens cannot order their own items.
                  </div>
                ) : isVendor ? (
                  <div className="rounded-xl border border-stone-200 bg-[#FAF7F2] p-3.5 text-xs font-medium text-[#6E6259]">
                    Vendor accounts cannot place customer orders. Please switch to a customer account.
                  </div>
                ) : isAdmin ? (
                  <div className="rounded-xl border border-stone-200 bg-[#FAF7F2] p-3.5 text-xs font-medium text-[#6E6259]">
                    Administrator accounts cannot place customer food orders.
                  </div>
                ) : isCustomer ? (
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D91E18] py-3 text-sm font-bold text-white shadow-[0_14px_28px_-12px_rgba(217,30,24,0.45)] transition hover:bg-[#b81712] cursor-pointer"
                  >
                    <span>Order Now — {formatPrice(item.price)}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push(`/signin?redirect=/menu/${item._id}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18120E] py-3 text-sm font-bold text-white transition hover:bg-[#D91E18] cursor-pointer"
                  >
                    <span>Sign In to Place Order</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Ratings */}
        <div className="mx-auto max-w-5xl rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[0_18px_40px_-22px_rgba(24,18,14,0.14)]">
          <div className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
                <MessageSquare className="h-3.5 w-3.5 text-[#D91E18]" />
                <span>Verified Diner Feedback</span>
              </div>
              <h2 className="font-display mt-1 text-2xl uppercase text-[#18120E]">
                Customer Reviews &amp; Ratings
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] px-4 py-2.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(item.averageRating || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs font-bold text-[#18120E] tabular-nums">
                {item.reviewCount > 0 ? (
                  <>
                    <span>{Number(item.averageRating || 0).toFixed(1)} / 5</span>
                    <span className="ml-1.5 font-medium text-[#6E6259]">
                      ({item.reviewCount})
                    </span>
                  </>
                ) : (
                  <span className="font-medium text-[#6E6259]">No ratings yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-7 lg:grid-cols-12">
            {/* Write / Update Review Form (Customers on approved items) */}
            <div className="lg:col-span-5">
              {isCustomer && isApproved ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="space-y-4 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-5"
                >
                  <div>
                    <h3 className="text-sm font-extrabold text-[#18120E]">
                      {hasReviewed ? 'Update your review' : 'Rate this dish'}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#6E6259]">
                      {hasReviewed
                        ? 'Adjust your stars or tasting note anytime.'
                        : 'Help fellow diners pick their next wood-fired favorite.'}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                      Your rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= (hoverRating || reviewRating);
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setReviewRating(star)}
                            aria-label={`Rate ${star} stars`}
                            className="rounded-lg p-1 transition hover:scale-110 cursor-pointer"
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                active ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                      <span className="ml-2 text-xs font-bold text-[#18120E] tabular-nums">
                        {reviewRating} / 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                        Tasting note *
                      </label>
                      <span className="text-[11px] text-[#6E6259] tabular-nums">
                        {reviewComment.length}/500
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={500}
                      required
                      placeholder="How was the crust, blistered char, and toppings?"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full rounded-xl bg-[#18120E] py-2.5 text-xs font-bold text-white transition hover:bg-[#D91E18] disabled:opacity-50 cursor-pointer"
                  >
                    {submittingReview
                      ? 'Saving review...'
                      : hasReviewed
                      ? 'Update Review'
                      : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-5 text-xs leading-relaxed text-[#6E6259]">
                  {!isApproved
                    ? 'Reviews open once this dish is approved and active.'
                    : 'Customer accounts can leave star ratings and tasting notes on any approved pizza.'}
                </div>
              )}
            </div>

            {/* Review Feed */}
            <div className="space-y-3 lg:col-span-7">
              {reviews.length === 0 ? (
                <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-[#FAF7F2]/60 px-6 py-10 text-center">
                  <Star className="mb-2 h-6 w-6 text-amber-400" />
                  <p className="text-sm font-bold text-[#18120E]">
                    No reviews yet
                  </p>
                  <p className="mt-1 text-xs text-[#6E6259]">
                    Be the first customer to taste this wood-fired pie and leave a rating.
                  </p>
                </div>
              ) : (
                reviews.map((rev: any, idx: number) => {
                  const initial = (rev.userName || 'D').trim().charAt(0).toUpperCase();
                  return (
                    <div
                      key={rev._id || `${rev.userId}-${idx}`}
                      className="rounded-2xl border border-stone-200/80 bg-[#FAF7F2]/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          {rev.userImage ? (
                            <img
                              src={rev.userImage}
                              alt={rev.userName}
                              className="h-8 w-8 rounded-full object-cover ring-1 ring-stone-200"
                            />
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#9A4A12] ring-1 ring-stone-200">
                              {initial}
                            </span>
                          )}
                          <div>
                            <p className="text-sm font-bold text-[#18120E]">
                              {rev.userName || 'Customer'}
                            </p>
                            {rev.createdAt && (
                              <p className="text-[11px] text-[#6E6259]">
                                {formatDate(rev.createdAt)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3.5 w-3.5 ${
                                s <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#6E6259]">
                        {rev.comment}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18120E]/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_28px_60px_-20px_rgba(24,18,14,0.3)]">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3.5">
              <div>
                <h3 className="text-base font-extrabold tracking-tight text-[#18120E]">
                  Place Your Order
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[#6E6259]">
                  {item.itemName} —{' '}
                  <span className="font-bold text-[#D91E18]">{formatPrice(item.price)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="rounded-xl p-1.5 text-stone-400 transition hover:bg-[#FAF7F2] hover:text-[#18120E] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Delivery date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2 text-sm text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Delivery address *
                </label>
                <input
                  type="text"
                  required
                  maxLength={300}
                  placeholder="Street address, apartment or house number"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Special kitchen instructions (optional)
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="e.g. Extra basil, well-done crust..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-stone-200/80 bg-[#FAF7F2] p-3 text-xs text-[#6E6259]">
                You can settle payment right from your My Orders page after placing the order.
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="flex-1 rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 text-xs font-bold text-[#18120E] transition hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ordering}
                  className="flex-1 rounded-xl bg-[#D91E18] py-2.5 text-xs font-bold text-white transition hover:bg-[#b81712] disabled:opacity-50 cursor-pointer"
                >
                  {ordering ? 'Placing order...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
