"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "#e3e1e2" }}
    >
      {/* Background hero image — hand holding the Sunscreen product */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-sunscreen.png"
          alt="Hand holding Nepvic Broad Spectrum Sunscreen SPF 50 in warm sunlight"
          fill
          priority
          sizes="100vw"
          className="object-cover hero-float"
        />
        {/* Soft left-side gradient so headline text stays readable on top of the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#e3e1e2] via-[#e3e1e2]/70 to-transparent lg:via-[#e3e1e2]/40" />
        {/* Bottom fade for smooth blend into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pt-20 mr-14 lg:mr-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="w-full lg:max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <span
              className="text-sm uppercase mb-6 block text-black animate-blur-in opacity-0 tracking-normal"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              Natural Skincare
            </span>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 text-balance text-black">
              <span
                className="block animate-blur-in opacity-0 font-semibold"
                style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
              >
                Glow gently.
              </span>
              <span
                className="block animate-blur-in opacity-0 font-semibold xl:text-9xl text-7xl"
                style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
              >
                Naturally you.
              </span>
            </h2>
            <p
              className="text-lg leading-relaxed mb-10 max-w-md mx-auto lg:mx-0 text-black animate-blur-in opacity-0"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              Discover skincare that breathes with you. Pure ingredients, gentle rituals, radiant
              results.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-blur-in opacity-0"
              style={{ animationDelay: "1s", animationFillMode: "forwards" }}
            >
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 boty-shadow"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-black z-10">
        <span className="text-xs tracking-widest uppercase font-bold">Scroll</span>
        <div className="w-px h-12 bg-foreground/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-foreground/60 animate-pulse" />
        </div>
      </div>

      {/* Gentle float animation so the image still feels alive */}
      <style jsx>{`
        :global(.hero-float) {
          animation: heroFloat 8s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes heroFloat {
          0%, 100% {
            transform: translateY(0) scale(1.02);
          }
          50% {
            transform: translateY(-12px) scale(1.04);
          }
        }
      `}</style>
    </section>
  )
}
