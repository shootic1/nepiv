import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

export default function IngredientsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4 text-center">Our Ingredients</h1>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          We believe in complete transparency. Here is a breakdown of the key active ingredients we use across the Nepvic range and why we chose them.
        </p>

        <div className="space-y-12">
          <div className="bg-card p-8 rounded-3xl boty-shadow">
            <h2 className="font-serif text-2xl text-foreground mb-2">Niacinamide (Vitamin B3)</h2>
            <p className="text-sm text-primary font-medium mb-4">Found in: Face Wash, Serum, Moisturizer</p>
            <p className="text-muted-foreground leading-relaxed">
              A powerhouse ingredient that builds keratin to keep skin firm and healthy. It helps your skin grow a ceramide barrier, which retains moisture. Niacinamide is excellent for minimizing pore appearance, regulating oil production, and protecting against sun damage and environmental stresses.
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl boty-shadow">
            <h2 className="font-serif text-2xl text-foreground mb-2">Vitamin C (Ascorbic Acid)</h2>
            <p className="text-sm text-primary font-medium mb-4">Found in: Face Wash</p>
            <p className="text-muted-foreground leading-relaxed">
              A potent antioxidant that neutralizes free radicals. Vitamin C aids in your skin's natural regeneration process, helping your body repair damaged skin cells. It inhibits melanin production, which helps to lighten hyperpigmentation and brown spots, even out skin tone, and enhance skin radiance.
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl boty-shadow">
            <h2 className="font-serif text-2xl text-foreground mb-2">Hyaluronic Acid</h2>
            <p className="text-sm text-primary font-medium mb-4">Found in: Sunscreen, Moisturizer</p>
            <p className="text-muted-foreground leading-relaxed">
              A naturally occurring substance in the skin known for its stunning capacity to attract and hold onto 1000x its weight in moisture. It works overtime by replenishing skin to enhance a healthy, supple look and feel.
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl boty-shadow">
            <h2 className="font-serif text-2xl text-foreground mb-2">Kojic Acid</h2>
            <p className="text-sm text-primary font-medium mb-4">Found in: Face Serum, Moisturizer</p>
            <p className="text-muted-foreground leading-relaxed">
              Derived from mushrooms, Kojic Acid is highly effective at fading sun damage, age spots, and scars. It works by blocking tyrosine from forming, which then prevents melanin production. Decreased melanin production has a lightening effect on the skin.
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl boty-shadow">
            <h2 className="font-serif text-2xl text-foreground mb-2">Squalane</h2>
            <p className="text-sm text-primary font-medium mb-4">Found in: Moisturizer</p>
            <p className="text-muted-foreground leading-relaxed">
              A lightweight, non-comedogenic oil that mimics your skin's natural oils. It provides excellent hydration without feeling heavy or greasy, making it perfect for all skin types, including acne-prone skin.
            </p>
          </div>
        </div>

        <div className="mt-16 p-8 bg-muted rounded-3xl text-center">
          <h3 className="font-serif text-xl text-foreground mb-4">The "No" List</h3>
          <p className="text-muted-foreground mb-6">
            What we leave out is just as important as what we put in. All Nepvic products are strictly free from:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Sulphates (SLS/SLES)", "Parabens", "Phthalates", "Mineral Oil", "Artificial Dyes", "Formaldehyde"].map(item => (
              <span key={item} className="px-4 py-2 bg-background rounded-full text-sm text-foreground border border-border/50">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
