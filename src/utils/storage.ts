/**
 * Gerenciador de Armazenamento Local (localStorage)
 * - Versão de esquema 3 com suporte a migração automática das versões anteriores
 * - Perfis independentes sem senhas
 * - Tratamento de falhas de cota e corrupção
 * - Backup e restauração JSON incluindo anexo de imagem do mapa mental
 */

import {
  CadernoState,
  ProfileSummary,
  CURRENT_SCHEMA_VERSION,
  createEmptyCaderno,
  DEFAULT_RADAR_COGNITVO_URL,
  FIXED_PRINCIPLE_TEXT,
  getTodayFormattedDate,
} from '../types/caderno';

const STORAGE_KEYS = {
  PROFILES_INDEX: 'caderno_ia_profiles_index',
  ACTIVE_PROFILE_ID: 'caderno_ia_active_profile_id',
  PROFILE_PREFIX: 'caderno_ia_profile_',
  GLOBAL_ADMIN_GAME_URL: 'caderno_ia_admin_game_url',
};

const MAX_ATTACHMENT_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

/**
 * Verifica se o localStorage está disponível e acessível
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtém a URL do jogo Radar Cognitivo (configurável pelo admin/professor)
 */
export function getAdminGameUrl(): string {
  try {
    if (!isStorageAvailable()) return DEFAULT_RADAR_COGNITVO_URL;
    return window.localStorage.getItem(STORAGE_KEYS.GLOBAL_ADMIN_GAME_URL) || DEFAULT_RADAR_COGNITVO_URL;
  } catch {
    return DEFAULT_RADAR_COGNITVO_URL;
  }
}

/**
 * Salva a URL do jogo Radar Cognitivo
 */
export function setAdminGameUrl(url: string): void {
  try {
    if (isStorageAvailable()) {
      window.localStorage.setItem(STORAGE_KEYS.GLOBAL_ADMIN_GAME_URL, url.trim() || DEFAULT_RADAR_COGNITVO_URL);
    }
  } catch (e) {
    console.error('Erro ao salvar URL do jogo:', e);
  }
}

/**
 * Retorna o índice de todos os perfis locais
 */
export function getProfiles(): ProfileSummary[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.PROFILES_INDEX);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Erro ao ler índice de perfis:', e);
    return [];
  }
}

/**
 * Salva o índice de perfis
 */
export function saveProfilesIndex(profiles: ProfileSummary[]): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.PROFILES_INDEX, JSON.stringify(profiles));
  } catch (e) {
    console.error('Erro ao salvar índice de perfis:', e);
  }
}

/**
 * Retorna o ID do perfil atualmente ativo
 */
export function getActiveProfileId(): string | null {
  if (!isStorageAvailable()) return null;
  try {
    return window.localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
  } catch {
    return null;
  }
}

/**
 * Define o perfil ativo
 */
export function setActiveProfileId(profileId: string | null): void {
  if (!isStorageAvailable()) return;
  try {
    if (profileId) {
      window.localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, profileId);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    }
  } catch (e) {
    console.error('Erro ao definir perfil ativo:', e);
  }
}

/**
 * Cria um novo perfil local com apelido
 */
export function createProfile(nickname: string): ProfileSummary {
  const cleanNickname = nickname.trim() || 'Estudante';
  const id = 'prof_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const newSummary: ProfileSummary = {
    id,
    nickname: cleanNickname,
    createdAt: now,
    lastModified: now,
  };

  const emptyState = createEmptyCaderno(id, cleanNickname);
  saveProfileData(id, emptyState);

  const profiles = getProfiles();
  profiles.push(newSummary);
  saveProfilesIndex(profiles);
  setActiveProfileId(id);

  return newSummary;
}

/**
 * Carrega e migra automaticamente os dados de um perfil para a versão mais recente
 */
export function loadProfileData(profileId: string): { state: CadernoState | null; error?: string } {
  if (!isStorageAvailable()) {
    return { state: null, error: 'Armazenamento local indisponível no navegador.' };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.PROFILE_PREFIX + profileId);
    if (!raw) {
      return { state: null, error: 'Perfil não encontrado no armazenamento deste navegador.' };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed: any = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { state: null, error: 'Dados corrompidos no perfil.' };
    }

    const defaultData = createEmptyCaderno(profileId, parsed.nickname || 'Estudante');

    // Migração de versões anteriores
    const legacyL1CanHelp = Array.isArray(parsed.lesson1?.canHelpItems)
      ? parsed.lesson1.canHelpItems.map((i: { text: string }) => i.text).filter(Boolean).join('\n')
      : '';
    const legacyL1CannotReplace = Array.isArray(parsed.lesson1?.cannotReplaceItems)
      ? parsed.lesson1.cannotReplaceItems.map((i: { text: string }) => i.text).filter(Boolean).join('\n')
      : '';

    // Migração da Aula 2
    const migratedL2 = {
      curiosity: {
        notObserved: parsed.lesson2?.curiosity?.notObserved ?? (parsed.lesson2?.curiosity?.observed === 'not_observed'),
        excerpt: parsed.lesson2?.curiosity?.excerpt || '',
      },
      flattery: {
        notObserved: parsed.lesson2?.flattery?.notObserved ?? (parsed.lesson2?.flattery?.observed === 'not_observed'),
        excerpt: parsed.lesson2?.flattery?.excerpt || '',
      },
      socialPresence: {
        notObserved: parsed.lesson2?.socialPresence?.notObserved ?? (parsed.lesson2?.socialPresence?.observed === 'not_observed'),
        excerpt: parsed.lesson2?.socialPresence?.excerpt || '',
      },
      authority: {
        notObserved: parsed.lesson2?.authority?.notObserved ?? (parsed.lesson2?.authority?.observed === 'not_observed'),
        excerpt: parsed.lesson2?.authority?.excerpt || '',
      },
    };

    // Migração da Aula 3 (5 perguntas norteadoras)
    // Se veio de v1/v2, as perguntas norteadoras estavam na antiga aula 4 (answers)
    const migratedL3 = {
      q1_who: parsed.lesson3?.q1_who ?? parsed.lesson4?.answers?.q1_who ?? '',
      q2_what: parsed.lesson3?.q2_what ?? parsed.lesson4?.answers?.q2_what ?? '',
      q3_when: parsed.lesson3?.q3_when ?? parsed.lesson4?.answers?.q3_when ?? '',
      q4_where: parsed.lesson3?.q4_where ?? parsed.lesson4?.answers?.q4_where ?? '',
      q5_how: parsed.lesson3?.q5_how ?? parsed.lesson4?.answers?.q5_how ?? '',
    };

    // Migração da Aula 4 (Meu compromisso)
    // Se veio de v1/v2, o compromisso estava na antiga aula 3
    const migratedL4 = {
      thinkBeforeAi: parsed.lesson4?.thinkBeforeAi ?? parsed.lesson3?.thinkBeforeAi ?? '',
      verifyQuestionAi: parsed.lesson4?.verifyQuestionAi ?? parsed.lesson3?.verifyQuestionAi ?? '',
      honestyResponsibility: parsed.lesson4?.honestyResponsibility ?? parsed.lesson3?.honestyResponsibility ?? '',
      signature: parsed.lesson4?.signature ?? parsed.lesson3?.signature ?? '',
      date: parsed.lesson4?.date ?? parsed.lesson3?.date ?? getTodayFormattedDate(),
      isDelivered: parsed.lesson4?.isDelivered ?? Boolean(parsed.lesson3?.signature),
    };

    // Migração da Aula 5 (Argumentando em grupo)
    // Grupo vinha da antiga aula 4
    let migratedMembers = Array.isArray(parsed.lesson5?.members) && parsed.lesson5.members.length > 0
      ? parsed.lesson5.members
      : null;

    if (!migratedMembers && parsed.lesson4?.members) {
      const names = String(parsed.lesson4.members)
        .split(/[,;\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (names.length > 0) {
        migratedMembers = names.slice(0, 5).map((n, idx) => ({
          id: 'mem_' + idx,
          name: n,
          role: idx === 0 ? 'Relator(a)' : '',
        }));
      }
    }

    const migratedL5 = {
      groupName: parsed.lesson5?.groupName ?? parsed.lesson4?.groupName ?? '',
      members: migratedMembers || defaultData.lesson5.members,
      lastEditedBy: parsed.lesson5?.lastEditedBy || parsed.nickname || 'Estudante',
      lastEditedAt: parsed.lesson5?.lastEditedAt || new Date().toISOString(),
      canHelpLearn: parsed.lesson5?.canHelpLearn ?? legacyL1CanHelp ?? '',
      cannotReplaceLearn: parsed.lesson5?.cannotReplaceLearn ?? legacyL1CannotReplace ?? '',
    };

    // Migração da Aula 6 (Validando a política)
    const migratedL6 = {
      field1_principle: parsed.lesson6?.field1_principle || FIXED_PRINCIPLE_TEXT,
      field2_schoolName: parsed.lesson6?.field2_schoolName || '',
      field3_cannotReplace: parsed.lesson6?.field3_cannotReplace ?? migratedL5.cannotReplaceLearn,
      field4_canHelp: parsed.lesson6?.field4_canHelp ?? migratedL5.canHelpLearn,
      field5_howApplied: parsed.lesson6?.field5_howApplied ?? migratedL3.q5_how,
      field6_whereUsed: parsed.lesson6?.field6_whereUsed ?? migratedL3.q4_where,
      field7_whenActive: parsed.lesson6?.field7_whenActive ?? migratedL3.q3_when,
      v1Frozen: parsed.lesson6?.v1Frozen ?? false,
      v1FrozenAt: parsed.lesson6?.v1FrozenAt,
      scenarios: {
        scenario1: {
          action: parsed.lesson6?.scenarios?.scenario1?.action || '',
          analysis: parsed.lesson6?.scenarios?.scenario1?.analysis || '',
        },
        scenario2: {
          action: parsed.lesson6?.scenarios?.scenario2?.action || '',
          analysis: parsed.lesson6?.scenarios?.scenario2?.analysis || '',
        },
        scenario3: {
          action: parsed.lesson6?.scenarios?.scenario3?.action || '',
          analysis: parsed.lesson6?.scenarios?.scenario3?.analysis || '',
        },
      },
      loopholeAgreement: parsed.lesson6?.loopholeAgreement || '',
      lastEditedBy: parsed.lesson6?.lastEditedBy || parsed.nickname || 'Estudante',
      lastEditedAt: parsed.lesson6?.lastEditedAt || new Date().toISOString(),
    };

    // Migração da Aula 7 (O mapa mental)
    const migratedL7 = {
      finalPolicy: {
        field1_principle: parsed.lesson7?.finalPolicy?.field1_principle || FIXED_PRINCIPLE_TEXT,
        field2_target: parsed.lesson7?.finalPolicy?.field2_target || (migratedL6.field2_schoolName ? `Estudantes e professores da escola ${migratedL6.field2_schoolName}` : ''),
        field3_cannotReplace: parsed.lesson7?.finalPolicy?.field3_cannotReplace || migratedL6.field3_cannotReplace,
        field4_canHelp: parsed.lesson7?.finalPolicy?.field4_canHelp || migratedL6.field4_canHelp,
        field5_howApplied: parsed.lesson7?.finalPolicy?.field5_howApplied || migratedL6.field5_howApplied,
        field6_whereUsed: parsed.lesson7?.finalPolicy?.field6_whereUsed || migratedL6.field6_whereUsed,
        field7_whenActive: parsed.lesson7?.finalPolicy?.field7_whenActive || migratedL6.field7_whenActive,
        finalFrozen: parsed.lesson7?.finalPolicy?.finalFrozen || false,
        finalFrozenAt: parsed.lesson7?.finalPolicy?.finalFrozenAt,
      },
      conferenceChecks: {
        checkScope: parsed.lesson7?.conferenceChecks?.checkScope || false,
        checkClarity: parsed.lesson7?.conferenceChecks?.checkClarity || false,
        checkCognitiveEffort: parsed.lesson7?.conferenceChecks?.checkCognitiveEffort || false,
      },
      imageMeta: parsed.lesson7?.imageMeta || null,
      topicsText: parsed.lesson7?.topicsText || parsed.lesson7?.structuredPitchText || '',
      checklist: {
        check1_allCovered: parsed.lesson7?.checklist?.check1_allCovered || false,
        check2_visualClarity: parsed.lesson7?.checklist?.check2_visualClarity || false,
        check3_cognitiveEffortCenter: parsed.lesson7?.checklist?.check3_cognitiveEffortCenter || false,
      },
      mapReflection: parsed.lesson7?.mapReflection || '',
      rehearsal: Array.isArray(parsed.lesson7?.rehearsal) ? parsed.lesson7.rehearsal : [],
      lastEditedBy: parsed.lesson7?.lastEditedBy || parsed.nickname || 'Estudante',
      lastEditedAt: parsed.lesson7?.lastEditedAt || new Date().toISOString(),
    };

    // Migração da Aula 8 (Apresentação e culminância)
    const migratedL8 = {
      preChecklist: {
        timerReady: parsed.lesson8?.preChecklist?.timerReady || false,
        mapVisible: parsed.lesson8?.preChecklist?.mapVisible || false,
        membersReady: parsed.lesson8?.preChecklist?.membersReady || false,
        postureAudience: parsed.lesson8?.preChecklist?.postureAudience || false,
      },
      peerReview: {
        otherGroupName: parsed.lesson8?.peerReview?.otherGroupName || '',
        strongPoints: parsed.lesson8?.peerReview?.strongPoints || '',
        improvementOrQuestion: parsed.lesson8?.peerReview?.improvementOrQuestion || '',
      },
      closingReflection: {
        relationshipWithAi: parsed.lesson8?.closingReflection?.relationshipWithAi || parsed.lesson8?.individualBalance?.thoughtsNow || '',
        ownThinkingLearning: parsed.lesson8?.closingReflection?.ownThinkingLearning || parsed.lesson8?.individualBalance?.learningEvidence || '',
        mostImportantRule: parsed.lesson8?.closingReflection?.mostImportantRule || parsed.lesson8?.individualBalance?.commitmentToKeep || '',
      },
      lastEditedBy: parsed.lesson8?.lastEditedBy || parsed.nickname || 'Estudante',
      lastEditedAt: parsed.lesson8?.lastEditedAt || new Date().toISOString(),
    };

    const migratedState: CadernoState = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      profileId,
      nickname: parsed.nickname || 'Estudante',
      createdAt: parsed.createdAt || new Date().toISOString(),
      lastModified: parsed.lastModified || new Date().toISOString(),
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      adminGameUrl: parsed.adminGameUrl || getAdminGameUrl(),
      lesson1: { visited: Boolean(parsed.lesson1?.visited) },
      lesson2: migratedL2,
      lesson3: migratedL3,
      lesson4: migratedL4,
      lesson5: migratedL5,
      lesson6: migratedL6,
      lesson7: migratedL7,
      lesson8: migratedL8,
    };

    return { state: migratedState };
  } catch (e) {
    console.error('Falha ao decodificar JSON do perfil:', e);
    return { state: null, error: 'Falha ao ler os dados salvos: JSON corrompido.' };
  }
}

/**
 * Salva os dados de um perfil no localStorage
 */
export function saveProfileData(profileId: string, state: CadernoState): { success: boolean; error?: string } {
  if (!isStorageAvailable()) {
    return { success: false, error: 'Armazenamento indisponível neste navegador.' };
  }

  try {
    // Nunca salvar o attachmentBackup gigante no localStorage para economizar cota!
    const { attachmentBackup, ...cleanState } = state;
    const updatedState: CadernoState = {
      ...cleanState,
      lastModified: new Date().toISOString(),
    };

    const serialized = JSON.stringify(updatedState);
    window.localStorage.setItem(STORAGE_KEYS.PROFILE_PREFIX + profileId, serialized);

    const profiles = getProfiles();
    const idx = profiles.findIndex((p) => p.id === profileId);
    if (idx !== -1) {
      profiles[idx].lastModified = updatedState.lastModified;
      profiles[idx].nickname = updatedState.nickname;
      saveProfilesIndex(profiles);
    }

    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Erro ao gravar no localStorage:', error);
    if (error?.name === 'QuotaExceededError' || error?.message?.includes('quota')) {
      return { success: false, error: 'Limite de espaço do navegador atingido! Exporte um backup e libere dados.' };
    }
    return { success: false, error: 'Falha ao salvar no navegador: ' + (error?.message || 'Erro desconhecido.') };
  }
}

/**
 * Exclui um perfil, seus dados de texto no localStorage e anexo de imagem no IndexedDB
 */
export function deleteProfile(profileId: string): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.PROFILE_PREFIX + profileId);
    const profiles = getProfiles().filter((p) => p.id !== profileId);
    saveProfilesIndex(profiles);

    if (getActiveProfileId() === profileId) {
      const nextId = profiles.length > 0 ? profiles[0].id : null;
      setActiveProfileId(nextId);
    }
    return true;
  } catch (e) {
    console.error('Erro ao excluir perfil:', e);
    return false;
  }
}

/**
 * Exporta os dados do perfil em formato JSON formatado
 */
export async function exportProfileBackupJson(state: CadernoState): Promise<string> {
  const exportPayload: CadernoState = { ...state };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Validação rigorosa de arquivo de backup JSON
 */
export function validateBackupJson(rawJson: string): { valid: boolean; data?: CadernoState; error?: string } {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'O arquivo não contém um objeto JSON válido.' };
    }

    if (typeof parsed.nickname !== 'string') {
      return { valid: false, error: 'O arquivo de backup não possui o campo obrigatório "nickname".' };
    }

    if (!parsed.lesson2 && !parsed.lesson3 && !parsed.lesson4) {
      return { valid: false, error: 'O backup não contém a estrutura esperada das aulas do caderno.' };
    }

    // Validar anexo se presente
    if (parsed.attachmentBackup) {
      const att = parsed.attachmentBackup;
      if (!att.name || !att.type || !att.base64Data) {
        return { valid: false, error: 'O anexo de imagem embutido no backup está corrompido.' };
      }
      if (att.size > MAX_ATTACHMENT_SIZE_BYTES) {
        return { valid: false, error: 'A imagem embutida no backup excede o limite de 5 MB.' };
      }
      if (!ALLOWED_MIME_TYPES.includes(att.type)) {
        return { valid: false, error: 'Formato de imagem do backup não suportado (apenas PNG, JPEG, WebP).' };
      }
    }

    const sanitized = {
      ...createEmptyCaderno(parsed.profileId || ('prof_' + Date.now().toString(36)), parsed.nickname),
      ...parsed,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    };

    return { valid: true, data: sanitized };
  } catch (e: unknown) {
    const error = e as Error;
    return { valid: false, error: 'Formato inválido: ' + (error?.message || 'Não é um JSON válido.') };
  }
}

/**
 * Importa dados de backup para o perfil atual
 */
export async function importBackupToProfile(
  targetProfileId: string,
  backupData: CadernoState
): Promise<{ success: boolean; error?: string }> {
  try {
    const importedState: CadernoState = {
      ...backupData,
      profileId: targetProfileId,
      lastModified: new Date().toISOString(),
    };

    // Salvar estado textual
    const res = saveProfileData(targetProfileId, importedState);
    return res;
  } catch (e: unknown) {
    const error = e as Error;
    return { success: false, error: error?.message || 'Erro ao importar backup.' };
  }
}
