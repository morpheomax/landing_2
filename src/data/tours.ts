// ============================================================================
// tours.ts — Próximos tours y tours realizados
// Agrega, quita o edita objetos de estos arreglos para actualizar el sitio.
// "cupos" y "cuposTotales" alimentan la barra de disponibilidad.
// ============================================================================

export type ProximoTour = {
  id: string;
  nombre: string;
  fecha: string; // texto libre, ej: "14 de septiembre 2026"
  lugar: string;
  coordenadas: string; // estética "coordenadas" tipo carta estelar
  cuposDisponibles: number;
  cuposTotales: number;
  precioDesde: string;
  destacado?: boolean;
};

export const proximosTours: ProximoTour[] = [
  {
    id: 'luna-nueva-atacama',
    nombre: 'Noche de Luna Nueva en el Desierto',
    fecha: '14 de septiembre, 2026',
    lugar: 'Valle de la Luna, San Pedro de Atacama',
    coordenadas: '22.9° S · 68.2° O',
    cuposDisponibles: 6,
    cuposTotales: 20,
    precioDesde: '$45.000 CLP',
    destacado: true,
  },
  {
    id: 'via-lactea-elqui',
    nombre: 'Vía Láctea sobre el Valle del Elqui',
    fecha: '28 de septiembre, 2026',
    lugar: 'Valle del Elqui, Región de Coquimbo',
    coordenadas: '30.1° S · 70.5° O',
    cuposDisponibles: 12,
    cuposTotales: 25,
    precioDesde: '$38.000 CLP',
  },
  {
    id: 'astrofotografia-avanzada',
    nombre: 'Taller de Astrofotografía Avanzada',
    fecha: '10 de octubre, 2026',
    lugar: 'Observatorio Cielo Austral, Atacama',
    coordenadas: '23.4° S · 68.9° O',
    cuposDisponibles: 4,
    cuposTotales: 12,
    precioDesde: '$68.000 CLP',
  },
  {
    id: 'eclipse-parcial',
    nombre: 'Expedición Eclipse Parcial de Luna',
    fecha: '2 de noviembre, 2026',
    lugar: 'Salar de Atacama',
    coordenadas: '23.5° S · 68.3° O',
    cuposDisponibles: 15,
    cuposTotales: 30,
    precioDesde: '$52.000 CLP',
  },
];

export type TourRealizado = {
  id: string;
  nombre: string;
  fecha: string;
  lugar: string;
  participantes: number;
  resumen: string;
};

export const toursRealizados: TourRealizado[] = [
  {
    id: 'lluvia-perseidas-2025',
    nombre: 'Lluvia de Perseidas',
    fecha: 'Agosto 2025',
    lugar: 'Valle de la Luna',
    participantes: 24,
    resumen:
      'Más de dos horas de observación continua con conteo de meteoros en vivo y sesión de astrofotografía grupal.',
  },
  {
    id: 'saturno-oposicion-2025',
    nombre: 'Saturno en Oposición',
    fecha: 'Junio 2025',
    lugar: 'Observatorio Cielo Austral',
    participantes: 18,
    resumen:
      'Observación de los anillos de Saturno con telescopio Dobson de 12", la mejor visibilidad del año.',
  },
  {
    id: 'colegio-andino-2025',
    nombre: 'Programa Educativo Colegio Andino',
    fecha: 'Mayo 2025',
    lugar: 'Valle del Elqui',
    participantes: 42,
    resumen:
      'Jornada educativa para estudiantes de enseñanza media con charla de astrofísica y observación guiada.',
  },
  {
    id: 'via-lactea-corporativo-2025',
    nombre: 'Experiencia Corporativa Vía Láctea',
    fecha: 'Marzo 2025',
    lugar: 'Salar de Atacama',
    participantes: 30,
    resumen:
      'Evento privado para equipo corporativo con cena bajo las estrellas y sesión de fotografía de cielo profundo.',
  },
];

export const cifrasClave = [
  { valor: '120+', etiqueta: 'Tours realizados' },
  { valor: '3.400+', etiqueta: 'Viajeros guiados' },
  { valor: '9', etiqueta: 'Años de experiencia' },
  { valor: '0,02', etiqueta: 'Mag. límite del cielo (mag/arcsec²)' },
];

export type PlanTarifa = {
  id: string;
  nombre: string;
  precio: string;
  unidad: string;
  descripcion: string;
  incluye: string[];
  destacado?: boolean;
};

export const planesTarifas: PlanTarifa[] = [
  {
    id: 'observacion-grupal',
    nombre: 'Observación Grupal',
    precio: '$38.000',
    unidad: 'por persona',
    descripcion: 'Ideal para primera experiencia bajo el cielo del desierto.',
    incluye: [
      'Traslado desde punto de encuentro',
      'Telescopios profesionales compartidos',
      'Guía astronómico certificado',
      'Bebida caliente incluida',
      'Duración: 2,5 horas',
    ],
  },
  {
    id: 'experiencia-privada',
    nombre: 'Experiencia Privada',
    precio: '$120.000',
    unidad: 'grupo hasta 6 personas',
    descripcion: 'Sesión exclusiva con foco en tus intereses astronómicos.',
    incluye: [
      'Todo lo del plan Observación Grupal',
      'Telescopio dedicado para tu grupo',
      'Ruta y horario personalizados',
      'Sesión de fotografía guiada',
      'Duración: 3,5 horas',
    ],
    destacado: true,
  },
  {
    id: 'astrofotografia-pro',
    nombre: 'Astrofotografía Pro',
    precio: '$68.000',
    unidad: 'por persona',
    descripcion: 'Para fotógrafos que buscan capturar cielo profundo.',
    incluye: [
      'Equipo de astrofotografía disponible',
      'Asesoría técnica personalizada',
      'Procesamiento básico de imágenes',
      'Grupo reducido (máx. 8 personas)',
      'Duración: 4 horas',
    ],
  },
];
