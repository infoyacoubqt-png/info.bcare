import type { InsuranceCompany, AddOn } from './types'

export const insuranceCompanies: InsuranceCompany[] = [
  { id: 'tawuniya', name: 'Tawuniya', nameAr: 'التعاونية', logo: '🛡️', color: '#0066B3' },
  { id: 'salama', name: 'Salama', nameAr: 'سلامة', logo: '🌿', color: '#00843D' },
  { id: 'walaa', name: 'Walaa', nameAr: 'الولاء', logo: '🤝', color: '#E2231A' },
  { id: 'allianz', name: 'Allianz', nameAr: 'أليانز', logo: '🔵', color: '#003781' },
  { id: 'gulf', name: 'Gulf Union', nameAr: 'اتحاد الخليج', logo: '🌊', color: '#00529B' },
  { id: 'acig', name: 'ACIG', nameAr: 'العربية للضمان', logo: '🏛️', color: '#004B8D' },
  { id: 'arabian', name: 'Arabian Shield', nameAr: 'الدرع العربي', logo: '🛡️', color: '#1A237E' },
  { id: 'sagr', name: 'Sagr', nameAr: 'سجر', logo: '🐦', color: '#0D47A1' },
  { id: 'saic', name: 'SAIC', nameAr: 'العربية', logo: '🏢', color: '#1565C0' },
  { id: 'medgulf', name: 'Medgulf', nameAr: 'متلف', logo: '🏥', color: '#C62828' },
  { id: 'aljazira', name: 'Aljazira', nameAr: 'الجزيرة', logo: '🏝️', color: '#2E7D32' },
  { id: 'buruj', name: 'Buruj', nameAr: 'بروج', logo: '⭐', color: '#37474F' },
  { id: 'chubb', name: 'Chubb', nameAr: 'تشب', logo: '🔷', color: '#01579B' },
  { id: 'liva', name: 'Liva', nameAr: 'ليفا', logo: '✨', color: '#00695C' },
  { id: 'uca', name: 'UCA', nameAr: 'يوسيا', logo: '🔶', color: '#BF360C' },
]

export const allAddOns: AddOn[] = [
  { id: 'personal_accident', name: 'التغطية ضد الحوادث الشخصية للسائق والركاب', price: 89, included: false },
  { id: 'roadside_assist', name: 'المساعدة على الطريق', price: 45, included: false },
  { id: 'glass_breakage', name: 'كسر الزجاج', price: 59, included: false },
  { id: 'fire_theft', name: 'الحريق والسرقة', price: 69, included: false },
  { id: 'natural_disasters', name: 'الكوارث الطبيعية', price: 55, included: false },
]

export const vehicleMakes = [
  'تويوتا', 'هيونداي', 'كيا', 'نيسان', 'ميتسوبيشي', 'لكزس', 'مرسيدس', 'بي إم دبليو',
  'أودي', 'فورد', 'شيفروليه', 'هوندا', 'مازدا', 'فولكس فاجن', 'سكودا', 'رينو',
  'بيجو', 'سيتروين', 'فيات', 'أوبل', 'جيب', 'لاند روفر', 'بورش', 'جاك', 'جيلي',
  'شانجان', 'هايال', 'إم جي', 'شيري', 'بي واي دي', 'تيسلا',
]

export const saudiCities = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران',
  'الطائف', 'تبوك', 'بريدة', 'أبها', 'خميس مشيط', 'حائل', 'نجران', 'جازان',
  'الأحساء', 'ينبع', 'الجبيل', 'عرعر', 'سكاكا',
]

export function generateOffers(vehicleValue: number, insuranceType: 'شامل' | 'ضد الغير'): import('./types').InsuranceOffer[] {
  const baseRate = insuranceType === 'شامل' ? 0.022 : 0.009
  return insuranceCompanies.map((company, index) => {
    const variation = 0.85 + (index * 0.03) + (Math.random() * 0.15)
    const basePrice = Math.round((vehicleValue * baseRate * variation) / 10) * 10
    const discount = Math.round(basePrice * (0.05 + Math.random() * 0.12))
    const afterDiscount = basePrice - discount
    const vat = Math.round(afterDiscount * 0.15)
    const finalPrice = afterDiscount + vat
    const includedAddOns = insuranceType === 'شامل'
      ? allAddOns.slice(0, 2 + Math.floor(Math.random() * 3)).map(a => ({ ...a, included: true }))
      : []
    const availableAddOns = allAddOns.filter(a => !includedAddOns.some(ia => ia.id === a.id))
    return {
      companyId: company.id,
      companyName: company.nameAr,
      logo: company.logo,
      color: company.color,
      type: insuranceType,
      basePrice,
      finalPrice,
      vat,
      discount,
      addOns: [...includedAddOns, ...availableAddOns],
      rating: 3.5 + Math.random() * 1.5,
    }
  }).sort((a, b) => a.finalPrice - b.finalPrice)
}
