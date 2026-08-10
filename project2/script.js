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
   wide-image 自動輪播
   同一個 .wide-image 內有 2 張以上直接子層 img 時自動啟用。
   功能：自動播放、左右按鈕、圓點、鍵盤、手機左右滑動。
   ========================================================= */
document.querySelectorAll('.wide-image').forEach((carousel, carouselIndex) => {
  const images = Array.from(carousel.children).filter(
    (child) => child.tagName === 'IMG'
  );

  // 只有一張圖時維持原本 wide-image，不建立輪播 UI
  if (images.length < 2) return;

  carousel.classList.add('is-carousel');
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-roledescription', 'carousel');
  carousel.setAttribute('aria-label', `圖片輪播 ${carouselIndex + 1}`);

  const viewport = document.createElement('div');
  viewport.className = 'wide-carousel-viewport';

  const track = document.createElement('div');
  track.className = 'wide-carousel-track';

  images.forEach((img, index) => {
    const slide = document.createElement('div');
    slide.className = 'wide-carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} / ${images.length}`);

    carousel.removeChild(img);
    slide.appendChild(img);
    track.appendChild(slide);
  });

  viewport.appendChild(track);
  carousel.appendChild(viewport);

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'wide-carousel-button wide-carousel-prev';
  prevButton.setAttribute('aria-label', '上一張圖片');
  prevButton.innerHTML = '&#8249;';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'wide-carousel-button wide-carousel-next';
  nextButton.setAttribute('aria-label', '下一張圖片');
  nextButton.innerHTML = '&#8250;';

  const dots = document.createElement('div');
  dots.className = 'wide-carousel-dots';
  dots.setAttribute('aria-label', '選擇圖片');

  const dotButtons = images.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'wide-carousel-dot';
    dot.setAttribute('aria-label', `顯示第 ${index + 1} 張圖片`);
    dot.addEventListener('click', () => {
      goTo(index);
      restartAutoPlay();
    });
    dots.appendChild(dot);
    return dot;
  });

  carousel.append(prevButton, nextButton, dots);

  let currentIndex = 0;
  let autoPlayId = null;
  let touchStartX = 0;
  let touchDeltaX = 0;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


  // 讓輪播容器高度永遠跟著「目前顯示的圖片」，
  // 避免其他較高圖片把圓點位置撐到目前圖片外面。
  function syncViewportHeight() {
    const activeSlide = track.children[currentIndex];
    const activeImage = activeSlide?.querySelector('img');

    if (!activeImage) return;

    const applyHeight = () => {
      // 使用實際渲染後的圖片高度，而不是整條 track 的最高高度
      const imageHeight = activeImage.getBoundingClientRect().height;

      if (imageHeight > 0) {
        viewport.style.height = `${imageHeight}px`;
      }
    };

    if (activeImage.complete) {
      requestAnimationFrame(applyHeight);
    } else {
      activeImage.addEventListener('load', applyHeight, { once: true });
    }
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dotButtons.forEach((dot, index) => {
      const active = index === currentIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });

    syncViewportHeight();
  }

  function goTo(index) {
    currentIndex = (index + images.length) % images.length;
    updateCarousel();
  }

  function nextSlide() {
    goTo(currentIndex + 1);
  }

  function previousSlide() {
    goTo(currentIndex - 1);
  }

  function stopAutoPlay() {
    if (autoPlayId !== null) {
      window.clearInterval(autoPlayId);
      autoPlayId = null;
    }
  }

  function startAutoPlay() {
    if (prefersReducedMotion || document.hidden) return;
    stopAutoPlay();
    autoPlayId = window.setInterval(nextSlide, 4500);
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  prevButton.addEventListener('click', () => {
    previousSlide();
    restartAutoPlay();
  });

  nextButton.addEventListener('click', () => {
    nextSlide();
    restartAutoPlay();
  });

  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);
  carousel.addEventListener('focusin', stopAutoPlay);
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) startAutoPlay();
  });

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      previousSlide();
      restartAutoPlay();
    } else if (event.key === 'ArrowRight') {
      nextSlide();
      restartAutoPlay();
    }
  });

  carousel.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.touches[0].clientX;
      touchDeltaX = 0;
      stopAutoPlay();
    },
    { passive: true }
  );

  carousel.addEventListener(
    'touchmove',
    (event) => {
      touchDeltaX = event.touches[0].clientX - touchStartX;
    },
    { passive: true }
  );

  carousel.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) > 45) {
      if (touchDeltaX < 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }
    startAutoPlay();
  });

  let resizeFrame = null;

  window.addEventListener('resize', () => {
    if (resizeFrame !== null) {
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(() => {
      syncViewportHeight();
      resizeFrame = null;
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  updateCarousel();
  startAutoPlay();
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

