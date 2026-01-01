import Link from "next/link";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type Enrollment = { id: string; courseId: string; course: { title: string } };

type Notification = { id: string; title: string; body: string };

export default async function StudentDashboard() {
  const session = await requireRole(["STUDENT"]);
  const enrollments: Enrollment[] = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    select: { id: true, courseId: true, course: { select: { title: true } } }
  });
  const notifications: Notification[] = await prisma.notification.findMany({
    where: { userId: session.user.id },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, body: true }
  });

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">لوحة الطالب</h1>
        <p className="text-white/70">مرحبًا {session.user.name}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">دوراتي</h2>
          {enrollments.map((enrollment: Enrollment) => (
            <div key={enrollment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold">{enrollment.course.title}</p>
              <Link href="/dashboard/courses" className="mt-2 inline-flex text-sm text-white/70">
                إدارة الدورة
              </Link>
            </div>
          ))}
        </div>
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-semibold">الإشعارات</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {notifications.map((notification: Notification) => (
              <li key={notification.id}>
                <p className="font-semibold">{notification.title}</p>
                <p>{notification.body}</p>
              </li>
            ))}
          </ul>
          <Link href="/dashboard/notifications" className="mt-3 inline-flex text-sm text-white/70">
            جميع الإشعارات
          </Link>
        </aside>
      </div>
    </section>
  );
}
