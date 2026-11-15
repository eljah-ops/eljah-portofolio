/* Original lightweight implementation of the observed entrance, wall and typing effects. */
(() => {
  const $ = selector => document.querySelector(selector);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = $('.hero');
  const sky = document.createElement('div');sky.className='cosmic-sky';sky.setAttribute('aria-hidden','true');
  for(let i=0;i<70;i++){const star=document.createElement('i');star.style.left=((i*43.71)%100)+'%';star.style.top=((i*27.19)%100)+'%';star.style.animationDelay=-(i%7)+'s';sky.append(star);}
  document.body.prepend(sky);
  const wall=document.createElement('div');wall.className='project-wall';wall.setAttribute('aria-hidden','true');
  const captures=[...document.querySelectorAll('.proj-preview img')].map(img=>img.getAttribute('src'));
  for(let column=0;column<3;column++){
    const track=document.createElement('div');track.className='project-wall-column';
    const images=Array.from({length:3},(_,i)=>captures[(i+column)%captures.length]);
    [...images,...images].forEach(src=>{const img=document.createElement('img');img.src=src;img.alt='';img.width=600;img.height=387;img.decoding='async';track.append(img);});wall.append(track);
  }
  hero.prepend(wall);
  const line=document.createElement('p');line.className='typed-line';
  const prefix=document.createElement('span'),word=document.createElement('span'),caret=document.createElement('span');
  word.className='typed-word';caret.className='typed-caret';caret.textContent='|';
  line.setAttribute('aria-hidden','true');line.append(prefix,word,caret);$('h1.big').after(line);
  const accessible=document.createElement('p');accessible.className='sr-only';line.after(accessible);
  let timer,role=0,letter=0,erasing=false,paused=false;
  const english=()=>document.documentElement.lang==='en';
  const roles=()=>english()?['Full Stack developer.','AI orchestrator.','network enthusiast.']:['développeur Full Stack.','orchestrateur IA.','passionné de réseaux.'];
  function tick(){
    if(document.hidden||reduced.matches||paused)return;
    const value=roles()[role];letter+=erasing?-1:1;word.textContent=value.slice(0,letter);
    let delay=erasing?35:80;
    if(letter>=value.length){erasing=true;delay=1700;}
    if(letter===0&&erasing){erasing=false;role=(role+1)%roles().length;delay=240;}
    timer=setTimeout(tick,delay);
  }
  function translate(){
    clearTimeout(timer);role=0;letter=0;erasing=false;
    $('.brand-name').textContent='< Elijah Diallo />';
    $('h1.big').innerHTML=english()?'Hey <span class="reference-wave">👋</span>, I’m <em>Elijah.</em>':'Salut <span class="reference-wave">👋</span>, moi c’est <em>Elijah.</em>';
    prefix.textContent=english()?'I’m a ':'Je suis ';accessible.textContent=roles().join(' ');
    word.textContent=reduced.matches?roles()[0]:'';
    if(!reduced.matches)tick();
    document.querySelector('meta[name="theme-color"]').content='#080518';
  }
  translate();document.addEventListener('portfolio-language',translate);reduced.addEventListener('change',translate);
  document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(!document.hidden&&!reduced.matches)tick();});
  const targets=document.querySelectorAll('.proj-card,.studio-grid article,.profil-grid,.sf-card,.contact-layout');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
  targets.forEach(el=>{el.classList.add('reference-reveal');observer.observe(el);});
  let seen=false;try{seen=sessionStorage.getItem('elijah-reference-intro')==='seen';}catch{}
  if(!seen&&!reduced.matches){
    const intro=document.createElement('div');intro.className='cosmic-intro';
    const title=document.createElement('h2');title.innerHTML=english()?'A new <em>Dev</em> in Dakar.<br>Meet Elijah!':'Un <em>Dev</em> à Dakar.<br>Découvrez Elijah !';
    const portrait=document.createElement('img');portrait.src='assets/profile/elijah-diallo.jpeg';portrait.alt='';
    const caption=document.createElement('small');caption.textContent='Elijah Ismael Diallo · Portfolio';
    const skip=document.createElement('button');skip.type='button';skip.textContent=english()?'Skip intro':'Passer l’introduction';
    const close=()=>{const focused=intro.contains(document.activeElement);intro.remove();if(focused)$('.brand-name').focus();};skip.onclick=close;
    intro.append(title,portrait,caption,skip);document.body.append(intro);setTimeout(close,2900);
    try{sessionStorage.setItem('elijah-reference-intro','seen');}catch{}
  }
  const pause=document.createElement('button');pause.type='button';pause.className='motion-toggle';pause.setAttribute('aria-pressed','false');
  const pauseLabel=()=>{pause.textContent=english()?'Pause animations':'Pause animations';};pauseLabel();
  pause.style.cssText='position:absolute;bottom:22px;right:24px;font-size:11px;padding:7px 12px;border:1px solid #684a87;border-radius:20px;color:#ddd0ef;background:#12091f';
  pause.onclick=()=>{paused=!paused;wall.querySelectorAll('.project-wall-column').forEach(el=>el.style.animationPlayState=paused?'paused':'running');sky.querySelectorAll('i').forEach(el=>el.style.animationPlayState=paused?'paused':'running');clearTimeout(timer);if(!paused&&!reduced.matches)tick();pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?(english()?'Resume animations':'Reprendre les animations'):'Pause animations';};
  hero.append(pause);
  window.addEventListener('pagehide',()=>clearTimeout(timer));
})();
