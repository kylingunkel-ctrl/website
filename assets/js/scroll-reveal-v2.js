document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const main = document.querySelector("main");
  if (!main) return;

  const directSections = Array.from(main.children).filter(
    (element) => element.tagName === "SECTION"
  );
  const candidates =
    directSections.length >= 3
      ? directSections
      : Array.from(main.querySelectorAll("section"));
  const targets = [...new Set(candidates)].filter(
    (element) => element.getBoundingClientRect().height >= 100
  );

  targets.forEach((element) => element.classList.add("ls-scroll-reveal-v2"));

  const reveal = (element) => element.classList.add("is-visible");
  const initiallyVisible = targets.filter(
    (element) => element.getBoundingClientRect().top < window.innerHeight * 0.88
  );
  initiallyVisible.forEach(reveal);

  const pending = targets.filter(
    (element) => !element.classList.contains("is-visible")
  );

  if (!("IntersectionObserver" in window)) {
    pending.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );

  pending.forEach((element) => observer.observe(element));
});
