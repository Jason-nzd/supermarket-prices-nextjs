import { GetStaticProps } from 'next';
import React, { useContext } from 'react';
import { Product } from '../../typings';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory } from '../../utilities/cosmosdb';
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  sortProductsByUnitPrice,
  utcDateToMediumDate,
} from '../../utilities/utilities';
import { DarkModeContext } from '../_app';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer';

interface Props {
  potatoes: Product[];
  broccoli: Product[];
  carrots: Product[];
  saladKits: Product[];
  mushrooms: Product[];
  tomatoes: Product[];
  onions: Product[];
  chili: Product[];
  other: Product[];
  lastChecked: string;
}

const Category = ({
  potatoes,
  broccoli,
  carrots,
  saladKits,
  mushrooms,
  tomatoes,
  onions,
  chili,
  other,
  lastChecked,
}: Props) => {
  const theme = useContext(DarkModeContext).darkMode ? 'dark' : 'light';

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Categorised Product Grids*/}
          <ProductsGrid titles={['Potatoes', 'Kumara']} products={potatoes} trimColumns={false} />
          <ProductsGrid
            titles={['Broccoli', 'Cauliflower', 'Cabbage']}
            products={broccoli}
            trimColumns={false}
          />
          <ProductsGrid titles={['Carrots', 'Yams']} products={carrots} trimColumns={false} />
          <ProductsGrid
            titles={['Lettuce', 'Salad Vegetables']}
            products={saladKits}
            trimColumns={false}
          />
          <ProductsGrid titles={['Mushrooms']} products={mushrooms} trimColumns={false} />
          <ProductsGrid
            titles={['Tomatoes', 'Cucumber', 'Capsicum']}
            products={tomatoes}
            trimColumns={false}
          />
          <ProductsGrid
            titles={['Onions', 'Shallots', 'Leek']}
            products={onions}
            trimColumns={false}
          />
          <ProductsGrid
            titles={['Chili', 'Garlic', 'Ginger']}
            products={chili}
            trimColumns={false}
          />
          <ProductsGrid
            titles={['Other Vegetables']}
            products={other}
            trimColumns={true}
            createSearchLink={false}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    'fresh-vegetables',
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  let potatoes: Product[] = [];
  let broccoli: Product[] = [];
  let carrots: Product[] = [];
  let saladKits: Product[] = [];
  let mushrooms: Product[] = [];
  let tomatoes: Product[] = [];
  let chili: Product[] = [];
  let onions: Product[] = [];
  let other: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    if (name.match('potato|kumara')) potatoes.push(product);
    else if (name.match('broccoli|cauliflower|cabbage')) broccoli.push(product);
    else if (name.match('carrot|parsnip|beetroot|yam|daikon')) carrots.push(product);
    else if (name.match('lettuce|spinach|celery|sprouts|choy|salad')) saladKits.push(product);
    else if (name.match('mushroom')) mushrooms.push(product);
    else if (name.match('tomato|capsicum|cucumber')) tomatoes.push(product);
    else if (name.match('onion|shallot|leek')) onions.push(product);
    else if (name.match('chili|garlic|ginger')) chili.push(product);
    else other.push(product);
  });
  other = other.slice(0, 30);

  // Sort all by unit price
  potatoes = sortProductsByUnitPrice(potatoes).slice(0, 15);
  broccoli = sortProductsByUnitPrice(broccoli).slice(0, 15);
  carrots = sortProductsByUnitPrice(carrots).slice(0, 15);
  mushrooms = sortProductsByUnitPrice(mushrooms).slice(0, 10);
  onions = sortProductsByUnitPrice(onions).slice(0, 15);
  tomatoes = sortProductsByUnitPrice(tomatoes).slice(0, 15);
  chili = sortProductsByUnitPrice(chili).slice(0, 10);
  other = other.slice(0, 15);

  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      potatoes,
      broccoli,
      carrots,
      saladKits,
      mushrooms,
      tomatoes,
      onions,
      chili,
      other,
      lastChecked,
    },
  };
};

export default Category;
