document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ duration: 1.2, smooth: true });

  lenis.on('scroll', ScrollTrigger.update);
  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // === HERO SLIDER ===
  const heroSlides = document.querySelectorAll('.hero .slide');
  const heroNextBtn = document.querySelector('.hero .next');
  const heroPrevBtn = document.querySelector('.hero .prev');
  let currentHero = 0;

  function showHeroSlide(index) {
    heroSlides.forEach((slide, i) => {
      const video = slide.querySelector('video');
      slide.classList.toggle('active', i === index);
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  heroNextBtn?.addEventListener('click', () => {
    currentHero = (currentHero + 1) % heroSlides.length;
    showHeroSlide(currentHero);
  });

  heroPrevBtn?.addEventListener('click', () => {
    currentHero = (currentHero - 1 + heroSlides.length) % heroSlides.length;
    showHeroSlide(currentHero);
  });

  showHeroSlide(currentHero);

  // === ВИДЕО-СЕКЦИЯ ===
  const videoSlider = document.querySelector('.video-slider');
  const track = document.querySelector('.video-track');
  const videoSlides = Array.from(document.querySelectorAll('.video-slide'));
  const videoPrev = document.querySelector('.video-prev');
  const videoNext = document.querySelector('.video-next');
  const filterButtons = document.querySelectorAll('.filter-tabs button');

  let currentIndex = 0;
  let currentCategory = 'all';
  let filteredSlides = [];

  function updateFilteredSlides() {
    filteredSlides = videoSlides.filter(slide =>
      currentCategory === 'all' || slide.classList.contains(currentCategory)
    );
  }

  function showSlide(index) {
    videoSlides.forEach(slide => {
      slide.classList.remove('active');
      const vid = slide.querySelector('video');
      if (vid && !vid.paused) vid.pause();
    });

    if (filteredSlides.length > 0) {
      const slide = filteredSlides[index];
      if (slide) {
        slide.classList.add('active');
        updateSliderMode(slide);
      }
    }
  }

  function updateSliderMode(slide) {
    const wrapper = slide.querySelector('.video-wrapper');
    if (wrapper && wrapper.classList.contains('vertical')) {
      videoSlider.classList.add('vertical-mode');
    } else {
      videoSlider.classList.remove('vertical-mode');
    }
  }

  function filterSlides(category) {
    currentCategory = category;
    updateFilteredSlides();
    currentIndex = 0;
    showSlide(currentIndex);
  }

  videoNext?.addEventListener('click', () => {
    if (filteredSlides.length === 0) return;
    currentIndex = (currentIndex + 1) % filteredSlides.length;
    showSlide(currentIndex);
  });

  videoPrev?.addEventListener('click', () => {
    if (filteredSlides.length === 0) return;
    currentIndex = (currentIndex - 1 + filteredSlides.length) % filteredSlides.length;
    showSlide(currentIndex);
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterSlides(btn.dataset.filter);
    });
  });

  // === Автоопределение вертикальных видео
  document.querySelectorAll('.video-slide video').forEach(video => {
    video.addEventListener('loadedmetadata', () => {
      const ratio = video.videoWidth / video.videoHeight;
      const wrapper = video.closest('.video-wrapper');
      if (wrapper) {
        if (ratio < 1) wrapper.classList.add('vertical');
        else wrapper.classList.remove('vertical');
      }
    });
  });

  filterSlides('all');

  // === ПРОКРУТКА К КОНТАКТАМ ===
  document.querySelectorAll('.scroll-to-contacts').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector('#contacts')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // === ВАЛИДАЦИЯ ФОРМЫ ===
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fields = contactForm.querySelectorAll('input[type="text"], input[type="tel"]');
    fields.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (valid) {
      alert('Заявка отправлена!');
      contactForm.reset();
    }
  });

  // === LOTTIE ===
  lottie.loadAnimation({
    container: document.getElementById('lottie-camera'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://assets7.lottiefiles.com/packages/lf20_w1dxtona.json'
  });

  // === GSAP Scroll анимации ===
  gsap.to(".background-gradient", {
    backgroundPosition: "100% 50%",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 2
    }
  });

  gsap.utils.toArray('section').forEach((section, i) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: window.innerWidth <= 768 ? 'top 98%' : 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 80,
      duration: 0.8,
      delay: i * 0.05
    });
  });

  gsap.utils.toArray('section h2').forEach((h2, i) => {
    gsap.from(h2, {
      scrollTrigger: {
        trigger: h2,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      duration: 0.6,
      delay: i * 0.1
    });
  });

  gsap.utils.toArray('.step-block').forEach((block, i) => {
    gsap.from(block, {
      scrollTrigger: {
        trigger: block,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 60,
      duration: 0.6,
      delay: i * 0.1
    });
  });

  gsap.from(".slider video", {
    scrollTrigger: {
      trigger: ".slider",
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2
  });

  // === LIGHTBOX ГАЛЕРЕЯ ===
  const galleryImages = document.querySelectorAll('.gallery-track img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentImageIndex = 0;

  function showLightbox(index) {
    const image = galleryImages[index];
    if (image) {
      lightboxImg.src = image.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      currentImageIndex = index;
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    showLightbox(currentImageIndex);
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    showLightbox(currentImageIndex);
  }

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => showLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') showPrevImage();
    else if (e.key === 'ArrowRight') showNextImage();
    else if (e.key === 'Escape') closeLightbox();
  });

  // === Анимация хедера ===
  gsap.from("header", {
    opacity: 0,
    y: -30,
    duration: 2,
    ease: "power4.out",
    delay: 0.2
  });

  // === AOS ===
  AOS.init({
    offset: 120,
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });

  // === Preload видео ===
  document.querySelectorAll('.video-wrapper video').forEach(video => {
    const wrapper = video.closest('.video-wrapper');
    if (!wrapper) return;

    const markAsLoaded = () => wrapper.classList.add('loaded');
    video.addEventListener('loadeddata', markAsLoaded);
    if (video.readyState >= 3) markAsLoaded();
  });

  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(video => {
    setTimeout(() => {
      try {
        video.load();
      } catch (e) {
        console.warn('Не удалось загрузить видео:', video, e);
      }
    }, 500);
  });

  // === Scroll Gradient Background
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    const bg = document.querySelector('.scroll-gradient-bg');
    if (!bg) return;

    if (window.innerWidth > 768) {
      bg.style.backgroundPosition = `${scrollPercent * 100}% 50%`;
    } else {
      bg.style.backgroundPosition = `50% ${scrollPercent * 100}%`;
    }
  });
});















