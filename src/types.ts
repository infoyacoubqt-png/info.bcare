export interface InsuranceCompany {
  id: string
  name: string
  nameAr: string
  logo: string
  color: string
}

export interface InsuranceOffer {
  companyId: string
  companyName: string
  logo: string
  color: string
  type: 'شامل' | 'ضد الغير'
  basePrice: number
  finalPrice: number
  vat: number
  discount: number
  addOns: AddOn[]
  rating: number
}

export interface AddOn {
  id: string
  name: string
  price: number
  included: boolean
}

export interface VehicleData {
  vehicleType: string
  insuranceType: 'شامل' | 'ضد الغير'
  startDate: string
  vehicleUse: string
  estimatedValue: number
  manufactureYear: number
  make: string
  model: string
  repairPlace: string
}

export interface CustomerData {
  idType: 'هوية وطنية' | 'إقامة'
  idNumber: string
  fullName: string
  phone: string
  documentType: 'جديد' | 'نقل ملكية'
  sequenceNumber: string
}

export interface PaymentData {
  cardNumber: string
  cardHolder: string
  expiry: string
  cvv: string
  method: 'mada' | 'visa' | 'mastercard'
}

export interface AppFormData {
  vehicle: VehicleData | null
  customer: CustomerData | null
  selectedOffer: InsuranceOffer | null
  payment: PaymentData | null
}
