// RAGEBITE — shared nav & scroll reveal
document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Nav ──
  const ham = document.getElementById('ham');
  const mobileNav = document.getElementById('mobileNav');
  if (ham && mobileNav) {
    ham.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const spans = ham.querySelectorAll('span');
      if (mobileNav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }));
  }

  // ── Scroll Reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-r').forEach(el => observer.observe(el));

  // ── Active nav link ──
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // ── Nav scroll style ──
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (nav) {
      if (window.scrollY > 60) nav.style.borderBottomColor = 'rgba(209,0,0,0.5)';
      else nav.style.borderBottomColor = 'rgba(209,0,0,0.25)';
    }
  });

});
