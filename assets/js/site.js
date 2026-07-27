(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[character]));

  const normaliseGender = value => {
    const gender = String(value || '').trim().toLowerCase();
    if (['male', 'man', 'men', "men's", 'mens'].includes(gender)) return 'men';
    if (['female', 'woman', 'women', "women's", 'womens', 'ladies'].includes(gender)) return 'women';
    if (['unisex', 'all', 'all-genders'].includes(gender)) return 'unisex';
    return gender;
  };

  const normaliseFilterValue = (key, value) => key === 'gender'
    ? normaliseGender(value)
    : String(value || '').trim().toLowerCase();

  const injectCommerceStyles = () => {
    if ($('#deus-commerce-enhancements')) return;
    const style = document.createElement('style');
    style.id = 'deus-commerce-enhancements';
    style.textContent = `
      .shop-hub{padding:clamp(3.5rem,7vw,7rem) 0;border-bottom:1px solid var(--line);background:linear-gradient(180deg,rgba(15,22,29,.9),rgba(5,8,12,.75))}
      .shop-hub__intro{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.7fr);gap:2rem;align-items:end;margin-bottom:clamp(2rem,5vw,4rem)}
      .shop-hub__intro p:not(.kicker){color:var(--muted);max-width:38rem;margin:0}
      .shop-hub__grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:1rem}
      .shop-route{position:relative;min-height:260px;display:flex;align-items:flex-end;overflow:hidden;border:1px solid var(--line);background:var(--surface);isolation:isolate}
      .shop-route--major{grid-column:span 6;min-height:430px}
      .shop-route--minor{grid-column:span 3}
      .shop-route img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .55s var(--ease)}
      .shop-route::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(3,5,8,.05),rgba(3,5,8,.9));z-index:0}
      .shop-route__copy{position:relative;z-index:1;padding:1.4rem;width:100%}
      .shop-route__copy span{display:block;color:var(--gold-light);font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;font-weight:700}
      .shop-route__copy strong{display:block;margin-top:.35rem;font-family:var(--serif);font-size:clamp(1.75rem,3vw,3rem);font-weight:500;line-height:1}
      .shop-route__copy small{display:block;margin-top:.6rem;color:var(--ivory-soft);font-size:.78rem}
      .shop-route:hover img{transform:scale(1.035)}
      .shop-route:hover{border-color:var(--gold)}
      .shop-browse-heading{padding-top:clamp(3.5rem,7vw,7rem);margin-bottom:2rem}
      .shop-browse-heading p{color:var(--muted);max-width:42rem}
      .catalogue-quick-nav{display:flex;gap:.65rem;overflow-x:auto;padding:.15rem 0 1.25rem;scrollbar-width:none}
      .catalogue-quick-nav::-webkit-scrollbar{display:none}
      .catalogue-chip{flex:0 0 auto;min-height:42px;padding:.65rem 1rem;border:1px solid var(--line);background:rgba(5,8,12,.7);color:var(--ivory-soft);font-size:.64rem;letter-spacing:.11em;text-transform:uppercase;font-weight:700;cursor:pointer}
      .catalogue-chip:hover,.catalogue-chip.is-active{border-color:var(--gold);background:var(--gold);color:#111}
      .gender-gateway{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2rem}
      .gender-gateway__intro{grid-column:1/-1;display:flex;justify-content:space-between;gap:2rem;align-items:end;margin-bottom:.5rem}
      .gender-gateway__intro p{margin:.45rem 0 0;color:var(--muted);max-width:42rem}
      .gender-gateway__button{min-height:116px;text-align:left;padding:1.35rem 1.5rem;border:1px solid var(--line);background:linear-gradient(135deg,rgba(199,154,76,.08),rgba(13,20,28,.95));color:var(--ivory);cursor:pointer;display:flex;justify-content:space-between;align-items:end;gap:1rem}
      .gender-gateway__button:hover,.gender-gateway__button.is-active{border-color:var(--gold);background:linear-gradient(135deg,rgba(199,154,76,.2),rgba(13,20,28,.98))}
      .gender-gateway__button strong{display:block;font-family:var(--serif);font-size:clamp(1.65rem,3vw,2.4rem);font-weight:500;line-height:1}
      .gender-gateway__button span{display:block;margin-top:.45rem;color:var(--ivory-soft);font-size:.75rem}
      .gender-gateway__button b{color:var(--gold-light);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase}
      .shop-catalogue-collapsed{display:none}
      @media(max-width:900px){
        .shop-hub__intro{grid-template-columns:1fr}
        .shop-route--major{grid-column:span 12;min-height:360px}
        .shop-route--minor{grid-column:span 6}
        .gender-gateway{grid-template-columns:1fr}
        .gender-gateway__intro{display:block}
      }
      @media(max-width:600px){
        .shop-route--major,.shop-route--minor{grid-column:span 12;min-height:300px}
        .shop-route--major{min-height:340px}
        .gender-gateway__button{min-height:105px}
      }
    `;
    document.head.append(style);
  };

  injectCommerceStyles();

  const mobilePanel = $('#mobilePanel');
  const mobileOverlay = $('#mobileOverlay');
  const mobileToggle = $('#mobileToggle');
  const mobileClose = $('#mobileClose');
  const mobileFocusables = () => mobilePanel ? $$('a[href], button:not([disabled])', mobilePanel) : [];

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
  $$('#mobilePanel a').forEach(anchor => anchor.addEventListener('click', () => closeMobile({ restoreFocus: false })));

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
      if (menu.open) $$('.nav-menu').filter(other => other !== menu).forEach(other => other.removeAttribute('open'));
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-menu')) $$('.nav-menu[open]').forEach(menu => menu.removeAttribute('open'));
  });

  $$('.main-nav > a').forEach(anchor => {
    if (anchor.textContent.trim() === 'New & Featured' && /\/shop\/?(?:$|[?#])/.test(anchor.href)) {
      anchor.textContent = 'Shop';
    }
  });

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }), { threshold: 0.12 })
    : null;

  const observeReveals = (context = document) => {
    $$('.reveal:not(.is-visible)', context).forEach(element => {
      if (revealObserver) revealObserver.observe(element);
      else element.classList.add('is-visible');
    });
  };
  observeReveals();

  const glow = $('#cursorGlow');
  if (glow && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  $$('[data-rail]').forEach(wrapper => {
    const rail = $('.product-rail', wrapper);
    $('[data-prev]', wrapper)?.addEventListener('click', () => rail?.scrollBy({ left: -(rail.clientWidth * 0.78), behavior: 'smooth' }));
    $('[data-next]', wrapper)?.addEventListener('click', () => rail?.scrollBy({ left: rail.clientWidth * 0.78, behavior: 'smooth' }));
  });

  const searchDialog = $('#searchDialog');
  const searchInput = $('#globalSearchInput');
  const searchResults = $('#searchResults');
  const openSearch = () => {
    if (!searchDialog) return;
    searchDialog.showModal();
    setTimeout(() => searchInput?.focus(), 60);
  };

  $$('[data-open-search]').forEach(button => button.addEventListener('click', openSearch));
  $('#searchClose')?.addEventListener('click', () => searchDialog?.close());
  searchDialog?.addEventListener('click', event => {
    if (event.target === searchDialog) searchDialog.close();
  });

  const renderSearch = query => {
    if (!searchResults) return;
    const index = window.DEUS_SEARCH_INDEX || [];
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matches = terms.length
      ? index.filter(item => terms.every(term => item.search.includes(term))).slice(0, 12)
      : index.slice(0, 8);
    searchResults.innerHTML = matches.length
      ? matches.map(item => `
        <a class="search-result" href="${escapeHtml(item.url)}">
          <img src="${escapeHtml(item.image)}" alt="" loading="lazy">
          <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.type || '')}</small></div>
          <span>${escapeHtml(item.price || '')}</span>
        </a>`).join('')
      : '<p>No matching pieces. Try a collection, product name or intention.</p>';
  };

  searchInput?.addEventListener('input', event => renderSearch(event.target.value));
  if (searchInput) renderSearch('');

  const quickDialog = $('#quickDialog');
  const quickImage = $('#quickImage');
  const quickTitle = $('#quickTitle');
  const quickPrice = $('#quickPrice');
  const quickDescription = $('#quickDescription');
  const quickLink = $('#quickLink');

  $$('[data-quick-id]').forEach(button => button.addEventListener('click', () => {
    const product = (window.DEUS_PRODUCTS || {})[button.dataset.quickId];
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
  quickDialog?.addEventListener('click', event => {
    if (event.target === quickDialog) quickDialog.close();
  });

  const grid = $('#productGrid');
  if (grid) {
    const cards = $$('.product-card', grid);
    const count = $('#productCount');
    const empty = $('#emptyState');
    const catalogueSearch = $('#catalogueSearch');
    const sort = $('#sortProducts');
    const checks = $$('[data-filter]');
    const catalogueLayout = grid.closest('.catalogue-layout');
    const catalogueSection = catalogueLayout?.closest('section');
    const catalogueMain = $('.catalogue-main', catalogueLayout || document);
    const params = new URLSearchParams(location.search);
    const isShopPage = /\/shop\/?$/.test(location.pathname) || /\/website-preview-site\/shop\/?$/.test(location.pathname);
    const lifestyleMatch = location.pathname.match(/\/lifestyle\/([^/]+)\/?$/);
    const lifestyleSlug = lifestyleMatch?.[1] || '';
    const lifestyleNames = {
      'streetwear': 'Streetwear',
      'mindful-movement': 'Mindful Movement',
      'home-leisure': 'Home & Leisure',
      'gym-to-street': 'Gym-to-Street',
      'after-dark': 'After Dark',
    };

    const valuesForCard = (card, key) => String(card.dataset[key] || '')
      .split('|')
      .map(value => normaliseFilterValue(key, value))
      .filter(Boolean);

    const setFilter = (key, value, { clearOthers = true } = {}) => {
      const wanted = normaliseFilterValue(key, value);
      checks.filter(check => check.dataset.filter === key).forEach(check => {
        const checkValue = normaliseFilterValue(key, check.value);
        check.checked = clearOthers ? checkValue === wanted : (check.checked || checkValue === wanted);
      });
    };

    const clearFilter = key => {
      checks.filter(check => check.dataset.filter === key).forEach(check => {
        check.checked = false;
      });
    };

    const selectedValues = key => checks
      .filter(check => check.dataset.filter === key && check.checked)
      .map(check => normaliseFilterValue(key, check.value));

    const syncQueryString = () => {
      const nextUrl = new URL(location.href);
      const gender = selectedValues('gender')[0];
      const category = selectedValues('category')[0];
      if (gender) nextUrl.searchParams.set('range', gender);
      else nextUrl.searchParams.delete('range');
      if (category) nextUrl.searchParams.set('type', category);
      else nextUrl.searchParams.delete('type');
      history.replaceState({}, '', nextUrl);
    };

    const quickNav = document.createElement('div');
    quickNav.className = 'catalogue-quick-nav';
    quickNav.setAttribute('aria-label', 'Quick product filters');

    const availableCategories = new Set(cards.flatMap(card => valuesForCard(card, 'category')));
    const availableGenders = new Set(cards.flatMap(card => valuesForCard(card, 'gender')));
    const chipDefinitions = [
      { label: 'All', key: 'all', value: '' },
      ...(availableGenders.has('men') ? [{ label: 'Men', key: 'gender', value: 'men' }] : []),
      ...(availableGenders.has('women') ? [{ label: 'Women', key: 'gender', value: 'women' }] : []),
      ...(availableCategories.has('t-shirts') ? [{ label: 'T-Shirts', key: 'category', value: 't-shirts' }] : []),
      ...(availableCategories.has('hoodies') ? [{ label: 'Hoodies', key: 'category', value: 'hoodies' }] : []),
      ...(availableCategories.has('sweatshirts') ? [{ label: 'Sweatshirts', key: 'category', value: 'sweatshirts' }] : []),
      ...(availableCategories.has('wall art') ? [{ label: 'Wall Art', key: 'category', value: 'wall art' }] : []),
      ...(availableCategories.has('bundles') ? [{ label: 'Bundles', key: 'category', value: 'bundles' }] : []),
    ];

    chipDefinitions.forEach(definition => {
      const button = document.createElement('button');
      button.className = 'catalogue-chip';
      button.type = 'button';
      button.textContent = definition.label;
      button.dataset.quickKey = definition.key;
      button.dataset.quickValue = definition.value;
      quickNav.append(button);
    });

    $('.catalogue-toolbar', catalogueMain || document)?.before(quickNav);

    const updateQuickControls = () => {
      const activeGender = selectedValues('gender');
      const activeCategory = selectedValues('category');
      $$('.catalogue-chip', quickNav).forEach(button => {
        const key = button.dataset.quickKey;
        const value = normaliseFilterValue(key === 'all' ? '' : key, button.dataset.quickValue);
        const active = key === 'all'
          ? activeGender.length === 0 && activeCategory.length === 0
          : key === 'gender'
            ? activeGender.includes(value)
            : activeCategory.includes(value);
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      $$('[data-gender-gateway]').forEach(button => {
        const active = activeGender.includes(normaliseGender(button.dataset.genderGateway));
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    };

    const apply = ({ syncUrl = false } = {}) => {
      const query = (catalogueSearch?.value || '').toLowerCase().trim();
      const active = {};
      checks.filter(check => check.checked).forEach(check => {
        const key = check.dataset.filter;
        (active[key] ||= []).push(normaliseFilterValue(key, check.value));
      });

      let shown = 0;
      cards.forEach(card => {
        const matchesQuery = !query || String(card.dataset.search || '').toLowerCase().includes(query);
        const matchesFilters = Object.entries(active).every(([key, values]) => {
          const cardValues = valuesForCard(card, key);
          return values.some(value => cardValues.includes(value));
        });
        const visible = matchesQuery && matchesFilters;
        card.hidden = !visible;
        if (visible) shown += 1;
      });

      if (count) count.textContent = `${shown} ${shown === 1 ? 'piece' : 'pieces'}`;
      empty?.classList.toggle('is-visible', shown === 0);

      if (sort?.value) {
        cards.filter(card => !card.hidden).sort((first, second) => {
          if (sort.value === 'price-asc') return Number(first.dataset.price) - Number(second.dataset.price);
          if (sort.value === 'price-desc') return Number(second.dataset.price) - Number(first.dataset.price);
          if (sort.value === 'name') return String(first.dataset.title).localeCompare(String(second.dataset.title));
          return Number(first.dataset.rank) - Number(second.dataset.rank);
        }).forEach(card => grid.append(card));
      }

      updateQuickControls();
      if (syncUrl) syncQueryString();
    };

    quickNav.addEventListener('click', event => {
      const button = event.target.closest('.catalogue-chip');
      if (!button) return;
      const key = button.dataset.quickKey;
      if (key === 'all') {
        clearFilter('gender');
        clearFilter('category');
      } else {
        setFilter(key, button.dataset.quickValue);
      }
      apply({ syncUrl: true });
    });

    const initialGender = params.get('range') || params.get('gender');
    const initialCategory = params.get('type') || params.get('category');
    const initialCollection = params.get('collection');
    if (initialGender) setFilter('gender', initialGender);
    if (initialCategory) setFilter('category', initialCategory);
    if (initialCollection) setFilter('collection', initialCollection);
    if (params.get('sort') && sort) sort.value = params.get('sort');

    if (lifestyleSlug && catalogueLayout) {
      const title = lifestyleNames[lifestyleSlug] || 'This Edit';
      const menCount = cards.filter(card => valuesForCard(card, 'gender').includes('men')).length;
      const womenCount = cards.filter(card => valuesForCard(card, 'gender').includes('women')).length;
      const gateway = document.createElement('div');
      gateway.className = 'gender-gateway';
      gateway.innerHTML = `
        <div class="gender-gateway__intro">
          <div><p class="kicker">Choose your range</p><h2 class="h3">Shop ${escapeHtml(title)} by fit</h2><p>Separate the edit instantly, then refine by product type or collection.</p></div>
        </div>
        ${menCount ? `<button class="gender-gateway__button" type="button" data-gender-gateway="men"><span><strong>Shop Men</strong><span>${menCount} ${menCount === 1 ? 'piece' : 'pieces'} in this edit</span></span><b>View range →</b></button>` : ''}
        ${womenCount ? `<button class="gender-gateway__button" type="button" data-gender-gateway="women"><span><strong>Shop Women</strong><span>${womenCount} ${womenCount === 1 ? 'piece' : 'pieces'} in this edit</span></span><b>View range →</b></button>` : ''}
      `;
      catalogueLayout.prepend(gateway);
      gateway.addEventListener('click', event => {
        const button = event.target.closest('[data-gender-gateway]');
        if (!button) return;
        setFilter('gender', button.dataset.genderGateway);
        apply({ syncUrl: true });
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (isShopPage && catalogueSection) {
      catalogueSection.id = 'catalogue';
      const hero = $('.page-hero');
      const heroHeading = $('.page-hero__copy h1');
      const heroCopy = $('.page-hero__copy > p:last-child');
      const heroKicker = $('.page-hero__copy > .kicker');
      if (heroHeading) heroHeading.textContent = 'Find Your Piece';
      if (heroKicker) heroKicker.textContent = 'The Deus Intus Shop';
      if (heroCopy) heroCopy.textContent = 'Choose by range, product, collection or intention. The complete catalogue remains available when you want it.';

      const base = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
      const hub = document.createElement('section');
      hub.className = 'shop-hub';
      hub.innerHTML = `
        <div class="shell">
          <div class="shop-hub__intro reveal">
            <div><p class="kicker">Start with what matters</p><h2 class="h2">A clearer way to <em>shop.</em></h2></div>
            <p>Go directly to the right range or product family. You can still browse every piece, but the full catalogue no longer gets in the way.</p>
          </div>
          <div class="shop-hub__grid">
            <a class="shop-route shop-route--major reveal" href="../men/">
              <img src="../assets/images/approved-reference/home-men-white-back-v1.jpg" alt="Men's Deus Intus apparel" loading="lazy">
              <span class="shop-route__copy"><span>Shop by range</span><strong>Men</strong><small>Oversized tees, hoodies, sweaters and statement layers.</small></span>
            </a>
            <a class="shop-route shop-route--major reveal" href="../women/">
              <img src="../assets/images/approved-reference/women-beach-white-back-v1.jpg" alt="Women's Deus Intus apparel" loading="lazy">
              <span class="shop-route__copy"><span>Shop by range</span><strong>Women</strong><small>Relaxed tees, conscious layers and symbolic essentials.</small></span>
            </a>
            <a class="shop-route shop-route--minor reveal" href="${base}?type=t-shirts#catalogue"><span class="shop-route__copy"><span>Shop by product</span><strong>T-Shirts</strong><small>Graphic, oversized and relaxed fits.</small></span></a>
            <a class="shop-route shop-route--minor reveal" href="${base}?type=hoodies#catalogue"><span class="shop-route__copy"><span>Shop by product</span><strong>Hoodies</strong><small>Layered warmth with symbolic detail.</small></span></a>
            <a class="shop-route shop-route--minor reveal" href="${base}?type=sweatshirts#catalogue"><span class="shop-route__copy"><span>Shop by product</span><strong>Sweatshirts</strong><small>Elevated comfort and daily intention.</small></span></a>
            <a class="shop-route shop-route--minor reveal" href="../wall-art/"><span class="shop-route__copy"><span>Inner architecture</span><strong>Wall Art</strong><small>Build a space that holds the standard.</small></span></a>
            <a class="shop-route shop-route--minor reveal" href="../collections/inner-command/"><span class="shop-route__copy"><span>Collection</span><strong>Inner Command</strong><small>Master your state.</small></span></a>
            <a class="shop-route shop-route--minor reveal" href="../collections/12-universal-laws/"><span class="shop-route__copy"><span>Collection</span><strong>12 Universal Laws</strong><small>The principles, made wearable.</small></span></a>
            <a class="shop-route shop-route--minor reveal" href="../collections/sacred-geometry/"><span class="shop-route__copy"><span>Collection</span><strong>Sacred Geometry</strong><small>Order, balance and transformation.</small></span></a>
            <a class="shop-route shop-route--minor reveal" href="${base}?browse=all#catalogue"><span class="shop-route__copy"><span>Complete range</span><strong>Browse Everything</strong><small>Open the full filterable catalogue.</small></span></a>
          </div>
        </div>
      `;
      hero?.after(hub);

      const browseHeading = document.createElement('div');
      browseHeading.className = 'shell shop-browse-heading';
      browseHeading.innerHTML = '<p class="kicker">Complete catalogue</p><h2 class="h2">Browse every <em>piece.</em></h2><p>Use the quick routes, search and filters to narrow the full range.</p>';
      catalogueSection.prepend(browseHeading);

      const shouldShowCatalogue = params.get('browse') === 'all'
        || Boolean(initialGender || initialCategory || initialCollection || params.get('sort'));
      catalogueSection.classList.toggle('shop-catalogue-collapsed', !shouldShowCatalogue);
      observeReveals(hub);
    }

    catalogueSearch?.addEventListener('input', () => apply());
    sort?.addEventListener('change', () => apply());
    checks.forEach(check => check.addEventListener('change', () => apply({ syncUrl: true })));
    $('#clearFilters')?.addEventListener('click', () => {
      checks.forEach(check => { check.checked = false; });
      if (catalogueSearch) catalogueSearch.value = '';
      if (sort) sort.value = 'featured';
      apply({ syncUrl: true });
    });

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
    let selectedColour = variants.some(variant => variant.colour === requestedColour)
      ? requestedColour
      : (variants[0]?.colour || '');
    let selectedSize = variants[0]?.size || '';
    const purchase = $('#purchaseLink');
    const status = $('#variantStatus');
    const primaryImage = $('#primaryProductImage');
    const secondaryImage = $('#secondaryProductImage');
    const lifestyleImage = $('#lifestyleProductImage');
    const price = $('#productPrice');

    const sync = () => {
      const sizesForColour = [...new Set(variants
        .filter(variant => !selectedColour || variant.colour === selectedColour)
        .map(variant => variant.size)
        .filter(Boolean))];
      if (sizesForColour.length && !sizesForColour.includes(selectedSize)) selectedSize = sizesForColour[0];
      const variant = variants.find(item => item.colour === selectedColour && item.size === selectedSize)
        || variants.find(item => item.colour === selectedColour)
        || variants[0];
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
      if (price && variant.price) {
        const numericPrice = Number(variant.price);
        price.textContent = `£${numericPrice.toFixed(numericPrice % 1 ? 2 : 0)}`;
      }
      if (status) status.textContent = variant.availability === 'in stock'
        ? 'Available through our fulfilment partner'
        : variant.availability;
      const colourName = $('#selectedColourName');
      if (colourName) colourName.textContent = selectedColour;
      const nextUrl = new URL(location.href);
      nextUrl.searchParams.set('colour', selectedColour);
      history.replaceState({}, '', nextUrl);
      $$('.option-button[data-colour]').forEach(button => {
        button.classList.toggle('is-active', button.dataset.colour === selectedColour);
      });
      $$('.option-button[data-size]').forEach(button => {
        button.disabled = sizesForColour.length > 0 && !sizesForColour.includes(button.dataset.size);
        button.classList.toggle('is-active', button.dataset.size === selectedSize);
      });
    };

    $$('.option-button[data-colour]').forEach(button => button.addEventListener('click', () => {
      selectedColour = button.dataset.colour;
      sync();
    }));
    $$('.option-button[data-size]').forEach(button => button.addEventListener('click', () => {
      selectedSize = button.dataset.size;
      sync();
    }));
    sync();
  }

  $$('form[data-api-form]').forEach(form => form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = $('.form-status', form);
    const button = $('button[type="submit"]', form);
    const original = button?.textContent;
    if (status) status.textContent = 'Sending…';
    if (button) button.disabled = true;
    try {
      const response = await fetch(form.dataset.apiForm, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Please try again shortly.');
      form.reset();
      if (status) status.textContent = body.message || 'Thank you. Your message has been received.';
    } catch (error) {
      if (status) status.textContent = error.message || 'Unable to submit right now. Email support@deusintus.com.';
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = original;
      }
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
  $$('[data-cookie-choice]').forEach(button => button.addEventListener('click', () => {
    localStorage.setItem('deus-cookie-choice', button.dataset.cookieChoice);
    cookie?.classList.remove('is-visible');
  }));
})();