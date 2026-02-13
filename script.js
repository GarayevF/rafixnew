/* ========================================
   RAFIX Appliance Repair - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  // ========================================
  // Header Scroll Effect
  // ========================================
  const header = document.querySelector('.header');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ========================================
  // Mobile Menu Toggle
  // ========================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuIcon = mobileMenuBtn.querySelector('svg');
  let isMobileMenuOpen = false;

  function openMobileMenu() {
    isMobileMenuOpen = true;
    mobileMenu.classList.add('open');
    mobileMenuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileMenuIcon.innerHTML = `
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    `;
  }

  function closeMobileMenu() {
    isMobileMenuOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenuOverlay.classList.remove('open');
    document.body.style.overflow = '';
    mobileMenuIcon.innerHTML = `
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    `;
  }

  mobileMenuBtn.addEventListener('click', function() {
    if (isMobileMenuOpen) closeMobileMenu();
    else openMobileMenu();
  });

  mobileMenuOverlay.addEventListener('click', closeMobileMenu);

  // Close mobile menu when clicking a link
  const mobileMenuLinks = mobileMenu.querySelectorAll('a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ========================================
  // Discount Banner Click → open form modal
  // ========================================
  const discountBanner = document.querySelector('.discount-banner');
  discountBanner.addEventListener('click', function() {
    if (window._openFormModal) window._openFormModal();
  });

  // ========================================
  // Gallery Slider (infinite, center-focused)
  // ========================================
  var galleryTrack = document.querySelector('.gallery-track');
  var galleryPrev = document.querySelector('.gallery-prev');
  var galleryNext = document.querySelector('.gallery-next');
  var galleryCurrent = document.querySelector('.gallery-current');
  var galleryTotal = document.querySelector('.gallery-total');

  if (galleryTrack) {
    var origSlides = Array.from(galleryTrack.querySelectorAll('.gallery-slide'));
    var totalReal = origSlides.length;
    var CLONES = 2;
    function getSlideWidth() {
      return window.innerWidth < 768 ? 100 : 100 / 3;
    }
    var slideWidth = getSlideWidth();
    var galleryIndex = 0;
    var galleryBusy = false;

    window.addEventListener('resize', function () {
      slideWidth = getSlideWidth();
      setGalleryPosition(false);
    });

    // Clone last CLONES slides → prepend
    for (var i = totalReal - 1; i >= totalReal - CLONES; i--) {
      var cl = origSlides[i].cloneNode(true);
      cl.setAttribute('aria-hidden', 'true');
      galleryTrack.insertBefore(cl, galleryTrack.firstChild);
    }
    // Clone first CLONES slides → append
    for (var i = 0; i < CLONES; i++) {
      var cl = origSlides[i].cloneNode(true);
      cl.setAttribute('aria-hidden', 'true');
      galleryTrack.appendChild(cl);
    }

    var allGallerySlides = galleryTrack.querySelectorAll('.gallery-slide');
    if (galleryTotal) galleryTotal.textContent = totalReal;

    function setGalleryPosition(animate) {
      var trackIdx = CLONES + galleryIndex;
      var offset = window.innerWidth < 768 ? trackIdx * slideWidth : (trackIdx - 1) * slideWidth;

      if (!animate) {
        galleryTrack.style.transition = 'none';
      } else {
        galleryTrack.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
      }

      galleryTrack.style.transform = 'translateX(-' + offset + '%)';

      for (var j = 0; j < allGallerySlides.length; j++) {
        allGallerySlides[j].classList.toggle('active', j === trackIdx);
      }

      var display = ((galleryIndex % totalReal) + totalReal) % totalReal + 1;
      if (galleryCurrent) galleryCurrent.textContent = display;
    }

    function galleryGoNext() {
      if (galleryBusy) return;
      galleryBusy = true;
      galleryIndex++;
      setGalleryPosition(true);
    }

    function galleryGoPrev() {
      if (galleryBusy) return;
      galleryBusy = true;
      galleryIndex--;
      setGalleryPosition(true);
    }

    galleryTrack.addEventListener('transitionend', function () {
      galleryBusy = false;
      if (galleryIndex >= totalReal) {
        galleryIndex = 0;
        setGalleryPosition(false);
        galleryTrack.offsetHeight;
      } else if (galleryIndex < 0) {
        galleryIndex = totalReal - 1;
        setGalleryPosition(false);
        galleryTrack.offsetHeight;
      }
    });

    if (galleryPrev) galleryPrev.addEventListener('click', galleryGoPrev);
    if (galleryNext) galleryNext.addEventListener('click', galleryGoNext);

    // Touch support
    var gTouchX = 0;
    galleryTrack.addEventListener('touchstart', function (e) {
      gTouchX = e.changedTouches[0].screenX;
    }, { passive: true });
    galleryTrack.addEventListener('touchend', function (e) {
      var diff = gTouchX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) galleryGoNext();
        else galleryGoPrev();
      }
    }, { passive: true });

    // Init
    setGalleryPosition(false);
  }

  // ========================================
  // Testimonials Carousel
  // ========================================
  const testimonialsTrack = document.querySelector('.testimonials-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  const dotsContainer = document.querySelector('.carousel-dots');

  let currentIndex = 0;
  let autoplayInterval;

  function getCardsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function getMaxIndex() {
    return testimonialCards.length - getCardsPerView();
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const totalPages = getMaxIndex() + 1;
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', function () {
        stopAutoplay();
        goToSlide(i);
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = 20; // 1.25rem
    const offset = currentIndex * (cardWidth + gap);
    testimonialsTrack.style.transform = 'translateX(-' + offset + 'px)';

    // Update dots
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach(function (dot, index) {
      dot.classList.toggle('active', index === currentIndex);
    });

    // Update button states
    if (prevBtn) prevBtn.disabled = currentIndex <= 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
  }

  function nextSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }

  function prevSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex;
    }
    updateCarousel();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  if (prevBtn) prevBtn.addEventListener('click', function () {
    stopAutoplay();
    prevSlide();
    startAutoplay();
  });

  if (nextBtn) nextBtn.addEventListener('click', function () {
    stopAutoplay();
    nextSlide();
    startAutoplay();
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (testimonialsTrack) {
    testimonialsTrack.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        stopAutoplay();
        if (diff > 0) nextSlide();
        else prevSlide();
        startAutoplay();
      }
    }, { passive: true });
  }

  function handleResize() {
    buildDots();
    updateCarousel();
  }

  window.addEventListener('resize', handleResize);

  // Initialize
  buildDots();
  updateCarousel();
  startAutoplay();

  // ========================================
  // Contact Form
  // ========================================
  const contactForm = document.querySelector('.contact-form form');
  const formSuccess = document.querySelector('.form-success');
  const bookAnotherBtn = document.querySelector('.book-another');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = this.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(function() {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      }, 1500);
    });
  }

  if (bookAnotherBtn) {
    bookAnotherBtn.addEventListener('click', function() {
      formSuccess.classList.remove('show');
      contactForm.style.display = 'block';
      contactForm.reset();

      const submitBtn = contactForm.querySelector('.submit-btn');
      submitBtn.innerHTML = `
        Claim $25 Off & Schedule
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;
      submitBtn.disabled = false;
    });
  }

  // ========================================
  // Service Areas Slider (paginated)
  // ========================================
  var areasSliderTrack = document.querySelector('.areas-slider-track');
  var areasSliderDots = document.querySelector('.areas-slider-dots');
  var areasPages = document.querySelectorAll('.areas-slider-page');

  if (areasSliderTrack && areasSliderDots && areasPages.length > 0) {
    var areasCurrentPage = 0;
    var totalAreasPages = areasPages.length;

    function buildAreasDots() {
      areasSliderDots.innerHTML = '';
      for (var i = 0; i < totalAreasPages; i++) {
        var dot = document.createElement('button');
        dot.className = i === areasCurrentPage ? 'active' : '';
        dot.setAttribute('aria-label', 'Page ' + (i + 1));
        (function(idx) {
          dot.addEventListener('click', function() {
            areasGoToPage(idx);
          });
        })(i);
        areasSliderDots.appendChild(dot);
      }
    }

    function areasGoToPage(pageIndex) {
      areasCurrentPage = pageIndex;
      areasSliderTrack.style.transform = 'translateX(-' + (areasCurrentPage * 100) + '%)';
      var dots = areasSliderDots.querySelectorAll('button');
      dots.forEach(function(dot, idx) {
        dot.classList.toggle('active', idx === areasCurrentPage);
      });
    }

    // Touch/swipe support
    var areasSwipeX = 0;
    areasSliderTrack.addEventListener('touchstart', function(e) {
      areasSwipeX = e.changedTouches[0].screenX;
    }, { passive: true });
    areasSliderTrack.addEventListener('touchend', function(e) {
      var diff = areasSwipeX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && areasCurrentPage < totalAreasPages - 1) {
          areasGoToPage(areasCurrentPage + 1);
        } else if (diff < 0 && areasCurrentPage > 0) {
          areasGoToPage(areasCurrentPage - 1);
        }
      }
    }, { passive: true });

    buildAreasDots();
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========================================
  // Scroll Animations (Intersection Observer)
  // ========================================
  const animateOnScroll = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateOnScroll.forEach(el => {
    observer.observe(el);
  });

  // ========================================
  // Card Scroll Animations
  // ========================================
  var cardSelectors = [
    '.service-card',
    '.discount-card',
    '.feature-item',
    '.step',
    '.video-card',
    '.stat-card',
    '.testimonial-card',
    '.area-item',
    '.areas-callout',
    '.brand-item',
    '.areas-map-col',
    '.areas-info-col'
  ];

  // Group cards by parent section for proper stagger
  var allSections = document.querySelectorAll('.services, .discounts, .why-us, .how-it-works, .testimonials, .service-areas, .gallery, .videos-section, .brands, .contact');
  allSections.forEach(function (section) {
    var sectionCards = section.querySelectorAll(cardSelectors.join(','));
    sectionCards.forEach(function (card, idx) {
      card.classList.add('card-animate');
      card.style.transitionDelay = idx * 0.1 + 's';
    });
  });

  var allCards = document.querySelectorAll('.card-animate');

  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  allCards.forEach(function (card) {
    cardObserver.observe(card);
  });

  // Section-level animations for section headers and large blocks
  var sectionAnimateEls = document.querySelectorAll('.discounts .section-header, .testimonials .section-header, .service-areas .section-header, .videos-section .section-header, .contact-info, .contact-form-container');
  sectionAnimateEls.forEach(function (el) {
    el.classList.add('section-animate');
  });

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sectionAnimateEls.forEach(function (el) {
    sectionObserver.observe(el);
  });

  // ========================================
  // Stat Digit Slide-Up Animation
  // ========================================
  var digitElements = document.querySelectorAll('.stat-number[data-digits]');
  var digitsAnimated = false;

  // Prepare: wrap each character in spans
  digitElements.forEach(function (el) {
    var text = el.textContent.trim();
    el.textContent = '';
    for (var i = 0; i < text.length; i++) {
      var wrap = document.createElement('span');
      wrap.className = 'digit-wrap';
      var charSpan = document.createElement('span');
      charSpan.className = 'digit-char';
      charSpan.textContent = text[i];
      wrap.appendChild(charSpan);
      el.appendChild(wrap);
    }
  });

  var digitsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !digitsAnimated) {
        digitsAnimated = true;
        // Gather all digit-char spans across all stat-numbers in order
        var allChars = [];
        digitElements.forEach(function (el) {
          var chars = el.querySelectorAll('.digit-char');
          chars.forEach(function (c) { allChars.push(c); });
        });
        // Stagger each character
        allChars.forEach(function (charEl, i) {
          charEl.style.transitionDelay = i * 0.04 + 's';
        });
        // Trigger
        digitElements.forEach(function (el) {
          el.classList.add('digits-visible');
        });
        digitsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  var statsSection = document.querySelector('.why-us-right');
  if (statsSection) {
    digitsObserver.observe(statsSection);
  }

  // ========================================
  // Form Modal (popup)
  // ========================================
  var formModal = document.getElementById('form-modal');
  var openModalBtn = document.getElementById('open-form-modal');
  var closeModalBtn = document.getElementById('close-form-modal');
  var formModalBody = formModal ? formModal.querySelector('.form-modal-body') : null;

  if (formModal && openModalBtn && formModalBody) {
    // Clone the form container into the modal on first open
    var modalReady = false;

    function prepareModal() {
      if (modalReady) return;
      var originalContainer = document.querySelector('.contact-form-container');
      if (originalContainer) {
        var clone = originalContainer.cloneNode(true);
        // Remove section-animate classes from clone
        clone.classList.remove('section-animate', 'card-animate', 'in-view');
        formModalBody.appendChild(clone);

        // Handle form submit in modal
        var modalForm = clone.querySelector('form');
        var modalSuccess = clone.querySelector('.form-success');
        var modalBookAnother = clone.querySelector('.book-another');
        if (modalForm) {
          modalForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = modalForm.querySelector('.submit-btn');
            btn.innerHTML = 'Sending...';
            btn.disabled = true;
            setTimeout(function () {
              modalForm.style.display = 'none';
              if (modalSuccess) modalSuccess.classList.add('show');
            }, 1500);
          });
        }
        if (modalBookAnother) {
          modalBookAnother.addEventListener('click', function () {
            if (modalSuccess) modalSuccess.classList.remove('show');
            modalForm.style.display = 'block';
            modalForm.reset();
            var btn = modalForm.querySelector('.submit-btn');
            btn.innerHTML = 'Claim $25 Off & Schedule <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
            btn.disabled = false;
          });
        }
        modalReady = true;
      }
    }

    function openFormModal() {
      prepareModal();
      formModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    window._openFormModal = openFormModal;

    // All elements with .open-form-trigger open the modal
    document.querySelectorAll('.open-form-trigger').forEach(function (btn) {
      btn.addEventListener('click', openFormModal);
    });

    function closeFormModal() {
      formModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    openModalBtn.addEventListener('click', openFormModal);
    closeModalBtn.addEventListener('click', closeFormModal);

    // Close on overlay click
    formModal.addEventListener('click', function (e) {
      if (e.target === formModal) closeFormModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && formModal.classList.contains('active')) {
        closeFormModal();
      }
    });
  }

  // ========================================
  // Lazy-load Videos after page fully loads
  // ========================================
  window.addEventListener('load', function () {
    var lazyVideos = document.querySelectorAll('.video-card video[data-src]');
    lazyVideos.forEach(function (video) {
      video.src = video.getAttribute('data-src');
      video.removeAttribute('data-src');
      video.load();
      video.play().catch(function () {});
    });
  });
});
