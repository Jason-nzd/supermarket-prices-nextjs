import React, { useState } from 'react';
import Image from 'next/image';
import fallbackImg from '../public/images/placeholder-square.png';

interface Props {
  id: string;
  width: number;
  addClasses?: string;
}

// This is a modified replacement for <Image />
// It will try to load a product image using 'id' as the filename,
//  if nothing is found it will fallback to a placeholder image.
function ImageWithFallback({ id, width = 200, addClasses = '' }: Props) {
  const fallbackSrc = fallbackImg.src;
  const imagesHost = process.env.IMAGES_PATH || 'https://images.kiwiprice.xyz/';
  const [imgSrc, setImgSrc] = useState(imagesHost + 'product-images/200/' + id + '.webp');

  return (
    <Image
      src={imgSrc}
      alt=''
      className={addClasses}
      width={width}
      height={width}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}

export default ImageWithFallback;
