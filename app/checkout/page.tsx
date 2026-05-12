"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Shield, Truck, RotateCcw, CheckCircle, Sparkles } from "lucide-react"
import { Header } from "@/components/boty/header"
import { nepvicProducts } from "@/lib/products"
import { Spinner } from "@/components/ui/spinner"

type Step = "contact" | "address" | "submitted"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const productIdParam = searchParams.get("product")
  const size = searchParams.get("size") || ""
  const qty = parseInt(searchParams.get("qty") || "1", 10)

  useEffect(() => {
    if (!productIdParam) {
      router.replace("/shop")
    }
  }, [productIdParam, router])

  const product = nepvicProducts.find(p => p.id === productIdParam) || nepvicProducts[0]
  const [quantity] = useState(qty)
  const [step, setStep] = useState<Step>("contact")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [showUnavailable, setShowUnavailable] = useState(false)

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

  const subtotal = product.price * quantity

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: "" }))

    // Auto-trigger unavailable popup as soon as pincode reaches 6 digits
    if (name === "pincode") {
      const digitsOnly = value.replace(/\D/g, "")
      if (digitsOnly.length === 6 && step === "address") {
        // Persist any address info collected so far (lead update) before showing the popup
        void submitAddress({ ...form, pincode: digitsOnly })
        setShowUnavailable(true)
      }
    }
  }

  // ---------- Step 1: Save Contact ----------
  const validateContact = () => {
    const newErrors: Partial<typeof form> = {}
    if (!form.firstName.trim()) newErrors.firstName = "Required"
    if (!form.lastName.trim()) newErrors.lastName = "Required"
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email required"
    if (!form.phone.trim() || form.phone.length < 7) newErrors.phone = "Valid phone required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
          productId: product.id,
          productName: product.name,
          size,
          quantity,
          unitPrice: product.price,
          subtotal,
        }),
      })
      const data = await res.json().catch(() => null)
      if (data?.id) setLeadId(data.id)
    } catch (err) {
      console.error("Contact submission failed", err)
    } finally {
      setIsSubmitting(false)
      setStep("address")
    }
  }

  // ---------- Step 2: Update Lead with Address ----------
  const submitAddress = async (addr: typeof form) => {
    if (!leadId) return
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          stage: "address",
          firstName: addr.firstName,
          lastName: addr.lastName,
          email: addr.email,
          phone: addr.phone,
          address: addr.address,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          productId: product.id,
          productName: product.name,
          size,
          quantity,
          unitPrice: product.price,
          subtotal,
        }),
      })
    } catch (err) {
      console.error("Address update failed", err)
    }
  }

  const handleAcknowledgeUnavailable = () => {
    setShowUnavailable(false)
    setStep("submitted")
  }

  // ---------- Submitted screen ----------
  if (step === "submitted") {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 pt-28 pb-20">
          <div className="max-w-lg w-full text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-4xl text-foreground mb-3">You&apos;re on the list!</h1>
            <p className="text-foreground/80 mb-2">
              Thank you, {form.firstName}. We&apos;ve saved your details for the {product.name}.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Nepvic is expanding fast. The moment we begin delivering to{" "}
              <span className="text-foreground font-medium">{form.city || "your area"}</span>, our
              team will personally reach out to you on{" "}
              <span className="text-foreground">{form.phone}</span> with an early-bird offer.
            </p>

            <div className="bg-card rounded-3xl p-6 boty-shadow mb-8 text-left">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/40">
                <div className="relative w-16 h-16 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{size ? `${size} · ` : ""}Qty {quantity}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                A confirmation will be sent to <span className="text-foreground">{form.email}</span>. No payment required at this time.
              </p>
            </div>

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

  // ---------- 2-step Form ----------
  const steps: { key: Step; label: string }[] = [
    { key: "contact", label: "Your Contact" },
    { key: "address", label: "Shipping Address" },
  ]
  const stepIndex = steps.findIndex(s => s.key === step)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Unavailable Popup */}
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
              We&apos;re not delivering to <span className="text-foreground font-medium">{form.pincode}</span> just yet
              {form.city ? <> ({form.city})</> : null}.
            </p>
            <p className="text-muted-foreground text-center mb-6 leading-relaxed">
              You&apos;re officially on our early-access list. As soon as we expand
              to your area, our team will personally reach out to{" "}
              <span className="text-foreground">{form.phone}</span> with an
              exclusive early-bird offer on the {product.name}.
            </p>
            <button
              type="button"
              onClick={handleAcknowledgeUnavailable}
              className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 boty-shadow"
            >
              Got it — keep me posted
            </button>
          </div>
        </div>
      )}

      <div className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Back */}
          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground boty-transition mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to product
          </Link>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-10">
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
                  <span className="hidden sm:block">{s.label}</span>
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
                  <h2 className="font-serif text-2xl text-foreground mb-2">Your Contact</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Quick details so we can reach out when delivery opens in your area.
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
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === "address" && (
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-2">Shipping Address</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Where should we deliver your {product.name} once we launch in your area?
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
                    <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                    Your details are kept private and only used to notify you when we launch in your area.
                  </div>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="bg-card rounded-3xl p-6 boty-shadow sticky top-28">
              <h3 className="font-serif text-xl text-foreground mb-5">Order Summary</h3>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/40">
                <div className="relative w-20 h-20 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-medium">
                    {quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm leading-snug">{product.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{size}</p>
                </div>
                <span className="font-medium text-foreground text-sm">Rs. {product.price * quantity}</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-3 border-t border-border/40">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">Rs. {subtotal}</span>
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
