import { ShoppingBag, Heart } from 'lucide-react';
import type { Product } from '../types/shop';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  delay?: number;
}

export default function ProductCard({ product, onAdd, delay = 0 }: ProductCardProps) {
  return (
    <article
      className={`reveal reveal-delay-${delay} group cursor-pointer`}
    >
      {/* Arch image */}
      <div className="img-arch lift relative overflow-hidden aspect-[3/4] mb-5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-bark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-8">
          <button
            onClick={() => onAdd(product)}
            className="btn-primary text-[10px] py-3 px-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-400"
          >
            <ShoppingBag size={12} strokeWidth={2} />
            Ajouter au panier
          </button>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 bg-coral-500 text-white font-sans font-light text-[9px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full">
            {product.badge}
          </div>
        )}

        {/* Wishlist */}
        <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center text-bark/50 hover:text-coral-500 hover:bg-cream transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
          <Heart size={13} strokeWidth={1.5} />
        </button>
      </div>

      {/* Info */}
      <div className="px-1">
        <p className="font-sans font-light text-[10px] tracking-[0.3em] uppercase text-coral-400 mb-1">
          {product.subtitle}
        </p>
        <h3 className="font-serif text-xl text-bark mb-2 leading-tight">
          {product.name}
        </h3>
        <p className="font-sans font-light text-xs text-bark/55 leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl text-bark font-light">
            {product.price} <span className="text-sm">€</span>
          </span>
          <button
            onClick={() => onAdd(product)}
            className="w-9 h-9 rounded-full border border-coral-300 text-coral-500 flex items-center justify-center hover:bg-coral-500 hover:text-white hover:border-coral-500 transition-all duration-300"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
