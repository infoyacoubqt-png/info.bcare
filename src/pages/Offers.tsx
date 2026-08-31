import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '../FormContext'
import StepIndicator from '../components/StepIndicator'
import { generateOffers } from '../data'
import type { InsuranceOffer } from '../types'

export default function Offers() {
  const navigate = useNavigate()
  const { data, setSelectedOffer } = useForm()
  const [offers, setOffers] = useState<InsuranceOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price')

  useEffect(() => {
    if (!data.vehicle) {
      navigate('/vehicle-form')
      return
    }
    setLoading(true)
    const timer = setTimeout(() => {
      const generated = generateOffers(data.vehicle!.estimatedValue, data.vehicle!.insuranceType)
      setOffers(generated)
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const sorted = [...offers].sort((a, b) =>
    sortBy === 'price' ? a.finalPrice - b.finalPrice : b.rating - a.rating
  )

  const handleSelect = (offer: InsuranceOffer) => {
    setSelectedOffer(offer)
    navigate('/offer-details')
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <StepIndicator currentStep={4} />
        <div className="card flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-neutral-500 font-bold">جاري مقارنة العروض من شركات التأمين...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-center text-neutral-800 mb-2">عروض التأمين</h1>
      <p className="text-center text-neutral-500 mb-6">
        {offers.length} عرض من شركات التأمين — اختر الأنسب لك
      </p>
      <StepIndicator currentStep={4} />

      {/* Sort */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-sm font-bold text-neutral-500">ترتيب حسب:</span>
        {([
          { key: 'price', label: 'السعر' },
          { key: 'rating', label: 'التقييم' },
        ] as const).map(opt => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              sortBy === opt.key
                ? 'bg-primary-600 text-white'
                : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {sorted.map((offer, index) => (
          <div
            key={offer.companyId}
            onClick={() => handleSelect(offer)}
            className="card hover:shadow-md hover:border-primary-200 cursor-pointer transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: offer.color + '15' }}
              >
                {offer.logo}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-neutral-800 truncate">{offer.companyName}</h3>
                  {index === 0 && (
                    <span className="bg-accent-100 text-accent-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      الأرخص
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span className="font-bold text-primary-600">{offer.type}</span>
                  <span>⭐ {offer.rating.toFixed(1)}</span>
                  {offer.addOns.filter(a => a.included).length > 0 && (
                    <span>{offer.addOns.filter(a => a.included).length} تغطية إضافية</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-left flex-shrink-0">
                {offer.discount > 0 && (
                  <div className="text-xs text-neutral-400 line-through">
                    {offer.basePrice.toLocaleString()} ريال
                  </div>
                )}
                <div className="text-xl font-extrabold text-primary-700">
                  {offer.finalPrice.toLocaleString()}
                </div>
                <div className="text-xs text-neutral-400">ريال / سنة</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/vehicle-form')}
        className="text-neutral-400 hover:text-neutral-600 font-bold text-sm w-full text-center mt-6 transition-colors"
      >
        العودة — تعديل بيانات المركبة
      </button>
    </div>
  )
}
