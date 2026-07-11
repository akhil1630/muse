/**
 * MUSES & CUPID - Warm Luxury Boutique Interactive Script
 * Author: Antigravity Code Assistant
 * ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Premium Custom Cursor with LERP (Linear Interpolation)
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('customCursorFollower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the inner micro-dot
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    // Smooth follower tracking with LERP (0.1 damping factor)
    const updateCursorFollower = () => {
      posX += (mouseX - posX) * 0.12;
      posY += (mouseY - posY) * 0.12;

      follower.style.left = `${posX}px`;
      follower.style.top = `${posY}px`;

      requestAnimationFrame(updateCursorFollower);
    };
    updateCursorFollower();

    // Toggle cursor hover scale class on luxury interactive targets
    const interactiveTargets = document.querySelectorAll(
      'a, button, .btn, .gallery-item, .collection-card, .timeline-card-step, .review-card, .luxury-icon-item, .contact-link-item'
    );
    
    interactiveTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // 2. Sticky ivory header backdrop transition on scroll
  const header = document.getElementById('mainHeader');
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Trigger initial load check

  // 3. Mobile Navigation Drawer menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenuMobile = document.getElementById('navMenuMobile');

  if (menuToggle && navMenuMobile) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenuMobile.classList.toggle('active');
    });

    // Close mobile drawer when clicking any nav link
    const mobileLinks = document.querySelectorAll('.nav-item-mobile, .nav-btn-mobile');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenuMobile.classList.remove('active');
      });
    });
  }

  // 4. Hero Background Parallax & Zoom on Scroll
  const heroBgImg = document.getElementById('heroBgImg');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Perform parallax scaling and translation only when hero is visible
      if (scrollY <= windowHeight) {
        const scrollFactor = scrollY / windowHeight;
        // Image baseline scale is 1.05. It slowly zooms up to ~1.12 during scroll down.
        const currentScale = 1.05 + (scrollFactor * 0.07);
        const yTranslation = scrollY * 0.18; // Slow vertical displacement
        
        heroBgImg.style.transform = `scale(${currentScale}) translate3d(0, ${yTranslation}px, 0)`;
      }
    });
  }

  // 5. Scroll Spy Navigation Highlight
  const sections = document.querySelectorAll('section, footer');
  const navItems = document.querySelectorAll('.nav-item');
  const mobileNavItems = document.querySelectorAll('.nav-item-mobile');

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        if (!sectionId) return;

        // Update desktop links
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });

        // Update mobile links
        mobileNavItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-20% 0px -50% 0px'
  });

  sections.forEach(section => {
    scrollSpyObserver.observe(section);
  });

  // 6. Intersection Observer for Scroll Reveals
  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Reveal animation occurs once
      }
    });
  }, revealOptions);

  const elementsToReveal = document.querySelectorAll(
    '.scroll-reveal-fade-up, .scroll-reveal-fade-left, .scroll-reveal-fade-right, .collection-card, .timeline-card-step, .review-card'
  );
  elementsToReveal.forEach(element => {
    revealObserver.observe(element);
  });

  // 7. Timeline Progress Fill Animation on Reveal
  const processSection = document.getElementById('process');
  const timelineProgressFill = document.getElementById('timelineProgressFill');

  if (processSection && timelineProgressFill) {
    const processObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Fill progress bar from 0% to 100% when section appears
          timelineProgressFill.style.width = '100%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    processObserver.observe(processSection);
  }

  // 8. Custom Portfolio Lightbox Overlay Viewer
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;

  const openLightbox = (index) => {
    if (!lightbox) return;

    currentGalleryIndex = index;
    const currentItem = galleryItems[index];
    const src = currentItem.getAttribute('data-src');
    const title = currentItem.getAttribute('data-title');
    const category = currentItem.getAttribute('data-category');

    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxCat.textContent = category;

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scrolling
    lightboxImg.src = ''; // Clear source to optimize loading
  };

  const loadPreviousImage = () => {
    let prevIndex = currentGalleryIndex - 1;
    if (prevIndex < 0) {
      prevIndex = galleryItems.length - 1;
    }
    openLightbox(prevIndex);
  };

  const loadNextImage = () => {
    let nextIndex = currentGalleryIndex + 1;
    if (nextIndex >= galleryItems.length) {
      nextIndex = 0;
    }
    openLightbox(nextIndex);
  };

  // Bind click event listeners to masonry gallery cards
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Bind click handlers to lightbox controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', loadPreviousImage);
  if (lightboxNext) lightboxNext.addEventListener('click', loadNextImage);

  // Close lightbox on clicking the background overlay
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Support accessibility keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      loadPreviousImage();
    } else if (e.key === 'ArrowRight') {
      loadNextImage();
    }
  });

  // 9. Premium Swiper Carousel for Signature Collections (Multi-card Carousel)
  // 9. Premium Swiper Carousel for Signature Collections (Multi-card Carousel)
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-card'));
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dots = Array.from(document.querySelectorAll('.carousel-dot'));
  
  if (track && slides.length > 0) {
    const N = 9; // Number of original slides
    const C = 4; // Number of prepended clones
    let currentIndex = C; // Start on index 4 (first actual slide)
    let isTransitioning = false;
    let autoplayTimer = null;
    let transitionTimeout = null;
    
    // Drag/Swipe state variables
    let isDragging = false;
    let dragStartPos = 0;
    let dragCurrentTranslate = 0;
    let dragPrevTranslate = 0;
    let dragDeltaX = 0;
    let dragMoved = false;

    // Calculate offset dynamically based on card size and gap
    const getSlideWidthAndGap = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return { slideWidth, gap };
    };

    const getSlideOffset = (index) => {
      const { slideWidth, gap } = getSlideWidthAndGap();
      return index * (slideWidth + gap);
    };

    const handleTransitionEnd = () => {
      isTransitioning = false;
      if (currentIndex === C + N) { // Reached first clone of end
        currentIndex = C;
        updateCarousel(false);
      } else if (currentIndex === C - 1) { // Reached last clone of start
        currentIndex = C + N - 1;
        updateCarousel(false);
      }
    };

    const updateCarousel = (animated = true) => {
      if (animated) {
        track.style.transition = 'transform 600ms ease';
      } else {
        track.style.transition = 'none';
      }
      
      const offset = getSlideOffset(currentIndex);
      track.style.transform = `translateX(-${offset}px)`;
      
      // Clear any existing fallback timeout
      if (transitionTimeout) {
        clearTimeout(transitionTimeout);
        transitionTimeout = null;
      }
      
      if (animated) {
        // Fallback in case transitionend event doesn't fire (e.g. headless browser or system settings)
        transitionTimeout = setTimeout(() => {
          handleTransitionEnd();
        }, 650);
      } else {
        handleTransitionEnd();
      }
      
      // Update active classes on cards
      slides.forEach((slide, i) => {
        if (i === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      
      // Update pagination dots (map index back to 0-8 original index)
      const activeDataIndex = (currentIndex - C + N) % N;
      dots.forEach((dot, i) => {
        if (i === activeDataIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateCarousel(true);
    };

    const prevSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateCarousel(true);
    };

    // Transition end wrap checks for seamless infinite loop
    track.addEventListener('transitionend', (e) => {
      // Ensure the transition ended on the track itself (not a child card or image transition)
      if (e.target !== track) return;
      
      if (transitionTimeout) {
        clearTimeout(transitionTimeout);
        transitionTimeout = null;
      }
      handleTransitionEnd();
    });

    // Arrow button click listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay();
      });
    }

    // Pagination dot click listeners
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        if (isTransitioning) return;
        const targetIdx = parseInt(e.target.getAttribute('data-slide'));
        currentIndex = targetIdx + C;
        updateCarousel(true);
        startAutoplay();
      });
    });

    // Touch and mouse drag helper functions
    const getPositionX = (e) => {
      return e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    };

    const dragStart = (e) => {
      if (isTransitioning) return;
      isDragging = true;
      dragMoved = false;
      dragStartPos = getPositionX(e);
      stopAutoplay();

      // Disable transition and capture current translation position
      track.style.transition = 'none';
      const offset = getSlideOffset(currentIndex);
      dragPrevTranslate = -offset;
      dragCurrentTranslate = dragPrevTranslate;
      track.classList.add('grabbing');
    };

    const dragMove = (e) => {
      if (!isDragging) return;
      dragMoved = true;
      
      // If it's a touch move, prevent window scrolling horizontally
      if (e.type === 'touchmove') {
        const currentX = getPositionX(e);
        if (Math.abs(currentX - dragStartPos) > 10) {
          if (e.cancelable) e.preventDefault();
        }
      }

      const currentX = getPositionX(e);
      dragDeltaX = currentX - dragStartPos;
      dragCurrentTranslate = dragPrevTranslate + dragDeltaX;
      track.style.transform = `translateX(${dragCurrentTranslate}px)`;
    };

    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('grabbing');
      
      const { slideWidth } = getSlideWidthAndGap();
      const threshold = slideWidth * 0.15; // Require 15% card width drag to switch
      
      track.style.transition = 'transform 600ms ease';
      
      if (dragMoved && dragDeltaX < -threshold) {
        nextSlide();
      } else if (dragMoved && dragDeltaX > threshold) {
        prevSlide();
      } else {
        updateCarousel(true);
      }
      
      // Reset drag tracking variables
      dragDeltaX = 0;
      dragMoved = false;
      startAutoplay();
    };

    // Drag events bindings
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd); // Bind mouseup to window so release is caught outside track bounds
    
    // Touch events bindings
    track.addEventListener('touchstart', dragStart, { passive: true });
    track.addEventListener('touchmove', dragMove, { passive: false });
    track.addEventListener('touchend', dragEnd, { passive: true });

    // Autoplay functions
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 4000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Pause on Hover
    const carouselContainer = document.querySelector('.collections-carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoplay);
      carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    // Adjust position on resize to prevent layout breaking
    window.addEventListener('resize', () => {
      updateCarousel(false);
    });

    // Initial load setup
    setTimeout(() => {
      updateCarousel(false);
      startAutoplay();
    }, 150);
  }

});
