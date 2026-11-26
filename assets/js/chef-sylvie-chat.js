/* Cheffe Sylvie — assistante virtuelle d'Arabesque Traiteur.
 * Widget autonome : bouton flottant + panneau de discussion.
 * Les réponses viennent du worker arabesque-chat (base de connaissances du site).
 * En cas d'échec ou de réponse inconnue, le widget oriente vers WhatsApp et le
 * formulaire de devis : le chat n'est jamais bloqué. */
(function () {
  'use strict';
  var WORKER_URL = 'https://arabesque-chat.patricemirindi.workers.dev/chat';
  var WHATSAPP = 'https://wa.me/243859993833';
  var FALLBACK = "Je n'ai pas cette information sous la main. L'équipe d'Arabesque Traiteur vous répond vite sur WhatsApp au +243 859 993 833, ou via le formulaire de devis gratuit.";

  var css = '\
.cs-btn{position:fixed;right:20px;bottom:20px;z-index:9998;display:flex;align-items:center;gap:8px;\
background:#b8860b;background:linear-gradient(135deg,#d4af37,#b8860b);color:#1a1a1a;border:none;cursor:pointer;\
font-family:inherit;font-weight:700;font-size:15px;padding:13px 20px;border-radius:999px;\
box-shadow:0 6px 20px rgba(0,0,0,.35);transition:transform .15s ease}\
.cs-btn:hover{transform:translateY(-2px)}\
.cs-panel{position:fixed;right:20px;bottom:84px;z-index:9999;width:380px;max-width:calc(100vw - 24px);\
height:540px;max-height:calc(100dvh - 110px);display:none;flex-direction:column;background:#fffdf7;\
border:1px solid #e5d9b8;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.35);\
font-family:inherit;color:#26221a}\
.cs-panel.open{display:flex}\
.cs-head{background:linear-gradient(135deg,#2b2118,#4a3517);color:#f5e9c9;padding:14px 16px;display:flex;align-items:center;gap:10px}\
.cs-avatar{width:40px;height:40px;border-radius:50%;background:#d4af37;color:#2b2118;display:flex;align-items:center;justify-content:center;font-size:20px;flex:none}\
.cs-head h3{margin:0;font-size:17px;line-height:1.2}\
.cs-head p{margin:2px 0 0;font-size:12px;opacity:.85}\
.cs-close{margin-left:auto;background:none;border:none;color:#f5e9c9;font-size:22px;cursor:pointer;line-height:1}\
.cs-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}\
.cs-msg{max-width:88%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}\
.cs-msg.bot{background:#f3ead2;border:1px solid #e5d9b8;align-self:flex-start;border-bottom-left-radius:4px}\
.cs-msg.user{background:#2b2118;color:#fdf6dd;align-self:flex-end;border-bottom-right-radius:4px}\
.cs-links{align-self:flex-start;display:flex;flex-direction:column;gap:4px}\
.cs-links a{font-size:13px;color:#8a6d00;text-decoration:underline}\
.cs-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}\
.cs-chip{background:#fff;border:1px solid #d4af37;color:#6b5200;border-radius:999px;padding:6px 11px;font-size:12.5px;cursor:pointer;font-family:inherit}\
.cs-chip:hover{background:#f7ecc9}\
.cs-foot{display:flex;gap:8px;padding:10px;border-top:1px solid #e5d9b8;background:#fff}\
.cs-input{flex:1;border:1px solid #d8c88f;border-radius:999px;padding:10px 14px;font-size:14px;font-family:inherit;outline:none}\
.cs-input:focus{border-color:#b8860b}\
.cs-send{background:#b8860b;background:linear-gradient(135deg,#d4af37,#b8860b);border:none;color:#1a1a1a;\
width:42px;height:42px;border-radius:50%;font-size:17px;cursor:pointer;flex:none}\
.cs-typing{font-style:italic;opacity:.7}\
.cs-typing::after{content:"";animation:csdots 1.2s steps(4) infinite}\
@keyframes csdots{0%{content:""}25%{content:"."}50%{content:".."}75%{content:"..."}}\
.cs-writing::after{content:"▍";margin-left:1px;opacity:.6;animation:csblink .7s steps(1) infinite}\
@keyframes csblink{50%{opacity:0}}\
.cs-wa{display:flex;align-items:center;justify-content:center;gap:8px;background:#25d366;color:#08340f;font-weight:700;font-size:13.5px;text-decoration:none;padding:9px 12px}\
.cs-wa:hover{background:#1fb857}\
.cs-est{align-self:stretch;background:#fff;border:1px solid #d4af37;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px}\
.cs-est label{font-size:12.5px;font-weight:600;color:#6b5200;display:flex;flex-direction:column;gap:3px}\
.cs-est select,.cs-est input{border:1px solid #d8c88f;border-radius:8px;padding:8px;font-size:14px;font-family:inherit;background:#fffdf7}\
.cs-est button{background:linear-gradient(135deg,#d4af37,#b8860b);border:none;color:#1a1a1a;font-weight:700;border-radius:999px;padding:9px;font-size:14px;cursor:pointer;font-family:inherit}\
.cs-cta{align-self:flex-start;background:#2b2118;color:#f5e9c9 !important;text-decoration:none !important;padding:9px 14px;border-radius:999px;font-weight:700;font-size:13.5px}\
@media (max-width:900px){.cs-btn{width:56px;height:56px;padding:0;justify-content:center;border-radius:50%;\
right:calc(14px + env(safe-area-inset-right));bottom:calc(14px + env(safe-area-inset-bottom))}\
.cs-btn .cs-btn-label{display:none}.cs-panel{right:12px;bottom:82px}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.className = 'cs-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Discuter avec Cheffe Sylvie, assistante virtuelle');
  btn.innerHTML = '<span aria-hidden="true">💬</span><span class="cs-btn-label">Cheffe Sylvie</span>';

  var panel = document.createElement('div');
  panel.className = 'cs-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Discussion avec Cheffe Sylvie');
  panel.innerHTML =
    '<div class="cs-head"><div class="cs-avatar" aria-hidden="true">👩🏾‍🍳</div>' +
    '<div><h3>Cheffe Sylvie</h3><p>Assistante virtuelle · Arabesque Traiteur</p></div>' +
    '<button class="cs-close" type="button" aria-label="Fermer">×</button></div>' +
    '<div class="cs-body"></div>' +
    '<div class="cs-chips">' +
    '<button class="cs-chip" type="button">Combien pour 80 invités ?</button>' +
    '<button class="cs-chip" type="button">C\'est quoi le pondu ?</button>' +
    '<button class="cs-chip" type="button" id="cs-est-chip">🧮 Estimation rapide</button>' +
    '<button class="cs-chip" type="button">Demander un devis</button>' +
    '</div>' +
    '<a class="cs-wa" href="https://wa.me/243859993833" target="_blank" rel="noopener">💬 Parler à l\'équipe sur WhatsApp</a>' +
    '<form class="cs-foot"><input class="cs-input" type="text" maxlength="500" placeholder="Posez votre question…" aria-label="Votre question">' +
    '<button class="cs-send" type="submit" aria-label="Envoyer">➤</button></form>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var body = panel.querySelector('.cs-body');
  var input = panel.querySelector('.cs-input');
  var greeted = false;

  function addMsg(text, who, typeSlow) {
    var div = document.createElement('div');
    div.className = 'cs-msg ' + who;
    body.appendChild(div);
    if (!typeSlow || who !== 'bot') {
      div.textContent = text;
      body.scrollTop = body.scrollHeight;
      return div;
    }
    // Frappe progressive, mot à mot, durée proportionnelle (0,8 s à 7 s max).
    var words = text.split(/(\s+)/);
    var total = text.length;
    var duration = Math.min(7000, Math.max(800, total * 16));
    var stepMs = 30;
    var perTick = Math.max(1, Math.round(words.length / (duration / stepMs)));
    var i = 0, done = false, timer = null;
    div.classList.add('cs-writing');
    function finish() {
      if (done) return;
      done = true;
      if (timer) clearInterval(timer);
      div.textContent = text;
      div.classList.remove('cs-writing');
      body.scrollTop = body.scrollHeight;
      if (div._onTyped) div._onTyped();
    }
    div.addEventListener('click', finish);
    div._finishTyping = finish;
    timer = setInterval(function () {
      i += perTick;
      div.textContent = words.slice(0, i).join('');
      body.scrollTop = body.scrollHeight;
      if (i >= words.length) finish();
    }, stepMs);
    return div;
  }
  function addLinks(links) {
    if (!links || !links.length) return;
    var wrap = document.createElement('div');
    wrap.className = 'cs-links';
    links.forEach(function (l) {
      var a = document.createElement('a');
      a.href = l.url; a.textContent = '→ ' + l.title;
      wrap.appendChild(a);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }
  function addFallback() {
    addMsg(FALLBACK, 'bot', true);
    addLinks([
      { title: 'WhatsApp +243 859 993 833', url: WHATSAPP },
      { title: 'Formulaire de devis gratuit', url: 'contact.html#formulaire-devis' }
    ]);
  }

  var history = [];
  function ask(q) {
    if (!q) return;
    addMsg(q, 'user');
    input.value = '';
    var typing = addMsg('Cheffe Sylvie réfléchit', 'bot');
    typing.classList.add('cs-typing');
    var started = Date.now();
    function afterThinking(fn) {
      var wait = Math.max(0, 1100 - (Date.now() - started));
      setTimeout(function () { typing.remove(); fn(); }, wait);
    }
    fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: q, lang: 'auto', history: history })
    }).then(function (r) { return r.json(); }).then(function (data) {
      afterThinking(function () {
        if (data && data.text) {
          var bubble = addMsg(data.text, 'bot', true);
          bubble._onTyped = function () { addLinks(data.links); };
          history.push({ role: 'user', text: q }, { role: 'assistant', text: data.text });
          if (history.length > 6) history = history.slice(-6);
        } else {
          addFallback();
        }
      });
    }).catch(function () {
      afterThinking(addFallback);
    });
  }

  // ---- Estimation rapide (règles du site, calcul local instantané) ----
  function showEstimator() {
    var card = document.createElement('div');
    card.className = 'cs-est';
    card.innerHTML =
      '<label>Type d\'événement <select class="est-event">' +
      '<option value="mariage">Mariage</option><option value="anniversaire">Anniversaire</option>' +
      '<option value="gala">Gala</option><option value="prive">Réception privée</option>' +
      '<option value="corporate">Événement d\'entreprise</option><option value="">Autre</option></select></label>' +
      '<label>Nombre d\'invités <input class="est-guests" type="number" min="1" max="2000" value="80"></label>' +
      '<label class="est-formule-wrap">Formule <select class="est-formule"></select></label>' +
      '<div class="est-auto" style="font-size:12.5px;color:#6b5200"></div>' +
      '<button type="button" class="est-go">Calculer mon estimation</button>';
    body.appendChild(card);
    body.scrollTop = body.scrollHeight;
    var guestsEl = card.querySelector('.est-guests');
    var wrap = card.querySelector('.est-formule-wrap');
    var auto = card.querySelector('.est-auto');
    var GRILLE = {
      s: [[30, 'Essentielle — 14 variétés — 30 $/pers'], [35, 'Optimale — 18 variétés — 35 $/pers'], [40, 'Premium — 20 variétés — 40 $/pers'], [45, 'Excellence — 22 variétés — 45 $/pers']],
      m: [[25, 'Essentielle — 14 variétés — 25 $/pers'], [30, 'Optimale — 18 variétés — 30 $/pers'], [35, 'Premium — 20 variétés — 35 $/pers'], [40, 'Excellence — 22 variétés — 40 $/pers']],
      l: [[20, 'Essentielle — 14 variétés — 20 $/pers'], [25, 'Optimale — 18 variétés — 25 $/pers'], [30, 'Premium — 20 variétés — 30 $/pers'], [35, 'Excellence — 22 variétés — 35 $/pers'], [40, 'VIP — 24 variétés — 40 $/pers']]
    };
    function refresh() {
      var g = parseInt(guestsEl.value, 10) || 0;
      var key = g <= 50 ? 's' : (g <= 99 ? 'm' : 'l');
      var sel = card.querySelector('.est-formule');
      var current = sel.value;
      sel.innerHTML = GRILLE[key].map(function (t) { return '<option value="' + t[0] + '">' + t[1] + '</option>'; }).join('');
      sel.value = GRILLE[key].some(function (t) { return String(t[0]) === current; }) ? current : String(GRILLE[key][1][0]);
      auto.textContent = g > 0 ? (key === 's' ? 'Tranche 1 à 50 invités' : (key === 'm' ? 'Tranche 51 à 99 invités' : 'Tranche 100 invités et plus')) + ' — crudités, fruits, présentation, service et matériel inclus.' : '';
    }
    guestsEl.addEventListener('input', refresh);
    refresh();
    card.querySelector('.est-go').addEventListener('click', function () {
      var g = parseInt(guestsEl.value, 10) || 0;
      if (g < 1) { addMsg("Indiquez d'abord le nombre d'invités pour calculer l'estimation.", 'bot'); return; }
      var price = parseInt(card.querySelector('.est-formule').value, 10);
      var name = card.querySelector('.est-formule').selectedOptions[0].textContent.split(' — ')[0];
      var total = price * g;
      var ev = card.querySelector('.est-event').value;
      var evLabel = card.querySelector('.est-event').selectedOptions[0].textContent;
      addMsg('Estimation pour un(e) ' + evLabel.toLowerCase() + ' de ' + g + ' invités, formule ' + name +
        ' : ' + price + ' $ x ' + g + ' = ' + total.toLocaleString('fr-FR') + ' $. ' +
        'C\'est une estimation indicative — le devis personnalisé gratuit confirme le montant exact.', 'bot');
      var wrapLinks = document.createElement('div');
      wrapLinks.className = 'cs-links';
      var a = document.createElement('a');
      a.className = 'cs-cta';
      a.href = 'contact.html?guests=' + g + (ev ? '&event=' + ev : '') + '&total=' + total + '#formulaire-devis';
      a.textContent = '→ Continuer vers le devis pré-rempli';
      wrapLinks.appendChild(a);
      body.appendChild(wrapLinks);
      body.scrollTop = body.scrollHeight;
      card.remove();
    });
  }

  function toggle(open) {
    panel.classList.toggle('open', open);
    if (open && !greeted) {
      greeted = true;
      addMsg("Bonjour et bienvenue chez Arabesque Traiteur ! Je suis Cheffe Sylvie, votre assistante virtuelle. " +
        "Je peux vous parler de nos plats congolais, de nos formules et de leurs prix, ou vous aider à préparer votre devis. Je peux aussi vous saluer en lingala, swahili, kikongo et tshiluba. Que puis-je faire pour vous ?", 'bot', true);
    }
    if (open) input.focus();
  }

  btn.addEventListener('click', function () { toggle(!panel.classList.contains('open')); });
  panel.querySelector('.cs-close').addEventListener('click', function () { toggle(false); });
  panel.querySelector('.cs-foot').addEventListener('submit', function (e) {
    e.preventDefault();
    ask(input.value.trim());
  });
  panel.querySelectorAll('.cs-chip').forEach(function (chip) {
    if (chip.id === 'cs-est-chip') {
      chip.addEventListener('click', function () { if (!panel.classList.contains('open')) toggle(true); showEstimator(); });
    } else {
      chip.addEventListener('click', function () { ask(chip.textContent.trim()); });
    }
  });
})();
