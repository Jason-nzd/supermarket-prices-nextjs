import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import ProductEditRow from '../components/ProductEditRow';
import { Product } from '../typings';
import { DBFetchAll, DBFetchByName } from '../utilities/cosmosdb';
import { OrderByMode, PriceHistoryLimit, Store } from '../utilities/utilities';

interface Props {
  products: Product[];
}

function AdminPanel({ products }: Props) {
  const router = useRouter();
  const { search } = router.query;
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  }, []);

  async function executeSearch() {}

  return (
    <main>
      <div className='w-auto 2xl:max-w-[70%] mx-auto'>
        {/* Search Bar */}
        <div className='flex mx-3 mt-4'>
          <input
            className='focus:outline-none w-full rounded-lg text-sm p-2'
            onChange={onChange}
            placeholder='Search'
            type='text'
            value={searchQuery}
          />
          <button onClick={executeSearch} className='px-4 ring-2 ring-black'>
            Search
          </button>
        </div>

        <div className='overflow-hidden rounded-lg border border-gray-200 shadow-md m-3'>
          <table className='w-full border-collapse bg-white text-left text-sm text-gray-500'>
            <thead className='bg-gray-50'>
              <tr>
                <th scope='col' className='pl-4 py-4 font-medium text-gray-900 w-50'></th>
                <th scope='col' className='pl-2 px-1 py-4 font-medium text-gray-900'>
                  ID
                </th>
                <th scope='col' className='px-1 py-4 font-medium text-gray-900'>
                  Name & Size
                </th>
                <th scope='col' className='px-1 py-4 font-medium text-gray-900'>
                  Category
                </th>
                <th scope='col' className='px-1 py-4 font-medium text-gray-900 '>
                  Price History
                </th>
                <th scope='col' className='pr-4 py-4 font-medium text-gray-900'></th>
              </tr>
            </thead>

            {/* Table Body uses a map of Product Rows*/}
            <tbody className='divide-y divide-gray-100 border-t border-gray-100'>
              {products.map((product) => (
                <ProductEditRow product={product} key={product.id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const products = await DBFetchAll(80, Store.Any, PriceHistoryLimit.Any, OrderByMode.Oldest);

  return {
    props: {
      products,
    },
  };
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
//   const products = await DBFetchByName('bread', 40);

//   return {
//     props: {
//       products,
//     },
//   };
// };

export default AdminPanel;
