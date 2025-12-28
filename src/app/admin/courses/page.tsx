import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type CourseWithRelations = Prisma.CourseGetPayload<{
  include: { instructor: true; category: true };
}>;

export default async function AdminCoursesPage() {
  await requireRole(["ADMIN"]);
  const courses: CourseWithRelations[] = await prisma.course.findMany({
    include: { instructor: true, category: true },
    orderBy: { createdAt: "desc" }
  });

  async function updateCourse(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = formData.get("courseId")?.toString();
    const status = formData.get("status")?.toString();
    if (!id || !status) return;

    await prisma.course.update({
      where: { id },
      data: { status }
    });

    redirect("/admin/courses");
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">إدارة الدورات</h1>
        <p className="text-white/70">مراجعة الدورات والموافقة عليها.</p>
      </header>
      <div className="space-y-4">
        {courses.map((course: CourseWithRelations) => (
          <form key={course.id} action={updateCourse} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <input type="hidden" name="courseId" value={course.id} />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-white/70">
                  {course.category.name} • المدرب: {course.instructor.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  name="status"
                  defaultValue={course.status}
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm"
                >
                  <option value="DRAFT">مسودة</option>
                  <option value="PUBLISHED">منشورة</option>
                  <option value="ARCHIVED">مؤرشفة</option>
                </select>
                <button className="rounded-xl bg-[#9e28b5] px-3 py-2 text-xs font-semibold" type="submit">
                  تحديث الحالة
                </button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
