import React, { useRef, useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';

interface CopyModalFallbackProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  textToCopy: string;
}

export const CopyModalFallback: React.FC<CopyModalFallbackProps> = ({
  isOpen,
  onClose,
  title,
  textToCopy,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSelectAndCopy = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      textareaRef.current.setSelectionRange(0, 99999);
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Falha ao copiar com execCommand:', err);
      }
    }
  };

  const handleOpenDocsNew = () => {
    try {
      window.open('https://docs.new', '_blank');
    } catch (err) {
      console.warn('Erro ao abrir docs.new:', err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="copy-fallback-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 id="copy-fallback-title" className="text-lg font-bold text-slate-900">
              Copiar para o Google Docs: {title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              O navegador bloqueou a gravação direta. Selecione o texto abaixo e copie manualmente (Ctrl+C).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 flex-1 flex flex-col min-h-0">
          <label htmlFor="copy-fallback-area" className="text-xs font-semibold text-slate-700 mb-1">
            Conteúdo formatado para cópia:
          </label>
          <textarea
            id="copy-fallback-area"
            ref={textareaRef}
            readOnly
            value={textToCopy}
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            className="w-full flex-1 p-3.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden resize-none overflow-y-auto leading-relaxed"
            rows={12}
          />
        </div>

        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Dica: No Google Docs, utilize <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded text-[11px] font-mono">Ctrl+V</kbd> para colar.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenDocsNew}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
              title="Abrir novo documento em branco no Google Docs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir docs.new
            </button>
            <button
              onClick={handleSelectAndCopy}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Selecionar e Copiar Tudo
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
