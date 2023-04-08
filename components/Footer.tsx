import Link from 'next/link';
import React from 'react';

function Footer() {
  return (
    <footer className='py-6 w-full h-full text-green-200 text-sm'>
      <div className='flex mx-auto w-fit font-semibold'>
        Prices are updated with best effort, but aren't guaranteed to be accurate for each store.
      </div>
      <div className='flex mx-auto py-2 justify-center'></div>
      <div className='py-1 flex gap-2 mx-auto justify-center'>
        Icons licensed from
        <Link href='https://icon-icons.com' className='hover-to-white'>
          icon-icons.com
        </Link>
        <Link href='https://icons.getbootstrap.com/' className='hover-to-white'>
          icons.getbootstrap.com
        </Link>
      </div>
      <div className='flex mx-auto gap-8 pt-4 w-fit'>
        <div>©2023 jb</div>
        <div>All Rights Reserved</div>
        <Link href='#' className='hover-to-white'>
          Privacy Policy
        </Link>
        <Link
          className='flex gap-2 hover-to-white items-center'
          href='https://github.com/jason-nzd/supermarket-prices'
        >
          {githubIcon} GitHub
        </Link>
      </div>
    </footer>
  );
}

const githubIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='4'
    height='4'
    fill='currentColor'
    className='w-4 h-4'
    viewBox='0 0 16 16'
  >
    <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z' />
  </svg>
);

export default Footer;
