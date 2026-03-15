import React, { useState } from "react";
import Image from "next/image";
import fallbackImg from "../../../public/images/placeholder-square.png";

interface Props {
  id: string;
  src: string;
  desaturate?: boolean;
  priority?: boolean;
}

// This is a modified replacement for <Image />
// It will try to load a product image using prop src,
// if nothing is found it will fallback to a placeholder image.
function ImageWithFallback({
  src,
  desaturate = false,
  priority = false,
}: Props) {
  const imagesHost = process.env.IMAGES_PATH || "https://images.kiwiprice.xyz/";
  const [imgSrc, setImgSrc] = useState(imagesHost + src);
  const tailwindClassnames = desaturate
    ? "saturate-[20%] hover:saturate-100 transition-colors duration-500"
    : "";

  return (
    <Image
      src={imgSrc}
      alt=""
      style={{ objectFit: "contain" }}
      className={tailwindClassnames}
      fill={true}
      priority={priority}
      onError={() => {
        setImgSrc(fallbackImg.src);
      }}
    />
  );
}

export default ImageWithFallback;
