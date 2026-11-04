(() => {
  function init() {
    if (typeof PRODUCTS === 'undefined') return;

    // Reuse the colour names and photographs already supplied for these items.
    for (const p of PRODUCTS) {
      if (p.colours) continue;
      const key = p.image.split('/').pop().split('.')[0];
      const variants = window.BENNI_VARIANTS?.[key];
      if (!variants) continue;
      const seen = new Set();
      p.colours = variants.filter(v => {
        if (seen.has(v.label)) return false;
        seen.add(v.label);
        return true;
      }).map(v => ({name: v.label, image: v.src}));
    }
    const galleries = {
      classyChic: [
        ['Orange', 'assets/classy-chic-orange-top.jpg'],
        ['Black', 'assets/classy-chic-black.jpg'],
        ['Red', 'assets/classy-chic-red-top.jpg']
      ],
      stylishCrossbody: [
        ['Black', 'assets/stylish-crossbody-black.jpg'],
        ['White', 'assets/stylish-crossbody-white.jpg']
      ]
    };
    for (const [id, colours] of Object.entries(galleries)) {
      const p = product(id);
      if (p) p.colours = colours.map(([name, image]) => ({name, image}));
    }
    // ZARA's second photograph is a detail view, not a separate colour.
    const zara = product('zara');
    if (zara) zara.colours = [{name: 'Black', image: 'assets/zara.jpg'}];
    const crystal = product('simmiCrystal');
    if (crystal) {
      crystal.colours = [{name: 'As pictured', image: crystal.image}];
      crystal.sizes = ['37', '38', '39', '40', '41', '42'];
    }

    const open = window.openProduct;
    window.openProduct = function(id) {
      if (!product(id)?.colours) return open(id);
      openOptions(id);
      // Keep the additional gallery views alongside the order selections.
      const extraViews = {
        classyChic: ['assets/classy-chic-black-top.jpg', 'assets/classy-chic-black-side.jpg'],
        stylishCrossbody: ['assets/stylish-crossbody-white-wear.jpg'],
        zara: ['assets/zara-alt.jpg']
      }[id];
      if (!extraViews) return;
      const views = document.createElement('div');
      views.className = 'additional-views';
      for (const [index, src] of extraViews.entries()) {
        const link = document.createElement('a');
        link.href = src;
        link.target = '_blank';
        link.rel = 'noopener';
        link.setAttribute('aria-label', product(id).name + ' additional view ' + (index + 1));
        const image = document.createElement('img');
        image.src = src;
        image.alt = product(id).name + ' additional view ' + (index + 1);
        image.loading = 'lazy';
        link.appendChild(image);
        views.appendChild(link);
      }
      const image = document.getElementById('optionImage');
      const gallery = document.createElement('div');
      image.before(gallery);
      gallery.appendChild(image);
      gallery.appendChild(views);
    };

    const showAll = event => {
      if (event) event.preventDefault();
      document.getElementById('search').value = '';
      setCategory('All', document.querySelector('.chip'));
      document.getElementById('shop').scrollIntoView({behavior: 'smooth'});
    };
    document.querySelectorAll('.v4-title > a').forEach(link => link.addEventListener('click', showAll));
    document.querySelectorAll('.v4-arrow').forEach(button => button.remove());
    document.querySelector('.v4-feature-title h2').textContent = 'SHOP THE COLLECTION';
    const secondary = document.querySelector('.hero .actions .secondary');
    secondary.textContent = 'BROWSE BAGS';
    secondary.addEventListener('click', () => {
      document.getElementById('search').value = '';
      setCategory('Bags', document.querySelectorAll('.chip')[1]);
    });

    const bottom = document.querySelector('.v4-bottom');
    if (bottom) bottom.innerHTML = '<a href="#top"><i aria-hidden="true">⌂</i>Home</a><a href="#shop"><i aria-hidden="true">⊞</i>Shop</a><a href="#contact"><i aria-hidden="true">☎</i>Contact</a><button type="button" onclick="openCart()"><i aria-hidden="true">🛒</i>Cart</button>';
    document.querySelector('.hero').id = 'top';

    const pay = document.querySelector('[onclick="payWithPaystack()"]');
    if (pay) pay.remove();
    document.querySelector('#checkoutOverlay .notice').textContent = 'Order on WhatsApp. We will confirm stock, delivery cost and payment arrangements with you before you complete your purchase.';
    document.querySelector('[onclick="sendCheckoutWhatsApp()"]').textContent = 'SEND ORDER VIA WHATSAPP';
    document.querySelector('#checkoutOverlay .total span').textContent = 'Product subtotal';
    const delivery = document.createElement('p');
    delivery.className = 'buying-info';
    delivery.textContent = 'Delivery is available across Nigeria. Delivery cost and timing will be confirmed on WhatsApp. Please ask about exchange terms before confirming your order.';
    document.getElementById('checkoutForm').before(delivery);
    const renderCartOriginal = window.renderCart;
    window.renderCart = function() {
      renderCartOriginal();
      const label = document.querySelector('#cartFooter .total span');
      if (label) label.textContent = 'Product subtotal';
    };
    const orderTextOriginal = window.orderText;
    window.orderText = function(d) {
      return orderTextOriginal(d).replace('\n\nTOTAL:', '\n\nPRODUCT SUBTOTAL:') + '\nDelivery cost and availability to be confirmed.';
    };
    setupDialogs();
    render();
  }

  function setupDialogs() {
    const overlays = [...document.querySelectorAll('.overlay')];
    let trigger = null;
    let previousOverflow = '';
    let locked = false;
    const disabled = new Set();
    const active = () => document.querySelector('.overlay.show');
    const focusable = overlay => [...overlay.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
    document.addEventListener('click', event => {
      if (!active()) trigger = event.target.closest('button,a') || document.activeElement;
    }, true);
    for (const overlay of overlays) {
      const panel = overlay.querySelector('.panel');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.tabIndex = -1;
      overlay.querySelector('.close').setAttribute('aria-label', 'Close dialog');
    }
    function update() {
      const overlay = active();
      if (overlay) {
        if (!locked) {
          previousOverflow = document.body.style.overflow;
          document.body.style.overflow = 'hidden';
          for (const el of document.body.children) {
            if (el.classList.contains('overlay') || el.inert) continue;
            el.inert = true;
            disabled.add(el);
          }
          locked = true;
        }
        const panel = overlay.querySelector('.panel');
        const title = panel.querySelector('h2');
        if (title) {
          title.id = overlay.id + '-title';
          panel.setAttribute('aria-labelledby', title.id);
        }
        if (!overlay.contains(document.activeElement)) (focusable(overlay)[0] || panel).focus();
      } else if (locked) {
        for (const el of disabled) el.inert = false;
        disabled.clear();
        document.body.style.overflow = previousOverflow;
        locked = false;
        if (trigger?.isConnected) trigger.focus({preventScroll: true});
      }
    }
    const observer = new MutationObserver(update);
    overlays.forEach(overlay => observer.observe(overlay, {attributes: true, attributeFilter: ['class']}));
    document.addEventListener('keydown', event => {
      const overlay = active();
      if (!overlay) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeAll();
      } else if (event.key === 'Tab') {
        const items = focusable(overlay);
        const first = items[0], last = items.at(-1);
        if (!first) {event.preventDefault();return;}
        if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) {
          event.preventDefault();last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !overlay.contains(document.activeElement))) {
          event.preventDefault();first.focus();
        }
      }
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
