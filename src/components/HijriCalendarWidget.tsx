import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getHijriDate, formatGregorianFull, HIJRI_MONTHS_ID } from '../utils/hijri';
import { Calendar, MoonStar, Star, BellRing } from 'lucide-react';

const ISLAMIC_EVENTS = [
  { monthIdx: 0, day: 1, name: "Tahun Baru Hijriyah" },
  { monthIdx: 0, day: 10, name: "Hari Asyura" },
  { monthIdx: 2, day: 12, name: "Maulid Nabi Muhammad SAW" },
  { monthIdx: 6, day: 27, name: "Isra' Mi'raj" },
  { monthIdx: 7, day: 15, name: "Nisfu Sya'ban" },
  { monthIdx: 8, day: 1, name: "Awal Ramadhan" },
  { monthIdx: 8, day: 17, name: "Nuzulul Qur'an" },
  { monthIdx: 9, day: 1, name: "Idul Fitri" },
  { monthIdx: 11, day: 9, name: "Hari Arafah" },
  { monthIdx: 11, day: 10, name: "Idul Adha" },
];

export const HijriCalendarWidget: React.FC = () => {
  const [today, setToday] = useState(new Date());
  const hijri = getHijriDate(today);

  // Find upcoming events
  const upcomingEvents = ISLAMIC_EVENTS.map(event => {
    let year = hijri.year;
    // If the event has already passed this year, it's next year
    if (event.monthIdx < hijri.monthIndex || (event.monthIdx === hijri.monthIndex && event.day < hijri.day)) {
      year += 1;
    }
    return { ...event, year };
  }).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    if (a.monthIdx !== b.monthIdx) return a.monthIdx - b.monthIdx;
    return a.day - b.day;
  }).slice(0, 3); // Take next 3 events

  return (
    <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <MoonStar className="w-32 h-32" />
      </div>
      <div className="absolute -bottom-6 -left-6 opacity-5">
        <Star className="w-24 h-24" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Kalender Islam</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-4xl md:text-5xl font-bold font-serif">{hijri.day} {hijri.monthName}</h3>
            <p className="text-xl text-emerald-200 font-medium">{hijri.year} H</p>
            <p className="text-sm text-emerald-400/80 mt-2">{formatGregorianFull(today)}</p>
          </div>

          <div className="bg-emerald-900/50 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/20 w-full md:w-64">
            <div className="flex items-center space-x-2 mb-3">
              <BellRing className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Agenda Terdekat</h4>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((ev, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-emerald-700/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-emerald-100 line-clamp-1">{ev.name}</span>
                  <span className="text-emerald-300 font-medium whitespace-nowrap text-xs ml-2">
                    {ev.day} {HIJRI_MONTHS_ID[ev.monthIdx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
