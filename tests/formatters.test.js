import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCurrency,
  formatDuration,
  truncateText,
  formatFileSize,
} from '../src/utils/formatters.js';

describe('NovaHamo Tools - Formatter Utilities', () => {
  it('formats numbers with standard decimal places', () => {
    expect(formatNumber(1234.567, 2)).toContain('1,234.57');
    expect(formatNumber(100, 0)).toContain('100');
  });

  it('formats currency in INR', () => {
    const formatted = formatCurrency(5000);
    expect(formatted).toContain('5,000');
  });

  it('formats duration in mm:ss or hh:mm:ss', () => {
    expect(formatDuration(65000)).toMatch(/01:05/);
    expect(formatDuration(3665000)).toMatch(/01:01:05/);
  });

  it('truncates long text with ellipsis', () => {
    expect(truncateText('Short', 10)).toBe('Short');
    expect(truncateText('This is a very long string of text', 10)).toBe('This is a ...');
  });

  it('formats file sizes into human-readable units', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });
});
