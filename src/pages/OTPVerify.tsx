import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '../FormContext'
import StepIndicator from '../components/StepIndicator'

export default function OTPVerify() {
  const navigate = useNavigate()
  const { data } = useForm()
  const [code, setCode] = useState(['', '', '', ''])
  const [resendTimer, setResendTimer] = useState(30)
  const [error, setError] = useState('')
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!data.customer) {
      navigate('/customer-form')
      return
    }
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError('')
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    const fullCode = code.join('')
    if (fullCode.length < 4) {
      setError('يرجى إدخال الرمز كاملاً')
      return
    }
    navigate('/offers')
  }

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30)
      setCode(['', '', '', ''])
      inputsRef.current[0]?.focus()
    }
  }

  const phoneDisplay = data.customer?.phone
    ? `05${data.customer.phone.slice(2, 5)}***${data.customer.phone.slice(-2)}`
    : ''

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-center text-neutral-800 mb-2">رمز التحقق</h1>
      <p className="text-center text-neutral-500 mb-6">
        أدخل رمز التحقق المرسل إلى رقمك {phoneDisplay}
      </p>
      <StepIndicator currentStep={3} />

      <div className="card space-y-6">
        {/* OTP Inputs */}
        <div className="flex justify-center gap-4" dir="ltr">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputsRef.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={`w-16 h-16 text-center text-2xl font-extrabold rounded-2xl border-2 outline-none transition-all duration-200 ${
                error
                  ? 'border-red-400 bg-red-50'
                  : digit
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
              }`}
            />
          ))}
        </div>

        {error && <p className="text-center text-red-500 text-sm font-bold">{error}</p>}

        <button onClick={handleVerify} className="btn-primary w-full text-lg">
          تحقق ومتابعة
        </button>

        {/* Resend */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-neutral-400 text-sm">
              إعادة الإرسال بعد {resendTimer} ثانية
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-primary-600 hover:text-primary-700 font-bold text-sm transition-colors"
            >
              إعادة إرسال الرمز
            </button>
          )}
        </div>

        <button
          onClick={() => navigate('/customer-form')}
          className="text-neutral-400 hover:text-neutral-600 font-bold text-sm w-full transition-colors"
        >
          العودة — تعديل البيانات
        </button>
      </div>
    </div>
  )
}
