import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Category = { id: string; name: string; slug: string };

export default async function AdminCategoriesPage() {
  await requireRole(["ADMIN"]);
  const categories: Category[] = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { createdAt: "desc" }
  });

  async function addCategory(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const slug = String(formData.get("slug") || "");
    if (!name || !slug) return;
    await prisma.category.create({ data: { name, slug } });
    redirect("/admin/categories");
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">التصنيفات</h1>
      <form action={addCategory} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
        <input name="name" placeholder="اسم التصنيف" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
        <input name="slug" placeholder="slug" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
        <button type="submit" className="w-full rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">إضافة</button>
      </form>
      <div className="space-y-3">
        {categories.map((category: Category) => (
          <div key={category.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold">{category.name}</h2>
            <p className="text-sm text-white/70">{category.slug}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
