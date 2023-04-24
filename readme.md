# NZ Supermarket Price History Website

This is a static Next.js website that pulls product data from Azure CosmosDB and displays them in a responsive grid.

- Long-term price history for each product is displayed using `chart.js` line charts.
- Built with `react` and `Next.js` using fully static html export.
- Client-side data fetching is used for searching.
- Styling is handled with `Tailwind CSS`.

## Quick Setup

First ensure `Node.js` is installed, clone this repo, and then run `npm install` to install dependencies.

The website comes with some sample data built-in and can be launched as-is with `npm run dev`.

## Database Mode Setup

For use with Azure CosmosDB, a read-only or read-write connection string must be set as an environment variable `COSMOS_CONSTRING`. Database and container names are also set here.

Example `.env`:

```shell
COSMOS_CONSTRING=AccountEndpoint=https://<your-cosmos>.documents.azure.com:443/;AccountKey=asdf1234==
COSMOS_DBNAME=<your-database-name>
COSMOS_CONTAINER=<your-container-name>
```

Example database document with dates in UTC format:

```json
{
    id: '12345678',
    name: "Sample Milk Chocolate Bucket",
    currentPrice: 15,
    size: '640g',
    sourceSite: 'supermarket.co.nz',
    priceHistory: [
        { date: '2023-03-02T11:00:00Z', price: 13 },
        { date: '2023-03-13T23:58:23.0847332Z', price: 15 },
    ],
    category: ['chocolate', 'chocolate-packs'],
    lastUpdated: '2023-03-13T23:58:23.0847332Z',
    lastChecked: '2023-04-22T00:57:17.2967445Z',
    unitPrice: 23.44,
    unitName: 'kg',
    originalUnitQuantity: 640,
}
```

## Usage

- `npm install` - to install dependencies
- `npm run dev` - for testing as a dynamic website
- `npm run start` - to run a dynamic site with next.js incremental static regeneration
- `npm run build` - to build a fully static site into the `/out` directory

## Static Website Demo

<https://kiwiprice.xyz>

![alt text](https://github.com/Jason-nzd/supermarket-prices-nextjs/blob/main/public/images/screenshot.png?raw=true "Screenshot of KiwiPrice.xyz")
