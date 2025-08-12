/**
 * ARABESQUE TRAITEUR - Professional Interactive Website
 * Advanced JavaScript for modern user experience
 * Version: 2.0 - Professional Enhanced
 */

class ArabesqueApp {
  constructor() {
    this.init();
    this.bindEvents();
    this.initAnimations();
    this.initVideoManager();
    this.initMenuBuilder();
    this.loadMenuData();
  }

  // ====== INITIALIZATION ======
  init() {
    this.isLoading = false;
    this.selectedItems = JSON.parse(localStorage.getItem('arabesque_selection') || '{}');
    this.currentFormula = null;
    this.menuData = null;
    this.observers = new Map();
    
    // Set current year
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    // Initialize mobile nav
    this.initMobileNav();
    
    // Initialize scroll effects
    this.initScrollEffects();
    
    // Initialize lazy loading
    this.initLazyLoading();
    
    console.log('🎨 Arabesque Traiteur App initialized');
  }

  // ====== MOBILE NAVIGATION ======
  initMobileNav() {
    const openNav = document.getElementById('openNav');
    const mobileNav = document.getElementById('mobileNav');
    const closeNav = document.getElementById('closeNav');
    
    if (openNav && mobileNav) {
      const toggleNav = (isOpen) => {
        if (isOpen) {
          mobileNav.classList.remove('hidden');
          mobileNav.classList.add('animate-slideInRight');
          document.body.style.overflow = 'hidden';
          openNav.setAttribute('aria-expanded', 'true');
        } else {
          mobileNav.classList.add('hidden');
          mobileNav.classList.remove('animate-slideInRight');
          document.body.style.overflow = '';
          openNav.setAttribute('aria-expanded', 'false');
        }
      };

      openNav.addEventListener('click', () => toggleNav(true));
      if (closeNav) closeNav.addEventListener('click', () => toggleNav(false));
      
      // Close on outside click
      mobileNav?.addEventListener('click', (e) => {
        if (e.target === mobileNav) toggleNav(false);
      });
      
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
          toggleNav(false);
        }
      });
    }
  }

  // ====== VIDEO MANAGER ======
  initVideoManager() {
    this.videoElements = new Map();
    this.setupVideoObservers();
    this.setupVideoControls();
  }

  setupVideoObservers() {
    const videos = document.querySelectorAll('video[data-auto-play]');
    
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        
        if (entry.isIntersecting) {
          this.playVideo(video);
        } else {
          this.pauseVideo(video);
        }
      });
    }, { threshold: 0.3 });

    videos.forEach(video => {
      videoObserver.observe(video);
      this.setupVideoElement(video);
    });
  }

  setupVideoElement(video) {
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    
    // Add loading state
    video.addEventListener('loadstart', () => {
      this.showVideoLoader(video);
    });
    
    video.addEventListener('canplaythrough', () => {
      this.hideVideoLoader(video);
    });
    
    video.addEventListener('error', () => {
      this.handleVideoError(video);
    });

    this.videoElements.set(video.id || `video-${Date.now()}`, video);
  }

  setupVideoControls() {
    // Custom video controls for hero videos
    const heroVideos = document.querySelectorAll('.video-hero video, .video-section video');
    
    heroVideos.forEach(video => {
      const container = video.closest('.video-hero, .video-section');
      if (container && !container.querySelector('.video-controls')) {
        this.addVideoControls(video, container);
      }
    });
  }

  addVideoControls(video, container) {
    const controls = document.createElement('div');
    controls.className = 'video-controls';
    controls.innerHTML = `
      <button class="video-toggle btn btn-ghost" aria-label="Play/Pause">
        <span class="play-icon">▶️</span>
        <span class="pause-icon hidden">⏸️</span>
      </button>
      <button class="video-mute btn btn-ghost" aria-label="Mute/Unmute">
        <span class="unmute-icon">🔊</span>
        <span class="mute-icon hidden">🔇</span>
      </button>
    `;
    
    container.appendChild(controls);
    
    const toggleBtn = controls.querySelector('.video-toggle');
    const muteBtn = controls.querySelector('.video-mute');
    
    toggleBtn.addEventListener('click', () => this.toggleVideoPlayback(video, controls));
    muteBtn.addEventListener('click', () => this.toggleVideoMute(video, controls));
  }

  playVideo(video) {
    if (video.readyState >= 2) {
      video.play().catch(e => console.log('Video autoplay prevented:', e));
    }
  }

  pauseVideo(video) {
    if (!video.paused) {
      video.pause();
    }
  }

  toggleVideoPlayback(video, controls) {
    if (video.paused) {
      video.play();
      controls.querySelector('.play-icon').classList.add('hidden');
      controls.querySelector('.pause-icon').classList.remove('hidden');
    } else {
      video.pause();
      controls.querySelector('.play-icon').classList.remove('hidden');
      controls.querySelector('.pause-icon').classList.add('hidden');
    }
  }

  toggleVideoMute(video, controls) {
    video.muted = !video.muted;
    if (video.muted) {
      controls.querySelector('.unmute-icon').classList.add('hidden');
      controls.querySelector('.mute-icon').classList.remove('hidden');
    } else {
      controls.querySelector('.unmute-icon').classList.remove('hidden');
      controls.querySelector('.mute-icon').classList.add('hidden');
    }
  }

  showVideoLoader(video) {
    const loader = document.createElement('div');
    loader.className = 'video-loader';
    loader.innerHTML = '<div class="spinner"></div>';
    video.parentNode.appendChild(loader);
  }

  hideVideoLoader(video) {
    const loader = video.parentNode.querySelector('.video-loader');
    if (loader) loader.remove();
  }

  handleVideoError(video) {
    const placeholder = document.createElement('div');
    placeholder.className = 'video-error';
    placeholder.innerHTML = `
      <div class="error-content">
        <span class="error-icon">📹</span>
        <p>Vidéo temporairement indisponible</p>
      </div>
    `;
    video.parentNode.replaceChild(placeholder, video);
  }

  // ====== SCROLL ANIMATIONS ======
  initScrollEffects() {
    this.setupScrollReveal();
    this.setupParallax();
    this.setupScrollProgress();
  }

  setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Stagger animation for groups
            this.staggerAnimation(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      revealElements.forEach(el => revealObserver.observe(el));
    }
  }

  staggerAnimation(parent) {
    const children = parent.querySelectorAll('.stagger-child');
    children.forEach((child, index) => {
      setTimeout(() => {
        child.classList.add('animate-fadeIn');
      }, index * 100);
    });
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length > 0) {
      let ticking = false;
      
      const updateParallax = () => {
        parallaxElements.forEach(el => {
          const speed = el.dataset.speed || 0.5;
          const yPos = window.pageYOffset * speed;
          el.style.transform = `translateY(${yPos}px)`;
        });
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      });
    }
  }

  setupScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      window.addEventListener('scroll', () => {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrolled}%`;
      });
    }
  }

  // ====== MENU BUILDER ======
  async loadMenuData() {
    try {
      const response = await fetch('./data/menu.json');
      this.menuData = await response.json();
      this.initMenuBuilder();
    } catch (error) {
      console.error('Failed to load menu data:', error);
      this.showNotification('Erreur de chargement du menu', 'error');
    }
  }

  initMenuBuilder() {
    if (!this.menuData) return;
    
    this.setupFormulaSelector();
    this.setupMenuItems();
    this.setupMenuFilters();
    this.updateMenuDisplay();
  }

  setupFormulaSelector() {
    const formulaSelector = document.getElementById('formulaSelector');
    if (!formulaSelector || !this.menuData) return;

    formulaSelector.innerHTML = this.menuData.formules.map(formula => `
      <div class="formula-card card ${formula.recommended ? 'card-premium' : ''}" 
           data-formula="${formula.id}">
        ${formula.badge ? `<div class="badge badge-popular">${formula.badge}</div>` : ''}
        <h3 class="font-display text-2xl mb-2">${formula.nom}</h3>
        <p class="text-gray-600 mb-4">${formula.description}</p>
        ${formula.prix ? `
          <div class="price-display text-3xl font-bold text-gold mb-4">
            ${formula.prix}$ <span class="text-sm text-gray-500">par personne</span>
          </div>
        ` : `
          <div class="price-display text-xl font-semibold text-black mb-4">
            Sur devis personnalisé
          </div>
        `}
        ${formula.avantages ? `
          <ul class="advantages-list mb-4">
            ${formula.avantages.map(avantage => `
              <li class="flex items-center gap-2">
                <span class="text-gold">✓</span> ${avantage}
              </li>
            `).join('')}
          </ul>
        ` : ''}
        <button class="btn ${formula.recommended ? 'btn-gold' : 'btn-outline'} w-full select-formula" 
                data-formula="${formula.id}">
          ${formula.contact_required ? 'Demander un devis' : 'Choisir cette formule'}
        </button>
      </div>
    `).join('');

    // Bind formula selection
    formulaSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('.select-formula');
      if (btn) {
        this.selectFormula(btn.dataset.formula);
      }
    });
  }

  selectFormula(formulaId) {
    this.currentFormula = this.menuData.formules.find(f => f.id === formulaId);
    
    // Visual feedback
    document.querySelectorAll('.formula-card').forEach(card => {
      card.classList.remove('selected');
    });
    document.querySelector(`[data-formula="${formulaId}"]`).classList.add('selected');
    
    // Show menu selection
    this.showMenuSelection();
    
    // Scroll to menu
    document.getElementById('menuSelection')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }

  showMenuSelection() {
    const menuSelectionContainer = document.getElementById('menuSelection');
    if (!menuSelectionContainer) return;

    menuSelectionContainer.innerHTML = `
      <div class="menu-selection-header">
        <h2 class="font-display text-3xl mb-4">
          Composez votre menu - ${this.currentFormula.nom}
        </h2>
        <div class="selection-progress">
          <div class="progress-bar">
            <div class="progress-fill" data-max="${this.currentFormula.nombre_elements || 0}"></div>
          </div>
          <span class="progress-text">
            <span class="selected-count">0</span>/${this.currentFormula.nombre_elements || '∞'} éléments sélectionnés
          </span>
        </div>
      </div>
      
      <div class="menu-filters">
        <div class="filter-tabs">
          <button class="filter-tab active" data-category="all">Tout voir</button>
          ${this.menuData.categories.map(cat => `
            <button class="filter-tab" data-category="${cat.id}">
              ${cat.icon} ${cat.nom}
            </button>
          `).join('')}
        </div>
        
        <div class="dietary-filters">
          ${this.menuData.dietary_filters.map(filter => `
            <label class="dietary-filter">
              <input type="checkbox" data-dietary="${filter.id}">
              <span class="filter-label">${filter.icon} ${filter.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
      
      <div class="menu-grid grid grid-auto-fit" id="menuItemsGrid">
        ${this.renderMenuItems()}
      </div>
      
      <div class="selection-summary card card-premium" id="selectionSummary">
        <h3 class="font-display text-xl mb-4">Votre sélection</h3>
        <div class="selected-items" id="selectedItemsList">
          <p class="text-gray-500">Aucun élément sélectionné</p>
        </div>
        <div class="summary-actions">
          <button class="btn btn-outline" id="clearSelection">Tout effacer</button>
          <button class="btn btn-gold" id="proceedToQuote" disabled>
            Demander un devis
          </button>
        </div>
      </div>
    `;

    this.bindMenuEvents();
    menuSelectionContainer.classList.add('animate-fadeIn');
  }

  renderMenuItems() {
    if (!this.menuData.categories) return '';
    
    return this.menuData.categories.map(category => 
      category.elements.map(item => `
        <div class="menu-item" data-category="${category.id}" data-item="${item.id}">
          <div class="menu-item-image">
            <img src="${item.image}" alt="${item.nom}" loading="lazy">
            <div class="menu-item-overlay">
              <div class="overlay-content">
                ${item.dietary ? item.dietary.map(diet => `
                  <span class="dietary-badge">${this.getDietaryIcon(diet)}</span>
                `).join('') : ''}
              </div>
            </div>
          </div>
          
          <div class="menu-item-content">
            <div class="item-header">
              <h4 class="font-semibold text-lg">${item.nom}</h4>
              <div class="item-badges">
                ${item.chef_special ? '<span class="badge badge-chef">Chef</span>' : ''}
                ${item.premium ? '<span class="badge badge-premium">Premium</span>' : ''}
                ${item.signature_drink ? '<span class="badge badge-popular">Signature</span>' : ''}
              </div>
            </div>
            
            <p class="text-gray-600 text-sm mb-3">${item.description}</p>
            
            <div class="item-details">
              <div class="price-indicator" data-level="${item.price_indicator}">
                ${item.price_indicator}
              </div>
              ${item.temps_preparation ? `
                <div class="prep-time">⏱️ ${item.temps_preparation}</div>
              ` : ''}
            </div>
            
            ${item.allergenes && item.allergenes.length > 0 ? `
              <div class="allergens">
                <small>Allergènes: ${item.allergenes.join(', ')}</small>
              </div>
            ` : ''}
            
            <button class="btn btn-outline w-full mt-3 select-item" 
                    data-item="${item.id}" data-category="${category.id}">
              <span class="select-text">Ajouter</span>
              <span class="selected-text hidden">✓ Ajouté</span>
            </button>
          </div>
        </div>
      `).join('')
    ).join('');
  }

  bindMenuEvents() {
    // Category filters
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.filterByCategory(e.target.dataset.category);
        this.updateActiveTab(e.target);
      });
    });

    // Dietary filters
    document.querySelectorAll('[data-dietary]').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.applyDietaryFilters());
    });

    // Item selection
    document.addEventListener('click', (e) => {
      const selectBtn = e.target.closest('.select-item');
      if (selectBtn) {
        this.toggleItemSelection(selectBtn.dataset.item, selectBtn.dataset.category);
      }
    });

    // Clear selection
    document.getElementById('clearSelection')?.addEventListener('click', () => {
      this.clearSelection();
    });

    // Proceed to quote
    document.getElementById('proceedToQuote')?.addEventListener('click', () => {
      this.saveSelectionAndProceed();
    });
  }

  toggleItemSelection(itemId, categoryId) {
    const maxItems = this.currentFormula.nombre_elements;
    const currentCount = Object.keys(this.selectedItems).length;
    
    if (this.selectedItems[itemId]) {
      // Remove item
      delete this.selectedItems[itemId];
      this.updateItemButton(itemId, false);
    } else {
      // Add item (check limits)
      if (maxItems && currentCount >= maxItems) {
        this.showNotification(
          `Vous ne pouvez sélectionner que ${maxItems} éléments pour cette formule`,
          'warning'
        );
        return;
      }
      
      const item = this.findMenuItem(itemId, categoryId);
      this.selectedItems[itemId] = {
        ...item,
        category: categoryId
      };
      this.updateItemButton(itemId, true);
    }
    
    this.updateSelectionSummary();
    this.saveSelection();
  }

  updateItemButton(itemId, isSelected) {
    const button = document.querySelector(`[data-item="${itemId}"] .select-item`);
    const selectText = button.querySelector('.select-text');
    const selectedText = button.querySelector('.selected-text');
    
    if (isSelected) {
      button.classList.remove('btn-outline');
      button.classList.add('btn-gold');
      selectText.classList.add('hidden');
      selectedText.classList.remove('hidden');
    } else {
      button.classList.add('btn-outline');
      button.classList.remove('btn-gold');
      selectText.classList.remove('hidden');
      selectedText.classList.add('hidden');
    }
  }

  updateSelectionSummary() {
    const summaryContainer = document.getElementById('selectedItemsList');
    const proceedBtn = document.getElementById('proceedToQuote');
    const selectedCount = Object.keys(this.selectedItems).length;
    const maxItems = this.currentFormula.nombre_elements;
    
    // Update progress
    const progressFill = document.querySelector('.progress-fill');
    const selectedCountSpan = document.querySelector('.selected-count');
    
    if (progressFill && maxItems) {
      const percentage = (selectedCount / maxItems) * 100;
      progressFill.style.width = `${percentage}%`;
    }
    
    if (selectedCountSpan) {
      selectedCountSpan.textContent = selectedCount;
    }

    if (selectedCount === 0) {
      summaryContainer.innerHTML = '<p class="text-gray-500">Aucun élément sélectionné</p>';
      proceedBtn.disabled = true;
    } else {
      summaryContainer.innerHTML = Object.values(this.selectedItems).map(item => `
        <div class="selected-item">
          <span class="item-name">${item.nom}</span>
          <button class="remove-item" data-item="${item.id}">✕</button>
        </div>
      `).join('');
      
      proceedBtn.disabled = false;
    }
    
    // Bind remove buttons
    summaryContainer.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.toggleItemSelection(e.target.dataset.item);
      });
    });
  }

  // ====== ANIMATIONS ======
  initAnimations() {
    this.setupCounterAnimations();
    this.setupTypewriterEffects();
    this.setupImageHovers();
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.counter);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  setupTypewriterEffects() {
    const typewriters = document.querySelectorAll('[data-typewriter]');
    
    typewriters.forEach(element => {
      const text = element.dataset.typewriter;
      const speed = parseInt(element.dataset.speed) || 100;
      
      element.textContent = '';
      this.typeWriter(element, text, speed);
    });
  }

  typeWriter(element, text, speed, index = 0) {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      setTimeout(() => this.typeWriter(element, text, speed, index + 1), speed);
    }
  }

  setupImageHovers() {
    const hoverImages = document.querySelectorAll('.hover-zoom img');
    
    hoverImages.forEach(img => {
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    });
  }

  // ====== LAZY LOADING ======
  initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // ====== FORM ENHANCEMENTS ======
  bindEvents() {
    // Enhanced contact form
    this.initContactForm();
    
    // Search functionality
    this.initSearch();
    
    // Newsletter
    this.initNewsletter();
  }

  initContactForm() {
    const form = document.getElementById('quoteForm');
    const formMsg = document.getElementById('formMsg');
    const whBtn = document.getElementById('whBtn');
    
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // WhatsApp link updater
    const updateWhatsAppLink = () => {
      const fd = new FormData(form);
      const data = {
        name: fd.get('name') || '',
        date: fd.get('date') || '',
        place: fd.get('place') || '',
        guests: fd.get('guests') || '',
        type: fd.get('type') || '',
        selection: JSON.stringify(this.selectedItems, null, 2)
      };
      
      const message = encodeURIComponent(
        `Bonjour Arabesque Traiteur! 🌟\n\n` +
        `Je souhaite recevoir un devis personnalisé:\n\n` +
        `👤 Nom: ${data.name}\n` +
        `📅 Date: ${data.date}\n` +
        `📍 Lieu: ${data.place}\n` +
        `👥 Invités: ${data.guests}\n` +
        `🎉 Type d'événement: ${data.type}\n\n` +
        `🍽️ Ma sélection:\n${data.selection}\n\n` +
        `Merci pour votre service d'exception!`
      );
      
      if (whBtn) {
        whBtn.href = `https://wa.me/243859993833?text=${message}`;
      }
    };

    form.addEventListener('input', updateWhatsAppLink);
    
    // Form submission with enhanced UX
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!this.validateForm(form)) return;
      
      this.showFormLoading(true);
      
      try {
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const fd = new FormData(form);
        const subject = encodeURIComponent('Demande de devis – Arabesque Traiteur');
        const body = encodeURIComponent(this.formatEmailBody(fd));
        
        window.location.href = `mailto:etarabesque@gmail.com?subject=${subject}&body=${body}`;
        
        if (formMsg) {
          formMsg.innerHTML = `
            <div class="success-message">
              <span class="success-icon">✅</span>
              <div>
                <strong>Email préparé avec succès!</strong>
                <p>Votre client email va s'ouvrir avec votre demande.</p>
              </div>
            </div>
          `;
        }
        
        // Reset form after success
        setTimeout(() => {
          form.reset();
          this.clearSelection();
        }, 2000);
        
      } catch (error) {
        this.showNotification('Erreur lors de l\'envoi', 'error');
      } finally {
        this.showFormLoading(false);
      }
    });

    updateWhatsAppLink();
  }

  formatEmailBody(formData) {
    const selection = Object.values(this.selectedItems);
    const total = selection.length;
    
    return `
DEMANDE DE DEVIS - ARABESQUE TRAITEUR
=====================================

INFORMATIONS CLIENT:
👤 Nom: ${formData.get('name')}
📞 Téléphone: ${formData.get('phone')}
📧 Email: ${formData.get('email')}

DÉTAILS DE L'ÉVÉNEMENT:
📅 Date: ${formData.get('date')}
📍 Lieu: ${formData.get('place')}
👥 Nombre d'invités: ${formData.get('guests')}
🎉 Type d'événement: ${formData.get('type')}

FORMULE CHOISIE: ${this.currentFormula?.nom || 'Non spécifiée'}

SÉLECTION MENU (${total} éléments):
${selection.map((item, index) => `${index + 1}. ${item.nom} - ${item.description}`).join('\n')}

MESSAGE PERSONNALISÉ:
${formData.get('message') || 'Aucun message supplémentaire'}

---
Demande envoyée via le site web Arabesque Traiteur
Date: ${new Date().toLocaleDateString('fr-FR')}
    `.trim();
  }

  // ====== UTILITY FUNCTIONS ======
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let message = '';

    // Required field check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'Ce champ est obligatoire';
    }
    // Email validation
    else if (type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      message = 'Format d\'email invalide';
    }
    // Phone validation
    else if (type === 'tel' && value && !this.isValidPhone(value)) {
      isValid = false;
      message = 'Format de téléphone invalide';
    }
    // Date validation (future dates only)
    else if (type === 'date' && value && new Date(value) <= new Date()) {
      isValid = false;
      message = 'La date doit être dans le futur';
    }

    this.showFieldError(field, isValid ? null : message);
    return isValid;
  }

  showFieldError(field, message) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();

    if (message) {
      field.classList.add('error');
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      field.parentNode.appendChild(errorElement);
    } else {
      field.classList.remove('error');
    }
  }

  clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
    field.classList.remove('error');
  }

  validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  showFormLoading(isLoading) {
    const submitBtn = document.querySelector('#quoteForm button[type="submit"]');
    if (submitBtn) {
      if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div> Envoi en cours...';
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Envoyer la demande';
      }
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">
          ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
        </span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">✕</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
  }

  // ====== HELPER FUNCTIONS ======
  saveSelection() {
    try {
      localStorage.setItem('arabesque_selection', JSON.stringify(this.selectedItems));
    } catch (e) {
      console.warn('Could not save selection to localStorage:', e);
    }
  }

  clearSelection() {
    this.selectedItems = {};
    this.saveSelection();
    this.updateSelectionSummary();
    
    // Update UI
    document.querySelectorAll('.select-item').forEach(btn => {
      this.updateItemButton(btn.dataset.item, false);
    });
  }

  saveSelectionAndProceed() {
    this.saveSelection();
    
    // Scroll to contact form or navigate to contact page
    const contactForm = document.getElementById('quoteForm');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = './contact.html';
    }
  }

  findMenuItem(itemId, categoryId) {
    const category = this.menuData.categories.find(cat => cat.id === categoryId);
    return category?.elements.find(item => item.id === itemId);
  }

  getDietaryIcon(dietary) {
    const filter = this.menuData.dietary_filters.find(f => f.id === dietary);
    return filter?.icon || '';
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  // ====== SEARCH FUNCTIONALITY ======
  initSearch() {
    const searchInput = document.getElementById('siteSearch');
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });
  }

  performSearch(query) {
    if (!query || query.length < 2) {
      this.hideSearchResults();
      return;
    }

    const results = this.searchContent(query);
    this.displaySearchResults(results);
  }

  searchContent(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    // Search in menu items
    if (this.menuData) {
      this.menuData.categories.forEach(category => {
        category.elements.forEach(item => {
          if (item.nom.toLowerCase().includes(lowerQuery) ||
              item.description.toLowerCase().includes(lowerQuery)) {
            results.push({
              type: 'menu',
              title: item.nom,
              description: item.description,
              category: category.nom,
              url: `./menu.html#${item.id}`
            });
          }
        });
      });
    }

    return results.slice(0, 5); // Limit results
  }

  displaySearchResults(results) {
    let searchResults = document.getElementById('searchResults');
    
    if (!searchResults) {
      searchResults = document.createElement('div');
      searchResults.id = 'searchResults';
      searchResults.className = 'search-results';
      document.getElementById('siteSearch').parentNode.appendChild(searchResults);
    }

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
    } else {
      searchResults.innerHTML = results.map(result => `
        <a href="${result.url}" class="search-result-item">
          <div class="result-title">${result.title}</div>
          <div class="result-description">${result.description}</div>
          <div class="result-category">${result.category}</div>
        </a>
      `).join('');
    }

    searchResults.classList.add('visible');
  }

  hideSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
      searchResults.classList.remove('visible');
    }
  }
}

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
  window.arabesqueApp = new ArabesqueApp();
});

// ====== PERFORMANCE MONITORING ======
window.addEventListener('load', () => {
  // Log performance metrics
  if ('performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('🚀 Page Load Performance:', {
      loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
      domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
      firstPaint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
    });
  }
});

// ====== SERVICE WORKER (Progressive Web App) ======
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => console.log('✅ SW registered'))
      .catch(error => console.log('❌ SW registration failed'));
  });
}
