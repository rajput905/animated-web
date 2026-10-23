(() => {
  "use strict";

  const root = document.documentElement;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  root.classList.add("js");

  // ---------- Play an Animate.css animation once, then clean up ----------
  function playAnimation(el, animationClass, delay) {
    el.classList.add("is-revealed");
    if (prefersReduced || !animationClass) return;

    if (delay) el.style.setProperty("--animate-delay", delay);
    el.classList.add("animate__animated", animationClass);

    el.addEventListener("animationend", () => {
      el.classList.remove("animate__animated", animationClass);
      el.style.removeProperty("--animate-delay");
    }, { once: true });
  }

  // ---------- Theme (light/dark, remembers the choice) ----------
  const themeToggle = $("#themeToggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {
      /* storage unavailable, ignore */
    }
  }

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("theme");
  } catch (_) {
    /* ignore */
  }

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (systemDark ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  // ---------- Header border after scrolling, mobile menu ----------
  const header = $("#siteHeader");
  const nav = $("#nav");
  const menuToggle = $("#menuToggle");

  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  $$("a", nav).forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });

  // ---------- Hero: animate on load ----------
  $$(".hero [data-anim]").forEach((el) => {
    playAnimation(el, el.dataset.anim, el.dataset.delay);
  });

  // ---------- Everything else: animate when scrolled into view ----------
  const revealTargets = $$("[data-reveal]").filter((el) => !el.closest(".hero"));

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-revealed"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        playAnimation(el, el.dataset.anim, el.dataset.delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.15 });

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  // ---------- Stats counters ----------
  function countUp(el) {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || "";

    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  $$(".counter").forEach((el) => counterObserver.observe(el));

  // ---------- Contact form validation ----------
  const form = $("#contactForm");
  const status = $("#formStatus");

  const rules = {
    name: (value) => (value.length < 2 ? "Please enter your name." : ""),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Please enter a valid email address.",
    message: (value) =>
      value.length < 15 ? "A few more words would help me understand the project." : ""
  };

  function validateField(input) {
    const wrapper = input.closest(".field");
    const message = rules[input.name](input.value.trim());
    wrapper.querySelector(".error").textContent = message;
    wrapper.classList.toggle("invalid", Boolean(message));
    return message === "";
  }

  $$("input, textarea", form).forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.value.trim()) validateField(input);
    });

    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("invalid")) {
        validateField(input);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = $$("input, textarea", form);
    const results = fields.map(validateField);
    const firstInvalidIndex = results.indexOf(false);

    if (firstInvalidIndex !== -1) {
      const firstInvalid = fields[firstInvalidIndex];
      firstInvalid.focus();

      if (!prefersReduced) {
        const wrapper = firstInvalid.closest(".field");
        wrapper.classList.remove("animate__animated", "animate__headShake");
        void wrapper.offsetWidth; // restart the animation on repeat submits
        wrapper.classList.add("animate__animated", "animate__headShake");
      }

      status.textContent = "";
      return;
    }

    // No backend here. Replace this with a fetch to your server or a form service like Formspree.
    status.textContent = "Thanks, your message is noted. I will reply within two working days.";
    form.reset();
  });

  // ---------- Footer year ----------
  $("#year").textContent = new Date().getFullYear();
})();