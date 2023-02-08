import Image from 'next/image';
import React from 'react';
import { Product } from '../typings';
import { printPrice, transparentImageUrlBase } from '../utilities';
import DatedPrice from './DatedPrice';

interface Props {
  product: Product;
}

function ProductEditRow({ product }: Props) {
  return (
    // <tr className='border-collapse border-y border-slate-400'>
    //   <td className='pl-8'>{product.id}</td>
    //   <td className='px-4'>
    //     <input
    //       type='text'
    //       name='name'
    //       title='pl'
    //       id=''
    //       value={product.name}
    //       className='w-[28em] text-input'
    //     />
    //   </td>
    //   <td className='px-4'>
    //     <input
    //       type='text'
    //       name='size'
    //       title='plasdas'
    //       id=''
    //       value={product.size}
    //       className='w-[12em] text-input'
    //     />
    //   </td>
    //   <td className='px-4'>
    //     {product.priceHistory.map((datedPrice) => {
    //       return <DatedPrice datedPrice={datedPrice} />;
    //     })}
    //   </td>
    //   <td className='pr-8'>{product.sourceSite}</td>
    // </tr>

    <tr className='hover:bg-gray-50'>
      <th className='flex gap-3 pl-4 py-0.5 font-normal text-gray-900'>
        <Image src={transparentImageUrlBase + product.id + '.jpg'} alt='' width={50} height={50} />
      </th>
      <td className='px-1 py-1'>
        <div className='text-sm'>
          <div className='text-gray-400'>#{product.id}</div>
        </div>
      </td>
      <td className='px-1 py-1'>
        <div>
          <div className='font-medium text-gray-700'>{product.name}</div>
          <div className='text-gray-400'>{product.size}</div>
        </div>
      </td>
      <td className='px-1 py-1'>
        <div className='flex gap-2'>
          {product.priceHistory.map((datedPrice) => {
            return <DatedPrice datedPrice={datedPrice} />;
          })}
        </div>
      </td>
      <td className='pr-4 py-1'>
        <div className='flex justify-end gap-4'>
          <a x-data="{ tooltip: 'Edit' }" href='#'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className='h-6 w-6'
              x-tooltip='tooltip'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
              />
            </svg>
          </a>
        </div>
      </td>
    </tr>
  );
}

export default ProductEditRow;
