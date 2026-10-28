import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('NovaHamo Tools - 100% Component Module Audit', () => {
  const toolsBaseDir = path.resolve(__dirname, '../src/tools');
  const categories = fs.readdirSync(toolsBaseDir).filter(f => fs.statSync(path.join(toolsBaseDir, f)).isDirectory());

  categories.forEach(cat => {
    const catDir = path.join(toolsBaseDir, cat);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.jsx'));

    describe(`Category [${cat}] - ${files.length} components`, () => {
      files.forEach(file => {
        it(`should import and export a valid component for ${cat}/${file}`, async () => {
          const mod = await import(`../src/tools/${cat}/${file}`);
          expect(mod).toBeDefined();
          expect(mod.default, `${file} must have a default export`).toBeDefined();
          expect(typeof mod.default, `${file} default export must be a function/component`).toBe('function');
        });
      });
    });
  });
});
