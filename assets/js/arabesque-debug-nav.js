// UNIVERSAL Arabesque Navigation - Works with ALL header structures
// ✅ Works with a-propos.html header structure (.logo.serif)
// ✅ Works with contact.html header structure (.font-display)
// ✅ Universal mobile navigation
// ✅ PNG logo addition for both structures

class ArabesqueFinalNav {
  constructor() {
    this.init();
  }

  init() {
    console.log('🚀 Arabesque Navigation - Universal Version');
    
    // 1. Add logo PNG to any header structure
    this.addLogoImageUniversal();
    
    // 2. Enhance logo for homepage navigation
    this.enhanceLogoHomepageUniversal();
    
    // 3. Fix mobile navigation universally
    this.fixMobileNavigationUniversal();
    
    // 4. Add scroll effects
    this.addScrollEffects();
    
    // 5. Add styling
    this.injectUniversalStyles();
    
    console.log('✅ Universal navigation enhanced successfully');
  }

  addLogoImageUniversal() {
    console.log('🖼️ Adding logo PNG universally...');
    
    // Find ANY logo link with multiple selectors
    const logoSelectors = [
      'header a[aria-label="Accueil"]',           // a-propos.html structure
      'header a[aria-label*="accueil"]',          // contact.html structure  
      'header a:first-of-type',                   // fallback - first link
      'header a'                                  // any header link
    ];
    
    let logoLink = null;
    
    for (const selector of logoSelectors) {
      logoLink = document.querySelector(selector);
      if (logoLink) {
        console.log(`✅ Logo link found with: ${selector}`);
        break;
      }
    }
    
    if (!logoLink) {
      console.log('⚠️ No logo link found');
      return;
    }
    
    // Check if logo image already exists
    if (logoLink.querySelector('.logo-image')) {
      console.log('ℹ️ Logo image already exists');
      return;
    }
    
    // Create PNG logo
    const logoImg = document.createElement('img');
    logoImg.src = 'assets/images/logo.png';
    logoImg.alt = 'Arabesque Traiteur';
    logoImg.className = 'logo-image';
    logoImg.style.cssText = `
      height: 32px;
      width: auto;
      transition: all 0.3s ease;
      margin-right: 0.5rem;
      display: inline-block;
      flex-shrink: 0;
    `;

    // Test if logo PNG exists
    logoImg.onload = () => {
      console.log('✅ Logo PNG loaded - adding to header');
      logoLink.insertBefore(logoImg, logoLink.firstChild);
      
      // Apply flex layout to logo link for proper alignment
      logoLink.style.display = 'flex';
      logoLink.style.alignItems = 'center';
      logoLink.style.gap = '0.5rem';
      
      // Apply Avenir font to text elements
      const textElements = logoLink.querySelectorAll('span');
      textElements.forEach(span => {
        span.style.fontFamily = '"Avenir Next", Avenir, system-ui, sans-serif';
        span.style.fontWeight = '600';
      });
    };

    logoImg.onerror = () => {
      console.log('⚠️ Logo PNG not found - keeping original structure');
      // Still apply Avenir font
      const textElements = logoLink.querySelectorAll('span');
      textElements.forEach(span => {
        span.style.fontFamily = '"Avenir Next", Avenir, system-ui, sans-serif';
        span.style.fontWeight = '600';
      });
    };
  }

  enhanceLogoHomepageUniversal() {
    console.log('🏠 Enhancing logo for homepage navigation...');
    
    // Find ANY logo link
    const logoSelectors = [
      'header a[aria-label="Accueil"]',
      'header a[aria-label*="accueil"]',
      'header a:first-of-type',
      'header a'
    ];
    
    let logoLink = null;
    
    for (const selector of logoSelectors) {
      logoLink = document.querySelector(selector);
      if (logoLink) break;
    }
    
    if (!logoLink) {
      console.log('⚠️ Logo link not found');
      return;
    }

    // Ensure it always goes to homepage
    logoLink.setAttribute('href', 'index.html');
    logoLink.style.textDecoration = 'none';
    logoLink.style.transition = 'all 0.3s ease';
    logoLink.style.cursor = 'pointer';

    // Add hover effects
    logoLink.addEventListener('mouseenter', () => {
      logoLink.style.transform = 'translateY(-2px)';
      logoLink.style.opacity = '0.85';
    });

    logoLink.addEventListener('mouseleave', () => {
      logoLink.style.transform = 'translateY(0)';
      logoLink.style.opacity = '1';
    });

    // Enhanced click handler
    logoLink.addEventListener('click', (e) => {
      console.log('🏠 Logo clicked');
      
      // Visual feedback
      logoLink.style.transform = 'scale(0.95)';
      setTimeout(() => logoLink.style.transform = 'scale(1)', 150);
      
      // If on homepage, scroll to top
      const currentPath = window.location.pathname;
      if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('📜 Scrolled to top');
      }
    });

    console.log('✅ Universal logo homepage navigation enabled');
  }

  fixMobileNavigationUniversal() {
    console.log('📱 Fixing mobile navigation universally...');
    
    // Find mobile nav elements with multiple selectors
    const mobileNavSelectors = ['#mobileNav', '.mobile-nav', '[data-mobile-nav]'];
    const toggleSelectors = ['#openNav', '.mobile-toggle', '[data-toggle]', 'button[aria-controls]'];
    
    let mobileNav = null;
    let toggle = null;
    
    // Find mobile nav
    for (const selector of mobileNavSelectors) {
      mobileNav = document.querySelector(selector);
      if (mobileNav) {
        console.log(`📱 Mobile nav found: ${selector}`);
        break;
      }
    }
    
    // Find toggle button
    for (const selector of toggleSelectors) {
      toggle = document.querySelector(selector);
      if (toggle) {
        console.log(`🔘 Toggle found: ${selector}`);
        break;
      }
    }
    
    if (!toggle || !mobileNav) {
      console.log('❌ Mobile nav elements not found');
      console.log('Toggle:', !!toggle, 'MobileNav:', !!mobileNav);
      return;
    }

    // 1. Replace button content with hamburger icon
    this.replaceWithHamburger(toggle);
    
    // 2. Set up universal mobile navigation
    this.setupUniversalMobileNav(toggle, mobileNav);
    
    console.log('✅ Universal mobile navigation setup complete');
  }

  replaceWithHamburger(toggle) {
    console.log('🍔 Replacing with hamburger...');
    
    // Store original classes
    const originalClasses = toggle.className;
    
    // Create hamburger icon
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger-icon';
    hamburger.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    // Clear content and add hamburger
    toggle.innerHTML = '';
    toggle.appendChild(hamburger);
    
    // Add screen reader text
    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = 'Menu de navigation';
    toggle.appendChild(srText);
    
    // Preserve original classes + add enhancement
    toggle.className = originalClasses + ' universal-hamburger';
    
    console.log('✅ Hamburger icon added universally');
  }

  setupUniversalMobileNav(toggle, mobileNav) {
    console.log('🔧 Setting up universal mobile navigation...');
    
    // Remove existing listeners
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    let isOpen = false;
    
    const toggleMobileNav = () => {
      console.log('🔘 Universal toggle clicked, state:', isOpen ? 'open' : 'closed');
      
      if (!isOpen) {
        // Opening
        console.log('📂 Opening universal mobile nav...');
        mobileNav.classList.remove('hidden');
        mobileNav.classList.add('universal-mobile-nav-open');
        newToggle.setAttribute('aria-expanded', 'true');
        newToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        isOpen = true;
      } else {
        // Closing
        console.log('📁 Closing universal mobile nav...');
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('universal-mobile-nav-open');
        newToggle.setAttribute('aria-expanded', 'false');
        newToggle.classList.remove('active');
        document.body.style.overflow = '';
        isOpen = false;
      }
    };

    // Add click event
    newToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('👆 Universal toggle clicked');
      toggleMobileNav();
    });

    // Close on mobile link clicks
    const mobileLinks = mobileNav.querySelectorAll('a');
    console.log(`🔗 Found ${mobileLinks.length} universal mobile links`);
    
    mobileLinks.forEach((link, index) => {
      link.addEventListener('click', () => {
        console.log(`📱 Universal mobile link ${index + 1} clicked`);
        setTimeout(() => {
          if (isOpen) {
            mobileNav.classList.add('hidden');
            mobileNav.classList.remove('universal-mobile-nav-open');
            newToggle.setAttribute('aria-expanded', 'false');
            newToggle.classList.remove('active');
            document.body.style.overflow = '';
            isOpen = false;
          }
        }, 100);
      });
    });

    // Keyboard and outside click support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleMobileNav();
      }
    });

    document.addEventListener('click', (e) => {
      if (isOpen && !mobileNav.contains(e.target) && !newToggle.contains(e.target)) {
        toggleMobileNav();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && isOpen) {
        toggleMobileNav();
      }
    });

    console.log('✅ Universal mobile navigation events added');
  }

  addScrollEffects() {
    console.log('📜 Adding scroll effects...');
    
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
    console.log('✅ Scroll effects added');
  }

  injectUniversalStyles() {
    console.log('🎨 Injecting universal styles...');
    
    if (document.querySelector('#arabesque-universal-nav-styles')) return;

    const style = document.createElement('style');
    style.id = 'arabesque-universal-nav-styles';
    style.textContent = `
      /* Universal Arabesque Navigation Styles */
      
      /* Global Avenir font */
      body {
        font-family: "Avenir Next", Avenir, "SF Pro Display", system-ui, sans-serif !important;
      }
      
      /* Universal logo image styling */
      header .logo-image {
        height: 32px !important;
        width: auto !important;
        flex-shrink: 0 !important;
        margin-right: 0.5rem !important;
      }
      
      /* Universal logo link styling */
      header a[aria-label*="ccueil"],
      header a:first-of-type {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        transition: all 0.3s ease !important;
        text-decoration: none !important;
      }
      
      /* Universal logo hover effects */
      header a[aria-label*="ccueil"]:hover,
      header a:first-of-type:hover {
        transform: translateY(-2px) !important;
        opacity: 0.85 !important;
      }
      
      /* Universal text styling with Avenir */
      header .logo,
      header .serif,
      header .font-display,
      header span {
        font-family: "Avenir Next", Avenir, system-ui, sans-serif !important;
        font-weight: 600 !important;
      }
      
      /* Universal hamburger icon */
      .hamburger-icon {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 18px;
        height: 12px;
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
      
      /* Universal hamburger animation */
      .universal-hamburger.active .hamburger-icon span:nth-child(1) {
        transform: translateY(5px) rotate(45deg);
      }
      
      .universal-hamburger.active .hamburger-icon span:nth-child(2) {
        opacity: 0;
        transform: scale(0.8);
      }
      
      .universal-hamburger.active .hamburger-icon span:nth-child(3) {
        transform: translateY(-5px) rotate(-45deg);
      }
      
      /* Universal mobile navigation */
      .universal-mobile-nav-open {
        animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Universal mobile nav links */
      .universal-mobile-nav-open a {
        transition: all 0.3s ease !important;
        border-radius: 0.375rem !important;
        font-family: "Avenir Next", Avenir, system-ui, sans-serif !important;
        font-weight: 500 !important;
      }
      
      .universal-mobile-nav-open a:hover {
        background: rgba(201, 171, 109, 0.1) !important;
        color: #C9AB6D !important;
        transform: translateX(4px) !important;
        padding-left: 1.25rem !important;
      }
      
      /* Universal scroll effect */
      header.scrolled {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(16px) saturate(180%) !important;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Universal desktop nav enhancements */
      @media (min-width: 769px) {
        nav a.nav-link {
          position: relative;
          transition: all 0.3s ease;
          font-family: "Avenir Next", Avenir, system-ui, sans-serif !important;
          font-weight: 500 !important;
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
          color: #C9AB6D !important;
          transform: translateY(-1px);
        }
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
      
      /* Universal touch targets */
      @media (max-width: 768px) {
        .universal-hamburger {
          min-width: 44px !important;
          min-height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
      }
      
      /* Universal focus styles */
      header a:focus-visible,
      .universal-hamburger:focus-visible {
        outline: 2px solid #C9AB6D !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }
      
      /* High contrast support */
      @media (prefers-contrast: high) {
        .hamburger-icon span {
          background-color: black !important;
        }
      }
      
      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Universal styles injected');
  }
}

// Initialize universally
console.log('🌟 Arabesque Universal Navigation Loading...');

const initializeUniversalNavigation = () => {
  try {
    new ArabesqueFinalNav();
    window.ArabesqueFinalNavInitialized = true;
  } catch (error) {
    console.error('❌ Universal navigation initialization error:', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUniversalNavigation);
} else {
  initializeUniversalNavigation();
}

// Backup initialization
setTimeout(() => {
  if (!window.ArabesqueFinalNavInitialized) {
    console.log('🔄 Universal backup initialization...');
    initializeUniversalNavigation();
  }
}, 500);

// Export
if (typeof window !== 'undefined') {
  window.ArabesqueFinalNav = ArabesqueFinalNav;
}
