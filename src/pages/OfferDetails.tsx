import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '../FormContext'
import StepIndicator from '../components/StepIndicator'
import type { AddOn, InsuranceOffer } from '../types'

export default function OfferDetails() {
  const navigate = useNavigate()
  const { data, setSelectedOffer } = useForm()
  const [offer, setOffer] = useState<InsuranceOffer | null>(null)

  useEffect(() => {
    if (!data.selectedOffer) {
      navigate('/offers')
      return
    }
    setOffer(data.selectedOffer)
  }, [])

  if (!offer) return null

  const toggleAddOn = (addOnId: string) => {
    const updated = offer.addOns.map(a =>
      a.id === addOnId ? { ...a, included: !a.included, price: a.included ? a.price : a.price } : a
    )
    const addedPrice = updated.filter(a => a.included && !offer.addOns.find(oa => oa.id === a.id && oa.included)).reduce((s, a) => s + a.price, 0)
    const removedPrice = updated.filter(a => !a.included && offer.addOns.find(oa => oa.id === a.id && oa.included)).reduce((s, a) => s + a.price, 0)

    const newBasePrice = offer.basePrice + addedPrice - removedPrice
    const newAfterDiscount = newBasePrice - offer.discount
    const newVat = Math.round(newAfterDiscount * 0.15)
    const newFinal = newAfterDiscount + newVat

    const updatedOffer = { ...offer, addOns: updated, basePrice: newBasePrice, vat: newVat, finalPrice: newFinal }
    setOffer(updatedOffer)
    setSelectedOffer(updatedOffer)
  }

  const includedAddOns = offer.addOns.filter(a => a.included)
  const availableAddOns = offer.addOns.filter(a => !a.included)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-center text-neutral-800 mb-2">تفاصيل العرض</h1>
      <p className="text-center text-neutral-500 mb-6">مراجعة وتخصيص التغطيات الإضافية</p>
      <StepIndicator currentStep={4} />

      {/* Company Header */}
      <div className="card mb-4 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: offer.color + '15' }}
        >
          {offer.logo}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-neutral-800">{offer.companyName}</h2>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span className="font-bold text-primary-600">{offer.type}</span>
            <span>⭐ {offer.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Included Add-ons */}
      {includedAddOns.length > 0 && (
        <div className="card mb-4">
          <h3 className="font-bold text-neutral-700 mb-3">التغطيات المشمولة</h3>
          <div className="space-y-2">
            {includedAddOns.map((a: AddOn) => (
              <div key={a.id} className="flex items-center gap-3 py-2">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm">
                  ✓
                </div>
                <span className="text-sm text-neutral-700 flex-1">{a.name}</span>
                <span className="text-xs font-bold text-primary-600">مشمول</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Add-ons */}
      {availableAddOns.length > 0 && (
        <div className="card mb-4">
          <h3 className="font-bold text-neutral-700 mb-3">إضافات اختيارية</h3>
          <div className="space-y-2">
            {availableAddOns.map((a: AddOn) => (
              <label
                key={a.id}
                className="flex items-center gap-3 py-2 cursor-pointer hover:bg-neutral-50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => toggleAddOn(a.id)}
                  className="w-5 h-5 rounded border-2 border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700 flex-1">{a.name}</span>
                <span className="text-sm font-bold text-neutral-600">+{a.price} ريال</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="card mb-4">
        <h3 className="font-bold text-neutral-700 mb-3">ملخص الأسعار</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-neutral-500">
            <span>السعر الأساسي</span>
            <span className="font-bold">{offer.basePrice.toLocaleString()} ريال</span>
          </div>
          {offer.discount > 0 && (
            <div className="flex justify-between text-primary-600">
              <span>الخصم</span>
              <span className="font-bold">- {offer.discount.toLocaleString()} ريال</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-500">
            <span>ضريبة القيمة المضافة (15%)</span>
            <span className="font-bold">{offer.vat.toLocaleString()} ريال</span>
          </div>
          <div className="border-t border-neutral-100 pt-2 flex justify-between text-base">
            <span className="font-extrabold text-neutral-800">الإجمالي</span>
            <span className="font-extrabold text-primary-700 text-xl">{offer.finalPrice.toLocaleString()} ريال</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => navigate('/offers')} className="btn-secondary flex-1">
          السابق
        </button>
        <button
          onClick={() => navigate('/payment')}
          className="btn-primary flex-1 text-lg"
        >
          التالي — الدفع
        </button>
      </div>
    </div>
  )
}
