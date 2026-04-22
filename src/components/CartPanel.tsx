import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import type { CartItem } from '../types/shop';

interface CartPanelProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartPanel({ isOpen, items, total, onClose, onUpdateQty, onRemove }: CartPanelProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside className={`cart-panel ${isOpen ? 'open' : ''}`} aria-label="Panier">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-blush-200">
          <div>
            <h2 className="font-serif text-xl text-bark">Votre Panier</h2>
            <p className="font-sans font-light text-[10px] tracking-[0.25em] uppercase text-bark/40 mt-0.5">
              {items.length} {items.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-blush-300 flex items-center justify-center text-bark/50 hover:text-coral-500 hover:border-coral-300 transition-all duration-300"
            aria-label="Fermer le panier"
          >
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="w-16 h-24 img-pill bg-blush-100 flex items-center justify-center">
                <ShoppingBag size={20} strokeWidth={1} className="text-blush-400" />
              </div>
              <div>
                <p className="font-serif text-lg text-bark mb-1">Panier vide</p>
                <p className="font-sans font-light text-xs text-bark/40">
                  Ajoutez des fleurs pour commencer.
                </p>
              </div>
              <button onClick={onClose} className="btn-ghost text-[10px] py-3 px-6">
                Voir la boutique
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4 group">
                  {/* Thumb */}
                  <div className="img-arch w-16 h-24 shrink-0 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-light text-[9px] tracking-[0.25em] uppercase text-coral-400 mb-0.5">
                      {item.product.subtitle}
                    </p>
                    <p className="font-serif text-base text-bark truncate">{item.product.name}</p>
                    <p className="font-display text-lg text-bark/70 font-light mt-1">
                      {item.product.price} €
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border border-blush-300 flex items-center justify-center text-bark/50 hover:border-coral-400 hover:text-coral-500 transition-all duration-200"
                      >
                        <Minus size={10} strokeWidth={2} />
                      </button>
                      <span className="font-sans font-light text-sm text-bark w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-blush-300 flex items-center justify-center text-bark/50 hover:border-coral-400 hover:text-coral-500 transition-all duration-200"
                      >
                        <Plus size={10} strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="self-start mt-1 text-bark/20 hover:text-coral-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Supprimer"
                  >
                    <X size={13} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-7 py-6 border-t border-blush-200">
            {/* Delivery note */}
            <p className="font-sans font-light text-[10px] text-bark/40 text-center tracking-[0.15em] uppercase mb-5">
              Livraison gratuite à Paris — dès 60 €
            </p>

            {/* Total */}
            <div className="flex items-center justify-between mb-5">
              <p className="font-sans font-light text-xs tracking-[0.2em] uppercase text-bark/60">Total</p>
              <p className="font-display text-2xl text-bark font-light">{total} €</p>
            </div>

            {/* Checkout */}
            <button className="w-full btn-primary justify-center gap-3 text-[10px]">
              Commander
              <ArrowRight size={13} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
