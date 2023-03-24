import _ from 'lodash';
import Link from 'next/link';
import React, { useState } from 'react';
import { categoryNames } from '../pages/products/[category]';

function CategorySelector() {
  const [userCategories, setUserCategories] = useState<string[]>();

  return (
    <div className='z-50 absolute top-10 bg-white rounded-2xl w-fit p-3 shadow-2xl'>
      <h2>Quick Select Categories:</h2>
      <ul>
        {categoryNames.map((category, index) => (
          <li className='' key={index}>
            <input type='checkbox' name='' id='' className='mx-4' />
            <Link className='' href={'/products/' + category} key={category}>
              {_.startCase(category)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategorySelector;
