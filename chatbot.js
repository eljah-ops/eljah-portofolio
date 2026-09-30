/* Public-content guide. The pure routing engine is also exported for Node tests. */
(function (root) {
  'use strict';
  const normalize = value => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+#]+/g, ' ').trim();
  const has = (value, phrase) => (` ${value} `).includes(` ${normalize(phrase)} `);
  const aliases = {
    cv: ['cv','resume','curriculum','curriculum vitae','download','telecharger'],
    contact: ['contact','contacter','joindre','email','mail','telephone','numero','linkedin','github','coordonnees','reach'],
    languages: ['langue','langues','anglais','francais','wolof','language','languages','english','french'],
    availability: ['stage','alternance','disponible','disponibilite','recruter','recrutement','embaucher','emploi','internship','apprenticeship','availability','available','hire','hiring'],
    skills: ['competence','competences','outil','outils','stack','technologie','technologies','technique','techniques','skill','skills','tool','tools','technology'],
    education: ['formation','formations','etude','etudes','ecole','diplome','estm','education','training','school'],
    certificates: ['certification','certifications','certificat','certificats','attestation','attestations','certificate','certificates','credly'],
    services: ['service','services','prestation','prestations','site vitrine','maintenance','depannage','propose','prendre en charge','offer'],
    location: ['distance','dakar','localisation','remote','teletravail','situe','habite','location','based'],
    timing: ['delai','delais','duree','semaine','semaines','temps','livraison','deadline','timeline','delivery'],
    process: ['methode','etapes','processus','deroulement','deroule','process','workflow'],
    pricing: ['tarif','tarifs','prix','cout','budget','devis','combien','facture','price','pricing','cost','quote'],
    hobbies: ['loisir','loisirs','passion','passions','interet','interets','anime','naruto','football','basket','gaming','hobby','hobbies','interest','interests'],
    projects: ['projet','projets','realisation','realisations','application','applications','project','projects','built','work'],
    profile: ['profil','presentation','presente','parcours','qui','about','who','background','experience']
  };
  const technologies = ['javascript','typescript','python','php','laravel','html','html5','css','css3','sql','mysql','postgresql','react','vue','angular','node','next','figma','git','linux','cisco','docker','java','c++','ui','ux','pdf js','github','supabase'];
  const referencesCurrentProject = query => /\b(ce projet|cet outil|cette application|this project|it|dessus)\b/.test(query) || /^(et |and )?(sa|son|ses|its)\b/.test(query);
  function resolve(question, previous, projects = []) {
    const query = normalize(question);
    const tech = technologies.filter(t => has(query,t));
    const named = projects.filter(p => p.aliases.some(alias => has(query,alias))).map(p => p.id);
    const subjects = Object.entries(aliases).map(([id, words]) => ({id, score: words.reduce((n,w)=>n+(has(query,w)?1:0),0)})).filter(t=>t.score).sort((a,b)=>b.score-a.score);
    if (named.length) return {ids:named.slice(0,2), tech};
    // A new explicit subject always wins over conversational context.
    if (subjects.length) {
      const ids=subjects.slice(0,2).map(s=>s.id);
      if (tech.length && ids.includes('projects')) return {ids:['projects'], tech};
      if (tech.length && previous?.ids.some(id=>id.startsWith('project-')) && ids[0]==='skills' && referencesCurrentProject(query)) return {ids:previous.ids,tech};
      return {ids,tech};
    }
    if (tech.length) return {ids: previous?.ids.some(id=>id.startsWith('project-')) && /^(et |and |avec |with |utilise|uses|does it)/.test(query) ? previous.ids : ['skills'],tech};
    if (/\b(age|salaire|salary|marie|naissance|birthday)\b/.test(query)) return {ids:[],tech};
    if (/^(bonjour|salut|hello|bonsoir|hi|merci|thanks|thank you)\b/.test(query)) return {ids:['greeting'],tech};
    if (/^(et ensuite|et plus|plus|details|detail|en savoir plus|continue|tell me more|more|and more|explique|explain)( |$)/.test(query) && previous) return {...previous, followup:true};
    if (/\b(role|contribution|lien|demo|link|statut|status)\b/.test(query) && previous?.ids.some(id=>id.startsWith('project-'))) return {...previous,followup:true};
    return {ids:[],tech};
  }
  function facetOf(q){const n=normalize(q);if(/\b(role|contribution)\b/.test(n))return 'role';if(/\b(lien|link|demo)\b/.test(n))return 'link';if(/\b(statut|status|termine|finished)\b/.test(n))return 'status';if(/\b(stack|technologies|technologie|technology)\b/.test(n))return 'tech';return null;}
  function route(question,previous,projects=[]){const result=resolve(question,previous,projects);const facet=facetOf(question);const query=normalize(question);delete result.facet;if(facet==='tech'&&result.ids[0]==='skills'&&previous?.ids.some(id=>id.startsWith('project-'))&&referencesCurrentProject(query))result.ids=previous.ids;if(result.followup)result.tech=[];if(facet&&result.ids.some(id=>id.startsWith('project-')))result.facet=facet;return result;}
  function supports(tags,technology){const canonical=v=>normalize(v).replace(/\bhtml5\b/g,'html').replace(/\bcss3\b/g,'css');const t=canonical(technology);return tags.some(tag=>canonical(tag)===t || (['ui','ux'].includes(t)&&canonical(tag).split(' ').includes(t)));}
  const engine = {normalize,route,supports};
  if (typeof module !== 'undefined' && module.exports) module.exports=engine;
  if (!root.document) return;
  const $=(s,r=document)=>r.querySelector(s), all=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=el=>el?.textContent.trim().replace(/\s+/g,' ') || '';
  const english=()=>document.documentElement.lang==='en';
  const tr=(fr,en)=>english()?en:fr;
  const icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7Z"/></svg>';
  const labels={profile:['Faire connaissance','Meet Elijah'],projects:['Voir les projets','Explore projects'],skills:['Compétences & outils','Skills & tools'],availability:['Stage & collaboration','Internship & collaboration'],cv:['Consulter le CV','Read the résumé'],contact:['Entrer en contact','Get in touch'],education:['Formation','Education'],certificates:['Certifications','Certificates'],languages:['Langues & niveaux','Languages & proficiency'],services:['Services proposés','Services'],location:['À distance ou à Dakar','Remote or in Dakar'],timing:['Délais','Timelines'],process:['Méthode de travail','Working process'],pricing:['Budget & devis','Budget & quotes'],hobbies:['En dehors du code','Beyond coding']};
  const questions={profile:['Qui est Elijah ?','Who is Elijah?'],projects:['Quels projets a-t-il réalisés ?','What projects has he built?'],skills:['Quelles sont ses compétences ?','What are his skills?'],availability:['Recherche-t-il un stage ?','Is he looking for an internship?']};
  const label=id=>labels[id]?tr(...labels[id]):projectData().find(p=>p.id===id)?.title || id;
  function projectData(){return all('.proj-card').map((el,i)=>{
    const title=text($('h3',el)), slug=normalize(title).replace(/ /g,'-');
    if(!el.id)el.id='portfolio-project-'+slug;
    return {id:'project-'+i,title,aliases:[normalize(title),...(i===1?['votenow','vote isi']:[])],description:text($('p:not(.project-role)',el)),role:text($('.project-role',el)),tags:all('.proj-tags span',el).map(text),status:text($('.proj-badge',el)),source:'#'+el.id,url:$('.project-link',el)?.getAttribute('href')};
  });}
  function knowledge(id, tech=[], options={}){
    const source=(href,title)=>({href,title:title||tr('Voir la source','View source')});
    const cv=$('a[href*="cv.pdf/"]')?.getAttribute('href');
    const email=$('#contact a[href^="mailto:"]');
    const contactAction=source(email?.getAttribute('href')||'#contact',tr('Contacter Elijah','Contact Elijah'));
    const cvAction=cv?source(cv,tr('Ouvrir le CV','Open résumé')):source('#contact',tr('Demander le CV','Request résumé'));
    const base={title:label(id),paragraphs:[],actions:[]};
    const projects=projectData();
    const p=projects.find(p=>p.id===id);
    if(p){
      base.title=p.title;
      base.paragraphs=[p.description,p.role,`${tr('Technologies publiées','Listed technologies')} : ${p.tags.join(', ')}. ${tr('Statut','Status')} : ${p.status}.`];
      if(tech.length){const missing=tech.filter(t=>!supports(p.tags,t));
        if(missing.length)base.paragraphs.unshift(tr(`Le portfolio ne confirme pas l’utilisation de ${missing.join(', ')} sur ${p.title}.`, `The portfolio does not confirm the use of ${missing.join(', ')} in ${p.title}.`));}
      if(options.facet==='role')base.paragraphs=[p.role||tr('Le rôle précis n’est pas publié.','The specific role is not published.')];
      else if(options.facet==='status')base.paragraphs=[tr('Statut publié : ','Published status: ')+p.status];
      else if(options.facet==='link')base.paragraphs=[p.url?tr('Voici le lien publié pour ce projet.','Here is the published link for this project.'):tr('Aucune démonstration publique n’est liée à ce projet.','No public demo is linked to this project.')];
      else if(options.facet==='tech')base.paragraphs=base.paragraphs.filter(v=>v.includes(tr('Technologies publiées','Listed technologies'))||v.includes(tr('ne confirme pas','does not confirm')));
      else if(options.followup&&!tech.length)base.paragraphs=[tr('Les détails techniques supplémentaires ne sont pas publiés. Voici la contribution indiquée : ','Further technical details are not published. The listed contribution is: ')+p.role];
      base.actions=[...(p.url?[source(p.url,tr('Voir le projet','Open project'))]:[]),source(p.source,tr('Voir la fiche projet','View project details'))];return base;
    }
    if(options.followup){base.paragraphs=[tr('Je n’ai pas de précisions supplémentaires publiées sur ce sujet. Vous pouvez consulter la rubrique correspondante ou demander à Elijah.','There are no further published details on this topic. You can review the relevant section or ask Elijah.')];base.actions=[source(({profile:'#profil',projects:'#projets',skills:'#savoir-faire',education:'#profil',certificates:'#certifications',languages:'#langues',hobbies:'#offscreen-title'})[id]||'#contact'),contactAction];return base;}
    const faqIds=['services','location','timing','process','pricing'];
    if(faqIds.includes(id)){const el=all('.faq-item')[faqIds.indexOf(id)];if(el){if(!el.id)el.id='portfolio-faq-'+id;base.paragraphs=[text($('p',el))];base.actions=[source('#'+el.id),contactAction];}return base;}
    switch(id){
      case 'profile':base.paragraphs=all('#profil p[data-i18n]').slice(0,2).map(text);base.actions=[source('#profil'),cvAction];break;
      case 'skills':{
        const tags=all('.sf-hard-tags > *').map(text);
        const missing=tech.filter(t=>!tags.some(tag=>normalize(tag).split(' ').includes(t)));
        base.paragraphs=[tags.join(' · '),tr('Savoir-être : ','People skills: ')+all('.sf-soft-tags > *').map(text).join(', ')];
        if(missing.length)base.paragraphs.unshift(tr(`Aucun niveau de maîtrise de ${missing.join(', ')} n’est précisé dans le portfolio.`, `The portfolio does not specify a proficiency level in ${missing.join(', ')}.`));
        base.actions=[source('#savoir-faire'),source('#projets',tr('Voir les projets associés','Explore project evidence'))];break;}
      case 'projects':{
        const matched=tech.length?projects.filter(p=>tech.every(t=>supports(p.tags,t))):projects;
        base.paragraphs=matched.slice(0,3).map(p=>`${p.title} — ${p.description} (${p.tags.join(', ')})`);
        if(!matched.length)base.paragraphs=[tr(`Aucun projet publié ne mentionne ${tech.join(', ')} dans ses technologies. Cela ne permet pas de conclure à son niveau de maîtrise.`,`No published project lists ${tech.join(', ')} among its technologies. This does not establish his proficiency level.`)];
        base.actions=matched.slice(0,3).map(p=>source(p.url||p.source,p.title));base.actions.push(source('#projets',tr('Tous les projets','All projects')));break;}
      case 'availability':base.paragraphs=[text($('#contact [data-i18n="contact.lede"]')),tr('Date de début et durée à confirmer directement avec Elijah.','Confirm the start date and duration directly with Elijah.')];base.actions=[contactAction,cvAction];break;
      case 'cv':base.paragraphs=[tr('Consultez le CV pour retrouver son parcours et ses compétences.','Read the résumé for his background and skills.')];base.actions=[cvAction,contactAction];break;
      case 'contact':base.paragraphs=[text(email),text($('#contact a[href^="tel:"]')),text($('#contact [data-i18n="contact.city"]'))];base.actions=[contactAction,source('#contact',tr('Toutes les coordonnées','All contact details'))];break;
      case 'education':base.paragraphs=[text($('#profil [data-i18n="profile.p1"]'))];base.actions=[source('#profil'),source('#certifications',tr('Voir les certifications','View certificates'))];break;
      case 'certificates':base.paragraphs=all('.cert-row').slice(0,4).map(el=>['.name','.issuer','.year'].map(s=>text($(s,el))).filter(Boolean).join(' — '));base.actions=[source('#certifications',tr('Toutes les certifications','All certificates'))];break;
      case 'languages':base.paragraphs=all('.lang-row').map(el=>text($('.name',el))+' — '+text($('.lvl',el)));base.actions=[source('#langues')];break;
      case 'hobbies':base.paragraphs=all('[data-i18n^="life."][data-i18n$=".text"]').map(text).slice(0,3);base.actions=[source('#offscreen-title')];break;
      default:base.title=tr('Bienvenue','Welcome');base.paragraphs=[tr('Je vous aide à explorer le portfolio : projets, compétences, parcours et collaboration. Choisissez un sujet ou posez votre question.','I can help you explore the portfolio: projects, skills, background and collaboration. Choose a topic or ask a question.')];
    }return base;
  }
  const dialog=document.createElement('dialog');dialog.id='portfolio-chat';dialog.setAttribute('aria-labelledby','chat-title');document.body.append(dialog);
  const launcher=document.createElement('button');launcher.type='button';launcher.className='chat-launcher';launcher.setAttribute('aria-haspopup','dialog');launcher.setAttribute('aria-controls',dialog.id);document.body.append(launcher);
  const heroButton=document.createElement('button');heroButton.type='button';heroButton.className='chat-hero-open';$('.hero-actions')?.append(heroButton);
  let history=[],previous=null,opener=null;
  function open(){opener=document.activeElement;if(!dialog.open)dialog.showModal();document.body.classList.add('chat-is-open');if(innerWidth>700)$('#chat-input',dialog).focus();}
  launcher.onclick=heroButton.onclick=open;
  dialog.addEventListener('close',()=>{document.body.classList.remove('chat-is-open');opener?.focus({preventScroll:true});opener=null;});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();}});
  function navigate(event,href){if(!href.startsWith('#'))return;const target=document.getElementById(href.slice(1));if(!target)return;event.preventDefault();opener=null;dialog.close();if(target.classList.contains('proj-card'))document.dispatchEvent(new CustomEvent('portfolio-show-project',{detail:{id:target.id}}));let el=target;while(el){if(el.tagName==='DETAILS')el.open=true;el=el.parentElement;}target.classList.add('is-visible');target.closest('.reveal')?.classList.add('is-visible');target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});target.setAttribute('tabindex','-1');target.focus({preventScroll:true});historyReplace(href);}
  function historyReplace(href){try{root.history.replaceState(null,'',href);}catch{/* file preview still supports navigation */}}
  function makeTopic(id,target){const b=document.createElement('button');b.type='button';b.textContent=label(id);b.onclick=()=>ask(questions[id]?tr(...questions[id]):label(id),id);target.append(b);}
  function renderReply(item){const reply=document.createElement('article');reply.className='chat-message assistant';const who=document.createElement('div');who.className='chat-message-label';who.textContent=tr('Le guide d’Elijah','Elijah’s guide');reply.append(who);
    const results=item.result.ids.length?item.result.ids.map(id=>knowledge(id,item.result.tech,item.result)):[{title:tr('Une précision nécessaire','More information needed'),paragraphs:[tr('Cette information n’est pas précisée dans le portfolio. Elijah pourra vous répondre directement. Vous pouvez aussi explorer les sujets proposés.','This information is not specified in the portfolio. Elijah can answer you directly, or you can explore the suggested topics.')],actions:[{href:$('#contact a[href^="mailto:"]')?.getAttribute('href')||'#contact',title:tr('Contacter Elijah','Contact Elijah')}]}];
    results.forEach(result=>{const h=document.createElement('h3');h.textContent=result.title;reply.append(h);result.paragraphs.filter(Boolean).forEach(value=>{const p=document.createElement('p');p.textContent=value;reply.append(p);});result.actions.forEach(action=>{const a=document.createElement('a');a.className='chat-source';a.textContent=action.title+' ↗';a.href=action.href;if(action.href.startsWith('#'))a.onclick=e=>navigate(e,action.href);else if(!action.href.startsWith('mailto:')){a.target='_blank';a.rel='noopener';}reply.append(a);});});
    const copy=document.createElement('button');copy.type='button';copy.className='chat-copy';copy.textContent=tr('Copier la réponse','Copy answer');copy.onclick=async()=>{try{await navigator.clipboard.writeText(results.map(r=>r.title+'\n'+r.paragraphs.join('\n')).join('\n\n'));copy.textContent=tr('Copié ✓','Copied ✓');}catch{copy.textContent=tr('Copie indisponible','Copy unavailable');}};reply.append(copy);return reply;
  }
  function renderConversation(){const log=$('.chat-messages',dialog);log.replaceChildren();$('.chat-welcome',dialog).hidden=history.length>0;history.forEach(item=>{const el=document.createElement('article');el.className='chat-message user';const label=document.createElement('div');label.className='chat-message-label';label.textContent=tr('Vous','You');const p=document.createElement('p');p.textContent=item.selected?labelForQuestion(item.selected):item.question;el.append(label,p);log.append(el,renderReply(item));});const follow=$('.chat-followups',dialog);follow.replaceChildren();if(history.length){const ids=previous?.ids||[];const next=ids.includes('skills')?['projects','cv','contact']:ids.some(id=>id.startsWith('project-'))||ids.includes('projects')?['skills','cv','contact']:ids.includes('availability')?['cv','projects','contact']:['projects','skills','contact'];next.filter(id=>!ids.includes(id)).forEach(id=>makeTopic(id,follow));}all('.chat-topics button',dialog).forEach(b=>b.classList.toggle('selected',previous?.ids.includes(b.dataset.topic)));}
  function labelForQuestion(id){return questions[id]?tr(...questions[id]):label(id);}
  function ask(question,selected){const q=question.trim();if(!q)return;const result=selected?{ids:[selected],tech:[]}:route(q,previous,projectData());history.push({question:q,selected,result});previous=result.ids.length&&result.ids[0]!=='greeting'?result:null;const input=$('#chat-input',dialog);input.value='';input.oninput();$('.chat-sidebar',dialog).classList.remove('is-open');$('.chat-topics-toggle',dialog).setAttribute('aria-expanded','false');renderConversation();$('.chat-messages',dialog).lastElementChild?.scrollIntoView({block:'start',behavior:'instant'});input.focus();}
  function render(){
    launcher.innerHTML=icon+`<span>${tr('Une question ?','Have a question?')}<small>${tr('Explorer mon profil','Explore my profile')}</small></span><span aria-hidden="true">↗</span>`;
    heroButton.innerHTML=icon+' '+tr('Explorer avec mon guide','Explore with my guide');
    dialog.innerHTML=`<div class="chat-shell"><aside class="chat-sidebar" id="chat-sidebar"><a class="chat-brand" href="#accueil">elijah<span>.</span><small>${tr('LE PORTFOLIO, EN CONVERSATION','THE PORTFOLIO, IN CONVERSATION')}</small></a><button class="chat-new" type="button"><span>＋</span>${tr('Nouvelle conversation','New conversation')}</button><p class="chat-section-label">${tr('EXPLORER','EXPLORE')}</p><nav class="chat-topics" id="chat-topic-nav" aria-label="${tr('Sujets de conversation','Conversation topics')}"></nav><div class="chat-sidebar-bottom"><span class="chat-monogram">ED</span><div><strong>Elijah Ismael Diallo</strong><small>${tr('Développement web & réseaux','Web development & networks')}</small></div></div></aside><div class="chat-main"><header class="chat-header"><div><strong id="chat-title">${tr('Le guide d’Elijah','Elijah’s guide')}</strong><span class="chat-mode">${tr('À partir du portfolio','Based on the portfolio')}</span></div><div class="chat-header-actions"><button class="chat-topics-toggle" aria-expanded="false" aria-controls="chat-sidebar" type="button">${tr('Sujets','Topics')}</button><button class="chat-close" type="button" aria-label="${tr('Fermer le guide','Close guide')}">✕</button></div></header><div class="chat-scroll"><div class="chat-welcome"><span class="chat-spark">${icon}</span><p class="chat-eyebrow">${tr('MON PARCOURS, VOS QUESTIONS','MY BACKGROUND, YOUR QUESTIONS')}</p><h2>${tr('Faisons connaissance.<br><em>Par où commencer ?</em>','Let’s get acquainted.<br><em>Where shall we start?</em>')}</h2><p class="chat-intro">${tr('Projets, compétences ou collaboration :<br>retrouvez l’essentiel et les liens pour aller plus loin.','Projects, skills or collaboration:<br>find the essentials and links to explore further.')}</p><div class="chat-suggestions"></div></div><div class="chat-messages" role="log" aria-live="polite" aria-label="${tr('Conversation','Conversation')}"></div></div><div class="chat-compose-area"><div class="chat-followups"></div><form class="chat-composer"><label class="sr-only" for="chat-input">${tr('Votre question sur Elijah','Your question about Elijah')}</label><textarea id="chat-input" rows="1" maxlength="1200" placeholder="${tr('Un projet, une compétence, une question…','A project, a skill, a question…')}"></textarea><div class="chat-compose-bottom"><span>${icon}${tr('Réponses issues du portfolio','Answers from the portfolio')}</span><button class="chat-send" type="submit" aria-label="${tr('Envoyer la question','Send question')}" disabled>↑</button></div></form><p class="chat-disclaimer">${tr('Guide local · Réponses prédéfinies · Vos messages restent dans ce navigateur','Local guide · Predefined answers · Your messages stay in this browser')}</p></div></div></div>`;
    Object.keys(labels).forEach(id=>{makeTopic(id,$('.chat-topics',dialog));$('.chat-topics',dialog).lastChild.dataset.topic=id;});
    projectData().forEach(p=>{makeTopic(p.id,$('.chat-topics',dialog));$('.chat-topics',dialog).lastChild.dataset.topic=p.id;});
    ['profile','projects','skills','availability'].forEach((id,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=`<span class="suggestion-icon">${['◉','▤','⌘','↗'][i]}</span><strong>${label(id)}</strong><span class="suggestion-question">${labelForQuestion(id)}</span><span class="suggestion-arrow">↗</span>`;b.onclick=()=>ask(labelForQuestion(id),id);$('.chat-suggestions',dialog).append(b);});
    $('.chat-brand',dialog).onclick=()=>dialog.close();$('.chat-close',dialog).onclick=()=>dialog.close();
    $('.chat-topics-toggle',dialog).onclick=e=>{const open=$('.chat-sidebar',dialog).classList.toggle('is-open');e.currentTarget.setAttribute('aria-expanded',String(open));};
    const input=$('#chat-input',dialog);input.oninput=()=>{$('.chat-send',dialog).disabled=!input.value.trim();input.style.height='auto';input.style.height=Math.min(input.scrollHeight,130)+'px';};
    input.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('.chat-composer',dialog).requestSubmit();}};
    $('.chat-composer',dialog).onsubmit=e=>{e.preventDefault();ask(input.value);};
    $('.chat-new',dialog).onclick=()=>{history=[];previous=null;renderConversation();input.value='';input.oninput();$('.chat-sidebar',dialog).classList.remove('is-open');$('.chat-topics-toggle',dialog).setAttribute('aria-expanded','false');input.focus();};renderConversation();
  }
  render();document.addEventListener('portfolio-language',render);
  if(new URLSearchParams(location.search).get('assistant')==='1')open();
})(typeof window!=='undefined'?window:globalThis);
