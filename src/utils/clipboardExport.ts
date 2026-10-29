/**
 * Gerador de exportação central para cópia e colagem no Microsoft Word
 * Gera versões sincronizadas em HTML e Texto Simples.
 * Escapa HTML em todas as entradas do usuário para segurança.
 */

import { CadernoState } from '../types/caderno';

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatValue(val: string | null | undefined, fallback = 'Não preenchido'): string {
  if (!val || !val.trim()) return fallback;
  return val.trim();
}

export function formatHtmlParagraphs(text: string | null | undefined): string {
  if (!text || !text.trim()) {
    return '<em>Não preenchido</em>';
  }
  const safe = escapeHtml(text.trim());
  const paragraphs = safe.split(/\n\s*\n/);
  return paragraphs.map((p) => `<p style="margin: 6pt 0;">${p.replace(/\n/g, '<br/>')}</p>`).join('');
}

export const LESSON_TITLES: Record<number, string> = {
  1: 'Aula 1 — Seu cérebro X IA',
  2: 'Aula 2 — Projetada para parecer humano',
  3: 'Aula 3 — Começando a política',
  4: 'Aula 4 — Meu compromisso (Entrega Parcial)',
  5: 'Aula 5 — Argumentando em grupo',
  6: 'Aula 6 — Validando a política',
  7: 'Aula 7 — O mapa mental da política',
  8: 'Aula 8 — Apresentação da Política',
};

// ---------------- HTML & TEXT FORMATTERS PER LESSON ---------------- //

function formatLesson1Html(state: CadernoState): string {
  const url = state.adminGameUrl || 'https://augmelo.github.io/radar-cognitvo/';
  return `
    <h2 style="color: #0284c7; font-size: 14pt; margin-top: 12pt;">Aula 1 — Seu cérebro X IA</h2>
    <p style="font-style: italic; color: #475569;">Jogo: Radar Cognitivo (Alura Start)</p>
    <p><strong>Link do jogo:</strong> <a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>
    <div style="background-color: #f8fafc; border-left: 3pt solid #0284c7; padding: 8pt 12pt; margin: 10pt 0;">
      <p style="margin: 0; font-weight: bold; color: #0f172a;">Reflexão pedagógica da aula:</p>
      <p style="margin: 4pt 0 0 0; color: #334155;">Depois do jogo, pense: com o que a IA pode ajudar e o que a IA não pode substituir?</p>
    </div>
  `;
}

function formatLesson1Text(state: CadernoState): string {
  const url = state.adminGameUrl || 'https://augmelo.github.io/radar-cognitvo/';
  return `=== AULA 1 — SEU CÉREBRO X IA ===\nJogo: Radar Cognitivo (Alura Start)\nLink do jogo: ${url}\nReflexão da aula: Depois do jogo, pense: com o que a IA pode ajudar e o que a IA não pode substituir?\n`;
}

function formatLesson2Html(state: CadernoState): string {
  const { curiosity, flattery, socialPresence, authority } = state.lesson2;
  const strategies = [
    { title: 'Curiosidade simulada', desc: 'A IA faz perguntas para manter a conversa ativa', data: curiosity },
    { title: 'Bajulação', desc: 'A IA elogia o raciocínio ou a pergunta para agradar', data: flattery },
    { title: 'Presença social', desc: 'A IA usa pronomes humanos (eu sinto, eu penso) simulando empatia', data: socialPresence },
    { title: 'Sinalização de autoridade', desc: 'A IA soa altamente confiante mesmo quando imprecisa', data: authority },
  ];

  const rows = strategies
    .map(
      (s) => `
      <tr>
        <td style="border: 1pt solid #cbd5e1; padding: 6pt; background-color: #f8fafc; width: 30%;">
          <strong>${escapeHtml(s.title)}</strong><br/>
          <small style="color: #64748b;">${escapeHtml(s.desc)}</small>
        </td>
        <td style="border: 1pt solid #cbd5e1; padding: 6pt; width: 20%; text-align: center;">
          ${s.data.notObserved ? '<span style="color: #64748b; font-weight: bold;">[ Não observado ]</span>' : '<span style="color: #059669; font-weight: bold;">[ Observado ]</span>'}
        </td>
        <td style="border: 1pt solid #cbd5e1; padding: 6pt;">
          ${s.data.notObserved ? '<em>Estratégia não identificada na conversa com o chat.</em>' : formatHtmlParagraphs(s.data.excerpt)}
        </td>
      </tr>`
    )
    .join('');

  return `
    <h2 style="color: #0284c7; font-size: 14pt; margin-top: 12pt;">Aula 2 — Projetada para parecer humano</h2>
    <p style="font-style: italic; color: #475569;">Estratégias de design conversacional identificadas na conversa com IA:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 8pt; font-size: 10pt;">
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="border: 1pt solid #cbd5e1; padding: 6pt; text-align: left;">Estratégia</th>
          <th style="border: 1pt solid #cbd5e1; padding: 6pt; text-align: center;">Status</th>
          <th style="border: 1pt solid #cbd5e1; padding: 6pt; text-align: left;">Trecho que comprova</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function formatLesson2Text(state: CadernoState): string {
  const { curiosity, flattery, socialPresence, authority } = state.lesson2;
  const strategies = [
    { title: 'Curiosidade simulada', data: curiosity },
    { title: 'Bajulação', data: flattery },
    { title: 'Presença social', data: socialPresence },
    { title: 'Sinalização de autoridade', data: authority },
  ];

  return (
    `=== AULA 2 — PROJETADA PARA PARECER HUMANO ===\n` +
    strategies
      .map(
        (s) =>
          `* ${s.title}: [${s.data.notObserved ? 'Não observado' : 'Observado'}]\n  Trecho: ${s.data.notObserved ? 'Não observado' : formatValue(s.data.excerpt)}`
      )
      .join('\n\n') +
    '\n'
  );
}

function formatLesson3Html(state: CadernoState): string {
  const l3 = state.lesson3;
  return `
    <h2 style="color: #0284c7; font-size: 14pt; margin-top: 12pt;">Aula 3 — Começando a política</h2>
    <p style="font-style: italic; color: #475569;">Perguntas norteadoras para o início da elaboração da proposta:</p>
    <div style="margin-top: 8pt;">
      <p><strong>1. Quem será afetado pela política?</strong></p>
      ${formatHtmlParagraphs(l3.q1_who)}
      <p><strong>2. O que a política fará?</strong></p>
      ${formatHtmlParagraphs(l3.q2_what)}
      <p><strong>3. Quando entra em vigor / quando a IA pode ser usada?</strong> <em>[Alimenta Aula 6]</em></p>
      ${formatHtmlParagraphs(l3.q3_when)}
      <p><strong>4. Onde a IA poderá ser usada?</strong> <em>[Alimenta Aula 6]</em></p>
      ${formatHtmlParagraphs(l3.q4_where)}
      <p><strong>5. Como a política será aplicada e fiscalizada na prática?</strong> <em>[Alimenta Aula 6]</em></p>
      ${formatHtmlParagraphs(l3.q5_how)}
    </div>
  `;
}

function formatLesson3Text(state: CadernoState): string {
  const l3 = state.lesson3;
  return (
    `=== AULA 3 — COMEÇANDO A POLÍTICA ===\n` +
    `1. Quem será afetado:\n${formatValue(l3.q1_who)}\n\n` +
    `2. O que a política fará:\n${formatValue(l3.q2_what)}\n\n` +
    `3. Quando entra em vigor (alimenta A6):\n${formatValue(l3.q3_when)}\n\n` +
    `4. Onde poderá ser usada (alimenta A6):\n${formatValue(l3.q4_where)}\n\n` +
    `5. Como será aplicada (alimenta A6):\n${formatValue(l3.q5_how)}\n`
  );
}

function formatLesson4Html(state: CadernoState): string {
  const l4 = state.lesson4;
  return `
    <div style="border: 2pt solid #059669; border-radius: 6pt; padding: 16pt; margin: 12pt 0; background-color: #ffffff;">
      <div style="border-bottom: 1.5pt solid #059669; padding-bottom: 8pt; margin-bottom: 12pt; text-align: center;">
        <h2 style="color: #059669; font-size: 16pt; margin: 0; text-transform: uppercase;">MEU COMPROMISSO</h2>
        <p style="margin: 6pt 0 0 0; color: #334155; font-style: italic; font-size: 11pt;">
          Neste ano, comprometo-me a usar a IA como uma ferramenta para apoiar meu aprendizado, não para substituir meu pensamento. Eu irei:
        </p>
      </div>

      <div style="margin-bottom: 14pt;">
        <p style="font-weight: bold; margin: 4pt 0; color: #0f172a;">1. Como vou tentar pensar e resolver antes de recorrer à IA:</p>
        ${formatHtmlParagraphs(l4.thinkBeforeAi)}
      </div>

      <div style="margin-bottom: 14pt;">
        <p style="font-weight: bold; margin: 4pt 0; color: #0f172a;">2. Como vou verificar ou questionar o que a IA gerar:</p>
        ${formatHtmlParagraphs(l4.verifyQuestionAi)}
      </div>

      <div style="margin-bottom: 14pt;">
        <p style="font-weight: bold; margin: 4pt 0; color: #0f172a;">3. Como vou agir com honestidade e responsabilidade sobre minhas produções:</p>
        ${formatHtmlParagraphs(l4.honestyResponsibility)}
      </div>

      <div style="margin-top: 16pt; padding-top: 10pt; border-top: 1pt dashed #cbd5e1; display: flex; justify-content: space-between; font-size: 10.5pt;">
        <p style="margin: 0;"><strong>Assinatura do aluno:</strong> ${escapeHtml(formatValue(l4.signature))}</p>
        <p style="margin: 0;"><strong>Data:</strong> ${escapeHtml(formatValue(l4.date))}</p>
      </div>
    </div>
  `;
}

function formatLesson4Text(state: CadernoState): string {
  const l4 = state.lesson4;
  return (
    `=== MEU COMPROMISSO (AULA 4 — ENTREGA PARCIAL) ===\n\n` +
    `Neste ano, comprometo-me a usar a IA como uma ferramenta para apoiar meu aprendizado, não para substituir meu pensamento. Eu irei:\n\n` +
    `1. Como vou tentar pensar e resolver antes de recorrer à IA:\n${formatValue(l4.thinkBeforeAi)}\n\n` +
    `2. Como vou verificar ou questionar o que a IA gerar:\n${formatValue(l4.verifyQuestionAi)}\n\n` +
    `3. Como vou agir com honestidade e responsabilidade sobre minhas produções:\n${formatValue(l4.honestyResponsibility)}\n\n` +
    `Assinatura do aluno: ${formatValue(l4.signature)}    Data: ${formatValue(l4.date)}\n`
  );
}

function formatLesson5Html(state: CadernoState): string {
  const l5 = state.lesson5;
  const membersList = l5.members
    .map((m) => `<li><strong>${escapeHtml(m.name || 'Estudante')}</strong>: ${escapeHtml(m.role || 'Sem papel definido')}</li>`)
    .join('');

  const helpLines = l5.canHelpLearn
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const helpListHtml =
    helpLines.length > 0
      ? `<ul style="list-style: none; padding-left: 0; margin: 4pt 0;">${helpLines
          .map((line) => `<li style="margin: 4pt 0; color: #047857;">✓ ${escapeHtml(line)}</li>`)
          .join('')}</ul>`
      : '<em>Não preenchido</em>';

  const replaceLines = l5.cannotReplaceLearn
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const replaceListHtml =
    replaceLines.length > 0
      ? `<ul style="list-style: none; padding-left: 0; margin: 4pt 0;">${replaceLines
          .map((line) => `<li style="margin: 4pt 0; color: #b91c1c;">✗ ${escapeHtml(line)}</li>`)
          .join('')}</ul>`
      : '<em>Não preenchido</em>';

  return `
    <h2 style="color: #7c3aed; font-size: 14pt; margin-top: 12pt;">Aula 5 — Argumentando em grupo</h2>
    <p style="color: #475569;"><strong>Grupo:</strong> ${escapeHtml(formatValue(l5.groupName))} | <em>Última edição por ${escapeHtml(formatValue(l5.lastEditedBy))}</em></p>
    
    <div style="background-color: #f5f3ff; border: 1pt solid #ddd6fe; border-radius: 4pt; padding: 8pt; margin: 8pt 0;">
      <p style="margin: 0 0 4pt 0; font-weight: bold; color: #6d28d9;">Integrantes e Papéis:</p>
      <ul style="margin: 0 0 0 16pt; padding: 0;">${membersList || '<li>Nenhum integrante cadastrado</li>'}</ul>
    </div>

    <div style="margin-top: 10pt;">
      <h3 style="font-size: 11pt; color: #0f172a; margin: 8pt 0 4pt 0;">Com o que a IA pode me ajudar a aprender?</h3>
      ${helpListHtml}
      
      <h3 style="font-size: 11pt; color: #0f172a; margin: 8pt 0 4pt 0;">O que a IA não pode substituir no meu processo de aprendizagem?</h3>
      ${replaceListHtml}
    </div>
  `;
}

function formatLesson5Text(state: CadernoState): string {
  const l5 = state.lesson5;
  const membersText = l5.members.map((m) => `  * ${m.name || 'Estudante'} (${m.role || 'Sem papel'})`).join('\n');
  const helpLines = l5.canHelpLearn.split('\n').map((l) => l.trim()).filter(Boolean);
  const helpText = helpLines.length > 0 ? helpLines.map((l) => `  ✓ ${l}`).join('\n') : 'Não preenchido';
  const replaceLines = l5.cannotReplaceLearn.split('\n').map((l) => l.trim()).filter(Boolean);
  const replaceText = replaceLines.length > 0 ? replaceLines.map((l) => `  ✗ ${l}`).join('\n') : 'Não preenchido';

  return (
    `=== AULA 5 — ARGUMENTANDO EM GRUPO ===\n` +
    `Grupo: ${formatValue(l5.groupName)}\n` +
    `Última edição por: ${formatValue(l5.lastEditedBy)}\n` +
    `Integrantes:\n${membersText}\n\n` +
    `Com o que a IA pode me ajudar a aprender?\n${helpText}\n\n` +
    `O que a IA não pode substituir no meu processo de aprendizagem?\n${replaceText}\n`
  );
}

function formatLesson6Html(state: CadernoState): string {
  const l6 = state.lesson6;
  return `
    <h2 style="color: #7c3aed; font-size: 14pt; margin-top: 12pt;">Aula 6 — Validando a política</h2>
    <p style="color: #475569;"><em>Status da V1: ${l6.v1Frozen ? `Versão 1 congelada em ${escapeHtml(l6.v1FrozenAt || '')}` : 'Em edição'}</em></p>

    <div style="border: 1pt solid #cbd5e1; padding: 10pt; border-radius: 4pt; background-color: #ffffff; margin-top: 8pt;">
      <h3 style="color: #0f172a; margin: 0 0 6pt 0;">Política de Uso de IA na Escola — Versão 1</h3>
      <p><strong>1. Princípio Geral [fixo]:</strong> ${escapeHtml(l6.field1_principle)}</p>
      <p><strong>2. Para quem se aplica:</strong> Estudantes e professores da escola ${escapeHtml(formatValue(l6.field2_schoolName))}</p>
      <p><strong>3. O que a IA não pode substituir [de A5]:</strong></p>
      ${formatHtmlParagraphs(l6.field3_cannotReplace)}
      <p><strong>4. Com o que a IA pode ajudar [de A5]:</strong></p>
      ${formatHtmlParagraphs(l6.field4_canHelp)}
      <p><strong>5. Como será aplicada [de A3]:</strong></p>
      ${formatHtmlParagraphs(l6.field5_howApplied)}
      <p><strong>6. Onde será usada [de A3]:</strong></p>
      ${formatHtmlParagraphs(l6.field6_whereUsed)}
      <p><strong>7. Quando entra em vigor [de A3]:</strong></p>
      ${formatHtmlParagraphs(l6.field7_whenActive)}
    </div>

    <div style="margin-top: 12pt;">
      <h3 style="color: #0f172a; margin: 8pt 0;">Testes com 3 Cenários Práticos:</h3>
      <p><strong>Cenário 1 (Ciências - Resumo direto de artigo):</strong> [${escapeHtml(formatValue(l6.scenarios.scenario1.action))}]<br/>
      ${formatHtmlParagraphs(l6.scenarios.scenario1.analysis)}</p>
      
      <p><strong>Cenário 2 (História - Comparação de argumentos e citação):</strong> [${escapeHtml(formatValue(l6.scenarios.scenario2.action))}]<br/>
      ${formatHtmlParagraphs(l6.scenarios.scenario2.analysis)}</p>
      
      <p><strong>Cenário 3 (Trabalho em Grupo - Slides gerados em 2 min):</strong> [${escapeHtml(formatValue(l6.scenarios.scenario3.action))}]<br/>
      ${formatHtmlParagraphs(l6.scenarios.scenario3.analysis)}</p>
    </div>

    <div style="margin-top: 10pt;">
      <h3 style="color: #0f172a;">Caça às Brechas e Deliberação do Grupo:</h3>
      ${formatHtmlParagraphs(l6.loopholeAgreement)}
    </div>
  `;
}

function formatLesson6Text(state: CadernoState): string {
  const l6 = state.lesson6;
  return (
    `=== AULA 6 — VALIDANDO A POLÍTICA (VERSÃO 1) ===\n` +
    `Princípio Geral: ${l6.field1_principle}\n` +
    `Para quem: Estudantes e professores da escola ${formatValue(l6.field2_schoolName)}\n` +
    `3. Não pode substituir: ${formatValue(l6.field3_cannotReplace)}\n` +
    `4. Pode ajudar: ${formatValue(l6.field4_canHelp)}\n` +
    `5. Como será aplicada: ${formatValue(l6.field5_howApplied)}\n` +
    `6. Onde será usada: ${formatValue(l6.field6_whereUsed)}\n` +
    `7. Quando entra em vigor: ${formatValue(l6.field7_whenActive)}\n\n` +
    `Cenário 1 (Ciências): [${formatValue(l6.scenarios.scenario1.action)}]\n${formatValue(l6.scenarios.scenario1.analysis)}\n\n` +
    `Cenário 2 (História): [${formatValue(l6.scenarios.scenario2.action)}]\n${formatValue(l6.scenarios.scenario2.analysis)}\n\n` +
    `Cenário 3 (Trabalho em grupo): [${formatValue(l6.scenarios.scenario3.action)}]\n${formatValue(l6.scenarios.scenario3.analysis)}\n\n` +
    `Deliberação de Brechas: ${formatValue(l6.loopholeAgreement)}\n`
  );
}

function formatLesson7Html(state: CadernoState, imageBase64DataUrl?: string | null): string {
  const l7 = state.lesson7;
  const p = l7.finalPolicy;

  let imgBlock = '';
  if (imageBase64DataUrl) {
    imgBlock = `
      <div style="margin: 12pt 0; text-align: center;">
        <p><strong>Mapa Mental Anexado:</strong></p>
        <img src="${imageBase64DataUrl}" alt="Mapa Mental da Política" style="max-width: 100%; height: auto; border: 1pt solid #cbd5e1; border-radius: 4pt;" />
      </div>
    `;
  } else if (l7.imageMeta) {
    imgBlock = `<p><strong>Mapa Mental Anexado:</strong> Arquivo <em>${escapeHtml(l7.imageMeta.name)}</em> (${Math.round(l7.imageMeta.size / 1024)} KB)</p>`;
  } else {
    imgBlock = `<p><strong>Mapa Mental:</strong> Nenhum arquivo de imagem anexado.</p>`;
  }

  const rehearsalRows = l7.rehearsal
    .map(
      (r) =>
        `<tr>
          <td style="border: 1pt solid #cbd5e1; padding: 6pt;"><strong>${escapeHtml(r.memberName || 'Estudante')}</strong></td>
          <td style="border: 1pt solid #cbd5e1; padding: 6pt;">${escapeHtml(formatValue(r.branchAssigned))}</td>
          <td style="border: 1pt solid #cbd5e1; padding: 6pt; text-align: center;">${escapeHtml(formatValue(r.estimatedTime))}</td>
        </tr>`
    )
    .join('');

  return `
    <h2 style="color: #7c3aed; font-size: 14pt; margin-top: 12pt;">Aula 7 — O mapa mental da política</h2>
    
    <div style="border: 1.5pt solid #7c3aed; padding: 12pt; border-radius: 6pt; background-color: #faf5ff; margin-top: 8pt;">
      <h3 style="color: #6d28d9; margin: 0 0 6pt 0;">PROPOSTA FINAL DE POLÍTICA DE IA NA ESCOLA</h3>
      <p><strong>1. Princípio:</strong> ${escapeHtml(p.field1_principle)}</p>
      <p><strong>2. Público-alvo:</strong> ${escapeHtml(formatValue(p.field2_target))}</p>
      <p><strong>3. O que a IA não pode substituir:</strong></p>
      ${formatHtmlParagraphs(p.field3_cannotReplace)}
      <p><strong>4. Com o que a IA pode ajudar:</strong></p>
      ${formatHtmlParagraphs(p.field4_canHelp)}
      <p><strong>5. Como será aplicada na prática:</strong></p>
      ${formatHtmlParagraphs(p.field5_howApplied)}
      <p><strong>6. Onde poderá ser usada:</strong></p>
      ${formatHtmlParagraphs(p.field6_whereUsed)}
      <p><strong>7. Quando entra em vigor:</strong></p>
      ${formatHtmlParagraphs(p.field7_whenActive)}
    </div>

    ${imgBlock}

    ${l7.topicsText ? `<div><h4>Descrição dos Ramos/Tópicos do Mapa:</h4>${formatHtmlParagraphs(l7.topicsText)}</div>` : ''}

    <div style="margin-top: 10pt;">
      <h4>Reflexão sobre a visualização do mapa:</h4>
      ${formatHtmlParagraphs(l7.mapReflection)}
    </div>

    <div style="margin-top: 12pt;">
      <h4>Divisão de Falas para o Ensaio do Pitch (3 minutos):</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1pt solid #cbd5e1; padding: 6pt; text-align: left;">Integrante</th>
            <th style="border: 1pt solid #cbd5e1; padding: 6pt; text-align: left;">Ramo / Parte Atribuída</th>
            <th style="border: 1pt solid #cbd5e1; padding: 6pt; text-align: center;">Tempo Estimado</th>
          </tr>
        </thead>
        <tbody>${rehearsalRows || '<tr><td colspan="3" style="padding: 6pt; text-align: center; color: #64748b;">Nenhuma divisão registrada</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

function formatLesson7Text(state: CadernoState): string {
  const l7 = state.lesson7;
  const p = l7.finalPolicy;
  const rehearsalLines = l7.rehearsal.map((r) => `  * ${r.memberName}: ${r.branchAssigned} (${r.estimatedTime})`).join('\n');
  return (
    `=== AULA 7 — O MAPA MENTAL DA POLÍTICA ===\n` +
    `PROPOSTA FINAL DE POLÍTICA:\n` +
    `1. Princípio: ${p.field1_principle}\n` +
    `2. Público-alvo: ${formatValue(p.field2_target)}\n` +
    `3. Não pode substituir: ${formatValue(p.field3_cannotReplace)}\n` +
    `4. Pode ajudar: ${formatValue(p.field4_canHelp)}\n` +
    `5. Como será aplicada: ${formatValue(p.field5_howApplied)}\n` +
    `6. Onde será usada: ${formatValue(p.field6_whereUsed)}\n` +
    `7. Quando entra em vigor: ${formatValue(p.field7_whenActive)}\n\n` +
    `Mapa mental imagem: ${l7.imageMeta ? l7.imageMeta.name : 'Não anexado'}\n` +
    `Tópicos do mapa: ${formatValue(l7.topicsText)}\n` +
    `Reflexão: ${formatValue(l7.mapReflection)}\n\n` +
    `Divisão de ensaio:\n${rehearsalLines || 'Nenhuma divisão registrada'}\n`
  );
}

function formatLesson8Html(state: CadernoState, imageBase64DataUrl?: string | null): string {
  const l8 = state.lesson8;
  const l7 = state.lesson7;
  const l5 = state.lesson5;
  const l4 = state.lesson4;

  return `
    <h2 style="color: #059669; font-size: 16pt; margin-top: 12pt; text-transform: uppercase;">
      Aula 8 — Apresentação da Política
    </h2>
    <p style="font-size: 11pt;"><strong>Grupo:</strong> ${escapeHtml(formatValue(l5.groupName))}</p>

    <div style="border: 1pt solid #cbd5e1; border-radius: 6pt; padding: 10pt; background-color: #f8fafc; margin-top: 12pt;">
      <h3 style="color: #0f172a; margin-top: 0;">Checklist Pré-Apresentação:</h3>
      <ul style="margin: 4pt 0; padding-left: 18pt;">
        <li>Cronômetro de 3 minutos configurado: <strong>${l8.preChecklist?.timerReady ? 'Pronto' : 'Pendente'}</strong></li>
        <li>Mapa mental visível e aberto: <strong>${l8.preChecklist?.mapVisible ? 'Pronto' : 'Pendente'}</strong></li>
        <li>Ordem das falas alinhada: <strong>${l8.preChecklist?.membersReady ? 'Pronto' : 'Pendente'}</strong></li>
        <li>Postura e foco na turma: <strong>${l8.preChecklist?.postureAudience ? 'Pronto' : 'Pendente'}</strong></li>
      </ul>
    </div>

    ${formatLesson7Html(state, imageBase64DataUrl)}

    ${
      l8.peerReview?.otherGroupName
        ? `
    <div style="border-top: 2pt solid #e2e8f0; margin-top: 16pt; padding-top: 12pt;">
      <h3 style="color: #0f172a;">Anotações de Avaliação de Outro Grupo (Entre Pares):</h3>
      <p><strong>Grupo observado:</strong> ${escapeHtml(formatValue(l8.peerReview.otherGroupName))}</p>
      <p><strong>Pontos fortes:</strong></p>
      ${formatHtmlParagraphs(l8.peerReview.strongPoints)}
      <p><strong>Sugestão ou pergunta inteligente:</strong></p>
      ${formatHtmlParagraphs(l8.peerReview.improvementOrQuestion)}
    </div>`
        : ''
    }

    ${
      l8.closingReflection?.relationshipWithAi
        ? `
    <div style="border-top: 2pt solid #e2e8f0; margin-top: 16pt; padding-top: 12pt;">
      <h3 style="color: #0f172a;">Balanço Individual de Encerramento (Comparado à Aula 4):</h3>
      <div style="display: flex; gap: 12pt; margin-top: 8pt;">
        <div style="flex: 1; border: 1pt solid #cbd5e1; border-radius: 4pt; padding: 8pt; background-color: #f8fafc;">
          <h4 style="margin: 0 0 6pt 0; color: #0284c7;">Meu Compromisso na Aula 4:</h4>
          <p><strong>Pensar antes:</strong> ${escapeHtml(formatValue(l4.thinkBeforeAi))}</p>
          <p><strong>Verificar:</strong> ${escapeHtml(formatValue(l4.verifyQuestionAi))}</p>
          <p><strong>Honestidade:</strong> ${escapeHtml(formatValue(l4.honestyResponsibility))}</p>
        </div>
        <div style="flex: 1; border: 1pt solid #cbd5e1; border-radius: 4pt; padding: 8pt; background-color: #f0fdf4;">
          <h4 style="margin: 0 0 6pt 0; color: #059669;">Minha Reflexão Final Agora:</h4>
          <p><strong>Relação com a IA:</strong> ${escapeHtml(formatValue(l8.closingReflection.relationshipWithAi))}</p>
          <p><strong>Pensamento próprio:</strong> ${escapeHtml(formatValue(l8.closingReflection.ownThinkingLearning))}</p>
          <p><strong>Regra mais importante:</strong> ${escapeHtml(formatValue(l8.closingReflection.mostImportantRule))}</p>
        </div>
      </div>
    </div>`
        : ''
    }
  `;
}

function formatLesson8Text(state: CadernoState): string {
  const l8 = state.lesson8;
  const l5 = state.lesson5;
  const l4 = state.lesson4;
  return (
    `=== AULA 8 — APRESENTAÇÃO DA POLÍTICA ===\n` +
    `Grupo: ${formatValue(l5.groupName)}\n\n` +
    `CHECKLIST PRÉ-APRESENTAÇÃO:\n` +
    `- Cronômetro configurado: ${l8.preChecklist?.timerReady ? 'Pronto' : 'Pendente'}\n` +
    `- Mapa mental visível: ${l8.preChecklist?.mapVisible ? 'Pronto' : 'Pendente'}\n` +
    `- Ordem das falas alinhada: ${l8.preChecklist?.membersReady ? 'Pronto' : 'Pendente'}\n` +
    `- Postura e foco na turma: ${l8.preChecklist?.postureAudience ? 'Pronto' : 'Pendente'}\n\n` +
    formatLesson7Text(state) +
    (l8.peerReview?.otherGroupName
      ? `\nAVALIAÇÃO DE OUTRO GRUPO:\n` +
        `Grupo observado: ${formatValue(l8.peerReview.otherGroupName)}\n` +
        `Pontos fortes: ${formatValue(l8.peerReview.strongPoints)}\n` +
        `Sugestão/Dúvida: ${formatValue(l8.peerReview.improvementOrQuestion)}\n\n`
      : '') +
    (l8.closingReflection?.relationshipWithAi
      ? `BALANÇO FINAL COMPARATIVO:\n` +
        `Compromisso Aula 4 (Pensar antes): ${formatValue(l4.thinkBeforeAi)}\n` +
        `Reflexão Final (Relação com a IA): ${formatValue(l8.closingReflection.relationshipWithAi)}\n` +
        `Reflexão Final (Pensamento próprio): ${formatValue(l8.closingReflection.ownThinkingLearning)}\n` +
        `Regra mais importante de defender: ${formatValue(l8.closingReflection.mostImportantRule)}\n`
      : '')
  );
}

// ---------------- PUBLIC EXPORT API ---------------- //

export function generateSingleLessonExport(
  lessonNum: number,
  state: CadernoState,
  imageBase64DataUrl?: string | null
): { html: string; text: string } {
  let innerHtml = '';
  let innerText = '';

  switch (lessonNum) {
    case 1:
      innerHtml = formatLesson1Html(state);
      innerText = formatLesson1Text(state);
      break;
    case 2:
      innerHtml = formatLesson2Html(state);
      innerText = formatLesson2Text(state);
      break;
    case 3:
      innerHtml = formatLesson3Html(state);
      innerText = formatLesson3Text(state);
      break;
    case 4:
      innerHtml = formatLesson4Html(state);
      innerText = formatLesson4Text(state);
      break;
    case 5:
      innerHtml = formatLesson5Html(state);
      innerText = formatLesson5Text(state);
      break;
    case 6:
      innerHtml = formatLesson6Html(state);
      innerText = formatLesson6Text(state);
      break;
    case 7:
      innerHtml = formatLesson7Html(state, imageBase64DataUrl);
      innerText = formatLesson7Text(state);
      break;
    case 8:
      innerHtml = formatLesson8Html(state, imageBase64DataUrl);
      innerText = formatLesson8Text(state);
      break;
    default:
      innerHtml = `<p>Aula não encontrada</p>`;
      innerText = `Aula não encontrada`;
  }

  const completeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(LESSON_TITLES[lessonNum] || 'Caderno de Metacognição')}</title>
      </head>
      <body style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #0f172a;">
        <div style="border-bottom: 2pt solid #0284c7; padding-bottom: 6pt; margin-bottom: 12pt;">
          <h1 style="color: #0284c7; font-size: 18pt; margin: 0;">Caderno de Metacognição — IA na Escola</h1>
          <p style="color: #64748b; font-size: 10pt; margin: 2pt 0 0 0;">
            Estudante / Perfil: <strong>${escapeHtml(state.nickname)}</strong> | Data de Exportação: ${new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
        ${innerHtml}
      </body>
    </html>
  `;

  return { html: completeHtml.trim(), text: innerText.trim() };
}

export function generatePartialDeliveryExport(state: CadernoState): { html: string; text: string } {
  return generateSingleLessonExport(4, state);
}

export function generateCompleteNotebookExport(
  state: CadernoState,
  imageBase64DataUrl?: string | null
): { html: string; text: string } {
  let combinedHtml = '';
  let combinedText = '';

  for (let i = 1; i <= 8; i++) {
    const single = generateSingleLessonExport(i, state, imageBase64DataUrl);
    combinedHtml += `<div style="page-break-after: always; margin-bottom: 24pt;">${single.html}</div><hr style="border: 0; border-top: 1pt solid #e2e8f0; margin: 20pt 0;" />`;
    combinedText += single.text + '\n\n--------------------------------------------------\n\n';
  }

  return { html: combinedHtml, text: combinedText };
}

export async function copyExportToClipboard(exportData: { html: string; text: string }): Promise<boolean> {
  try {
    if (navigator.clipboard && typeof window.ClipboardItem !== 'undefined') {
      const blobText = new Blob([exportData.text], { type: 'text/plain' });
      const blobHtml = new Blob([exportData.html], { type: 'text/html' });
      const item = new ClipboardItem({
        'text/plain': blobText,
        'text/html': blobHtml,
      });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch (err) {
    console.warn('ClipboardItem API falhou, tentando fallback text/plain:', err);
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(exportData.text);
      return true;
    }
  } catch (err) {
    console.error('Fallback clipboard writeText também falhou:', err);
  }

  return false;
}

export async function copyExportAndOpenDocs(exportData: { html: string; text: string }): Promise<boolean> {
  const copied = await copyExportToClipboard(exportData);
  try {
    window.open('https://docs.new', '_blank');
  } catch (err) {
    console.warn('Bloqueio de pop-up ao tentar abrir docs.new:', err);
  }
  return copied;
}
