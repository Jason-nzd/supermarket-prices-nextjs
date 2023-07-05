import { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar/NavBar';
import ProductEditRow from '../components/AdminPanel/ProductEditRow';
import { Product } from '../typings';
import { LastChecked, PriceHistoryLimit, Store, utcDateToLongDate } from '../utilities/utilities';
import { DarkModeContext } from './_app';
import startCase from 'lodash/startCase';
import { DBFetchAllAPI, DBFetchByNameAPI } from 'utilities/clientside-api';

interface Props {
  lastChecked: string;
}

type LoadState = 'start' | 'isLoading' | 'hasSearched';

const AdminPanel = ({ lastChecked }: Props) => {
  const theme = useContext(DarkModeContext).darkMode ? 'dark' : 'light';
  const [products, setProducts] = useState<Product[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('start');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle search form event
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadState('isLoading');
    const dbProducts = await DBFetchByNameAPI(
      searchQuery,
      40,
      Store.Any,
      PriceHistoryLimit.Any,
      LastChecked.Any
    );
    setProducts(dbProducts);
    setLoadState('hasSearched');
  };

  // Display all products as the default result
  useEffect(() => {
    (async () => {
      setLoadState('isLoading');
      const dbProducts = await DBFetchAllAPI(20, Store.Any, PriceHistoryLimit.Any);
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
              className='pl-3 focus:outline-none w-full rounded-l-xl text-sm p-2 
              dark:border-2 dark:border-r-0 dark:border-zinc-500 dark:bg-transparent dark:text-gray-200'
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
              className='px-6 bg-green-200 hover:bg-green-100 rounded-r-xl text-sm
              dark:bg-green-900 dark:text-zinc-300 dark:border-2 dark:border-green-700'
            >
              Search
            </button>
          </form>

          {/* Search Information */}
          <div className='text-center pt-4 pb-1 text-zinc-800 dark:text-zinc-300'>
            {loadState === 'isLoading' && (
              <>
                <div className=''>Searching for {startCase(searchQuery)}..</div>
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
              <span>No results found for {startCase(searchQuery)}</span>
            )}
            {loadState === 'hasSearched' && products.length > 0 && (
              <span>
                {products.length} results found for {startCase(searchQuery)}
              </span>
            )}
            {loadState === 'start' && <div className='min-h-[1rem]'></div>}
          </div>

          {/* Admin Table of Products */}
          {products.length > 0 && (
            <div className='overflow-hidden rounded-lg border border-gray-200 shadow-md m-3'>
              <table
                className='w-full border-collapse bg-white text-left text-sm text-gray-500
                dark:bg-zinc-800 dark:text-zinc-300'
              >
                <thead className='bg-gray-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300 font-medium'>
                  <tr>
                    <th scope='col' className='pl-4 py-4 w-50'></th>
                    <th scope='col' className='pl-7 px-3 py-4'>
                      ID
                    </th>
                    <th scope='col' className='px-6 py-4 min-w-[20rem]'>
                      Name & Size
                    </th>
                    <th scope='col' className='px-6 py-4'>
                      Category
                    </th>
                    <th scope='col' className='px-6 py-4'>
                      Unit Price
                    </th>
                    <th scope='col' className='px-6 py-4'>
                      Last Checked
                    </th>
                    <th scope='col' className='px-6 py-4 max-w-[20rem]'>
                      Price History
                    </th>
                    {/* Empty th for expanding icons panel */}
                    <th scope='col' className='pr-4 py-4 min-w-[8rem]'></th>
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
