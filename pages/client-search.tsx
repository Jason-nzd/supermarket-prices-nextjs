import { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { DBFetchByName } from '../utilities/cosmosdb';
import { OrderByMode, PriceHistoryLimit, Store } from '../utilities/utilities';
import { ThemeContext } from './_app';

const ClientSearch = () => {
  const theme = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const defaultProducts = await DBFetchByName(
        'banana',
        40,
        Store.Any,
        PriceHistoryLimit.Any,
        OrderByMode.None,
        false,
        true
      );
      setProducts(defaultProducts);
      setIsLoading(false);
    })();

    return () => {};
  }, []);

  return (
    <main className={theme}>
      <NavBar />
      {/* Background Div */}
      <div className='pt-1 pb-12'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {isLoading && <span>Fetching Data..</span>}
          {products && <ProductsGrid products={products} />}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default ClientSearch;
