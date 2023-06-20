const SIMPLE_SETTINGS_STORAGE_KEY = "simpleNotesSettings";

const settings = (() => {
  function loadSettings() {
    let settings = JSON.parse(localStorage.getItem(SIMPLE_SETTINGS_STORAGE_KEY));

    for (const property in settings) {
      let test = `#${settings[property]}`;
      document.querySelector(test).checked = true
    }
  }

  function saveSettings() {
    localStorage.setItem(SIMPLE_SETTINGS_STORAGE_KEY, JSON.stringify([]));
    let inputs = document.querySelectorAll("input");
    let obj = {};

    for (let i = 0; i < inputs.length; i++) {
      let name = inputs[i].name;
      let id = inputs[i].id;

      if (inputs[i].checked === true) {
        obj[name] = id;
      }
    }
    localStorage.setItem(SIMPLE_SETTINGS_STORAGE_KEY, JSON.stringify(obj));
    window.location.href = "index.html";
  }

  return {
    loadSettings,
    saveSettings,
  };
})();
