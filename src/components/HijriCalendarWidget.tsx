import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getHijriDate, formatGregorianFull, HIJRI_MONTHS_ID, GREGORIAN_MONTHS_ID } from '../utils/hijri';
import { Calendar, MoonStar, Star, BellRing, Sparkles, ChevronLeft, ChevronRight, Info, Check } from 'lucide-react';

const ISLAMIC_EVENTS = [
  { monthIdx: 0, day: 1, name: "Tahun Baru 1 Muharram" },
  { monthIdx: 0, day: 10, name: "Hari Asyura (10 Muharram)" },
  { monthIdx: 2, day: 12, name: "Maulid Nabi Muhammad SAW" },
  { monthIdx: 6, day: 27, name: "Isra' Mi'raj 27 Rajab" },
  { monthIdx: 7, day: 15, name: "Malam Nisfu Sya'ban" },
  { monthIdx: 8, day: 1, name: "Awal Puasa Ramadhan" },
  { monthIdx: 8, day: 17, name: "Nuzulul Qur'an 17 Ramadhan" },
  { monthIdx: 9, day: 1, name: "Hari Raya Idul Fitri" },
  { monthIdx: 11, day: 9, name: "Hari Arafah (9 Dzulhijjah)" },
  { monthIdx: 11, day: 10, name: "Hari Raya Idul Adha" },
];

export const HijriCalendarWidget: React.FC = () => {
  const [today] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'agenda' | 'bulan'>('ringkasan');
  const [calendarOffset, setCalendarOffset] = useState<number>(0); // month offset for mini calendar

  const hijri = useMemo(() => getHijriDate(today), [today]);

  // Today's Islamic / Sunnah note
  const sunnahNote = useMemo(() => {
    const dayOfWeek = today.getDay(); // 0 = Ahad, 1 = Senin, ..., 5 = Jumat, 6 = Sabtu
    const hDay = hijri.day;

    if (dayOfWeek === 5) {
      return "Jumat Mubarok: Sunnah membaca Surah Al-Kahfi & memperbanyak shalawat.";
    }
    if (dayOfWeek === 1 || dayOfWeek === 4) {
      return "Sunnah Puasa: Disunnahkan berpuasa Senin & Kamis.";
    }
    if (hDay >= 13 && hDay <= 15) {
      return "Ayyamul Bidh: Disunnahkan puasa pertengahan bulan Hijriyah.";
    }
    return "Mengingat Allah SWT dan istiqomah menjaga sholat fardhu berjamaah.";
  }, [today, hijri]);

  // Upcoming Events sorted chronologically
  const upcomingEvents = useMemo(() => {
    return ISLAMIC_EVENTS.map(event => {
      let year = hijri.year;
      if (event.monthIdx < hijri.monthIndex || (event.monthIdx === hijri.monthIndex && event.day < hijri.day)) {
        year += 1;
      }
      return { ...event, year };
    }).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      if (a.monthIdx !== b.monthIdx) return a.monthIdx - b.monthIdx;
      return a.day - b.day;
    });
  }, [hijri]);

  const nearestEvent = upcomingEvents[0];

  // Calendar Grid Builder for the active viewed month
  const viewedDate = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + calendarOffset, 1);
    return d;
  }, [today, calendarOffset]);

  const monthName = GREGORIAN_MONTHS_ID[viewedDate.getMonth()];
  const yearNum = viewedDate.getFullYear();
  const viewedHijri = useMemo(() => getHijriDate(viewedDate), [viewedDate]);

  // Days in viewed month
  const calendarDays = useMemo(() => {
    const year = viewedDate.getFullYear();
    const month = viewedDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; isToday: boolean; hijriDay: number }[] = [];

    // Previous month padding
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthTotalDays - i,
        isCurrentMonth: false,
        isToday: false,
        hijriDay: 0
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const isToday = dateObj.toDateString() === today.toDateString();
      const hDate = getHijriDate(dateObj);
      days.push({
        day: d,
        isCurrentMonth: true,
        isToday,
        hijriDay: hDate.day
      });
    }

    // Next month padding to fill complete weeks (multiple of 7)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({
          day: i,
          isCurrentMonth: false,
          isToday: false,
          hijriDay: 0
        });
      }
    }

    return days;
  }, [viewedDate, today]);

  return (
    <div className="bg-gradient-to-br from-[#0c3e2e] via-[#093526] to-[#052118] rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between border border-emerald-700/50 min-h-[300px]">
      {/* Decorative background aura */}
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <MoonStar className="w-36 h-36 text-emerald-300" />
      </div>
      <div className="absolute -bottom-8 -left-8 opacity-5 pointer-events-none">
        <Star className="w-28 h-28 text-amber-300" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
        {/* TOP BAR: Header & Tab Controls */}
        <div className="flex items-center justify-between gap-2 border-b border-emerald-700/40 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-amber-300 border border-emerald-500/30">
              <MoonStar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                  Kalender Islam
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {hijri.year} H
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-black/30 p-1 rounded-xl border border-emerald-600/30 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('ringkasan')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'ringkasan'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('agenda')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'agenda'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              Agenda
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bulan')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'bulan'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              Bulan
            </button>
          </div>
        </div>

        {/* TAB 1: RINGKASAN HARI INI */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Primary Hijri & Gregorian Display */}
            <div className="bg-emerald-950/40 border border-emerald-500/25 rounded-2xl p-4 backdrop-blur-xs">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-4xl sm:text-5xl font-black font-serif text-white tracking-tight leading-none drop-shadow-xs">
                  {hijri.day}
                </span>
                <span className="text-lg sm:text-xl font-bold text-amber-300 font-serif leading-none">
                  {hijri.monthName} {hijri.year} H
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-200/90 font-medium mt-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{formatGregorianFull(today)}</span>
              </div>
            </div>

            {/* Sunnah & Islamic Daily Advice */}
            <div className="flex items-start gap-2.5 bg-emerald-900/30 border border-emerald-600/20 rounded-xl p-3 text-xs leading-relaxed text-emerald-100">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block text-[11px] uppercase tracking-wider mb-0.5">
                  Fadhilah Hari Ini
                </span>
                <p className="text-[11px] text-emerald-100/90 leading-snug">
                  {sunnahNote}
                </p>
              </div>
            </div>

            {/* Upcoming Event Snippet */}
            {nearestEvent && (
              <div className="flex items-center justify-between bg-black/20 rounded-xl px-3 py-2 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <BellRing className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px] text-emerald-200">Agenda Terdekat:</span>
                  <span className="font-bold text-white text-xs">{nearestEvent.name}</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 whitespace-nowrap ml-2">
                  {nearestEvent.day} {HIJRI_MONTHS_ID[nearestEvent.monthIdx]}
                </span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AGENDA TERDEKAT */}
        {activeTab === 'agenda' && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-emerald-300 pb-1">
              <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-amber-400" /> Agenda Islam Mendatang
              </span>
              <span className="text-[10px] text-emerald-400">Tahun {hijri.year} H</span>
            </div>

            <div className="space-y-2">
              {upcomingEvents.slice(0, 4).map((ev, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-800/60 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white leading-tight">{ev.name}</h5>
                      <span className="text-[10px] text-emerald-300">
                        {ev.day} {HIJRI_MONTHS_ID[ev.monthIdx]} {ev.year} H
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-800/80 text-emerald-200 border border-emerald-600/30 whitespace-nowrap">
                    {ev.day} {HIJRI_MONTHS_ID[ev.monthIdx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MINI BULANAN GRID */}
        {activeTab === 'bulan' && (
          <div className="space-y-2 animate-in fade-in duration-200">
            {/* Month Navigator */}
            <div className="flex items-center justify-between bg-black/20 rounded-xl px-2.5 py-1.5 border border-emerald-600/30">
              <button
                type="button"
                onClick={() => setCalendarOffset(prev => prev - 1)}
                className="p-1 rounded-lg hover:bg-emerald-800/60 text-emerald-300 hover:text-white transition-colors"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-xs font-bold text-white block leading-tight">
                  {monthName} {yearNum}
                </span>
                <span className="text-[10px] text-amber-300 font-medium">
                  {viewedHijri.monthName} {viewedHijri.year} H
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCalendarOffset(prev => prev + 1)}
                className="p-1 rounded-lg hover:bg-emerald-800/60 text-emerald-300 hover:text-white transition-colors"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-emerald-400/80 pb-0.5">
              <span>Ahd</span>
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarDays.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-1 rounded-lg text-xs font-medium relative transition-all ${
                    item.isToday
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                      : item.isCurrentMonth
                      ? 'text-emerald-100 hover:bg-emerald-800/40'
                      : 'text-emerald-700/50'
                  }`}
                >
                  <span>{item.day}</span>
                  {item.isCurrentMonth && item.hijriDay > 0 && (
                    <span className={`block text-[8px] leading-none ${
                      item.isToday ? 'text-slate-900 font-bold' : 'text-amber-300/80'
                    }`}>
                      {item.hijriDay}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM BRANDING */}
        <div className="flex items-center justify-between text-[10px] text-emerald-400/75 pt-2 border-t border-emerald-700/30">
          <span>Yayasan Al-Bahjah Cirebon</span>
          <span>Hijriyah &bull; Masehi</span>
        </div>
      </div>
    </div>
  );
};
