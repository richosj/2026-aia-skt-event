(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
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
  var _a;
  initModals();
  const form = document.getElementById("gift-form");
  const consent = document.getElementById("modal-consent");
  const complete = document.getElementById("modal-complete");
  form == null ? void 0 : form.addEventListener("submit", (e) => {
    e.preventDefault();
    openModal(consent);
  });
  (_a = document.getElementById("btn-consent-ok")) == null ? void 0 : _a.addEventListener("click", () => {
    closeModal(consent);
    openModal(complete);
  });
}
function initModalsDemoPage() {
  var _a, _b;
  initModals();
  const consent = document.getElementById("modal-consent");
  const complete = document.getElementById("modal-complete");
  (_a = document.querySelector(".demo-open-consent")) == null ? void 0 : _a.addEventListener("click", () => {
    openModal(consent);
  });
  (_b = document.querySelector(".demo-open-complete")) == null ? void 0 : _b.addEventListener("click", () => {
    openModal(complete);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "gift") initGift();
  else if (page === "modals") initModalsDemoPage();
});
