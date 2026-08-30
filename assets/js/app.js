(function () {
  'use strict';

  /* ---- Active navigation ---- */
  var currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-nav]').forEach(function (link) {
    var href = (link.getAttribute('href') || '').toLowerCase();
    if (href === currentPage) {
      link.classList.add('nav-active');
    }
  });

  /* ---- Generic helpers ---- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function money(n) { return '$' + n.toFixed(2); }

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

  /* =========================================================
   * POS & Billing (pos.html) — ticket, totals, payment flow
   * ========================================================= */
  function posApp() {
    var params = new URLSearchParams(location.search);
    var table = params.get('table');
    var taxRate = 0.085;
    var serviceRate = 0.18;

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
})();