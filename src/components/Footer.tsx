import { Instagram, MapPin, Clock, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bark text-cream/80 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-5">
              <p className="font-serif text-2xl text-cream">Franchet</p>
              <p className="font-sans font-light text-[10px] tracking-[0.35em] uppercase text-coral-400">
                Fleuriste
              </p>
            </div>
            <p className="font-sans font-light text-xs leading-relaxed text-cream/55 max-w-xs">
              Artisan fleuriste au cœur du Marais depuis 1987.
              Bouquets de saison, compositions végétales, livraison à Paris.
            </p>
            <a
              href="https://instagram.com"
              className="inline-flex items-center gap-2 mt-6 font-sans font-light text-xs tracking-[0.2em] uppercase text-cream/50 hover:text-coral-400 transition-colors duration-300"
            >
              <Instagram size={14} strokeWidth={1.5} />
              @franchetfleuriste
            </a>
          </div>

          {/* Info */}
          <div>
            <p className="font-sans font-light text-[10px] tracking-[0.3em] uppercase text-coral-400 mb-6">
              Boutique
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={13} strokeWidth={1.5} className="text-coral-400 mt-0.5 shrink-0" />
                <p className="font-sans font-light text-xs leading-relaxed text-cream/55">
                  14 rue de Bretagne<br />75003 Paris
                </p>
              </div>
              <div className="flex gap-3">
                <Clock size={13} strokeWidth={1.5} className="text-coral-400 mt-0.5 shrink-0" />
                <p className="font-sans font-light text-xs leading-relaxed text-cream/55">
                  Lun–Sam : 9h–19h30<br />Dimanche : 9h–14h
                </p>
              </div>
              <div className="flex gap-3">
                <Phone size={13} strokeWidth={1.5} className="text-coral-400 mt-0.5 shrink-0" />
                <a href="tel:+33142720000" className="font-sans font-light text-xs text-cream/55 hover:text-coral-400 transition-colors duration-300">
                  01 42 72 00 00
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-sans font-light text-[10px] tracking-[0.3em] uppercase text-coral-400 mb-6">
              Navigation
            </p>
            <div className="space-y-3">
              {['Boutique', 'L\'Atelier', 'Notre Histoire', 'Livraison', 'Mentions légales', 'CGV'].map(link => (
                <a
                  key={link}
                  href="#"
                  className="block font-sans font-light text-xs text-cream/55 hover:text-coral-400 transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans font-light text-[10px] tracking-[0.2em] uppercase text-cream/30">
            © 2024 Franchet Fleuriste — Tous droits réservés
          </p>
          <p className="font-sans font-light text-[10px] text-cream/20">
            Fait avec amour à Paris 🌸
          </p>
        </div>
      </div>
    </footer>
  );
}
