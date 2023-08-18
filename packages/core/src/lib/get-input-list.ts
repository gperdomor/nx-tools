import { parse } from 'csv-parse/sync';
import { getInput } from './get-input';

export interface InputListOpts {
  ignoreComma?: boolean;
  comment?: string;
  prefix?: string;
  fallback?: string[];
  quote?: string | boolean | Buffer | null;
}

export function getInputList(name: string, opts?: InputListOpts): string[] {
  const res: Array<string> = [];

  const items = getInput(name, { prefix: opts?.prefix });
  if (items == '') {
    return opts?.fallback ?? res;
  }

  const records = parse(items, {
    columns: false,
    relaxQuotes: true,
    comment: opts?.comment,
    relaxColumnCount: true,
    skipEmptyLines: true,
    quote: opts?.quote,
  });

  for (const record of records as Array<string[]>) {
    if (record.length == 1) {
      if (opts?.ignoreComma) {
        res.push(record[0]);
      } else {
        res.push(...record[0].split(','));
      }
    } else if (!opts?.ignoreComma) {
      res.push(...record);
    } else {
      res.push(record.join(','));
    }
  }

  return res.filter((item) => item).map((pat) => pat.trim());
}
