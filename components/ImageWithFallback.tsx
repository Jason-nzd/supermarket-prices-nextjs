import React, { useState } from 'react';
import Image from 'next/image';

interface Props {
  id: string;
  addClasses?: string;
}

function ImageWithFallback({ id, addClasses = '' }: Props) {
  // AWS Cloudfront CDN url base
  const transparentImageUrlBase = 'https://d1hhwouzawkav1.cloudfront.net/';
  const fallbackSrc = 'https://d1hhwouzawkav1.cloudfront.net/placeholder-square.png';
  const imgBase = 'https://supermarketimages.s3.ap-southeast-2.amazonaws.com/';
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
