import { describe, it, expect } from 'vitest';
import categories from '../src/data/categories.js';
import tools from '../src/data/tools.js';

describe('NovaHamo Tools - Category & Tool Registry', () => {
  it('should define all 10 required tool categories', () => {
    expect(categories).toBeDefined();
    expect(categories.length).toBe(10);

    const expectedCategoryIds = [
      'qr',
      'images',
      'pdf',
      'video-audio',
      'student-job',
      'everyday',
      'calculators',
      'text',
      'social-media',
      'developer',
    ];

    expectedCategoryIds.forEach((catId) => {
      const match = categories.find((c) => c.id === catId);
      expect(match, `Category ${catId} must exist`).toBeDefined();
      expect(match.name).toBeTruthy();
      expect(match.description).toBeTruthy();
      expect(match.icon).toBeDefined();
    });
  });

  it('should contain all registered tools with required properties', () => {
    expect(tools.length).toBeGreaterThanOrEqual(150);

    tools.forEach((tool) => {
      expect(tool.id, `Tool must have valid string id: ${tool.name}`).toBeTruthy();
      expect(tool.name, `Tool ${tool.id} must have a name`).toBeTruthy();
      expect(tool.category, `Tool ${tool.id} must specify category`).toBeTruthy();
      expect(tool.description, `Tool ${tool.id} must have description`).toBeTruthy();
      expect(tool.component, `Tool ${tool.id} must have lazy component loader`).toBeDefined();
    });
  });

  it('should not have duplicate tool IDs', () => {
    const ids = tools.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('every tool category should match one of the 10 defined categories', () => {
    const validCatIds = new Set(categories.map((c) => c.id));
    tools.forEach((tool) => {
      expect(validCatIds.has(tool.category), `Tool ${tool.id} has invalid category: ${tool.category}`).toBe(true);
    });
  });
});
