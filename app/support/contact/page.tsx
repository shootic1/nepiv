import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4 text-center">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Have a question about our products, your order, or just want to say hello? We're here to help.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-8 rounded-3xl boty-shadow text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Call Us</h3>
            <p className="text-sm text-muted-foreground mb-2">Mon-Fri, 10am - 5pm NPT</p>
            <a href="tel:+9779800000000" className="text-foreground hover:text-primary boty-transition">+977 980-0000000</a>
          </div>

          <div className="bg-card p-8 rounded-3xl boty-shadow text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Email Us</h3>
            <p className="text-sm text-muted-foreground mb-2">We aim to reply within 24 hours</p>
            <a href="mailto:hello@nepvic.com" className="text-foreground hover:text-primary boty-transition">hello@nepvic.com</a>
          </div>

          <div className="bg-card p-8 rounded-3xl boty-shadow text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Visit Us</h3>
            <p className="text-sm text-muted-foreground mb-2">HQ & Fulfillment Center</p>
            <span className="text-foreground">Kathmandu, Nepal</span>
          </div>
        </div>

        <div className="bg-card p-8 md:p-12 rounded-3xl boty-shadow">
          <h2 className="font-serif text-2xl text-foreground mb-6 text-center">Send a Message</h2>
          <form className="space-y-6 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="name">Name</label>
                <input type="text" id="name" className="w-full px-4 py-3 rounded-xl bg-background border border-border/40 focus:border-primary/60 outline-none boty-transition" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="email">Email</label>
                <input type="email" id="email" className="w-full px-4 py-3 rounded-xl bg-background border border-border/40 focus:border-primary/60 outline-none boty-transition" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2" htmlFor="subject">Subject</label>
              <select id="subject" className="w-full px-4 py-3 rounded-xl bg-background border border-border/40 focus:border-primary/60 outline-none boty-transition">
                <option>Order Inquiry</option>
                <option>Product Question</option>
                <option>Wholesale/Partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2" htmlFor="message">Message</label>
              <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-xl bg-background border border-border/40 focus:border-primary/60 outline-none boty-transition resize-none" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 boty-transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  )
}
