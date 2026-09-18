const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const year = document.querySelector("#year");
const cvDownload = document.querySelector(".cv-download");

if (cvDownload) {
  document.addEventListener("click", (event) => {
    if (!cvDownload.contains(event.target) || event.target.closest(".cv-options a")) {
      cvDownload.open = false;
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cvDownload.open) {
      cvDownload.open = false;
      cvDownload.querySelector("summary").focus();
    }
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

const header = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const navTargets = navLinks.map((link) => document.querySelector(link.hash));

function updateNavigation() {
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  document.documentElement.style.setProperty("--header-height", `${headerHeight + 20}px`);
  if (!navLinks.length) return;

  let activeIndex = 0;
  navTargets.forEach((target, index) => {
    if (target && target.getBoundingClientRect().top <= headerHeight + 40) {
      activeIndex = index;
    }
  });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    activeIndex = navLinks.length - 1;
  }
  navLinks.forEach((link, index) => {
    if (index === activeIndex) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

let navigationFramePending = false;
window.addEventListener("scroll", () => {
  if (!navigationFramePending) {
    navigationFramePending = true;
    requestAnimationFrame(() => {
      updateNavigation();
      navigationFramePending = false;
    });
  }
}, { passive: true });
window.addEventListener("resize", updateNavigation);
if (header) {
  new ResizeObserver(updateNavigation).observe(header);
}
updateNavigation();

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}
