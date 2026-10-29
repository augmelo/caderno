import React from 'react';
import { X, ExternalLink, FileText, Check, Copy } from 'lucide-react';

interface DocsInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonNum: number;
  htmlContent: string;
  textContent: string;
}

export const DocsInstructionModal: React.FC<DocsInstructionModalProps> = ({
  isOpen,
  onClose,
  lessonNum,
  htmlContent,
  textContent,
}) => {
  const [copiedAgain, setCopiedAgain] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyAgain = async () => {
    try {
      if (navigator.clipboard && typeof window.ClipboardItem !== 'undefined') {
        const item = new ClipboardItem({
          'text/plain': new Blob([textContent], { type: 'text/plain' }),
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
        });
        await navigator.clipboard.write([item]);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(textContent);
      }
      setCopiedAgain(true);
      setTimeout(() => setCopiedAgain(false), 2500);
    } catch (err) {
      console.warn('Erro ao copiar novamente:', err);
    }
  };

  const handleOpenDocsNew = () => {
    window.open('https://docs.new', '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="docs-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="docs-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                Documento da Aula {lessonNum}
              </h3>
              <p className="text-xs text-slate-500">
                Tudo o que você preencheu já está pronto e formatado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instrução Principal */}
        <div className="my-5 space-y-4 text-sm text-slate-700">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Check className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Conteúdo copiado com sucesso!</span>
            </div>
            <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
              O Google Docs foi aberto em uma nova aba. Por regras de segurança dos navegadores, sites externos não podem digitar diretamente dentro da página do Google Docs.
            </p>
            <div className="mt-2 p-2.5 bg-white/90 rounded-lg border border-blue-200 text-xs sm:text-sm text-slate-800 font-medium">
              👉 <strong>Como colar:</strong> Vá até a nova aba do Google Docs e pressione{' '}
              <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-900">
                Ctrl + V
              </kbd>{' '}
              (ou clique com botão direito e escolha <strong>Colar</strong>). Seu trabalho aparecerá completo com títulos e tabelas!
            </div>
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopyAgain}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copiedAgain ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copiado novamente!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar novamente
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenDocsNew}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Reabrir aba docs.new
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              OK, entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
