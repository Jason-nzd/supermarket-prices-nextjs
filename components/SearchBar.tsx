import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/search?query=' + searchQuery);
  };

  const handleButton = () => {
    // todo add popup modal
  };

  const smallSearchBar = useMediaQuery('980px');

  return (
    <>
      <div className='flex rounded-2xl border-2 border-[#75F3A3] h-8 w-fit  transition-all duration-500'>
        <form onSubmit={handleSearch} className='flex'>
          <input
            type='text'
            name='search'
            id='search'
            required
            placeholder='Search'
            minLength={3}
            maxLength={26}
            className='bg-transparent w-[0.5rem] xl:w-full focus:outline-none text-white
             pl-3 placeholder-[#75F3A3] align-center transition-all duration-500'
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className='ml-auto'>
            {!smallSearchBar && (
              <button type='submit' title='Search' className='hover-to-white'>
                {magnifyIcon}
              </button>
            )}
            {smallSearchBar && (
              <button
                type='button'
                onClick={handleButton}
                title='Search'
                className='hover-to-white'
              >
                {magnifyIcon}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

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
