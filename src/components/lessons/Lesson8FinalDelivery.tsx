import React from 'react';
import { GroupMember } from '../../types/caderno';
import {
  Check,
  Users,
  CheckSquare,
  Share2,
  Lock,
  Globe,
  Eye,
  Copy,
  ShieldCheck,
  CheckCircle2,
  Mic,
  Clock,
} from 'lucide-react';

interface Lesson8Props {
  profileId: string;
  groupName: string;
  members: GroupMember[];
  preChecklist: {
    timerReady: boolean;
    mapVisible: boolean;
    membersReady: boolean;
    postureAudience: boolean;
  };
  isCompleted: boolean;
  onUpdatePreChecklist: (checklist: Partial<Lesson8Props['preChecklist']>) => void;
  onToggleCompleted: () => void;
}

export const Lesson8FinalDelivery: React.FC<Lesson8Props> = ({
  groupName,
  members,
  preChecklist,
  isCompleted,
  onUpdatePreChecklist,
  onToggleCompleted,
}) => {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
              Aula 8
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-display">
              Apresentação da Política
            </h2>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Faixa de Informação do Grupo */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs sm:text-sm text-emerald-950">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>
              Grupo: <strong>{groupName || 'Sem nome definido'}</strong>{' '}
              {members && members.length > 0 && (
                <span>({members.map((m) => m.name).filter(Boolean).join(', ')})</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Etapa de entrega e culminância</span>
          </div>
        </div>

        {/* Orientações sobre a Apresentação */}
        <div className="mt-8 space-y-6">
          {/* Card de Abertura / Narrativa */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 rounded-2xl p-6 sm:p-7 border border-emerald-200/90 shadow-2xs space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              Chegou o dia de vocês
            </div>

            <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
              Chegou o dia de vocês. Lá na Aula 1, a direção anunciou: <em>&ldquo;IA proibida, trabalho com IA vale zero&rdquo;</em>. Desde então, vocês descobriram a diferença entre pensar e deixar a ferramenta pensar, viram como um chat é feito para parecer humano e escreveram o próprio compromisso. Depois, em grupo, escreveram, testaram e ajustaram uma política de uso de IA para a escola.
            </p>

            <p className="text-emerald-950 font-bold text-base sm:text-lg">
              Hoje não tem vídeo. Quem fala são vocês.
            </p>

            <div className="p-4 bg-white/90 rounded-xl border border-emerald-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
              <p className="font-semibold text-slate-900">
                Como convencer a escola de que a política de vocês é melhor do que simplesmente proibir a IA?
              </p>
              <p>
                E como mostrar que cada pessoa do grupo entende o que está defendendo, sem depender de ler o texto ou de uma ferramenta?
              </p>
            </div>
          </div>

          {/* Antes de começar (5 min) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Antes de começar (5 min)
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Abram no caderno a política final e o mapa mental do grupo.</strong> Eles são o material da apresentação.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Confirmem quem explica qual ramo</strong>, conforme o ensaio da Aula 7.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Façam o checklist do caderno:</strong> cada pessoa sabe explicar o seu ramo com as próprias palavras, e o material está pronto.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <span>
                  <strong>Sem IA durante a apresentação.</strong> A política e o mapa mental já estão prontos. Agora é a vez de vocês explicarem.
                </span>
              </li>
            </ul>
          </div>

          {/* Como cada grupo apresenta */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Como cada grupo apresenta
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sigam esta sequência. Não precisam usar todo o tempo.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              {/* Bloco Abertura */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    A
                  </span>
                  Abertura
                </h4>
                <p className="leading-relaxed">
                  Digam o nome do grupo e o Princípio: <em>&ldquo;A IA deve apoiar nossa aprendizagem, sem fazer o trabalho por nós.&rdquo;</em> Se o grupo mudou essa frase na Aula 7, leiam a versão final.
                </p>
              </div>

              {/* Bloco Mapa Mental ramo por ramo */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                    B
                  </span>
                  O mapa mental, ramo por ramo (todo o grupo)
                </h4>
                <p className="leading-relaxed">
                  Mostrem o mapa na tela. Cada integrante explica o seu ramo, com as próprias palavras, sem ler o texto. Sigam esta ordem:
                </p>

                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-medium text-slate-800">
                  <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span>Para quem é a política</span>
                  </li>
                  <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <span>O que a IA não pode substituir</span>
                  </li>
                  <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <span>O que a IA pode nos ajudar a fazer</span>
                  </li>
                  <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <span>Como a política poderá ser aplicada</span>
                  </li>
                  <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      5
                    </span>
                    <span>Onde no ambiente escolar</span>
                  </li>
                  <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      6
                    </span>
                    <span>Quando entrará em vigor</span>
                  </li>
                </ol>
              </div>

              {/* Mensagem de incentivo */}
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 font-bold text-center text-sm">
                Boa apresentação!
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Pré-Apresentação */}
        <div className="mt-8 border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Checklist Pré-Apresentação
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Antes de iniciar a fala para a turma, confirmem se todos os preparativos estão prontos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-800">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={preChecklist.timerReady}
                onChange={(e) => onUpdatePreChecklist({ timerReady: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="font-medium text-slate-800">Cronômetro pronto para travar em 3 minutos</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={preChecklist.mapVisible}
                onChange={(e) => onUpdatePreChecklist({ mapVisible: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="font-medium text-slate-800">Mapa mental aberto e visível para a turma</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={preChecklist.membersReady}
                onChange={(e) => onUpdatePreChecklist({ membersReady: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="font-medium text-slate-800">Todos os integrantes sabem sua ordem de fala</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={preChecklist.postureAudience}
                onChange={(e) => onUpdatePreChecklist({ postureAudience: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="font-medium text-slate-800">Postura firme e olhar voltado para os colegas</span>
            </label>
          </div>
        </div>

        {/* PASSO A PASSO VISUAL: Gerar link compartilhável do Google Docs como Leitor */}
        <div className="mt-8 border-2 border-sky-500/30 bg-gradient-to-br from-sky-50/60 via-white to-blue-50/30 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Share2 className="w-3.5 h-3.5" />
                Guia Visual de Entrega
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Como gerar o link compartilhável do Google Docs (Modo Leitor)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Siga os 5 passos ilustrados abaixo no seu arquivo do Google Docs para que o professor e os colegas possam ler sua política sem alterar o texto original.
              </p>
            </div>
          </div>

          {/* Cards dos 5 Passos Ilustrados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Passo 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Canto superior direito
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Clique no botão &quot;Compartilhar&quot;
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  No seu documento aberto no Google Docs, localize o botão azul <strong>Compartilhar</strong> no canto superior direito.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold shadow-2xs">
                  <Lock className="w-3.5 h-3.5" />
                  Compartilhar
                </div>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                    Acesso Geral
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Mude de &quot;Restrito&quot; para público
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Na janela que se abre, procure a seção <strong>Acesso geral</strong>. Clique onde diz <em>Restrito</em> e selecione <strong>&ldquo;Qualquer pessoa com o link&rdquo;</strong>.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 text-slate-800 rounded-md text-xs font-medium">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  Qualquer pessoa com o link
                </div>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Segurança de Leitura
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Mantenha a permissão como &quot;Leitor&quot;
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  No seletor ao lado, certifique-se de escolher <strong>Leitor</strong>. <em>Nunca</em> selecione Editor, assim ninguém poderá apagar suas respostas acidentalmente.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-md text-xs font-semibold">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  Papel: Leitor
                </div>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                    Copiar
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Clique em &quot;Copiar link&quot; e &quot;Concluído&quot;
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Clique no botão <strong>Copiar link</strong> no rodapé da janela e finalize clicando em <strong>Concluído</strong>. O link já está gravado no seu teclado!
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 text-slate-800 rounded-md text-xs font-semibold">
                  <Copy className="w-3.5 h-3.5 text-purple-600" />
                  Copiar link
                </div>
              </div>
            </div>

            {/* Passo 5 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    5
                  </span>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Plataforma Start by Alura
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Cole o link na atividade &quot;Compartilhe seu projeto&quot;
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Acesse a plataforma da <strong>Start by Alura</strong>, abra a atividade <strong>&quot;Compartilhe seu projeto&quot;</strong> e cole o link do seu Google Docs (<kbd className="px-1.5 py-0.5 bg-slate-100 border rounded text-[10px] font-mono">Ctrl + V</kbd>) para concluir a entrega da política do seu grupo.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-950 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pronto! O link em modo Leitor permite que professores e colegas da plataforma abram e avaliem a política do seu grupo com segurança.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
