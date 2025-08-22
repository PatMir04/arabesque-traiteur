// Menu configurator for Arabesque Traiteur - Version Complète et Robuste
(async function(){
  const budgetOptions = document.getElementById('budgetOptions');
  const selectionCount = document.getElementById('selectionCount');
  const selectionMax = document.getElementById('selectionMax');
  const menuGrid = document.getElementById('menuGrid');
  const resetBtn = document.getElementById('resetBtn');
  const selectionList = document.getElementById('selectionList');
  const toQuote = document.getElementById('toQuote');

  if (!budgetOptions) {
    console.log('⚠️ Elements du menu non trouvés - êtes-vous sur la bonne page ?');
    return;
  }

  // Essayer plusieurs chemins possibles pour menu.json
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

  // Fonction pour charger les données du menu avec fallback
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
        console.log(`✅ Menu chargé depuis : ${path}`);
        console.log('📊 Données du menu :', data);
        return true;
        
      } catch (error) {
        console.log(`❌ Erreur avec ${path} :`, error.message);
      }
    }
    return false;
  }

  // Fonction de fallback avec données de test complètes
  function createTestData() {
    console.log('🧪 Création des données de test Arabesque Traiteur');
    return {
      formules: [
        {
          id: 'intime',
          nom: 'Formule Intime',
          prix: 35,
          nombre_repas: null,
          description: '1-50 personnes - Service personnalisé',
          badge: 'INTIME'
        },
        {
          id: 'optimale',
          nom: 'Formule Optimale', 
          prix: 20,
          nombre_repas: null,
          description: '50-100 personnes - Excellent rapport qualité-prix',
          badge: 'POPULAIRE'
        },
        {
          id: 'essentielle',
          nom: 'Formule Essentielle',
          prix: 15,
          nombre_repas: 14,
          description: '100+ personnes - 14 repas au choix',
          badge: 'ÉCONOMIQUE'
        },
        {
          id: 'premium',
          nom: 'Formule Premium',
          prix: 20,
          nombre_repas: 18,
          description: '100+ personnes - 18 repas au choix',
          badge: 'ÉQUILIBRÉE'
        },
        {
          id: 'excellence',
          nom: 'Formule Excellence',
          prix: 25,
          nombre_repas: 20,
          description: '100+ personnes - 20 repas au choix',
          badge: 'PRESTIGE'
        }
      ],
      categories: [
        {
          id: 'entrees',
          nom: 'Entrées & Amuse-Bouches',
          description: 'Mises en bouche savoureuses pour commencer en beauté',
          elements: [
            { id: 'samoussa-viande', nom: 'Samoussa à la Viande', description: 'Pâte croustillante farcie de viande épicée' },
            { id: 'brochette-beignets', nom: 'Brochette de Beignets', description: 'Beignets moelleux en brochette' },
            { id: 'plateau-fromage', nom: 'Plateau de Fromages', description: 'Sélection de fromages internationaux' }
          ]
        },
        {
          id: 'repas_viandes',
          nom: 'Viandes & Spécialités',
          description: 'Le cœur de la cuisine congolaise authentique',
          elements: [
            { id: 'cochon-lait-farci', nom: 'Cochon de Lait Farci', description: 'Cochon de lait tendre, farci aux herbes et épices locales' },
            { id: 'viande-chevre-nga-nda', nom: 'Viande de Chèvre façon Nga Nda', description: 'Chèvre mijotée selon la tradition Nga Nda' },
            { id: 'maboke-ngulu', nom: 'Maboke y\'a Ngulu', description: 'Porc fumé traditionnel dans les feuilles' },
            { id: 'brochette-boeuf', nom: 'Brochette de Bœuf', description: 'Bœuf tendre grillé aux épices, marinade maison' }
          ]
        },
        {
          id: 'poissons',
          nom: 'Poissons & Fruits de Mer',
          description: 'Trésors du fleuve Congo et spécialités aquatiques',
          elements: [
            { id: 'gros-capitaine-braise', nom: 'Gros Capitaine Braisé', description: 'Poisson capitaine du Congo, braisé aux épices locales' },
            { id: 'capitaine-sauce-maniere', nom: 'Capitaine à la Sauce Manière', description: 'Capitaine en sauce traditionnelle congolaise' },
            { id: 'tilapia-braise', nom: 'Tilapia Braisé', description: 'Tilapia frais braisé aux tomates et épices' }
          ]
        },
        {
          id: 'volailles',
          nom: 'Volailles',
          description: 'Poulet, canard et spécialités de volaille',
          elements: [
            { id: 'poulet-braise', nom: 'Poulet Braisé', description: 'Poulet fermier braisé, sauce tomate épicée' },
            { id: 'cuisse-poulet-fume', nom: 'Cuisse de Poulet Fumé', description: 'Cuisses de poulet fumées artisanalement' },
            { id: 'aile-rond-poulet', nom: 'Aile Rond de Poulet', description: 'Ailes de poulet marinées et grillées' }
          ]
        },
        {
          id: 'legumes_verts',
          nom: 'Légumes Verts & Accompagnements',
          description: 'Légumes traditionnels congolais et légumes verts',
          elements: [
            { id: 'pondu', nom: 'Pondu', description: 'Feuilles de manioc pilées, plat emblématique congolais' },
            { id: 'fum-bwa', nom: 'Fum Bwa', description: 'Légumes verts traditionnels, feuilles locales' },
            { id: 'aubergines-vertes', nom: 'Aubergines Vertes (Nyanya/Solo)', description: 'Aubergines locales mijotées' }
          ]
        },
        {
          id: 'accompaniments',
          nom: 'Accompagnements & Féculents',
          description: 'Base nutritive traditionnelle congolaise',
          elements: [
            { id: 'riz-blanc', nom: 'Riz Blanc', description: 'Riz parfumé cuit à la vapeur' },
            { id: 'fufu', nom: 'Fufu', description: 'Pâte de manioc traditionnelle, accompagnement emblématique' },
            { id: 'makemba', nom: 'Makemba', description: 'Bananes plantain, préparation traditionnelle congolaise' },
            { id: 'pommes-terre-beurre', nom: 'Pommes de Terre au Beurre', description: 'Pommes de terre fondantes au beurre frais' }
          ]
        },
        {
          id: 'fruits',
          nom: 'Fruits & Desserts Naturels',
          description: 'Fraîcheur tropicale et desserts aux fruits',
          elements: [
            { id: 'plateau-fruits-saison', nom: 'Plateau de Fruits de Saison', description: 'Sélection quotidienne des meilleurs fruits locaux et importés' },
            { id: 'fruits-tropicaux', nom: 'Fruits Tropicaux', description: 'Ananas, mangue, papaye, banane, fruit de la passion' }
          ]
        }
      ]
    };
  }

  // Charger les données avec gestion d'erreur complète
  const loaded = await loadMenuData();
  if (!loaded) {
    console.log('🚨 IMPOSSIBLE DE CHARGER MENU.JSON - Utilisation des données de test');
    console.log('🔧 Solutions possibles :');
    console.log('1. Créez le dossier "data" à côté de votre menu.html');
    console.log('2. Placez menu.json dans ce dossier');
    console.log('3. Utilisez un serveur local (Live Server, python -m http.server, etc.)');
    console.log('4. Vérifiez que menu.json contient des données valides');
    
    data = createTestData();
    
    // Afficher un avertissement visible à l'utilisateur
    if (menuGrid) {
      const warningDiv = document.createElement('div');
      warningDiv.className = 'col-span-full bg-amber-50 border-l-4 border-amber-400 p-6 mb-6';
      warningDiv.innerHTML = `
        <div class="flex items-start">
          <div class="text-2xl mr-3">⚠️</div>
          <div>
            <h3 class="font-bold text-amber-800 mb-2">Mode Démonstration</h3>
            <p class="text-amber-700 text-sm mb-3">
              Le fichier menu.json n'a pas pu être chargé. Données de test affichées.
            </p>
            <details class="text-xs">
              <summary class="cursor-pointer font-medium text-amber-800 hover:text-amber-900">
                💡 Comment résoudre ce problème ?
              </summary>
              <div class="mt-2 space-y-1 text-amber-600">
                <p>• Créez un dossier <code class="bg-amber-100 px-1 rounded">data/</code> à côté de menu.html</p>
                <p>• Placez votre fichier <code class="bg-amber-100 px-1 rounded">menu.json</code> dans ce dossier</p>
                <p>• Utilisez un serveur local au lieu d'ouvrir directement le fichier</p>
                <p>• Vérifiez la console (F12) pour les détails techniques</p>
              </div>
            </details>
          </div>
        </div>
      `;
      
      // Insérer l'avertissement avant le contenu du menu
      const container = menuGrid.parentElement;
      container.insertBefore(warningDiv, menuGrid);
    }
  }

  // Vérifier que les données sont valides
  if (!data || !data.formules || !data.categories) {
    console.error('🚨 DONNÉES INVALIDES :', data);
    if (menuGrid) {
      menuGrid.innerHTML = `
        <div class="col-span-full text-center py-12 bg-red-50 border border-red-200 rounded-lg">
          <div class="text-4xl mb-4">🚨</div>
          <h3 class="font-bold text-red-800 text-lg mb-2">Erreur de données</h3>
          <p class="text-red-600 text-sm mb-4">
            Le fichier menu.json existe mais ne contient pas les données attendues.
          </p>
          <p class="text-xs text-red-500">
            Vérifiez que le JSON contient bien les propriétés "formules" et "categories".
          </p>
        </div>
      `;
    }
    return;
  }

  // Initialiser avec la première formule
  currentFormule = data.formules[0];

  // Initialize the page
  renderFormuleOptions();
  renderMenu();
  updateUI();

  // Render formule options (budget options)
  function renderFormuleOptions() {
    if (!budgetOptions) return;
    
    budgetOptions.innerHTML = '';
    data.formules.forEach((formule, idx) => {
      const wrapper = document.createElement('label');
      wrapper.className = `
        inline-flex items-center gap-2 border-2 rounded-full px-4 py-2 cursor-pointer 
        transition-all duration-300 hover:scale-105 relative
        ${idx === 0 ? 'border-gold bg-gold text-black' : 'border-gray-300 hover:border-gold hover:bg-gold hover:text-black'}
      `;
      
      const radio = document.createElement('input');
      radio.className = 'sr-only';
      radio.type = 'radio';
      radio.name = 'formule';
      radio.checked = idx === 0;
      
      const content = document.createElement('div');
      content.className = 'text-center';
      
      const badge = document.createElement('div');
      badge.className = 'text-xs font-bold mb-1';
      badge.textContent = formule.badge || '';
      
      const mainText = document.createElement('div');
      mainText.className = 'font-semibold';
      mainText.textContent = `${formule.prix}$ • ${formule.nom}`;
      
      const subText = document.createElement('div');
      subText.className = 'text-xs opacity-75 mt-1';
      if (formule.nombre_repas) {
        subText.textContent = `${formule.nombre_repas} plats maximum`;
      } else {
        subText.textContent = 'Choix illimité';
      }
      
      content.appendChild(badge);
      content.appendChild(mainText);
      content.appendChild(subText);
      
      wrapper.appendChild(radio);
      wrapper.appendChild(content);
      
      wrapper.addEventListener('click', () => { 
        // Update radio states visually
        document.querySelectorAll('#budgetOptions label').forEach(l => {
          l.classList.remove('border-gold', 'bg-gold', 'text-black');
          l.classList.add('border-gray-300');
        });
        wrapper.classList.add('border-gold', 'bg-gold', 'text-black');
        wrapper.classList.remove('border-gray-300');
        
        currentFormule = formule; 
        enforceLimit(); 
        updateUI(); 
      });
      
      budgetOptions.appendChild(wrapper);
    });
    
    updateSelectionMax();
  }

  // Render menu categories and items
  function renderMenu() {
    if (!menuGrid) return;
    
    // Clear existing content except warning
    const existingWarning = menuGrid.parentElement.querySelector('.bg-amber-50');
    menuGrid.innerHTML = '';
    
    data.categories.forEach(category => {
      const card = document.createElement('div');
      card.className = 'bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow';
      
      const header = document.createElement('div');
      header.className = 'mb-4';
      
      const title = document.createElement('h3');
      title.className = 'font-bold text-xl mb-2 text-gray-900 flex items-center gap-2';
      title.innerHTML = `${category.icon || '🍽️'} ${category.nom}`;
      
      const description = document.createElement('p');
      description.className = 'text-sm text-gray-600';
      description.textContent = category.description;
      
      header.appendChild(title);
      header.appendChild(description);
      
      const list = document.createElement('div');
      list.className = 'space-y-3';

      if (!category.elements || !category.elements.length) {
        const placeholder = document.createElement('div');
        placeholder.className = 'text-center py-8 text-gray-400';
        placeholder.innerHTML = `
          <div class="text-2xl mb-2">🍽️</div>
          <p class="text-sm italic">Sélection à venir...</p>
        `;
        list.appendChild(placeholder);
      } else {
        category.elements.forEach(element => {
          const key = `${category.nom}::${element.nom}`;
          
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `
            w-full justify-between border border-gray-200 rounded-xl p-4 text-left 
            hover:border-gold hover:shadow-md flex items-center transition-all duration-300 
            group bg-white hover:bg-gold/5
          `;
          btn.setAttribute('aria-pressed', 'false');
          btn.setAttribute('data-key', key);
          
          const contentDiv = document.createElement('div');
          contentDiv.className = 'flex-1 pr-4';
          
          const nameSpan = document.createElement('h4');
          nameSpan.className = 'font-semibold text-gray-900 group-hover:text-gold transition-colors';
          nameSpan.textContent = element.nom;
          
          const descSpan = document.createElement('p');
          descSpan.className = 'text-sm text-gray-600 mt-1 line-clamp-2';
          descSpan.textContent = element.description || 'Délicieuse spécialité de notre chef';
          
          const actionDiv = document.createElement('div');
          actionDiv.className = 'flex flex-col items-end gap-2';
          
          const actionSpan = document.createElement('span');
          actionSpan.className = 'text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full transition-colors group-hover:bg-gold group-hover:text-white';
          actionSpan.textContent = 'Ajouter';
          
          contentDiv.appendChild(nameSpan);
          contentDiv.appendChild(descSpan);
          actionDiv.appendChild(actionSpan);
          
          btn.appendChild(contentDiv);
          btn.appendChild(actionDiv);
          
          btn.addEventListener('click', () => toggleItem(key, btn));
          list.appendChild(btn);
        });
      }

      card.appendChild(header);
      card.appendChild(list);
      menuGrid.appendChild(card);
    });
  }

  // Toggle item selection
  function toggleItem(key, btn) {
    if (selected.has(key)) {
      selected.delete(key);
    } else {
      // Check if we've reached the limit
      if (currentFormule.nombre_repas && selected.size >= currentFormule.nombre_repas) {
        // Show limit reached message
        const actionSpan = btn.querySelector('span');
        const originalText = actionSpan.textContent;
        actionSpan.textContent = 'Limite atteinte!';
        actionSpan.classList.add('bg-red-500', 'text-white');
        
        setTimeout(() => {
          actionSpan.textContent = originalText;
          actionSpan.classList.remove('bg-red-500', 'text-white');
        }, 1500);
        
        return;
      }
      selected.add(key);
    }
    
    updateButtons();
    updateUI();
  }

  // Update button states
  function updateButtons() {
    const buttons = menuGrid.querySelectorAll('button[data-key]');
    buttons.forEach(btn => {
      const key = btn.getAttribute('data-key');
      const isSelected = selected.has(key);
      const actionSpan = btn.querySelector('span');
      
      btn.setAttribute('aria-pressed', String(isSelected));
      
      if (isSelected) {
        btn.classList.add('border-gold', 'bg-gold/10', 'shadow-md');
        btn.classList.remove('border-gray-200');
        actionSpan.textContent = 'Sélectionné ✓';
        actionSpan.classList.remove('bg-gray-100', 'text-gray-600');
        actionSpan.classList.add('bg-green-500', 'text-white');
      } else {
        btn.classList.remove('border-gold', 'bg-gold/10', 'shadow-md');
        btn.classList.add('border-gray-200');
        actionSpan.textContent = 'Ajouter';
        actionSpan.classList.add('bg-gray-100', 'text-gray-600');
        actionSpan.classList.remove('bg-green-500', 'text-white');
      }
      
      // Disable if limit reached and not selected
      if (currentFormule.nombre_repas && selected.size >= currentFormule.nombre_repas && !isSelected) {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        actionSpan.classList.add('bg-gray-300');
      } else {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        actionSpan.classList.remove('bg-gray-300');
      }
    });
  }

  // Enforce selection limit when formule changes
  function enforceLimit() {
    if (!currentFormule.nombre_repas) return; // unlimited
    
    if (selected.size > currentFormule.nombre_repas) {
      const selectedArray = Array.from(selected);
      selected.clear();
      // Keep only the first N selections
      selectedArray.slice(0, currentFormule.nombre_repas).forEach(key => {
        selected.add(key);
      });
    }
    
    updateButtons();
  }

  // Update UI elements
  function updateUI() {
    updateSelectionCount();
    updateSelectionMax();
    updateSelectionList();
    updateQuoteButton();
  }

  // Update selection count
  function updateSelectionCount() {
    if (selectionCount) {
      selectionCount.textContent = selected.size;
      
      // Add visual feedback
      if (currentFormule.nombre_repas) {
        const percentage = (selected.size / currentFormule.nombre_repas) * 100;
        selectionCount.className = percentage >= 80 ? 'text-orange-600 font-bold' : 'text-green-600 font-bold';
      }
    }
  }

  // Update selection max
  function updateSelectionMax() {
    if (selectionMax) {
      selectionMax.textContent = currentFormule.nombre_repas || '∞';
    }
  }

  // Update selection list display
  function updateSelectionList() {
    if (!selectionList) return;
    
    selectionList.innerHTML = '';
    
    if (selected.size === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'text-center py-8 text-gray-400';
      emptyMsg.innerHTML = `
        <div class="text-2xl mb-2">🍽️</div>
        <p class="text-sm">Aucun plat sélectionné</p>
        <p class="text-xs mt-1">Choisissez vos spécialités préférées</p>
      `;
      selectionList.appendChild(emptyMsg);
      return;
    }

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4 pb-2 border-b border-gray-200';
    header.innerHTML = `
      <h4 class="font-semibold text-gray-900">Plats sélectionnés</h4>
      <span class="text-sm text-gray-500">${selected.size} plat${selected.size > 1 ? 's' : ''}</span>
    `;
    selectionList.appendChild(header);

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'space-y-2';

    selected.forEach(key => {
      const [categoryName, itemName] = key.split('::');
      
      const item = document.createElement('div');
      item.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors';
      
      const itemInfo = document.createElement('div');
      itemInfo.className = 'flex-1';
      
      const itemNameSpan = document.createElement('span');
      itemNameSpan.className = 'font-medium text-sm text-gray-900 block';
      itemNameSpan.textContent = itemName;
      
      const categorySpan = document.createElement('span');
      categorySpan.className = 'text-xs text-gray-500';
      categorySpan.textContent = categoryName;
      
      itemInfo.appendChild(itemNameSpan);
      itemInfo.appendChild(categorySpan);
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors';
      removeBtn.innerHTML = '✕';
      removeBtn.title = 'Retirer ce plat';
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

  // Update quote button state
  function updateQuoteButton() {
    if (!toQuote) return;
    
    if (selected.size > 0) {
      toQuote.disabled = false;
      toQuote.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-400');
      toQuote.classList.add('bg-gold', 'hover:bg-gold/90');
      toQuote.innerHTML = `
        <span>💬 Demander un devis</span>
        <span class="text-sm">(${selected.size} plat${selected.size > 1 ? 's' : ''} • ${currentFormule.prix}$/pers.)</span>
      `;
    } else {
      toQuote.disabled = true;
      toQuote.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-400');
      toQuote.classList.remove('bg-gold', 'hover:bg-gold/90');
      toQuote.innerHTML = `
        <span>Sélectionnez vos plats</span>
        <span class="text-sm">pour obtenir un devis</span>
      `;
    }
  }

  // Reset button functionality
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (selected.size === 0) return;
      
      if (confirm(`Êtes-vous sûr de vouloir effacer votre sélection de ${selected.size} plat${selected.size > 1 ? 's' : ''} ?`)) {
        selected.clear();
        updateButtons();
        updateUI();
      }
    });
  }

  // Quote button functionality
  if (toQuote) {
    toQuote.addEventListener('click', () => {
      if (selected.size === 0) return;
      
      // Préparer les données détaillées
      const selectedItems = Array.from(selected).map(key => {
        const [categoryName, itemName] = key.split('::');
        const category = data.categories.find(cat => cat.nom === categoryName);
        const item = category ? category.elements.find(el => el.nom === itemName) : null;
        
        return {
          key,
          categoryName,
          itemName,
          description: item ? item.description : '',
          item: item
        };
      });
      
      const quoteData = {
        formule: currentFormule,
        selections: selectedItems,
        timestamp: new Date().toISOString(),
        totalPlats: selected.size,
        prixParPersonne: currentFormule.prix
      };
      
      // Stocker dans localStorage pour la page de devis
      localStorage.setItem('arabesqueQuoteData', JSON.stringify(quoteData));
      
      // Afficher un résumé avant redirection
      const summary = `
🍽️ RÉSUMÉ DE VOTRE SÉLECTION

📋 Formule: ${currentFormule.nom}
💰 Prix: ${currentFormule.prix}$ par personne  
🥘 Plats sélectionnés: ${selected.size}

PLATS CHOISIS:
${selectedItems.map(item => `• ${item.itemName} (${item.categoryName})`).join('\n')}

⏰ Sélection sauvegardée le ${new Date().toLocaleString('fr-FR')}
      `;
      
      console.log('📊 Données du devis préparées :', quoteData);
      alert(summary);
      
      // Optionnel: rediriger vers une page de contact avec les données
      // window.location.href = 'contact.html#devis';
    });
  }

  console.log('✅ Menu Arabesque Traiteur initialisé avec succès');
  console.log(`📊 ${data.formules.length} formules et ${data.categories.length} catégories chargées`);

})();