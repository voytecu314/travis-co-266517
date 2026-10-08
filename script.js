"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  navLinks.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

const revealElements = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const counterElements = document.querySelectorAll("[data-count]");
function animateCounter(element) {
  const target = Number(element.dataset.count);
  const duration = 1300;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = `${Math.round(target * eased).toLocaleString()}${element.dataset.suffix || "+"}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window && !reducedMotion) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterElements.forEach((element) => counterObserver.observe(element));
} else {
  counterElements.forEach((element) => {
    element.textContent = `${Number(element.dataset.count).toLocaleString()}${element.dataset.suffix || "+"}`;
  });
}

const parallaxElements = document.querySelectorAll("[data-parallax]");
let parallaxQueued = false;
function updateParallax() {
  const scrollY = window.scrollY;
  parallaxElements.forEach((element) => {
    const speed = Number(element.dataset.parallax);
    const offset = -scrollY * speed;
    element.style.setProperty("--parallax-offset", `${Math.round(offset)}px`);
  });
  parallaxQueued = false;
}
if (!reducedMotion && parallaxElements.length) {
  window.addEventListener("scroll", () => {
    if (!parallaxQueued) {
      window.requestAnimationFrame(updateParallax);
      parallaxQueued = true;
    }
  }, { passive: true });
}

const slides = [...document.querySelectorAll(".testimonial-slide")];
const currentSlideLabel = document.querySelector("#slide-current");
let activeSlide = 0;
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
    slide.setAttribute("aria-hidden", String(slideIndex !== activeSlide));
  });
  currentSlideLabel.textContent = String(activeSlide + 1).padStart(2, "0");
}
document.querySelector("#prev-story").addEventListener("click", () => showSlide(activeSlide - 1));
document.querySelector("#next-story").addEventListener("click", () => showSlide(activeSlide + 1));
showSlide(0);

const contactForm = document.querySelector("#contact-form");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.querySelector("#contact-status");
  if (!contactForm.reportValidity()) return;
  status.textContent = "Thanks for reaching out. This demo form is ready to connect to our intake team.";
  contactForm.reset();
});

const newsletterForm = document.querySelector("#newsletter-form");
newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!newsletterForm.reportValidity()) return;
  document.querySelector("#newsletter-status").textContent = "You’re on the list. Thanks for being here.";
  newsletterForm.reset();
});

document.querySelector("#year").textContent = new Date().getFullYear();
