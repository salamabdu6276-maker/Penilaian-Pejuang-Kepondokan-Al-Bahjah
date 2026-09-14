import React, { useMemo, useState, useEffect } from 'react';
import { ChecklistFormSubmission } from '../types';
import { GREGORIAN_MONTHS_ID } from '../utils/hijri';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthlyHeatmapProps {
  submissions: ChecklistFormSubmission[];
  year: number;
  month: number;
  onDateClick?: (dayNum: number, dateStr: string) => void;
}

export const MonthlyHeatmap: React.FC<MonthlyHeatmapProps> = ({ submissions, year, month, onDateClick }) => {
  const [viewMode, setViewMode] = useState<'bulan' | 'pekan' | 'hari'>('bulan');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    // When month/year changes, if the selectedDate is not in the new month/year, reset it
    if (selectedDate.getMonth() + 1 !== month || selectedDate.getFullYear() !== year) {
      setSelectedDate(new Date(year, month - 1, 1));
    }
  }, [year, month]);

  // Map date string (YYYY-MM-DD) to intensity
  const heatmapData = useMemo(() => {
    const data: Record<string, number> = {};
    
    submissions.forEach(sub => {
      const subYear = sub.tahun;
      const subMonth = sub.bulan;
      
      sub.tasks.forEach(task => {
        if (task.realisasiChecks) {
          Object.entries(task.realisasiChecks).forEach(([day, isChecked]) => {
            if (isChecked) {
              const dayNum = parseInt(day);
              const m = String(subMonth).padStart(2, '0');
              const d = String(dayNum).padStart(2, '0');
              const dateStr = `${subYear}-${m}-${d}`;
              data[dateStr] = (data[dateStr] || 0) + 1;
            }
          });
        }
      });
    });
    
    return data;
  }, [submissions]);

  const calendarGrid = useMemo(() => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // last day of month
    
    const startGrid = new Date(startDate);
    startGrid.setDate(startDate.getDate() - startDate.getDay()); // Start on Sunday
    
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    let current = new Date(startGrid);
    while (current <= endDate || current.getDay() !== 0) {
      if (current.getDay() === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(new Date(current));
      current.setDate(current.getDate() + 1);
      
      if (current > endDate && current.getDay() === 0) {
        if (currentWeek.length > 0) {
           while(currentWeek.length < 7) {
             currentWeek.push(new Date(current));
             current.setDate(current.getDate() + 1);
           }
           weeks.push(currentWeek);
        }
        break;
      }
    }
    
    if (currentWeek.length > 0 && currentWeek.length < 7) {
      while(currentWeek.length < 7) {
        currentWeek.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [year, month]);

  const displayedGrid = useMemo(() => {
    if (viewMode === 'bulan') return calendarGrid;
    
    if (viewMode === 'pekan') {
      const week = calendarGrid.find(w => w.some(d => d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth()));
      return week ? [week] : [];
    }

    if (viewMode === 'hari') {
      return [[selectedDate]]; // Special handling in render for 1 day
    }
    
    return calendarGrid;
  }, [calendarGrid, viewMode, selectedDate]);

  const handlePrev = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'hari') newDate.setDate(newDate.getDate() - 1);
    else if (viewMode === 'pekan') newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'hari') newDate.setDate(newDate.getDate() + 1);
    else if (viewMode === 'pekan') newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const getIntensityClass = (count: number) => {
    if (count < 3) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (count < 6) return 'bg-emerald-300 text-emerald-900 border-emerald-400';
    if (count < 10) return 'bg-emerald-500 text-white border-emerald-600';
    return 'bg-emerald-700 text-white border-emerald-800';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs mb-6 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg whitespace-nowrap">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            Kalender
          </h3>
          
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            {(['hari', 'pekan', 'bulan'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-md transition-colors capitalize ${viewMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          {viewMode !== 'bulan' && (
            <div className="flex items-center gap-2">
              <button onClick={handlePrev} className="p-1 hover:bg-slate-100 rounded text-slate-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-slate-700 min-w-[120px] text-center">
                {viewMode === 'hari' 
                  ? `${selectedDate.getDate()} ${GREGORIAN_MONTHS_ID[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
                  : `Pekan ${selectedDate.getDate()} ${GREGORIAN_MONTHS_ID[selectedDate.getMonth()]}`}
              </span>
              <button onClick={handleNext} className="p-1 hover:bg-slate-100 rounded text-slate-600">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-slate-500">
            <span>Sedikit</span>
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-emerald-100"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-emerald-300"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-emerald-500"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-emerald-700"></div>
            <span>Banyak</span>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-slate-50">
        {/* Days Header */}
        <div className={`grid ${viewMode === 'hari' ? 'grid-cols-1' : 'grid-cols-7'} border-b border-slate-200`}>
          {viewMode === 'hari' ? (
            <div className="py-2 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-indigo-500">
              {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][selectedDate.getDay()]}
            </div>
          ) : (
            ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day, idx) => (
              <div key={day} className={`py-2 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-r-0 ${idx === 0 || idx === 6 ? 'text-indigo-400' : ''}`}>
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
            ))
          )}
        </div>
        
        {/* Calendar Grid */}
        <div className="flex flex-col bg-slate-200 gap-px">
          {displayedGrid.map((week, wIdx) => (
            <div key={wIdx} className={`grid ${viewMode === 'hari' ? 'grid-cols-1' : 'grid-cols-7'} gap-px`}>
              {week.map((day, dIdx) => {
                const isCurrentMonth = day.getMonth() + 1 === month;
                const m = String(day.getMonth() + 1).padStart(2, '0');
                const d = String(day.getDate()).padStart(2, '0');
                const dateStr = `${day.getFullYear()}-${m}-${d}`;
                const isToday = dateStr === todayStr;
                
                const count = heatmapData[dateStr] || 0;
                
                return (
                  <div 
                    key={dIdx}
                    onClick={() => {
                      if (isCurrentMonth || viewMode !== 'bulan') {
                        setSelectedDate(day);
                        onDateClick?.(day.getDate(), dateStr);
                      }
                    }}
                    className={`min-h-[100px] sm:min-h-[120px] p-1 sm:p-2 bg-white transition-colors cursor-pointer hover:bg-slate-50 ${(!isCurrentMonth && viewMode === 'bulan') ? 'opacity-40 bg-slate-50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`
                        inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs sm:text-sm font-semibold
                        ${isToday ? 'bg-indigo-600 text-white shadow-sm' : (isCurrentMonth || viewMode !== 'bulan') ? 'text-slate-700' : 'text-slate-400'}
                      `}>
                        {day.getDate()}
                      </span>
                    </div>
                    
                    <div className="mt-1 sm:mt-2 flex flex-col gap-1">
                      {count > 0 && (
                        <div 
                          className={`text-[9px] sm:text-[11px] font-medium px-1.5 py-1 rounded border truncate shadow-xs ${getIntensityClass(count)}`}
                          title={`${count} Aktivitas Terselesaikan`}
                        >
                          {count} <span className="hidden sm:inline">Aktivitas Selesai</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
