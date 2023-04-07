import { Popover, Transition } from '@headlessui/react';
import React from 'react';
import { categoryNames } from '../pages/products/[category]';
import Link from 'next/link';
import _ from 'lodash';
import { burgerIcon } from './NavBar';

export default function MobileBurgerMenu() {
  return (
    <Popover className='text-xl '>
      <Popover.Button className='left-1 top-1 text-primary-colour hover-to-white cursor-pointer'>
        {burgerIcon}
      </Popover.Button>
      <Transition
        enter='transition duration-100 ease-out'
        enterFrom='transform scale-50 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-75 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-50 opacity-0'
      >
        <Popover.Panel className='mt-1 bg-zinc-100 p-4 grid grid-cols-1 w-fit rounded-2xl shadow-2xl text-slate-800'>
          {['milk', 'eggs', 'fruit'].concat(categoryNames).map((categoryName) => {
            const href = '/products/' + categoryName;
            return (
              <div className='flex gap-x-2 items-center' key={categoryName}>
                <Link
                  className='py-2 px-6 rounded-2xl w-full hover:shadow-md hover:bg-green-100'
                  href={href}
                >
                  {_.startCase(categoryName)}
                </Link>
              </div>
            );
          })}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
