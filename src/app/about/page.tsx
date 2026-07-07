export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
        About SarcasmStack
      </h1>

      <div className="space-y-6 text-neutral-400 leading-relaxed">
        <p>
          SarcasmStack was born from a simple observation: the world needs more honesty
          printed on comfortable clothing. We are a team of developers, designers, and
          professional cynics who believe that what you wear should say what you are
          actually thinking.
        </p>

        <p>
          Every design starts as a joke in a Slack channel at 2 AM. If it still makes us
          laugh the next morning (and passes the would I actually wear this test),
          it goes into production. Quality humor deserves quality fabric.
        </p>

        <h2 className="text-2xl font-bold text-white pt-4">How It Works</h2>

        <p>
          We use Printify for print-on-demand, which means every item is made to order.
          No warehouses full of unsold existential dread - just fresh prints, shipped
          directly to your door. It is better for the planet and better for our anxiety.
        </p>

        <h2 className="text-2xl font-bold text-white pt-4">Our Promise</h2>

        <ul className="list-disc list-inside space-y-2">
          <li>Premium materials that survive more than one wash cycle</li>
          <li>Designs that make strangers smile (or roll their eyes, which is also valid)</li>
          <li>Carbon-neutral shipping because even sarcasm should be sustainable</li>
          <li>30-day returns if the humor does not land</li>
        </ul>
      </div>
    </div>
  );
}
