'use client';

import { useCallback, useState } from 'react';

import { auth } from '@/lib/firebase';

const CACHE_KEY = 'been-to-box:locations-cache:v1';

export function useBeenToCoverPhoto() {
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const updateCoverPhoto = useCallback(async ({ image, locationId }) => {
    if (!locationId || !image?.downloadURL) {
      throw new Error('A location and image are required to update the cover photo.');
    }

    setError(null);
    setSaving(true);

    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;
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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        method: 'POST',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Unable to update cover photo.');
      }

      window.localStorage.removeItem(CACHE_KEY);
    } catch (updateError) {
      setError(updateError);
      throw updateError;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    error,
    saving,
    updateCoverPhoto,
  };
}
