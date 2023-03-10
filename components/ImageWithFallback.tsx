import React, { useState } from 'react';
import Image from 'next/image';
import img from '../public/images/placeholder-square.png';

interface Props {
  id: string;
  addClasses?: string;
}

// This is a modified replacement for <Image />
// It will try to load a product image using 'id' as the filename,
//  if nothing is found it will fallback to a placeholder image.
function ImageWithFallback({ id, addClasses = '' }: Props) {
  const fallbackSrc = img.src;
  const imagesPath = process.env.IMAGES_PATH;
  const [imgSrc, setImgSrc] = useState(imagesPath + id + '.webp');

  // Tailwind classes can be optionally added
  const classesToApply = 'object-contain ' + addClasses;

  return (
    <Image
      src={imgSrc}
      alt=''
      className={classesToApply}
      fill
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}

export default ImageWithFallback;
