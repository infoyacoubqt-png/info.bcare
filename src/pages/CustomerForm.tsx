import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '../FormContext'
import StepIndicator from '../components/StepIndicator'
import type { CustomerData } from '../types'

export default function CustomerForm() {
  const navigate = useNavigate()
  const { setCustomer } = useForm()

  const [form, setForm] = useState<CustomerData>({
    idType: 'هوية وطنية',
    idNumber: '',
    fullName: '',
    phone: '',
    documentType: 'جديد',
    sequenceNumber: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (form.idType === 'هوية وطنية' && !/^\d{10}$/.test(form.idNumber)) {
      e.idNumber = 'رقم الهوية يجب أن يكون 10 أرقام'
    }
    if (form.idType === 'إقامة' && !/^\d{10}$/.test(form.idNumber)) {
      e.idNumber = 'رقم الإقامة يجب أن يكون 10 أرقام'
    }
    if (!form.fullName.trim()) e.fullName = 'يرجى إدخال الاسم كاملاً'
    if (!/^05\d{8}$/.test(form.phone)) e.phone = 'رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام'
    if (form.documentType === 'نقل ملكية' && !form.sequenceNumber.trim()) {
      e.sequenceNumber = 'يرجى إدخال الرقم التسلسلي'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setCustomer(form)
      navigate('/verify')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-center text-neutral-800 mb-2">بيانات العميل</h1>
      <p className="text-center text-neutral-500 mb-6">أدخل بياناتك الشخصية لإكمال طلب التأمين</p>
      <StepIndicator currentStep={2} />

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* ID Type */}
        <div>
          <label className="label-field">نوع الهوية</label>
          <div className="grid grid-cols-2 gap-3">
            {(['هوية وطنية', 'إقامة'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, idType: type, idNumber: '' })}
                className={`py-3 rounded-xl font-bold border-2 transition-all duration-200 ${
                  form.idType === type
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* ID Number */}
        <div>
          <label className="label-field">رقم {form.idType}</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            className="input-field"
            placeholder={`أدخل رقم ${form.idType}`}
            value={form.idNumber}
            onChange={e => setForm({ ...form, idNumber: e.target.value.replace(/\D/g, '') })}
          />
          {errors.idNumber && <p className="text-red-500 text-xs mt-1 font-bold">{errors.idNumber}</p>}
        </div>

        {/* Full Name */}
        <div>
          <label className="label-field">الاسم كما في الوثيقة (كاملاً)</label>
          <input
            type="text"
            className="input-field"
            placeholder="اسم مالك الوثيقة كاملاً"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.fullName}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="label-field">رقم الهاتف</label>
          <div className="flex gap-2">
            <div className="flex items-center px-4 rounded-xl border-2 border-neutral-200 bg-neutral-50 text-neutral-600 font-bold text-sm">
              +966
            </div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className="input-field flex-1"
              placeholder="05XXXXXXXX"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.phone}</p>}
        </div>

        {/* Document Type */}
        <div>
          <label className="label-field">نوع الوثيقة</label>
          <div className="grid grid-cols-2 gap-3">
            {(['جديد', 'نقل ملكية'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, documentType: type })}
                className={`py-3 rounded-xl font-bold border-2 transition-all duration-200 ${
                  form.documentType === type
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Sequence Number (only for transfer) */}
        {form.documentType === 'نقل ملكية' && (
          <div className="animate-slide-in">
            <label className="label-field">الرقم التسلسلي لبطاقة الجمركية</label>
            <input
              type="text"
              className="input-field"
              placeholder="أدخل الرقم التسلسلي"
              value={form.sequenceNumber}
              onChange={e => setForm({ ...form, sequenceNumber: e.target.value })}
            />
            {errors.sequenceNumber && <p className="text-red-500 text-xs mt-1 font-bold">{errors.sequenceNumber}</p>}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/vehicle-form')}
            className="btn-secondary flex-1"
          >
            السابق
          </button>
          <button type="submit" className="btn-primary flex-1 text-lg">
            التالي — التحقق
          </button>
        </div>
      </form>
    </div>
  )
}
