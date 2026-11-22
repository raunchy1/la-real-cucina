(() => {
  'use strict';

  // 1. Mobile drawer toggle
  const menuBtn = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Hero architectural slideshow
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const captionEl = document.getElementById('hero-caption');
  const countEl = document.getElementById('hero-count');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  let curSlide = 0;
  let slideTimer = null;

  function showSlide(idx) {
    if (!slides.length) return;
    curSlide = (idx + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === curSlide));
    if (captionEl) captionEl.textContent = slides[curSlide].dataset.caption || '';
    if (countEl) countEl.textContent = `0${curSlide + 1} / 0${slides.length}`;
  }

  function startAuto() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(curSlide + 1), 6500);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(curSlide - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(curSlide + 1); startAuto(); });
  if (slides.length) {
    showSlide(0);
    startAuto();
  }

  // 3. Rooms & Veranda interactive photo switcher
  const stageImg = document.getElementById('room-stage-img');
  const stageCap = document.getElementById('room-stage-caption');
  const stageIdx = document.getElementById('room-stage-idx');
  const thumbs = Array.from(document.querySelectorAll('.room-thumb'));

  thumbs.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      thumbs.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      if (stageImg) {
        stageImg.src = btn.dataset.src;
        stageImg.alt = btn.dataset.alt || '';
      }
      if (stageCap) stageCap.textContent = btn.dataset.caption || '';
      if (stageIdx) stageIdx.textContent = `0${i + 1} / 0${thumbs.length}`;
    });
  });

  // 4. Breakfast tabs (Dolce / Salata / Su misura)
  const btabs = Array.from(document.querySelectorAll('.btab'));
  const bpanels = Array.from(document.querySelectorAll('.breakfast-panel'));
  btabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      btabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      bpanels.forEach((p) => {
        p.classList.toggle('is-active', p.id === 'panel-' + target);
      });
    });
  });

  // 5. Multilingual quick switch (IT / EN / FR) — fixes old broken French links!
  const I18N = {
    it: {
      heroMetaLoc: 'Alghero · Riviera del Corallo · Sardegna',
      heroH1: 'Tra gli ulivi di Alghero, <em>a cinque minuti dal mare.</em>',
      heroLede: 'Piscina immersa nel verde della campagna, camere con ingresso indipendente e le torte fatte in casa da Daniela ogni mattina.',
      ctaBook: 'Richiedi preventivo diretto',
      ctaExplore: 'Scopri il B&B',
      idx1t: '2 km da Alghero',
      idx1d: 'A 5 minuti dalla spiaggia di Maria Pia, fuori dal traffico estivo.',
      idx2t: 'Piscina tra gli ulivi',
      idx2d: 'Lettini, teli, gazebo e quiete di campagna dopo il mare.',
      idx3t: 'Colazione home made',
      idx3d: 'Lievito madre, uova nostre e una torta fresca diversa ogni giorno.',
      idx4t: 'Miglior prezzo diretto',
      idx4d: 'Zero commissioni · cancellazione gratuita fino a 14 giorni prima.'
    },
    en: {
      heroMetaLoc: 'Alghero · Coral Riviera · Sardinia',
      heroH1: 'Among Alghero’s olive trees, <em>five minutes from the sea.</em>',
      heroLede: 'Outdoor swimming pool in the green countryside, independent-entrance rooms with private veranda, and Daniela’s homemade breakfast baked fresh every morning.',
      ctaBook: 'Request Direct Quote',
      ctaExplore: 'Explore the B&B',
      idx1t: '2 km from Alghero',
      idx1d: '5 minutes to Maria Pia beach, away from summer traffic.',
      idx2t: 'Pool in the olive grove',
      idx2d: 'Sunbeds, towels, shaded gazebo and peaceful countryside.',
      idx3t: 'Homemade breakfast',
      idx3d: 'Sourdough pastries, fresh farm eggs and a new cake every day.',
      idx4t: 'Best Direct Rate',
      idx4d: 'No OTA fees · free cancellation up to 14 days before arrival.'
    },
    fr: {
      heroMetaLoc: 'Alghero · Riviera du Corail · Sardaigne',
      heroH1: 'Parmi les oliviers d’Alghero, <em>à cinq minutes de la mer.</em>',
      heroLede: 'Piscine entourée de verdure, chambres avec entrée indépendante et véranda privée, et petit-déjeuner maison préparé chaque matin par Daniela.',
      ctaBook: 'Demander un devis direct',
      ctaExplore: 'Découvrir le B&B',
      idx1t: 'À 2 km d’Alghero',
      idx1d: 'À 5 minutes de la plage Maria Pia, loin du trafic estival.',
      idx2t: 'Piscine au calme',
      idx2d: 'Transats, serviettes, tonnelle et nature méditerranéenne.',
      idx3t: 'Petit-déjeuner maison',
      idx3d: 'Levain naturel, œufs frais et un gâteau différent chaque matin.',
      idx4t: 'Meilleur tarif direct',
      idx4d: 'Sans commission · annulation gratuite jusqu’à 14 jours avant.'
    }
  };

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (!I18N[lang]) return;
      document.querySelectorAll('.lang-btn').forEach((b) => b.classList.toggle('is-active', b.dataset.lang === lang));
      const d = I18N[lang];
      const setHtml = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
      const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setTxt('i18n-loc', d.heroMetaLoc);
      setHtml('hero-h1', d.heroH1);
      setTxt('hero-lede', d.heroLede);
      setTxt('i18n-cta-book', d.ctaBook);
      setTxt('i18n-cta-explore', d.ctaExplore);
      setTxt('i18n-idx1t', d.idx1t); setTxt('i18n-idx1d', d.idx1d);
      setTxt('i18n-idx2t', d.idx2t); setTxt('i18n-idx2d', d.idx2d);
      setTxt('i18n-idx3t', d.idx3t); setTxt('i18n-idx3d', d.idx3d);
      setTxt('i18n-idx4t', d.idx4t); setTxt('i18n-idx4d', d.idx4d);
    });
  });

  // 6. Direct Stay Quote Builder (WhatsApp + Email)
  const fIn = document.getElementById('q-checkin');
  const fOut = document.getElementById('q-checkout');
  const fGuests = document.getElementById('q-guests');
  const fBreak = document.getElementById('q-breakfast');
  const fEbike = document.getElementById('q-ebike');
  const fShuttle = document.getElementById('q-shuttle');
  const fName = document.getElementById('q-name');
  const preview = document.getElementById('quote-preview');
  const waBtn = document.getElementById('btn-send-wa');
  const mailBtn = document.getElementById('btn-send-mail');

  function formatDateIt(val) {
    if (!val) return '';
    const [y, m, d] = val.split('-');
    return `${d}/${m}/${y}`;
  }

  function updateQuote() {
    const ci = fIn ? fIn.value : '';
    const co = fOut ? fOut.value : '';
    const guests = fGuests ? fGuests.value : '2 ospiti (Camera Matrimoniale)';
    const brk = fBreak ? fBreak.value : 'Dolce fatta in casa';
    const name = fName ? fName.value.trim() : '';
    const extras = [];
    if (fEbike && fEbike.checked) extras.push('Noleggio E-Bike');
    if (fShuttle && fShuttle.checked) extras.push('Navetta Aeroporto Alghero');

    let nightsStr = '';
    if (ci && co) {
      const diff = Math.round((new Date(co) - new Date(ci)) / 86400000);
      if (diff > 0) nightsStr = ` (${diff} ${diff === 1 ? 'notte' : 'notti'})`;
    }

    const lines = [
      `Buongiorno Francesco e Daniela,`,
      `vorrei chiedere disponibilità e miglior preventivo diretto presso il B&B Istentales Alghero:`,
      ci || co ? `• Date: ${ci ? formatDateIt(ci) : 'da definire'} → ${co ? formatDateIt(co) : 'da definire'}${nightsStr}` : `• Periodo: da concordare`,
      `• Sistemazione: ${guests}`,
      `• Colazione preferita: ${brk}`,
    ];
    if (extras.length) lines.push(`• Servizi extra: ${extras.join(', ')}`);
    if (name) lines.push(`• Nome: ${name}`);
    lines.push(`Grazie mille!`);

    const text = lines.join('\n');
    if (preview) preview.textContent = text;
    if (waBtn) waBtn.href = `https://wa.me/393294324502?text=${encodeURIComponent(text)}`;
    if (mailBtn) {
      const subj = `Richiesta preventivo diretto — B&B Istentales${ci ? ' (' + formatDateIt(ci) + ')' : ''}`;
      mailBtn.href = `mailto:beb.istentales@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(text)}`;
    }
  }

  [fIn, fOut, fGuests, fBreak, fEbike, fShuttle, fName].forEach((el) => {
    if (el) {
      el.addEventListener('input', updateQuote);
      el.addEventListener('change', updateQuote);
    }
  });
  updateQuote();
})();
