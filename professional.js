/* Editorial content enhancements share the existing language event. No dependencies. */
(() => {
  const $ = selector => document.querySelector(selector);
  const projects = $('#projets');
  document.querySelector('.tech-marquee').after(projects);
  const mainProject = $('#project-sama-cv');
  mainProject.parentElement.prepend(mainProject);
  const identity = document.createElement('p');
  identity.className = 'hero-identity';
  identity.textContent = 'ELIJAH ISMAEL DIALLO';
  $('.hero-role').before(identity);
  const contact = document.createElement('a');
  contact.href = '#contact'; contact.className = 'hero-contact';
  $('.hero-actions').append(contact);
  document.querySelectorAll('a[href*="cv.pdf/"]').forEach(link => {
    link.setAttribute('href', 'cv.pdf/CV_Elijah_Diallo_Full_Stack.pdf');
  });
  const fields = [
    ['.hero-role','Développeur Full Stack junior · IA & automatisation','Junior Full Stack developer · AI & automation'],
    ['h1.big','Des idées utiles.<br><em>Des produits concrets.</em>','Useful ideas.<br><em>Real products.</em>'],
    ['.hero-lede','À Dakar, je développe des applications web et j’orchestre des outils IA pour automatiser les tâches répétitives. Du besoin à l’interface, je construis, je teste et j’améliore.','Based in Dakar, I build web applications and orchestrate AI tools to automate repetitive tasks. From requirements to interfaces, I build, test and improve.'],
    ['.hero-tagline','Stage, alternance & missions freelance · Dakar / à distance','Internships, apprenticeships & freelance · Dakar / remote'],
    ['#projets h2','Du concret,<br><em>à explorer.</em>','Real work,<br><em>ready to explore.</em>'],
    ['#projets .lede','Des projets personnels et académiques, avec leurs fonctionnalités, mon rôle et un statut explicite.','Personal and academic projects, with their features, my contribution and a clear status.'],
    ['.ai-studio .studio-kicker','MA FAÇON DE TRAVAILLER / IA & AUTOMATISATION','HOW I WORK / AI & AUTOMATION'],
    ['#ai-title','Je n’utilise pas simplement l’IA.<br><em>Je l’orchestre.</em>','I don’t just use AI.<br><em>I orchestrate it.</em>'],
    ['.studio-intro','Je combine développement, outils IA et automatisations pour transformer des tâches répétitives en processus utiles. Mon rôle : cadrer le besoin, connecter les outils et vérifier le résultat.','I combine development, AI tools and automation to turn repetitive tasks into useful processes. My role: define the need, connect the tools and check the result.'],
    ['.assistant-preview .studio-kicker','ASSISTANT / GUIDE DU PORTFOLIO','ASSISTANT / PORTFOLIO GUIDE'],
    ['.assistant-preview h3','Votre visite, en conversation.','Your visit, in conversation.'],
    ['.assistant-preview p:last-child','Projets, compétences, disponibilité : des réponses issues du site, avec des liens pour aller plus loin.','Projects, skills, availability: answers from this site, with links to explore further.'],
    ['.assistant-preview button','Explorer mon profil ↗','Explore my profile ↗'],
    ['#project-momentum .proj-top > span:first-child','EN COURS / MOMENTUM','IN PROGRESS / MOMENTUM'],
    ['#project-momentum .proj-badge','En développement','In development'],
    ['#project-momentum p:not(.project-role)','Un projet en cours de développement, que je construis et améliore progressivement.','An ongoing project that I am building and improving iteratively.'],
    ['#project-momentum .project-role','Conception et développement · travail en cours','Design and development · work in progress'],
    ['#project-momentum .proj-soon','Présentation détaillée à venir','Detailed presentation coming soon'],
    ['#project-momentum .proj-tags span','Développement web','Web development'],
    ['.momentum-art small','CONSTRUIRE. TESTER. AMÉLIORER.','BUILD. TEST. IMPROVE.'],
    ['#contact .contact-heading','Un projet, une opportunité ?','A project or an opportunity?'],
    ['#contact [data-i18n="contact.lede"]','Vous cherchez un développeur junior pour votre équipe ou une application pour votre activité ? Basé à <strong>Dakar</strong>, je suis ouvert aux stages, alternances et missions freelance, au Sénégal ou à distance. Échangeons sur votre besoin.','Looking for a junior developer for your team or an application for your business? Based in <strong>Dakar</strong>, I am open to internships, apprenticeships and freelance work in Senegal or remotely. Let’s discuss your needs.']
  ];
  const stages = [
    ['01 / CONCEVOIR','01 / DESIGN','Des automatisations utiles.','Useful automation.','Relier des étapes, organiser les échanges entre outils et réduire les manipulations répétitives.','Connect steps, coordinate tools and reduce repetitive manual work.'],
    ['02 / ORCHESTRER','02 / ORCHESTRATE','L’IA avec une direction.','AI with direction.','Décomposer un objectif, donner du contexte aux assistants et contrôler leurs productions.','Break down a goal, give assistants context and review their outputs.'],
    ['03 / EXÉCUTER','03 / RUN','Des environnements maîtrisés.','Controlled environments.','J’utilise Docker pour travailler avec des services conteneurisés, aux côtés de Git et Linux.','I use Docker for containerized services, alongside Git and Linux.']
  ];
  function translate() {
    const en = document.documentElement.lang === 'en';
    fields.forEach(([selector,fr,english]) => { const element=$(selector); if(element)element.innerHTML=en?english:fr; });
    contact.textContent=en?'Let’s talk ↗':'Parlons de votre besoin ↗';
    document.querySelectorAll('.studio-grid article').forEach((el,i) => {
      const values=stages[i]; ['span','h3','p'].forEach((selector,j)=>el.querySelector(selector).textContent=values[j*2+(en?1:0)]);
    });
    document.querySelectorAll('.sf-hard-tags > span:not([data-tool])').forEach(el => {
      if(['Automatisation','Automation'].includes(el.textContent))el.textContent=en?'Automation':'Automatisation';
      if(['Orchestration IA','AI orchestration'].includes(el.textContent))el.textContent=en?'AI orchestration':'Orchestration IA';
    });
  }
  translate(); document.addEventListener('portfolio-language',translate);
})();
