/**
 * Cebu Van Rental & Tours – Custom JavaScript
 * - Sticky nav (already CSS, but we handle hamburger & active links)
 * - Smooth scrolling
 * - Carousel slider
 * - Section reveal on scroll (Intersection Observer)
 * - Active nav highlight
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ----- HAMBURGER MENU -----
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ----- SMOOTH SCROLLING for anchor links -----
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const headerOffset = document.querySelector('.sticky-nav').offsetHeight;
        const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset + 5; // small offset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ----- CAROUSEL SLIDER -----
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let currentSlide = 0;
  const slideInterval = 5000; // 5 seconds
  let slideTimer;

  function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Wrap index
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    
    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetTimer();
  });
  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetTimer();
  });
  
  // Dot indicators
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetTimer();
    });
  });

  // Auto-play
  function startAutoPlay() {
    slideTimer = setInterval(nextSlide, slideInterval);
  }
  function resetTimer() {
    clearInterval(slideTimer);
    startAutoPlay();
  }
  startAutoPlay();

  // Pause on hover (optional)
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(slideTimer));
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  // ----- ACTIVE NAVIGATION HIGHLIGHT ON SCROLL -----
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNav() {
    const scrollPos = window.scrollY + document.querySelector('.sticky-nav').offsetHeight + 50;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', function() {
    window.requestAnimationFrame(updateActiveNav);
  });
  updateActiveNav(); // call once to set initial active

  // ----- ANIMATED SECTION REVEAL ON SCROLL (Intersection Observer) -----
  const revealSections = document.querySelectorAll('.section:not(.hero)'); // hero excluded
  revealSections.forEach(section => section.classList.add('fade-up'));

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: unobserve after reveal for performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealSections.forEach(section => revealObserver.observe(section));

  // ----- GALLERY LIGHTBOX (album style) -----
// ===== SIMPLE GALLERY LIGHTBOX =====
document.addEventListener('DOMContentLoaded', function() {
  
  // Get elements
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-image');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');
  const thumbnails = document.querySelectorAll('.gallery-thumb');
  
  // Check if elements exist
  if (!modal || !modalImg || !thumbnails.length) {
    console.log('Gallery elements not found');
    return;
  }
  
  let currentIndex = 0;
  
  // Add click event to each thumbnail
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', function() {
      console.log('Thumbnail clicked:', index); // Debug
      modal.style.display = 'block';
      modalImg.src = this.src;
      currentIndex = index;
    });
  });
  
  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }
  
  // Click modal background to close
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      modalImg.src = thumbnails[currentIndex].src;
    });
  }
  
  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      currentIndex = (currentIndex + 1) % thumbnails.length;
      modalImg.src = thumbnails[currentIndex].src;
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'block') {
      if (e.key === 'Escape') {
        modal.style.display = 'none';
      } else if (e.key === 'ArrowLeft' && prevBtn) {
        prevBtn.click();
      } else if (e.key === 'ArrowRight' && nextBtn) {
        nextBtn.click();
      }
    }
  });
  
});
});