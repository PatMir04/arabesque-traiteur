// assets/js/contact.js - Arabesque Traiteur COMPLETE MODERN IMPLEMENTATION
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
          <span class="font-bold">${menuTotal}$ (${currentFormule.price}$ \u00D7 ${currentGuestCount})</span>
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

  // MENU SELECTION LOGIC
  async function loadMenuForManualSelection() {
    // Minimal mock menu for demo
    const menuData = {
      categories:[
        {id:'specialites', nom:'Spécialités', elements:[{id:'pondu',nom:'Pondu'},{id:'maboke',nom:"Maboke ngulu"}]},
        {id:'viandes', nom:"Viandes", elements:[{id:'boeuf',nom:'Brochette boeuf'}, {id:'poulet',nom:'Poulet braisé'}]}
      ]
    };
    renderSimplifiedMenuCategories(menuData);
  }
  function renderSimplifiedMenuCategories(menuData) {
    const container = document.getElementById('menuCategories');
    container.innerHTML = '';
    menuData.categories.forEach(cat => {
      const div = document.createElement('div');
      div.className = 'mb-8';
      const h = document.createElement('h4');
      h.className = 'font-bold text-lg mb-4 text-gold';
      h.textContent = cat.nom;
      div.appendChild(h);
      const grid = document.createElement('div');
      grid.className = 'grid md:grid-cols-2 gap-4';
      cat.elements.forEach(el => {
        const key = `${cat.nom}::${el.nom}`;
        const card = document.createElement('div');
        card.className = 'menu-item-card p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gold';
        card.setAttribute('data-key', key);
        card.innerHTML = `<h5 class="font-semibold mb-2">${el.nom}</h5><span class="selection-indicator hidden text-gold font-bold">✓ Sélectionné</span>`;
        card.addEventListener('click',() => toggleManualMenuItemSelection(card, key));
        grid.appendChild(card);
      });
      div.appendChild(grid);
      container.appendChild(div);
    });
    updateManualMenuDisplay();
  }
  function toggleManualMenuItemSelection(card,key) {
    if(selectedMenuItems.has(key)) {
      selectedMenuItems.delete(key); card.classList.remove('selected'); card.querySelector('.selection-indicator').classList.add('hidden');
    } else {
      if(maxSelectionLimit !== Infinity && selectedMenuItems.size >= maxSelectionLimit) {
        alert(`Limite atteinte ! Vous ne pouvez sélectionner que ${maxSelectionLimit} plats.`); return;
      }
      selectedMenuItems.add(key); card.classList.add('selected'); card.querySelector('.selection-indicator').classList.remove('hidden');
    }
    updateManualMenuDisplay(); updateSelectionCounters();
  }
  function updateManualMenuDisplay() {
    document.querySelectorAll('.menu-item-card').forEach(card => {
      const key = card.getAttribute('data-key');
      if (selectedMenuItems.has(key)) { card.classList.add('selected'); card.querySelector('.selection-indicator').classList.remove('hidden');}
      else { card.classList.remove('selected'); card.querySelector('.selection-indicator').classList.add('hidden');}
      if(maxSelectionLimit !== Infinity && selectedMenuItems.size >= maxSelectionLimit && !selectedMenuItems.has(key)) {
        card.classList.add('disabled','opacity-50','cursor-not-allowed');
      } else {
        card.classList.remove('disabled','opacity-50','cursor-not-allowed');
      }
    });
    document.getElementById('currentSelectionCount').textContent = selectedMenuItems.size;
  }
  function updateSelectionCounters() {
    document.getElementById('currentSelection').textContent = selectedMenuItems.size;
    document.getElementById('currentSelectionDisplay').textContent = maxSelectionLimit===Infinity ? '∞' : maxSelectionLimit;
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
      <h5 class="font-semibold mb-2">🍽 Menu sélectionné (${itemsArr.length} plats)</h5><div class="max-h-40 overflow-y-auto space-y-1">${itemsArr.length>0?itemsArr.map(k=>{ let[cat,item]=k.split('::'); return `<div class="text-sm p-2 bg-gray-50 rounded"><strong>${item}</strong><span class="text-gray-500"> (${cat})</span></div>`; }).join(''): '<p class="text-gray-500 text-sm italic">Aucun plat sélectionné</p>'}</div>
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
    return `⭐ DEMANDE DE DEVIS - ARABESQUE TRAITEUR ⭐\n\n📅 EVENEMENT\n• Type: ${formData.get('event_type')}\n• Date: ${formData.get('event_date')}\n• Lieu: ${formData.get('event_location')}\n• Invites: ${formData.get('guests_count')} personnes\n\n💎 FORMULE SELECTIONNEE\n• ${currentFormule ? currentFormule.name : ''} (${currentFormule ? currentFormule.price : ''}$ par personne)\n• ${currentFormule ? currentFormule.maxDishes : ''} plats max\n\n🍽 MENU\n${Array.from(selectedMenuItems).map(k=>{let[cat,item]=k.split('::');return`• ${item} (${cat})`;}).join('\n')}\n${formData.get('cocktail_service')?'🍹 Service cocktail inclus\n':''}\n${formData.get('dietary_requirements')?`Contraintes: ${formData.get('dietary_requirements')}`:''}\n💰 Estimation: ${formData.get('estimated_total')}$ (auto)\n📝 Message: ${formData.get('personal_message')||''}`;
  }
  function showSuccessMessage() {
    document.getElementById('formSuccess').classList.remove('hidden');
    document.getElementById('quoteForm').style.display='none';
    localStorage.removeItem('arabesqueQuoteData');
    setTimeout(()=>{document.getElementById('formSuccess').scrollIntoView({behavior:'smooth'});}, 400);
  }
})();
