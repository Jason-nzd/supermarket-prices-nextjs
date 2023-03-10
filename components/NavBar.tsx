import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { categoryNames } from '../pages/products/[category]';
import kiwifruit from '../public/android-chrome-192x192.png';

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  }, []);

  const handleSearch = () => {
    //router.push('/products/milk-deals');
  };

  const ok = Date();

  return (
    <nav className='py-1.5 w-full'>
      <div className='mx-auto lg:w-[100%] 2xl:w-[70%] transition-all duration-500'>
        {/* Title on left for wide, center for mobile, login/cart menu on right */}
        <div className='flex w-full pl-2 xl:pl-4 items-center'>
          {/* Mobile burger menu */}
          <div className='lg:hidden text-primary-colour hover-to-white cursor-pointer'>
            {burgerIcon}
          </div>

          {/* Brand Icon & Title */}
          <Link href='/' className='flex w-fit ml-auto lg:ml-0'>
            <Image
              src={kiwifruit}
              alt=''
              className='w-9 pr-1 duration-200 hover:rotate-12 hover:scale-[102%]'
            />
            <h1 className='text-2xl font-bold text-stone-100 hover-to-white hover:scale-[102%]'>
              KiwiPrice.xyz
            </h1>
          </Link>

          {/* Sub Title */}
          <h3 className='hidden lg:block ml-8 pt-2.5 text-sm select-none h-8 font-bold text-stone-200'>
            Comparing the cost of food across New Zealand - Updated on {Date().substring(4, 15)}
          </h3>

          {/* Top-right corner menu - wide */}
          <div className='hidden lg:flex ml-auto mr-2 bg-red'>
            {/* <button onClick={() => {}}>Theme</button> */}
            <Link className='nav-small-link' href='#'>
              {userIcon}
              Login
            </Link>
            <Link className='nav-small-link' href='#'>
              {cartIcon}
              Cart
            </Link>
            <Link className='nav-small-link' href='/admin'>
              {tableIcon}
              Admin
            </Link>
          </div>

          {/* Top-right corner menu - mobile */}
          <div className='lg:hidden ml-auto'>
            <Link className='nav-small-link' href='#'>
              {userIcon}
            </Link>
          </div>
        </div>

        {/* Categories and Search Section */}
        <div className='hidden lg:flex flex-wrap pb-1 pl-1 xl:pl-4 w-full h-10 overflow-hidden'>
          {/* Categories */}
          <div className='flex items-center place-content-start overflow-hidden h-8 gap-x-1'>
            <Link className='nav-main-link' href='/products/milk'>
              Milk
            </Link>
            <Link className='nav-main-link' href='/products/eggs'>
              Eggs
            </Link>
            <Link className='nav-main-link' href='/products/bread'>
              Bread
            </Link>
            <Link className='nav-main-link' href='/products/fruit'>
              Fruit
            </Link>
            {categoryNames.map((name) => {
              const link = '/products/' + name;
              return (
                <Link className='nav-main-link' href={link} key={link}>
                  {_.startCase(name)}
                </Link>
              );
            })}
          </div>
          <div>
            {/* Add custom category with plus icon */}
            <button type='button' title='Add'>
              {plusIcon}
            </button>
          </div>
          <div className='w-fit flex flex-wrap'>
            {/* Search Bar */}
            <div className='flex flex-wrap rounded-2xl border-2 border-[#75F3A3] h-8'>
              <input
                type='text'
                name='search'
                id='search'
                required
                placeholder='Search'
                minLength={3}
                maxLength={40}
                className='bg-transparent focus:outline-none text-white pl-4 placeholder-[#75F3A3] align-top'
                onChange={onChange}
                onSubmit={handleSearch}
                value={searchQuery}
              />
              <div className=''>
                <button type='button' title='Search' onClick={handleSearch}>
                  {magnifyIcon}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const burgerIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    fill='currentColor'
    className='w-6 h-6'
    viewBox='0 0 16 16'
  >
    <path
      fillRule='evenodd'
      d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'
    />
  </svg>
);

const userIcon = (
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
    stroke='#75F3A3'
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
