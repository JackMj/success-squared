/* =============================================
   NAVBAR SCROLL
   ============================================= */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* =============================================
   HAMBURGER MENU
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* =============================================
   ACTIVE NAV LINK
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.navbar__links a');

function setActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const h = sec.offsetHeight;
    const id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + h) {
      navItems.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.navbar__links a[href="#${id}"]`);
      if (match) match.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });

/* =============================================
   HERO SLIDER
   ============================================= */
const slides = document.querySelectorAll('.hero__slide');
const dots = document.querySelectorAll('.hero__dot');
let current = 0;
let heroTimer;

function goToSlide(n) {
  slides[current].classList.remove('hero__slide--active');
  dots[current].classList.remove('hero__dot--active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('hero__slide--active');
  dots[current].classList.add('hero__dot--active');
}

function nextSlide() { goToSlide(current + 1); }
function prevSlide() { goToSlide(current - 1); }

function startHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = setInterval(nextSlide, 6000);
}

document.getElementById('heroNext').addEventListener('click', () => { nextSlide(); startHeroTimer(); });
document.getElementById('heroPrev').addEventListener('click', () => { prevSlide(); startHeroTimer(); });
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i); startHeroTimer(); });
});
startHeroTimer();

/* =============================================
   SCROLL ANIMATIONS (data-aos)
   ============================================= */
const aosEls = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-aos]'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('aos-in');
      }, idx * 100);
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

aosEls.forEach(el => aosObserver.observe(el));

/* =============================================
   COUNTER ANIMATION
   ============================================= */
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* =============================================
   CONSULTATION TABS
   ============================================= */
const consultTabs = document.querySelectorAll('.consult__tab');
const serviceField = document.getElementById('serviceField');
const selectedService = document.getElementById('selectedService');

consultTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    consultTabs.forEach(t => t.classList.remove('consult__tab--active'));
    tab.classList.add('consult__tab--active');
    const service = tab.dataset.service;
    serviceField.value = service;
    selectedService.textContent = service;
  });
});

/* =============================================
   CONSULTATION FORM
   ============================================= */
const consultForm = document.getElementById('consultForm');
const formSuccess = document.getElementById('formSuccess');

consultForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const required = consultForm.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#e55';
      valid = false;
    }
  });

  if (!valid) {
    const first = consultForm.querySelector('[required][style*="border-color: rgb(238, 85, 85)"]');
    if (first) first.focus();
    return;
  }

  const btn = consultForm.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', consultForm);
    consultForm.style.display = 'none';
    formSuccess.classList.add('show');

    setTimeout(() => {
      consultForm.reset();
      consultForm.style.display = '';
      formSuccess.classList.remove('show');
      btn.disabled = false;
      btn.innerHTML = orig;
      selectedService.textContent = 'Will Drafting';
      serviceField.value = 'Will Drafting';
      consultTabs.forEach((t, i) => t.classList.toggle('consult__tab--active', i === 0));
    }, 5000);
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = orig;
    alert('Something went wrong. Please email us directly at info@successsquaredconsulting.com');
  }
});

consultForm.querySelectorAll('input, textarea').forEach(f => {
  f.addEventListener('input', () => f.style.borderColor = '');
});

/* =============================================
   CASES FILTER
   ============================================= */
const filterBtns = document.querySelectorAll('.cases-filter__btn');
const caseCards = document.querySelectorAll('.case-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('cases-filter__btn--active'));
    btn.classList.add('cases-filter__btn--active');
    const filter = btn.dataset.filter;
    caseCards.forEach(card => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});


/* =============================================
   BACK TO TOP
   ============================================= */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 400);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =============================================
   SMOOTH SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 75, behavior: 'smooth' });
    }
  });
});
