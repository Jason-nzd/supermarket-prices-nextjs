# NZ Supermarket Price History Website

This is a static next.js website that pulls product data from Azure CosmosDB and displays them in a responsive grid.

- Long-term price history for each product is displayed using `chart.js` line charts.
- Built with `react` and `next.js` using fully static html export.
- Client-side data fetching from an API is used for search functionality.
- Styling is handled with `tailwind css`.

## Quick Setup

First ensure `node.js` is installed, clone or download this repo, and then run `npm install` to install dependencies.

The website comes with some sample data built-in and can be launched as-is with `npm run dev`.

## Database Mode Setup

For use with Azure CosmosDB, a read-only or read-write connection string must be set as an environment variable `COSMOS_CONSTRING`. Database and container names are also set here.

Example `.env`:

```shell
COSMOS_CONSTRING=<your-cosmosdb-connection-string>
COSMOS_DBNAME=<your-database-name>
COSMOS_CONTAINER=<your-container-name>
```

Example database document with dates in UTC format:

```shell
{
    id: '12345678',
    name: "Sample Milk Chocolate Bucket",
    currentPrice: 15,
    size: '640g',
    sourceSite: 'supermarket.co.nz',
    priceHistory: [
        { 
            date: '2023-03-02T00:00:00Z',
            price: 13 
        },
        { 
            date: '2023-03-13T00:00:00Z', 
            price: 15 
        },
    ],
    category: ['chocolate', 'chocolate-packs'],
    lastUpdated: '2023-03-13T00:00:00Z',
    lastChecked: '2023-04-22T00:00:00Z',
    unitPrice: 23.44,
    unitName: 'kg',
    originalUnitQuantity: 640,
}
```

## Usage

- `npm install` - to install dependencies
- `npm run dev` - for testing as a dynamic website
- `npm run build` - to build a fully static site into the `/out` directory
- `npm run start` - to host the built static site from `/out`

## Static Website Demo

<https://kiwiprice.xyz>

![alt text](https://github.com/Jason-nzd/supermarket-prices-nextjs/blob/main/public/images/screenshot.png?raw=true "Screenshot of KiwiPrice.xyz")
