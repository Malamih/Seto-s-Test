import Link from "next/link";
import { requireRole } from "@/lib/session";

export default async function InstructorOverview() {
  await requireRole(["INSTRUCTOR"]);

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">لوحة المدرب</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/instructor/courses" className="rounded-2xl border border-white/10 bg-white/5 p-4">
          إدارة الدورات
        </Link>
        <Link href="/instructor/comments" className="rounded-2xl border border-white/10 bg-white/5 p-4">
          تعليقات الطلاب
        </Link>
        <Link href="/instructor/sessions" className="rounded-2xl border border-white/10 bg-white/5 p-4">
          الجلسات المباشرة
        </Link>
      </div>
    </section>
  );
}
