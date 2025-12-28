const values = [
  "تمكين التعلم العربي باستخدام أدوات رقمية حديثة.",
  "تقديم تجربة موحدة للطلاب والمدربين والإدارة.",
  "تحويل البيانات إلى قرارات تدريبية فورية."
];

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-white/70">عن Thinkra</p>
        <h1 className="text-3xl font-bold">قصتنا مع التعلم الذكي</h1>
        <p className="text-white/80">
          Thinkra هي منصة تعليمية شاملة تساعد المؤسسات التعليمية على إدارة المسارات التدريبية،
          قياس الأداء، وبناء مجتمع تعلم دائم باللغة العربية.
        </p>
      </header>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">قيمنا الأساسية</h2>
        <ul className="mt-4 space-y-3 text-sm text-white/70">
          {values.map((value) => (
            <li key={value}>• {value}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
