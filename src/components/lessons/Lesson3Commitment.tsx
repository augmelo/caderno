import React from 'react';
import { Copy, Check, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';

interface Lesson3Props {
  q1_who: string;
  q2_what: string;
  q3_when: string;
  q4_where: string;
  q5_how: string;
  isCompleted: boolean;
  onUpdateAnswer: (
    key: 'q1_who' | 'q2_what' | 'q3_when' | 'q4_where' | 'q5_how',
    val: string
  ) => void;
  onToggleCompleted: () => void;
  onCopyToWord: () => void;
}

export const Lesson3Commitment: React.FC<Lesson3Props> = ({
  q1_who,
  q2_what,
  q3_when,
  q4_where,
  q5_how,
  isCompleted,
  onUpdateAnswer,
  onToggleCompleted,
  onCopyToWord,
}) => {
  const questions = [
    {
      key: 'q1_who' as const,
      num: 1,
      title: 'Quem será afetado?',
      help: 'Pense em quem faz parte do dia a dia da escola: estudantes de todas as séries, professores de diferentes matérias, equipe pedagógica, direção e famílias.',
      value: q1_who,
      feedsNext: null,
    },
    {
      key: 'q2_what' as const,
      num: 2,
      title: 'O que a política fará?',
      help: 'Qual é o objetivo principal e a regra geral? O que ela vai orientar, incentivar ou delimitar a respeito do uso de ferramentas de IA?',
      value: q2_what,
      feedsNext: null,
    },
    {
      key: 'q3_when' as const,
      num: 3,
      title: 'Quando?',
      help: 'Em quais momentos a IA pode ser usada? Quando entra em vigor? Há prazos de revisão da política? Durante provas ou apenas em tarefas de pesquisa?',
      value: q3_when,
      feedsNext: 'Aula 6 — Campo 7 (Quando entra em vigor)',
    },
    {
      key: 'q4_where' as const,
      num: 4,
      title: 'Onde?',
      help: 'Onde a IA poderá ser utilizada? Em sala de aula com supervisão, no laboratório de informática, na biblioteca, ou apenas em casa nas lições?',
      value: q4_where,
      feedsNext: 'Aula 6 — Campo 6 (Onde será usada)',
    },
    {
      key: 'q5_how' as const,
      num: 5,
      title: 'Como?',
      help: 'Como a política será aplicada e comunicada na prática? Como os professores vão orientar e como os estudantes comprovarão a autoria e o esforço próprio?',
      value: q5_how,
      feedsNext: 'Aula 6 — Campo 5 (Como será aplicada)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-sky-100 text-sky-800">
              Aula 3
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-display">
              Começando a política
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopyToWord}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Copiar respostas para colar no Google Docs"
            >
              <Copy className="w-4 h-4 text-slate-600" />
              Copiar para colar no Docs
            </button>
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

        {/* Introdução direta */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-sky-50 rounded-xl border border-sky-100">
          <BookOpen className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Responda às 5 perguntas norteadoras para iniciar a construção da política com as suas ideias para Quando, Onde e Como, elas alimentarão diretamente a versão inicial da política na Aula 6.
          </p>
        </div>

        {/* Aviso de Privacidade */}
        <div className="mt-4 flex items-center gap-2 px-3.5 py-2.5 bg-amber-50 rounded-lg border border-amber-200/80 text-amber-900 text-xs sm:text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Aviso de privacidade:</strong> Não coloque nomes, contatos ou dados pessoais de ninguém.
          </span>
        </div>

        {/* 5 Perguntas Norteadoras */}
        <div className="mt-8 space-y-6">
          {questions.map((q) => (
            <div
              key={q.key}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {q.num}
                  </span>
                  <label
                    htmlFor={q.key}
                    className="text-base font-bold text-slate-900 cursor-pointer"
                  >
                    {q.title}
                  </label>
                </div>

                {q.feedsNext && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                    <ArrowRight className="w-3 h-3" />
                    {q.feedsNext}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mb-3 ml-8">
                {q.help}
              </p>

              <div className="ml-0 sm:ml-8">
                <textarea
                  id={q.key}
                  rows={3}
                  value={q.value}
                  onChange={(e) => onUpdateAnswer(q.key, e.target.value)}
                  placeholder="Escreva sua resposta de forma simples e direta..."
                  className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
