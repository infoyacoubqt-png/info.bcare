import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '../FormContext'
import StepIndicator from '../components/StepIndicator'
import { supabase } from '../supabaseClient'
import { getSessionId } from '../services/socket'
import { emitSubmissionCreated } from '../services/socket'

type ApprovalStatus = 'pending' | 'approved' | 'declined'

export default function AdminApproval() {
  const navigate = useNavigate()
  const { data } = useForm()
  const [status, setStatus] = useState<ApprovalStatus>('pending')
  const [approvalId, setApprovalId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const createApproval = useCallback(async () => {
    const sessionId = getSessionId()
    if (!sessionId) {
      setError('No active session found')
      return
    }

    const { data: row, error: insertError } = await supabase
      .from('approvals')
      .insert({
        session_id: sessionId,
        submission_type: 'insurance_payment',
        status: 'pending',
      })
      .select('id')
      .single()

    if (insertError) {
      setError(insertError.message)
      return
    }

    setApprovalId(row.id)
    emitSubmissionCreated('insurance_payment')
  }, [])

  useEffect(() => {
    createApproval()
  }, [createApproval])

  useEffect(() => {
    if (!approvalId) return

    const channel = supabase
      .channel(`approval-${approvalId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'approvals', filter: `id=eq.${approvalId}` },
        (payload) => {
          const newStatus = (payload.new as { status: ApprovalStatus }).status
          setStatus(newStatus)
          if (newStatus === 'approved') {
            setTimeout(() => navigate('/payment-result', { state: { success: true } }), 1200)
          } else if (newStatus === 'declined') {
            setTimeout(() => navigate('/payment-result', { state: { success: false } }), 1200)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [approvalId, navigate])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <StepIndicator currentStep={5} />

      <div className="card text-center py-12">
        {status === 'pending' && (
          <>
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-800 mb-2">في انتظار موافقة المشرف</h1>
            <p className="text-neutral-500 mb-6">
              تم إرسال طلبك للمراجعة. سيتم نقلك تلقائياً بمجرد موافقة المشرف على العملية.
            </p>
            {data.selectedOffer && (
              <div className="bg-neutral-50 rounded-xl p-4 mb-6 text-right">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-500">شركة التأمين</span>
                  <span className="font-bold text-neutral-800">{data.selectedOffer.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">المبلغ</span>
                  <span className="font-extrabold text-primary-700">{data.selectedOffer.finalPrice.toLocaleString()} ريال</span>
                </div>
              </div>
            )}
            <p className="text-xs text-neutral-400">رقم الطلب: {approvalId || '...'}</p>
          </>
        )}

        {status === 'approved' && (
          <>
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6 animate-fade-in">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-800 mb-2">تمت الموافقة!</h1>
            <p className="text-neutral-500 mb-6">تمت الموافقة على طلبك. جاري التحويل...</p>
          </>
        )}

        {status === 'declined' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 animate-fade-in">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-800 mb-2">تم رفض الطلب</h1>
            <p className="text-neutral-500 mb-6">قام المشرف برفض العملية. جاري التحويل...</p>
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm font-bold mb-4">{error}</p>
        )}

        {status === 'pending' && !error && (
          <button
            onClick={() => navigate('/payment')}
            className="btn-secondary"
          >
            العودة — تعديل الدفع
          </button>
        )}
      </div>
    </div>
  )
}
