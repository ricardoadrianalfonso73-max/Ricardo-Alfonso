import { Instagram, MessageCircle, Mail } from 'lucide-react';
import type { PageSection } from '../types/store';
import { ElectroLogo } from './Navbar';

interface FooterProps {
  onNavigate: (section: PageSection) => void;
  onSelectCategory: (
    category: 'celulares' | 'teclados' | 'mouse' | 'monitores' | 'accesorios' | 'servicio-tecnico'
  ) => void;
}

export function Footer({ onNavigate, onSelectCategory }: FooterProps) {
  return (
    <footer className="bg-[#050505] text-[#9AA89F] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Marca */}
          <div>
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('inicio');
              }}
              className="inline-flex items-center gap-2.5"
            >
              <ElectroLogo className="w-8 h-8" />
              <span className="font-[Outfit] text-lg font-bold text-white tracking-tight">
                ELECTRO <span className="text-[#00FF55]">TECNO</span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-[#8E9B92]">
              Tienda especializada en smartphones nuevos y usados certificados, periféricos gamer, monitores y servicio técnico propio.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-[Outfit] text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navegación
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#inicio"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('inicio');
                  }}
                  className="hover:text-[#00FF55] transition-colors"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#productos"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('productos');
                  }}
                  className="hover:text-[#00FF55] transition-colors"
                >
                  Productos
                </a>
              </li>
              <li>
                <a
                  href="#ofertas"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('ofertas');
                  }}
                  className="hover:text-[#00FF55] transition-colors"
                >
                  Ofertas
                </a>
              </li>
              <li>
                <a
                  href="#servicio-tecnico"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('servicio-tecnico');
                  }}
                  className="hover:text-[#00FF55] transition-colors"
                >
                  Servicio Técnico
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contacto');
                  }}
                  className="hover:text-[#00FF55] transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="font-[Outfit] text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categorías
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('celulares')}
                  className="hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Celulares Nuevos y Usados
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('teclados')}
                  className="hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Teclados Mecánicos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('mouse')}
                  className="hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Mouse Gamer y Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('monitores')}
                  className="hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Monitores IPS y QHD
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('accesorios')}
                  className="hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Auriculares, Cargadores y Accesorios
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('servicio-tecnico')}
                  className="hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Reparación y Diagnóstico
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto y redes */}
          <div>
            <h3 className="font-[Outfit] text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <div className="space-y-2 text-sm text-[#8E9B92]">
              <p>Av. Corrientes 2450, CABA</p>
              <p className="tabular-nums">+54 11 4589-2300</p>
              <p>contacto@electrotecno.com.ar</p>
            </div>
            <div className="mt-4 flex items-center gap-2.5">
              <a
                href="https://wa.me/5491145892300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Electro Tecno"
                className="w-9 h-9 rounded-lg bg-[#101010] border border-white/10 hover:border-[#00FF55]/50 flex items-center justify-center text-[#D7E0DA] hover:text-[#00FF55] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Electro Tecno"
                className="w-9 h-9 rounded-lg bg-[#101010] border border-white/10 hover:border-[#00FF55]/50 flex items-center justify-center text-[#D7E0DA] hover:text-[#00FF55] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => onNavigate('contacto')}
                aria-label="Ir a la sección de contacto"
                className="w-9 h-9 rounded-lg bg-[#101010] border border-white/10 hover:border-[#00FF55]/50 flex items-center justify-center text-[#D7E0DA] hover:text-[#00FF55] transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6F7C73]">
          <p>© {new Date().getFullYear()} Electro Tecno. Todos los derechos reservados.</p>
          <p>Tecnología a tu alcance · Argentina</p>
        </div>
      </div>
    </footer>
  );
}
