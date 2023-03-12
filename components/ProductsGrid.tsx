import { Product } from '../typings';
import ProductCard from './card/ProductCard';

interface Props {
  products: Product[];
}

function ProductsGrid({ products }: Props) {
  return (
    <div
      className='grid place-items-center place-content-center
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-4
            3xl:grid-cols-5'
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductsGrid;
