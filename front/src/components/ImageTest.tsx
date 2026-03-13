'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageTest() {
  const [imageStatus, setImageStatus] = useState<string>('Loading...');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test</h1>
      <div className="mb-4">
        <p>Status: {imageStatus}</p>
      </div>
      <div className="w-64 h-48 border-2 border-gray-300">
        <Image
          src="/assets/heritage-images/img-product-1970-1.webp"
          alt="Test Image"
          width={256}
          height={192}
          className="w-full h-full object-cover"
          onLoad={() => setImageStatus('✅ Image loaded successfully!')}
          onError={() => setImageStatus('❌ Image failed to load')}
        />
      </div>
    </div>
  );
}
