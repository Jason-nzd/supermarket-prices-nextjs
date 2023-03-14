# Supermarket Price History Website

This is a static website that pulls product data from Azure CosmosDB and displays them in a responsive grid.

Price history for each product is displayed using chart.js line charts.

Built on Next.js using fully static html export.
Styling is handled with TailwindCSS.

Requires Node.js.

## Quick Setup

First clone this repo, and run `npm install` to install dependencies.

The website comes with some sample data built-in and can be launched as-is with `npm run dev`.

## Database Mode Setup

For use with Azure CosmosDB, a read-only or read-write connection string must be set as an environment variable COSMOS_CONSTRING. CosmosDB database and container names can be set in `/utilities/cosmosdb.ts`.

Example `.env.local`:

```shell
COSMOS_CONSTRING=
```

## Usage

- `npm install` - to install dependencies
- `npm run dev` - for testing as a dynamic website
- `npm run start` - to run a dynamic site with next.js incremental static regeneration
- `npm run build` - to build a fully static site into the `/out` directory

## Static Website Demo

<https://kiwiprice.xyz>
