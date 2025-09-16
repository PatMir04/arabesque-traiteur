// assets/js/contact.js - Arabesque Traiteur COMPLETE IMPLEMENTATION WITH FULL MENU
(function() {
  'use strict';

  // Conflict-safe global state
  window.ArabesqueContact = window.ArabesqueContact || {};

  // Pricing rules
  const PRICING_RULES = {
    '1-50': [{price:35, maxDishes:14, name:"Formule Intime", id:"intime"}],
    '50-100': [
      {price:20, maxDishes:18, name:"Formule Essentielle", id:"essentielle"},
      {price:25, maxDishes:20, name:"Formule Optimale", id:"optimale"},
      {price:30, maxDishes:24, name:"Formule Premium", id:"premium"},
      {price:35, maxDishes:28, name:"Formule Excellence", id:"excellence"}
    ],
    '100+': [
      {price:15, maxDishes:14, name:"Formule Économique", id:"economique"},
      {price:20, maxDishes:18, name:"Formule Essentielle", id:"essentielle"},
      {price:25, maxDishes:20, name:"Formule Optimale", id:"optimale"},
      {price:30, maxDishes:24, name:"Formule Premium", id:"premium"},
      {price:35, maxDishes:28, name:"Formule Excellence", id:"excellence"}
    ]
  };

  // COMPLETE MENU DATA
  const COMPLETE_MENU_DATA = {
    categories: [
      {
        id: 'specialites',
        nom: '🇨🇩 Spécialités Congolaises',
        elements: [
          { id: 'pondu', nom: 'Pondu', description: 'Feuilles de manioc pilées, plat emblématique congolais' },
          { id: 'maboke-ngulu', nom: 'Maboke y\'a Ngulu', description: 'Porc fumé traditionnel dans les feuilles' },
          { id: 'nga-nda', nom: 'Viande de Chèvre façon Nga Nda', description: 'Chèvre mijotée selon la tradition ancestrale' },
          { id: 'capitaine-braise', nom: 'Gros Capitaine Braisé', description: 'Poisson capitaine du Congo, braisé aux épices locales' },
          { id: 'saka-saka', nom: 'Saka-Saka', description: 'Feuilles de manioc aux cacahuètes, recette traditionnelle' },
          { id: 'liboke-ngulu', nom: 'Liboke ya Ngulu', description: 'Porc cuit dans les feuilles de bananier' },
          { id: 'ntaba-na-sauce', nom: 'Ntaba na Sauce', description: 'Mouton en sauce épicée, spécialité de Kinshasa' },
          { id: 'madesu', nom: 'Madesu', description: 'Haricots mijotés à la sauce tomate et épices' }
        ]
      },
      {
        id: 'viandes',
        nom: '🥩 Viandes & Grillades',
        elements: [
          { id: 'cochon-lait', nom: 'Cochon de Lait Farci', description: 'Cochon de lait tendre, farci aux herbes et épices locales' },
          { id: 'brochette-boeuf', nom: 'Brochette de Bœuf', description: 'Bœuf tendre grillé aux épices, marinade maison' },
          { id: 'poulet-braise', nom: 'Poulet Braisé', description: 'Poulet fermier braisé, sauce tomate épicée' },
          { id: 'cotes-agneau', nom: 'Côtes d\'Agneau', description: 'Côtes d\'agneau grillées, herbes de Provence' },
          { id: 'boeuf-aux-legumes', nom: 'Bœuf aux Légumes', description: 'Bœuf mijoté avec légumes du jardin' },
          { id: 'porc-aux-ananas', nom: 'Porc aux Ananas', description: 'Porc sucré-salé aux ananas frais' },
          { id: 'agneau-curry', nom: 'Agneau au Curry', description: 'Agneau parfumé au curry et lait de coco' },
          { id: 'boeuf-ngai-ngai', nom: 'Bœuf Ngai-Ngai', description: 'Bœuf séché et grillé, spécialité du Kasaï' }
        ]
      },
      {
        id: 'poissons',
        nom: '🐟 Poissons & Fruits de Mer',
        elements: [
          { id: 'tilapia-braise', nom: 'Tilapia Braisé', description: 'Tilapia frais braisé aux épices congolaises' },
          { id: 'capitaine-grille', nom: 'Capitaine Grillé', description: 'Capitaine du fleuve Congo grillé au charbon' },
          { id: 'sambaza-frit', nom: 'Sambaza Frit', description: 'Petits poissons du lac Kivu, frits et croustillants' },
          { id: 'crevettes-curry', nom: 'Crevettes au Curry', description: 'Crevettes géantes au curry et lait de coco' },
          { id: 'poisson-sale', nom: 'Poisson Salé', description: 'Poisson salé traditionnel aux légumes' },
          { id: 'mukeke-grille', nom: 'Mukeke Grillé', description: 'Poisson mukeke grillé aux herbes fraîches' },
          { id: 'liboke-poisson', nom: 'Liboke ya Mbisi', description: 'Poisson cuit dans les feuilles de bananier' }
        ]
      },
      {
        id: 'volailles',
        nom: '🐔 Volailles',
        elements: [
          { id: 'poulet-moambe', nom: 'Poulet Moambé', description: 'Poulet à la sauce de noix de palme, plat national' },
          { id: 'canard-aux-olives', nom: 'Canard aux Olives', description: 'Canard mijoté aux olives et fines herbes' },
          { id: 'pintade-braisee', nom: 'Pintade Braisée', description: 'Pintade fermière braisée aux épices locales' },
          { id: 'poulet-yassa', nom: 'Poulet Yassa', description: 'Poulet mariné aux oignons et citron' },
          { id: 'dinde-farcie', nom: 'Dinde Farcie', description: 'Dinde de Noël farcie aux marrons et épices' },
          { id: 'caille-grillee', nom: 'Caille Grillée', description: 'Cailles grillées aux herbes de Provence' }
        ]
      },
      {
        id: 'accompagnements',
        nom: '🍚 Accompagnements',
        elements: [
          { id: 'fufu', nom: 'Fufu', description: 'Pâte de manioc traditionnelle, accompagnement emblématique' },
          { id: 'riz-blanc', nom: 'Riz Blanc', description: 'Riz parfumé cuit à la vapeur' },
          { id: 'makemba', nom: 'Makemba', description: 'Bananes plantain, préparation traditionnelle congolaise' },
          { id: 'pommes-terre', nom: 'Pommes de Terre au Beurre', description: 'Pommes de terre fondantes au beurre frais' },
          { id: 'riz-pilaf', nom: 'Riz Pilaf', description: 'Riz basmati aux épices orientales' },
          { id: 'patates-douces', nom: 'Patates Douces', description: 'Patates douces rôties au miel' },
          { id: 'ignames-grillees', nom: 'Ignames Grillées', description: 'Ignames grillées aux herbes' },
          { id: 'kwanga', nom: 'Kwanga', description: 'Pain de manioc fermenté traditionnel' }
        ]
      },
      {
        id: 'legumes',
        nom: '🥗 Légumes & Salades',
        elements: [
          { id: 'salade-avocat', nom: 'Salade d\'Avocat', description: 'Avocat frais, tomates, concombre, vinaigrette maison' },
          { id: 'legumes-vapeur', nom: 'Légumes à la Vapeur', description: 'Assortiment de légumes cuits à la vapeur' },
          { id: 'epinards-arachides', nom: 'Épinards aux Arachides', description: 'Épinards mijotés aux cacahuètes pilées' },
          { id: 'salade-mixte', nom: 'Salade Mixte', description: 'Salade verte, carottes, radis, vinaigrette' },
          { id: 'haricots-verts', nom: 'Haricots Verts', description: 'Haricots verts sautés à l\'ail' },
          { id: 'choux-braises', nom: 'Choux Braisés', description: 'Choux braisés aux épices congolaises' },
          { id: 'courge-au-lait', nom: 'Courge au Lait de Coco', description: 'Courge mijotée dans le lait de coco' }
        ]
      },
      {
        id: 'desserts',
        nom: '🍰 Desserts',
        elements: [
          { id: 'beignets-banane', nom: 'Beignets de Banane', description: 'Beignets de banane plantain, miel et cannelle' },
          { id: 'tarte-ananas', nom: 'Tarte à l\'Ananas', description: 'Tarte aux ananas frais de la région' },
          { id: 'mousse-mangue', nom: 'Mousse de Mangue', description: 'Mousse légère aux mangues du Bandundu' },
          { id: 'gateau-chocolat', nom: 'Gâteau au Chocolat', description: 'Gâteau au chocolat belge, crème fraîche' },
          { id: 'salade-fruits', nom: 'Salade de Fruits Exotiques', description: 'Ananas, mangue, papaye, fruits de la passion' },
          { id: 'flan-coco', nom: 'Flan à la Noix de Coco', description: 'Flan traditionnel au lait de coco' },
          { id: 'bananes-flambes', nom: 'Bananes Flambées', description: 'Bananes flambées au rhum, glace vanille' }
        ]
      },
      {
        id: 'boissons',
        nom: '🍹 Boissons',
        elements: [
          { id: 'jus-bissap', nom: 'Jus de Bissap', description: 'Jus d\'hibiscus rafraîchissant, menthe fraîche' },
          { id: 'jus-gingembre', nom: 'Jus de Gingembre', description: 'Boisson épicée au gingembre frais' },
          { id: 'cocktail-ananas', nom: 'Cocktail d\'Ananas', description: 'Cocktail d\'ananas frais, menthe et citron vert' },
          { id: 'the-citronnelle', nom: 'Thé à la Citronnelle', description: 'Infusion de citronnelle, miel local' },
          { id: 'jus-tamarin', nom: 'Jus de Tamarin', description: 'Boisson acidulée au tamarin' },
          { id: 'eau-citronnee', nom: 'Eau Citronnée', description: 'Eau fraîche parfumée au citron et menthe' }
        ]
      }
    ]
  };

  // State
  let currentFormule = null, currentGuestCount = 0, maxSelectionLimit = Infinity;
  let selectedMenuItems = new Set();

  // Main entry
  document.addEventListener('DOMContentLoaded', function() {
    initializeFormSteps();
    initializePricingCalculator();
    loadMenuForManualSelection();
    initializeFormValidation();
  });

  // Multi-step navigation
  function initializeFormSteps() {
    let currentStep = 1;
    document.querySelectorAll('.next-step').forEach(btn => {
      btn.addEventListener('click', function() {
        const step = parseInt(this.dataset.next);
        if (validateCurrentStep()) showStep(step);
      });
    });
    document.querySelectorAll('.prev-step').forEach(btn => {
      btn.addEventListener('click', function() {
        showStep(parseInt(this.dataset.prev));
      });
    });
    function showStep(step) {
      currentStep = step;
      document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
      let el = document.querySelector(`.form-step[data-step="${step}"]`);
      if(el) el.classList.add('active');
      document.querySelectorAll('.step-indicator').forEach((indicator, i) => {
        indicator.classList.remove('active', 'completed');
        if (i + 1 === step) indicator.classList.add('active');
        else if (i + 1 < step) indicator.classList.add('completed');
      });
      document.querySelector('.progress-fill').style.width = `${(step / 4) * 100}%`;
      if (step === 4) generateQuoteSummary();
      document.getElementById('formulaire-devis').scrollIntoView({behavior: 'smooth'});
    }
  }

  function validateCurrentStep() {
    let activeStep = document.querySelector('.form-step.active');
    if (!activeStep) return true;
    let requiredFields = activeStep.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      const error = field.parentElement.querySelector('.form-error');
      if (!field.value.trim()) {
        field.style.borderColor = '#dc2626';
        if(error) error.textContent = 'Ce champ est requis';
        valid = false;
      } else {
        field.style.borderColor = '#d1d5db';
        if(error) error.textContent = '';
      }
    });
    return valid;
  }

  function initializePricingCalculator() {
    const guestsInput = document.querySelector('input[name="guests_count"]');
    const formuleSelect = document.querySelector('select[name="formule_tarifaire"]');
    const cocktailCheckbox = document.getElementById('cocktailService');
    if (guestsInput) guestsInput.addEventListener('input', handleGuestCountChange);
    if (formuleSelect) formuleSelect.addEventListener('change', handleFormuleChange);
    if (cocktailCheckbox) cocktailCheckbox.addEventListener('change', handleCocktailChange);
  }
  
  function handleGuestCountChange() {
    currentGuestCount = parseInt(this.value) || 0;
    updateFormuleOptions(currentGuestCount);
    const formuleSelect = document.querySelector('select[name="formule_tarifaire"]');
    // Auto-select formula if only one
    if(currentGuestCount <= 50 && formuleSelect && formuleSelect.options.length === 2) {
      formuleSelect.selectedIndex = 1;
      updateFormuleLimit(formuleSelect.value);
      calculatePricing(currentGuestCount);
    } else if(formuleSelect && formuleSelect.value) {
      updateFormuleLimit(formuleSelect.value);
      calculatePricing(currentGuestCount);
    } else {
      hidePricingPreview();
    }
  }

  function updateFormuleOptions(guestCount) {
    const formuleContainer = document.getElementById('formuleSelection');
    const formuleSelect = document.querySelector('select[name="formule_tarifaire"]');
    if (!formuleContainer || !formuleSelect) return;
    let formules;
    if (guestCount <= 50) formules = PRICING_RULES['1-50'];
    else if (guestCount <= 100) formules = PRICING_RULES['50-100'];
    else formules = PRICING_RULES['100+'];
    formuleSelect.innerHTML = '<option value="">Choisissez votre formule</option>';
    formules.forEach(formule => {
      const option = document.createElement('option');
      option.value = formule.id;
      option.textContent = `${formule.name} - ${formule.price}$/pers (${formule.maxDishes} plats max)`;
      formuleSelect.appendChild(option);
    });
    formuleContainer.classList.remove('hidden');
    formuleSelect.required = true;
  }

  function updateFormuleLimit(formuleId) {
    let found = null;
    Object.values(PRICING_RULES).forEach(arr => {
      const f = arr.find(fl => fl.id === formuleId);
      if (f) found = f;
    });
    if (!found) return;
    currentFormule = found;
    maxSelectionLimit = found.maxDishes;
    document.getElementById('maxSelection').textContent = maxSelectionLimit;
    document.getElementById('maxSelectionDisplay').textContent = maxSelectionLimit;
  }

  function calculatePricing(guestCount) {
    if (!currentFormule || guestCount === 0) { hidePricingPreview(); return; }
    const menuTotal = currentFormule.price * guestCount;
    let cocktailPrice = 0;
    const cocktailCheckbox = document.getElementById('cocktailService');
    if (cocktailCheckbox && cocktailCheckbox.checked) {
      if (guestCount < 55) cocktailPrice = 500;
      else if (guestCount < 105) cocktailPrice = 750;
      else if (guestCount < 155) cocktailPrice = 900;
      else cocktailPrice = 1200;
    }
    const total = menuTotal + cocktailPrice;
    updatePricingDisplay(menuTotal, cocktailPrice, total);
    document.getElementById('estimatedTotalField').value = total;
  }

  function updatePricingDisplay(menuTotal, cocktailPrice, total) {
    const pricingPreview = document.getElementById('pricingPreview');
    const pricingDetails = document.getElementById('pricingDetails');
    pricingDetails.innerHTML = `
      <div class="text-sm space-y-2">
        <div class="flex justify-between">
          <span>${currentFormule.name}</span>
          <span class="font-bold">${menuTotal}$ (${currentFormule.price}$ × ${currentGuestCount})</span>
        </div>
        ${cocktailPrice > 0 ? `<div class="flex justify-between"><span>Service cocktail</span><span class="font-bold">${cocktailPrice}$</span></div>` : ''}
        <hr class="border-gold/30">
        <div class="flex justify-between text-lg font-bold text-gold"><span>Total estimé</span><span>${total}$</span></div>
      </div>`;
    pricingPreview.classList.remove('hidden');
  }
  function hidePricingPreview() {
    document.getElementById('pricingPreview').classList.add('hidden');
  }

  function handleFormuleChange() {
    const formuleId = this.value;
    if(formuleId && currentGuestCount > 0) {
      updateFormuleLimit(formuleId);
      calculatePricing(currentGuestCount);
    }
  }
  function handleCocktailChange() {
    document.getElementById('cocktailDetails').classList.toggle('hidden', !this.checked);
    if (currentGuestCount > 0) calculatePricing(currentGuestCount);
  }

  // MENU SELECTION LOGIC - NOW WITH COMPLETE MENU
  async function loadMenuForManualSelection() {
    renderSimplifiedMenuCategories(COMPLETE_MENU_DATA);
  }
  
  function renderSimplifiedMenuCategories(menuData) {
    const container = document.getElementById('menuCategories');
    container.innerHTML = '';
    
    // Add info message
    const infoDiv = document.createElement('div');
    infoDiv.className = 'mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg';
    infoDiv.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-blue-600 text-xl">ℹ️</span>
        <div>
          <p class="font-bold text-blue-800">Sélection du menu</p>
          <p class="text-blue-600 text-sm">
            Choisissez vos plats parmi notre carte complète (${getTotalMenuItems()} plats disponibles). 
            Pour une configuration avancée, utilisez le <a href="menu.html" class="underline font-semibold">configurateur complet</a>.
          </p>
          <div class="mt-2 text-sm">
            <strong>Sélection actuelle:</strong> 
            <span id="currentSelectionCount">0</span>/<span id="maxSelectionDisplay">∞</span> plats
          </div>
        </div>
      </div>
    `;
    container.appendChild(infoDiv);
    
    menuData.categories.forEach(cat => {
      const div = document.createElement('div');
      div.className = 'mb-8';
      const h = document.createElement('h4');
      h.className = 'font-bold text-lg mb-4 text-gold flex items-center gap-2';
      h.innerHTML = `${cat.nom} <span class="text-sm font-normal text-gray-500">(${cat.elements.length} plats)</span>`;
      div.appendChild(h);
      const grid = document.createElement('div');
      grid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-4';
      cat.elements.forEach(el => {
        const key = `${cat.nom}::${el.nom}`;
        const card = document.createElement('div');
        card.className = 'menu-item-card p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gold transition-all';
        card.setAttribute('data-key', key);
        card.innerHTML = `
          <h5 class="font-semibold mb-2">${el.nom}</h5>
          <p class="text-sm text-gray-600 mb-3">${el.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">Cliquez pour sélectionner</span>
            <span class="selection-indicator hidden text-gold font-bold">✓ Sélectionné</span>
          </div>
        `;
        card.addEventListener('click',() => toggleManualMenuItemSelection(card, key));
        grid.appendChild(card);
      });
      div.appendChild(grid);
      container.appendChild(div);
    });
    updateManualMenuDisplay();
  }
  
  function getTotalMenuItems() {
    return COMPLETE_MENU_DATA.categories.reduce((total, cat) => total + cat.elements.length, 0);
  }
  
  function toggleManualMenuItemSelection(card,key) {
    if(selectedMenuItems.has(key)) {
      selectedMenuItems.delete(key); 
      card.classList.remove('selected'); 
      card.querySelector('.selection-indicator').classList.add('hidden');
    } else {
      if(maxSelectionLimit !== Infinity && selectedMenuItems.size >= maxSelectionLimit) {
        alert(`Limite atteinte ! Vous ne pouvez sélectionner que ${maxSelectionLimit} plats maximum avec la ${currentFormule.name}.`); 
        return;
      }
      selectedMenuItems.add(key); 
      card.classList.add('selected'); 
      card.querySelector('.selection-indicator').classList.remove('hidden');
    }
    updateManualMenuDisplay(); 
    updateSelectionCounters();
  }
  
  function updateManualMenuDisplay() {
    document.querySelectorAll('.menu-item-card').forEach(card => {
      const key = card.getAttribute('data-key');
      if (selectedMenuItems.has(key)) { 
        card.classList.add('selected'); 
        card.querySelector('.selection-indicator').classList.remove('hidden');
      } else { 
        card.classList.remove('selected'); 
        card.querySelector('.selection-indicator').classList.add('hidden');
      }
      if(maxSelectionLimit !== Infinity && selectedMenuItems.size >= maxSelectionLimit && !selectedMenuItems.has(key)) {
        card.classList.add('disabled','opacity-50','cursor-not-allowed');
      } else {
        card.classList.remove('disabled','opacity-50','cursor-not-allowed');
      }
    });
  }
  
  function updateSelectionCounters() {
    const currentEl = document.getElementById('currentSelection');
    const currentCountEl = document.getElementById('currentSelectionCount');
    const maxEl = document.getElementById('maxSelection');
    const maxDisplayEl = document.getElementById('maxSelectionDisplay');
    
    if (currentEl) currentEl.textContent = selectedMenuItems.size;
    if (currentCountEl) currentCountEl.textContent = selectedMenuItems.size;
    if (maxEl) maxEl.textContent = maxSelectionLimit === Infinity ? '∞' : maxSelectionLimit;
    if (maxDisplayEl) maxDisplayEl.textContent = maxSelectionLimit === Infinity ? '∞' : maxSelectionLimit;
  }

  // Summary
  function generateQuoteSummary() {
    let form = document.getElementById('quoteForm');
    let formData = new FormData(form);
    let summary = document.getElementById('quoteSummary');
    let itemsArr = Array.from(selectedMenuItems);
    let html = `<div class="grid md:grid-cols-2 gap-6"><div class="space-y-4"><div><h5 class="font-semibold mb-2">📅 Événement</h5>
      <p><strong>Type:</strong> ${formData.get('event_type') || ''}</p><p><strong>Date:</strong> ${formData.get('event_date') || ''}</p>
      <p><strong>Invités:</strong> ${formData.get('guests_count') || ''}</p><p><strong>Lieu:</strong> ${formData.get('event_location') || ''}</p></div><div><h5 class="font-semibold mb-2">👤 Contact</h5>
      <p><strong>Nom:</strong> ${formData.get('client_name') || ''}</p><p><strong>Téléphone:</strong> ${formData.get('client_phone') || ''}</p><p><strong>Email:</strong> ${formData.get('client_email') || ''}</p></div></div><div><h5 class="font-semibold mb-2">💎 Formule sélectionnée</h5><div class="p-3 bg-gold/10 rounded-lg mb-4">
      <p class="font-bold text-gold">${currentFormule ? currentFormule.name : ''}</p><p class="text-sm">${currentFormule ? currentFormule.price : ''}$ par personne</p></div>
      <h5 class="font-semibold mb-2">🍽 Menu sélectionné (${itemsArr.length} plats)</h5><div class="max-h-40 overflow-y-auto space-y-1">${itemsArr.length>0?itemsArr.map(k=>{ let[cat,item]=k.split('::'); return `<div class="text-sm p-2 bg-gray-50 rounded"><strong>${item}</strong><span class="text-gray-500"> (${cat})</span></div>`; }).join(''): '<p class="text-gray-500 text-sm italic">Aucun plat spécifiquement sélectionné</p>'}</div>
      ${formData.get('cocktail_service')?'<p class="mt-2 text-green-600"><strong>✅ Service cocktail inclus</strong></p>':''}
      ${formData.get('dietary_requirements')?`<p class="mt-2"><strong>Contraintes:</strong> ${formData.get('dietary_requirements')}</p>`:''}
      ${formData.get('personal_message')?`<p class="mt-2"><strong>Message:</strong> ${formData.get('personal_message')}</p>`:''}</div></div>`;
    summary.innerHTML = html;
    let estimationDiv = document.getElementById('estimationDetails');
    let estimatedTotal = document.getElementById('estimatedTotalField').value;
    estimationDiv.innerHTML = `<div class="text-2xl font-bold text-gold mb-2">${estimatedTotal}$</div><p class="text-sm text-gray-600">Prix estimé pour ${formData.get('guests_count')} personnes</p>`;
  }

  // Form validation and WhatsApp send
  function initializeFormValidation() {
    let form = document.getElementById('quoteForm');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateCurrentStep()) return;
      let consentContact = form.querySelector('input[name="consent_contact"]');
      let consentPrivacy = form.querySelector('input[name="consent_privacy"]');
      if (!consentContact.checked || !consentPrivacy.checked) { alert('Veuillez accepter les conditions.'); return; }
      let formData = new FormData(form);
      let menuSelection = {
        items: Array.from(selectedMenuItems),
        count: selectedMenuItems.size,
        maxAllowed: maxSelectionLimit,
        formule: currentFormule
      };
      formData.set('menu_selection', JSON.stringify(menuSelection));
      sendViaWhatsApp(formData);
    });
  }
  
  function sendViaWhatsApp(formData) {
    const message = formatWhatsAppMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/243859993833?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    showSuccessMessage();
  }
  
  function formatWhatsAppMessage(formData) {
    const selectedItemsArray = Array.from(selectedMenuItems);
    return `⭐ DEMANDE DE DEVIS - ARABESQUE TRAITEUR ⭐

📅 ÉVÉNEMENT
• Type: ${formData.get('event_type')}
• Date: ${formData.get('event_date')}
• Lieu: ${formData.get('event_location')}
• Invités: ${formData.get('guests_count')} personnes
• Heure: ${formData.get('event_time') || 'Non précisée'}

👤 MES COORDONNÉES
• Nom: ${formData.get('client_name')}
• Téléphone: ${formData.get('client_phone')}
• Email: ${formData.get('client_email')}

💎 FORMULE SÉLECTIONNÉE
• ${currentFormule ? currentFormule.name : ''} (${currentFormule ? currentFormule.price : ''}$ par personne)
• ${currentFormule ? currentFormule.maxDishes : ''} plats maximum

🍽 MENU SÉLECTIONNÉ (${selectedItemsArray.length} plats)
${selectedItemsArray.length > 0 ? selectedItemsArray.map(key => {
  const [category, item] = key.split('::');
  return `• ${item} (${category})`;
}).join('\n') : '• Sélection selon recommandations du chef'}

${formData.get('cocktail_service') ? '🍹 SERVICE COCKTAIL SOUHAITÉ ✅\n' : ''}${formData.get('dietary_requirements') ? `🥗 CONTRAINTES ALIMENTAIRES: ${formData.get('dietary_requirements')}\n` : ''}💰 Budget: ${formData.get('budget_range') || 'Non précisé'}
💰 Estimation: ${formData.get('estimated_total')}$ (estimation automatique)

📝 MESSAGE: ${formData.get('personal_message') || 'Aucun message supplémentaire'}

Merci pour votre service d'exception! 🙏`;
  }
  
  function showSuccessMessage() {
    document.getElementById('formSuccess').classList.remove('hidden');
    document.getElementById('quoteForm').style.display='none';
    localStorage.removeItem('arabesqueQuoteData');
    setTimeout(()=>{document.getElementById('formSuccess').scrollIntoView({behavior:'smooth'});}, 400);
  }

  // Public API for debugging
  window.ArabesqueContact = {
    initialized: true,
    getCurrentFormule: () => currentFormule,
    getCurrentGuestCount: () => currentGuestCount,
    getMaxSelectionLimit: () => maxSelectionLimit,
    getSelectedItems: () => Array.from(selectedMenuItems),
    getTotalMenuItems: getTotalMenuItems
  };

})();
