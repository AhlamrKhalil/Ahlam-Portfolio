/* Current-section highlight in the nav */
const navLinks = document.querySelectorAll(".nav-list a");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length && "IntersectionObserver" in window) {
  const setCurrent = (id) => {
    navLinks.forEach((link) => {
      const on = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-current", on);
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };
  const navObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
    { rootMargin: "-12% 0px -78% 0px", threshold: 0 }
  );
  sections.forEach((s) => navObserver.observe(s));
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Gentle reveal on scroll (content stays visible if JS or IntersectionObserver is missing) */
const revealEls = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* Soft cursor spotlight: only for fine pointers that can hover, and not with reduced motion */
const spot = document.querySelector(".spot");
const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)");
if (spot && fineHover.matches && !reduceMotion.matches) {
  let tx = window.innerWidth / 2, ty = window.innerHeight / 3;
  let x = tx, y = ty, running = false;

  const frame = () => {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    spot.style.setProperty("--x", `${x.toFixed(1)}px`);
    spot.style.setProperty("--y", `${y.toFixed(1)}px`);
    if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) requestAnimationFrame(frame);
    else running = false;
  };

  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    spot.classList.add("on");
    if (!running) { running = true; requestAnimationFrame(frame); }
  }, { passive: true });

  document.documentElement.addEventListener("pointerleave", () => spot.classList.remove("on"));
}
