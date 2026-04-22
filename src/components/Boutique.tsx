import { useState } from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import type { Product } from '../types/shop';

type Category = 'tous' | 'bouquet' | 'composition' | 'mono';

const categories: { key: Category; label: string }[] = [
  { key: 'tous', label: 'Tous' },
  { key: 'bouquet', label: 'Bouquets' },
  { key: 'composition', label: 'Compositions' },
  { key: 'mono', label: 'Mono-variétés' },
];

interface BoutiqueProps {
  onAdd: (product: Product) => void;
}

export default function Boutique({ onAdd }: BoutiqueProps) {
  const [active, setActive] = useState<Category>('tous');

  const filtered = active === 'tous' ? products : products.filter(p => p.category === active);

  return (
    <section id="boutique" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="reveal font-sans font-light text-[10px] tracking-[0.4em] uppercase text-coral-400 mb-4">
            Nos créations
          </p>
          <h2 className="reveal font-serif text-4xl md:text-5xl text-bark mb-5">
            La Boutique
          </h2>
          <p className="reveal font-sans font-light text-sm text-bark/55 max-w-md mx-auto leading-relaxed">
            Chaque bouquet est composé à la main, avec des fleurs choisies au marché
            chaque matin selon la saison et l'humeur du jour.
          </p>
        </div>

        {/* Filter pills */}
        <div className="reveal flex flex-wrap justify-center gap-3 mb-14">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`font-sans font-light text-xs tracking-[0.2em] uppercase px-6 py-2.5 rounded-full border transition-all duration-300 ${
                active === cat.key
                  ? 'bg-coral-500 text-white border-coral-500'
                  : 'border-blush-400 text-bark/60 hover:border-coral-400 hover:text-coral-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAdd}
              delay={((i % 3) + 1) as 1 | 2 | 3}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="reveal text-center mt-20">
          <p className="font-sans font-light text-xs text-bark/50 tracking-[0.2em] uppercase mb-5">
            Commande personnalisée ?
          </p>
          <a href="#contact" className="btn-ghost">
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
}
