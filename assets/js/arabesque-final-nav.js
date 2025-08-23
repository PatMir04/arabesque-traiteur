// ENHANCED Theme-Preserving Navigation - Arabesque Traiteur
// ✅ Preserves your existing beautiful design
// ✅ Adds responsive mobile enhancements
// ✅ ENHANCED: Logo always links to homepage with better detection
// ✅ Adds smooth scroll effects and professional touches

class ArabesqueFinalNav {
  constructor() {
    this.init();
  }

  init() {
    // Enhance existing navigation without breaking your theme
    this.enhanceLogoHomepage();
    this.enhanceExistingMobileNav();
    this.addScrollEffects();
    this.injectEnhancementStyles();
    console.log('✅ Navigation enhanced while preserving your beautiful theme');
    console.log('🏠 Logo homepage functionality activated');
  }

  enhanceLogoHomepage() {
    // Multiple ways to find your logo element
    const logoSelectors = [
      '.logo',                                    // Your current logo class
      'header .logo',                            // Logo inside header
      'header a[href*="index"]',                 // Any header link to index
      'header a:first-of-type',                  // First link in header
      'header span.logo',                        // Span with logo class
      'a:has(.logo)',                           // Link containing logo
      'header .serif',                          // Your serif text style
      '[aria-label*="Accueil"]',                // Accessibility label
      'header a[href="/"]',                      // Root link
      'header a[href="./"]',                     // Relative root
    ];

    let logoElement = null;
    
    // Try each selector until we find the logo
    for (const selector of logoSelectors) {
      try {
        logoElement = document.querySelector(selector);
        if (logoElement) {
          console.log(`🎯 Logo found with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Skip invalid selectors (like :has() in older browsers)
        continue;
      }
    }

    // If still not found, look for elements containing "Arabesque"
    if (!logoElement) {
      const headerLinks = document.querySelectorAll('header a');
      headerLinks.forEach(link => {
        if (link.textContent.includes('Arabesque') || 
            link.textContent.includes('Traiteur')) {
          logoElement = link;
          console.log('🎯 Logo found by text content: Arabesque/Traiteur');
        }
      });
    }

    // Final fallback: create logo link functionality on any header link
    if (!logoElement) {
      logoElement = document.querySelector('header a');
      if (logoElement) {
        console.log('🎯 Using first header link as logo');
      }
    }

    if (logoElement) {
      // ENHANCED: Ensure it always links to homepage
      const currentPage = window.location.pathname.split('/').pop();
      
      // Set homepage link based on current page location
      if (currentPage && currentPage !== 'index.html') {
        logoElement.setAttribute('href', 'index.html');
      } else {
        logoElement.setAttribute('href', './index.html');
      }
      
      logoElement.setAttribute('aria-label', 'Arabesque Traiteur - Retour à l\'accueil');
      logoElement.setAttribute('title', 'Retour à l\'accueil');
      
      // Add visual feedback for logo clicks
      logoElement.style.transition = 'all 0.3s ease';
      logoElement.style.cursor = 'pointer';
      
      // Enhanced hover effects
      logoElement.addEventListener('mouseenter', () => {
        logoElement.style.transform = 'translateY(-2px)';
        logoElement.style.opacity = '0.8';
      });
      
      logoElement.addEventListener('mouseleave', () => {
        logoElement.style.transform = 'translateY(0)';
        logoElement.style.opacity = '1';
      });
      
      // Click feedback
      logoElement.addEventListener('mousedown', () => {
        logoElement.style.transform = 'translateY(1px)';
      });
      
      logoElement.addEventListener('mouseup', () => {
        logoElement.style.transform = 'translateY(-2px)';
      });

      // Enhanced click handler with feedback
      logoElement.addEventListener('click', (e) => {
        console.log('🏠 Logo clicked - navigating to homepage');
        
        // Add visual feedback
        logoElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
          logoElement.style.transform = 'scale(1)';
        }, 150);
        
        // If we're already on homepage, scroll to top
        const currentPath = window.location.pathname;
        if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          console.log('📜 Already on homepage - scrolled to top');
        }
      });

      console.log('✅ Logo homepage functionality successfully activated');
    } else {
      console.log('⚠️ Logo element not found - trying alternative approach');
      this.createLogoHomepageFunctionality();
    }
  }

  createLogoHomepageFunctionality() {
    // Alternative approach: add click handler to any element with logo-like text
    const header = document.querySelector('header');
    if (!header) return;

    const logoTexts = header.querySelectorAll('*');
    logoTexts.forEach(element => {
      const text = element.textContent.trim().toLowerCase();
      if ((text.includes('arabesque') && text.includes('traiteur')) ||
          text === 'arabesque traiteur') {
        
        // Make it clickable if it's not already a link
        if (element.tagName !== 'A') {
          element.style.cursor = 'pointer';
          element.setAttribute('role', 'button');
          element.setAttribute('tabindex', '0');
          element.setAttribute('aria-label', 'Retour à l\'accueil');
          
          const handleHomepageClick = () => {
            console.log('🏠 Alternative logo clicked - navigating to homepage');
            window.location.href = 'index.html';
          };
          
          element.addEventListener('click', handleHomepageClick);
          element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleHomepageClick();
            }
          });
          
          console.log('✅ Alternative logo functionality created');
        }
      }
    });
  }

  enhanceExistingMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    const toggle = document.getElementById('openNav');
    
    if (!mobileNav || !toggle) {
      console.log('⚠️ Mobile nav elements not found');
      return;
    }

    // Add hamburger icon to your existing button
    this.addHamburgerIcon(toggle);
    
    // Enhanced toggle functionality
    const enhancedToggle = () => {
      const isHidden = mobileNav.classList.contains('hidden');
      
      if (isHidden) {
        // Opening menu
        mobileNav.classList.remove('hidden');
        mobileNav.classList.add('mobile-nav-enhanced');
        document.body.classList.add('mobile-nav-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('active');
        this.addOverlay();
      } else {
        // Closing menu
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('mobile-nav-enhanced');
        document.body.classList.remove('mobile-nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        this.removeOverlay();
      }
    };

    // Replace existing click handler
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    newToggle.addEventListener('click', enhancedToggle);

    // Close on link click
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('mobile-nav-enhanced');
        document.body.classList.remove('mobile-nav-open');
        newToggle.setAttribute('aria-expanded', 'false');
        newToggle.classList.remove('active');
        this.removeOverlay();
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
        enhancedToggle();
      }
    });

    // Close on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && !mobileNav.classList.contains('hidden')) {
        enhancedToggle();
      }
    });
  }

  addHamburgerIcon(toggle) {
    // Store original content and classes
    const originalClasses = toggle.className;
    const originalAttributes = {};
    
    // Store all original attributes
    for (let attr of toggle.attributes) {
      originalAttributes[attr.name] = attr.value;
    }
    
    // Create hamburger icon
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger-icon';
    hamburger.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    // Update toggle content while preserving styles
    toggle.innerHTML = '';
    toggle.appendChild(hamburger);
    
    // Add screen reader text
    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = 'Menu de navigation';
    toggle.appendChild(srText);
    
    // Preserve all original attributes and classes
    toggle.className = originalClasses + ' enhanced-toggle';
    Object.keys(originalAttributes).forEach(attr => {
      if (attr !== 'class') {
        toggle.setAttribute(attr, originalAttributes[attr]);
      }
    });
  }

  addOverlay() {
    if (document.querySelector('.mobile-overlay-enhanced')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay-enhanced';
    overlay.addEventListener('click', () => {
      const mobileNav = document.getElementById('mobileNav');
      const toggle = document.getElementById('openNav');
      
      if (mobileNav && toggle && !mobileNav.classList.contains('hidden')) {
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('mobile-nav-enhanced');
        document.body.classList.remove('mobile-nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        this.removeOverlay();
      }
    });
    
    document.body.appendChild(overlay);
  }

  removeOverlay() {
    const overlay = document.querySelector('.mobile-overlay-enhanced');
    if (overlay) {
      overlay.remove();
    }
  }

  addScrollEffects() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let ticking = false;
    
    const updateHeader = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
  }

  injectEnhancementStyles() {
    // Only inject if not already present
    if (document.querySelector('#arabesque-final-nav-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'arabesque-final-nav-styles';
    style.textContent = `
      /* Arabesque Final Navigation Enhancements */
      /* ✅ Preserves your existing beautiful design */
      
      /* ENHANCED Logo Styling */
      header .logo,
      header a[aria-label*="accueil"],
      header [role="button"][aria-label*="accueil"] {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
        display: inline-block;
      }
      
      header .logo:hover,
      header a[aria-label*="accueil"]:hover,
      header [role="button"][aria-label*="accueil"]:hover {
        transform: translateY(-2px);
        opacity: 0.8;
      }
      
      header .logo:active,
      header a[aria-label*="accueil"]:active,
      header [role="button"][aria-label*="accueil"]:active {
        transform: scale(0.95);
      }
      
      /* Focus styles for logo */
      header .logo:focus-visible,
      header a[aria-label*="accueil"]:focus-visible,
      header [role="button"][aria-label*="accueil"]:focus-visible {
        outline: 2px solid #C9AB6D;
        outline-offset: 3px;
        border-radius: 4px;
      }
      
      /* Hamburger Icon Styling */
      .hamburger-icon {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 18px;
        height: 12px;
        margin: auto;
      }
      
      .hamburger-icon span {
        display: block;
        height: 2px;
        width: 100%;
        background-color: currentColor;
        border-radius: 1px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: center;
      }
      
      /* Hamburger Animation - Keeps your button styling */
      .enhanced-toggle.active .hamburger-icon span:nth-child(1) {
        transform: translateY(5px) rotate(45deg);
      }
      
      .enhanced-toggle.active .hamburger-icon span:nth-child(2) {
        opacity: 0;
        transform: scale(0.8);
      }
      
      .enhanced-toggle.active .hamburger-icon span:nth-child(3) {
        transform: translateY(-5px) rotate(-45deg);
      }
      
      /* Enhanced Mobile Navigation - Builds on your existing styles */
      #mobileNav.mobile-nav-enhanced {
        position: fixed !important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        z-index: 9999;
        display: flex !important;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        animation: slideInFromTop 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
      }
      
      @keyframes slideInFromTop {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Enhanced Mobile Navigation Content */
      #mobileNav.mobile-nav-enhanced .max-w-6xl {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        text-align: center;
        padding: 2rem;
      }
      
      #mobileNav.mobile-nav-enhanced a {
        font-size: 1.25rem !important;
        font-weight: 500 !important;
        padding: 1rem 2rem !important;
        border-radius: 0.75rem !important;
        transition: all 0.3s ease !important;
        min-width: 200px;
        display: flex !important;
        align-items: center;
        justify-content: center;
        border: 2px solid transparent !important;
      }
      
      #mobileNav.mobile-nav-enhanced a:hover {
        background: rgba(201, 171, 109, 0.1) !important;
        color: #C9AB6D !important;
        transform: translateY(-2px) !important;
        border-color: rgba(201, 171, 109, 0.3) !important;
      }
      
      /* Mobile Overlay */
      .mobile-overlay-enhanced {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 9998;
        backdrop-filter: blur(4px);
        opacity: 0;
        animation: fadeIn 0.3s ease-out forwards;
      }
      
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      
      /* Prevent body scroll when mobile menu is open */
      body.mobile-nav-open {
        overflow: hidden !important;
        height: 100vh;
      }
      
      /* Enhanced header on scroll - Builds on your existing styles */
      header.scrolled {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(12px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(0);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Screen reader accessibility */
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
      
      /* Enhanced touch targets for mobile */
      @media (max-width: 768px) {
        .enhanced-toggle {
          min-width: 44px !important;
          min-height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        #mobileNav a {
          min-height: 48px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
      }
      
      /* Desktop hover enhancements - Subtle additions to your theme */
      @media (min-width: 769px) {
        nav a.nav-link {
          position: relative;
          transition: color 0.3s ease;
        }
        
        nav a.nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          width: 0;
          height: 2px;
          background: #C9AB6D;
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 1px;
        }
        
        nav a.nav-link:hover::after,
        nav a.nav-link.active::after {
          width: 100%;
        }
        
        nav a.nav-link:hover {
          color: #C9AB6D;
        }
      }
      
      /* Smooth header transitions */
      header {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .hamburger-icon span {
          background-color: black !important;
        }
        
        #mobileNav.mobile-nav-enhanced {
          border: 3px solid black;
        }
        
        .mobile-overlay-enhanced {
          background: rgba(0, 0, 0, 0.8);
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation: none !important;
          transition: none !important;
        }
        
        .hamburger-icon span {
          transition: none !important;
        }
        
        header .logo,
        header a[aria-label*="accueil"],
        header [role="button"][aria-label*="accueil"] {
          transition: none !important;
        }
      }
      
      /* Focus management for accessibility */
      .enhanced-toggle:focus-visible {
        outline: 2px solid #C9AB6D;
        outline-offset: 2px;
      }
      
      #mobileNav.mobile-nav-enhanced a:focus-visible {
        outline: 2px solid #C9AB6D;
        outline-offset: 2px;
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ArabesqueFinalNav());
} else {
  new ArabesqueFinalNav();
}

// Export for manual usage
if (typeof window !== 'undefined') {
  window.ArabesqueFinalNav = ArabesqueFinalNav;
}
