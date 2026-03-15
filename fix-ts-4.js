const fs = require('fs');
const path = require('path');

function processDir(dir) {
  for (let f of fs.readdirSync(dir)) {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) processDir(p);
    else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      let c = fs.readFileSync(p, 'utf-8'), o = c;
      
      c = c.replace(/\.Date\b/g, '.date');
      c = c.replace(/\.Price\b/g, '.price');
      c = c.replace(/\{\s*Date\s*:/g, '{ date:');
      c = c.replace(/\{\s*Price\s*:/g, '{ price:');
      c = c.replace(/,\s*Date\s*:/g, ', date:');
      c = c.replace(/,\s*Price\s*:/g, ', price:');
      c = c.replace(/\?\.\s*Date\b/g, '?.date');
      c = c.replace(/\?\.\s*Price\b/g, '?.price');
      
      c = c.replace(/product\.currentPrice/g, '(product.currentPrice || 0)');
      
      c = c.replace(/product\.category\?\.\s*join/g, 'product.category?.toString');
      c = c.replace(/product\.categories\?\.\s*join/g, 'product.category?.toString');
      c = c.replace(/product\.categories\?\.\s*map/g, 'product.category ? [product.category].map');
      c = c.replace(/product\.categories/g, 'product.category');
      
      if (c !== o) fs.writeFileSync(p, c);
    }
  }
}
processDir('./src');
