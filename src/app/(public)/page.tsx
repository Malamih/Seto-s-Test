import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Category = { id: string; name: string; slug: string };
type Instructor = { id: string; name: string };
type Course = { id: string; title: string; description: string; price: number; category: Category; instructor: Instructor };

export default async function HomePage() {
  const categories: Category[] = await prisma.category.findMany({
    take: 3,
    select: { id: true, name: true, slug: true }
  });
  const courses: Course[] = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    take: 4,
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      category: { select: { id: true, name: true, slug: true } },
      instructor: { select: { id: true, name: true } }
    }
  });
  const instructors: Instructor[] = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    take: 3,
    select: { id: true, name: true }
  });

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-white/70">MVP منصة Thinkra</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            منصة تعليم عربية تجمع الطلاب والمدربين والإدارة
          </h1>
          <p className="text-lg text-white/80">
            تجربة تعلم حديثة مع لوحات متابعة، محتوى منظم، وجلسات مباشرة.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/courses" className="rounded-xl bg-[#9e28b5] px-6 py-3 text-sm font-semibold">
              استعرض الدورات
            </Link>
            <Link href="/login" className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold">
              تسجيل الدخول
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">لماذا Thinkra؟</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>✓ محتوى عربي مصمم للمنطقة.</li>
            <li>✓ إدارة كاملة للمدربين والطلاب.</li>
            <li>✓ تقارير فورية عن التقدم.</li>
          </ul>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">التصنيفات</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category: Category) => (
            <div key={category.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-sm text-white/70">دورات متخصصة في {category.name}.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">أفضل الدورات</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course: Course) => (
            <article key={course.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="mt-2 text-sm text-white/70">{course.description}</p>
              <p className="mt-3 text-sm text-white/70">{course.category.name} • {course.instructor.name}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold">${course.price}</span>
                <Link href={`/courses/${course.id}`} className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">
                  التفاصيل
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">المدربون</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {instructors.map((instructor: Instructor) => (
            <div key={instructor.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">{instructor.name}</h3>
              <Link href={`/instructors/${instructor.id}`} className="mt-2 inline-flex text-sm text-white/70">
                عرض الملف
              </Link>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
