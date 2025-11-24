import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('typecheck only', () => {
  it('generated files exist', () => {
    const base = path.resolve(__dirname, '../src/generated');
    assert.ok(fs.existsSync(base));
  });
});
