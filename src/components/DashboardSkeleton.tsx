import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 pb-16 animate-pulse">
      {/* BENTO GRID SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* TOP LEFT: Main Banner Skeleton (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-6 w-36 bg-emerald-100 dark:bg-emerald-950/60 rounded-full" />
              <div className="h-6 w-44 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
            <div className="h-8 w-64 sm:w-80 bg-slate-200 dark:bg-slate-700 rounded-xl mt-3" />
            <div className="h-4 w-full max-w-md bg-slate-100 dark:bg-slate-700/60 rounded-lg mt-3" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-9 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-9 w-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl ml-auto" />
          </div>
        </div>

        {/* TOP RIGHT: Hijri / Clock Card Skeleton (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="h-4 w-28 bg-emerald-700/60 rounded-md mb-6" />
            <div className="h-10 w-44 bg-emerald-700/40 rounded-xl mb-2" />
            <div className="h-6 w-24 bg-emerald-700/30 rounded-lg mb-4" />
          </div>
          <div className="h-16 w-full bg-emerald-800/40 rounded-2xl" />
        </div>

        {/* BOTTOM LEFT: 3 Metric Cards (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700" />
                <div className="w-16 h-5 rounded-lg bg-slate-100 dark:bg-slate-700" />
              </div>
              <div>
                <div className="h-9 w-20 bg-slate-200 dark:bg-slate-700 rounded-xl mb-2" />
                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM RIGHT: Activity Timeline Skeleton (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-700/50">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-md" />
            <div className="h-4 w-12 bg-slate-100 dark:bg-slate-700 rounded-full" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 mt-1 shrink-0" />
                <div className="w-full space-y-1.5">
                  <div className="h-3.5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-2.5 w-1/2 bg-slate-100 dark:bg-slate-700/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS OVERVIEW SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2" />
              <div className="h-3 w-64 bg-slate-100 dark:bg-slate-700/60 rounded" />
            </div>
            <div className="h-8 w-28 bg-slate-100 dark:bg-slate-700 rounded-xl" />
          </div>
          {/* Bar chart placeholder */}
          <div className="h-64 flex items-end justify-between gap-3 pt-8 px-4 border-b border-slate-100 dark:border-slate-700/50">
            {[40, 75, 55, 90, 65, 80, 50, 85, 70, 95].map((h, i) => (
              <div 
                key={i} 
                className="w-full bg-slate-200 dark:bg-slate-700/70 rounded-t-lg transition-all" 
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Top 3 Pejuang Skeleton (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 shrink-0" />
                <div className="w-full space-y-1.5">
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-700/60 rounded" />
                </div>
                <div className="w-10 h-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HEATMAP SKELETON */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-4 w-28 bg-slate-100 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 pt-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700/40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
