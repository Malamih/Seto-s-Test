import Link from "next/link";
import { requireRole } from "@/lib/session";

export default async function InstructorDashboard() {
  const session = await requireRole(["INSTRUCTOR"]);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-white/70">لوحة المدرب</p>
        <h1 className="text-3xl font-bold">مرحبًا {session.user.name}</h1>
        <p className="text-white/80">إدارة الدورات والمحتوى والتفاعل مع الطلاب.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/instructor/courses" className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">إدارة الدورات</h2>
          <p className="mt-2 text-sm text-white/70">إنشاء الدورات وتحديث محتواها.</p>
        </Link>
        <Link href="/instructor/comments" className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">الأسئلة والتعليقات</h2>
          <p className="mt-2 text-sm text-white/70">متابعة أسئلة الطلاب والرد عليها.</p>
        </Link>
        <Link href="/instructor/sessions" className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">الجلسات المباشرة</h2>
          <p className="mt-2 text-sm text-white/70">إعداد وإدارة الجلسات القادمة.</p>
        </Link>
      </div>
    </section>
  );
}
