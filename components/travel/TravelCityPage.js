'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';

import { db } from '@/lib/firebase';
import Overlay from '@/components/travel/Overlay';

export default function TravelCityPage() {
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
          router.push('/travel');
          return;
        }

        const cityDoc = querySnapshot.docs[0];
        const cityData = { id: cityDoc.id, ...cityDoc.data() };

        const imagesColRef = collection(db, 'locations', cityDoc.id, 'images');
        const imageSnapshot = await getDocs(imagesColRef);
        const imageData = imageSnapshot.docs.map((doc) => doc.data());

        imageData.sort((a, b) => {
          const aHasDate = a.imageDate && a.imageDate.seconds;
          const bHasDate = b.imageDate && b.imageDate.seconds;

          if (aHasDate && bHasDate) return a.imageDate.seconds - b.imageDate.seconds;
          if (aHasDate) return -1;
          if (bHasDate) return 1;
          return 0;
        });

        const fetchedImageUrls = imageData
          .map((data) => data.downloadURL)
          .filter(Boolean);

        setOverlayCity({
          ...cityData,
          images: fetchedImageUrls.length > 0 ? fetchedImageUrls : ['NA'],
        });
        setCurrentSlide(0);
      } catch (error) {
        console.error('Failed to load travel city', error);
        router.push('/travel');
      }
    };

    fetchCityData();
  }, [params, router]);

  return (
    <Overlay
      overlayCity={overlayCity}
      currentSlide={currentSlide}
      handleClose={() => router.push('/travel')}
      handleNext={() => undefined}
      handlePrev={() => undefined}
      onSlideChange={setCurrentSlide}
    />
  );
}
