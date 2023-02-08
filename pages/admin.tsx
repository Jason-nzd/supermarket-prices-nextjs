import { FeedOptions } from '@azure/cosmos';
import ProductEditRow from '../components/ProductEditRow';
import { Product } from '../typings';
import { connectToCosmosDB } from '../utilities';

interface Props {
  products: Product[];
}

// Products will be populated at build time by getStaticProps()
function AdminPanel({ products }: Props) {
  return (
    <main>
      <div className=''>
        <div className='py-10 w-auto 2xl:max-w-7xl mx-auto'>
          <div className='overflow-hidden rounded-lg border border-gray-200 shadow-md m-5'>
            <table className='w-full border-collapse bg-white text-left text-sm text-gray-500'>
              <thead className='bg-gray-50'>
                <tr>
                  <th scope='col' className='pl-4 py-4 font-medium text-gray-900 w-50'></th>
                  <th scope='col' className='px-1 py-4 font-medium text-gray-900'>
                    ID
                  </th>
                  <th scope='col' className='px-1 py-4 font-medium text-gray-900'>
                    Name & Size
                  </th>
                  <th scope='col' className='px-1 py-4 font-medium text-gray-900 '>
                    Price History
                  </th>
                  <th scope='col' className='pr-4 py-4 font-medium text-gray-900'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 border-t border-gray-100'>
                {products.map((product) => (
                  <ProductEditRow product={product} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  // Get CosmosDB container
  const container = await connectToCosmosDB();

  // Set cosmos query options - limit to fetching 24 items at a time
  const options: FeedOptions = {
    maxItemCount: 10,
  };

  const response = await container.items
    .query('SELECT * FROM products p WHERE ARRAY_LENGTH(p.priceHistory)>1', options)
    .fetchNext();
  const products = response.resources as Product[];

  return {
    props: {
      products,
    },
  };
}

export default AdminPanel;
