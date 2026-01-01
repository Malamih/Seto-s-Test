import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Category = { id: string; name: string };
type Instructor = { id: string; name: string };
type Course = { id: string; title: string; description: string; price: number; category: Category; instructor: Instructor };

export default async function CoursesPage() {
  const courses: Course[] = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      category: { select: { id: true, name: true } },
      instructor: { select: { id: true, name: true } }
    }
  });

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">الدورات</h1>
        <p className="text-white/70">استعرض أحدث الدورات التعليمية.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course: Course) => (
          <article key={course.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="mt-2 text-sm text-white/70">{course.description}</p>
            <p className="mt-3 text-sm text-white/70">{course.category.name} • {course.instructor.name}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-semibold">${course.price}</span>
              <Link href={`/courses/${course.id}`} className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">
                عرض التفاصيل
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
