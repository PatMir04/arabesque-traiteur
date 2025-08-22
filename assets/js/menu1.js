// Menu configurator (menu.html)
(async function(){
  const budgetOptions = document.getElementById('budgetOptions');
  const selectionCount = document.getElementById('selectionCount');
  const selectionMax = document.getElementById('selectionMax');
  const menuGrid = document.getElementById('menuGrid');
  const resetBtn = document.getElementById('resetBtn');
  const selectionList = document.getElementById('selectionList');
  const toQuote = document.getElementById('toQuote');

  if (!budgetOptions) return; // page safety

  const res = await fetch('/data/menu.json');
  const data = await res.json();

  let currentBudget = data.budgets[0];
  let selected = new Set();

  function renderBudgetRadios() {
    budgetOptions.innerHTML = '';
    data.budgets.forEach((b, idx) => {
      const w = document.createElement('label');
      w.className = 'inline-flex items-center gap-2 border border-black rounded-full px-3 py-1.5 cursor-pointer hover:bg-black hover:text-white';
      w.innerHTML = `<input class="sr-only" type="radio" name="budget" ${idx===0?'checked':''} /> <span>${b.price}$ · ${b.choices} éléments</span>`;
      w.addEventListener('click', () => { currentBudget = b; enforceLimit(); updateUI(); });
      budgetOptions.appendChild(w);
    });
    selectionMax.textContent = currentBudget.choices;
  }

  function renderMenu() {
    menuGrid.innerHTML = '';
    data.categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'border rounded-2xl p-5';
      const title = document.createElement('h3');
      title.className = 'font-semibold';
      title.textContent = cat.name;
      const list = document.createElement('div');
      list.className = 'mt-3 grid gap-2';

      if (!cat.items.length) {
        const p = document.createElement('p');
        p.className = 'text-sm text-black/60';
        p.textContent = 'Sélection à définir (placeholder)';
        list.appendChild(p);
      } else {
        cat.items.forEach(item => {
          const key = `${cat.name} :: ${item}`;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'justify-between border rounded-xl px-3 py-2 text-left hover:bg-black hover:text-white flex items-center';
          btn.setAttribute('aria-pressed', 'false');
          btn.innerHTML = `<span class='text-sm'>${item}</span><span class='text-xs opacity-70'>Ajouter</span>`;
          btn.addEventListener('click', () => toggleItem(key, btn));
          list.appendChild(btn);
        });
      }

      card.appendChild(title);
      card.appendChild(list);
      menuGrid.appendChild(card);
    });
  }

  function toggleItem(key, btn) {
    if (selected.has(key)) { selected.delete(key); }
    else {
      if (selected.size >= currentBudget.choices) return; // limit reached
      selected.add(key);
    }
    updateButtons();
    updateUI();
  }

  function updateButtons() {
    const buttons = menuGrid.querySelectorAll('button');
    buttons.forEach(btn => {
      const label = btn.querySelector('span').textContent.trim();
      const catTitle = btn.closest('.border.rounded-2xl').querySelector('h3').textContent.trim();
      const key = `${catTitle} :: ${label}`;
      const on = selected.has(key);
      btn.setAttribute('aria-pressed', String(on));
      btn.classList.toggle('bg-bl
