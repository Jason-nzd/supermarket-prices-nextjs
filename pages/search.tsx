import { GetServerSideProps } from 'next';
import { useContext } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { DBFetchByName } from '../utilities/cosmosdb';
import { ThemeContext } from './_app';

interface Props {
  products: Product[];
  searchTerm: string;
}

export default function Search({ products, searchTerm }: Props) {
  let productsCount = 0;
  if (products !== undefined) productsCount = products.length;
  const theme = useContext(ThemeContext);

  return (
    <main className={theme}>
      <NavBar />
      {/* Background Div */}
      <div className='pt-1 pb-12'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold text-center'>
            {productsCount} results found for '{searchTerm}'
          </div>
          <div className=''>{products && <ProductsGrid products={products} />}</div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

// Perform DB lookup
export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query;
  const searchTerm = query.query as string;

  if (searchTerm == null) return { props: {} };

  let products = await DBFetchByName(searchTerm);

  return {
    props: {
      products,
      searchTerm,
    },
  };
};
