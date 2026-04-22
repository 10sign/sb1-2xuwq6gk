export default function About() {
  return (
    <section id="histoire" className="py-28 px-6 bg-blush-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Images */}
        <div className="reveal flex gap-6 justify-center">
          <div className="img-arch w-44 h-72 shadow-xl overflow-hidden mt-10">
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=85"
              alt="L'atelier Franchet"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="img-arch w-44 h-72 shadow-xl overflow-hidden -mt-4">
            <img
              src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=400&q=85"
              alt="Fleurs de saison"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Text */}
        <div>
          <p className="reveal font-sans font-light text-[10px] tracking-[0.4em] uppercase text-coral-400 mb-5">
            Notre histoire
          </p>
          <h2 className="reveal font-serif text-4xl md:text-5xl text-bark leading-tight mb-7">
            Un héritage
            <br />
            <em className="font-display italic font-light text-coral-500">fleuri depuis 1987</em>
          </h2>
          <div className="reveal space-y-4 font-sans font-light text-sm text-bark/65 leading-loose">
            <p>
              Née d'une passion transmise de mère en fille, la maison Franchet a ouvert
              ses portes au cœur du Marais en 1987. Depuis, nous tissons chaque matin
              un dialogue silencieux avec les fleurs.
            </p>
            <p>
              Nos approvisionnements privilégient les fleurs françaises et européennes,
              cultivées dans le respect des saisons. Pas de roses en décembre, mais
              des jacinthes, des hellébores, et des tulipes qui sentent l'hiver doux.
            </p>
            <p>
              Chaque bouquet est pensé comme une partition florale — une harmonie
              de textures, de couleurs et de parfums qui raconte quelque chose
              de vrai sur la beauté éphémère.
            </p>
          </div>
          <div className="reveal mt-10 flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-4xl text-coral-500 font-light">37</p>
              <p className="font-sans font-light text-[10px] tracking-[0.25em] uppercase text-bark/50 mt-1">Années</p>
            </div>
            <div className="w-px h-12 bg-blush-300" />
            <div className="text-center">
              <p className="font-display text-4xl text-coral-500 font-light">8</p>
              <p className="font-sans font-light text-[10px] tracking-[0.25em] uppercase text-bark/50 mt-1">Fleuristes</p>
            </div>
            <div className="w-px h-12 bg-blush-300" />
            <div className="text-center">
              <p className="font-display text-4xl text-coral-500 font-light">∞</p>
              <p className="font-sans font-light text-[10px] tracking-[0.25em] uppercase text-bark/50 mt-1">Émotions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
