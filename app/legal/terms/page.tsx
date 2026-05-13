import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8 text-center">Terms of Service</h1>
        
        <div className="prose prose-lg prose-stone mx-auto text-muted-foreground">
          <p className="text-sm mb-8">Last Updated: May 2026</p>

          <p className="mb-6">
            Welcome to Nepvic. These Terms of Service ("Terms") govern your access to and use of the Nepvic website (www.nepvic.com) and the purchase of our products. By accessing our website or purchasing our products, you agree to be bound by these Terms.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">1. General Conditions</h2>
          <p className="mb-6">
            By agreeing to these Terms, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose, nor may you, in the use of the Service, violate any laws in your jurisdiction.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">2. Products and Pricing</h2>
          <p className="mb-6">
            All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time. We have made every effort to display as accurately as possible the colors and images of our products that appear on the store.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">3. Accuracy of Billing and Account Information</h2>
          <p className="mb-6">
            We reserve the right to refuse any order you place with us. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and phone number, so that we can complete your transactions and contact you as needed.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">4. Medical Disclaimer</h2>
          <p className="mb-6">
            The products and claims made about specific products on or through this site have not been evaluated by the Department of Drug Administration (DDA) Nepal and are not intended to diagnose, treat, cure, or prevent disease. The information provided on this site is for informational purposes only and is not intended as a substitute for advice from your physician or other health care professional.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">5. Intellectual Property</h2>
          <p className="mb-6">
            All content included on this site, such as text, graphics, logos, images, and software, is the property of Nepvic Nepal or its content suppliers and protected by international copyright laws.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">6. Governing Law</h2>
          <p className="mb-6">
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Nepal.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">7. Contact Information</h2>
          <p className="mb-6">
            Questions about the Terms of Service should be sent to us at legal@nepvic.com.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
