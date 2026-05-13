"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Shield, Truck, RotateCcw, CheckCircle, Sparkles, Banknote, Wallet } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Spinner } from "@/components/ui/spinner"
import { useCart } from "@/components/boty/cart-context"
import { nepvicProducts } from "@/lib/products"

type Step = "contact" | "address" | "payment" | "submitted"
type PaymentMethod = "cod" | "esewa" | "khalti"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items: cartItems, subtotal: cartSubtotal, itemCount, clearCart } = useCart()

  // Optional single-product fallback (for "Buy Now" links from product page)
  const buyNowProductId = searchParams.get("product")
  const buyNowSize = searchParams.get("size") || ""
  const buyNowQty = parseInt(searchParams.get("qty") || "1", 10)
  const buyNowProduct = buyNowProductId ? nepvicProducts.find(p => p.id === buyNowProductId) : null

  // Build the active item list (cart OR single buy-now product)
  type LineItem = {
    id: string
    name: string
    image: string
    size?: string
    quantity: number
    unitPrice: number
  }

  const lineItems: LineItem[] = (() => {
    if (cartItems.length > 0) {
      return cartItems.map(ci => ({
        id: ci.id,
        name: ci.name,
        image: ci.image,
        quantity: ci.quantity,
        unitPrice: ci.price,
        size: ci.description,
      }))
    }
    if (buyNowProduct) {
      return [{
        id: buyNowProduct.id,
        name: buyNowProduct.name,
        image: buyNowProduct.image,
        quantity: buyNowQty,
        unitPrice: buyNowProduct.price,
        size: buyNowSize,
      }]
    }
    return []
  })()

  const subtotal = cartItems.length > 0
    ? cartSubtotal
    : lineItems.reduce((s, l) => s + l.unitPrice * l.quantity, 0)

  const totalQty = cartItems.length > 0
    ? itemCount
    : lineItems.reduce((s, l) => s + l.quantity, 0)

  // Redirect if completely empty
  useEffect(() => {
    // Slight delay to allow cart hydration from localStorage
    const t = setTimeout(() => {
      if (lineItems.length === 0) {
        router.replace("/shop")
      }
    }, 600)
    return () => clearTimeout(t)
  }, [lineItems.length, router])

  const [step, setStep] = useState<Step>("contact")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [showUnavailable, setShowUnavailable] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod")

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const itemsPayload = lineItems.map(l => ({
    productId: l.id,
    productName: l.name,
    size: l.size || "",
    quantity: l.quantity,
    unitPrice: l.unitPrice,
    lineTotal: l.unitPrice * l.quantity,
  }))

  // ---------- Step 1 -> Save Contact ----------
  const validateContact = () => {
    const e: Partial<typeof form> = {}
    if (!form.firstName.trim()) e.firstName = "Required"
    if (!form.lastName.trim()) e.lastName = "Required"
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required"
    if (!form.phone.trim() || form.phone.length < 7) e.phone = "Valid phone required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submitContact = async () => {
    if (!validateContact()) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "contact",
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          items: itemsPayload,
          itemCount: totalQty,
          subtotal,
        }),
      })
      const data = await res.json().catch(() => null)
      if (data?.id) setLeadId(data.id)
    } catch (err) {
      console.error("Step 1 failed", err)
    } finally {
      setIsSubmitting(false)
      setStep("address")
    }
  }

  // ---------- Step 2 -> Save Address ----------
  const validateAddress = () => {
    const e: Partial<typeof form> = {}
    if (!form.address.trim()) e.address = "Required"
    if (!form.city.trim()) e.city = "Required"
    if (!form.state.trim()) e.state = "Required"
    if (!form.pincode.trim() || form.pincode.replace(/\D/g, "").length < 5) e.pincode = "Valid pincode required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submitAddress = async () => {
    if (!validateAddress()) return
    setIsSubmitting(true)
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          stage: "address",
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          items: itemsPayload,
          itemCount: totalQty,
          subtotal,
        }),
      })
    } catch (err) {
      console.error("Step 2 failed", err)
    } finally {
      setIsSubmitting(false)
      setStep("payment")
    }
  }

  // ---------- Step 3 -> Save Payment intent + show modal ----------
  const placeOrder = async () => {
    setIsSubmitting(true)
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          stage: "payment",
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          paymentMethod,
          items: itemsPayload,
          itemCount: totalQty,
          subtotal,
        }),
      })
    } catch (err) {
      console.error("Step 3 failed", err)
    } finally {
      setIsSubmitting(false)
      setShowUnavailable(true)
    }
  }

  const handleAcknowledge = () => {
    setShowUnavailable(false)
    // Optionally clear cart after acknowledgement
    try { clearCart() } catch {}
    setStep("submitted")
  }

  // ---------- Submitted ----------
  if (step === "submitted") {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 pt-28 pb-20">
          <div className="max-w-lg w-full text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-4xl text-foreground mb-3">You&apos;re on our priority list, {form.firstName}!</h1>
            <p className="text-foreground/80 mb-2">
              We&apos;ve saved your order details and shipping address.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our team will personally call you on{" "}
              <span className="text-foreground">{form.phone}</span> within 24 hours
              the moment we begin delivering to{" "}
              <span className="text-foreground font-medium">{form.city || "your area"}</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full text-sm bg-primary text-primary-foreground boty-transition hover:bg-primary/90"
              >
                Continue Browsing
              </Link>
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full text-sm border border-foreground/20 text-foreground boty-transition hover:bg-foreground/5"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ---------- 3-step Form ----------
  const steps: { key: Step; label: string }[] = [
    { key: "contact", label: "Contact" },
    { key: "address", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ]
  const stepIndex = steps.findIndex(s => s.key === step)

  const paymentLabels: Record<PaymentMethod, string> = {
    cod: "Cash on Delivery",
    esewa: "eSewa",
    khalti: "Khalti",
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Unavailable Popup (only on Place Order) */}
      {showUnavailable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 animate-in fade-in duration-200">
          <div className="bg-background rounded-3xl max-w-md w-full p-8 boty-shadow animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl text-foreground text-center mb-3">
              We&apos;re launching here soon
            </h2>
            <p className="text-muted-foreground text-center mb-2 leading-relaxed">
              Unfortunately we&apos;re not delivering to{" "}
              <span className="text-foreground font-medium">{form.city || form.pincode}</span> just yet.
            </p>
            <p className="text-muted-foreground text-center mb-6 leading-relaxed">
              Your order is saved as a priority. Our team will personally call{" "}
              <span className="text-foreground">{form.phone}</span> within 24 hours
              the moment we expand to your area &mdash; with an exclusive early-bird offer.
            </p>
            <button
              type="button"
              onClick={handleAcknowledge}
              className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 boty-shadow"
            >
              Got it &mdash; keep me posted
            </button>
          </div>
        </div>
      )}

      <div className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground boty-transition mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to shop
          </Link>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-10 flex-wrap">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    i <= stepIndex ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      i < stepIndex
                        ? "bg-primary text-primary-foreground"
                        : i === stepIndex
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < stepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-px transition-colors ${i < stepIndex ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Left: Form */}
            <div className="bg-card rounded-3xl p-8 boty-shadow">
              {step === "contact" && (
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-2">Contact Information</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    We&apos;ll use these details for order updates and delivery.
                  </p>
                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} placeholder="Priya" />
                      <FormField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} placeholder="Sharma" />
                    </div>
                    <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="priya@example.com" />
                    <FormField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="9841234567" maxLength={10} />
                  </div>
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={submitContact}
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 disabled:opacity-70 boty-shadow"
                    >
                      {isSubmitting ? "Saving..." : "Continue to shipping"}
                    </button>
                  </div>
                </div>
              )}

              {step === "address" && (
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-2">Shipping Address</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Where should we deliver your order?
                  </p>
                  <div className="space-y-5">
                    <FormField label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="House no., Tole, Ward" />
                    <div className="grid sm:grid-cols-3 gap-5">
                      <FormField label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="Kathmandu" />
                      <FormField label="Province" name="state" value={form.state} onChange={handleChange} error={errors.state} placeholder="Bagmati" />
                      <FormField label="Postal Code" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} placeholder="44600" maxLength={6} />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
                    <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                    Free shipping across Nepal on orders above Rs. 999.
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("contact")}
                      className="sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full text-sm border border-foreground/20 text-foreground boty-transition hover:bg-foreground/5"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={submitAddress}
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 disabled:opacity-70 boty-shadow"
                    >
                      {isSubmitting ? "Saving..." : "Continue to payment"}
                    </button>
                  </div>
                </div>
              )}

              {step === "payment" && (
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-2">Payment Method</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choose how you&apos;d like to pay. All options are secure.
                  </p>
                  <div className="space-y-3">
                    <PaymentOption
                      id="cod"
                      checked={paymentMethod === "cod"}
                      onSelect={setPaymentMethod}
                      icon={<Banknote className="w-5 h-5 text-primary" />}
                      title="Cash on Delivery"
                      description="Pay in cash when your order arrives. No advance required."
                      badge="Most Popular"
                    />
                    <PaymentOption
                      id="esewa"
                      checked={paymentMethod === "esewa"}
                      onSelect={setPaymentMethod}
                      icon={<Wallet className="w-5 h-5 text-primary" />}
                      title="eSewa"
                      description="Pay instantly via your eSewa wallet."
                    />
                    <PaymentOption
                      id="khalti"
                      checked={paymentMethod === "khalti"}
                      onSelect={setPaymentMethod}
                      icon={<Wallet className="w-5 h-5 text-primary" />}
                      title="Khalti"
                      description="Pay instantly via your Khalti wallet."
                    />
                  </div>

                  <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                    Your information is protected by 256-bit SSL encryption.
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("address")}
                      className="sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full text-sm border border-foreground/20 text-foreground boty-transition hover:bg-foreground/5"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={placeOrder}
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 disabled:opacity-70 boty-shadow"
                    >
                      {isSubmitting ? "Placing order..." : `Place Order \u00b7 Rs. ${subtotal}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="bg-card rounded-3xl p-6 boty-shadow lg:sticky lg:top-28">
              <h3 className="font-serif text-xl text-foreground mb-5">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-border/40 max-h-80 overflow-y-auto pr-1">
                {lineItems.map(li => (
                  <div key={li.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                      <Image src={li.image} alt={li.name} fill className="object-contain p-1.5" sizes="56px" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
                        {li.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm leading-snug truncate">{li.name}</p>
                      {li.size && <p className="text-xs text-muted-foreground mt-0.5 truncate">{li.size}</p>}
                    </div>
                    <span className="font-medium text-foreground text-sm whitespace-nowrap">Rs. {li.unitPrice * li.quantity}</span>
                  </div>
                ))}
                {lineItems.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Your cart is empty.</p>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})</span>
                  <span className="text-foreground">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{subtotal >= 999 ? "Free" : "Rs. 100"}</span>
                </div>
                {step === "payment" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="text-foreground">{paymentLabels[paymentMethod]}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base pt-3 border-t border-border/40">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">Rs. {subtotal + (subtotal >= 999 ? 0 : 100)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/40 space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                  Secure 256-bit SSL encryption
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                  Free shipping above Rs. 999
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <RotateCcw className="w-4 h-4 text-primary flex-shrink-0" />
                  7-day easy returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  )
}

function FormField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  maxLength
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  type?: string
  maxLength?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-xl bg-background border text-foreground text-sm placeholder:text-muted-foreground/50 boty-transition outline-none focus:ring-2 focus:ring-primary/30 ${
          error ? "border-red-400" : "border-border/40 focus:border-primary/60"
        }`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function PaymentOption({
  id,
  checked,
  onSelect,
  icon,
  title,
  description,
  badge,
}: {
  id: PaymentMethod
  checked: boolean
  onSelect: (m: PaymentMethod) => void
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
}) {
  return (
    <label
      htmlFor={`pay-${id}`}
      className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer boty-transition ${
        checked ? "border-primary bg-primary/5" : "border-border/40 hover:border-foreground/30"
      }`}
    >
      <input
        type="radio"
        id={`pay-${id}`}
        name="payment-method"
        value={id}
        checked={checked}
        onChange={() => onSelect(id)}
        className="mt-1 h-4 w-4 accent-primary"
      />
      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-foreground text-sm">{title}</span>
          {badge && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
    </label>
  )
}
