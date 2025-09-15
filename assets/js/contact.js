// CONTACT FORM Arabesque Traiteur (version Option A, clean, no legacy)
// Place after other scripts; this version is self-contained and override-safe

document.addEventListener('DOMContentLoaded', () => {
  ATContact.initialize();
});

// Namespace to prevent conflicts
window.ATContact = {
  currentStep: 1,
  selectedMenuItems: new Set(),
  maxSelectionLimit: Infinity,
  currentFormule: null,
  detectedQuoteData: null,
  availableFormules: [],
  initialize() {
    this.initFormules();
    this.loadMenuSelectionFromStorage();
    this.initFormSteps();
    this.initPricingCalculator();
    this.initFormValidation();
    if (!this.detectedQuoteData) {
      this.loadMenuForManualSelection();
    }
  },
  initFormules() {
    // Only actual, used formules (names, price, dish limits)
    this.availableFormules = [
      {id:'intime', nom:'Formule Intime', prix:35, nombre_repas:14, description:'1-50 personnes - Service personnalisé, 14 plats max',badge:'INTIME',color:'rose'},
      {id:'essentielle', nom:'Formule Essentielle', prix:20, nombre_repas:18, description:'50-100 personnes - 18 plats max',badge:'ESSENTIELLE',color:'green'},
      {id:'optimale', nom:'Formule Optimale', prix:25, nombre_repas:20, description:'50-100 personnes - 20 plats max',badge:'OPTIMALE',color:'blue'},
      {id:'premium', nom:'Formule Premium', prix:30, nombre_repas:24, description:'100+ personnes - 24 plats max',badge:'PREMIUM',color:'purple'},
      {id:'excellence', nom:'Formule Excellence', prix:35, nombre_repas:28, description:'100+ personnes - 28 plats max',badge:'EXCELLENCE',color:'amber'},
      {id:'vip', nom:'Formule VIP', prix:40, nombre_repas:32, description:'100+ personnes - 32 plats max',badge:'VIP',color:'gold'}
    ];
    // Set default
    this.currentFormule = this.availableFormules[0];
    this.maxSelectionLimit = this.currentFormule.nombre_repas || Infinity;
  },
  loadMenuSelectionFromStorage() {
    try {
      const stored = localStorage.getItem('arabesqueQuoteData');
      if (!stored) return;
      this.detectedQuoteData = JSON.parse(stored);
      if (!this.detectedQuoteData.selections || !this.detectedQuoteData.formule) {
        this.detectedQuoteData = null;
        return;
      }
      this.displayDetectedMenu(this.detectedQuoteData);
      this.currentFormule = this.detectedQuoteData.formule;
      this.maxSelectionLimit = this.currentFormule.nombre_repas || Infinity;
      this.detectedQuoteData.selections.forEach(i => this.selectedMenuItems.add(i.key));
      this.updateSelectionCounters();
    } catch (e) {
      this.detectedQuoteData = null;
    }
  },
  displayDetectedMenu(quoteData) {
    const div = document.getElementById('detectedMenu');
    if (!div) return;
    div.innerHTML = `
      <div class="bg-green-50 border border-green-200 rounded-lg p-6">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span class="text-white text-xl">✓</span>
            </div>
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-green-800 text-lg mb-2">Menu configuré automatiquement récupéré</h4>
            <div class="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-green-700 font-semibold">${quoteData.formule.nom}</p>
                <p class="text-green-600 text-sm">${quoteData.formule.prix}$ par personne</p>
                <p class="text-green-600 text-sm">
                  ${quoteData.formule.nombre_repas ? `${quoteData.formule.nombre_repas} plats maximum` : 'Choix illimité'}
                </p>
              </div>
              <div>
                <p class="text-green-700 font-semibold">${quoteData.selections.length} plats sélectionnés</p>
              </div>
            </div>
            <div class="mb-4">
              <h5 class="font-semibold text-green-800 mb-2">Plats sélectionnés :</h5>
              <div class="grid md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                ${quoteData.selections.map(item => `
                  <div class="flex items-center gap-2 text-sm">
                    <span class="font-medium text-green-900">${item.itemName}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <button type="button" class="btn bg-green-600 hover:bg-green-700 text-white"
                onclick="ATContact.keepDetectedMenu()">✓ Utiliser cette sélection</button>
              <button type="button" class="btn btn-outline border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
                onclick="ATContact.clearDetectedMenuAndChooseManually()">🔄 Choisir manuellement</button>
            </div>
          </div>
        </div>
      </div>`;
    div.classList.remove('hidden');
    const manual = document.getElementById('manualMenuSelection');
    if (manual) manual.style.display = 'none';
  },
  keepDetectedMenu() {
    this.updateSelectionCounters();
    const guestsInput = document.querySelector('input[name="guests_count"]');
    if (guestsInput && guestsInput.value) this.calculatePricing(Number(guestsInput.value));
  },
  clearDetectedMenuAndChooseManually() {
    localStorage.removeItem('arabesqueQuoteData');
    this.detectedQuoteData = null;
    this.selectedMenuItems.clear();
    this.currentFormule = this.availableFormules[0];
    this.maxSelectionLimit = this.currentFormule.nombre_repas || Infinity;
    const detectedMenuDiv = document.getElementById('detectedMenu');
    if (detectedMenuDiv) detectedMenuDiv.classList.add('hidden');
    const manualSelection = document.getElementById('manualMenuSelection');
    if (manualSelection) manualSelection.style.display = 'block';
    this.renderFormuleSelector();
    this.loadMenuForManualSelection();
    this.updateSelectionCounters();
  },
  renderFormuleSelector() {
    const menuCategories = document.getElementById('menuCategories');
    if (!menuCategories) return;
    if (document.getElementById('formuleSelector')) return;
    const formuleSelector = document.createElement('div');
    formuleSelector.className = 'mb-8 p-6 bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl border border-gold/20';
    formuleSelector.id = 'formuleSelector';
    formuleSelector.innerHTML = `
      <h4 class="font-bold text-xl mb-4 text-center">💎 Choisissez votre formule</h4>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${this.availableFormules.map((formule, idx) => `
          <label class="formule-option cursor-pointer">
            <input type="radio" name="selected_formule" value="${formule.id}" ${idx === 0 ? 'checked' : ''} class="sr-only">
            <div class="formule-card p-4 border-2 border-gray-200 rounded-xl transition-all hover:shadow-lg
              ${idx === 0 ? 'border-gold bg-gold/10' : ''}">
              <div class="text-center mb-3">
                <span class="inline-block px-2 py-1 text-xs font-bold rounded-full mb-2 bg-gray-200 text-gray-700">
                  ${formule.badge}
                </span>
                <h5 class="font-bold text-lg">${formule.nom}</h5>
                <div class="text-2xl font-bold text-gold mt-2">${formule.prix}$</div>
                <div class="text-sm text-gray-500">par personne</div>
              </div>
              <div class="text-center mb-3">
                <div class="font-semibold">
                  ${formule.nombre_repas ? `${formule.nombre_repas} repas max` : 'Choix illimité'}
                </div>
              </div>
              <p class="text-xs text-gray-600 text-center leading-relaxed">
                ${formule.description}
              </p>
            </div>
          </label>
        `).join('')}
      </div>
    `;
    menuCategories.insertBefore(formuleSelector, menuCategories.firstChild);
    document.querySelectorAll('input[name="selected_formule"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          const selec = this.availableFormules.find(f => f.id === radio.value);
          this.selectFormule(selec);
          this.updateFormuleDisplay();
        }
      });
    });
  },
  selectFormule(formule) {
    this.currentFormule = formule;
    this.maxSelectionLimit = formule.nombre_repas || Infinity;
    this.enforceSelectionLimit();
    this.updateSelectionCounters();
    this.updateManualMenuDisplay();
    const guestsInput = document.querySelector('input[name="guests_count"]');
    if (guestsInput && guestsInput.value) this.calculatePricing(Number(guestsInput.value));
  },
  updateFormuleDisplay() {
    document.querySelectorAll('.formule-card').forEach(card => {
      const radio = card.parentElement.querySelector('input[type="radio"]');
      const badge = card.querySelector('span');
      if (radio.checked) {
        card.classList.add('border-gold', 'bg-gold/10');
        card.classList.remove('border-gray-200');
        badge.classList.add('bg-gold', 'text-black');
        badge.classList.remove('bg-gray-200', 'text-gray-700');
      } else {
        card.classList.remove('border-gold', 'bg-gold/10');
        card.classList.add('border-gray-200');
        badge.classList.remove('bg-gold', 'text-black');
        badge.classList.add('bg-gray-200', 'text-gray-700');
      }
    });
  },
  enforceSelectionLimit() {
    if (this.maxSelectionLimit === Infinity) return;
    if (this.selectedMenuItems.size > this.maxSelectionLimit) {
      const itemsArray = Array.from(this.selectedMenuItems);
      this.selectedMenuItems.clear();
      itemsArray.slice(0, this.maxSelectionLimit).forEach(item => this.selectedMenuItems.add(item));
      this.updateManualMenuDisplay();
    }
  },
  async loadMenuForManualSelection() {
    const paths = ['./data/menu.json', 'data/menu.json', '/data/menu.json', 'menu.json'];
    let menuData = null;
    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (!response.ok) continue;
        menuData = await response.json();
        break;
      } catch {}
    }
    if (!menuData) menuData = this.createSimplifiedMenuData();
    if (!this.detectedQuoteData) this.renderFormuleSelector();
    this.renderSimplifiedMenuCategories(menuData);
  },
  createSimplifiedMenuData() {
    return {
      categories: [
        {
          id: 'specialites',
          nom: '🇨🇩 Spécialités Congolaises',
          elements: [
            { id: 'pondu', nom: 'Pondu', description: 'Feuilles de manioc pilées, plat emblématique' },
            { id: 'maboke-ngulu', nom: 'Maboke y\'a Ngulu', description: 'Porc fumé traditionnel' },
            { id: 'nga-nda', nom: 'Viande de Chèvre façon Nga Nda', description: 'Tradition ancestrale' },
            { id: 'capitaine-braise', nom: 'Gros Capitaine Braisé', description: 'Poisson du fleuve Congo' }
          ]
        },
        {
          id: 'viandes',
          nom: '🥩 Viandes & Grillades',
          elements: [
            { id: 'cochon-lait', nom: 'Cochon de Lait Farci', description: 'Tendre et savoureux' },
            { id: 'brochette-boeuf', nom: 'Brochette de Bœuf', description: 'Marinade maison' },
            { id: 'poulet-braise', nom: 'Poulet Braisé', description: 'Sauce tomate épicée' }
          ]
        },
        {
          id: 'poissons',
          nom: '🐟 Poissons & Fruits de Mer',
          elements: [
            { id: 'tilapia-braise', nom: 'Tilapia Braisé', description: 'Poisson frais braisé aux épices' },
            { id: 'crevettes', nom: 'Crevettes Sautées', description: 'Crevettes à l\'ail et herbes' }
          ]
        },
        {
          id: 'accompagnements',
          nom: '🍚 Accompagnements',
          elements: [
            { id: 'fufu', nom: 'Fufu', description: 'Pâte de manioc traditionnelle' },
            { id: 'riz-blanc', nom: 'Riz Blanc', description: 'Cuit à la vapeur' },
            { id: 'makemba', nom: 'Makemba', description: 'Bananes plantain' }
          ]
        }
      ]
    };
  },
  renderSimplifiedMenuCategories(menuData) {
    const container = document.getElementById('menuCategories');
    if (!container) return;
    if (!document.getElementById('formuleSelector')) {
      const infoDiv = document.createElement('div');
      infoDiv.className = 'mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg';
      infoDiv.innerHTML = `<div class="flex items-center gap-3"><span class="text-blue-600 text-xl">ℹ️</span>
        <div><p class="font-bold text-blue-800">Sélection manuelle</p>
        <p class="text-blue-600 text-sm">Choisissez vos plats. Pour plus de choix, utilisez le <a href="menu.html" class="underline font-semibold">configurateur complet</a>.</p>
        </div></div>`;
      container.appendChild(infoDiv);
    }
    menuData.categories.forEach(category => {
      const catDiv = document.createElement('div');
      catDiv.className = 'mb-8';
      const header = document.createElement('h4');
      header.className = 'font-bold text-lg mb-4 text-gold flex items-center gap-2';
      header.innerHTML = `${category.nom} <span class="text-sm font-normal text-gray-500">(${category.elements.length} plats)</span>`;
      const grid = document.createElement('div');
      grid.className = 'grid md:grid-cols-2 gap-4';
      category.elements.forEach(element => {
        const key = `${category.nom}::${element.nom}`;
        const card = document.createElement('div');
        card.className = 'menu-item-card p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gold transition-all';
        card.setAttribute('data-key', key);
        card.innerHTML = `<h5 class="font-semibold mb-2">${element.nom}</h5>
          <p class="text-sm text-gray-600 mb-3">${element.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">Cliquez pour sélectionner</span>
            <span class="selection-indicator hidden text-gold font-bold">✓ Sélectionné</span>
          </div>`;
        card.addEventListener('click', () => this.toggleManualMenuItemSelection(card, key));
        grid.appendChild(card);
      });
      catDiv.appendChild(header);
      catDiv.appendChild(grid);
      container.appendChild(catDiv);
    });
    this.updateManualMenuDisplay();
  },
  toggleManualMenuItemSelection(card, key) {
    if (this.selectedMenuItems.has(key)) {
      this.selectedMenuItems.delete(key);
      card.classList.remove('selected');
      card.querySelector('.selection-indicator').classList.add('hidden');
    } else {
      if (this.maxSelectionLimit !== Infinity && this.selectedMenuItems.size >= this.maxSelectionLimit) {
        alert(`Limite atteinte ! Vous ne pouvez sélectionner que ${this.maxSelectionLimit} plats maximum avec la ${this.currentFormule.nom}.`);
        return;
      }
      this.selectedMenuItems.add(key);
      card.classList.add('selected');
      card.querySelector('.selection-indicator').classList.remove('hidden');
    }
    this.updateManualMenuDisplay();
    this.updateSelectionCounters();
  },
  updateManualMenuDisplay() {
    document.querySelectorAll('.menu-item-card').forEach(card => {
      const key = card.getAttribute('data-key');
      if (this.selectedMenuItems.has(key)) {
        card.classList.add('selected');
        card.querySelector('.selection-indicator').classList.remove('hidden');
      } else {
        card.classList.remove('selected');
        card.querySelector('.selection-indicator').classList.add('hidden');
      }
      if (
        this.maxSelectionLimit !== Infinity &&
        this.selectedMenuItems.size >= this.maxSelectionLimit &&
        !this.selectedMenuItems.has(key)
      ) {
        card.classList.add('disabled', 'opacity-50', 'cursor-not-allowed');
      } else {
        card.classList.remove('disabled', 'opacity-50', 'cursor-not-allowed');
      }
    });
  },
  updateSelectionCounters() {
    const curSel = document.getElementById('currentSelection');
    const maxSel = document.getElementById('maxSelection');
    if (curSel) curSel.textContent = this.selectedMenuItems.size;
    if (maxSel) maxSel.textContent = this.maxSelectionLimit === Infinity ? '∞' : this.maxSelectionLimit;
  },
  initFormSteps() {
    document.querySelectorAll('.next-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = parseInt(btn.dataset.next);
        if (this.validateCurrentStep()) {
          this.showStep(next);
          this.updateProgressBar(next);
        }
      });
    });
    document.querySelectorAll('.prev-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const prev = parseInt(btn.dataset.prev);
        this.showStep(prev);
        this.updateProgressBar(prev);
      });
    });
  },
  showStep(stepNumber) {
    this.currentStep = stepNumber;
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    const curr = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (curr) curr.classList.add('active');
    document.querySelectorAll('.step-indicator').forEach((ind, idx) => {
      ind.classList.remove('active', 'completed');
      if (idx + 1 === stepNumber) ind.classList.add('active');
      else if (idx + 1 < stepNumber) ind.classList.add('completed');
    });
    if (stepNumber === 4) this.generateQuoteSummary();
    document.getElementById('formulaire-devis').scrollIntoView({behavior: 'smooth', block: 'start'});
  },
  updateProgressBar(step) {
    const fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width = `${(step / 4) * 100}%`;
  },
  validateCurrentStep() {
    const curr = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    const requiredFields = curr ? curr.querySelectorAll('[required]') : [];
    let isValid = true;
    requiredFields.forEach(field => {
      const errorDiv = field.parentElement.querySelector('.form-error');
      if (!field.value.trim()) {
        field.style.borderColor = '#dc2626';
        if (errorDiv) errorDiv.textContent = 'Ce champ est requis';
        isValid = false;
      } else {
        field.style.borderColor = '#d1d5db';
        if (errorDiv) errorDiv.textContent = '';
      }
    });
    return isValid;
  },
  initPricingCalculator() {
    const guestsInput = document.querySelector('input[name="guests_count"]');
    if (!guestsInput) return;
    const refresh = () => {
      const n = Number(guestsInput.value) || 0;
      this.calculatePricing(n);
    };
    guestsInput.addEventListener('input', refresh);
    guestsInput.addEventListener('change', refresh);
    const cocktailCheckbox = document.getElementById('cocktailService');
    if (cocktailCheckbox) {
      cocktailCheckbox.addEventListener('change', () => {
        const details = document.getElementById('cocktailDetails');
        if (details) details.classList.toggle('hidden', !cocktailCheckbox.checked);
        refresh();
      });
    }
    refresh();
  },
  calculatePricing(guestCount) {
    const pricingPreview = document.getElementById('pricingPreview');
    if (guestCount === 0) {
      if (pricingPreview) pricingPreview.classList.add('hidden');
      return;
    }
    const basePrice = this.currentFormule.prix;
    const menuTotal = basePrice * guestCount;
    let cocktailPrice = 0;
    const cocktailService = document.getElementById('cocktailService');
    if (cocktailService && cocktailService.checked) {
      if (guestCount < 55) cocktailPrice = 500;
      else if (guestCount < 105) cocktailPrice = 750;
      else if (guestCount < 155) cocktailPrice = 900;
      else cocktailPrice = 1200;
    }
    const total = menuTotal + cocktailPrice;
    const detailsDiv = document.getElementById('pricingDetails');
    if (detailsDiv) {
      detailsDiv.innerHTML = `
        <div class="text-sm space-y-2">
          <div class="flex justify-between">
            <span>${this.currentFormule.nom}</span>
            <span class="font-bold">${menuTotal}$ (${basePrice}$ × ${guestCount})</span>
          </div>
          ${cocktailPrice > 0 ? `
            <div class="flex justify-between">
              <span>Service cocktail</span>
              <span class="font-bold">${cocktailPrice}$</span>
            </div>
          ` : ''}
          <hr class="border-gold/30">
          <div class="flex justify-between text-lg font-bold text-gold">
            <span>Total estimé</span>
            <span>${total}$</span>
          </div>
        </div>
      `;
      if (pricingPreview) pricingPreview.classList.remove('hidden');
      const estimatedTotalField = document.getElementById('estimatedTotalField');
      if (estimatedTotalField) estimatedTotalField.value = total;
    }
  },
  generateQuoteSummary() {
    const form = document.getElementById('quoteForm');
    const formData = new FormData(form);
    const summary = document.getElementById('quoteSummary');
    const selectedItemsArray = Array.from(this.selectedMenuItems);
    if (!summary) return;
    summary.innerHTML = `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <h5 class="font-semibold mb-2">📅 Événement</h5>
            <p><strong>Type:</strong> ${formData.get('event_type')}</p>
            <p><strong>Date:</strong> ${formData.get('event_date')}</p>
            <p><strong>Invités:</strong> ${formData.get('guests_count')}</p>
            <p><strong>Lieu:</strong> ${formData.get('event_location')}</p>
          </div>
          <div>
            <h5 class="font-semibold mb-2">👤 Contact</h5>
            <p><strong>Nom:</strong> ${formData.get('client_name')}</p>
            <p><strong>Téléphone:</strong> ${formData.get('client_phone')}</p>
            <p><strong>Email:</strong> ${formData.get('client_email')}</p>
          </div>
        </div>
        <div>
          <h5 class="font-semibold mb-2">💎 Formule sélectionnée</h5>
          <div class="p-3 bg-gold/10 rounded-lg mb-4">
            <p class="font-bold text-gold">${this.currentFormule.nom}</p>
            <p class="text-sm">${this.currentFormule.prix}$ par personne</p>
            <p class="text-xs text-gray-600">${this.currentFormule.description}</p>
          </div>
          <h5 class="font-semibold mb-2">🍽 Menu sélectionné (${selectedItemsArray.length} plats)</h5>
          <div class="max-h-40 overflow-y-auto space-y-1">
            ${selectedItemsArray.length > 0
              ? selectedItemsArray.map(key => {
                  const [category, item] = key.split('::');
                  return `<div class="text-sm p-2 bg-gray-50 rounded"><strong>${item}</strong><span class="text-gray-500"> (${category})</span></div>`;
                }).join('')
              : '<p class="text-gray-500 text-sm italic">Aucun plat spécifiquement sélectionné</p>'}
          </div>
          ${formData.get('cocktail_service') ? '<p class="mt-2 text-green-600"><strong>✅ Service cocktail inclus</strong></p>' : ''}
          ${formData.get('dietary_requirements') ? `<p class="mt-2"><strong>Contraintes:</strong> ${formData.get('dietary_requirements')}</p>` : ''}
          ${formData.get('personal_message') ? `<p class="mt-2"><strong>Message:</strong> ${formData.get('personal_message')}</p>` : ''}
        </div>
      </div>
    `;
    const estimationDiv = document.getElementById('estimationDetails');
    const estimatedTotal = document.getElementById('estimatedTotalField').value;
    if (estimationDiv && estimatedTotal) {
      estimationDiv.innerHTML = `
        <div class="text-2xl font-bold text-gold mb-2">${estimatedTotal}$</div>
        <p class="text-sm text-gray-600">Prix estimé pour ${formData.get('guests_count')} personnes</p>
      `;
    }
  },
  initFormValidation() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.validateCurrentStep()) return;
      const consentContact = form.querySelector('input[name="consent_contact"]');
      const consentPrivacy = form.querySelector('input[name="consent_privacy"]');
      if (!consentContact.checked || !consentPrivacy.checked) {
        alert('Veuillez accepter les conditions de contact et la politique de confidentialité.');
        return;
      }
      const formData = new FormData(form);
      const menuSelection = {
        items: Array.from(this.selectedMenuItems),
        count: this.selectedMenuItems.size,
        maxAllowed: this.maxSelectionLimit,
        source: this.detectedQuoteData ? 'menu_configurator' : 'manual_selection',
        formule: this.currentFormule
      };
      formData.set('menu_selection', JSON.stringify(menuSelection));
      this.sendViaWhatsApp(formData);
    });
  },
  sendViaWhatsApp(formData) {
    const selectedItemsArray = Array.from(this.selectedMenuItems);
    const msg = `⭐ DEMANDE DE DEVIS - ARABESQUE TRAITEUR ⭐
📅 EVENEMENT
• Type: ${formData.get('event_type')}
• Date: ${formData.get('event_date')}
• Lieu: ${formData.get('event_location')}
• Invites: ${formData.get('guests_count')} personnes
• Heure: ${formData.get('event_time') || 'Non précise'}
👤 MES COORDONNEES
• Nom: ${formData.get('client_name')}
• Telephone: ${formData.get('client_phone')}
• Email: ${formData.get('client_email')}
💎 FORMULE SELECTIONNEE
• ${this.currentFormule.nom} (${this.currentFormule.prix}$ par personne)
• ${this.currentFormule.nombre_repas ? `${this.currentFormule.nombre_repas} plats maximum` : 'Choix illimité'}
🍽 MENU SELECTIONNE (${selectedItemsArray.length} plats)
${selectedItemsArray.length > 0 ? selectedItemsArray.map(key => {
  const [category, item] = key.split('::');
  return `• ${item} (${category})`;
}).join('\n') : '• Sélection selon recommandations du chef'}
${formData.get('cocktail_service') ? '🍹 SERVICE COCKTAIL SOUHAITE ✅\n' : ''}
${formData.get('dietary_requirements') ? `🥗 CONTRAINTES ALIMENTAIRES: ${formData.get('dietary_requirements')}\n` : ''}
💰 Budget: ${formData.get('budget_range') || 'Non précisé'}
💰 Estimation: ${formData.get('estimated_total')}$ (estimation automatique)
📝 MESSAGE: ${formData.get('personal_message') || 'Aucun message supplémentaire'}
Merci pour votre service d'exception! 🙏`;
    window.open(`https://wa.me/243859993833?text=${encodeURIComponent(msg)}`, '_blank');
    this.showSuccessMessage();
  },
  showSuccessMessage() {
    const successDiv = document.getElementById('formSuccess');
    const form = document.getElementById('quoteForm');
    if (successDiv && form) {
      successDiv.classList.remove('hidden');
      form.style.display = 'none';
      localStorage.removeItem('arabesqueQuoteData');
      successDiv.scrollIntoView({behavior:'smooth',block:'center'});
    }
  }
};
