import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function AdminCategoriesPage() {
  await requireRole(["ADMIN"]);
  const categories = await prisma.category.findMany({ orderBy: { createdAt: "desc" } });

  async function createCategory(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const name = formData.get("name")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim();
    if (!name || !slug) return;

    await prisma.category.create({
      data: {
        name,
        slug
      }
    });

    redirect("/admin/categories");
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">إدارة التصنيفات</h1>
        <p className="text-white/70">إضافة وتحديث تصنيفات الدورات.</p>
      </header>
      <form action={createCategory} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <input
          name="name"
          placeholder="اسم التصنيف"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <input
          name="slug"
          placeholder="slug"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <button className="w-full rounded-xl bg-[#9e28b5] px-4 py-3 text-sm font-semibold" type="submit">
          إضافة التصنيف
        </button>
      </form>
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-semibold">{category.name}</p>
            <p className="text-sm text-white/70">{category.slug}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
