const academics = [
  {
    order: 3,
    level: "Matric",
    school: "F.C Public School Balambat Timergara, Dir Lower",
    qualification: "Secondary School Certificate",
    year: 2021
  },
  {
    order: 2,
    level: "College",
    school: "Islamia Model College Timergara, Dir Lower",
    qualification: "Higher Secondary Certificate",
    year: 2025
  },
  {
    order: 1,
    level: "University",
    school: "University of Engineering and Technology Abbotabad Campus",
    qualification: "BCS",
    year: 2025
  }
];

const galleryItems = [
  {
    src: "images/uet 0.jpg",
    caption: "UET Abbotabad Campus"
  },
  {
    src: "images/uet 1.jpg",
    caption: "UET Abbotabad Campus in Spring"
  },
  {
    src: "images/uet 2.jpg",
    caption: "UET Abbotabad Campus in Winter"
  }
];

const state = {
  sortKey: "order",
  sortDirection: "asc"
};

const getElement = (selector) => document.querySelector(selector);
const getAll = (selector) => Array.from(document.querySelectorAll(selector));

const applyTheme = (theme) => {
  document.body.classList.toggle("theme-dark", theme === "dark");
  document.body.classList.toggle("theme-light", theme !== "dark");
  const toggle = getElement("#themeToggle");
  if (toggle) {
    toggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }
};

const renderAcademicsTable = () => {
  const tbody = getElement("#academicsTable tbody");
  const searchInput = getElement("#searchInput");
  const filter = getElement("#levelFilter");

  const searchTerm = searchInput.value.toLowerCase();
  const levelFilter = filter.value;

  const filtered = academics
    .filter((entry) => levelFilter === "all" || entry.level === levelFilter)
    .filter((entry) =>
      `${entry.school} ${entry.qualification}`.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      const direction = state.sortDirection === "asc" ? 1 : -1;
      if (a[state.sortKey] < b[state.sortKey]) return -1 * direction;
      if (a[state.sortKey] > b[state.sortKey]) return 1 * direction;
      return 0;
    });

  tbody.innerHTML = "";

  filtered.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.level}</td>
      <td>${entry.school}</td>
      <td>${entry.qualification}</td>
      <td>${entry.year}</td>
    `;
    tbody.appendChild(row);
  });
};

const setupTableSorting = () => {
  getAll("#academicsTable th").forEach((header) => {
    header.addEventListener("click", () => {
      const key = header.dataset.key;
      if (state.sortKey === key) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = key;
        state.sortDirection = "asc";
      }
      renderAcademicsTable();
    });
  });
};

const setupCvViewer = () => {
  const link = getElement("#cvLink");
  const panel = getElement("#cvPanel");
  const viewer = getElement("#cvViewer");
  const close = getElement("#closeCv");

  link.addEventListener("click", (event) => {
    event.preventDefault();
    viewer.src = "./assets/Sohail-CV.pdf#view=FitH";
    panel.classList.add("active");
  });

  close.addEventListener("click", () => {
    viewer.src = "";
    panel.classList.remove("active");
  });
};

const setupThemeToggle = () => {
  const toggle = getElement("#themeToggle");
  const savedTheme = localStorage.getItem("portfolio-theme") || "light";
  applyTheme(savedTheme);

  toggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
    localStorage.setItem("portfolio-theme", nextTheme);
    applyTheme(nextTheme);
  });
};

const setupNavigation = () => {
  const toggle = getElement(".nav-toggle");
  const menu = getElement(".nav-menu");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  getAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
};

const setupProgressTracker = () => {
  const cards = getAll(".progress-card");
  cards.forEach((card) => {
    const value = Number(card.dataset.progress || 0);
    const bar = card.querySelector(".progress-bar span");
    const label = card.querySelector(".progress-value");
    bar.style.width = "0";
    label.textContent = `${value}%`;
    requestAnimationFrame(() => {
      bar.style.width = `${value}%`;
    });
  });
};

const setupGallery = () => {
  const image = getElement("#galleryImage");
  const caption = getElement("#galleryCaption");
  const prev = getElement("#prevGallery");
  const next = getElement("#nextGallery");
  let index = 0;

  const render = () => {
    image.src = galleryItems[index].src;
    image.alt = galleryItems[index].caption;
    caption.textContent = galleryItems[index].caption;
  };

  prev.addEventListener("click", () => {
    index = (index - 1 + galleryItems.length) % galleryItems.length;
    render();
  });

  next.addEventListener("click", () => {
    index = (index + 1) % galleryItems.length;
    render();
  });
};

const setupCarousel = () => {
  const track = getElement("#heroCarousel");
  const prev = getElement("#carouselPrev");
  const next = getElement("#carouselNext");
  const dotsWrap = getElement("#carouselDots");

  if (!track || !prev || !next || !dotsWrap) return;

  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  let index = 0;
  let timer = null;

  const setActive = (nextIndex) => {
    slides[index].classList.remove("is-active");
    dotsWrap.children[index].classList.remove("active");
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add("is-active");
    dotsWrap.children[index].classList.add("active");
  };

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => {
      setActive(i);
      restart();
    });
    dotsWrap.appendChild(dot);
  });

  const advance = () => setActive(index + 1);

  const restart = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(advance, 5000);
  };

  prev.addEventListener("click", () => {
    setActive(index - 1);
    restart();
  });

  next.addEventListener("click", () => {
    setActive(index + 1);
    restart();
  });

  track.addEventListener("mouseenter", () => timer && clearInterval(timer));
  track.addEventListener("mouseleave", restart);

  setActive(0);
  restart();
};

const setupFormValidation = () => {
  const form = getElement("#contactForm");
  const status = getElement("#formStatus");

  const showStatus = (message, ok = false) => {
    status.textContent = message;
    status.style.color = ok ? "#16a34a" : "#ef4444";
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = getElement("#fullName").value.trim();
    const email = getElement("#email").value.trim();
    const message = getElement("#message").value.trim();

    if (name.length < 2) {
      showStatus("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus("Please provide a valid email address.");
      return;
    }

    if (message.length < 10) {
      showStatus("Please enter a message with at least 10 characters.");
      return;
    }

    showStatus("Thanks! Your message is ready to be sent.", true);
    form.reset();
  });
};

const setupFilters = () => {
  getElement("#searchInput").addEventListener("input", renderAcademicsTable);
  getElement("#levelFilter").addEventListener("change", renderAcademicsTable);
};

const init = () => {
  setupNavigation();
  setupThemeToggle();
  setupCvViewer();
  setupCarousel();
  setupGallery();
  setupFormValidation();
  setupTableSorting();
  setupFilters();
  renderAcademicsTable();
  setupProgressTracker();
};

document.addEventListener("DOMContentLoaded", init);
