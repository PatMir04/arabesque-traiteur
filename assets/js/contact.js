// Contact Form JavaScript - Version Enhanced avec Sélection de Formule - COMPLET
document.addEventListener('DOMContentLoaded', function() {
  initializeContactForm();
});

// Variables globales pour le formulaire
let currentStep = 1;
let selectedMenuItems = new Set();
let maxSelectionLimit = Infinity;
let currentFormule = null;
let detectedQuoteData = null;
let availableFormules = [];

function initializeContactForm() {
  console.log('🚀 Initialisation du formulaire de contact...');
  
  // 1. Initialiser les formules disponibles
  initializeFormules();
  
  // 2. Vérifier et charger les données du menu depuis localStorage
  loadMenuSelectionFromStorage();
  
  // 3. Initialiser les étapes du formulaire
  initializeFormSteps();
  
  // 4. Initialiser le calculateur de prix
  initializePricingCalculator();
  
  // 5. Initialiser la validation du formulaire
  initializeFormValidation();
  
  // 6. Charger le menu seulement si pas de sélection détectée
  if (!detectedQuoteData) {
    loadMenuForManualSelection();
  }
  
  console.log('✅ Formulaire de contact initialisé');
}

// NOUVEAU: Initialiser les formules disponibles
function initializeFormules() {
  availableFormules = [
    {
      id: 'intime',
      nom: 'Formule Intime',
      prix: 35,
      nombre_repas: null,
      description: '1-50 personnes - Service personnalisé avec menu libre choix',
      badge: 'INTIME',
      color: 'rose'
    },
    {
      id: 'optimale',
      nom: 'Formule Optimale', 
      prix: 20,
      nombre_repas: null,
      description: '50-100 personnes - Excellent rapport qualité-prix',
      badge: 'POPULAIRE',
      color: 'green'
    },
    {
      id: 'essentielle',
      nom: 'Formule Essentielle',
      prix: 15,
      nombre_repas: 14,
      description: '100+ personnes - 14 repas au choix + salades + fruits',
      badge: 'ÉCONOMIQUE',
      color: 'blue'
    },
    {
      id: 'premium',
      nom: 'Formule Premium',
      prix: 20,
      nombre_repas: 18,
      description: '100+ personnes - 18 repas au choix + salades + fruits',
      badge: 'ÉQUILIBRÉE',
      color: 'purple'
    },
    {
      id: 'excellence',
      nom: 'Formule Excellence',
      prix: 25,
      nombre_repas: 20,
      description: '100+ personnes - 20 repas au choix + salades + fruits',
      badge: 'PRESTIGE',
      color: 'amber'
    },
    {
      id: 'vip',
      nom: 'Formule VIP',
      prix: 35,
      nombre_repas: 28,
      description: '100+ personnes - 28 repas au choix + accès complet',
      badge: 'VIP TOTAL',
      color: 'gold'
    }
  ];

  // Définir la formule par défaut
  currentFormule = availableFormules[1]; // Formule Optimale par défaut
  maxSelectionLimit = currentFormule.nombre_repas || Infinity;
}

// FONCTION PRINCIPALE : Charger la sélection depuis le localStorage
function loadMenuSelectionFromStorage() {
  try {
    const storedData = localStorage.getItem('arabesqueQuoteData');
    
    if (!storedData) {
      console.log('ℹ️ Aucune sélection de menu détectée');
      return;
    }
    
    detectedQuoteData = JSON.parse(storedData);
    console.log('✅ Sélection de menu détectée :', detectedQuoteData);
    
    // Valider les données
    if (!detectedQuoteData.selections || !detectedQuoteData.formule) {
      console.log('⚠️ Données de menu incomplètes, ignorées');
      detectedQuoteData = null;
      return;
    }
    
    // Afficher la sélection détectée
    displayDetectedMenu(detectedQuoteData);
    
    // Configurer la formule et les limites
    currentFormule = detectedQuoteData.formule;
    maxSelectionLimit = currentFormule.nombre_repas || Infinity;
    
    // Peupler la sélection actuelle
    detectedQuoteData.selections.forEach(item => {
      selectedMenuItems.add(item.key);
    });
    
    updateSelectionCounters();
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la sélection :', error);
    detectedQuoteData = null;
  }
}

// Afficher le menu détecté avec style amélioré
function displayDetectedMenu(quoteData) {
  const detectedMenuDiv = document.getElementById('detectedMenu');
  
  if (!detectedMenuDiv) {
    console.log('⚠️ Éléments UI pour menu détecté non trouvés');
    return;
  }
  
  // Créer l'affichage du menu détecté
  const summaryHTML = `
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
              <p class="text-green-600 text-sm">Configuré le ${new Date(quoteData.metadata.created).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          
          <div class="mb-4">
            <h5 class="font-semibold text-green-800 mb-2">Plats sélectionnés :</h5>
            <div class="grid md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              ${quoteData.selections.map(item => `
                <div class="flex items-center gap-2 text-sm">
                  <span class="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    ${item.order}
                  </span>
                  <span class="font-medium text-green-900">${item.itemName}</span>
                  ${item.chef_special ? '<span class="text-xs bg-gold text-black px-1 rounded">Chef</span>' : ''}
                  ${item.rare_specialty ? '<span class="text-xs bg-purple-500 text-white px-1 rounded">Rare</span>' : ''}
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button type="button" 
                    class="btn bg-green-600 hover:bg-green-700 text-white"
                    onclick="keepDetectedMenu()">
              ✓ Utiliser cette sélection
            </button>
            <button type="button" 
                    class="btn btn-outline border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
                    onclick="clearDetectedMenuAndChooseManually()">
              🔄 Choisir manuellement
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  detectedMenuDiv.innerHTML = summaryHTML;
  detectedMenuDiv.classList.remove('hidden');
  
  // Masquer la sélection manuelle par défaut
  const manualSelection = document.getElementById('manualMenuSelection');
  if (manualSelection) {
    manualSelection.style.display = 'none';
  }
}

// Fonctions pour gérer la sélection détectée
window.keepDetectedMenu = function() {
  console.log('✅ L\'utilisateur garde la sélection détectée');
  updateSelectionCounters();
};

window.clearDetectedMenuAndChooseManually = function() {
  console.log('🔄 L\'utilisateur choisit de sélectionner manuellement');
  
  // Effacer les données
  localStorage.removeItem('arabesqueQuoteData');
  detectedQuoteData = null;
  selectedMenuItems.clear();
  currentFormule = availableFormules[1]; // Retour à la formule par défaut
  maxSelectionLimit = currentFormule.nombre_repas || Infinity;
  
  // Masquer la section détectée
  const detectedMenuDiv = document.getElementById('detectedMenu');
  if (detectedMenuDiv) {
    detectedMenuDiv.classList.add('hidden');
  }
  
  // Afficher la sélection manuelle
  const manualSelection = document.getElementById('manualMenuSelection');
  if (manualSelection) {
    manualSelection.style.display = 'block';
  }
  
  // Afficher le sélecteur de formule
  renderFormuleSelector();
  loadMenuForManualSelection();
  updateSelectionCounters();
};

// NOUVEAU: Rendre le sélecteur de formule
function renderFormuleSelector() {
  const menuCategories = document.getElementById('menuCategories');
  if (!menuCategories) return;
  
  // Injecter le sélecteur de formule au début
  const formuleSelector = document.createElement('div');
  formuleSelector.className = 'mb-8 p-6 bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl border border-gold/20';
  formuleSelector.id = 'formuleSelector';
  
  formuleSelector.innerHTML = `
    <h4 class="font-bold text-xl mb-4 text-center">💎 Choisissez votre formule</h4>
    <p class="text-gray-600 text-center mb-6">Sélectionnez la formule qui correspond à votre événement</p>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${availableFormules.map((formule, index) => `
        <label class="formule-option cursor-pointer">
          <input type="radio" name="selected_formule" value="${formule.id}" 
                 ${index === 1 ? 'checked' : ''} class="sr-only">
          <div class="formule-card p-4 border-2 border-gray-200 rounded-xl transition-all hover:shadow-lg
                      ${index === 1 ? 'border-gold bg-gold/10' : ''}">
            <div class="text-center mb-3">
              <span class="inline-block px-2 py-1 text-xs font-bold rounded-full mb-2
                          ${index === 1 ? 'bg-gold text-black' : 'bg-gray-200 text-gray-700'}">
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
  
  // Insérer au début du container des catégories
  menuCategories.insertBefore(formuleSelector, menuCategories.firstChild);
  
  // Ajouter les event listeners pour la sélection de formule
  document.querySelectorAll('input[name="selected_formule"]').forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        const selectedFormule = availableFormules.find(f => f.id === this.value);
        selectFormule(selectedFormule);
        updateFormuleDisplay();
      }
    });
  });
}

// NOUVEAU: Sélectionner une formule
function selectFormule(formule) {
  currentFormule = formule;
  maxSelectionLimit = formule.nombre_repas || Infinity;
  
  console.log(`📋 Formule sélectionnée: ${formule.nom} (${formule.prix}$ - ${formule.nombre_repas || '∞'} plats)`);
  
  // Appliquer les limites si nécessaire
  enforceSelectionLimit();
  updateSelectionCounters();
  
  // Recalculer les prix si un nombre d'invités est déjà renseigné
  const guestsInput = document.querySelector('input[name="guests_count"]');
  if (guestsInput && guestsInput.value) {
    calculatePricing(parseInt(guestsInput.value));
  }
}

// NOUVEAU: Mettre à jour l'affichage de la formule
function updateFormuleDisplay() {
  document.querySelectorAll('.formule-card').forEach((card, index) => {
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
}

// NOUVEAU: Appliquer les limites de sélection
function enforceSelectionLimit() {
  if (maxSelectionLimit === Infinity) return;
  
  if (selectedMenuItems.size > maxSelectionLimit) {
    const itemsArray = Array.from(selectedMenuItems);
    selectedMenuItems.clear();
    
    // Garder seulement les N premiers éléments
    itemsArray.slice(0, maxSelectionLimit).forEach(item => {
      selectedMenuItems.add(item);
    });
    
    console.log(`⚠️ Limite de sélection appliquée: ${maxSelectionLimit} plats maximum`);
    updateManualMenuDisplay();
  }
}

// Charger le menu pour sélection manuelle (version simplifiée)
async function loadMenuForManualSelection() {
  console.log('📋 Chargement du menu pour sélection manuelle...');
  
  // Essayer de charger le menu.json
  const possiblePaths = [
    './data/menu.json',
    'data/menu.json', 
    '/data/menu.json',
    'menu.json'
  ];

  let menuData = null;
  
  for (const path of possiblePaths) {
    try {
      console.log(`🔍 Tentative : ${path}`);
      const response = await fetch(path);
      
      if (!response.ok) continue;
      
      menuData = await response.json();
      console.log(`✅ Menu chargé : ${path}`);
      break;
      
    } catch (error) {
      console.log(`❌ Erreur ${path} :`, error.message);
    }
  }
  
  if (!menuData) {
    console.log('🚨 Utilisation des données de menu simplifiées');
    menuData = createSimplifiedMenuData();
  }
  
  // Si pas de menu détecté, afficher le sélecteur de formule
  if (!detectedQuoteData) {
    renderFormuleSelector();
  }
  
  renderSimplifiedMenuCategories(menuData);
}

// Données de menu simplifiées pour le contact
function createSimplifiedMenuData() {
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
}

// Rendu simplifié des catégories de menu
function renderSimplifiedMenuCategories(menuData) {
  const categoriesContainer = document.getElementById('menuCategories');
  
  if (!categoriesContainer) {
    console.log('⚠️ Conteneur des catégories non trouvé');
    return;
  }
  
  // Message d'information (seulement si pas de sélecteur de formule)
  if (!document.getElementById('formuleSelector')) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg';
    infoDiv.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-blue-600 text-xl">ℹ️</span>
        <div>
          <p class="font-bold text-blue-800">Sélection manuelle</p>
          <p class="text-blue-600 text-sm">Choisissez vos plats parmi notre sélection. Pour plus de choix, utilisez le <a href="menu.html" class="underline font-semibold">configurateur complet</a>.</p>
        </div>
      </div>
    `;
    categoriesContainer.appendChild(infoDiv);
  }
  
  menuData.categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'mb-8';
    
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
      
      card.innerHTML = `
        <h5 class="font-semibold mb-2">${element.nom}</h5>
        <p class="text-sm text-gray-600 mb-3">${element.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500">Cliquez pour sélectionner</span>
          <span class="selection-indicator hidden text-gold font-bold">✓ Sélectionné</span>
        </div>
      `;
      
      card.addEventListener('click', function() {
        toggleManualMenuItemSelection(this, key);
      });
      
      grid.appendChild(card);
    });
    
    categoryDiv.appendChild(header);
    categoryDiv.appendChild(grid);
    categoriesContainer.appendChild(categoryDiv);
  });
  
  updateManualMenuDisplay();
}

// Toggle de sélection pour le menu manuel
function toggleManualMenuItemSelection(card, key) {
  if (selectedMenuItems.has(key)) {
    selectedMenuItems.delete(key);
    card.classList.remove('selected');
    card.querySelector('.selection-indicator').classList.add('hidden');
  } else {
    // Vérifier les limites si applicables
    if (maxSelectionLimit !== Infinity && selectedMenuItems.size >= maxSelectionLimit) {
      alert(`Limite atteinte ! Vous ne pouvez sélectionner que ${maxSelectionLimit} plats maximum avec la ${currentFormule.nom}.`);
      return;
    }
    
    selectedMenuItems.add(key);
    card.classList.add('selected');
    card.querySelector('.selection-indicator').classList.remove('hidden');
  }
  
  updateManualMenuDisplay();
  updateSelectionCounters();
}

// Mettre à jour l'affichage du menu manuel
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
    
    // Désactiver les cartes si limite atteinte
    if (maxSelectionLimit !== Infinity && selectedMenuItems.size >= maxSelectionLimit && !selectedMenuItems.has(key)) {
      card.classList.add('disabled', 'opacity-50', 'cursor-not-allowed');
    } else {
      card.classList.remove('disabled', 'opacity-50', 'cursor-not-allowed');
    }
  });
}

// Mettre à jour les compteurs de sélection
function updateSelectionCounters() {
  const currentSelectionEl = document.getElementById('currentSelection');
  const maxSelectionEl = document.getElementById('maxSelection');
  
  if (currentSelectionEl) {
    currentSelectionEl.textContent = selectedMenuItems.size;
  }
  
  if (maxSelectionEl) {
    maxSelectionEl.textContent = maxSelectionLimit === Infinity ? '∞' : maxSelectionLimit;
  }
}

// Initialiser les étapes du formulaire
function initializeFormSteps() {
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  
  nextButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const nextStep = parseInt(this.dataset.next);
      if (validateCurrentStep()) {
        showStep(nextStep);
        updateProgressBar(nextStep);
      }
    });
  });
  
  prevButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const prevStep = parseInt(this.dataset.prev);
      showStep(prevStep);
      updateProgressBar(prevStep);
    });
  });
}

function showStep(stepNumber) {
  currentStep = stepNumber;
  
  // Masquer toutes les étapes
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Afficher l'étape courante
  const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
  if (currentStepElement) {
    currentStepElement.classList.add('active');
  }
  
  // Mettre à jour les indicateurs
  document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
    indicator.classList.remove('active', 'completed');
    if (index + 1 === stepNumber) {
      indicator.classList.add('active');
    } else if (index + 1 < stepNumber) {
      indicator.classList.add('completed');
    }
  });
  
  // Générer le résumé si on arrive à l'étape 4
  if (stepNumber === 4) {
    generateQuoteSummary();
  }
  
  // Scroll vers le formulaire
  document.getElementById('formulaire-devis').scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}

function updateProgressBar(step) {
  const progress = (step / 4) * 100;
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }
}

function validateCurrentStep() {
  const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const requiredFields = currentStepElement.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    const errorDiv = field.parentElement.querySelector('.form-error');
    if (!field.value.trim()) {
      field.style.borderColor = '#dc2626';
      if (errorDiv) {
        errorDiv.textContent = 'Ce champ est requis';
      }
      isValid = false;
    } else {
      field.style.borderColor = '#d1d5db';
      if (errorDiv) {
        errorDiv.textContent = '';
      }
    }
  });
  
  return isValid;
}

// Initialiser le calculateur de prix AMÉLIORÉ
function initializePricingCalculator() {
  const guestsInput = document.querySelector('input[name="guests_count"]');
  if (guestsInput) {
    guestsInput.addEventListener('input', function() {
      const guestCount = parseInt(this.value) || 0;
      calculatePricing(guestCount);
    });
  }
  
  const cocktailCheckbox = document.getElementById('cocktailService');
  if (cocktailCheckbox) {
    cocktailCheckbox.addEventListener('change', function() {
      const cocktailDetails = document.getElementById('cocktailDetails');
      if (this.checked) {
        cocktailDetails.classList.remove('hidden');
      } else {
        cocktailDetails.classList.add('hidden');
      }
      
      const guests = parseInt(document.querySelector('input[name="guests_count"]').value) || 0;
      if (guests > 0) calculatePricing(guests);
    });
  }
}

// NOUVEAU: Calculateur de prix amélioré avec formule sélectionnée
function calculatePricing(guestCount) {
  if (guestCount === 0) {
    const pricingPreview = document.getElementById('pricingPreview');
    if (pricingPreview) {
      pricingPreview.classList.add('hidden');
    }
    return;
  }
  
  // Utiliser la formule actuellement sélectionnée
  const basePrice = currentFormule.prix;
  const formula = currentFormule.nom;
  
  const menuTotal = basePrice * guestCount;
  
  // NOUVEAU: Calculer le service cocktail avec les prix corrects
  let cocktailPrice = 0;
  const cocktailService = document.getElementById('cocktailService');
  if (cocktailService && cocktailService.checked) {
    if (guestCount < 55) cocktailPrice = 500;
    else if (guestCount < 105) cocktailPrice = 750;
    else if (guestCount < 155) cocktailPrice = 900;
    else cocktailPrice = 1200;
  }
  
  const total = menuTotal + cocktailPrice;
  
  const pricingDiv = document.getElementById('pricingPreview');
  const detailsDiv = document.getElementById('pricingDetails');
  
  if (detailsDiv) {
    detailsDiv.innerHTML = `
      <div class="text-sm space-y-2">
        <div class="flex justify-between">
          <span>${formula}</span>
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
    
    if (pricingDiv) {
      pricingDiv.classList.remove('hidden');
    }
    
    const estimatedTotalField = document.getElementById('estimatedTotalField');
    if (estimatedTotalField) {
      estimatedTotalField.value = total;
    }
  }
}

function generateQuoteSummary() {
  const form = document.getElementById('quoteForm');
  const formData = new FormData(form);
  
  const summary = document.getElementById('quoteSummary');
  const selectedItemsArray = Array.from(selectedMenuItems);
  
  if (summary) {
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
            <p class="font-bold text-gold">${currentFormule.nom}</p>
            <p class="text-sm">${currentFormule.prix}$ par personne</p>
            <p class="text-xs text-gray-600">${currentFormule.description}</p>
          </div>
          
          <h5 class="font-semibold mb-2">🍽 Menu sélectionné (${selectedItemsArray.length} plats)</h5>
          <div class="max-h-40 overflow-y-auto space-y-1">
            ${selectedItemsArray.length > 0 ? selectedItemsArray.map(key => {
              const [category, item] = key.split('::');
              return `<div class="text-sm p-2 bg-gray-50 rounded">
                <strong>${item}</strong>
                <span class="text-gray-500"> (${category})</span>
              </div>`;
            }).join('') : '<p class="text-gray-500 text-sm italic">Aucun plat spécifiquement sélectionné</p>'}
          </div>
          
          ${formData.get('cocktail_service') ? '<p class="mt-2 text-green-600"><strong>✅ Service cocktail inclus</strong></p>' : ''}
          ${formData.get('dietary_requirements') ? `<p class="mt-2"><strong>Contraintes:</strong> ${formData.get('dietary_requirements')}</p>` : ''}
          ${formData.get('personal_message') ? `<p class="mt-2"><strong>Message:</strong> ${formData.get('personal_message')}</p>` : ''}
        </div>
      </div>
    `;
    
    // Mettre à jour l'estimation
    const estimationDiv = document.getElementById('estimationDetails');
    const estimatedTotal = document.getElementById('estimatedTotalField').value;
    if (estimationDiv && estimatedTotal) {
      estimationDiv.innerHTML = `
        <div class="text-2xl font-bold text-gold mb-2">${estimatedTotal}$</div>
        <p class="text-sm text-gray-600">Prix estimé pour ${formData.get('guests_count')} personnes</p>
      `;
    }
  }
}

function initializeFormValidation() {
  const form = document.getElementById('quoteForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!validateCurrentStep()) {
        return;
      }
      
      // Vérifier les cases de consentement
      const consentContact = form.querySelector('input[name="consent_contact"]');
      const consentPrivacy = form.querySelector('input[name="consent_privacy"]');
      
      if (!consentContact.checked || !consentPrivacy.checked) {
        alert('Veuillez accepter les conditions de contact et la politique de confidentialité.');
        return;
      }
      
      const formData = new FormData(form);
      
      // Ajouter les données de menu et formule sélectionnés
      const menuSelection = {
        items: Array.from(selectedMenuItems),
        count: selectedMenuItems.size,
        maxAllowed: maxSelectionLimit,
        source: detectedQuoteData ? 'menu_configurator' : 'manual_selection',
        formule: currentFormule
      };
      formData.set('menu_selection', JSON.stringify(menuSelection));
      
      sendViaWhatsApp(formData);
    });
  }
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

📅 EVENEMENT
• Type: ${formData.get('event_type')}
• Date: ${formData.get('event_date')}
• Lieu: ${formData.get('event_location')}
• Invites: ${formData.get('guests_count')} personnes
• Heure: ${formData.get('event_time') || 'Non precisee'}

👤 MES COORDONNEES
• Nom: ${formData.get('client_name')}
• Telephone: ${formData.get('client_phone')}
• Email: ${formData.get('client_email')}

💎 FORMULE SELECTIONNEE
• ${currentFormule.nom} (${currentFormule.prix}$ par personne)
• ${currentFormule.nombre_repas ? `${currentFormule.nombre_repas} plats maximum` : 'Choix illimité'}

🍽 MENU SELECTIONNE (${selectedItemsArray.length} plats)
${selectedItemsArray.length > 0 ? selectedItemsArray.map(key => {
  const [category, item] = key.split('::');
  return `• ${item} (${category})`;
}).join('\n') : '• Selection selon recommandations du chef'}

${formData.get('cocktail_service') ? '🍹 SERVICE COCKTAIL SOUHAITE ✅\n' : ''}

${formData.get('dietary_requirements') ? `🥗 CONTRAINTES ALIMENTAIRES: ${formData.get('dietary_requirements')}\n` : ''}

💰 Budget: ${formData.get('budget_range') || 'Non precise'}
💰 Estimation: ${formData.get('estimated_total')}$ (estimation automatique)

📝 MESSAGE: ${formData.get('personal_message') || 'Aucun message supplementaire'}

Merci pour votre service d'exception! 🙏`;
}

function showSuccessMessage() {
  const successDiv = document.getElementById('formSuccess');
  const form = document.getElementById('quoteForm');
  
  if (successDiv && form) {
    successDiv.classList.remove('hidden');
    form.style.display = 'none';
    
    // Nettoyer le localStorage après envoi réussi
    localStorage.removeItem('arabesqueQuoteData');
    
    successDiv.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  }
}
