import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';

const baseCss = readFileSync(join(process.cwd(), 'src/css/base.css'), 'utf8');

describe('CSS cross-browser compatibility', () => {
  test('every backdrop-filter has a -webkit- prefix', () => {
    const lines = baseCss.split('\n');
    const issues = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('backdrop-filter')) {
        // Check if the previous non-empty line has the webkit prefix
        let found = false;
        for (let j = i - 1; j >= 0 && j >= i - 3; j--) {
          if (lines[j].trim().startsWith('-webkit-backdrop-filter')) {
            found = true;
            break;
          }
        }
        if (!found) {
          issues.push(`Line ${i + 1}: "${line}" is missing -webkit-backdrop-filter prefix`);
        }
      }
    }

    expect(issues).toEqual([]);
  });
});
