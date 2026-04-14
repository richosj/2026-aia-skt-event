import "../scss/main.scss";

function openModal(root) {
  if (!root) return;
  root.classList.add("modal-root--open");
  root.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(root) {
  if (!root) return;
  root.classList.remove("modal-root--open");
  root.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function initModalLayer(root) {
  root.addEventListener("click", (e) => {
    if (e.target === root) closeModal(root);
  });
  root.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(root));
  });
}

function initModals(scope = document) {
  scope.querySelectorAll(".modal-root").forEach(initModalLayer);
}


function initGift() {
  initModals();

  document.querySelectorAll(".gift-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".gift-card").forEach((c) => {
        c.classList.remove("gift-card--selected");
        c.setAttribute("aria-checked", "false");
      });
      card.classList.add("gift-card--selected");
      card.setAttribute("aria-checked", "true");
    });
  });

  document.querySelectorAll(".gender-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".gender-toggle");
      group.querySelectorAll(".gender-btn").forEach((b) => {
        b.classList.remove("gender-btn--on");
      });
      btn.classList.add("gender-btn--on");
      const hidden = document.getElementById("f-gender");
      if (hidden) hidden.value = btn.dataset.gender || "";
    });
  });

  const form = document.getElementById("gift-form");
  const consent = document.getElementById("modal-consent");
  const complete = document.getElementById("modal-complete");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    openModal(consent);
  });

  document.getElementById("btn-consent-ok")?.addEventListener("click", () => {
    closeModal(consent);
    openModal(complete);
  });
}

function initModalsDemoPage() {
  initModals();
  const consent = document.getElementById("modal-consent");
  const complete = document.getElementById("modal-complete");
  document.querySelector(".demo-open-consent")?.addEventListener("click", () => {
    openModal(consent);
  });
  document.querySelector(".demo-open-complete")?.addEventListener("click", () => {
    openModal(complete);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "survey") initSurvey();
  else if (page === "gift") initGift();
  else if (page === "modals") initModalsDemoPage();
});
