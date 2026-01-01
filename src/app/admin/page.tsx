import Link from "next/link";
import { requireRole } from "@/lib/session";

export default async function AdminPage() {
  await requireRole(["ADMIN"]);

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">لوحة الإدارة</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/categories" className="rounded-2xl border border-white/10 bg-white/5 p-4">
          إدارة التصنيفات
        </Link>
        <Link href="/admin/courses" className="rounded-2xl border border-white/10 bg-white/5 p-4">
          إدارة الدورات
        </Link>
        <Link href="/admin/users" className="rounded-2xl border border-white/10 bg-white/5 p-4">
          إدارة المستخدمين
        </Link>
      </div>
    </section>
  );
}
