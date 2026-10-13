import { describe, expect, it } from 'vitest';
import * as core from '../src/index.js';

describe('@qen/core', () => {
  it('loads', () => {
    expect(core).toBeDefined();
  });
});
