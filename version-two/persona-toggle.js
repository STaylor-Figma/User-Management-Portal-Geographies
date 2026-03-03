/* ============================================================================
   PERSONA TOGGLE — Shared across all prototype pages
   Manages Admin vs Owner state, persists across page navigation
   ============================================================================ */

(function() {
  var STORAGE_KEY = 'ump-persona';

  function getStoredPersona() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'admin';
    } catch (e) {
      return 'admin';
    }
  }

  function storePersona(persona) {
    try {
      localStorage.setItem(STORAGE_KEY, persona);
    } catch (e) {}
  }

  function applyPersona(persona) {
    var body = document.body;
    if (persona === 'owner') {
      body.classList.add('is-owner');
    } else {
      body.classList.remove('is-owner');
    }

    var btnAdmin = document.getElementById('persona-btn-admin');
    var btnOwner = document.getElementById('persona-btn-owner');
    if (btnAdmin) btnAdmin.classList.toggle('active', persona === 'admin');
    if (btnOwner) btnOwner.classList.toggle('active', persona === 'owner');

    storePersona(persona);
  }

  window.setPagePersona = function(persona) {
    applyPersona(persona);
  };

  function injectToggle() {
    if (document.getElementById('persona-toggle')) return;

    var toggle = document.createElement('div');
    toggle.id = 'persona-toggle';
    toggle.className = 'persona-toggle';
    toggle.innerHTML =
      '<span class="persona-toggle__label">View as:</span>' +
      '<button class="persona-toggle__btn" id="persona-btn-admin" onclick="setPagePersona(\'admin\')">Admin</button>' +
      '<button class="persona-toggle__btn" id="persona-btn-owner" onclick="setPagePersona(\'owner\')">Owner</button>';
    document.body.appendChild(toggle);
  }

  function init() {
    injectToggle();
    applyPersona(getStoredPersona());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
