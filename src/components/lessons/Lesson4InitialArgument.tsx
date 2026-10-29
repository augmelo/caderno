import React from 'react';
import {
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  PenTool,
  CheckCircle2,
  Scroll,
} from 'lucide-react';

interface Lesson4Props {
  thinkBeforeAi: string;
  verifyQuestionAi: string;
  honestyResponsibility: string;
  signature: string;
  date: string;
  isCompleted: boolean;
  onUpdateField: (
    key:
      | 'thinkBeforeAi'
      | 'verifyQuestionAi'
      | 'honestyResponsibility'
      | 'signature'
      | 'date',
    val: string
  ) => void;
  onToggleCompleted: () => void;
  onCopyToDocs: () => void;
}

export const Lesson4InitialArgument: React.FC<Lesson4Props> = ({
  thinkBeforeAi,
  verifyQuestionAi,
  honestyResponsibility,
  signature,
  date,
  isCompleted,
  onUpdateField,
  onToggleCompleted,
  onCopyToDocs,
}) => {
  // Verifica se a entrega parcial está registrada (todos os 3 compromissos e assinatura preenchidos)
  const isDelivered = Boolean(
    thinkBeforeAi.trim() &&
      verifyQuestionAi.trim() &&
      honestyResponsibility.trim() &&
      signature.trim()
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                Aula 4 • Entrega Parcial
              </span>
              {isDelivered && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-600 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Entrega parcial registrada
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-display">
              Meu compromisso
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopyToDocs}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Copiar compromisso para colar no Google Docs"
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

        {/* Instrução da Entrega Parcial */}
        <div className="mt-6 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-slate-800 text-sm sm:text-base leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-950">
              Marco de Entrega Parcial do Caderno
            </p>
            <p className="text-slate-700 mt-1">
              Escreva os três compromissos pessoais nos campos abaixo. À medida que você preenche ou revisa cada campo, a ficha <strong>MEU COMPROMISSO</strong> é atualizada em tempo real.
            </p>
          </div>
        </div>

        {/* Campos de Elaboração (Formulário) */}
        <div className="mt-8 space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-emerald-600" />
              Campos de elaboração:
            </h3>
          </div>

          {/* 1. Como vou tentar pensar e resolver antes de recorrer à IA */}
          <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <label
                htmlFor="thinkBeforeAi"
                className="text-sm sm:text-base font-bold text-slate-900 cursor-pointer"
              >
                Como vou tentar pensar e resolver antes de recorrer à IA.
              </label>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 ml-8">
              O que você se compromete a fazer <em>antes</em> de abrir qualquer ferramenta de IA (ex.: formular sua própria hipótese, tentar resolver sozinho, rascunhar o primeiro parágrafo)?
            </p>
            <div className="ml-0 sm:ml-8">
              <textarea
                id="thinkBeforeAi"
                rows={3}
                value={thinkBeforeAi}
                onChange={(e) => onUpdateField('thinkBeforeAi', e.target.value)}
                placeholder="Exemplo: Antes de pedir ajuda à IA, vou sempre escrever ao menos três ideias minhas no papel e tentar resolver o exercício por conta própria..."
                className="w-full p-3 text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 2. Como vou verificar ou questionar o que a IA gerar */}
          <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <label
                htmlFor="verifyQuestionAi"
                className="text-sm sm:text-base font-bold text-slate-900 cursor-pointer"
              >
                Como vou verificar ou questionar o que a IA gerar.
              </label>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 ml-8">
              Como você vai agir quando a IA entregar uma resposta? O que fará para não aceitar cegamente as respostas e checar fontes e alucinações?
            </p>
            <div className="ml-0 sm:ml-8">
              <textarea
                id="verifyQuestionAi"
                rows={3}
                value={verifyQuestionAi}
                onChange={(e) => onUpdateField('verifyQuestionAi', e.target.value)}
                placeholder="Exemplo: Não vou colar nenhuma resposta sem checar no livro didático ou em fontes confiáveis fora do chat. Se a IA citar uma data ou fato, vou pesquisar se ele realmente existe..."
                className="w-full p-3 text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 3. Como vou agir com honestidade e responsabilidade sobre minhas produções */}
          <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <label
                htmlFor="honestyResponsibility"
                className="text-sm sm:text-base font-bold text-slate-900 cursor-pointer"
              >
                Como vou agir com honestidade e responsabilidade sobre minhas produções.
              </label>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 ml-8">
              Como você garantirá que a autoria do trabalho continue sendo sua e como comunicará aos professores e colegas quando a IA for consultada?
            </p>
            <div className="ml-0 sm:ml-8">
              <textarea
                id="honestyResponsibility"
                rows={3}
                value={honestyResponsibility}
                onChange={(e) => onUpdateField('honestyResponsibility', e.target.value)}
                placeholder="Exemplo: Comprometo-me a ser transparente e declarar quando usei IA como apoio. O texto final entregue será redigido por mim, defendendo apenas ideias que compreendo..."
                className="w-full p-3 text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Assinatura e Data da Ficha */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="signature"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                <PenTool className="w-3.5 h-3.5 text-slate-500" />
                Assinatura do aluno (apelido ou código):
              </label>
              <input
                id="signature"
                type="text"
                value={signature}
                onChange={(e) => onUpdateField('signature', e.target.value)}
                placeholder="Digite seu nome, apelido ou código como assinatura..."
                className="w-full p-2.5 text-sm font-medium bg-white rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              />
            </div>

            <div className="w-full sm:w-48">
              <label
                htmlFor="date"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Data:
              </label>
              <input
                id="date"
                type="text"
                value={date}
                onChange={(e) => onUpdateField('date', e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full p-2.5 text-sm font-medium bg-white rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* FICHA OFICIAL: MEU COMPROMISSO (Exibida desde a primeira abertura, atualizada em tempo real) */}
        <div className="mt-10 border-2 border-emerald-600/80 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-emerald-50/50 via-white to-white shadow-sm">
          <div className="text-center pb-6 border-b border-emerald-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2 uppercase tracking-wider">
              <Scroll className="w-3.5 h-3.5" />
              Ficha Preenchida em Tempo Real
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide font-display">
              MEU COMPROMISSO
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-700 italic max-w-xl mx-auto leading-relaxed">
              Neste ano, comprometo-me a usar a IA como uma ferramenta para apoiar meu aprendizado, não para substituir meu pensamento. Eu irei:
            </p>
          </div>

          <div className="py-6 space-y-6">
            {/* Item 1 */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="flex-1">
                {thinkBeforeAi.trim() ? (
                  <p className="text-sm sm:text-base text-slate-900 whitespace-pre-wrap font-medium p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100/80">
                    {thinkBeforeAi}
                  </p>
                ) : (
                  <div className="h-10 border-b-2 border-dashed border-slate-300 flex items-center text-xs italic text-slate-400">
                    __________________________________________________________________________
                  </div>
                )}
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="flex-1">
                {verifyQuestionAi.trim() ? (
                  <p className="text-sm sm:text-base text-slate-900 whitespace-pre-wrap font-medium p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100/80">
                    {verifyQuestionAi}
                  </p>
                ) : (
                  <div className="h-10 border-b-2 border-dashed border-slate-300 flex items-center text-xs italic text-slate-400">
                    __________________________________________________________________________
                  </div>
                )}
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="flex-1">
                {honestyResponsibility.trim() ? (
                  <p className="text-sm sm:text-base text-slate-900 whitespace-pre-wrap font-medium p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100/80">
                    {honestyResponsibility}
                  </p>
                ) : (
                  <div className="h-10 border-b-2 border-dashed border-slate-300 flex items-center text-xs italic text-slate-400">
                    __________________________________________________________________________
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assinatura e Data da Ficha */}
          <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600 font-semibold">Assinatura do aluno:</span>
              <span className="font-bold text-slate-900 underline decoration-emerald-500 decoration-2 underline-offset-4">
                {signature.trim() || '______________________________'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600 font-semibold">Data:</span>
              <span className="font-bold text-slate-900 underline decoration-emerald-500 decoration-2 underline-offset-4">
                {date.trim() || '____/____/________'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
