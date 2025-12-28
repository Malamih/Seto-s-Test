import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function NewCoursePage() {
  const session = await requireRole(["INSTRUCTOR"]);
  const categories = await prisma.category.findMany();

  async function createCourse(formData: FormData) {
    "use server";
    const actionSession = await requireRole(["INSTRUCTOR"]);
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const price = Number(formData.get("price")?.toString() ?? 0);
    const categoryId = formData.get("categoryId")?.toString();
    const thumbnailUrl = formData.get("thumbnailUrl")?.toString().trim();

    if (!title || !description || !categoryId || !thumbnailUrl) {
      return;
    }

    await prisma.course.create({
      data: {
        title,
        description,
        price,
        categoryId,
        thumbnailUrl,
        instructorId: actionSession.user.id as string,
        status: "DRAFT"
      }
    });

    redirect("/instructor/courses");
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">إنشاء دورة جديدة</h1>
        <p className="text-white/70">أدخل بيانات الدورة ليتم حفظها كمسودة.</p>
      </header>
      <form action={createCourse} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <input
          name="title"
          placeholder="عنوان الدورة"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <textarea
          name="description"
          rows={4}
          placeholder="وصف مختصر"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="price"
            type="number"
            placeholder="السعر بالدولار"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
          />
          <select
            name="categoryId"
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
          placeholder="رابط صورة الغلاف"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <button className="w-full rounded-xl bg-[#9e28b5] px-4 py-3 text-sm font-semibold" type="submit">
          حفظ الدورة
        </button>
      </form>
    </section>
  );
}
