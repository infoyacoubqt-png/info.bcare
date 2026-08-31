import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from '../FormContext'
import StepIndicator from '../components/StepIndicator'

export default function PaymentResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data, reset } = useForm()
  const [success, setSuccess] = useState<boolean | null>(null)

  useEffect(() => {
    if (location.state && typeof location.state === 'object' && 'success' in location.state) {
      setSuccess((location.state as { success: boolean }).success)
    } else {
      setSuccess(false)
    }
  }, [])

  if (success === null) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <StepIndicator currentStep={5} />

      {success ? (
        <div className="card text-center py-12">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6 animate-fade-in">
            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-800 mb-2">تمت العملية بنجاح!</h1>
          <p className="text-neutral-500 mb-6">
            تم إصدار وثيقة التأمين الخاصة بك. سيتم إرسال نسخة إلى بريدك الإلكتروني ورسالة نصية إلى هاتفك.
          </p>

          {data.selectedOffer && (
            <div className="bg-neutral-50 rounded-xl p-4 mb-6 text-right">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-neutral-500">شركة التأمين</span>
                <span className="font-bold text-neutral-800">{data.selectedOffer.companyName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-neutral-500">نوع التأمين</span>
                <span className="font-bold text-neutral-800">{data.selectedOffer.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">المبلغ المدفوع</span>
                <span className="font-extrabold text-primary-700">{data.selectedOffer.finalPrice.toLocaleString()} ريال</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { reset(); navigate('/') }}
              className="btn-primary"
            >
              العودة للرئيسية
            </button>
            <button
              onClick={() => { reset(); navigate('/vehicle-form') }
              }
              className="btn-secondary"
            >
              تأمين سيارة أخرى
            </button>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-800 mb-2">حدث خطأ أثناء الإرسال</h1>
          <p className="text-neutral-500 mb-6">
            رفض العملية — يرجى التحقق من بيانات البطاقة أو محاولة استخدام بطاقة أخرى.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/payment')}
              className="btn-primary"
            >
              إعادة الإرسال
            </button>
            <button
              onClick={() => navigate('/offers')}
              className="btn-secondary"
            >
              العودة للعروض
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
