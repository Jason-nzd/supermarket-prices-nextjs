import Image from 'next/image';
import React from 'react';
import cdlogo from '../public/images/cd-logo-64.png';
import whlogo from '../public/images/wh-logo-64.png';
import pklogo from '../public/images/pk-logo-64.png';

interface Props {
  sourceSite: string;
  width: number;
}

export default function StoreIcon({ sourceSite, width = 60 }: Props) {
  switch (sourceSite) {
    case 'countdown.co.nz':
      return <Image src={cdlogo} width={width} alt='Countdown Logo' />;

    case 'thewarehouse.co.nz':
      return <Image src={whlogo} width={width} alt='Warehouse Logo' />;

    case 'paknsave.co.nz':
      return <Image src={pklogo} width={width} alt='PaknSave Logo' />;

    default:
      console.log('<StoreIcon /> not found for ' + sourceSite);
      return <></>;
  }
}
