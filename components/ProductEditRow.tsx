import React, { useState } from 'react';
import { Product } from '../typings';
import { transparentImageUrlBase, utcDateToShortDate } from '../utilities/utilities';
import DatedPrice from './card/DatedPrice';
import ImageWithFallback from './ImageWithFallback';

interface Props {
  product: Product;
}

function ProductEditRow({ product }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [productHidden, setProductHidden] = useState(false);

  function toggleEditMode() {
    editMode ? setEditMode(false) : setEditMode(true);
  }

  function toggleHidden() {
    productHidden ? setProductHidden(false) : setProductHidden(true);
  }

  return (
    <tr className='hover:bg-gray-50'>
      {/* Thumbnail Image */}
      <th className='pl-2'>
        {/* <ImageWithFallback id={product.id} width={50} /> */}
        <div className='text-xs text-center font-light'>
          {product.sourceSite.substring(0, product.sourceSite.length - 6)}
        </div>
      </th>

      {/* Product ID */}
      <td className='px-1 py-1'>
        <div className='text-sm'>
          <div className='text-gray-400'>#{product.id}</div>
        </div>
      </td>

      {/* Name & Size */}
      <td className='px-1 py-1 w-auto'>
        <div>
          {/* Render Product Name as either an editable text input or plain div */}
          {editMode && (
            <div className='font-medium text-gray-700'>
              <input type='text' title='Product Name' name='name' id='name' value={product.name} />
            </div>
          )}
          {!editMode && <div className='font-medium text-gray-700'>{product.name}</div>}

          {/* Product Size is also editable*/}
          {editMode && (
            <div className='text-gray-400 ring-blue-400'>
              <input type='text' title='Product Size' name='size' id='size' value={product.size} />
            </div>
          )}
          {!editMode && <div className='text-gray-400'>{product.size}</div>}
        </div>
      </td>

      {/* Category */}
      <td className='px-1 py-1 w-min'>
        <div className='text-xs'>{product.category}</div>
      </td>

      {/* Price History */}
      <td className='w-auto'>
        <div className='flex gap-1'>
          {product.priceHistory.map((datedPrice) => {
            return <DatedPrice datedPrice={datedPrice} key={datedPrice.date.toString()} />;
          })}
        </div>
      </td>

      {/* Edit Buttons TD */}
      <td className='pr-4 py-1 w-30'>
        <div className='flex justify-end gap-4'>
          {/* Edit Button with pencil icon */}
          {!editMode && (
            <button type='button' title='Edit' onClick={toggleEditMode}>
              {pencilIcon}
            </button>
          )}

          {/* Delete Button with trash can icon */}
          {editMode && (
            <button type='button' title='Delete' onClick={() => {}}>
              {trashIcon}
            </button>
          )}

          {/* Hide Button toggle with eye slash icon */}
          {editMode && !productHidden && (
            <button type='button' title='Hide' onClick={toggleHidden}>
              {hideEyeIcon}
            </button>
          )}

          {/* Unhide button eye icon */}
          {editMode && productHidden && (
            <button type='button' title='Unhide' onClick={toggleHidden}>
              {unhideEyeIcon}
            </button>
          )}

          {/* Save Button with tick mark icon */}
          {editMode && (
            <button type='button' title='Save' className='text-green-400' onClick={toggleEditMode}>
              {tickIcon}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default ProductEditRow;

const tickIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    className='w-6 h-6'
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
  </svg>
);

const hideEyeIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    className='w-6 h-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
    />
    <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
  </svg>
);

const pencilIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    className='w-6 h-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
    />
  </svg>
);

const unhideEyeIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    className='w-6 h-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
    />
    <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
  </svg>
);

const trashIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    className='w-6 h-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
    />
  </svg>
);
