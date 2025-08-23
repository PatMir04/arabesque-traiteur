// DEBUG VERSION - Arabesque Navigation
// ✅ Extensive logging to find the issue
// ✅ Multiple fallback approaches
// ✅ Error handling and diagnostics

class ArabesqueFinalNav {
  constructor() {
    console.log('🚀 ArabesqueFinalNav constructor started');
    this.debugInfo();
    this.init();
  }

  debugInfo() {
    console.log('📊 DEBUG INFORMATION:');
    console.log('- Document ready state:', document.readyState);
    console.log('- Current URL:', window.location.href);
    console.log('- User agent:', navigator.userAgent.substring(0, 50) + '...');
    
    // Check if elements exist
    const header = document.querySelector('header');
    const mobileNav = document.getElementById('mobileNav');
    const toggle = document.getElementById('openNav');
    const logoLink = document.querySelector('header a[aria-label="Accueil"]');
    
    console.log('🔍 ELEMENT DETECTION:');
    console.log('- Header found:', !!header);
    console.log('- Mobile nav found:', !!mobileNav);
    console.log('- Toggle button found:', !!toggle);
    console.log('- Logo link found:', !!logoLink);
    
    if (header) console.log('- Header HTML:', header.outerHTML.substring(0, 200) + '...');
    if (toggle) console.log('- Toggle HTML:', toggle.outerHTML);
  }

  init() {
    console.log('🔧 Starting navigation initialization...');
    
    try {
      // Step 1: Logo replacement
      console.log('📝 Step 1: Logo replacement');
      this.replaceTextLogoWithImage();
      
      // Step 2: Logo enhancement
      console.log('📝 Step 2: Logo enhancement');
      this.enhanceLogoHomepage();
      
      // Step 3: Mobile navigation
      console.log('📝 Step 3: Mobile navigation');
      this.enhanceExistingMobileNav();
      
      // Step 4: Scroll effects
      console.log('📝 Step 4: Scroll effects');
      this.addScrollEffects();
      
      // Step 5: Styles
      console.log('📝 Step 5: Styles injection');
      this.injectEnhancementStyles();
      
      console.log('✅ Navigation initialization completed successfully');
      
    } catch (error) {
      console.error('❌ Error during initialization:', error);
      console.error('Stack trace:', error.stack);
    }
  }

  replaceTextLogoWithImage() {
    console.log('🖼️ Starting logo replacement...');
    
    try {
      // Multiple ways to find the logo link
      const logoSelectors = [
        'header a[aria-label="Accueil"]',
        'header a:first-of-type',
        'header a',
        '.logo'
      ];
      
      let textLogoLink = null;
      
      for (const selector of logoSelectors) {
        textLogoLink = document.querySelector(selector);
        if (textLogoLink) {
          console.log(`✅ Logo link found with: ${selector}`);
          break;
        }
      }
      
      if (!textLogoLink) {
        console.log('⚠️ No logo link found, skipping logo replacement');
        return;
      }

      const textLogoSpan = textLogoLink.querySelector('.logo.serif') || 
                          textLogoLink.querySelector('.logo') ||
                          textLogoLink.querySelector('.serif');
      
      if (!textLogoSpan) {
        console.log('⚠️ No logo span found, skipping replacement');
        return;
      }
      
      console.log('🔄 Found logo span, creating image...');
      
      // Create the image element
      const logoImg = document.createElement('img');
      logoImg.src = 'assets/images/logo.png';
      logoImg.alt = 'Arabesque Traiteur';
      logoImg.className = 'logo-image';
      logoImg.style.cssText = `
        height: 40px;
        width: auto;
        transition: all 0.3s ease;
        display: inline-block;
      `;

      // Test if logo exists
      logoImg.onload = () => {
        console.log('✅ Logo PNG loaded successfully');
        textLogoSpan.style.display = 'none';
        textLogoLink.insertBefore(logoImg, textLogoSpan);
      };

      logoImg.onerror = () => {
        console.log('⚠️ Logo PNG not found, keeping text logo');
        textLogoSpan.style.fontFamily = 'Avenir, system-ui, sans-serif';
        textLogoSpan.style.fontWeight = '600';
      };
      
    } catch (error) {
      console.error('❌ Error in logo replacement:', error);
    }
  }

  enhanceLogoHomepage() {
    console.log('🏠 Starting logo homepage enhancement...');
    
    try {
      const logoSelectors = [
        'header .logo-image',
        'header a .logo',
        'header a[aria-label*="Accueil"]',
        'header a:first-of-type'
      ];

      let logoElement = null;
      
      for (const selector of logoSelectors) {
        logoElement = document.querySelector(selector);
        if (logoElement) {
          console.log(`✅ Logo element found with: ${selector}`);
          break;
        }
      }

      if (!logoElement) {
        console.log('⚠️ No logo element found for homepage enhancement');
        return;
      }

      this.setupLogoHomepageLink(logoElement);
      
    } catch (error) {
      console.error('❌ Error in logo homepage enhancement:', error);
    }
  }

  setupLogoHomepageLink(logoElement) {
    console.log('🔗 Setting up logo homepage link...');
    
    try {
      let logoLink = logoElement;
      
      // Find the parent link if element isn't a link
      if (logoElement.tagName !== 'A') {
        logoLink = logoElement.closest('a') || logoElement.parentElement;
        console.log('📍 Using parent element as link:', logoLink.tagName);
      }

      if (!logoLink || logoLink.tagName !== 'A') {
        console.log('⚠️ Could not find or create logo link');
        return;
      }

      // Configure the link
      logoLink.setAttribute('href', 'index.html');
      logoLink.setAttribute('aria-label', 'Arabesque Traiteur - Retour à l\'accueil');
      logoLink.style.textDecoration = 'none';
      logoLink.style.cursor = 'pointer';
      
      // Add click handler
      logoLink.addEventListener('click', (e) => {
        console.log('🏠 Logo clicked!');
        
        const currentPath = window.location.pathname;
        if (currentPath.endsWith('index.html') || currentPath === '/') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          console.log('📜 Scrolled to top');
        } else {
          console.log('🔄 Navigating to homepage');
        }
      });
      
      console.log('✅ Logo homepage link setup completed');
      
    } catch (error) {
      console.error('❌ Error in logo link setup:', error);
    }
  }

  enhanceExistingMobileNav() {
    console.log('📱 Starting mobile navigation enhancement...');
    
    try {
      const mobileNav = document.getElementById('mobileNav');
      const toggle = document.getElementById('openNav');
      
      console.log('🔍 Mobile nav elements:');
      console.log('- mobileNav element:', !!mobileNav);
      console.log('- toggle element:', !!toggle);
      
      if (!mobileNav) {
        console.log('❌ Mobile nav element not found');
        return;
      }
      
      if (!toggle) {
        console.log('❌ Toggle button not found');
        return;
      }

      console.log('🍔 Adding hamburger icon...');
      this.addHamburgerIcon(toggle);
      
      console.log('🔧 Setting up enhanced toggle functionality...');
      
      // Enhanced toggle function
      const enhancedToggle = () => {
        console.log('🔘 Toggle clicked');
        const isHidden = mobileNav.classList.contains('hidden');
        console.log('📊 Current state - hidden:', isHidden);
        
        if (isHidden) {
          console.log('📂 Opening mobile menu...');
          mobileNav.classList.remove('hidden');
          mobileNav.classList.add('mobile-nav-enhanced');
          document.body.classList.add('mobile-nav-open');
          toggle.setAttribute('aria-expanded', 'true');
          toggle.classList.add('active');
          this.addOverlay();
        } else {
          console.log('📁 Closing mobile menu...');
          mobileNav.classList.add('hidden');
          mobileNav.classList.remove('mobile-nav-enhanced');
          document.body.classList.remove('mobile-nav-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('active');
          this.removeOverlay();
        }
      };

      // Remove existing listeners and add new one
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      
      newToggle.addEventListener('click', (e) => {
        console.log('👆 Toggle button clicked');
        e.preventDefault();
        enhancedToggle();
      });

      // Close on mobile link click
      const mobileLinks = mobileNav.querySelectorAll('a');
      console.log(`🔗 Found ${mobileLinks.length} mobile links`);
      
      mobileLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
          console.log(`📱 Mobile link ${index} clicked`);
          setTimeout(() => {
            mobileNav.classList.add('hidden');
            mobileNav.classList.remove('mobile-nav-enhanced');
            document.body.classList.remove('mobile-nav-open');
            newToggle.setAttribute('aria-expanded', 'false');
            newToggle.classList.remove('active');
            this.removeOverlay();
          }, 100);
        });
      });

      // Keyboard support
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
          console.log('⌨️ Escape key pressed - closing menu');
          enhancedToggle();
        }
      });

      console.log('✅ Mobile navigation enhancement completed');
      
    } catch (error) {
      console.error('❌ Error in mobile navigation enhancement:', error);
    }
  }

  addHamburgerIcon(toggle) {
    console.log('🍔 Adding hamburger icon to toggle...');
    
    try {
      // Store original attributes
      const originalClasses = toggle.className;
      console.log('📋 Original toggle classes:', originalClasses);
      
      // Create hamburger
      const hamburger = document.createElement('div');
      hamburger.className = 'hamburger-icon';
      hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;
      
      // Clear and add new content
      toggle.innerHTML = '';
      toggle.appendChild(hamburger);
      
      // Screen reader text
      const srText = document.createElement('span');
      srText.className = 'sr-only';
      srText.textContent = 'Menu';
      toggle.appendChild(srText);
      
      // Restore and enhance classes
      toggle.className = originalClasses + ' enhanced-toggle';
      
      console.log('✅ Hamburger icon added successfully');
      
    } catch (error) {
      console.error('❌ Error adding hamburger icon:', error);
    }
  }

  addOverlay() {
    console.log('🔒 Adding mobile overlay...');
    
    if (document.querySelector('.mobile-overlay-enhanced')) {
      console.log('ℹ️ Overlay already exists');
      return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay-enhanced';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    overlay.addEventListener('click', () => {
      console.log('🔘 Overlay clicked - closing menu');
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
    
    // Trigger opacity change
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);
    
    console.log('✅ Overlay added');
  }

  removeOverlay() {
    console.log('🔓 Removing mobile overlay...');
    const overlay = document.querySelector('.mobile-overlay-enhanced');
    if (overlay) {
      overlay.remove();
      console.log('✅ Overlay removed');
    }
  }

  addScrollEffects() {
    console.log('📜 Adding scroll effects...');
    
    try {
      const header = document.querySelector('header');
      if (!header) {
        console.log('⚠️ Header not found for scroll effects');
        return;
      }
      
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
      console.log('✅ Scroll effects added');
      
    } catch (error) {
      console.error('❌ Error adding scroll effects:', error);
    }
  }

  injectEnhancementStyles() {
    console.log('🎨 Injecting enhancement styles...');
    
    try {
      if (document.querySelector('#arabesque-debug-nav-styles')) {
        console.log('ℹ️ Styles already injected');
        return;
      }

      const style = document.createElement('style');
      style.id = 'arabesque-debug-nav-styles';
      style.textContent = `
        /* DEBUG Navigation Styles */
        
        /* Logo styling */
        header .logo-image {
          height: 40px !important;
          width: auto !important;
          transition: all 0.3s ease !important;
        }
        
        /* Hamburger icon */
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
          transition: all 0.3s ease;
          transform-origin: center;
        }
        
        /* Hamburger animation */
        .enhanced-toggle.active .hamburger-icon span:nth-child(1) {
          transform: translateY(5px) rotate(45deg);
        }
        
        .enhanced-toggle.active .hamburger-icon span:nth-child(2) {
          opacity: 0;
        }
        
        .enhanced-toggle.active .hamburger-icon span:nth-child(3) {
          transform: translateY(-5px) rotate(-45deg);
        }
        
        /* Enhanced mobile nav */
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
        }
        
        #mobileNav.mobile-nav-enhanced .max-w-6xl {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
        }
        
        #mobileNav.mobile-nav-enhanced a {
          font-size: 1.25rem !important;
          padding: 1rem 2rem !important;
          border-radius: 0.5rem !important;
          transition: all 0.3s ease !important;
          min-width: 200px;
          text-align: center;
          display: block !important;
        }
        
        #mobileNav.mobile-nav-enhanced a:hover {
          background: rgba(201, 171, 109, 0.1) !important;
          color: #C9AB6D !important;
          transform: translateY(-2px) !important;
        }
        
        /* Mobile overlay */
        .mobile-overlay-enhanced {
          backdrop-filter: blur(4px);
        }
        
        /* Body scroll lock */
        body.mobile-nav-open {
          overflow: hidden !important;
        }
        
        /* Header scroll effect */
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
        
        /* Desktop enhancements */
        @media (min-width: 769px) {
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
      console.log('✅ Styles injected successfully');
      
    } catch (error) {
      console.error('❌ Error injecting styles:', error);
    }
  }
}

// Initialize with extensive debugging
console.log('🌟 Starting Arabesque Navigation Debug Version');
console.log('📅 Timestamp:', new Date().toISOString());

// Multiple initialization approaches
if (document.readyState === 'loading') {
  console.log('📚 Document still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded fired, initializing...');
    new ArabesqueFinalNav();
  });
} else {
  console.log('📚 Document already loaded, initializing immediately...');
  new ArabesqueFinalNav();
}

// Backup initialization after 1 second
setTimeout(() => {
  if (!window.ArabesqueFinalNavInitialized) {
    console.log('🔄 Backup initialization triggered');
    try {
      new ArabesqueFinalNav();
      window.ArabesqueFinalNavInitialized = true;
    } catch (error) {
      console.error('❌ Backup initialization failed:', error);
    }
  }
}, 1000);

// Export for debugging
if (typeof window !== 'undefined') {
  window.ArabesqueFinalNav = ArabesqueFinalNav;
  console.log('🌐 ArabesqueFinalNav exported to window object');
}