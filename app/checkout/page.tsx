"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Shield, Truck, RotateCcw, CheckCircle, ChevronDown } from "lucide-react"
import { Header } from "@/components/boty/header"
import { nepvicProducts } from "@/lib/products"
import { Spinner } from "@/components/ui/spinner"

type Step = "information" | "shipping" | "payment" | "confirmed"

const shippingOptions = [
  { id: "standard", label: "Standard Delivery", description: "3-5 business days across Nepal", price: 0 },
  { id: "express", label: "Express Delivery", description: "1-2 business days (Kathmandu Valley)", price: 150 }
]

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
  const [step, setStep] = useState<Step>("information")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    upi: ""
  })
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card")
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const selectedShipping = shippingOptions.find(o => o.id === shippingMethod)!
  const subtotal = product.price * quantity
  const total = subtotal + selectedShipping.price

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: "" }))
  }

  const validateInfo = () => {
    const newErrors: Partial<typeof form> = {}
    if (!form.firstName.trim()) newErrors.firstName = "Required"
    if (!form.lastName.trim()) newErrors.lastName = "Required"
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email required"
    if (!form.phone.trim() || form.phone.length < 10) newErrors.phone = "Valid phone required"
    if (!form.address.trim()) newErrors.address = "Required"
    if (!form.city.trim()) newErrors.city = "Required"
    if (!form.state.trim()) newErrors.state = "Required"
    if (!form.pincode.trim() || form.pincode.length !== 6) newErrors.pincode = "Valid 6-digit pincode required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePayment = () => {
    const newErrors: Partial<typeof form> = {}
    if (paymentMethod === "card") {
      if (!form.cardNumber.trim() || form.cardNumber.replace(/\s/g, "").length < 16) newErrors.cardNumber = "Valid card number required"
      if (!form.cardName.trim()) newErrors.cardName = "Required"
      if (!form.expiry.trim()) newErrors.expiry = "Required"
      if (!form.cvv.trim() || form.cvv.length < 3) newErrors.cvv = "Required"
    } else if (paymentMethod === "upi") {
      if (!form.upi.trim() || !form.upi.includes("@")) newErrors.upi = "Valid UPI ID required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === "information") {
      if (validateInfo()) setStep("shipping")
    } else if (step === "shipping") {
      setStep("payment")
    } else if (step === "payment") {
      if (validatePayment()) {
        setIsSubmitting(true)
        setTimeout(() => {
          setIsSubmitting(false)
          setStep("confirmed")
        }, 1800)
      }
    }
  }

  const formatCard = (val: string) => {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
  }

  const formatExpiry = (val: string) => {
    return val.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2")
  }

  const steps: { key: Step; label: string }[] = [
    { key: "information", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" }
  ]

  const stepIndex = steps.findIndex(s => s.key === step)

  if (step === "confirmed") {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 pt-28 pb-20">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-4xl text-foreground mb-3">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">
              Thank you, {form.firstName}. Your order has been placed successfully.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              A confirmation has been sent to <span className="text-foreground">{form.email}</span>
            </p>

            {/* Order Summary Card */}
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
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{selectedShipping.price === 0 ? "Free" : `Rs. ${selectedShipping.price}`}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-border/40">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">Rs. {total}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/40 text-sm text-muted-foreground">
                <p>Delivering to: {form.address}, {form.city}, {form.state} - {form.pincode}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full text-sm bg-primary text-primary-foreground boty-transition hover:bg-primary/90"
              >
                Continue Shopping
              </Link>
              <Link
                href="/shop"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full text-sm border border-foreground/20 text-foreground boty-transition hover:bg-foreground/5"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

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
              {/* STEP 1: Information */}
              {step === "information" && (
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-6">Contact & Shipping Information</h2>
                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} placeholder="Priya" />
                      <FormField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} placeholder="Sharma" />
                    </div>
                    <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="priya@example.com" />
                    <FormField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="9841234567" maxLength={10} />
                    <FormField label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="House no., Tole, Ward" />
                    <div className="grid sm:grid-cols-3 gap-5">
                      <FormField label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="Kathmandu" />
                      <FormField label="Province" name="state" value={form.state} onChange={handleChange} error={errors.state} placeholder="Bagmati" />
                      <FormField label="Postal Code" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} placeholder="44600" maxLength={6} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Shipping */}
              {step === "shipping" && (
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-6">Shipping Method</h2>
                  <div className="space-y-4">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer boty-transition ${
                          shippingMethod === option.id
                            ? "border-primary bg-primary/5"
                            : "border-border/40 hover:border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={shippingMethod === option.id}
                          onChange={() => setShippingMethod(option.id)}
                          className="accent-primary w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        <span className="font-medium text-foreground">
                          {option.price === 0 ? "Free" : `Rs. ${option.price}`}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-8 p-5 rounded-2xl bg-background border border-border/40">
                    <h3 className="text-sm font-medium text-foreground mb-3">Delivering to</h3>
                    <p className="text-sm text-muted-foreground">
                      {form.firstName} {form.lastName}<br />
                      {form.address}, {form.city}, {form.state} - {form.pincode}<br />
                      {form.phone}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep("information")}
                      className="text-sm text-primary mt-2 hover:underline"
                    >
                      Change address
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment */}
              {step === "payment" && (
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-6">Payment</h2>

                  {/* Payment Method Tabs */}
                  <div className="flex gap-3 mb-6">
                    {(["card", "upi", "cod"] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`flex-1 py-3 rounded-full text-sm font-medium boty-transition ${
                          paymentMethod === method
                            ? "bg-foreground text-background"
                            : "bg-background border border-border/40 text-foreground/70 hover:text-foreground"
                        }`}
                      >
                        {method === "card" ? "Card" : method === "upi" ? "eSewa/Khalti" : "Cash on Delivery"}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-5">
                      <FormField
                        label="Card Number"
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={(e) => setForm(prev => ({ ...prev, cardNumber: formatCard(e.target.value) }))}
                        error={errors.cardNumber}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      <FormField label="Name on Card" name="cardName" value={form.cardName} onChange={handleChange} error={errors.cardName} placeholder="Priya Sharma" />
                      <div className="grid grid-cols-2 gap-5">
                        <FormField
                          label="Expiry Date"
                          name="expiry"
                          value={form.expiry}
                          onChange={(e) => setForm(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                          error={errors.expiry}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        <FormField label="CVV" name="cvv" value={form.cvv} onChange={handleChange} error={errors.cvv} placeholder="123" maxLength={4} />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-5">
                      <FormField
                        label="eSewa / Khalti Mobile Number"
                        name="upi"
                        value={form.upi}
                        onChange={handleChange}
                        error={errors.upi}
                        placeholder="9841234567"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your eSewa or Khalti registered mobile number for payment link
                      </p>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div className="p-5 rounded-2xl bg-background border border-border/40 text-sm text-muted-foreground">
                      Pay cash when your order arrives at your door. An additional handling fee of Rs. 50 may apply for COD orders.
                    </div>
                  )}

                  {/* Security badges */}
                  <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border/40">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 text-primary" />
                      SSL Secured
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="w-4 h-4 text-primary" />
                      Fast Delivery
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <RotateCcw className="w-4 h-4 text-primary" />
                      Easy Returns
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 disabled:opacity-70 boty-shadow"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing...
                    </span>
                  ) : step === "information" ? (
                    "Continue to Shipping"
                  ) : step === "shipping" ? (
                    "Continue to Payment"
                  ) : (
                    `Place Order · Rs. ${total}`
                  )}
                </button>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="bg-card rounded-3xl p-6 boty-shadow sticky top-28">
              <h3 className="font-serif text-xl text-foreground mb-5">Order Summary</h3>

              {/* Product */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/40">
                <div className="relative w-20 h-20 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
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

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {selectedShipping.price === 0 ? "Free" : `Rs. ${selectedShipping.price}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-3 border-t border-border/40">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">Rs. {total}</span>
                </div>
              </div>

              {/* Trust badges */}
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
