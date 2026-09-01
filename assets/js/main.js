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
  const notice = supportForm.querySelector(".form-notice");
  const emailButton = supportForm.querySelector("[data-support-email]");
  const copyButton = supportForm.querySelector("[data-support-copy]");

  const setSupportNotice = (message) => {
    if (notice) {
      notice.textContent = message;
    }
  };

  const getFieldValue = (name) => {
    const field = supportForm.elements.namedItem(name);
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return "";
    return field.value.trim();
  };

  const buildSupportMessage = () => {
    return [
      "FolderStream Support Request",
      "",
      `Issue:`,
      getFieldValue("issue") || "[not provided]",
      "",
      `What I was trying to do:`,
      getFieldValue("trying") || "[not provided]",
      "",
      `What happened:`,
      getFieldValue("happened") || "[not provided]",
      "",
      `Error message:`,
      getFieldValue("error") || "[not provided]",
      "",
      `FolderStream version:`,
      getFieldValue("localstreamVersion") || "[not provided]",
      "",
      `Windows version:`,
      getFieldValue("windowsVersion") || "[not provided]",
      "",
      `Does it happen every time?:`,
      getFieldValue("frequency") || "[not provided]",
      "",
      `Anything else that may help:`,
      getFieldValue("extra") || "[not provided]"
    ]
      .join("\n")
      .trim();
  };

  const openSupportEmail = () => {
    const subject = encodeURIComponent("FolderStream Support Request");
    const body = encodeURIComponent(buildSupportMessage());
    window.location.href = `mailto:support@localstream.co.nz?subject=${subject}&body=${body}`;
    setSupportNotice("Opening your email app with a FolderStream support draft. Nothing has been sent automatically.");
  };

  const copySupportDetails = async () => {
    const message = buildSupportMessage();

    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
      setSupportNotice("Clipboard access is unavailable here. Copy the support details manually and email them to support@localstream.co.nz.");
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      setSupportNotice("Support details copied. Email them to support@localstream.co.nz.");
    } catch {
      setSupportNotice("We could not copy the support details automatically. Copy them manually and email support@localstream.co.nz.");
    }
  };

  if (emailButton) {
    emailButton.addEventListener("click", openSupportEmail);
  }

  if (copyButton) {
    copyButton.addEventListener("click", () => {
      void copySupportDetails();
    });
  }
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

const downloadModal = document.querySelector("[data-download-modal]");
const downloadConfirmLinks = document.querySelectorAll("[data-download-confirm]");
const downloadCancelButtons = downloadModal?.querySelectorAll("[data-download-cancel]") ?? [];
const downloadContinueLink = downloadModal?.querySelector("[data-download-continue]");
let lastDownloadTrigger = null;

const closeDownloadModal = () => {
  if (!downloadModal) return;
  downloadModal.hidden = true;
  document.body.classList.remove("modal-open");
  lastDownloadTrigger?.focus();
};

if (downloadModal && downloadConfirmLinks.length > 0 && downloadContinueLink) {
  downloadConfirmLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      lastDownloadTrigger = link;
      downloadContinueLink.setAttribute("href", link.getAttribute("href") || "download-windows.html");
      downloadModal.hidden = false;
      document.body.classList.add("modal-open");
      window.setTimeout(() => downloadContinueLink.focus(), 60);
    });
  });

  downloadCancelButtons.forEach((node) => {
    node.addEventListener("click", closeDownloadModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !downloadModal.hidden) {
      closeDownloadModal();
    }
  });
}
