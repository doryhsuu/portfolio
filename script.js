const menuButton = document.querySelector('.menu');
const mobileNav = document.querySelector('.mobile');
const topButton = document.querySelector('.top');

menuButton?.addEventListener('click', () => {
  mobileNav?.classList.toggle('open');
});

document.querySelectorAll('.mobile a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav?.classList.remove('open');
  });
});

window.addEventListener('scroll', () => {
  topButton?.classList.toggle('visible', window.scrollY > 700);
});

topButton?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  },
  {
    threshold: 0.14
  }
);

document.querySelectorAll('.reveal').forEach((element) => {
  observer.observe(element);
});
