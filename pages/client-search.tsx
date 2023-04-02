import { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { DBFetchByName } from '../utilities/cosmosdb';
import { OrderByMode, PriceHistoryLimit, Store } from '../utilities/utilities';
import { ThemeContext } from './_app';
import { useRouter } from 'next/router';
import _ from 'lodash';

const ClientSearch = () => {
  const router = useRouter();
  const theme = useContext(ThemeContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (searchTerm) {
        const dbProducts = await DBFetchByName(
          searchTerm,
          40,
          Store.Any,
          PriceHistoryLimit.Any,
          OrderByMode.None,
          false,
          true
        );

        setProducts(dbProducts);
        setIsLoading(false);
      }
    })();

    return () => {};
  }, [searchTerm]);

  return (
    <main className={theme} onLoad={() => setSearchTerm(router.query.query as string)}>
      <NavBar />
      {/* Background Div */}
      <div className='pt-1 pb-12'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold text-center'>
            {!isLoading && (
              <span>
                {products.length} results found for '{_.capitalize(searchTerm)}'
              </span>
            )}
            {isLoading && <span>Searching for {_.capitalize(searchTerm)}..</span>}
          </div>
          {products && <ProductsGrid products={products} />}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default ClientSearch;
