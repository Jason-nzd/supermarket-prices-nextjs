import { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import ProductEditRow from '../components/ProductEditRow';
import { Product } from '../typings';
import { DBFetchAll, DBFetchByName } from '../utilities/cosmosdb';
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  utcDateToLongDate,
} from '../utilities/utilities';
import { ThemeContext } from './_app';
import _ from 'lodash';
import { spawn } from 'child_process';

interface Props {
  lastChecked: string;
}

type LoadState = 'start' | 'isLoading' | 'hasSearched';

const AdminPanel = ({ lastChecked }: Props) => {
  const theme = useContext(ThemeContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('start');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle search formevent
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadState('isLoading');
    const dbProducts = await DBFetchByName(
      searchQuery,
      40,
      Store.Any,
      PriceHistoryLimit.Any,
      OrderByMode.None,
      LastChecked.Any,
      true
    );
    setProducts(dbProducts);
    setLoadState('hasSearched');
  };

  // Display all products as the default result
  useEffect(() => {
    (async () => {
      setLoadState('isLoading');
      const dbProducts = await DBFetchAll(
        20,
        Store.Any,
        PriceHistoryLimit.Any,
        OrderByMode.None,
        true
      );
      setProducts(dbProducts);
      setLoadState('start');
    })();

    return () => {};
  }, []);

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div min-h-[50rem]'>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className='flex mx-auto mt-4 max-w-xl'>
            <input
              className='pl-3 focus:outline-none w-full rounded-l-xl text-sm p-2'
              placeholder='Search'
              type='text'
              name='admin-search'
              id='admin-search'
              minLength={3}
              maxLength={26}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setLoadState('start');
              }}
            />
            <button
              type='submit'
              className='px-6 bg-green-200 hover:bg-green-100 rounded-r-xl text-sm'
            >
              Search
            </button>
          </form>

          {/* Search Information */}
          <div className='text-center pt-4 pb-1'>
            {loadState === 'isLoading' && (
              <>
                <div className=''>Searching for {_.capitalize(searchQuery)}..</div>
                <div className='w-fit mx-auto p-8'>
                  <svg
                    aria-hidden='true'
                    className='w-12 h-12 text-center mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-600'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                </div>
              </>
            )}
            {loadState === 'hasSearched' && products.length === 0 && (
              <span>No results found for {_.capitalize(searchQuery)}</span>
            )}
            {loadState === 'hasSearched' && products.length > 0 && (
              <span>
                {products.length} results found for {_.capitalize(searchQuery)}
              </span>
            )}
            {loadState === 'start' && <div className='min-h-[1rem]'></div>}
          </div>

          {/* Admin Table of Products */}
          {products.length > 0 && (
            <div className='overflow-hidden rounded-lg border border-gray-200 shadow-md m-3'>
              <table className='w-full border-collapse bg-white text-left text-sm text-gray-500'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th scope='col' className='pl-4 py-4 font-medium text-gray-900 w-50'></th>
                    <th scope='col' className='pl-7 px-3 py-4 font-medium text-gray-900'>
                      ID
                    </th>
                    <th scope='col' className='px-6 py-4 font-medium text-gray-900 min-w-[20rem]'>
                      Name & Size
                    </th>
                    <th scope='col' className='px-6 py-4 font-medium text-gray-900 '>
                      Category
                    </th>
                    <th scope='col' className='px-6 py-4 font-medium text-gray-900 '>
                      Unit Size
                    </th>
                    <th scope='col' className='px-6 py-4 font-medium text-gray-900 '>
                      Per Unit Price
                    </th>
                    <th scope='col' className='px-6 py-4 font-medium text-gray-900 '>
                      Price History
                    </th>
                    {/* Empty th for expanding icons panel */}
                    <th
                      scope='col'
                      className='pr-4 py-4 font-medium text-gray-900 min-w-[8rem]'
                    ></th>
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
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export async function getStaticProps() {
  const lastChecked = utcDateToLongDate(new Date());
  return {
    props: {
      lastChecked,
    },
  };
}

export default AdminPanel;
