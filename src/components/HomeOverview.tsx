import React from 'react';
import { CadernoState } from '../types/caderno';
import { LESSON_TITLES } from '../utils/clipboardExport';
import {
  BookOpen,
  CheckCircle2,
  Copy,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface HomeOverviewProps {
  state: CadernoState;
  completedLessons: number[];
  startedLessons: number[];
  onSelectLesson: (lessonNum: number) => void;
  onOpenProfileManager?: () => void;
  onCopyCompleteNotebook: () => void;
  onCopyPartialDelivery: () => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  state,
  completedLessons,
  startedLessons,
  onSelectLesson,
  onOpenProfileManager,
  onCopyCompleteNotebook,
  onCopyPartialDelivery,
}) => {
  const lessonDescriptions: Record<number, string> = {
    1: 'Jogar o Radar Cognitivo na plataforma Alura Start e refletir sobre esforço cognitivo versus dependência cognitiva.',
    2: 'Identificar estratégias de design conversacional (curiosidade, bajulação, presença social e autoridade) na conversa com a IA.',
    3: 'Responder individualmente às 5 perguntas norteadoras (Quem, O que, Quando, Onde e Como) para o início da elaboração da política.',
    4: 'Assumir os 3 compromissos de estudo ético com a IA, assinar a ficha e registrar a Entrega Parcial com visualização para impressão.',
    5: 'Organizar o grupo (até 5 integrantes e papéis opcionais), debater as duas perguntas centrais e analisar os sinais de dependência cognitiva.',
    6: 'Estruturar os 7 campos da Política V1 pré-preenchidos e testar a proposta em 3 cenários práticos.',
    7: 'Consolidar a versão final da política, gerar o prompt do mapa mental, registrar imagem/tópicos e dividir as falas do ensaio.',
    8: 'Checklist pré-apresentação da política e passo a passo visual para gerar o link compartilhável do Google Docs como leitor.',
  };

  const totalCompleted = completedLessons.length;

  return (
    <div className="space-y-8 pb-12">
      {/* Banner de Boas-vindas e Contextualização Pedagógica */}
      <div className="bg-gradient-to-br from-sky-50 via-white to-purple-50/40 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Caderno de Metacognição — IA na Escola
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            Como usar a Inteligência Artificial na escola para apoiar a aprendizagem sem substituir o pensamento dos estudantes?
          </p>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Este caderno é o seu espaço de registro, reflexão e autoria ao longo de 8 aulas. Aqui você documenta suas análises individuais e a construção coletiva da proposta de política de uso de IA na escola. O foco não é gerar respostas prontas, mas revisar o seu próprio modo de pensar e checar evidências do mundo real.
          </p>
        </div>

        {/* Barra de Ações Rápidas */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Progresso do Perfil ({state.nickname}):</span>
            <span>
              <strong className="text-sky-700 font-bold">{totalCompleted}</strong> de 8 aulas concluídas
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onCopyPartialDelivery}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
              title="Copiar entrega parcial formatada e abrir no Google Docs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              Abrir Entrega Parcial no Docs
            </button>
            <button
              onClick={onCopyCompleteNotebook}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs cursor-pointer"
              title="Copiar todas as 8 aulas para colar no Google Docs"
            >
              <Copy className="w-3.5 h-3.5 text-sky-300" />
              Copiar Caderno Completo (Docs)
            </button>
          </div>
        </div>
      </div>

      {/* Grid das 8 Aulas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Percurso das 8 Aulas</h2>
          <span className="text-xs text-slate-500">Navegue livremente e revise suas respostas a qualquer momento</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((num) => {
            const isCompleted = completedLessons.includes(num);
            const isStarted = startedLessons.includes(num);
            const isPartial = num === 4;
            const isFinal = num === 8;

            return (
              <div
                key={num}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all hover:shadow-md bg-white ${
                  isPartial
                    ? 'border-orange-300 ring-1 ring-orange-200'
                    : isFinal
                    ? 'border-purple-300 ring-1 ring-purple-200'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Badges / Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-800">
                      {num}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isPartial && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                          Entrega Parcial
                        </span>
                      )}
                      {isFinal && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          Entrega Final
                        </span>
                      )}
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Concluída
                        </span>
                      ) : isStarted ? (
                        <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Em andamento
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Não iniciada</span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{LESSON_TITLES[num]}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{lessonDescriptions[num]}</p>
                </div>

                <button
                  onClick={() => onSelectLesson(num)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Abrir Aula {num}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Banner de aviso sobre computador compartilhado */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Dica de preservação dos seus registros:</strong> Este caderno salva automaticamente as suas respostas na memória local deste navegador. Como não existe login, cole no seu docs o que desenvolveu aula a aula. Assim, se você usar outro computador na próxima semana, basta abrir o seu arquivo para resgatar tudo que você já fez anteriormente!
        </div>
      </div>
    </div>
  );
};
