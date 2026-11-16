import { useState } from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import type { PageSection, PublicUser } from '../types/store';

interface NavbarProps {
  activeSection: PageSection;
  cartCount: number;
  user: PublicUser | null;
  onNavigate: (section: PageSection) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

const NAV_LINKS: { label: string; section: PageSection }[] = [
  { label: 'Inicio', section: 'inicio' },
  { label: 'Productos', section: 'productos' },
  { label: 'Ofertas', section: 'ofertas' },
  { label: 'Servicio Técnico', section: 'servicio-tecnico' },
  { label: 'Contacto', section: 'contacto' },
];

export function ElectroLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="1.5"
        width="33"
        height="33"
        rx="8"
        fill="#101010"
        stroke="#00FF55"
        strokeWidth="1.75"
      />
      <path
        d="M20.5 7.5L11.5 19.5H18L15.5 28.5L24.5 16.5H18L20.5 7.5Z"
        fill="#00FF55"
      />
    </svg>
  );
}

export function Navbar({
  activeSection,
  cartCount,
  user,
  onNavigate,
  onOpenSearch,
  onOpenCart,
  onOpenAuth,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNavClick(section: PageSection) {
    setMobileOpen(false);
    onNavigate(section);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/92 backdrop-blur-md border-b border-[#00FF55]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zona 1: Logo y nombre de la tienda */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('inicio');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF55] rounded-lg"
        >
          <ElectroLogo className="w-8 h-8 transition-transform duration-200 group-hover:scale-105" />
          <span className="font-[Outfit] text-lg font-bold tracking-tight text-white">
            ELECTRO <span className="text-[#00FF55]">TECNO</span>
          </span>
        </a>

        {/* Zona 2: Enlaces de navegación */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.section;
            return (
              <a
                key={link.section}
                href={`#${link.section}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.section);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#00FF55] after:transition-all after:duration-200 focus-visible:outline-none focus-visible:text-[#00FF55] ${
                  isActive
                    ? 'text-[#00FF55] after:w-full'
                    : 'text-[#A9B5AD] hover:text-white after:w-0 hover:after:w-full'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zona 3: Acciones (Búsqueda, Cuenta, Carrito) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Buscar productos"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-white/10 bg-[#101010] text-[#D7E0DA] hover:border-[#00FF55]/50 hover:text-[#00FF55] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF55]"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            aria-label={user ? `Cuenta de ${user.name}` : 'Iniciar sesión'}
            className="hidden sm:inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-white/10 bg-[#101010] text-xs font-medium text-[#D7E0DA] hover:border-[#00FF55]/50 hover:text-[#00FF55] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF55]"
          >
            <User className="w-4 h-4" />
            <span className="max-w-[96px] truncate">
              {user ? user.name.split(' ')[0] : 'Cuenta'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Abrir carrito de compras (${cartCount} productos)`}
            className={`h-10 px-3.5 inline-flex items-center gap-2 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF55] ${
              cartCount > 0
                ? 'bg-[#00FF55] text-[#050505] hover:bg-[#33FF77] shadow-[0_0_20px_rgba(0,255,85,0.28)]'
                : 'bg-[#151515] text-white border border-[#00FF55]/30 hover:border-[#00FF55]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="tabular-nums">Carrito ({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg border border-white/10 bg-[#101010] text-white hover:border-[#00FF55]/50 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0A0A0A] border-t border-[#00FF55]/15 px-4 py-4 space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.section;
            return (
              <a
                key={link.section}
                href={`#${link.section}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.section);
                }}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#151515] text-[#00FF55]'
                    : 'text-[#D7E0DA] hover:bg-[#151515] hover:text-[#00FF55]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenAuth();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[#D7E0DA] hover:bg-[#151515] hover:text-[#00FF55] text-left cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>{user ? `Mi cuenta (${user.name})` : 'Iniciar sesión / Registrarse'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
