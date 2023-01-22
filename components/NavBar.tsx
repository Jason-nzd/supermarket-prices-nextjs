import React from 'react';

function NavBar() {
  const productCategories: string[] = ['Milk', 'Eggs', 'Meat', 'Bread', 'Fruit', 'Vegetables'];
  return (
    <nav className='relative bg-black bg-opacity-50 w-[70%] mx-auto'>
      <div className='container px-6 py-3 mx-auto'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <a
                className='text-2xl font-bold text-gray-800 transition-colors duration-300 transform dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300'
                href='#'
              >
                Food Price Check
              </a>
            </div>
          </div>

          {/* Top-right menu */}
          <div className='absolute inset-x-0 z-20 w-full px-6 py-2 transition-all duration-300 ease-in-out md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center'>
            <div className='flex flex-col md:flex-row md:mx-1'>
              <a
                className='my-2 text-sm leading-5 text-gray-700 dark:text-black transition-colors duration-300 transform hover:text-blue-600 hover:underline md:mx-4 md:my-0'
                href='#'
              >
                Login
              </a>
              <a
                className='my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform hover:text-blue-600 hover:underline md:mx-4 md:my-0'
                href='#'
              >
                Cart
              </a>
              <a
                className='my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform hover:text-blue-600 hover:underline md:mx-4 md:my-0'
                href='#'
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* <div className='flex py-3 mt-3 -mx-3'> */}
        <div className='flex mt-3 -mx-3'>
          <div className='mt-3'>
            <a
              className='mx-4 text-md text-white transition-colors duration-300 hover:text-green-300 md:my-0'
              href='#'
            >
              Milk
            </a>
            <a
              className='mx-4 text-md text-white transition-colors duration-300 hover:text-green-300 md:my-0'
              href='#'
            >
              Eggs
            </a>
            <a
              className='mx-4 text-md text-white transition-colors duration-300 hover:text-green-300 md:my-0'
              href='#'
            >
              Bread
            </a>
            <a
              className='mx-4 text-md text-white transition-colors duration-300 hover:text-green-300 md:my-0'
              href='#'
            >
              Meat
            </a>
            <a
              className='mx-4 text-md text-white transition-colors duration-300 hover:text-green-300 md:my-0'
              href='#'
            >
              Fruit
            </a>
            <a
              className='mx-4 text-md text-white transition-colors duration-300 hover:text-green-300 md:my-0'
              href='#'
            >
              Vegetables
            </a>
          </div>

          <div className='ml-8 rounded-2xl border-slate-400 border-2'>
            <form action=''>
              <input
                type='text'
                name=''
                id=''
                placeholder='Search'
                className='bg-transparent text-white ml-4 mr-2 mt-1.5 align-top'
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
      </div>
    </nav>
  );
}

export default NavBar;
