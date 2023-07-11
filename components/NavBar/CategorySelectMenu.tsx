import { Dialog } from '@headlessui/react';
import React, { useContext, useEffect, useState } from 'react';
import SubCategoryList from './SubCategoryList';
import { DarkModeContext } from '../../pages/_app';
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

interface Props {
  updateNavCategories: (arg: string[]) => void;
}

function CategorySelectMenu({ updateNavCategories }: Props) {
  let [isOpen, setIsOpen] = useState(false);

  function setCategoriesCookie() {
    document.cookie = `User_Categories=${JSON.stringify(userCategories)};path='/'`;
  }

  // Set default favourite categories
  const [userCategories, setUserCategories] = useState<string[]>([
    'milk',
    'eggs',
    'fruit',
    'fresh-vegetables',
  ]);

  // Try read and set user categories cookie
  useEffect(() => {
    const readCookie = document.cookie
      .split('; ')
      .find((element) => element.startsWith('User_Categories='))
      ?.split('=')[1];
    if (readCookie) setUserCategories(JSON.parse(readCookie));
  }, []);

  // Send fav categories to parent navbar
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
    <>
      <button
        className='bg-green-300 rounded-3xl px-4 mx-4 py-1 
      hover:bg-green-100 hover:shadow-md transition-colors text-green-800'
        onClick={() => {
          setIsOpen(true);
        }}
      >
        More
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div
          className='fixed inset-0 z-50 mx-auto w-fit h-fit max-w-[95%] top-[7%] 
          overflow-hidden shadow-2xl rounded-3xl'
        >
          <Dialog.Panel
            className={
              (useContext(DarkModeContext).darkMode ? 'bg-zinc-700 text-zinc-200' : 'bg-white') +
              ' grid grid-flow-row grid-cols-4 2xl:grid-cols-8 rounded-3xl ' +
              ' p-2 xl:p-4 px-4 xl:px-8 gap-x-5 xl:gap-x-12 gap-y-2 md:gap-y-2 transition-all '
            }
          >
            <SubCategoryList
              subCategoryTitle='Fresh Foods'
              subCategoryNames={freshCategory}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle='Chilled'
              subCategoryNames={chilledCategory}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle='Meat'
              subCategoryNames={meatCategory}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle='Frozen'
              subCategoryNames={frozenCategory}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle='Pantry'
              subCategoryNames={pantryCategory}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle='Snacks'
              subCategoryNames={snacksCategory}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle='Drinks'
              subCategoryNames={drinksCategory}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle='Pets'
              subCategoryNames={petsCategory}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

export default CategorySelectMenu;
