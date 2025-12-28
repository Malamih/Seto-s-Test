import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import type { User } from "@/types/domain";

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"]);
  const users: User[] = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  async function updateUser(formData: FormData) {
    "use server";
    await requireRole(["ADMIN"]);
    const id = formData.get("userId")?.toString();
    const role = formData.get("role")?.toString();
    const isActive = formData.get("isActive") === "on";

    if (!id || !role) return;

    await prisma.user.update({
      where: { id },
      data: { role, isActive }
    });

    redirect("/admin/users");
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
        <p className="text-white/70">تعديل الأدوار وتفعيل/تعطيل الحسابات.</p>
      </header>
      <div className="space-y-4">
        {users.map((user: User) => (
          <form key={user.id} action={updateUser} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <input type="hidden" name="userId" value={user.id} />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-white/70">{user.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  name="role"
                  defaultValue={user.role}
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                  <option value="STUDENT">STUDENT</option>
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input name="isActive" type="checkbox" defaultChecked={user.isActive} />
                  نشط
                </label>
                <button className="rounded-xl bg-[#9e28b5] px-3 py-2 text-xs font-semibold" type="submit">
                  حفظ
                </button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
