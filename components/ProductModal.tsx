import React from 'react';
import { connectToCosmosDB, printPrice } from '../utilities';
import { Product } from '../typings';

interface Props {
  product: Product;
}

function ProductModal(props: Product) {
  return (
    <div>
      <div>ProductModal</div>
      <h2>{props.name}</h2>
      <h3>{props.size}</h3>
      <h3>{printPrice(props.currentPrice)}</h3>
    </div>
  );
}

export default ProductModal;
