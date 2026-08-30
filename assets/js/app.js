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
    { page: 'kitchen.html', icon: 'oven_gen', label: 'Kitchen Display' },
    { page: 'settings.html', icon: 'settings', label: 'Settings' },
    { page: 'support.html', icon: 'help_outline', label: 'Support' }
  ];
  var currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* ---- Generic helpers ---- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function money(n) { return '$' + n.toFixed(2); }

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

  function getSettings() {
    var d = { restaurant: 'Chambú Kitchen & Bar', tax: 8.5, service: 18 };
    try {
      var s = JSON.parse(localStorage.getItem('chambu_settings') || 'null');
      if (s && typeof s === 'object') {
        if (s.restaurant) d.restaurant = String(s.restaurant);
        if (!isNaN(parseFloat(s.tax))) d.tax = parseFloat(s.tax);
        if (!isNaN(parseFloat(s.service))) d.service = parseFloat(s.service);
      }
    } catch (e) {}
    d.tax = Math.max(0, d.tax);
    d.service = Math.max(0, d.service);
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
    var taxRate = settings.tax / 100;
    var serviceRate = settings.service / 100;

    function recalc() {
      var items = $$('[data-price]');
      var subtotal = 0;
      items.forEach(function (it) {
        subtotal += parseFloat(it.getAttribute('data-price') || '0');
      });
      var tax = subtotal * taxRate;
      var service = subtotal * serviceRate;
      var total = subtotal + tax + service;
      var t = $('#ticketSubtotal'); if (t) t.textContent = money(subtotal);
      var tx = $('#ticketTax'); if (tx) tx.textContent = money(tax);
      var sv = $('#ticketService'); if (sv) sv.textContent = money(service);
      var tl = $('#ticketTotal'); if (tl) tl.textContent = money(total);
      var tmpay = $('#payAmount'); if (tmpay) tmpay.textContent = money(total);
      var tmpay2 = $('#payAmountSuccess'); if (tmpay2) tmpay2.textContent = money(total);
      var taxLab = $('#taxLabel'); if (taxLab) taxLab.textContent = 'Tax (' + settings.tax.toFixed(1) + '%)';
      var svcLab = $('#serviceLabel'); if (svcLab) svcLab.textContent = 'Service Charge (' + settings.service.toFixed(1) + '%)';
    }

    var totalEl = $('#ticketTitle');
    if (table && totalEl) {
      totalEl.textContent = 'Table ' + table;
      document.title = 'Table ' + table + ' - Chambú Kitchen & Bar';
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
      save(orders);
      render();
      if (order.status === 'done') showToast('Order #' + order.id + ' complete', true);
    });
  }
  if ($('#colNew')) kdsApp();

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
    set('tax', s.tax);
    set('service', s.service);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      saveSettings({
        restaurant: ($('[name="restaurant"]', form).value.trim() || 'Chambú Kitchen & Bar'),
        tax: parseFloat($('[name="tax"]', form).value) || 0,
        service: parseFloat($('[name="service"]', form).value) || 0
      });
      showToast('Settings saved', true);
    });

    var reset = $('#btnResetSettings');
    if (reset) {
      reset.addEventListener('click', function () {
        saveSettings({ restaurant: 'Chambú Kitchen & Bar', tax: 8.5, service: 18 });
        set('restaurant', 'Chambú Kitchen & Bar');
        set('tax', 8.5);
        set('service', 18);
        showToast('Settings reset to defaults', true);
      });
    }
  }
  if ($('[data-settings-form]')) settingsApp();
})();