import Image from 'next/image';
import React from 'react';
import cdlogo from '../public/images/cd-logo-64.png';
import whlogo from '../public/images/wh-logo-64.png';
import pklogo from '../public/images/pk-logo-64.png';

interface Props {
  sourceSite: string;
}

export default function StoreIcon({ sourceSite }: Props) {
  switch (sourceSite) {
    case 'countdown':
      return <Image src={cdlogo} width={60} alt='Countdown Logo' />;

    case 'warehouse':
      return <Image src={whlogo} alt='Countdown Logo' />;

    case 'paknsave':
      return <Image src={pklogo} alt='Countdown Logo' />;

    default:
      return <></>;
  }
}
