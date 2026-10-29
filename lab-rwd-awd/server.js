/**
 * Servidor de la práctica RWD vs AWD.
 *
 *   /            -> índice con enlaces
 *   /responsive  -> Versión A (RWD): MISMO HTML para todos los clientes.
 *   /adaptive    -> Versión B (AWD): el servidor detecta el dispositivo y
 *                   renderiza desktop.ejs o mobile.ejs.
 *
 * Variables de entorno opcionales:
 *   PORT=3000         puerto
 *   COMPRESSION=1     activa gzip (por defecto OFF para medir bytes "crudos").
 *                     Usa el mismo valor en TODAS las mediciones.
 */
const path = require('path');
const express = require('express');
const useragent = require('express-useragent');
const { products, categories } = require('./data/products');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

if (process.env.COMPRESSION === '1') {
  app.use(require('compression')());
  console.log('[config] Compresión gzip ACTIVADA');
} else {
  console.log('[config] Compresión gzip desactivada (COMPRESSION=1 para activarla)');
}

app.use(useragent.express());

// Chart.js se sirve localmente (sin CDN) para que las mediciones sean reproducibles.
app.use('/vendor', express.static(path.join(__dirname, 'node_modules', 'chart.js', 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Datos para el gráfico de comparativa (solo se usan donde hay gráfico).
const chartData = products.map(p => ({ name: p.name, perf: p.perf, eff: p.eff }));

/* ---------- Middleware de detección de dispositivo (AWD) ---------- */
/**
 * Decide 'mobile' o 'desktop' inspeccionando cabeceras HTTP de la petición.
 * Prioridad:
 *   1. ?device=mobile|desktop  (override útil para pruebas)
 *   2. Client Hint Sec-CH-UA-Mobile (?1 = móvil)
 *   3. User-Agent (express-useragent). Las tablets se atienden con la vista desktop.
 */
function detectDevice(req, res, next) {
  const forced = req.query.device;
  let device;
  let reason;

  if (forced === 'mobile' || forced === 'desktop') {
    device = forced;
    reason = 'query-override';
  } else if (req.get('Sec-CH-UA-Mobile')) {
    device = req.get('Sec-CH-UA-Mobile') === '?1' ? 'mobile' : 'desktop';
    reason = 'client-hint';
  } else {
    const ua = req.useragent;
    device = ua.isMobile && !ua.isTablet ? 'mobile' : 'desktop';
    reason = 'user-agent';
  }

  req.device = device;
  res.set('X-Device-Detected', `${device}; via=${reason}`);
  // Imprescindible para CDN/cachés: la respuesta varía según el dispositivo.
  res.set('Vary', 'User-Agent, Sec-CH-UA-Mobile');
  res.set('Accept-CH', 'Sec-CH-UA-Mobile');
  console.log(`[adaptive] ${device} (${reason}) - ${req.get('User-Agent') || 'sin UA'}`);
  next();
}

/* ---------- Rutas ---------- */
app.get('/', (req, res) => {
  res.send(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Práctica RWD vs AWD</title>
  <body style="font-family:system-ui;padding:2rem;line-height:1.8">
  <h1>Práctica: RWD vs AWD</h1>
  <ul>
    <li><a href="/responsive">/responsive</a> – Versión A (RWD)</li>
    <li><a href="/adaptive">/adaptive</a> – Versión B (AWD, detección automática)</li>
    <li><a href="/adaptive?device=mobile">/adaptive?device=mobile</a> – forzar vista móvil</li>
    <li><a href="/adaptive?device=desktop">/adaptive?device=desktop</a> – forzar vista desktop</li>
  </ul></body>`);
});

// Versión A: un único template para todos, sin mirar User-Agent.
app.get('/responsive', (req, res) => {
  res.render('responsive', { products, categories, chartData });
});

// Versión B: plantilla distinta según el dispositivo detectado.
app.get('/adaptive', detectDevice, (req, res) => {
  const view = req.device === 'mobile' ? 'mobile' : 'desktop';
  res.render(view, { products, categories, chartData });
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
