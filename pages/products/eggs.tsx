import { GetStaticProps } from 'next';
import React, { useContext } from 'react';
import { Product } from '../../typings';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory } from '../../utilities/cosmosdb';
import { printPrice } from '../../utilities/utilities';
import { ThemeContext } from '../_app';

interface Props {
  mixedGrade: Product[];
  size7: Product[];
  size8plus: Product[];
}

const Category = ({ mixedGrade, size7, size8plus }: Props) => {
  const theme = useContext(ThemeContext);

  return (
    <div className={theme}>
      {/* Background Div */}
      <div className='pt-1 pb-12'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Categorised Product Grids*/}
          <div className='grid-title'>Size 6 and Mixed Range Eggs</div>
          <ProductsGrid products={mixedGrade} />
          <div className='grid-title'>Size 7 Eggs</div>
          <ProductsGrid products={size7} />
          <div className='grid-title'>Size 8 and Jumbo Eggs</div>
          <ProductsGrid products={size8plus} />
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let products = await DBFetchByCategory('eggs', 100);

  // Sub-categories to display separately on page
  let mixedGrade: Product[] = [];
  let size7: Product[] = [];
  let size8plus: Product[] = [];

  // Try derive per unit price of each product
  products.forEach((product) => {
    // Try grab product size if any, else use the name
    let size = product.size?.toLowerCase();
    if (size === undefined || size === '') {
      size = product.name.toLowerCase();
    }

    // Use regex to get any digits from size or name
    const regexMatchOnlyDigits = size?.match(/\d/g)?.join('');

    // Parse to int and check is within valid range
    if (regexMatchOnlyDigits !== undefined && parseInt(regexMatchOnlyDigits) < 50) {
      const quantity = parseInt(regexMatchOnlyDigits);

      // Set per egg unit price
      product.unitPrice = product.currentPrice / quantity;
      const pricePerEgg = printPrice(product.unitPrice);

      // Update size tag
      product.size = quantity + ' Pack\n\n' + pricePerEgg + '/egg';
    }
    // If a unit price could not be derived,
    //  set unitPrice to 99 to force ordering to bottom
    else product.unitPrice = 99;
  });

  // Sort by unit price
  products.sort((a, b) => {
    if (a.unitPrice! < b.unitPrice!) return -1;
    if (a.unitPrice! > b.unitPrice!) return 1;
    return 0;
  });

  // Loop through all products and split by category
  products.forEach((product) => {
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

  mixedGrade = mixedGrade.slice(0, 12);
  size7 = size7.slice(0, 12);
  size8plus = size8plus.slice(0, 12);

  return {
    props: {
      mixedGrade,
      size7,
      size8plus,
    },
  };
};

export default Category;
