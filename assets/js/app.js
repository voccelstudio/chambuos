(function () {
  'use strict';

  /* ---- App config (single source of truth for brand + sidebar) ---- */
  var BRAND = 'Chambú';
  var SUBTITLE = 'Kitchen & Bar';
  var LOGO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4ecOo1YMfjxeYz6KrP9K_RxJzXmIqPAK-lja-PLppsaeMhvwCPXIDrbpfO2j9UrPNRG7tJ5Y3hhkOxG7vagwEjcF5JGvmrd4TS2tPvtlVYb3QOjWFtMdnclO_gtDHw-gKpMeHMiz4VR8wld3Qqb1hJAOPFYTNxZD9jEys61CeN6EmBzcKfNwShfsmHhZxszGQXS5JZOg_KyxzF1Sg5r9iimDNr4TqdlHRdmQrHHa4gDnojojZZqRy71lQsn0uORKpeQ';
  var NAV = [
    { page: 'index.html', icon: 'grid_view', label: 'Floor Map' },
    { page: 'pos.html', icon: 'receipt_long', label: 'POS & Billing' },
    { page: 'menu.html', icon: 'restaurant_menu', label: 'Menu Editor' },
    { page: 'inventory.html', icon: 'liquor', label: 'Bar & Inventory' },
    { page: 'shopping.html', icon: 'shopping_cart', label: 'Shopping List' },
    { page: 'kitchen.html', icon: 'oven_gen', label: 'Kitchen Display' },
    { page: 'analytics.html', icon: 'monitoring', label: 'Analytics' },
    { page: 'settings.html', icon: 'settings', label: 'Settings' },
    { page: 'support.html', icon: 'help_outline', label: 'Support' }
  ];
  var currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* ---- Generic helpers ---- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function money(n) {
    try {
      return 'Gs. ' + n.toLocaleString('es-PY', { maximumFractionDigits: 2 });
    } catch (e) { return 'Gs. ' + n.toFixed(2); }
  }

  function showToast(msg, ok) {
    var wrap = $('#toastWrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toastWrap';
      wrap.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none';
      document.body.appendChild(wrap);
    }
    var el = document.createElement('div');
    el.className = 'px-4 py-3 rounded-lg shadow-2xl font-label-md text-label-md border border-outline-variant/20 ' +
      (ok === false ? 'bg-error text-on-error' : 'bg-tertiary-container text-on-tertiary-container');
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(function () { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; }, 1800);
    setTimeout(function () { el.remove(); }, 2150);
  }

  function storeGet(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || 'null');
      return v === null ? fallback : v;
    } catch (e) { return fallback; }
  }

  function storeSet(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function modalShow(id) {
    var m = $(id);
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
  }

  function modalHide(id) {
    var m = $(id);
    if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
  }

  $$('[data-close-modal]').forEach(function (b) {
    b.addEventListener('click', function () { modalHide('#' + b.getAttribute('data-close-modal')); });
  });

  /* ---- Shared layout (injected into [data-layout-sidebar]/[data-layout-topbar]) ---- */
  function navLink(l) {
    var active = l.page === currentPage ? ' nav-active' : '';
    return '<a class="flex items-center gap-3 text-on-surface-variant hover:text-on-surface px-4 py-3 hover:bg-surface-container-high transition-all active:translate-x-1 duration-200 rounded-lg' + active + '" href="' + l.page + '">' +
      '<span class="material-symbols-outlined">' + l.icon + '</span>' +
      '<span class="font-label-md text-label-md">' + l.label + '</span>' +
      '</a>';
  }

  function buildSidebar() {
    var main = NAV.slice(0, 5).map(navLink).join('');
    var foot = NAV.slice(5).map(navLink).join('');
    return '<aside class="hidden md:flex flex-col h-full w-64 py-base gap-2 bg-surface-container dark:bg-surface-container border-r border-outline-variant/10 shrink-0 z-20">' +
      '<div class="px-4 py-4 mb-2 flex items-center gap-3">' +
        '<img alt="' + BRAND + ' Logo" class="w-10 h-10 shrink-0 rounded-full object-cover border border-outline-variant/20" src="' + LOGO + '"/>' +
        '<div class="min-w-0">' +
          '<div class="font-headline-md text-headline-md text-primary leading-tight tracking-tight truncate">' + BRAND + '</div>' +
          '<div class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">' + SUBTITLE + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="flex-1 overflow-y-auto px-2 space-y-1 hide-scrollbar">' + main + '</div>' +
      '<div class="mt-auto px-2 pt-4 border-t border-outline-variant/10 space-y-1">' + foot + '</div>' +
    '</aside>';
  }

  function buildTopbar() {
    return '<header class="md:hidden flex justify-between items-center w-full px-margin-mobile h-touch-target bg-surface-container-low border-b border-outline-variant/10 shrink-0 z-20">' +
      '<div class="flex items-center gap-2 min-w-0">' +
        '<img alt="' + BRAND + ' Logo" class="w-8 h-8 shrink-0 rounded-full object-cover border border-outline-variant/20" src="' + LOGO + '"/>' +
        '<span class="font-headline-md text-headline-md text-primary tracking-tight truncate">' + BRAND + '</span>' +
      '</div>' +
      '<div class="flex items-center gap-4 text-on-surface-variant">' +
        '<span class="material-symbols-outlined">notifications</span>' +
        '<span class="material-symbols-outlined">person</span>' +
      '</div>' +
    '</header>';
  }

  function installLayout() {
    var s = $('[data-layout-sidebar]');
    if (s) s.outerHTML = buildSidebar();
    var t = $('[data-layout-topbar]');
    if (t) t.outerHTML = buildTopbar();
  }
  installLayout();

  /* =========================================================
   * Floor Map (index.html) — tables open the POS
   * ========================================================= */
  $$('[data-table-open]').forEach(function (el) {
    el.addEventListener('click', function () {
      var table = el.getAttribute('data-table-open');
      location.href = 'pos.html?table=' + encodeURIComponent(table);
    });
  });

  /* =========================================================
   * Reservations (index.html) — find & seat, new walk-in
   * ========================================================= */
  function reservationsApp() {
    var STORE = 'chambu_reservations';
    var list = $('#resList');
    var search = $('#resSearch');

    function load() {
      var r = storeGet(STORE, null);
      if (r === null) {
        r = [
          { id: 'r1', guest: 'Mr. Vance', party: 2, table: 'B2', time: 'Seated', note: 'VIP — welcome drink' },
          { id: 'r2', guest: 'M. Reyes', party: 3, table: 'T3', time: 'Seated', note: 'Split bill 3 ways' },
          { id: 'r3', guest: 'Patel group', party: 4, table: 'T1', time: '7:30 PM', note: 'Window seat' }
        ];
        storeSet(STORE, r);
      }
      return r;
    }
    function save(r) { storeSet(STORE, r); }

    function markTableReserved(t) {
      $$('[data-table-open]').forEach(function (el) {
        if (el.getAttribute('data-table-open') !== t) return;
        el.classList.remove('table-available');
        el.classList.add('table-occupied');
        if (!$('.res-flag', el)) {
          var flag = document.createElement('div');
          flag.className = 'res-flag font-label-sm text-label-sm mt-1';
          flag.textContent = 'Reserved';
          el.appendChild(flag);
        }
      });
    }

    function render() {
      var cnt = $('#resCount');
      if (cnt) cnt.textContent = String(load().length);
      var q = (search && search.value ? search.value.toLowerCase() : '');
      var hits = load().filter(function (x) {
        if (!q) return true;
        return (x.guest.toLowerCase().indexOf(q) !== -1) || (String(x.table).toLowerCase().indexOf(q) !== -1);
      });
      var empty = $('#resEmpty');
      list.innerHTML = '';
      if (!hits.length) {
        empty.classList.remove('hidden');
        return;
      }
      empty.classList.add('hidden');
      hits.forEach(function (res) {
        var row = document.createElement('div');
        row.className = 'glass-panel rounded-xl p-4 border border-outline-variant/10 flex items-center justify-between gap-3';
        row.innerHTML =
          '<div class="min-w-0">' +
            '<div class="font-title-lg text-title-lg text-primary"></div>' +
            '<div class="font-label-sm text-label-sm text-on-surface-variant mt-1"></div>' +
            '<div class="font-label-sm text-label-sm text-on-surface-variant mt-1"></div>' +
          '</div>' +
          '<div class="flex flex-col gap-2 shrink-0">' +
            '<button class="h-9 px-4 bg-primary-container text-on-primary-container font-label-sm text-label-sm rounded-lg uppercase tracking-wide hover:bg-primary transition-colors" data-seat-res="' + res.id + '">Seat</button>' +
            '<button class="h-9 px-4 border border-outline-variant text-on-surface-variant font-label-sm text-label-sm rounded-lg uppercase tracking-wide hover:border-error hover:text-error transition-colors" data-del-res="' + res.id + '">Cancel</button>' +
          '</div>';
        row.children[0].children[0].textContent = res.guest;
        row.children[0].children[1].textContent = res.party + ' guests • Table ' + res.table + (res.time ? ' • ' + res.time : '');
        row.children[0].children[2].textContent = res.note || '';
        list.appendChild(row);
      });
    }

    load().forEach(function (r) { markTableReserved(r.table); });

    /* Show party size on floor-plan tables */
    var partyMap = storeGet('chambu_tables_party', {});
    $$('[data-table-open]').forEach(function (el) {
      var t = el.getAttribute('data-table-open');
      if (!partyMap[t]) return;
      var span = $('span.font-label-sm.mt-1', el);
      if (span && /Seated/.test(span.textContent)) {
        span.textContent = partyMap[t] + '/4 Seated';
      }
    });

    document.addEventListener('click', function (e) {
      var seatBtn = e.target.closest('[data-seat-res]');
      if (seatBtn) {
        var byId = load().filter(function (x) { return x.id === seatBtn.getAttribute('data-seat-res'); })[0];
        if (byId) {
          save(load().filter(function (x) { return x.id !== byId.id; }));
          localStorage.setItem('chambu_reservations_seated', byId.table);
          location.href = 'pos.html?table=' + encodeURIComponent(byId.table);
        }
        return;
      }
      var delBtn = e.target.closest('[data-del-res]');
      if (delBtn) {
        save(load().filter(function (x) { return x.id !== delBtn.getAttribute('data-del-res'); }));
        render();
        showToast('Reservation cancelled', true);
      }
    });

    $('#btnFindRes').addEventListener('click', function () { render(); modalShow('#resModal'); });
    $('#btnWalkIn').addEventListener('click', function () { modalShow('#walkInModal'); });
    if (search) search.addEventListener('input', render);

    $('#btnSaveWalkIn').addEventListener('click', function () {
      var guest = $('#wiName').value.trim();
      var party = parseInt($('#wiParty').value, 10) || 1;
      var table = $('#wiTable').value;
      if (!guest) { showToast('Enter a guest name', false); return; }
      var r = load();
      r.unshift({ id: 'r' + Date.now(), guest: guest, party: party, table: table, time: 'Seated', note: 'Walk-in' });
      save(r);
      markTableReserved(table);
      showToast(guest + ' seated at ' + table, true);
      modalHide('#walkInModal');
      $('#wiName').value = '';
    });

    $('#resModal').addEventListener('click', function (e) { if (e.target === this) modalHide('#resModal'); });
    $('#walkInModal').addEventListener('click', function (e) { if (e.target === this) modalHide('#walkInModal'); });

    render();
  }
  if ($('#btnFindRes')) reservationsApp();

  /* =========================================================
   * Menu Editor (menu.html) — section tabs + search
   * ========================================================= */
  function menuFilter() {
    var tabs = $$('[data-menu-tab]');
    var sections = $$('[data-menu-section]');
    var search = $('#menuSearch');

    function apply() {
      var active = ($('[data-menu-tab].active') || {}).getAttribute ? $('[data-menu-tab].active').getAttribute('data-menu-tab') : 'all';
      var q = (search && search.value ? search.value.toLowerCase() : '');

      sections.forEach(function (section) {
        var sec = section.getAttribute('data-menu-section');
        var visibleSec = active === 'all' || sec === active;
        var anyCard = false;

        $$('[data-name]', section).forEach(function (card) {
          var name = (card.getAttribute('data-name') || '').toLowerCase();
          var match = !q || name.indexOf(q) !== -1;
          card.style.display = match ? '' : 'none';
          if (match) anyCard = true;
        });

        section.style.display = (visibleSec && anyCard) ? '' : 'none';
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        apply();
      });
    });

    if (search) search.addEventListener('input', apply);
    $$('[data-menu-section]').forEach(function (s) {
      $$('[data-name]', s).forEach(function (c) { c.setAttribute('data-search', (c.getAttribute('data-name') || '').toLowerCase()); });
    });
  }
  if ($('[data-menu-tab]')) menuFilter();

  /* =========================================================
   * Inventory (inventory.html) — filters, search, restock
   * ========================================================= */
  function inventoryApp() {
    var tabs = $$('[data-inv-filter]');
    var search = $('#invSearch');

    function cards() { return $$('[data-category]'); }

    function activeVal() {
      var t = $('[data-inv-filter].active');
      return t ? t.getAttribute('data-inv-filter') : 'all';
    }

    function apply() {
      var active = activeVal();
      var q = (search && search.value ? search.value.toLowerCase() : '');

      cards().forEach(function (card) {
        var cat = card.getAttribute('data-category');
        var stock = parseFloat(card.getAttribute('data-stock') || '0');
        var name = (card.getAttribute('data-search-text') || '').toLowerCase();
        var show = true;
        if (active === 'low') show = stock <= 3;
        else if (active !== 'all') show = cat === active;
        if (show && q) show = name.indexOf(q) !== -1;
        card.style.display = show ? '' : 'none';
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        apply();
      });
    });

    if (search) search.addEventListener('input', apply);
  }
  if ($('[data-inv-filter]')) inventoryApp();

  /* =========================================================
   * Menu Editor (menu.html) — availability toggle
   * ========================================================= */
  function toggleAvail(label) {
    var track = $('div', label);
    var knob = $('div > div', label);
    var txt = $('.avail-label', label);
    if (txt.textContent === "86'd") {
      track.classList.remove('bg-surface-container-highest');
      track.classList.add('bg-tertiary-container');
      knob.style.left = '20px';
      txt.textContent = 'Available';
      txt.classList.remove('text-on-surface-variant');
      txt.classList.add('text-on-surface');
    } else {
      track.classList.remove('bg-tertiary-container');
      track.classList.add('bg-surface-container-highest');
      knob.style.left = '4px';
      txt.textContent = "86'd";
      txt.classList.remove('text-on-surface');
      txt.classList.add('text-on-surface-variant');
    }
  }

  $$('.avail-toggle').forEach(function (label) {
    label.addEventListener('click', function () { toggleAvail(label); });
  });

  /* =========================================================
   * Menu Editor (menu.html) — add / delete menu items
   * ========================================================= */
  function menuItemsApp() {
    var STORE_ITEMS = 'chambu_menu_items';
    var STORE_DEL = 'chambu_menu_deleted';
    var items = storeGet(STORE_ITEMS, []);
    var deleted = storeGet(STORE_DEL, []);

    $$('[data-name]').forEach(function (card) {
      if (deleted.indexOf(card.getAttribute('data-name')) !== -1) card.style.display = 'none';
    });

    function renderCard(it) {
      var section = $('[data-menu-section="' + it.cat + '"]');
      var grid = section ? $('.grid', section) : null;
      if (!grid) return;
      var card = document.createElement('div');
      card.className = 'bg-surface-container rounded-xl overflow-hidden border border-outline-variant/10 group hover:border-outline-variant/30 transition-all flex flex-col';
      card.setAttribute('data-name', it.name);
      card.setAttribute('data-category', it.cat);
      card.setAttribute('data-search', it.name.toLowerCase());
      card.setAttribute('data-dynamic', '1');
      card.innerHTML =
        '<div class="h-32 bg-surface-container-high flex items-center justify-center">' +
          '<span class="material-symbols-outlined text-4xl text-primary">restaurant</span>' +
        '</div>' +
        '<div class="p-4 flex-1 flex flex-col">' +
          '<div class="flex justify-between items-start mb-2">' +
            '<h4 class="font-title-lg text-title-lg text-primary line-clamp-1"></h4>' +
            '<span class="font-title-lg text-title-lg text-primary-fixed"></span>' +
          '</div>' +
          '<p class="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4 flex-1"></p>' +
          '<div class="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/10">' +
            '<label class="flex items-center gap-2 cursor-pointer avail-toggle">' +
              '<div class="relative w-10 h-5 bg-tertiary-container rounded-full transition-colors">' +
                '<div class="absolute left-5 top-0.5 w-4 h-4 bg-on-tertiary-container rounded-full shadow-sm transition-transform"></div>' +
              '</div>' +
              '<span class="font-label-sm text-label-sm text-on-surface avail-label">Available</span>' +
            '</label>' +
            '<button class="menu-del text-on-surface-variant hover:text-error transition-colors" title="Delete item">' +
              '<span class="material-symbols-outlined text-[20px]">delete</span>' +
            '</button>' +
          '</div>' +
        '</div>';
      $('h4', card).textContent = it.name;
      $('.text-primary-fixed', card).textContent = '$' + Number(it.price).toFixed(0);
      $('p[class*="line-clamp-2"]', card).textContent = it.desc || '';
      grid.appendChild(card);
      $('.avail-toggle', card).addEventListener('click', function () { toggleAvail($('.avail-toggle', card)); });
    }

    items.forEach(function (it) { renderCard(it); });

    $$('[data-name]').forEach(function (card) {
      if ($('.menu-del', card)) return;
      var actionRow = card.querySelector('.flex.items-center.justify-between.mt-auto') || card;
      var delBtn = document.createElement('button');
      delBtn.className = 'menu-del text-on-surface-variant hover:text-error transition-colors ml-2';
      delBtn.title = 'Delete item';
      delBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">delete</span>';
      actionRow.appendChild(delBtn);
    });

    document.addEventListener('click', function (e) {
      var del = e.target.closest('.menu-del');
      if (!del) return;
      var card = del.closest('[data-name]');
      if (!card) return;
      var name = card.getAttribute('data-name');
      var wasDynamic = card.getAttribute('data-dynamic') === '1';
      if (wasDynamic) {
        var idx = -1;
        items.forEach(function (it, i) { if (it.name === name) idx = i; });
        if (idx !== -1) items.splice(idx, 1);
        storeSet(STORE_ITEMS, items);
      } else {
        deleted.push(name);
        storeSet(STORE_DEL, deleted);
      }
      card.remove();
      showToast('Removed "' + name + '"', true);
    });

    $('#btnNewItem').addEventListener('click', function () { modalShow('#menuItemModal'); });

    $('#miSave').addEventListener('click', function () {
      var name = $('#miName').value.trim();
      var price = parseFloat($('#miPrice').value);
      var cat = $('#miCat').value;
      var desc = $('#miDesc').value.trim();
      if (!name || isNaN(price) || price <= 0) { showToast('Enter a name and a price', false); return; }
      var it = { name: name, price: price, cat: cat, desc: desc };
      items.push(it);
      storeSet(STORE_ITEMS, items);
      renderCard(it);
      modalHide('#menuItemModal');
      $('#miName').value = ''; $('#miPrice').value = ''; $('#miDesc').value = '';
      var activeTab = $('[data-menu-tab].active');
      if (activeTab && activeTab.getAttribute('data-menu-tab') !== 'all') activeTab.click();
      showToast('Added "' + name + '" to ' + cat, true);
    });
  }
  if ($('#btnNewItem')) menuItemsApp();

  /* =========================================================
   * Bar & Inventory (inventory.html) — add / delete / restock
   * ========================================================= */
  function inventoryItemsApp() {
    var STORE_ITEMS = 'chambu_inventory_items';
    var STORE_DEL = 'chambu_inventory_deleted';
    var STORE_STOCK = 'chambu_inventory_stock';
    var items = storeGet(STORE_ITEMS, []);
    var deleted = storeGet(STORE_DEL, []);
    var stockOver = storeGet(STORE_STOCK, {});

    function setStock(card, n) {
      card.setAttribute('data-stock', String(n));
      var d = $('.stock-count', card);
      if (d) d.textContent = n;
      var state = $('[data-stock-state][class*="rounded"]:last-child', card) || $('[data-stock-state]', card);
      var badge = state;
      if (badge) {
        badge.textContent = n <= 3 ? 'LOW STOCK' : 'IN STOCK';
        badge.className = n <= 3
          ? 'px-2 py-1 rounded bg-error-container text-on-error-container font-label-sm text-label-sm animate-pulse'
          : 'px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm';
        card.classList.remove('border-error/30');
        if (n <= 3) card.classList.add('border-error/30');
      }
    }

    $$('[data-category]').forEach(function (card) {
      var name = ($('h3', card) || { textContent: '' }).textContent || '';
      if (deleted.indexOf(name) !== -1) { card.style.display = 'none'; return; }
      if (stockOver.hasOwnProperty(name)) setStock(card, stockOver[name]);
    });

    function renderCard(it) {
      var grid = $('#invGrid');
      if (!grid) return;
      var low = it.stock <= 3;
      var card = document.createElement('div');
      card.className = 'glass-panel rounded-xl p-4 flex flex-col gap-4 hover:border-primary-container/50 transition-colors group';
      card.setAttribute('data-category', it.cat);
      card.setAttribute('data-stock', String(it.stock));
      card.setAttribute('data-search-text', (it.name + ' ' + it.cat + ' ' + it.unit).toLowerCase());
      card.setAttribute('data-dynamic', '1');
      card.innerHTML =
        '<div class="flex justify-between items-start">' +
          '<div class="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">' +
            '<span class="material-symbols-outlined text-on-surface-variant">inventory_2</span>' +
          '</div>' +
          '<div class="flex items-center gap-2">' +
            '<span class="px-2 py-1 rounded font-label-sm text-label-sm ' + (low ? 'bg-error-container text-on-error-container animate-pulse' : 'bg-surface-container-highest text-on-surface-variant') + '" data-stock-state>' + (low ? 'LOW STOCK' : 'IN STOCK') + '</span>' +
            '<button class="inv-del text-on-surface-variant hover:text-error transition-colors" title="Delete item">' +
              '<span class="material-symbols-outlined text-[18px]">close</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<h3 class="font-title-lg text-title-lg text-primary truncate mb-1"></h3>' +
          '<p class="font-body-md text-body-md text-on-surface-variant"></p>' +
        '</div>' +
        '<div class="flex justify-between items-end mt-auto pt-4 border-t border-outline-variant/10">' +
          '<div>' +
            '<div class="font-label-sm text-label-sm text-on-surface-variant mb-1">IN STOCK</div>' +
            '<div class="font-headline-md text-headline-md text-primary-container leading-none stock-count"></div>' +
          '</div>' +
          '<button class="restock-btn h-8 px-3 bg-primary-container text-on-primary-container font-label-sm text-label-sm rounded flex items-center justify-center hover:bg-primary transition-colors">Quick Restock</button>' +
        '</div>';
      $('h3', card).textContent = it.name;
      $('p[class*="text-on-surface-variant"]', card).textContent = it.unit || '';
      $('.stock-count', card).textContent = it.stock + ' ' + (it.unitNote || 'pcs');
      grid.appendChild(card);
      if (low) setStock(card, it.stock);
    }

    items.forEach(function (it) {
      var un = (it.unit || '').replace(/[0-9]/g, '').trim() || 'pcs';
      it.unitNote = un;
      renderCard(it);
    });

    $$('[data-category]').forEach(function (card) {
      if ($('.inv-del', card)) return;
      var head = card.querySelector('.flex.justify-between.items-start');
      if (!head) return;
      var delBtn = document.createElement('button');
      delBtn.className = 'inv-del text-on-surface-variant hover:text-error transition-colors';
      delBtn.title = 'Delete item';
      delBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">close</span>';
      head.appendChild(delBtn);
    });

    document.addEventListener('click', function (e) {
      var del = e.target.closest('.inv-del');
      if (!del) return;
      var card = del.closest('[data-category]');
      if (!card) return;
      var name = ($('h3', card) || { textContent: '' }).textContent;
      var wasDynamic = card.getAttribute('data-dynamic') === '1';
      if (wasDynamic) {
        var idx = -1;
        items.forEach(function (it, i) { if (it.name === name) idx = i; });
        if (idx !== -1) items.splice(idx, 1);
        storeSet(STORE_ITEMS, items);
      } else if (name) {
        deleted.push(name);
        storeSet(STORE_DEL, deleted);
      }
      card.remove();
      showToast('Removed "' + name + '"', true);
    });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.restock-btn');
      if (!btn) return;
      var card = btn.closest('[data-category]');
      if (!card) return;
      var name = ($('h3', card) || { textContent: '' }).textContent;
      var stock = parseFloat(card.getAttribute('data-stock') || '0');
      var next = stock + 5;
      setStock(card, next);
      if (name) { stockOver[name] = next; storeSet(STORE_STOCK, stockOver); }
      showToast('Restocked "' + name + '" (+5)', true);
    });

    $('#btnAddItem').addEventListener('click', function () { modalShow('#invItemModal'); });

    $('#invSave').addEventListener('click', function () {
      var name = $('#invName').value.trim();
      var cat = $('#invCat').value;
      var stock = parseFloat($('#invStock').value);
      if (!name || isNaN(stock) || stock < 0) { showToast('Enter a name and a valid stock', false); return; }
      var unit = $('#invUnit').value.trim() || 'pcs';
      var it = { name: name, cat: cat, stock: stock, unit: unit, unitNote: unit.replace(/[0-9]/g, '').trim() || 'pcs' };
      items.push(it);
      storeSet(STORE_ITEMS, items);
      renderCard(it);
      modalHide('#invItemModal');
      $('#invName').value = ''; $('#invStock').value = ''; $('#invUnit').value = '';
      var activeTab = $('[data-inv-filter].active');
      if (activeTab && activeTab.getAttribute('data-inv-filter') !== 'all') activeTab.click();
      showToast('Added "' + name + '"', true);
    });
  }
  if ($('#btnAddItem') && $('#invGrid')) inventoryItemsApp();

  /* =========================================================
   * Shopping List (shopping.html) — chambu_shopping
   * Ingredient purchases for Kitchen and Bar
   * ========================================================= */
  function shoppingApp() {
    var STORE = 'chambu_shopping';
    var LOW = 3;
    var search = $('#shopSearch');
    var listEl = $('#shopList');
    var list = storeGet(STORE, []);
    if (storeGet(STORE) === null) {
      list = [
        { id: 's1', name: 'Harina 0000', cat: 'kitchen', qty: 5, unit: 'kg', done: false },
        { id: 's2', name: 'Papas', cat: 'kitchen', qty: 4, unit: 'kg', done: false },
        { id: 's3', name: 'Cebolla', cat: 'kitchen', qty: 2, unit: 'kg', done: false },
        { id: 's4', name: 'Ajo', cat: 'kitchen', qty: 500, unit: 'g', done: false },
        { id: 's5', name: 'Crema de leche', cat: 'kitchen', qty: 6, unit: 'ctns', done: true },
        { id: 's6', name: 'Gin', cat: 'bar', qty: 3, unit: 'btls', done: false },
        { id: 's7', name: 'Campari', cat: 'bar', qty: 2, unit: 'btls', done: false },
        { id: 's8', name: 'Jugo de naranja', cat: 'bar', qty: 4, unit: 'ctns', done: false }
      ];
      storeSet(STORE, list);
    }

    var COMMON = [
      { name: 'Harina 0000', unit: 'kg', cat: 'kitchen' },
      { name: 'Papas', unit: 'kg', cat: 'kitchen' },
      { name: 'Cebolla', unit: 'kg', cat: 'kitchen' },
      { name: 'Ajo', unit: 'g', cat: 'kitchen' },
      { name: 'Manteca', unit: 'kg', cat: 'kitchen' },
      { name: 'Crema de leche', unit: 'ctns', cat: 'kitchen' },
      { name: 'Queso Paraguay', unit: 'kg', cat: 'kitchen' },
      { name: 'Tomate', unit: 'kg', cat: 'kitchen' },
      { name: 'Carne picada', unit: 'kg', cat: 'kitchen' },
      { name: 'Pollo', unit: 'kg', cat: 'kitchen' },
      { name: 'Gin', unit: 'btls', cat: 'bar' },
      { name: 'Campari', unit: 'btls', cat: 'bar' },
      { name: 'Jugo de naranja', unit: 'ctns', cat: 'bar' },
      { name: 'Limón', unit: 'kg', cat: 'bar' },
      { name: 'Menta', unit: 'bunches', cat: 'bar' },
      { name: 'Hielo', unit: 'bags', cat: 'bar' }
    ];

    function esc(s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function byId(id) { for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
    function save() { storeSet(STORE, list); }

    function activeVal() {
      var t = $('[data-shop-filter].active');
      return t ? t.getAttribute('data-shop-filter') : 'all';
    }

    function catLabel(c) { return c === 'kitchen' ? 'Cocina' : 'Bar'; }
    function catBadge(c) {
      return c === 'kitchen'
        ? 'bg-tertiary-container/15 text-tertiary-fixed-dim border border-tertiary-fixed-dim/30'
        : 'bg-primary-container/15 text-primary-fixed-dim border border-primary-fixed-dim/30';
    }

    function rowHtml(it) {
      return '<div class="flex items-center gap-3 p-4 rounded-xl border bg-surface transition-colors ' +
        (it.done ? 'border-tertiary-container/30 opacity-70' : 'border-outline-variant/10 hover:border-primary-container/40') +
        '" data-shop-item>' +
        '<button class="shop-toggle w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ' +
          (it.done ? 'bg-tertiary-container border-tertiary-container text-on-tertiary-container' : 'border-outline-variant hover:border-tertiary-container text-transparent') +
          '" title="Marcar como comprado" data-shop-toggle="' + it.id + '">' +
          '<span class="material-symbols-outlined text-[16px]">check</span>' +
        '</button>' +
        '<div class="flex-1 min-w-0">' +
          '<h3 class="font-body-lg text-body-lg font-semibold pt-1 ' + (it.done ? 'line-through text-on-surface-variant' : 'text-on-surface') + '">' + esc(it.name) + '</h3>' +
          '<span class="inline-block px-2 py-0.5 rounded font-label-sm text-label-sm mt-1 ' + catBadge(it.cat) + '">' + catLabel(it.cat) + '</span>' +
        '</div>' +
        '<div class="flex items-center gap-1">' +
          '<button class="shop-minus w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center transition-colors text-on-surface-variant"><span class="material-symbols-outlined text-[16px]">remove</span></button>' +
          '<span class="w-16 text-center font-body-lg text-body-lg text-on-surface truncate" data-shop-qty>' + esc(it.qty) + ' ' + esc(it.unit || '') + '</span>' +
          '<button class="shop-plus w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center transition-colors text-on-surface"><span class="material-symbols-outlined text-[16px]">add</span></button>' +
        '</div>' +
        '<button class="shop-del text-on-surface-variant hover:text-error transition-colors shrink-0" title="Eliminar item"><span class="material-symbols-outlined text-[18px]">close</span></button>' +
      '</div>';
    }

    function render() {
      var active = activeVal();
      var q = (search && search.value ? search.value.toLowerCase() : '');
      var rows = list.filter(function (it) {
        if (active === 'kitchen' || active === 'bar') { if (it.cat !== active) return false; }
        else if (active === 'todo') { if (it.done) return false; }
        else if (active === 'done') { if (!it.done) return false; }
        if (q) { if ((it.name + ' ' + catLabel(it.cat)).toLowerCase().indexOf(q) === -1) return false; }
        return true;
      });
      listEl.innerHTML = rows.length
        ? rows.map(rowHtml).join('')
        : '<div class="glass-panel rounded-xl p-8 text-center border border-outline-variant/10">' +
            '<span class="material-symbols-outlined text-4xl text-on-surface-variant">shopping_cart</span>' +
            '<p class="font-body-md text-body-md text-on-surface-variant mt-3">No hay items en la lista.</p>' +
            '<p class="font-label-sm text-label-sm text-on-surface-variant">Agrega uno con "Add Item" o probá "Suggest".</p>' +
          '</div>';
      var toBuy = list.filter(function (it) { return !it.done; }).length;
      var bought = list.length - toBuy;
      var tb = $('#shopToBuy'); if (tb) tb.textContent = String(toBuy);
      var bb = $('#shopBought'); if (bb) bb.textContent = String(bought);
    }

    $('#shopItemModal').addEventListener('click', function (e) { if (e.target === this) modalHide('#shopItemModal'); });
    $('#shopSuggestModal').addEventListener('click', function (e) { if (e.target === this) modalHide('#shopSuggestModal'); });

    $$('[data-shop-filter]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        $$('[data-shop-filter]').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        render();
      });
    });
    if (search) search.addEventListener('input', render);

    $('#btnAddShop').addEventListener('click', function () { modalShow('#shopItemModal'); });

    $('#shopSave').addEventListener('click', function () {
      var name = $('#shopName').value.trim();
      var cat = $('#shopCat').value;
      var qty = parseFloat($('#shopQty').value);
      if (!name || isNaN(qty) || qty <= 0) { showToast('Enter a name and a valid quantity', false); return; }
      var unit = $('#shopUnit').value.trim();
      var existing = null;
      list.forEach(function (it) { if (it.name.toLowerCase() === name.toLowerCase()) existing = it; });
      if (existing) {
        existing.qty += qty;
        if (unit) existing.unit = unit;
        showToast('"' + name + '" +' + qty + ' (ya estaba en la lista)', true);
      } else {
        list.push({ id: 's' + Date.now() + Math.floor(Math.random() * 1000), name: name, cat: cat === 'bar' ? 'bar' : 'kitchen', qty: qty, unit: unit || 'pcs', done: false });
        showToast('Added "' + name + '"', true);
      }
      save(); render();
      modalHide('#shopItemModal');
      $('#shopName').value = ''; $('#shopQty').value = '1'; $('#shopUnit').value = '';
    });

    document.addEventListener('click', function (e) {
      var row = e.target.closest('[data-shop-item]');
      if (!row) return;
      var toggle = e.target.closest('.shop-toggle');
      var minus = e.target.closest('.shop-minus');
      var plus = e.target.closest('.shop-plus');
      var del = e.target.closest('.shop-del');
      if (!toggle && !minus && !plus && !del) return;
      var it = byId(toggle ? toggle.getAttribute('data-shop-toggle') : '');
      if (toggle) {
        if (it) { it.done = !it.done; save(); render(); showToast('"' + it.name + '" ' + (it.done ? 'comprado' : 'marcado como pendiente'), true); }
        return;
      }
      var id = row.getAttribute('data-shop-item');
      var name = ($('h3', row) || { textContent: '' }).textContent;
      it = byId(id);
      if (minus && it) { it.qty = Math.max(1, it.qty - 1); save(); render(); }
      else if (plus && it) { it.qty += 1; save(); render(); }
      else if (del) {
        if (it) { list.splice(list.indexOf(it), 1); save(); render(); showToast('Removed "' + name + '"', true); }
      }
    });

    var btnClear = $('#btnClearBought');
    if (btnClear) btnClear.addEventListener('click', function () {
      list = list.filter(function (it) { return !it.done; });
      save(); render();
      showToast('Comprados eliminados', true);
    });

    /* Suggestion flow: low stock (from inventory) + common ingredients */
    function lowStockSuggestions() {
      var over = storeGet('chambu_inventory_stock', {});
      return storeGet('chambu_inventory_items', []).filter(function (it) {
        var stock = over.hasOwnProperty(it.name) ? over[it.name] : it.stock;
        return stock <= LOW;
      }).map(function (it) { return { name: it.name, unit: it.unit || 'pcs', cat: 'bar' }; });
    }

    function suggestRow(s, checked) {
      return '<label class="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">' +
        '<input type="checkbox" class="suggest-check accent-[#bdf19c] w-4 h-4"' + (checked ? ' checked' : '') + ' data-suggest-name="' + esc(s.name) + '" data-suggest-cat="' + s.cat + '" data-suggest-unit="' + esc(s.unit) + '">' +
        '<span class="font-body-md text-body-md text-on-surface flex-1">' + esc(s.name) + '</span>' +
        '<span class="font-label-sm text-label-sm text-on-surface-variant">' + esc(s.unit) + ' • ' + catLabel(s.cat) + '</span>' +
      '</label>';
    }

    $('#btnSuggest').addEventListener('click', function () {
      var low = lowStockSuggestions();
      $('#shopSuggestLow').innerHTML = low.length
        ? low.map(function (s) { return suggestRow(s, list.some(function (it) { return it.name.toLowerCase() === s.name.toLowerCase(); })); }).join('')
        : '<p class="font-body-md text-body-md text-on-surface-variant p-2">Nada por debajo del PAR en el inventario.</p>';
      $('#shopSuggestCommon').innerHTML = COMMON.map(function (s) {
        return suggestRow(s, list.some(function (it) { return it.name.toLowerCase() === s.name.toLowerCase(); }));
      }).join('');
      modalShow('#shopSuggestModal');
    });

    $('#btnAddSuggest').addEventListener('click', function () {
      var picked = $$('input.suggest-check:checked');
      if (!picked.length) { showToast('Select at least one item', false); return; }
      var added = 0;
      picked.forEach(function (cb) {
        var name = cb.getAttribute('data-suggest-name');
        var cat = cb.getAttribute('data-suggest-cat') === 'bar' ? 'bar' : 'kitchen';
        var unit = cb.getAttribute('data-suggest-unit') || 'pcs';
        var existing = null;
        list.forEach(function (it) { if (it.name.toLowerCase() === name.toLowerCase()) existing = it; });
        if (existing) { existing.qty += 1; }
        else {
          list.push({ id: 's' + Date.now() + Math.floor(Math.random() * 1000) + added, name: name, cat: cat, qty: 1, unit: unit, done: false });
        }
        added++;
      });
      save(); render(); modalHide('#shopSuggestModal');
      showToast('Added ' + added + ' item(s) to the list', true);
    });

    render();
  }
  if ($('#shoppingRoot')) shoppingApp();

  function getSettings() {
    var d = { restaurant: 'Chambú Kitchen & Bar' };
    try {
      var s = JSON.parse(localStorage.getItem('chambu_settings') || 'null');
      if (s && typeof s === 'object' && s.restaurant) d.restaurant = String(s.restaurant);
    } catch (e) {}
    return d;
  }

  function saveSettings(s) {
    localStorage.setItem('chambu_settings', JSON.stringify(s));
  }

  /* =========================================================
   * POS & Billing (pos.html) — ticket, totals, payment flow
   * ========================================================= */
  function posApp() {
    var params = new URLSearchParams(location.search);
    var table = params.get('table');
    var settings = getSettings();

    function recalc() {
      var items = $$('[data-price]');
      var subtotal = 0;
      items.forEach(function (it) {
        subtotal += parseFloat(it.getAttribute('data-price') || '0');
      });
      var t = $('#ticketSubtotal'); if (t) t.textContent = money(subtotal);
      var tl = $('#ticketTotal'); if (tl) tl.textContent = money(subtotal);
      var tmpay = $('#payAmount'); if (tmpay) tmpay.textContent = money(subtotal);
      var tmpay2 = $('#payAmountSuccess'); if (tmpay2) tmpay2.textContent = money(subtotal);
    }

    var totalEl = $('#ticketTitle');
    if (table && totalEl) {
      totalEl.textContent = 'Table ' + table;
      document.title = 'Table ' + table + ' - Chambú Kitchen & Bar';
    }

    /* Visit + party tracking (analytics: avg people/table, dwell time) */
    var party = 2;
    var visits = storeGet('chambu_visits', []);
    var curVisit = storeGet('chambu_current_visit', null);
    if (table) {
      if (!curVisit || curVisit.table !== table) {
        curVisit = { table: table, party: party, seated: Date.now() };
        storeSet('chambu_current_visit', curVisit);
      }
      if (curVisit.party) party = curVisit.party;
    }
    var partyEl = $('#partyCount');

    function saveParty(n) {
      party = n;
      if (partyEl) partyEl.textContent = String(party);
      curVisit = curVisit || { table: table, party: party, seated: Date.now() };
      curVisit.party = party;
      storeSet('chambu_current_visit', curVisit);
      if (table) {
        var map = storeGet('chambu_tables_party', {});
        map[table] = n;
        storeSet('chambu_tables_party', map);
      }
    }

    var btnMinus = $('#btnPartyMinus');
    var btnPlus = $('#btnPartyPlus');
    if (btnMinus) btnMinus.addEventListener('click', function () { saveParty(Math.max(1, party - 1)); });
    if (btnPlus) btnPlus.addEventListener('click', function () { saveParty(Math.min(20, party + 1)); });

    function closeVisit() {
      if (!curVisit) return;
      var done = { table: curVisit.table, party: curVisit.party || party, seated: curVisit.seated, closed: Date.now() };
      if (done.closed > done.seated) visits.push(done);
      storeSet('chambu_visits', visits);
      storeSet('chambu_current_visit', null);
      curVisit = null;
    }

    /* Ensure every ticket line has a remove control */
    $$('[data-price]').forEach(function (it) {
      if ($('.item-remove', it)) return;
      var col = $('.text-right.ml-4', it);
      if (!col) return;
      var btn = document.createElement('button');
      btn.className = 'item-remove block mt-2 text-on-surface-variant hover:text-error transition-colors material-symbols-outlined text-[18px]';
      btn.title = 'Remove';
      btn.textContent = 'close';
      col.appendChild(btn);
      btn.addEventListener('click', function () { it.remove(); recalc(); });
    });

    /* Add item to ticket */
    [$('#newItemName'), $('#newItemPrice')].forEach(function (el) {
      if (!el) return;
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') $('#btnAddItem').click();
      });
    });
    $('#btnAddItem').addEventListener('click', function () {
      var nameEl = $('#newItemName');
      var priceEl = $('#newItemPrice');
      var name = nameEl.value.trim();
      var price = parseFloat(priceEl.value);
      if (!name || isNaN(price) || price <= 0) return;
      var list = $('#ticketItems');
      var item = document.createElement('div');
      item.className = 'bg-surface p-4 rounded-lg border border-outline-variant/20 hover:border-outline-variant/50 transition-colors group';
      item.setAttribute('data-price', String(price));
      item.innerHTML =
        '<div class="flex justify-between items-start">' +
          '<div class="flex-1">' +
            '<h3 class="font-body-lg text-body-lg text-on-surface font-semibold"></h3>' +
          '</div>' +
          '<div class="text-right ml-4">' +
            '<span class="font-body-lg text-body-lg text-primary"></span>' +
            '<button class="block mt-2 text-on-surface-variant hover:text-error transition-colors material-symbols-outlined text-[18px] item-remove" title="Remove">close</button>' +
          '</div>' +
        '</div>';
      $('h3', item).textContent = name;
      $('span', item).textContent = money(price);
      $('button', item).addEventListener('click', function () { item.remove(); recalc(); });
      list.appendChild(item);
      nameEl.value = '';
      priceEl.value = '';
      recalc();
    });

    recalc();

    /* Split bill */
    $('#btnSplit').addEventListener('click', function () {
      var total = parseFloat(($('#ticketTotal') || {}).textContent ? $('#ticketTotal').textContent.replace(/[^0-9.]/g, '') : '0') || 0;
      var ways = prompt('Split the bill in how many ways?', '2');
      ways = parseInt(ways, 10);
      if (!ways || ways < 2) return;
      var note = $('#splitNote');
      note.textContent = 'Split ' + ways + ' ways • each pays ' + money(total / ways);
      note.classList.remove('hidden');
    });

    /* Send to kitchen (Kitchen Display / kitchen.html) */
    var btnSend = $('#btnSendOrder');
    if (btnSend) {
      btnSend.addEventListener('click', function () {
        var items = $$('[data-price]', $('#ticketItems'));
        if (!items.length) { showToast('Add items before sending to the kitchen', false); return; }
        var orders = [];
        try { orders = JSON.parse(localStorage.getItem('chambu_orders') || '[]'); } catch (e) {}
        var next = parseInt(localStorage.getItem('chambu_ticket_next') || '8903', 10);
        var order = {
          id: String(next),
          table: table || '-',
          status: 'new',
          sent: Date.now(),
          items: items.map(function (it) {
            return { name: (($('h3', it) || {}).textContent || 'Item').trim(), qty: 1, note: '' };
          })
        };
        orders.push(order);
        localStorage.setItem('chambu_orders', JSON.stringify(orders));
        localStorage.setItem('chambu_ticket_next', String(next + 1));
        var meta = $('#ticketMeta');
        if (meta) meta.textContent = 'Ticket #' + order.id;
        showToast('Order #' + order.id + ' sent to the kitchen', true);
      });
    }

    /* Payment modal flow */
    var modal = $('#payModal');
    var stagePay = $('#stagePay');
    var stageOk = $('#stageOk');
    var progress = $('#payProgressBar');

    function resetModal() {
      stagePay.classList.remove('hidden');
      stageOk.classList.add('hidden');
      progress.style.width = '0%';
      progress.classList.add('w-0');
      progress.classList.remove('w-full');
    }

    $('#btnPayNow').addEventListener('click', function () {
      resetModal();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });

    function closeModal() {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    $('#btnCancelPay').addEventListener('click', closeModal);

    $$('[data-pay-method]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('[data-pay-method]').forEach(function (b) { b.classList.remove('border-primary-container'); });
        btn.classList.add('border-primary-container');
      });
    });

    $('#btnProcessPay').addEventListener('click', function () {
      this.disabled = true;
      var width = 0;
      var timer = setInterval(function () {
        width += Math.random() * 22 + 6;
        if (width >= 100) {
          width = 100;
          clearInterval(timer);
          stagePay.classList.add('hidden');
          stageOk.classList.remove('hidden');
          $('#btnCancelPay').disabled = false;
          closeVisit();
        }
        progress.style.width = width + '%';
      }, 130);
    });

    $('#btnNewOrder').addEventListener('click', function () {
      closeModal();
      $('#ticketItems').innerHTML = '';
      recalc();
      var chip = $('#ticketStatus');
      if (chip) { chip.textContent = 'Open'; chip.className = 'bg-tertiary-container/10 text-tertiary-container px-3 py-1 rounded-full border border-tertiary-container/30'; chip.innerHTML = '<span class="font-label-md text-label-md">Open</span>'; }
      var note = $('#splitNote'); if (note) note.classList.add('hidden');
      $('#ticketTitle').textContent = 'Table ' + (table || '—');
    });

    $('#btnCancelProcess').addEventListener('click', function () {
      stageOk.classList.add('hidden');
      stagePay.classList.remove('hidden');
    });
  }
  if ($('#ticketTitle')) posApp();

  /* =========================================================
   * Kitchen Display (kitchen.html) — boards from chambu_orders
   * ========================================================= */
  function kdsApp() {
    var boards = { new: $('#colNew'), in: $('#colIn'), ready: $('#colReady'), done: $('#colDone') };

    function load() {
      try { return JSON.parse(localStorage.getItem('chambu_orders') || 'null'); } catch (e) { return null; }
    }
    function save(o) { localStorage.setItem('chambu_orders', JSON.stringify(o)); }

    function seed() {
      if (load() && load().length) return;
      localStorage.setItem('chambu_ticket_next', '8904');
      var now = Date.now();
      save(demoOrders(now));
    }

    function demoOrders(now) {
      return [
        { id: '8901', table: '4', status: 'new', sent: now - 6 * 60000, items: [
          { name: 'Wagyu Ribeye 12oz', qty: 1, note: 'Medium Rare • No butter' },
          { name: 'Truffle Fries', qty: 1, note: 'Aioli on side' }
        ]},
        { id: '8902', table: '8', status: 'in', sent: now - 3 * 60000, items: [
          { name: 'Seared Salmon', qty: 2, note: 'No broccoli' },
          { name: 'Old Fashioned', qty: 1, note: 'Woodford Reserve' }
        ]},
        { id: '8903', table: '12', status: 'ready', sent: now - 1 * 60000, items: [
          { name: 'Tiramisu', qty: 2, note: '' }
        ]}
      ];
    }

    function render() {
      var orders = load() || [];
      Object.keys(boards).forEach(function (k) { if (boards[k]) boards[k].innerHTML = ''; });
      var counts = { new: 0, in: 0, ready: 0, done: 0 };
      orders.forEach(function (o) {
        o.status = o.status || 'new';
        counts[o.status] = (counts[o.status] || 0) + 1;
        var c = $('[data-col="' + o.status + '"]', boards[o.status]);
        if (!c) return;
        var p = document.createElement('div');
        p.innerHTML = kdsCard(o);
        c.appendChild(p.firstChild);
      });
      Object.keys(counts).forEach(function (k) {
        var el = $('#count' + k.charAt(0).toUpperCase() + k.slice(1));
        if (el) el.textContent = String(counts[k]);
      });
    }

    function kdsCard(o) {
      var styles = {
        new: ['bg-primary-container text-on-primary-container', 'Start'],
        in: ['bg-secondary-container/20 text-secondary-container hover:bg-secondary-container/30', 'Mark Ready'],
        ready: ['bg-tertiary-container text-on-tertiary-container', 'Complete'],
        done: ['', '']
      };
      var chips = {
        new: 'bg-primary-container text-on-primary-container',
        in: 'bg-secondary-container/20 text-secondary-container',
        ready: 'bg-tertiary-container text-on-tertiary-container',
        done: 'bg-surface-container-highest text-on-surface-variant'
      };
      var items = o.items.map(function (it) {
        return '<li class="flex justify-between gap-2">' +
          '<span class="font-body-md text-body-md text-on-surface min-w-0">' + (it.qty > 1 ? it.qty + 'x ' : '') + it.name + '</span>' +
          (it.note ? '<span class="font-label-sm text-label-sm text-on-surface-variant shrink-0">' + it.note + '</span>' : '') +
        '</li>';
      }).join('');
      var btn = o.status === 'done' ? '' :
        '<button data-advance="' + o.id + '" class="w-full ' + styles[o.status][0] + ' font-label-md text-label-md py-2.5 rounded-lg uppercase tracking-wider transition-colors">' + styles[o.status][1] + '</button>';
      return '<div class="glass-panel rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/20">' +
        '<div class="flex justify-between items-start gap-2">' +
          '<div class="min-w-0">' +
            '<div class="font-title-lg text-title-lg text-primary">Table ' + o.table + '</div>' +
            '<div class="font-label-sm text-label-sm text-on-surface-variant mt-1">Ticket #' + o.id + '</div>' +
          '</div>' +
          '<span class="px-2 py-1 rounded-full border border-outline-variant/20 font-label-sm text-label-sm shrink-0 ' + chips[o.status] + '">' + (o.status === 'in' ? 'In Progress' : o.status.charAt(0).toUpperCase() + o.status.slice(1)) + '</span>' +
        '</div>' +
        '<ul class="space-y-1.5 border-t border-outline-variant/10 pt-3">' + items + '</ul>' +
        btn +
      '</div>';
    }

    seed();
    render();

    var demoBtn = $('#btnDemoOrders');
    if (demoBtn) demoBtn.addEventListener('click', function () {
      save(demoOrders(Date.now()));
      render();
      showToast('Demo orders loaded', true);
    });

    window.addEventListener('storage', function (e) {
      if (e.key === 'chambu_orders') render();
    });
    setInterval(function () { render(); }, 3000);

    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-advance]');
      if (!b) return;
      var orders = load() || [];
      var order = null;
      orders.forEach(function (o) { if (String(o.id) === b.getAttribute('data-advance')) order = o; });
      if (!order) return;
      order.status = order.status === 'new' ? 'in' : order.status === 'in' ? 'ready' : 'done';
      if (order.status === 'done' && !order.doneAt) order.doneAt = Date.now();
      save(orders);
      render();
      if (order.status === 'done') showToast('Order #' + order.id + ' complete', true);
    });
  }
  if ($('#colNew')) kdsApp();

  /* =========================================================
   * Analytics (analytics.html) — charts + month comparison
   * ========================================================= */
  function avg(arr) { return arr && arr.length ? arr.reduce(function (a, b) { return a + b; }, 0) / arr.length : 0; }

  function fmtMins(m) {
    m = Math.round(m);
    if (m >= 60) return Math.floor(m / 60) + 'h ' + (m % 60) + 'm';
    return m + 'm';
  }

  function moOf(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1);
  }

  function moLabel(m) {
    var p = m.split('-');
    var names = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return (names[parseInt(p[1], 10) - 1] || p[1]) + ' ' + p[0];
  }

  function barChart(el, rows) {
    if (!el) return;
    if (!rows || !rows.length) {
      el.innerHTML = '<p class="font-body-md text-body-md text-on-surface-variant py-4 text-center">Sin datos para este rango.</p>';
      return;
    }
    var palette = ['bg-primary-container', 'bg-secondary-container', 'bg-tertiary-container', 'bg-surface-container-highest'];
    var max = rows.reduce(function (m, r) { return Math.max(m, r.value); }, 0) || 1;
    el.innerHTML = rows.map(function (r, i) {
      var pct = Math.max(3, Math.round((r.value / max) * 100));
      var color = palette[i % palette.length];
      return '<div class="flex items-center gap-3 mb-2">' +
        '<div class="w-28 shrink-0 text-right font-label-md text-label-md text-on-surface-variant truncate" title="' + r.label + '">' + r.label + '</div>' +
        '<div class="flex-1 bg-surface-container-high rounded-full h-6 overflow-hidden">' +
          '<div class="h-full ' + color + ' rounded-full flex items-center justify-end pr-2" style="width:' + pct + '%">' +
            '<span class="font-label-sm text-label-sm text-on-primary-container">' + (r.display !== undefined ? r.display : r.value) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function analyticsApp() {
    if (!$('#analyticsRoot')) return;
    var DAY = 86400000;
    var now = Date.now();

    function seed() {
      var visits = storeGet('chambu_visits', null);
      if (visits === null) {
        visits = [];
        ['T1', 'T2', 'T3', 'B1', 'B2', 'B3'].forEach(function (tbl, ti) {
          for (var i = 0; i < 12; i++) {
            var d = now - (ti * 3 + i * 5) * DAY - Math.floor(Math.random() * DAY);
            var dur = (45 + Math.floor(Math.random() * 135)) * 60000;
            visits.push({ table: tbl, party: 1 + Math.floor(Math.random() * 5), seated: d, closed: d + dur });
          }
        });
        storeSet('chambu_visits', visits);
      }
      var orders = storeGet('chambu_analytics_orders', null);
      if (orders === null) {
        var names = ['Mojito', 'Old Fashioned', 'Caipiroska', 'Margarita', 'Pisco Sour', 'Fernet &amp; Coke', 'Vuelve a la Vida', 'Cerveza Hatuey', 'Vino Tinto Casa', 'Tereré', 'Whiskey Macallan', 'Limonada'];
        var clean = function (s) { return s.replace('&amp;', '&'); };
        orders = [];
        for (var j = 0; j < 45; j++) {
          var dd = now - Math.floor(Math.random() * 90) * DAY - Math.floor(Math.random() * DAY);
          var prep = (8 + Math.floor(Math.random() * 20)) * 60000;
          orders.push({
            id: 'A' + j,
            table: 'T' + (1 + (j % 3)),
            sent: dd,
            doneAt: dd + prep,
            status: 'done',
            items: [{ name: clean(names[j % names.length]), qty: 1 + (j % 3), note: '' }]
          });
        }
        storeSet('chambu_analytics_orders', orders);
      }
    }

    seed();

    var visitsAll = storeGet('chambu_visits', []);
    var ordersSeed = storeGet('chambu_analytics_orders', []);
    var liveOrders = storeGet('chambu_orders', []).filter(function (o) { return o.doneAt; });
    var months = {};
    visitsAll.forEach(function (v) { months[moOf(v.closed || v.seated)] = 1; });
    ordersSeed.concat(liveOrders).forEach(function (o) { if (o.doneAt) months[moOf(o.doneAt)] = 1; });

    var sel = $('#moSelector');
    var sorted = Object.keys(months).sort();
    sel.innerHTML = '<option value="all">Todos los meses (' + sorted.length + ')</option>' +
      sorted.map(function (m) { return '<option value="' + m + '">' + moLabel(m) + '</option>'; }).join('');

    function render() {
      var month = sel.value;

      function inMonth(ts) { return month === 'all' || moOf(ts) === month; }

      var visits = visitsAll.filter(function (v) { return inMonth(v.closed || v.seated); });
      var orders = ordersSeed.concat(liveOrders).filter(function (o) { return inMonth(o.doneAt || o.sent); });

      /* Top drinks */
      var sold = {};
      orders.forEach(function (o) {
        (o.items || []).forEach(function (it) { sold[it.name] = (sold[it.name] || 0) + (it.qty || 1); });
      });
      var top = Object.keys(sold).map(function (k) { return { label: k, value: sold[k], display: String(sold[k]) }; })
        .sort(function (a, b) { return b.value - a.value; }).slice(0, 8);
      barChart($('#chartTopDrinks'), top);
      var totalSold = Object.keys(sold).reduce(function (a, k) { return a + sold[k]; }, 0);
      $('#drinksAvgBig').textContent = totalSold ? String(totalSold) : '—';
      $('#drinksAvgNote').textContent = orders.length ? totalSold + ' vendidos en ' + orders.length + ' comandas' : 'Sin ventas registradas';

      /* Avg party per table */
      var byParty = {};
      visits.forEach(function (v) { (byParty[v.table] = byParty[v.table] || []).push(v.party || 1); });
      var partyRows = Object.keys(byParty).sort().map(function (k) { return { label: k, value: avg(byParty[k]), display: avg(byParty[k]).toFixed(1) + ' pers.' }; });
      barChart($('#chartAvgParty'), partyRows);
      var overallParty = visits.length ? avg(visits.map(function (v) { return v.party || 1; })) : 0;
      $('#partyAvgBig').textContent = overallParty ? overallParty.toFixed(1) : '—';
      $('#partyAvgNote').textContent = visits.length ? 'Promedio en ' + visits.length + ' visitas' : 'Sin visitas registradas';

      /* Avg prep time */
      var prepTimes = orders.filter(function (o) { return o.doneAt && o.sent; }).map(function (o) { return (o.doneAt - o.sent) / 60000; });
      var prepAvg = avg(prepTimes);
      $('#prepAvgBig').textContent = prepTimes.length ? fmtMins(prepAvg) : '—';
      $('#prepAvgNote').textContent = prepTimes.length ? prepTimes.length + ' órdenes completadas' : 'Sin comandas completadas';

      /* Avg dwell per table */
      var byDwell = {};
      visits.forEach(function (v) { (byDwell[v.table] = byDwell[v.table] || []).push(((v.closed || v.seated) - v.seated) / 60000); });
      var dwellRows = Object.keys(byDwell).sort().map(function (k) { return { label: k, value: avg(byDwell[k]), display: fmtMins(avg(byDwell[k])) }; });
      barChart($('#chartDwell'), dwellRows);

      /* Month comparison table */
      var agg = {};
      visits.forEach(function (v) {
        var m = moOf(v.closed || v.seated);
        agg[m] = agg[m] || { visits: 0, parties: [], dwell: [] };
        agg[m].visits++; agg[m].parties.push(v.party || 1); agg[m].dwell.push(((v.closed || v.seated) - v.seated) / 60000);
      });
      orders.forEach(function (o) {
        if (!o.doneAt) return;
        var m = moOf(o.doneAt);
        agg[m] = agg[m] || { visits: 0, parties: [], dwell: [], prep: [] };
        agg[m].prep = agg[m].prep || [];
        agg[m].prep.push((o.doneAt - o.sent) / 60000);
      });
      var body = $('#monthTableBody');
      body.innerHTML = Object.keys(agg).sort().map(function (m) {
        var r = agg[m];
        return '<tr class="border-t border-outline-variant/10">' +
          '<td class="py-3 pr-3 font-body-md text-body-md text-primary">' + moLabel(m) + '</td>' +
          '<td class="py-3 pr-3 text-center font-body-md text-body-md text-on-surface">' + r.visits + '</td>' +
          '<td class="py-3 pr-3 text-center font-body-md text-body-md text-on-surface">' + avg(r.parties).toFixed(1) + '</td>' +
          '<td class="py-3 pr-3 text-center font-body-md text-body-md text-on-surface">' + (r.prep && r.prep.length ? fmtMins(avg(r.prep)) : '—') + '</td>' +
          '<td class="py-3 text-center font-body-md text-body-md text-on-surface">' + fmtMins(avg(r.dwell)) + '</td>' +
        '</tr>';
      }).join('') || '<tr><td class="py-3 font-body-md text-body-md text-on-surface-variant" colspan="5">Sin datos.</td></tr>';
    }

    sel.addEventListener('change', render);
    render();
  }
  if ($('#analyticsRoot')) analyticsApp();

  /* =========================================================
   * Settings (settings.html) — chambu_settings
   * ========================================================= */
  function settingsApp() {
    var form = $('[data-settings-form]');
    if (!form) return;
    var s = getSettings();

    function set(name, val) {
      var el = $('[name="' + name + '"]', form);
      if (el) el.value = val;
    }
    set('restaurant', s.restaurant);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      saveSettings({
        restaurant: ($('[name="restaurant"]', form).value.trim() || 'Chambú Kitchen & Bar')
      });
      showToast('Settings saved', true);
    });

    var reset = $('#btnResetSettings');
    if (reset) {
      reset.addEventListener('click', function () {
        saveSettings({ restaurant: 'Chambú Kitchen & Bar' });
        set('restaurant', 'Chambú Kitchen & Bar');
        showToast('Settings reset to defaults', true);
      });
    }
  }
  if ($('[data-settings-form]')) settingsApp();
})();