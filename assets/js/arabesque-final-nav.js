// ULTIMATE Arabesque Navigation - Uses Your Real Logo.png
// ✅ Replaces text logo with actual assets/images/logo.png
// ✅ Updates existing arabesque-final-nav.js - no HTML changes needed
// ✅ Beautiful Avenir font styling
// ✅ Professional logo implementation

class ArabesqueFinalNav {
  constructor() {
    this.init();
  }

  init() {
    // Replace text logo with actual PNG logo first
    this.replaceTextLogoWithImage();
    
    // Then enhance navigation
    this.enhanceLogoHomepage();
    this.enhanceExistingMobileNav();
    this.addScrollEffects();
    this.injectEnhancementStyles();
    
    console.log('✅ Navigation enhanced with real PNG logo');
    console.log('🖼️ Logo image functionality activated');
  }

  replaceTextLogoWithImage() {
    // Find your current text logo
    const textLogoLink = document.querySelector('header a[aria-label="Accueil"]') ||
                        document.querySelector('header a:first-of-type');
    
    if (!textLogoLink) {
      console.log('⚠️ Text logo link not found');
      return;
    }

    const textLogoSpan = textLogoLink.querySelector('.logo.serif');
    
    if (textLogoSpan) {
      console.log('🔄 Replacing text logo with PNG image...');
      
      // Create the image element
      const logoImg = document.createElement('img');
      logoImg.src = 'assets/images/logo.png';
      logoImg.alt = 'Arabesque Traiteur';
      logoImg.className = 'logo-image';
      logoImg.style.cssText = `
        height: 40px;
        width: auto;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      `;

      // Test if logo exists, if not keep text as fallback
      logoImg.onload = () => {
        console.log('✅ Logo PNG loaded successfully');
        textLogoSpan.style.display = 'none'; // Hide text
        textLogoLink.insertBefore(logoImg, textLogoSpan); // Add image before text
      };

      logoImg.onerror = () => {
        console.log('⚠️ Logo PNG not found, keeping text logo');
        // Keep the text logo but style it better
        textLogoSpan.style.fontFamily = '"Avenir Next", Avenir, system-ui, sans-serif';
        textLogoSpan.style.fontWeight = '600';
        textLogoSpan.style.letterSpacing = '-0.02em';
      };
    }
  }

  enhanceLogoHomepage() {
    // Find logo (image or text)
    const logoSelectors = [
      'header .logo-image',                     // Our new image logo
      'header a .logo',                         // Original text logo
      'header img[src*="logo"]',               // Any logo image
      'header a[aria-label*="Accueil"]',       // Your existing link
      'header a:first-of-type',                // First header link
    ];

    let logoElement = null;
    let logoType = 'text';
    
    for (const selector of logoSelectors) {
      try {
        logoElement = document.querySelector(selector);
        if (logoElement) {
          logoType = logoElement.tagName === 'IMG' ? 'image' : 'text';
          console.log(`🎯 Logo found: ${logoType} (${selector})`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (logoElement) {
      this.setupLogoHomepageLink(logoElement, logoType);
    } else {
      console.log('⚠️ No logo found, creating fallback');
      this.createLogoHomepageFunctionality();
    }
  }

  setupLogoHomepageLink(logoElement, logoType) {
    // Find or ensure we have the parent link
    let logoLink = logoElement;
    
    if (logoElement.tagName !== 'A') {
      logoLink = logoElement.closest('a') || logoElement.parentElement;
      if (logoLink.tagName !== 'A') {
        // Create wrapper link if needed
        const wrapperLink = document.createElement('a');
        logoElement.parentNode.insertBefore(wrapperLink, logoElement);
        wrapperLink.appendChild(logoElement);
        logoLink = wrapperLink;
      }
    }

    // Configure homepage linking
    logoLink.setAttribute('href', 'index.html');
    logoLink.setAttribute('aria-label', 'Arabesque Traiteur - Retour à l\'accueil');
    logoLink.setAttribute('title', 'Retour à l\'accueil');
    
    // Enhanced styling
    logoLink.style.cssText = `
      display: inline-block !important;
      text-decoration: none !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      cursor: pointer !important;
    `;

    // Type-specific styling
    if (logoType === 'image') {
      const logoImg = logoLink.querySelector('img') || logoElement;
      if (logoImg) {
        logoImg.style.cssText = `
          height: 40px;
          width: auto;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        `;
      }
    } else {
      // Text logo styling with Avenir
      const textLogo = logoLink.querySelector('.logo') || logoElement;
      if (textLogo) {
        textLogo.style.fontFamily = '"Avenir Next", Avenir, "SF Pro Display", system-ui, sans-serif';
        textLogo.style.fontWeight = '600';
        textLogo.style.letterSpacing = '-0.02em';
      }
    }
    
    // Enhanced hover effects
    logoLink.addEventListener('mouseenter', () => {
      logoLink.style.transform = 'translateY(-2px)';
      if (logoType === 'image') {
        logoLink.style.filter = 'brightness(1.05) contrast(1.05)';
      } else {
        logoLink.style.opacity = '0.8';
      }
    });
    
    logoLink.addEventListener('mouseleave', () => {
      logoLink.style.transform = 'translateY(0)';
      if (logoType === 'image') {
        logoLink.style.filter = 'brightness(1) contrast(1)';
      } else {
        logoLink.style.opacity = '1';
      }
    });
    
    // Click feedback
    logoLink.addEventListener('mousedown', () => {
      logoLink.style.transform = 'scale(0.96) translateY(1px)';
    });
    
    logoLink.addEventListener('mouseup', () => {
      logoLink.style.transform = 'scale(1) translateY(-2px)';
    });

    // Click handler with smooth scroll if on homepage
    logoLink.addEventListener('click', (e) => {
      console.log(`🏠 ${logoType} logo clicked - navigating to homepage`);
      
      // Visual feedback
      logoLink.style.transform = 'scale(0.94)';
      setTimeout(() => {
        logoLink.style.transform = 'scale(1)';
      }, 150);
      
      // If already on homepage, scroll to top smoothly
      const currentPath = window.location.pathname;
      if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
        e.preventDefault();
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
        console.log('📜 Already on homepage - smooth scrolled to top');
      }
    });

    console.log(`✅ ${logoType} logo homepage functionality activated`);
  }

  createLogoHomepageFunctionality() {
    // Create logo functionality if none found
    const header = document.querySelector('header');
    if (!header) return;

    // Try to add actual logo image
    const firstLink = header.querySelector('a');
    if (firstLink) {
      // Test if logo image exists
      const testImg = new Image();
      testImg.onload = () => {
        console.log('🆕 Creating new logo image element');
        
        const logoImg = document.createElement('img');
        logoImg.src = 'assets/images/logo.png';
        logoImg.alt = 'Arabesque Traiteur';
        logoImg.className = 'logo-image-new';
        logoImg.style.cssText = `
          height: 40px;
          width: auto;
          margin-right: 0.5rem;
        `;
        
        firstLink.insertBefore(logoImg, firstLink.firstChild);
        this.setupLogoHomepageLink(firstLink, 'image');
      };
      
      testImg.onerror = () => {
        console.log('⚠️ Logo image not found, enhancing existing text');
        firstLink.style.fontFamily = '"Avenir Next", Avenir, system-ui, sans-serif';
        this.setupLogoHomepageLink(firstLink, 'text');
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

    console.log('📱 Enhancing mobile navigation...');

    // Add hamburger icon
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
        console.log('📂 Mobile menu opened');
      } else {
        // Closing menu
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('mobile-nav-enhanced');
        document.body.classList.remove('mobile-nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        this.removeOverlay();
        console.log('📁 Mobile menu closed');
      }
    };

    // Replace existing event listener
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    newToggle.addEventListener('click', (e) => {
      e.preventDefault();
      enhancedToggle();
    });

    // Close on mobile link click
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => enhancedToggle(), 100); // Small delay for better UX
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
        enhancedToggle();
      }
    });

    // Close on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && !mobileNav.classList.contains('hidden')) {
        enhancedToggle();
      }
    });

    console.log('✅ Mobile navigation enhanced successfully');
  }

  addHamburgerIcon(toggle) {
    // Store original content
    const originalClasses = toggle.className;
    const originalAttributes = {};
    
    // Store attributes
    Array.from(toggle.attributes).forEach(attr => {
      originalAttributes[attr.name] = attr.value;
    });
    
    // Create hamburger icon with Avenir styling
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger-icon';
    hamburger.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    // Replace content
    toggle.innerHTML = '';
    toggle.appendChild(hamburger);
    
    // Add screen reader text
    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = 'Menu de navigation';
    toggle.appendChild(srText);
    
    // Restore original classes and attributes
    toggle.className = originalClasses + ' enhanced-toggle';
    Object.keys(originalAttributes).forEach(attr => {
      if (attr !== 'class') {
        toggle.setAttribute(attr, originalAttributes[attr]);
      }
    });
    
    console.log('🍔 Hamburger icon added');
  }

  addOverlay() {
    if (document.querySelector('.mobile-overlay-enhanced')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay-enhanced';
    overlay.addEventListener('click', () => {
      const mobileNav = document.getElementById('mobileNav');
      const toggle = document.getElementById('openNav');
      
      if (mobileNav && !mobileNav.classList.contains('hidden')) {
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
      
      if (scrollY > 30) {
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
    
    console.log('📜 Scroll effects initialized');
  }

  injectEnhancementStyles() {
    if (document.querySelector('#arabesque-ultimate-nav-styles')) return;

    const style = document.createElement('style');
    style.id = 'arabesque-ultimate-nav-styles';
    style.textContent = `
      /* Arabesque Ultimate Navigation - With Real Logo & Avenir Font */
      
      /* Import Avenir Font */
      @import url('https://fonts.cdnfonts.com/css/avenir');
      
      /* Global Avenir Font Application */
      body {
        font-family: "Avenir Next", Avenir, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif !important;
      }
      
      /* Logo Image Styling */
      header .logo-image,
      header .logo-image-new,
      header img[src*="logo"] {
        height: 40px !important;
        width: auto !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        display: block !important;
      }
      
      /* Logo Link Container */
      header a[aria-label*="accueil"],
      header a:has(.logo-image),
      header a:has(img[src*="logo"]) {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        text-decoration: none !important;
        cursor: pointer !important;
      }
      
      /* Logo Hover Effects */
      header a[aria-label*="accueil"]:hover .logo-image,
      header a[aria-label*="accueil"]:hover img[src*="logo"],
      header a:hover .logo-image,
      header a:hover img[src*="logo"] {
        transform: translateY(-2px);
        filter: brightness(1.05) contrast(1.05);
      }
      
      /* Text Logo Avenir Styling */
      header .logo,
      header .serif {
        font-family: "Avenir Next", Avenir, "SF Pro Display", system-ui, sans-serif !important;
        font-weight: 600 !important;
        letter-spacing: -0.02em !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      header a:hover .logo,
      header a:hover .serif {
        opacity: 0.8;
        transform: translateY(-1px);
      }
      
      /* Focus styles */
      header a[aria-label*="accueil"]:focus-visible {
        outline: 2px solid #C9AB6D;
        outline-offset: 3px;
        border-radius: 6px;
      }
      
      /* Hamburger Icon with Avenir styling */
      .hamburger-icon {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 20px;
        height: 14px;
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
        transform: translateY(6px) rotate(45deg);
      }
      
      .enhanced-toggle.active .hamburger-icon span:nth-child(2) {
        opacity: 0;
        transform: scale(0.8);
      }
      
      .enhanced-toggle.active .hamburger-icon span:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
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
        animation: slideInMobile 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 60px rgba(0, 0, 0, 0.4);
      }
      
      @keyframes slideInMobile {
        from {
          opacity: 0;
          transform: translateY(-40px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      /* Mobile Navigation Content with Avenir */
      #mobileNav.mobile-nav-enhanced .max-w-6xl {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2.5rem;
        text-align: center;
        padding: 3rem 2rem;
        font-family: "Avenir Next", Avenir, system-ui, sans-serif;
      }
      
      #mobileNav.mobile-nav-enhanced a {
        font-family: "Avenir Next", Avenir, system-ui, sans-serif !important;
        font-size: 1.4rem !important;
        font-weight: 500 !important;
        padding: 1.25rem 2.5rem !important;
        border-radius: 1rem !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        min-width: 220px;
        display: flex !important;
        align-items: center;
        justify-content: center;
        border: 2px solid transparent !important;
        background: rgba(0, 0, 0, 0.02) !important;
      }
      
      #mobileNav.mobile-nav-enhanced a:hover {
        background: rgba(201, 171, 109, 0.12) !important;
        color: #C9AB6D !important;
        transform: translateY(-3px) scale(1.02) !important;
        border-color: rgba(201, 171, 109, 0.3) !important;
        box-shadow: 0 8px 25px rgba(201, 171, 109, 0.15) !important;
      }
      
      /* Mobile Overlay */
      .mobile-overlay-enhanced {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        backdrop-filter: blur(8px);
        opacity: 0;
        animation: fadeInOverlay 0.3s ease-out forwards;
      }
      
      @keyframes fadeInOverlay {
        to { opacity: 1; }
      }
      
      /* Prevent body scroll */
      body.mobile-nav-open {
        overflow: hidden !important;
        height: 100vh;
      }
      
      /* Enhanced header on scroll */
      header.scrolled {
        background: rgba(255, 255, 255, 0.97) !important;
        backdrop-filter: blur(20px) saturate(180%);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Desktop Navigation Avenir Font */
      nav a.nav-link {
        font-family: "Avenir Next", Avenir, system-ui, sans-serif !important;
        font-weight: 500 !important;
        letter-spacing: -0.01em !important;
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
      
      /* Desktop hover enhancements with Avenir */
      @media (min-width: 769px) {
        nav a.nav-link {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        nav a.nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #C9AB6D 0%, #D4B97A 100%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-50%);
          border-radius: 1px;
        }
        
        nav a.nav-link:hover::after,
        nav a.nav-link.active::after {
          width: 100%;
        }
        
        nav a.nav-link:hover {
          color: #C9AB6D;
          transform: translateY(-1px);
        }
      }
      
      /* Touch targets */
      @media (max-width: 768px) {
        .enhanced-toggle {
          min-width: 48px !important;
          min-height: 48px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        header a[aria-label*="accueil"] {
          min-width: 48px !important;
          min-height: 48px !important;
        }
      }
      
      /* High contrast support */
      @media (prefers-contrast: high) {
        .hamburger-icon span {
          background-color: black !important;
        }
        
        header img[src*="logo"] {
          filter: contrast(1.2) !important;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    
    document.head.appendChild(style);
    console.log('🎨 Ultimate navigation styles injected with Avenir font');
  }
}

// Initialize immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ArabesqueFinalNav());
} else {
  new ArabesqueFinalNav();
}

// Export for global access
if (typeof window !== 'undefined') {
  window.ArabesqueFinalNav = ArabesqueFinalNav;
}
