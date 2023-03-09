import React, { useState } from 'react';
import Image from 'next/image';
import img from '../public/images/placeholder-square.png';

interface Props {
  id: string;
  addClasses?: string;
}

function ImageWithFallback({ id, addClasses = '' }: Props) {
  // AWS Cloudfront CDN url base
  const fallbackSrc = img.src;
  const imgBase = 'https://d299jx99qoogrq.cloudfront.net/';
  const [imgSrc, setImgSrc] = useState(imgBase + id + '.webp');

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
