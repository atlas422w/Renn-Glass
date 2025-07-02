// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  
  // ==============================================
  // Animation du header au scroll
  // ==============================================
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==============================================
  // Animation du texte hero
  // ==============================================
  const heroTitle = document.querySelector('.hero-title');
  
  // Animation du dégradé fluide
  const animateGradient = () => {
    heroTitle.style.animation = 'gradientFlow 3s linear infinite';
  };
  
  // Démarrer l'animation après un léger délai
  setTimeout(animateGradient, 500);


  

  // ==============================================
  // Animation des statistiques (compteurs)
  // ==============================================
  const statNumbers = document.querySelectorAll('[data-count]');
  
  const animateStats = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-count');
        const duration = 2000; // 2 secondes
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        
        const updateCount = () => {
          const current = +entry.target.textContent;
          if (current < target) {
            entry.target.textContent = Math.ceil(current + increment);
            requestAnimationFrame(updateCount);
          } else {
            entry.target.textContent = target;
          }
        };
        
        updateCount();
        observer.unobserve(entry.target);
      }
    });
  };
  
  const statsObserver = new IntersectionObserver(animateStats, {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  });
  
  statNumbers.forEach(stat => statsObserver.observe(stat));

  // ==============================================
  // Animation des cartes de valeurs
  // ==============================================
  const valueCards = document.querySelectorAll('.value-card');
  
  valueCards.forEach((card, index) => {
    // Délai décalé pour chaque carte
    card.style.transitionDelay = `${index * 0.1}s`;
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 15px 30px rgba(255, 30, 40, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
    });
  });

  // ==============================================
  // Système d'onglets pour les services
  // ==============================================
  const tabButtons = document.querySelectorAll('.tab-button');
  const serviceTabs = document.querySelectorAll('.service-tab');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Retirer la classe active de tous les boutons et onglets
      tabButtons.forEach(btn => btn.classList.remove('active'));
      serviceTabs.forEach(tab => tab.classList.remove('active'));
      
      // Ajouter la classe active au bouton cliqué
      button.classList.add('active');
      
      // Afficher l'onglet correspondant
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // ==============================================
  // Animation au scroll (Intersection Observer)
  // ==============================================
  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Animation spécifique pour les cartes de services
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
  
  // Éléments à animer au scroll
  const animatedElements = document.querySelectorAll(
    '.about-grid, .values-grid, .service-card, .map-container, .contact-container'
  );
  
  animatedElements.forEach((el, index) => {
    el.dataset.delay = index * 100; // Délai décalé
    scrollObserver.observe(el);
  });

  // ==============================================
  // Carte interactive (SVG)
  // ==============================================
  const initInteractiveMap = () => {
    const mapContainer = document.getElementById('interactive-map');
    if (!mapContainer) return;

    // Charger le SVG dynamiquement
    fetch('assets/france-map.svg')
      .then(response => response.text())
      .then(svg => {
        mapContainer.innerHTML = svg;
        setupMapInteractivity();
      });
  };
  
  const setupMapInteractivity = () => {
    const regions = document.querySelectorAll('#interactive-map path');
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    document.body.appendChild(tooltip);
    
    regions.forEach(region => {
      const regionName = region.getAttribute('data-region');
      const regionData = region.getAttribute('data-stats');
      
      region.addEventListener('mouseenter', (e) => {
        // Positionner le tooltip
        tooltip.style.left = `${e.pageX + 15}px`;
        tooltip.style.top = `${e.pageY + 15}px`;
        
        // Contenu du tooltip
        tooltip.innerHTML = `
          <h3>${regionName}</h3>
          <p>${regionData || 'Données non disponibles'}</p>
        `;
        
        tooltip.style.opacity = '1';
        
        // Highlight de la région
        region.style.fill = '#FF1E28';
      });
      
      region.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        region.style.fill = ''; // Revenir à la couleur d'origine
      });
      
      region.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.pageX + 15}px`;
        tooltip.style.top = `${e.pageY + 15}px`;
      });
    });
  };
  
  initInteractiveMap();

  // ==============================================
  // Formulaire de contact
  // ==============================================
  const contactForm = document.getElementById('devis-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Animation de soumission
      const submitButton = contactForm.querySelector('.submit-button');
      submitButton.innerHTML = '<span>Envoi en cours...</span>';
      submitButton.disabled = true;
      
      // Simuler un envoi (remplacer par un vrai fetch)
      setTimeout(() => {
        submitButton.innerHTML = '<span>Message envoyé !</span>';
        
        // Réinitialiser après 2 secondes
        setTimeout(() => {
          submitButton.innerHTML = '<span>Envoyer la demande</span>';
          submitButton.disabled = false;
          contactForm.reset();
        }, 2000);
      }, 1500);
    });
  }


// Fermer le menu quand on clique sur un lien
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});
  // ==============================================
  // Effet de parallaxe
  // ==============================================
  const parallaxElements = document.querySelectorAll('.parallax-layer');
  
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      
      parallaxElements.forEach((layer, index) => {
        const speed = 0.2 + (index * 0.1);
        const yPos = -(scrollPosition * speed);
        layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    });
  }

  // ==============================================
  // Initialisation des particules (optionnel)
  // ==============================================
  if (document.getElementById('particles-js')) {
    // Configuration des particules
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
    
    // Charger particles.js si disponible
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', particlesConfig);
    }
  }
});

// ==============================================
// GSAP Animations (pour les animations avancées)
// ==============================================
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
// Gestion du formulaire de candidature
document.getElementById('recruitmentForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const submitButton = this.querySelector('.submit-button');
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
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 3000);
  }, 1500);
});
// Dans votre script.js
document.addEventListener('DOMContentLoaded', () => {
  const valueCards = document.querySelectorAll('.value-card');
  
  valueCards.forEach((card, index) => {
    // Délai décalé pour chaque carte
    card.style.transitionDelay = `${index * 100}ms`;
    card.classList.add('animate-in');
  });
});
// Interactive Map
document.querySelectorAll('.region, .location-point').forEach(element => {
  element.addEventListener('mouseenter', (e) => {
    const tooltip = document.querySelector('.map-tooltip');
    let content = '';
    
    if (e.target.dataset.region) {
      content = `<strong>Bretagne</strong><br>Zone de couverture principale`;
    } else if (e.target.dataset.city) {
      content = `<strong>${e.target.dataset.city}</strong><br>${e.target.classList.contains('main-location') ? 'Siège principal' : 'Zone desservie'}`;
    }
    
    tooltip.innerHTML = content;
    tooltip.style.left = `${e.pageX + 15}px`;
    tooltip.style.top = `${e.pageY + 15}px`;
    tooltip.style.opacity = '1';
  });
  
  element.addEventListener('mouseleave', () => {
    document.querySelector('.map-tooltip').style.opacity = '0';
  });
  
  element.addEventListener('mousemove', (e) => {
    const tooltip = document.querySelector('.map-tooltip');
    tooltip.style.left = `${e.pageX + 15}px`;
    tooltip.style.top = `${e.pageY + 15}px`;
  });
});
// Gestion des fichiers
document.querySelectorAll('input[type="file"]').forEach(input => {
  const displayId = input.id + 'FileName';
  input.addEventListener('change', (e) => {
    const fileName = e.target.files[0]?.name || 'Aucun fichier sélectionné';
    document.getElementById(displayId).textContent = fileName;
  });
});

// Toggle des détails des offres
document.querySelectorAll('.offer-details-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const details = toggle.nextElementSibling;
    toggle.textContent = details.classList.contains('active') ? 'Voir les détails ↓' : 'Masquer les détails ↑';
    details.classList.toggle('active');
  });
});

// Gestion de l'affichage des noms de fichiers
document.getElementById('cv').addEventListener('change', function(e) {
  const fileName = e.target.files[0] ? e.target.files[0].name : 'Aucun fichier sélectionné';
  document.getElementById('cvFileName').textContent = fileName;
});

document.getElementById('motivation').addEventListener('change', function(e) {
  const fileName = e.target.files[0] ? e.target.files[0].name : 'Aucun fichier sélectionné';
  document.getElementById('motivationFileName').textContent = fileName;
});

// Gestion du formulaire
document.getElementById('recruitmentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const submitButton = this.querySelector('.submit-button');
  const originalText = submitButton.innerHTML;
  
  // Animation de soumission
  submitButton.innerHTML = '<span>Envoi en cours...</span>';
  submitButton.disabled = true;
  
  // Ici vous ajouteriez le vrai code d'envoi (fetch)
  setTimeout(() => {
    submitButton.innerHTML = '<span>Candidature envoyée !</span>';
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
      this.reset();
      document.getElementById('cvFileName').textContent = 'Aucun fichier sélectionné';
      document.getElementById('motivationFileName').textContent = 'Aucun fichier sélectionné';
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 3000);
  }, 1500);
});


// Gestion du drag and drop pour les fichiers
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

// Initialisation du formulaire moderne
document.addEventListener('DOMContentLoaded', () => {
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
});


// Dans votre script.js
document.addEventListener('DOMContentLoaded', () => {
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
});

