// Convert HH:MM to minutes since midnight
export function hmToMinutes(hm) {
  const [hStr, mStr] = (hm || "").split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) throw new Error('Invalid time: ' + hm);
  return h * 60 + m;
}

// Merge overlapping intervals: [[start,end],...]
export function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  const arr = intervals.slice().sort((a, b) => a[0] - b[0]);
  const out = [arr[0].slice()];
  for (let i = 1; i < arr.length; i++) {
    const cur = arr[i];
    const last = out[out.length - 1];
    if (cur[0] <= last[1]) {
      last[1] = Math.max(last[1], cur[1]);
    } else {
      out.push(cur.slice());
    }
  }
  return out;
}

// Subtract list B from A: returns parts of A not covered by B
export function subtractIntervals(A, B) {
  let i = 0, j = 0;
  const res = [];
  while (i < A.length) {
    let [aS, aE] = A[i];
    while (j < B.length && B[j][1] <= aS) j++;
    let curStart = aS;
    while (j < B.length && B[j][0] < aE) {
      const [bS, bE] = B[j];
      if (bS > curStart) {
        res.push([curStart, Math.min(bS, aE)]);
      }
      curStart = Math.max(curStart, bE);
      if (curStart >= aE) break;
      j++;
    }
    if (curStart < aE) res.push([curStart, aE]);
    i++;
  }
  return res;
}

// Validate timesheet vs calendar for one date
export function validateOneDate(timesheetRows, calendarEvents) {
  const tsIntervals = timesheetRows.map(r => [hmToMinutes(r.start), hmToMinutes(r.end)]);
  const calIntervals = calendarEvents.map(e => [hmToMinutes(e.start), hmToMinutes(e.end)]);
  
  const mTs = mergeIntervals(tsIntervals);
  const mCal = mergeIntervals(calIntervals);

  const extra = subtractIntervals(mTs, mCal);
  const missing = subtractIntervals(mCal, mTs);

  const fmt = (arr) => arr.map(([s, e]) => ({
    start: `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`,
    end: `${String(Math.floor(e / 60)).padStart(2, '0')}:${String(e % 60).padStart(2, '0')}`,
    minutes: e - s
  }));

  return {
    extraEntries: fmt(extra),
    missingEntries: fmt(missing),
    totalTimesheetMinutes: mTs.reduce((acc, [s, e]) => acc + (e - s), 0),
    totalCalendarMinutes: mCal.reduce((acc, [s, e]) => acc + (e - s), 0)
  };
}
