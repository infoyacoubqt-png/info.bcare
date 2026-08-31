import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '../FormContext'
import StepIndicator from '../components/StepIndicator'
import { vehicleMakes } from '../data'
import type { VehicleData } from '../types'

export default function VehicleForm() {
  const navigate = useNavigate()
  const { setVehicle } = useForm()

  const [form, setForm] = useState<VehicleData>({
    vehicleType: 'سيارة خاصة',
    insuranceType: 'شامل',
    startDate: new Date().toISOString().split('T')[0],
    vehicleUse: 'استخدام شخصي',
    estimatedValue: 50000,
    manufactureYear: 2020,
    make: '',
    model: '',
    repairPlace: 'الوكالة',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.make) e.make = 'يرجى اختيار ماركة السيارة'
    if (!form.model.trim()) e.model = 'يرجى إدخال موديل السيارة'
    if (form.estimatedValue < 5000) e.estimatedValue = 'القيمة التقديرية يجب أن تكون على الأقل 5,000 ريال'
    if (form.manufactureYear < 1990 || form.manufactureYear > 2026) e.manufactureYear = 'سنة الصنع غير صحيحة'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setVehicle(form)
      navigate('/customer-form')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-center text-neutral-800 mb-2">بيانات المركبة</h1>
      <p className="text-center text-neutral-500 mb-6">أدخل بيانات سيارتك للحصول على عروض التأمين</p>
      <StepIndicator currentStep={1} />

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Vehicle Type */}
        <div>
          <label className="label-field">نوع المركبة</label>
          <select
            className="input-field"
            value={form.vehicleType}
            onChange={e => setForm({ ...form, vehicleType: e.target.value })}
          >
            <option value="سيارة خاصة">سيارة خاصة</option>
            <option value="سيارة نقل">سيارة نقل</option>
            <option value="دراجة نارية">دراجة نارية</option>
          </select>
        </div>

        {/* Insurance Type */}
        <div>
          <label className="label-field">نوع التأمين</label>
          <div className="grid grid-cols-2 gap-3">
            {(['شامل', 'ضد الغير'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, insuranceType: type })}
                className={`py-3 rounded-xl font-bold border-2 transition-all duration-200 ${
                  form.insuranceType === type
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="label-field">تاريخ بدء التأمين</label>
          <input
            type="date"
            className="input-field"
            value={form.startDate}
            onChange={e => setForm({ ...form, startDate: e.target.value })}
          />
        </div>

        {/* Vehicle Use */}
        <div>
          <label className="label-field">الغرض من استخدام المركبة</label>
          <select
            className="input-field"
            value={form.vehicleUse}
            onChange={e => setForm({ ...form, vehicleUse: e.target.value })}
          >
            <option value="استخدام شخصي">استخدام شخصي</option>
            <option value="استخدام تجاري">استخدام تجاري</option>
            <option value="نقل الركاب">نقل الركاب</option>
          </select>
        </div>

        {/* Make & Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">ماركة السيارة</label>
            <select
              className="input-field"
              value={form.make}
              onChange={e => setForm({ ...form, make: e.target.value })}
            >
              <option value="">اختر الماركة</option>
              {vehicleMakes.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.make && <p className="text-red-500 text-xs mt-1 font-bold">{errors.make}</p>}
          </div>
          <div>
            <label className="label-field">موديل السيارة</label>
            <input
              type="text"
              className="input-field"
              placeholder="مثال: كامري"
              value={form.model}
              onChange={e => setForm({ ...form, model: e.target.value })}
            />
            {errors.model && <p className="text-red-500 text-xs mt-1 font-bold">{errors.model}</p>}
          </div>
        </div>

        {/* Year & Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">سنة الصنع</label>
            <input
              type="number"
              className="input-field"
              min={1990}
              max={2026}
              value={form.manufactureYear}
              onChange={e => setForm({ ...form, manufactureYear: parseInt(e.target.value) || 0 })}
            />
            {errors.manufactureYear && <p className="text-red-500 text-xs mt-1 font-bold">{errors.manufactureYear}</p>}
          </div>
          <div>
            <label className="label-field">القيمة التقديرية للمركبة (ريال)</label>
            <input
              type="number"
              className="input-field"
              min={5000}
              step={1000}
              value={form.estimatedValue}
              onChange={e => setForm({ ...form, estimatedValue: parseInt(e.target.value) || 0 })}
            />
            {errors.estimatedValue && <p className="text-red-500 text-xs mt-1 font-bold">{errors.estimatedValue}</p>}
          </div>
        </div>

        {/* Repair Place */}
        <div>
          <label className="label-field">مكان إصلاح الورشة</label>
          <select
            className="input-field"
            value={form.repairPlace}
            onChange={e => setForm({ ...form, repairPlace: e.target.value })}
          >
            <option value="الوكالة">الوكالة</option>
            <option value="ورشة معتمدة">ورشة معتمدة</option>
            <option value="ورشة عادية">ورشة عادية</option>
          </select>
        </div>

        <button type="submit" className="btn-primary w-full text-lg">
          التالي — بيانات العميل
        </button>
      </form>
    </div>
  )
}
