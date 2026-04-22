const steps = [
  {
    num: '01',
    title: 'La Sélection',
    desc: 'Chaque mardi et vendredi, nous sillonnons le marché de Rungis à l\'aube pour choisir les plus belles tiges de la semaine.',
  },
  {
    num: '02',
    title: 'La Composition',
    desc: 'Nos fleuristes assemblent chaque bouquet à la main, en suivant l\'instinct et la saison plutôt qu\'une recette fixe.',
  },
  {
    num: '03',
    title: 'La Livraison',
    desc: 'Vos fleurs voyagent dans nos vélos-cargo réfrigérés et arrivent fraîches, dans un emballage en papier de soie recyclé.',
  },
];

export default function Atelier() {
  return (
    <section id="atelier" className="py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="reveal font-sans font-light text-[10px] tracking-[0.4em] uppercase text-coral-400 mb-4">
            Notre savoir-faire
          </p>
          <h2 className="reveal font-serif text-4xl md:text-5xl text-bark">
            L'Atelier
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-24">
          {steps.map((step, i) => (
            <div key={step.num} className={`reveal reveal-delay-${i + 1} text-center`}>
              <p className="font-display text-6xl text-blush-300 font-light leading-none mb-5">
                {step.num}
              </p>
              <h3 className="font-serif text-2xl text-bark mb-4">{step.title}</h3>
              <p className="font-sans font-light text-sm text-bark/55 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Wide image banner */}
        <div className="reveal relative h-80 md:h-[480px] rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1583086762675-6bc6e7e38f8a?auto=format&fit=crop&w=1600&q=85"
            alt="L'atelier Franchet"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bark/50 to-transparent flex items-center">
            <div className="px-12 max-w-lg">
              <p className="font-display italic text-3xl md:text-4xl text-white leading-snug mb-4">
                « Les fleurs sont le sourire<br />de la nature. »
              </p>
              <p className="font-sans font-light text-xs tracking-[0.3em] uppercase text-white/70">
                — Marguerite Yourcenar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
