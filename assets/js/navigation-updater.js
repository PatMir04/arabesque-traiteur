// Universal Navigation Updater for All Pages
// This script updates the existing navigation on all pages to use the new responsive system

class NavigationUpdater {
  constructor() {
    this.init();
  }

  init() {
    this.updateExistingNavigation();
    this.injectNavigationAssets();
    console.log('🔄 Navigation updated to responsive system');
  }

  updateExistingNavigation() {
    // Find existing header
    const existingHeader = document.querySelector('header') || document.querySelector('#mainHeader');
    
    if (existingHeader) {
      // Replace with new navigation structure
      existingHeader.outerHTML = this.getNewNavigationHTML();
      
      // Add mobile navigation elements after header
      const newHeader = document.querySelector('.main-header');
      if (newHeader) {
        newHeader.insertAdjacentHTML('afterend', this.getMobileNavigationHTML());
      }
    } else {
      // If no header found, add to beginning of body
      document.body.insertAdjacentHTML('afterbegin', 
        this.getNewNavigationHTML() + this.getMobileNavigationHTML()
      );
    }

    // Set active page
    this.setActivePage();
  }

  getNewNavigationHTML() {
    return `
    <header class="main-header" id="mainHeader" role="banner">
      <div class="header-container">
        <!-- Logo / Brand -->
        <a href="index.html" class="header-logo" aria-label="Arabesque Traiteur - Retour à l'accueil">
          <div class="logo-icon" aria-hidden="true">
            <span>A</span>
          </div>
          <div class="logo-text">
            <div class="logo-title">Arabesque</div>
            <div class="logo-subtitle">Traiteur</div>
          </div>
        </a>
        
        <!-- Desktop Navigation -->
        <nav class="main-nav" role="navigation" aria-label="Navigation principale">
          <ul class="nav-menu">
            <li class="nav-item">
              <a href="a-propos.html" class="nav-link">À propos</a>
            </li>
            <li class="nav-item">
              <a href="equipe.html" class="nav-link">Équipe</a>
            </li>
            <li class="nav-item">
              <a href="services.html" class="nav-link">Services</a>
            </li>
            <li class="nav-item">
              <a href="menu.html" class="nav-link">Menu</a>
            </li>
            <li class="nav-item">
              <a href="galerie.html" class="nav-link">Galerie</a>
            </li>
            <li class="nav-item">
              <a href="contact.html" class="nav-cta">Devis Gratuit</a>
            </li>
          </ul>
        </nav>
        
        <!-- Mobile Menu Toggle Button -->
        <button 
          class="mobile-menu-toggle" 
          type="button"
          aria-expanded="false"
          aria-controls="mobileNav"
          aria-label="Ouvrir le menu"
        >
          <div class="hamburger" aria-hidden="true">
            <span></span>
          </div>
          <span class="sr-only">Menu</span>
        </button>
      </div>
    </header>
    `;
  }

  getMobileNavigationHTML() {
    return `
    <!-- Mobile Navigation Overlay -->
    <div class="mobile-nav-overlay" aria-hidden="true"></div>

    <!-- Mobile Navigation Menu -->
    <nav 
      class="mobile-nav" 
      id="mobileNav"
      role="navigation" 
      aria-label="Menu mobile"
      aria-hidden="true"
    >
      <!-- Mobile Nav Header -->
      <div class="mobile-nav-header">
        <h2 class="mobile-nav-title">Navigation</h2>
        <button 
          class="mobile-nav-close" 
          type="button"
          aria-label="Fermer le menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <!-- Mobile Nav Menu -->
      <ul class="mobile-nav-menu" role="menu">
        <li class="mobile-nav-item" role="none">
          <a href="index.html" class="mobile-nav-link" role="menuitem">
            <span>🏠</span>
            Accueil
          </a>
        </li>
        <li class="mobile-nav-item" role="none">
          <a href="a-propos.html" class="mobile-nav-link" role="menuitem">
            <span>👋</span>
            À propos
          </a>
        </li>
        <li class="mobile-nav-item" role="none">
          <a href="equipe.html" class="mobile-nav-link" role="menuitem">
            <span>👥</span>
            Notre équipe
          </a>
        </li>
        <li class="mobile-nav-item" role="none">
          <a href="services.html" class="mobile-nav-link" role="menuitem">
            <span>🎯</span>
            Nos services
          </a>
        </li>
        <li class="mobile-nav-item" role="none">
          <a href="menu.html" class="mobile-nav-link" role="menuitem">
            <span>🍽️</span>
            Menu congolais
          </a>
        </li>
        <li class="mobile-nav-item" role="none">
          <a href="galerie.html" class="mobile-nav-link" role="menuitem">
            <span>📸</span>
            Galerie photos
          </a>
        </li>
        <li class="mobile-nav-item" role="none">
          <a href="contact.html" class="mobile-nav-link" role="menuitem">
            <span>📞</span>
            Contact
          </a>
        </li>
      </ul>
      
      <!-- Mobile CTA Button -->
      <a href="contact.html" class="mobile-nav-cta">
        <span>📋</span>
        Demander un devis gratuit
      </a>
      
      <!-- Mobile Nav Footer -->
      <div class="mobile-nav-footer" style="padding: 1rem 1.5rem; text-align: center; border-top: 1px solid rgba(0,0,0,0.1); margin-top: auto;">
        <p style="margin: 0; font-size: 0.8rem; color: #666;">
          <strong>Arabesque Traiteur</strong><br>
          Cuisine congolaise authentique
        </p>
        <div style="margin-top: 0.5rem; display: flex; justify-content: center; gap: 1rem;">
          <a href="tel:+243859993833" style="color: #C9AB6D; text-decoration: none; font-size: 0.8rem;">
            📞 +243 859 993 833
          </a>
          <a href="https://wa.me/243859993833" target="_blank" rel="noopener" style="color: #25D366; text-decoration: none; font-size: 0.8rem;">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </nav>
    `;
  }

  setActivePage() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Desktop links
    const desktopLinks = document.querySelectorAll('.nav-link, .nav-cta');
    // Mobile links  
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    const allLinks = [...desktopLinks, ...mobileLinks];
    
    allLinks.forEach(link => {
      link.classList.remove('active');
      
      const href = link.getAttribute('href');
      if (href) {
        const linkPage = href.split('/').pop();
        
        // Handle different page matching scenarios
        if (
          (currentPage === 'index.html' && (linkPage === 'index.html' || linkPage === '/' || linkPage === '')) ||
          (currentPage === linkPage) ||
          (currentPage === '' && linkPage === 'index.html')
        ) {
          link.classList.add('active');
        }
      }
    });
  }

  injectNavigationAssets() {
    // Check if assets are already loaded
    if (document.querySelector('#navigation-system-css')) {
      return;
    }

    // Inject CSS
    const cssLink = document.createElement('link');
    cssLink.id = 'navigation-system-css';
    cssLink.rel = 'stylesheet';
    cssLink.href = 'assets/css/navigation-system.css';
    document.head.appendChild(cssLink);

    // Inject core CSS if navigation-system.css is not available
    cssLink.onerror = () => {
      this.injectFallbackCSS();
    };

    // Inject JavaScript
    const existingNavScript = document.querySelector('#navigation-system-js');
    if (!existingNavScript) {
      const script = document.createElement('script');
      script.id = 'navigation-system-js';
      script.src = 'assets/js/navigation-system.js';
      script.async = true;
      
      script.onerror = () => {
        // Fallback: inject minimal navigation functionality
        this.injectFallbackJS();
      };
      
      document.head.appendChild(script);
    }
  }

  injectFallbackCSS() {
    const style = document.createElement('style');
    style.id = 'navigation-fallback-css';
    style.textContent = `
      /* Minimal fallback CSS for navigation */
      .main-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        height: 80px;
      }
      
      .header-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
      }
      
      .header-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: inherit;
      }
      
      .logo-icon {
        width: 40px;
        height: 40px;
        background: #000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
      }
      
      .logo-title {
        font-size: 1.25rem;
        font-weight: bold;
      }
      
      .logo-subtitle {
        font-size: 0.7rem;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      
      .nav-menu {
        display: flex;
        list-style: none;
        gap: 2rem;
        margin: 0;
        padding: 0;
      }
      
      .nav-link {
        text-decoration: none;
        color: #333;
        font-weight: 500;
        padding: 0.5rem 0;
      }
      
      .nav-link:hover,
      .nav-link.active {
        color: #C9AB6D;
      }
      
      .nav-cta {
        background: #C9AB6D;
        color: #000;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-weight: 600;
        text-decoration: none;
      }
      
      .mobile-menu-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
      }
      
      .hamburger {
        position: relative;
        width: 24px;
        height: 18px;
      }
      
      .hamburger span,
      .hamburger::before,
      .hamburger::after {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background: #333;
      }
      
      .hamburger span { top: 8px; }
      .hamburger::before { top: 0; }
      .hamburger::after { bottom: 0; }
      
      .mobile-nav {
        position: fixed;
        top: 0;
        right: -100%;
        width: 320px;
        height: 100vh;
        background: white;
        z-index: 1001;
        transition: right 0.3s ease;
        overflow-y: auto;
      }
      
      .mobile-nav.active {
        right: 0;
      }
      
      .mobile-nav-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      
      .mobile-nav-overlay.active {
        opacity: 1;
        visibility: visible;
      }
      
      @media (max-width: 768px) {
        .main-nav .nav-menu {
          display: none;
        }
        
        .mobile-menu-toggle {
          display: block;
        }
      }
      
      /* Add body padding to prevent content from hiding behind fixed header */
      body {
        padding-top: 80px;
      }
      
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }

  injectFallbackJS() {
    const script = document.createElement('script');
    script.id = 'navigation-fallback-js';
    script.textContent = `
      // Minimal fallback JavaScript for navigation
      document.addEventListener('DOMContentLoaded', function() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.mobile-nav');
        const overlay = document.querySelector('.mobile-nav-overlay');
        const close = document.querySelector('.mobile-nav-close');
        
        if (toggle && nav && overlay) {
          toggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
          });
          
          const closeMenu = function() {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
          };
          
          if (close) close.addEventListener('click', closeMenu);
          overlay.addEventListener('click', closeMenu);
          
          // Close on escape key
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMenu();
          });
        }
      });
    `;
    document.head.appendChild(script);
  }
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NavigationUpdater());
} else {
  new NavigationUpdater();
}

// Export for manual usage
if (typeof window !== 'undefined') {
  window.NavigationUpdater = NavigationUpdater;
}
