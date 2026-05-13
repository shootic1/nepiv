import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8 text-center">Privacy Policy</h1>
        
        <div className="prose prose-lg prose-stone mx-auto text-muted-foreground">
          <p className="text-sm mb-8">Last Updated: May 2026</p>

          <p className="mb-6">
            At Nepvic Nepal ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (www.nepvic.com) or purchase our products.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li><strong>Contact Information:</strong> Name, email address, and phone number.</li>
            <li><strong>Shipping Information:</strong> Delivery address, city, province, and postal code.</li>
            <li><strong>Payment Information:</strong> Payment method preferences (eSewa, Khalti, COD). Note: We do not store your actual wallet passwords or bank details; transactions are processed securely by our payment partners.</li>
            <li><strong>Communication Data:</strong> Records of your interactions with our customer support team.</li>
          </ul>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the collected information to:</p>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>Process and fulfill your orders.</li>
            <li>Communicate with you regarding your order status, delivery updates, and customer support inquiries.</li>
            <li>Notify you when we launch delivery services in your area (if you joined our waitlist).</li>
            <li>Improve our website, products, and services.</li>
            <li>Send promotional offers and updates (only if you have opted in).</li>
          </ul>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">3. Data Sharing and Disclosure</h2>
          <p className="mb-6">
            We do not sell, trade, or rent your personal information to third parties. We may share your data with trusted service providers who assist us in operating our website, conducting our business, or servicing you (such as courier companies for delivery), so long as those parties agree to keep this information confidential.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">4. Data Security</h2>
          <p className="mb-6">
            We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Our website uses 256-bit SSL encryption to secure data transmission.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">5. Your Rights</h2>
          <p className="mb-6">
            You have the right to request access to, correction of, or deletion of your personal data held by us. To exercise these rights, please contact us at privacy@nepvic.com.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">6. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />Email: privacy@nepvic.com
            <br />Phone: +977 980-0000000
            <br />Address: Kathmandu, Nepal
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
