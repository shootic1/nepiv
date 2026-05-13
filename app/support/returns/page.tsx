import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8 text-center">Returns & Refunds</h1>
        
        <div className="prose prose-lg prose-stone mx-auto text-muted-foreground">
          <p className="lead text-xl text-foreground font-medium mb-8">
            We want you to love your Nepvic products. If you are not entirely satisfied with your purchase, we're here to help.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">7-Day Return Policy</h2>
          <p className="mb-6">
            We accept returns within 7 days of the delivery date. To be eligible for a return, your item must be unused, unopened, and in the same condition that you received it. It must also be in the original packaging with all seals intact.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">Damaged or Defective Items</h2>
          <p className="mb-6">
            If you receive a damaged, defective, or incorrect item, please contact us immediately at <a href="mailto:support@nepvic.com" className="text-primary hover:underline">support@nepvic.com</a> with photos of the product and packaging. We will arrange for a replacement to be sent to you at no additional cost.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">How to Initiate a Return</h2>
          <ol className="list-decimal pl-5 space-y-4 mb-6">
            <li>Email us at <a href="mailto:support@nepvic.com" className="text-primary hover:underline">support@nepvic.com</a> with your Order ID and reason for return.</li>
            <li>Our team will review your request and provide you with a Return Authorization (RA) number and shipping instructions.</li>
            <li>Pack the item securely and hand it over to our pickup partner (in Kathmandu Valley) or ship it to our facility via a trackable courier service.</li>
          </ol>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">Refunds</h2>
          <p className="mb-6">
            Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed to your original method of payment (eSewa/Khalti) or via bank transfer for COD orders within 5-7 business days.
          </p>
          <p className="text-sm italic">
            Please note: Original shipping charges are non-refundable. If you receive a refund, the cost of return shipping (if applicable) will be deducted from your refund.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
