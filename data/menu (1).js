// Menu configurator for Arabesque Traiteur
(async function(){
  const budgetOptions = document.getElementById('budgetOptions');
  const selectionCount = document.getElementById('selectionCount');
  const selectionMax = document.getElementById('selectionMax');
  const menuGrid = document.getElementById('menuGrid');
  const resetBtn = document.getElementById('resetBtn');
  const selectionList = document.getElementById('selectionList');
  const toQuote = document.getElementById('toQuote');

  if (!budgetOptions) return; // page safety

  try {
    // Fetch menu data - adjust path as needed
    const res = await fetch('./data/menu.json');
    const data = await res.json();

    let currentFormule = data.formules[0];
    let selected = new Set();

    // Initialize the page
    renderFormuleOptions();
    renderMenu();
    updateUI();

    // Render formule options (budget options)
    function renderFormuleOptions() {
      budgetOptions.innerHTML = '';
      data.formules.forEach((formule, idx) => {
        const wrapper = document.createElement('label');
        wrapper.className = 'inline-flex items-center gap-2 border border-black rounded-full px-3 py-1.5 cursor-pointer hover:bg-black hover:text-white transition-colors';
        
        const radio = document.createElement('input');
        radio.className = 'sr-only';
        radio.type = 'radio';
        radio.name = 'formule';
        radio.checked = idx === 0;
        
        const span = document.createElement('span');
        span.textContent = `${formule.prix}$ · ${formule.nombre_repas || 'Illimité'} ${formule.nombre_repas ? 'plats' : ''}`;
        
        wrapper.appendChild(radio);
        wrapper.appendChild(span);
        
        wrapper.addEventListener('click', () => { 
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
      
      menuGrid.innerHTML = '';
      
      data.categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'border rounded-2xl p-5 bg-white shadow-sm';
        
        const title = document.createElement('h3');
        title.className = 'font-semibold text-lg mb-1 text-gray-900';
        title.textContent = category.nom;
        
        const description = document.createElement('p');
        description.className = 'text-sm text-gray-600 mb-4';
        description.textContent = category.description;
        
        const list = document.createElement('div');
        list.className = 'mt-3 grid gap-2';

        if (!category.elements || !category.elements.length) {
          const placeholder = document.createElement('p');
          placeholder.className = 'text-sm text-gray-500 italic';
          placeholder.textContent = 'Sélection à définir';
          list.appendChild(placeholder);
        } else {
          category.elements.forEach(element => {
            const key = `${category.nom}::${element.nom}`;
            
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'justify-between border rounded-xl px-3 py-2 text-left hover:bg-black hover:text-white flex items-center transition-colors group';
            btn.setAttribute('aria-pressed', 'false');
            btn.setAttribute('data-key', key);
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'flex-1';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'text-sm font-medium block';
            nameSpan.textContent = element.nom;
            
            const descSpan = document.createElement('span');
            descSpan.className = 'text-xs text-gray-500 group-hover:text-gray-300 block mt-1';
            descSpan.textContent = element.description || '';
            
            const actionSpan = document.createElement('span');
            actionSpan.className = 'text-xs opacity-70';
            actionSpan.textContent = 'Ajouter';
            
            contentDiv.appendChild(nameSpan);
            if (element.description) {
              contentDiv.appendChild(descSpan);
            }
            
            btn.appendChild(contentDiv);
            btn.appendChild(actionSpan);
            
            btn.addEventListener('click', () => toggleItem(key, btn));
            list.appendChild(btn);
          });
        }

        card.appendChild(title);
        card.appendChild(description);
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
          return; // limit reached
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
        
        btn.setAttribute('aria-pressed', String(isSelected));
        
        if (isSelected) {
          btn.classList.add('bg-black', 'text-white');
          btn.querySelector('span:last-child').textContent = 'Retiré';
        } else {
          btn.classList.remove('bg-black', 'text-white');
          btn.querySelector('span:last-child').textContent = 'Ajouter';
        }
        
        // Disable if limit reached and not selected
        if (currentFormule.nombre_repas && selected.size >= currentFormule.nombre_repas && !isSelected) {
          btn.disabled = true;
          btn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
          btn.disabled = false;
          btn.classList.remove('opacity-50', 'cursor-not-allowed');
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
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'text-gray-500 text-sm italic';
        emptyMsg.textContent = 'Aucun plat sélectionné';
        selectionList.appendChild(emptyMsg);
        return;
      }

      selected.forEach(key => {
        const [categoryName, itemName] = key.split('::');
        
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center p-2 bg-gray-50 rounded';
        
        const itemInfo = document.createElement('div');
        
        const itemNameSpan = document.createElement('span');
        itemNameSpan.className = 'font-medium text-sm';
        itemNameSpan.textContent = itemName;
        
        const categorySpan = document.createElement('span');
        categorySpan.className = 'text-xs text-gray-500 block';
        categorySpan.textContent = categoryName;
        
        itemInfo.appendChild(itemNameSpan);
        itemInfo.appendChild(categorySpan);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'text-red-500 hover:text-red-700 text-xs';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => {
          selected.delete(key);
          updateButtons();
          updateUI();
        });
        
        item.appendChild(itemInfo);
        item.appendChild(removeBtn);
        selectionList.appendChild(item);
      });
    }

    // Update quote button state
    function updateQuoteButton() {
      if (!toQuote) return;
      
      if (selected.size > 0) {
        toQuote.disabled = false;
        toQuote.classList.remove('opacity-50', 'cursor-not-allowed');
        toQuote.textContent = `Demander un devis (${selected.size} plats)`;
      } else {
        toQuote.disabled = true;
        toQuote.classList.add('opacity-50', 'cursor-not-allowed');
        toQuote.textContent = 'Sélectionnez des plats';
      }
    }

    // Reset button functionality
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        selected.clear();
        updateButtons();
        updateUI();
      });
    }

    // Quote button functionality
    if (toQuote) {
      toQuote.addEventListener('click', () => {
        if (selected.size === 0) return;
        
        // Prepare quote data
        const quoteData = {
          formule: currentFormule,
          selections: Array.from(selected),
          timestamp: new Date().toISOString()
        };
        
        // Store in localStorage for the quote page
        localStorage.setItem('arabesqueQuoteData', JSON.stringify(quoteData));
        
        // Redirect to quote page or show modal
        // You can customize this behavior
        console.log('Quote data:', quoteData);
        alert(`Devis préparé pour ${selected.size} plats avec la formule ${currentFormule.nom} (${currentFormule.prix}$/personne)`);
      });
    }

  } catch (error) {
    console.error('Error loading menu data:', error);
    
    // Show error message to user
    if (menuGrid) {
      menuGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-red-600 font-medium">Erreur de chargement du menu</p>
          <p class="text-gray-500 text-sm mt-2">Veuillez rafraîchir la page ou contacter le support</p>
        </div>
      `;
    }
  }
})();