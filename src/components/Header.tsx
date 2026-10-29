import React from 'react';
import { User, LogOut, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { StartLogo } from './StartLogo';

interface HeaderProps {
  nickname: string;
  saveStatus: 'saving' | 'saved' | 'error';
  lastSavedAt: string | null;
  onOpenProfileManager: () => void;
  onExitProfile: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  nickname,
  saveStatus,
  lastSavedAt,
  onOpenProfileManager,
  onExitProfile,
  onNavigateHome,
}) => {

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Marca e Identidade Start / Alura */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1 transition-transform active:scale-98"
            title="Ir para o início do Caderno"
          >
            <StartLogo className="h-8 w-auto max-w-[140px] object-contain shrink-0" />

            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors whitespace-nowrap">
                Caderno de Metacognição
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <span className="text-orange-600 font-semibold">Start</span>
                <span aria-hidden="true">·</span>
                <span>IA na Escola</span>
                <span aria-hidden="true">·</span>
                <span>2ª Série EM</span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Indicador Confiável de Gravação no LocalStorage */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          {saveStatus === 'saving' && (
            <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-medium animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Salvando no navegador...</span>
            </div>
          )}
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Salvo neste navegador</span>
              {lastSavedAt && (
                <span className="text-emerald-600/80 font-normal">
                  ({new Date(lastSavedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})
                </span>
              )}
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Erro ao gravar dados</span>
            </div>
          )}
        </div>

        {/* Zone 3: Perfil do Estudante & Ações */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenProfileManager}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            title="Gerenciar perfis locais, backup e importação"
          >
            <User className="w-3.5 h-3.5 text-sky-600" />
            <span className="max-w-[100px] sm:max-w-[140px] truncate">{nickname || 'Estudante'}</span>
            <span className="hidden sm:inline text-slate-400 font-normal">| Backup</span>
          </button>

          <button
            onClick={onExitProfile}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            title="Sair do perfil sem apagar dados"
            aria-label="Sair do perfil"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
