# NZ Supermarket Price History Website

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-grey?logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Cypress](https://img.shields.io/badge/Cypress-grey?logo=cypress&logoColor=white)](https://www.cypress.io/)

Track and compare prices across multiple New Zealand supermarkets with current and historical pricing charts.

Built with **React** & **Next.js** using static HTML export for easy static hosting.

🌐 **Live Demo:** <https://kiwiprice.xyz>

![Screenshot](https://github.com/Jason-nzd/supermarket-prices-nextjs/blob/main/public/images/screenshot.webp?raw=true "KiwiPrice.xyz Screenshot")

## 🛠️ Tech Stack
- 🗄️ **Database** • Azure CosmosDB
- 📊 **Charts** • Chart.js
- 🎨 **Styling** • Tailwind CSS
- ✅ **Testing** • Vitest (Unit) + Cypress (E2E)
- 🚢 **CI/CD** • Github Actions - Deployment to AWS

## 🚀 Quick Setup
```bash
# Clone and install dependencies
git clone https://github.com/Jason-nzd/supermarket-prices-nextjs
cd supermarket-prices-nextjs
pnpm install  # or npm install

# Launch development server
npm run dev
```
> 💡 Comes with built in sample products for testing without CosmosDB.

## 📦 Available Commands
`npm run dev` - Development server (dynamic mode)  
`npm run build` - Build static site to `/out`  
`npm run start` - Host static site from `/out`  
`npm test` - Run Vitest unit tests  
`npx cypress run` - Run Cypress E2E tests (headless)

### 📁 Project Structure
```
.github/workflows/          # CI/CD pipeline definitions
cypress/                    # E2E test specifications
public/                     # Static assets & images
src/
├── components/             # Reusable UI components (ProductCard, etc.)
├── hooks/
│   └── useMediaQuery.tsx   # Responsive design hook
├── lib/
│   ├── categories/         # Product category definitions
│   ├── db/                 # CosmosDB connection & queries
│   ├── utils.ts            # Utility functions
│   ├── utils.test.ts       # Unit tests
│   └── demo-products.ts    # Sample product data
├── pages/
│   ├── index.tsx           # Home page
│   ├── products/
│   │   └── [category].tsx  # Dynamic category pages
│   ├── client-search.tsx   # Client-side search
│   ├── services/
│   │   └── api.ts          # Search API integration
│   └── styles/
│       └── globals.css     # Tailwind CSS config
```

### ⚙️ Database Configuration
Create a `.env` file in the root directory with:
```env
COSMOS_CONSTRING=<your-cosmosdb-connection-string>
COSMOS_DBNAME=<your-database-name>
COSMOS_CONTAINER=<your-container-name>
```
> It will now pull data from the DB instead of sample products.

### 📄 Sample Document Schema
```json
{
  "id": "1234567",
  "name": "Valley Milk Standard A2",
  "category": "milk",
  "size": "Bottle 2L",
  "sourceSite": "supermarket.co.nz",
  "lastChecked": "2024-09-14",
  "priceHistory": [
    { "date": "2023-03-03", "price": 5.5 },
    { "date": "2023-06-02", "price": 6 },
    { "date": "2024-01-23", "price": 6.5 }
  ],
  "unitPrice": "3.28/L"
}
```