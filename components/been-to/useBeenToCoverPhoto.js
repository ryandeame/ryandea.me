'use client';

import { useCallback, useState } from 'react';

import { useAuth } from '@/components/auth/AuthProvider';

const CACHE_KEY = 'been-to-box:locations-cache:v1';
const COVER_UPDATED_KEY = 'been-to-box:cover-updated';

export function useBeenToCoverPhoto() {
  const { getFreshIdToken, user } = useAuth();
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const updateCoverPhoto = useCallback(async ({ image, locationId }) => {
    if (!locationId || !image?.downloadURL) {
      throw new Error('A location and image are required to update the cover photo.');
    }

    setError(null);
    setSaving(true);

    try {
      if (!user) {
        throw new Error('Sign in before updating cover photos.');
      }

      const token = await getFreshIdToken();

      if (!token) {
        throw new Error('Sign in before updating cover photos.');
      }

      const response = await fetch('/api/been-to-box/cover-photo', {
        body: JSON.stringify({
          image: {
            downloadURL: image.downloadURL,
            height: Number(image.height ?? 0) || null,
            id: image.id,
            storagePath: image.storagePath ?? '',
            width: Number(image.width ?? 0) || null,
          },
          locationId,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Unable to update cover photo.');
      }

      window.localStorage.removeItem(CACHE_KEY);
      window.sessionStorage.removeItem('been-to-box:image-dimensions:v2');
      window.sessionStorage.setItem(COVER_UPDATED_KEY, '1');
    } catch (updateError) {
      setError(updateError);
      throw updateError;
    } finally {
      setSaving(false);
    }
  }, [getFreshIdToken, user]);

  return {
    error,
    saving,
    updateCoverPhoto,
  };
}
