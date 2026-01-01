import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Category = { id: string; name: string };
type CourseWithCategory = {
  id: string;
  title: string;
  description: string;
  category: Category;
};

export default async function InstructorCoursesPage() {
  const session = await requireRole(["INSTRUCTOR"]);
  const courses: CourseWithCategory[] = await prisma.course.findMany({
    where: { instructorId: session.user.id as string },
    select: {
      id: true,
      title: true,
      description: true,
      category: { select: { id: true, name: true } }
    }
  });

  async function deleteCourse(formData: FormData) {
    "use server";
    await requireRole(["INSTRUCTOR"]);
    const courseId = formData.get("courseId")?.toString();
    if (!courseId) return;

    await prisma.course.delete({ where: { id: courseId } });
    redirect("/instructor/courses");
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">دوراتي التدريبية</h1>
          <p className="text-white/70">إدارة الدورات والمحتوى الخاص بك.</p>
        </div>
        <Link href="/instructor/courses/new" className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">
          إنشاء دورة جديدة
        </Link>
      </header>
      <div className="space-y-4">
        {courses.map((course: CourseWithCategory) => (
          <article key={course.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-white/70">{course.category.name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/instructor/courses/${course.id}/edit`}
                  className="rounded-xl border border-white/20 px-3 py-1 text-xs"
                >
                  تعديل
                </Link>
                <Link
                  href={`/instructor/courses/${course.id}/lessons`}
                  className="rounded-xl border border-white/20 px-3 py-1 text-xs"
                >
                  الدروس
                </Link>
                <Link
                  href={`/instructor/courses/${course.id}/students`}
                  className="rounded-xl border border-white/20 px-3 py-1 text-xs"
                >
                  الطلاب
                </Link>
                <form action={deleteCourse}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <button
                    className="rounded-xl border border-red-200/40 px-3 py-1 text-xs text-red-100"
                    type="submit"
                  >
                    حذف
                  </button>
                </form>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/70">{course.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
