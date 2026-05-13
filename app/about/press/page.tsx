import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

export default function PressPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8 text-center">Press & Media</h1>
        
        <div className="text-center mb-16">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            For press inquiries, high-resolution images, or product samples for review, please contact our PR team at <a href="mailto:press@nepvic.com" className="text-primary hover:underline">press@nepvic.com</a>.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-card p-8 rounded-3xl boty-shadow flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-full md:w-1/3 text-center md:text-left">
              <span className="text-sm text-muted-foreground uppercase tracking-wider">Coming Soon</span>
              <h3 className="font-serif text-xl text-foreground mt-2">Vogue Nepal</h3>
            </div>
            <div className="w-full md:w-2/3">
              <p className="text-muted-foreground italic">
                "Nepvic is set to disrupt the local skincare market with formulations that actually make sense for the Himalayan climate."
              </p>
            </div>
          </div>

          <div className="bg-card p-8 rounded-3xl boty-shadow flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-full md:w-1/3 text-center md:text-left">
              <span className="text-sm text-muted-foreground uppercase tracking-wider">Coming Soon</span>
              <h3 className="font-serif text-xl text-foreground mt-2">Kathmandu Post</h3>
            </div>
            <div className="w-full md:w-2/3">
              <p className="text-muted-foreground italic">
                "Finally, a homegrown brand that prioritizes active ingredients over marketing fluff. The new SPF 50 is a must-have."
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 p-8 bg-muted rounded-3xl text-center">
          <h3 className="font-serif text-xl text-foreground mb-4">Brand Assets</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Download our media kit including logos, product shots, and brand guidelines.
          </p>
          <button className="px-6 py-3 rounded-full bg-background text-foreground border border-border/50 hover:border-foreground/40 boty-transition text-sm">
            Download Media Kit (ZIP)
          </button>
        </div>
      </div>
      <Footer />
    </main>
  )
}
