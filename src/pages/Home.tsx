import { Link } from 'react-router-dom'
import { insuranceCompanies } from '../data'

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-bl from-primary-700 via-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-accent-400/20 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              منصة معتمدة من هيئة التأمين السعودي
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
              المنصة الأذكى لمقارنة عروض تأمين السيارات
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
              احصل على سيارات تأمين مع إصدار فوري وربط مباشر بنجم — قارن بين أكثر من 14 شركة تأمين في دقائق
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/vehicle-form"
                className="bg-white text-primary-700 hover:bg-neutral-50 font-extrabold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-[0.98] text-lg"
              >
                ابدأ المقارنة الآن
              </Link>
              <Link
                to="/offers"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl border-2 border-white/30 transition-all duration-200 active:scale-[0.98] text-lg"
              >
                تصفح العروض
              </Link>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: '60px' }}>
          <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="#f5f5f5" />
        </svg>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: 'إصدار فوري', desc: 'احصل على وثيقة تأمين خلال دقائق بدون انتظار' },
            { icon: '💰', title: 'أرخص الأسعار', desc: 'قارن بين أكثر من 14 شركة تأمين واحصل على أفضل سعر' },
            { icon: '🔒', title: 'ربط مباشر بنجم', desc: 'ربط مباشر مع النظام الوطني للمعلومات الصحية' },
          ].map((f, i) => (
            <div key={i} className="card text-center hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg text-neutral-800 mb-2">{f.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-neutral-800 mb-10">
            كيف تعمل المنصة؟
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'أدخل بيانات المركبة', desc: 'نوع التأمين، ماركة السيارة، سنة الصنع، القيمة التقديرية' },
              { num: '2', title: 'أدخل بياناتك', desc: 'الهوية الوطنية أو الإقامة، الاسم، رقم الهاتف' },
              { num: '3', title: 'قارن العروض', desc: 'استعرض عروض جميع شركات التأمين واختر الأنسب' },
              { num: '4', title: 'ادفع واستلم وثيقتك', desc: 'ادفع بأمان واستلم وثيقة التأمين فوراً' },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="step-badge step-active w-14 h-14 text-2xl mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-neutral-800 mb-2">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden sm:block absolute top-7 left-0 w-full h-0.5 bg-neutral-200 -z-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Companies */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-neutral-800 mb-2">
          شركاؤنا من شركات التأمين
        </h2>
        <p className="text-center text-neutral-500 mb-8">نوفر لك عروض من أكثر من 14 شركة تأمين معتمدة</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {insuranceCompanies.map((company) => (
            <div
              key={company.id}
              className="card flex flex-col items-center justify-center gap-2 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: company.color + '15' }}
              >
                {company.logo}
              </div>
              <span className="text-xs font-bold text-neutral-600 text-center">{company.nameAr}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 text-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            جاهز لتوفير المال على تأمين سيارتك؟
          </h2>
          <p className="text-white/80 mb-6">
            انضم لآلاف العملاء الذين وفروا على تأمين سياراتهم مع BeCare
          </p>
          <Link
            to="/vehicle-form"
            className="inline-block bg-white text-primary-700 hover:bg-neutral-50 font-extrabold py-4 px-8 rounded-2xl shadow-xl transition-all duration-200 active:scale-[0.98] text-lg"
          >
            ابدأ الآن — مجاناً
          </Link>
        </div>
      </section>
    </div>
  )
}
