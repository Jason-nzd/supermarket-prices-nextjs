import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { categoryNames } from '../pages/products/[category]';
import kiwifruit from '../public/images/kiwifruit.png';

const NavBar = () => {
  //const isWidePage = useMediaQuery('(min-width: 960px)');
  const isWidePage = true;
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  }, []);

  const handleSearch = () => {
    //router.push('/products/milk-deals');
  };

  return (
    <div className='nav'>
      <nav className='mx-auto pt-0 xl:pt-0.5 px-1 w-full 2xl:w-[70%]'>
        {/* Div containing title on left, login/cart menu on right */}
        <div className='flex mt-0 items-center pl-2 xl:pl-4'>
          {searchQuery}
          {/* <div className='xl:hidden'>BB</div> */}

          {/* Brand Title */}
          <Link href='/' className='flex flex-wrap items-center min-w-fit'>
            <Image
              src={kiwifruit}
              alt=''
              className='w-8 lg:w-10 xl:w-12 pr-1 duration-200 hover:rotate-12 hover:scale-[102%]'
            />
            <h1
              className='text-xl lg:text-2xl xl:text-3xl font-bold text-stone-100 
              hover-to-white hover:scale-[102%]'
            >
              KiwiPrice.xyz
            </h1>
          </Link>

          {/* Sub Title */}
          <h3
            className='ml-8 pt-2 text-[0.2em] md:text-xs lg:text-sm select-none h-8 
          duration-500 transition-all font-bold sm:text-stone-200 overflow-hidden'
          >
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
            <Link className='nav-small-link' href='/admin'>
              {tableIcon}
              Admin
            </Link>
          </div>
        </div>

        {/* Categories Section */}
        {isWidePage && (
          <div className='flex flex-wrap items-center items-justify -mx-3.5 pb-3 overflow-hidden pl-2 xl:pl-4'>
            <Link className='nav-main-link' href='/products/milk-deals'>
              Milk
            </Link>
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
            <div className='flex flex-wrap ml-8 rounded-2xl border-2 border-[#75F3A3] h-8 mr-4'>
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
                value={searchQuery}
              />
              <div className=''>
                <button type='button' title='Search' onClick={handleSearch}>
                  {magnifyIcon}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

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
