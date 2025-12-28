import Link from "next/link";
import { requireRole } from "@/lib/session";

export default async function AdminDashboard() {
  await requireRole(["ADMIN"]);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-white/70">لوحة الإدارة</p>
        <h1 className="text-3xl font-bold">إدارة المنصة</h1>
        <p className="text-white/80">تحكم في المستخدمين، الدورات، والتقارير.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/admin/users" className="rounded-3xl border border-white/10 bg-white/5 p-6">
          إدارة المستخدمين
        </Link>
        <Link href="/admin/categories" className="rounded-3xl border border-white/10 bg-white/5 p-6">
          إدارة التصنيفات
        </Link>
        <Link href="/admin/courses" className="rounded-3xl border border-white/10 bg-white/5 p-6">
          إدارة الدورات
        </Link>
        <Link href="/admin/analytics" className="rounded-3xl border border-white/10 bg-white/5 p-6">
          التحليلات
        </Link>
      </div>
    </section>
  );
}
