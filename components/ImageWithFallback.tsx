import React, { useState } from 'react';
import Image from 'next/image';
import { transparentImageUrlBase } from '../utilities';

interface Props {
  id: string;
  width: number;
}

function ImageWithFallback({ id, width }: Props) {
  const [imgSrc, setImgSrc] = useState(transparentImageUrlBase + id + '.jpg');

  const fallbackSrc = 'https://d1hhwouzawkav1.cloudfront.net/placeholder.png';

  return (
    <Image
      src={imgSrc}
      alt=''
      width={width}
      height={width}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}

export default ImageWithFallback;
