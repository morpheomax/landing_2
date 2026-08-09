const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const setText = (key, value) => {
  if (value === undefined || value === null) return;
  document.querySelectorAll(`[data-cms="${key}"]`).forEach((el) => {
    el.textContent = String(value);
  });
};

const whatsappUrl = (phone, message = '') => {
  const cleanPhone = String(phone || '').replace(/\D/g, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return cleanPhone ? `https://wa.me/${cleanPhone}${query}` : '#contacto';
};

const renderStats = (stats = []) => {
  const target = document.getElementById('stats-grid');
  if (!target || !Array.isArray(stats)) return;

  target.innerHTML = stats
    .map(
      (item) => `
        <div class="rounded-2xl glass-panel p-6">
          <p class="font-display text-3xl font-semibold text-nova-400 sm:text-4xl">${escapeHtml(item.valor)}</p>
          <p class="font-mono-label mt-2 text-[11px] text-mist-400">${escapeHtml(item.etiqueta)}</p>
        </div>
      `
    )
    .join('');
};

const renderServices = (items = []) => {
  const target = document.getElementById('services-grid');
  if (!target || !Array.isArray(items)) return;

  target.innerHTML = items
    .map(
      (item) => `
        <div data-reveal class="constellation-line pl-6">
          <span class="font-mono-label text-xs text-nebula-400">${escapeHtml(item.codigo)}</span>
          <h3 class="font-display mt-2 text-xl font-semibold text-mist-100">${escapeHtml(item.titulo)}</h3>
          <p class="mt-3 text-sm text-mist-400">${escapeHtml(item.descripcion)}</p>
        </div>
      `
    )
    .join('');
};

const renderUpcomingTours = (section = {}, contact = {}) => {
  const target = document.getElementById('upcoming-tours-grid');
  if (!target || !Array.isArray(section.items)) return;

  target.innerHTML = section.items
    .map((tour) => {
      const total = Number(tour.cuposTotales || 0);
      const available = Number(tour.cuposDisponibles || 0);
      const percentage = total > 0 ? Math.round(((total - available) / total) * 100) : 0;
      const message = `Hola, quiero reservar: ${tour.nombre || ''} (${tour.fecha || ''})`;

      return `
        <article data-reveal class="rounded-2xl p-6 glass-panel ${tour.destacado ? 'ring-1 ring-nova-400/50' : ''}">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="font-mono-label text-[11px] text-nebula-400">${escapeHtml(tour.coordenadas)}</p>
              <h3 class="font-display mt-2 text-lg font-semibold text-mist-100">${escapeHtml(tour.nombre)}</h3>
            </div>
            ${tour.destacado ? `<span class="whitespace-nowrap rounded-full bg-nova-400/15 px-3 py-1 text-[10px] font-semibold text-nova-400">${escapeHtml(section.featuredLabel || 'Destacado')}</span>` : ''}
          </div>
          <dl class="mt-4 space-y-1 text-sm text-mist-400">
            <div class="flex justify-between"><dt>Fecha</dt><dd class="text-mist-100">${escapeHtml(tour.fecha)}</dd></div>
            <div class="flex justify-between"><dt>Lugar</dt><dd class="text-mist-100">${escapeHtml(tour.lugar)}</dd></div>
            <div class="flex justify-between"><dt>Desde</dt><dd class="text-nova-400">${escapeHtml(tour.precioDesde)}</dd></div>
          </dl>
          <div class="mt-4">
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-space-700">
              <div class="h-full rounded-full bg-gradient-to-r from-nebula-500 to-teal-400" style="width: ${Math.max(0, Math.min(100, percentage))}%"></div>
            </div>
            <p class="mt-1.5 text-[11px] text-mist-400">${escapeHtml(available)} de ${escapeHtml(total)} cupos disponibles</p>
          </div>
          <a href="${whatsappUrl(contact.whatsapp, message)}" class="mt-5 inline-block w-full rounded-full bg-mist-100/5 py-2.5 text-center text-sm font-semibold text-mist-100 transition-colors duration-300 hover:bg-nova-400 hover:text-space-950">${escapeHtml(section.reserveCta || 'Reservar')}</a>
        </article>
      `;
    })
    .join('');
};

const renderPastTours = (section = {}) => {
  const target = document.getElementById('past-tours-grid');
  if (!target || !Array.isArray(section.items)) return;

  target.innerHTML = section.items
    .map(
      (tour) => `
        <article data-reveal class="group overflow-hidden rounded-2xl glass-panel">
          <div class="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-space-800 via-nebula-500/20 to-space-950">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-mist-100/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.95-6.95l-2.12 2.12M8.17 15.83l-2.12 2.12m0-13.9l2.12 2.12m9.66 9.66l-2.12-2.12M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </div>
          <div class="p-5">
            <p class="font-mono-label text-[10px] text-nebula-400">${escapeHtml(tour.fecha)} · ${escapeHtml(tour.participantes)} participantes</p>
            <h3 class="font-display mt-2 text-base font-semibold text-mist-100">${escapeHtml(tour.nombre)}</h3>
            <p class="mt-2 text-xs text-mist-400">${escapeHtml(tour.resumen)}</p>
          </div>
        </article>
      `
    )
    .join('');
};

const renderPricing = (section = {}, contact = {}) => {
  const target = document.getElementById('pricing-grid');
  if (!target || !Array.isArray(section.items)) return;

  target.innerHTML = section.items
    .map((plan) => {
      const includes = Array.isArray(plan.incluye) ? plan.incluye : [];
      return `
        <div data-reveal class="flex flex-col rounded-2xl p-7 glass-panel ${plan.destacado ? 'ring-1 ring-nova-400/60 lg:-translate-y-3' : ''}">
          ${plan.destacado ? `<span class="mb-4 inline-block w-fit rounded-full bg-nova-400/15 px-3 py-1 text-[10px] font-semibold text-nova-400">${escapeHtml(section.featuredLabel || 'Destacado')}</span>` : ''}
          <h3 class="font-display text-lg font-semibold text-mist-100">${escapeHtml(plan.nombre)}</h3>
          <p class="mt-3"><span class="font-display text-3xl font-semibold text-mist-100">${escapeHtml(plan.precio)}</span><span class="ml-1 text-xs text-mist-400">${escapeHtml(plan.unidad)}</span></p>
          <p class="mt-3 text-sm text-mist-400">${escapeHtml(plan.descripcion)}</p>
          <ul class="mt-6 flex-1 space-y-3">
            ${includes.map((item) => `<li class="flex items-start gap-2 text-sm text-mist-100/90"><span class="mt-0.5 h-4 w-4 shrink-0 text-teal-400">✓</span>${escapeHtml(item)}</li>`).join('')}
          </ul>
          <a href="${whatsappUrl(contact.whatsapp, `Hola, me interesa el plan: ${plan.nombre || ''}`)}" class="mt-7 inline-block rounded-full py-2.5 text-center text-sm font-semibold transition-transform duration-300 hover:scale-105 ${plan.destacado ? 'bg-nova-400 text-space-950' : 'border border-mist-100/20 text-mist-100'}">${escapeHtml(section.cta || 'Consultar')}</a>
        </div>
      `;
    })
    .join('');
};

const renderFaqs = (items = []) => {
  const target = document.getElementById('faq-list');
  if (!target || !Array.isArray(items)) return;

  target.innerHTML = items
    .map(
      (faq) => `
        <details class="group rounded-xl glass-panel p-4">
          <summary class="cursor-pointer list-none text-sm font-semibold text-mist-100 marker:content-none">${escapeHtml(faq.pregunta)}</summary>
          <p class="mt-2 text-sm text-mist-400">${escapeHtml(faq.respuesta)}</p>
        </details>
      `
    )
    .join('');
};

export async function initCmsContent() {
  try {
    const response = await fetch('/api/content.php', { headers: { Accept: 'application/json' } });
    if (!response.ok) return;
    const result = await response.json();
    const content = result?.content;
    if (!content || typeof content !== 'object') return;

    setText('site.name', content.site?.name);
    setText('site.tagline', content.site?.tagline);
    setText('hero.coordinates', content.hero?.coordinates);
    setText('hero.title', content.hero?.title);
    setText('hero.highlightedTitle', content.hero?.highlightedTitle);
    setText('hero.description', content.hero?.description);
    setText('hero.primaryCta', content.hero?.primaryCta);
    setText('hero.secondaryCta', content.hero?.secondaryCta);
    setText('hero.scrollHint', content.hero?.scrollHint);
    setText('about.eyebrow', content.about?.eyebrow);
    setText('about.title', content.about?.title);
    setText('services.eyebrow', content.services?.eyebrow);
    setText('services.title', content.services?.title);
    setText('upcomingTours.eyebrow', content.upcomingTours?.eyebrow);
    setText('upcomingTours.title', content.upcomingTours?.title);
    setText('pastTours.eyebrow', content.pastTours?.eyebrow);
    setText('pastTours.title', content.pastTours?.title);
    setText('pastTours.description', content.pastTours?.description);
    setText('pricing.eyebrow', content.pricing?.eyebrow);
    setText('pricing.title', content.pricing?.title);
    setText('pricing.note', content.pricing?.note);
    setText('contact.eyebrow', content.contactSection?.eyebrow);
    setText('contact.title', content.contactSection?.title);
    setText('contact.description', content.contactSection?.description);
    setText('contact.submitLabel', content.contactSection?.submitLabel);
    setText('contact.email', content.contact?.email);
    setText('contact.phone', content.contact?.phone);
    setText('contact.address', content.contact?.address);

    document.querySelectorAll('[data-cms-whatsapp]').forEach((link) => {
      link.setAttribute('href', whatsappUrl(content.contact?.whatsapp));
    });

    document.querySelectorAll('[data-cms-email-link]').forEach((link) => {
      if (content.contact?.email) link.setAttribute('href', `mailto:${content.contact.email}`);
    });

    const paragraphs = Array.isArray(content.about?.paragraphs) ? content.about.paragraphs : [];
    document.querySelectorAll('[data-cms-about-paragraph]').forEach((el, index) => {
      if (paragraphs[index]) el.textContent = paragraphs[index];
    });

    renderStats(content.stats);
    renderServices(content.services?.items);
    renderUpcomingTours(content.upcomingTours, content.contact);
    renderPastTours(content.pastTours);
    renderPricing(content.pricing, content.contact);
    renderFaqs(content.contactSection?.faqs);
  } catch {
    // El contenido estático queda como respaldo si el backend no está disponible.
  }
}
