// WORKING Navigation - Arabesque Traiteur
// ✅ Works with your TEXT logo: "Arabesque Traiteur"
// ✅ Preserves your existing beautiful design
// ✅ Adds responsive mobile enhancements

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
    console.log('🏠 Text logo functionality activated');
  }

  enhanceLogoHomepage() {
    // Find your text-based logo
    const logoSelectors = [
      'header a .logo',                          // Your exact structure: a > span.logo
      'header .logo',                           // Direct logo class
      'header a[href*="index"]',                // Link to index
      'header a:first-of-type',                 // First link in header
      'header .serif',                          // Your serif class
      'header a[aria-label*="Accueil"]',       // Your aria label
    ];

    let logoElement = null;
    
    // Try to find the logo element
    for (const selector of logoSelectors) {
      try {
        logoElement = document.querySelector(selector);
        if (logoElement) {
          console.log(`🎯 Logo found with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // If logo span found but parent isn't a link, target the parent link
    if (logoElement && logoElement.classList.contains('logo') && logoElement.parentElement.tagName === 'A') {
      logoElement = logoElement.parentElement; // Use the <a> tag instead
      console.log('🔗 Using parent link for logo functionality');
    }

    if (logoElement) {
      this.setupLogoHomepageLink(logoElement);
    } else {
      console.log('⚠️ Logo element not found');
      this.createLogoHomepageFunctionality();
    }
  }

  setupLogoHomepageLink(logoElement) {
    // Ensure it's a link or make it one
    let logoLink = logoElement;
    
    if (logoElement.tagName !== 'A') {
      // If it's not a link, find the parent link or create one
      const parentLink = logoElement.closest('a');
      if (parentLink) {
        logoLink = parentLink;
      } else {
        // Create a wrapper link
        logoLink = document.createElement('a');
        logoElement.parentNode.insertBefore(logoLink, logoElement);
        logoLink.appendChild(logoElement);
      }
    }

    // Configure homepage linking
    logoLink.setAttribute('href', 'index.html');
    logoLink.setAttribute('aria-label', 'Arabesque Traiteur - Retour à l\'accueil');
    logoLink.setAttribute('title', 'Retour à l\'accueil');
    
    // Enhanced styling without breaking existing design
    logoLink.style.textDecoration = 'none';
    logoLink.style.display = 'inline-block';
    logoLink.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    logoLink.style.cursor = 'pointer';
    
    // Enhanced hover effects
    logoLink.addEventListener('mouseenter', () => {
      logoLink.style.transform = 'translateY(-2px)';
      logoLink.style.opacity = '0.85';
    });
    
    logoLink.addEventListener('mouseleave', () => {
      logoLink.style.transform = 'translateY(0)';
      logoLink.style.opacity = '1';
    });
    
    // Click feedback
    logoLink.addEventListener('mousedown', () => {
      logoLink.style.transform = 'scale(0.98)';
    });
    
    logoLink.addEventListener('mouseup', () => {
      logoLink.style.transform = 'scale(1)';
    });

    // Enhanced click handler
    logoLink.addEventListener('click', (e) => {
      console.log('🏠 Logo clicked - navigating to homepage');
      
      // Visual feedback
      logoLink.style.transform = 'scale(0.95)';
      setTimeout(() => {
        logoLink.style.transform = 'scale(1)';
      }, 150);
      
      // If already on homepage, scroll to top
      const currentPath = window.location.pathname;
      if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('📜 Already on homepage - scrolled to top');
      }
    });

    console.log('✅ Text logo homepage functionality successfully activated');
  }

  createLogoHomepageFunctionality() {
    // Fallback: make any element with "Arabesque" clickable
    const headerElements = document.querySelectorAll('header *');
    headerElements.forEach(element => {
      const text = element.textContent.trim();
      if (text.includes('Arabesque') && text.includes('Traiteur')) {
        element.style.cursor = 'pointer';
        element.style.transition = 'all 0.3s ease';
        
        element.addEventListener('click', () => {
          window.location.href = 'index.html';
        });
        
        element.addEventListener('mouseenter', () => {
          element.style.opacity = '0.7';
        });
        
        element.addEventListener('mouseleave', () => {
          element.style.opacity = '1';
        });
        
        console.log('🔄 Fallback logo functionality created');
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

    console.log('📱 Enhancing existing mobile navigation');

    // Store original toggle handler to avoid conflicts
    const originalToggleFunction = () => {
      const isHidden = mobileNav.classList.contains('hidden');
      mobileNav.classList.toggle('hidden');
      toggle.setAttribute('aria-expanded', String(!isHidden));
    };

    // Enhanced toggle with hamburger icon
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

    // Replace the existing event listener
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    newToggle.addEventListener('click', enhancedToggle);

    // Close on mobile link click
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

    console.log('✅ Mobile navigation enhanced successfully');
  }

  addHamburgerIcon(toggle) {
    // Store original content
    const originalText = toggle.textContent;
    const originalClasses = toggle.className;
    
    // Create hamburger icon
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger-icon';
    hamburger.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    // Replace button content
    toggle.innerHTML = '';
    toggle.appendChild(hamburger);
    
    // Add screen reader text
    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = originalText;
    toggle.appendChild(srText);
    
    // Preserve original classes and add enhancement
    toggle.className = originalClasses + ' enhanced-toggle';
    
    console.log('🍔 Hamburger icon added to mobile toggle');
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
    if (document.querySelector('#arabesque-working-nav-styles')) return;

    const style = document.createElement('style');
    style.id = 'arabesque-working-nav-styles';
    style.textContent = `
      /* Arabesque Working Navigation Styles */
      
      /* Enhanced Logo Text Styling */
      header a[aria-label*="accueil"],
      header a .logo,
      header a .serif {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
        text-decoration: none !important;
      }
      
      header a[aria-label*="accueil"]:hover,
      header a:hover .logo,
      header a:hover .serif {
        transform: translateY(-2px);
        opacity: 0.85;
      }
      
      /* Focus styles for logo */
      header a[aria-label*="accueil"]:focus-visible {
        outline: 2px solid #C9AB6D;
        outline-offset: 3px;
        border-radius: 4px;
      }
      
      /* Hamburger Icon */
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
      
      /* Hamburger Animation */
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
      
      /* Enhanced Mobile Navigation */
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
      
      /* Mobile Navigation Content */
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
      
      /* Prevent body scroll */
      body.mobile-nav-open {
        overflow: hidden !important;
        height: 100vh;
      }
      
      /* Enhanced header on scroll */
      header.scrolled {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(12px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
      }
      
      /* Screen reader text */
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
      
      /* Desktop hover enhancements */
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
      
      /* Touch targets */
      @media (max-width: 768px) {
        .enhanced-toggle {
          min-width: 44px !important;
          min-height: 44px !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ArabesqueFinalNav());
} else {
  new ArabesqueFinalNav();
}

// Export
if (typeof window !== 'undefined') {
  window.ArabesqueFinalNav = ArabesqueFinalNav;
}
