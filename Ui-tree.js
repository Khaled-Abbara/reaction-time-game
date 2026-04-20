const getEl = (selector) => document.querySelector(`[data-ui="${selector}"]`);

const UI = {
  pages: {
    menu: getEl("menu-page"),
    normal: getEl("normal-mode-page"),
  },
  buttons: {
    startNormal: getEl("start-normal-mode-btn"),
  },
};

UI.buttons.startNormal.addEventListener("click", () => alert("hiii"));

export { UI };
