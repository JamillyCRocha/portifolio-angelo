(() => {
  "use strict";

  (function () {
    const links = Array.from(document.querySelectorAll(".nav__link"));
    if (!links.length) return;

    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    if (!sections.length) return;

    function setActiveById(id) {
      links.forEach((l) =>
        l.classList.toggle("is-active", l.getAttribute("href") === `#${id}`)
      );
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActiveById(visible.target.id);
      },
      { threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    sections.forEach((sec) => observer.observe(sec));
  })();

  
  (function () {
    const menuBtn = document.getElementById("menuBtn");
    const mobileNav = document.getElementById("mobileNav");
    if (!menuBtn || !mobileNav) return;

    function close() {
      mobileNav.hidden = true;
      menuBtn.setAttribute("aria-expanded", "false");
    }

    menuBtn.addEventListener("click", () => {
      const open = !mobileNav.hidden;
      mobileNav.hidden = open;
      menuBtn.setAttribute("aria-expanded", String(!open));
    });

    mobileNav.addEventListener("click", (e) => {
      if (e.target.closest("a")) close();
    });
  })();

  
  (function () {
    document.documentElement.classList.add("preload");
    const els = Array.from(document.querySelectorAll(".reveal"));

    if (els.length) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );

      els.forEach((el) => obs.observe(el));
    }

    window.addEventListener("load", () => {
      document.documentElement.classList.remove("preload");
      requestAnimationFrame(() => {
        els.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
            el.classList.add("is-in");
          }
        });
      });
    });
  })();

  (function () {
    window.addEventListener("load", () => {
      const el = document.querySelector(".prompt");
      if (!el) return;

      const text = el.textContent.trim();
      if (!text) return;

      el.textContent = "";
      let i = 0;

      function type() {
        el.textContent = text.slice(0, i);
        i++;
        if (i <= text.length) setTimeout(type, 70);
      }

      setTimeout(type, 600);
    });
  })();

 
  (function () {
    const tabs = document.querySelectorAll(".showcase__tab");
    const panels = document.querySelectorAll(".showcase__panel");
    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;

        tabs.forEach((t) => t.classList.remove("is-active"));
        panels.forEach((p) => p.classList.remove("is-active"));

        tab.classList.add("is-active");
        document
          .querySelector(`.showcase__panel[data-panel="${target}"]`)
          ?.classList.add("is-active");
      });
    });
  })();

  
  (function () {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    if (!lb || !img) return;

    document.querySelectorAll(".cert-card").forEach((card) => {
      card.addEventListener("click", () => {
        const full = card.dataset.full;
        if (!full) return;

        img.src = full;
        img.alt = card.querySelector("img")?.alt || "Certificado";
        lb.classList.add("is-open");
        lb.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    function close() {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      img.src = "";
    }

    lb.addEventListener("click", (e) => {
      if (
        e.target.matches('[data-close="true"]') ||
        e.target.classList.contains("lightbox__backdrop")
      ) {
        close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  })();


  (function () {
    const reelsGrid = document.getElementById("reelsGrid");
    const modal = document.getElementById("reelModal");
    const body = document.getElementById("reelModalBody");
    if (!reelsGrid || !modal || !body) return;

    const isOpen = () => modal.classList.contains("is-open");

    function ensureInstagramEmbedScript(cb) {
      
      if (window.instgrm?.Embeds?.process) {
        cb?.();
        return;
      }

      if (window.__igEmbedLoading) return;
      if (window.__igEmbedLoaded) return;

      window.__igEmbedLoading = true;
      const s = document.createElement("script");
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      s.onload = () => {
        window.__igEmbedLoaded = true;
        window.__igEmbedLoading = false;
        cb?.();
      };
      s.onerror = () => {
        window.__igEmbedLoading = false;
      };
      document.body.appendChild(s);
    }

    function processEmbed() {
      window.instgrm?.Embeds?.process?.();
    }

    function openReel(permalink) {
      if (!permalink || permalink.includes("SEU_ID")) {
        alert("Troque SEU_ID pelo link real do Reel no data-permalink.");
        return;
      }

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      body.innerHTML = `
        <div class="reelLoader">
          <div class="spinner"></div>
          <p>Carregando vídeo…</p>
        </div>
      `;

      const embed = document.createElement("blockquote");
      embed.className = "instagram-media";
      embed.setAttribute("data-instgrm-permalink", permalink);
      embed.setAttribute("data-instgrm-version", "14");
      embed.style.width = "100%";
      embed.style.margin = "0";

      body.innerHTML = "";
      body.appendChild(embed);

      ensureInstagramEmbedScript(() => {
        processEmbed();
        setTimeout(processEmbed, 300);
        setTimeout(processEmbed, 900);
        setTimeout(processEmbed, 1500);
      });
    }

    function closeReel() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      body.innerHTML = "";
    }

    reelsGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".nf-card[data-permalink]");
      if (!card) return;
      e.preventDefault();

      const permalink = card.getAttribute("data-permalink");
      openReel(permalink);
    });

    modal.addEventListener("click", (e) => {
      if (e.target.matches('[data-close="true"]')) closeReel();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) closeReel();
    });
  })();
})();


window.googleTranslateElementInit = function () {
  if (!document.getElementById("google_translate_element")) return;

  new google.translate.TranslateElement(
    {
      pageLanguage: "pt",
      includedLanguages: "pt,en,zh-CN,es,fr",
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    },
    "google_translate_element"
  );
};