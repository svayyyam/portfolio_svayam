document.addEventListener('DOMContentLoaded', () => {
  /* =======================================
     CUSTOM CURSOR
     ======================================= */
  const cursor = document.getElementById('cursor');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp interpolation for cursor
  function animateCursor() {
    // Check if on mobile (cursor hidden via CSS media query, but let's prevent pointless math)
    if (window.innerWidth > 768) {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate3d(${cursorX - 8}px, ${cursorY - 8}px, 0)`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states for interactive elements
  const hoverElements = document.querySelectorAll('a, button, .project-card, .social-btn, .hero-chip, .category-item, .brand-badge, .collab-tag, .nav-logo');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  /* =======================================
     NAVIGATION SCROLL & MOBILE MENU
     ======================================= */
  const nav = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.menu-link');
  
  let isNavScrolled = false;
  
  window.addEventListener('scroll', () => {
    // Throttle / debounce lightly
    if (!isNavScrolled) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        isNavScrolled = false;
      });
      isNavScrolled = true;
    }
  });

  // Mobile Menu Toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* =======================================
     HERO TEXT SPLIT ANIMATION
     ======================================= */
  const heroTitle = document.getElementById('hero-title-text');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    // Split text into lines, words, chars
    const chars = text.split('');
    chars.forEach((char, index) => {
      // Create character span
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      charSpan.textContent = char === ' ' ? '\u00A0' : char; // Handle spaces
      
      // Wrap in overflow-hidden parent to clip the slide-up animation
      const wrapSpan = document.createElement('span');
      wrapSpan.className = 'char-wrap';
      wrapSpan.appendChild(charSpan);
      
      heroTitle.appendChild(wrapSpan);

      // Trigger animation with delay
      setTimeout(() => {
        charSpan.classList.add('animate');
      }, index * 40 + 100); // 100ms base delay, 40ms stagger
    });
  }

  // Stagger hero chips
  const heroChips = document.querySelectorAll('.hero-chip');
  heroChips.forEach((chip, index) => {
    setTimeout(() => {
      chip.classList.add('animate');
    }, 800 + (index * 100)); // Delay after text animation
  });

  /* =======================================
     SCROLL REVEAL (INTERSECTION OBSERVER)
     ======================================= */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* =======================================
     ABOUT HEADING WORD SPLIT
     ======================================= */
  const aboutHeading = document.getElementById('about-heading-text');
  if (aboutHeading) {
    const lines = aboutHeading.innerHTML.split('<br>');
    aboutHeading.innerHTML = '';
    
    lines.forEach((line, lineIndex) => {
      const words = line.split(' ');
      words.forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.innerHTML = word + '&nbsp;';
        aboutHeading.appendChild(wordSpan);
      });
      if (lineIndex === 0) {
        aboutHeading.appendChild(document.createElement('br'));
      }
    });

    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const words = entry.target.querySelectorAll('.word');
          words.forEach((word, index) => {
            setTimeout(() => {
              word.classList.add('visible');
            }, index * 80);
          });
          aboutObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    aboutObserver.observe(aboutHeading);
  }

  /* =======================================
     ACTIVE SECTION TRACKING FOR NAVBAR
     ======================================= */
  const sections = document.querySelectorAll('section, footer');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-connect)');

  // Map section IDs to nav link hrefs
  const sectionMap = {};
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      sectionMap[href.substring(1)] = link;
    }
  });

  const navLogo = document.querySelector('.nav-logo');

  function setActiveLink(sectionId) {
    navLinks.forEach(link => link.classList.remove('active'));
    navLogo.classList.remove('active');
    
    if (sectionMap[sectionId]) {
      sectionMap[sectionId].classList.add('active');
    } else if (sectionId === 'hero') {
      navLogo.classList.add('active');
    }
  }

  const sectionObserverOptions = {
    threshold: 0.05,
    rootMargin: '-80px 0px -20% 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, sectionObserverOptions);

  sections.forEach(section => {
    if (section.id) {
      sectionObserver.observe(section);
    }
  });
});
