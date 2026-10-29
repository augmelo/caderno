import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CadernoState,
  ProfileSummary,
  createEmptyCaderno,
  DEFAULT_RADAR_COGNITVO_URL,
} from './types/caderno';
import {
  getProfiles,
  getActiveProfileId,
  setActiveProfileId,
  loadProfileData,
  saveProfileData,
  createProfile,
  setAdminGameUrl,
  getAdminGameUrl,
} from './utils/storage';
import {
  copyExportToClipboard,
  generateSingleLessonExport,
  generatePartialDeliveryExport,
  generateCompleteNotebookExport,
} from './utils/clipboardExport';

import { Header } from './components/Header';
import { LessonNav } from './components/LessonNav';
import { HomeOverview } from './components/HomeOverview';
import { ProfileModal } from './components/ProfileModal';
import { CopyModalFallback } from './components/CopyModalFallback';
import { DocsInstructionModal } from './components/DocsInstructionModal';
import { ToastContainer, ToastMessage } from './components/Toast';

import { Lesson1BrainVsAi } from './components/lessons/Lesson1BrainVsAi';
import { Lesson2HumanDesign } from './components/lessons/Lesson2HumanDesign';
import { Lesson3Commitment } from './components/lessons/Lesson3Commitment';
import { Lesson4InitialArgument } from './components/lessons/Lesson4InitialArgument';
import { Lesson5InvestigateSources } from './components/lessons/Lesson5InvestigateSources';
import { Lesson6DecideYourselves } from './components/lessons/Lesson6DecideYourselves';
import { Lesson7PitchMentalMap } from './components/lessons/Lesson7PitchMentalMap';
import { Lesson8FinalDelivery } from './components/lessons/Lesson8FinalDelivery';

export default function App() {
  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [activeProfileId, setActiveId] = useState<string | null>(null);
  const [caderno, setCaderno] = useState<CadernoState | null>(null);
  const [currentTab, setCurrentTab] = useState<number>(0); // 0 = Home, 1..8 = Lessons
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fallback modal para cópia em navegadores restritos
  const [fallbackModal, setFallbackModal] = useState<{
    isOpen: boolean;
    title: string;
    text: string;
  }>({
    isOpen: false,
    title: '',
    text: '',
  });

  const [docsInstructionModal, setDocsInstructionModal] = useState<{
    isOpen: boolean;
    lessonNum: number;
    html: string;
    text: string;
  }>({
    isOpen: false,
    lessonNum: 2,
    html: '',
    text: '',
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Exibir toasts
  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: 'toast_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1. Inicializar perfis no carregamento inicial
  useEffect(() => {
    const existingProfiles = getProfiles();
    setProfiles(existingProfiles);

    let activeId = getActiveProfileId();
    if (!activeId || !existingProfiles.some((p) => p.id === activeId)) {
      if (existingProfiles.length > 0) {
        activeId = existingProfiles[0].id;
      } else {
        const defaultProfile = createProfile('Meu Perfil');
        activeId = defaultProfile.id;
        setProfiles(getProfiles());
      }
      setActiveProfileId(activeId);
    }

    setActiveId(activeId);
    const loaded = loadProfileData(activeId);
    if (loaded.state) {
      setCaderno(loaded.state);
      setLastSavedAt(loaded.state.lastModified);
    } else {
      const fallback = createEmptyCaderno(activeId, 'Estudante');
      setCaderno(fallback);
      saveProfileData(activeId, fallback);
    }
  }, []);

  // 2. Autosave debounced com indicador confiável
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!caderno || !activeProfileId) return;

    setSaveStatus('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const result = saveProfileData(activeProfileId, caderno);
      if (result.success) {
        setSaveStatus('saved');
        setLastSavedAt(new Date().toISOString());
      } else {
        setSaveStatus('error');
        addToast('error', 'Falha ao salvar alterações', result.error);
      }
    }, 600);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [caderno, activeProfileId, addToast]);

  // Recarregar dados após troca de perfil ou importação
  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    setActiveId(id);
    const loaded = loadProfileData(id);
    if (loaded.state) {
      setCaderno(loaded.state);
      setLastSavedAt(loaded.state.lastModified);
    }
    setProfiles(getProfiles());
  };

  const handleRefreshProfiles = () => {
    setProfiles(getProfiles());
    if (activeProfileId) {
      const loaded = loadProfileData(activeProfileId);
      if (loaded.state) {
        setCaderno(loaded.state);
        setLastSavedAt(loaded.state.lastModified);
      }
    }
  };

  const handleExitProfile = () => {
    setIsProfileModalOpen(true);
  };

  // Alternar conclusão manual da aula
  const handleToggleLessonCompleted = (lessonNum: number) => {
    if (!caderno) return;
    const isCompleted = caderno.completedLessons.includes(lessonNum);
    const updated = isCompleted
      ? caderno.completedLessons.filter((num) => num !== lessonNum)
      : [...caderno.completedLessons, lessonNum];

    setCaderno({
      ...caderno,
      completedLessons: updated,
    });
  };

  // Identificar aulas já iniciadas
  const getStartedLessons = (): number[] => {
    if (!caderno) return [];
    const started: number[] = [];

    // Aula 1
    if (caderno.lesson1.visited) started.push(1);

    // Aula 2
    if (
      caderno.lesson2.curiosity.notObserved ||
      caderno.lesson2.curiosity.excerpt.trim() ||
      caderno.lesson2.flattery.notObserved ||
      caderno.lesson2.flattery.excerpt.trim() ||
      caderno.lesson2.socialPresence.notObserved ||
      caderno.lesson2.socialPresence.excerpt.trim() ||
      caderno.lesson2.authority.notObserved ||
      caderno.lesson2.authority.excerpt.trim()
    ) {
      started.push(2);
    }

    // Aula 3
    if (
      caderno.lesson3.q1_who.trim() ||
      caderno.lesson3.q2_what.trim() ||
      caderno.lesson3.q3_when.trim() ||
      caderno.lesson3.q4_where.trim() ||
      caderno.lesson3.q5_how.trim()
    ) {
      started.push(3);
    }

    // Aula 4
    if (
      caderno.lesson4.thinkBeforeAi.trim() ||
      caderno.lesson4.verifyQuestionAi.trim() ||
      caderno.lesson4.honestyResponsibility.trim() ||
      caderno.lesson4.signature.trim()
    ) {
      started.push(4);
    }

    // Aula 5
    if (
      caderno.lesson5.groupName.trim() ||
      caderno.lesson5.canHelpLearn.trim() ||
      caderno.lesson5.cannotReplaceLearn.trim()
    ) {
      started.push(5);
    }

    // Aula 6
    if (
      caderno.lesson6.field2_schoolName.trim() ||
      caderno.lesson6.v1Frozen ||
      caderno.lesson6.scenarios.scenario1.action ||
      caderno.lesson6.scenarios.scenario2.action ||
      caderno.lesson6.scenarios.scenario3.action ||
      caderno.lesson6.loopholeAgreement.trim()
    ) {
      started.push(6);
    }

    // Aula 7
    if (
      caderno.lesson7.finalPolicy.finalFrozen ||
      caderno.lesson7.imageMeta !== null ||
      caderno.lesson7.topicsText.trim() ||
      caderno.lesson7.mapReflection.trim() ||
      caderno.lesson7.rehearsal.length > 0
    ) {
      started.push(7);
    }

    // Aula 8
    if (
      caderno.lesson8.peerReview.otherGroupName.trim() ||
      caderno.lesson8.closingReflection.relationshipWithAi.trim() ||
      caderno.lesson8.closingReflection.ownThinkingLearning.trim() ||
      caderno.lesson8.closingReflection.mostImportantRule.trim()
    ) {
      started.push(8);
    }

    return started;
  };

  // Helper para carregar a imagem do mapa (não utilizada nesta versão)
  const getMapImageDataUrl = async (): Promise<string | null> => null;

  // Abrir aula diretamente no Google Docs (Aula 2, Aula 4, Aula 8)
  const handleOpenInDocs = async (lessonNum: number, preloadedImgUrl?: string | null) => {
    if (!caderno) return;
    const imgDataUrl = preloadedImgUrl !== undefined ? preloadedImgUrl : await getMapImageDataUrl();
    const exportData = generateSingleLessonExport(lessonNum, caderno, imgDataUrl);
    const success = await copyExportToClipboard(exportData);

    try {
      window.open('https://docs.new', '_blank');
    } catch (err) {
      console.warn('Pop-up bloqueado ao abrir docs.new:', err);
    }

    if (success) {
      setDocsInstructionModal({
        isOpen: true,
        lessonNum,
        html: exportData.html,
        text: exportData.text,
      });
      addToast(
        'success',
        'Documento aberto no Google Docs!',
        `O conteúdo formatado da Aula ${lessonNum} foi copiado. Pressione Ctrl+V na nova aba para colar.`
      );
    } else {
      setFallbackModal({
        isOpen: true,
        title: `Conteúdo da Aula ${lessonNum} (Docs)`,
        text: exportData.text,
      });
    }
  };

  // Copiar aula individual para colar no Docs (Aulas 1, 3, 5, 6, 7)
  const handleCopySingleLesson = async (lessonNum: number, preloadedImgUrl?: string | null) => {
    if (!caderno) return;
    const imgDataUrl = preloadedImgUrl !== undefined ? preloadedImgUrl : await getMapImageDataUrl();
    const exportData = generateSingleLessonExport(lessonNum, caderno, imgDataUrl);
    const success = await copyExportToClipboard(exportData);

    if (success) {
      addToast(
        'success',
        `Aula ${lessonNum} copiada!`,
        'Abra seu documento no Google Docs e pressione Ctrl+V para colar com formatação.'
      );
    } else {
      setFallbackModal({
        isOpen: true,
        title: `Copiar Conteúdo da Aula ${lessonNum}`,
        text: exportData.text,
      });
    }
  };

  // Abrir ou Copiar Entrega Parcial (Aula 4) no Docs
  const handleCopyPartialDelivery = async () => {
    if (!caderno) return;
    const exportData = generatePartialDeliveryExport(caderno);
    const success = await copyExportToClipboard(exportData);

    try {
      window.open('https://docs.new', '_blank');
    } catch (err) {
      console.warn('Pop-up bloqueado ao abrir docs.new:', err);
    }

    if (success) {
      addToast(
        'success',
        'Documento aberto no Google Docs!',
        'A Ficha de Compromisso (Entrega Parcial) foi copiada. Pressione Ctrl+V na nova aba para colar.'
      );
    } else {
      setFallbackModal({
        isOpen: true,
        title: 'Copiar Ficha de Compromisso (Entrega Parcial)',
        text: exportData.text,
      });
    }
  };

  // Copiar Caderno Completo para Docs
  const handleCopyCompleteNotebook = async () => {
    if (!caderno) return;
    const imgDataUrl = await getMapImageDataUrl();
    const exportData = generateCompleteNotebookExport(caderno, imgDataUrl);
    const success = await copyExportToClipboard(exportData);

    if (success) {
      addToast(
        'success',
        'Caderno completo copiado!',
        'Abra seu documento no Google Docs e pressione Ctrl+V para colar todas as 8 aulas formatadas.'
      );
    } else {
      setFallbackModal({
        isOpen: true,
        title: 'Copiar Caderno Completo (8 Aulas)',
        text: exportData.text,
      });
    }
  };

  // Sincronização automática de campos pré-preenchidos na Aula 6
  const getPreFilledLesson6 = useCallback(() => {
    if (!caderno) return null;
    const l6 = caderno.lesson6;
    const l5 = caderno.lesson5;
    const l3 = caderno.lesson3;

    // Se ainda não foram customizados ou estão vazios, herdam as respostas upstream
    return {
      field3_cannotReplace: l6.field3_cannotReplace || l5.cannotReplaceLearn,
      field4_canHelp: l6.field4_canHelp || l5.canHelpLearn,
      field5_howApplied: l6.field5_howApplied || l3.q5_how,
      field6_whereUsed: l6.field6_whereUsed || l3.q4_where,
      field7_whenActive: l6.field7_whenActive || l3.q3_when,
    };
  }, [caderno]);

  if (!caderno) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Carregando caderno de metacognição...</p>
        </div>
      </div>
    );
  }

  const completedList = caderno.completedLessons || [];
  const startedList = getStartedLessons();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-200 selection:text-sky-900">
      {/* Header Fixo */}
      <Header
        nickname={caderno.nickname}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        onOpenProfileManager={() => setIsProfileModalOpen(true)}
        onExitProfile={handleExitProfile}
        onNavigateHome={() => setCurrentTab(0)}
      />

      {/* Navegação entre as 8 Aulas */}
      <LessonNav
        currentTab={currentTab}
        completedLessons={completedList}
        startedLessons={startedList}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* TAB 0: Visão Geral */}
        {currentTab === 0 && (
          <HomeOverview
            state={caderno}
            completedLessons={completedList}
            startedLessons={startedList}
            onSelectLesson={(num) => {
              setCurrentTab(num);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenProfileManager={() => setIsProfileModalOpen(true)}
            onCopyCompleteNotebook={handleCopyCompleteNotebook}
            onCopyPartialDelivery={handleCopyPartialDelivery}
          />
        )}

        {/* TAB 1: Aula 1 — Seu cérebro X IA */}
        {currentTab === 1 && (
          <Lesson1BrainVsAi
            gameUrl={caderno.adminGameUrl || getAdminGameUrl()}
            isCompleted={completedList.includes(1)}
            onToggleCompleted={() => handleToggleLessonCompleted(1)}
          />
        )}

        {/* TAB 2: Aula 2 — Projetada para parecer humano */}
        {currentTab === 2 && (
          <Lesson2HumanDesign
            curiosity={caderno.lesson2.curiosity}
            flattery={caderno.lesson2.flattery}
            socialPresence={caderno.lesson2.socialPresence}
            authority={caderno.lesson2.authority}
            isCompleted={completedList.includes(2)}
            onUpdateStrategy={(key, data) =>
              setCaderno({
                ...caderno,
                lesson2: {
                  ...caderno.lesson2,
                  [key]: data,
                },
              })
            }
            onToggleCompleted={() => handleToggleLessonCompleted(2)}
            onOpenInDocs={() => handleOpenInDocs(2)}
          />
        )}

        {/* TAB 3: Aula 3 — Começando a política */}
        {currentTab === 3 && (
          <Lesson3Commitment
            q1_who={caderno.lesson3.q1_who}
            q2_what={caderno.lesson3.q2_what}
            q3_when={caderno.lesson3.q3_when}
            q4_where={caderno.lesson3.q4_where}
            q5_how={caderno.lesson3.q5_how}
            isCompleted={completedList.includes(3)}
            onUpdateAnswer={(key, val) =>
              setCaderno({
                ...caderno,
                lesson3: {
                  ...caderno.lesson3,
                  [key]: val,
                },
              })
            }
            onToggleCompleted={() => handleToggleLessonCompleted(3)}
            onCopyToWord={() => handleCopySingleLesson(3)}
          />
        )}

        {/* TAB 4: Aula 4 — Meu compromisso (Entrega Parcial) */}
        {currentTab === 4 && (
          <Lesson4InitialArgument
            thinkBeforeAi={caderno.lesson4.thinkBeforeAi}
            verifyQuestionAi={caderno.lesson4.verifyQuestionAi}
            honestyResponsibility={caderno.lesson4.honestyResponsibility}
            signature={caderno.lesson4.signature}
            date={caderno.lesson4.date}
            isCompleted={completedList.includes(4)}
            onUpdateField={(key, val) =>
              setCaderno({
                ...caderno,
                lesson4: {
                  ...caderno.lesson4,
                  [key]: val,
                },
              })
            }
            onToggleCompleted={() => handleToggleLessonCompleted(4)}
            onCopyToDocs={() => handleCopySingleLesson(4)}
          />
        )}

        {/* TAB 5: Aula 5 — Argumentando em grupo */}
        {currentTab === 5 && (
          <Lesson5InvestigateSources
            groupName={caderno.lesson5.groupName}
            members={caderno.lesson5.members}
            lastEditedBy={caderno.lesson5.lastEditedBy}
            lastEditedAt={caderno.lesson5.lastEditedAt}
            canHelpLearn={caderno.lesson5.canHelpLearn}
            cannotReplaceLearn={caderno.lesson5.cannotReplaceLearn}
            isCompleted={completedList.includes(5)}
            onUpdateGroupName={(name) =>
              setCaderno({
                ...caderno,
                lesson5: {
                  ...caderno.lesson5,
                  groupName: name,
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onUpdateMembers={(members) =>
              setCaderno({
                ...caderno,
                lesson5: {
                  ...caderno.lesson5,
                  members,
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onUpdateLastEditor={(name) =>
              setCaderno({
                ...caderno,
                lesson5: {
                  ...caderno.lesson5,
                  lastEditedBy: name,
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onUpdateCanHelpLearn={(val) =>
              setCaderno({
                ...caderno,
                lesson5: {
                  ...caderno.lesson5,
                  canHelpLearn: val,
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onUpdateCannotReplaceLearn={(val) =>
              setCaderno({
                ...caderno,
                lesson5: {
                  ...caderno.lesson5,
                  cannotReplaceLearn: val,
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onToggleCompleted={() => handleToggleLessonCompleted(5)}
            onCopyToDocs={() => handleCopySingleLesson(5)}
          />
        )}

        {/* TAB 6: Aula 6 — Validando a política */}
        {currentTab === 6 && (
          <Lesson6DecideYourselves
            field1_principle={caderno.lesson6.field1_principle}
            field2_schoolName={caderno.lesson6.field2_schoolName}
            field3_cannotReplace={caderno.lesson6.field3_cannotReplace || getPreFilledLesson6()?.field3_cannotReplace || ''}
            field4_canHelp={caderno.lesson6.field4_canHelp || getPreFilledLesson6()?.field4_canHelp || ''}
            field5_howApplied={caderno.lesson6.field5_howApplied || getPreFilledLesson6()?.field5_howApplied || ''}
            field6_whereUsed={caderno.lesson6.field6_whereUsed || getPreFilledLesson6()?.field6_whereUsed || ''}
            field7_whenActive={caderno.lesson6.field7_whenActive || getPreFilledLesson6()?.field7_whenActive || ''}
            v1Frozen={caderno.lesson6.v1Frozen}
            v1FrozenAt={caderno.lesson6.v1FrozenAt}
            scenarios={caderno.lesson6.scenarios}
            loopholeAgreement={caderno.lesson6.loopholeAgreement}
            lastEditedBy={caderno.lesson6.lastEditedBy}
            lastEditedAt={caderno.lesson6.lastEditedAt}
            isCompleted={completedList.includes(6)}
            onUpdateField={(key, val) =>
              setCaderno({
                ...caderno,
                lesson6: {
                  ...caderno.lesson6,
                  [key]: val,
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onUpdateScenario={(scenarioKey, data) =>
              setCaderno({
                ...caderno,
                lesson6: {
                  ...caderno.lesson6,
                  scenarios: {
                    ...caderno.lesson6.scenarios,
                    [scenarioKey]: data,
                  },
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onToggleFreezeV1={() => {
              const nextFrozen = !caderno.lesson6.v1Frozen;
              setCaderno({
                ...caderno,
                lesson6: {
                  ...caderno.lesson6,
                  v1Frozen: nextFrozen,
                  v1FrozenAt: nextFrozen ? new Date().toISOString() : undefined,
                  lastEditedAt: new Date().toISOString(),
                },
                // Ao congelar V1, pre-alimenta a versão inicial da Aula 7 se ainda não editada
                lesson7: {
                  ...caderno.lesson7,
                  finalPolicy: {
                    ...caderno.lesson7.finalPolicy,
                    field1_principle: caderno.lesson6.field1_principle,
                    field2_target: caderno.lesson6.field2_schoolName
                      ? `Estudantes e professores da escola ${caderno.lesson6.field2_schoolName}`
                      : caderno.lesson7.finalPolicy.field2_target,
                    field3_cannotReplace:
                      caderno.lesson7.finalPolicy.field3_cannotReplace ||
                      caderno.lesson6.field3_cannotReplace ||
                      caderno.lesson5.cannotReplaceLearn,
                    field4_canHelp:
                      caderno.lesson7.finalPolicy.field4_canHelp ||
                      caderno.lesson6.field4_canHelp ||
                      caderno.lesson5.canHelpLearn,
                    field5_howApplied:
                      caderno.lesson7.finalPolicy.field5_howApplied ||
                      caderno.lesson6.field5_howApplied ||
                      caderno.lesson3.q5_how,
                    field6_whereUsed:
                      caderno.lesson7.finalPolicy.field6_whereUsed ||
                      caderno.lesson6.field6_whereUsed ||
                      caderno.lesson3.q4_where,
                    field7_whenActive:
                      caderno.lesson7.finalPolicy.field7_whenActive ||
                      caderno.lesson6.field7_whenActive ||
                      caderno.lesson3.q3_when,
                  },
                },
              });
              addToast(
                'info',
                nextFrozen ? 'Versão 1 congelada!' : 'Versão 1 desbloqueada',
                nextFrozen
                  ? 'A proposta foi salva como V1 e já alimenta a Aula 7.'
                  : 'Os campos da V1 estão abertos para edição.'
              );
            }}
            onToggleCompleted={() => handleToggleLessonCompleted(6)}
            onCopyToWord={() => handleCopySingleLesson(6)}
          />
        )}

        {/* TAB 7: Aula 7 — O mapa mental */}
        {currentTab === 7 && activeProfileId && (
          <Lesson7PitchMentalMap
            members={caderno.lesson5.members}
            finalPolicy={caderno.lesson7.finalPolicy}
            conferenceChecks={caderno.lesson7.conferenceChecks}
            checklist={caderno.lesson7.checklist}
            rehearsal={caderno.lesson7.rehearsal}
            lastEditedBy={caderno.lesson7.lastEditedBy}
            lastEditedAt={caderno.lesson7.lastEditedAt}
            isCompleted={completedList.includes(7)}
            aula6Findings={{
              scenarios: {
                s1: caderno.lesson6.scenarios.scenario1,
                s2: caderno.lesson6.scenarios.scenario2,
                s3: caderno.lesson6.scenarios.scenario3,
              },
              loopholeAgreement: caderno.lesson6.loopholeAgreement,
            }}
            onUpdateFinalPolicy={(updates) =>
              setCaderno({
                ...caderno,
                lesson7: {
                  ...caderno.lesson7,
                  finalPolicy: {
                    ...caderno.lesson7.finalPolicy,
                    ...updates,
                  },
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onUpdateConferenceChecks={(checks) =>
              setCaderno({
                ...caderno,
                lesson7: {
                  ...caderno.lesson7,
                  conferenceChecks: {
                    ...caderno.lesson7.conferenceChecks,
                    ...checks,
                  },
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onUpdateChecklist={(checklistUpdates) =>
              setCaderno({
                ...caderno,
                lesson7: {
                  ...caderno.lesson7,
                  checklist: {
                    ...caderno.lesson7.checklist,
                    ...checklistUpdates,
                  },
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onUpdateRehearsal={(rehearsal) =>
              setCaderno({
                ...caderno,
                lesson7: {
                  ...caderno.lesson7,
                  rehearsal,
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onToggleFinalFrozen={() => {
              const nextFrozen = !caderno.lesson7.finalPolicy.finalFrozen;
              setCaderno({
                ...caderno,
                lesson7: {
                  ...caderno.lesson7,
                  finalPolicy: {
                    ...caderno.lesson7.finalPolicy,
                    finalFrozen: nextFrozen,
                    finalFrozenAt: nextFrozen ? new Date().toISOString() : undefined,
                  },
                  lastEditedAt: new Date().toISOString(),
                },
              });
              addToast(
                'success',
                nextFrozen ? 'Versão Final salva!' : 'Versão Final aberta para edição',
                nextFrozen
                  ? 'A proposta final oficial foi consolidada para a apresentação na Aula 8.'
                  : 'Os campos da proposta final foram liberados para ajuste.'
              );
            }}
            onToggleCompleted={() => handleToggleLessonCompleted(7)}
            onCopyToWord={() => { handleCopySingleLesson(7); }}
            onShowToast={addToast}
          />
        )}

        {/* TAB 8: Aula 8 — Apresentação da Política */}
        {currentTab === 8 && activeProfileId && (
          <Lesson8FinalDelivery
            profileId={activeProfileId}
            groupName={caderno.lesson5.groupName}
            members={caderno.lesson5.members}
            preChecklist={caderno.lesson8.preChecklist}
            isCompleted={completedList.includes(8)}
            onUpdatePreChecklist={(checklist) =>
              setCaderno({
                ...caderno,
                lesson8: {
                  ...caderno.lesson8,
                  preChecklist: {
                    ...caderno.lesson8.preChecklist,
                    ...checklist,
                  },
                  lastEditedAt: new Date().toISOString(),
                },
              })
            }
            onToggleCompleted={() => handleToggleLessonCompleted(8)}
          />
        )}
      </main>

      {/* Rodapé simples e informativo */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>Caderno de Metacognição — IA na Escola</p>
          <p className="text-slate-400">
            Armazenamento local no navegador
          </p>
        </div>
      </footer>

      {/* Modais de Suporte */}
      {isProfileModalOpen && activeProfileId && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          activeProfileId={activeProfileId}
          cadernoState={caderno}
          profiles={profiles}
          onSelectProfile={handleSelectProfile}
          onProfileCreatedOrUpdated={handleRefreshProfiles}
          onShowToast={addToast}
        />
      )}

      <CopyModalFallback
        isOpen={fallbackModal.isOpen}
        onClose={() => setFallbackModal({ isOpen: false, title: '', text: '' })}
        title={fallbackModal.title}
        textToCopy={fallbackModal.text}
      />

      <DocsInstructionModal
        isOpen={docsInstructionModal.isOpen}
        onClose={() => setDocsInstructionModal((prev) => ({ ...prev, isOpen: false }))}
        lessonNum={docsInstructionModal.lessonNum}
        htmlContent={docsInstructionModal.html}
        textContent={docsInstructionModal.text}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
