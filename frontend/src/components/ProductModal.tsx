import { useState } from 'react';
import { Check, ShieldCheck, ShoppingCart, X } from 'lucide-react';
import { formatPrice } from '../lib/format';
import type { Product } from '../types/store';
import { SmartImage } from './SmartImage';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#101010] border border-[#00FF55]/30 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle del producto"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-[#151515]/90 border border-white/10 hover:border-[#00FF55]/60 text-white hover:text-[#00FF55] flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-[4/3] md:aspect-auto md:h-full bg-[#151515]">
            <SmartImage
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              fallbackTitle={product.name}
            />
          </div>

          <div className="p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 text-xs text-[#8E9B92]">
              <span className="capitalize">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#00FF55] font-medium">{product.condition}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
              </span>
            </div>

            <h2
              id="product-modal-title"
              className="mt-2 font-[Outfit] text-2xl font-bold text-white"
            >
              {product.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-[JetBrains_Mono] text-2xl font-bold text-[#00FF55] tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.previousPrice && (
                <span className="font-[JetBrains_Mono] text-sm text-[#7B8880] line-through tabular-nums">
                  {formatPrice(product.previousPrice)}
                </span>
              )}
            </div>

            <p className="mt-4 text-sm text-[#B2BEB6] leading-relaxed">
              {product.description}
            </p>

            <ul className="mt-5 space-y-2">
              {product.specs.map((spec) => (
                <li
                  key={spec}
                  className="flex items-start gap-2 text-xs sm:text-sm text-[#D7E0DA]"
                >
                  <Check className="w-4 h-4 text-[#00FF55] shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-[#9AA89F]">
              <ShieldCheck className="w-4 h-4 text-[#00FF55] shrink-0" />
              <span>{product.warranty}</span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="inline-flex items-center rounded-xl bg-[#151515] border border-white/10 h-11">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Disminuir cantidad"
                  className="w-10 h-full text-white hover:text-[#00FF55] cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(Math.max(1, product.stock), q + 1))
                  }
                  aria-label="Aumentar cantidad"
                  className="w-10 h-full text-white hover:text-[#00FF55] cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={product.stock <= 0}
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 h-11 px-5 rounded-xl bg-[#00FF55] hover:bg-[#36FF7A] disabled:bg-[#1E2420] disabled:text-[#6F7C73] text-[#050505] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
