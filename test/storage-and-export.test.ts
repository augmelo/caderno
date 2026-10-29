import assert from 'node:assert';
import {
  CURRENT_SCHEMA_VERSION,
  createEmptyCaderno,
  DEFAULT_RADAR_COGNITVO_URL,
  FIXED_PRINCIPLE_TEXT,
} from '../src/types/caderno';
import {
  validateBackupJson,
} from '../src/utils/storage';
import {
  escapeHtml,
  formatValue,
  generateSingleLessonExport,
  generatePartialDeliveryExport,
  generateCompleteNotebookExport,
} from '../src/utils/clipboardExport';

console.log('--- INICIANDO TESTES AUTOMATIZADOS DO CADERNO DE METACOGNIÇÃO (SCHEMA V3) ---');

// 1. Teste de Estado Padrão e Schema Version 3
{
  const state = createEmptyCaderno('test_prof_1', 'Maria Clara 2A');
  assert.strictEqual(state.schemaVersion, CURRENT_SCHEMA_VERSION, 'Versão do esquema deve ser 3');
  assert.strictEqual(state.nickname, 'Maria Clara 2A', 'Nickname deve ser Maria Clara 2A');
  assert.strictEqual(state.adminGameUrl, DEFAULT_RADAR_COGNITVO_URL, 'URL do jogo deve ser a padrão');
  assert.strictEqual(state.lesson6.field1_principle, FIXED_PRINCIPLE_TEXT, 'Princípio fixo da V1 deve estar correto');
  assert.strictEqual(state.lesson7.finalPolicy.field1_principle, FIXED_PRINCIPLE_TEXT, 'Princípio fixo final deve estar correto');
  assert.strictEqual(state.lesson5.members.length, 1, 'Aula 5 deve iniciar com ao menos 1 integrante');
  assert.strictEqual(state.lesson7.imageMeta, null, 'Aula 7 deve iniciar sem imagem');
  console.log('✓ Teste 1: Estado padrão e schemaVersion 3 criados com sucesso.');
}

// 2. Teste de Validação de Backup JSON
{
  const state = createEmptyCaderno('test_prof_2', 'Grupo Alpha');
  state.lesson3.q1_who = 'Estudantes e professores da escola';
  state.lesson4.signature = 'Maria Silva';
  state.lesson5.groupName = 'Alpha Ético';
  state.lesson5.canHelpLearn = 'Tirar dúvidas de gramática';
  state.lesson6.field2_schoolName = 'E.E. Professora Maria';

  const validJson = JSON.stringify(state, null, 2);
  const result = validateBackupJson(validJson);
  assert.strictEqual(result.valid, true, 'JSON válido deve passar na validação');
  assert.strictEqual(result.data?.nickname, 'Grupo Alpha', 'Dados recuperados devem ter o mesmo nickname');
  assert.strictEqual(result.data?.lesson3.q1_who, 'Estudantes e professores da escola');
  assert.strictEqual(result.data?.lesson5.groupName, 'Alpha Ético');

  // Teste de JSON malformado
  const invalidJson1 = '{"incompleto": true';
  const resInvalid1 = validateBackupJson(invalidJson1);
  assert.strictEqual(resInvalid1.valid, false, 'JSON malformado deve ser rejeitado');

  // Teste de backup com anexo corrompido
  const invalidJsonAttachment = JSON.stringify({
    ...state,
    attachmentBackup: { name: 'foto.png', type: 'image/png', size: 999999999, base64Data: '...' },
  });
  const resInvalidAtt = validateBackupJson(invalidJsonAttachment);
  assert.strictEqual(resInvalidAtt.valid, false, 'Anexo maior que 5 MB deve ser rejeitado');
  console.log('✓ Teste 2: Validação de backup JSON (válido e corrompido) aprovada.');
}

// 3. Teste de Escape de HTML e Sanitização de Entradas
{
  const maliciousInput = '<script>alert("hack")</script> & <b>negrito</b>';
  const escaped = escapeHtml(maliciousInput);
  assert.ok(!escaped.includes('<script>'), 'Tag script deve ser escapada');
  assert.ok(escaped.includes('&lt;script&gt;'), 'Deve converter < para &lt;');
  assert.ok(escaped.includes('&amp;'), 'Deve converter & para &amp;');
  console.log('✓ Teste 3: Sanitização de HTML com escape correto.');
}

// 4. Teste de Fallback "Não preenchido"
{
  assert.strictEqual(formatValue(''), 'Não preenchido', 'String vazia vira Não preenchido');
  assert.strictEqual(formatValue('   '), 'Não preenchido', 'String de espaços vira Não preenchido');
  assert.strictEqual(formatValue(null), 'Não preenchido', 'Null vira Não preenchido');
  assert.strictEqual(formatValue('Minha resposta'), 'Minha resposta', 'Texto válido é preservado');
  console.log('✓ Teste 4: Fallback "Não preenchido" consistente.');
}

// 5. Teste de Exportação da Aula 1 e Aula 2
{
  const state = createEmptyCaderno('test_prof_l1_l2', 'Lucas');
  state.lesson2.curiosity.notObserved = true;
  state.lesson2.flattery.excerpt = 'Excelente pergunta, você pensa rápido!';

  const expL1 = generateSingleLessonExport(1, state);
  assert.ok(expL1.html.includes('Radar Cognitivo'), 'Aula 1 HTML deve citar o jogo');
  assert.ok(expL1.text.includes('Radar Cognitivo'), 'Aula 1 Texto deve citar o jogo');

  const expL2 = generateSingleLessonExport(2, state);
  assert.ok(expL2.html.includes('[ Não observado ]'), 'Aula 2 HTML deve indicar Não observado');
  assert.ok(expL2.html.includes('Excelente pergunta'), 'Aula 2 HTML deve conter o trecho observado');
  console.log('✓ Teste 5: Exportação das Aulas 1 e 2 validada.');
}

// 6. Teste de Exportação da Aula 3 e Aula 4 (Entrega Parcial)
{
  const state = createEmptyCaderno('test_prof_l3_l4', 'Ana Paula');
  state.lesson3.q1_who = 'Toda a comunidade escolar';
  state.lesson3.q5_how = 'Fiscalização com declaração de uso';

  state.lesson4.thinkBeforeAi = 'Escrever o rascunho inicial por 15 min';
  state.lesson4.verifyQuestionAi = 'Checar fontes no livro';
  state.lesson4.honestyResponsibility = 'Assumir a autoria';
  state.lesson4.signature = 'Ana Paula Souza';
  state.lesson4.date = '27/10/2026';

  const expL3 = generateSingleLessonExport(3, state);
  assert.ok(expL3.html.includes('Toda a comunidade escolar'), 'Aula 3 deve conter Q1');
  assert.ok(expL3.html.includes('Fiscalização com declaração'), 'Aula 3 deve conter Q5');

  const expL4 = generatePartialDeliveryExport(state);
  assert.ok(expL4.html.includes('MEU COMPROMISSO'), 'Aula 4 deve conter MEU COMPROMISSO');
  assert.ok(expL4.html.includes('Ana Paula Souza'), 'Aula 4 deve conter a assinatura');
  assert.ok(expL4.html.includes('Escrever o rascunho inicial'), 'Aula 4 deve conter o compromisso 1');
  console.log('✓ Teste 6: Exportação das Aulas 3 e 4 (Entrega Parcial) validada.');
}

// 7. Teste de Exportação das Aulas 5, 6, 7 e 8 (com imagem e cenários)
{
  const state = createEmptyCaderno('test_prof_l5_l8', 'Equipe Futuro');
  state.lesson5.groupName = 'Equipe Futuro';
  state.lesson5.canHelpLearn = 'Explicar tópicos difíceis com exemplos';
  state.lesson5.cannotReplaceLearn = 'A autoria autêntica e o raciocínio próprio';

  state.lesson6.field2_schoolName = 'Escola Estadual Central';
  state.lesson6.scenarios.scenario1 = {
    action: 'Proibida',
    analysis: 'Não é permitido colar resumo sem ler o texto original.',
  };
  state.lesson6.loopholeAgreement = 'Ajustamos a regra para o laboratório.';

  state.lesson7.finalPolicy.field2_target = 'Estudantes e professores da EE Central';
  state.lesson7.topicsText = 'Nó Central -> Regras de Sala -> Regras de Casa';
  state.lesson7.rehearsal = [
    { memberId: 'm1', memberName: 'Lucas', branchAssigned: 'Princípio Geral', estimatedTime: '45s' },
  ];

  state.lesson8.peerReview = {
    otherGroupName: 'Grupo Conexão',
    strongPoints: 'Regras bem detalhadas para provas',
    improvementOrQuestion: 'Como vão fiscalizar no celular?',
  };
  state.lesson8.closingReflection = {
    relationshipWithAi: 'Agora uso com mais foco e menos dependência.',
    ownThinkingLearning: 'Pensar primeiro me dá mais segurança.',
    mostImportantRule: 'Nunca entregar texto sem compreender.',
  };

  const dummyDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

  const expL5 = generateSingleLessonExport(5, state);
  assert.ok(expL5.html.includes('Equipe Futuro'), 'Aula 5 deve conter o nome do grupo');
  assert.ok(expL5.html.includes('Explicar tópicos difíceis'), 'Aula 5 deve conter Q1');

  const expL6 = generateSingleLessonExport(6, state);
  assert.ok(expL6.html.includes('Escola Estadual Central'), 'Aula 6 deve conter a escola');
  assert.ok(expL6.html.includes('Cenário 1 (Ciências'), 'Aula 6 deve conter Cenário 1');
  assert.ok(expL6.html.includes('Proibida'), 'Aula 6 deve conter ação do Cenário 1');

  const expL7 = generateSingleLessonExport(7, state, dummyDataUrl);
  assert.ok(expL7.html.includes('<img src="data:image/png;base64,'), 'Aula 7 deve conter imagem embutida');
  assert.ok(expL7.html.includes('Nó Central -&gt; Regras de Sala'), 'Aula 7 deve conter tópicos');
  assert.ok(expL7.html.includes('Lucas'), 'Aula 7 deve conter ensaio');

  const expL8 = generateSingleLessonExport(8, state, dummyDataUrl);
  assert.ok(expL8.html.includes('Grupo Conexão'), 'Aula 8 deve conter avaliação entre pares');
  assert.ok(expL8.html.includes('Agora uso com mais foco'), 'Aula 8 deve conter reflexão de encerramento');

  const completeExp = generateCompleteNotebookExport(state, dummyDataUrl);
  assert.ok(completeExp.html.includes('Aula 1'), 'Caderno completo deve conter Aula 1');
  assert.ok(completeExp.html.includes('Aula 8'), 'Caderno completo deve conter Aula 8');
  console.log('✓ Teste 7: Exportação das Aulas 5 a 8 e Caderno Completo validada com sucesso.');
}

console.log('==================================================');
console.log('Todos os testes automatizados passaram com sucesso!');
console.log('==================================================');
