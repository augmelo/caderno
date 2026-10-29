import React from 'react';
import { ExternalLink, Brain, Check } from 'lucide-react';

interface Lesson1Props {
  gameUrl: string;
  isCompleted: boolean;
  onToggleCompleted: () => void;
}

export const Lesson1BrainVsAi: React.FC<Lesson1Props> = ({
  gameUrl,
  isCompleted,
  onToggleCompleted,
}) => {
  const urlToUse = gameUrl || 'https://augmelo.github.io/radar-cognitvo/';

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Aula */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-sky-100 text-sky-800">
              Aula 1
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-display">
              Seu cérebro X IA
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCompleted}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Check className="w-4 h-4" />
              {isCompleted ? 'Concluída' : 'Marcar concluída'}
            </button>
          </div>
        </div>

        {/* Instrução direta */}
        <div className="mt-6 text-slate-700 leading-relaxed text-base sm:text-lg">
          Hoje você vai jogar o <strong>Radar Cognitivo</strong> e decidir se cada cenário é <strong>esforço cognitivo</strong> ou <strong>dependência cognitiva</strong>.
        </div>

        {/* Botão de Ação Principal: Jogar Radar Cognitivo */}
        <div className="mt-8 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-sky-50 to-white rounded-xl border border-sky-100 text-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-sky-200">
            <Brain className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Jogo Radar Cognitivo
          </h3>
          <p className="text-sm text-slate-600 max-w-md mb-6">
            Abra o jogo em uma nova aba, experimente os cenários e decida se cada situação representa esforço cognitivo ou dependência cognitiva.
          </p>

          <a
            href={urlToUse}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-base rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Jogar Radar Cognitivo</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};
