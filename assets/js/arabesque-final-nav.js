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
    console.log('🖼️ Logo image functionality activated');
  }

  enhanceLogoHomepage() {
    // Enhanced selectors to find your PNG logo
    const logoSelectors = [
      'img[src*="logo.png"]',                     // Direct logo.png image
      'img[src*="assets/images/logo.png"]',       // Full path to your logo
      'img[src*="logo"]',                         // Any image with "logo" in src
      'header img',                               // Any image in header
      '.logo img',                                // Image inside logo class
      'a img[src*="logo"]',                       // Logo image inside link
      '[alt*="logo" i]',                          // Alt text containing logo
      '[alt*="arabesque" i]',                     // Alt text containing arabesque
      'header a:has(img)',                        // Link containing image (modern browsers)
      'header a img',                             // Image inside header link
    ];

    // Also check for text-based logos as fallback
    const textLogoSelectors = [
      '.logo',                                    // Your current logo class
      'header .logo',                            // Logo inside header
      'header a[href*="index"]',                 // Any header link to index
      'header a:first-of-type',                  // First link in header
      'header .serif',                          // Your serif text style
      '[aria-label*="Accueil"]',                // Accessibility label
    ];

    let logoElement = null;
    let logoType = null;
    
    // First, try to find image-based logo
    for (const selector of logoSelectors) {
      try {
        logoElement = document.querySelector(selector);
        if (logoElement) {
          logoType = 'image';
          console.log(`🖼️ Logo image found with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // If no image found, try text-based logo
    if (!logoElement) {
      for (const selector of textLogoSelectors) {
        try {
          logoElement = document.querySelector(selector);
          if (logoElement) {
            logoType = 'text';
            console.log(`📝 Logo text found with selector: ${selector}`);
            break;
        }
        } catch (e) {
          continue;
        }
      }
    }

    // Final fallback: look for elements containing "Arabesque"
    if (!logoElement) {
      const headerElements = document.querySelectorAll('header *');
      headerElements.forEach(element => {
        const text = element.textContent.trim().toLowerCase();
        const alt = element.getAttribute('alt') || '';
        const src = element.getAttribute('src') || '';
        
        if (text.includes('arabesque') || 
            alt.toLowerCase().includes('arabesque') ||
            alt.toLowerCase().includes('logo') ||
            src.includes('logo')) {
          logoElement = element;
          logoType = element.tagName.toLowerCase() === 'img' ? 'image' : 'text';
          console.log(`🔍 Logo found by content search: ${logoType}`);
        }
      });
    }

    if (logoElement) {
      this.setupLogoHomepageLink(logoElement, logoType);
    } else {
      console.log('⚠️ Logo not found - creating fallback');
      this.createLogoHomepageFunctionality();
    }
  }

  setupLogoHomepageLink(logoElement, logoType) {
    // Find or create the parent link
    let logoLink = null;
    
    if (logoElement.tagName === 'A') {
      // Logo element is already a link
      logoLink = logoElement;
    } else if (logoElement.parentElement && logoElement.parentElement.tagName === 'A') {
      // Logo is inside a link
      logoLink = logoElement.parentElement;
    } else {
      // Need to wrap logo in a link
      logoLink = document.createElement('a');
      logoElement.parentNode.insertBefore(logoLink, logoElement);
      logoLink.appendChild(logoElement);
      console.log('🔗 Created new link wrapper for logo');
    }

    // Configure the homepage link
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage && currentPage !== 'index.html') {
      logoLink.setAttribute('href', 'index.html');
    } else {
      logoLink.setAttribute('href', './index.html');
    }
    
    logoLink.setAttribute('aria-label', 'Arabesque Traiteur - Retour à l\'accueil');
    logoLink.setAttribute('title', 'Retour à l\'accueil');
    
    // Enhanced styling for logo link
    logoLink.style.display = 'inline-block';
    logoLink.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    logoLink.style.cursor = 'pointer';

    // Special styling for image logos
    if (logoType === 'image') {
      const logoImg = logoLink.querySelector('img') || logoElement;
      if (logoImg) {
        logoImg.style.transition = 'all 0.3s ease';
        logoImg.style.maxHeight = logoImg.style.maxHeight || '40px'; // Reasonable default
        logoImg.style.width = 'auto';
      }
    }
    
    // Enhanced hover effects
    logoLink.addEventListener('mouseenter', () => {
      logoLink.style.transform = 'translateY(-2px)';
      if (logoType === 'image') {
        logoLink.style.filter = 'brightness(1.1)';
      } else {
        logoLink.style.opacity = '0.8';
      }
    });
    
    logoLink.addEventListener('mouseleave', () => {
      logoLink.style.transform = 'translateY(0)';
      if (logoType === 'image') {
        logoLink.style.filter = 'brightness(1)';
      } else {
        logoLink.style.opacity = '1';
      }
    });
    
    // Click feedback
    logoLink.addEventListener('mousedown', () => {
      logoLink.style.transform = 'translateY(1px) scale(0.98)';
    });
    
    logoLink.addEventListener('mouseup', () => {
      logoLink.style.transform = 'translateY(-2px) scale(1)';
    });

    // Enhanced click handler with feedback
    logoLink.addEventListener('click', (e) => {
      console.log('🏠 Logo clicked - navigating to homepage');
      
      // Add visual feedback
      logoLink.style.transform = 'scale(0.95)';
      setTimeout(() => {
        logoLink.style.transform = 'scale(1)';
      }, 150);
      
      // If we're already on homepage, scroll to top
      const currentPath = window.location.pathname;
      if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('📜 Already on homepage - scrolled to top');
      }
    });

    console.log(`✅ Logo ${logoType} homepage functionality successfully activated`);
  }

  createLogoHomepageFunctionality() {
    // Create a logo if none exists
    const header = document.querySelector('header');
    if (!header) return;

    // Try to add logo image if it doesn't exist
    const logoContainer = header.querySelector('.logo') || header.querySelector('a:first-of-type') || header;
    
    if (logoContainer && !logoContainer.querySelector('img[src*="logo"]')) {
      // Check if logo.png exists
      const testImg = new Image();
      testImg.onload = () => {
        console.log('✅ Logo image found, adding to header');
        const logoLink = document.createElement('a');
        logoLink.href = 'index.html';
        logoLink.setAttribute('aria-label', 'Arabesque Traiteur - Retour à l\'accueil');
        
        const logoImg = document.createElement('img');
        logoImg.src = 'assets/images/logo.png';
        logoImg.alt = 'Arabesque Traiteur';
        logoImg.style.height = '40px';
        logoImg.style.width = 'auto';
        
        logoLink.appendChild(logoImg);
        
        // Insert at beginning of header
        header.insertBefore(logoLink, header.firstChild);
        
        // Apply our styling
        this.setupLogoHomepageLink(logoLink, 'image');
      };
      testImg.onerror = () => {
        console.log('⚠️ Logo image not found at assets/images/logo.png');
      };
      testImg.src = 'assets/images/logo.png';
    }
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
    if (document.querySelector('#arabesque-logo-nav-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'arabesque-logo-nav-styles';
    style.textContent = `
      /* Arabesque Logo Navigation Enhancements */
      /* ✅ Optimized for PNG logo images */
      
      /* ENHANCED Logo Image Styling */
      header img[src*="logo"],
      header a img[src*="logo"],
      header .logo img {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
        max-height: 50px !important;
        width: auto !important;
        height: auto !important;
      }
      
      /* Logo Link Container */
      header a[aria-label*="accueil"],
      header a:has(img[src*="logo"]) {
        display: inline-block !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
        text-decoration: none !important;
      }
      
      /* Logo Hover Effects */
      header a[aria-label*="accueil"]:hover,
      header a:has(img[src*="logo"]):hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
      }
      
      /* Logo Click Effects */
      header a[aria-label*="accueil"]:active,
      header a:has(img[src*="logo"]):active {
        transform: translateY(1px) scale(0.98);
      }
      
      /* Focus styles for logo */
      header a[aria-label*="accueil"]:focus-visible,
      header a:has(img[src*="logo"]):focus-visible {
        outline: 2px solid #C9AB6D;
        outline-offset: 3px;
        border-radius: 4px;
      }
      
      /* Text-based Logo Fallback */
      header .logo,
      header .serif {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
        display: inline-block;
      }
      
      header .logo:hover,
      header .serif:hover {
        transform: translateY(-2px);
        opacity: 0.8;
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
      
      /* Enhanced header on scroll */
      header.scrolled {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(12px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
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
        
        /* Ensure logo is touch-friendly on mobile */
        header img[src*="logo"],
        header a[aria-label*="accueil"] {
          min-width: 44px !important;
          min-height: 44px !important;
        }
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
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation: none !important;
          transition: none !important;
        }
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
