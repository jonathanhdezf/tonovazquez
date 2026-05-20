document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  /* ==========================================================================
     NAVIGATION & DRAWERS
     ========================================================================== */
  const mainNav = document.getElementById('mainNav');
  const menuBtn = document.getElementById('menuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change nav style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  });

  // Toggle mobile drawer
  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('active');
    });
  }

  // Close drawer and navigate when link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Manage active states
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Close drawer if open
      menuBtn?.classList.remove('active');
      mobileDrawer?.classList.remove('active');
    });
  });

  /* ==========================================================================
     PARALLAX EFFECT (HERO)
     ========================================================================== */
  const heroBg = document.getElementById('heroBg');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    // Check if hero is visible
    if (scrolled < window.innerHeight) {
      // Shift background downwards slower than scroll speed
      if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
      }
    }
  });

  /* ==========================================================================
     SCROLL ENTRANCE ANIMATIONS (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, no need to track again unless desired
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12, // Element is 12% visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters fully
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Track active section and highlight nav link
  const sections = document.querySelectorAll('header, section');
  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('data-sec') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3, // Trigger when 30% of section is visible
  });

  sections.forEach(sec => secObserver.observe(sec));

  /* ==========================================================================
     OBRAS GALLERY FILTER
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const obraCards = document.querySelectorAll('.obra-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      obraCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          // Show cards
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          // Hide cards
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400); // Must match transition speed
        }
      });
    });
  });

  /* ==========================================================================
     MOBILE TOUCH GESTURES (Obras cards)
     ========================================================================== */
  obraCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Check if it's a mobile device (if it doesn't support fine hover pointer)
      if (window.matchMedia('(hover: none)').matches) {
        // If clicked on an active card, ignore or allow navigation.
        // Otherwise, toggle display details.
        if (!card.classList.contains('touch-active')) {
          e.preventDefault();
          // Remove active state from other cards
          obraCards.forEach(c => c.classList.remove('touch-active'));
          card.classList.add('touch-active');
        } else {
          // Tapped again: remove touch-active
          card.classList.remove('touch-active');
        }
      }
    });
  });

  /* ==========================================================================
     OFFICIAL VIDEOS CAROUSEL
     ========================================================================== */
  const officialVideoCarousel = document.getElementById('officialVideoCarousel');
  const videoPrev = document.getElementById('videoPrev');
  const videoNext = document.getElementById('videoNext');

  if (officialVideoCarousel) {
    const videoCards = Array.from(officialVideoCarousel.querySelectorAll('.featured-video-block'));
    let currentVideoIndex = 0;
    let videoTimer;

    const goToVideo = (index) => {
      if (!videoCards.length) return;

      currentVideoIndex = (index + videoCards.length) % videoCards.length;
      videoCards[currentVideoIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    };

    const restartVideoTimer = () => {
      window.clearInterval(videoTimer);
      videoTimer = window.setInterval(() => {
        goToVideo(currentVideoIndex + 1);
      }, 7000);
    };

    videoPrev?.addEventListener('click', () => {
      goToVideo(currentVideoIndex - 1);
      restartVideoTimer();
    });

    videoNext?.addEventListener('click', () => {
      goToVideo(currentVideoIndex + 1);
      restartVideoTimer();
    });

    officialVideoCarousel.addEventListener('pointerdown', () => {
      window.clearInterval(videoTimer);
    });

    officialVideoCarousel.addEventListener('pointerup', restartVideoTimer);
    officialVideoCarousel.addEventListener('mouseenter', () => window.clearInterval(videoTimer));
    officialVideoCarousel.addEventListener('mouseleave', restartVideoTimer);

    restartVideoTimer();
  }

  // Close touch card active states when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.obra-card')) {
      obraCards.forEach(card => card.classList.remove('touch-active'));
    }
  });

  /* ==========================================================================
     CONTACT FORM HANDLING
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Disable button during animation
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando... <i data-lucide="loader" class="animate-spin" style="margin-left: 8px; width: 18px; height: 18px;"></i>';
    if (window.lucide) {
      lucide.createIcons();
    }

    const name = document.getElementById('nameInput').value.trim();

    // Simulate Network Request
    setTimeout(() => {
      formAlert.className = 'form-alert success';
      formAlert.innerHTML = `¡Gracias, <strong>${name}</strong>! Hemos recibido tu mensaje. Nos comunicaremos contigo a la brevedad.`;
      
      // Reset Form
      contactForm.reset();
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar Mensaje <i data-lucide="send" style="margin-left: 8px; width: 18px; height: 18px;"></i>';
      if (window.lucide) {
        lucide.createIcons();
      }
      
      // Scroll to alert
      formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Fade out alert after 8 seconds
      setTimeout(() => {
        formAlert.style.display = 'none';
      }, 8000);

    }, 1500);
  });

  /* ==========================================================================
     WHATSAPP FLOATING SHOW/HIDE TOOLTIP ON SCROLL
     ========================================================================== */
  const whatsappFloating = document.getElementById('whatsappFloating');
  const whatsappBubble = whatsappFloating?.querySelector('.whatsapp-bubble');
  
  // Show the WhatsApp text bubble 3 seconds after load to grab attention
  if (whatsappFloating && whatsappBubble) {
    setTimeout(() => {
      whatsappBubble.style.opacity = '1';
      whatsappBubble.style.transform = 'translateX(0)';
      
      // Hide it again after 6 seconds if not hovered
      setTimeout(() => {
        if (!whatsappFloating.matches(':hover')) {
          whatsappBubble.style.opacity = '0';
          whatsappBubble.style.transform = 'translateX(15px)';
        }
      }, 6000);
    }, 3000);
  }

});
