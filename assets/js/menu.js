// Menu configurator for Arabesque Traiteur - Version Intégrée et Logique
(async function(){
  const budgetOptions = document.getElementById('budgetOptions');
  const selectionCount = document.getElementById('selectionCount');
  const selectionMax = document.getElementById('selectionMax');
  const menuGrid = document.getElementById('menuGrid');
  const resetBtn = document.getElementById('resetBtn');
  const selectionList = document.getElementById('selectionList');
  const toQuote = document.getElementById('toQuote');

  if (!budgetOptions) {
    console.log('⚠️ Elements du menu non trouvés - Page contact ?');
    return;
  }

  // Essayer plusieurs chemins pour menu.json
  const possiblePaths = [
    './data/menu.json',
    'data/menu.json', 
    '/data/menu.json',
    'menu.json',
    './menu.json',
    '../data/menu.json'
  ];

  let data = null;
  let currentFormule = null;
  let selected = new Set();

  // Charger les données du menu avec diagnostic complet
  async function loadMenuData() {
    for (const path of possiblePaths) {
      try {
        console.log(`🔍 Tentative de chargement : ${path}`);
        const res = await fetch(path);
        
        if (!res.ok) {
          console.log(`❌ ${path} : ${res.status} ${res.statusText}`);
          continue;
        }
        
        data = await res.json();
        console.log(`✅ Menu chargé avec succès depuis : ${path}`);
        console.log(`📊 Formules disponibles : ${data.formules?.length || 0}`);
        console.log(`📊 Catégories disponibles : ${data.categories?.length || 0}`);
        
        // Valider la structure des données
        if (!data.formules || !data.categories) {
          console.log('⚠️ Structure de données incomplète');
          throw new Error('Structure invalide');
        }
        
        return true;
        
      } catch (error) {
        console.log(`❌ Erreur avec ${path} :`, error.message);
      }
    }
    return false;
  }

  // Données de fallback complètes et réalistes
  function createFallbackData() {
    console.log('🧪 Création des données de menu de test');
    return {
      formules: [
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
      ],
      categories: [
        {
          id: 'entrees',
          nom: 'Entrées & Amuse-Bouches',
          description: 'Mises en bouche savoureuses pour commencer en beauté',
          icon: '🥂',
          elements: [
            { id: 'samoussa-viande', nom: 'Samoussa à la Viande', description: 'Pâte croustillante farcie de viande épicée, recette traditionnelle' },
            { id: 'brochette-beignets', nom: 'Brochette de Beignets', description: 'Beignets moelleux en brochette, sauce piquante d\'accompagnement' },
            { id: 'saucisse-pili', nom: 'Saucisses Pili', description: 'Saucisses locales grillées aux épices congolaises' },
            { id: 'plateau-fromage', nom: 'Plateau de Fromages', description: 'Sélection de fromages internationaux et locaux' },
            { id: 'rouleau-printemps', nom: 'Rouleaux de Printemps', description: 'Rouleaux frais aux légumes croquants et herbes fraîches' }
          ]
        },
        {
          id: 'salades',
          nom: 'Salades Fraîcheur',
          description: 'Accompagnements frais et colorés pour équilibrer le repas',
          icon: '🥗',
          elements: [
            { id: 'salade-grecque', nom: 'Salade Grecque', description: 'Tomates, concombres, olives, feta, oignon rouge, vinaigrette à l\'huile d\'olive' },
            { id: 'salade-nicoise', nom: 'Salade Niçoise', description: 'Thon, œufs durs, tomates, anchois, olives, haricots verts' },
            { id: 'macedoine-legumes', nom: 'Macédoine de Légumes', description: 'Mélange coloré de légumes frais en dés, mayonnaise légère' }
          ]
        },
        {
          id: 'repas_viandes',
          nom: 'Viandes & Spécialités Congolaises',
          description: 'Le cœur de la cuisine congolaise authentique',
          icon: '🥩',
          elements: [
            { id: 'cochon-lait-farci', nom: 'Cochon de Lait Farci', description: 'Cochon de lait tendre, farci aux herbes et épices locales', chef_special: true },
            { id: 'viande-chevre-nga-nda', nom: 'Viande de Chèvre façon Nga Nda', description: 'Chèvre mijotée selon la tradition ancestrale Nga Nda', chef_special: true },
            { id: 'maboke-ngulu', nom: 'Maboke y\'a Ngulu', description: 'Porc fumé traditionnel cuit dans les feuilles, méthode ancestrale', chef_special: true },
            { id: 'brochette-boeuf', nom: 'Brochette de Bœuf', description: 'Bœuf tendre grillé aux épices, marinade maison spéciale' },
            { id: 'emince-boeuf-legumes', nom: 'Émincé de Bœuf aux Légumes', description: 'Lamelles de bœuf sautées, légumes croquants de saison' },
            { id: 'cote-porc', nom: 'Côte de Porc', description: 'Côtes de porc grillées, sauce barbecue maison' },
            { id: 'cotes-agneau', nom: 'Côtes d\'Agneau', description: 'Côtes d\'agneau grillées, herbes de Provence', premium: true },
            { id: 'gigot-agneau', nom: 'Gigot d\'Agneau', description: 'Gigot d\'agneau rôti, jus corsé aux épices', premium: true }
          ]
        },
        {
          id: 'poissons',
          nom: 'Poissons & Fruits de Mer',
          description: 'Trésors du fleuve Congo et spécialités aquatiques',
          icon: '🐟',
          elements: [
            { id: 'gros-capitaine-braise', nom: 'Gros Capitaine Braisé', description: 'Poisson capitaine du fleuve Congo, braisé aux épices locales', chef_special: true },
            { id: 'capitaine-sauce-maniere', nom: 'Capitaine à la Sauce Manière', description: 'Capitaine en sauce traditionnelle congolaise authentique', chef_special: true },
            { id: 'mbinzo', nom: 'Mbinzo', description: 'Poisson séché traditionnel, préparé selon la coutume ancestrale' },
            { id: 'ndakala', nom: 'Ndakala', description: 'Petits poissons séchés, spécialité authentique du fleuve Congo' },
            { id: 'maboke-poisson-fleuve', nom: 'Maboke Poisson du Fleuve', description: 'Poisson du Congo cuit dans les feuilles, méthode ancestrale', chef_special: true },
            { id: 'tilapia-braise', nom: 'Tilapia Braisé', description: 'Tilapia frais braisé aux tomates et épices locales' },
            { id: 'crevettes', nom: 'Crevettes Sautées', description: 'Crevettes fraîches sautées à l\'ail et aux herbes', premium: true }
          ]
        },
        {
          id: 'volailles',
          nom: 'Volailles',
          description: 'Poulet, canard et spécialités de volaille',
          icon: '🐔',
          elements: [
            { id: 'poulet-braise', nom: 'Poulet Braisé', description: 'Poulet fermier braisé, sauce tomate épicée traditionnelle' },
            { id: 'cuisse-poulet-fume', nom: 'Cuisse de Poulet Fumé', description: 'Cuisses de poulet fumées artisanalement selon nos méthodes' },
            { id: 'aile-rond-poulet', nom: 'Aile Rond de Poulet', description: 'Ailes de poulet marinées et grillées à la perfection' },
            { id: 'makayabu-goma', nom: 'Makayabu (Goma)', description: 'Spécialité de Goma, viande séchée et épicée', regional_specialty: true },
            { id: 'dinde', nom: 'Dinde Rôtie', description: 'Dinde fermière rôtie, farce traditionnelle aux herbes' }
          ]
        },
        {
          id: 'legumes_verts',
          nom: 'Légumes Verts & Spécialités Végétales',
          description: 'Légumes traditionnels congolais et légumes verts',
          icon: '🥬',
          elements: [
            { id: 'pondu', nom: 'Pondu', description: 'Feuilles de manioc pilées, plat emblématique et national congolais', chef_special: true },
            { id: 'fum-bwa', nom: 'Fum Bwa', description: 'Légumes verts traditionnels, feuilles locales sélectionnées' },
            { id: 'aubergines-vertes', nom: 'Aubergines Vertes (Nyanya/Solo)', description: 'Aubergines locales mijotées, sauce traditionnelle congolaise' },
            { id: 'epinards', nom: 'Épinards', description: 'Épinards frais sautés aux oignons et aromates' },
            { id: 'feuille-courge-arachides', nom: 'Feuille de Courge aux Arachides', description: 'Feuilles de courge, pâte d\'arachide, recette ancestrale' },
            { id: 'dongo-dongo', nom: 'Dongo Dongo', description: 'Légume visqueux traditionnel, sauce onctueuse authentique' },
            { id: 'mbika', nom: 'Mbika', description: 'Légume-feuille congolais, préparation authentique traditionnelle' }
          ]
        },
        {
          id: 'accompaniments',
          nom: 'Accompagnements & Féculents',
          description: 'Base nutritive traditionnelle congolaise',
          icon: '🍚',
          elements: [
            { id: 'riz-blanc', nom: 'Riz Blanc', description: 'Riz parfumé cuit à la vapeur, accompagnement universel' },
            { id: 'riz-cantonais', nom: 'Riz Cantonais', description: 'Riz sauté aux légumes et œufs, style asiatique' },
            { id: 'fufu', nom: 'Fufu', description: 'Pâte de manioc traditionnelle, accompagnement emblématique congolais', chef_special: true },
            { id: 'lituma', nom: 'Lituma', description: 'Pâte de maïs traditionnelle congolaise, texture authentique' },
            { id: 'makemba', nom: 'Makemba', description: 'Bananes plantain, préparation traditionnelle congolaise' },
            { id: 'pommes-terre-beurre', nom: 'Pommes de Terre au Beurre', description: 'Pommes de terre fondantes au beurre frais' },
            { id: 'bisamunyu', nom: 'Bisamunyu', description: 'Tubercule local, préparation traditionnelle congolaise' },
            { id: 'manioc-frais', nom: 'Manioc Frais', description: 'Manioc frais bouilli, base alimentaire congolaise authentique' }
          ]
        },
        {
          id: 'fruits',
          nom: 'Fruits & Desserts Naturels',
          description: 'Fraîcheur tropicale et desserts aux fruits',
          icon: '🍓',
          elements: [
            { id: 'plateau-fruits-saison', nom: 'Plateau de Fruits de Saison', description: 'Sélection quotidienne des meilleurs fruits locaux et importés' },
            { id: 'fruits-tropicaux', nom: 'Fruits Tropicaux', description: 'Ananas, mangue, papaye, banane, fruit de la passion' }
          ]
        },
        {
          id: 'specialites_rares',
          nom: 'Spécialités Rares & Exceptionnelles',
          description: 'Plats uniques et expériences culinaires d\'exception',
          icon: '🦎',
          elements: [
            { id: 'mashanza-patates-douces', nom: 'Mashanza et Patates Douces', description: 'Spécialité locale rare, préparation traditionnelle authentique', rare_specialty: true },
            { id: 'crocodile', nom: 'Crocodile', description: 'Viande de crocodile préparée selon les techniques traditionnelles', rare_specialty: true, premium: true },
            { id: 'tortue', nom: 'Tortue', description: 'Préparation traditionnelle de tortue, mets d\'exception très rare', rare_specialty: true, premium: true }
          ]
        }
      ]
    };
  }

  // Charger données avec fallback intelligent
  const loaded = await loadMenuData();
  if (!loaded) {
    console.log('🚨 Impossible de charger menu.json - Utilisation des données de test complètes');
    data = createFallbackData();
  }

  // Initialiser avec la première formule
  currentFormule = data.formules[0];

  // Initialize everything
  renderFormuleOptions();
  renderMenu();
  updateUI();

  // Rendre les options de formule avec design amélioré
  function renderFormuleOptions() {
    if (!budgetOptions) return;
    
    budgetOptions.innerHTML = '';
    data.formules.forEach((formule, idx) => {
      const wrapper = document.createElement('label');
      wrapper.className = `
        formule-card bg-gradient-to-br backdrop-blur rounded-xl p-6 border-2 cursor-pointer 
        transition-all duration-300 hover:scale-105 relative text-center
        ${idx === 0 ? 'border-gold bg-gold/20' : 'border-gray-300 hover:border-gold hover:bg-gold/10'}
      `;
      
      const radio = document.createElement('input');
      radio.className = 'sr-only';
      radio.type = 'radio';
      radio.name = 'formule';
      radio.checked = idx === 0;
      
      const badge = document.createElement('span');
      badge.className = `inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 ${
        idx === 0 ? 'bg-gold text-black' : 'bg-gray-200 text-gray-700'
      }`;
      badge.textContent = formule.badge || '';
      
      const title = document.createElement('h3');
      title.className = 'font-display text-xl font-bold mb-3';
      title.textContent = formule.nom;
      
      const price = document.createElement('div');
      price.className = `text-3xl font-bold mb-2 ${idx === 0 ? 'text-gold' : 'text-gray-700'}`;
      price.textContent = `${formule.prix}$`;
      
      const subtitle = document.createElement('div');
      subtitle.className = 'text-sm text-gray-500 mb-4';
      subtitle.textContent = 'par personne';
      
      const limit = document.createElement('div');
      limit.className = 'text-lg font-bold mb-4';
      if (formule.nombre_repas) {
        limit.textContent = `${formule.nombre_repas} repas`;
      } else {
        limit.textContent = 'Choix illimité';
      }
      
      const description = document.createElement('p');
      description.className = 'text-sm text-gray-600 mb-6';
      description.textContent = formule.description || '';
      
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `btn w-full ${
        idx === 0 ? 'btn-gold' : 'bg-gray-200 hover:bg-gold hover:text-black text-gray-700'
      }`;
      button.textContent = idx === 0 ? 'Sélectionné' : 'Choisir';
      
      wrapper.appendChild(radio);
      wrapper.appendChild(badge);
      wrapper.appendChild(title);
      wrapper.appendChild(price);
      wrapper.appendChild(subtitle);
      wrapper.appendChild(limit);
      wrapper.appendChild(description);
      wrapper.appendChild(button);
      
      wrapper.addEventListener('click', () => { 
        // Update visual states
        document.querySelectorAll('.formule-card').forEach(card => {
          card.classList.remove('border-gold', 'bg-gold/20');
          card.classList.add('border-gray-300');
          card.querySelector('.btn').textContent = 'Choisir';
          card.querySelector('.btn').classList.remove('btn-gold');
          card.querySelector('.btn').classList.add('bg-gray-200', 'hover:bg-gold', 'hover:text-black', 'text-gray-700');
          card.querySelector('span').classList.remove('bg-gold', 'text-black');
          card.querySelector('span').classList.add('bg-gray-200', 'text-gray-700');
          card.querySelector('.text-3xl').classList.remove('text-gold');
          card.querySelector('.text-3xl').classList.add('text-gray-700');
        });
        
        wrapper.classList.add('border-gold', 'bg-gold/20');
        wrapper.classList.remove('border-gray-300');
        wrapper.querySelector('.btn').textContent = 'Sélectionné';
        wrapper.querySelector('.btn').classList.add('btn-gold');
        wrapper.querySelector('.btn').classList.remove('bg-gray-200', 'hover:bg-gold', 'hover:text-black', 'text-gray-700');
        wrapper.querySelector('span').classList.add('bg-gold', 'text-black');
        wrapper.querySelector('span').classList.remove('bg-gray-200', 'text-gray-700');
        wrapper.querySelector('.text-3xl').classList.add('text-gold');
        wrapper.querySelector('.text-3xl').classList.remove('text-gray-700');
        
        currentFormule = formule; 
        enforceLimit(); 
        updateUI();
        
        // Scroll to menu if not visible
        setTimeout(() => {
          const menuSection = document.getElementById('menuSelection');
          if (menuSection && !menuSection.classList.contains('hidden')) {
            menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      });
      
      budgetOptions.appendChild(wrapper);
    });
    
    updateSelectionMax();
  }

  // Rendre le menu avec design amélioré
  function renderMenu() {
    if (!menuGrid) return;
    
    menuGrid.innerHTML = '';
    
    data.categories.forEach(category => {
      const card = document.createElement('div');
      card.className = 'bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300';
      
      const header = document.createElement('div');
      header.className = 'mb-6';
      
      const titleContainer = document.createElement('div');
      titleContainer.className = 'flex items-center gap-3 mb-3';
      
      const icon = document.createElement('span');
      icon.className = 'text-2xl';
      icon.textContent = category.icon || '🍽️';
      
      const titleInfo = document.createElement('div');
      titleInfo.className = 'flex-1';
      
      const title = document.createElement('h3');
      title.className = 'font-bold text-xl text-gray-900';
      title.textContent = category.nom;
      
      const count = document.createElement('span');
      count.className = 'ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium';
      count.textContent = `${category.elements ? category.elements.length : 0} plats`;
      
      const description = document.createElement('p');
      description.className = 'text-sm text-gray-600 mt-2';
      description.textContent = category.description || '';
      
      titleInfo.appendChild(title);
      titleContainer.appendChild(icon);
      titleContainer.appendChild(titleInfo);
      titleContainer.appendChild(count);
      
      header.appendChild(titleContainer);
      header.appendChild(description);
      
      const list = document.createElement('div');
      list.className = 'space-y-3';

      if (!category.elements || category.elements.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg';
        placeholder.innerHTML = `
          <div class="text-2xl mb-2">🍽️</div>
          <p class="text-sm italic">Sélection à venir...</p>
          <p class="text-xs text-gray-500 mt-1">Cette catégorie sera bientôt disponible</p>
        `;
        list.appendChild(placeholder);
      } else {
        category.elements.forEach(element => {
          const key = `${category.nom}::${element.nom}`;
          
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `
            w-full border border-gray-200 rounded-xl p-4 text-left 
            hover:border-gold hover:shadow-md transition-all duration-300 
            group bg-white hover:bg-gold/5 relative
          `;
          btn.setAttribute('aria-pressed', 'false');
          btn.setAttribute('data-key', key);
          
          // Badges pour spécialités
          let badgeHtml = '';
          if (element.chef_special) {
            badgeHtml = '<div class="absolute top-2 right-2 bg-gold text-black text-xs px-2 py-1 rounded-full font-bold">Chef</div>';
          } else if (element.rare_specialty) {
            badgeHtml = '<div class="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">Rare</div>';
          } else if (element.premium) {
            badgeHtml = '<div class="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">Premium</div>';
          }
          
          const contentDiv = document.createElement('div');
          contentDiv.className = 'flex items-start justify-between';
          
          const mainContent = document.createElement('div');
          mainContent.className = 'flex-1 pr-4';
          
          const nameSpan = document.createElement('h4');
          nameSpan.className = 'font-semibold text-gray-900 group-hover:text-gold transition-colors mb-2';
          nameSpan.textContent = element.nom;
          
          const descSpan = document.createElement('p');
          descSpan.className = 'text-sm text-gray-600 line-clamp-2 leading-relaxed';
          descSpan.textContent = element.description || 'Délicieuse spécialité de notre chef';
          
          const actionDiv = document.createElement('div');
          actionDiv.className = 'flex flex-col items-end gap-2 min-w-20';
          
          const actionSpan = document.createElement('span');
          actionSpan.className = 'text-xs px-3 py-2 bg-gray-100 text-gray-600 rounded-full transition-all group-hover:bg-gold group-hover:text-white font-medium';
          actionSpan.textContent = 'Ajouter';
          
          mainContent.appendChild(nameSpan);
          mainContent.appendChild(descSpan);
          actionDiv.appendChild(actionSpan);
          contentDiv.appendChild(mainContent);
          contentDiv.appendChild(actionDiv);
          
          btn.innerHTML = badgeHtml;
          btn.appendChild(contentDiv);
          
          btn.addEventListener('click', () => toggleItem(key, btn));
          list.appendChild(btn);
        });
      }

      card.appendChild(header);
      card.appendChild(list);
      menuGrid.appendChild(card);
    });
  }

  // Toggle item selection avec gestion des limites améliorée
  function toggleItem(key, btn) {
    if (selected.has(key)) {
      selected.delete(key);
    } else {
      // Vérifier la limite avec feedback utilisateur
      if (currentFormule.nombre_repas && selected.size >= currentFormule.nombre_repas) {
        const actionSpan = btn.querySelector('span');
        const originalText = actionSpan.textContent;
        const originalClasses = actionSpan.className;
        
        // Animation d'erreur
        actionSpan.textContent = 'Limite atteinte!';
        actionSpan.className = 'text-xs px-3 py-2 bg-red-500 text-white rounded-full font-medium animate-pulse';
        btn.classList.add('animate-pulse');
        
        setTimeout(() => {
          actionSpan.textContent = originalText;
          actionSpan.className = originalClasses;
          btn.classList.remove('animate-pulse');
        }, 1500);
        
        // Faire défiler vers le compteur pour montrer la limite
        if (selectionCount) {
          selectionCount.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return;
      }
      selected.add(key);
    }
    
    updateButtons();
    updateUI();
  }

  // Mettre à jour les boutons avec style amélioré
  function updateButtons() {
    const buttons = menuGrid.querySelectorAll('button[data-key]');
    buttons.forEach(btn => {
      const key = btn.getAttribute('data-key');
      const isSelected = selected.has(key);
      const actionSpan = btn.querySelector('span');
      
      btn.setAttribute('aria-pressed', String(isSelected));
      
      if (isSelected) {
        btn.classList.add('border-gold', 'bg-gold/10', 'shadow-md');
        btn.classList.remove('border-gray-200', 'bg-white');
        actionSpan.textContent = 'Sélectionné ✓';
        actionSpan.classList.remove('bg-gray-100', 'text-gray-600', 'group-hover:bg-gold', 'group-hover:text-white');
        actionSpan.classList.add('bg-green-500', 'text-white');
      } else {
        btn.classList.remove('border-gold', 'bg-gold/10', 'shadow-md');
        btn.classList.add('border-gray-200', 'bg-white');
        actionSpan.textContent = 'Ajouter';
        actionSpan.classList.add('bg-gray-100', 'text-gray-600', 'group-hover:bg-gold', 'group-hover:text-white');
        actionSpan.classList.remove('bg-green-500', 'text-white');
      }
      
      // Désactiver si limite atteinte et non sélectionné
      if (currentFormule.nombre_repas && selected.size >= currentFormule.nombre_repas && !isSelected) {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        actionSpan.classList.add('bg-gray-300', 'text-gray-500');
        actionSpan.classList.remove('group-hover:bg-gold', 'group-hover:text-white');
      } else {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        if (!isSelected) {
          actionSpan.classList.remove('bg-gray-300', 'text-gray-500');
          actionSpan.classList.add('group-hover:bg-gold', 'group-hover:text-white');
        }
      }
    });
  }

  // Appliquer les limites quand la formule change
  function enforceLimit() {
    if (!currentFormule.nombre_repas) return; // illimité
    
    if (selected.size > currentFormule.nombre_repas) {
      const selectedArray = Array.from(selected);
      selected.clear();
      // Garder seulement les N premiers
      selectedArray.slice(0, currentFormule.nombre_repas).forEach(key => {
        selected.add(key);
      });
      
      console.log(`⚠️ Limite appliquée: ${currentFormule.nombre_repas} plats maximum`);
    }
    
    updateButtons();
  }

  // Mettre à jour l'UI complète
  function updateUI() {
    updateSelectionCount();
    updateSelectionMax();
    updateSelectionList();
    updateQuoteButton();
  }

  // Mettre à jour le compteur avec feedback visuel
  function updateSelectionCount() {
    if (selectionCount) {
      selectionCount.textContent = selected.size;
      
      // Feedback visuel basé sur la progression
      if (currentFormule.nombre_repas) {
        const percentage = (selected.size / currentFormule.nombre_repas) * 100;
        
        if (percentage >= 100) {
          selectionCount.className = 'font-bold text-2xl text-green-600';
        } else if (percentage >= 80) {
          selectionCount.className = 'font-bold text-2xl text-orange-600';
        } else {
          selectionCount.className = 'font-bold text-2xl text-gold';
        }
      } else {
        selectionCount.className = 'font-bold text-2xl text-gold';
      }
    }
  }

  // Mettre à jour le maximum avec info contextuelle
  function updateSelectionMax() {
    if (selectionMax) {
      if (currentFormule.nombre_repas) {
        selectionMax.textContent = currentFormule.nombre_repas;
        selectionMax.className = 'font-bold text-lg text-gray-700';
      } else {
        selectionMax.textContent = '∞';
        selectionMax.className = 'font-bold text-lg text-blue-600';
      }
    }
  }

  // Mettre à jour la liste de sélection avec design amélioré
  function updateSelectionList() {
    if (!selectionList) return;
    
    selectionList.innerHTML = '';
    
    if (selected.size === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'text-center py-12 text-gray-400';
      emptyMsg.innerHTML = `
        <div class="text-4xl mb-4">🍽️</div>
        <h4 class="font-semibold text-lg text-gray-600 mb-2">Aucun plat sélectionné</h4>
        <p class="text-sm">Parcourez notre menu et choisissez vos spécialités préférées</p>
        <p class="text-xs mt-2 text-gray-500">
          ${currentFormule.nombre_repas ? `Vous pouvez sélectionner jusqu'à ${currentFormule.nombre_repas} plats` : 'Sélection illimitée disponible'}
        </p>
      `;
      selectionList.appendChild(emptyMsg);
      return;
    }

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-6 pb-3 border-b border-gray-200';
    
    const titleDiv = document.createElement('div');
    const title = document.createElement('h4');
    title.className = 'font-bold text-lg text-gray-900';
    title.textContent = 'Votre sélection';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-sm text-gray-500 mt-1';
    subtitle.textContent = `${currentFormule.nom} • ${currentFormule.prix}$ par personne`;
    
    titleDiv.appendChild(title);
    titleDiv.appendChild(subtitle);
    
    const countBadge = document.createElement('div');
    countBadge.className = 'text-center';
    
    const count = document.createElement('span');
    count.className = 'inline-block px-4 py-2 bg-gold text-black rounded-full font-bold text-sm';
    count.textContent = `${selected.size} plat${selected.size > 1 ? 's' : ''}`;
    
    const limit = document.createElement('div');
    limit.className = 'text-xs text-gray-500 mt-1';
    if (currentFormule.nombre_repas) {
      const remaining = currentFormule.nombre_repas - selected.size;
      limit.textContent = remaining > 0 ? `${remaining} restant${remaining > 1 ? 's' : ''}` : 'Limite atteinte';
    } else {
      limit.textContent = 'Illimité';
    }
    
    countBadge.appendChild(count);
    countBadge.appendChild(limit);
    
    header.appendChild(titleDiv);
    header.appendChild(countBadge);
    selectionList.appendChild(header);

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'space-y-3 max-h-80 overflow-y-auto';

    Array.from(selected).forEach((key, index) => {
      const [categoryName, itemName] = key.split('::');
      
      const item = document.createElement('div');
      item.className = 'flex justify-between items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100';
      
      const itemInfo = document.createElement('div');
      itemInfo.className = 'flex-1 pr-4';
      
      const orderNumber = document.createElement('span');
      orderNumber.className = 'inline-block w-6 h-6 bg-gold text-black rounded-full text-xs font-bold flex items-center justify-center mb-2';
      orderNumber.textContent = index + 1;
      
      const itemNameSpan = document.createElement('h5');
      itemNameSpan.className = 'font-semibold text-sm text-gray-900 mb-1';
      itemNameSpan.textContent = itemName;
      
      const categorySpan = document.createElement('span');
      categorySpan.className = 'text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full';
      categorySpan.textContent = categoryName;
      
      itemInfo.appendChild(orderNumber);
      itemInfo.appendChild(itemNameSpan);
      itemInfo.appendChild(categorySpan);
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors group';
      removeBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      `;
      removeBtn.title = `Retirer "${itemName}"`;
      removeBtn.addEventListener('click', () => {
        selected.delete(key);
        updateButtons();
        updateUI();
      });
      
      item.appendChild(itemInfo);
      item.appendChild(removeBtn);
      itemsContainer.appendChild(item);
    });

    selectionList.appendChild(itemsContainer);
  }

  // Mettre à jour le bouton devis avec informations détaillées
  function updateQuoteButton() {
    if (!toQuote) return;
    
    if (selected.size > 0) {
      toQuote.disabled = false;
      toQuote.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-400');
      toQuote.classList.add('bg-gold', 'hover:bg-gold/90', 'text-black');
      
      const estimatedTotal = selected.size > 0 ? `Estimation dès ${currentFormule.prix}$/personne` : '';
      
      toQuote.innerHTML = `
        <div class="flex flex-col items-center">
          <span class="font-bold">💬 Demander un devis personnalisé</span>
          <span class="text-sm opacity-90 mt-1">
            ${selected.size} plat${selected.size > 1 ? 's' : ''} • ${currentFormule.nom} • ${estimatedTotal}
          </span>
        </div>
      `;
    } else {
      toQuote.disabled = true;
      toQuote.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-400');
      toQuote.classList.remove('bg-gold', 'hover:bg-gold/90', 'text-black');
      
      toQuote.innerHTML = `
        <div class="flex flex-col items-center text-gray-600">
          <span class="font-medium">Sélectionnez vos plats</span>
          <span class="text-sm mt-1">pour obtenir un devis personnalisé</span>
        </div>
      `;
    }
  }

  // Reset button avec confirmation
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (selected.size === 0) {
        return;
      }
      
      const confirmMessage = `Êtes-vous sûr de vouloir effacer votre sélection de ${selected.size} plat${selected.size > 1 ? 's' : ''} ?\n\nCette action ne peut pas être annulée.`;
      
      if (confirm(confirmMessage)) {
        selected.clear();
        updateButtons();
        updateUI();
        
        console.log('🔄 Sélection réinitialisée par l\'utilisateur');
      }
    });
  }

  // Quote button - SAUVEGARDE COMPLÈTE POUR CONTACT
  if (toQuote) {
    toQuote.addEventListener('click', () => {
      if (selected.size === 0) {
        alert('Veuillez sélectionner au moins un plat avant de demander un devis.');
        return;
      }
      
      // Préparer les données détaillées avec toutes les informations
      const selectedItems = Array.from(selected).map((key, index) => {
        const [categoryName, itemName] = key.split('::');
        const category = data.categories.find(cat => cat.nom === categoryName);
        const item = category ? category.elements.find(el => el.nom === itemName) : null;
        
        return {
          key,
          categoryName,
          itemName,
          description: item ? item.description : '',
          item: item,
          order: index + 1,
          chef_special: item ? item.chef_special : false,
          rare_specialty: item ? item.rare_specialty : false,
          premium: item ? item.premium : false
        };
      });
      
      const quoteData = {
        formule: {
          ...currentFormule,
          selected: true,
          timestamp: new Date().toISOString()
        },
        selections: selectedItems,
        summary: {
          totalPlats: selected.size,
          prixParPersonne: currentFormule.prix,
          formuleNom: currentFormule.nom,
          limitePlats: currentFormule.nombre_repas,
          isUnlimited: !currentFormule.nombre_repas
        },
        metadata: {
          created: new Date().toISOString(),
          source: 'menu_configurator',
          version: '2.0',
          dataCount: {
            formules: data.formules.length,
            categories: data.categories.length,
            totalItems: data.categories.reduce((sum, cat) => sum + (cat.elements ? cat.elements.length : 0), 0)
          }
        }
      };
      
      try {
        // SAUVEGARDER DANS LOCALSTORAGE avec gestion d'erreur
        localStorage.setItem('arabesqueQuoteData', JSON.stringify(quoteData));
        
        console.log('✅ Menu sauvegardé pour contact :', {
          plats: quoteData.selections.length,
          formule: quoteData.formule.nom,
          prix: quoteData.formule.prix
        });
        
        // Feedback utilisateur avec détails
        const summaryMessage = `
✅ Menu configuré avec succès !

📋 Récapitulatif :
• ${selected.size} plat${selected.size > 1 ? 's' : ''} sélectionné${selected.size > 1 ? 's' : ''}
• ${currentFormule.nom} (${currentFormule.prix}$ par personne)
• ${currentFormule.nombre_repas ? `${currentFormule.nombre_repas} plats maximum` : 'Choix illimité'}

Vous allez être redirigé vers le formulaire de devis qui sera automatiquement pré-rempli avec votre sélection.

Continuer ?`;
        
        if (confirm(summaryMessage)) {
          // Redirection avec smooth scroll vers formulaire
          window.location.href = 'contact.html#formulaire-devis';
        }
        
      } catch (error) {
        console.error('❌ Erreur de sauvegarde :', error);
        alert('Erreur lors de la sauvegarde de votre sélection. Veuillez réessayer.');
      }
    });
  }

  // Message de succès d'initialisation
  console.log('🎉 Menu Arabesque Traiteur initialisé avec succès !');
  console.log(`📊 Statistiques chargées :`);
  console.log(`   • ${data.formules.length} formules disponibles`);
  console.log(`   • ${data.categories.length} catégories de menu`);
  console.log(`   • ${data.categories.reduce((sum, cat) => sum + (cat.elements ? cat.elements.length : 0), 0)} plats au total`);
  console.log(`   • Formule active : ${currentFormule.nom} (${currentFormule.prix}$)`);

})();
