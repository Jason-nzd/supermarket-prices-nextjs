import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { categoryNames } from '../pages/products/[category]';
import kiwifruit from '../public/images/kiwifruit.png';

function NavBar() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  }, []);

  return (
    <div className='nav'>
      <nav className='mx-auto pt-0.5 px-1 w-full 2xl:w-[70%]'>
        {/* Div containing title on left, login/cart menu on right */}
        <div className='flex mt-1 items-center'>
          {searchQuery}
          {/* <div className='xl:hidden'>BB</div> */}

          {/* Brand Title */}
          <Link href='/' className='flex flex-wrap items-center min-w-fit'>
            <Image
              src={kiwifruit}
              alt=''
              className='w-12 pr-1 duration-200 hover:rotate-12 hover:scale-[102%]'
            />
            <h1 className='text-3xl font-bold text-stone-100 hover-to-white hover:scale-[102%]'>
              Kiwi Price
            </h1>
          </Link>

          {/* Sub Title */}
          <h3 className='ml-8 pt-2 text-[0.2em] md:text-xs lg:text-sm duration-500 transition-all font-bold sm:text-stone-200 select-none h-8 overflow-hidden'>
            Comparing the cost of food across New Zealand
          </h3>

          {/* Top-right corner menu */}
          <div className='ml-auto flex mt-2 min-w-fit'>
            {/* <button onClick={() => {}}>Theme</button> */}
            <Link className='nav-small-link' href='#'>
              {userIcon}
              Login
            </Link>
            <Link className='nav-small-link' href='#'>
              {cartIcon}
              Cart
            </Link>
            <Link className='nav-small-link' href='https://github.com/Jason-nzd/supermarket-prices'>
              {githubIcon}
              GitHub
            </Link>
            <Link className='nav-small-link' href='/admin'>
              {tableIcon}
              Admin
            </Link>
          </div>
        </div>

        {/* Categories Section */}
        <div className='flex flex-wrap items-center items-justify -mx-3.5 pb-3 overflow-hidden'>
          {categoryNames.map((name) => {
            const link = '/products/' + name;
            return (
              <Link className='nav-main-link' href={link} key={link}>
                {_.startCase(name)}
              </Link>
            );
          })}
          {/* Add custom category with plus icon */}
          <button type='button' title='Add'>
            {plusIcon}
          </button>

          {/* Search Bar */}
          <div className='ml-8 rounded-2xl border-2 border-[#75F3A3] h-8'>
            <input
              type='text'
              name='search'
              id='search'
              required
              placeholder='Search'
              minLength={3}
              maxLength={40}
              className='bg-transparent focus:outline-none text-white pl-4 placeholder-[#75F3A3]'
              onChange={onChange}
              value={searchQuery}
            />
            <button type='button' title='Search'>
              {magnifyIcon}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

const githubIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    fill='currentColor'
    className='w-6 h-6'
    viewBox='0 0 16 16'
  >
    <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z' />
  </svg>
);

const userIcon = (
  <div className='w-6 h-6'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      className='w-6 h-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
      />
    </svg>
  </div>
);

const cartIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    width='16'
    height='16'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    className='w-6 h-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
    />
  </svg>
);

const tableIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    width='16'
    height='16'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    className='w-6 h-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5'
    />
  </svg>
);

const plusIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    width='16'
    height='16'
    viewBox='0 0 24 24'
    strokeWidth='1'
    stroke='currentColor'
    className='w-8 h-8 pt-1 nav-main-link'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
);

const magnifyIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    width='16'
    height='16'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='white'
    className='w-5 h-5 mr-2 pt-1.5 scale-[150%] hover:scale-[160%]'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
    />
  </svg>
);
export default NavBar;
