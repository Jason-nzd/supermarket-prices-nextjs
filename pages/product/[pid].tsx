import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import NavBar from '../../components/NavBar';
import PriceHistoryChart from '../../components/PriceHistoryChart';
import { Product } from '../../typings';
import { getProduct, printPrice, transparentImageUrlBase } from '../../utilities';

const Post = () => {
  const router = useRouter();
  const { pid } = router.query;

  const product: Product = {
    id: '12321',
    name: 'adfasdf',
    size: 'asdasd',
    currentPrice: 55,
    priceHistory: [],
    sourceSite: 'cd',
  };

  return (
    <div className=''>
      <h1>{pid}</h1>
      <NavBar />
      <div className=' w-[16em] flex flex-wrap p-2'>
        {/* Title div */}
        <div
          className='w-full bg-white rounded-t-3xl pt-1 px-2 
    text-md text-center h-14 font-semibold'
        ></div>

        {/* Image div with overlayed size and price */}
        <div className='bg-white relative'>
          <Image
            src={transparentImageUrlBase + product.id + '.jpg'}
            alt=''
            width={200}
            height={200}
            className='object-cover mx-8'
          />

          {/* Size div */}
          <div
            className='absolute top-4 left-4 p-1 px-4 bg-white bg-opacity-70 rounded-3xl
       text-sm text-slate-600 font-semibold shadow-xl'
          >
            {product.size}
          </div>

          {/* Price div */}
          <div
            className='absolute top-40 left-40 p-1 bg-yellow-400 border-2 border-yellow-300
       w-auto text-center font-bold rounded-3xl shadow-md'
          >
            {printPrice(product.currentPrice)}
          </div>
        </div>

        {/* Price history chart div */}
        <div className='w-[15em]'>
          <PriceHistoryChart priceHistory={product.priceHistory} />
        </div>
      </div>
    </div>
  );
};

async function p(id: string): Promise<Product> {
  return await getProduct(id);
}

export default Post;
