import { Popover, Transition } from '@headlessui/react';
import React from 'react';
import _ from 'lodash';
import { burgerIcon } from './NavBar';
import SubCategoryList from './SubCategoryList';
import {
  chilledCategory,
  drinksCategory,
  freshCategory,
  frozenCategory,
  meatCategory,
  pantryCategory,
  petsCategory,
  snacksCategory,
} from '../../pages/products/[category]';

export default function MobileBurgerMenu() {
  return (
    <Popover className='text-lg'>
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
          className='mt-1 bg-zinc-100 p-4 grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4 rounded-2xl 
        shadow-2xl text-slate-800'
        >
          <SubCategoryList subCategoryTitle='Fresh Foods' subCategoryNames={freshCategory} />
          <SubCategoryList subCategoryTitle='Chilled' subCategoryNames={chilledCategory} />
          <SubCategoryList subCategoryTitle='Meat' subCategoryNames={meatCategory} />
          <SubCategoryList subCategoryTitle='Frozen' subCategoryNames={frozenCategory} />
          <SubCategoryList subCategoryTitle='Pantry' subCategoryNames={pantryCategory} />
          <SubCategoryList subCategoryTitle='Snacks' subCategoryNames={snacksCategory} />
          <SubCategoryList subCategoryTitle='Drinks' subCategoryNames={drinksCategory} />
          <SubCategoryList subCategoryTitle='Pets' subCategoryNames={petsCategory} />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
