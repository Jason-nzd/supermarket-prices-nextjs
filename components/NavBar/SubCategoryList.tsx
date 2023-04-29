import React from 'react';
import StarFavourite from './StarFavourite';
import Link from 'next/link';
import _ from 'lodash';

interface Props {
  subCategoryTitle: string;
  centerTitle?: boolean;
  subCategoryNames: string[];
  favCategory?: (arg: string) => void;
  unFavCategory?: (arg: string) => void;
  userCategories?: string[];
}

export default function SubCategoryList({
  userCategories,
  favCategory,
  unFavCategory,
  subCategoryTitle,
  centerTitle = false,
  subCategoryNames,
}: Props) {
  const titleDivClass = centerTitle ? 'text-center' : '';

  return (
    <div className='w-full h-fit'>
      <h2 className={titleDivClass + ' whitespace-nowrap font-bold text-green-600'}>
        {subCategoryTitle}
      </h2>
      <hr className='mt-2 mb-1' />
      {subCategoryNames.map((categoryName) => {
        const href = '/products/' + categoryName;
        return (
          <div className='flex items-center w-full' key={categoryName}>
            {favCategory && unFavCategory && userCategories && (
              <StarFavourite
                category={categoryName}
                favCategory={favCategory}
                unFavCategory={unFavCategory}
                isFavourite={userCategories.includes(categoryName)}
              />
            )}
            <Link
              className='text-zinc-500 ml-1 p-0.5 lg:py-1 px-1 lg:px-2 my-0.5 lg:my-1 rounded-2xl font-semibold
                hover:bg-green-200 hover:shadow-sm whitespace-nowrap w-full'
              href={href}
            >
              {_.startCase(categoryName)}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
