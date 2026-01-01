import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type User = { id: string; name: string; email: string; role: string };

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"]);
  const users: User[] = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { createdAt: "desc" }
  });

  async function updateRole(formData: FormData) {
    "use server";
    const userId = String(formData.get("userId") || "");
    const role = String(formData.get("role") || "");
    if (!userId || !role) return;
    await prisma.user.update({ where: { id: userId }, data: { role } });
    redirect("/admin/users");
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">المستخدمون</h1>
      <div className="space-y-3">
        {users.map((user: User) => (
          <form key={user.id} action={updateRole} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <input type="hidden" name="userId" value={user.id} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-sm text-white/70">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <select name="role" defaultValue={user.role} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm">
                  <option value="ADMIN">ADMIN</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                  <option value="STUDENT">STUDENT</option>
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
