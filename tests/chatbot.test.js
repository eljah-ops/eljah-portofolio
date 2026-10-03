'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {route,normalize}=require('../chatbot.js');
const projects=[
  {id:'project-0',aliases:['sama cv']},
  {id:'project-1',aliases:['votenow isi','votenow','vote isi']},
  {id:'project-2',aliases:['al hidaya gestion','al hidaya','alhidaya']}
];
const match=(q,previous)=>route(q,previous,projects);
test('short words: CV is actionable, UI/UX are recognised technologies',()=>{
  assert.deepEqual(match('CV ?').ids,['cv']);
  assert.deepEqual(match('UI / UX').tech,['ui','ux']);
});
test('accents, punctuation and plural alternatives route consistently',()=>{
  assert.deepEqual(match('Quelles compétences ?').ids,['skills']);
  assert.deepEqual(match('Une compétence ?').ids,['skills']);
  assert.deepEqual(match('Certificats et attestations').ids,['certificates']);
  assert.equal(normalize('Télécharger !'),'telecharger');
});
test('specific projects take precedence over broad words including CV',()=>{
  assert.deepEqual(match('Parle-moi de Sama CV').ids,['project-0']);
  assert.deepEqual(match('VoteNow utilise React ?'),{ids:['project-1'],tech:['react']});
});
test('explicit new subject supersedes previous topic',()=>{
  const previous=match('Sama CV');
  assert.deepEqual(match('Et ses compétences ?',previous).ids,['skills']);
  assert.deepEqual(match('Et son CV ?',previous).ids,['cv']);
  assert.deepEqual(match('And availability?',previous).ids,['availability']);
});
test('followups retain project while unsupported technology remains explicit',()=>{
  const previous=match('VoteNow');
  assert.equal(match('En savoir plus',previous).followup,true);
  assert.deepEqual(match('Et avec React ?',previous),{ids:['project-1'],tech:['react']});
  assert.deepEqual(match('Son rôle ?',previous).ids,['project-1']);
});
test('technology-filtered project query does not silently become generic skills',()=>{
  assert.deepEqual(match('Quels projets utilisent Python ?'),{ids:['projects'],tech:['python']});
  assert.deepEqual(match('Quels projets utilisent Django et Render ?'),{ids:['projects'],tech:['django','render']});
});

test('the live Al Hidaya project is recognised by its common names',()=>{
  assert.deepEqual(match('Parle-moi de Al Hidaya').ids,['project-2']);
  assert.deepEqual(match('Alhidaya utilise Django ?'),{ids:['project-2'],tech:['django']});
});
test('French and English topics, unknowns and salutations',()=>{
  for(const q of ['Quelles langues ?','English level?'])assert.equal(match(q).ids[0],'languages');
  assert.equal(match('How much does it cost?').ids[0],'pricing');
  assert.deepEqual(match('Quel est son plat préféré ?').ids,[]);
  assert.deepEqual(match('Plus de détails').ids,[]);
  assert.deepEqual(match('Bonjour').ids,['greeting']);
});
test('project facets support natural followups without sticky facets',()=>{
  const previous=match('VoteNow');
  const role=match('Et son rôle dessus ?',previous);
  assert.equal(role.facet,'role');
  assert.deepEqual(role.ids,['project-1']);
  assert.equal(match('Et le lien ?',previous).facet,'link');
  assert.equal(match('Son statut ?',previous).facet,'status');
  assert.equal(match('Plus de détails',role).facet,undefined);
});
test('technology canonicalisation matches published aliases only',()=>{
  const {supports}=require('../chatbot.js');
  assert.equal(supports(['UI/UX'],'ui'),true);
  assert.equal(supports(['UI/UX'],'ux'),true);
  assert.equal(supports(['HTML'],'html5'),true);
  assert.equal(supports(['CSS3'],'css'),true);
  assert.equal(supports(['PDF.js'],'pdf js'),true);
  assert.equal(supports(['JavaScript'],'java'),false);
  assert.equal(supports(['HTML5','JavaScript'],'react'),false);
});
test('technology levels and missing infrastructure never become language answers',()=>{
  assert.deepEqual(match('Niveau Laravel ?').ids,['skills']);
  assert.deepEqual(match('Sama CV utilise Supabase ?').tech,['supabase']);
  assert.deepEqual(match('Sama CV utilise PDF.js ?').tech,['pdf js']);
  assert.deepEqual(match('Est-il disponible en octobre ?').ids,['availability']);
});
test('project stack followup differs from broad skills subject change',()=>{
  const previous=match('VoteNow');
  assert.equal(match('Et sa stack ?',previous).facet,'tech');
  assert.deepEqual(match('Et sa stack ?',previous).ids,['project-1']);
  assert.deepEqual(match('Et ses compétences ?',previous).ids,['skills']);
  assert.deepEqual(match('Quelles technologies maîtrise Elijah ?',previous).ids,['skills']);
  assert.deepEqual(match('What technologies does Elijah know?',previous).ids,['skills']);
});
