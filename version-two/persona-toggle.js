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

  function syncCheckboxIcon(checkbox) {
    var label = checkbox.closest('.bp-checkbox');
    if (!label) return;
    var existing = label.querySelector('.bp-checkbox-icon') || label.querySelector('svg[data-icon]');
    if (existing) existing.remove();

    var iconClass = 'fa-regular fa-square';
    if (checkbox.indeterminate) {
      iconClass = 'fa-solid fa-square-minus';
      label.classList.add('bp-checkbox--indeterminate');
    } else {
      label.classList.remove('bp-checkbox--indeterminate');
      if (checkbox.checked) iconClass = 'fa-solid fa-square-check';
    }
    var icon = document.createElement('i');
    icon.className = 'bp-checkbox-icon ' + iconClass;
    label.appendChild(icon);
  }

  function initCheckboxes() {
    var checkboxes = document.querySelectorAll('.bp-checkbox input[type="checkbox"]');
    checkboxes.forEach(function(cb) { syncCheckboxIcon(cb); });

    document.addEventListener('change', function(e) {
      if (!e.target.matches('.bp-checkbox input[type="checkbox"]')) return;
      syncCheckboxIcon(e.target);
    });
  }

  window.syncCheckboxIcon = syncCheckboxIcon;

  function init() {
    injectToggle();
    applyPersona(getStoredPersona());
    initCheckboxes();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
