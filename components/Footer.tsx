import Link from 'next/link';
import React from 'react';

function Footer() {
  return (
    <footer className='mt-16 bg-[#0ea40f] w-full text-slate-300 text-sm'>
      <div className='py-4 flex flex-wrap gap-2 mx-auto justify-center'>
        Icons licensed from
        <Link href='https://icons-icons.com' className='hover-to-white'>
          icons-icons.com
        </Link>
        <Link href='https://icons.getbootstrap.com/' className='hover-to-white'>
          icons.getbootstrap.com
        </Link>
      </div>
      <div className='text-center p-4'>
        ©2023 jb - All Rights Reserved -{' '}
        <Link href='#' className='hover-to-white'>
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
