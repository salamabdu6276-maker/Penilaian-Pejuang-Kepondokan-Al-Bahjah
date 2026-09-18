import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Sparkles, 
  Globe2, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

type TimezoneMode = 'WIB' | 'WITA' | 'WIT' | 'LOCAL';

interface TimePeriodInfo {
  label: string;
  sublabel: string;
  icon: React.FC<{ className?: string }>;
  colorClass: string;
}

export const InteractiveDigitalClock: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(() => {
    return localStorage.getItem('CLOCK_24H') !== 'false';
  });
  const [timezone, setTimezone] = useState<TimezoneMode>(() => {
    return (localStorage.getItem('CLOCK_TZ') as TimezoneMode) || 'WIB';
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute timezone offset date
  const getTimeInZone = (date: Date, zone: TimezoneMode): Date => {
    if (zone === 'LOCAL') return date;
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const offsets: Record<'WIB' | 'WITA' | 'WIT', number> = {
      WIB: 7,
      WITA: 8,
      WIT: 9,
    };
    return new Date(utc + 3600000 * offsets[zone]);
  };

  const currentDate = getTimeInZone(now, timezone);
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  // Period of day determination
  const getTimePeriod = (h: number): TimePeriodInfo => {
    if (h >= 4 && h < 6) {
      return {
        label: 'Fajar / Shubuh',
        sublabel: 'Waktu Qiyam & Dzikir Pagi',
        icon: Sunrise,
        colorClass: 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
      };
    } else if (h >= 6 && h < 11) {
      return {
        label: 'Pagi Hari',
        sublabel: 'Aktivitas Khidmah & Dhuha',
        icon: Sun,
        colorClass: 'text-amber-600 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700',
      };
    } else if (h >= 11 && h < 15) {
      return {
        label: 'Dzuhur / Siang',
        sublabel: 'Sholat Berjamaah & Rehat',
        icon: Sun,
        colorClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700',
      };
    } else if (h >= 15 && h < 18) {
      return {
        label: 'Ashar / Sore',
        sublabel: 'Evaluasi & Dzikir Petang',
        icon: Sunset,
        colorClass: 'text-orange-600 dark:text-orange-400 bg-orange-100/80 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800',
      };
    } else if (h >= 18 && h < 19) {
      return {
        label: 'Maghrib',
        sublabel: 'Tilawah & Ta\'lim Pondok',
        icon: Sunset,
        colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-100/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800',
      };
    } else {
      return {
        label: 'Malam Hari',
        sublabel: 'Isya & Istirahat Pejuang',
        icon: Moon,
        colorClass: 'text-indigo-600 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800',
      };
    }
  };

  const period = getTimePeriod(hours);
  const PeriodIcon = period.icon;

  // Format Hours & Minutes
  let displayHours = hours;
  let ampm = '';
  if (!is24Hour) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    displayHours = hours % 12 || 12;
  }

  const strHours = String(displayHours).padStart(2, '0');
  const strMinutes = String(minutes).padStart(2, '0');
  const strSeconds = String(seconds).padStart(2, '0');

  // Toggle format
  const toggleFormat = () => {
    const nextVal = !is24Hour;
    setIs24Hour(nextVal);
    localStorage.setItem('CLOCK_24H', String(nextVal));
  };

  // Cycle timezone
  const cycleTimezone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const order: TimezoneMode[] = ['WIB', 'WITA', 'WIT', 'LOCAL'];
    const nextIdx = (order.indexOf(timezone) + 1) % order.length;
    const nextTz = order[nextIdx];
    setTimezone(nextTz);
    localStorage.setItem('CLOCK_TZ', nextTz);
  };

  // Copy time to clipboard
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullTimeStr = `${strHours}:${strMinutes}:${strSeconds} ${ampm} (${timezone}) - ${currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
    navigator.clipboard.writeText(fullTimeStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Second progress percentage (0 - 100%)
  const secondsPercent = ((seconds + 1) / 60) * 100;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggleFormat}
      className="relative cursor-pointer select-none group bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200/90 dark:border-slate-700/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
      title="Klik untuk mengubah format jam (12 Jam / 24 Jam)"
    >
      {/* Dynamic Background Glow on Hover */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      {/* Top Controls Row */}
      <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Real-Time
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Timezone Switcher Pill */}
          <button
            type="button"
            onClick={cycleTimezone}
            className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Klik untuk mengganti Zona Waktu (WIB / WITA / WIT / Lokal)"
          >
            <Globe2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
            <span>{timezone}</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Salin Waktu Saat Ini"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Main Clock Face Display */}
      <div className="flex items-baseline justify-between relative z-10">
        <div className="flex items-baseline space-x-0.5 font-mono">
          {/* Hours */}
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
            {strHours}
          </span>
          {/* Animated Blinking Colon */}
          <span className="text-2xl sm:text-3xl font-bold text-emerald-500 dark:text-emerald-400 animate-[pulse_1s_infinite]">
            :
          </span>
          {/* Minutes */}
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
            {strMinutes}
          </span>
          {/* Seconds badge */}
          <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 ml-1.5 tabular-nums bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/80">
            {strSeconds}
          </span>

          {/* AM / PM if 12h */}
          {!is24Hour && ampm && (
            <span className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 ml-1.5 uppercase">
              {ampm}
            </span>
          )}
        </div>

        {/* Period Badge */}
        <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold ${period.colorClass} shadow-xs`}>
          <PeriodIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{period.label}</span>
        </div>
      </div>

      {/* Date and Activity Sub-info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 relative z-10 pt-1 border-t border-slate-100 dark:border-slate-800/60">
        <span className="font-medium truncate max-w-[180px]">
          {currentDate.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
          {period.sublabel}
        </span>
      </div>

      {/* Seconds Progress Bar at the Bottom */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
          initial={{ width: 0 }}
          animate={{ width: `${secondsPercent}%` }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </div>
    </div>
  );
};
