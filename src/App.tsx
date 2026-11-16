import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { BenefitsBar } from './components/BenefitsBar';
import { CartDrawer } from './components/CartDrawer';
import { CategoriesSection } from './components/CategoriesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { OffersSection } from './components/OffersSection';
import { ProductModal } from './components/ProductModal';
import { ProductsSection, type ProductFilterTab } from './components/ProductsSection';
import { SearchModal } from './components/SearchModal';
import { TechServiceModal } from './components/TechServiceModal';
import { TechServiceSection } from './components/TechServiceSection';
import { fetchAccountProfile, fetchProducts, getStoredToken, setStoredToken } from './lib/api';
import type { CartItem, PageSection, Product, PublicUser } from './types/store';

const CART_STORAGE_KEY = 'electro_tecno_cart';
const VALID_SECTIONS: PageSection[] = [
  'inicio',
  'productos',
  'ofertas',
  'servicio-tecnico',
  'contacto',
];

function getInitialSection(): PageSection {
  const hash = window.location.hash.replace('#', '') as PageSection;
  return VALID_SECTIONS.includes(hash) ? hash : 'inicio';
}

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<PageSection>(getInitialSection);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ProductFilterTab>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const [cart, setCart] = useState<CartItem[]>(loadInitialCart);
  const [user, setUser] = useState<PublicUser | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  const navigateToSection = useCallback((section: PageSection) => {
    setActiveSection(section);
    if (window.location.hash !== `#${section}`) {
      window.history.pushState(null, '', `#${section}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageSection;
      if (VALID_SECTIONS.includes(hash)) {
        setActiveSection(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 2800);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const items = await fetchProducts();
      setProducts(items);
    } catch (err) {
      setProductsError(
        err instanceof Error
          ? err.message
          : 'No pudimos cargar el catálogo de productos.'
      );
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;
    fetchAccountProfile()
      .then((res) => setUser(res.user))
      .catch(() => {
        setStoredToken(null);
        setUser(null);
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignorar errores de almacenamiento privado
    }
  }, [cart]);

  function handleAddToCart(product: Product, quantity = 1) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(product.stock, item.quantity + quantity),
              }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    showToast(`${product.name} agregado al carrito`);
  }

  function handleUpdateCartQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function handleRemoveCartItem(productId: string) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function handleSelectCategory(
    category:
      | 'celulares'
      | 'teclados'
      | 'mouse'
      | 'monitores'
      | 'accesorios'
      | 'servicio-tecnico'
  ) {
    if (category === 'servicio-tecnico') {
      navigateToSection('servicio-tecnico');
      return;
    }
    setActiveTab(category);
    setSearchQuery('');
    navigateToSection('productos');
  }

  function handleApplySearchFilter(q: string) {
    setSearchQuery(q);
    setActiveTab('todos');
    navigateToSection('productos');
  }

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F4F6F5] flex flex-col">
      <Navbar
        activeSection={activeSection}
        cartCount={totalCartCount}
        user={user}
        onNavigate={navigateToSection}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="flex-1">
        {activeSection === 'inicio' && (
          <>
            <HeroSection onNavigate={navigateToSection} />
            <BenefitsBar />
            <CategoriesSection onSelectCategory={handleSelectCategory} />
          </>
        )}

        {activeSection === 'productos' && (
          <ProductsSection
            products={products}
            loading={loadingProducts}
            error={productsError}
            activeTab={activeTab}
            searchQuery={searchQuery}
            onTabChange={setActiveTab}
            onClearSearch={() => setSearchQuery('')}
            onViewProduct={setSelectedProduct}
            onAddToCart={(product) => handleAddToCart(product, 1)}
          />
        )}

        {activeSection === 'ofertas' && (
          <OffersSection
            products={products}
            loading={loadingProducts}
            onViewProduct={setSelectedProduct}
            onAddToCart={(product) => handleAddToCart(product, 1)}
          />
        )}

        {activeSection === 'servicio-tecnico' && (
          <TechServiceSection
            onOpenServiceModal={() => setIsServiceModalOpen(true)}
          />
        )}

        {activeSection === 'contacto' && <ContactSection />}
      </main>

      <Footer
        onNavigate={navigateToSection}
        onSelectCategory={handleSelectCategory}
      />

      {/* Modales y Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        user={user}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        onOrderCompleted={loadProducts}
      />

      <TechServiceModal
        isOpen={isServiceModalOpen}
        user={user}
        onClose={() => setIsServiceModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        user={user}
        onClose={() => setIsAuthOpen(false)}
        onAuthChange={setUser}
      />

      <SearchModal
        isOpen={isSearchOpen}
        products={products}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={setSelectedProduct}
        onApplySearchFilter={handleApplySearchFilter}
      />

      {/* Toast de confirmación de carrito */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#101010] border border-[#00FF55]/50 text-xs sm:text-sm font-medium text-white shadow-[0_12px_32px_rgba(0,0,0,0.65)]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#00FF55] shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
