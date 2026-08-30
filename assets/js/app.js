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
    var cards = $$('[data-category]');
    var search = $('#invSearch');

    function activeVal() {
      var t = $('[data-inv-filter].active');
      return t ? t.getAttribute('data-inv-filter') : 'all';
    }

    function apply() {
      var active = activeVal();
      var q = (search && search.value ? search.value.toLowerCase() : '');

      cards.forEach(function (card) {
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

    $$('.restock-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('[data-category]');
        if (!card) return;
        var stock = parseFloat(card.getAttribute('data-stock') || '0');
        var next = stock + 5;
        card.setAttribute('data-stock', String(next));
        var display = $('.stock-count', card);
        if (display) display.textContent = next;
        var badge = $('[data-stock-state]', card);
        if (badge) {
          badge.textContent = 'IN STOCK';
          badge.className = 'px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm';
        }
        card.classList.remove('border-error/30');
      });
    });
  }
  if ($('[data-inv-filter]')) inventoryApp();

  /* =========================================================
   * Menu Editor (menu.html) — availability toggle
   * ========================================================= */
  $$('.avail-toggle').forEach(function (label) {
    label.addEventListener('click', function () {
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
    });
  });

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

    /* Add item to ticket */
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
            '<button class="block mt-2 text-on-surface-variant hover:text-error transition-colors material-symbols-outlined text-[18px]" title="Remove">close</button>' +
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
      if (load()) return;
      var now = Date.now();
      save([
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
      ]);
      localStorage.setItem('chambu_ticket_next', '8904');
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