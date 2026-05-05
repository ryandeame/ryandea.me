'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';

import { db } from '@/lib/firebase';
import BeenToBoxCarouselOverlay from '@/components/been-to/BeenToBoxCarouselOverlay';

export default function BeenToBoxCityPage() {
  const params = useParams();
  const router = useRouter();
  const [overlayCity, setOverlayCity] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const citySlug = params?.slug;

    if (typeof citySlug !== 'string' || citySlug.length === 0) {
      return;
    }

    const fetchCityData = async () => {
      try {
        const locationsCol = collection(db, 'locations');
        const cityQuery = query(locationsCol, where('slug', '==', citySlug));
        const querySnapshot = await getDocs(cityQuery);

        if (querySnapshot.empty) {
          router.push('/been-to-box');
          return;
        }

        const cityDoc = querySnapshot.docs[0];
        const cityData = { id: cityDoc.id, ...cityDoc.data() };
        const imagesColRef = collection(db, 'locations', cityDoc.id, 'images');
        const imageSnapshot = await getDocs(imagesColRef);
        const imageData = imageSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        imageData.sort((a, b) => {
          const aHasDate = a.imageDate && a.imageDate.seconds;
          const bHasDate = b.imageDate && b.imageDate.seconds;

          if (aHasDate && bHasDate) return a.imageDate.seconds - b.imageDate.seconds;
          if (aHasDate) return -1;
          if (bHasDate) return 1;
          return 0;
        });

        const fetchedImages = imageData
          .filter((data) => typeof data.downloadURL === 'string' && data.downloadURL.length > 0)
          .map((data) => ({
            downloadURL: data.downloadURL,
            height: data.height ?? data.imageHeight ?? null,
            id: data.id,
            storagePath: data.storagePath ?? '',
            width: data.width ?? data.imageWidth ?? null,
          }));

        setOverlayCity({
          ...cityData,
          images: fetchedImages,
        });
        setCurrentSlide(0);
      } catch (error) {
        console.error('Failed to load Been-To-Box city', error);
        router.push('/been-to-box');
      }
    };

    fetchCityData();
  }, [params, router]);

  return (
    <BeenToBoxCarouselOverlay
      overlayCity={overlayCity}
      currentSlide={currentSlide}
      handleClose={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push('/been-to-box');
      }}
      onSlideChange={setCurrentSlide}
    />
  );
}
