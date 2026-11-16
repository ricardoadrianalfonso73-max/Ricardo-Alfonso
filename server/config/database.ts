import fs from 'fs';
import path from 'path';
import type {
  ContactMessageRecord,
  OrderRecord,
  Product,
  ServiceRequestRecord,
} from '../../src/types/store.ts';

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

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

const SEED_PRODUCTS: Product[] = [
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
    imageUrl: '/src/assets/images/product_phone_sleek_1794864738067.jpg',
    isFeatured: true,
    isOffer: false,
  },
  {
    id: 'prod-iphone-14-pro-usado',
    slug: 'iphone-14-pro-128gb-certificado',
    name: 'iPhone 14 Pro 128 GB Certificado',
    category: 'celulares',
    condition: 'Usado',
    price: 960000,
    previousPrice: 1180000,
    discountPercent: 19,
    description: 'Equipo seleccionado y certificado por nuestro laboratorio. Batería al 94% y estética impecable.',
    specs: ['Estado estético 10/10 · Sin detalles', 'Batería verificada 94% de salud', 'Dynamic Island · 120Hz ProMotion', 'Incluye cable USB-C certificado'],
    warranty: '6 meses de garantía Electro Tecno',
    stock: 4,
    imageUrl: '/src/assets/images/category_smartphones_1794864736180.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-pixel-8-pro-usado',
    slug: 'google-pixel-8-pro-256gb-usado',
    name: 'Google Pixel 8 Pro 256 GB',
    category: 'celulares',
    condition: 'Usado',
    price: 840000,
    description: 'Fotografía computacional de referencia y pantalla Super Actua OLED verificada en 42 puntos de control.',
    specs: ['Super Actua LTPO OLED 6.7"', 'Tensor G3 · 12 GB RAM · 256 GB', 'Batería al 96% · Libre de fábrica', 'Control técnico completo'],
    warranty: '6 meses de garantía Electro Tecno',
    stock: 3,
    imageUrl: '/src/assets/images/product_phone_sleek_1794864738067.jpg',
    isFeatured: true,
    isOffer: false,
  },
  {
    id: 'prod-galaxy-s23-fe-nuevo',
    slug: 'samsung-galaxy-s23-fe-256gb',
    name: 'Samsung Galaxy S23 FE 256 GB',
    category: 'celulares',
    condition: 'Nuevo',
    price: 785000,
    previousPrice: 910000,
    discountPercent: 14,
    description: 'Pantalla Dynamic AMOLED 2X 120Hz, resistencia IP68 y cámara triple con estabilización óptica.',
    specs: ['Pantalla 6.4" AMOLED 120Hz', '256 GB almacenamiento · 8 GB RAM', 'Resistencia al agua IP68', 'Carga rápida 25W + inalámbrica'],
    warranty: '12 meses de garantía oficial',
    stock: 7,
    imageUrl: '/src/assets/images/category_smartphones_1794864736180.jpg',
    isFeatured: true,
    isOffer: true,
  },
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
    specs: ['Formato compacto 75% · Switches táctiles', 'Tri-modo: 2.4 GHz, Bluetooth 5.2 y USB-C', 'Keycaps PBT doble inyección anti-desgaste', 'Batería 4000 mAh · Iluminación verde regulable'],
    warranty: '12 meses de garantía oficial',
    stock: 11,
    imageUrl: '/src/assets/images/product_keyboard_mech_1794866506889.jpg',
    isFeatured: true,
    isOffer: true,
  },
  {
    id: 'prod-teclado-tkl-aluminio',
    slug: 'teclado-tkl-aluminio-pro',
    name: 'Teclado Mecánico TKL Aluminio CNC',
    category: 'teclados',
    condition: 'Nuevo',
    price: 162000,
    description: 'Chasis mecanizado en aluminio anodizado negro con amortiguación gasket-mount para máxima precisión.',
    specs: ['Formato Tenkeyless 87 teclas', 'Montaje Gasket silencioso de 5 capas', 'Switches intercambiables en caliente', 'Cable mallado desmontable USB-C'],
    warranty: '12 meses de garantía oficial',
    stock: 8,
    imageUrl: '/src/assets/images/product_keyboard_mech_1794866506889.jpg',
    isFeatured: true,
    isOffer: false,
  },
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
    slug: 'mouse-ergo-studio-usbc',
    name: 'Mouse Ergonómico Studio Dual-Mode',
    category: 'mouse',
    condition: 'Nuevo',
    price: 64000,
    description: 'Rueda electromagnética de desplazamiento ultrarrápido y emparejamiento simultáneo hasta 3 dispositivos.',
    specs: ['Sensor de precisión 8000 DPI sobre vidrio', 'Multi-dispositivo Bluetooth + Dongle 2.4G', 'Carga rápida USB-C en 1 minuto', 'Botones silenciosos de alta durabilidad'],
    warranty: '6 meses de garantía directa',
    stock: 12,
    imageUrl: '/src/assets/images/product_mouse_pro_1794866506818.jpg',
    isFeatured: true,
    isOffer: false,
  },
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
    id: 'prod-monitor-24-usbc',
    slug: 'monitor-24-fhd-ips-100hz-usbc',
    name: 'Monitor 24" Full HD IPS 100Hz USB-C',
    category: 'monitores',
    condition: 'Nuevo',
    price: 279000,
    description: 'Ideal para trabajo y programación: imagen nítida IPS, filtro Low Blue Light y hub USB integrado.',
    specs: ['Panel IPS 24" 1920×1080 · 100Hz', 'Puerto USB-C con entrega de 65W', 'Cobertura de color 99% sRGB', 'Soporte VESA 100×100 mm'],
    warranty: '12 meses de garantía oficial',
    stock: 9,
    imageUrl: '/src/assets/images/product_monitor_gaming_1794866506750.jpg',
    isFeatured: true,
    isOffer: false,
  },
  {
    id: 'prod-earbuds-anc-pro',
    slug: 'auriculares-pulse-anc-pro',
    name: 'Auriculares Pulse ANC Pro',
    category: 'accesorios',
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
    id: 'prod-gan-charger-65w',
    slug: 'cargador-gan-65w-cable-trenzado',
    name: 'Kit Cargador GaN 65W + Cable USB-C',
    category: 'accesorios',
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
  {
    id: 'prod-pack-kevlar-protect',
    slug: 'pack-funda-kevlar-blindado',
    name: 'Pack Blindaje Aramid + Vidrio 9H',
    category: 'accesorios',
    condition: 'Nuevo',
    price: 42000,
    description: 'Funda de fibra de aramida ultrafina con anclaje magnético y vidrio templado de bordes curvos.',
    specs: ['Fibra aramida antigolpes ultraliviana', 'Anillo magnético compatible MagSafe', 'Vidrio templado 9H oleofóbico', 'Colocación sin cargo en sucursal'],
    warranty: '3 meses de garantía directa',
    stock: 19,
    imageUrl: '/src/assets/images/category_accessories_1794864737415.jpg',
    isFeatured: true,
    isOffer: false,
  },
];

function ensureDbFile(): DatabaseState {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseState = {
      users: [],
      products: SEED_PRODUCTS,
      orders: [],
      contactMessages: [],
      serviceRequests: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseState;
    const existingProducts = Array.isArray(parsed.products) ? parsed.products : [];
    const existingIds = new Set(existingProducts.map((p) => p.id));
    let changed = false;

    for (const seedProduct of SEED_PRODUCTS) {
      if (!existingIds.has(seedProduct.id)) {
        existingProducts.push(seedProduct);
        changed = true;
      }
    }

    const nextState: DatabaseState = {
      users: parsed.users || [],
      products: existingProducts.length > 0 ? existingProducts : SEED_PRODUCTS,
      orders: parsed.orders || [],
      contactMessages: parsed.contactMessages || [],
      serviceRequests: parsed.serviceRequests || [],
    };

    if (changed || existingProducts.length === 0) {
      saveDb(nextState);
    }
    return nextState;
  } catch {
    const fallback: DatabaseState = {
      users: [],
      products: SEED_PRODUCTS,
      orders: [],
      contactMessages: [],
      serviceRequests: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

export function readDb(): DatabaseState {
  return ensureDbFile();
}

export function saveDb(next: DatabaseState): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(next, null, 2), 'utf-8');
}
