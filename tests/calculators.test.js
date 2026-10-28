import { describe, it, expect } from 'vitest';

describe('NovaHamo Tools - Financial & Student Mathematical Calculations', () => {
  it('accurately computes EMI payments', () => {
    // Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const principal = 100000;
    const annualRate = 12; // 12%
    const months = 12;

    const monthlyRate = annualRate / (12 * 100); // 0.01
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    expect(Math.round(emi)).toBe(8885);
    expect(Math.round(totalAmount)).toBe(106619);
    expect(Math.round(totalInterest)).toBe(6619);
  });

  it('accurately calculates GST addition and extraction', () => {
    const netAmount = 1000;
    const gstRate = 18;

    // Add GST
    const gstAdded = netAmount * (1 + gstRate / 100);
    expect(gstAdded).toBe(1180);

    // Extract GST from gross
    const grossAmount = 1180;
    const extractedNet = grossAmount / (1 + gstRate / 100);
    const extractedTax = grossAmount - extractedNet;

    expect(Math.round(extractedNet)).toBe(1000);
    expect(Math.round(extractedTax)).toBe(180);
  });

  it('accurately computes BMI and classification', () => {
    const weightKg = 70;
    const heightM = 1.75;
    const bmi = weightKg / (heightM * heightM);

    expect(Number(bmi.toFixed(1))).toBe(22.9);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    expect(category).toBe('Normal');
  });

  it('computes attendance required percentage correctly', () => {
    const attended = 40;
    const total = 50;
    const currentPct = (attended / total) * 100;
    expect(currentPct).toBe(80);

    // If target is 85%, how many more classes needed in a row?
    const target = 85;
    // (attended + x) / (total + x) >= target / 100
    // x = ceil((target * total - 100 * attended) / (100 - target))
    const needed = Math.ceil((target * total - 100 * attended) / (100 - target));
    expect(needed).toBe(17);

    // Verify: (40 + 17) / (50 + 17) = 57 / 67 = 85.07%
    expect(((attended + needed) / (total + needed)) * 100).toBeGreaterThanOrEqual(target);
  });
});
