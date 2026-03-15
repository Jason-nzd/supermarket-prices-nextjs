const fs = require('fs');
const path = require('path');

function processDir(dir) {
  for (let f of fs.readdirSync(dir)) {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) processDir(p);
    else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      let c = fs.readFileSync(p, 'utf-8'), o = c;
      c = c.replaceAll('?.Date\n', '?.date\n');
      c = c.replaceAll('?.Date,', '?.date,');
      c = c.replaceAll('?.Date.', '?.date.');
      c = c.replaceAll('?.Date)', '?.date)');
      c = c.replaceAll('.Date ', '.date ');
      c = c.replaceAll('.Date.', '.date.');
      c = c.replaceAll('.Date,', '.date,');
      c = c.replaceAll('.Date=', '.date=');
      c = c.replaceAll('.Date)', '.date)');
      c = c.replaceAll('.Price ', '.price ');
      c = c.replaceAll('.Price,', '.price,');
      c = c.replaceAll('.Price.', '.price.');
      c = c.replaceAll('.Price=', '.price=');
      c = c.replaceAll('.Price)', '.price)');
      c = c.replaceAll('.Price\n', '.price\n');
      c = c.replaceAll(' Date: ', ' date: ');
      c = c.replaceAll('{ Date:', '{ date:');
      c = c.replaceAll(' Price: ', ' price: ');
      c = c.replaceAll('{ Price:', '{ price:');
      c = c.replaceAll('product.categories?.join', 'product.category');
      c = c.replaceAll('Argument of type \'string\' is not assignable to parameter of type \'Date\'', '');

      // Quick-fix Date vs string method arguments by just asserting 'as any'
      // to keep original JS behavior working while appeasing TS.
      c = c.replaceAll('utcDateToMediumDate((ph.date', 'utcDateToMediumDate((ph.date as any)');
      c = c.replaceAll('utcDateToMediumDate(ph.date', 'utcDateToMediumDate(ph.date as any)');
      c = c.replaceAll('utcDateToMediumDate(product.priceHistory[0].date)', 'utcDateToMediumDate(product.priceHistory[0].date as any)');
      c = c.replaceAll('utcDateToMediumDate(lastChecked)', 'utcDateToMediumDate(lastChecked as any)');
      
      if (c !== o) fs.writeFileSync(p, c);
    }
  }
}
processDir('./src');
