import { useContext, useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import ProductEditRow from '../components/ProductEditRow';
import { Product } from '../typings';
import { DBFetchByName } from '../utilities/cosmosdb';
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  utcDateToLongDate,
} from '../utilities/utilities';
import { ThemeContext } from './_app';
import _ from 'lodash';

interface Props {
  lastChecked: string;
}

const AdminPanel = ({ lastChecked }: Props) => {
  const theme = useContext(ThemeContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
    setIsLoading(false);
  };

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type='submit'
              className='px-6 bg-green-200 hover:bg-green-100 rounded-r-xl text-sm'
            >
              Search
            </button>
          </form>

          {/* Search Information */}
          <div className='text-center'>
            {isLoading && <span>Searching for {_.capitalize(searchQuery)}..</span>}
          </div>

          {/* Admin Table of Products */}
          {products.length > 0 && (
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
