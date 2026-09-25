import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { connection } from 'next/server'
import { ChevronRight, ShoppingCart } from 'lucide-react'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { HeroContent } from '@/components/home/HeroContent'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import Features from '@/components/layout/Features'
import AboutSection from '@/components/AboutSection'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { getSettings } from '@/lib/settings'
import type { IProduct } from '@/types'



const BESTSELLERS_MIN = 3

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    await connectDB()

    const featured = await Product.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .lean()

    if (featured.length >= BESTSELLERS_MIN) {
      return JSON.parse(JSON.stringify(featured))
    }

    // Fill remaining slots — prefer products from categories not already represented
    const usedIds = featured.map((p) => p._id)
    const usedCats = [...new Set(featured.map((p) => p.category))]
    const needed = BESTSELLERS_MIN - featured.length

    const fromOther = await Product.find({
      isActive: true,
      _id: { $nin: usedIds },
      ...(usedCats.length ? { category: { $nin: usedCats } } : {}),
    })
      .sort({ createdAt: -1 })
      .limit(needed)
      .lean()

    const combined = [...featured, ...fromOther]

    // Still short? Top up from any remaining active product
    if (combined.length < BESTSELLERS_MIN) {
      const allUsedIds = combined.map((p) => p._id)
      const topUp = await Product.find({ isActive: true, _id: { $nin: allUsedIds } })
        .sort({ createdAt: -1 })
        .limit(BESTSELLERS_MIN - combined.length)
        .lean()
      return JSON.parse(JSON.stringify([...combined, ...topUp]))
    }

    return JSON.parse(JSON.stringify(combined))
  } catch {
    return []
  }
}

function ProductCard({ product }: { product: IProduct }) {
  const hasImage = product.images.length > 0
  return (
    <Link
      href={`/products/${product._id}`}
      className="group bg-white rounded-2xl border border-masala-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chili-600"
    >
      <div className="relative aspect-square bg-masala-50 overflow-hidden">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl select-none">
            🌶️
          </div>
        )}
        <span className="absolute top-3 left-3 bg-saffron-100 text-saffron-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {product.category}
        </span>
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-masala-900/70 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading font-semibold text-masala-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-sm text-masala-600 mt-1 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          {(() => {
            const defaultWeight = product.weights?.find(w => w.isDefault && w.isActive !== false) ?? product.weights?.find(w => w.isActive !== false)
            const displayPrice = defaultWeight ? defaultWeight.price : 0
            const displayTaxPercent = defaultWeight ? (defaultWeight.tax ?? 0) : 0
            const displayTaxAmount = displayPrice * (displayTaxPercent / 100)
            const displayTotal = displayPrice + displayTaxAmount
            return (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-chili-600">
                    ₹{displayTotal.toLocaleString('en-IN')}
                  </span>
                  {defaultWeight && (
                    <span className="text-xs text-masala-400 font-medium">
                      {defaultWeight.weight}
                    </span>
                  )}
                </div>
                {displayTaxAmount > 0 && (
                  <span className="text-[9px] text-masala-400 font-normal">
                    (Includes ₹{displayTaxAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Tax)
                  </span>
                )}
              </div>
            )
          })()}
          {product.stock > 0 ? (
            <span className="flex items-center gap-1 text-xs text-cardamom-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cardamom-600" />
              In Stock
            </span>
          ) : (
            <span className="text-xs text-masala-500">Unavailable</span>
          )}
        </div>

        <div className="pt-1">
          <span className={`w-full text-center py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-200 ${product.stock === 0
            ? 'bg-masala-100 text-masala-400 cursor-not-allowed'
            : 'bg-masala-100 text-masala-700 group-hover:bg-chili-600 group-hover:text-white'
            }`}>
            <ShoppingCart size={14} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ── Async component — DB access lives here inside Suspense ── */
async function FeaturedGrid() {
  await connection()
  const products = await getFeaturedProducts()

  if (products.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className="text-center mt-10 sm:hidden">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-chili-600 text-chili-600 rounded-xl text-sm font-medium hover:bg-chili-100 transition-colors"
        >
          View All Products <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  )
}

export default async function HomePage() {
  const settings = await getSettings()
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber || process.env.WHATSAPP_NUMBER || ''}`

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ────────────────────────────────────────────────────────────
           -mt-16 pulls the section up behind the sticky navbar (64px tall)
           so the navbar glass floats directly over the dark hero image.
           pt-16 inside ensures hero content is not hidden under the navbar. */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#3a211a] -mt-16 pt-16">
        <HeroContent whatsappUrl={whatsappUrl} />
      </section>

      {/* ── Category Strip ── */}
      <CategoryStrip />

      {/* ── Featured Products ── */}
      <section className="py-20 bg-masala-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-saffron-600 text-sm font-semibold uppercase tracking-wider mb-2">
                Handpicked for You
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-masala-900">
                Our Bestsellers
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-chili-600 text-sm font-medium hover:text-chili-700 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={3} />}>
            <FeaturedGrid />
          </Suspense>
        </div>
      </section>



      {/* ── Features ── */}
      <Features />

      {/* ── Our Story ── */}
      <AboutSection />


    </div>
  )
}
