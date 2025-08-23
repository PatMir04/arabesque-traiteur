// FINAL PERFECT - Arabesque Navigation
// ✅ Logo PNG + Text together (not replacing)
// ✅ Mobile navigation working properly
// ✅ No conflicts with your existing code

class ArabesqueFinalNav {
  constructor() {
    this.init();
  }

  init() {
    console.log('🚀 Arabesque Navigation - Final Perfect Version');
    
    // 1. Add logo PNG alongside text (don't replace)
    this.addLogoImageAlongsideText();
    
    // 2. Enhance logo for homepage navigation
    this.enhanceLogoHomepage();
    
    // 3. Fix mobile navigation properly
    this.fixMobileNavigation();
    
    // 4. Add scroll effects
    this.addScrollEffects();
    
    // 5. Add styling
    this.injectStyles();
    
    console.log('✅ Navigation enhanced successfully');
  }

  addLogoImageAlongsideText() {
    console.log('🖼️ Adding logo PNG alongside text...');
    
    // Find your logo link
    const logoLink = document.querySelector('header a[aria-label="Accueil"]');
    const logoSpan = logoLink ? logoLink.querySelector('.logo.serif') : null;
    
    if (!logoLink || !logoSpan) {
      console.log('⚠️ Logo elements not found');
      return;
    }
    
    // Check if logo image already exists
    if (logoLink.querySelector('.logo-image')) {
      console.log('ℹ️ Logo image already exists');
      return;
    }
    
    // Create PNG logo to go BEFORE the text
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
    `;

    // Test if logo PNG exists
    logoImg.onload = () => {
      console.log('✅ Logo PNG loaded - adding alongside text');
      // Insert BEFORE the text span (not replace)
      logoLink.insertBefore(logoImg, logoSpan);
      
      // Style the text to work nicely with logo
      logoSpan.style.fontFamily = '"Avenir Next", Avenir, system-ui, sans-serif';
      logoSpan.style.fontWeight = '600';
    };

    logoImg.onerror = () => {
      console.log('⚠️ Logo PNG not found - keeping text only');
      logoSpan.style.fontFamily = '"Avenir Next", Avenir, system-ui, sans-serif';
      logoSpan.style.fontWeight = '600';
    };
  }

  enhanceLogoHomepage() {
    console.log('🏠 Enhancing logo for homepage navigation...');
    
    const logoLink = document.querySelector('header a[aria-label="Accueil"]');
    
    if (!logoLink) {
      console.log('⚠️ Logo link not found');
      return;
    }

    // Ensure it always goes to homepage
    logoLink.setAttribute('href', 'index.html');
    logoLink.style.textDecoration = 'none';
    logoLink.style.transition = 'all 0.3s ease';

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

    console.log('✅ Logo homepage navigation enabled');
  }

  fixMobileNavigation() {
    console.log('📱 Fixing mobile navigation...');
    
    const toggle = document.getElementById('openNav');
    const mobileNav = document.getElementById('mobileNav');
    
    if (!toggle || !mobileNav) {
      console.log('❌ Mobile nav elements not found');
      return;
    }

    console.log('📱 Elements found - setting up mobile nav');
    
    // 1. Replace "Menu" text with hamburger icon
    this.replaceMenuWithHamburger(toggle);
    
    // 2. Set up proper mobile navigation
    this.setupMobileNavigation(toggle, mobileNav);
    
    console.log('✅ Mobile navigation setup complete');
  }

  replaceMenuWithHamburger(toggle) {
    console.log('🍔 Replacing Menu text with hamburger...');
    
    // Store original classes to preserve your styling
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
    
    // Preserve your original classes
    toggle.className = originalClasses + ' has-hamburger';
    
    console.log('✅ Hamburger icon added');
  }

  setupMobileNavigation(toggle, mobileNav) {
    console.log('🔧 Setting up mobile navigation functionality...');
    
    // Remove any existing event listeners by cloning
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // Mobile navigation toggle function
    let isOpen = false;
    
    const toggleMobileNav = () => {
      console.log('🔘 Mobile nav toggle clicked, current state:', isOpen ? 'open' : 'closed');
      
      if (!isOpen) {
        // Opening
        console.log('📂 Opening mobile navigation...');
        mobileNav.classList.remove('hidden');
        mobileNav.classList.add('mobile-nav-open');
        newToggle.setAttribute('aria-expanded', 'true');
        newToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        isOpen = true;
      } else {
        // Closing
        console.log('📁 Closing mobile navigation...');
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('mobile-nav-open');
        newToggle.setAttribute('aria-expanded', 'false');
        newToggle.classList.remove('active');
        document.body.style.overflow = '';
        isOpen = false;
      }
    };

    // Add click event listener
    newToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('👆 Toggle button clicked');
      toggleMobileNav();
    });

    // Close when mobile links are clicked
    const mobileLinks = mobileNav.querySelectorAll('a');
    console.log(`🔗 Found ${mobileLinks.length} mobile navigation links`);
    
    mobileLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        console.log(`📱 Mobile link ${index + 1} clicked:`, link.textContent);
        // Small delay to allow navigation to start
        setTimeout(() => {
          if (isOpen) {
            console.log('📁 Closing mobile nav after link click');
            mobileNav.classList.add('hidden');
            mobileNav.classList.remove('mobile-nav-open');
            newToggle.setAttribute('aria-expanded', 'false');
            newToggle.classList.remove('active');
            document.body.style.overflow = '';
            isOpen = false;
          }
        }, 100);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        console.log('⌨️ Escape pressed - closing mobile nav');
        toggleMobileNav();
      }
    });

    // Close when clicking outside (on body)
    document.addEventListener('click', (e) => {
      if (isOpen && !mobileNav.contains(e.target) && !newToggle.contains(e.target)) {
        console.log('🖱️ Clicked outside - closing mobile nav');
        toggleMobileNav();
      }
    });

    // Close on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && isOpen) {
        console.log('📺 Resized to desktop - closing mobile nav');
        toggleMobileNav();
      }
    });

    console.log('✅ Mobile navigation event listeners added');
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

  injectStyles() {
    console.log('🎨 Injecting styles...');
    
    if (document.querySelector('#arabesque-final-perfect-styles')) return;

    const style = document.createElement('style');
    style.id = 'arabesque-final-perfect-styles';
    style.textContent = `
      /* Arabesque Final Perfect Navigation Styles */
      
      /* Global Avenir font */
      body {
        font-family: "Avenir Next", Avenir, "SF Pro Display", system-ui, sans-serif !important;
      }
      
      /* Logo image + text together */
      header a[aria-label="Accueil"] {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        transition: all 0.3s ease !important;
        text-decoration: none !important;
      }
      
      header .logo-image {
        height: 32px !important;
        width: auto !important;
        flex-shrink: 0 !important;
      }
      
      header .logo.serif {
        font-family: "Avenir Next", Avenir, system-ui, sans-serif !important;
        font-weight: 600 !important;
        flex-shrink: 0 !important;
      }
      
      /* Logo hover effects */
      header a[aria-label="Accueil"]:hover {
        transform: translateY(-2px) !important;
        opacity: 0.85 !important;
      }
      
      /* Hamburger icon */
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
      
      /* Hamburger animation */
      .has-hamburger.active .hamburger-icon span:nth-child(1) {
        transform: translateY(5px) rotate(45deg);
      }
      
      .has-hamburger.active .hamburger-icon span:nth-child(2) {
        opacity: 0;
        transform: scale(0.8);
      }
      
      .has-hamburger.active .hamburger-icon span:nth-child(3) {
        transform: translateY(-5px) rotate(-45deg);
      }
      
      /* Mobile navigation enhancements */
      #mobileNav.mobile-nav-open {
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
      
      /* Mobile navigation links */
      #mobileNav.mobile-nav-open a {
        transition: all 0.3s ease !important;
        border-radius: 0.375rem !important;
        font-family: "Avenir Next", Avenir, system-ui, sans-serif !important;
        font-weight: 500 !important;
      }
      
      #mobileNav.mobile-nav-open a:hover {
        background: rgba(201, 171, 109, 0.1) !important;
        color: #C9AB6D !important;
        transform: translateX(4px) !important;
        padding-left: 1.25rem !important;
      }
      
      /* Scroll effect */
      header.scrolled {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(16px) saturate(180%) !important;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Desktop navigation enhancements */
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
      
      /* Touch targets */
      @media (max-width: 768px) {
        .has-hamburger {
          min-width: 44px !important;
          min-height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        #mobileNav a {
          min-height: 44px !important;
          display: flex !important;
          align-items: center !important;
        }
      }
      
      /* Focus styles */
      header a[aria-label="Accueil"]:focus-visible,
      .has-hamburger:focus-visible {
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
    console.log('✅ Styles injected');
  }
}

// Initialize immediately
console.log('🌟 Arabesque Final Perfect Navigation Loading...');

const initializeNavigation = () => {
  try {
    new ArabesqueFinalNav();
    window.ArabesqueFinalNavInitialized = true;
  } catch (error) {
    console.error('❌ Navigation initialization error:', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
  initializeNavigation();
}

// Backup initialization
setTimeout(() => {
  if (!window.ArabesqueFinalNavInitialized) {
    console.log('🔄 Backup initialization...');
    initializeNavigation();
  }
}, 500);

// Export
if (typeof window !== 'undefined') {
  window.ArabesqueFinalNav = ArabesqueFinalNav;
}
