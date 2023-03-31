import { Menu, Popover, Transition } from '@headlessui/react';
import _ from 'lodash';
import Link from 'next/link';
import React, { useState } from 'react';
import { categoryNames } from '../pages/products/[category]';
import StarFavourite from './StarFavourite';

function CategorySelectMenu() {
  const [userCategories, setUserCategories] = useState<string[]>();

  return (
    <Popover className='absolute z-50'>
      <Popover.Button className='bg-green-300 rounded-3xl px-4 py-1 hover:bg-green-100 hover:shadow-md transition-colors'>
        More
      </Popover.Button>
      <Transition
        enter='transition duration-100 ease-out'
        enterFrom='transform scale-50 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-75 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-50 opacity-0'
      >
        <Popover.Panel className='mt-1 -ml-8 bg-zinc-100 p-2 grid grid-cols-1 px-4 w-fit rounded-2xl shadow-2xl'>
          {categoryNames.map((categoryName) => {
            const href = '/products/' + categoryName;
            return (
              <div className='flex p-0.5 gap-x-2 items-center' key={categoryName}>
                <StarFavourite category={categoryName} />
                <Link className=' text-slate-800 hover-to-white' href={href}>
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

export default CategorySelectMenu;
