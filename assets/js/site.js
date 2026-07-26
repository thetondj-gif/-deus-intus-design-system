(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const mobilePanel = $('#mobilePanel');
  const mobileOverlay = $('#mobileOverlay');
  const mobileToggle = $('#mobileToggle');
  const mobileClose = $('#mobileClose');
  const mobileFocusables = () => $$('a[href], button:not([disabled])', mobilePanel);
  const closeMobile = ({ restoreFocus = true } = {}) => {
    mobilePanel?.classList.remove('is-open');
    mobilePanel?.setAttribute('aria-hidden', 'true');
    if (mobilePanel) mobilePanel.inert = true;
    mobileOverlay?.classList.remove('is-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restoreFocus) mobileToggle?.focus();
  };
  mobileToggle?.addEventListener('click', () => {
    const open = !mobilePanel?.classList.contains('is-open');
    mobilePanel?.classList.toggle('is-open', open);
    mobilePanel?.setAttribute('aria-hidden', String(!open));
    if (mobilePanel) mobilePanel.inert = !open;
    mobileOverlay?.classList.toggle('is-open', open);
    mobileToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) requestAnimationFrame(() => mobileClose?.focus());
  });
  mobileOverlay?.addEventListener('click', closeMobile);
  mobileClose?.addEventListener('click', closeMobile);
  $$('#mobilePanel a').forEach(a => a.addEventListener('click', () => closeMobile({ restoreFocus: false })));
  document.addEventListener('keydown', event => {
    if (!mobilePanel?.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMobile();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = mobileFocusables();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  $$('.nav-menu').forEach(menu => {
    menu.addEventListener('toggle', () => {
      if (menu.open) $$('.nav-menu').filter(x => x !== menu).forEach(x => x.removeAttribute('open'));
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-menu')) $$('.nav-menu[open]').forEach(x => x.removeAttribute('open'));
  });

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }), { threshold: .12 })
    : null;
  $$('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('is-visible'));

  const glow = $('#cursorGlow');
  if (glow && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  $$('[data-rail]').forEach(wrapper => {
    const rail = $('.product-rail', wrapper);
    $('[data-prev]', wrapper)?.addEventListener('click', () => rail?.scrollBy({ left: -(rail.clientWidth * .78), behavior: 'smooth' }));
    $('[data-next]', wrapper)?.addEventListener('click', () => rail?.scrollBy({ left: rail.clientWidth * .78, behavior: 'smooth' }));
  });

  const searchDialog = $('#searchDialog');
  const searchInput = $('#globalSearchInput');
  const searchResults = $('#searchResults');
  const openSearch = () => {
    if (!searchDialog) return;
    searchDialog.showModal();
    setTimeout(() => searchInput?.focus(), 60);
  };
  $$('[data-open-search]').forEach(btn => btn.addEventListener('click', openSearch));
  $('#searchClose')?.addEventListener('click', () => searchDialog?.close());
  searchDialog?.addEventListener('click', e => { if (e.target === searchDialog) searchDialog.close(); });

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const renderSearch = query => {
    if (!searchResults) return;
    const index = window.DEUS_SEARCH_INDEX || [];
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matches = terms.length ? index.filter(item => terms.every(t => item.search.includes(t))).slice(0, 12) : index.slice(0, 8);
    searchResults.innerHTML = matches.length ? matches.map(item => `
      <a class="search-result" href="${escapeHtml(item.url)}">
        <img src="${escapeHtml(item.image)}" alt="" loading="lazy">
        <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.type || '')}</small></div>
        <span>${escapeHtml(item.price || '')}</span>
      </a>`).join('') : '<p>No matching pieces. Try a collection, product name or intention.</p>';
  };
  searchInput?.addEventListener('input', e => renderSearch(e.target.value));
  if (searchInput) renderSearch('');

  const quickDialog = $('#quickDialog');
  const quickImage = $('#quickImage');
  const quickTitle = $('#quickTitle');
  const quickPrice = $('#quickPrice');
  const quickDescription = $('#quickDescription');
  const quickLink = $('#quickLink');
  $$('[data-quick-id]').forEach(btn => btn.addEventListener('click', () => {
    const product = (window.DEUS_PRODUCTS || {})[btn.dataset.quickId];
    if (!product || !quickDialog) return;
    quickImage.src = product.image;
    quickImage.alt = product.alt;
    quickTitle.textContent = product.title;
    quickPrice.textContent = product.price;
    quickDescription.textContent = product.short_description;
    quickLink.href = product.url;
    quickDialog.showModal();
  }));
  $('#quickClose')?.addEventListener('click', () => quickDialog?.close());
  quickDialog?.addEventListener('click', e => { if (e.target === quickDialog) quickDialog.close(); });

  const grid = $('#productGrid');
  if (grid) {
    const cards = $$('.product-card', grid);
    const count = $('#productCount');
    const empty = $('#emptyState');
    const search = $('#catalogueSearch');
    const sort = $('#sortProducts');
    const checks = $$('[data-filter]');
    const apply = () => {
      const query = (search?.value || '').toLowerCase().trim();
      const active = {};
      checks.filter(c => c.checked).forEach(c => (active[c.dataset.filter] ||= []).push(c.value.toLowerCase()));
      let shown = 0;
      cards.forEach(card => {
        const matchesQuery = !query || card.dataset.search.includes(query);
        const matchesFilters = Object.entries(active).every(([key, values]) => values.some(v => (card.dataset[key] || '').split('|').includes(v)));
        const visible = matchesQuery && matchesFilters;
        card.hidden = !visible;
        if (visible) shown++;
      });
      count && (count.textContent = `${shown} ${shown === 1 ? 'piece' : 'pieces'}`);
      empty?.classList.toggle('is-visible', shown === 0);
      if (sort?.value) {
        const visibleCards = cards.filter(c => !c.hidden);
        visibleCards.sort((a,b) => {
          if (sort.value === 'price-asc') return +a.dataset.price - +b.dataset.price;
          if (sort.value === 'price-desc') return +b.dataset.price - +a.dataset.price;
          if (sort.value === 'name') return a.dataset.title.localeCompare(b.dataset.title);
          return +a.dataset.rank - +b.dataset.rank;
        }).forEach(c => grid.append(c));
      }
    };
    search?.addEventListener('input', apply);
    sort?.addEventListener('change', apply);
    checks.forEach(c => c.addEventListener('change', apply));
    $('#clearFilters')?.addEventListener('click', () => { checks.forEach(c => c.checked = false); if (search) search.value=''; if (sort) sort.value='featured'; apply(); });

    $$('.product-card__swatch', grid).forEach(button => button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const primaryImage = $('.product-card__primary', card);
      const secondaryImage = $('.product-card__secondary', card);
      const colour = button.dataset.colour || '';
      if (primaryImage && button.dataset.image && button.dataset.imageVerified === 'true') {
        primaryImage.src = button.dataset.image;
        primaryImage.alt = `${colour} ${card.dataset.title || 'product'} back design`;
        if (secondaryImage) {
          const frontImage = button.dataset.secondaryImage || '';
          if (frontImage && frontImage !== button.dataset.image) {
            secondaryImage.src = frontImage;
            secondaryImage.alt = `${colour} ${card.dataset.title || 'product'} front detail`;
            secondaryImage.hidden = false;
            $('.product-card__media', card)?.classList.add('has-secondary');
          } else {
            secondaryImage.hidden = true;
            $('.product-card__media', card)?.classList.remove('has-secondary');
          }
        }
      }
      const selectedColourLabel = $('.product-card__selected-colour', card);
      if (selectedColourLabel) selectedColourLabel.textContent = colour;
      $$('.product-card__swatch', card).forEach(swatch => {
        const selected = swatch === button;
        swatch.classList.toggle('is-active', selected);
        swatch.setAttribute('aria-pressed', String(selected));
      });
      const destination = `${card.dataset.productPath}?colour=${encodeURIComponent(colour)}`;
      $$('.product-card__media, .product-card__meta h3 a', card).forEach(link => { link.href = destination; });
      card.dataset.selectedColour = colour;
      card.dataset.variantLink = button.dataset.variantLink || '';
    }));
    apply();

    const filterPanel = $('#filterPanel');
    $('#mobileFilterButton')?.addEventListener('click', () => filterPanel?.classList.add('is-open'));
    $('#closeFilters')?.addEventListener('click', () => filterPanel?.classList.remove('is-open'));
  }

  if (window.DEUS_VARIANTS) {
    const variants = window.DEUS_VARIANTS;
    const media = window.DEUS_PRODUCT_MEDIA || {};
    const requestedColour = new URLSearchParams(location.search).get('colour');
    let selectedColour = variants.some(v => v.colour === requestedColour) ? requestedColour : (variants[0]?.colour || '');
    let selectedSize = variants[0]?.size || '';
    const purchase = $('#purchaseLink');
    const status = $('#variantStatus');
    const primaryImage = $('#primaryProductImage');
    const secondaryImage = $('#secondaryProductImage');
    const lifestyleImage = $('#lifestyleProductImage');
    const price = $('#productPrice');
    const sync = () => {
      const sizesForColour = [...new Set(variants.filter(v => !selectedColour || v.colour === selectedColour).map(v => v.size).filter(Boolean))];
      if (sizesForColour.length && !sizesForColour.includes(selectedSize)) selectedSize = sizesForColour[0];
      const variant = variants.find(v => v.colour === selectedColour && v.size === selectedSize) || variants.find(v => v.colour === selectedColour) || variants[0];
      if (!variant) return;
      if (purchase) purchase.href = variant.link;
      const verifiedColourImage = media.colour_images?.[selectedColour];
      const selectedMedia = media.colour_media?.[selectedColour] || {};
      if (primaryImage && media.has_distinct_colour_images && verifiedColourImage) {
        primaryImage.src = selectedMedia.back || selectedMedia.front || verifiedColourImage;
        primaryImage.alt = `${selectedColour} product back design`;
      }
      if (secondaryImage) {
        const frontImage = selectedMedia.front || '';
        secondaryImage.closest('figure').hidden = !frontImage || frontImage === primaryImage?.src;
        if (frontImage) {
          secondaryImage.src = frontImage;
          secondaryImage.alt = `${selectedColour} product front detail`;
        }
      }
      if (lifestyleImage) {
        const lifestyle = selectedMedia.lifestyle?.[0] || '';
        lifestyleImage.closest('figure').hidden = !lifestyle;
        if (lifestyle) {
          lifestyleImage.src = lifestyle;
          lifestyleImage.alt = `${selectedColour} product lifestyle view`;
        }
      }
      if (price && variant.price) price.textContent = `£${Number(variant.price).toFixed(Number(variant.price) % 1 ? 2 : 0)}`;
      if (status) status.textContent = variant.availability === 'in stock' ? 'Available through our fulfilment partner' : variant.availability;
      const colourName = $('#selectedColourName');
      if (colourName) colourName.textContent = selectedColour;
      const nextUrl = new URL(location.href);
      nextUrl.searchParams.set('colour', selectedColour);
      history.replaceState({}, '', nextUrl);
      $$('.option-button[data-colour]').forEach(b => b.classList.toggle('is-active', b.dataset.colour === selectedColour));
      $$('.option-button[data-size]').forEach(b => {
        b.disabled = sizesForColour.length > 0 && !sizesForColour.includes(b.dataset.size);
        b.classList.toggle('is-active', b.dataset.size === selectedSize);
      });
    };
    $$('.option-button[data-colour]').forEach(btn => btn.addEventListener('click', () => { selectedColour = btn.dataset.colour; sync(); }));
    $$('.option-button[data-size]').forEach(btn => btn.addEventListener('click', () => { selectedSize = btn.dataset.size; sync(); }));
    sync();
  }

  $$('form[data-api-form]').forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('.form-status', form);
    const button = $('button[type="submit"]', form);
    const original = button?.textContent;
    if (status) status.textContent = 'Sending…';
    if (button) button.disabled = true;
    try {
      const response = await fetch(form.dataset.apiForm, {
        method: 'POST', headers: { 'content-type':'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Please try again shortly.');
      form.reset();
      if (status) status.textContent = body.message || 'Thank you. Your message has been received.';
    } catch (err) {
      if (status) status.textContent = err.message || 'Unable to submit right now. Email support@deusintus.com.';
    } finally {
      if (button) { button.disabled = false; button.textContent = original; }
    }
  }));

  $$('[data-digital-checkout]').forEach(button => button.addEventListener('click', async () => {
    const status = button.parentElement?.querySelector('.form-status');
    const original = button.textContent;
    button.disabled = true;
    if (status) status.textContent = 'Opening secure checkout…';
    try {
      const response = await fetch('https://raw.githack.com/thetondj-gif/-deus-intus-design-system/website-preview-site/api/digital-checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ product_id: button.dataset.digitalCheckout }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.checkout_url) throw new Error(body.error || 'Checkout is unavailable.');
      window.location.assign(body.checkout_url);
    } catch (error) {
      if (status) status.textContent = error.message || 'Checkout is unavailable right now.';
      button.disabled = false;
      button.textContent = original;
    }
  }));

  const cookie = $('#cookieBanner');
  if (cookie && !localStorage.getItem('deus-cookie-choice')) cookie.classList.add('is-visible');
  $$('[data-cookie-choice]').forEach(btn => btn.addEventListener('click', () => {
    localStorage.setItem('deus-cookie-choice', btn.dataset.cookieChoice);
    cookie?.classList.remove('is-visible');
  }));
})();
