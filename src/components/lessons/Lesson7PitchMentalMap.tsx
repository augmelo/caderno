import React, { useState } from 'react';
import { GroupMember, RehearsalItem } from '../../types/caderno';
import {
  Copy,
  Check,
  Trash2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Unlock,
  Plus,
  CheckCircle2,
  Eye,
  X,
  FileText,
} from 'lucide-react';
import { escapeHtml, copyExportToClipboard } from '../../utils/clipboardExport';

interface Lesson7Props {
  members: GroupMember[];
  finalPolicy: {
    field1_principle: string;
    field2_target: string;
    field3_cannotReplace: string;
    field4_canHelp: string;
    field5_howApplied: string;
    field6_whereUsed: string;
    field7_whenActive: string;
    finalFrozen: boolean;
    finalFrozenAt?: string;
  };
  conferenceChecks: {
    checkScope: boolean;
    checkClarity: boolean;
    checkCognitiveEffort: boolean;
  };
  checklist: {
    check1_allCovered: boolean;
    check2_visualClarity: boolean;
    check3_cognitiveEffortCenter: boolean;
  };
  rehearsal: RehearsalItem[];
  lastEditedBy: string;
  lastEditedAt: string;
  isCompleted: boolean;
  aula6Findings: {
    scenarios: {
      s1: { action: string; analysis: string };
      s2: { action: string; analysis: string };
      s3: { action: string; analysis: string };
    };
    loopholeAgreement: string;
  };
  onUpdateFinalPolicy: (updates: Partial<Lesson7Props['finalPolicy']>) => void;
  onUpdateConferenceChecks: (checks: Partial<Lesson7Props['conferenceChecks']>) => void;
  onUpdateChecklist: (checklist: Partial<Lesson7Props['checklist']>) => void;
  onUpdateRehearsal: (rehearsal: RehearsalItem[]) => void;
  onToggleFinalFrozen: () => void;
  onToggleCompleted: () => void;
  onCopyToWord: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const Lesson7PitchMentalMap: React.FC<Lesson7Props> = ({
  members,
  finalPolicy,
  conferenceChecks,
  checklist,
  rehearsal,
  lastEditedBy,
  lastEditedAt,
  isCompleted,
  aula6Findings,
  onUpdateFinalPolicy,
  onUpdateConferenceChecks,
  onUpdateChecklist,
  onUpdateRehearsal,
  onToggleFinalFrozen,
  onToggleCompleted,
  onCopyToWord,
  onShowToast,
}) => {
  const [showFindingsAccordion, setShowFindingsAccordion] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [modalCopiedToast, setModalCopiedToast] = useState(false);

  // Copiar apenas a política final para o Docs
  const handleCopyPolicyToDocs = async () => {
    const policyHtml = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>Política Final de Uso de IA na Escola</title></head>
        <body style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #0f172a;">
          <div style="border-bottom: 2pt solid #0284c7; padding-bottom: 6pt; margin-bottom: 12pt;">
            <h1 style="color: #0284c7; font-size: 16pt; margin: 0;">Política Final de Uso de Inteligência Artificial na Escola</h1>
            <p style="color: #64748b; font-size: 10pt; margin: 4pt 0 0 0;">Versão Final Consolidada</p>
          </div>
          <p><strong>1. Princípio Geral:</strong><br/>${escapeHtml(finalPolicy.field1_principle)}</p>
          <p><strong>2. Para quem (Público-alvo):</strong><br/>${escapeHtml(finalPolicy.field2_target || 'Não preenchido')}</p>
          <p><strong>3. O que a IA NÃO pode substituir:</strong><br/>${escapeHtml(finalPolicy.field3_cannotReplace || 'Não preenchido')}</p>
          <p><strong>4. Com o que a IA PODE ajudar:</strong><br/>${escapeHtml(finalPolicy.field4_canHelp || 'Não preenchido')}</p>
          <p><strong>5. Como será aplicada (Fiscalização e Transparência):</strong><br/>${escapeHtml(finalPolicy.field5_howApplied || 'Não preenchido')}</p>
          <p><strong>6. Onde será usada:</strong><br/>${escapeHtml(finalPolicy.field6_whereUsed || 'Não preenchido')}</p>
          <p><strong>7. Quando entra em vigor:</strong><br/>${escapeHtml(finalPolicy.field7_whenActive || 'Não preenchido')}</p>
        </body>
      </html>
    `.trim();

    const policyText = `POLÍTICA FINAL DE USO DE IA NA ESCOLA\n\n` +
      `1. Princípio Geral:\n${finalPolicy.field1_principle}\n\n` +
      `2. Para quem (Público-alvo):\n${finalPolicy.field2_target || 'Não preenchido'}\n\n` +
      `3. O que a IA NÃO pode substituir:\n${finalPolicy.field3_cannotReplace || 'Não preenchido'}\n\n` +
      `4. Com o que a IA PODE ajudar:\n${finalPolicy.field4_canHelp || 'Não preenchido'}\n\n` +
      `5. Como será aplicada:\n${finalPolicy.field5_howApplied || 'Não preenchido'}\n\n` +
      `6. Onde será usada:\n${finalPolicy.field6_whereUsed || 'Não preenchido'}\n\n` +
      `7. Quando entra em vigor:\n${finalPolicy.field7_whenActive || 'Não preenchido'}`;

    const copied = await copyExportToClipboard({ html: policyHtml, text: policyText });
    if (copied) {
      setModalCopiedToast(true);
      setTimeout(() => setModalCopiedToast(false), 2500);
      onShowToast('success', 'Política copiada com sucesso!', 'Cole no Google Docs (Ctrl + V).');
    } else {
      onShowToast('error', 'Falha ao copiar', 'Tente selecionar e copiar o texto manualmente.');
    }
  };

  // Copiar prompt do mapa mental
  const generatedMapPrompt = `Gere uma estrutura de mapa mental clara e visual para a seguinte proposta de Política de Uso de Inteligência Artificial na Escola:\n\nNÓ CENTRAL: Política de IA — Proteger o Esforço Cognitivo e a Autoria\n\nRAMOS PRINCIPAIS:\n1. Princípio Geral: ${finalPolicy.field1_principle}\n2. Público: ${finalPolicy.field2_target || 'Toda a comunidade escolar'}\n3. O que a IA NÃO substitui: ${finalPolicy.field3_cannotReplace || 'Pensamento autônomo e esforço próprio'}\n4. Com o que a IA AJUDA: ${finalPolicy.field4_canHelp || 'Tutor de dúvidas e rascunhos'}\n5. Como será aplicada: ${finalPolicy.field5_howApplied || 'Transparência e fiscalização pedagógica'}\n6. Onde será usada: ${finalPolicy.field6_whereUsed || 'Locais e situações autorizadas'}\n7. Quando entra em vigor: ${finalPolicy.field7_whenActive || 'Início do próximo ciclo'}\n\nCrie uma hierarquia visual equilibrada em formato de tópicos conectados ou código Mermaid.`;

  const handleCopyMapPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedMapPrompt);
      onShowToast('success', 'Prompt copiado!', 'Cole no gerador de mapas mentais da sua preferência.');
    } catch {
      onShowToast('error', 'Erro ao copiar', 'Copie o texto manualmente.');
    }
  };

  // Adicionar item de ensaio
  const handleAddRehearsal = () => {
    const firstMember = members[0]?.name || 'Integrante';
    const newItem: RehearsalItem = {
      memberId: 'reh_' + Date.now().toString(36),
      memberName: firstMember,
      branchAssigned: '',
      estimatedTime: '45 segundos',
    };
    onUpdateRehearsal([...rehearsal, newItem]);
  };

  const handleUpdateRehearsalItem = (index: number, updates: Partial<RehearsalItem>) => {
    const updated = [...rehearsal];
    updated[index] = { ...updated[index], ...updates };
    onUpdateRehearsal(updated);
  };

  const handleRemoveRehearsalItem = (index: number) => {
    const updated = rehearsal.filter((_, i) => i !== index);
    onUpdateRehearsal(updated);
  };

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
              Aula 7
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-display">
              O mapa mental da política
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowPolicyModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors cursor-pointer"
              title="Visualizar versão final da nossa política"
            >
              <Eye className="w-4 h-4 text-purple-600" />
              Visualizar versão final da nossa política
            </button>
            <button
              onClick={() => onCopyToWord()}
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

        {/* Faixa de Edição e Status da Versão Final */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>
              Última edição por <strong>{lastEditedBy || 'Estudante'}</strong> em {formattedLastEdit}.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {finalPolicy.finalFrozen ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Versão Final Salva
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                <Unlock className="w-3.5 h-3.5" />
                Versão Final em Ajustes
              </span>
            )}

            <button
              onClick={onToggleFinalFrozen}
              className={`text-xs px-3 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                finalPolicy.finalFrozen
                  ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
              }`}
            >
              {finalPolicy.finalFrozen ? 'Editar Versão Final' : 'Salvar como Versão Final'}
            </button>
          </div>
        </div>

        {/* Painel Retrátil de Consulta aos Achados da Aula 6 */}
        <div className="mt-6 border border-purple-200 rounded-xl overflow-hidden bg-purple-50/40">
          <button
            onClick={() => setShowFindingsAccordion(!showFindingsAccordion)}
            className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-purple-950 hover:bg-purple-100/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Rever achados da Aula 6 (Cenários e Brechas da IA) para inspirar a versão final</span>
            </div>
            {showFindingsAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFindingsAccordion && (
            <div className="p-4 pt-0 border-t border-purple-100 text-xs text-slate-700 space-y-3">
              <div className="bg-white p-3 rounded border border-purple-100">
                <strong className="text-purple-900 block mb-1">Deliberação sobre Brechas da IA (Aula 6):</strong>
                <p className="whitespace-pre-wrap">{aula6Findings.loopholeAgreement || 'Nenhuma anotação registrada na Aula 6.'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-white p-2.5 rounded border border-purple-100">
                  <strong>Cenário 1 (Ciências):</strong> [{aula6Findings.scenarios.s1.action || 'Sem decisão'}]
                  <p className="mt-1 text-slate-600">{aula6Findings.scenarios.s1.analysis || '-'}</p>
                </div>
                <div className="bg-white p-2.5 rounded border border-purple-100">
                  <strong>Cenário 2 (História):</strong> [{aula6Findings.scenarios.s2.action || 'Sem decisão'}]
                  <p className="mt-1 text-slate-600">{aula6Findings.scenarios.s2.analysis || '-'}</p>
                </div>
                <div className="bg-white p-2.5 rounded border border-purple-100">
                  <strong>Cenário 3 (Grupo):</strong> [{aula6Findings.scenarios.s3.action || 'Sem decisão'}]
                  <p className="mt-1 text-slate-600">{aula6Findings.scenarios.s3.analysis || '-'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PARTE 1: Política Final (7 Campos Editáveis) */}
        <div className="mt-8 border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Parte 1 — Política Final de Uso de IA na Escola
            </h3>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Alimenta a Aula 8 (Apresentação)
            </span>
          </div>

          {/* 1. Princípio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              1. Princípio Geral [Consolidado]:
            </label>
            <textarea
              rows={2}
              value={finalPolicy.field1_principle}
              onChange={(e) => onUpdateFinalPolicy({ field1_principle: e.target.value })}
              className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* 2. Público-alvo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              2. Público-alvo e Escola:
            </label>
            <input
              type="text"
              value={finalPolicy.field2_target}
              onChange={(e) => onUpdateFinalPolicy({ field2_target: e.target.value })}
              placeholder="Ex.: Estudantes, professores e gestão da Escola Estadual..."
              className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* 3 e 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                3. O que a IA NÃO pode substituir:
              </label>
              <textarea
                rows={3}
                value={finalPolicy.field3_cannotReplace}
                onChange={(e) => onUpdateFinalPolicy({ field3_cannotReplace: e.target.value })}
                className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                4. Com o que a IA PODE ajudar:
              </label>
              <textarea
                rows={3}
                value={finalPolicy.field4_canHelp}
                onChange={(e) => onUpdateFinalPolicy({ field4_canHelp: e.target.value })}
                className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 5, 6 e 7 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                5. Como será aplicada:
              </label>
              <textarea
                rows={3}
                value={finalPolicy.field5_howApplied}
                onChange={(e) => onUpdateFinalPolicy({ field5_howApplied: e.target.value })}
                className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                6. Onde será usada:
              </label>
              <textarea
                rows={3}
                value={finalPolicy.field6_whereUsed}
                onChange={(e) => onUpdateFinalPolicy({ field6_whereUsed: e.target.value })}
                className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                7. Quando entra em vigor:
              </label>
              <textarea
                rows={3}
                value={finalPolicy.field7_whenActive}
                onChange={(e) => onUpdateFinalPolicy({ field7_whenActive: e.target.value })}
                className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Perguntas de Conferência */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Perguntas de Conferência Rápida:
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={conferenceChecks.checkScope}
                  onChange={(e) => onUpdateConferenceChecks({ checkScope: e.target.checked })}
                  className="rounded text-purple-600 w-4 h-4"
                />
                <span>Cobrimos com clareza onde pode e onde não pode usar IA?</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={conferenceChecks.checkClarity}
                  onChange={(e) => onUpdateConferenceChecks({ checkClarity: e.target.checked })}
                  className="rounded text-purple-600 w-4 h-4"
                />
                <span>As regras são compreensíveis para qualquer estudante e professor da escola?</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={conferenceChecks.checkCognitiveEffort}
                  onChange={(e) => onUpdateConferenceChecks({ checkCognitiveEffort: e.target.checked })}
                  className="rounded text-purple-600 w-4 h-4"
                />
                <span>O foco da política está em proteger o esforço cognitivo e a autoria própria?</span>
              </label>
            </div>
          </div>
        </div>

        {/* PARTE 2: Prompt do Mapa Mental */}
        <div className="mt-8 border border-purple-200 bg-purple-50/50 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-purple-100">
            <div>
              <h3 className="text-base font-bold text-purple-950">
                Parte 2 — Prompt do Mapa Mental
              </h3>
              <p className="text-xs text-purple-700">
                Gera a estrutura dos ramos para colar no gerador de mapas da sua escolha.
              </p>
            </div>
            <button
              onClick={handleCopyMapPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              Copiar Prompt do Mapa
            </button>
          </div>

          {/* Aviso de Privacidade */}
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-md border border-amber-200 text-amber-900 text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Não coloque nomes, contatos ou dados pessoais de ninguém ao gerar imagens externas.</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-purple-200 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto">
            {generatedMapPrompt}
          </div>
        </div>

        {/* PARTE 3: Checklist do Mapa Mental */}
        <div className="mt-8 border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Parte 3 — Checklist de Qualidade do Mapa Mental
          </h3>

          <div className="space-y-2 text-xs sm:text-sm text-slate-800">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checklist.check1_allCovered}
                onChange={(e) => onUpdateChecklist({ check1_allCovered: e.target.checked })}
                className="rounded text-purple-600 w-4 h-4"
              />
              <span>1. Todos os 7 pontos da política estão representados no mapa.</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checklist.check2_visualClarity}
                onChange={(e) => onUpdateChecklist({ check2_visualClarity: e.target.checked })}
                className="rounded text-purple-600 w-4 h-4"
              />
              <span>2. Há clareza visual e boas conexões entre os ramos principais e secundários.</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checklist.check3_cognitiveEffortCenter}
                onChange={(e) => onUpdateChecklist({ check3_cognitiveEffortCenter: e.target.checked })}
                className="rounded text-purple-600 w-4 h-4"
              />
              <span>3. O princípio de proteger o esforço cognitivo é o nó central.</span>
            </label>
          </div>
        </div>

        {/* PARTE 4: Divisão dos Ramos para Ensaio da Apresentação */}
        <div className="mt-8 border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Parte 4 — Divisão dos Ramos para Ensaio da Apresentação
              </h3>
              <p className="text-xs text-slate-600">
                Definam quem fala qual parte para garantir que todos participem no tempo certo.
              </p>
            </div>
            <button
              onClick={handleAddRehearsal}
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1.5 rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar fala
            </button>
          </div>

          <div className="space-y-2">
            {rehearsal.map((item, index) => (
              <div
                key={item.memberId || index}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <select
                  value={item.memberName}
                  onChange={(e) => handleUpdateRehearsalItem(index, { memberName: e.target.value })}
                  className="w-full sm:w-44 p-2 bg-white rounded border border-slate-300 focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name || 'Estudante'}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={item.branchAssigned}
                  onChange={(e) => handleUpdateRehearsalItem(index, { branchAssigned: e.target.value })}
                  placeholder="Ramo/Parte da política (ex.: Princípio e onde pode)"
                  className="flex-1 p-2 bg-white rounded border border-slate-300 focus:outline-none"
                />

                <input
                  type="text"
                  value={item.estimatedTime}
                  onChange={(e) => handleUpdateRehearsalItem(index, { estimatedTime: e.target.value })}
                  placeholder="Tempo (ex.: 45s)"
                  className="w-full sm:w-28 p-2 bg-white rounded border border-slate-300 focus:outline-none text-center"
                />

                <button
                  onClick={() => handleRemoveRehearsalItem(index)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                  title="Remover fala"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {rehearsal.length === 0 && (
              <p className="text-xs text-slate-500 py-3 text-center">
                Nenhuma atribuição de fala cadastrada. Clique em &quot;Adicionar fala&quot; para planejar o ensaio do grupo.
              </p>
            )}
          </div>
        </div>

        {/* Modal: Visualizar versão final da nossa política */}
        {showPolicyModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalPolicyTitle"
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Cabeçalho do Modal */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-purple-50 via-white to-sky-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 id="modalPolicyTitle" className="text-base sm:text-lg font-bold text-slate-900">
                      Versão Final da Nossa Política de IA na Escola
                    </h3>
                    <p className="text-xs text-slate-500">
                      Campos consolidados de uso ético da inteligência artificial
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPolicyModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conteúdo do Modal (somente os 7 campos da política final) */}
              <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-800 leading-relaxed">
                {/* Campo 1 */}
                <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-800 block mb-1">
                    1. Princípio Geral [Fixo]:
                  </span>
                  <p className="font-medium text-slate-900 text-xs sm:text-sm">
                    {finalPolicy.field1_principle}
                  </p>
                </div>

                {/* Campo 2 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    2. Para quem (Público-alvo):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-900 font-medium">
                    {finalPolicy.field2_target || <span className="text-slate-400 italic">Não preenchido</span>}
                  </p>
                </div>

                {/* Campo 3 */}
                <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block mb-1">
                    3. O que a IA NÃO pode substituir:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-900 whitespace-pre-line">
                    {finalPolicy.field3_cannotReplace || <span className="text-slate-400 italic">Não preenchido</span>}
                  </p>
                </div>

                {/* Campo 4 */}
                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                    4. Com o que a IA PODE ajudar:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-900 whitespace-pre-line">
                    {finalPolicy.field4_canHelp || <span className="text-slate-400 italic">Não preenchido</span>}
                  </p>
                </div>

                {/* Campo 5 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    5. Como será aplicada (Fiscalização e Transparência):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-900 whitespace-pre-line">
                    {finalPolicy.field5_howApplied || <span className="text-slate-400 italic">Não preenchido</span>}
                  </p>
                </div>

                {/* Campo 6 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    6. Onde será usada (Locais e momentos):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-900 whitespace-pre-line">
                    {finalPolicy.field6_whereUsed || <span className="text-slate-400 italic">Não preenchido</span>}
                  </p>
                </div>

                {/* Campo 7 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    7. Quando entra em vigor:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-900 whitespace-pre-line">
                    {finalPolicy.field7_whenActive || <span className="text-slate-400 italic">Não preenchido</span>}
                  </p>
                </div>
              </div>

              {/* Rodapé do Modal com Ações */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setShowPolicyModal(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Fechar
                </button>

                <button
                  onClick={handleCopyPolicyToDocs}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {modalCopiedToast ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado para o Docs!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar para colar no Docs
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
