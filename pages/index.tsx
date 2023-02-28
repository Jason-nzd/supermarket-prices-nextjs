import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { DBFetchByName } from '../utilities';

interface Props {
  products: Product[];
}

// Products props will be populated at build time by getStaticProps()
function Home({ products }: Props) {
  return (
    <main>
      {/* Background Div */}
      <div className=''>
        {/* Central Aligned Div */}
        <div className='mx-auto w-full 2xl:max-w-[70%] '>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'></div>

          <ProductsGrid products={products} />
        </div>
      </div>
    </main>
  );
}

// This function gets called at build time on server-side.
export async function getStaticProps() {
  const products = await DBFetchByName('chocolate');

  return {
    props: {
      products,
    },
  };
}

export default Home;
