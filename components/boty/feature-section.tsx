"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Recycle, Leaf, Flower2, Globe } from "lucide-react"

const features = [
  {
    icon: Recycle,
    title: "Eco-Friendly Packaging",
    description: "Recyclable and biodegradable materials"
  },
  {
    icon: Leaf,
    title: "100% Natural",
    description: "No synthetic chemicals or parabens"
  },
  {
    icon: Flower2,
    title: "Plant-Based",
    description: "Botanical extracts and essential oils"
  },
  {
    icon: Globe,
    title: "Ethical Sourcing",
    description: "Fair trade certified ingredients"
  }
]

export function FeatureSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const bentoRef = useRef<HTMLDivElement>(null)
  const videoSectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (bentoRef.current) {
      observer.observe(bentoRef.current)
    }

    if (videoSectionRef.current) {
      videoObserver.observe(videoSectionRef.current)
    }

    if (headerRef.current) {
      headerObserver.observe(headerRef.current)
    }

    return () => {
      if (bentoRef.current) {
        observer.unobserve(bentoRef.current)
      }
      if (videoSectionRef.current) {
        videoObserver.unobserve(videoSectionRef.current)
      }
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-background relative">
      {/* Subtle float animations for the bento images */}
      <style jsx>{`
        :global(.feature-float-slow) { animation: floatSlow 9s ease-in-out infinite; will-change: transform; }
        :global(.feature-float-medium) { animation: floatMedium 7s ease-in-out infinite; will-change: transform; }
        :global(.feature-float-fast) { animation: floatFast 6s ease-in-out infinite; will-change: transform; }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) scale(1.02); }
          50% { transform: translateY(-10px) scale(1.04); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0) scale(1.02); }
          50% { transform: translateY(-7px) scale(1.035); }
        }
        @keyframes floatFast {
          0%, 100% { transform: translateY(0) scale(1.02); }
          50% { transform: translateY(-5px) scale(1.03); }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Bento Grid */}
        <div 
          ref={bentoRef}
          className="grid md:grid-cols-4 mb-20 md:grid-rows-[300px_300px] gap-6"
        >
          {/* Left Large Block - Plant-Based serum image */}
          <div 
            className={`group relative rounded-3xl overflow-hidden h-[500px] md:h-auto md:col-span-2 md:row-span-2 transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <Image
              src="/images/feature-plant-based.jpg"
              alt="Nepvic Face Serum surrounded by fresh botanicals — 100% plant-based skincare"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover feature-float-slow group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
            />
            {/* Overlay Card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white p-6 shadow-lg rounded-xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  
                </div>
                <div>
                  <h3 className="text-xl text-foreground mb-2 font-medium">
                    100% <span className="">Plant-Based</span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Formulated exclusively with botanical ingredients and natural plant extracts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Right - 100% Natural */}
          <div 
            className={`rounded-3xl p-6 md:p-8 flex flex-col justify-center md:col-span-2 relative overflow-hidden transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            {/* Background Image - full Nepvic line-up */}
            <Image
              src="/images/feature-natural.jpg"
              alt="Complete Nepvic skincare line on sage linen with fresh botanicals"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover feature-float-medium group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
            />

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/50" />
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl text-white mb-2">
                100% Natural
              </h3>
              <h3 className="text-2xl md:text-3xl text-white/90 mb-4">
                100% You
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Leaf className="w-4 h-4 flex-shrink-0" />
                  <span>No Harsh Chemicals</span>
                </div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <Flower2 className="w-4 h-4 flex-shrink-0" />
                  <span>Plant-Based Goodness</span>
                </div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span>Ethically Sourced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right - Eco-Friendly Packaging */}
          <div 
            className={`group rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden md:col-span-2 transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Background Image - eco-friendly packaging */}
            <Image
              src="/images/feature-eco-packaging.jpg"
              alt="Nepvic Moisturizer with kraft paper, eucalyptus and recycle tag"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover feature-float-fast group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
            />
            {/* Soft white overlay so the text on the right stays readable */}
            <div className="absolute inset-0 bg-white/55 md:bg-gradient-to-r md:from-white/80 md:via-white/40 md:to-transparent" />
            
            <div className="relative z-10 flex flex-col justify-center h-full text-left items-start">
              <div className="inline-flex items-center justify-center w-10 h-10 mb-3">
                <Recycle className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-sans text-base mb-1 text-black">
                Eco-Friendly
              </h3>
              <h3 className="text-2xl md:text-3xl mb-2 text-black">
                Packaging
              </h3>
            </div>
          </div>
        </div>

        <div 
          ref={videoSectionRef}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center my-0 py-20"
        >
          {/* Video */}
          <div 
            className={`relative aspect-[4/5] rounded-3xl overflow-hidden boty-shadow transition-all duration-700 ease-out ${
              isVideoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0c826034-d4f2-4d4f-8e99-50e94e4ce63f-dG1CBOjR36xFPTbhcROrHbomGXtlTQ.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Content */}
          <div
            ref={headerRef}
            className={`transition-all duration-700 ease-out ${
              isVideoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <span className={`text-sm tracking-[0.3em] uppercase text-primary mb-4 block ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}>
              Why Nepvic
            </span>
            <h2 className={`font-serif text-4xl leading-tight text-foreground mb-6 text-balance md:text-7xl ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}>
              Care that breathes.
            </h2>
            <p className={`text-lg text-muted-foreground leading-relaxed mb-10 max-w-md ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.6s', animationFillMode: 'forwards' } : {}}>
              We believe skincare should be a gentle ritual, not a complicated routine. 
              Every product is crafted with intention and love for your skin.
            </p>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-5 boty-transition hover:scale-[1.02] rounded-md bg-white"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 group-hover:bg-primary/20 boty-transition bg-stone-50">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
