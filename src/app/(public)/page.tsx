import Link from "next/link";
import { prisma } from "@/lib/prisma";
type Category = { id: string; name: string; slug?: string | null; };


export default async function HomePage() {
  const categories = await prisma.category.findMany({ take: 4 });
  const topCourses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: { instructor: true, category: true },
    take: 4
  });
  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    take: 3
  });

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-white/70">منصة Thinkra التعليمية</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            تعلّم، تدرّب، وارتقِ بفريقك عبر منصة عربية موحّدة
          </h1>
          <p className="text-lg text-white/80">
            Thinkra تجمع المسارات التعليمية، التحليلات، وإدارة الفرق في تجربة عربية كاملة.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/courses"
              className="rounded-xl bg-[#9e28b5] px-6 py-3 text-sm font-semibold shadow-lg shadow-black/20"
            >
              استعرض الدورات
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white/80"
            >
              أنشئ حسابًا
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/30">
          <h2 className="text-lg font-semibold">لماذا Thinkra؟</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>✓ مسارات تعلم عربية مصممة للمنطقة.</li>
            <li>✓ لوحات متابعة فورية للمدربين والإدارة.</li>
            <li>✓ أدوات تقييم وتقارير قابلة للتخصيص.</li>
          </ul>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">التصنيفات</h2>
          <Link href="/courses" className="text-sm text-white/70">
            عرض الكل
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category: Category) => (
            <div key={category.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="mt-2 text-sm text-white/70">اكتشف دورات مخصصة لهذا المجال.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">أفضل الدورات</h2>
          <Link href="/courses" className="text-sm text-white/70">
            استكشاف المزيد
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {topCourses.map((course) => (
            <article key={course.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="h-24 w-full rounded-xl bg-white/10 md:h-20 md:w-32" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-sm text-white/70">{course.category.name} • {course.instructor.name}</p>
                  <p className="text-sm text-white/70">${course.price}</p>
                </div>
              </div>
              <Link
                href={`/courses/${course.id}`}
                className="mt-4 inline-flex rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold"
              >
                تفاصيل الدورة
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">المدربون المميزون</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {instructors.map((instructor) => (
            <article key={instructor.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">{instructor.name}</h3>
              <p className="mt-2 text-sm text-white/70">مدرب متخصص في بناء المسارات المهنية.</p>
              <Link
                href={`/instructors/${instructor.id}`}
                className="mt-4 inline-flex text-sm text-white/80"
              >
                عرض الملف
              </Link>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
