import { GetServerSideProps } from 'next';
import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { DBFetchByName } from '../utilities/cosmosdb';

interface Props {
  products: Product[];
  searchTerm: string;
}

export default function Search({ products, searchTerm }: Props) {
  let productsCount = 0;
  if (products !== undefined) productsCount = products.length;
  return (
    <div className=''>
      {/* Background Div */}
      <div className='pt-1 pb-12'>
        {/* Central Aligned Div */}
        <div className='px-2 mx-auto w-[100%] 2xl:w-[70%] transition-all duration-500 min-h-screen'>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold text-center'>
            {productsCount} results found for '{searchTerm}'
          </div>
          <div className=''>{products && <ProductsGrid products={products} />}</div>
        </div>
      </div>
    </div>
  );
}

// Perform DB lookup
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const query = context.query;
//   const searchTerm = query.name as string;

//   if (searchTerm == null) return { props: {} };

//   let products = await DBFetchByName(searchTerm);

//   return {
//     props: {
//       products,
//       searchTerm,
//     },
//   };
// };
