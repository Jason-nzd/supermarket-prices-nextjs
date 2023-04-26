import { Dialog } from '@headlessui/react';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import SubCategoryList from './SubCategoryList';

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
        <div className='fixed inset-0 z-50 mx-auto w-fit h-fit max-w-[95%] top-[5%] overflow-hidden'>
          <Dialog.Panel
            className='bg-white grid grid-flow-col grid-rows-3 md:grid-rows-2 lg:grid-rows-1 rounded-3xl
           shadow-2xl p-2 xl:p-4 px-4 xl:px-8 gap-x-5 xl:gap-x-12 gap-y-2 md:gap-y-4 transition-all'
          >
            <SubCategoryList
              subCategoryTitle='Fresh Foods'
              subCategoryNames={['eggs', 'fruit', 'fresh-vegetables', 'bread', 'bread-rolls']}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle='Chilled'
              subCategoryNames={['milk', 'yoghurt', 'cheese', 'cheese-slices', 'salami']}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
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
                'sausages',
              ]}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle='Frozen'
              subCategoryNames={[
                'ice-cream',
                'frozen-chips',
                'frozen-vegetables',
                'frozen-seafood',
                'pies-sausage-rolls',
                'pizza',
              ]}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
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
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
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
                'energy-drinks',
              ]}
              favCategory={favCategory}
              unFavCategory={unFavCategory}
              userCategories={userCategories}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle='Pets'
              subCategoryNames={['cat-food', 'cat-treats', 'dog-food', 'dog-treats']}
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
