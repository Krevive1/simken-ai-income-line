(function () {
  document.documentElement.classList.add("js-enabled");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector("#site-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });
  }

  const filterButtons = document.querySelectorAll("[data-filter]");
  const articleCards = document.querySelectorAll("[data-category]");
  if (filterButtons.length && articleCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        articleCards.forEach((card) => {
          const show = filter === "all" || card.dataset.category === filter;
          card.hidden = !show;
        });
      });
    });
  }

  document.querySelectorAll("[data-contact-link]").forEach((node) => {
    if (typeof CONTACT_FORM_URL === "string" && CONTACT_FORM_URL && CONTACT_FORM_URL !== "REPLACE_WITH_GOOGLE_FORM_URL") {
      node.setAttribute("href", CONTACT_FORM_URL);
      node.textContent = "お問い合わせフォームを開く";
      node.removeAttribute("aria-disabled");
    } else {
      node.removeAttribute("href");
      node.setAttribute("aria-disabled", "true");
      node.textContent = "お問い合わせフォームは現在準備中です";
    }
  });

  document.querySelectorAll("[data-x-link]").forEach((node) => {
    if (typeof X_URL === "string" && X_URL) {
      node.setAttribute("href", X_URL);
      node.textContent = "Xを見る";
    } else {
      node.removeAttribute("href");
      node.textContent = "Xは公開準備中";
    }
  });

  const statusList = document.querySelector("[data-experiment-status]");
  if (statusList && typeof SIMKEN_CONFIG === "object") {
    statusList.innerHTML = "";
    SIMKEN_CONFIG.experimentStatus.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${item.label}</span><strong>${item.state}</strong>`;
      li.dataset.state = item.state;
      statusList.appendChild(li);
    });
  }

  const makeVisible = (nodes) => {
    nodes.forEach((node) => node.classList.add("is-visible"));
  };

  const setDelay = (node, index, step = 80, max = 500) => {
    node.style.setProperty("--delay", `${Math.min(index * step, max)}ms`);
  };

  const setupHeroAnimation = () => {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const heroStages = [
      ".hero .eyebrow",
      ".hero-title",
      ".hero .lead",
      ".core-copy",
      ".hero-description",
      ".reader-benefit",
      ".hero .actions",
      ".line-console"
    ]
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);

    heroStages.forEach((node, index) => {
      node.classList.add("hero-stage");
      setDelay(node, index, 105, 780);
    });

    const lineRows = document.querySelectorAll(".line-console .line-item");
    lineRows.forEach((node, index) => {
      node.classList.add("hero-line-stage");
      node.style.setProperty("--delay", `${860 + Math.min(index * 100, 400)}ms`);
    });

    if (prefersReducedMotion) {
      makeVisible(heroStages);
      makeVisible(lineRows);
      window.setTimeout(() => document.querySelector(".line-console")?.classList.add("hero-animate"), 860);
      return;
    }

    requestAnimationFrame(() => {
      makeVisible(heroStages);
      makeVisible(lineRows);
      document.querySelector(".line-console")?.classList.add("hero-animate");
    });
  };

  const setupRevealAnimations = () => {
    const revealSelectors = [
      "main > section:not(.hero) .section-head",
      ".page-main .section-head",
      ".grid > .card",
      ".progress-grid > .card",
      ".status-list",
      ".filters",
      ".article-body > .breadcrumb",
      ".article-body > .badge",
      ".article-body > h1",
      ".article-body > .meta",
      ".article-body > .notice",
      ".evidence-section",
      ".toc-card",
      ".notice"
    ];

    const revealNodes = Array.from(document.querySelectorAll(revealSelectors.join(",")));
    const uniqueNodes = [...new Set(revealNodes)];
    uniqueNodes.forEach((node) => node.classList.add("reveal"));

    document.querySelectorAll(".article-body h2").forEach((heading) => {
      if (!heading.textContent.includes("関連記事")) return;
      heading.classList.add("reveal");
      const related = heading.nextElementSibling;
      if (related) related.classList.add("reveal");
    });

    document.querySelectorAll(".grid, .progress-grid").forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (child.classList.contains("reveal")) setDelay(child, index, 80, 480);
      });
    });

    document.querySelectorAll(".status-list li").forEach((node, index) => {
      node.classList.add("reveal");
      setDelay(node, index, 80, 480);
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      makeVisible(document.querySelectorAll(".reveal"));
      document.querySelectorAll(".status-list li").forEach((node) => node.classList.add("is-lit"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");

        if (entry.target.matches(".status-list")) {
          entry.target.querySelectorAll("li").forEach((node, index) => {
            window.setTimeout(() => node.classList.add("is-lit"), Math.min(index * 90, 500));
          });
        }

        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });

    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
  };

  const setupProgress = () => {
    const progressSection = document.querySelector("#progress");
    if (!progressSection) return;

    const revenue = typeof SIMKEN_CONFIG === "object" ? Number(SIMKEN_CONFIG.monthlyRevenue || 0) : 0;
    const goal = typeof SIMKEN_CONFIG === "object" ? Number(SIMKEN_CONFIG.monthlyGoal || 10000) : 10000;
    const percent = goal > 0 ? Math.max(0, Math.min(100, (revenue / goal) * 100)) : 0;

    document.querySelectorAll("[data-progress-bar]").forEach((bar) => {
      bar.style.setProperty("--progress", `${percent}%`);
    });

    const countNodes = progressSection.querySelectorAll("[data-count-to]");
    const showFinalValues = () => {
      countNodes.forEach((node) => {
        const value = Number(node.dataset.countTo || 0);
        const prefix = node.dataset.countPrefix || "";
        const suffix = node.dataset.countSuffix || "";
        node.textContent = `${prefix}${value.toLocaleString("ja-JP")}${suffix}`;
      });
    };

    const startCount = () => {
      if (prefersReducedMotion) {
        showFinalValues();
        return;
      }

      countNodes.forEach((node) => {
        const target = Number(node.dataset.countTo || 0);
        if (target === 0) return;

        const prefix = node.dataset.countPrefix || "";
        const suffix = node.dataset.countSuffix || "";
        const duration = 1100;
        const started = Date.now();
        const timer = window.setInterval(() => {
          const elapsed = Date.now() - started;
          const progress = Math.min(1, elapsed / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          node.textContent = `${prefix}${value.toLocaleString("ja-JP")}${suffix}`;
          if (progress >= 1) {
            node.textContent = `${prefix}${target.toLocaleString("ja-JP")}${suffix}`;
            window.clearInterval(timer);
          }
        }, 33);
      });
    };

    const activateProgress = () => {
      document.querySelectorAll("[data-progress-track]").forEach((track) => track.classList.add("is-visible"));
      startCount();
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      activateProgress();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activateProgress();
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    observer.observe(progressSection);
  };

  const setupBackToTop = () => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "back-to-top";
    button.setAttribute("aria-label", "ページ上部へ戻る");
    button.textContent = "↑";
    document.body.appendChild(button);

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    let ticking = false;
    const update = () => {
      button.classList.toggle("is-visible", window.scrollY > 600);
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  };

  try {
    setupHeroAnimation();
    setupRevealAnimations();
    setupProgress();
    setupBackToTop();
  } catch (error) {
    document.querySelectorAll(".hero-stage, .hero-line-stage, .reveal").forEach((node) => {
      node.classList.add("is-visible");
    });
    document.querySelectorAll("[data-progress-track]").forEach((track) => track.classList.add("is-visible"));
    console.error(error);
  }
})();
