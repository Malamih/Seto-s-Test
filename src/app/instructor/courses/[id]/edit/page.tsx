import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

interface EditCourseProps {
  params: { id: string };
}

export default async function EditCoursePage({ params }: EditCourseProps) {
  const session = await requireRole(["INSTRUCTOR"]);
  const course = await prisma.course.findFirst({
    where: { id: params.id, instructorId: session.user.id as string }
  });
  const categories = await prisma.category.findMany();

  if (!course) {
    return <p>الدورة غير متاحة.</p>;
  }

  async function updateCourse(formData: FormData) {
    "use server";
    await requireRole(["INSTRUCTOR"]);
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const price = Number(formData.get("price")?.toString() ?? 0);
    const categoryId = formData.get("categoryId")?.toString();
    const thumbnailUrl = formData.get("thumbnailUrl")?.toString().trim();
    const status = formData.get("status")?.toString() ?? "DRAFT";

    if (!title || !description || !categoryId || !thumbnailUrl) {
      return;
    }

    await prisma.course.update({
      where: { id: course.id },
      data: {
        title,
        description,
        price,
        categoryId,
        thumbnailUrl,
        status
      }
    });

    redirect("/instructor/courses");
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">تعديل الدورة</h1>
      </header>
      <form action={updateCourse} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <input
          name="title"
          defaultValue={course.title}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <textarea
          name="description"
          rows={4}
          defaultValue={course.description}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="price"
            type="number"
            defaultValue={course.price}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
          />
          <select
            name="categoryId"
            defaultValue={course.categoryId}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <input
          name="thumbnailUrl"
          defaultValue={course.thumbnailUrl}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <select
          name="status"
          defaultValue={course.status}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        >
          <option value="DRAFT">مسودة</option>
          <option value="PUBLISHED">منشورة</option>
          <option value="ARCHIVED">مؤرشفة</option>
        </select>
        <button className="w-full rounded-xl bg-[#9e28b5] px-4 py-3 text-sm font-semibold" type="submit">
          حفظ التغييرات
        </button>
      </form>
    </section>
  );
}
