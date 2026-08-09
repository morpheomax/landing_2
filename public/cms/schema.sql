CREATE TABLE IF NOT EXISTS cms_content (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  content_key VARCHAR(120) NOT NULL,
  content_value LONGTEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_content_key (content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO cms_content (content_key, content_value) VALUES
('site_payload', '{
  "site": {
    "name": "Cielo Austral",
    "tagline": "Astroturismo bajo los cielos más oscuros del hemisferio sur",
    "description": "Cielo Austral ofrece tours guiados de observación astronómica, expediciones fotográficas y experiencias educativas bajo el cielo nocturno de Chile."
  },
  "contact": {
    "email": "contacto@cieloaustral.cl",
    "phone": "+56 9 0000 0000",
    "whatsapp": "56900000000",
    "address": "San Pedro de Atacama, Región de Antofagasta, Chile"
  },
  "hero": {
    "coordinates": "23.4° S · 68.9° O — Desierto de Atacama, Chile",
    "title": "El cielo mas oscuro",
    "highlightedTitle": "del hemisferio sur",
    "description": "Tours guiados de observacion astronomica, expediciones fotograficas y experiencias educativas bajo miles de estrellas visibles a simple vista.",
    "primaryCta": "Ver proximos tours",
    "secondaryCta": "Que hacemos",
    "scrollHint": "Desplazate para comenzar el recorrido"
  },
  "about": {
    "eyebrow": "Quiénes somos",
    "title": "Guías de cielo, no solo de terreno",
    "paragraphs": [
      "Somos un equipo de astrónomos, guías de montaña y fotógrafos con base en San Pedro de Atacama. Desde hace más de nueve años recorremos el desierto más árido del mundo para llevar a viajeros de todas partes a mirar el cielo como pocas veces lo verán en su vida.",
      "Trabajamos con telescopios profesionales, protocolos de seguridad certificados y un profundo respeto por el entorno: cada tour opera bajo principios de turismo de bajo impacto y contaminación lumínica cero."
    ]
  },
  "stats": [
    { "valor": "120+", "etiqueta": "Tours realizados" },
    { "valor": "3.400+", "etiqueta": "Viajeros guiados" },
    { "valor": "9", "etiqueta": "Años de experiencia" },
    { "valor": "0,02", "etiqueta": "Mag. límite del cielo (mag/arcsec²)" }
  ],
  "services": {
    "eyebrow": "Qué hacemos",
    "title": "Cuatro formas de encontrarte con el cielo",
    "items": [
      { "codigo": "OBS·01", "titulo": "Observación astronómica guiada", "descripcion": "Sesiones nocturnas con telescopios profesionales para observar planetas, cúmulos estelares, nebulosas y galaxias, explicadas por guías especializados." },
      { "codigo": "FOTO·02", "titulo": "Astrofotografía", "descripcion": "Expediciones enfocadas en capturar la Vía Láctea y cielo profundo, con asesoría técnica de cámara, trípode y postproducción básica." },
      { "codigo": "EDU·03", "titulo": "Programas educativos", "descripcion": "Charlas y jornadas de astronomía para colegios, universidades y grupos corporativos, adaptadas al nivel del público." },
      { "codigo": "EXP·04", "titulo": "Experiencias personalizadas", "descripcion": "Salidas privadas para parejas, familias o grupos reducidos, con ruta, horario y foco temático diseñados a medida." }
    ]
  },
  "upcomingTours": {
    "eyebrow": "Próximos tours",
    "title": "Reserva tu próxima noche bajo las estrellas",
    "featuredLabel": "Pocos cupos",
    "reserveCta": "Reservar cupo",
    "items": [
      { "nombre": "Noche de Luna Nueva en el Desierto", "fecha": "14 de septiembre, 2026", "lugar": "Valle de la Luna, San Pedro de Atacama", "coordenadas": "22.9° S · 68.2° O", "cuposDisponibles": 6, "cuposTotales": 20, "precioDesde": "$45.000 CLP", "destacado": true },
      { "nombre": "Vía Láctea sobre el Valle del Elqui", "fecha": "28 de septiembre, 2026", "lugar": "Valle del Elqui, Región de Coquimbo", "coordenadas": "30.1° S · 70.5° O", "cuposDisponibles": 12, "cuposTotales": 25, "precioDesde": "$38.000 CLP" },
      { "nombre": "Taller de Astrofotografía Avanzada", "fecha": "10 de octubre, 2026", "lugar": "Observatorio Cielo Austral, Atacama", "coordenadas": "23.4° S · 68.9° O", "cuposDisponibles": 4, "cuposTotales": 12, "precioDesde": "$68.000 CLP" },
      { "nombre": "Expedición Eclipse Parcial de Luna", "fecha": "2 de noviembre, 2026", "lugar": "Salar de Atacama", "coordenadas": "23.5° S · 68.3° O", "cuposDisponibles": 15, "cuposTotales": 30, "precioDesde": "$52.000 CLP" }
    ]
  },
  "pastTours": {
    "eyebrow": "Tours realizados",
    "title": "Bitácora de expediciones",
    "description": "Un registro de algunas de las noches que hemos compartido con viajeros, colegios y equipos que decidieron mirar hacia arriba.",
    "items": [
      { "nombre": "Lluvia de Perseidas", "fecha": "Agosto 2025", "participantes": 24, "resumen": "Más de dos horas de observación continua con conteo de meteoros en vivo y sesión de astrofotografía grupal." },
      { "nombre": "Saturno en Oposición", "fecha": "Junio 2025", "participantes": 18, "resumen": "Observación de los anillos de Saturno con telescopio Dobson de 12\\\", la mejor visibilidad del año." },
      { "nombre": "Programa Educativo Colegio Andino", "fecha": "Mayo 2025", "participantes": 42, "resumen": "Jornada educativa para estudiantes de enseñanza media con charla de astrofísica y observación guiada." },
      { "nombre": "Experiencia Corporativa Vía Láctea", "fecha": "Marzo 2025", "participantes": 30, "resumen": "Evento privado para equipo corporativo con cena bajo las estrellas y sesión de fotografía de cielo profundo." }
    ]
  },
  "pricing": {
    "eyebrow": "Tarifas",
    "title": "Elige tu forma de observar el cielo",
    "featuredLabel": "Más elegido",
    "cta": "Consultar disponibilidad",
    "note": "Precios en pesos chilenos (CLP). Grupos, colegios y eventos corporativos: escríbenos para una cotización personalizada.",
    "items": [
      { "nombre": "Observación Grupal", "precio": "$38.000", "unidad": "por persona", "descripcion": "Ideal para primera experiencia bajo el cielo del desierto.", "incluye": ["Traslado desde punto de encuentro", "Telescopios profesionales compartidos", "Guía astronómico certificado", "Bebida caliente incluida", "Duración: 2,5 horas"] },
      { "nombre": "Experiencia Privada", "precio": "$120.000", "unidad": "grupo hasta 6 personas", "descripcion": "Sesión exclusiva con foco en tus intereses astronómicos.", "incluye": ["Todo lo del plan Observación Grupal", "Telescopio dedicado para tu grupo", "Ruta y horario personalizados", "Sesión de fotografía guiada", "Duración: 3,5 horas"], "destacado": true },
      { "nombre": "Astrofotografía Pro", "precio": "$68.000", "unidad": "por persona", "descripcion": "Para fotógrafos que buscan capturar cielo profundo.", "incluye": ["Equipo de astrofotografía disponible", "Asesoría técnica personalizada", "Procesamiento básico de imágenes", "Grupo reducido (máx. 8 personas)", "Duración: 4 horas"] }
    ]
  },
  "contactSection": {
    "eyebrow": "Contacto",
    "title": "Coordinemos tu próxima noche",
    "description": "Escríbenos por el formulario, WhatsApp o redes sociales. Respondemos dentro de 24 horas hábiles.",
    "submitLabel": "Enviar mensaje",
    "faqs": [
      { "pregunta": "¿Cuál es la mejor época del año para observar el cielo en Atacama?", "respuesta": "El desierto de Atacama ofrece cielos despejados casi todo el año. Entre abril y octubre hay menos humedad y noches más largas, ideales para observación profunda." },
      { "pregunta": "¿Necesito experiencia previa para hacer un tour de astroturismo?", "respuesta": "No. Los tours de observación grupal están diseñados para cualquier persona, sin conocimientos previos de astronomía." },
      { "pregunta": "¿Qué debo llevar a un tour nocturno?", "respuesta": "Ropa abrigada (las noches del desierto son frías incluso en verano), calzado cerrado y, si tienes, tu propia cámara si quieres practicar astrofotografía." }
    ]
  }
}') ON DUPLICATE KEY UPDATE content_value = VALUES(content_value);
