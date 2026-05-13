import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

export default function SustainabilityPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8 text-center">Sustainability</h1>
        
        <div className="prose prose-lg prose-stone mx-auto text-muted-foreground">
          <p className="lead text-xl text-foreground font-medium mb-8 text-center">
            At Nepvic, we believe that caring for your skin shouldn't come at the expense of our environment. We are committed to making responsible choices at every step of our production process.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card p-8 rounded-3xl boty-shadow">
              <h3 className="font-serif text-xl text-foreground mb-3">Eco-Friendly Packaging</h3>
              <p className="text-sm leading-relaxed">
                We are actively transitioning our packaging to more sustainable materials. Our outer cartons are made from recycled paper, and we are working towards 100% recyclable primary packaging by 2027. We encourage our customers to recycle their empty Nepvic bottles.
              </p>
            </div>

            <div className="bg-card p-8 rounded-3xl boty-shadow">
              <h3 className="font-serif text-xl text-foreground mb-3">Cruelty-Free</h3>
              <p className="text-sm leading-relaxed">
                We love animals. Nepvic products are never tested on animals, and we do not source ingredients from suppliers who test on animals. We are committed to remaining 100% cruelty-free forever.
              </p>
            </div>

            <div className="bg-card p-8 rounded-3xl boty-shadow">
              <h3 className="font-serif text-xl text-foreground mb-3">Responsible Sourcing</h3>
              <p className="text-sm leading-relaxed">
                We carefully select our suppliers to ensure that our ingredients are ethically sourced. We prioritize partners who share our commitment to environmental stewardship and fair labor practices.
              </p>
            </div>

            <div className="bg-card p-8 rounded-3xl boty-shadow">
              <h3 className="font-serif text-xl text-foreground mb-3">Local Focus</h3>
              <p className="text-sm leading-relaxed">
                By manufacturing and distributing primarily within Nepal, we significantly reduce the carbon footprint associated with international shipping and long-distance logistics.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="italic">
              "Sustainability is a journey, not a destination. We are constantly looking for ways to improve and reduce our environmental impact."
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
