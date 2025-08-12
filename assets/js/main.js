// Mobile nav toggle
const openNav = document.getElementById('openNav');
const mobileNav = document.getElementById('mobileNav');
if (openNav && mobileNav) {
  openNav.addEventListener('click', () => {
    const isHidden = mobileNav.classList.toggle('hidden');
    openNav.setAttribute('aria-expanded', String(!isHidden));
  });
}

// Year
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Preserve selection from menu page (via localStorage)
const selectionField = document.getElementById('selectionField');
if (selectionField) {
  try { selectionField.value = localStorage.getItem('arabesque_selection') || ''; } catch(e) {}
}

// Contact form handlers (mailto + WhatsApp)
const form = document.getElementById('quoteForm');
const formMsg = document.getElementById('formMsg');
const whBtn = document.getElementById('whBtn');

function updateWhatsAppLink() {
  if (!form || !whBtn) return;
  const fd = new FormData(form);
  const name = fd.get('name') || '';
  const date = fd.get('date') || '';
  const place = fd.get('place') || '';
  const guests = fd.get('guests') || '';
  const type = fd.get('type') || '';
  const sel = (document.getElementById('selectionField')?.value) || '{}';
  const text = encodeURIComponent(`Bonjour Arabesque Traiteur, je souhaite un devis.\nNom: ${name}\nDate: ${date}\nLieu: ${place}\nInvités: ${guests}\nType: ${type}\nSélection: ${sel}`);
  // 🔁 Remplacez par votre numéro pro au format international
  whBtn.href = `https://wa.me/243000000000?text=${text}`;
}

if (form) {
  form.addEventListener('input', updateWhatsAppLink);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const subject = encodeURIComponent('Demande de devis – Arabesque Traiteur');
    const body = encodeURIComponent(
`Nom: ${fd.get('name')}
Téléphone: ${fd.get('phone')}
Email: ${fd.get('email')}
Date: ${fd.get('date')}
Lieu: ${fd.get('place')}
Invités: ${fd.get('guests')}
Type: ${fd.get('type')}
Sélection: ${document.getElementById('selectionField')?.value || '{}'}
Message: ${fd.get('message') || ''}`);
    // 🔁 Remplacez contact@ par votre adresse réelle
    window.location.href = `mailto:contact@arabesque-kinshasa.cd?subject=${subject}&body=${body}`;
    if (formMsg) formMsg.textContent = 'Ouverture de votre client e‑mail…';
  });
  updateWhatsAppLink();
}
