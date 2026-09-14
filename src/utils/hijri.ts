/**
 * Utility for Gregorian to Hijri Calendar Conversion and Hijri Date formatting
 */

const HIJRI_MONTHS_ID = [
  "Muharram",
  "Safar",
  "Rabi'ul Awwal",
  "Rabi'ul Akhir",
  "Jumadil Awwal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawwal",
  "Dzulqa'dah",
  "Dzulhijjah"
];

const GREGORIAN_MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export interface HijriDate {
  day: number;
  monthIndex: number;
  monthName: string;
  year: number;
  formatted: string;
}

// Algoritma konversi Kalender Masehi ke Hijriyah (Aproksimasi Kuat Tabular / Umm al-Qura)
export function getHijriDate(date: Date): HijriDate {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth();
  const gDay = date.getDate();

  // Julian Day Number Calculation
  let a = Math.floor((14 - (gMonth + 1)) / 12);
  let y = gYear + 4800 - a;
  let m = (gMonth + 1) + 12 * a - 3;

  let julianDay = gDay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  let l = julianDay - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  
  let hMonth = Math.floor((24 * l) / 709);
  let hDay = l - Math.floor((709 * hMonth) / 24);
  let hYear = 30 * n + j - 30;

  let monthIdx = Math.max(0, Math.min(11, hMonth - 1));
  let monthName = HIJRI_MONTHS_ID[monthIdx] || "Muharram";

  return {
    day: hDay,
    monthIndex: monthIdx,
    monthName: monthName,
    year: hYear,
    formatted: `${hDay} ${monthName} ${hYear} H`
  };
}

export function formatGregorianFull(date: Date): string {
  const dayName = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][date.getDay()];
  const day = date.getDate();
  const month = GREGORIAN_MONTHS_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

export function getWeekPeriodString(year: number, month: number, week: number): { str: string; dates: number[] } {
  // Month: 1-12
  const daysInMonth = new Date(year, month, 0).getDate();

  let startDay = 1;
  let endDay = 7;

  if (week === 1) {
    startDay = 1;
    endDay = 7;
  } else if (week === 2) {
    startDay = 8;
    endDay = 14;
  } else if (week === 3) {
    startDay = 15;
    endDay = 21;
  } else if (week === 4) {
    startDay = 22;
    endDay = 28;
  } else {
    startDay = 29;
    endDay = daysInMonth;
  }

  const monthName = GREGORIAN_MONTHS_ID[month - 1];
  const startPad = String(startDay).padStart(2, '0');
  const endPad = String(endDay).padStart(2, '0');

  const dates: number[] = [];
  for (let d = startDay; d <= endDay; d++) {
    dates.push(d);
  }

  return {
    str: `${startPad} – ${endPad} ${monthName} ${year}`,
    dates
  };
}

export { GREGORIAN_MONTHS_ID, HIJRI_MONTHS_ID };

export function getWeeksInMonth(year: number, month: number): number {
  // Selalu 5 pekan sesuai dengan form checklist
  return 5;
}
