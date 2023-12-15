import React, { useState } from 'react';
import Image from 'next/image';
import fallbackImg from '../public/images/placeholder-square.png';

interface Props {
  id: string;
  src: string;
}

// This is a modified replacement for <Image />
// It will try to load a product image using prop src,
// if nothing is found it will fallback to a placeholder image.
function ImageWithFallback({ src }: Props) {
  const imagesHost = process.env.IMAGES_PATH || 'https://images.kiwiprice.xyz/';
  const [imgSrc, setImgSrc] = useState(imagesHost + src);

  return (
    <Image
      src={imgSrc}
      alt=''
      style={{ objectFit: 'contain' }}
      fill={true}
      onError={() => {
        setImgSrc(fallbackImg.src);
      }}
    />
  );
}

export default ImageWithFallback;
