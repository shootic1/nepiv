import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8 text-center">Shipping Policy</h1>
        
        <div className="prose prose-lg prose-stone mx-auto text-muted-foreground">
          <p className="lead text-xl text-foreground font-medium mb-8">
            We strive to get your Nepvic products to you as quickly and safely as possible. Here is everything you need to know about our shipping process within Nepal.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">Delivery Areas & Timelines</h2>
          <div className="bg-card rounded-2xl overflow-hidden boty-shadow mb-8">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-medium text-foreground">Region</th>
                  <th className="px-6 py-4 font-medium text-foreground">Estimated Time</th>
                  <th className="px-6 py-4 font-medium text-foreground">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr>
                  <td className="px-6 py-4">Kathmandu Valley (KTM, Lalitpur, Bhaktapur)</td>
                  <td className="px-6 py-4">1 - 2 Business Days</td>
                  <td className="px-6 py-4">Rs. 100 (Free over Rs. 999)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Major Cities (Pokhara, Chitwan, Butwal, etc.)</td>
                  <td className="px-6 py-4">3 - 4 Business Days</td>
                  <td className="px-6 py-4">Rs. 150 (Free over Rs. 999)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Other Regions</td>
                  <td className="px-6 py-4">5 - 7 Business Days</td>
                  <td className="px-6 py-4">Rs. 200</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">Order Processing</h2>
          <p className="mb-6">
            Orders placed before 2:00 PM NPT on business days (Sunday to Friday) are processed and dispatched the same day. Orders placed after 2:00 PM or on Saturdays/Public Holidays will be processed the next business day.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">Tracking Your Order</h2>
          <p className="mb-6">
            Once your order is dispatched, you will receive an SMS with a tracking link. Our delivery partners will also call you on the day of delivery to confirm your availability.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">Failed Deliveries</h2>
          <p className="mb-6">
            Our delivery partners will attempt to deliver your package up to 3 times. If you are unreachable or unavailable after 3 attempts, the package will be returned to our facility, and the order will be cancelled.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
