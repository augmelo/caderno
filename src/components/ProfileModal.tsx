import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Plus,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ProfileSummary, CadernoState } from '../types/caderno';
import {
  exportProfileBackupJson,
  validateBackupJson,
  importBackupToProfile,
  deleteProfile,
  createProfile,
} from '../utils/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfileId: string;
  cadernoState: CadernoState;
  profiles: ProfileSummary[];
  onSelectProfile: (id: string) => void;
  onProfileCreatedOrUpdated: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  activeProfileId,
  cadernoState,
  profiles,
  onSelectProfile,
  onProfileCreatedOrUpdated,
  onShowToast,
}) => {
  const [newNickname, setNewNickname] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<{
    targetProfileId: string;
    data: CadernoState;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNickname.trim()) return;
    const newCaderno = createProfile(newNickname.trim());
    setNewNickname('');
    setIsCreating(false);
    onProfileCreatedOrUpdated();
    onSelectProfile(newCaderno.id);
    onShowToast('success', 'Perfil criado com sucesso!', `Apelido: ${newCaderno.nickname}`);
  };

  const handleExportBackup = async () => {
    try {
      const jsonStr = await exportProfileBackupJson(cadernoState);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `backup_caderno_ia_${cadernoState.nickname.replace(/\s+/g, '_')}_${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast(
        'success',
        'Backup JSON exportado!',
        'Guarde este arquivo em seu pendrive ou pasta pessoal.'
      );
    } catch (err) {
      onShowToast('error', 'Falha ao exportar backup', String(err));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const validation = validateBackupJson(content);
      if (!validation.valid || !validation.data) {
        onShowToast('error', 'Backup inválido', validation.error || 'Estrutura JSON não reconhecida.');
        return;
      }

      setPendingImport({
        targetProfileId: activeProfileId,
        data: validation.data,
      });
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmImport = async () => {
    if (!pendingImport) return;
    const res = await importBackupToProfile(pendingImport.targetProfileId, pendingImport.data);
    if (res.success) {
      setPendingImport(null);
      onProfileCreatedOrUpdated();
      onShowToast('success', 'Backup restaurado com sucesso!', 'Os registros foram atualizados.');
      onClose();
    } else {
      onShowToast('error', 'Falha na restauração', res.error);
    }
  };

  const handleDeleteProfile = (id: string) => {
    deleteProfile(id);
    setConfirmDeleteId(null);
    onProfileCreatedOrUpdated();
    onShowToast('info', 'Perfil excluído', 'Os dados deste perfil foram removidos do navegador.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 id="profile-modal-title" className="text-lg font-bold text-slate-900">
                Perfis Locais e Segurança dos Dados
              </h2>
              <p className="text-xs text-slate-500">
                Caderno para computadores escolares e dispositivos compartilhados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Fechar modal de perfis"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & Privacy Notices */}
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-950">Aviso importante de privacidade na escola:</p>
            <p className="mt-1">
              <strong>Este caderno não tem login.</strong> Em computador compartilhado, qualquer pessoa que abrir este
              navegador poderá ver os registros salvos. Nunca insira senhas, dados bancários ou informações pessoais de
              colegas.
            </p>
            <p className="mt-1 text-amber-800">
              Limpar dados de navegação, usar guia anônima ou mudar de máquina fará com que o navegador não localize seus
              dados. <strong>Exporte sempre o backup JSON ao terminar a aula!</strong>
            </p>
          </div>
        </div>

        {/* Active Profile Info & Backup Buttons */}
        <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 font-medium">Perfil ativo agora:</span>
              <p className="text-base font-bold text-slate-900">{cadernoState.nickname}</p>
              <span className="text-[11px] text-slate-500">
                Última edição: {new Date(cadernoState.lastModified).toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
                title="Baixar arquivo JSON com todas as respostas deste perfil"
              >
                <Download className="w-4 h-4 text-sky-600" />
                Exportar Backup JSON
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
                title="Carregar arquivo JSON previamente exportado"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                Importar Backup
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Profile Switcher & List */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Perfis neste navegador ({profiles.length})
            </h3>
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800"
              >
                <Plus className="w-3.5 h-3.5" />
                Criar novo perfil
              </button>
            )}
          </div>

          {isCreating && (
            <form onSubmit={handleCreateProfile} className="mb-3 p-3 bg-sky-50 border border-sky-200 rounded-xl">
              <label htmlFor="new-nick" className="block text-xs font-semibold text-sky-900 mb-1">
                Apelido ou código do novo perfil (ex: Grupo Alpha, Beatriz 2B, Estudante 42):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="new-nick"
                  type="text"
                  maxLength={40}
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="Apelido ou código..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg"
                >
                  Criar
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:bg-sky-100 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {profiles.map((p) => {
              const isActive = p.id === activeProfileId;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                    isActive
                      ? 'bg-sky-50 border-sky-300 text-sky-950 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{p.nickname}</span>
                    {isActive && (
                      <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded-md font-semibold">
                        Ativo
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <button
                        onClick={() => {
                          onSelectProfile(p.id);
                          onShowToast('info', 'Perfil alterado', `Alternado para: ${p.nickname}`);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-slate-600 hover:text-sky-700 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1 font-medium"
                      >
                        Selecionar
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      onClick={() => setConfirmDeleteId(p.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Excluir este perfil"
                      aria-label={`Excluir perfil ${p.nickname}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Confirmation for Overwriting on Import */}
        {pendingImport && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-300 rounded-xl">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Substituir dados pelo backup?
            </div>
            <p className="mt-1 text-xs text-rose-800 leading-relaxed">
              Você está prestes a substituir as anotações do perfil ativo por este backup JSON (
              <strong>{pendingImport.data.nickname}</strong>, versão {pendingImport.data.schemaVersion}). Essa ação não
              pode ser desfeita.
            </p>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setPendingImport(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-rose-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={confirmImport}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Confirmar e Restaurar
              </button>
            </div>
          </div>
        )}

        {/* Modal Confirmation for Delete */}
        {confirmDeleteId && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-300 rounded-xl">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Excluir este perfil permanentemente?
            </div>
            <p className="mt-1 text-xs text-rose-800 leading-relaxed">
              Tem certeza que deseja apagar os registros deste perfil deste navegador? Se você não tiver um backup JSON,
              todas as respostas serão perdidas.
            </p>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-rose-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProfile(confirmDeleteId)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Sim, Excluir Perfil
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
