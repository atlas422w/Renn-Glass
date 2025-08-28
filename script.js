// scripts.js - RENN'GLASS Website
// ==============================================
// Initialisation principale
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimations();
  initStatistics();
  initServiceCards();
  initLocationMap();
  initFileHandling();
  initCarousel();
  initFacebookWidget();
  initContactMethods();
});

// ==============================================
// Navigation Mobile & Header
// ==============================================
function initNavigation() {
  const navbar = document.querySelector('.glass-nav');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinksWrapper = document.querySelector('.nav-links-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');

  // Initialisation de l'état mobile
  function initMobileMenu() {
    if (window.innerWidth <= 768) {
      navLinksWrapper.style.right = '-100%';
    } else {
      navLinksWrapper.style.right = '';
    }
  }

  // Gestion du menu mobile
  function toggleMobileMenu() {
    const isOpening = navLinksWrapper.style.right !== '0px';

    mobileMenuBtn.classList.toggle('active');
    
    if (isOpening) {
      navLinksWrapper.style.right = '0';
      document.body.style.overflow = 'hidden';
      navbar.classList.add('menu-open');
    } else {
      navLinksWrapper.style.right = '-100%';
      document.body.style.overflow = '';
      navbar.classList.remove('menu-open');
    }
  }

  // Animation du header au scroll
  function handleScroll() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Événements
  initMobileMenu();
  
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMobileMenu();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinksWrapper.style.right === '0px' && 
        !e.target.closest('.nav-links-wrapper') && 
        !e.target.closest('.mobile-menu-btn')) {
      toggleMobileMenu();
    }
  });

  window.addEventListener('resize', () => {
    initMobileMenu();
    if (window.innerWidth > 768) {
      navLinksWrapper.style.right = '';
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
      navbar.classList.remove('menu-open');
    }
  });

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

// ==============================================
// Animations des statistiques
// ==============================================
function initStatistics() {
  // Animation des chiffres statistiques (section à propos)
  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        animateValue(entry.target, 0, target, 2000);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => {
    stat.textContent = '0';
    statsObserver.observe(stat);
  });

  // Animation des compteurs de localisation
  const animationConfig = {
    duration: 700,
    delay: 0,
    easing: t => t * (2 - t)
  };

  const animateCounter = (element, target) => {
    let start = 0;
    const increment = target / (animationConfig.duration / 16);
    const updateCounter = () => {
      start += increment;
      if (start < target) {
        element.textContent = Math.ceil(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    updateCounter();
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const target = parseInt(entry.target.dataset.target);
          animateCounter(entry.target, target);
        }, index * animationConfig.delay);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-item .stat-number').forEach(counter => {
    counter.textContent = '0';
    counterObserver.observe(counter);
  });
}

// ==============================================
// Cartes de services
// ==============================================
function initServiceCards() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card').forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);

    // Accessibilité
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    
    card.addEventListener('focus', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = 'var(--shadow-hover)';
    });
    
    card.addEventListener('blur', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow-card)';
    });
  });
}

// ==============================================
// Carte interactive (SVG)
// ==============================================
function initLocationMap() {
  // Fonctions utilitaires pour les couleurs
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h, s, l];
  }

  function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function parseRgbString(rgbString) {
    const m = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])] : [0, 0, 0];
  }

  // Configuration des tooltips pour la carte
  const svgObject = document.getElementById('svgMap');
  const tooltip = document.getElementById('tooltip');

  if (!svgObject) return;

  svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument || svgObject.getSVGDocument();
    if (!svgDoc) {
      console.error("Erreur : Impossible de charger le SVG");
      return;
    }

    const paths = svgDoc.querySelectorAll('path');
    
    paths.forEach(path => {
      const originalFill = window.getComputedStyle(path).fill;
      path.setAttribute('data-original-fill', originalFill);

      const rgb = parseRgbString(originalFill);
      const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      const lighterRgb = hslToRgb(h, s, Math.min(l + 0.09, 1));
      const hoverColor = `rgb(${lighterRgb[0]}, ${lighterRgb[1]}, ${lighterRgb[2]})`;

      path.addEventListener('mouseenter', (e) => {
        path.style.fill = hoverColor;
        showTooltip(path, e);
      });

      path.addEventListener('mousemove', (e) => {
        positionTooltip(e);
      });

      path.addEventListener('mouseleave', () => {
        path.style.fill = originalFill;
        hideTooltip();
      });
    });

    function showTooltip(path, event) {
      const regionName = path.getAttribute('title') || 'Région française';
      const info = path.getAttribute('data-info');
      
      let html = `
        <div class="tooltip-header">
          <h3 style="font-size: 2.4em;">${regionName}</h3>
          <div style="height:1px; background:rgba(255,255,255,0.15); margin:6px 0 8px 0; width:100%;"></div>
        </div>`;
      
      if (info) {
        const infoItems = info.split(';').filter(item => item.trim() !== '');
        html += '<div class="tooltip-content">';
        
        infoItems.forEach((item, index) => {
          const [icon, text] = item.split(/\s+(.+)/);
          html += `
            <div class="tooltip-item" style="animation-delay: ${0.1 + index * 0.1}s">
              <span class="tooltip-icon">${icon || 'ℹ️'}</span>
              <span>${text || item}</span>
            </div>`;
        });
        
        html += '</div>';
      } else {
        html += `
          <div class="tooltip-empty">
            <div class="tooltip-item">
              <span class="tooltip-icon">🚫</span>
              <span>Non présent sur ce site</span>
            </div>
          </div>`;
      }

      if (tooltip) {
        tooltip.innerHTML = html;
        tooltip.classList.add('visible');
        positionTooltip(event);
      }
    }

    function positionTooltip(event) {
      if (!tooltip) return;
      const x = event.pageX + 15;
      const y = event.pageY + 15;
      const maxX = window.innerWidth - tooltip.offsetWidth - 20;
      
      tooltip.style.left = `${Math.min(x, maxX)}px`;
      tooltip.style.top = `${y}px`;
    }

    function hideTooltip() {
      if (tooltip) {
        tooltip.classList.remove('visible');
      }
    }

    // Ajustement responsive du SVG
    const innerSvg = svgDoc.querySelector('svg');
    if (innerSvg) {
      innerSvg.setAttribute('width', '100%');
      innerSvg.setAttribute('height', '100%');
      innerSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      
      if (!innerSvg.hasAttribute('viewBox')) {
        const bbox = innerSvg.getBBox();
        innerSvg.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
      }
    }
  });
}

// ==============================================
// Animations générales
// ==============================================
function initAnimations() {
  // Animation des cartes de valeurs
  const valueCards = document.querySelectorAll('.value-card');
  
  valueCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 100}ms`;
    card.classList.add('animate-in');
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 15px 30px rgba(255, 30, 40, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
    });
  });

  // Animation au scroll
  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        if (entry.target.classList.contains('service-card')) {
          const delay = entry.target.dataset.delay || '0';
          entry.target.style.animationDelay = `${delay}ms`;
        }
        
        observer.unobserve(entry.target);
      }
    });
  };
  
  const scrollObserver = new IntersectionObserver(animateOnScroll, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  const animatedElements = document.querySelectorAll(
    '.about-grid, .values-grid, .service-card, .map-container, .contact-container'
  );
  
  animatedElements.forEach((el, index) => {
    el.dataset.delay = index * 100;
    scrollObserver.observe(el);
  });
}

// ==============================================
// Gestion des fichiers (formulaire de recrutement)
// ==============================================
function initFileHandling() {
  function setupFileDropZones() {
    const dropZones = document.querySelectorAll('.file-drop-zone');
    
    dropZones.forEach(zone => {
      const input = zone.querySelector('input[type="file"]');
      const fileNameDisplay = zone.querySelector('.file-info');
      
      // Gestion du changement de fichier
      input.addEventListener('change', (e) => {
        if (input.files.length > 0) {
          fileNameDisplay.textContent = input.files[0].name;
          zone.classList.add('has-file');
        } else {
          fileNameDisplay.textContent = 'Aucun fichier sélectionné';
          zone.classList.remove('has-file');
        }
      });
      
      // Gestion du drag over
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      
      // Gestion du drag leave
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });
      
      // Gestion du drop
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
          input.files = e.dataTransfer.files;
          const event = new Event('change');
          input.dispatchEvent(event);
        }
      });
      
      // Gestion du bouton parcourir
      const browseBtn = zone.querySelector('.browse-btn');
      if (browseBtn) {
        browseBtn.addEventListener('click', () => {
          input.click();
        });
      }
    });
  }

  setupFileDropZones();
  
  // Gestion de la soumission du formulaire
  const modernForm = document.getElementById('modernRecruitmentForm');
  if (modernForm) {
    modernForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitButton = this.querySelector('.modern-submit-btn');
      const originalText = submitButton.innerHTML;
      
      // Animation de soumission
      submitButton.innerHTML = '<span>Envoi en cours...</span>';
      submitButton.disabled = true;
      
      // Simulation d'envoi (remplacer par un vrai fetch)
      setTimeout(() => {
        submitButton.innerHTML = '<span>Candidature envoyée !</span>';
        
        // Réinitialiser après 3 secondes
        setTimeout(() => {
          this.reset();
          document.querySelectorAll('.file-info').forEach(el => {
            el.textContent = 'Aucun fichier sélectionné';
          });
          document.querySelectorAll('.file-drop-zone').forEach(el => {
            el.classList.remove('has-file');
          });
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
}

// ==============================================
// Carousel des marques
// ==============================================
function initCarousel() {
  const carouselTrack = document.getElementById('carouselTrack');
  if (!carouselTrack) return;
  
  // Liste des marques
  const brands = ['Volvo', 'Mercedes', 'Scania', 'Renault', 'Caterpillar', 'John Deere', 'Liebherr', 'Peugeot'];
  
  // Fonction pour générer les logos
  function generateLogos() {
    carouselTrack.innerHTML = '';
    const duplicatedBrands = [...brands, ...brands];
    
    duplicatedBrands.forEach(brand => {
      const logoItem = document.createElement('div');
      logoItem.className = 'logo-item';
      
      const logoPlaceholder = document.createElement('div');
      logoPlaceholder.className = 'logo-placeholder';
      logoPlaceholder.textContent = brand;
      
      logoItem.appendChild(logoPlaceholder);
      carouselTrack.appendChild(logoItem);
    });
  }
  
  generateLogos();
  
  // Gestion de la pause au survol
  const carouselContainer = document.querySelector('.carousel-container');
  
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
      carouselTrack.classList.add('paused');
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
      carouselTrack.classList.remove('paused');
    });
  }
}

// ==============================================
// Widget Facebook et méthodes de contact
// ==============================================
function initFacebookWidget() {
  // Ajustement du widget Facebook en responsive
  const adjustFacebookWidget = () => {
    const fbContainer = document.querySelector('.fb-feed-container');
    if (!fbContainer) return;
    
    const containerWidth = fbContainer.offsetWidth;
    const fbPage = fbContainer.querySelector('.fb-page');
    
    if (fbPage) {
      fbPage.setAttribute('data-width', containerWidth);
      
      // Recharger le widget si FB est chargé
      if (typeof FB !== 'undefined') {
        FB.XFBML.parse();
      }
    }
  };
  
  // Ajuster au chargement et au redimensionnement
  window.addEventListener('load', adjustFacebookWidget);
  window.addEventListener('resize', adjustFacebookWidget);
}

function initContactMethods() {
  // Optimisation des interactions tactiles
  document.querySelectorAll('.contact-method').forEach(method => {
    method.addEventListener('touchstart', () => {
      method.classList.add('touch-active');
    });
    
    method.addEventListener('touchend', () => {
      setTimeout(() => {
        method.classList.remove('touch-active');
      }, 200);
    });
  });
}

// ==============================================
// Fonctions utilitaires (pour compatibilité future)
// ==============================================

// Fonction debounce pour optimiser les performances
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Animation des hero au chargement (si nécessaire)
function initHeroAnimations() {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const animateGradient = () => {
      heroTitle.style.animation = 'gradientFlow 3s linear infinite';
    };
    setTimeout(animateGradient, 500);
  }
}

// Effet de parallaxe (si nécessaire)
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-layer');
  
  if (parallaxElements.length > 0) {
    const handleParallax = debounce(() => {
      const scrollPosition = window.pageYOffset;
      
      parallaxElements.forEach((layer, index) => {
        const speed = 0.2 + (index * 0.1);
        const yPos = -(scrollPosition * speed);
        layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }, 10);

    window.addEventListener('scroll', handleParallax);
  }
}

// ==============================================
// Gestion globale des formulaires de contact
// ==============================================
function initContactForms() {
  const contactForm = document.getElementById('devis-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('.submit-button');
      if (submitButton) {
        submitButton.innerHTML = '<span>Envoi en cours...</span>';
        submitButton.disabled = true;
        
        // Simuler un envoi (remplacer par un vrai fetch)
        setTimeout(() => {
          submitButton.innerHTML = '<span>Message envoyé !</span>';
          
          setTimeout(() => {
            submitButton.innerHTML = '<span>Envoyer la demande</span>';
            submitButton.disabled = false;
            contactForm.reset();
          }, 2000);
        }, 1500);
      }
    });
  }
}

// ==============================================
// Initialisation des fonctionnalités optionnelles
// ==============================================

// Initialiser particles.js si disponible
function initParticles() {
  if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {
    const particlesConfig = {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#FF1E28" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#FF1E28", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        }
      }
    };
    
    particlesJS('particles-js', particlesConfig);
  }
}

// Initialiser GSAP si disponible
function initGSAP() {
  if (typeof gsap !== 'undefined') {
    // Animation du logo au chargement
    gsap.from('.logo', {
      duration: 1.2,
      opacity: 0,
      y: -20,
      ease: 'power3.out'
    });
    
    // Animation des liens de navigation
    gsap.from('.nav-link', {
      duration: 0.8,
      opacity: 0,
      y: -10,
      stagger: 0.1,
      delay: 0.5,
      ease: 'power2.out'
    });
    
    // Animation du contenu hero
    gsap.from('.hero-text > *', {
      duration: 1,
      opacity: 0,
      y: 30,
      stagger: 0.2,
      delay: 0.8,
      ease: 'back.out'
    });
    
    // Animation de l'image hero
    gsap.from('.hero-image', {
      duration: 1.5,
      opacity: 0,
      x: 100,
      delay: 1,
      ease: 'power3.out'
    });
    
    // Animation des sections au scroll
    const sections = gsap.utils.toArray('section');
    
    sections.forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out'
      });
    });
  }
}

// ==============================================
// Initialisation finale et nettoyage
// ==============================================

// Fonction principale appelée après le DOMContentLoaded
function initOptionalFeatures() {
  initHeroAnimations();
  initParallax();
  initContactForms();
  initParticles();
  initGSAP();
}

// Appel des fonctionnalités optionnelles après un délai
setTimeout(initOptionalFeatures, 100);

// Nettoyage au déchargement de la page
window.addEventListener('beforeunload', () => {
  // Nettoyer les event listeners si nécessaire
  window.removeEventListener('scroll', null);
  window.removeEventListener('resize', null);
});


// ==============================================
// ANIMATIONS DISCRÈTES - À ajouter à script.js
// ==============================================

// Fonction à appeler après le DOMContentLoaded existant
function initSubtleAnimations() {
  
  // 1. Animation de typing pour le sous-titre hero
  function initTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
      // Option 1: Effet typing (commentez si vous préférez le fade)
      subtitle.style.width = '0';
      subtitle.style.overflow = 'hidden';
      subtitle.style.whiteSpace = 'nowrap';
      
      // Option 2: Effet fade plus subtil (décommentez si préféré)
      // subtitle.classList.add('fade-reveal');
    }
  }

  // 2. Création de particules flottantes discrètes
  function createFloatingParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = `floating-particles particle-${(i % 3) + 1}`;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      heroSection.appendChild(particle);
    }
  }

  // 3. Observer pour les animations au scroll
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Animation de smooth reveal
          if (element.classList.contains('smooth-reveal')) {
            element.classList.add('revealed');
          }
          
          // Animations slide-in
          if (element.classList.contains('slide-in-left') || element.classList.contains('slide-in-right')) {
            element.classList.add('visible');
          }
          
          // Rotation douce
          if (element.classList.contains('gentle-rotate')) {
            element.classList.add('in-view');
          }
          
          scrollObserver.unobserve(element);
        }
      });
    }, observerOptions);

    // Appliquer les classes d'animation aux éléments
    document.querySelectorAll('.about-content h3').forEach((el, index) => {
      el.classList.add('smooth-reveal');
      scrollObserver.observe(el);
    });

    document.querySelectorAll('.value-card').forEach((el, index) => {
      el.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
      scrollObserver.observe(el);
    });

    document.querySelectorAll('.service-card').forEach((el, index) => {
      if (index % 3 === 1) { // Carte du milieu seulement
        el.classList.add('gentle-rotate');
        scrollObserver.observe(el);
      }
    });
  }



  // 5. Effet glow sur des éléments spécifiques
  function addGlowEffects() {
    // Ajouter l'effet glow aux boutons CTA
    document.querySelectorAll('.primary-button').forEach(btn => {
      btn.classList.add('glow-effect');
    });
    
    // Effet glow sur les stats importantes
    document.querySelectorAll('.stat-number2').forEach(stat => {
      stat.parentElement.classList.add('glow-effect');
    });
  }

  // 6. Animation de révélation progressive du texte
  function initTextReveal() {
    const textElements = document.querySelectorAll('.about-text, .hero-description');
    
    textElements.forEach(element => {
      const text = element.textContent;
      element.innerHTML = '';
      
      // Diviser le texte en mots
      const words = text.split(' ');
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0';
        span.style.transform = 'translateY(10px)';
        span.style.transition = `all 0.3s ease ${index * 0.05}s`;
        element.appendChild(span);
      });
    });

    // Observer pour déclencher l'animation
    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const spans = entry.target.querySelectorAll('span');
          spans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    textElements.forEach(el => textObserver.observe(el));
  }

  // 7. Micro-interactions avancées sur les boutons
  function enhanceButtonInteractions() {
    document.querySelectorAll('.primary-button, .secondary-button, .cta-button').forEach(button => {
      // Effet de ripple au clic
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
      
      // Ajouter les styles du ripple
      if (!document.querySelector('#ripple-styles')) {
        const styles = document.createElement('style');
        styles.id = 'ripple-styles';
        styles.textContent = `
          @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
          }
        `;
        document.head.appendChild(styles);
      }
    });
  }

  // 8. Animation de compteur améliorée avec easing
  function enhanceCounterAnimation() {
    function easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    }
    
    function animateCounterWithEasing(element, start, end, duration) {
      let startTime = null;
      
      function updateCounter(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.floor(easedProgress * (end - start) + start);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }
      
      requestAnimationFrame(updateCounter);
    }
    
    // Remplacer l'animation existante des stats
    const enhancedStatsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = +entry.target.getAttribute('data-target');
          if (target) {
            animateCounterWithEasing(entry.target, 0, target, 2500);
            enhancedStatsObserver.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.5 });
    
    // Observer uniquement les nouveaux éléments
    document.querySelectorAll('.stat-number[data-target]').forEach(stat => {
      enhancedStatsObserver.observe(stat);
    });
  }


  // 10. Animation de pulsation pour les éléments interactifs
  function addInteractivePulse() {
    const interactiveElements = document.querySelectorAll('.contact-method, .service-card, .value-card');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.animation = 'none'; // Reset
        element.offsetHeight; // Force reflow
        element.style.animation = 'subtlePulse 0.3s ease-out';
      });
    });
    
    // Ajouter les styles de pulse
    if (!document.querySelector('#pulse-styles')) {
      const styles = document.createElement('style');
      styles.id = 'pulse-styles';
      styles.textContent = `
        @keyframes subtlePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(styles);
    }
  }

  // 11. Initialisation avec détection des préférences utilisateur
  function initWithAccessibility() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Désactiver les animations pour les utilisateurs qui préfèrent moins de mouvement
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      return;
    }
    
    // Initialiser toutes les animations
    initTypingAnimation();
    createFloatingParticles();
    initScrollAnimations();
    addProgressBars();
    addGlowEffects();
    initTextReveal();
    enhanceButtonInteractions();
    enhanceCounterAnimation();
    initSubtleParallax();
    addInteractivePulse();
  }

  // Démarrer les animations après un court délai
  setTimeout(initWithAccessibility, 500);
}

// Appeler la fonction après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Vos scripts existants ici...
  
  // Puis ajouter les nouvelles animations
  initSubtleAnimations();
});

// 12. Gestion responsive des animations
window.addEventListener('resize', debounce(() => {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Désactiver certaines animations sur mobile pour les performances
    document.querySelectorAll('.floating-particles').forEach(particle => {
      particle.style.display = 'none';
    });
  } else {
    document.querySelectorAll('.floating-particles').forEach(particle => {
      particle.style.display = 'block';
    });
  }
}, 250));

// Fonction debounce si elle n'existe pas déjà
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
// ==============================================
// FIX JAVASCRIPT HERO SUBTITLE MOBILE
// ==============================================

// Fonction à ajouter dans initAnimations() ou initHeroAnimations()
function initHeroSubtitleAnimation() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;
  
  // Détecter si on est sur mobile
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Si l'utilisateur préfère moins d'animations, désactiver complètement
  if (prefersReducedMotion) {
    subtitle.style.animation = 'none';
    subtitle.style.width = 'auto';
    subtitle.style.border = 'none';
    subtitle.style.overflow = 'visible';
    subtitle.style.whiteSpace = 'normal';
    subtitle.style.opacity = '1';
    return;
  }
  
  // Animation différente selon la taille d'écran
  if (isMobile) {
    // Mobile : Animation fade simple
    subtitle.style.animation = 'none';
    subtitle.style.width = 'auto';
    subtitle.style.border = 'none';
    subtitle.style.overflow = 'visible';
    subtitle.style.whiteSpace = 'normal';
    subtitle.style.opacity = '0';
    subtitle.style.transform = 'translateY(30px)';
    subtitle.style.textAlign = 'center';
    
    // Déclencher l'animation fade après un délai
    setTimeout(() => {
      subtitle.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
    }, 800);
    
  } else if (isTablet) {
    // Tablette : Animation typing rapide
    subtitle.style.animation = 'typing 2s steps(30) 0.5s forwards, blink 0.75s step-end infinite, hideCursor 0s 3s forwards';
    
  } else {
    // Desktop : Animation typing complète
    subtitle.style.animation = 'typing 3s steps(40) 1s forwards, blink 0.75s step-end infinite, hideCursor 0s 4s forwards';
  }
}

// Alternative : Animation word-by-word pour mobile
function initWordByWordAnimation() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle || window.innerWidth > 768) return;
  
  const text = subtitle.textContent;
  const words = text.split(' ');
  
  // Vider le contenu et reconstruire avec des spans
  subtitle.innerHTML = '';
  
  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.className = 'word';
    span.style.opacity = '0';
    span.style.display = 'inline-block';
    span.style.marginRight = '0.3em';
    span.style.animation = `wordReveal 0.6s ease-out ${0.2 + index * 0.2}s forwards`;
    subtitle.appendChild(span);
  });
}

// Fonction pour gérer le redimensionnement
function handleSubtitleResize() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;
  
  const isMobile = window.innerWidth <= 768;
  const currentlyMobile = subtitle.classList.contains('mobile-subtitle');
  
  // Si on change de mobile à desktop ou vice versa
  if (isMobile && !currentlyMobile) {
    subtitle.classList.add('mobile-subtitle');
    initHeroSubtitleAnimation();
  } else if (!isMobile && currentlyMobile) {
    subtitle.classList.remove('mobile-subtitle');
    initHeroSubtitleAnimation();
  }
}

// Version optimisée avec Intersection Observer
function initHeroSubtitleWithObserver() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;
  
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Observer pour déclencher l'animation quand visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Réinitialiser les styles
          subtitle.style.animation = 'none';
          subtitle.style.width = 'auto';
          subtitle.style.border = 'none';
          subtitle.style.overflow = 'visible';
          subtitle.style.whiteSpace = 'normal';
          subtitle.style.opacity = '0';
          subtitle.style.transform = 'translateY(30px)';
          subtitle.style.textAlign = 'center';
          
          // Animation fade avec délai
          setTimeout(() => {
            subtitle.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
          }, 200);
          
          observer.unobserve(subtitle);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '50px'
    });
    
    observer.observe(subtitle);
  }
}

// INTÉGRATION DANS LE SCRIPT PRINCIPAL
// Modifier la fonction existante initHeroAnimations()
function initHeroAnimations() {
  // Animation du titre existante...
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const animateGradient = () => {
      heroTitle.style.animation = 'gradientFlow 3s linear infinite';
    };
    setTimeout(animateGradient, 500);
  }
  
  // AJOUTER ICI : Animation du sous-titre
  initHeroSubtitleAnimation();
}

// Ajouter dans les event listeners
window.addEventListener('resize', debounce(handleSubtitleResize, 250));

// SOLUTION COMPLÈTE : Modifier l'initialisation existante
document.addEventListener('DOMContentLoaded', () => {
  // Vos initialisations existantes...
  initNavigation();
  initAnimations();
  initStatistics();
  initServiceCards();
  initLocationMap();
  initFileHandling();
  initCarousel();
  initFacebookWidget();
  initContactMethods();
  
  // AJOUTER : Fix du sous-titre hero
  setTimeout(() => {
    initHeroSubtitleAnimation();
    // OU initHeroSubtitleWithObserver(); pour version avec observer
  }, 100);
});

// ALTERNATIVE : Classe CSS toggle via JavaScript
function toggleSubtitleAnimation() {
  const subtitle = document.querySelector('.hero-subtitle');
  const isMobile = window.innerWidth <= 768;
  
  if (subtitle) {
    if (isMobile) {
      subtitle.classList.add('no-typing-animation');
    } else {
      subtitle.classList.remove('no-typing-animation');
    }
  }
}

// ==============================================
// Effet de parallaxe (si nécessaire)
// ==============================================
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-layer');
  
  if (parallaxElements.length > 0) {
    const handleParallax = debounce(() => {
      const scrollPosition = window.pageYOffset;
      
      parallaxElements.forEach((layer, index) => {
        const speed = 0.2 + (index * 0.1);
        const yPos = -(scrollPosition * speed);
        layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }, 10);

    window.addEventListener('scroll', handleParallax);
  }
  
  // AJOUTER CETTE LIGNE POUR iOS
  // Détection Safari (non-Chrome) et application du correctif
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('safari') != -1) {
    if (userAgent.indexOf('chrome') > -1) {
      // C'est Chrome, ne rien faire
    } else if ((userAgent.indexOf('opera') > -1) || (userAgent.indexOf('opr') > -1)) {
      // C'est Opera, ne rien faire
    } else {
      // C'est Safari (iOS/macOS) - appliquer le correctif de parallaxe
      document.head.innerHTML += '<style> .parallax{ background-attachment: initial !important; background-size: cover !important; } </style>';
    }
  }
}
// Appeler au chargement et au redimensionnement
window.addEventListener('load', toggleSubtitleAnimation);
window.addEventListener('resize', debounce(toggleSubtitleAnimation, 250));

