// Contact Form JavaScript avec chargement du vrai menu.json
document.addEventListener('DOMContentLoaded', function() {
  initializeContactForm();
});

// Global variables for form management
let currentStep = 1;
let selectedMenuItems = new Set();
let maxSelectionLimit = Infinity;
let currentFormule = null;
let fullMenuData = null; // Store the complete menu data

function initializeContactForm() {
  // Load menu selection from localStorage
  loadMenuSelection();
  
  // Initialize form steps
  initializeFormSteps();
  
  // Initialize pricing calculator
  initializePricingCalculator();
  
  // Initialize menu selection
  initializeMenuSelection();
  
  // Initialize form validation
  initializeFormValidation();
  
  // Load REAL menu data from menu.json
  loadRealMenuData();
}

async function loadRealMenuData() {
  const possiblePaths = [
    './data/menu.json',
    'data/menu.json', 
    '/data/menu.json',
    'menu.json',
    './menu.json',
    '../data/menu.json'
  ];

  for (const path of possiblePaths) {
    try {
      console.log(`🔍 Tentative de chargement du menu : ${path}`);
      const response = await fetch(path);
      
      if (!response.ok) {
        console.log(`❌ ${path} : ${response.status} ${response.statusText}`);
        continue;
      }
      
      fullMenuData = await response.json();
      console.log(`✅ Menu chargé depuis : ${path}`);
      console.log('📊 Données du menu :', fullMenuData);
      
      renderRealMenuCategories(fullMenuData);
      return;
      
    } catch (error) {
      console.log(`❌ Erreur avec ${path} :`, error.message);
    }
  }
  
  // Si aucun fichier trouvé, utiliser les données de fallback
  console.log('🚨 Impossible de charger menu.json - Utilisation des données de test');
  loadFallbackMenuData();
}

function renderRealMenuCategories(menuData) {
  const categoriesContainer = document.getElementById('menuCategories');
  
  if (!menuData || !menuData.categories) {
    console.error('Données de menu invalides');
    loadFallbackMenuData();
    return;
  }
  
  categoriesContainer.innerHTML = '';
  
  // Afficher un message de statut
  const statusDiv = document.createElement('div');
  statusDiv.className = 'mb-6 p-4 bg-green-50 border border-green-200 rounded-lg';
  statusDiv.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-green-600 text-xl">✅</span>
      <div>
        <p class="font-bold text-green-800">Menu complet chargé</p>
        <p class="text-green-600 text-sm">${menuData.categories.length} catégories • ${getTotalItemsCount(menuData)} plats disponibles</p>
      </div>
    </div>
  `;
  categoriesContainer.appendChild(statusDiv);
  
  // Rendre toutes les catégories
  menuData.categories.forEach(category => {
    if (!category.elements || category.elements.length === 0) {
      return; // Skip empty categories
    }
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'mb-8';
    
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'flex items-center gap-3 mb-4';
    categoryHeader.innerHTML = `
      <span class="text-2xl">${category.icon || '🍽️'}</span>
      <div>
        <h4 class="font-bold text-lg text-gold">${category.nom}</h4>
        <p class="text-sm text-gray-600">${category.description || ''}</p>
      </div>
      <div class="ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
        ${category.elements.length} plats
      </div>
    `;
    
    const itemsGrid = document.createElement('div');
    itemsGrid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-4';
    itemsGrid.setAttribute('data-category', category.id);
    
    category.elements.forEach(element => {
      const itemCard = document.createElement('div');
      itemCard.className = 'menu-item-card p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gold transition-all relative';
      itemCard.setAttribute('data-item-id', element.id);
      itemCard.setAttribute('data-item-name', element.nom);
      itemCard.setAttribute('data-category', category.nom);
      
      // Check for special badges
      let badgeHtml = '';
      if (element.chef_special) {
        badgeHtml = '<div class="absolute top-2 right-2 bg-gold text-black text-xs px-2 py-1 rounded-full font-bold">Chef</div>';
      } else if (element.rare_specialty) {
        badgeHtml = '<div class="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">Rare</div>';
      } else if (element.premium) {
        badgeHtml = '<div class="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">Premium</div>';
      }
      
      // Dietary indicators
      let dietaryHtml = '';
      if (element.dietary) {
        const dietaryTags = element.dietary.map(diet => {
          const icons = {
            'vegetarien': '🌱',
            'vegan': '🌿', 
            'sans_gluten': '🌾',
            'halal': '🕌'
          };
          return `<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">${icons[diet] || '•'} ${diet}</span>`;
        }).join(' ');
        dietaryHtml = `<div class="flex gap-1 flex-wrap mb-2">${dietaryTags}</div>`;
      }
      
      itemCard.innerHTML = `
        ${badgeHtml}
        <div class="mb-3">
          <h5 class="font-semibold mb-2 pr-12">${element.nom}</h5>
          <p class="text-sm text-gray-600 mb-2 line-clamp-2">${element.description || 'Délicieuse spécialité de notre chef'}</p>
          ${dietaryHtml}
          ${element.origine ? `<p class="text-xs text-gray-500 italic">${element.origine}</p>` : ''}
        </div>
        <div class="flex justify-between items-center mt-auto">
          <span class="text-xs text-gray-500">Cliquez pour sélectionner</span>
          <span class="selection-indicator hidden text-gold font-bold">✓ Sélectionné</span>
        </div>
      `;
      
      itemCard.addEventListener('click', function() {
        toggleMenuItemSelection(this);
      });
      
      itemsGrid.appendChild(itemCard);
    });
    
    categoryDiv.appendChild(categoryHeader);
    categoryDiv.appendChild(itemsGrid);
    categoriesContainer.appendChild(categoryDiv);
  });
  
  updateMenuItemsDisplay();
  console.log(`✅ Menu rendu: ${menuData.categories.length} catégories affichées`);
}

function getTotalItemsCount(menuData) {
  return menuData.categories.reduce((total, category) => {
    return total + (category.elements ? category.elements.length : 0);
  }, 0);
}

function loadFallbackMenuData() {
  console.log('🧪 Chargement des données de menu de fallback');
  
  // Données de menu étendu de fallback basées sur votre JSON original
  const fallbackMenuData = {
    categories: [
      {
        id: 'entrees',
        nom: 'Entrées & Amuse-Bouches',
        description: 'Mises en bouche savoureuses pour commencer en beauté',
        icon: '🥂',
        elements: [
          { id: 'samoussa-viande', nom: 'Samoussa à la Viande', description: 'Pâte croustillante farcie de viande épicée, recette traditionnelle', origine: 'Spécialité maison' },
          { id: 'brochette-beignets', nom: 'Brochette de Beignets', description: 'Beignets moelleux en brochette, accompagnement sauce piquante', origine: 'Création Arabesque' },
          { id: 'saucisse-pili', nom: 'Saucisses Pili', description: 'Saucisses locales grillées aux épices congolaises', origine: 'Tradition locale' },
          { id: 'plateau-fromage', nom: 'Plateau de Fromages', description: 'Sélection de fromages internationaux et locaux', origine: 'Sélection premium' },
          { id: 'rouleau-printemps', nom: 'Rouleaux de Printemps', description: 'Rouleaux frais aux légumes croquants et herbes fraîches', origine: 'Fusion asiatique' },
          { id: 'mini-burger', nom: 'Mini Burgers', description: 'Petits burgers gourmands, viande locale, pain artisanal', origine: 'Style américain revisité' }
        ]
      },
      {
        id: 'salades',
        nom: 'Salades Fraîcheur',
        description: 'Accompagnements frais et colorés',
        icon: '🥗',
        elements: [
          { id: 'salade-grecque', nom: 'Salade Grecque', description: 'Tomates, concombres, olives, feta, oignon rouge, vinaigrette à l\'huile d\'olive', origine: 'Méditerranéenne', dietary: ['vegetarien'] },
          { id: 'salade-nicoise', nom: 'Salade Niçoise', description: 'Thon, œufs durs, tomates, anchois, olives, haricots verts', origine: 'Française classique' },
          { id: 'macedoine-legumes', nom: 'Macédoine de Légumes', description: 'Mélange coloré de légumes frais en dés, mayonnaise légère', origine: 'Classique international', dietary: ['vegetarien'] }
        ]
      },
      {
        id: 'repas_viandes',
        nom: 'Viandes & Spécialités',
        description: 'Le cœur de la cuisine congolaise authentique',
        icon: '🥩',
        elements: [
          { id: 'cochon-lait-farci', nom: 'Cochon de Lait Farci', description: 'Cochon de lait tendre, farci aux herbes et épices locales', origine: 'Spécialité festive congolaise', chef_special: true },
          { id: 'viande-chevre-nga-nda', nom: 'Viande de Chèvre façon Nga Nda', description: 'Chèvre mijotée selon la tradition Nga Nda, sauce authentique', origine: 'Tradition ancestrale congolaise', chef_special: true },
          { id: 'maboke-ngulu', nom: 'Maboke y\'a Ngulu', description: 'Porc fumé traditionnel dans les feuilles, cuisson ancestrale', origine: 'Technique traditionnelle congolaise', chef_special: true },
          { id: 'brochette-boeuf', nom: 'Brochette de Bœuf', description: 'Bœuf tendre grillé aux épices, marinade maison', origine: 'Grillades Arabesque' },
          { id: 'emince-boeuf-legumes', nom: 'Émincé de Bœuf aux Légumes', description: 'Lamelles de bœuf sautées, légumes croquants de saison', origine: 'Cuisine moderne' },
          { id: 'cote-porc', nom: 'Côte de Porc', description: 'Côtes de porc grillées, sauce barbecue maison', origine: 'Grillade premium' },
          { id: 'tripes-chevre', nom: 'Tripes de Chèvre aux Pommes de Terre', description: 'Tripes mijotées, pommes de terre ou bisamunyu', origine: 'Plat traditionnel congolais' },
          { id: 'cotes-agneau', nom: 'Côtes d\'Agneau', description: 'Côtes d\'agneau grillées, herbes de Provence', origine: 'Cuisine raffinée', premium: true },
          { id: 'gigot-agneau', nom: 'Gigot d\'Agneau', description: 'Gigot d\'agneau rôti, jus corsé aux épices', origine: 'Grande cuisine', premium: true },
          { id: 'dinde', nom: 'Dinde Rôtie', description: 'Dinde fermière rôtie, farce traditionnelle', origine: 'Classique des fêtes' }
        ]
      },
      {
        id: 'poissons',
        nom: 'Poissons & Fruits de Mer',
        description: 'Trésors du fleuve Congo et spécialités aquatiques',
        icon: '🐟',
        elements: [
          { id: 'gros-capitaine-braise', nom: 'Gros Capitaine Braisé', description: 'Poisson capitaine du Congo, braisé aux épices locales', origine: 'Spécialité du fleuve Congo', chef_special: true },
          { id: 'capitaine-sauce-maniere', nom: 'Capitaine à la Sauce Manière', description: 'Capitaine en sauce traditionnelle congolaise', origine: 'Recette authentique congolaise', chef_special: true },
          { id: 'mbinzo', nom: 'Mbinzo', description: 'Poisson séché traditionnel, préparé selon la coutume', origine: 'Tradition congolaise ancestrale' },
          { id: 'ndakala', nom: 'Ndakala', description: 'Petits poissons séchés, spécialité du Congo', origine: 'Tradition du fleuve Congo' },
          { id: 'poisson-fume', nom: 'Poisson Fumé', description: 'Poisson fumé artisanalement, saveur authentique', origine: 'Technique traditionnelle' },
          { id: 'maboke-poisson-fleuve', nom: 'Maboke Poisson du Fleuve', description: 'Poisson du Congo cuit dans les feuilles, méthode ancestrale', origine: 'Technique traditionnelle congolaise', chef_special: true },
          { id: 'poisson-sale', nom: 'Poisson Salé', description: 'Poisson salé et séché, préparation traditionnelle', origine: 'Conservation traditionnelle' },
          { id: 'tilapia-braise', nom: 'Tilapia Braisé', description: 'Tilapia frais braisé aux tomates et épices', origine: 'Poisson d\'élevage local' },
          { id: 'crevettes', nom: 'Crevettes Sautées', description: 'Crevettes fraîches sautées à l\'ail et aux herbes', origine: 'Fruits de mer premium', premium: true }
        ]
      },
      {
        id: 'volailles',
        nom: 'Volailles',
        description: 'Poulet, canard et spécialités de volaille',
        icon: '🐔',
        elements: [
          { id: 'poulet-braise', nom: 'Poulet Braisé', description: 'Poulet fermier braisé, sauce tomate épicée', origine: 'Classique congolais' },
          { id: 'cuisse-poulet-fume', nom: 'Cuisse de Poulet Fumé', description: 'Cuisses de poulet fumées artisanalement', origine: 'Technique de fumage local' },
          { id: 'aile-rond-poulet', nom: 'Aile Rond de Poulet', description: 'Ailes de poulet marinées et grillées', origine: 'Grillade populaire' },
          { id: 'makayabu-goma', nom: 'Makayabu (Goma)', description: 'Spécialité de Goma, viande séchée et épicée', origine: 'Spécialité de Goma', regional_specialty: true }
        ]
      },
      {
        id: 'legumes_verts',
        nom: 'Légumes Verts & Accompagnements',
        description: 'Légumes traditionnels congolais et légumes verts',
        icon: '🥬',
        elements: [
          { id: 'pondu', nom: 'Pondu', description: 'Feuilles de manioc pilées, plat emblématique congolais', origine: 'Plat national congolais', chef_special: true, dietary: ['vegetarien'] },
          { id: 'fum-bwa', nom: 'Fum Bwa', description: 'Légumes verts traditionnels, feuilles locales', origine: 'Tradition villageoise', dietary: ['vegetarien'] },
          { id: 'haricots-verts', nom: 'Haricots Verts', description: 'Haricots verts frais sautés à l\'ail', origine: 'Légume classique', dietary: ['vegetarien'] },
          { id: 'aubergines-vertes', nom: 'Aubergines Vertes (Nyanya/Solo)', description: 'Aubergines locales mijotées, sauce traditionnelle', origine: 'Légume local congolais', dietary: ['vegetarien'] },
          { id: 'ratatouille', nom: 'Ratatouille', description: 'Mélange de légumes méditerranéens mijotés', origine: 'Cuisine française', dietary: ['vegetarien'] },
          { id: 'epinards', nom: 'Épinards', description: 'Épinards frais sautés aux oignons', origine: 'Légume santé', dietary: ['vegetarien'] },
          { id: 'champignons', nom: 'Champignons Sautés', description: 'Champignons frais sautés aux herbes', origine: 'Accompagnement raffiné', dietary: ['vegetarien'] },
          { id: 'petits-pois-carottes', nom: 'Petits Pois aux Carottes', description: 'Mélange coloré de petits pois et carottes', origine: 'Classique français', dietary: ['vegetarien'] },
          { id: 'misili', nom: 'Misili', description: 'Légume-feuille traditionnel congolais', origine: 'Tradition congolaise', dietary: ['vegetarien'] },
          { id: 'safu', nom: 'Safu', description: 'Fruit/légume local, préparation traditionnelle', origine: 'Spécialité locale Congo', dietary: ['vegetarien'] },
          { id: 'feuille-courge-arachides', nom: 'Feuille de Courge aux Arachides', description: 'Feuilles de courge, pâte d\'arachide, recette ancestrale', origine: 'Tradition culinaire congolaise', dietary: ['vegetarien'] },
          { id: 'dongo-dongo', nom: 'Dongo Dongo', description: 'Légume visqueux traditionnel, sauce onctueuse', origine: 'Plat traditionnel congolais', dietary: ['vegetarien'] },
          { id: 'matembele-poisson-fume', nom: 'Matembele au Poisson Fumé', description: 'Feuilles de patate douce, poisson fumé', origine: 'Plat complet traditionnel' },
          { id: 'mbika', nom: 'Mbika', description: 'Légume-feuille congolais, préparation authentique', origine: 'Tradition congolaise', dietary: ['vegetarien'] }
        ]
      },
      {
        id: 'accompaniments',
        nom: 'Accompagnements & Féculents',
        description: 'Base nutritive traditionnelle congolaise',
        icon: '🍚',
        elements: [
          { id: 'riz-blanc', nom: 'Riz Blanc', description: 'Riz parfumé cuit à la vapeur', origine: 'Classique universel', dietary: ['vegetarien', 'sans_gluten'] },
          { id: 'riz-cantonais', nom: 'Riz Cantonais', description: 'Riz sauté aux légumes et œufs', origine: 'Cuisine asiatique', dietary: ['vegetarien'] },
          { id: 'riz-persille', nom: 'Riz Persillé', description: 'Riz blanc aux herbes fraîches', origine: 'Cuisine française', dietary: ['vegetarien', 'sans_gluten'] },
          { id: 'fufu', nom: 'Fufu', description: 'Pâte de manioc traditionnelle, accompagnement emblématique', origine: 'Tradition congolaise ancestrale', chef_special: true, dietary: ['vegetarien', 'sans_gluten'] },
          { id: 'lituma', nom: 'Lituma', description: 'Pâte de maïs traditionnelle congolaise', origine: 'Tradition congolaise', dietary: ['vegetarien', 'sans_gluten'] },
          { id: 'pommes-terre-beurre', nom: 'Pommes de Terre au Beurre', description: 'Pommes de terre fondantes au beurre frais', origine: 'Classique français', dietary: ['vegetarien'] },
          { id: 'makemba', nom: 'Makemba', description: 'Bananes plantain, préparation traditionnelle congolaise', origine: 'Tradition congolaise', dietary: ['vegetarien', 'sans_gluten'] },
          { id: 'frites', nom: 'Frites Maison', description: 'Pommes de terre frites, croustillantes et dorées', origine: 'Classique international', dietary: ['vegetarien'] },
          { id: 'bisamunyu', nom: 'Bisamunyu', description: 'Tubercule local, préparation traditionnelle congolaise', origine: 'Spécialité locale Congo', dietary: ['vegetarien', 'sans_gluten'] },
          { id: 'patate-douce', nom: 'Patate Douce', description: 'Patates douces cuites, naturellement sucrées', origine: 'Légume traditionnel', dietary: ['vegetarien', 'sans_gluten'] },
          { id: 'manioc-frais', nom: 'Manioc Frais', description: 'Manioc frais bouilli, base alimentaire congolaise', origine: 'Aliment de base congolais', dietary: ['vegetarien', 'sans_gluten'] }
        ]
      },
      {
        id: 'fruits',
        nom: 'Fruits & Desserts Naturels',
        description: 'Fraîcheur tropicale et desserts aux fruits',
        icon: '🍓',
        elements: [
          { id: 'plateau-fruits-saison', nom: 'Plateau de Fruits de Saison', description: 'Sélection quotidienne des meilleurs fruits locaux et importés', origine: 'Fraîcheur garantie', dietary: ['vegetarien', 'vegan', 'sans_gluten'] },
          { id: 'fruits-tropicaux', nom: 'Fruits Tropicaux', description: 'Ananas, mangue, papaye, banane, fruit de la passion', origine: 'Tropiques africains', dietary: ['vegetarien', 'vegan', 'sans_gluten'] }
        ]
      },
      {
        id: 'specialites_rares',
        nom: 'Spécialités Rares & Exceptionnelles',
        description: 'Plats uniques et expériences culinaires d\'exception',
        icon: '🦎',
        elements: [
          { id: 'mashanza-patates-douces', nom: 'Mashanza et Patates Douces', description: 'Spécialité locale rare, préparation traditionnelle authentique', origine: 'Tradition rare congolaise', rare_specialty: true },
          { id: 'crocodile', nom: 'Crocodile', description: 'Viande de crocodile préparée selon les techniques traditionnelles, expérience unique', origine: 'Spécialité exceptionnelle', rare_specialty: true, premium: true },
          { id: 'tortue', nom: 'Tortue', description: 'Préparation traditionnelle de tortue, mets d\'exception très rare', origine: 'Mets d\'exception congolais', rare_specialty: true, premium: true }
        ]
      }
    ]
  };
  
  // Afficher un message d'avertissement
  const categoriesContainer = document.getElementById('menuCategories');
  const warningDiv = document.createElement('div');
  warningDiv.className = 'mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg';
  warningDiv.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-amber-600 text-xl">⚠️</span>
      <div>
        <p class="font-bold text-amber-800">Menu de démonstration</p>
        <p class="text-amber-600 text-sm">Le fichier menu.json n'a pas pu être chargé. Menu de test affiché avec ${getTotalItemsCount(fallbackMenuData)} plats.</p>
      </div>
    </div>
  `;
  categoriesContainer.appendChild(warningDiv);
  
  renderRealMenuCategories(fallbackMenuData);
}

function loadMenuSelection() {
  try {
    const menuSelection = localStorage.getItem('arabesqueQuoteData');
    if (menuSelection) {
      const selection = JSON.parse(menuSelection);
      if (selection.selections && selection.selections.length > 0) {
        document.getElementById('menuSelectionField').value = menuSelection;
        displayDetectedMenu(selection);
      }
    }
  } catch (e) {
    console.log('No menu selection found');
  }
}

function displayDetectedMenu(selection) {
  const detectedMenuDiv = document.getElementById('detectedMenu');
  const detectedItemsDiv = document.getElementById('detectedMenuItems');
  
  if (selection.selections && selection.selections.length > 0) {
    detectedMenuDiv.classList.remove('hidden');
    
    // Set the formule and limits
    currentFormule = selection.formule;
    if (currentFormule && currentFormule.nombre_repas) {
      maxSelectionLimit = currentFormule.nombre_repas;
      document.getElementById('maxSelection').textContent = maxSelectionLimit;
    }
    
    // Add selections to our set
    selection.selections.forEach(item => {
      selectedMenuItems.add(item.key);
    });
    
    // Display items
    detectedItemsDiv.innerHTML = selection.selections.map(item => 
      `<span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs mr-2 mb-1">
        ${item.itemName}
      </span>`
    ).join('');
    
    updateSelectionCounter();
  }
}

function clearDetectedMenu() {
  localStorage.removeItem('arabesqueQuoteData');
  document.getElementById('detectedMenu').classList.add('hidden');
  document.getElementById('menuSelectionField').value = '';
  selectedMenuItems.clear();
  currentFormule = null;
  maxSelectionLimit = Infinity;
  document.getElementById('maxSelection').textContent = '∞';
  updateSelectionCounter();
  updateMenuItemsDisplay();
}

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
  
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.remove('active');
  });
  document.querySelector(`.form-step[data-step="${stepNumber}"]`).classList.add('active');
  
  document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
    indicator.classList.remove('active', 'completed');
    if (index + 1 === stepNumber) {
      indicator.classList.add('active');
    } else if (index + 1 < stepNumber) {
      indicator.classList.add('completed');
    }
  });
  
  if (stepNumber === 4) {
    generateQuoteSummary();
  }
  
  // Scroll to top of form
  document.getElementById('formulaire-devis').scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}

function updateProgressBar(step) {
  const progress = (step / 4) * 100;
  document.querySelector('.progress-fill').style.width = `${progress}%`;
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

function initializePricingCalculator() {
  const guestsInput = document.querySelector('input[name="guests_count"]');
  if (guestsInput) {
    guestsInput.addEventListener('input', function() {
      const guestCount = parseInt(this.value) || 0;
      calculatePricing(guestCount);
      updateFormuleLimit(guestCount);
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

function updateFormuleLimit(guestCount) {
  // Determine formule based on guest count
  if (guestCount <= 50) {
    maxSelectionLimit = Infinity; // Formule Intime - unlimited
    document.getElementById('maxSelection').textContent = '∞';
  } else if (guestCount <= 100) {
    maxSelectionLimit = Infinity; // Formule Optimale - unlimited
    document.getElementById('maxSelection').textContent = '∞';
  } else {
    // For 100+ guests, default to Premium formule (18 plats)
    maxSelectionLimit = 18;
    document.getElementById('maxSelection').textContent = maxSelectionLimit;
  }
  
  // If current selection exceeds new limit, show warning
  if (selectedMenuItems.size > maxSelectionLimit) {
    showLimitWarning();
  } else {
    hideLimitWarning();
  }
  
  updateSelectionCounter();
  updateMenuItemsDisplay();
}

function calculatePricing(guestCount) {
  if (guestCount === 0) {
    document.getElementById('pricingPreview').classList.add('hidden');
    return;
  }
  
  let basePrice = 0;
  let formula = '';
  
  if (guestCount <= 50) {
    basePrice = 35;
    formula = 'Formule Intime (1-50 personnes)';
  } else if (guestCount <= 100) {
    basePrice = 20;
    formula = 'Formule Optimale (50-100 personnes)';
  } else {
    basePrice = 20; // Default to Premium formula
    formula = 'Formule Premium (100+ personnes)';
  }
  
  const menuTotal = basePrice * guestCount;
  
  // Calculate cocktail service if selected
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
  
  pricingDiv.classList.remove('hidden');
  document.getElementById('estimatedTotalField').value = total;
}

function initializeMenuSelection() {
  // This will be called after menu data is loaded
}

function toggleMenuItemSelection(card) {
  const itemId = card.dataset.itemId;
  const itemName = card.dataset.itemName;
  const categoryName = card.dataset.category;
  const key = `${categoryName}::${itemName}`;
  
  if (selectedMenuItems.has(key)) {
    // Remove selection
    selectedMenuItems.delete(key);
    card.classList.remove('selected');
    card.querySelector('.selection-indicator').classList.add('hidden');
    hideLimitWarning();
  } else {
    // Check if we can add more items
    if (selectedMenuItems.size >= maxSelectionLimit) {
      showLimitWarning();
      return;
    }
    
    // Add selection
    selectedMenuItems.add(key);
    card.classList.add('selected');
    card.querySelector('.selection-indicator').classList.remove('hidden');
  }
  
  updateSelectionCounter();
  updateMenuItemsDisplay();
}

function updateSelectionCounter() {
  document.getElementById('currentSelection').textContent = selectedMenuItems.size;
}

function updateMenuItemsDisplay() {
  document.querySelectorAll('.menu-item-card').forEach(card => {
    const itemName = card.dataset.itemName;
    const categoryName = card.dataset.category;
    const key = `${categoryName}::${itemName}`;
    
    if (selectedMenuItems.has(key)) {
      card.classList.add('selected');
      card.querySelector('.selection-indicator').classList.remove('hidden');
    } else {
      card.classList.remove('selected');
      card.querySelector('.selection-indicator').classList.add('hidden');
    }
    
    // Disable cards if limit reached and not selected
    if (selectedMenuItems.size >= maxSelectionLimit && !selectedMenuItems.has(key)) {
      card.classList.add('disabled');
    } else {
      card.classList.remove('disabled');
    }
  });
}

function showLimitWarning() {
  const warningDiv = document.getElementById('limitWarning');
  warningDiv.classList.remove('hidden');
  warningDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideLimitWarning() {
  document.getElementById('limitWarning').classList.add('hidden');
}

function generateQuoteSummary() {
  const form = document.getElementById('quoteForm');
  const formData = new FormData(form);
  
  // Generate summary HTML
  const summary = document.getElementById('quoteSummary');
  const selectedItemsArray = Array.from(selectedMenuItems);
  
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
        <h5 class="font-semibold mb-2">🍽️ Menu sélectionné (${selectedItemsArray.length} plats)</h5>
        <div class="max-h-40 overflow-y-auto space-y-1">
          ${selectedItemsArray.map(key => {
            const [category, item] = key.split('::');
            return `<div class="text-sm p-2 bg-gray-50 rounded">
              <strong>${item}</strong>
              <span class="text-gray-500"> (${category})</span>
            </div>`;
          }).join('')}
        </div>
        
        ${formData.get('cocktail_service') ? '<p class="mt-2 text-green-600"><strong>✅ Service cocktail inclus</strong></p>' : ''}
        ${formData.get('dietary_requirements') ? `<p class="mt-2"><strong>Contraintes:</strong> ${formData.get('dietary_requirements')}</p>` : ''}
        ${formData.get('personal_message') ? `<p class="mt-2"><strong>Message:</strong> ${formData.get('personal_message')}</p>` : ''}
      </div>
    </div>
  `;
  
  // Update estimation details
  const estimationDiv = document.getElementById('estimationDetails');
  const estimatedTotal = document.getElementById('estimatedTotalField').value;
  if (estimatedTotal) {
    estimationDiv.innerHTML = `
      <div class="text-2xl font-bold text-gold mb-2">${estimatedTotal}$</div>
      <p class="text-sm text-gray-600">Prix estimé pour ${formData.get('guests_count')} personnes</p>
    `;
  }
}

function initializeFormValidation() {
  const form = document.getElementById('quoteForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    // Check consent checkboxes
    const consentContact = form.querySelector('input[name="consent_contact"]');
    const consentPrivacy = form.querySelector('input[name="consent_privacy"]');
    
    if (!consentContact.checked || !consentPrivacy.checked) {
      alert('Veuillez accepter les conditions de contact et la politique de confidentialité.');
      return;
    }
    
    const formData = new FormData(form);
    
    // Add selected menu items to form data
    const menuSelection = {
      items: Array.from(selectedMenuItems),
      count: selectedMenuItems.size,
      maxAllowed: maxSelectionLimit
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
  
  return `🌟 DEMANDE DE DEVIS - ARABESQUE TRAITEUR 🌟

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

🍽️ MENU SÉLECTIONNÉ (${selectedItemsArray.length} plats)
${selectedItemsArray.map(key => {
  const [category, item] = key.split('::');
  return `• ${item} (${category})`;
}).join('\n')}

${formData.get('cocktail_service') ? '🍹 SERVICE COCKTAIL SOUHAITÉ ✅\n' : ''}

${formData.get('dietary_requirements') ? `🥗 CONTRAINTES ALIMENTAIRES: ${formData.get('dietary_requirements')}\n` : ''}

💰 Budget: ${formData.get('budget_range') || 'Non précisé'}
💰 Estimation: ${formData.get('estimated_total')}$ (estimation automatique)

📝 MESSAGE: ${formData.get('personal_message') || 'Aucun message supplémentaire'}

Merci pour votre service d'exception! 🙏`;
}

function showSuccessMessage() {
  document.getElementById('formSuccess').classList.remove('hidden');
  document.getElementById('quoteForm').style.display = 'none';
  
  // Scroll to success message
  document.getElementById('formSuccess').scrollIntoView({ 
    behavior: 'smooth',
    block: 'center'
  });
}