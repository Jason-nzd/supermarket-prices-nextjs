import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Dialog } from '@headlessui/react';

interface Props {
  iconSize?: number;
  iconHexColour?: string;
}

export default function SearchBar({ iconSize = 5, iconHexColour = 'currentColor' }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  let [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/client-search?query=' + searchQuery, undefined);
  };

  let bigSearchBar = useMediaQuery('1340px');

  const handleMobileButton = () => {
    isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
  };

  const iconClasses =
    'w-' +
    iconSize.toString() +
    ' h-' +
    iconSize.toString() +
    ' mr-2 pt-1.5 scale-[150%] hover:scale-[160%]';
  console.log(iconClasses);
  const magnifyIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      width='24'
      height='16'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke={iconHexColour}
      className={iconClasses}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
      />
    </svg>
  );

  return (
    <>
      {bigSearchBar && (
        <div className='flex rounded-2xl border-2 border-[#75F3A3] h-8 w-fit transition-all duration-500'>
          <form onSubmit={handleSearch} className='flex'>
            <input
              type='text'
              name='search'
              id='search'
              required
              placeholder='Search'
              minLength={3}
              maxLength={26}
              className='bg-transparent w-[0.4rem] xl:w-full focus:outline-none text-white
             pl-3 placeholder-[#75F3A3] align-center transition-all duration-500'
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className='ml-auto hover-to-white text-green-100'>
              <button type='submit' title='Search' className=''>
                {magnifyIcon}
              </button>
            </div>
          </form>
        </div>
      )}
      {!bigSearchBar && (
        <div className=''>
          <button
            type='button'
            onClick={handleMobileButton}
            title='Search'
            className='border-0 hover-to-white '
          >
            {magnifyIcon}
          </button>
        </div>
      )}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className='relative z-50'>
        <div
          className='fixed inset-0 flex items-center justify-center p-2 bg-zinc-100 
            w-fit h-fit mx-auto top-[2.3rem] rounded-3xl shadow-xl text-black'
        >
          <Dialog.Panel>
            <form onSubmit={handleSearch} className='flex'>
              <input
                type='text'
                name='search'
                id='search'
                required
                placeholder='Search'
                minLength={3}
                maxLength={26}
                className='bg-transparent border-2 w-full focus:outline-none
                  px-3 placeholder-grey-400 align-center rounded-3xl'
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className='ml-auto hover-to-white'>
                <button type='submit' title='Search' className='pl-4 text-green-700'>
                  {magnifyIcon}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
