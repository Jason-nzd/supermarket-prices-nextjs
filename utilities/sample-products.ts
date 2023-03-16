import { DatedPrice, Product } from '../typings';

export function useSampleProductsInstead(): Product[] {
  console.warn('Using sample products in place of CosmosDB connection');
  const sampleProducts: Product[] = [];

  // Loop through all found sample products
  sample.products.forEach((product) => {
    // Fix each DatedPrice date object
    let fixedPriceHistory: DatedPrice[] = [];
    product.priceHistory.forEach((datedPrice) => {
      fixedPriceHistory.push({ date: datedPrice.date as unknown as Date, price: datedPrice.price });
    });

    // Build new product object
    let fixedProduct: Product = {
      id: product.id,
      name: product.name,
      currentPrice: product.currentPrice,
      size: product.size,
      sourceSite: product.sourceSite,
      lastUpdated: product.lastUpdated as unknown as Date,
      lastChecked: product.lastUpdated as unknown as Date, //todo regen new products
      priceHistory: fixedPriceHistory,
    };

    // Push completed object to array
    sampleProducts.push(fixedProduct);
  });

  return sampleProducts;
}

const sample = {
  products: [
    {
      id: '460572',
      name: 'M Ms Chocolate Peanut',
      currentPrice: 8.8,
      size: '345g',
      sourceSite: 'countdown.co.nz',
      priceHistory: [
        { date: '2023-02-10T11:00:00.000Z', price: 6 },
        { date: '2023-02-12T11:00:00.000Z', price: 8 },
        { date: '2023-02-13T11:00:00.000Z', price: 8.8 },
        { date: '2023-03-03T11:00:00.000Z', price: 7 },
        { date: '2023-03-13T23:07:58.199Z', price: 8.8 },
      ],
      category: ['chocolate-bars-blocks'],
      lastUpdated: '2023-03-13T23:07:58.199Z',
    },
    {
      id: '87702',
      name: 'Lurpak Spread Slightly Salted',
      currentPrice: 10.7,
      size: '400g',
      sourceSite: 'countdown.co.nz',
      priceHistory: [
        { date: '2023-01-15T11:00:00.000Z', price: 10.4 },
        { date: '2023-01-22T11:00:00.000Z', price: 9.7 },
        { date: '2023-01-29T11:00:00.000Z', price: 10.4 },
        { date: '2023-03-13T23:02:52.956Z', price: 10.7 },
      ],
      category: ['butter-spreads'],
      lastUpdated: '2023-03-13T23:02:52.956Z',
    },
    {
      id: '129858',
      name: 'Sealord Fish Fingers Classic Crumbed Hoki 400 G',
      currentPrice: 8,
      size: '15pack',
      sourceSite: 'countdown.co.nz',
      priceHistory: [
        { date: '2023-02-24T11:00:00.000Z', price: 6.5 },
        { date: '2023-03-01T11:00:00.000Z', price: 8 },
        { date: '2023-03-05T11:00:00.000Z', price: 6.5 },
        { date: '2023-03-13T22:58:07.717Z', price: 8 },
      ],
      category: ['frozen-seafood'],
      lastUpdated: '2023-03-13T22:58:07.717Z',
    },
    {
      id: '115442',
      name: 'Anchor Sour Cream Lite 250 G',
      currentPrice: 4.7,
      size: '125g pottles 2pack',
      sourceSite: 'countdown.co.nz',
      priceHistory: [
        { date: '2023-01-22T11:00:00.000Z', price: 3.7 },
        { date: '2023-01-29T11:00:00.000Z', price: 4.7 },
        { date: '2023-02-06T11:00:00.000Z', price: 3.7 },
        { date: '2023-02-12T11:00:00.000Z', price: 4.7 },
        { date: '2023-03-05T11:00:00.000Z', price: 4.6 },
        { date: '2023-03-13T01:41:45.167Z', price: 4.7 },
      ],
      category: ['milk-cream', 'sour-cream'],
      lastUpdated: '2023-03-13T01:41:45.167Z',
    },
    {
      id: '223867',
      name: 'Lurpak Butter Slightly Salted',
      currentPrice: 7,
      size: '250g',
      sourceSite: 'countdown.co.nz',
      priceHistory: [
        { date: '2023-01-15T11:00:00.000Z', price: 7.6 },
        { date: '2023-01-29T11:00:00.000Z', price: 7 },
        { date: '2023-02-06T11:00:00.000Z', price: 7.6 },
        { date: '2023-02-19T11:00:00.000Z', price: 7 },
        { date: '2023-03-05T11:00:00.000Z', price: 7.6 },
        { date: '2023-03-13T01:40:40.457Z', price: 7 },
      ],
      category: ['butter-spreads'],
      lastUpdated: '2023-03-13T01:40:40.456Z',
    },
    {
      id: '486016',
      name: 'Mainland Feta Cheese Creamy',
      currentPrice: 5,
      size: '200g',
      sourceSite: 'countdown.co.nz',
      priceHistory: [
        { date: '2023-02-18T11:00:00.000Z', price: 5 },
        { date: '2023-02-19T11:00:00.000Z', price: 6.2 },
        { date: '2023-02-28T11:00:00.000Z', price: 5 },
        { date: '2023-03-05T11:00:00.000Z', price: 6.2 },
        { date: '2023-03-13T01:40:08.038Z', price: 5 },
      ],
      category: ['cheese'],
      lastUpdated: '2023-03-13T01:40:08.038Z',
    },
    {
      id: '79223',
      name: 'Philadelphia Cream Cheese Spreadable',
      currentPrice: 5.5,
      size: '250g',
      sourceSite: 'countdown.co.nz',
      priceHistory: [
        { date: '2023-01-29T11:00:00.000Z', price: 4.9 },
        { date: '2023-02-06T11:00:00.000Z', price: 5.5 },
        { date: '2023-03-05T11:00:00.000Z', price: 5 },
        { date: '2023-03-13T01:40:08.034Z', price: 5.5 },
      ],
      category: ['cheese'],
      lastUpdated: '2023-03-13T01:40:08.034Z',
    },
    {
      id: '414940',
      name: 'Value Fresh Vegetable Spinach Baby Leaf',
      currentPrice: 4.4,
      size: 'Bag 120g',
      sourceSite: 'countdown.co.nz',
      priceHistory: [
        { date: '2023-03-02T11:00:00.000Z', price: 4.3 },
        { date: '2023-03-03T11:00:00.000Z', price: 4 },
        { date: '2023-03-05T11:00:00.000Z', price: 4.3 },
        { date: '2023-03-13T01:38:04.559Z', price: 4.4 },
      ],
      category: ['fruit-veg'],
      lastUpdated: '2023-03-13T01:38:04.559Z',
    },
    {
      id: 'P5014955',
      name: 'Vitasoy Lite Soy Milky',
      currentPrice: 3.2,
      size: '1L',
      sourceSite: 'paknsave.co.nz',
      priceHistory: [
        { date: '2023-02-27T11:00:00Z', price: 3 },
        { date: '2023-03-13T23:28:53.359071Z', price: 3.2 },
      ],
      category: ['dairy--lactose-free'],
      lastUpdated: '2023-03-13T23:28:53.359071Z',
    },
    {
      id: 'P5014956',
      name: 'Vitasoy Regular Soy Milky',
      currentPrice: 3.2,
      size: '1L',
      sourceSite: 'paknsave.co.nz',
      priceHistory: [
        { date: '2023-02-22T11:00:00Z', price: 3.49 },
        { date: '2023-03-13T23:28:52.5316617Z', price: 3.2 },
      ],
      category: ['dairy--lactose-free'],
      lastUpdated: '2023-03-13T23:28:52.5316617Z',
    },
    {
      id: 'P5028465',
      name: 'Rangitikei Free Range Whole Chicken',
      currentPrice: 14.99,
      size: '1.35kg',
      sourceSite: 'paknsave.co.nz',
      priceHistory: [
        { date: '2023-03-01T11:00:00Z', price: 14.99 },
        { date: '2023-03-09T15:10:57.9505586Z', price: 12.99 },
        { date: '2023-03-13T23:25:41.0629859Z', price: 14.99 },
      ],
      category: ['fresh-chicken--poultry'],
      lastUpdated: '2023-03-13T23:25:41.0629859Z',
    },
    {
      id: 'P5039966',
      name: 'Cauliflower',
      currentPrice: 6.49,
      size: 'ea',
      sourceSite: 'paknsave.co.nz',
      priceHistory: [
        { date: '2023-02-22T11:00:00Z', price: 5.99 },
        { date: '2023-03-09T15:08:32.990953Z', price: 4.99 },
        { date: '2023-03-13T23:24:07.6299959Z', price: 6.49 },
      ],
      category: ['fresh-vegetables'],
      lastUpdated: '2023-03-13T23:24:07.6299959Z',
    },
    {
      id: 'P5009662',
      name: "Whittaker's Peanut Butter 33% Cocoa Milk Chocolate Block",
      currentPrice: 4.9,
      size: '250g',
      sourceSite: 'paknsave.co.nz',
      priceHistory: [
        { date: '2023-02-27T11:00:00Z', price: 4.79 },
        { date: '2023-03-13T02:23:39.5841996Z', price: 4.9 },
      ],
      category: ['chocolate-blocks'],
      lastUpdated: '2023-03-13T02:23:39.5841996Z',
    },
    {
      id: 'P5025561',
      name: "Whittaker's Coconut Block 33% Cocoa Milk Chocolate Block",
      currentPrice: 4.9,
      size: '250g',
      sourceSite: 'paknsave.co.nz',
      priceHistory: [
        { date: '2023-02-22T11:00:00Z', price: 9 },
        { date: '2023-03-13T02:23:36.269656Z', price: 4.9 },
      ],
      category: ['chocolate-blocks'],
      lastUpdated: '2023-03-13T02:23:36.269656Z',
    },
    {
      id: 'P5234865',
      name: "Whittaker's Dark Salted Caramel 62% Cocoa Dark Chocolate Block",
      currentPrice: 4.9,
      size: '250g',
      sourceSite: 'paknsave.co.nz',
      priceHistory: [
        { date: '2023-02-22T11:00:00Z', price: 9 },
        { date: '2023-03-13T02:23:34.5261464Z', price: 4.9 },
      ],
      category: ['chocolate-blocks'],
      lastUpdated: '2023-03-13T02:23:34.5261464Z',
    },
    {
      id: 'P5009663',
      name: "Whittaker's White 28% Cocoa Chocolate Block",
      currentPrice: 4.9,
      size: '250g',
      sourceSite: 'paknsave.co.nz',
      priceHistory: [
        { date: '2023-03-01T11:00:00Z', price: 4.79 },
        { date: '2023-03-13T02:23:32.6262415Z', price: 4.9 },
      ],
      category: ['chocolate-blocks'],
      lastUpdated: '2023-03-13T02:23:32.6262415Z',
    },
    {
      id: 'R511506',
      name: 'Ferrero Rocher Chocolates 30 Pack',
      currentPrice: 22,
      size: '',
      sourceSite: 'thewarehouse.co.nz',
      priceHistory: [
        { date: '2023-03-02T11:00:00Z', price: 25 },
        { date: '2023-03-13T23:58:24.0411882Z', price: 22 },
      ],
      category: ['boxed-chocolates'],
      lastUpdated: '2023-03-13T23:58:24.0411882Z',
    },
    {
      id: 'R2283035',
      name: "M&M's Milk Chocolate Bucket - 640g",
      currentPrice: 15,
      size: '640g',
      sourceSite: 'thewarehouse.co.nz',
      priceHistory: [
        { date: '2023-03-02T11:00:00Z', price: 13 },
        { date: '2023-03-13T23:58:23.0847332Z', price: 15 },
      ],
      category: ['boxed-chocolates'],
      lastUpdated: '2023-03-13T23:58:23.0847332Z',
    },
    {
      id: 'R2656421',
      name: 'Maltesers Milk Chocolate Gift Box 400g',
      currentPrice: 6,
      size: '400g',
      sourceSite: 'thewarehouse.co.nz',
      priceHistory: [
        { date: '2023-03-02T11:00:00Z', price: 12 },
        { date: '2023-03-13T02:00:33.2128257Z', price: 6 },
      ],
      category: ['boxed-chocolates'],
      lastUpdated: '2023-03-13T02:00:33.2128257Z',
    },
    {
      id: 'R2841501',
      name: 'Cadbury Freddo Sharepack 216g',
      currentPrice: 5.5,
      size: '216g',
      sourceSite: 'thewarehouse.co.nz',
      priceHistory: [
        { date: '2023-03-02T11:00:00Z', price: 5 },
        { date: '2023-03-13T02:00:04.8315928Z', price: 5.5 },
      ],
      category: ['chocolate-share-packs'],
      lastUpdated: '2023-03-13T02:00:04.8315928Z',
    },
  ],
};
