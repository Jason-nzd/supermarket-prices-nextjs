import Link from 'next/link';
import React, { useState } from 'react';

// let [searchQuery, setSearchQuery] = React.useState('');

let fullyStaticMode = true;

function NavBar() {
  return (
    <nav className='mx-auto px-6 py-3 w-[65%]'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
        {/* Brand Title */}
        <div className='flex items-center'>
          <Link
            className='mt-2 mb-2 text-2xl font-bold text-stone-200 transition-colors duration-300 transform hover:text-white'
            href='/'
          >
            Supermarket Price History
          </Link>
        </div>

        {/* Top-right corner menu */}
        <div className='absolute inset-x-0 z-20 w-full px-6 py-2 transition-all duration-300 ease-in-out md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center'>
          <div className='flex flex-col md:flex-row md:mx-1'>
            <Link className='nav-small-link' href='#'>
              Login
            </Link>
            <Link className='nav-small-link' href='#'>
              Cart
            </Link>
            <Link className='nav-small-link' href='https://github.com/Jason-nzd/supermarket-prices'>
              GitHub
            </Link>
            <Link className='nav-small-link' href='/admin'>
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className='flex -mx-3'>
        <div className='mt-2'>
          <Link className='nav-main-link' href='search?terms=milk'>
            Milk
          </Link>
          <Link className='nav-main-link' href='search?terms=Eggs'>
            Eggs
          </Link>
          <Link className='nav-main-link' href='search?terms=Bread'>
            Bread
          </Link>
          <Link className='nav-main-link' href='search?terms=Meat'>
            Meat
          </Link>
          <Link className='nav-main-link' href='search?terms=Fruit'>
            Fruit
          </Link>
          <Link className='nav-main-link' href='search?terms=Vegetables'>
            Vegetables
          </Link>
          <Link className='nav-main-link' href='search?terms=Ice Cream'>
            Ice Cream
          </Link>
        </div>

        <div className='ml-8 rounded-2xl border-slate-400 border-2'>
          <form action='/search' method='post'>
            <input
              type='text'
              name='search'
              id='search'
              required
              placeholder='Search'
              minLength={3}
              maxLength={40}
              className='bg-transparent text-white ml-4 mr-2 mt-1.5 align-top'
              onChange={(value) => {
                console.log(value);
              }}
            />
            <button type='submit' title='search'>
              {/* Magnify icon from heroicons */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='white'
                className='w-6 h-6 mr-2 mt-1.5 align-top hover:scale-110'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
