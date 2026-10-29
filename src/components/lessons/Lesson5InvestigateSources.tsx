import React, { useState, useEffect, useRef } from 'react';
import { GroupMember, GroupRole } from '../../types/caderno';
import {
  Users,
  Copy,
  Check,
  Plus,
  Trash2,
  Clock,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

interface ListItem {
  id: string;
  text: string;
}

interface Lesson5Props {
  groupName: string;
  members: GroupMember[];
  lastEditedBy: string;
  lastEditedAt: string;
  canHelpLearn: string;
  cannotReplaceLearn: string;
  isCompleted: boolean;
  onUpdateGroupName: (name: string) => void;
  onUpdateMembers: (members: GroupMember[]) => void;
  onUpdateLastEditor: (name: string) => void;
  onUpdateCanHelpLearn: (val: string) => void;
  onUpdateCannotReplaceLearn: (val: string) => void;
  onToggleCompleted: () => void;
  onCopyToDocs: () => void;
}

const AVAILABLE_ROLES: { role: GroupRole; label: string; desc: string }[] = [
  { role: '', label: 'Sem papel definido', desc: 'Contribui no debate geral' },
  { role: 'Relator(a)', label: 'Relator(a)', desc: 'Registra as ideias e cuida da redação final' },
  { role: 'Guardião/ã das evidências', label: 'Guardião/ã das evidências', desc: 'Verifica fontes, dados e exemplos reais' },
  { role: 'Questionador(a)', label: 'Questionador(a)', desc: 'Faz perguntas difíceis e aponta brechas' },
  { role: 'Gestor(a) do tempo', label: 'Gestor(a) do tempo', desc: 'Organiza o relógio e os prazos das tarefas' },
];

function stringToItems(text: string, prefix: string): ListItem[] {
  if (!text || !text.trim()) {
    return [];
  }
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  return lines.map((line, idx) => ({
    id: `${prefix}_${idx}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    text: line,
  }));
}

export const Lesson5InvestigateSources: React.FC<Lesson5Props> = ({
  groupName,
  members,
  lastEditedBy,
  lastEditedAt,
  canHelpLearn,
  cannotReplaceLearn,
  isCompleted,
  onUpdateGroupName,
  onUpdateMembers,
  onUpdateLastEditor,
  onUpdateCanHelpLearn,
  onUpdateCannotReplaceLearn,
  onToggleCompleted,
  onCopyToDocs,
}) => {
  // Itens em listas dinâmicas com IDs estáveis
  const [helpItems, setHelpItems] = useState<ListItem[]>(() =>
    stringToItems(canHelpLearn, 'help')
  );
  const [replaceItems, setReplaceItems] = useState<ListItem[]>(() =>
    stringToItems(cannotReplaceLearn, 'replace')
  );

  const isInternalUpdate = useRef(false);

  // Sincronizar quando upstream mudar externamente (ex.: troca de perfil ou import)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    setHelpItems(stringToItems(canHelpLearn, 'help'));
  }, [canHelpLearn]);

  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    setReplaceItems(stringToItems(cannotReplaceLearn, 'replace'));
  }, [cannotReplaceLearn]);

  // Manipulação dos itens de "Com o que a IA PODE ajudar"
  const handleUpdateHelpItem = (id: string, text: string) => {
    const updated = helpItems.map((item) => (item.id === id ? { ...item, text } : item));
    setHelpItems(updated);
    isInternalUpdate.current = true;
    onUpdateCanHelpLearn(updated.map((i) => i.text).join('\n'));
  };

  const handleAddHelpItem = () => {
    const newItem: ListItem = {
      id: 'help_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      text: '',
    };
    const updated = [...helpItems, newItem];
    setHelpItems(updated);
    isInternalUpdate.current = true;
    onUpdateCanHelpLearn(updated.map((i) => i.text).join('\n'));
  };

  const handleRemoveHelpItem = (id: string) => {
    const updated = helpItems.filter((item) => item.id !== id);
    setHelpItems(updated);
    isInternalUpdate.current = true;
    onUpdateCanHelpLearn(updated.map((i) => i.text).join('\n'));
  };

  // Manipulação dos itens de "O que a IA NÃO PODE substituir"
  const handleUpdateReplaceItem = (id: string, text: string) => {
    const updated = replaceItems.map((item) => (item.id === id ? { ...item, text } : item));
    setReplaceItems(updated);
    isInternalUpdate.current = true;
    onUpdateCannotReplaceLearn(updated.map((i) => i.text).join('\n'));
  };

  const handleAddReplaceItem = () => {
    const newItem: ListItem = {
      id: 'replace_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      text: '',
    };
    const updated = [...replaceItems, newItem];
    setReplaceItems(updated);
    isInternalUpdate.current = true;
    onUpdateCannotReplaceLearn(updated.map((i) => i.text).join('\n'));
  };

  const handleRemoveReplaceItem = (id: string) => {
    const updated = replaceItems.filter((item) => item.id !== id);
    setReplaceItems(updated);
    isInternalUpdate.current = true;
    onUpdateCannotReplaceLearn(updated.map((i) => i.text).join('\n'));
  };

  // Membros do grupo
  const handleAddMember = () => {
    if (members.length >= 5) return;
    const newId = 'mem_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5);
    const newMembers: GroupMember[] = [
      ...members,
      { id: newId, name: `Estudante ${members.length + 1}`, role: '' },
    ];
    onUpdateMembers(newMembers);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1) return;
    const filtered = members.filter((m) => m.id !== id);
    onUpdateMembers(filtered);
  };

  const handleUpdateMember = (id: string, updates: Partial<GroupMember>) => {
    const updated = members.map((m) => (m.id === id ? { ...m, ...updates } : m));
    onUpdateMembers(updated);
  };

  const formattedLastEdit = lastEditedAt
    ? new Date(lastEditedAt).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Agora';

  const validHelpPhrases = helpItems.map((i) => i.text.trim()).filter(Boolean);
  const validReplacePhrases = replaceItems.map((i) => i.text.trim()).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-purple-100 text-purple-800">
              Aula 5
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-display">
              Argumentando em grupo
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopyToDocs}
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

        {/* Faixa de Informação do Grupo e Última Edição */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-purple-50/70 border border-purple-100 rounded-lg text-xs sm:text-sm text-purple-900">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>
              Última edição registrada por <strong>{lastEditedBy || 'Estudante'}</strong> em {formattedLastEdit}.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium text-xs">Quem está editando agora:</span>
            <select
              value={lastEditedBy}
              onChange={(e) => onUpdateLastEditor(e.target.value)}
              className="text-xs bg-white border border-purple-200 rounded-md px-2 py-1 font-semibold text-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-400"
            >
              {members.map((m) => (
                <option key={m.id} value={m.name || 'Estudante'}>
                  {m.name || 'Estudante'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Aviso de Privacidade */}
        <div className="mt-4 flex items-center gap-2 px-3.5 py-2.5 bg-amber-50 rounded-lg border border-amber-200/80 text-amber-900 text-xs sm:text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Aviso de privacidade:</strong> Não coloque nomes, contatos ou dados pessoais de ninguém.
          </span>
        </div>

        {/* Identificação do Grupo */}
        <div className="mt-8 border border-slate-200 rounded-xl p-5 bg-white shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Identificação do Grupo (até 5 integrantes)
            </h3>
          </div>

          <div className="mb-5">
            <label htmlFor="groupName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nome do Grupo:
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => onUpdateGroupName(e.target.value)}
              placeholder="Ex.: Guardiões do Pensamento, Equipe Futuro Ético..."
              className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Integrantes e Papéis Opcionais:
              </span>
              <span className="text-xs text-slate-500">
                {members.length} de 5 integrantes
              </span>
            </div>

            {members.map((member, index) => (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => handleUpdateMember(member.id, { name: e.target.value })}
                  placeholder="Nome do integrante"
                  className="flex-1 p-2 text-sm bg-white rounded-md border border-slate-300 focus:border-purple-500 focus:outline-none"
                />

                <select
                  value={member.role}
                  onChange={(e) => handleUpdateMember(member.id, { role: e.target.value as GroupRole })}
                  className="w-full sm:w-56 p-2 text-xs bg-white rounded-md border border-slate-300 focus:border-purple-500 focus:outline-none"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.label}
                    </option>
                  ))}
                </select>

                {members.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer transition-colors"
                    title="Remover integrante"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {members.length < 5 ? (
              <button
                onClick={handleAddMember}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-2 rounded-lg cursor-pointer transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar integrante
              </button>
            ) : (
              <p className="text-xs text-slate-500 mt-2">
                Limite máximo de 5 integrantes atingido.
              </p>
            )}
          </div>
        </div>

        {/* Etapa 2: Cartões das 2 Perguntas e Prévia em Tempo Real (layout exato aula 5.png) */}
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cartão 1: Com o que a IA pode me ajudar a aprender? */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    Com o que a IA pode me ajudar a aprender?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Escreva frases curtas sobre tarefas, explicações ou revisões em que a IA agrega valor. Pressione{' '}
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-white border border-slate-300 rounded text-slate-700 shadow-2xs">
                    Enter
                  </kbd>{' '}
                  para adicionar a próxima frase.
                </p>

                {helpItems.length === 0 ? (
                  <p className="text-sm text-slate-400 italic py-6">
                    Nenhum item adicionado ainda.
                  </p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {helpItems.map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => handleUpdateHelpItem(item.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                              e.preventDefault();
                              handleAddHelpItem();
                            }
                          }}
                          placeholder="Escreva uma frase e pressione Enter..."
                          className="flex-1 p-2 text-sm bg-white rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                          autoFocus={idx === helpItems.length - 1 && item.text === ''}
                        />
                        <button
                          onClick={() => handleRemoveHelpItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Remover frase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAddHelpItem}
                className="w-full mt-2 py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-700 font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Adicionar item
              </button>
            </div>

            {/* Cartão 2: O que a IA não pode substituir no meu processo de aprendizagem? */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-bold text-xs">
                    ✕
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    O que a IA não pode substituir no meu processo de aprendizagem?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Escreva frases sobre pensamento crítico, autoria, esforço mental e conexões humanas que só você pode fazer. Pressione{' '}
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-white border border-slate-300 rounded text-slate-700 shadow-2xs">
                    Enter
                  </kbd>{' '}
                  para adicionar.
                </p>

                {replaceItems.length === 0 ? (
                  <p className="text-sm text-slate-400 italic py-6">
                    Nenhum item adicionado ainda.
                  </p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {replaceItems.map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => handleUpdateReplaceItem(item.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                              e.preventDefault();
                              handleAddReplaceItem();
                            }
                          }}
                          placeholder="Escreva uma frase e pressione Enter..."
                          className="flex-1 p-2 text-sm bg-white rounded-lg border border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-400 focus:outline-none"
                          autoFocus={idx === replaceItems.length - 1 && item.text === ''}
                        />
                        <button
                          onClick={() => handleRemoveReplaceItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Remover frase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAddReplaceItem}
                className="w-full mt-2 py-2.5 px-4 rounded-xl border border-rose-300 bg-rose-50/50 hover:bg-rose-100/70 text-rose-700 font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Adicionar item
              </button>
            </div>
          </div>

          {/* Prévia em tempo real (painel escuro inferior conforme aula 5.png) */}
          <div className="bg-[#0f172a] rounded-2xl p-6 text-white border border-slate-800 shadow-md">
            <div className="mb-4">
              <span className="text-sm font-bold text-white">Prévia em tempo real</span>{' '}
              <span className="text-xs text-slate-400 font-normal">
                (Reflete suas frases instantaneamente para visualização)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#162033] rounded-xl p-4 border border-slate-800 min-h-[90px]">
                <h5 className="text-xs font-bold text-emerald-400 tracking-wider mb-2 flex items-center gap-1.5 uppercase">
                  ✓ COM O QUE A IA PODE AJUDAR:
                </h5>
                {validHelpPhrases.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {validHelpPhrases.map((phrase, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span className="leading-relaxed">{phrase}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Seus itens aparecerão aqui
                  </p>
                )}
              </div>

              <div className="bg-[#162033] rounded-xl p-4 border border-slate-800 min-h-[90px]">
                <h5 className="text-xs font-bold text-rose-400 tracking-wider mb-2 flex items-center gap-1.5 uppercase">
                  ✗ O QUE A IA NÃO PODE SUBSTITUIR:
                </h5>
                {validReplacePhrases.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {validReplacePhrases.map((phrase, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold shrink-0">✗</span>
                        <span className="leading-relaxed">{phrase}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Seus itens aparecerão aqui
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sinais de Alerta de Dependência Cognitiva */}
        <div className="mt-8 border border-amber-200 bg-amber-50/60 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-amber-950 uppercase tracking-wide">
              Sinais de Alerta de Dependência Cognitiva
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mb-4">
            A dependência cognitiva acontece quando o estudante delega para a máquina o esforço de pensar. Durante a formulação da política do grupo, fiquem atentos a estes 4 sinais:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 shadow-2xs">
              <span className="font-bold text-slate-900 block mb-1">
                1. Bloqueio da página em branco
              </span>
              <span className="text-slate-600 leading-relaxed">
                Incapacidade de escrever a primeira linha de um texto sem pedir um modelo ou prompt antes.
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 shadow-2xs">
              <span className="font-bold text-slate-900 block mb-1">
                2. Delegação de conclusões
              </span>
              <span className="text-slate-600 leading-relaxed">
                Pedir para a IA escolher qual lado do debate está certo, em vez de formar sua própria opinião com base em evidências.
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 shadow-2xs">
              <span className="font-bold text-slate-900 block mb-1">
                3. Aceitação passiva de alucinações
              </span>
              <span className="text-slate-600 leading-relaxed">
                Copiar dados, datas ou conceitos gerados pela IA sem checar se existem fora do chat.
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 shadow-2xs">
              <span className="font-bold text-slate-900 block mb-1">
                4. Perda de autoria e defesa
              </span>
              <span className="text-slate-600 leading-relaxed">
                Entregar um trabalho que o estudante não sabe explicar com suas próprias palavras se o professor perguntar.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
