// PERFECT FIT - Arabesque Navigation for Your Exact HTML Structure
// ✅ Works with your existing mobile nav structure
// ✅ Enhances without breaking your beautiful theme
// ✅ Replaces text logo with PNG logo
// ✅ Keeps all your existing styling

class ArabesqueFinalNav {
  constructor() {
    this.init();
  }

  init() {
    console.log('🚀 Arabesque Navigation - Perfect Fit Version');
    
    // 1. Replace text logo with PNG
    this.replaceTextLogoWithImage();
    
    // 2. Enhance logo for homepage navigation
    this.enhanceLogoHomepage();
    
    // 3. Enhance your existing mobile menu (don't replace)
    this.enhanceYourExistingMobileMenu();
    
    // 4. Add scroll effects
    this.addScrollEffects();
    
    // 5. Add minimal styling enhancements
    this.injectCompatibleStyles();
    
    console.log('✅ Navigation enhanced successfully');
  }

  replaceTextLogoWithImage() {
    console.log('🖼️ Replacing text logo with PNG...');
    
    // Find your exact logo structure
    const logoLink = document.querySelector('header a[aria-label="Accueil"]');
    const logoSpan = logoLink ? logoLink.querySelector('.logo.serif') : null;
    
    if (!logoLink || !logoSpan) {
      console.log('⚠️ Logo elements not found, skipping replacement');
      return;
    }
    
    // Create PNG logo
    const logoImg = document.createElement('img');
    logoImg.src = 'assets/images/logo.png';
    logoImg.alt = 'Arabesque Traiteur';
    logoImg.className = 'logo-image';
    logoImg.style.cssText = `
      height: 40px;
      width: auto;
      transition: all 0.3s ease;
      margin-right: 0.5rem;
    `;

    // Test if logo PNG exists
    logoImg.onload = () => {
      console.log('✅ Logo PNG loaded - replacing text');
      logoSpan.style.display = 'none';
      logoLink.insertBefore(logoImg, logoSpan);
    };

    logoImg.onerror = () => {
      console.log('⚠️ Logo PNG not found - keeping text with Avenir font');
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

  enhanceYourExistingMobileMenu() {
    console.log('📱 Enhancing your existing mobile menu...');
    
    const toggle = document.getElementById('openNav');
    const mobileNav = document.getElementById('mobileNav');
    
    if (!toggle || !mobileNav) {
      console.log('⚠️ Mobile menu elements not found');
      return;
    }

    // 1. Replace "Menu" text with hamburger icon
    this.addHamburgerToYourButton(toggle);
    
    // 2. Enhance your existing toggle functionality
    this.enhanceYourToggle(toggle, mobileNav);
    
    console.log('✅ Mobile menu enhanced');
  }

  addHamburgerToYourButton(toggle) {
    console.log('🍔 Adding hamburger icon to your button...');
    
    // Store original classes (preserve your styling)
    const originalClasses = toggle.className;
    
    // Create hamburger icon
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger-icon';
    hamburger.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    // Replace content but keep your styles
    toggle.innerHTML = '';
    toggle.appendChild(hamburger);
    
    // Screen reader text
    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = 'Menu de navigation';
    toggle.appendChild(srText);
    
    // Keep your original classes + add enhancement
    toggle.className = originalClasses + ' enhanced-hamburger';
    
    console.log('✅ Hamburger icon added');
  }

  enhanceYourToggle(toggle, mobileNav) {
    console.log('🔧 Enhancing your toggle functionality...');
    
    // Enhanced toggle function that works with YOUR structure
    const enhancedToggle = () => {
      const isHidden = mobileNav.classList.contains('hidden');
      
      if (isHidden) {
        // Opening - use your existing classes + add enhancements
        mobileNav.classList.remove('hidden');
        mobileNav.classList.add('enhanced-mobile-nav');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
        console.log('📂 Mobile menu opened');
      } else {
        // Closing - restore your original state
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('enhanced-mobile-nav');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
        console.log('📁 Mobile menu closed');
      }
    };

    // Replace the existing click handler
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
        setTimeout(() => {
          mobileNav.classList.add('hidden');
          mobileNav.classList.remove('enhanced-mobile-nav');
          newToggle.setAttribute('aria-expanded', 'false');
          newToggle.classList.remove('active');
          document.body.style.overflow = '';
        }, 100);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
        enhancedToggle();
      }
    });

    console.log('✅ Toggle functionality enhanced');
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

  injectCompatibleStyles() {
    console.log('🎨 Injecting compatible styles...');
    
    if (document.querySelector('#arabesque-compatible-nav-styles')) return;

    const style = document.createElement('style');
    style.id = 'arabesque-compatible-nav-styles';
    style.textContent = `
      /* Arabesque Compatible Navigation Styles */
      /* ✅ Works perfectly with your existing theme */
      
      /* Avenir font for better typography */
      body {
        font-family: "Avenir Next", Avenir, "SF Pro Display", system-ui, sans-serif !important;
      }
      
      /* Logo image styling */
      header .logo-image {
        height: 40px !important;
        width: auto !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        margin-right: 0.5rem !important;
      }
      
      /* Logo hover effects */
      header a[aria-label="Accueil"]:hover {
        transform: translateY(-2px) !important;
        opacity: 0.85 !important;
      }
      
      /* Hamburger icon - fits your button perfectly */
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
      
      /* Hamburger animation */
      .enhanced-hamburger.active .hamburger-icon span:nth-child(1) {
        transform: translateY(5px) rotate(45deg);
      }
      
      .enhanced-hamburger.active .hamburger-icon span:nth-child(2) {
        opacity: 0;
        transform: scale(0.8);
      }
      
      .enhanced-hamburger.active .hamburger-icon span:nth-child(3) {
        transform: translateY(-5px) rotate(-45deg);
      }
      
      /* Enhanced mobile nav - keeps your structure */
      #mobileNav.enhanced-mobile-nav {
        /* Keep your existing styling but add smooth animation */
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
      
      /* Enhanced mobile nav links */
      #mobileNav.enhanced-mobile-nav a {
        transition: all 0.3s ease !important;
        border-radius: 0.375rem !important;
        font-family: "Avenir Next", Avenir, system-ui, sans-serif !important;
      }
      
      #mobileNav.enhanced-mobile-nav a:hover {
        background: rgba(201, 171, 109, 0.1) !important;
        color: #C9AB6D !important;
        transform: translateX(4px) !important;
        padding-left: 1.5rem !important;
      }
      
      /* Scroll effect for header */
      header.scrolled {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(16px) saturate(180%) !important;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Desktop nav enhancements */
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
        .enhanced-hamburger {
          min-width: 44px !important;
          min-height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
      }
      
      /* Focus styles */
      header a[aria-label="Accueil"]:focus-visible,
      .enhanced-hamburger:focus-visible {
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
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Compatible styles injected');
  }
}

// Initialize when ready
console.log('🌟 Arabesque Navigation - Perfect Fit Loading...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📚 DOM loaded, initializing navigation...');
    new ArabesqueFinalNav();
  });
} else {
  console.log('📚 DOM already ready, initializing navigation...');
  new ArabesqueFinalNav();
}

// Export for debugging
if (typeof window !== 'undefined') {
  window.ArabesqueFinalNav = ArabesqueFinalNav;
}
