import fs from 'fs';
import path from 'path';
import type {
  ContactMessageRecord,
  OrderRecord,
  Product,
  ServiceRequestRecord,
} from '../types.ts';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface DatabaseState {
  catalogVersion?: number;
  users: StoredUser[];
  products: Product[];
  orders: OrderRecord[];
  contactMessages: ContactMessageRecord[];
  serviceRequests: ServiceRequestRecord[];
}

export const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'electro_tecno_user',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'electro_tecno',
};

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'electro-tecno-data')
  : path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');
const CURRENT_CATALOG_VERSION = 3;

let memoryFallbackState: DatabaseState | null = null;

const SEED_PRODUCTS: Product[] = [
  // CELULARES NUEVOS
  {
    id: 'prod-iphone-15-pro',
    slug: 'iphone-15-pro-max-256gb',
    name: 'iPhone 15 Pro Max 256 GB',
    category: 'celulares',
    condition: 'Nuevo',
    price: 1580000,
    previousPrice: 1850000,
    discountPercent: 15,
    description: 'Chasis de titanio grado aeroespacial, chip A17 Pro y sistema de cámaras Pro con teleobjetivo 5x.',
    specs: ['Pantalla Super Retina XDR 6.7" 120Hz', 'Chip A17 Pro · 256 GB NVMe', 'Cámara Triple 48 MP + LiDAR', 'USB-C 10 Gb/s · Liberado de fábrica'],
    warranty: '12 meses de garantía oficial escrita',
    stock: 6,
    imageUrl: '/src/assets/images/product_phone_pro_1794864737562.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-galaxy-s24-ultra',
    slug: 'galaxy-s24-ultra-512gb',
    name: 'Samsung Galaxy S24 Ultra 512 GB',
    category: 'celulares',
    condition: 'Nuevo',
    price: 1490000,
    description: 'Potencia absoluta con Snapdragon 8 Gen 3, S-Pen integrado y cámara principal de 200 MP.',
    specs: ['Dynamic AMOLED 2X 6.8" QHD+', 'Snapdragon 8 Gen 3 · 12 GB RAM', 'S-Pen integrado · 512 GB', 'Batería 5000 mAh carga 45W'],
    warranty: '12 meses de garantía oficial escrita',
    stock: 5,
    imageUrl: '/src/assets/images/prod_new_galaxy_s24_1794867733087.jpg',
    isFeatured: true,
    isOffer: false,
  },
  {
    id: 'prod-pixel-8-pro-nuevo',
    slug: 'google-pixel-8-pro-256gb',
    name: 'Google Pixel 8 Pro 256 GB',
    category: 'celulares',
    condition: 'Nuevo',
    price: 1120000,
    description: 'Fotografía computacional de referencia, pantalla Super Actua OLED 120Hz y chip Google Tensor G3.',
    specs: ['Super Actua LTPO OLED 6.7"', 'Tensor G3 · 12 GB RAM · 256 GB', 'Cámara Pro 50 MP + Teleobjetivo 5x', 'Liberado de fábrica · Caja sellada'],
    warranty: '12 meses de garantía oficial escrita',
    stock: 4,
    imageUrl: '/src/assets/images/product_phone_sleek_1794864738067.jpg',
    isFeatured: true,
    isOffer: false,
  },

  // CELULARES USADOS CERTIFICADOS
  {
    id: 'prod-iphone-14-pro-usado',
    slug: 'iphone-14-pro-256gb-certificado',
    name: 'iPhone 14 Pro 256 GB Space Black',
    category: 'celulares',
    condition: 'Usado',
    price: 960000,
    previousPrice: 1180000,
    discountPercent: 19,
    description: 'Equipo usado seleccionado y certificado en 42 puntos. Batería al 94% de salud y estética 10/10.',
    specs: ['Estado estético impecable · Sin marcas', 'Batería original al 94% verificada', 'Dynamic Island · 120Hz ProMotion', 'Incluye cable USB-C certificado'],
    warranty: '6 meses de garantía Electro Tecno',
    stock: 4,
    imageUrl: '/src/assets/images/prod_used_iphone14_pro_1794867733491.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-iphone-13-usado',
    slug: 'iphone-13-128gb-midnight-certificado',
    name: 'iPhone 13 128 GB Midnight',
    category: 'celulares',
    condition: 'Usado',
    price: 680000,
    previousPrice: 810000,
    discountPercent: 16,
    description: 'Reacondicionado certificado en laboratorio. Chip A15 Bionic, doble cámara 12 MP y batería al 92%.',
    specs: ['Super Retina XDR OLED 6.1"', 'Batería verificada 92% de salud', 'Face ID y cámaras 100% originales', 'Libre para todas las compañías'],
    warranty: '6 meses de garantía Electro Tecno',
    stock: 5,
    imageUrl: '/src/assets/images/prod_used_iphone13_blue_1794867733165.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-galaxy-s23-ultra-usado',
    slug: 'galaxy-s23-ultra-256gb-certificado',
    name: 'Samsung Galaxy S23 Ultra 256 GB',
    category: 'celulares',
    condition: 'Usado',
    price: 890000,
    description: 'Usado grado A+ con S-Pen original, cámara 200 MP y control completo de pantalla y placa.',
    specs: ['AMOLED 2X 6.8" 120Hz · Sin detalles', 'Snapdragon 8 Gen 2 · 256 GB', 'Batería al 95% de rendimiento', 'Incluye S-Pen y cable de carga'],
    warranty: '6 meses de garantía Electro Tecno',
    stock: 3,
    imageUrl: '/src/assets/images/prod_used_galaxy_s23_1794867733293.jpg',
    isFeatured: true,
    isOffer: false,
  },
  {
    id: 'prod-xiaomi-13-pro-usado',
    slug: 'xiaomi-13-pro-256gb-ceramic-certificado',
    name: 'Xiaomi 13 Pro 256 GB Ceramic',
    category: 'celulares',
    condition: 'Usado',
    price: 615000,
    previousPrice: 770000,
    discountPercent: 20,
    description: 'Sensor de 1 pulgada co-desarrollado con Leica, cuerpo cerámico impecable y carga HyperCharge 120W.',
    specs: ['AMOLED LTPO 6.73" WQHD+ 120Hz', 'Snapdragon 8 Gen 2 · 12 GB RAM', 'Cámara Triple 50 MP Leica', 'Batería verificada 93%'],
    warranty: '6 meses de garantía Electro Tecno',
    stock: 3,
    imageUrl: '/src/assets/images/prod_used_xiaomi_13_1794867734030.jpg',
    isFeatured: true,
    isOffer: true,
  },

  // TECLADOS
  {
    id: 'prod-teclado-nocturno-75',
    slug: 'teclado-mecanico-nocturno-75-wireless',
    name: 'Teclado Mecánico Nocturno 75% Wireless',
    category: 'teclados',
    condition: 'Nuevo',
    price: 139000,
    previousPrice: 170000,
    discountPercent: 18,
    description: 'Switches mecánicos lineales hot-swap lubricados, keycaps PBT doubleshot y triple modo de conexión.',
    specs: ['Formato compacto 75% · Switches táctiles', 'Tri-modo: 2.4 GHz, Bluetooth 5.2 y USB-C', 'Keycaps PBT doble inyección anti-desgaste', 'Batería 4000 mAh · Iluminación verde'],
    warranty: '12 meses de garantía oficial',
    stock: 11,
    imageUrl: '/src/assets/images/product_keyboard_mech_1794866506889.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-teclado-60-aviator',
    slug: 'teclado-mecanico-60-pro-aviator',
    name: 'Teclado Mecánico 60% Pro + Cable Aviator',
    category: 'teclados',
    condition: 'Nuevo',
    price: 124000,
    description: 'Diseño competitivo 60% con switches ópticos de respuesta rápida y cable mallado Aviator desmontable.',
    specs: ['Formato ultracompacto 60% Esports', 'Switches ópticos lineales 0.2ms', 'Cable coiled Aviator USB-C incluido', 'Retroiluminación LED verde regulable'],
    warranty: '12 meses de garantía oficial',
    stock: 9,
    imageUrl: '/src/assets/images/prod_keyboard_60_rgb_1794867735070.jpg',
    isFeatured: true,
    isOffer: false,
  },
  {
    id: 'prod-teclado-full-slim',
    slug: 'teclado-full-size-aluminio-low-profile',
    name: 'Teclado Full-Size Aluminio Low-Profile',
    category: 'teclados',
    condition: 'Nuevo',
    price: 115000,
    previousPrice: 135000,
    discountPercent: 15,
    description: 'Chasis completo con pad numérico en aluminio anodizado negro y perfil bajo silencioso para oficina o estudio.',
    specs: ['Teclado completo con pad numérico', 'Multi-dispositivo Bluetooth hasta 3 equipos', 'Batería recargable USB-C de 90 días', 'Compatible Windows, macOS y tablets'],
    warranty: '12 meses de garantía oficial',
    stock: 10,
    imageUrl: '/src/assets/images/prod_keyboard_full_low_1794867735785.jpg',
    isFeatured: true,
    isOffer: true,
  },

  // MOUSE
  {
    id: 'prod-mouse-pulse-wireless',
    slug: 'mouse-wireless-pulse-pro-26k',
    name: 'Mouse Wireless Pulse Pro 26K DPI',
    category: 'mouse',
    condition: 'Nuevo',
    price: 89000,
    previousPrice: 112000,
    discountPercent: 21,
    description: 'Diseño ultraligero de 54 gramos con sensor óptico de 26.000 DPI y tasa de sondeo de 1000 Hz.',
    specs: ['Peso pluma 54 g · Sensor óptico 26.000 DPI', 'Switches ópticos de 80M de clics', 'Conexión 2.4 GHz baja latencia + USB-C', 'Hasta 75 horas de autonomía por carga'],
    warranty: '12 meses de garantía directa',
    stock: 15,
    imageUrl: '/src/assets/images/product_mouse_pro_1794866506818.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-mouse-ergo-studio',
    slug: 'mouse-ergonomico-studio-mx-pro',
    name: 'Mouse Ergonómico Studio MX Pro',
    category: 'mouse',
    condition: 'Nuevo',
    price: 78000,
    description: 'Doble rueda metálica electromagnética lateral y superior para productividad extrema sobre cualquier superficie.',
    specs: ['Sensor de precisión 8000 DPI sobre vidrio', 'Rueda lateral de aluminio mecanizado', 'Multi-dispositivo Bluetooth + Dongle 2.4G', 'Clics silenciosos y carga rápida USB-C'],
    warranty: '12 meses de garantía directa',
    stock: 12,
    imageUrl: '/src/assets/images/prod_mouse_ergo_vert_1794867736408.jpg',
    isFeatured: true,
    isOffer: false,
  },
  {
    id: 'prod-mouse-dock-8k',
    slug: 'mouse-esports-wireless-docking-8k',
    name: 'Mouse Esports Wireless Docking 8K',
    category: 'mouse',
    condition: 'Nuevo',
    price: 108000,
    previousPrice: 130000,
    discountPercent: 17,
    description: 'Incluye base de carga magnética con receptor 8000 Hz integrado para latencia cero en competencia.',
    specs: ['Polling rate 8000 Hz con base incluida', 'Dock magnético de carga rápida USB-C', 'Pies de PTFE 100% puro deslizamiento suave', 'Autonomía de 90 horas continuas'],
    warranty: '12 meses de garantía oficial',
    stock: 8,
    imageUrl: '/src/assets/images/prod_mouse_mmo_dock_1794867735931.jpg',
    isFeatured: true,
    isOffer: true,
  },

  // MONITORES
  {
    id: 'prod-monitor-qhd-165hz',
    slug: 'monitor-27-qhd-ips-165hz',
    name: 'Monitor 27" QHD Fast IPS 165Hz',
    category: 'monitores',
    condition: 'Nuevo',
    price: 445000,
    previousPrice: 535000,
    discountPercent: 17,
    description: 'Panel Fast IPS sin bordes 2560×1440 con tiempo de respuesta de 1 ms, 99% sRGB y FreeSync Premium.',
    specs: ['Resolución QHD 2560×1440 · 27 pulgadas', 'Frecuencia 165Hz · Respuesta 1ms GtG', 'Base regulable en altura, giro e inclinación', '2× HDMI 2.0 + DisplayPort 1.4'],
    warranty: '12 meses de garantía oficial sin píxeles muertos',
    stock: 6,
    imageUrl: '/src/assets/images/product_monitor_gaming_1794866506750.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-monitor-ultrawide-34',
    slug: 'monitor-curvo-34-ultrawide-144hz',
    name: 'Monitor Curvo 34" UltraWide WQHD 144Hz',
    category: 'monitores',
    condition: 'Nuevo',
    price: 690000,
    description: 'Inmersión total 21:9 curvatura 1500R para multitarea profesional, edición de video y simulación.',
    specs: ['Panel curvo 34" WQHD 3440×1440', 'Tasa de refresco 144Hz · 1ms MPRT', 'USB-C con carga 65W + KVM integrado', 'HDR400 y cobertura 95% DCI-P3'],
    warranty: '12 meses de garantía oficial',
    stock: 4,
    imageUrl: '/src/assets/images/prod_monitor_ultrawide_1794867738658.jpg',
    isFeatured: true,
    isOffer: false,
  },

  // AURICULARES
  {
    id: 'prod-earbuds-anc-pro',
    slug: 'auriculares-pulse-anc-pro',
    name: 'Auriculares In-Ear Pulse ANC Pro',
    category: 'auriculares',
    condition: 'Nuevo',
    price: 118000,
    previousPrice: 148000,
    discountPercent: 20,
    description: 'Cancelación activa de ruido híbrida hasta 45 dB, audio espacial y 36 horas de autonomía total.',
    specs: ['Cancelación activa ANC 45 dB', 'Bluetooth 5.3 baja latencia', 'Carga rápida USB-C + inalámbrica', 'Resistencia IPX5 al agua y sudor'],
    warranty: '6 meses de garantía directa',
    stock: 14,
    imageUrl: '/src/assets/images/product_earbuds_1794864738382.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-headset-overear-anc',
    slug: 'auriculares-studio-overear-anc-max',
    name: 'Auriculares Studio Over-Ear ANC Max',
    category: 'auriculares',
    condition: 'Nuevo',
    price: 185000,
    previousPrice: 220000,
    discountPercent: 16,
    description: 'Almohadillas de espuma viscoelástica, drivers dinámicos de 40 mm y 50 horas de batería con cancelación activa.',
    specs: ['Audio Hi-Res por Bluetooth LDAC o USB-C', 'Cancelación adaptativa de ruido ambiental', 'Hasta 50 horas de reproducción continua', 'Bisagras de aluminio anodizado plegables'],
    warranty: '12 meses de garantía oficial',
    stock: 9,
    imageUrl: '/src/assets/images/prod_headset_overear_1794867736689.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-headset-gamer-71',
    slug: 'auriculares-gamer-wireless-71',
    name: 'Auriculares Gamer Wireless 7.1 Low-Latency',
    category: 'auriculares',
    condition: 'Nuevo',
    price: 142000,
    description: 'Sonido envolvente espacial, micrófono desmontable con filtro anti-pop y doble conexión inalámbrica.',
    specs: ['Dongle 2.4 GHz ultra baja latencia + BT', 'Sonido surround 7.1 calibrado', 'Micrófono cardioide desmontable', 'Compatible PC, PS5, Switch y celulares'],
    warranty: '12 meses de garantía oficial',
    stock: 11,
    imageUrl: '/src/assets/images/prod_headset_gaming_1794867736811.jpg',
    isFeatured: true,
    isOffer: false,
  },

  // CARGADORES
  {
    id: 'prod-gan-charger-65w',
    slug: 'cargador-gan-65w-cable-trenzado',
    name: 'Kit Cargador GaN 65W + Cable USB-C',
    category: 'cargadores',
    condition: 'Nuevo',
    price: 54000,
    previousPrice: 69000,
    discountPercent: 22,
    description: 'Tecnología nitruro de galio compacta para carga ultrarrápida segura con cable mallado de 100W.',
    specs: ['Potencia 65W Power Delivery 3.0', 'Protección térmica e inteligente', 'Cable USB-C a USB-C Kevlar 1.8m', 'Compatible iOS, Android y notebooks'],
    warranty: '6 meses de garantía directa',
    stock: 22,
    imageUrl: '/src/assets/images/product_charger_kit_1794864738942.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-charger-magsafe-3in1',
    slug: 'cargador-inalambrico-3en1-magstand',
    name: 'Cargador Inalámbrico 3-en-1 MagStand Pro',
    category: 'cargadores',
    condition: 'Nuevo',
    price: 92000,
    previousPrice: 108000,
    discountPercent: 15,
    description: 'Base magnética de aluminio para cargar smartphone, auriculares y reloj simultáneamente sin cables a la vista.',
    specs: ['Carga magnética Qi2 de 15W reales', 'Base dedicada para auriculares y smartwatch', 'Brazo de aluminio con inclinación ajustable', 'Incluye adaptador de pared USB-C 30W'],
    warranty: '6 meses de garantía directa',
    stock: 13,
    imageUrl: '/src/assets/images/prod_charger_magsafe_1794867737123.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-charger-100w-station',
    slug: 'estacion-carga-desktop-gan-100w',
    name: 'Estación de Carga Desktop GaN 100W 4 Puertos',
    category: 'cargadores',
    condition: 'Nuevo',
    price: 86000,
    description: 'Central de energía de escritorio con 4 salidas USB-C Power Delivery inteligentes para cargar notebook y celular a la vez.',
    specs: ['100W totales distribuidos dinámicamente', '4 puertos USB-C PD 3.0 + PPS', 'Display térmico de protección activa', 'Incluye cable de alimentación reforzado'],
    warranty: '12 meses de garantía oficial',
    stock: 10,
    imageUrl: '/src/assets/images/prod_charger_100w_gan_1794867737858.jpg',
    isFeatured: true,
    isOffer: false,
  },

  // OTROS ACCESORIOS
  {
    id: 'prod-powerbank-hub-kit',
    slug: 'powerbank-20000mah-hub-usbc',
    name: 'Power Bank 20.000 mAh PD + Hub USB-C',
    category: 'accesorios',
    condition: 'Nuevo',
    price: 94000,
    previousPrice: 115000,
    discountPercent: 18,
    description: 'Combo de energía portátil de alta densidad en aluminio anodizado junto a hub HDMI 4K y Ethernet.',
    specs: ['Power Bank 20.000 mAh carga rápida 45W', 'Hub USB-C 7-en-1 con HDMI 4K 60Hz', 'Lector SD/MicroSD + Gigabit Ethernet', 'Cuerpo de aluminio disipador de calor'],
    warranty: '6 meses de garantía directa',
    stock: 10,
    imageUrl: '/src/assets/images/product_powerbank_hub_1794866507963.jpg',
    isFeatured: true,
    isOffer: true,
  },
];

function createInitialState(): DatabaseState {
  return {
    catalogVersion: CURRENT_CATALOG_VERSION,
    users: [],
    products: SEED_PRODUCTS.map((p) => ({ ...p, specs: [...p.specs] })),
    orders: [],
    contactMessages: [],
    serviceRequests: [],
  };
}

function ensureDbFile(): DatabaseState {
  if (memoryFallbackState) {
    return memoryFallbackState;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = createInitialState();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseState;
    const needsCatalogRefresh = parsed.catalogVersion !== CURRENT_CATALOG_VERSION;

    const nextState: DatabaseState = {
      catalogVersion: CURRENT_CATALOG_VERSION,
      users: parsed.users || [],
      products: needsCatalogRefresh
        ? SEED_PRODUCTS.map((p) => ({ ...p, specs: [...p.specs] }))
        : Array.isArray(parsed.products) && parsed.products.length > 0
          ? parsed.products
          : SEED_PRODUCTS.map((p) => ({ ...p, specs: [...p.specs] })),
      orders: parsed.orders || [],
      contactMessages: parsed.contactMessages || [],
      serviceRequests: parsed.serviceRequests || [],
    };

    if (needsCatalogRefresh || !parsed.products?.length) {
      saveDb(nextState);
    }
    return nextState;
  } catch {
    const fallback = createInitialState();
    memoryFallbackState = fallback;
    return fallback;
  }
}

export function readDb(): DatabaseState {
  return ensureDbFile();
}

export function saveDb(next: DatabaseState): void {
  memoryFallbackState = next;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(next, null, 2), 'utf-8');
  } catch {
    // En entornos serverless de solo lectura se mantiene en memoria
  }
}
