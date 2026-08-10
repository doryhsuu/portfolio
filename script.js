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

/* Header：往下滑隱藏、往上滑顯示 */
const siteHeader = document.querySelector('.header');

let lastScrollY = window.scrollY;
let headerTicking = false;
const scrollThreshold = 12;

function updateHeaderVisibility() {
  if (!siteHeader) {
    headerTicking = false;
    return;
  }

  const currentScrollY = window.scrollY;
  const scrollDifference = currentScrollY - lastScrollY;

  if (currentScrollY <= 80) {
    siteHeader.classList.remove('header-hidden');
    lastScrollY = currentScrollY;
  } else if (Math.abs(scrollDifference) >= scrollThreshold) {
    if (scrollDifference > 0) {
      siteHeader.classList.add('header-hidden');
      mobileNav?.classList.remove('open');
    } else {
      siteHeader.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  }

  headerTicking = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (headerTicking) return;
    headerTicking = true;
    requestAnimationFrame(updateHeaderVisibility);
  },
  { passive: true }
);
