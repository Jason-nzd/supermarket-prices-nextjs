import _ from 'lodash';
import Link from 'next/link';
import React, { useState } from 'react';
import { categoryNames } from '../pages/products/[category]';

// let [searchQuery, setSearchQuery] = React.useState('');

let fullyStaticMode = true;

function NavBar() {
  return (
    <div className='nav'>
      <nav className='mx-auto px-6 py-3 w-[70%]'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
          {/* Brand Title */}
          <div className='flex items-center'>
            <Link
              className='mt-2 mb-2 text-2xl font-bold text-stone-200 transition-colors
             duration-300 transform hover:text-white'
              href='/'
            >
              Supermarket Price History
            </Link>
          </div>

          {/* Top-right corner menu */}
          <div
            className='absolute inset-x-0 z-20 w-full px-6 py-2 transition-all duration-300
         ease-in-out md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100
          md:translate-x-0 md:flex md:items-center'
          >
            <div className='flex flex-col md:flex-row md:mx-1'>
              <Link className='nav-small-link' href='#'>
                {/* User Icon */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                Login
              </Link>
              <Link className='nav-small-link' href='#'>
                {/* Cart Icon */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>
                Cart
              </Link>
              <Link
                className='nav-small-link'
                href='https://github.com/Jason-nzd/supermarket-prices'
              >
                {/* Rocket Ship Icon */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z'
                  />
                </svg>
                GitHub
              </Link>
              <Link className='nav-small-link' href='/admin'>
                <div className=''>
                  {/* Table Icon */}
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      d='M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5'
                    />
                  </svg>
                  Admin
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className='flex items-center -mx-3.5 mt-2 w-5/6'>
          {categoryNames.map((name) => {
            const link = '/products/' + name;
            return (
              <Link className='nav-main-link' href={link}>
                {_.startCase(name)}
              </Link>
            );
          })}
          {/* Add custom category with plus icon */}
          <button type='button' title='Add'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1'
              stroke='currentColor'
              className='w-8 h-8 pt-1 nav-main-link'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </button>

          {/* Search Bar */}
          <div className='ml-8 rounded-2xl mt-1 border-2 border-[#75F3A3] h-8'>
            <input
              type='text'
              name='search'
              id='search'
              required
              placeholder='Search'
              minLength={3}
              maxLength={40}
              className='bg-transparent text-white pl-4 placeholder-[#75F3A3]'
              onChange={(value) => {
                console.log(value);
              }}
            />
            <button type='button' title='Search'>
              {/* Magnify Icon */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
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
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
