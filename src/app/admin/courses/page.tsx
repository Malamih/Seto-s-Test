import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Course = {
  id: string;
  title: string;
  status: string;
  category: { name: string };
  instructor: { name: string };
};

export default async function AdminCoursesPage() {
  await requireRole(["ADMIN"]);
  const courses: Course[] = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      category: { select: { name: true } },
      instructor: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  async function updateStatus(formData: FormData) {
    "use server";
    const courseId = String(formData.get("courseId") || "");
    const status = String(formData.get("status") || "");
    if (!courseId || !status) return;
    await prisma.course.update({ where: { id: courseId }, data: { status } });
    redirect("/admin/courses");
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">إدارة الدورات</h1>
      <div className="space-y-3">
        {courses.map((course: Course) => (
          <form key={course.id} action={updateStatus} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <input type="hidden" name="courseId" value={course.id} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{course.title}</h2>
                <p className="text-sm text-white/70">{course.category.name} • {course.instructor.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <select name="status" defaultValue={course.status} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm">
                  <option value="DRAFT">مسودة</option>
                  <option value="PUBLISHED">منشورة</option>
                  <option value="ARCHIVED">مؤرشفة</option>
                </select>
                <button type="submit" className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">تحديث</button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
