import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type Enrollment = {
  id: string;
  progressPercent: number;
  course: { title: string };
};

export default async function DashboardCoursesPage() {
  const session = await requireRole(["STUDENT"]);
  const enrollments: Enrollment[] = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      progressPercent: true,
      course: { select: { title: true } }
    }
  });

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">دوراتي</h1>
      <div className="space-y-4">
        {enrollments.map((enrollment: Enrollment) => (
          <div key={enrollment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold">{enrollment.course.title}</h2>
            <p className="text-sm text-white/70">نسبة التقدم: {enrollment.progressPercent}%</p>
          </div>
        ))}
      </div>
    </section>
  );
}
