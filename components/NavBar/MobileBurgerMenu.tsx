import { Popover, Transition } from '@headlessui/react';
import React from 'react';
import _ from 'lodash';
import { burgerIcon } from './NavBar';
import SubCategoryList from './SubCategoryList';

export default function MobileBurgerMenu() {
  return (
    <Popover className='text-xl'>
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
        <Popover.Panel
          className='mt-1 bg-zinc-100 p-4 grid grid-cols-2 gap-x-2 gap-y-4 rounded-2xl 
        shadow-2xl text-slate-800'
        >
          <SubCategoryList
            subCategoryTitle='Fresh Foods'
            subCategoryNames={['eggs', 'fruit', 'fresh-vegetables', 'bread', 'bread-rolls']}
          />
          <SubCategoryList
            subCategoryTitle='Chilled'
            subCategoryNames={['milk', 'yogurt', 'cheese', 'salami']}
          />
          <SubCategoryList
            subCategoryTitle='Meat'
            subCategoryNames={[
              'seafood',
              'salmon',
              'ham',
              'bacon',
              'beef-lamb',
              'chicken',
              'mince-patties',
            ]}
          />
          <SubCategoryList
            subCategoryTitle='Frozen'
            subCategoryNames={[
              'ice-cream',
              'frozen-chips',
              'frozen-vegetables',
              'frozen-seafood',
              'pies-sausage-rolls',
            ]}
          />
          <SubCategoryList
            subCategoryTitle='Pantry'
            subCategoryNames={[
              'rice',
              'chocolate',
              'cat-food',
              'chips',
              'corn-chips',
              'biscuits',
              'muesli-bars',
            ]}
          />
          <SubCategoryList
            subCategoryTitle='Drinks'
            subCategoryNames={[
              'black-tea',
              'green-tea',
              'herbal-tea',
              'drinking-chocolate',
              'coffee',
              'soft-drinks',
            ]}
          />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
