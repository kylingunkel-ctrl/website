const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.toggleAttribute("data-open", !isOpen);
  });
}

document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));

const supportForm = document.querySelector("[data-support-form]");

if (supportForm) {
  supportForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const notice = supportForm.querySelector(".form-notice");
    if (notice) {
      notice.textContent = "Your report remains in this browser session. No external submission is connected on this page.";
    }
  });
}

const motionVideos = document.querySelectorAll("video.motion-media");

if (prefersReducedMotion) {
  motionVideos.forEach((video) => {
    video.pause();
    video.removeAttribute("autoplay");
  });
} else if ("IntersectionObserver" in window) {
  const mediaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (!(video instanceof HTMLVideoElement)) return;
        if (entry.isIntersecting) {
          const playAttempt = video.play();
          if (playAttempt && typeof playAttempt.catch === "function") {
            playAttempt.catch(() => {});
          }
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: "360px 0px", threshold: 0.05 }
  );

  motionVideos.forEach((video) => mediaObserver.observe(video));
}
