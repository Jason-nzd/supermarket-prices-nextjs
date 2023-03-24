import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log('searched ' + searchQuery);
    router.push('/search?query=' + searchQuery);
  };

  return (
    <>
      <div className='flex rounded-2xl border-2 border-[#75F3A3] h-8 min-w-[3rem] w-fit place-items-center'>
        <form onSubmit={handleSearch}>
          <input
            type='text'
            name='search'
            id='search'
            required
            placeholder='Search'
            minLength={3}
            maxLength={40}
            className='bg-transparent focus:outline-none text-white pl-4 placeholder-[#75F3A3] align-top'
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type='submit' title='Search' className='pb-1'>
            {magnifyIcon}
          </button>
        </form>
        {/* <div onClick={() => console.log('asf clicked')}>asf</div> */}
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
