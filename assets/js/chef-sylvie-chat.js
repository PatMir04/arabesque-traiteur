/* Chef Sylvie — assistante virtuelle d'Arabesque Traiteur.
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
@media (max-width:900px){.cs-btn{width:56px;height:56px;padding:0;justify-content:center;border-radius:50%;\
right:calc(14px + env(safe-area-inset-right));bottom:calc(14px + env(safe-area-inset-bottom))}\
.cs-btn .cs-btn-label{display:none}.cs-panel{right:12px;bottom:82px}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.className = 'cs-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Discuter avec Chef Sylvie, assistante virtuelle');
  btn.innerHTML = '<span aria-hidden="true">💬</span><span class="cs-btn-label">Chef Sylvie</span>';

  var panel = document.createElement('div');
  panel.className = 'cs-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Discussion avec Chef Sylvie');
  panel.innerHTML =
    '<div class="cs-head"><div class="cs-avatar" aria-hidden="true">👩🏾‍🍳</div>' +
    '<div><h3>Chef Sylvie</h3><p>Assistante virtuelle · Arabesque Traiteur</p></div>' +
    '<button class="cs-close" type="button" aria-label="Fermer">×</button></div>' +
    '<div class="cs-body"></div>' +
    '<div class="cs-chips">' +
    '<button class="cs-chip" type="button">Combien pour 80 invités ?</button>' +
    '<button class="cs-chip" type="button">C\'est quoi le pondu ?</button>' +
    '<button class="cs-chip" type="button">Demander un devis</button>' +
    '</div>' +
    '<form class="cs-foot"><input class="cs-input" type="text" maxlength="500" placeholder="Posez votre question…" aria-label="Votre question">' +
    '<button class="cs-send" type="submit" aria-label="Envoyer">➤</button></form>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var body = panel.querySelector('.cs-body');
  var input = panel.querySelector('.cs-input');
  var greeted = false;

  function addMsg(text, who) {
    var div = document.createElement('div');
    div.className = 'cs-msg ' + who;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
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
    addMsg(FALLBACK, 'bot');
    addLinks([
      { title: 'WhatsApp +243 859 993 833', url: WHATSAPP },
      { title: 'Formulaire de devis gratuit', url: 'contact.html#formulaire-devis' }
    ]);
  }

  function ask(q) {
    if (!q) return;
    addMsg(q, 'user');
    input.value = '';
    var typing = addMsg('Chef Sylvie écrit…', 'bot');
    typing.classList.add('cs-typing');
    fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: q, lang: 'fr' })
    }).then(function (r) { return r.json(); }).then(function (data) {
      typing.remove();
      if (data && data.text) {
        addMsg(data.text, 'bot');
        addLinks(data.links);
      } else {
        addFallback();
      }
    }).catch(function () {
      typing.remove();
      addFallback();
    });
  }

  function toggle(open) {
    panel.classList.toggle('open', open);
    if (open && !greeted) {
      greeted = true;
      addMsg("Bonjour et bienvenue chez Arabesque Traiteur ! Je suis Chef Sylvie, votre assistante virtuelle. " +
        "Je peux vous parler de nos plats congolais, de nos formules et de leurs prix, ou vous aider à préparer votre devis. Que puis-je faire pour vous ?", 'bot');
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
    chip.addEventListener('click', function () { ask(chip.textContent.trim()); });
  });
})();
