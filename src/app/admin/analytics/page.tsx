import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function AnalyticsPage() {
  await requireRole(["ADMIN"]);

  const [users, courses, enrollments, payments] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.payment.count()
  ]);

  const metrics = [
    { label: "إجمالي المستخدمين", value: users },
    { label: "إجمالي الدورات", value: courses },
    { label: "إجمالي الاشتراكات", value: enrollments },
    { label: "عمليات الدفع", value: payments }
  ];

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">تحليلات المنصة</h1>
        <p className="text-white/70">مؤشرات الأداء الرئيسية للمنصة.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/70">{metric.label}</p>
            <p className="mt-2 text-3xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">نمو الاشتراكات (محاكاة)</h2>
        <div className="mt-4 grid gap-3">
          {[60, 80, 45, 90, 70].map((value, index) => (
            <div key={value} className="flex items-center gap-3">
              <span className="text-xs text-white/60">أسبوع {index + 1}</span>
              <div className="h-3 flex-1 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-[#9e28b5]" style={{ width: `${value}%` }} />
              </div>
              <span className="text-xs text-white/60">{value}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
