import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
      setEmail('');
    }
  };

  return (
    <section id="contact" className="py-28 px-6 bg-petal">
      <div className="max-w-2xl mx-auto text-center">
        <div className="img-pill w-20 h-32 mx-auto mb-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=200&q=85"
            alt="Fleur"
            className="w-full h-full object-cover"
          />
        </div>

        <p className="reveal font-sans font-light text-[10px] tracking-[0.4em] uppercase text-coral-400 mb-4">
          Restez en fleurs
        </p>
        <h2 className="reveal font-serif text-4xl text-bark mb-5">
          La Lettre Franchet
        </h2>
        <p className="reveal font-sans font-light text-sm text-bark/55 leading-relaxed mb-10">
          Abonnez-vous à notre lettre mensuelle — nouveautés florales,
          conseils de saison et offres exclusives.
        </p>

        {sent ? (
          <div className="reveal bg-blush-100 border border-blush-300 rounded-2xl px-8 py-6">
            <p className="font-serif text-xl text-bark mb-1">Merci !</p>
            <p className="font-sans font-light text-sm text-bark/60">
              Vous recevrez bientôt notre première lettre.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="reveal flex gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              required
              className="flex-1 bg-white border border-blush-300 rounded-full px-6 py-4 font-sans font-light text-sm text-bark placeholder:text-bark/30 focus:outline-none focus:border-coral-400 transition-colors duration-300"
            />
            <button type="submit" className="btn-primary px-5 py-4">
              <Send size={14} strokeWidth={1.5} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
