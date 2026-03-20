import { describe, it, expect } from 'vitest';
import { dbDocumentToProduct, ProductDocument } from '../utils';

// Old schema example document from CosmosDB
const oldSchemaDocument: ProductDocument = {
  id: "53860",
  sourceSite: "countdown.co.nz",
  category: ["patties-meatballs"],
  lastChecked: "2026-03-13T00:55:15.689Z",
  lastUpdated: "2026-03-09T00:13:13.896Z",
  name: "First Light Beef Mince Wagyu",
  priceHistory: [
    { date: "2023-03-01T11:00:00.000Z", price: 11.9 },
    { date: "2024-06-27T01:00:00.320Z", price: 12.45 },
    { date: "2024-09-08T23:00:00.490Z", price: 10.7 },
    { date: "2026-01-13T00:00:00.984Z", price: 13.49 },
    { date: "2026-02-26T21:00:00.991Z", price: 13.4 },
    { date: "2026-03-09T00:00:00.896Z", price: 13.49 }
  ],
  currentPrice: 13.49,
  size: "400g",
  unitPrice: 33.73,
  unitName: "kg",
  _rid: "9lUvALkxBum0AAAAAAAAAA==",
  _self: "dbs/9lUvAA==/colls/9lUvALkxBuk=/docs/9lUvALkxBum0AAAAAAAAAA==/",
  _etag: "\"0200de71-0000-1a00-0000-69b360730000\"",
  _attachments: "attachments/",
  _ts: 1773363315
};

describe('dbDocumentToProduct', () => {
  it('should transform document fields correctly', () => {
    const input: ProductDocument = {
      _rid: 'abc123',
      _self: 'self-link',
      id: '123',
      name: 'Test Product',
      size: '500g',
      sourceSite: 'countdown.co.nz',
      priceHistory: [{ Date: '2024-01-01', Price: 10 }],
      category: 'test',
      lastChecked: '2024-01-01',
      unitPrice: '',
    };

    const result = dbDocumentToProduct(input);

    expect(result.id).toBe('123');
    expect(result.name).toBe('Test Product');
    expect(result.size).toBe('500g');
    expect(result.priceHistory).toEqual([{ date: '2024-01-01', price: 10 }]);
  });

  it('should set empty string for undefined size', () => {
    const input: ProductDocument = {
      id: '123',
      name: 'Test',
      sourceSite: 'countdown.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: '2024-01-01',
    };

    const result = dbDocumentToProduct(input);
    expect(result.size).toBe('');
  });

  it('should derive unitPrice if missing', () => {
    const input: ProductDocument = {
      id: '123',
      name: 'Test Milk',
      size: '2L',
      sourceSite: 'countdown.co.nz',
      priceHistory: [{ date: '2024-01-01', price: 6 }],
      category: 'milk',
      lastChecked: '2024-01-01',
      unitPrice: '',
    };

    const result = dbDocumentToProduct(input);
    expect(result.unitPrice).toBe('3/L');
  });

  it('should handle category as array by taking first item', () => {
    const input: ProductDocument = {
      id: '123',
      name: 'Test',
      sourceSite: 'countdown.co.nz',
      priceHistory: [],
      category: ['dairy', 'milk'],
      lastChecked: '2024-01-01',
    };

    const result = dbDocumentToProduct(input);
    expect(result.category).toBe('dairy');
  });

  it('should convert Date object lastChecked to yyyy-mm-dd string', () => {
    const input: ProductDocument = {
      id: '123',
      name: 'Test',
      sourceSite: 'countdown.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: new Date('2024-03-15T10:30:00Z'),
    };

    const result = dbDocumentToProduct(input);
    expect(result.lastChecked).toBe('2024-03-15');
  });

  it('should convert ISO string lastChecked to yyyy-mm-dd', () => {
    const input: ProductDocument = {
      id: '123',
      name: 'Test',
      sourceSite: 'countdown.co.nz',
      priceHistory: [],
      category: 'test',
      lastChecked: '2024-03-15T10:30:00.000Z',
    };

    const result = dbDocumentToProduct(input);
    expect(result.lastChecked).toBe('2024-03-15');
  });

  it('should convert numeric unitPrice to derived string', () => {
    const input: ProductDocument = {
      id: '123',
      name: 'Test Product',
      size: '500g',
      sourceSite: 'countdown.co.nz',
      priceHistory: [{ date: '2024-01-01', price: 10 }],
      category: 'test',
      lastChecked: '2024-01-01',
      unitPrice: 20,
    };

    const result = dbDocumentToProduct(input);
    // Note: deriveUnitPriceString calculates from priceHistory and size
    // 10 / 0.5kg = 20/kg
    expect(result.unitPrice).toBe('20/kg');
  });

  it('should normalize priceHistory date formats', () => {
    const input: ProductDocument = {
      id: '123',
      name: 'Test',
      sourceSite: 'countdown.co.nz',
      priceHistory: [
        { date: '2024-03-15T10:30:00.000Z', price: 10 },
        { date: new Date('2024-03-16T12:00:00Z'), price: 12 },
        { date: '2024-03-17', price: 15 },
      ],
      category: 'test',
      lastChecked: '2024-01-01',
    };

    const result = dbDocumentToProduct(input);
    expect(result.priceHistory[0].date).toBe('2024-03-15');
    expect(result.priceHistory[1].date).toBe('2024-03-16');
    expect(result.priceHistory[2].date).toBe('2024-03-17');
  });

  it('should handle old schema with nested priceHistory fields', () => {
    const input: ProductDocument = {
      _rid: 'xyz789',
      _self: 'self-link',
      id: '456',
      name: 'Old Schema Product',
      size: '500g',
      sourceSite: 'countdown.co.nz',
      priceHistory: [
        { Date: '2023-01-01T00:00:00Z', Price: 10 },
        { date: '2023-06-01', price: 12 },
      ],
      category: ['dairy', 'milk'],
      lastChecked: '2023-09-15T10:30:00.000Z',
      unitPrice: 20,
    };

    const result = dbDocumentToProduct(input);

    expect(result.id).toBe('456');
    expect(result.name).toBe('Old Schema Product');
    expect(result.category).toBe('dairy');
    expect(result.lastChecked).toBe('2023-09-15');
    // Note: deriveUnitPriceString calculates from priceHistory (12) and size (500g = 0.5kg)
    // 12 / 0.5kg = 24/kg
    expect(result.unitPrice).toBe('24/kg');
    expect(result.priceHistory[0].date).toBe('2023-01-01');
    expect(result.priceHistory[0].price).toBe(10);
    expect(result.priceHistory[1].date).toBe('2023-06-01');
    expect(result.priceHistory[1].price).toBe(12);
  });

  it('should transform real old schema document from CosmosDB', () => {
    const result = dbDocumentToProduct(oldSchemaDocument);

    expect(result.id).toBe('53860');
    expect(result.name).toBe('First Light Beef Mince Wagyu');
    expect(result.size).toBe('400g');
    expect(result.sourceSite).toBe('countdown.co.nz');
    expect(result.category).toBe('patties-meatballs');
    expect(result.lastChecked).toBe('2026-03-13');
    // Note: deriveUnitPriceString uses toPrecision(2), so 33.73 becomes 34
    expect(result.unitPrice).toBe('34/kg');

    // Verify all price history dates are normalized to yyyy-mm-dd
    expect(result.priceHistory.length).toBe(6);
    expect(result.priceHistory[0].date).toBe('2023-03-01');
    expect(result.priceHistory[0].price).toBe(11.9);
    expect(result.priceHistory[5].date).toBe('2026-03-09');
    expect(result.priceHistory[5].price).toBe(13.49);

    // Verify CosmosDB internal fields are ignored
    expect(result).not.toHaveProperty('_rid');
    expect(result).not.toHaveProperty('_self');
    expect(result).not.toHaveProperty('_etag');
    expect(result).not.toHaveProperty('_ts');
    expect(result).not.toHaveProperty('currentPrice');
    expect(result).not.toHaveProperty('unitName');
    expect(result).not.toHaveProperty('lastUpdated');
  });
});
