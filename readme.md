# Supermarket Price Watch Website

This is a website that pulls product data from Azure CosmosDB and displays them in a responsive grid.

Price history for each product is displayed using line charts.

Built on Next.js with TailwindCSS.

## Setup

An Azure CosmosDB read-only or read-write connection string must be set as an environment variable in the .env.local file

.env.local format

```shell
COSMOS_CONSTRING=
```

## Usage

`npm run dev` - for fully dynamic website use

`npm run build` - to build a static site
