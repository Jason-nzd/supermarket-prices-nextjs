# NZ Supermarket Price History Website
This is a website that pulls data from multiple supermarkets and displays each product with current and historical pricing. 

Built with `React` and `Next.js` using fully static html export.

Running Example: <https://kiwiprice.xyz>

![alt text](https://github.com/Jason-nzd/supermarket-prices-nextjs/blob/main/public/images/screenshot.png?raw=true "Screenshot of KiwiPrice.xyz")

## Quick Setup
With `Node.js` is installed, clone this repo, and then run `pnpm install` or `npm install` to install dependencies.

The website comes with some sample data built-in and can be launched as-is with `npm run dev`.

## Tech Stack
- Data is stored on `Azure CosmosDB`.
- Price history line charts powered by `Chart.js`.
- Styling is handled with `Tailwindcss`.
- Client-side search is powered by a custom API running on Azure.
- Unit tests powered by `Vitest` and E2E tests powered by `Cypress`.
- Full CI/CD pipeline available with testing and deployment to `AWS S3` and `CloudFront`.

## Usage
- `npm run dev` - for testing as a dynamic website
- `npm run build` - to build a fully static site into the `/out` directory
- `npm run start` - to host the built static site from `/out`
- `npm test` - to run vitest unit tests.
- `npx cypress run` - run cypress E2E headless testing

## File Folder Structure
```
.github/workflows/          # CI/CD pipeline
cypress/                    # E2E test specifications
public/                     # Images
src/
├── components/             # Reusable UI components (ProductCard, etc.)
├── hooks/
│   └── useMediaQuery.tsx   # Custom hook for responsive windows
├── lib/
│   ├── categories/         # Product category and sub-category definitions
│   ├── db/                 # CosmosDB connection and queries 
│   ├── utils.ts            # Utility functions
│   ├── utils.test.ts       # Vitest unit tests
│   └── demo-products.ts    # Sample product data
├── pages/
│   ├── index.tsx           # Home page
│   ├── products/
│   │   └── [category].tsx  # Generates pages based on definitions in /lib/categories/
│   ├── client-search.tsx   # Client-side search page
│   ├── services/
│   │   └── api.ts          # API integration for client-side search
│   └── styles/
│       └── globals.css     # Tailwind CSS configuration
```

## Database Mode Setup with .env
For use with Azure CosmosDB, a read-only or read-write connection string must be set as an environment variable `COSMOS_CONSTRING`. Database and container names are also set here.

Create a `.env` file with the following variables set:

```shell
COSMOS_CONSTRING=<your-cosmosdb-connection-string>
COSMOS_DBNAME=<your-database-name>
COSMOS_CONTAINER=<your-container-name>
```

Example database document that is expected:

```shell
  {
    "id": "1234567",
    "name": "Valley Milk Standard A2",
    "category": "milk",
    "size": "Bottle 2L",
    "sourceSite": "supermarket.co.nz",
    "lastChecked": "2024-09-14",
    "priceHistory": [
      {
        "date": "2023-03-03",
        "price": 5.5
      },
      {
        "date": "2023-06-02",
        "price": 6
      },
      {
        "date": "2024-01-23",
        "price": 6.5
      },
    ],
    "unitPrice": "3.28/L",
  },
```