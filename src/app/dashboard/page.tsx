import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type EnrollmentWithCourseProgress = Prisma.EnrollmentGetPayload<{
  include: { course: true; progress: true };
}>;
type NotificationItem = Prisma.NotificationGetPayload<{}>;
type CertificateWithCourse = Prisma.CertificateGetPayload<{ include: { course: true } }>;

export default async function StudentDashboard() {
  const session = await requireRole(["STUDENT"]);
  const userId = session.user.id as string;

  const enrollments: EnrollmentWithCourseProgress[] = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: true,
      progress: true
    }
  });

  const notifications: NotificationItem[] = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  const certificates: CertificateWithCourse[] = await prisma.certificate.findMany({
    where: { userId },
    include: { course: true }
  });

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-white/70">لوحة الطالب</p>
        <h1 className="text-3xl font-bold">مرحبًا، {session.user.name}</h1>
        <p className="text-white/80">تابع دوراتك وتقدمك اليومي من هنا.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">دوراتي</h2>
          <div className="space-y-4">
            {enrollments.map((enrollment: EnrollmentWithCourseProgress) => {
              const totalLessons = enrollment.progress.length;
              const completed = enrollment.progress.filter((item) => item.isCompleted).length;
              const percentage = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
              return (
                <article key={enrollment.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{enrollment.course.title}</h3>
                    <span className="text-sm text-white/70">{percentage}% مكتمل</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">{enrollment.course.description}</p>
                  <Link
                    href={`/dashboard/courses/${enrollment.courseId}`}
                    className="mt-4 inline-flex rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold"
                  >
                    متابعة الدورة
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">إشعاراتي</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {notifications.map((notification: NotificationItem) => (
                <li key={notification.id}>
                  <p className="font-semibold">{notification.title}</p>
                  <p>{notification.message}</p>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/notifications" className="mt-4 inline-flex text-sm text-white/80">
              عرض جميع الإشعارات
            </Link>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">الشهادات</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {certificates.map((certificate: CertificateWithCourse) => (
                <li key={certificate.id}>
                  <Link href={`/dashboard/certificates/${certificate.id}`}>
                    شهادة {certificate.course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
