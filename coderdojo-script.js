// ===== STUDENT SHOWCASE CAROUSEL =====
  
  let currentSlide = 0;
  const slides = document.querySelectorAll('.project-slide');
  const indicators = document.querySelectorAll('.indicator');
  const totalSlides = slides.length;
  let autoSlideInterval;

  // Initialize carousel
  function initCarousel() {
    if (slides.length === 0) {
      console.warn('No carousel slides found');
      return;
    }

    // Set up initial state
    updateSlidePosition();
    
    // Auto-slide every 6 seconds
    startAutoSlide();
    
    // Pause auto-slide on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoSlide);
      carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
  }

  // Update slide positions and indicators
  function updateSlidePosition() {
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev');
      
      if (index === currentSlide) {
        slide.classList.add('active');
      } else if (index < currentSlide) {
        slide.classList.add('prev');
      }
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
  }

  // Navigate to specific slide
  function goToSlide(slideIndex) {
    if (slideIndex < 0) {
      currentSlide = totalSlides - 1;
    } else if (slideIndex >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = slideIndex;
    }
    
    updateSlidePosition();
  }

  // Next slide
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  // Previous slide
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Auto-slide functionality
  function startAutoSlide() {
    stopAutoSlide(); // Clear any existing interval
    autoSlideInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  // Event listeners for navigation
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoSlide();
      setTimeout(startAutoSlide, 3000); // Restart auto-slide after 3 seconds
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoSlide();
      setTimeout(startAutoSlide, 3000);
    });
  }

  // Indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      goToSlide(index);
      stopAutoSlide();
      setTimeout(startAutoSlide, 3000);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    // Only handle keyboard if carousel is in view
    const rect = carouselContainer.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView) {
      if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoSlide();
        setTimeout(startAutoSlide, 3000);
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoSlide();
        setTimeout(startAutoSlide, 3000);
      }
    }
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go to next slide
        nextSlide();
      } else {
        // Swiped right - go to previous slide
        prevSlide();
      }
      stopAutoSlide();
      setTimeout(startAutoSlide, 3000);
    }
  }

  // Initialize carousel when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  // ===== ANIMATED STATS COUNTER =====
  function animateStats() {
    const statNumbers = document.querySelectorAll('.showcase-stats .stat-number');
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.target);
      let current = 0;
      const increment = target / 100;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          stat.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target;
        }
      };
      
      updateCounter();
    });
  }

  // Trigger stats animation when showcase section comes into view
  const showcaseSection = document.querySelector('.student-showcase');
  if (showcaseSection) {
    const showcaseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          showcaseObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    });

    showcaseObserver.observe(showcaseSection);
  }

  console.log('Student Showcase Carousel initialized! 🎨');

  // ===== LIVE STATISTICS COUNTER =====
  
  let statsAnimated = false;

  function animateStatCounter(element, target, suffix = '', duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const statCard = element.closest('.stat-card');
    
    // Add visual feedback
    element.classList.add('counting');
    statCard.classList.add('highlight');
    
    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + suffix;
        element.classList.remove('counting');
        statCard.classList.add('animated');
        
        // Add completion effect
        setTimeout(() => {
          statCard.classList.remove('highlight');
        }, 500);
      }
    }
    
    // Add a small delay for staggered animation
    const cardIndex = Array.from(document.querySelectorAll('.stat-card')).indexOf(statCard);
    setTimeout(updateCounter, cardIndex * 200);
  }

  function initializeStatsCounter() {
    const statsSection = document.querySelector('.statistics-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          
          // Animate all stat numbers
          const statNumbers = document.querySelectorAll('.statistics-section .stat-number');
          statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const suffix = stat.dataset.suffix || '';
            animateStatCounter(stat, target, suffix);
          });
          
          // Trigger highlight animations
          setTimeout(() => {
            const highlights = document.querySelectorAll('.highlight-item');
            highlights.forEach((highlight, index) => {
              setTimeout(() => {
                highlight.style.opacity = '0';
                highlight.style.transform = 'translateX(-20px)';
                highlight.style.transition = 'all 0.6s ease';
                
                requestAnimationFrame(() => {
                  highlight.style.opacity = '1';
                  highlight.style.transform = 'translateX(0)';
                });
              }, index * 300);
            });
          }, 1000);
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(statsSection);
  }

  // Initialize stats counter
  initializeStatsCounter();

  // ===== DYNAMIC LIVE STATUS =====
  
  function updateLiveStatus() {
    const statusElement = document.getElementById('currentActivity');
    if (!statusElement) return;

    const activities = [
      "47 students actively coding this week",
      "12 new projects started today",
      "3 students just completed their first game",
      "New web development class starting Monday",
      "5 micro:bit projects in progress"
    ];

    let currentIndex = 0;

    function rotateStatus() {
      statusElement.style.opacity = '0';
      
      setTimeout(() => {
        statusElement.textContent = activities[currentIndex];
        statusElement.style.opacity = '1';
        currentIndex = (currentIndex + 1) % activities.length;
      }, 300);
    }

    // Update every 4 seconds
    setInterval(rotateStatus, 4000);
  }

  // Initialize live status updates
  updateLiveStatus();

  // ===== ENHANCED STAT CARD INTERACTIONS =====
  
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Add extra visual feedback on hover
      const pulseRing = card.querySelector('.pulse-ring');
      if (pulseRing) {
        pulseRing.style.animation = 'pulse 1s ease-in-out infinite';
      }
    });

    card.addEventListener('mouseleave', () => {
      // Remove pulse animation when not hovering
      const pulseRing = card.querySelector('.pulse-ring');
      if (pulseRing) {
        pulseRing.style.animation = '';
      }
    });
  });

  // ===== REFRESH STATS PERIODICALLY =====
  
  function refreshStats() {
    // Simulate live data updates (in real implementation, this would fetch from API)
    const statNumbers = document.querySelectorAll('.statistics-section .stat-number');
    
    statNumbers.forEach(stat => {
      const currentValue = parseInt(stat.textContent);
      const baseTarget = parseInt(stat.dataset.target);
      
      // Add small random variations to simulate live updates
      const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const newTarget = Math.max(baseTarget + variation, 0);
      
      if (newTarget !== currentValue) {
        const suffix = stat.dataset.suffix || '';
        
        // Quick animation to new value
        let current = currentValue;
        const increment = newTarget > current ? 1 : -1;
        
        const quickUpdate = () => {
          if (Math.abs(current - newTarget) > 0) {
            current += increment;
            stat.textContent = current + suffix;
            setTimeout(quickUpdate, 50);
          }
        };
        
        // Only update if significantly different
        if (Math.abs(newTarget - currentValue) > 1) {
          quickUpdate();
        }
      }
    });
  }

  // Refresh stats every 30 seconds
  setInterval(refreshStats, 30000);

  console.log('Live Statistics Counter initialized! 📊');document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  const bars = document.querySelectorAll('.bar');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Update aria-expanded
      const isExpanded = navLinks.classList.contains('active');
      this.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Prevent menu from closing when clicking inside
    navLinks.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Navbar Scroll Effect
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });

  // Dark Mode Toggle
  const darkToggle = document.createElement('button');
  darkToggle.innerHTML = '🌓';
  darkToggle.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    background: var(--dark-color);
    color: var(--light-color);
    border: 2px solid var(--secondary-color);
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
  `;
  darkToggle.setAttribute('aria-label', 'Toggle dark mode');
  document.body.appendChild(darkToggle);

  darkToggle.addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', 
      document.body.classList.contains('light-mode') ? 'light' : 'dark'
    );
  });

  // Load saved theme
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }

  // ===== ENHANCED PROGRAM CARDS WITH SCROLL FIX =====
  
  // Initialize program cards with enhanced interactions
  const programCards = document.querySelectorAll('.program-card');
  
  programCards.forEach(card => {
    // Handle hover for smooth scroll
    card.addEventListener('mouseenter', function() {
      // Add a small delay to allow users to read front content first
      setTimeout(() => {
        smoothScrollToCard(this);
      }, 300);
    });
    
    // Handle click for mobile devices
    card.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle flipped state for mobile
      if (window.innerWidth <= 768) {
        this.classList.toggle('flipped');
        // Scroll immediately on mobile tap
        smoothScrollToCard(this);
      }
    });
    
    // Add hover analytics (optional)
    card.addEventListener('mouseenter', function() {
      const programType = this.dataset.program;
      console.log(`Program card hovered: ${programType}`);
    });
    
    // Animate progress bars when card is flipped
    card.addEventListener('transitionend', function() {
      const progressFill = this.querySelector('.progress-fill');
      if (progressFill) {
        // Re-trigger animation
        progressFill.style.width = '0%';
        setTimeout(() => {
          const targetWidth = progressFill.style.width || '50%';
          progressFill.style.width = targetWidth;
        }, 100);
      }
    });
  });

  // Smooth scroll function to ensure card content is visible
  function smoothScrollToCard(card) {
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    const cardRect = card.getBoundingClientRect();
    const cardTop = cardRect.top + window.pageYOffset;
    
    // Calculate scroll position to center the card with some padding
    const scrollTo = cardTop - navbarHeight - 20;
    
    // Only scroll if the card extends below the viewport
    const viewportHeight = window.innerHeight;
    const cardBottom = cardRect.bottom;
    
    if (cardBottom > viewportHeight - 50) {
      window.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
    }
  }

  // Enhanced flip behavior for better UX
  function enhanceCardFlipBehavior() {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .program-card.flipped .program-card-inner {
          transform: rotateY(180deg);
        }
        
        .program-card {
          margin-bottom: 1rem;
        }
        
        .flip-indicator {
          animation: tapPulse 2s ease-in-out infinite;
        }
        
        @keyframes tapPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize enhanced flip behavior
  enhanceCardFlipBehavior();

  // ===== ENHANCED PROGRAM TABS (Keep existing functionality) =====
  const tabs = document.querySelectorAll('.program-tab');
  const programs = document.querySelectorAll('.program');
  
  function switchProgram(targetId) {
    // Remove all active classes
    tabs.forEach(tab => tab.classList.remove('active'));
    programs.forEach(program => program.classList.remove('active'));
    
    // Add active classes
    const targetTab = document.querySelector(`[data-program="${targetId}"]`);
    const targetProgram = document.getElementById(targetId);
    
    if (targetTab && targetProgram) {
      targetTab.classList.add('active');
      targetProgram.classList.add('active');
    }
  }

  // Add click listeners to tabs (if they exist)
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const target = this.dataset.program;
      switchProgram(target);
    });
    
    // Add keyboard support for accessibility
    tab.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = this.dataset.program;
        switchProgram(target);
      }
    });
  });

  // Error handling and initialization
  if (tabs.length === 0 || programs.length === 0) {
    console.warn('Program tabs or content not found - using new card layout');
  } else {
    // Initialize first tab as active if none are active
    const activeTab = document.querySelector('.program-tab.active');
    if (!activeTab && tabs.length > 0) {
      const firstTab = tabs[0];
      const firstTarget = firstTab.dataset.program;
      switchProgram(firstTarget);
    }
  }

  // ===== MOBILE CARD FLIP HANDLING =====
  if (window.innerWidth <= 768) {
    programCards.forEach(card => {
      const flipIndicator = card.querySelector('.flip-indicator span');
      if (flipIndicator) {
        flipIndicator.textContent = 'Tap to explore';
      }
    });
  }

  console.log('Enhanced Program Cards initialized! 🎯');

  // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== FORM VALIDATION ENHANCEMENT =====
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic form validation
      const name = this.querySelector('input[name="name"]')?.value.trim();
      const email = this.querySelector('input[name="email"]')?.value.trim();
      const message = this.querySelector('textarea[name="message"]')?.value.trim();
      
      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // If validation passes
      alert('Thank you for your message! We\'ll get back to you soon.');
      this.reset();
    });
  }

  // ===== SECURITY FIX FOR EXTERNAL LINKS =====
  function secureExternalLinks() {
    document.querySelectorAll('a').forEach(link => {
      if(link.href.includes('http') && !link.href.includes(window.location.hostname)) {
        link.rel = 'noopener noreferrer';
        link.target = '_blank';
      }
    });
  }

  // Apply security fix
  secureExternalLinks();

  // ===== ACCESSIBILITY ENHANCEMENTS =====
  // Skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ===== LOADING ANIMATION =====
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });

  // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.program-card, .hero-content, .about-text').forEach(el => {
    observer.observe(el);
  });

  // ===== HERO ANIMATIONS =====
  
  // Animated Counter for Stats
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }
    updateCounter();
  }

  // Initialize counters when hero section is visible
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate stat counters
          const statNumbers = document.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            animateCounter(stat, target);
          });
          
          // Trigger other hero animations
          entry.target.classList.add('hero-animated');
          heroObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    heroObserver.observe(heroSection);
  }

  // Typing Animation Enhancement
  const typingText = document.querySelector('.typing-text');
  if (typingText) {
    const text = typingText.dataset.text;
    let index = 0;
    
    // Clear initial text
    typingText.textContent = '';
    
    function typeCharacter() {
      if (index < text.length) {
        typingText.textContent += text.charAt(index);
        index++;
        setTimeout(typeCharacter, 150);
      } else {
        // Start blinking cursor after typing is complete
        setTimeout(() => {
          typingText.classList.add('typing-complete');
        }, 1000);
      }
    }
    
    // Start typing animation after a short delay
    setTimeout(typeCharacter, 1000);
  }

  // Parallax Effect for Hero Background
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // Dynamic Particle Creation
  function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--secondary-color);
      border-radius: 50%;
      pointer-events: none;
      animation: particleFloat 10s linear infinite;
      left: ${Math.random() * 100}%;
      top: 100%;
      opacity: 0.6;
    `;
    
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      heroBackground.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 10000);
    }
  }

  // Create particles periodically
  setInterval(createParticle, 3000);

  // Add CSS for particle animation
  const particleStyle = document.createElement('style');
  particleStyle.textContent = `
    @keyframes particleFloat {
      0% { transform: translateY(0) rotate(0deg); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.6; }
      100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
  `;
  document.head.appendChild(particleStyle);
  console.log('CoderDojo website initialized successfully! 🚀');
  
  // REST OF YOUR ORIGINAL JAVASCRIPT CODE BELOW...
  // [PASTE YOUR COUNTER ANIMATION, TESTIMONIAL SLIDER, ETC HERE]
});