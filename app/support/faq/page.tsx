import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-12 text-center">Frequently Asked Questions</h1>

        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-2xl text-foreground mb-6 border-b border-border/50 pb-2">Products & Ingredients</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-2">Are your products suitable for sensitive skin?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Yes. We formulate without harsh sulphates, parabens, or artificial fragrances. However, everyone's skin is different. We always recommend doing a patch test on your inner arm 24 hours before using a new product on your face.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Are Nepvic products pregnancy safe?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Most of our products are safe for use during pregnancy and nursing. However, we always advise consulting with your healthcare provider before introducing new skincare products during pregnancy.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Do you test on animals?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Never. We are proudly 100% cruelty-free.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-6 border-b border-border/50 pb-2">Orders & Payment</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">We currently accept Cash on Delivery (COD), eSewa, and Khalti. You can select your preferred method during checkout.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Can I modify or cancel my order?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">If you need to change or cancel your order, please contact us at hello@nepvic.com or call us within 2 hours of placing the order. Once an order has been dispatched, it cannot be modified.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-6 border-b border-border/50 pb-2">Shipping & Delivery</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-2">Where do you deliver?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">We currently deliver to major cities across Nepal, including Kathmandu Valley, Pokhara, Chitwan, Butwal, and Biratnagar. We are constantly expanding our delivery network.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">How long does delivery take?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Inside Kathmandu Valley: 1-2 business days. Outside Kathmandu Valley: 3-5 business days depending on the location.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">Still have questions?</p>
          <a href="/support/contact" className="text-primary hover:underline mt-2 inline-block">Contact our support team</a>
        </div>
      </div>
      <Footer />
    </main>
  )
}
