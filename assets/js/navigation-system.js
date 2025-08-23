// Enhanced Navigation JavaScript - Arabesque Traiteur
// Handles responsive navigation with accessibility features

class ArabesqueNavigation {
  constructor() {
    this.header = document.querySelector('.main-header');
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileNav = document.querySelector('.mobile-nav');
    this.mobileOverlay = document.querySelector('.mobile-nav-overlay');
    this.mobileClose = document.querySelector('.mobile-nav-close');
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    this.isOpen = false;
    this.lastScrollY = 0;
    
    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupActiveLinks();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    
    console.log('✅ Navigation system initialized');
  }

  // Scroll effect for header
  setupScrollEffect() {
    let ticking = false;
    
    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
      
      this.lastScrollY = currentScrollY;
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

  // Mobile menu functionality
  setupMobileMenu() {
    // Toggle button click
    this.mobileToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });

    // Close button click
    this.mobileClose?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeMobileMenu();
    });

    // Overlay click
    this.mobileOverlay?.addEventListener('click', () => {
      this.closeMobileMenu();
    });

    // Close on mobile link click
    this.mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isOpen = true;
    
    // Update classes
    this.mobileToggle.classList.add('active');
    this.mobileNav.classList.add('active');
    this.mobileOverlay.classList.add('active');
    
    // Prevent body scroll
    document.body.classList.add('no-scroll');
    
    // Update ARIA attributes
    this.mobileToggle.setAttribute('aria-expanded', 'true');
    this.mobileToggle.setAttribute('aria-label', 'Fermer le menu');
    this.mobileNav.setAttribute('aria-hidden', 'false');
    
    // Focus management
    setTimeout(() => {
      const firstLink = this.mobileNav.querySelector('.mobile-nav-link');
      firstLink?.focus();
    }, 100);
    
    // Trap focus within mobile menu
    this.trapFocus(this.mobileNav);
  }

  closeMobileMenu() {
    this.isOpen = false;
    
    // Update classes
    this.mobileToggle.classList.remove('active');
    this.mobileNav.classList.remove('active');
    this.mobileOverlay.classList.remove('active');
    
    // Restore body scroll
    document.body.classList.remove('no-scroll');
    
    // Update ARIA attributes
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    this.mobileToggle.setAttribute('aria-label', 'Ouvrir le menu');
    this.mobileNav.setAttribute('aria-hidden', 'true');
    
    // Return focus to toggle button
    this.mobileToggle.focus();
    
    // Remove focus trap
    this.removeFocusTrap();
  }

  // Set active navigation links based on current page
  setupActiveLinks() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Desktop navigation
    const desktopLinks = document.querySelectorAll('.nav-link');
    // Mobile navigation
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

  // Keyboard navigation support
  setupKeyboardNavigation() {
    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMobileMenu();
      }
    });

    // Arrow key navigation for desktop menu
    const desktopNavLinks = document.querySelectorAll('.nav-link');
    desktopNavLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % desktopNavLinks.length;
          desktopNavLinks[nextIndex].focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = (index - 1 + desktopNavLinks.length) % desktopNavLinks.length;
          desktopNavLinks[prevIndex].focus();
        }
      });
    });
  }

  // Focus management for accessibility
  setupFocusManagement() {
    // Skip to main content link (for screen readers)
    this.createSkipLink();
    
    // Ensure focus is visible when navigating with keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }

  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Aller au contenu principal';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
      position: fixed;
      top: -40px;
      left: 6px;
      background: var(--gold);
      color: black;
      padding: 8px;
      z-index: 9999;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
      skipLink.classList.remove('sr-only');
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
      skipLink.classList.add('sr-only');
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Focus trapping for mobile menu accessibility
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', trapHandler);
    this.focusTrapHandler = trapHandler;
  }

  removeFocusTrap() {
    if (this.focusTrapHandler && this.mobileNav) {
      this.mobileNav.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

  // Utility method to update navigation state
  updateNavigationState(pageName) {
    this.setupActiveLinks();
  }

  // Method to programmatically close mobile menu (useful for other scripts)
  closeMobileMenuProgrammatically() {
    if (this.isOpen) {
      this.closeMobileMenu();
    }
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.arabesqueNav = new ArabesqueNavigation();
});

// Additional CSS for keyboard navigation (inject into head)
const keyboardNavigationCSS = `
<style>
.using-keyboard *:focus {
  outline: 2px solid var(--gold) !important;
  outline-offset: 2px !important;
}

/* Ensure hamburger menu is properly sized for touch */
.mobile-menu-toggle {
  min-width: 44px;
  min-height: 44px;
}

/* Improve mobile nav link touch targets */
.mobile-nav-link {
  min-height: 44px;
  display: flex;
  align-items: center;
}

/* Loading state for navigation */
.main-header.loading {
  pointer-events: none;
}

.main-header.loading * {
  opacity: 0.7;
}
</style>
`;

// Inject the CSS into the head
if (document.head) {
  document.head.insertAdjacentHTML('beforeend', keyboardNavigationCSS);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArabesqueNavigation;
}
