import { describe, it, expect } from 'vitest';
import {
  validateUrl,
  validateEmail,
  validatePhone,
  validateCoordinates,
  validateUPI,
  validateFileSize,
  getFileExtension,
} from '../src/utils/validation.js';

describe('NovaHamo Tools - Validation Utilities', () => {
  it('validates full URLs correctly', () => {
    expect(validateUrl('https://www.novahamotechnologies.com')).toBe(true);
    expect(validateUrl('http://localhost:5173')).toBe(true);
    expect(validateUrl('not-a-valid-url')).toBe(false);
    expect(validateUrl('')).toBe(false);
  });

  it('validates email addresses', () => {
    expect(validateEmail('info@novahamotechnologies.com')).toBe(true);
    expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    expect(validateEmail('invalid-email@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
  });

  it('validates international and local phone numbers', () => {
    expect(validatePhone('+91 9876543210')).toBe(true);
    expect(validatePhone('+1-555-123-4567')).toBe(true);
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('abc-def-ghij')).toBe(false);
  });

  it('validates geographic coordinates', () => {
    expect(validateCoordinates('12.9716', '77.5946')).toBe(true);
    expect(validateCoordinates(-89.9, 179.9)).toBe(true);
    expect(validateCoordinates(95.0, 0)).toBe(false); // Lat > 90
    expect(validateCoordinates(0, 185.0)).toBe(false); // Lng > 180
  });

  it('validates UPI IDs with user@bank syntax', () => {
    expect(validateUPI('merchant@okaxis')).toBe(true);
    expect(validateUPI('john.doe@okhdfcbank')).toBe(true);
    expect(validateUPI('plainstring')).toBe(false);
    expect(validateUPI('@bank')).toBe(false);
  });

  it('validates max file sizes', () => {
    const smallFile = { size: 5 * 1024 * 1024 }; // 5MB
    const bigFile = { size: 150 * 1024 * 1024 }; // 150MB
    expect(validateFileSize(smallFile, 100)).toBe(true);
    expect(validateFileSize(bigFile, 100)).toBe(false);
  });

  it('extracts lowercased file extensions', () => {
    expect(getFileExtension('resume.PDF')).toBe('pdf');
    expect(getFileExtension('photo.JPEG')).toBe('jpeg');
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
  });
});
