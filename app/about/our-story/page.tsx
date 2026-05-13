import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import Image from "next/image"

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8 text-center">Our Story</h1>
        
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden mb-12 bg-muted">
          <Image 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image%20Generation%20Remix%20from%20Sora%20%281%29-tspMuIyqcNzajDr0TUPUPc7gTThYnY.png" 
            alt="Nepvic Skincare" 
            fill 
            className="object-cover"
          />
        </div>

        <div className="prose prose-lg prose-stone mx-auto text-muted-foreground">
          <p className="lead text-xl text-foreground font-medium mb-8">
            Nepvic was born from a simple realization: the skincare products available in Nepal were either imported and prohibitively expensive, or affordable but filled with harsh chemicals like sulphates and parabens.
          </p>
          
          <p className="mb-6">
            We set out to change that. Our mission is to create premium, science-backed skincare that is accessible to everyone in Nepal. We believe that taking care of your skin shouldn't require compromising on quality or breaking the bank.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">Formulated for Our Climate</h2>
          <p className="mb-6">
            Nepal's unique geography—from the dusty streets of Kathmandu to the intense UV exposure in higher altitudes—demands specific skincare solutions. We formulate our products with these environmental factors in mind. Our SPF 50 sunscreen provides robust protection against high-altitude sun, while our cleansers are designed to gently remove urban pollution without stripping the skin barrier.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">Clean, Transparent, Effective</h2>
          <p className="mb-6">
            Every Nepvic product is proudly free from sulphates, parabens, and artificial dyes. Instead, we use proven active ingredients like Niacinamide, Vitamin C, and Hyaluronic Acid at effective concentrations. We are completely transparent about what goes into our bottles because you deserve to know exactly what you're putting on your skin.
          </p>

          <div className="bg-card p-8 rounded-3xl boty-shadow mt-12 text-center">
            <h3 className="font-serif text-xl text-foreground mb-3">Join the Nepvic Journey</h3>
            <p className="text-sm mb-6">Experience skincare made thoughtfully for you.</p>
            <a href="/shop" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm boty-transition hover:bg-primary/90">
              Explore Our Products
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
