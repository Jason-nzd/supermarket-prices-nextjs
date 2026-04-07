import { describe, it, expect } from 'vitest';
import {
  deriveUnitPriceString,
  getStoreEnum,
  getPriceAvgDifference,
  toShortDate,
  toLongDate,
  toMediumDate,
  toDateOnly,
  toDaysElapsed,
  toMonthYear,
  productIsCurrent,
  sortProductsByUnitPrice,
  printPrice,
  printProductCountSubTitle,
  Store,
} from './utils';
import { demoProducts } from './demo-products';
import type { Product } from '@/typings';

describe('deriveUnitPriceString', () => {
  it('should derive unit price from size in kg', () => {
    const result = deriveUnitPriceString('Test Product', '500g', 10);
    expect(result).toBe('20/kg');
  });

  it('should derive unit price from size in litres', () => {
    const result = deriveUnitPriceString('Test Milk', '2L', 6);
    expect(result).toBe('3/L');
  });

  it('should derive unit price from size in mL', () => {
    const result = deriveUnitPriceString('Test Juice', '500mL', 5);
    expect(result).toBe('10/L');
  });

  it('should derive unit price from name when size is missing unit', () => {
    const result = deriveUnitPriceString('Apples 2kg', 'per kg', 8);
    expect(result).toBe('8/kg');
  });

  it('should handle multiplied size (e.g., 4 x 107mL)', () => {
    const result = deriveUnitPriceString('Test Multi Pack', '4 x 107mL', 10);
    expect(result).toBe('23/L');
  });

  it('should handle "per kg" size as 1kg', () => {
    const result = deriveUnitPriceString('Test Product', '1kg', 15);
    expect(result).toBe('15/kg');
  });

  it('should return empty string when unable to derive unit price', () => {
    const result = deriveUnitPriceString('Test Product', '10pk', 10);
    expect(result).toBe('');
  });

  it('should handle products with no size', () => {
    const result = deriveUnitPriceString('Test Product', '', 10);
    expect(result).toBe('');
  });

  it('should capitalize L for litres', () => {
    const result = deriveUnitPriceString('Test Product', '1l', 5);
    expect(result).toBe('5/L');
  });
});

describe('deriveUnitPriceString with demoProducts', () => {
  it('should derive unit price for Fresha Valley Milk (2L)', () => {
    const product = demoProducts.find(p => p.id === '282801');
    expect(product).toBeDefined();
    if (product) {
      const result = deriveUnitPriceString(product.name, product.size, product.priceHistory[product.priceHistory.length - 1].price);
      expect(result).toBe('3.3/L');
    }
  });

  it('should derive unit price for Turks Chicken Breast (450g)', () => {
    const product = demoProducts.find(p => p.id === '98508');
    expect(product).toBeDefined();
    if (product) {
      const result = deriveUnitPriceString(product.name, product.size, product.priceHistory[product.priceHistory.length - 1].price);
      expect(result).toBe('22/kg');
    }
  });

  it('should derive unit price for Ambrosia Apples (per kg)', () => {
    const product = demoProducts.find(p => p.id === 'P5046462');
    expect(product).toBeDefined();
    if (product) {
      // The function handles "per kg" size correctly by using the price directly
      const result = deriveUnitPriceString(product.name, product.size, product.priceHistory[product.priceHistory.length - 1].price);
      expect(result).toBe('5.99/kg');
    }
  });

  it('should derive unit price for Pams Potatoes (1kg)', () => {
    const product = demoProducts.find(p => p.id === 'P5264178');
    expect(product).toBeDefined();
    if (product) {
      const result = deriveUnitPriceString(product.name, product.size, product.priceHistory[product.priceHistory.length - 1].price);
      expect(result).toBe('3/kg');
    }
  });

  it('should derive unit price for Pams Sweet Mango Mesclun Salad (295g)', () => {
    const product = demoProducts.find(p => p.id === 'N5040515');
    expect(product).toBeDefined();
    if (product) {
      const result = deriveUnitPriceString(product.name, product.size, product.priceHistory[product.priceHistory.length - 1].price);
      expect(result).toBe('27/kg');
    }
  });

  it('should derive unit price for Quality Bakers Muffin (390g)', () => {
    const product = demoProducts.find(p => p.id === 'R374908');
    expect(product).toBeDefined();
    if (product) {
      const result = deriveUnitPriceString(product.name, product.size, product.priceHistory[product.priceHistory.length - 1].price);
      expect(result).toBe('9.2/kg');
    }
  });

  it('should return a derived value for Ritz Crackers (300g)', () => {
    const product = demoProducts.find(p => p.id === 'R2427999');
    expect(product).toBeDefined();
    if (product) {
      // The function can derive from "300g" size
      const result = deriveUnitPriceString(product.name, product.size, product.priceHistory[product.priceHistory.length - 1].price);
      expect(result).toBe('12/kg');
    }
  });
});

describe('getStoreEnum', () => {
  it('should return Countdown for countdown.co.nz', () => {
    const product: Product = {
      id: '1',
      name: 'Test',
      size: '',
      sourceSite: 'countdown.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: '2024-01-01',
      unitPrice: '',
    };
    expect(getStoreEnum(product)).toBe(Store.Countdown);
  });

  it('should return Countdown for woolworths.co.nz', () => {
    const product: Product = {
      id: '1',
      name: 'Test',
      size: '',
      sourceSite: 'woolworths.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: '2024-01-01',
      unitPrice: '',
    };
    expect(getStoreEnum(product)).toBe(Store.Countdown);
  });

  it('should return TheWarehouse for thewarehouse.co.nz', () => {
    const product: Product = {
      id: '1',
      name: 'Test',
      size: '',
      sourceSite: 'thewarehouse.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: '2024-01-01',
      unitPrice: '',
    };
    expect(getStoreEnum(product)).toBe(Store.Warehouse);
  });

  it('should return Paknsave for paknsave.co.nz', () => {
    const product: Product = {
      id: '1',
      name: 'Test',
      size: '',
      sourceSite: 'paknsave.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: '2024-01-01',
      unitPrice: '',
    };
    expect(getStoreEnum(product)).toBe(Store.Paknsave);
  });

  it('should return NewWorld for newworld.co.nz', () => {
    const product: Product = {
      id: '1',
      name: 'Test',
      size: '',
      sourceSite: 'newworld.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: '2024-01-01',
      unitPrice: '',
    };
    expect(getStoreEnum(product)).toBe(Store.NewWorld);
  });

  it('should return Any for unknown source', () => {
    const product: Product = {
      id: '1',
      name: 'Test',
      size: '',
      sourceSite: 'unknown.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: '2024-01-01',
      unitPrice: '',
    };
    expect(getStoreEnum(product)).toBe(Store.Any);
  });
});

describe('getPriceAvgDifference', () => {
  it('should calculate price difference from average', () => {
    // Use recent dates within the default 120 day window
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const priceHistory = [
      { date: threeMonthsAgo.toISOString().split('T')[0], price: 10 },
      { date: twoMonthsAgo.toISOString().split('T')[0], price: 10 },
      { date: oneMonthAgo.toISOString().split('T')[0], price: 12 },
    ];
    const result = getPriceAvgDifference(priceHistory);
    // Avg = (10 + 10 + 12) / 3 = 10.67, current = 12, diff = (12 / 10.67) * 100 - 100 = 12.5 ≈ 13
    expect(result).toBe(13);
  });

  it('should return 0 when current price equals average', () => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const priceHistory = [
      { date: threeMonthsAgo.toISOString().split('T')[0], price: 10 },
      { date: twoMonthsAgo.toISOString().split('T')[0], price: 10 },
      { date: oneMonthAgo.toISOString().split('T')[0], price: 10 },
    ];
    const result = getPriceAvgDifference(priceHistory);
    expect(result).toBe(0);
  });

  it('should return negative when current price is below average', () => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const priceHistory = [
      { date: threeMonthsAgo.toISOString().split('T')[0], price: 10 },
      { date: twoMonthsAgo.toISOString().split('T')[0], price: 10 },
      { date: oneMonthAgo.toISOString().split('T')[0], price: 8 },
    ];
    const result = getPriceAvgDifference(priceHistory);
    // Avg = (10 + 10 + 8) / 3 = 9.33, current = 8, diff = (8 / 9.33) * 100 - 100 = -14.28 ≈ -14
    expect(result).toBe(-14);
  });
});

describe('date formatting functions', () => {
  describe('toShortDate', () => {
    it('should format date as "Mar 16"', () => {
      const result = toShortDate('2024-03-16');
      expect(result).toBe('Mar 16');
    });

    it('should return "Today" for current date when returnTodayString is true', () => {
      const today = new Date().toISOString();
      const result = toShortDate(today, true);
      expect(result).toBe('Today');
    });
  });

  describe('toLongDate', () => {
    it('should format date as "Friday, 11 August 2023"', () => {
      const result = toLongDate('2023-08-11');
      expect(result).toBe('Friday, 11 August 2023');
    });
  });

  describe('toMediumDate', () => {
    it('should format date as "Friday 11 Aug"', () => {
      const result = toMediumDate('2023-08-11');
      expect(result).toBe('Friday 11 Aug');
    });
  });

  describe('toDateOnly', () => {
    it('should return a Date instance', () => {
      const result = toDateOnly('2023-06-18T23:46:27.222Z');
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('toDaysElapsed', () => {
    it('should return "Today" for today', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = toDaysElapsed(today);
      expect(result).toBe('Today');
    });

    it('should return "Yesterday" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = toDaysElapsed(yesterday.toISOString().split('T')[0]);
      expect(result).toBe('Yesterday');
    });

    it('should return "X days ago" for recent dates', () => {
      const today = new Date();
      const daysAgo = 3;
      const threeDaysAgo = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate() - daysAgo,
        ),
      );
      const dateStr = threeDaysAgo.toISOString().split('T')[0];
      const result = toDaysElapsed(dateStr);
      expect(result).toBe(`${daysAgo} days ago`);
    });

    it('should return "X weeks ago" for older dates', () => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const result = toDaysElapsed(twoWeeksAgo.toISOString().split('T')[0]);
      expect(result).toBe('2 weeks ago');
    });
  });

  describe('toMonthYear', () => {
    it('should format date as "April 2023"', () => {
      const result = toMonthYear('2023-04-15');
      expect(result).toBe('April 2023');
    });
  });
});

describe('productIsCurrent', () => {
  it('should return true for recently checked product', () => {
    const today = new Date().toISOString().split('T')[0];
    const product: Product = {
      id: '1',
      name: 'Test',
      size: '',
      sourceSite: 'countdown.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: today,
      unitPrice: '',
    };
    expect(productIsCurrent(product)).toBe(true);
  });

  it('should return false for old product', () => {
    const product: Product = {
      id: '1',
      name: 'Test',
      size: '',
      sourceSite: 'countdown.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: '2020-01-01',
      unitPrice: '',
    };
    expect(productIsCurrent(product)).toBe(false);
  });
});

describe('sortProductsByUnitPrice', () => {
  it('should sort products by unit price ascending', () => {
    const products: Product[] = [
      {
        id: '1',
        name: 'Expensive',
        size: '',
        sourceSite: 'countdown.co.nz',
        priceHistory: [],
        category: 'test',
        lastChecked: '2024-01-01',
        unitPrice: '10/kg',
      },
      {
        id: '2',
        name: 'Cheap',
        size: '',
        sourceSite: 'countdown.co.nz',
        priceHistory: [],
        category: 'test',
        lastChecked: '2024-01-01',
        unitPrice: '5/kg',
      },
      {
        id: '3',
        name: 'Medium',
        size: '',
        sourceSite: 'countdown.co.nz',
        priceHistory: [],
        category: 'test',
        lastChecked: '2024-01-01',
        unitPrice: '7/kg',
      },
    ];

    const result = sortProductsByUnitPrice(products);
    expect(result[0].name).toBe('Cheap');
    expect(result[1].name).toBe('Medium');
    expect(result[2].name).toBe('Expensive');
  });

  it('should sort products without unitPrice to bottom', () => {
    const products: Product[] = [
      {
        id: '1',
        name: 'WithUnit',
        size: '',
        sourceSite: 'countdown.co.nz',
        priceHistory: [],
        category: 'test',
        lastChecked: '2024-01-01',
        unitPrice: '5/kg',
      },
      {
        id: '2',
        name: 'NoUnit',
        size: '',
        sourceSite: 'countdown.co.nz',
        priceHistory: [],
        category: 'test',
        lastChecked: '2024-01-01',
        unitPrice: '',
      },
    ];

    const result = sortProductsByUnitPrice(products);
    expect(result[0].name).toBe('WithUnit');
    expect(result[1].name).toBe('NoUnit');
  });
});

describe('printPrice', () => {
  it('should format whole numbers without decimals', () => {
    expect(printPrice(8)).toBe('$8');
    expect(printPrice(10)).toBe('$10');
  });

  it('should format decimal numbers with 2 decimal places', () => {
    expect(printPrice(8.4)).toBe('$8.40');
    expect(printPrice(10.5)).toBe('$10.50');
    expect(printPrice(5.99)).toBe('$5.99');
  });
});

describe('printProductCountSubTitle', () => {
  it('should format product count subtitle', () => {
    const result = printProductCountSubTitle(40, 234);
    expect(result).toBe('Showing cheapest 40/234 in-stock products');
  });

  it('should handle zero products shown', () => {
    const result = printProductCountSubTitle(0, 100);
    expect(result).toBe('Showing cheapest 0/100 in-stock products');
  });
});
