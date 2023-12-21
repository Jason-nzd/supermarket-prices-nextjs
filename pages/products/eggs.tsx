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
  utcDateToMediumDate,
} from '../../utilities/utilities';
import { DarkModeContext } from '../_app';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer';

interface Props {
  mixedGrade: Product[];
  size7: Product[];
  size8plus: Product[];
  lastChecked: string;
}

const Category = ({ mixedGrade, size7, size8plus, lastChecked }: Props) => {
  const theme = useContext(DarkModeContext).darkMode ? 'dark' : 'light';

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Categorised Product Grids*/}
          <ProductsGrid
            titles={['Size 6 and Mixed Range Eggs']}
            products={mixedGrade}
            createSearchLink={false}
          />
          <ProductsGrid titles={['Size 7 Eggs']} products={size7} createSearchLink={false} />
          <ProductsGrid
            titles={['Size 8 and Jumbo Eggs']}
            products={size8plus}
            createSearchLink={false}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let products = await DBFetchByCategory(
    'eggs',
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  // Sub-categories for each egg size
  let mixedGrade: Product[] = [];
  let size7: Product[] = [];
  let size8plus: Product[] = [];

  // Try derive per unit price of each product
  products.forEach((product) => {
    // Try grab product size if any, else try extract from name
    let size = product.size?.toLowerCase().match(/\d/g)?.join('');
    if (size === undefined || size === '') {
      size = product.name
        .toLowerCase()
        .match(/\d*\spk|\d*\spack/g)
        ?.join('')
        .match(/\d/g)
        ?.join('');
    }

    // Parse to int and check is within valid range
    if (size !== undefined && parseInt(size) < 80) {
      const quantity = parseInt(size);

      // Set per egg unit price
      product.unitPrice = product.currentPrice / quantity;

      // Set size
      product.size = quantity + ' Pack';
    }
    // If a unit price could not be derived,
    //  set unitPrice to 999 to force ordering to bottom
    else product.unitPrice = 999;

    // Set unit name
    product.unitName = 'egg';
  });

  // Sort by unit price
  products.sort((a, b) => {
    if (a.unitPrice! < b.unitPrice!) return -1;
    if (a.unitPrice! > b.unitPrice!) return 1;
    return 0;
  });

  // Loop through all products and split by category
  products.forEach((product) => {
    // Clear any unitPrices of 999 that were needed for sorting
    if (product.unitPrice === 999) product.unitPrice = null;

    // Split each product into egg sizes
    if (product.name.toLowerCase().includes('size 6')) mixedGrade.push(product);
    else if (product.name.toLowerCase().includes('size 7')) size7.push(product);
    else if (
      product.name.toLowerCase().includes('size 8') ||
      product.name.toLowerCase().includes('size 9') ||
      product.name.toLowerCase().includes('size 10') ||
      product.name.toLowerCase().includes('jumbo')
    )
      size8plus.push(product);
    else mixedGrade.push(product);
  });

  mixedGrade = mixedGrade.slice(0, 15);
  size7 = size7.slice(0, 15);
  size8plus = size8plus.slice(0, 15);

  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      mixedGrade,
      size7,
      size8plus,
      lastChecked,
    },
  };
};

export default Category;
