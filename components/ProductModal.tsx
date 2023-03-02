import React from 'react';
import { printPrice } from '../utilities/utilities';
import { Product } from '../typings';

interface Props {
  product: Product;
}

function ProductModal(props: Product) {
  const { name, size, currentPrice } = props;
  return (
    <div>
      <div>ProductModal</div>
      <h2>{name}</h2>
      <h3>{size}</h3>
      <h3>{printPrice(currentPrice)}</h3>
    </div>
  );
}

export default ProductModal;
