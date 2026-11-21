'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/lib/toast';

const FAVORITES_UPDATED_EVENT = 'pizzahub-favorites-updated';

function readStoredFavorites(storageKey: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const { user } = useAuth();
  const storageKey = `pizzahub_favorites_${user?._id || 'guest'}`;
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(readStoredFavorites(storageKey));

    const handleSync = () => {
      setFavoriteIds(readStoredFavorites(storageKey));
    };

    window.addEventListener(FAVORITES_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [storageKey]);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (id: string, itemName?: string) => {
      if (!id) return;
      const current = readStoredFavorites(storageKey);
      const exists = current.includes(id);
      const next = exists ? current.filter((item) => item !== id) : [...current, id];

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors cleanly
      }

      setFavoriteIds(next);
      window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT));

      const label = itemName ? `"${itemName}"` : 'Item';
      if (exists) {
        toast.info(`${label} removed from favorites.`);
      } else {
        toast.success(`${label} saved to your favorites.`);
      }
    },
    [storageKey]
  );

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    count: favoriteIds.length,
  };
}
