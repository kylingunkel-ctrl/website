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

const videoModal = document.querySelector("[data-media-modal]");
const videoModalVideo = videoModal?.querySelector("[data-media-modal-video]");
const videoModalOpeners = document.querySelectorAll("[data-video-modal-open]");
const videoModalClosers = videoModal?.querySelectorAll("[data-video-modal-close]") ?? [];
let lastVideoModalTrigger = null;

const closeVideoModal = () => {
  if (!videoModal || !videoModalVideo) return;
  videoModal.hidden = true;
  document.body.classList.remove("modal-open");
  videoModalVideo.pause();
  videoModalVideo.currentTime = 0;
  lastVideoModalTrigger?.focus();
};

if (videoModal && videoModalVideo && videoModalOpeners.length > 0) {
  videoModalOpeners.forEach((button) => {
    button.addEventListener("click", () => {
      lastVideoModalTrigger = button;
      videoModal.hidden = false;
      document.body.classList.add("modal-open");
      const playAttempt = videoModalVideo.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
      }
      window.setTimeout(() => videoModalVideo.focus(), 60);
    });
  });

  videoModalClosers.forEach((node) => {
    node.addEventListener("click", closeVideoModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !videoModal.hidden) {
      closeVideoModal();
    }
  });
}
