import React from 'react';

function NavBar() {
  const productCategories: string[] = ['Milk', 'Eggs', 'Meat', 'Bread', 'Fruit', 'Vegetables'];
  return (
    <nav className='relative bg-gray-800'>
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
          <div className='absolute inset-x-0 z-20 w-full px-6 py-2 transition-all duration-300 ease-in-out bg-white top-24 dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center'>
            <div className='flex flex-col md:flex-row md:mx-1'>
              <a
                className='my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform hover:text-blue-600 hover:underline md:mx-4 md:my-0'
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

        <div className='py-3 mt-3 -mx-3 overflow-y-auto whitespace-nowrap scroll-hidden'>
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
          <form action=''>
            <input type='text' name='' id='' placeholder='Search' />
            <button type='submit'>Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
