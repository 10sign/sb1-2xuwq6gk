import Header from './components/Header';
import Hero from './components/Hero';
import Boutique from './components/Boutique';
import About from './components/About';
import Atelier from './components/Atelier';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CartPanel from './components/CartPanel';
import { useCart } from './hooks/useCart';
import { useScrollReveal } from './hooks/useScrollReveal';

function App() {
  const cart = useCart();
  useScrollReveal();

  return (
    <div className="min-h-screen">
      <Header cartCount={cart.count} onCartOpen={() => cart.setIsOpen(true)} />
      <main>
        <Hero />
        <Boutique onAdd={cart.add} />
        <About />
        <Atelier />
        <Newsletter />
      </main>
      <Footer />
      <CartPanel
        isOpen={cart.isOpen}
        items={cart.items}
        total={cart.total}
        onClose={() => cart.setIsOpen(false)}
        onUpdateQty={cart.updateQty}
        onRemove={cart.remove}
      />
    </div>
  );
}

export default App;
