// assets/js/contact.js - Arabesque Traiteur Contact Form Manager
// Complete implementation with pricing calculator and menu selection

(function() {
    'use strict';
    
    // Pricing rules configuration
    const PRICING_RULES = {
        '1-50': [
            {price: 35, maxDishes: 14, name: "Formule Intime", id: "intime"}
        ],
        '50-100': [
            {price: 20, maxDishes: 18, name: "Formule Essentielle", id: "essentielle"},
            {price: 25, maxDishes: 20, name: "Formule Optimale", id: "optimale"},
            {price: 30, maxDishes: 24, name: "Formule Premium", id: "premium"},
            {price: 35, maxDishes: 28, name: "Formule Excellence", id: "excellence"}
        ],
        '100+': [
            {price: 15, maxDishes: 14, name: "Formule Économique", id: "economique"},
            {price: 20, maxDishes: 18, name: "Formule Essentielle", id: "essentielle"},
            {price: 25, maxDishes: 20, name: "Formule Optimale", id: "optimale"},
            {price: 30, maxDishes: 24, name: "Formule Premium", id: "premium"},
            {price: 35, maxDishes: 28, name: "Formule Excellence", id: "excellence"}
        ]
    };
    
    // Sample menu data
    const MENU_DATA = {
        categories: [
            {
                id: 'specialites',
                nom: '🇨🇩 Spécialités Congolaises',
                elements: [
                    { id: 'pondu', nom: 'Pondu', description: 'Feuilles de manioc pilées, plat emblématique congolais' },
                    { id: 'maboke-ngulu', nom: 'Maboke y\'a Ngulu', description: 'Porc fumé traditionnel dans les feuilles' },
                    { id: 'nga-nda', nom: 'Viande de Chèvre façon Nga Nda', description: 'Chèvre mijotée selon la tradition ancestrale' },
                    { id: 'capitaine-braise', nom: 'Gros Capitaine Braisé', description: 'Poisson capitaine du Congo, braisé aux épices locales' },
                    { id: 'saka-saka', nom: 'Saka Saka', description: 'Épinards traditionnels congolais aux arachides' },
                    { id: 'liboke-poisson', nom: 'Liboke de Poisson', description: 'Poisson frais cuit dans les feuilles de banane' }
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
                    { id: 'escalope-porc', nom: 'Escalope de Porc', description: 'Escalope de porc aux champignons et crème' },
                    { id: 'filet-boeuf', nom: 'Filet de Bœuf', description: 'Filet de bœuf grillé, sauce aux échalotes' }
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
                    { id: 'riz-pilaf', nom: 'Riz Pilaf', description: 'Riz parfumé aux épices et légumes' },
                    { id: 'igname-bouillie', nom: 'Igname Bouillie', description: 'Tubercule traditionnel, bouillie et assaisonnée' }
                ]
            },
            {
                id: 'desserts',
                nom: '🍰 Desserts & Douceurs',
                elements: [
                    { id: 'gateau-chocolat', nom: 'Gâteau au Chocolat', description: 'Gâteau moelleux au chocolat congolais' },
                    { id: 'fruits-saison', nom: 'Fruits de Saison', description: 'Sélection de fruits tropicaux frais' },
                    { id: 'mousse-mangue', nom: 'Mousse à la Mangue', description: 'Mousse légère aux mangues locales' },
                    { id: 'tarte-ananas', nom: 'Tarte à l\'Ananas', description: 'Tarte fraîche aux ananas de Kinshasa' }
                ]
            }
        ]
    };
    
    // State variables
    let currentStep = 1;
    let selectedMenuItems = new Set();
    let maxSelectionLimit = Infinity;
    let currentFormule = null;
    let currentGuestCount = 0;
    
    // Initialize the contact form
    document.addEventListener('DOMContentLoaded', function() {
        initializeContactForm();
    });
    
    function initializeContactForm() {
        console.log('Initializing Arabesque Contact Form...');
        
        // Initialize form components
        initializeFormSteps();
        initializePricingCalculator();
        initializeMenuSelection();
        initializeFormValidation();
        loadMenuData();
        
        // Set form timestamp
        document.getElementById('formTimestampField').value = new Date().toISOString();
        
        console.log('Contact form initialized successfully');
    }
    
    // Form step navigation
    function initializeFormSteps() {
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        
        nextButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const nextStep = parseInt(this.dataset.next);
                if (validateCurrentStep()) {
                    showStep(nextStep);
                }
            });
        });
        
        prevButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const prevStep = parseInt(this.dataset.prev);
                showStep(prevStep);
            });
        });
    }
    
    function showStep(stepNumber) {
        currentStep = stepNumber;
        
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            if (index + 1 === stepNumber) {
                indicator.classList.add('active');
            } else if (index + 1 < stepNumber) {
                indicator.classList.add('completed');
            }
        });
        
        // Update progress bar
        const progress = (stepNumber / 4) * 100;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Generate summary if on step 4
        if (stepNumber === 4) {
            generateQuoteSummary();
        }
        
        // Scroll to form
        const formElement = document.getElementById('formulaire-devis');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        if (!currentStepElement) return true;
        
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
    
    // Pricing calculator initialization
    function initializePricingCalculator() {
        const guestsInput = document.querySelector('input[name="guests_count"]');
        const formuleSelect = document.querySelector('select[name="pricing_formula"]');
        const cocktailCheckbox = document.getElementById('cocktailService');
        
        if (guestsInput) {
            guestsInput.addEventListener('input', handleGuestCountChange);
        }
        
        if (formuleSelect) {
            formuleSelect.addEventListener('change', handleFormuleChange);
        }
        
        if (cocktailCheckbox) {
            cocktailCheckbox.addEventListener('change', handleCocktailChange);
        }
    }
    
    function handleGuestCountChange(event) {
        currentGuestCount = parseInt(event.target.value) || 0;
        
        if (currentGuestCount > 0) {
            updateFormuleOptions(currentGuestCount);
        } else {
            hideFormuleSelection();
            hidePricingPreview();
        }
    }
    
    function updateFormuleOptions(guestCount) {
        const formuleContainer = document.getElementById('formuleSelection');
        const formuleSelect = document.querySelector('select[name="pricing_formula"]');
        
        if (!formuleContainer || !formuleSelect) {
            console.error('Formule elements not found');
            return;
        }
        
        let formules;
        if (guestCount <= 50) {
            formules = PRICING_RULES['1-50'];
        } else if (guestCount <= 100) {
            formules = PRICING_RULES['50-100'];
        } else {
            formules = PRICING_RULES['100+'];
        }
        
        // Clear existing options
        formuleSelect.innerHTML = '<option value="">Choisissez votre formule</option>';
        
        // Add new options
        formules.forEach(formule => {
            const option = document.createElement('option');
            option.value = formule.id;
            option.textContent = `${formule.name} - ${formule.price}$/pers (${formule.maxDishes} plats max)`;
            formuleSelect.appendChild(option);
        });
        
        // Show formule selection
        formuleContainer.style.display = 'block';
        formuleSelect.required = true;
        
        // Auto-select for 1-50 guests (only one option)
        if (guestCount <= 50 && formules.length === 1) {
            formuleSelect.selectedIndex = 1;
            handleFormuleChange({ target: formuleSelect });
        }
        
        console.log(`Updated formule options for ${guestCount} guests`);
    }
    
    function handleFormuleChange(event) {
        const formuleId = event.target.value;
        
        if (formuleId) {
            updateFormuleLimit(formuleId);
            if (currentGuestCount > 0) {
                calculatePricing(currentGuestCount);
            }
        } else {
            hidePricingPreview();
        }
    }
    
    function updateFormuleLimit(formuleId) {
        let selectedFormule = null;
        
        // Find the formule across all pricing rules
        Object.values(PRICING_RULES).forEach(ruleArray => {
            const found = ruleArray.find(f => f.id === formuleId);
            if (found) selectedFormule = found;
        });
        
        if (!selectedFormule) {
            console.error('Formule not found:', formuleId);
            return;
        }
        
        currentFormule = selectedFormule;
        maxSelectionLimit = selectedFormule.maxDishes;
        
        // Update max selection display
        const maxSelectionSpan = document.getElementById('maxSelection');
        if (maxSelectionSpan) {
            maxSelectionSpan.textContent = maxSelectionLimit;
        }
        
        // Update menu selection constraints
        updateMenuSelectionConstraints();
        
        console.log(`Updated formule: ${selectedFormule.name}, Max dishes: ${maxSelectionLimit}`);
    }
    
    function calculatePricing(guestCount) {
        if (!currentFormule || guestCount === 0) {
            hidePricingPreview();
            return;
        }
        
        const menuTotal = currentFormule.price * guestCount;
        let cocktailPrice = 0;
        
        // Calculate cocktail service cost
        const cocktailCheckbox = document.getElementById('cocktailService');
        if (cocktailCheckbox && cocktailCheckbox.checked) {
            if (guestCount < 55) cocktailPrice = 500;
            else if (guestCount < 105) cocktailPrice = 750;
            else if (guestCount < 155) cocktailPrice = 900;
            else cocktailPrice = 1200;
        }
        
        const total = menuTotal + cocktailPrice;
        
        // Update pricing display
        updatePricingDisplay(guestCount, menuTotal, cocktailPrice, total);
        
        // Update hidden field
        const estimatedTotalField = document.getElementById('estimatedTotalField');
        if (estimatedTotalField) {
            estimatedTotalField.value = total;
        }
        
        console.log(`Pricing calculated: Menu ${menuTotal}$, Cocktail ${cocktailPrice}$, Total ${total}$`);
    }
    
    function updatePricingDisplay(guestCount, menuTotal, cocktailPrice, total) {
        const pricingPreview = document.getElementById('pricingPreview');
        const pricingDetails = document.getElementById('pricingDetails');
        
        if (!pricingPreview || !pricingDetails) return;
        
        let detailsHTML = `
            <div class="text-sm space-y-2">
                <div class="flex justify-between">
                    <span>${currentFormule.name}</span>
                    <span class="font-bold">${menuTotal}$ (${currentFormule.price}$ × ${guestCount})</span>
                </div>
        `;
        
        if (cocktailPrice > 0) {
            detailsHTML += `
                <div class="flex justify-between">
                    <span>Service cocktail</span>
                    <span class="font-bold">${cocktailPrice}$</span>
                </div>
            `;
        }
        
        detailsHTML += `
                <hr class="border-gold/30">
                <div class="flex justify-between text-lg font-bold text-gold">
                    <span>Total estimé</span>
                    <span>${total}$</span>
                </div>
            </div>
        `;
        
        pricingDetails.innerHTML = detailsHTML;
        pricingPreview.classList.remove('hidden');
    }
    
    function handleCocktailChange(event) {
        const cocktailDetails = document.getElementById('cocktailDetails');
        if (cocktailDetails) {
            if (event.target.checked) {
                cocktailDetails.classList.remove('hidden');
            } else {
                cocktailDetails.classList.add('hidden');
            }
        }
        
        // Recalculate pricing
        if (currentGuestCount > 0 && currentFormule) {
            calculatePricing(currentGuestCount);
        }
    }
    
    // Menu selection
    function initializeMenuSelection() {
        console.log('Initializing menu selection...');
    }
    
    function loadMenuData() {
        renderMenuCategories(MENU_DATA);
    }
    
    function renderMenuCategories(menuData) {
        const categoriesContainer = document.getElementById('menuCategories');
        if (!categoriesContainer) return;
        
        categoriesContainer.innerHTML = '';
        
        menuData.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'mb-8';
            categoryDiv.innerHTML = `
                <h4 class="font-bold text-lg mb-4 text-gold">${category.nom}</h4>
                <div class="grid md:grid-cols-2 gap-4" data-category="${category.id}">
                    ${category.elements.map(element => `
                        <div class="menu-item-card p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gold transition-all" 
                             data-item-id="${element.id}" data-item-name="${element.nom}" data-category="${category.nom}">
                            <h5 class="font-semibold mb-2">${element.nom}</h5>
                            <p class="text-sm text-gray-600 mb-3">${element.description}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-500">Cliquez pour sélectionner</span>
                                <span class="selection-indicator hidden text-gold">✓ Sélectionné</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            categoriesContainer.appendChild(categoryDiv);
        });
        
        // Add click handlers
        document.querySelectorAll('.menu-item-card').forEach(card => {
            card.addEventListener('click', function() {
                toggleMenuItemSelection(this);
            });
        });
    }
    
    function toggleMenuItemSelection(card) {
        const itemName = card.dataset.itemName;
        const categoryName = card.dataset.category;
        const key = `${categoryName}::${itemName}`;
        
        if (selectedMenuItems.has(key)) {
            // Remove selection
            selectedMenuItems.delete(key);
            card.classList.remove('selected');
            const indicator = card.querySelector('.selection-indicator');
            if (indicator) indicator.classList.add('hidden');
            hideLimitWarning();
        } else {
            // Check limit
            if (selectedMenuItems.size >= maxSelectionLimit) {
                showLimitWarning();
                return;
            }
            
            // Add selection
            selectedMenuItems.add(key);
            card.classList.add('selected');
            const indicator = card.querySelector('.selection-indicator');
            if (indicator) indicator.classList.remove('hidden');
        }
        
        updateSelectionCounter();
        updateMenuSelectionConstraints();
    }
    
    function updateSelectionCounter() {
        const currentSelectionSpan = document.getElementById('currentSelection');
        if (currentSelectionSpan) {
            currentSelectionSpan.textContent = selectedMenuItems.size;
        }
    }
    
    function updateMenuSelectionConstraints() {
        document.querySelectorAll('.menu-item-card').forEach(card => {
            const itemName = card.dataset.itemName;
            const categoryName = card.dataset.category;
            const key = `${categoryName}::${itemName}`;
            
            // Disable if limit reached and not selected
            if (selectedMenuItems.size >= maxSelectionLimit && !selectedMenuItems.has(key)) {
                card.classList.add('disabled');
            } else {
                card.classList.remove('disabled');
            }
        });
        
        // Show/hide warning
        if (selectedMenuItems.size >= maxSelectionLimit) {
            showLimitWarning();
        } else {
            hideLimitWarning();
        }
    }
    
    // Utility functions
    function hideFormuleSelection() {
        const formuleContainer = document.getElementById('formuleSelection');
        if (formuleContainer) {
            formuleContainer.style.display = 'none';
        }
    }
    
    function hidePricingPreview() {
        const pricingPreview = document.getElementById('pricingPreview');
        if (pricingPreview) {
            pricingPreview.classList.add('hidden');
        }
    }
    
    function showLimitWarning() {
        const warningDiv = document.getElementById('limitWarning');
        if (warningDiv) {
            warningDiv.classList.remove('hidden');
        }
    }
    
    function hideLimitWarning() {
        const warningDiv = document.getElementById('limitWarning');
        if (warningDiv) {
            warningDiv.classList.add('hidden');
        }
    }
    
    // Generate quote summary
    function generateQuoteSummary() {
        const form = document.getElementById('quoteForm');
        const formData = new FormData(form);
        const summary = document.getElementById('quoteSummary');
        const selectedItemsArray = Array.from(selectedMenuItems);
        
        if (!summary) return;
        
        summary.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div>
                        <h5 class="font-semibold mb-2">📅 Événement</h5>
                        <p><strong>Type:</strong> ${formData.get('event_type') || 'Non spécifié'}</p>
                        <p><strong>Date:</strong> ${formData.get('event_date') || 'Non spécifiée'}</p>
                        <p><strong>Invités:</strong> ${formData.get('guests_count') || '0'}</p>
                        <p><strong>Lieu:</strong> ${formData.get('event_location') || 'Non spécifié'}</p>
                        ${formData.get('event_time') ? `<p><strong>Heure:</strong> ${formData.get('event_time')}</p>` : ''}
                    </div>
                    
                    <div>
                        <h5 class="font-semibold mb-2">👤 Contact</h5>
                        <p><strong>Nom:</strong> ${formData.get('client_name') || 'Non spécifié'}</p>
                        <p><strong>Téléphone:</strong> ${formData.get('client_phone') || 'Non spécifié'}</p>
                        <p><strong>Email:</strong> ${formData.get('client_email') || 'Non spécifié'}</p>
                        <p><strong>Contact préféré:</strong> ${formData.get('contact_preference') || 'WhatsApp'}</p>
                        ${formData.get('budget_range') ? `<p><strong>Budget:</strong> ${formData.get('budget_range')}</p>` : ''}
                    </div>
                    
                    ${currentFormule ? `
                    <div>
                        <h5 class="font-semibold mb-2">💎 Formule</h5>
                        <p><strong>${currentFormule.name}</strong></p>
                        <p>${currentFormule.price}$ par personne</p>
                        <p>Maximum ${currentFormule.maxDishes} plats</p>
                    </div>
                    ` : ''}
                </div>
                
                <div>
                    <h5 class="font-semibold mb-2">🍽️ Menu sélectionné (${selectedItemsArray.length} plats)</h5>
                    ${selectedItemsArray.length > 0 ? `
                        <div class="max-h-40 overflow-y-auto space-y-1">
                            ${selectedItemsArray.map(key => {
                                const [category, item] = key.split('::');
                                return `<div class="text-sm p-2 bg-gray-50 rounded">
                                    <strong>${item}</strong>
                                    <span class="text-gray-500"> (${category})</span>
                                </div>`;
                            }).join('')}
                        </div>
                    ` : '<p class="text-gray-500 italic">Aucun plat sélectionné</p>'}
                    
                    ${formData.get('cocktail_service') ? '<p class="mt-2 text-green-600"><strong>✅ Service cocktail inclus</strong></p>' : ''}
                    
                    ${formData.get('dietary_requirements') ? `<p class="mt-2"><strong>Contraintes:</strong> ${formData.get('dietary_requirements')}</p>` : ''}
                    ${formData.get('personal_message') ? `<p class="mt-2"><strong>Message:</strong> ${formData.get('personal_message')}</p>` : ''}
                </div>
            </div>
        `;
        
        // Update estimation details
        const estimationDiv = document.getElementById('estimationDetails');
        const estimatedTotal = document.getElementById('estimatedTotalField').value;
        if (estimationDiv && estimatedTotal) {
            estimationDiv.innerHTML = `
                <div class="text-2xl font-bold text-gold mb-2">${estimatedTotal}$</div>
                <p class="text-sm text-gray-600">Prix estimé pour ${formData.get('guests_count')} personnes</p>
            `;
        }
    }
    
    // Form validation and submission
    function initializeFormValidation() {
        const form = document.getElementById('quoteForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateCurrentStep()) {
                return;
            }
            
            // Check consent checkboxes
            const consentContact = form.querySelector('input[name="consent_contact"]');
            const consentPrivacy = form.querySelector('input[name="consent_privacy"]');
            
            if (!consentContact || !consentContact.checked || !consentPrivacy || !consentPrivacy.checked) {
                alert('Veuillez accepter les conditions de contact et la politique de confidentialité.');
                return;
            }
            
            const formData = new FormData(form);
            
            // Add menu selection to form data
            const menuSelection = {
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
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        showSuccessMessage();
    }
    
    function formatWhatsAppMessage(formData) {
        const selectedItemsArray = Array.from(selectedMenuItems);
        
        let message = `🌟 DEMANDE DE DEVIS - ARABESQUE TRAITEUR 🌟

📅 ÉVÉNEMENT
• Type: ${formData.get('event_type')}
• Date: ${formData.get('event_date')}
• Lieu: ${formData.get('event_location')}
• Invités: ${formData.get('guests_count')} personnes`;

        if (formData.get('event_time')) {
            message += `\n• Heure: ${formData.get('event_time')}`;
        }

        message += `

👤 MES COORDONNÉES
• Nom: ${formData.get('client_name')}
• Téléphone: ${formData.get('client_phone')}
• Email: ${formData.get('client_email')}`;

        if (currentFormule) {
            message += `

💎 FORMULE SÉLECTIONNÉE
• ${currentFormule.name} (${currentFormule.price}$ par personne)
• ${currentFormule.maxDishes} plats maximum`;
        }

        if (selectedItemsArray.length > 0) {
            message += `

🍽️ MENU SÉLECTIONNÉ (${selectedItemsArray.length} plats)
${selectedItemsArray.map(key => {
                const [category, item] = key.split('::');
                return `• ${item} (${category})`;
            }).join('\n')}`;
        }

        if (formData.get('cocktail_service')) {
            message += `\n\n🍹 SERVICE COCKTAIL SOUHAITÉ ✅`;
        }

        if (formData.get('dietary_requirements')) {
            message += `\n\n🥗 CONTRAINTES ALIMENTAIRES: ${formData.get('dietary_requirements')}`;
        }

        if (formData.get('budget_range')) {
            message += `\n\n💰 Budget approximatif: ${formData.get('budget_range')}`;
        }

        if (formData.get('estimated_total')) {
            message += `\n💰 Estimation automatique: ${formData.get('estimated_total')}$ (indicatif)`;
        }

        if (formData.get('personal_message')) {
            message += `\n\n📝 MESSAGE: ${formData.get('personal_message')}`;
        }

        message += `\n\nMerci pour votre service d'exception! 🙏`;

        return message;
    }
    
    function showSuccessMessage() {
        const successDiv = document.getElementById('formSuccess');
        const form = document.getElementById('quoteForm');
        
        if (successDiv && form) {
            successDiv.classList.remove('hidden');
            form.style.display = 'none';
            
            // Scroll to success message
            setTimeout(() => {
                successDiv.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }
    }
    
})();
