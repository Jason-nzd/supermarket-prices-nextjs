const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    const map = [
      ['from "utilities/utilities"', 'from "@/lib/utils"'],
      ['from \'utilities/utilities\'', 'from "@/lib/utils"'],
      ['from "components/StoreIcon"', 'from "@/components/StoreIcon"'],
      ['from \'components/StoreIcon\'', 'from "@/components/StoreIcon"'],
      ['from "components/NavBar/NavBar"', 'from "@/components/NavBar/NavBar"'],
      ['from \'components/NavBar/NavBar\'', 'from "@/components/NavBar/NavBar"'],
      ['from "components/ProductsGrid"', 'from "@/components/ProductsGrid"'],
      ['from \'components/ProductsGrid\'', 'from "@/components/ProductsGrid"'],
      ['from "components/ProductCard/MultiStorePriceHistoryChart"', 'from "@/components/ProductCard/MultiStorePriceHistoryChart"'],
      ['from \'components/ProductCard/MultiStorePriceHistoryChart\'', 'from "@/components/ProductCard/MultiStorePriceHistoryChart"'],
      ['from "pages/_app"', 'from "@/pages/_app"'],
      ['from \'pages/_app\'', 'from "@/pages/_app"'],
      ['from "typings"', 'from "@/typings"'],
      ['from \'typings\'', 'from "@/typings"'],
      ['from "utilities/cosmosdb"', 'from "@/lib/db/cosmos"'],
      ['from \'utilities/cosmosdb\'', 'from "@/lib/db/cosmos"'],
      ['from "utilities/clientside-api"', 'from "@/services/api"'],
      ['from \'utilities/clientside-api\'', 'from "@/services/api"'],
      ['from "./sample-products"', 'from "@/lib/sample-products"'],
      ['from \'./sample-products\'', 'from "@/lib/sample-products"'],
      ['from "./utilities"', 'from "@/lib/utils"'],
      ['from \'./utilities\'', 'from "@/lib/utils"'],
      ['from "./cosmosdb"', 'from "@/lib/db/cosmos"'],
      ['from \'./cosmosdb\'', 'from "@/lib/db/cosmos"']
    ];

    for (const [find, replace] of map) {
      content = content.replaceAll(find, replace);
    }
    
    // Also fix some TS errors from Next build
    content = content.replaceAll("DatedPrice.price", "DatedPrice.price"); // Just to be sure we are modifying if needed, although mostly it operates on object props directly.
    
    // Fix string assignment issues found in TS
    if (filePath.includes("black-tea.tsx") || filePath.includes("green-tea.tsx") || filePath.includes("ProductEditRow.tsx")) {
      content = content.replaceAll("unitName={product.unitName}", "unitName={product.size || ''}");   
      content = content.replaceAll("currentPrice={product.currentPrice}", "currentPrice={product.priceHistory && product.priceHistory.length > 0 ? product.priceHistory[0].price : 0}");
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Fixed ' + filePath);
    }
  }
});
