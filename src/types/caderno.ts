/**
 * Tipos de dados e esquema para o Caderno de Metacognição — IA na Escola
 * Versão 3: Reorganização das 8 aulas conforme a especificação pedagógica
 */

export const CURRENT_SCHEMA_VERSION = 3;

export interface ProfileSummary {
  id: string;
  nickname: string;
  createdAt: string;
  lastModified: string;
}

export type GroupRole =
  | 'Relator(a)'
  | 'Guardião/ã das evidências'
  | 'Questionador(a)'
  | 'Gestor(a) do tempo'
  | '';

export interface GroupMember {
  id: string;
  name: string;
  role: GroupRole;
}

export interface MentalMapImageMeta {
  name: string;
  type: string;
  size: number;
  lastModified?: number;
}

export interface MentalMapBackupAttachment {
  name: string;
  type: string;
  size: number;
  base64Data: string;
}

export interface RehearsalItem {
  memberId: string;
  memberName: string;
  branchAssigned: string;
  estimatedTime: string;
}

export interface ScenarioTest {
  action: 'Permitida' | 'Limitada' | 'Proibida' | '';
  analysis: string;
}

export interface CadernoState {
  schemaVersion: number;
  profileId: string;
  nickname: string;
  createdAt: string;
  lastModified: string;
  completedLessons: number[]; // Aulas marcadas manualmente como concluídas (1 a 8)

  // URL do jogo Radar Cognitivo (configurável pelo admin/professor)
  adminGameUrl?: string;

  // Aula 1 — Seu cérebro X IA (sem entregável, apenas link para o jogo e reflexão)
  lesson1: {
    visited?: boolean;
  };

  // Aula 2 — Projetada para parecer humano (tabela de 4 estratégias)
  lesson2: {
    curiosity: { notObserved: boolean; excerpt: string };
    flattery: { notObserved: boolean; excerpt: string };
    socialPresence: { notObserved: boolean; excerpt: string };
    authority: { notObserved: boolean; excerpt: string };
  };

  // Aula 3 — Começando a política (5 perguntas norteadoras individuais)
  lesson3: {
    q1_who: string; // Quem será afetado
    q2_what: string; // O que a política fará
    q3_when: string; // Quando entra em vigor / quando a IA pode ser usada (alimenta A6 campo 7)
    q4_where: string; // Onde a IA poderá ser usada (alimenta A6 campo 6)
    q5_how: string; // Como será aplicada e fiscalizada na prática (alimenta A6 campo 5)
  };

  // Aula 4 — Meu compromisso (Entrega Parcial individual)
  lesson4: {
    thinkBeforeAi: string; // Pensar antes da IA
    verifyQuestionAi: string; // Verificar e questionar a IA
    honestyResponsibility: string; // Honestidade e responsabilidade
    signature: string; // Assinatura do estudante
    date: string; // Data editável (auto-preenchida)
    isDelivered?: boolean;
  };

  // Aula 5 — Argumentando em grupo (Entregável em Grupo)
  lesson5: {
    groupName: string;
    members: GroupMember[];
    lastEditedBy: string;
    lastEditedAt: string;
    canHelpLearn: string; // "Com o que a IA pode me ajudar a aprender?" -> alimenta A6 campo 4
    cannotReplaceLearn: string; // "O que a IA não pode substituir no meu processo de aprendizagem?" -> alimenta A6 campo 3
  };

  // Aula 6 — Validando a política (Entregável em Grupo)
  lesson6: {
    // Parte 1: Política V1 (7 campos)
    field1_principle: string; // [fixo]
    field2_schoolName: string; // Para quem [fixo + nome da escola editável]
    field3_cannotReplace: string; // [pré-preenchido de A5 pergunta 2]
    field4_canHelp: string; // [pré-preenchido de A5 pergunta 1]
    field5_howApplied: string; // [pré-preenchido de A3 pergunta 5]
    field6_whereUsed: string; // [pré-preenchido de A3 pergunta 4]
    field7_whenActive: string; // [pré-preenchido de A3 pergunta 3]
    v1Frozen: boolean;
    v1FrozenAt?: string;

    // Parte 2: 3 cenários
    scenarios: {
      scenario1: ScenarioTest; // Ciências: resumo de artigo
      scenario2: ScenarioTest; // História: argumentos e citação
      scenario3: ScenarioTest; // Trabalho em grupo: slides gerados em 2 min
    };

    // Parte 3: Caça às brechas com IA
    loopholeAgreement: string;

    lastEditedBy: string;
    lastEditedAt: string;
  };

  // Aula 7 — O mapa mental (Entregável em Grupo)
  lesson7: {
    // Parte 1: Política Final (7 campos editáveis)
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
      checkScope: boolean; // Cobriu onde pode e onde não pode?
      checkClarity: boolean; // Ficou claro para toda a comunidade?
      checkCognitiveEffort: boolean; // O esforço cognitivo do estudante está protegido?
    };

    // Parte 3: Mapa mental (imagem ou tópicos)
    imageMeta: MentalMapImageMeta | null;
    topicsText: string;

    // Parte 4: Checklist do mapa + reflexão
    checklist: {
      check1_allCovered: boolean;
      check2_visualClarity: boolean;
      check3_cognitiveEffortCenter: boolean;
    };
    mapReflection: string;

    // Parte 5: Divisão dos ramos para ensaio
    rehearsal: RehearsalItem[];

    lastEditedBy: string;
    lastEditedAt: string;
  };

  // Backup embutido para transporte em JSON
  attachmentBackup?: MentalMapBackupAttachment | null;

  // Aula 8 — Apresentação e culminância (Apoio à apresentação do grupo + balanço individual)
  lesson8: {
    // Bloco 3: Checklist pré-apresentação
    preChecklist: {
      timerReady: boolean;
      mapVisible: boolean;
      membersReady: boolean;
      postureAudience: boolean;
    };

    // Bloco 4: Avaliação entre pares (individual, opcional)
    peerReview: {
      otherGroupName: string;
      strongPoints: string;
      improvementOrQuestion: string;
    };

    // Bloco 5: Balanço individual de encerramento
    closingReflection: {
      relationshipWithAi: string;
      ownThinkingLearning: string;
      mostImportantRule: string;
    };

    lastEditedBy: string;
    lastEditedAt: string;
  };
}

export const DEFAULT_RADAR_COGNITIVO_URL = 'https://augmelo.github.io/radar-cognitvo/';
export const DEFAULT_RADAR_COGNITVO_URL = DEFAULT_RADAR_COGNITIVO_URL;

export const FIXED_PRINCIPLE_TEXT =
  'A Inteligência Artificial na escola deve servir como ferramenta de apoio à aprendizagem, fortalecendo a autonomia e o esforço cognitivo dos estudantes, sem jamais substituir o pensamento próprio, a autoria e as relações humanas.';

export function getTodayFormattedDate(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function createEmptyCaderno(profileId: string, nickname: string): CadernoState {
  const now = new Date().toISOString();
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    profileId,
    nickname,
    createdAt: now,
    lastModified: now,
    completedLessons: [],
    adminGameUrl: DEFAULT_RADAR_COGNITIVO_URL,

    lesson1: {
      visited: false,
    },

    lesson2: {
      curiosity: { notObserved: false, excerpt: '' },
      flattery: { notObserved: false, excerpt: '' },
      socialPresence: { notObserved: false, excerpt: '' },
      authority: { notObserved: false, excerpt: '' },
    },

    lesson3: {
      q1_who: '',
      q2_what: '',
      q3_when: '',
      q4_where: '',
      q5_how: '',
    },

    lesson4: {
      thinkBeforeAi: '',
      verifyQuestionAi: '',
      honestyResponsibility: '',
      signature: '',
      date: getTodayFormattedDate(),
      isDelivered: false,
    },

    lesson5: {
      groupName: '',
      members: [
        { id: 'mem_1', name: nickname || 'Estudante 1', role: 'Relator(a)' },
      ],
      lastEditedBy: nickname || 'Estudante',
      lastEditedAt: now,
      canHelpLearn: '',
      cannotReplaceLearn: '',
    },

    lesson6: {
      field1_principle: FIXED_PRINCIPLE_TEXT,
      field2_schoolName: '',
      field3_cannotReplace: '',
      field4_canHelp: '',
      field5_howApplied: '',
      field6_whereUsed: '',
      field7_whenActive: '',
      v1Frozen: false,
      v1FrozenAt: undefined,
      scenarios: {
        scenario1: { action: '', analysis: '' },
        scenario2: { action: '', analysis: '' },
        scenario3: { action: '', analysis: '' },
      },
      loopholeAgreement: '',
      lastEditedBy: nickname || 'Estudante',
      lastEditedAt: now,
    },

    lesson7: {
      finalPolicy: {
        field1_principle: FIXED_PRINCIPLE_TEXT,
        field2_target: '',
        field3_cannotReplace: '',
        field4_canHelp: '',
        field5_howApplied: '',
        field6_whereUsed: '',
        field7_whenActive: '',
        finalFrozen: false,
        finalFrozenAt: undefined,
      },
      conferenceChecks: {
        checkScope: false,
        checkClarity: false,
        checkCognitiveEffort: false,
      },
      imageMeta: null,
      topicsText: '',
      checklist: {
        check1_allCovered: false,
        check2_visualClarity: false,
        check3_cognitiveEffortCenter: false,
      },
      mapReflection: '',
      rehearsal: [],
      lastEditedBy: nickname || 'Estudante',
      lastEditedAt: now,
    },

    attachmentBackup: null,

    lesson8: {
      preChecklist: {
        timerReady: false,
        mapVisible: false,
        membersReady: false,
        postureAudience: false,
      },
      peerReview: {
        otherGroupName: '',
        strongPoints: '',
        improvementOrQuestion: '',
      },
      closingReflection: {
        relationshipWithAi: '',
        ownThinkingLearning: '',
        mostImportantRule: '',
      },
      lastEditedBy: nickname || 'Estudante',
      lastEditedAt: now,
    },
  };
}
