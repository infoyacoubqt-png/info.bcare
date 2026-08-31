import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AppFormData, VehicleData, CustomerData, InsuranceOffer, PaymentData } from './types'

interface FormContextType {
  data: AppFormData
  setVehicle: (v: VehicleData) => void
  setCustomer: (c: CustomerData) => void
  setSelectedOffer: (o: InsuranceOffer) => void
  setPayment: (p: PaymentData) => void
  reset: () => void
}

const FormContext = createContext<FormContextType | null>(null)

export function FormProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppFormData>({
    vehicle: null,
    customer: null,
    selectedOffer: null,
    payment: null,
  })

  const setVehicle = (v: VehicleData) => setData(d => ({ ...d, vehicle: v }))
  const setCustomer = (c: CustomerData) => setData(d => ({ ...d, customer: c }))
  const setSelectedOffer = (o: InsuranceOffer) => setData(d => ({ ...d, selectedOffer: o }))
  const setPayment = (p: PaymentData) => setData(d => ({ ...d, payment: p }))
  const reset = () => setData({ vehicle: null, customer: null, selectedOffer: null, payment: null })

  return (
    <FormContext.Provider value={{ data, setVehicle, setCustomer, setSelectedOffer, setPayment, reset }}>
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('useForm must be used within FormProvider')
  return ctx
}
