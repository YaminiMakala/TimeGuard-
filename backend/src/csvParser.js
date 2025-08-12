import { parse } from 'csv-parse/sync';

export function parseTimesheetCsv(csvString) {
  const records = parse(csvString, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  return records.map(r => ({
    date: r.date,
    start: r.start,
    end: r.end,
    project: r.project || null
  }));
}
