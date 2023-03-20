import { Product } from '../typings';
import ProductCard from './card/ProductCard';
import { Grid } from '@nextui-org/react';

interface Props {
  products: Product[];
}

function ProductsGrid({ products }: Props) {
  return (
    <Grid.Container justify='center' gap={1}>
      {products.map((product) => (
        <Grid>
          <ProductCard key={product.id} product={product} />
        </Grid>
      ))}
    </Grid.Container>
  );
}

export default ProductsGrid;
