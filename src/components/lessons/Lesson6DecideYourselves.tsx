import React from 'react';
import { ScenarioTest } from '../../types/caderno';
import {
  Copy,
  Check,
  Lock,
  Unlock,
  ShieldAlert,
  ArrowRight,
  Clock,
  FileCheck,
} from 'lucide-react';

interface Lesson6Props {
  field1_principle: string;
  field2_schoolName: string;
  field3_cannotReplace: string;
  field4_canHelp: string;
  field5_howApplied: string;
  field6_whereUsed: string;
  field7_whenActive: string;
  v1Frozen: boolean;
  v1FrozenAt?: string;
  scenarios: {
    scenario1: ScenarioTest;
    scenario2: ScenarioTest;
    scenario3: ScenarioTest;
  };
  loopholeAgreement?: string;
  lastEditedBy: string;
  lastEditedAt: string;
  isCompleted: boolean;
  onUpdateField: (
    key:
      | 'field1_principle'
      | 'field2_schoolName'
      | 'field3_cannotReplace'
      | 'field4_canHelp'
      | 'field5_howApplied'
      | 'field6_whereUsed'
      | 'field7_whenActive',
    val: string
  ) => void;
  onUpdateScenario: (
    scenarioKey: 'scenario1' | 'scenario2' | 'scenario3',
    data: ScenarioTest
  ) => void;
  onToggleFreezeV1: () => void;
  onToggleCompleted: () => void;
  onCopyToWord: () => void;
}

export const Lesson6DecideYourselves: React.FC<Lesson6Props> = ({
  field1_principle,
  field2_schoolName,
  field3_cannotReplace,
  field4_canHelp,
  field5_howApplied,
  field6_whereUsed,
  field7_whenActive,
  v1Frozen,
  v1FrozenAt,
  scenarios,
  lastEditedBy,
  lastEditedAt,
  isCompleted,
  onUpdateField,
  onUpdateScenario,
  onToggleFreezeV1,
  onToggleCompleted,
  onCopyToWord,
}) => {
  const formattedLastEdit = lastEditedAt
    ? new Date(lastEditedAt).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Agora';

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-purple-100 text-purple-800">
              Aula 6
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-display">
              Validando a política
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopyToWord}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Copiar dados da aula para colar no Google Docs"
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

        {/* Informações de Autoria e Congelamento V1 */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>
              Última edição registrada por <strong>{lastEditedBy || 'Estudante'}</strong> em {formattedLastEdit}.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {v1Frozen ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Lock className="w-3.5 h-3.5" />
                Versão 1 Congelada {v1FrozenAt ? `(${new Date(v1FrozenAt).toLocaleDateString('pt-BR')})` : ''}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                <Unlock className="w-3.5 h-3.5" />
                Versão 1 em Edição
              </span>
            )}

            <button
              onClick={onToggleFreezeV1}
              className={`text-xs px-3 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                v1Frozen
                  ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-xs'
              }`}
            >
              {v1Frozen ? 'Descongelar V1' : 'Congelar como Versão 1'}
            </button>
          </div>
        </div>

        {/* Aviso de Privacidade */}
        <div className="mt-4 flex items-center gap-2 px-3.5 py-2.5 bg-amber-50 rounded-lg border border-amber-200/80 text-amber-900 text-xs sm:text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Aviso de privacidade:</strong> Não coloque nomes, contatos ou dados pessoais de ninguém.
          </span>
        </div>

        {/* PARTE 1: Política V1 (7 Campos) */}
        <div className="mt-8 border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Parte 1 — Política de Uso de IA na Escola (Versão 1)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              7 Campos Estruturados
            </span>
          </div>

          {/* Campo 1: Princípio [Fixo] */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Princípio Geral da Política
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                [Fixo — Leitura]
              </span>
            </div>
            <p className="text-sm text-slate-800 font-medium leading-relaxed italic">
              &ldquo;{field1_principle}&rdquo;
            </p>
          </div>

          {/* Campo 2: Para quem se aplica */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <label htmlFor="field2_schoolName" className="text-sm font-bold text-slate-900 cursor-pointer">
                2. Para quem se aplica a política:
              </label>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">
                [Fixo + Nome da Escola]
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs sm:text-sm text-slate-700 whitespace-nowrap">
                Aplica-se a estudantes e professores da escola:
              </span>
              <input
                id="field2_schoolName"
                type="text"
                disabled={v1Frozen}
                value={field2_schoolName}
                onChange={(e) => onUpdateField('field2_schoolName', e.target.value)}
                placeholder="Digite o nome da sua escola..."
                className={`flex-1 p-2 text-sm rounded-lg border ${
                  v1Frozen
                    ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
                    : 'border-slate-300 focus:border-purple-500 focus:outline-none'
                }`}
              />
            </div>
          </div>

          {/* Campo 3: O que a IA não pode substituir [Pré-preenchido de A5] */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
              <label htmlFor="field3_cannotReplace" className="text-sm font-bold text-slate-900 cursor-pointer">
                3. O que a IA não pode substituir no processo de aprendizagem:
              </label>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                <ArrowRight className="w-3 h-3" />
                [Pré-preenchido da Aula 5, P2 • Editável]
              </span>
            </div>
            <textarea
              id="field3_cannotReplace"
              rows={3}
              disabled={v1Frozen}
              value={field3_cannotReplace}
              onChange={(e) => onUpdateField('field3_cannotReplace', e.target.value)}
              placeholder="Refinem a resposta da Aula 5 para a versão oficial da política..."
              className={`w-full p-2.5 text-sm rounded-lg border ${
                v1Frozen
                  ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
                  : 'border-slate-300 focus:border-purple-500 focus:outline-none'
              }`}
            />
          </div>

          {/* Campo 4: Com o que a IA pode me ajudar [Pré-preenchido de A5] */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
              <label htmlFor="field4_canHelp" className="text-sm font-bold text-slate-900 cursor-pointer">
                4. Com o que a IA pode ajudar a aprender:
              </label>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                <ArrowRight className="w-3 h-3" />
                [Pré-preenchido da Aula 5, P1 • Editável]
              </span>
            </div>
            <textarea
              id="field4_canHelp"
              rows={3}
              disabled={v1Frozen}
              value={field4_canHelp}
              onChange={(e) => onUpdateField('field4_canHelp', e.target.value)}
              placeholder="Refinem as formas autorizadas de ajuda da IA..."
              className={`w-full p-2.5 text-sm rounded-lg border ${
                v1Frozen
                  ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
                  : 'border-slate-300 focus:border-purple-500 focus:outline-none'
              }`}
            />
          </div>

          {/* Campo 5: Como será aplicada [Pré-preenchido de A3] */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
              <label htmlFor="field5_howApplied" className="text-sm font-bold text-slate-900 cursor-pointer">
                5. Como será aplicada e fiscalizada na prática:
              </label>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100 font-medium">
                <ArrowRight className="w-3 h-3" />
                [Pré-preenchido da Aula 3, P5 (Como) • Editável]
              </span>
            </div>
            <textarea
              id="field5_howApplied"
              rows={3}
              disabled={v1Frozen}
              value={field5_howApplied}
              onChange={(e) => onUpdateField('field5_howApplied', e.target.value)}
              placeholder="Definam como a escola garantirá o cumprimento das regras..."
              className={`w-full p-2.5 text-sm rounded-lg border ${
                v1Frozen
                  ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
                  : 'border-slate-300 focus:border-purple-500 focus:outline-none'
              }`}
            />
          </div>

          {/* Campo 6: Onde será usada [Pré-preenchido de A3] */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
              <label htmlFor="field6_whereUsed" className="text-sm font-bold text-slate-900 cursor-pointer">
                6. Onde poderá ser usada:
              </label>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100 font-medium">
                <ArrowRight className="w-3 h-3" />
                [Pré-preenchido da Aula 3, P4 (Onde) • Editável]
              </span>
            </div>
            <textarea
              id="field6_whereUsed"
              rows={2}
              disabled={v1Frozen}
              value={field6_whereUsed}
              onChange={(e) => onUpdateField('field6_whereUsed', e.target.value)}
              placeholder="Ex.: Em casa nos rascunhos, no laboratório com autorização, nunca em avaliações fechadas..."
              className={`w-full p-2.5 text-sm rounded-lg border ${
                v1Frozen
                  ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
                  : 'border-slate-300 focus:border-purple-500 focus:outline-none'
              }`}
            />
          </div>

          {/* Campo 7: Quando entra em vigor [Pré-preenchido de A3] */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
              <label htmlFor="field7_whenActive" className="text-sm font-bold text-slate-900 cursor-pointer">
                7. Quando entra em vigor e prazos de revisão:
              </label>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100 font-medium">
                <ArrowRight className="w-3 h-3" />
                [Pré-preenchido da Aula 3, P3 (Quando) • Editável]
              </span>
            </div>
            <textarea
              id="field7_whenActive"
              rows={2}
              disabled={v1Frozen}
              value={field7_whenActive}
              onChange={(e) => onUpdateField('field7_whenActive', e.target.value)}
              placeholder="Ex.: A partir do próximo bimestre letivo, com revisão semestral pelos representantes..."
              className={`w-full p-2.5 text-sm rounded-lg border ${
                v1Frozen
                  ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
                  : 'border-slate-300 focus:border-purple-500 focus:outline-none'
              }`}
            />
          </div>
        </div>

        {/* PARTE 2: Testes com 3 Cenários Práticos */}
        <div className="mt-8 border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Parte 2 — Testando a Política com 3 Cenários Reais
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Avaliem como a proposta de vocês responde a cada uma destas 3 situações cotidianas na escola:
            </p>
          </div>

          {/* Cenário 1: Ciências */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Cenário 1 • Ciências da Natureza
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">A política considera:</span>
                <select
                  value={scenarios.scenario1.action}
                  onChange={(e) =>
                    onUpdateScenario('scenario1', {
                      ...scenarios.scenario1,
                      action: e.target.value as ScenarioTest['action'],
                    })
                  }
                  className="text-xs bg-white border border-slate-300 rounded-md px-2 py-1 font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="Permitida">Permitida</option>
                  <option value="Limitada">Limitada com regras</option>
                  <option value="Proibida">Proibida</option>
                </select>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 mb-3 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
              <em>&ldquo;Um estudante usa a IA para resumir um artigo científico de Biologia e colar o resumo diretamente no trabalho avaliativo sem ler o artigo original. O que a política de vocês diz sobre isso?&rdquo;</em>
            </p>
            <textarea
              rows={2}
              value={scenarios.scenario1.analysis}
              onChange={(e) =>
                onUpdateScenario('scenario1', {
                  ...scenarios.scenario1,
                  analysis: e.target.value,
                })
              }
              placeholder="O que o estudante deveria fazer? Qual a consequência ou orientação do professor?"
              className="w-full p-2.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Cenário 2: História */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Cenário 2 • Ciências Humanas (História)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">A política considera:</span>
                <select
                  value={scenarios.scenario2.action}
                  onChange={(e) =>
                    onUpdateScenario('scenario2', {
                      ...scenarios.scenario2,
                      action: e.target.value as ScenarioTest['action'],
                    })
                  }
                  className="text-xs bg-white border border-slate-300 rounded-md px-2 py-1 font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="Permitida">Permitida</option>
                  <option value="Limitada">Limitada com regras</option>
                  <option value="Proibida">Proibida</option>
                </select>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 mb-3 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
              <em>&ldquo;Em uma redação sobre a Revolução Industrial, o estudante pede à IA argumentos contra e a favor para comparar com suas próprias ideias e cita a IA nas referências bibliográficas.&rdquo;</em>
            </p>
            <textarea
              rows={2}
              value={scenarios.scenario2.analysis}
              onChange={(e) =>
                onUpdateScenario('scenario2', {
                  ...scenarios.scenario2,
                  analysis: e.target.value,
                })
              }
              placeholder="Como a política avalia esse uso? Ele fortalece ou substitui o esforço cognitivo?"
              className="w-full p-2.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Cenário 3: Trabalho em Grupo */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Cenário 3 • Trabalho em Equipe
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">A política considera:</span>
                <select
                  value={scenarios.scenario3.action}
                  onChange={(e) =>
                    onUpdateScenario('scenario3', {
                      ...scenarios.scenario3,
                      action: e.target.value as ScenarioTest['action'],
                    })
                  }
                  className="text-xs bg-white border border-slate-300 rounded-md px-2 py-1 font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="Permitida">Permitida</option>
                  <option value="Limitada">Limitada com regras</option>
                  <option value="Proibida">Proibida</option>
                </select>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 mb-3 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
              <em>&ldquo;Um integrante do grupo não participou das discussões e gerou todos os slides na IA 2 minutos antes de entregar o projeto para o professor.&rdquo;</em>
            </p>
            <textarea
              rows={2}
              value={scenarios.scenario3.analysis}
              onChange={(e) =>
                onUpdateScenario('scenario3', {
                  ...scenarios.scenario3,
                  analysis: e.target.value,
                })
              }
              placeholder="Como a política resolve o conflito de autoria e a nota do grupo?"
              className="w-full p-2.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
