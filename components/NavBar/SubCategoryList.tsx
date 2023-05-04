import React, { useContext } from 'react';
import StarFavourite from './StarFavourite';
import Link from 'next/link';
import _ from 'lodash';
import { DarkModeContext } from '../../pages/_app';

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
  let titleDivClass = centerTitle ? 'text-center' : '';
  titleDivClass += useContext(DarkModeContext).darkMode ? ' text-green-300' : ' text-green-600';

  return (
    <div className='w-full h-fit'>
      <h2 className={titleDivClass + ' text-lg whitespace-nowrap font-bold'}>{subCategoryTitle}</h2>
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
              className='ml-1 p-0.5 lg:py-1 px-1 lg:px-2 my-0.5 lg:my-1 rounded-2xl w-full
              font-semibold hover:bg-green-200 hover:text-black hover:shadow-sm whitespace-nowrap'
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
