import { describe, it, expect } from 'vitest';
import { searchTools } from '../src/data/tools.js';

describe('NovaHamo Tools - Global Search Engine', () => {
  it('returns empty array on empty or whitespace queries', () => {
    expect(searchTools('')).toEqual([]);
    expect(searchTools('   ')).toEqual([]);
    expect(searchTools(null)).toEqual([]);
  });

  it('matches tools by partial name with prioritized ranking', () => {
    const pdfResults = searchTools('pdf');
    expect(pdfResults.length).toBeGreaterThan(15);
    // Top results should have "PDF" in the title
    expect(pdfResults[0].name.toLowerCase()).toContain('pdf');

    const qrResults = searchTools('qr');
    expect(qrResults.length).toBeGreaterThan(10);
    expect(qrResults[0].name.toLowerCase()).toContain('qr');
  });

  it('matches tools by category name', () => {
    const devResults = searchTools('developer');
    expect(devResults.length).toBeGreaterThanOrEqual(15);

    const calcResults = searchTools('calculators');
    expect(calcResults.length).toBeGreaterThanOrEqual(10);
  });

  it('matches tools by keywords and synonyms', () => {
    const wifi = searchTools('wifi');
    expect(wifi.some(t => t.id === 'wifi-qr')).toBe(true);

    const vcard = searchTools('vcard');
    expect(vcard.some(t => t.id === 'contact-qr')).toBe(true);

    const loan = searchTools('loan');
    expect(loan.some(t => t.id === 'emi-calculator' || t.id === 'loan-interest')).toBe(true);

    const compress = searchTools('compress');
    expect(compress.length).toBeGreaterThan(3);

    const json = searchTools('json');
    expect(json.some(t => t.id === 'json-formatter')).toBe(true);
  });
});
