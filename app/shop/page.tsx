"use client"

import { useState, useEffect, useRef, Suspense, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { nepvicProducts } from "@/lib/products"
import { useCart } from "@/components/boty/cart-context"
import { Spinner } from "@/components/ui/spinner"

type CategoryKey = "all" | "serums" | "moisturizers" | "cleansers" | "sunscreen" | "gift-sets"

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  all: "All Products",
  serums: "Serums",
  moisturizers: "Moisturizers",
  cleansers: "Cleansers",
  sunscreen: "Sunscreen",
  "gift-sets": "Gift Sets",
}

const CATEGORY_TAGLINE: Record<CategoryKey, string> = {
  all: "Discover our complete range of natural skincare essentials",
  serums: "Targeted formulas with Niacinamide, Kojic Acid and Vitmalide Oil",
  moisturizers: "Lightweight, deeply hydrating moisturizers for all skin types",
  cleansers: "Brightening face washes that respect your skin barrier",
  sunscreen: "Broad spectrum SPF 50 protection made for Nepal's sun",
  "gift-sets": "Curated bundles for friends, family and festive seasons",
}

function matchCategory(productCategory: string, key: CategoryKey): boolean {
  if (key === "all") return true
  if (key === "serums") return productCategory === "serum"
  if (key === "moisturizers") return productCategory === "moisturizer"
  if (key === "cleansers") return productCategory === "face-wash"
  if (key === "sunscreen") return productCategory === "sunscreen"
  if (key === "gift-sets") return false // future bundles
  return true
}

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawCategory = (searchParams.get("category") || "all") as CategoryKey
  const category: CategoryKey = (CATEGORY_LABEL[rawCategory] ? rawCategory : "all") as CategoryKey

  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (gridRef.current) observer.observe(gridRef.current)
    return () => {
      if (gridRef.current) observer.unobserve(gridRef.current)
    }
  }, [])

  const filteredProducts = useMemo(
    () => nepvicProducts.filter(p => matchCategory(p.category, category)),
    [category]
  )

  const allCategories: CategoryKey[] = ["all", "cleansers", "serums", "moisturizers", "sunscreen", "gift-sets"]

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
              Our Collection
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-balance">
              {CATEGORY_LABEL[category]}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {CATEGORY_TAGLINE[category]}
            </p>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {allCategories.map((c) => {
              const active = c === category
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    const url = c === "all" ? "/shop" : `/shop?category=${c}`
                    router.push(url, { scroll: false })
                  }}
                  className={`px-4 py-2 rounded-full text-sm boty-transition border ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border/50 hover:border-foreground/40"
                  }`}
                >
                  {CATEGORY_LABEL[c]}
                </button>
              )
            })}
          </div>

          {/* Count bar */}
          <div className="flex items-center justify-end mb-10 pb-6 border-b border-border/50">
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-foreground mb-3">Coming soon</p>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We&apos;re putting together beautiful bundles for you. Meanwhile, build your own routine from our individual products.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm boty-transition hover:bg-primary/90"
              >
                Shop all products
              </Link>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </main>
    }>
      <ShopContent />
    </Suspense>
  )
}

function ProductCard({
  product,
  index,
  isVisible
}: {
  product: typeof nepvicProducts[0]
  index: number
  isVisible: boolean
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addItem } = useCart()

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="bg-card rounded-3xl overflow-hidden boty-shadow boty-transition group-hover:scale-[1.02]">
        {/* Image */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted animate-pulse transition-opacity duration-500 ${
              imageLoaded ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-contain p-4 boty-transition group-hover:scale-105 transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide ${
                product.badge === "New"
                  ? "bg-primary/10 text-primary"
                  : "bg-foreground/10 text-foreground"
              }`}
            >
              {product.badge}
            </span>
          )}
          {/* Quick add button */}
          <button
            type="button"
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 boty-transition boty-shadow"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addItem({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
              })
            }}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="font-serif text-xl text-foreground mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{product.tagline}</p>
          <span className="text-lg font-medium text-foreground">Rs. {product.price}</span>
        </div>
      </div>
    </Link>
  )
}
