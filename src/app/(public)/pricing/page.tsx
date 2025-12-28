const tiers = [
  {
    name: "أساسي",
    price: "$29 شهريًا",
    features: ["حتى 50 طالب", "لوحة طالب ومدرب", "دعم بريد إلكتروني"]
  },
  {
    name: "محترف",
    price: "$79 شهريًا",
    features: ["حتى 500 طالب", "تحليلات متقدمة", "تكاملات مخصصة"]
  },
  {
    name: "مؤسسات",
    price: "تواصل معنا",
    features: ["عدد غير محدود", "مدير حساب", "خريطة تعلم مخصصة"]
  }
];

export default function PricingPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-white/70">الباقات</p>
        <h1 className="text-3xl font-bold">اختر الباقة المناسبة لفريقك</h1>
        <p className="text-white/80">
          خطط مرنة لتناسب فرق التدريب الصغيرة والمؤسسات الكبيرة.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-lg font-semibold">{tier.name}</h2>
            <p className="mt-2 text-2xl font-bold text-[#9e28b5]">{tier.price}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-white/70">
              {tier.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <button className="mt-6 rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">
              اطلب عرضًا
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
