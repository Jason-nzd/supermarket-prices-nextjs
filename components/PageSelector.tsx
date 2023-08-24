import Link from 'next/link';
import React from 'react';

interface Props {
  numPagesToShow: number;
  category: string;
}

const PageSelector = ({ numPagesToShow, category }: Props) => {
  // Convert number into an array of page numbers
  let numPagesToShowAsArray: number[] = [];
  for (let i = 1; i++; i <= numPagesToShow) {
    numPagesToShowAsArray.push(i);
  }

  return (
    // To fix
    <div>
      {/* {numPagesToShow > 1 &&
        numPagesToShowAsArray.map((page) => {
          const href = '/products/' + category + '/' + page;
          return (
            <Link className='nav-main-link' href={href} key={href}>
              {page}
            </Link>
          );
        })} */}
    </div>
  );
};

export default PageSelector;
