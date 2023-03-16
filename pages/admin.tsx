import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import ProductEditRow from '../components/ProductEditRow';
import { Product } from '../typings';
import { DBFetchAll, DBFetchByName } from '../utilities/cosmosdb';
import { OrderByMode, PriceHistoryLimit, Store } from '../utilities/utilities';

const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productResults, setProductResults] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const defaultProducts = await DBFetchByName(
        'banana',
        40,
        Store.Any,
        PriceHistoryLimit.Any,
        OrderByMode.None,
        false
      );
      setProductResults(defaultProducts);
    })();

    return () => {};
  }, []);

  async function executeSearch() {
    if (searchQuery.length > 0) {
    }
  }

  return (
    <main>
      {/* Central Aligned Div */}
      <div className='px-2 mx-auto w-fit lg:max-w-[99%] 2xl:max-w-[70%]'>
        {/* Search Bar */}
        <div className='flex mx-3 mt-4'>
          <input
            className='focus:outline-none w-full rounded-lg text-sm p-2'
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={executeSearch}
            placeholder='Search'
            type='text'
            value={searchQuery}
          />
          <button onClick={executeSearch} className='px-6 ring-2 ring-black'>
            Search
          </button>
        </div>

        <div className='overflow-hidden rounded-lg border border-gray-200 shadow-md m-3'>
          <table className='w-full border-collapse bg-white text-left text-sm text-gray-500'>
            <thead className='bg-gray-50'>
              <tr>
                <th scope='col' className='pl-4 py-4 font-medium text-gray-900 w-50'></th>
                <th scope='col' className='pl-7 px-6 py-4 font-medium text-gray-900'>
                  ID
                </th>
                <th scope='col' className='px-6 py-4 font-medium text-gray-900 min-w-[20rem]'>
                  Name & Size
                </th>
                <th scope='col' className='px-6 py-4 font-medium text-gray-900 '>
                  Category
                </th>
                <th scope='col' className='px-6 py-4 font-medium text-gray-900 '>
                  Price History
                </th>
                {/* Empty th for expanding icons panel */}
                <th scope='col' className='pr-4 py-4 font-medium text-gray-900 min-w-[8rem]'></th>
              </tr>
            </thead>

            {/* Table Body uses a map of Product Rows*/}
            <tbody className='divide-y divide-gray-100 border-t border-gray-100'>
              {productResults.map((product) => (
                <ProductEditRow product={product} key={product.id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

// export async function getStaticProps() {
//   const products = await DBFetchByName('trim milk', 60);

//   return {
//     props: {
//       products,
//     },
//   };
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const products = await DBFetchByName(searchQuery, 40);

//   return {
//     props: {
//       products,
//     },
//   };
// };

export default AdminPanel;
