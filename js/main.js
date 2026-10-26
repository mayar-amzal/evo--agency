document.querySelectorAll('.copy').forEach(function(b){
  b.addEventListener('click',function(){
    var t=b.getAttribute('data-copy');
    var done=function(){b.textContent='Copié';setTimeout(function(){b.textContent='Copier'},1600)};
    try{navigator.clipboard.writeText(t).then(done,function(){sel(b)})}catch(e){sel(b)}
  });
});
(function(){
  var f=document.getElementById('devis'),st=document.getElementById('f-status'),btn=document.getElementById('f-btn');
  function show(cls,msg){st.className='status '+cls;st.textContent=msg;st.hidden=false}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=Array.prototype.find.call(f.querySelectorAll('[required]'),function(el){return el.type==='checkbox'?!el.checked:!el.value.trim()});
    if(bad){show('err','Merci de remplir les champs marqués d’un * et de cocher la case de consentement.');bad.focus();return}
    var mail=document.getElementById('f-mail');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value)){show('err','L’adresse email semble incorrecte. Vérifiez-la puis renvoyez.');mail.focus();return}
    var data={};new FormData(f).forEach(function(v,k){data[k]=v});
    data._subject='Nouvelle demande de devis – '+(data['Société']||'site EVO Agency');
    data._template='table';data._captcha='false';
    btn.disabled=true;btn.textContent='Envoi en cours…';
    fetch('https://formsubmit.co/ajax/contact@evo-agency.fr',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().then(function(j){if(!r.ok||j.success===false||j.success==='false')throw 0})})
      .then(function(){f.reset();show('ok','Merci, votre demande est envoyée. Nous vous recontactons sous 24 h ouvrées.')})
      .catch(function(){show('err','L’envoi n’a pas abouti. Réessayez, ou écrivez-nous directement à contact@evo-agency.fr.')})
      .then(function(){btn.disabled=false;btn.textContent='Envoyer ma demande'});
  });
})();
function sel(b){var a=b.parentNode.querySelector('.val');var r=document.createRange();r.selectNodeContents(a);var s=window.getSelection();s.removeAllRanges();s.addRange(r);}
(function(){
  var ADS=[
    {t:"Secrétaire administrative pour cabinet d’architectes",d:"Gestion de l’agenda, accueil téléphonique et suivi des devis, 2 jours par semaine.",tags:["Agenda","Accueil téléphonique","Devis"],ville:"Lyon (69)",type:"Récurrente",mode:"Sur site",date:"Publiée aujourd’hui",n:true},
    {t:"Facturation et relances clients pour artisan plombier",d:"Saisie des factures, relances des impayés et préparation des éléments pour le comptable.",tags:["Facturation","Relances","Comptabilité"],ville:"Bordeaux (33)",type:"Récurrente",mode:"À distance",date:"Publiée hier",n:true},
    {t:"Secrétariat médical en renfort pendant 3 semaines",d:"Prise de rendez-vous, accueil des patients et gestion des dossiers pendant un congé.",tags:["Secrétariat médical","Rendez-vous"],ville:"Marseille (13)",type:"Ponctuelle",mode:"Sur site",date:"Il y a 2 jours"},
    {t:"Assistante commerciale pour PME du bâtiment",d:"Mise en forme des devis, suivi des chantiers et échanges avec les fournisseurs.",tags:["Devis","Suivi client","Excel"],ville:"Nantes (44)",type:"Récurrente",mode:"À distance",date:"Il y a 3 jours"},
    {t:"Saisie et classement de documents pour agence immobilière",d:"Numérisation, classement et saisie des mandats dans le logiciel de l’agence.",tags:["Saisie","Classement"],ville:"Lille (59)",type:"Ponctuelle",mode:"Sur site",date:"Il y a 4 jours"},
    {t:"Permanence téléphonique pour cabinet d’avocats",d:"Prise d’appels, filtrage et prise de messages, du lundi au vendredi matin.",tags:["Accueil téléphonique","Juridique"],ville:"Paris (75)",type:"Récurrente",mode:"À distance",date:"Il y a 5 jours"}
  ];
  var pin='<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  var clock='<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var box=document.getElementById('ads'),q=document.getElementById('q'),ft=document.getElementById('ftype'),fm=document.getElementById('fmode'),cnt=document.getElementById('count');
  function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
  function render(){
    var k=norm(q.value.trim()),list=ADS.filter(function(a){
      if(ft.value&&a.type!==ft.value)return false;
      if(fm.value&&a.mode!==fm.value)return false;
      return !k||norm([a.t,a.d,a.ville,a.tags.join(' ')].join(' ')).indexOf(k)>-1;
    });
    cnt.textContent=list.length+(list.length>1?' annonces':' annonce');
    box.innerHTML=list.length?list.map(function(a){
      return '<article class="sx-ad"><div class="sx-top"><h3>'+esc(a.t)+'</h3>'+(a.n?'<span class="sx-pill sx-new">Nouveau</span>':'')+'</div>'+
        '<p>'+esc(a.d)+'</p><div class="sx-tags">'+a.tags.map(function(x){return '<span class="sx-pill">'+esc(x)+'</span>'}).join('')+
        (a.mode==='À distance'?'<span class="sx-pill sx-remote">À distance</span>':'')+'</div>'+
        '<div class="sx-meta"><span>'+pin+esc(a.ville)+'</span><span>'+clock+esc(a.type)+'</span><span>'+esc(a.date)+'</span></div>'+
        '<div class="sx-foot"><span class="sx-ex-label">Exemple</span><a class="btn sx-btn-outline" href="#sx-inscription" data-tab="secretaire">Voir les coordonnées</a></div></article>';
    }).join(''):'<div class="sx-empty">Aucune annonce ne correspond à votre recherche. Essayez un autre mot-clé ou retirez un filtre.</div>';
  }
  [q,ft,fm].forEach(function(el){el.addEventListener('input',render)});
  render();

  var tabs={entreprise:document.getElementById('tab-entreprise'),secretaire:document.getElementById('tab-secretaire')};
  function show(which){
    Object.keys(tabs).forEach(function(k){
      var on=k===which;tabs[k].setAttribute('aria-selected',on?'true':'false');
      document.getElementById('form-'+k).hidden=!on;
    });
  }
  tabs.entreprise.addEventListener('click',function(){show('entreprise')});
  tabs.secretaire.addEventListener('click',function(){show('secretaire')});
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-tab]');if(a)show(a.getAttribute('data-tab'));
  });

  document.querySelectorAll('form.sx-form').forEach(function(f){
    var st=f.querySelector('.sx-status'),btn=f.querySelector('button[type=submit]'),label=btn.textContent;
    function msg(cls,t){st.className='sx-status sx-'+cls;st.textContent=t;st.hidden=false}
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var bad=Array.prototype.find.call(f.querySelectorAll('[required]'),function(el){return el.type==='checkbox'?!el.checked:!el.value.trim()});
      if(bad){msg('err','Merci de remplir les champs marqués d’un * et de cocher la case de consentement.');bad.focus();return}
      var m=f.querySelector('input[type=email]');
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value)){msg('err','L’adresse email semble incorrecte. Vérifiez-la puis renvoyez.');m.focus();return}
      var data={};new FormData(f).forEach(function(v,k){data[k]=v});
      data._subject=f.getAttribute('data-subject');data._template='table';data._captcha='false';
      btn.disabled=true;btn.textContent='Envoi en cours…';
      fetch('https://formsubmit.co/ajax/contact@evo-agency.fr',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().then(function(j){if(!r.ok||j.success===false||j.success==='false')throw 0})})
        .then(function(){f.reset();msg('ok',f.id==='form-entreprise'?'Merci, votre annonce est envoyée. Nous la vérifions et la publions sous 24 h ouvrées.':'Merci, votre demande est envoyée. Vous recevrez le lien de paiement et vos accès par email.')})
        .catch(function(){msg('err','L’envoi n’a pas abouti. Réessayez, ou écrivez-nous à contact@evo-agency.fr.')})
        .then(function(){btn.disabled=false;btn.textContent=label});
    });
  });
})();
