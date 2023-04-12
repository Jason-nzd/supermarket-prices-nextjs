import { Popover, Transition } from '@headlessui/react';
import _ from 'lodash';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { categoryNames } from '../pages/products/[category]';
import StarFavourite from './StarFavourite';

interface Props {
  updateNavCategories: (arg: string[]) => void;
}

function CategorySelectMenu({ updateNavCategories }: Props) {
  function setCategoriesCookie() {
    document.cookie = `User_Categories=${JSON.stringify(userCategories)};path='/'`;
  }

  // Set default favourite categories
  const [userCategories, setUserCategories] = useState<string[]>([
    'milk',
    'eggs',
    'fruit',
    'fresh-vegetables',
    'frozen-chips',
  ]);

  // Try read and set user categories cookie
  useEffect(() => {
    const readCookie = document.cookie
      .split('; ')
      .find((element) => element.startsWith('User_Categories='))
      ?.split('=')[1];
    if (readCookie) setUserCategories(JSON.parse(readCookie));
  }, []);

  // Send categories to parent navbar
  updateNavCategories(userCategories);

  // Functions favCategory and unFavCategory will be called by child components
  const favCategory = (category: string): void => {
    setUserCategories(userCategories.concat([category]));
    updateNavCategories(userCategories);
    setCategoriesCookie();
  };

  const unFavCategory = (category: string) => {
    setUserCategories(
      userCategories.filter((c) => {
        return c !== category;
      })
    );
    updateNavCategories(userCategories);
    setCategoriesCookie();
  };

  return (
    <Popover className='absolute z-50'>
      <Popover.Button
        className='bg-green-300 rounded-3xl px-4 py-1 
      hover:bg-green-100 hover:shadow-md transition-colors text-green-800'
      >
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
        <Popover.Panel
          className='mt-1 -ml-8 bg-zinc-100 py-2 px-4 
        grid grid-cols-1 w-fit rounded-2xl shadow-2xl'
        >
          {['milk', 'eggs', 'fruit'].concat(categoryNames).map((categoryName) => {
            const href = '/products/' + categoryName;
            return (
              <div className='flex gap-x-2 items-center' key={categoryName}>
                <StarFavourite
                  category={categoryName}
                  favCategory={favCategory}
                  unFavCategory={unFavCategory}
                  isFavourite={userCategories.includes(categoryName)}
                />
                <Link
                  className=' text-slate-800 m-0 py-1 px-2 rounded-2xl 
                  hover:shadow-md hover:bg-green-100'
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

export default CategorySelectMenu;
