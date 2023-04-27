import React, { useContext, useState } from 'react';
import Image from 'next/image';
import fallbackImg from '../public/images/placeholder-square.png';
import fallbackImgDark from '../public/images/placeholder-square-dark.png';
import { DarkModeContext } from '../pages/_app';

interface Props {
  id: string;
  width: number;
  src: string;
}

// This is a modified replacement for <Image />
// It will try to load a product image using prop src,
//  if nothing is found it will fallback to a placeholder image.
function ImageWithFallback({ width = 200, src }: Props) {
  const fallbackSrc = useContext(DarkModeContext).darkMode ? fallbackImgDark.src : fallbackImg.src;
  const imagesHost = process.env.IMAGES_PATH || 'https://images.kiwiprice.xyz/';
  const [imgSrc, setImgSrc] = useState(imagesHost + src);

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
