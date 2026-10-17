import { decidedBy, resolve } from '../hijri/pipeline.js';
import type { ConvertOptions } from '../types.js';
import type { HolidayStatus } from './types.js';

/**
 * `confirmed` with its source when an official override fixed the Hijri month, otherwise
 * `expected` (ADR-0006).
 */
export function hijriStatus(
  year: number,
  month: number,
  options: ConvertOptions,
): { status: HolidayStatus; source?: string } {
  const decided = decidedBy(year, month, resolve(options));
  return decided.decidedBy === 'override' && decided.source !== undefined
    ? { status: 'confirmed', source: decided.source }
    : { status: 'expected' };
}
