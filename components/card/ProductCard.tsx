import React from 'react';
import { Product } from '../../typings';
import { utcDateToShortDate } from '../../utilities/utilities';
import ImageWithFallback from '../ImageWithFallback';
import PriceHistoryChart from './PriceHistoryChart';
import PriceHistoryTips from './PriceHistoryTips';
import PriceTag from './PriceTag';
import { Card, Text, Grid } from '@nextui-org/react';

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const linkHref = '/product/' + [product.id];

  const showCategories = false;
  const showLastUpdated = false;
  const hasPriceHistory = product.priceHistory.length > 1;

  function handleClick() {
    console.log('ok');
    navigator.clipboard.writeText(product.id);
  }

  const imgHref = 'https://images.kiwiprice.xyz/product-images/200/' + product.id + '.webp';

  return (
    <Card css={{ mw: '400px' }} variant='bordered' isHoverable isPressable>
      <Card.Header css={{ position: 'absolute', zIndex: 1, top: 5 }}>
        <Text h4>{product.name}</Text>
      </Card.Header>

      <Card.Divider />

      <Card.Body>
        <Card.Image
          src={imgHref}
          width='100%'
          height={200}
          objectFit='contain'
          alt='Card image background'
        />
        <PriceHistoryChart priceHistory={product.priceHistory} lastChecked={product.lastChecked} />
        <Grid.Container justify='space-around'>
          <Grid xs={3}>{product.size}</Grid>
          <Grid xs={3}>
            <PriceTag product={product} />
          </Grid>
          <Grid xs={3}>
            {product.priceHistory.length > 1 && (
              <PriceHistoryTips priceHistory={product.priceHistory} />
            )}
          </Grid>

          {/* {showCategories && product.category != null && product.category!.length > 0 && (
          <div className=''>{product.category!.join(', ')}</div>
        )}

        <div className=''>Last Updated {utcDateToShortDate(product.lastChecked, true)}</div>

        {showLastUpdated && hasPriceHistory && (
          <div className=''>Price Last Changed {utcDateToShortDate(product.lastUpdated)}</div>
        )}

        {showLastUpdated && !hasPriceHistory && (
          <div className=''>First Added {utcDateToShortDate(product.lastUpdated)}</div>
        )} */}
        </Grid.Container>
      </Card.Body>

      <Card.Divider />

      {/* Source Site Div */}
      <Card.Footer isBlurred>
        {product.sourceSite.includes('countdown.co.nz') && <Text h5>Countdown</Text>}
        {product.sourceSite === 'thewarehouse.co.nz' && <Text h5>The Warehouse</Text>}
        {product.sourceSite === 'paknsave.co.nz' && <Text h5>PAK'nSAVE</Text>}
        {!product.sourceSite.includes('countdown.co.nz') &&
          product.sourceSite !== 'thewarehouse.co.nz' &&
          product.sourceSite !== 'paknsave.co.nz' && <Text h5>{product.sourceSite}</Text>}
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;
