// ============================================================================
// consts.ts — Configuración central del sitio
// Edita este archivo para cambiar nombre, textos globales, contacto y redes.
// El copy editable de secciones vive en src/data/content.ts.
// ============================================================================

export const SITE = {
  name: 'Cielo Austral',
  tagline: 'Astroturismo bajo los cielos más oscuros del hemisferio sur',
  description:
    'Cielo Austral ofrece tours guiados de observación astronómica, expediciones fotográficas y experiencias educativas bajo el cielo nocturno de Chile.',
  locale: 'es-CL',
  url: 'https://www.cieloaustral.cl',
  themeColor: '#05060A',
};

export const CONTACT = {
  email: 'contacto@cieloaustral.cl',
  phone: '+56 9 0000 0000',
  whatsapp: '56900000000', // solo números, se usa en enlaces wa.me
  address: 'San Pedro de Atacama, Región de Antofagasta, Chile',
  instagram: 'https://instagram.com/cieloaustral',
  facebook: 'https://facebook.com/cieloaustral',
};

export const NAV_ITEMS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Quiénes somos', href: '#quienes-somos' },
  { label: 'Qué hacemos', href: '#que-hacemos' },
  { label: 'Próximos tours', href: '#proximos-tours' },
  { label: 'Tours realizados', href: '#tours-realizados' },
  { label: 'Tarifas', href: '#tarifas' },
  { label: 'Contacto', href: '#contacto' },
];
