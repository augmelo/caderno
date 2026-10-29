import React from 'react';
import { LESSON_TITLES } from '../utils/clipboardExport';
import { Check, BookOpen } from 'lucide-react';

interface LessonNavProps {
  currentTab: number; // 0 = Home/Overview, 1..8 = Lessons
  completedLessons: number[];
  startedLessons: number[];
  onSelectTab: (tab: number) => void;
}

export const LessonNav: React.FC<LessonNavProps> = ({
  currentTab,
  completedLessons,
  startedLessons,
  onSelectTab,
}) => {
  return (
    <nav
      aria-label="Navegação das Aulas"
      className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs overflow-x-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 py-2 min-w-max">
        {/* Início / Visão Geral */}
        <button
          onClick={() => onSelectTab(0)}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 0
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Visão Geral</span>
        </button>

        <span className="h-4 w-px bg-slate-200 mx-1 shrink-0" aria-hidden="true" />

        {/* 8 Aulas */}
        {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((num) => {
          const isActive = currentTab === num;
          const isDone = completedLessons.includes(num);
          const hasContent = startedLessons.includes(num);
          const isPartial = num === 4;
          const isFinal = num === 8;

          return (
            <button
              key={num}
              onClick={() => onSelectTab(num)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-xs'
                  : 'bg-white border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-sky-600 text-white'
                    : hasContent
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : num}
              </span>

              <span>Aula {num}</span>

              {isPartial && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-md ml-0.5">
                  Parcial
                </span>
              )}

              {isFinal && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md ml-0.5">
                  Final
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
