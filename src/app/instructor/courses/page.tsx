import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Category = { id: string; name: string };
type Course = { id: string; title: string; status: string; category: Category };

export default async function InstructorCoursesPage() {
  const session = await requireRole(["INSTRUCTOR"]);
  const categories: Category[] = await prisma.category.findMany({
    select: { id: true, name: true }
  });
  const courses: Course[] = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    select: { id: true, title: true, status: true, category: { select: { id: true, name: true } } }
  });

  async function createCourse(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const categoryId = String(formData.get("categoryId") || "");
    const description = String(formData.get("description") || "");
    const price = Number(formData.get("price") || 0);
    const instructorId = session.user.id;

    if (!title || !categoryId) {
      return;
    }

    await prisma.course.create({
      data: {
        title,
        description,
        price,
        categoryId,
        instructorId,
        status: "DRAFT"
      }
    });

    redirect("/instructor/courses");
  }

  async function deleteCourse(formData: FormData) {
    "use server";
    const courseId = String(formData.get("courseId") || "");
    if (!courseId) return;

    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId: session.user.id },
      select: { id: true }
    });

    if (!course) {
      notFound();
    }

    await prisma.course.delete({ where: { id: course.id } });
    redirect("/instructor/courses");
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">دوراتي</h1>
      <form action={createCourse} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
        <input name="title" placeholder="عنوان الدورة" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
        <textarea name="description" placeholder="وصف مختصر" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
        <div className="grid gap-3 md:grid-cols-2">
          <input name="price" type="number" placeholder="السعر" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
          <select name="categoryId" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2">
            {categories.map((category: Category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">إضافة دورة</button>
      </form>

      <div className="space-y-3">
        {courses.map((course: Course) => (
          <div key={course.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{course.title}</h2>
                <p className="text-sm text-white/70">{course.category.name}</p>
              </div>
              <form action={deleteCourse}>
                <input type="hidden" name="courseId" value={course.id} />
                <button type="submit" className="rounded-xl border border-white/30 px-3 py-1 text-xs">حذف</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
