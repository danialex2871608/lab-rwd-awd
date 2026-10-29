/**
 * Catálogo de hardware / componentes de servidor (12 productos).
 * Los modelos son ficticios; sirven solo para la práctica.
 *
 * - specs: pares [etiqueta, valor]. La tarjeta móvil usa solo las 3 primeras;
 *   la tabla completa usa las 6.
 * - perf / eff: índices (0-100) usados por el gráfico de comparativa.
 */
const products = [
  { id: 1,  name: 'Atlas R2000',    category: 'Servidores',     price: 3200,  perf: 72, eff: 68,
    summary: 'Servidor rack 1U para virtualización ligera.',
    specs: [['CPU', '16 núcleos / 32 hilos'], ['RAM', '128 GB DDR5'], ['Almacenamiento', '2 x 1.92 TB NVMe'],
            ['Red', '2 x 10 GbE'], ['Fuente', '800 W redundante'], ['Formato', 'Rack 1U']] },
  { id: 2,  name: 'Atlas R4000',    category: 'Servidores',     price: 6800,  perf: 88, eff: 74,
    summary: 'Servidor rack 2U de doble socket para bases de datos.',
    specs: [['CPU', '2 x 32 núcleos'], ['RAM', '512 GB DDR5'], ['Almacenamiento', '8 x 3.84 TB NVMe'],
            ['Red', '2 x 25 GbE'], ['Fuente', '1600 W redundante'], ['Formato', 'Rack 2U']] },
  { id: 3,  name: 'Titan G8',       category: 'GPU / IA',       price: 24500, perf: 98, eff: 61,
    summary: 'Nodo de cómputo con 8 aceleradores para entrenamiento de IA.',
    specs: [['GPU', '8 x 80 GB HBM'], ['CPU', '2 x 48 núcleos'], ['RAM', '1 TB DDR5'],
            ['Interconexión', 'NVLink 900 GB/s'], ['Fuente', '3 x 3000 W'], ['Formato', 'Rack 4U']] },
  { id: 4,  name: 'Titan G2',       category: 'GPU / IA',       price: 9800,  perf: 80, eff: 70,
    summary: 'Servidor con 2 GPU para inferencia y renderizado.',
    specs: [['GPU', '2 x 48 GB GDDR'], ['CPU', '24 núcleos'], ['RAM', '256 GB DDR5'],
            ['Almacenamiento', '2 x 3.84 TB NVMe'], ['Fuente', '1600 W'], ['Formato', 'Rack 2U']] },
  { id: 5,  name: 'Vault S12',      category: 'Almacenamiento', price: 4100,  perf: 55, eff: 82,
    summary: 'Arreglo de 12 bahías SAS/SATA para respaldo.',
    specs: [['Bahías', '12 x 3.5"'], ['Capacidad', 'hasta 288 TB'], ['Controladora', 'RAID 0/1/5/6/10'],
            ['Red', '2 x 10 GbE'], ['Fuente', '2 x 550 W'], ['Formato', 'Rack 2U']] },
  { id: 6,  name: 'Vault NVMe-24',  category: 'Almacenamiento', price: 11900, perf: 92, eff: 77,
    summary: 'Almacenamiento all-flash de baja latencia.',
    specs: [['Bahías', '24 x U.2 NVMe'], ['Capacidad', 'hasta 368 TB'], ['Latencia', '< 100 µs'],
            ['Red', '2 x 100 GbE'], ['Fuente', '2 x 1200 W'], ['Formato', 'Rack 2U']] },
  { id: 7,  name: 'Flux SW24',      category: 'Redes',          price: 1450,  perf: 60, eff: 85,
    summary: 'Switch gestionable de 24 puertos 10 GbE.',
    specs: [['Puertos', '24 x 10 GbE SFP+'], ['Uplink', '4 x 40 GbE'], ['Capa', 'L3'],
            ['Conmutación', '960 Gbps'], ['Fuente', '150 W'], ['Formato', 'Rack 1U']] },
  { id: 8,  name: 'Flux SW48',      category: 'Redes',          price: 3900,  perf: 78, eff: 80,
    summary: 'Switch de agregación de 48 puertos 25 GbE.',
    specs: [['Puertos', '48 x 25 GbE SFP28'], ['Uplink', '8 x 100 GbE'], ['Capa', 'L3'],
            ['Conmutación', '4 Tbps'], ['Fuente', '2 x 650 W'], ['Formato', 'Rack 1U']] },
  { id: 9,  name: 'Core C1',        category: 'Servidores',     price: 1900,  perf: 48, eff: 79,
    summary: 'Servidor torre de entrada para oficinas pequeñas.',
    specs: [['CPU', '8 núcleos'], ['RAM', '64 GB DDR4'], ['Almacenamiento', '2 x 960 GB SSD'],
            ['Red', '2 x 1 GbE'], ['Fuente', '550 W'], ['Formato', 'Torre']] },
  { id: 10, name: 'Core Blade B8',  category: 'Servidores',     price: 5600,  perf: 76, eff: 84,
    summary: 'Blade de alta densidad para chasis modular.',
    specs: [['CPU', '2 x 20 núcleos'], ['RAM', '256 GB DDR5'], ['Almacenamiento', '2 x 960 GB NVMe'],
            ['Red', '2 x 25 GbE'], ['Fuente', 'Del chasis'], ['Formato', 'Blade']] },
  { id: 11, name: 'Edge E3',        category: 'Redes',          price: 2300,  perf: 52, eff: 90,
    summary: 'Gateway de borde con firewall y SD-WAN.',
    specs: [['Puertos', '8 x 2.5 GbE'], ['Throughput FW', '20 Gbps'], ['VPN', '5 Gbps IPsec'],
            ['CPU', '8 núcleos ARM'], ['Fuente', '60 W'], ['Formato', 'Sobremesa']] },
  { id: 12, name: 'Vault Tape T2',  category: 'Almacenamiento', price: 7200,  perf: 35, eff: 88,
    summary: 'Biblioteca de cintas para archivado de largo plazo.',
    specs: [['Unidades', '2 x LTO-9'], ['Capacidad', 'hasta 540 TB'], ['Ranuras', '24'],
            ['Interfaz', 'SAS 12 Gb'], ['Fuente', '300 W'], ['Formato', 'Rack 2U']] }
];

const categories = [...new Set(products.map(p => p.category))];

module.exports = { products, categories };
