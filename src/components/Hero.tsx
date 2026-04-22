import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-petal">
      {/* Background decorative petals */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 right-[10%] w-64 h-96 bg-blush-200/60 animate-petal"
          style={{ borderRadius: '9999px', filter: 'blur(1px)' }}
        />
        <div
          className="absolute bottom-32 left-[5%] w-40 h-64 bg-coral-300/30"
          style={{ borderRadius: '9999px', animation: 'petal 8s ease-in-out infinite 1s' }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-24 h-40 bg-blush-300/40"
          style={{ borderRadius: '9999px', animation: 'petal 10s ease-in-out infinite 2s' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Text */}
        <div className="order-2 md:order-1">
          <p
            className="font-sans font-light text-xs tracking-[0.4em] uppercase text-coral-400 mb-6"
            style={{ animation: 'fade-up 0.8s ease forwards', animationDelay: '0.2s', opacity: 0 }}
          >
            Paris · Depuis 1987
          </p>
          <h1
            className="font-serif text-5xl md:text-7xl text-bark leading-[1.05] mb-6 text-balance"
            style={{ animation: 'fade-up 0.8s ease forwards', animationDelay: '0.4s', opacity: 0 }}
          >
            L'art de faire
            <br />
            <em className="font-display italic font-light text-coral-500">parler les fleurs</em>
          </h1>
          <p
            className="font-sans font-light text-base text-bark/60 max-w-md leading-relaxed mb-10"
            style={{ animation: 'fade-up 0.8s ease forwards', animationDelay: '0.6s', opacity: 0 }}
          >
            Bouquets de saison, compositions végétales et créations florales sur mesure.
            Chaque arrangement est une conversation entre la nature et l'émotion.
          </p>
          <div
            className="flex flex-wrap gap-4"
            style={{ animation: 'fade-up 0.8s ease forwards', animationDelay: '0.8s', opacity: 0 }}
          >
            <a href="#boutique" className="btn-primary">
              Découvrir la boutique
            </a>
            <a href="#histoire" className="btn-ghost">
              Notre histoire
            </a>
          </div>
        </div>

        {/* Hero image — tall arch */}
        <div
          className="order-1 md:order-2 flex justify-center"
          style={{ animation: 'fade-up 1s ease forwards', animationDelay: '0.3s', opacity: 0 }}
        >
          <div className="relative">
            {/* Main arch image */}
            <div className="img-arch w-72 md:w-80 h-[480px] md:h-[560px] shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1490750967868-88df5691cc36?auto=format&fit=crop&w=700&q=90"
                alt="Bouquet de pivoines"
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
              />
            </div>
            {/* Floating accent pill */}
            <div
              className="img-pill absolute -bottom-6 -left-12 w-32 h-48 shadow-xl overflow-hidden border-4 border-cream"
            >
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=85"
                alt="Détail floral"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Label badge */}
            <div className="absolute -top-4 -right-8 bg-coral-500 text-white font-sans font-light text-[10px] tracking-[0.3em] uppercase px-4 py-2 rounded-full shadow-lg">
              Nouvelle saison
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#boutique"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bark/40 hover:text-coral-400 transition-colors duration-300"
        style={{ animation: 'fade-in 1s ease forwards', animationDelay: '1.5s', opacity: 0 }}
      >
        <span className="font-sans font-light text-[10px] tracking-[0.3em] uppercase">Défiler</span>
        <ArrowDown size={14} strokeWidth={1.5} className="animate-bounce" />
      </a>
    </section>
  );
}
