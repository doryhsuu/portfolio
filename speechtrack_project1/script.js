const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const backToTop = document.querySelector('.back-to-top');

menuButton?.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

document.querySelectorAll('.mobile-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  });
});

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 700);
});

backToTop?.addEventListener('click', () => {
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

/* =========================================================
   Header：往下滑隱藏、往上滑顯示
   ========================================================= */
const siteHeader = document.querySelector('.site-header');

let lastHeaderScrollY = window.scrollY;
let headerTicking = false;
const headerScrollThreshold = 12;

function updateSiteHeaderVisibility() {
  if (!siteHeader) {
    headerTicking = false;
    return;
  }

  const currentScrollY = window.scrollY;
  const scrollDifference = currentScrollY - lastHeaderScrollY;

  /* 靠近頁面頂部時一定顯示 */
  if (currentScrollY <= 80) {
    siteHeader.classList.remove('header-hidden');
    lastHeaderScrollY = currentScrollY;
  }
  /* 超過滑動門檻才判斷方向，避免輕微滾動造成閃爍 */
  else if (Math.abs(scrollDifference) >= headerScrollThreshold) {
    if (scrollDifference > 0) {
      /* 往下滑 */
      siteHeader.classList.add('header-hidden');
      mobileNav?.classList.remove('open');
    } else {
      /* 往上滑 */
      siteHeader.classList.remove('header-hidden');
    }

    lastHeaderScrollY = currentScrollY;
  }

  headerTicking = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (headerTicking) return;

    headerTicking = true;
    requestAnimationFrame(updateSiteHeaderVisibility);
  },
  { passive: true }
);

