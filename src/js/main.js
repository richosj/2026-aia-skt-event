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
  if (page === "gift") initGift();
  else if (page === "modals") initModalsDemoPage();
});
