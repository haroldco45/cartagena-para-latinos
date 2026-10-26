/* =========================================================
   Cartagena para Latinos — Vibras Positivas HM
   PWA bilingüe (ES/EN) para latinos recién llegados a Cartagena de Indias, Colombia.
   Sin emojis ni íconos: fotos reales de Wikipedia / Wikimedia Commons.
   ========================================================= */
'use strict';

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const store = {
  get(k, d) { try { const v = localStorage.getItem('ctg_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('ctg_' + k, JSON.stringify(v)); } catch (e) {} }
};
let LANG = store.get('lang', (navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es');
const L = o => (o == null ? '' : typeof o === 'string' ? o : (o[LANG] ?? o.es ?? ''));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n, d = 2) => new Intl.NumberFormat(LANG === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const cop = n => (n < 0 ? '-$' : '$') + fmt(Math.abs(Math.round(n)), 0);
async function getJSON(url) { const r = await fetch(url); if (!r.ok) throw new Error(r.status); return r.json(); }
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400); }
const gmaps = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const ZONE = 'America/Bogota', ZONE_VE = 'America/Caracas';
const PALETTE = ['#0E7C86', '#F2B705', '#E8566C', '#2D7FF9', '#F28C28', '#2FB59A', '#8E5CD9'];
const num = (b, i) => `<b style="color:var(--red);font-family:'Barlow Condensed';font-size:1.3rem;margin-right:8px">${String(i + 1).padStart(2, '0')}</b>${b}`;

/* ---------- Textos de interfaz ---------- */
const T = {
  appName: { es: 'Cartagena para Latinos', en: 'Cartagena for Latinos' },
  tagline: { es: 'Tu guía para empezar en Cartagena de Indias', en: 'Your guide to starting out in Cartagena' },
  nHome: { es: 'Inicio', en: 'Home' }, nPapers: { es: 'Papeles', en: 'Papers' }, nMap: { es: 'Mapa', en: 'Map' }, nTalk: { es: 'Hablar', en: 'Talk' },
  cxT: { es: 'Otras ciudades para latinos', en: 'More cities for Latinos' },
  cxS: { es: 'La misma guía en otras ciudades del mundo. Toca una para abrirla.', en: 'The same guide in other cities around the world. Tap one to open it.' },
  footNote: {
    es: 'Información de referencia, no es asesoría legal. Verifica trámites en migracioncolombia.gov.co y cancilleria.gov.co, el pasaje en transcaribe.gov.co y la agenda de fiestas con la Alcaldía de Cartagena. Mapa © colaboradores de OpenStreetMap, © CARTO. Fotos: Wikipedia / Wikimedia Commons. Clima: Open-Meteo.',
    en: 'Reference information, not legal advice. Check procedures at migracioncolombia.gov.co and cancilleria.gov.co, fares at transcaribe.gov.co and the festival schedule with the Cartagena city government. Map © OpenStreetMap contributors, © CARTO. Photos: Wikipedia / Wikimedia Commons. Weather: Open-Meteo.'
  },
  updated: { es: 'Información verificada', en: 'Information checked' },
  installT: { es: 'Instala la app en tu celular para usarla sin internet.', en: 'Install the app on your phone to use it offline.' },
  install: { es: 'Instalar', en: 'Install' },
  tapClose: { es: '(Toca para cerrar)', en: '(Tap to close)' },
  back: { es: '‹ Volver al inicio', en: '‹ Back to home' }
};
const VERIFIED = '26 oct 2026';

/* ---------- Fotos reales (Wikipedia / Commons) ---------- */
// key: [título en en.wikipedia, búsquedas de respaldo en Commons en orden]
const PH = {
  reloj: ['', 'Torre del Reloj Cartagena'],
  murallas: ['Walls of Cartagena', 'murallas de Cartagena'],
  sanfelipe: ['Castillo San Felipe de Barajas', 'Castillo San Felipe de Barajas'],
  getsemani: ['Getsemaní', 'Getsemani Cartagena street'],
  gtrinidad: ['', 'Plaza de la Trinidad Getsemani'],
  gmural: ['', 'Getsemani Cartagena mural graffiti'],
  gnight: ['', 'Getsemani Cartagena night'],
  gcalle: ['', 'Getsemani Cartagena colorful street umbrellas'],
  santodomingo: ['', 'Plaza Santo Domingo Cartagena'],
  inquisicion: ['', 'Palacio de la Inquisicion Cartagena'],
  bovedas: ['', 'Las Bovedas Cartagena'],
  popa: ['', 'Convento de la Popa Cartagena'],
  pegasos: ['', 'Muelle de los Pegasos Cartagena'],
  bocagrande: ['Bocagrande', 'Bocagrande Cartagena skyline'],
  boquilla: ['', 'La Boquilla Cartagena beach'],
  malecon: ['', 'Gran Malecon del Mar Cartagena', 'Crespo Cartagena beach', 'La Boquilla Cartagena', 'Cartagena Colombia beach'],
  mcrespo: ['', 'playa Crespo Cartagena', 'Crespo Cartagena', 'Cartagena Colombia sea', 'Cartagena de Indias playa'],
  mbici: ['', 'ciclovia Cartagena', 'bicycle Cartagena Colombia', 'Cartagena promenade sea', 'Cartagena Colombia coast'],
  mplaya: ['', 'Marbella beach Cartagena', 'playa Marbella Cartagena', 'Cartagena beach', 'Bocagrande beach'],
  mespolon: ['', 'espolon playa Cartagena', 'breakwater Cartagena Colombia', 'Cartagena Colombia coast'],
  bazurto: ['', 'Mercado de Bazurto Cartagena'],
  rosario: ['Rosario Islands', 'Islas del Rosario Colombia'],
  playablanca: ['', 'Playa Blanca Baru Colombia'],
  baru: ['Barú', 'Isla Baru Colombia'],
  coral: ['', 'coral reef Islas del Rosario snorkel'],
  lancha: ['', 'lancha Cartagena islas boat'],
  palenque: ['San Basilio de Palenque', 'San Basilio de Palenque'],
  totumo: ['', 'Volcan del Totumo'],
  bocachica: ['', 'Fuerte San Fernando Bocachica'],
  transcaribe: ['Transcaribe', 'Transcaribe bus Cartagena'],
  hospital: ['', 'Hospital Universitario del Caribe Cartagena'],
  peso: ['Colombian peso', 'billetes pesos colombianos'],
  airport: ['Rafael Núñez International Airport', 'aeropuerto Rafael Nunez Cartagena'],
  fiestas: ['', 'Fiestas de Independencia Cartagena desfile'],
  champeta: ['Champeta', 'champeta dance'],
  palenquera: ['', 'palenquera Cartagena fruit'],
  arepa: ['', 'arepa de huevo'],
  cartagena: ['Cartagena, Colombia', 'Cartagena Colombia aerial'],
  sunset: ['', 'Cartagena sunset walls'],
  balcon: ['', 'Cartagena colonial balcony flowers'],
  street: ['', 'Cartagena old city street colorful']
};
const PHOTO_CACHE = store.get('photos', {});
function fbColor(key) { let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0; return PALETTE[h % PALETTE.length]; }
const photo = key => `data-ph="${key}" style="--fb:${fbColor(key)}"`;

async function wikiBatch(titles) {
  const out = {};
  for (let i = 0; i < titles.length; i += 40) {
    const chunk = titles.slice(i, i + 40);
    const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=900&titles=' + encodeURIComponent(chunk.join('|'));
    try {
      const j = await getJSON(url);
      const back = {};
      (j.query.normalized || []).forEach(n => back[n.to] = n.from);
      (j.query.redirects || []).forEach(r => back[r.to] = back[r.from] || r.from);
      (j.query.pages || []).forEach(p => { if (p.thumbnail) out[back[p.title] || p.title] = p.thumbnail.source; });
    } catch (e) {}
  }
  return out;
}
async function commonsSearch(q) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&generator=search&gsrnamespace=6&gsrlimit=4&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap') + '&prop=imageinfo&iiprop=url&iiurlwidth=900';
  try {
    const j = await getJSON(url);
    const pages = (j.query && j.query.pages || []).sort((a, b) => (a.index || 0) - (b.index || 0));
    for (const p of pages) { const ii = p.imageinfo && p.imageinfo[0]; if (ii && (ii.thumburl || ii.url)) return ii.thumburl || ii.url; }
  } catch (e) {}
  return null;
}
let photosLoading = null;
async function loadPhotos() {
  if (photosLoading) return photosLoading;
  photosLoading = (async () => {
    const need = Object.keys(PH).filter(k => !PHOTO_CACHE[k]);
    const titles = need.map(k => PH[k][0]).filter(Boolean);
    if (titles.length) {
      const got = await wikiBatch(titles);
      need.forEach(k => { if (PH[k][0] && got[PH[k][0]]) PHOTO_CACHE[k] = got[PH[k][0]]; });
    }
    const rest = Object.keys(PH).filter(k => !PHOTO_CACHE[k]);
    await Promise.all(rest.map(async k => { for (const q of PH[k].slice(1)) { const u = await commonsSearch(q); if (u) { PHOTO_CACHE[k] = u; break; } } }));
    store.set('photos', PHOTO_CACHE);
  })();
  return photosLoading;
}
function paintPhotos(root = document) {
  $$('[data-ph]', root).forEach(el => {
    const u = PHOTO_CACHE[el.dataset.ph];
    if (u && !el._painted) {
      const img = new Image();
      img.onload = () => { el.style.backgroundImage = `url("${u}")`; el._painted = true; };
      img.src = u;
    }
  });
  heroSetup();
}

/* ---------- Plazos con cuenta regresiva (verificados el 26 oct 2026) ---------- */
const DEADLINES = [
  { end: new Date('2026-11-04T23:59:59-05:00'), k: 'PPT',
    t: { es: 'Último plazo para reclamar tu PPT aprobado: miércoles 4 de noviembre', en: 'Last day to collect your approved PPT: Wednesday 4 November' },
    s: { es: 'Si Migración ya aprobó tu PPT y no lo has retirado, después de esa fecha lo destruyen y el trámite queda como desistido. Toca para ver cómo.', en: 'If Migración already approved your PPT and you haven\'t collected it, after that date it is destroyed and the application is dropped. Tap to see how.' },
    tk: { es: 'para reclamar tu PPT', en: 'to collect your PPT' } },
  { end: new Date('2026-12-31T23:59:59-05:00'), k: 'PEP Tutor',
    t: { es: 'PEP Tutor: puedes pedirlo hasta el jueves 31 de diciembre', en: 'PEP Tutor: apply by Thursday 31 December' },
    s: { es: 'Para papás, tutores o cuidadores de niños venezolanos que tuvieron PPT. Toca para ver requisitos.', en: 'For parents, guardians or carers of Venezuelan children who held a PPT. Tap to see requirements.' },
    tk: { es: 'para pedir el PEP Tutor', en: 'to apply for PEP Tutor' } }
];
const activeDeadline = () => DEADLINES.find(d => d.end - Date.now() > 0) || null;

/* ---------- Datos de Cartagena ---------- */
const PLACES = [
  { id: 'reloj', cat: 'city', lat: 10.4226, lon: -75.5493, free: true,
    n: { es: 'Torre del Reloj', en: 'Clock Tower' },
    d: { es: 'La puerta principal de la Ciudad Amurallada y el punto de encuentro de todo el mundo. Al lado está la Plaza de los Coches.', en: 'The main gate of the Walled City and everyone\'s meeting point. Next to it is Plaza de los Coches.' } },
  { id: 'murallas', cat: 'city', lat: 10.4268, lon: -75.5508, free: true,
    n: { es: 'Ciudad Amurallada', en: 'Walled City' },
    d: { es: 'El centro histórico rodeado por 11 km de murallas. Puerto, fortalezas y conjunto monumental son Patrimonio de la Humanidad de la UNESCO desde 1984. Caminar sobre la muralla al atardecer es gratis.', en: 'The historic centre ringed by 11 km of walls. The port, fortresses and monuments have been a UNESCO World Heritage Site since 1984. Walking the wall at sunset is free.' } },
  { id: 'santodomingo', cat: 'city', lat: 10.4243, lon: -75.5513, free: true,
    n: { es: 'Plaza de Santo Domingo', en: 'Santo Domingo Square' },
    d: { es: 'Una de las plazas más animadas del centro, con la iglesia más antigua de la ciudad, restaurantes y una escultura de Botero.', en: 'One of the liveliest squares in the centre, with the city\'s oldest church, restaurants and a Botero sculpture.' } },
  { id: 'inquisicion', cat: 'city', lat: 10.4235, lon: -75.5518, free: false,
    n: { es: 'Palacio de la Inquisición', en: 'Palace of the Inquisition' },
    d: { es: 'Museo histórico frente al Parque de Bolívar. Cuenta la historia de la ciudad y del tribunal de la Inquisición.', en: 'History museum facing Bolívar Park. It tells the story of the city and the Inquisition tribunal.' } },
  { id: 'bovedas', cat: 'city', lat: 10.4296, lon: -75.5480, free: true,
    n: { es: 'Las Bóvedas', en: 'Las Bóvedas' },
    d: { es: 'Antiguos calabozos dentro de la muralla convertidos en tiendas de artesanías. Buen sitio para fotos.', en: 'Old dungeons inside the wall turned into craft shops. Good photo spot.' } },
  { id: 'getsemani', cat: 'city', lat: 10.4206, lon: -75.5460, free: true,
    n: { es: 'Getsemaní', en: 'Getsemaní' },
    d: { es: 'El barrio popular junto al centro: murales, sombrillas de colores, música en la calle y la Plaza de la Trinidad llena de gente de noche. Tiene su propia sección en la app.', en: 'The working-class district next to the centre: murals, colourful umbrellas, street music and Trinidad Square buzzing at night. It has its own section in the app.' } },
  { id: 'sanfelipe', cat: 'city', lat: 10.4227, lon: -75.5396, free: false,
    n: { es: 'Castillo San Felipe de Barajas', en: 'San Felipe de Barajas Castle' },
    d: { es: 'La fortaleza más grande que construyó España en América, con túneles por dentro. Ve temprano: el sol de mediodía pega duro.', en: 'The largest fortress Spain built in the Americas, with tunnels inside. Go early: the midday sun is brutal.' } },
  { id: 'popa', cat: 'city', lat: 10.4196, lon: -75.5264, free: false,
    n: { es: 'Convento de La Popa', en: 'La Popa Convent' },
    d: { es: 'En el cerro más alto de la ciudad, con la mejor vista de Cartagena. Sube en taxi o en excursión, no a pie.', en: 'On the city\'s highest hill, with the best view of Cartagena. Go up by taxi or tour, not on foot.' } },
  { id: 'pegasos', cat: 'city', lat: 10.4214, lon: -75.5484, free: true,
    n: { es: 'Muelle de los Pegasos', en: 'Pegasos Pier' },
    d: { es: 'Muelle frente al centro con las estatuas de caballos alados. De aquí y de La Bodeguita salen botes de paseo.', en: 'Pier in front of the centre with the winged-horse statues. Tour boats leave from here and from La Bodeguita.' } },
  { id: 'bazurto', cat: 'city', lat: 10.4115, lon: -75.5267, free: true,
    n: { es: 'Mercado de Bazurto', en: 'Bazurto Market' },
    d: { es: 'El mercado popular más grande de la ciudad: pescado, frutas, comida barata y mucho movimiento. Ve de día, con poco efectivo y el celular guardado.', en: 'The city\'s biggest popular market: fish, fruit, cheap food and lots of action. Go by day, with little cash and your phone put away.' } },
  { id: 'bocagrande', cat: 'beach', lat: 10.3996, lon: -75.5561, free: true,
    n: { es: 'Bocagrande', en: 'Bocagrande' },
    d: { es: 'La zona de edificios y hoteles frente al mar. Playa urbana, gratis para caminar; las carpas y sillas se pagan.', en: 'The high-rise and hotel strip by the sea. Urban beach, free to walk; tents and chairs cost extra.' } },
  { id: 'malecon', cat: 'beach', lat: 10.4560, lon: -75.5040, free: true,
    n: { es: 'Gran Malecón del Mar (nuevo)', en: 'Gran Malecón del Mar (new)' },
    d: { es: 'El nuevo malecón frente al mar, abierto el 24 de octubre de 2026: 2 km entre La Boquilla y el túnel de Crespo para caminar, montar bici y hacer deporte. Gratis. Tiene su propia sección en la app.', en: 'The new seafront promenade, opened on 24 October 2026: 2 km between La Boquilla and the Crespo tunnel for walking, cycling and sport. Free. It has its own section in the app.' } },
  { id: 'boquilla', cat: 'beach', lat: 10.4703, lon: -75.4985, free: true,
    n: { es: 'La Boquilla', en: 'La Boquilla' },
    d: { es: 'Pueblo de pescadores al norte, con playa amplia, pescado frito y paseos en canoa por los manglares.', en: 'Fishing village to the north, with a wide beach, fried fish and canoe trips through the mangroves.' } },
  { id: 'rosario', cat: 'beach', lat: 10.1735, lon: -75.7600, free: false,
    n: { es: 'Islas del Rosario', en: 'Rosario Islands' },
    d: { es: 'Archipiélago de agua cristalina y corales, parte de un parque nacional natural. Se llega en lancha. Tiene su propia sección en la app.', en: 'Archipelago of clear water and coral reefs, part of a national natural park. Reached by boat. It has its own section in the app.' } },
  { id: 'playablanca', cat: 'beach', lat: 10.2290, lon: -75.6070, free: false,
    n: { es: 'Playa Blanca (Barú)', en: 'Playa Blanca (Barú)' },
    d: { es: 'La playa de arena blanca más famosa cerca de la ciudad. Se llega por carretera o en lancha. Pregunta todos los precios antes de sentarte.', en: 'The most famous white-sand beach near the city. Reached by road or boat. Ask every price before you sit down.' } },
  { id: 'bocachica', cat: 'beach', lat: 10.3197, lon: -75.5817, free: false,
    n: { es: 'Bocachica y Fuerte San Fernando', en: 'Bocachica and Fort San Fernando' },
    d: { es: 'En la isla de Tierrabomba, a un corto viaje en lancha. Fuerte colonial y pueblo de playa.', en: 'On Tierrabomba island, a short boat ride away. Colonial fort and beach village.' } },
  { id: 'palenque', cat: 'nature', lat: 10.1006, lon: -75.1978, free: true,
    n: { es: 'San Basilio de Palenque', en: 'San Basilio de Palenque' },
    d: { es: 'Considerado el primer pueblo libre de América, fundado por africanos que escaparon de la esclavitud. Su cultura y su lengua palenquera son Patrimonio de la Humanidad. A unas dos horas por carretera.', en: 'Considered the first free town in the Americas, founded by Africans who escaped slavery. Its culture and Palenquero language are UNESCO-listed. About two hours by road.' } },
  { id: 'totumo', cat: 'nature', lat: 10.7446, lon: -75.2394, free: false,
    n: { es: 'Volcán del Totumo', en: 'El Totumo Mud Volcano' },
    d: { es: 'Volcán de lodo donde te bañas flotando en barro tibio. Paseo de medio día; se paga entrada y propina a los ayudantes.', en: 'Mud volcano where you float in warm mud. Half-day trip; there\'s an entry fee and tips for the helpers.' } }
];

const MAP_EXTRA = [
  { id: 'huc', cat: 'help', lat: 10.4078, lon: -75.5045, n: { es: 'Hospital Universitario del Caribe', en: 'Hospital Universitario del Caribe' }, d: { es: 'Hospital público de alta complejidad con urgencias. Barrio Zaragocilla.', en: 'Public tertiary hospital with an ER. Zaragocilla district.' } },
  { id: 'ninos', cat: 'help', lat: 10.4031, lon: -75.5528, n: { es: 'Hospital Infantil Napoleón Franco Pareja (Casa del Niño)', en: 'Napoleón Franco Pareja Children\'s Hospital' }, d: { es: 'Hospital de niños con urgencias pediátricas. Bocagrande.', en: 'Children\'s hospital with paediatric ER. Bocagrande.' } },
  { id: 'migra', cat: 'help', lat: 10.4176, lon: -75.5346, n: { es: 'Migración Colombia — Centro Facilitador', en: 'Migración Colombia — Service Centre' }, d: { es: 'Calle 29D # 20-18, Pie de la Popa. Trámites migratorios y entrega de PPT.', en: 'Calle 29D # 20-18, Pie de la Popa. Immigration procedures and PPT pickup.' } },
  { id: 'terminal', cat: 'help', lat: 10.3866, lon: -75.4606, n: { es: 'Terminal de Transportes y Portal Transcaribe', en: 'Bus Terminal & Transcaribe Portal' }, d: { es: 'Buses a otras ciudades y cabecera del sistema Transcaribe.', en: 'Intercity buses and the Transcaribe system\'s main hub.' } },
  { id: 'airport', cat: 'help', lat: 10.4424, lon: -75.5130, n: { es: 'Aeropuerto Rafael Núñez', en: 'Rafael Núñez Airport' }, d: { es: 'En el barrio Crespo, a 10 minutos del centro.', en: 'In Crespo, 10 minutes from the centre.' } }
];

const OFFICES = [
  { n: { es: 'Migración Colombia — Centro Facilitador de Servicios Migratorios (Regional Caribe)', en: 'Migración Colombia — Immigration Service Centre (Caribbean Region)' }, a: 'Calle 29D # 20-18, Pie de la Popa, Cartagena', tel: '+576016055454', telS: '+57 601 605 5454', h: { es: 'Línea nacional de Migración. Pide cita por migracioncolombia.gov.co antes de ir.', en: 'Migración national line. Book an appointment at migracioncolombia.gov.co before going.' } },
  { n: { es: 'Cancillería de Colombia (visas, incluida la Visa V)', en: 'Colombian Foreign Ministry (visas, including Visa V)' }, a: 'Cancillería de Colombia, Bogotá', tel: '+576013814000', telS: '+57 601 381 4000', h: { es: 'Las visas se piden en línea en cancilleria.gov.co', en: 'Visas are applied for online at cancilleria.gov.co' } },
  { n: { es: 'Centro Intégrate Cartagena (empleo, salud, educación y asesoría)', en: 'Intégrate Centre Cartagena (jobs, health, education, advice)' }, a: 'Centro Intégrate Cartagena', tel: '123', telS: '', h: { es: 'Atiende a migrantes y colombianos retornados. Busca la dirección en el mapa y confirma horario.', en: 'Serves migrants and returning Colombians. Find it on the map and confirm hours.' } }
];

const EMERG = [
  { n: '123', cls: '', t: { es: 'Línea única de emergencias', en: 'Emergency line' }, s: { es: 'Policía, ambulancia, bomberos', en: 'Police, ambulance, fire' } },
  { n: '132', cls: 'ink', t: { es: 'Cruz Roja', en: 'Red Cross' }, s: { es: 'Ambulancia y rescate', en: 'Ambulance and rescue' } },
  { n: '119', cls: 'sea', t: { es: 'Bomberos', en: 'Fire brigade' }, s: { es: 'Incendios y rescates', en: 'Fires and rescues' } },
  { n: '155', cls: 'sky', t: { es: 'Línea para mujeres', en: 'Women\'s line' }, s: { es: 'Orientación ante violencia', en: 'Help against violence' } },
  { n: '141', cls: 'ink', t: { es: 'ICBF (niños)', en: 'ICBF (children)' }, s: { es: 'Protección de niños y niñas', en: 'Child protection' } },
  { n: '165', cls: 'sea', t: { es: 'Gaula', en: 'Gaula' }, s: { es: 'Extorsión y secuestro', en: 'Extortion and kidnapping' } }
];

// Festivos de Colombia 2026 y 2027 (Ley Emiliani). Noviembre 16 de 2026: Independencia de Cartagena.
const HOLIDAYS = [
  ['2026-01-01', { es: 'Año Nuevo', en: 'New Year\'s Day' }], ['2026-01-12', { es: 'Reyes Magos', en: 'Epiphany' }],
  ['2026-03-23', { es: 'San José', en: 'Saint Joseph' }], ['2026-04-02', { es: 'Jueves Santo', en: 'Holy Thursday' }],
  ['2026-04-03', { es: 'Viernes Santo', en: 'Good Friday' }], ['2026-05-01', { es: 'Día del Trabajo', en: 'Labour Day' }],
  ['2026-05-18', { es: 'Ascensión', en: 'Ascension' }], ['2026-06-08', { es: 'Corpus Christi', en: 'Corpus Christi' }],
  ['2026-06-15', { es: 'Sagrado Corazón', en: 'Sacred Heart' }], ['2026-06-29', { es: 'San Pedro y San Pablo', en: 'Saints Peter and Paul' }],
  ['2026-07-20', { es: 'Independencia de Colombia', en: 'Colombian Independence' }], ['2026-08-07', { es: 'Batalla de Boyacá', en: 'Battle of Boyacá' }],
  ['2026-08-17', { es: 'Asunción de la Virgen', en: 'Assumption' }], ['2026-10-12', { es: 'Día de la Raza', en: 'Columbus Day' }],
  ['2026-11-02', { es: 'Todos los Santos', en: 'All Saints\' Day' }], ['2026-11-16', { es: 'Independencia de Cartagena', en: 'Cartagena Independence' }],
  ['2026-12-08', { es: 'Inmaculada Concepción', en: 'Immaculate Conception' }], ['2026-12-25', { es: 'Navidad', en: 'Christmas Day' }],
  ['2027-01-01', { es: 'Año Nuevo', en: 'New Year\'s Day' }], ['2027-01-11', { es: 'Reyes Magos', en: 'Epiphany' }],
  ['2027-03-22', { es: 'San José', en: 'Saint Joseph' }], ['2027-03-25', { es: 'Jueves Santo', en: 'Holy Thursday' }],
  ['2027-03-26', { es: 'Viernes Santo', en: 'Good Friday' }], ['2027-05-01', { es: 'Día del Trabajo', en: 'Labour Day' }],
  ['2027-05-10', { es: 'Ascensión', en: 'Ascension' }], ['2027-05-31', { es: 'Corpus Christi', en: 'Corpus Christi' }],
  ['2027-06-07', { es: 'Sagrado Corazón', en: 'Sacred Heart' }], ['2027-07-05', { es: 'San Pedro y San Pablo', en: 'Saints Peter and Paul' }],
  ['2027-07-20', { es: 'Independencia de Colombia', en: 'Colombian Independence' }], ['2027-08-07', { es: 'Batalla de Boyacá', en: 'Battle of Boyacá' }],
  ['2027-08-16', { es: 'Asunción de la Virgen', en: 'Assumption' }], ['2027-10-18', { es: 'Día de la Raza', en: 'Columbus Day' }],
  ['2027-11-01', { es: 'Todos los Santos', en: 'All Saints\' Day' }], ['2027-11-15', { es: 'Independencia de Cartagena', en: 'Cartagena Independence' }],
  ['2027-12-08', { es: 'Inmaculada Concepción', en: 'Immaculate Conception' }], ['2027-12-25', { es: 'Navidad', en: 'Christmas Day' }]
];

// Salario mínimo 2026: Decreto 1469 de 2025 (vigente; el Consejo de Estado levantó la suspensión en julio de 2026).
// Jornada de 42 horas semanales desde el 15 de julio de 2026 (Ley 2101): hora = salario / 210.
const WAGE = { month: 1750905, aux: 249095, total: 2000000, hour: 1750905 / 210, weekH: 42,
  night: .35, extraDay: .25, extraNight: .75, sunday: .90 };
const TRANSCARIBE = 3900;

// Fiestas de Independencia 2026 (agenda oficial presentada el 16 de sep de 2026)
const FIESTAS = [
  ['2026-10-30', { es: 'Noche de Tradición Festiva y Traje Artesanal', en: 'Festive Tradition & Handmade Costume Night' }, { es: 'Plaza de Variedades', en: 'Plaza de Variedades' }],
  ['2026-11-01', { es: 'Gran toma de la ciudad: desfile "Dioses de la Libertad"', en: 'City takeover: "Gods of Freedom" parade' }, { es: 'Centro Histórico', en: 'Historic Centre' }],
  ['2026-11-06', { es: 'Desfile en traje de baño del Reinado Popular', en: 'Popular Pageant swimwear parade' }, { es: 'Plaza de la Aduana', en: 'Plaza de la Aduana' }],
  ['2026-11-08', { es: 'Desfile de la Diversidad, Preludio Magisterial y Fiesta de Grandes Lanceros', en: 'Diversity Parade, Teachers\' Prelude and Lancers\' Party' }, { es: 'Varios puntos de la ciudad', en: 'Around the city' }],
  ['2026-11-10', { es: 'Desfile en Honor a los Héroes', en: 'Parade in Honour of the Heroes' }, { es: 'Centro', en: 'Centre' }],
  ['2026-11-11', { es: 'Día de la Independencia: sesión solemne y ofrenda floral', en: 'Independence Day: formal session and floral tribute' }, { es: 'Centro Histórico', en: 'Historic Centre' }],
  ['2026-11-12', { es: 'Gran Desfile de Independencia (10:00 a. m. a 12:00 m.)', en: 'Grand Independence Parade (10:00 am to noon)' }, { es: 'Avenida Santander', en: 'Avenida Santander' }],
  ['2026-11-13', { es: 'Festival Náutico y Bololó del Arsenal, con Juan Luis Guerra', en: 'Nautical Festival and Arsenal street party, with Juan Luis Guerra' }, { es: 'Bahía y calle del Arsenal', en: 'Bay and Calle del Arsenal' }],
  ['2026-11-14', { es: 'Salsa a la Plaza y jornada musical', en: 'Salsa in the Square and music day' }, { es: 'Plaza de la Aduana', en: 'Plaza de la Aduana' }],
  ['2026-11-15', { es: 'Cabildo de Getsemaní y coronación del Reinado Popular', en: 'Getsemaní Cabildo and Popular Pageant crowning' }, { es: 'Getsemaní y Centro de Convenciones', en: 'Getsemaní and Convention Centre' }],
  ['2026-11-16', { es: 'Reinado Intercorregimental: cierre de las fiestas (festivo)', en: 'Inter-village Pageant: festival closing (public holiday)' }, { es: 'Cartagena', en: 'Cartagena' }]
];

const FIRST = [
  { es: ['Llena el formulario Check-MIG antes de viajar', 'Lo piden a los extranjeros al entrar y salir de Colombia. Es gratis en el sitio de Migración Colombia.'], en: ['Fill in the Check-MIG form before travelling', 'Foreigners must complete it when entering and leaving Colombia. It\'s free on Migración Colombia\'s site.'] },
  { es: ['Guarda tus documentos y una foto de cada uno', 'Pasaporte, cédula, PPT. Copias en el celular y en el correo. Nunca entregues tu documento a un "jefe".'], en: ['Keep your documents safe and a photo of each', 'Passport, ID, PPT. Copies on your phone and email. Never hand your document to a "boss".'] },
  { es: ['Compra una SIM local', 'Los operadores grandes son Claro, Movistar y Tigo. Para registrarla te piden documento.'], en: ['Get a local SIM', 'The big carriers are Claro, Movistar and Tigo. You\'ll need ID to register it.'] },
  { es: ['Anota tu dirección en esta app', 'En Cartagena las direcciones son tipo "Calle 30 # 17-25, barrio Pie de la Popa". Si te pierdes, la app se la muestra a cualquiera.'], en: ['Save your address in this app', 'Cartagena addresses look like "Calle 30 # 17-25, Pie de la Popa". If you get lost, the app shows it to anyone.'] },
  { es: ['Saca tu tarjeta de Transcaribe', 'El pasaje cuesta $3.900 y se paga con tarjeta recargable.'], en: ['Get your Transcaribe card', 'A ride costs COP 3,900 and is paid with a rechargeable card.'] },
  { es: ['Si eres venezolano, revisa el estado de tu PPT', 'Si ya está aprobado, recógelo antes del 4 de noviembre de 2026.'], en: ['If you\'re Venezuelan, check your PPT status', 'If it\'s approved, collect it before 4 November 2026.'] },
  { es: ['Pide la encuesta del SISBEN', 'Con PPT o documento colombiano te pueden afiliar a salud subsidiada.'], en: ['Request the SISBEN survey', 'With a PPT or Colombian ID you can join subsidised health care.'] },
  { es: ['Abre una billetera digital o cuenta', 'Nequi, Daviplata y los bancos abren cuentas con PPT. Así cobras sin cargar efectivo.'], en: ['Open a digital wallet or account', 'Nequi, Daviplata and banks open accounts with a PPT. That way you get paid without carrying cash.'] },
  { es: ['Ubica el hospital y el centro de salud más cercano', 'Usa el mapa de la app.'], en: ['Locate your nearest hospital and health centre', 'Use the app map.'] },
  { es: ['Registra los números de emergencia', '123 para todo: policía, ambulancia y bomberos.'], en: ['Save the emergency numbers', '123 for everything: police, ambulance and fire.'] }
];

// Hablar costeño: [palabra, significado ES, significado EN, ejemplo]
const COSTENO = [
  ['¿Qué hubo? / ¿Quiubo?', 'Saludo: ¿qué tal?', 'Greeting: what\'s up?', '¿Quiubo, mi llave, todo bien?'],
  ['Ajá', 'Muletilla para todo: saludo, "sí", "¿y entonces?"', 'All-purpose word: hello, "yes", "so what?"', 'Ajá, ¿y qué más?'],
  ['Mi llave / Llave', 'Amigo, compañero', 'Mate, buddy', 'Gracias, mi llave.'],
  ['Pelao / Pelaíta', 'Muchacho / muchacha', 'Young guy / young girl', 'Ese pelao trabaja conmigo.'],
  ['Erda', 'Expresión de sorpresa', 'Exclamation of surprise', '¡Erda, qué calor!'],
  ['Bacano', 'Chévere, muy bueno', 'Cool, great', 'La playa estuvo bacana.'],
  ['Vaina', 'Cosa (cualquier cosa)', 'Thing (any thing)', 'Pásame esa vaina.'],
  ['Fresco', 'Tranquilo, no te preocupes', 'Relax, don\'t worry', 'Fresco, yo te espero.'],
  ['Mamar gallo', 'Bromear, echar chistes', 'To joke around', 'No te pongas bravo, te estoy mamando gallo.'],
  ['Ñapa', 'Lo que te regalan de más al comprar', 'A little extra thrown in for free', '¿Me da la ñapa?'],
  ['Tinto', 'Café negro pequeño (no es vino)', 'Small black coffee (not red wine)', 'Regáleme un tinto.'],
  ['Regálame…', 'Forma amable de pedir algo, aunque lo pagues', 'Polite way to ask for something, even when paying', 'Regáleme una agua, por favor.'],
  ['Bololó', 'Alboroto, lío, fiesta grande', 'Commotion, mess, big party', 'Se armó un bololó en la esquina.'],
  ['Picó', 'Equipo de sonido gigante de la champeta', 'Giant champeta sound system', 'Esta noche hay picó en el barrio.'],
  ['Rebusque', 'Trabajo informal para ganarse el día', 'Informal work to get by', 'Estoy en el rebusque vendiendo tintos.'],
  ['Cachaco', 'Persona del interior del país (Bogotá, Medellín…)', 'Person from inland Colombia', 'Ese señor es cachaco.']
];
// Venezuela → Colombia
const VECO = [
  ['Cambur', 'Banano / guineo', 'Banana'], ['Caraota', 'Fríjol', 'Bean'], ['Cotufas', 'Crispetas', 'Popcorn'],
  ['Chamo', 'Pelao', 'Young guy'], ['Pana', 'Llave / parcero', 'Buddy'], ['Jojoto', 'Mazorca', 'Corn on the cob'],
  ['Lechosa', 'Papaya', 'Papaya'], ['Autobús / camionetica', 'Bus / buseta', 'Bus'], ['Cédula venezolana', 'Pasaporte o PPT para trámites', 'Passport or PPT for paperwork']
];
// Inglés para trabajar en turismo: [inglés, español, pronunciación aproximada]
const ENG = [
  ['Welcome to Cartagena!', '¡Bienvenido a Cartagena!', 'uél-com tu car-ta-YÉ-na'],
  ['How can I help you?', '¿En qué le puedo ayudar?', 'jáu can ái jelp yu'],
  ['Do you have a reservation?', '¿Tiene reserva?', 'du yu jav a re-ser-VÉI-shon'],
  ['Table for two?', '¿Mesa para dos?', 'TÉI-bol for tu'],
  ['Here is the menu.', 'Aquí está el menú.', 'jíer is de MÉ-niu'],
  ['Would you like something to drink?', '¿Desea algo de tomar?', 'wud yu láik SÓM-thing tu drink'],
  ['It costs fifty thousand pesos.', 'Cuesta cincuenta mil pesos.', 'it costs FÍF-ti THÁU-sand PÉ-sos'],
  ['We accept cash and card.', 'Aceptamos efectivo y tarjeta.', 'ui ak-SÉPT cash and card'],
  ['The boat leaves at eight a.m.', 'La lancha sale a las ocho de la mañana.', 'de bout livs at éit ei-em'],
  ['Please wear your life jacket.', 'Por favor póngase el chaleco salvavidas.', 'plis uér yor láif YÁ-ket'],
  ['Do you need a taxi?', '¿Necesita un taxi?', 'du yu nid a TÁK-si'],
  ['Sorry, can you repeat that?', 'Perdón, ¿puede repetir?', 'SÓ-ri, can yu ri-PÍT dat'],
  ['Have a nice day!', '¡Que tenga un buen día!', 'jav a náis dei']
];
const DIALOGS = [
  { t: { es: 'En la buseta', en: 'On the minibus' }, l: [
    ['a', 'Buenas. ¿Esta buseta pasa por Bazurto?', 'Hi. Does this minibus go past Bazurto?'],
    ['b', 'Sí, ajá. Súbase rápido, mi llave.', 'Yes, sure. Hop on quick, buddy.'],
    ['a', '¿Cuánto es?', 'How much is it?'],
    ['b', 'Lo que dice el letrero, y me avisa dónde se queda.', 'What the sign says, and tell me where you\'re getting off.']] },
  { t: { es: 'En la tienda del barrio', en: 'At the corner shop' }, l: [
    ['a', 'Buenas tardes. ¿A cómo está el kilo de arroz?', 'Good afternoon. How much is a kilo of rice?'],
    ['b', 'A tanto, mija. ¿Le doy de una vez?', 'It\'s so much, dear. Shall I bag it?'],
    ['a', 'Sí, regáleme un kilo y una bolsa de agua. ¿Y la ñapa?', 'Yes, give me a kilo and a bag of water. And the little extra?'],
    ['b', 'Ajá, tome su ñapa.', 'Sure, here\'s your extra.']] },
  { t: { es: 'Buscando trabajo', en: 'Looking for work' }, l: [
    ['a', 'Buenos días. Vengo por el aviso de mesero. Aquí está mi hoja de vida.', 'Good morning. I\'m here about the waiter ad. Here\'s my CV.'],
    ['b', '¿Tiene PPT o documento al día?', 'Do you have a PPT or valid ID?'],
    ['a', 'Sí, tengo PPT. También hablo un poco de inglés.', 'Yes, I have a PPT. I also speak some English.'],
    ['b', 'Bacano, eso sirve mucho aquí. Venga mañana a las 8.', 'Great, that really helps here. Come tomorrow at 8.']] },
  { t: { es: 'En urgencias', en: 'At the ER' }, l: [
    ['a', 'Buenas noches. Mi hijo tiene fiebre alta desde ayer.', 'Good evening. My son has had a high fever since yesterday.'],
    ['b', '¿Tienen EPS?', 'Are you with a health insurer (EPS)?'],
    ['a', 'Todavía no, estamos haciendo el SISBEN.', 'Not yet, we\'re doing the SISBEN.'],
    ['b', 'Igual lo atendemos. Siéntese, ya lo llaman al triaje.', 'We\'ll see him anyway. Have a seat, triage will call you.']] }
];

const LIFE = {
  housing: { t: { es: 'Vivienda', en: 'Housing' }, ph: 'balcon', items: [
    { es: 'Los barrios populares (Olaya Herrera, El Pozón, Nelson Mandela, San Fernando) son más baratos; Manga, Crespo y Pie de la Popa son intermedios; el Centro, Getsemaní y Bocagrande son caros.', en: 'Working-class areas (Olaya Herrera, El Pozón, Nelson Mandela, San Fernando) are cheaper; Manga, Crespo and Pie de la Popa are mid-range; the Centre, Getsemaní and Bocagrande are expensive.' },
    { es: 'Busca en grupos del barrio, avisos de "Se arrienda" en las fachadas y portales de arriendo. Desconfía de precios muy bajos en zonas caras.', en: 'Look in neighbourhood groups, "Se arrienda" signs on houses and rental sites. Distrust very low prices in pricey areas.' },
    { es: 'Nunca pagues depósito sin ver el lugar y sin contrato firmado con el nombre del dueño.', en: 'Never pay a deposit without seeing the place and a signed contract in the owner\'s name.' },
    { es: 'Pregunta si los servicios (agua, luz, gas) están incluidos: con aire acondicionado, la luz en Cartagena sale cara.', en: 'Ask if utilities (water, power, gas) are included: with air-con, power in Cartagena gets expensive.' },
    { es: 'Pide recibo de cada pago. Te sirve como prueba de residencia para trámites.', en: 'Get a receipt for every payment. It works as proof of address for paperwork.' }] },
  food: { t: { es: 'Comida', en: 'Food' }, ph: 'arepa', items: [
    { es: 'Arepa de huevo: arepa frita rellena de huevo, el desayuno típico de la costa.', en: 'Arepa de huevo: fried corn cake stuffed with egg, the classic Caribbean-coast breakfast.' },
    { es: 'Pescado frito con arroz con coco y patacón: el almuerzo de playa por excelencia.', en: 'Fried fish with coconut rice and plantain: the ultimate beach lunch.' },
    { es: 'Posta negra cartagenera, butifarra, buñuelos de fríjol, bollo limpio y enyucado.', en: 'Cartagena-style posta negra beef, butifarra sausage, bean fritters, bollo and enyucado.' },
    { es: 'Dulces en el Portal de los Dulces, junto a la Torre del Reloj: cocadas, alegrías y caballitos.', en: 'Sweets at the Portal de los Dulces, by the Clock Tower: cocadas, alegrías and caballitos.' },
    { es: 'Jugos de corozo, níspero y zapote. Arepas venezolanas y empanadas se consiguen en muchos barrios.', en: 'Corozo, níspero and zapote juices. Venezuelan arepas and empanadas are found in many neighbourhoods.' }] },
  culture: { t: { es: 'Costumbres', en: 'Customs' }, ph: 'champeta', items: [
    { es: 'La champeta es la música de la ciudad: suena en buses, tiendas y picós de barrio. Aprende el pasito y te ganas a la gente.', en: 'Champeta is the city\'s music: on buses, in shops and at neighbourhood sound systems. Learn the step and people will love you.' },
    { es: 'Se saluda al entrar: "Buenas" en la tienda, el bus o la oficina. El costeño es directo, alegre y habla duro: no es pelea.', en: 'Greet when you walk in: "Buenas" in a shop, bus or office. Costeños are direct, cheerful and loud: it isn\'t a fight.' },
    { es: 'Las palenqueras de vestidos de colores venden fruta y posan para fotos: pregunta antes de tomarles foto y dales una propina.', en: 'Palenquera women in colourful dresses sell fruit and pose for photos: ask before photographing them and give a tip.' },
    { es: 'Noviembre es de fiesta: las Fiestas de Independencia llenan la ciudad de desfiles, buscapiés y espuma. Mira la sección Fiestas.', en: 'November is party time: the Independence festivities fill the city with parades, firecrackers and foam. See the Festivities section.' },
    { es: 'En oficinas públicas ve bien presentado: nada de chanclas ni esqueleto.', en: 'Dress smartly for government offices: no flip-flops or tank tops.' }] },
  safety: { t: { es: 'Seguridad', en: 'Safety' }, ph: 'sunset', items: [
    { es: 'No aceptes bebidas, dulces ni cigarrillos de desconocidos: en zonas turísticas hay casos de drogas para robar.', en: 'Never accept drinks, sweets or cigarettes from strangers: there are cases of drugging to rob people in tourist areas.' },
    { es: 'De noche, pide taxi por aplicación o en sitios confiables. Saca el celular solo cuando lo necesites.', en: 'At night, book taxis by app or at trusted spots. Only take your phone out when you need it.' },
    { es: 'Desconfía de ofertas de trabajo que piden plata, tu documento o viajar a otro país "con todo pago": puede ser trata de personas.', en: 'Distrust job offers that ask for money, your ID or travel abroad "all paid": it may be human trafficking.' },
    { es: 'La explotación sexual de menores es un delito grave en Colombia. Si ves algo, denuncia al 123 o al 141.', en: 'Sexual exploitation of minors is a serious crime in Colombia. If you see something, report it on 123 or 141.' },
    { es: 'Los trámites migratorios no necesitan tramitadores: paga solo en canales oficiales de Migración Colombia o Cancillería.', en: 'Immigration procedures need no middlemen: pay only through official Migración Colombia or Foreign Ministry channels.' }] }
};

const GS = {
  what: [
    { es: 'Es el barrio que queda justo afuera de la muralla, al cruzar el Parque del Centenario desde la Torre del Reloj.', en: 'It\'s the district just outside the wall, across Centenario Park from the Clock Tower.' },
    { es: 'Fue el barrio de artesanos y trabajadores. De aquí salieron muchos de los que lucharon por la independencia de Cartagena el 11 de noviembre de 1811.', en: 'It was the district of craftsmen and workers. Many who fought for Cartagena\'s independence on 11 November 1811 came from here.' },
    { es: 'Hoy mezcla vecinos de toda la vida con hostales, murales, bares y música en la calle. Es el corazón popular del centro.', en: 'Today it mixes lifelong residents with hostels, murals, bars and street music. It\'s the popular heart of the centre.' }
  ],
  doit: [
    [{ es: 'Plaza de la Trinidad', en: 'Trinidad Square' }, { es: 'Frente a la iglesia de la Santísima Trinidad. De noche se llena de vecinos, viajeros, comida callejera y baile.', en: 'In front of Holy Trinity church. At night it fills with locals, travellers, street food and dancing.' }, 'gtrinidad'],
    [{ es: 'Ruta de murales', en: 'Mural route' }, { es: 'Callejones pintados con arte urbano que cuenta la historia del barrio. Ve de día para las fotos.', en: 'Alleys painted with street art that tells the district\'s story. Go by day for photos.' }, 'gmural'],
    [{ es: 'Calles de sombrillas y banderines', en: 'Streets of umbrellas and flags' }, { es: 'Callejones decorados que cambian según la temporada. Los más fotografiados de la ciudad.', en: 'Decorated alleys that change with the season. The most photographed in the city.' }, 'gcalle'],
    [{ es: 'Rumba y salsa', en: 'Nightlife and salsa' }, { es: 'Bares de salsa, champeta y música en vivo. El ambiente arranca tarde y dura hasta la madrugada.', en: 'Salsa, champeta and live-music bars. Things start late and go on until dawn.' }, 'gnight']
  ],
  tips: [
    { es: 'Ve de día a ver murales y de noche a la plaza: son dos experiencias distintas.', en: 'Go by day for murals and at night for the square: two different experiences.' },
    { es: 'Para comer barato busca los puestos de la plaza y las tiendas del barrio, no los restaurantes de la calle principal.', en: 'For cheap food try the stalls in the square and local shops, not the restaurants on the main street.' },
    { es: 'Aquí viven familias: respeta el ruido y no tomes fotos a los vecinos sin pedir permiso.', en: 'Families live here: keep the noise down and don\'t photograph residents without asking.' },
    { es: 'Hostales, bares y restaurantes del barrio contratan gente que hable inglés: lleva tu hoja de vida si tienes PPT o papeles al día.', en: 'Hostels, bars and restaurants here hire English speakers: bring your CV if you have a PPT or valid papers.' },
    { es: 'El 15 de noviembre es el Cabildo de Getsemaní, uno de los desfiles más tradicionales de las fiestas.', en: '15 November is the Getsemaní Cabildo, one of the most traditional parades of the festivities.' },
    { es: 'Arrendar aquí a largo plazo es caro y muchas casas son de alquiler turístico; mira Manga o Pie de la Popa.', en: 'Long-term rentals here are expensive and many homes are tourist lets; look at Manga or Pie de la Popa.' }
  ]
};

const IS = {
  what: [
    { es: 'Las Islas del Rosario son unas 27 islas a una a dos horas en lancha de Cartagena, dentro del Parque Nacional Natural Corales del Rosario y de San Bernardo.', en: 'The Rosario Islands are some 27 islands one to two hours by boat from Cartagena, inside the Corales del Rosario and San Bernardo National Natural Park.' },
    { es: 'Barú es una península al sur: por carretera llegas a Playa Blanca cruzando el puente de Pasacaballos.', en: 'Barú is a peninsula to the south: by road you reach Playa Blanca crossing the Pasacaballos bridge.' },
    { es: 'Agua cristalina, arrecifes de coral, manglares y playas de arena blanca. El plan de un día más popular desde la ciudad.', en: 'Crystal-clear water, coral reefs, mangroves and white-sand beaches. The most popular day trip from the city.' }
  ],
  doit: [
    [{ es: 'Caretear en los corales', en: 'Snorkel the reefs' }, { es: 'Peces de colores y corales a pocos metros de la orilla. Usa bloqueador que no dañe el arrecife.', en: 'Colourful fish and coral a few metres from shore. Use reef-safe sunscreen.' }, 'coral'],
    [{ es: 'Playa Blanca', en: 'Playa Blanca' }, { es: 'Arena blanca y agua turquesa en Barú. Llega temprano, antes de que lleguen las lanchas de turistas.', en: 'White sand and turquoise water on Barú. Arrive early, before the tourist boats.' }, 'playablanca'],
    [{ es: 'Paseo en lancha', en: 'Boat tour' }, { es: 'Los planes salen en la mañana del muelle de La Bodeguita y recorren varias islas con almuerzo.', en: 'Trips leave in the morning from La Bodeguita pier and visit several islands with lunch.' }, 'lancha'],
    [{ es: 'Plancton que brilla de noche', en: 'Glowing plankton at night' }, { es: 'En Barú hay salidas nocturnas para ver el plancton luminoso en el agua.', en: 'On Barú there are night trips to see bioluminescent plankton in the water.' }, 'baru']
  ],
  tips: [
    { es: 'Compra el plan en agencias registradas o en el muelle de La Bodeguita. Pregunta qué incluye: almuerzo, entrada al parque, tasa portuaria y careteo.', en: 'Book with registered agencies or at La Bodeguita pier. Ask what\'s included: lunch, park entry, port tax and snorkelling.' },
    { es: 'En Playa Blanca pregunta el precio de todo antes de usarlo: silla, carpa, masaje, comida. Así evitas cobros sorpresa.', en: 'At Playa Blanca ask the price of everything before using it: chair, tent, massage, food. That way no surprise bills.' },
    { es: 'Lleva efectivo en billetes pequeños, documento, toalla, gorra y agua.', en: 'Bring cash in small notes, ID, a towel, a cap and water.' },
    { es: 'Usa siempre el chaleco salvavidas en la lancha. Si el mar está bravo, la Capitanía puede suspender las salidas.', en: 'Always wear the life jacket on the boat. If the sea is rough, the Port Authority may cancel trips.' },
    { es: 'No pises ni toques el coral, y no compres caracoles, corales ni tortuga: es ilegal.', en: 'Don\'t step on or touch coral, and don\'t buy shells, coral or turtle products: it\'s illegal.' },
    { es: 'Mucha gente de las islas y de Barú vive del turismo: allí también hay trabajo de temporada para quienes tienen papeles.', en: 'Many islanders and Barú locals live off tourism: there\'s seasonal work there too for people with papers.' }
  ]
};

const ML = {
  what: [
    { es: 'Es el proyecto de espacio público más grande de la ciudad: un corredor costero que tendrá 6 km frente al mar Caribe en la zona norte.', en: 'It\'s the city\'s biggest public-space project: a coastal corridor that will run 6 km along the Caribbean Sea in the north of the city.' },
    { es: 'El primer tramo, de 2 km entre La Boquilla (sector Playa Azul) y el acceso al túnel de Crespo, se abrió al público el sábado 24 de octubre de 2026.', en: 'The first 2 km stretch, between La Boquilla (Playa Azul area) and the Crespo tunnel access, opened to the public on Saturday 24 October 2026.' },
    { es: 'Además de paseo, protege la costa: espolones y obras contra el oleaje y la erosión que se estaba comiendo las playas.', en: 'Besides a promenade, it protects the coast: groynes and works against the waves and erosion that were eating the beaches.' },
    { es: 'Lo maneja una empresa 100% pública del Distrito. La inversión es de unos $197.000 millones y el recorrido completo se espera para 2027.', en: 'It\'s run by a 100% public city company. Investment is around COP 197 billion and the full route is expected in 2027.' }
  ],
  doit: [
    [{ es: 'Caminar o trotar frente al mar', en: 'Walk or jog by the sea' }, { es: 'Senderos peatonales con vista al Caribe. Lo mejor es temprano en la mañana o al atardecer, cuando baja el sol.', en: 'Footpaths facing the Caribbean. Best early in the morning or at sunset, when the sun eases off.' }, 'malecon'],
    [{ es: 'Montar bicicleta', en: 'Ride a bike' }, { es: 'Tiene ciclorruta a lo largo del tramo. Respeta el carril de los peatones.', en: 'There\'s a bike lane along the stretch. Keep off the pedestrian path.' }, 'mbici'],
    [{ es: 'Ir a la playa', en: 'Go to the beach' }, { es: 'Varios accesos a la playa, con baños públicos, duchas y zonas de comida.', en: 'Several beach access points, with public toilets, showers and food areas.' }, 'mplaya'],
    [{ es: 'Hacer deporte y llevar a la mascota', en: 'Exercise and bring your pet' }, { es: 'Zonas de calistenia, plazoletas, áreas verdes y espacios para mascotas.', en: 'Calisthenics areas, small plazas, green spaces and pet areas.' }, 'mcrespo']
  ],
  tips: [
    { es: 'Es gratis y abierto a todo el mundo: buen plan familiar de fin de semana que no cuesta nada.', en: 'It\'s free and open to everyone: a great weekend family plan that costs nothing.' },
    { es: 'Queda en la zona norte, cerca del aeropuerto: llega en taxi o por aplicación, o en las rutas de bus que van a La Boquilla.', en: 'It\'s in the north, near the airport: get there by taxi or app, or on the bus routes to La Boquilla.' },
    { es: 'El sol pega fuerte y casi no hay sombra todavía: lleva agua, gorra y bloqueador.', en: 'The sun is fierce and there\'s little shade yet: bring water, a cap and sunscreen.' },
    { es: 'El Distrito espera 600 empleos formales para trabajadores de playa y locales comerciales: si vendes en playa, pregunta cómo formalizarte allí.', en: 'The city expects 600 formal jobs for beach workers plus commercial units: if you sell on the beach, ask how to get a formal spot there.' },
    { es: 'El resto del malecón sigue en obra: no te metas a las zonas cerradas ni a los espolones en construcción.', en: 'The rest of the promenade is still under construction: stay out of closed areas and groynes being built.' },
    { es: 'Cuida lo nuevo: no botes basura ni rayes. Es de todos.', en: 'Look after it: no litter or graffiti. It belongs to everyone.' }
  ]
};

const VIDEOS = [
  [{ es: 'Recorrido a pie por la Ciudad Amurallada', en: 'Walled City walking tour' }, 'Cartagena ciudad amurallada recorrido 4K', 'murallas'],
  [{ es: 'Vivir en Cartagena siendo venezolano', en: 'Living in Cartagena as a Venezuelan' }, 'venezolano viviendo en Cartagena experiencia', 'street'],
  [{ es: 'Getsemaní de día y de noche', en: 'Getsemaní by day and night' }, 'Getsemaní Cartagena recorrido', 'getsemani'],
  [{ es: 'El nuevo Gran Malecón del Mar', en: 'The new Gran Malecón del Mar' }, 'Gran Malecón del Mar Cartagena', 'malecon'],
  [{ es: 'Islas del Rosario y Playa Blanca', en: 'Rosario Islands and Playa Blanca' }, 'Islas del Rosario Playa Blanca Barú guía', 'rosario'],
  [{ es: 'Aprende a bailar champeta', en: 'Learn to dance champeta' }, 'aprender a bailar champeta paso básico', 'champeta'],
  [{ es: 'Fiestas de Independencia de Cartagena', en: 'Cartagena Independence festivities' }, 'Fiestas de Independencia Cartagena desfile', 'fiestas']
];

/* ---------- Secciones (vistas) ---------- */
const SECTIONS = [
  { id: 'papers', ph: 'reloj', badge: { es: 'Urgente', en: 'Urgent' }, t: { es: 'Papeles, PPT y visas', en: 'Papers, PPT & visas' }, s: { es: 'PPT, PEP Tutor, Visa V, Check-MIG', en: 'PPT, PEP Tutor, Visa V, Check-MIG' } },
  { id: 'work', ph: 'pegasos', t: { es: 'Trabajo y salario', en: 'Work & wages' }, s: { es: 'Mínimo 2026 y calculadora', en: '2026 minimum & calculator' } },
  { id: 'fiestas', ph: 'fiestas', badge: { es: 'Noviembre', en: 'November' }, t: { es: 'Fiestas de Independencia', en: 'Independence festivities' }, s: { es: 'Agenda 2026 con cuenta regresiva', en: '2026 schedule with countdown' } },
  { id: 'malecon', ph: 'malecon', badge: { es: 'Nuevo', en: 'New' }, t: { es: 'Gran Malecón del Mar', en: 'Gran Malecón del Mar' }, s: { es: 'Abierto desde el 24 de octubre: 2 km frente al mar', en: 'Open since 24 October: 2 km by the sea' } },
  { id: 'getsemani', ph: 'getsemani', badge: { es: 'Barrio', en: 'District' }, t: { es: 'Barrio Getsemaní', en: 'Getsemaní district' }, s: { es: 'Historia, murales, rumba y consejos', en: 'History, murals, nightlife and tips' } },
  { id: 'islas', ph: 'rosario', badge: { es: 'Islas', en: 'Islands' }, t: { es: 'Islas del Rosario y Barú', en: 'Rosario Islands & Barú' }, s: { es: 'Lanchas, Playa Blanca, corales y consejos', en: 'Boats, Playa Blanca, reefs and tips' } },
  { id: 'places', ph: 'murallas', t: { es: 'Lugares', en: 'Places' }, s: { es: 'Qué conocer, gratis y de pago', en: 'What to see, free and paid' } },
  { id: 'move', ph: 'transcaribe', t: { es: 'Transcaribe y transporte', en: 'Transcaribe & getting around' }, s: { es: 'Pasajes, taxis y lanchas', en: 'Fares, taxis and boats' } },
  { id: 'health', ph: 'hospital', t: { es: 'Salud', en: 'Health' }, s: { es: 'Urgencias, SISBEN, EPS', en: 'ER, SISBEN, insurers' } },
  { id: 'money', ph: 'peso', t: { es: 'Peso y cambio', en: 'Peso & exchange' }, s: { es: 'Dólar, euro y bolívar en vivo', en: 'Dollar, euro and bolívar live' } },
  { id: 'talk', ph: 'palenquera', t: { es: 'Hablar costeño', en: 'Speak costeño' }, s: { es: 'Palabras, conversaciones e inglés', en: 'Words, dialogues and English' } },
  { id: 'life', ph: 'balcon', t: { es: 'Vivir aquí', en: 'Living here' }, s: { es: 'Vivienda, comida, seguridad', en: 'Housing, food, safety' } },
  { id: 'weather', ph: 'sunset', t: { es: 'Clima y festivos', en: 'Weather & holidays' }, s: { es: 'Pronóstico y feriados', en: 'Forecast and holidays' } },
  { id: 'first', ph: 'airport', t: { es: 'Primeros días', en: 'First days' }, s: { es: 'Lista paso a paso', en: 'Step-by-step list' } },
  { id: 'map', ph: 'cartagena', t: { es: 'Mapa', en: 'Map' }, s: { es: 'Lugares, hospitales, Migración', en: 'Places, hospitals, immigration' } },
  { id: 'media', ph: 'bocagrande', t: { es: 'Fotos y videos', en: 'Photos & videos' }, s: { es: 'Conoce la ciudad antes de ir', en: 'See the city before you go' } }
];
const WIDE = ['papers', 'fiestas', 'malecon', 'getsemani', 'islas', 'media'];

function head(id, title, sub) {
  return `<button class="back" onclick="go('home')">${L(T.back)}</button>
  <div class="sec-head" style="margin-top:0"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
}
const linkBtn = (href, txt, cls = '') => `<a class="btn ${cls}" href="${href}" target="_blank" rel="noopener">${txt}</a>`;

const V = {};

V.home = () => `
  <div class="hero" id="hero">
    <div class="dots" id="hero-dots"></div>
    <span class="cap" id="hero-cap"></span>
    <div class="in">
      <span class="kicker">${L({ es: 'Recién llegado a Cartagena', en: 'Just arrived in Cartagena' })}</span>
      <h1>${L({ es: 'Bienvenido a La Heroica', en: 'Welcome to La Heroica' })}</h1>
      <p>${L({ es: 'Papeles, trabajo, Transcaribe, salud, cómo hablar costeño y los mejores rincones de Cartagena de Indias, en un solo lugar y en tu idioma.', en: 'Papers, work, Transcaribe, health, how to speak costeño and the best of Cartagena de Indias, all in one place and in your language.' })}</p>
    </div>
  </div>
  <div id="alert"></div>
  <div class="live">
    <div class="lc dark"><div class="lab">${L({ es: 'Clima ahora', en: 'Weather now' })}</div><div class="big" id="wx-now"><span class="spin"></span></div><div class="sub" id="wx-sub"></div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Hora en Cartagena', en: 'Time in Cartagena' })}</div><div class="big" id="clk-co">--:--</div><div class="sub" id="clk-ve"></div></div>
    <div class="lc c3"><div class="lab">${L({ es: '1 dólar hoy', en: '1 US dollar today' })}</div><div class="big" id="fx-usd"><span class="spin"></span></div><div class="sub muted" id="fx-sub"></div></div>
  </div>
  <div id="fiesta-strip"></div>
  <div class="ptiles">
    ${SECTIONS.map(s => `<button class="pt ${s.badge ? 'hot' : ''} ${WIDE.includes(s.id) ? 'wide' : ''}" ${s.badge ? `data-badge="${esc(L(s.badge))}"` : ''} ${photo(s.ph)} onclick="go('${s.id}')"><b>${L(s.t)}</b><small>${L(s.s)}</small></button>`).join('')}
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Mi dirección en Cartagena', en: 'My address in Cartagena' })}</h3>
    <p class="small muted">${L({ es: 'Guárdala aquí. Si te pierdes, la app te lleva de vuelta o se la muestras a alguien. Solo queda en tu celular.', en: 'Save it here. If you get lost, the app takes you back or you show it to someone. It stays on your phone only.' })}</p>
    <div class="row mt"><input id="my-addr" placeholder="${L({ es: 'Ej: Calle 30 # 17-25, Pie de la Popa', en: 'E.g. Calle 30 # 17-25, Pie de la Popa' })}" value="${esc(store.get('addr', ''))}"><button class="btn red" onclick="saveAddr()">${L({ es: 'Guardar', en: 'Save' })}</button></div>
    <div class="btns"><button class="btn sm" onclick="routeHome()">${L({ es: 'Llévame a casa', en: 'Take me home' })}</button><button class="btn sm ghost" onclick="openShow()">${L({ es: 'Mostrar a alguien', en: 'Show someone' })}</button></div>
  </div>`;

V.papers = () => `
  ${head('papers', L({ es: 'Papeles, PPT y visas', en: 'Papers, PPT & visas' }), L({ es: 'Entrar, quedarte y trabajar de forma legal en Colombia.', en: 'Entering, staying and working legally in Colombia.' }))}
  <div id="alert2"></div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Si eres venezolano: las tres vías vigentes', en: 'If you\'re Venezuelan: the three current routes' })}</h3>
    <p class="small">${L({ es: 'Migración Colombia actualizó en septiembre de 2026 las opciones de regularización. La inscripción al PPT para adultos está cerrada.', en: 'Migración Colombia updated the regularization options in September 2026. PPT registration for adults is closed.' })}</p>
    <div class="status-list mt">
      <div class="sl"><div><b>1. PPT — ${L({ es: 'Permiso por Protección Temporal', en: 'Temporary Protection Permit' })}</b><small>${L({ es: 'Sigue abierto solo para niños y adolescentes venezolanos inscritos en un colegio o en programas del ICBF. Si tu PPT ya fue aprobado y no lo has recogido, el plazo para reclamarlo vence el <b>4 de noviembre de 2026</b>; después lo destruyen y el trámite queda desistido.', en: 'Still open only for Venezuelan children and teens enrolled in school or ICBF programmes. If your PPT was approved and you haven\'t collected it, the deadline is <b>4 November 2026</b>; after that it is destroyed and the application is dropped.' })}</small></div></div>
      <div class="sl"><div><b>2. PEP Tutor</b><small>${L({ es: 'Para papás, tutores o cuidadores de menores venezolanos que tenían PPT vigente al 31 de diciembre de 2023. Se pide hasta el <b>31 de diciembre de 2026</b>.', en: 'For parents, guardians or carers of Venezuelan minors who held a valid PPT on 31 December 2023. Apply by <b>31 December 2026</b>.' })}</small></div></div>
      <div class="sl"><div><b>3. Visa V — ${L({ es: 'Visitante Especial', en: 'Special Visitor' })}</b><small>${L({ es: 'Para venezolanos que entraron a Colombia antes del 4 de diciembre de 2024 y cumplen las condiciones de Cancillería. Dura dos años e incluye permiso abierto de trabajo. Requiere verificación previa de Migración.', en: 'For Venezuelans who entered Colombia before 4 December 2024 and meet the Foreign Ministry\'s conditions. Valid two years with an open work permit. Requires prior verification by Migración.' })}</small></div></div>
    </div>
    <div class="note red mt">${L({ es: 'No pueden acceder quienes tienen antecedentes penales, órdenes de expulsión o deportación vigentes, o están privados de la libertad. Migración insiste: no se necesitan intermediarios.', en: 'People with criminal records, active expulsion or deportation orders, or in custody are excluded. Migración insists: no middlemen are needed.' })}</div>
    <div class="btns">${linkBtn('https://www.migracioncolombia.gov.co/', 'Migración Colombia', 'red')}${linkBtn('https://www.cancilleria.gov.co/tramites_servicios/visa', L({ es: 'Visas en Cancillería', en: 'Foreign Ministry visas' }))}${linkBtn('https://help.unhcr.org/colombia/regularizacion-para-personas-venezolanas/', L({ es: 'Guía de ACNUR', en: 'UNHCR guide' }), 'ghost')}</div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Cómo pedir el PEP Tutor paso a paso', en: 'How to apply for PEP Tutor step by step' })}</h3>
    <ol class="small mt">
      <li>${L({ es: 'Llena el Formulario Único de Trámites (FUT) en el sitio de Migración.', en: 'Fill in the Single Procedures Form (FUT) on Migración\'s site.' })}</li>
      <li>${L({ es: 'Responde la encuesta socioeconómica. Te llega un número de caso al correo.', en: 'Answer the socio-economic survey. You get a case number by email.' })}</li>
      <li>${L({ es: 'Agenda la cita presencial en el sistema de Migración.', en: 'Book the in-person appointment in Migración\'s system.' })}</li>
      <li>${L({ es: 'Lleva tu documento y la prueba del vínculo: registro de nacimiento apostillado si eres papá o mamá; sentencia, escritura o acta si eres tutor o cuidador.', en: 'Bring your ID and proof of the relationship: apostilled birth certificate if you\'re the parent; court ruling, deed or record if you\'re a guardian or carer.' })}</li>
      <li>${L({ es: 'Migración tiene 30 días para responder. Si lo aprueban, recoge el permiso a tiempo.', en: 'Migración has 30 days to reply. If approved, collect the permit on time.' })}</li>
    </ol>
  </div>
  <div class="grid g2 stack mt2">
    <div class="card reveal">
      <h3>${L({ es: 'Si vienes de visita', en: 'If you\'re visiting' })}</h3>
      <ul class="small">
        <li>${L({ es: 'La mayoría de latinoamericanos entra sin visa como turista por 90 días, prorrogables hasta 180 días en el año. Confirma tu caso en Cancillería.', en: 'Most Latin Americans enter visa-free as tourists for 90 days, extendable to 180 days a year. Confirm your case with the Foreign Ministry.' })}</li>
        <li>${L({ es: '<b>Check-MIG:</b> formulario gratuito de Migración que debes llenar antes de entrar y salir del país.', en: '<b>Check-MIG:</b> free Migración form you must fill in before entering and leaving the country.' })}</li>
        <li>${L({ es: 'Como turista <b>no puedes trabajar</b>, ni siquiera "por días".', en: 'As a tourist you <b>cannot work</b>, not even casual day jobs.' })}</li>
      </ul>
      <div class="btns">${linkBtn('https://www.migracioncolombia.gov.co/', 'Check-MIG', 'sm')}</div>
    </div>
    <div class="card reveal">
      <h3>${L({ es: 'Lo que te abre tener papeles', en: 'What papers open up for you' })}</h3>
      <ul class="small">
        <li>${L({ es: 'Trabajo formal con contrato, prima, vacaciones y cesantías.', en: 'Formal work with a contract, bonuses, holidays and severance.' })}</li>
        <li>${L({ es: 'Salud: SISBEN y afiliación a una EPS.', en: 'Health: SISBEN and joining an EPS insurer.' })}</li>
        <li>${L({ es: 'Cuenta bancaria, Nequi o Daviplata.', en: 'Bank account, Nequi or Daviplata.' })}</li>
        <li>${L({ es: 'Estudiar, convalidar títulos y hacer cursos gratis del SENA.', en: 'Study, validate diplomas and take free SENA courses.' })}</li>
        <li>${L({ es: 'Si tu hijo nació en Colombia, pregunta en la Registraduría por su registro civil y nacionalidad.', en: 'If your child was born in Colombia, ask the Registry about their birth record and nationality.' })}</li>
      </ul>
    </div>
  </div>
  <div class="sec-head"><div><h2>${L({ es: 'Oficinas', en: 'Offices' })}</h2></div></div>
  <div class="status-list">${OFFICES.map(o => `<div class="sl reveal"><div><b>${L(o.n)}</b><small>${esc(o.a)} · ${L(o.h)}</small><small><a href="${gmaps(o.a)}" target="_blank" rel="noopener">${L({ es: 'Ver en el mapa', en: 'See on map' })}</a></small></div>${o.telS ? `<a class="call ink" href="tel:${o.tel}">${L({ es: 'Llamar', en: 'Call' })}</a>` : ''}</div>`).join('')}</div>`;

V.work = () => `
  ${head('work', L({ es: 'Trabajo y salario', en: 'Work & wages' }), L({ es: 'Salario mínimo 2026 (Decreto 1469 de 2025, vigente) y jornada de 42 horas desde el 15 de julio de 2026.', en: '2026 minimum wage (Decree 1469 of 2025, in force) and 42-hour week since 15 July 2026.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: 'Salario mínimo', en: 'Minimum wage' })}</div><div class="big">${cop(WAGE.month)}</div><div class="sub">${L({ es: 'Mensual, antes de descuentos', en: 'Monthly, before deductions' })}</div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Con auxilio de transporte', en: 'With transport allowance' })}</div><div class="big">${cop(WAGE.total)}</div><div class="sub">${L({ es: 'Auxilio: ', en: 'Allowance: ' })}${cop(WAGE.aux)}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: 'Hora ordinaria', en: 'Ordinary hour' })}</div><div class="big">${cop(WAGE.hour)}</div><div class="sub muted" id="wage-usd">${L({ es: 'Salario ÷ 210 horas', en: 'Wage ÷ 210 hours' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Recargos (sobre la hora ordinaria)', en: 'Surcharges (on the ordinary hour)' })}</h3>
    <table class="t mt"><tr><th>${L({ es: 'Concepto', en: 'Item' })}</th><th>%</th><th>${L({ es: 'Valor hora', en: 'Hourly' })}</th></tr>
      ${[[{ es: 'Hora nocturna (7 p. m. a 6 a. m.)', en: 'Night hour (7 pm to 6 am)' }, 35], [{ es: 'Hora extra diurna', en: 'Daytime overtime' }, 25], [{ es: 'Hora extra nocturna', en: 'Night overtime' }, 75], [{ es: 'Domingo o festivo', en: 'Sunday or holiday' }, 90], [{ es: 'Extra diurna en domingo o festivo', en: 'Daytime overtime, Sunday/holiday' }, 115], [{ es: 'Extra nocturna en domingo o festivo', en: 'Night overtime, Sunday/holiday' }, 165]].map(r => `<tr><td>${L(r[0])}</td><td class="n">+${r[1]}%</td><td class="n">${cop(WAGE.hour * (1 + r[1] / 100))}</td></tr>`).join('')}
    </table>
    <p class="small muted mt">${L({ es: 'El recargo por domingo y festivo subió al 90% el 1 de julio de 2026 (Ley 2466). El auxilio de transporte no entra en la base de estos cálculos.', en: 'The Sunday/holiday surcharge rose to 90% on 1 July 2026 (Law 2466). The transport allowance isn\'t part of the base for these.' })}</p>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Calculadora de sueldo', en: 'Pay calculator' })}</h3>
    <div class="grid g3">
      <div><label class="f">${L({ es: 'Horas por semana', en: 'Hours per week' })}</label><input id="w-h" type="number" min="1" max="42" value="42" oninput="calcWage()"></div>
      <div><label class="f">${L({ es: 'Horas nocturnas por semana', en: 'Night hours per week' })}</label><input id="w-n" type="number" min="0" max="42" value="0" oninput="calcWage()"></div>
      <div><label class="f">${L({ es: 'Domingos o festivos al mes', en: 'Sundays/holidays per month' })}</label><input id="w-d" type="number" min="0" max="10" value="0" oninput="calcWage()"></div>
    </div>
    <div id="w-out" class="mt"></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Tus derechos', en: 'Your rights' })}</h3>
    <ul class="small">
      <li>${L({ es: 'Con PPT, visa o documento colombiano tienes los mismos derechos laborales que cualquier trabajador en Colombia.', en: 'With a PPT, visa or Colombian ID you have the same labour rights as any worker in Colombia.' })}</li>
      <li>${L({ es: 'Si ganas hasta dos salarios mínimos te deben pagar el auxilio de transporte.', en: 'If you earn up to two minimum wages you must get the transport allowance.' })}</li>
      <li>${L({ es: 'Te descuentan 4% para salud y 4% para pensión; el empleador paga su parte y te afilia a riesgos laborales (ARL).', en: '4% for health and 4% for pension come off your pay; the employer pays its share and enrols you in workplace-risk insurance (ARL).' })}</li>
      <li>${L({ es: 'Pide contrato por escrito y desprendible de pago. Guarda fotos de todo.', en: 'Ask for a written contract and payslips. Keep photos of everything.' })}</li>
      <li>${L({ es: 'Sectores con más trabajo en Cartagena: turismo, hoteles, restaurantes, comercio, construcción, puerto y servicios domésticos. Hablar inglés te sube el sueldo.', en: 'Sectors with most work in Cartagena: tourism, hotels, restaurants, retail, construction, the port and domestic work. English raises your pay.' })}</li>
      <li>${L({ es: 'Busca vacantes en el Servicio Público de Empleo y en la Agencia de Empleo del SENA, y haz cursos gratis del SENA.', en: 'Find jobs at the Public Employment Service and the SENA Jobs Agency, and take free SENA courses.' })}</li>
    </ul>
    <div class="btns">${linkBtn('https://www.serviciodeempleo.gov.co/', L({ es: 'Servicio de Empleo', en: 'Employment Service' }), 'sm red')}${linkBtn('https://agenciapublicadeempleo.sena.edu.co/', L({ es: 'Agencia de Empleo SENA', en: 'SENA Jobs Agency' }), 'sm')}</div>
  </div>`;

V.fiestas = () => `
  ${head('fiestas', L({ es: 'Fiestas de Independencia 2026', en: 'Independence festivities 2026' }), L({ es: 'Cartagena celebra que el 11 de noviembre de 1811 fue la primera ciudad de la Nueva Granada en declarar su independencia absoluta.', en: 'Cartagena celebrates being, on 11 November 1811, the first city in New Granada to declare full independence.' }))}
  <div class="hero" style="min-height:240px" ${photo('fiestas')}><div class="in"><span class="kicker">${L({ es: 'Noviembre en La Heroica', en: 'November in La Heroica' })}</span><h1 style="font-size:2.3rem">${L({ es: 'Desfiles, reinado y bololó', en: 'Parades, pageant and street party' })}</h1><p id="fiesta-next"></p></div></div>
  <div class="status-list" id="fiesta-list"></div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Consejos para disfrutarlas', en: 'Tips to enjoy them' })}</h3><ul class="small">
    <li>${L({ es: 'El Gran Desfile del 12 de noviembre va por la Avenida Santander: llega temprano con agua, gorra y bloqueador.', en: 'The Grand Parade on 12 November runs along Avenida Santander: arrive early with water, a cap and sunscreen.' })}</li>
    <li>${L({ es: 'En las fiestas se tira maicena, espuma y agua: usa ropa que se pueda manchar y guarda el celular en bolsa plástica.', en: 'People throw cornstarch, foam and water: wear clothes you don\'t mind ruining and keep your phone in a plastic bag.' })}</li>
    <li>${L({ es: 'Los buscapiés (pólvora) están prohibidos y causan quemaduras: aléjate y cuida a los niños.', en: 'Buscapiés firecrackers are banned and cause burns: stay away and watch the kids.' })}</li>
    <li>${L({ es: 'Hay mucho trabajo temporal en ventas, eventos y restaurantes durante estas semanas.', en: 'There\'s lots of temporary work in sales, events and restaurants during these weeks.' })}</li>
    <li>${L({ es: 'El lunes 16 de noviembre es festivo en todo el país.', en: 'Monday 16 November is a nationwide public holiday.' })}</li>
  </ul></div>
  <p class="small muted mt">${L({ es: 'Agenda oficial presentada por la Alcaldía en septiembre de 2026. Las horas y lugares pueden cambiar: confírmalos en los canales de la Alcaldía.', en: 'Official schedule presented by the city in September 2026. Times and venues may change: confirm on official city channels.' })}</p>`;

function fiestaRows() {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(new Date());
  return FIESTAS.map(f => {
    const dt = daysTo(f[0]);
    const pill = f[0] === today ? `<span class="pill free">${L({ es: 'Hoy', en: 'Today' })}</span>` : dt > 0 ? `<span class="pill">${L({ es: 'En ' + dt + ' d', en: 'In ' + dt + ' d' })}</span>` : `<span class="pill paid">${L({ es: 'Ya pasó', en: 'Done' })}</span>`;
    return `<div class="sl" style="${dt < 0 ? 'opacity:.55' : ''}"><div><b>${L(f[1])}</b><small><span style="text-transform:capitalize">${dateLabel(f[0])}</span> · ${L(f[2])}</small></div>${pill}</div>`;
  }).join('');
}
function nextFiesta() { const today = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(new Date()); return FIESTAS.find(f => f[0] >= today) || null; }
function renderFiestas() {
  const box = $('#fiesta-list'); if (box) box.innerHTML = fiestaRows();
  const nf = nextFiesta();
  const p = $('#fiesta-next'); if (p) p.textContent = nf ? L({ es: 'Lo que sigue: ', en: 'Up next: ' }) + L(nf[1]) + (daysTo(nf[0]) === 0 ? L({ es: ' (hoy)', en: ' (today)' }) : L({ es: ' (en ' + daysTo(nf[0]) + ' días)', en: ' (in ' + daysTo(nf[0]) + ' days)' })) : L({ es: 'Las fiestas de 2026 ya terminaron. Nos vemos en noviembre de 2027.', en: 'The 2026 festivities are over. See you in November 2027.' });
  const s = $('#fiesta-strip');
  if (s) s.innerHTML = nf ? `<div class="card dark mt2" style="cursor:pointer" onclick="go('fiestas')"><div class="small" style="opacity:.75">${L({ es: 'Fiestas de Independencia', en: 'Independence festivities' })}</div><b style="font-family:'Barlow Condensed';font-size:1.45rem;text-transform:uppercase">${L(nf[1])}</b><div class="small" style="opacity:.85"><span style="text-transform:capitalize">${dateLabel(nf[0])}</span> ·${daysTo(nf[0]) === 0 ? L({ es: 'hoy', en: 'today' }) : L({ es: 'en ' + daysTo(nf[0]) + ' días', en: 'in ' + daysTo(nf[0]) + ' days' })}</div></div>` : '';
}

V.places = () => {
  const cats = [['city', { es: 'Ciudad', en: 'City' }], ['beach', { es: 'Playas e islas', en: 'Beaches & islands' }], ['nature', { es: 'Paseos de un día', en: 'Day trips' }]];
  return `${head('places', L({ es: 'Lugares para conocer', en: 'Places to see' }), L({ es: 'Desliza para ver más. Toca "Cómo llegar" para abrir la ruta.', en: 'Swipe for more. Tap "Directions" to open the route.' }))}
  ${cats.map(c => `<h3 class="mt2" style="text-transform:uppercase">${L(c[1])}</h3><div class="rail mt">${PLACES.filter(p => p.cat === c[0]).map(p => `
    <article class="place"><div class="ph" ${photo(p.id)}><span class="pill ${p.free ? 'free' : 'paid'}">${p.free ? L({ es: 'Gratis', en: 'Free' }) : L({ es: 'Con costo', en: 'Paid' })}</span></div>
      <div class="bd"><h3>${L(p.n)}</h3><p>${L(p.d)}</p>
      <div class="btns"><a class="btn sm red" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank" rel="noopener">${L({ es: 'Cómo llegar', en: 'Directions' })}</a><button class="btn sm ghost" onclick="showOnMap('${p.id}')">${L({ es: 'En el mapa', en: 'On map' })}</button>${p.id === 'malecon' ? `<button class="btn sm" onclick="go('malecon')">${L({ es: 'Ver malecón', en: 'See promenade' })}</button>` : ''}${p.id === 'getsemani' ? `<button class="btn sm" onclick="go('getsemani')">${L({ es: 'Ver barrio', en: 'See district' })}</button>` : ''}${p.id === 'rosario' || p.id === 'playablanca' ? `<button class="btn sm" onclick="go('islas')">${L({ es: 'Ver islas', en: 'See islands' })}</button>` : ''}</div></div></article>`).join('')}</div>`).join('')}`;
};

function featureView(id, data, o) {
  return `${head(id, L(o.title), L(o.sub))}
  <div class="hero" style="min-height:260px" ${photo(o.ph)}><div class="in"><span class="kicker">${L(o.kicker)}</span><h1 style="font-size:2.3rem">${L(o.h1)}</h1><p>${L(o.p)}</p></div></div>
  <div class="card reveal"><h3>${L({ es: 'Qué es', en: 'What it is' })}</h3><ul class="small">${data.what.map(x => `<li>${L(x)}</li>`).join('')}</ul></div>
  <div class="sec-head"><div><h2>${L({ es: 'Qué hacer', en: 'What to do' })}</h2><p>${L({ es: 'Desliza para ver más.', en: 'Swipe for more.' })}</p></div></div>
  <div class="rail">${data.doit.map(d => `<article class="place"><div class="ph" ${photo(d[2])}></div><div class="bd"><h3>${L(d[0])}</h3><p>${L(d[1])}</p></div></article>`).join('')}</div>
  <div class="sec-head"><div><h2>${L(o.tipsT)}</h2></div></div>
  <div class="status-list">${data.tips.map((t, i) => `<div class="sl reveal"><div>${num(L(t), i)}</div></div>`).join('')}</div>
  <div class="btns mt2"><button class="btn red" onclick="showOnMap('${o.mapId}')">${L({ es: 'Ver en el mapa', en: 'See on map' })}</button><a class="btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent(o.yt)}" target="_blank" rel="noopener">${L({ es: 'Videos', en: 'Videos' })}</a></div>`;
}
V.getsemani = () => featureView('getsemani', GS, {
  title: { es: 'Barrio Getsemaní', en: 'Getsemaní district' }, sub: { es: 'El barrio de la gente, la música y los murales.', en: 'The district of the people, music and murals.' },
  ph: 'getsemani', kicker: { es: 'Cartagena', en: 'Cartagena' }, h1: { es: 'Getsemaní', en: 'Getsemaní' },
  p: { es: 'Murales, sombrillas de colores y la Plaza de la Trinidad llena de vida.', en: 'Murals, colourful umbrellas and a lively Trinidad Square.' },
  tipsT: { es: 'Consejos de latino a latino', en: 'Tips from Latinos to Latinos' }, mapId: 'getsemani', yt: 'Getsemaní Cartagena'
});
V.malecon = () => featureView('malecon', ML, {
  title: { es: 'Gran Malecón del Mar', en: 'Gran Malecón del Mar' }, sub: { es: 'El nuevo paseo frente al mar de la zona norte, abierto el 24 de octubre de 2026.', en: 'The new seafront promenade in the north, opened on 24 October 2026.' },
  ph: 'malecon', kicker: { es: 'Nuevo en Cartagena', en: 'New in Cartagena' }, h1: { es: 'Gran Malecón del Mar', en: 'Gran Malecón del Mar' },
  p: { es: '2 km para caminar, montar bici y disfrutar el Caribe gratis. Serán 6 km en 2027.', en: '2 km to walk, cycle and enjoy the Caribbean for free. It will be 6 km in 2027.' },
  tipsT: { es: 'Consejos para ir', en: 'Tips for going' }, mapId: 'malecon', yt: 'Gran Malecón del Mar Cartagena'
});
V.islas = () => featureView('islas', IS, {
  title: { es: 'Islas del Rosario y Barú', en: 'Rosario Islands & Barú' }, sub: { es: 'El paseo de playa más famoso desde Cartagena.', en: 'The most famous beach day out from Cartagena.' },
  ph: 'rosario', kicker: { es: 'Paseo de un día', en: 'Day trip' }, h1: { es: 'Islas del Rosario', en: 'Rosario Islands' },
  p: { es: 'Corales, agua turquesa y la arena blanca de Playa Blanca.', en: 'Coral reefs, turquoise water and Playa Blanca\'s white sand.' },
  tipsT: { es: 'Antes de ir', en: 'Before you go' }, mapId: 'rosario', yt: 'Islas del Rosario Playa Blanca'
});

V.move = () => `
  ${head('move', L({ es: 'Transcaribe y transporte', en: 'Transcaribe & getting around' }), L({ es: 'Cómo moverte por Cartagena sin que te cobren de más.', en: 'How to get around Cartagena without being overcharged.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">Transcaribe 2026</div><div class="big">${cop(TRANSCARIBE)}</div><div class="sub">${L({ es: 'Por viaje, desde el 23 de enero', en: 'Per ride, since 23 January' })}</div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Al mes (2 viajes al día)', en: 'Per month (2 rides a day)' })}</div><div class="big">${cop(TRANSCARIBE * 2 * 26)}</div><div class="sub">${L({ es: '26 días de trabajo', en: '26 working days' })}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: 'Auxilio de transporte', en: 'Transport allowance' })}</div><div class="big">${cop(WAGE.aux)}</div><div class="sub muted">${L({ es: 'Si ganas hasta 2 mínimos', en: 'If you earn up to 2 minimums' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Cómo funciona Transcaribe', en: 'How Transcaribe works' })}</h3>
    <ul class="small">
      <li>${L({ es: 'Es el sistema de buses de la ciudad. La ruta troncal va por la Avenida Pedro de Heredia, del Portal (junto a la Terminal de Transportes) hasta el Centro y Bocagrande.', en: 'It\'s the city bus system. The trunk route runs along Avenida Pedro de Heredia, from the Portal (by the bus terminal) to the Centre and Bocagrande.' })}</li>
      <li>${L({ es: 'Las rutas alimentadoras llevan a los barrios y conectan con las estaciones.', en: 'Feeder routes reach the neighbourhoods and connect with the stations.' })}</li>
      <li>${L({ es: 'Se paga con la tarjeta recargable de Transcaribe, que compras y recargas en estaciones y puntos autorizados.', en: 'You pay with the rechargeable Transcaribe card, sold and topped up at stations and authorised points.' })}</li>
      <li>${L({ es: 'El pasaje subió a $3.900 con el Decreto 017 de 2026 de la Alcaldía.', en: 'The fare rose to COP 3,900 under the city\'s Decree 017 of 2026.' })}</li>
    </ul>
    <div class="btns">${linkBtn('https://transcaribe.gov.co/', L({ es: 'Rutas y estaciones', en: 'Routes & stations' }), 'sm red')}</div>
  </div>
  <div class="grid g2 stack mt2">
    <div class="card reveal"><h3>${L({ es: 'Taxis y aplicaciones', en: 'Taxis and apps' })}</h3><p class="small">${L({ es: 'Los taxis en Cartagena no usan taxímetro: cobran por zonas. Pregunta y acuerda el precio antes de subir. De noche es más seguro pedir el carro por aplicación.', en: 'Cartagena taxis don\'t use meters: they charge by zone. Ask and agree the price before getting in. At night it\'s safer to book by app.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Busetas y mototaxis', en: 'Minibuses and moto-taxis' })}</h3><p class="small">${L({ es: 'Las busetas tradicionales siguen funcionando en muchos barrios con su propia tarifa. El mototaxi es muy común pero informal: exige casco y evita las vías rápidas.', en: 'Traditional minibuses still run in many areas with their own fare. Moto-taxis are very common but informal: insist on a helmet and avoid fast roads.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Lanchas a las islas', en: 'Boats to the islands' })}</h3><p class="small">${L({ es: 'Salen del Muelle Turístico de La Bodeguita, frente al centro. Además del plan, se paga una tasa portuaria. Mira la sección Islas.', en: 'They leave from La Bodeguita tourist pier, opposite the centre. On top of the trip there\'s a port tax. See the Islands section.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Buses a otras ciudades', en: 'Buses to other cities' })}</h3><p class="small">${L({ es: 'Salen de la Terminal de Transportes, en la salida de la ciudad: Barranquilla, Santa Marta, Montería, Sincelejo, Medellín y Bogotá.', en: 'They leave from the bus terminal on the edge of town: Barranquilla, Santa Marta, Montería, Sincelejo, Medellín and Bogotá.' })}</p></div>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: '¿Cómo llego?', en: 'How do I get there?' })}</h3>
    <label class="f">${L({ es: 'Destino', en: 'Destination' })}</label>
    <div class="row"><input id="j-to" placeholder="${L({ es: 'Ej: Bazurto, Bocagrande, Hospital Universitario', en: 'E.g. Bazurto, Bocagrande, University Hospital' })}"><button class="btn red" onclick="planTrip()">${L({ es: 'Buscar', en: 'Go' })}</button></div>
    <p class="small muted mt">${L({ es: 'Abre Google Maps con la ruta en transporte público desde donde estás.', en: 'Opens Google Maps with a public-transport route from where you are.' })}</p>
  </div>`;

V.health = () => `
  ${head('health', L({ es: 'Salud', en: 'Health' }), L({ es: 'Dónde ir según lo que te pase.', en: 'Where to go depending on what happens.' }))}
  <div class="sosgrid">
    <a class="sosbtn" href="tel:123"><strong>123</strong><span>${L({ es: 'Emergencias', en: 'Emergencies' })}</span><small>${L({ es: 'Si es grave, llama ya', en: 'If serious, call now' })}</small></a>
    <a class="sosbtn ink" href="tel:132"><strong>132</strong><span>${L({ es: 'Cruz Roja', en: 'Red Cross' })}</span><small>${L({ es: 'Ambulancia', en: 'Ambulance' })}</small></a>
  </div>
  <div class="note red mt2">${L({ es: '<b>En urgencias te tienen que atender</b>, aunque no tengas papeles, EPS ni plata. La atención inicial de urgencias es obligatoria en Colombia.', en: '<b>The ER must treat you</b>, even without papers, insurance or money. Initial emergency care is mandatory in Colombia.' })}</div>
  <div class="status-list mt2">
    <div class="sl reveal"><div><b>Hospital Universitario del Caribe</b><small>${L({ es: 'Hospital público de alta complejidad con urgencias 24 horas. Barrio Zaragocilla.', en: 'Public tertiary hospital with a 24-hour ER. Zaragocilla.' })}</small></div><a class="call" href="${gmaps('Hospital Universitario del Caribe Cartagena')}" target="_blank" rel="noopener">${L({ es: 'Mapa', en: 'Map' })}</a></div>
    <div class="sl reveal"><div><b>Hospital Infantil Napoleón Franco Pareja</b><small>${L({ es: 'La "Casa del Niño": urgencias para niños. Bocagrande.', en: 'The "Children\'s House": paediatric ER. Bocagrande.' })}</small></div><a class="call ink" href="${gmaps('Hospital Infantil Napoleón Franco Pareja Cartagena')}" target="_blank" rel="noopener">${L({ es: 'Mapa', en: 'Map' })}</a></div>
    <div class="sl reveal"><div><b>${L({ es: 'Centros de salud de la ESE Cartagena de Indias', en: 'ESE Cartagena public health centres' })}</b><small>${L({ es: 'Red pública con centros (CAP) en los barrios para consulta, vacunas y control prenatal.', en: 'Public network with neighbourhood centres (CAP) for check-ups, vaccines and prenatal care.' })}</small></div><a class="call ink" href="${gmaps('ESE Hospital Local Cartagena de Indias CAP')}" target="_blank" rel="noopener">${L({ es: 'Mapa', en: 'Map' })}</a></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Cómo afiliarte a salud', en: 'How to get health cover' })}</h3>
    <ol class="small">
      <li>${L({ es: 'Con PPT, visa o cédula pide la <b>encuesta del SISBEN</b> en la Alcaldía.', en: 'With a PPT, visa or Colombian ID, request the <b>SISBEN survey</b> from the city.' })}</li>
      <li>${L({ es: 'Si quedas clasificado, te afilias a una EPS del régimen subsidiado sin pagar.', en: 'If you qualify, you join a subsidised EPS insurer at no cost.' })}</li>
      <li>${L({ es: 'Si tienes contrato de trabajo, el empleador te afilia a una EPS del régimen contributivo.', en: 'If you have a job contract, your employer enrols you in a contributory EPS.' })}</li>
      <li>${L({ es: 'Las vacunas del esquema nacional son gratis para todos los niños, tengan o no papeles.', en: 'National-schedule vaccines are free for all children, with or without papers.' })}</li>
    </ol>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Ojo en temporada de lluvias', en: 'Watch out in rainy season' })}</h3><p class="small">${L({ es: 'Con las lluvias aumenta el dengue. Elimina agua estancada, usa repelente y, si tienes fiebre alta con dolor de cuerpo, ve al médico y no tomes ibuprofeno ni aspirina sin indicación.', en: 'Dengue rises with the rains. Get rid of standing water, use repellent and, with high fever and body aches, see a doctor and don\'t take ibuprofen or aspirin unless told to.' })}</p></div>`;

V.sos = () => `
  ${head('sos', 'SOS', L({ es: 'Toca un número para llamar.', en: 'Tap a number to call.' }))}
  <div class="sosgrid">${EMERG.map(e => `<a class="sosbtn ${e.cls}" href="tel:${e.n}"><strong>${e.n}</strong><span>${L(e.t)}</span><small>${L(e.s)}</small></a>`).join('')}</div>
  <div class="sec-head"><div><h2>${L({ es: 'Ayuda y oficinas', en: 'Help & offices' })}</h2></div></div>
  <div class="status-list">${OFFICES.filter(o => o.telS).map(o => `<div class="sl"><div><b>${L(o.n)}</b><small>${esc(o.telS)}</small></div><a class="call ink" href="tel:${o.tel}">${L({ es: 'Llamar', en: 'Call' })}</a></div>`).join('')}
    <div class="sl"><div><b>${L({ es: 'Fiscalía (denuncias)', en: 'Attorney General (crime reports)' })}</b><small>122</small></div><a class="call ink" href="tel:122">${L({ es: 'Llamar', en: 'Call' })}</a></div>
  </div>
  <div class="note mt2">${L({ es: 'Si eres de otro país, busca el consulado de tu país en Colombia en la web de tu cancillería y guárdalo en tus contactos.', en: 'If you\'re from another country, find your consulate in Colombia on your foreign ministry\'s site and save it to your contacts.' })}</div>
  <div class="btns"><button class="btn red block" onclick="openShow()">${L({ es: 'Me perdí: mostrar mi dirección', en: 'I\'m lost: show my address' })}</button></div>`;

let talkTab = 'cos';
V.talk = () => `
  ${head('talk', L({ es: 'Hablar costeño', en: 'Speak costeño' }), L({ es: 'En Cartagena se habla español, pero con su propio sabor. Y para trabajar en turismo, el inglés vale oro. Toca "Oír" para escuchar.', en: 'Cartagena speaks Spanish, with its own flavour. And for tourism jobs, English is gold. Tap "Hear" to listen.' }))}
  <div class="tabsx" id="talk-tabs">
    <button data-k="cos" onclick="setTalk('cos')">${L({ es: 'Costeño', en: 'Costeño' })}</button>
    <button data-k="dlg" onclick="setTalk('dlg')">${L({ es: 'Conversaciones', en: 'Dialogues' })}</button>
    <button data-k="ve" onclick="setTalk('ve')">${L({ es: 'De Venezuela a Colombia', en: 'Venezuela to Colombia' })}</button>
    <button data-k="en" onclick="setTalk('en')">${L({ es: 'Inglés para trabajar', en: 'English for work' })}</button>
  </div>
  <div id="talk-body"></div>`;
function talkBody() {
  const q = s => JSON.stringify(s).replace(/"/g, '&quot;');
  if (talkTab === 'cos') return `<div class="phr">${COSTENO.map(p => `<div class="ph1"><div><div class="o">${esc(p[0])}</div><div class="tr">${esc(LANG === 'es' ? p[1] : p[2])}</div><div class="say">"${esc(p[3])}"</div></div><button onclick="say(${q(p[3])},'es')">${L({ es: 'Oír', en: 'Hear' })}</button></div>`).join('')}</div>`;
  if (talkTab === 've') return `<p class="small muted mt">${L({ es: 'Palabras que cambian de un país a otro. Así te entienden más rápido.', en: 'Words that change from one country to the other. People will get you faster.' })}</p><div class="status-list mt">${VECO.map(p => `<div class="sl"><div><b>${esc(p[0])}</b><small>${L({ es: 'En Venezuela', en: 'In Venezuela' })}</small></div><div style="text-align:right"><b>${esc(p[1])}</b><small>${LANG === 'en' ? esc(p[2]) : L({ es: 'En Colombia', en: '' })}</small></div></div>`).join('')}</div>`;
  if (talkTab === 'en') return `<div class="phr">${ENG.map(p => `<div class="ph1"><div><div class="o">${esc(p[0])}</div><div class="tr">${esc(p[1])}</div><div class="say">${esc(p[2])}</div></div><button onclick="say(${q(p[0])},'en')">${L({ es: 'Oír', en: 'Hear' })}</button></div>`).join('')}</div><p class="small muted mt">${L({ es: 'La pronunciación es aproximada; la sílaba en mayúscula es la fuerte.', en: 'Pronunciation is approximate; the capitalised syllable is stressed.' })}</p>`;
  return DIALOGS.map(d => `<div class="card mt reveal in"><h3>${L(d.t)}</h3>${d.l.map(x => `<div class="dlg ${x[0]}">${esc(x[1])}${LANG === 'en' ? `<em>${esc(x[2])}</em>` : ''}</div>`).join('')}</div>`).join('');
}
function setTalk(k) { talkTab = k; const b = $('#talk-body'); if (b) b.innerHTML = talkBody(); $$('#talk-tabs button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); }
function say(text, lang) {
  if (!('speechSynthesis' in window)) { toast(L({ es: 'Tu celular no tiene voz disponible', en: 'No voice available on this device' })); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'en' ? 'en-US' : 'es-CO'; u.rate = .9;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}

V.money = () => `
  ${head('money', L({ es: 'Peso colombiano y cambio', en: 'Colombian peso & exchange' }), L({ es: 'En Colombia se paga en pesos (COP). Precios con punto de miles: $3.900 son tres mil novecientos pesos.', en: 'Colombia pays in pesos (COP). Prices use a dot for thousands: $3.900 means three thousand nine hundred pesos.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: '1 dólar (USD)', en: '1 US dollar' })}</div><div class="big" id="fx-usd2"><span class="spin"></span></div><div class="sub" id="fx-sub2"></div></div>
    <div class="lc sea"><div class="lab">${L({ es: '1 euro (EUR)', en: '1 euro' })}</div><div class="big" id="fx-eur"><span class="spin"></span></div><div class="sub">${L({ es: 'Tasa del día', en: 'Today\'s rate' })}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: '100 bolívares (VES)', en: '100 bolívars (VES)' })}</div><div class="big" id="fx-ves"><span class="spin"></span></div><div class="sub muted">${L({ es: 'Tasa de referencia', en: 'Reference rate' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Convertidor', en: 'Converter' })}</h3>
    <div class="grid g2"><div><label class="f">${L({ es: 'Cantidad', en: 'Amount' })}</label><input id="fx-amt" type="number" value="100000" min="0" oninput="convert()"></div>
    <div><label class="f">${L({ es: 'Moneda', en: 'Currency' })}</label><select id="fx-from" onchange="convert()"><option value="COP">${L({ es: 'Peso colombiano (COP)', en: 'Colombian peso (COP)' })}</option><option value="USD">${L({ es: 'Dólar (USD)', en: 'US dollar (USD)' })}</option><option value="EUR">Euro (EUR)</option><option value="VES">${L({ es: 'Bolívar (VES)', en: 'Bolívar (VES)' })}</option></select></div></div>
    <div id="fx-out" class="mt"></div>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Consejos', en: 'Tips' })}</h3><ul class="small">
    <li>${L({ es: 'Cambia dinero solo en casas de cambio autorizadas o bancos, nunca con cambistas en la calle.', en: 'Change money only at authorised exchange houses or banks, never with street changers.' })}</li>
    <li>${L({ es: 'Revisa los billetes de $50.000 y $100.000: hay falsos. Mira la marca de agua y el hilo de seguridad.', en: 'Check COP 50,000 and 100,000 notes: fakes circulate. Look at the watermark and security thread.' })}</li>
    <li>${L({ es: 'Nequi y Daviplata abren cuenta con PPT desde el celular y sirven para cobrar, pagar y enviar plata.', en: 'Nequi and Daviplata open accounts with a PPT from your phone, to get paid, pay and send money.' })}</li>
    <li>${L({ es: 'Para enviar plata a tu país compara comisiones y tasa entre agencias de giros y apps antes de mandar.', en: 'To send money home, compare fees and rates between remittance agencies and apps first.' })}</li>
    <li>${L({ es: 'En playas y en el centro muchos venden en dólares a turistas, pero tú paga en pesos: casi siempre sale más barato.', en: 'At beaches and in the centre many sell to tourists in dollars, but you pay in pesos: it\'s almost always cheaper.' })}</li>
  </ul></div>`;

let lifeTab = 'housing';
V.life = () => `
  ${head('life', L({ es: 'Vivir en Cartagena', en: 'Living in Cartagena' }), L({ es: 'Lo que nadie te cuenta al llegar.', en: 'What nobody tells you when you arrive.' }))}
  <div class="tabsx" id="life-tabs">${Object.keys(LIFE).map(k => `<button data-k="${k}" onclick="setLife('${k}')">${L(LIFE[k].t)}</button>`).join('')}</div>
  <div id="life-body" class="mt"></div>`;
function lifeBody() {
  const x = LIFE[lifeTab];
  return `<div class="hero" style="min-height:190px" ${photo(x.ph)}><div class="in"><h1 style="font-size:2rem">${L(x.t)}</h1></div></div>
  <div class="status-list">${x.items.map((it, i) => `<div class="sl"><div>${num(L(it), i)}</div></div>`).join('')}</div>`;
}
function setLife(k) { lifeTab = k; const b = $('#life-body'); if (b) { b.innerHTML = lifeBody(); paintPhotos(b); } $$('#life-tabs button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); }

V.weather = () => `
  ${head('weather', L({ es: 'Clima y festivos', en: 'Weather & holidays' }), L({ es: 'Calor todo el año. Llueve más entre septiembre y noviembre; de diciembre a abril es seco y con brisa.', en: 'Hot all year. Rain peaks September to November; December to April is dry and breezy.' }))}
  <div class="card dark"><div class="small" style="opacity:.75">${L({ es: 'Pronóstico en Cartagena', en: 'Cartagena forecast' })}</div><div class="big" id="wx-now2" style="font-family:'Barlow Condensed';font-size:2.4rem;font-weight:800"><span class="spin"></span></div><div class="days" id="wx-days"></div></div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Qué empacar', en: 'What to pack' })}</h3><ul class="small">
    <li>${L({ es: 'Ropa fresca de algodón o lino; temperaturas de unos 25 a 32 °C y mucha humedad.', en: 'Light cotton or linen clothes; temperatures around 25 to 32 °C and high humidity.' })}</li>
    <li>${L({ es: 'Bloqueador alto, gafas de sol, gorra, repelente y botella de agua.', en: 'High-SPF sunscreen, sunglasses, a cap, repellent and a water bottle.' })}</li>
    <li>${L({ es: 'Sombrilla o capa para los aguaceros de la tarde en temporada de lluvias: algunas calles se inundan rápido.', en: 'An umbrella or poncho for afternoon downpours in rainy season: some streets flood fast.' })}</li>
    <li>${L({ es: 'Una muda formal para entrevistas y citas en Migración.', en: 'One smart outfit for interviews and Migración appointments.' })}</li>
    <li>${L({ es: 'Documentos apostillados (nacimiento, antecedentes, títulos) si vas a hacer trámites.', en: 'Apostilled documents (birth, police record, diplomas) if you\'ll do paperwork.' })}</li>
  </ul></div>
  <div class="sec-head"><div><h2>${L({ es: 'Festivos', en: 'Public holidays' })}</h2><p id="next-hol"></p></div></div>
  <div class="status-list" id="hol-list"></div>
  <p class="small muted mt">${L({ es: 'En Colombia muchos festivos se pasan al lunes (Ley Emiliani). El 16 de noviembre de 2026 es la Independencia de Cartagena.', en: 'In Colombia many holidays move to Monday (Emiliani Law). 16 November 2026 is Cartagena Independence Day.' })}</p>`;

V.first = () => `
  ${head('first', L({ es: 'Primeros días', en: 'First days' }), L({ es: 'Marca cada paso. Tu avance se guarda en el celular.', en: 'Tick each step. Your progress is saved on your phone.' }))}
  <div class="progress"><i id="chk-bar"></i></div><p class="small muted mt" id="chk-txt"></p>
  <div class="status-list mt">${FIRST.map((f, i) => { const x = L(f); return `<label class="chk" id="chk-${i}"><input type="checkbox" onchange="tick(${i},this.checked)"><div><b>${esc(x[0])}</b><div class="small muted">${esc(x[1])}</div></div></label>`; }).join('')}</div>`;

V.map = () => `
  ${head('map', L({ es: 'Mapa de Cartagena', en: 'Map of Cartagena' }), L({ es: 'Toca un punto para ver detalles y la ruta.', en: 'Tap a point for details and directions.' }))}
  <div class="chips" id="map-chips">
    ${[['all', { es: 'Todo', en: 'All' }], ['city', { es: 'Ciudad', en: 'City' }], ['beach', { es: 'Playas e islas', en: 'Beaches & islands' }], ['nature', { es: 'Paseos', en: 'Day trips' }], ['help', { es: 'Salud y trámites', en: 'Health & offices' }]].map((c, i) => `<button data-c="${c[0]}" class="${i ? '' : 'on'}" onclick="mapFilter('${c[0]}')">${L(c[1])}</button>`).join('')}
  </div>
  <div id="map"></div>
  <div class="btns"><button class="btn red sm" onclick="locateMe()">${L({ es: 'Dónde estoy', en: 'Where am I' })}</button><a class="btn sm ghost" href="${gmaps('Cartagena de Indias, Colombia')}" target="_blank" rel="noopener">${L({ es: 'Abrir en Google Maps', en: 'Open in Google Maps' })}</a></div>`;

V.media = () => `
  ${head('media', L({ es: 'Fotos y videos', en: 'Photos & videos' }), L({ es: 'Fotos reales de Wikimedia Commons. Toca una para ver ese lugar en el mapa.', en: 'Real photos from Wikimedia Commons. Tap one to see that place on the map.' }))}
  <div class="gal">${PLACES.map(p => `<figure ${photo(p.id)} onclick="showOnMap('${p.id}')"><figcaption>${L(p.n)}</figcaption></figure>`).join('')}
    <figure ${photo('palenquera')}><figcaption>${L({ es: 'Palenqueras', en: 'Palenquera women' })}</figcaption></figure>
    <figure ${photo('champeta')}><figcaption>Champeta</figcaption></figure>
    <figure ${photo('balcon')}><figcaption>${L({ es: 'Balcones coloniales', en: 'Colonial balconies' })}</figcaption></figure></div>
  <div class="sec-head"><div><h2>${L({ es: 'Videos', en: 'Videos' })}</h2><p>${L({ es: 'Abren YouTube con los videos más recientes de cada tema.', en: 'Open YouTube with the latest videos on each topic.' })}</p></div></div>
  <div class="vids">${VIDEOS.map(v => `<a class="vid" ${photo(v[2])} href="https://www.youtube.com/results?search_query=${encodeURIComponent(v[1])}" target="_blank" rel="noopener"><span class="playc"></span><div><b>${L(v[0])}</b><small>YouTube</small></div></a>`).join('')}</div>`;

/* ---------- Render y navegación ---------- */
const VIEWS = ['home', 'papers', 'work', 'fiestas', 'malecon', 'getsemani', 'islas', 'places', 'move', 'health', 'sos', 'talk', 'money', 'life', 'weather', 'first', 'map', 'media'];
let current = 'home';
function render() {
  document.documentElement.lang = LANG;
  $$('[data-t]').forEach(el => { const k = el.dataset.t; if (T[k]) el.textContent = L(T[k]); });
  $('#lang-es').classList.toggle('on', LANG === 'es'); $('#lang-en').classList.toggle('on', LANG === 'en');
  $('#main').innerHTML = VIEWS.map(v => `<section class="view ${v === current ? 'on' : ''}" id="v-${v}">${V[v]()}</section>`).join('');
  $('#upd').textContent = VERIFIED + ' · ' + L({ es: 'hora Colombia', en: 'Colombia time' });
  setTalk(talkTab); setLife(lifeTab); renderAlert(); renderHolidays(); renderFiestas(); restoreChecks(); calcWage(); renderCities();
  if (WX) paintWeather(); paintFX();
  tickClock(); buildTicker(); observeReveal(); paintPhotos();
  map = null; if (current === 'map') setTimeout(initMap, 50);
}
function go(v) {
  if (!VIEWS.includes(v)) v = 'home';
  current = v;
  $$('section.view').forEach(s => s.classList.toggle('on', s.id === 'v-' + v));
  $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  if (location.hash.slice(1) !== v) history.replaceState(null, '', v === 'home' ? location.pathname : '#' + v);
  window.scrollTo(0, 0);
  if (v === 'map') setTimeout(initMap, 60);
  observeReveal();
}
function setLang(l) { LANG = l; store.set('lang', l); render(); }
function observeReveal() {
  const els = $$('.view.on .reveal:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08 });
  els.forEach(e => io.observe(e));
}

/* ---------- Hero en movimiento ---------- */
const HERO = ['reloj', 'malecon', 'getsemani', 'rosario', 'sanfelipe', 'murallas', 'bocagrande', 'playablanca'];
let heroI = 0, heroTimer = null;
function heroSetup() {
  const h = $('#hero'); if (!h) return;
  const ready = HERO.filter(k => PHOTO_CACHE[k]);
  if (!ready.length || h.dataset.n == ready.length) return;
  h.dataset.n = ready.length;
  $$('.slide', h).forEach(s => s.remove());
  ready.forEach((k, i) => { const s = document.createElement('div'); s.className = 'slide' + (i === 0 ? ' on' : ''); s.style.backgroundImage = `url("${PHOTO_CACHE[k]}")`; s.dataset.k = k; h.prepend(s); });
  $('#hero-dots').innerHTML = ready.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
  heroI = 0; heroCaption(ready[0]);
  clearInterval(heroTimer);
  if (ready.length > 1) heroTimer = setInterval(() => {
    const ss = $$('#hero .slide'); if (!ss.length) return;
    const order = ss.slice().reverse();
    order[heroI].classList.remove('on'); heroI = (heroI + 1) % order.length; order[heroI].classList.add('on');
    $$('#hero-dots i').forEach((d, i) => d.classList.toggle('on', i === heroI));
    heroCaption(order[heroI].dataset.k);
  }, 6000);
}
function heroCaption(k) { const p = PLACES.find(x => x.id === k); const c = $('#hero-cap'); if (c) c.textContent = (p ? L(p.n) + ' · ' : '') + L({ es: 'Foto: Wikimedia Commons', en: 'Photo: Wikimedia Commons' }); }

/* ---------- Plazos: cuenta regresiva ---------- */
function renderAlert() {
  const d0 = activeDeadline();
  const html = d0 ? (() => {
    const left = d0.end - Date.now();
    const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60;
    return `<div class="alert" onclick="go('papers')"><div><span class="kicker" style="background:#fff;color:var(--red)">${esc(d0.k)}</span><b>${L(d0.t)}</b><div class="small" style="opacity:.92;margin-top:4px">${L(d0.s)}</div></div>
      <div class="count"><div><strong>${d}</strong><small>${L({ es: 'días', en: 'days' })}</small></div><div><strong>${h}</strong><small>${L({ es: 'horas', en: 'hours' })}</small></div><div><strong>${m}</strong><small>min</small></div></div></div>`;
  })() : `<div class="alert closed" onclick="go('papers')"><div><span class="kicker">${L({ es: 'Papeles', en: 'Papers' })}</span><b>${L({ es: 'Revisa las vías vigentes de regularización', en: 'Check the current regularization routes' })}</b><div class="small" style="opacity:.9;margin-top:4px">${L({ es: 'Los plazos de 2026 ya vencieron. Consulta novedades en migracioncolombia.gov.co.', en: 'The 2026 deadlines have passed. Check for news at migracioncolombia.gov.co.' })}</div></div></div>`;
  ['#alert', '#alert2'].forEach(s => { const e = $(s); if (e) e.innerHTML = html; });
}

/* ---------- Relojes y franja "Hoy" ---------- */
function tzf(zone, o) { return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { timeZone: zone, ...o }).format(new Date()); }
function tickClock() {
  const co = $('#clk-co'); if (co) co.textContent = tzf(ZONE, { hour: '2-digit', minute: '2-digit', hour12: false });
  const ve = $('#clk-ve'); if (ve) ve.textContent = L({ es: 'Caracas: ', en: 'Caracas: ' }) + tzf(ZONE_VE, { hour: '2-digit', minute: '2-digit', hour12: false }) + L({ es: ' · Venezuela va 1 hora adelante', en: ' · Venezuela is 1 hour ahead' });
}
const todayISO = () => new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(new Date());
function nextHoliday() { const iso = todayISO(); return HOLIDAYS.find(h => h[0] >= iso) || null; }
function dateLabel(iso) { const [y, m, d] = iso.split('-').map(Number); return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d)); }
function daysTo(iso) { const now = new Date(todayISO() + 'T00:00:00Z'); return Math.round((new Date(iso + 'T00:00:00Z') - now) / 864e5); }
function buildTicker() {
  const parts = [];
  parts.push(`<span><i class="dot"></i>${L({ es: 'Hoy en Cartagena', en: 'Today in Cartagena' })}: <b>${tzf(ZONE, { weekday: 'long', day: 'numeric', month: 'long' })}</b></span>`);
  const d0 = activeDeadline();
  if (d0) parts.push(`<span>${esc(d0.k)}: <b>${L({ es: 'quedan ' + Math.ceil((d0.end - Date.now()) / 864e5) + ' días ', en: Math.ceil((d0.end - Date.now()) / 864e5) + ' days left ' })}${L(d0.tk)}</b></span>`);
  if (WX) parts.push(`<span>${L({ es: 'Clima', en: 'Weather' })}: <b>${Math.round(WX.current.temperature_2m)} °C</b>, ${L({ es: 'sensación', en: 'feels' })} ${Math.round(WX.current.apparent_temperature)} °C</span>`);
  if (FX && FX.COP) parts.push(`<span>1 USD = <b>${cop(FX.COP)}</b></span>`);
  const nf = nextFiesta(); if (nf) parts.push(`<span>${L({ es: 'Fiestas', en: 'Festivities' })}: <b>${L(nf[1])}</b> (${daysTo(nf[0]) === 0 ? L({ es: 'hoy', en: 'today' }) : L({ es: 'en ' + daysTo(nf[0]) + ' días', en: 'in ' + daysTo(nf[0]) + ' days' })})</span>`);
  const nh = nextHoliday(); if (nh) parts.push(`<span>${L({ es: 'Próximo festivo', en: 'Next holiday' })}: <b>${L(nh[1])}</b> (${daysTo(nh[0]) === 0 ? L({ es: 'hoy', en: 'today' }) : L({ es: 'en ' + daysTo(nh[0]) + ' días', en: 'in ' + daysTo(nh[0]) + ' days' })})</span>`);
  parts.push(`<span>${L({ es: 'Nuevo', en: 'New' })}: <b>Gran Malecón del Mar</b> ${L({ es: 'abierto, 2 km gratis frente al mar', en: 'open, 2 free km by the sea' })}</span>`);
  parts.push(`<span>${L({ es: 'Emergencias', en: 'Emergencies' })}: <b>123</b></span>`);
  parts.push(`<span>Transcaribe: <b>${cop(TRANSCARIBE)}</b></span>`);
  parts.push(`<span>${L({ es: 'Salario mínimo 2026', en: '2026 minimum wage' })}: <b>${cop(WAGE.month)}</b></span>`);
  const t = $('#ticker'); if (t) t.innerHTML = parts.join('');
}

/* ---------- Clima en vivo (Open-Meteo) ---------- */
let WX = store.get('wx', null);
const WCODE = c => c === 0 ? { es: 'Despejado', en: 'Clear' } : c <= 3 ? { es: 'Parcialmente nublado', en: 'Partly cloudy' } : c <= 48 ? { es: 'Neblina', en: 'Fog' } : c <= 67 ? { es: 'Lluvia', en: 'Rain' } : c <= 82 ? { es: 'Chubascos', en: 'Showers' } : { es: 'Tormenta', en: 'Thunderstorm' };
async function loadWeather() {
  try {
    WX = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=10.3910&longitude=-75.4794&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FBogota&forecast_days=5');
    store.set('wx', WX); paintWeather(); buildTicker();
  } catch (e) { if (!WX) $$('#wx-now,#wx-now2').forEach(x => x.textContent = '--'); }
}
function paintWeather() {
  if (!WX || !WX.current) return;
  const c = WX.current, txt = Math.round(c.temperature_2m) + ' °C';
  const a = $('#wx-now'); if (a) a.textContent = txt;
  const s = $('#wx-sub'); if (s) s.textContent = L(WCODE(c.weather_code)) + ' · ' + L({ es: 'sensación ', en: 'feels ' }) + Math.round(c.apparent_temperature) + ' °C';
  const b = $('#wx-now2'); if (b) b.textContent = txt + ' · ' + L(WCODE(c.weather_code));
  const d = $('#wx-days'); if (d && WX.daily) d.innerHTML = WX.daily.time.map((t, i) => `<div>${new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { weekday: 'short', timeZone: 'UTC' }).format(new Date(t + 'T12:00:00Z'))}<b>${Math.round(WX.daily.temperature_2m_max[i])}°</b>${Math.round(WX.daily.temperature_2m_min[i])}° · ${WX.daily.precipitation_probability_max[i] ?? 0}%</div>`).join('');
}

/* ---------- Cambio en vivo ---------- */
let FX = store.get('fx', null);
async function loadFX() {
  try {
    const j = await getJSON('https://open.er-api.com/v6/latest/USD');
    if (j && j.rates && j.rates.COP) { FX = { COP: j.rates.COP, EUR: j.rates.EUR, VES: j.rates.VES, t: j.time_last_update_utc }; store.set('fx', FX); }
  } catch (e) {}
  paintFX(); buildTicker();
}
function paintFX() {
  const ok = FX && FX.COP;
  ['#fx-usd', '#fx-usd2'].forEach(s => { const e = $(s); if (e) e.textContent = ok ? cop(FX.COP) : '--'; });
  const sub = ok ? L({ es: 'pesos colombianos · tasa del día', en: 'Colombian pesos · today\'s rate' }) : L({ es: 'Sin conexión: conecta para ver la tasa', en: 'Offline: connect to see the rate' });
  ['#fx-sub', '#fx-sub2'].forEach(s => { const e = $(s); if (e) e.textContent = sub; });
  const eu = $('#fx-eur'); if (eu) eu.textContent = ok && FX.EUR ? cop(FX.COP / FX.EUR) : '--';
  const vs = $('#fx-ves'); if (vs) vs.textContent = ok && FX.VES ? cop(100 * FX.COP / FX.VES) : '--';
  const wu = $('#wage-usd'); if (wu && ok) wu.textContent = L({ es: 'Salario ÷ 210 h · mínimo ≈ US$', en: 'Wage ÷ 210 h · minimum ≈ US$' }) + fmt(WAGE.month / FX.COP, 0);
  convert(); calcWage();
}
function convert() {
  const o = $('#fx-out'); if (!o) return;
  const amt = parseFloat($('#fx-amt').value) || 0, from = $('#fx-from').value;
  const perUSD = { USD: 1, COP: FX && FX.COP, EUR: FX && FX.EUR, VES: FX && FX.VES };
  if (!perUSD[from] || !(FX && FX.COP)) { o.innerHTML = `<div class="note">${L({ es: 'Necesitas conexión una vez para traer la tasa del día. Después funciona sin internet.', en: 'You need a connection once to get today\'s rate. Then it works offline.' })}</div>`; return; }
  const usd = amt / perUSD[from];
  const rows = ['COP', 'USD', 'EUR', 'VES'].filter(c => c !== from && perUSD[c]).map(c => `<div class="sl"><div><b>${c}</b></div><div style="font-family:'Barlow Condensed';font-size:1.5rem;font-weight:800">${fmt(usd * perUSD[c], c === 'COP' ? 0 : 2)}</div></div>`).join('');
  o.innerHTML = `<div class="status-list">${rows}</div>`;
}

/* ---------- Salario ---------- */
function calcWage() {
  const o = $('#w-out'); if (!o) return;
  const h = Math.max(0, Math.min(WAGE.weekH, parseFloat($('#w-h').value) || 0));
  const n = Math.max(0, Math.min(h, parseFloat($('#w-n').value) || 0));
  const d = Math.max(0, Math.min(10, parseFloat($('#w-d').value) || 0));
  const base = WAGE.month * h / WAGE.weekH;                       // proporcional a 42 h
  const night = n * 5 * WAGE.hour * WAGE.night;                    // ~5 semanas de 210 h al mes
  const sunday = d * (h / 6) * WAGE.hour * WAGE.sunday;            // horas de un día de trabajo
  const devengado = base + night + sunday;
  const aux = devengado <= 2 * WAGE.month ? WAGE.aux * Math.min(1, h / WAGE.weekH) : 0;
  const desc = devengado * 0.08;
  const neto = devengado + aux - desc;
  const row = (t, v, s = '') => `<div class="sl"><div><b>${t}</b>${s ? `<small>${s}</small>` : ''}</div><div style="font-family:'Barlow Condensed';font-size:1.4rem;font-weight:800">${cop(v)}</div></div>`;
  const usd = FX && FX.COP ? ' · ≈ US$' + fmt(neto / FX.COP, 0) : '';
  o.innerHTML = `<div class="status-list">${row(L({ es: 'Salario base', en: 'Base pay' }), base, L({ es: h + ' h por semana', en: h + ' h a week' }))}
    ${night ? row(L({ es: 'Recargo nocturno', en: 'Night surcharge' }), night) : ''}${sunday ? row(L({ es: 'Recargo dominical/festivo', en: 'Sunday/holiday surcharge' }), sunday) : ''}
    ${row(L({ es: 'Auxilio de transporte', en: 'Transport allowance' }), aux)}
    ${row(L({ es: 'Descuentos salud y pensión (8%)', en: 'Health & pension deductions (8%)' }), -desc)}
    ${row(L({ es: 'Te llega al mes (aprox.)', en: 'Take-home per month (approx.)' }), neto, L({ es: 'Cálculo de referencia', en: 'Reference estimate' }) + usd)}</div>`;
}

/* ---------- Festivos ---------- */
function renderHolidays() {
  const box = $('#hol-list'); if (!box) return;
  const iso = todayISO();
  const up = HOLIDAYS.filter(h => h[0] >= iso).slice(0, 10);
  box.innerHTML = up.map(h => `<div class="sl"><div><b>${L(h[1])}</b><small style="text-transform:capitalize">${dateLabel(h[0])}</small></div><span class="pill">${daysTo(h[0]) === 0 ? L({ es: 'Hoy', en: 'Today' }) : L({ es: 'En ' + daysTo(h[0]) + ' d', en: 'In ' + daysTo(h[0]) + ' d' })}</span></div>`).join('');
  const nh = nextHoliday(), n = $('#next-hol');
  if (n && nh) n.textContent = L({ es: 'Próximo: ', en: 'Next: ' }) + L(nh[1]);
}

/* ---------- Checklist ---------- */
function tick(i, v) { const s = store.get('chk', {}); s[i] = v; store.set('chk', s); restoreChecks(); }
function restoreChecks() {
  const s = store.get('chk', {}); let n = 0;
  FIRST.forEach((_, i) => { const el = $('#chk-' + i); if (!el) return; const on = !!s[i]; el.classList.toggle('done', on); $('input', el).checked = on; if (on) n++; });
  const bar = $('#chk-bar'); if (bar) bar.style.width = (n / FIRST.length * 100) + '%';
  const t = $('#chk-txt'); if (t) t.textContent = L({ es: `${n} de ${FIRST.length} listos`, en: `${n} of ${FIRST.length} done` });
}

/* ---------- Dirección ---------- */
function saveAddr() { const v = $('#my-addr').value.trim(); store.set('addr', v); toast(v ? L({ es: 'Dirección guardada', en: 'Address saved' }) : L({ es: 'Dirección borrada', en: 'Address cleared' })); }
function routeHome() { const a = store.get('addr', ''); if (!a) { toast(L({ es: 'Primero guarda tu dirección', en: 'Save your address first' })); go('home'); return; } open('https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=' + encodeURIComponent(a + ', Cartagena, Colombia'), '_blank', 'noopener'); }
function openShow() {
  const a = store.get('addr', '');
  if (!a) { toast(L({ es: 'Primero guarda tu dirección en Inicio', en: 'Save your address on Home first' })); go('home'); return; }
  $('#show-big').innerHTML = 'Buenas, disculpe. Soy nuevo en Cartagena y me perdí.<br>¿Me ayuda a llegar a esta dirección, por favor?<br><span class="small muted" style="font-family:Barlow">Hi, sorry. I\'m new in Cartagena and I\'m lost. Could you help me get to this address?</span>';
  $('#show-addr').textContent = a; $('#showcard').classList.add('on');
}
function planTrip() { const d = $('#j-to').value.trim(); if (!d) return; open('https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=' + encodeURIComponent(d + ', Cartagena, Colombia'), '_blank', 'noopener'); }

/* ---------- Mapa (Leaflet) ---------- */
let map = null, layers = {};
const CAT_COLOR = { city: '#EB0A1E', beach: '#2D7FF9', nature: '#2FB59A', help: '#0B0B0C' };
function initMap() {
  const el = $('#map'); if (!el || map || typeof window.L === 'undefined') return;
  const LF = window.L;
  map = LF.map(el, { zoomControl: true }).setView([10.41, -75.53], 12);
  LF.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap, © CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
  layers = {};
  [...PLACES, ...MAP_EXTRA].forEach(p => {
    const icon = LF.divIcon({ className: '', html: `<div class="mk" style="background:${CAT_COLOR[p.cat]}"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] });
    const img = PHOTO_CACHE[p.id] ? `<div style="width:220px;height:110px;border-radius:8px;background:url('${PHOTO_CACHE[p.id]}') center/cover;margin-bottom:6px"></div>` : '';
    const m = LF.marker([p.lat, p.lon], { icon }).bindPopup(`${img}<b>${esc(L(p.n))}</b><br><span>${esc(L(p.d))}</span><br><a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank" rel="noopener">${L({ es: 'Cómo llegar', en: 'Directions' })}</a>`, { maxWidth: 240 });
    m._cat = p.cat; m.addTo(map); layers[p.id] = m;
  });
  setTimeout(() => map.invalidateSize(), 200);
  if (pendingPlace) { const id = pendingPlace; pendingPlace = null; setTimeout(() => focusPlace(id), 250); }
}
function mapFilter(c) {
  $$('#map-chips button').forEach(b => b.classList.toggle('on', b.dataset.c === c));
  if (!map) return;
  Object.values(layers).forEach(m => { const show = c === 'all' || m._cat === c; if (show && !map.hasLayer(m)) m.addTo(map); if (!show && map.hasLayer(m)) map.removeLayer(m); });
}
let pendingPlace = null;
function showOnMap(id) { pendingPlace = id; go('map'); if (map) { pendingPlace = null; setTimeout(() => focusPlace(id), 120); } }
function focusPlace(id) { const m = layers[id]; if (!m) return; mapFilter('all'); map.setView(m.getLatLng(), ['rosario', 'palenque', 'totumo', 'playablanca'].includes(id) ? 11 : 15); m.openPopup(); }
function locateMe() {
  if (!navigator.geolocation) { toast(L({ es: 'Tu celular no permite ubicación', en: 'Location not available' })); return; }
  navigator.geolocation.getCurrentPosition(p => {
    if (!map) return; const ll = [p.coords.latitude, p.coords.longitude];
    window.L.circleMarker(ll, { radius: 9, color: '#fff', weight: 3, fillColor: '#2D7FF9', fillOpacity: 1 }).addTo(map).bindPopup(L({ es: 'Estás aquí', en: 'You are here' })).openPopup();
    map.setView(ll, 14);
  }, () => toast(L({ es: 'No pude obtener tu ubicación', en: 'Could not get your location' })), { enableHighAccuracy: true, timeout: 10000 });
}

/* ---------- Otras ciudades de la serie ---------- */
const HUB = 'https://haroldco45.github.io/latinos-por-el-mundo/ciudades.json';
const CITY_FALLBACK = [
  { id: 'londres', es: 'Londres', en: 'London', pais: { es: 'Reino Unido', en: 'United Kingdom' }, url: 'https://haroldco45.github.io/londres-para-latinos/' },
  { id: 'madrid', es: 'Madrid', en: 'Madrid', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/madrid-para-latinos/' },
  { id: 'bilbao', es: 'Bilbao', en: 'Bilbao', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/bilbao-para-latinos/' },
  { id: 'medellin', es: 'Medellín', en: 'Medellín', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/medellin-para-latinos/' },
  { id: 'miami', es: 'Miami', en: 'Miami', pais: { es: 'Estados Unidos', en: 'United States' }, url: 'https://haroldco45.github.io/miami-para-latinos/' },
  { id: 'nueva-york', es: 'Nueva York', en: 'New York', pais: { es: 'Estados Unidos', en: 'United States' }, url: 'https://haroldco45.github.io/nueva-york-para-latinos/' },
  { id: 'toledo', es: 'Toledo', en: 'Toledo', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/toledo-para-latinos/' },
  { id: 'leamington', es: 'Leamington', en: 'Leamington', pais: { es: 'Canadá', en: 'Canada' }, url: 'https://haroldco45.github.io/leamington-para-latinos/' },
  { id: 'hamamatsu', es: 'Hamamatsu', en: 'Hamamatsu', pais: { es: 'Japón', en: 'Japan' }, url: 'https://haroldco45.github.io/hamamatsu-para-latinos/' },
  { id: 'oizumi', es: 'Oizumi', en: 'Oizumi', pais: { es: 'Japón', en: 'Japan' }, url: 'https://haroldco45.github.io/oizumi-para-latinos/' },
  { id: 'getxo', es: 'Getxo', en: 'Getxo', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/getxo-para-latinos/' },
  { id: 'willemstad', es: 'Willemstad', en: 'Willemstad', pais: { es: 'Curazao', en: 'Curaçao' }, url: 'https://haroldco45.github.io/willemstad-para-latinos/' }
];
const CITY_WIKI = { londres: 'London', madrid: 'Madrid', bilbao: 'Bilbao', medellin: 'Medellín', miami: 'Miami', 'nueva-york': 'New York City', toledo: 'Toledo, Spain', leamington: 'Leamington, Ontario', hamamatsu: 'Hamamatsu', oizumi: 'Ōizumi, Gunma', getxo: 'Getxo', willemstad: 'Willemstad', cartagena: 'Cartagena, Colombia' };
let CITIES = store.get('cities', CITY_FALLBACK);
const CITY_PH = store.get('cityph', {});
function renderCities() {
  const box = $('#cx'); if (!box) return;
  box.innerHTML = CITIES.filter(c => c.id !== 'cartagena').map(c => {
    const name = c[LANG] || c.es, pais = (c.pais && (c.pais[LANG] || c.pais.es)) || '';
    const bg = CITY_PH[c.id] ? `background-image:url('${CITY_PH[c.id]}');` : '';
    if (c.pronto) return `<div class="cxc soon" style="--fb:${fbColor(c.id)};${bg}"><b>${esc(name)}</b><small>${esc(pais)} · ${L({ es: 'Muy pronto', en: 'Coming soon' })}</small></div>`;
    return `<a class="cxc" style="--fb:${fbColor(c.id)};${bg}" href="${esc(c.url)}"><b>${esc(name)}</b><small>${esc(pais)}</small></a>`;
  }).join('');
}
async function loadCities() {
  try {
    const j = await getJSON(HUB + '?v=' + Date.now());
    if (j && j.ciudades && j.ciudades.length) {
      // Une la lista del hub con las ciudades conocidas que aún no estén publicadas allí
      const ids = new Set(j.ciudades.map(c => c.id));
      CITIES = j.ciudades.concat(CITY_FALLBACK.filter(c => !ids.has(c.id))); store.set('cities', CITIES);
    }
  } catch (e) {}
  renderCities();
  const need = CITIES.filter(c => !CITY_PH[c.id]);
  if (need.length) {
    const titles = need.map(c => CITY_WIKI[c.id] || c.en || c.es);
    const got = await wikiBatch(titles);
    need.forEach((c, i) => { if (got[titles[i]]) CITY_PH[c.id] = got[titles[i]]; });
    store.set('cityph', CITY_PH); renderCities();
  }
}

/* ---------- PWA ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; setTimeout(() => $('#install').classList.add('on'), 4000); });
$('#install-btn').addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $('#install').classList.remove('on'); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

/* ---------- Arranque ---------- */
window.addEventListener('hashchange', () => go(location.hash.slice(1) || 'home'));
current = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
render();
$$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === current));
setTimeout(() => $('#splash').classList.add('off'), 900);
loadWeather(); loadFX(); loadCities();
loadPhotos().then(() => { paintPhotos(); if (map) { map.remove(); map = null; if (current === 'map') initMap(); } });
setInterval(() => { tickClock(); renderAlert(); }, 30000);
setInterval(() => { buildTicker(); renderFiestas(); }, 300000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { tickClock(); renderAlert(); buildTicker(); renderFiestas(); loadWeather(); loadFX(); } });
