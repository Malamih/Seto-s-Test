import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

interface StudentsPageProps {
  params: { id: string };
}

export default async function CourseStudentsPage({ params }: StudentsPageProps) {
  const session = await requireRole(["INSTRUCTOR"]);
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: params.id, course: { instructorId: session.user.id as string } },
    include: { user: true, progress: true }
  });

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">الطلاب المسجلون</h1>
        <p className="text-white/70">متابعة تقدم الطلاب في هذه الدورة.</p>
      </header>
      <div className="space-y-4">
        {enrollments.map((enrollment) => {
          const total = enrollment.progress.length;
          const completed = enrollment.progress.filter((item) => item.isCompleted).length;
          const percentage = total ? Math.round((completed / total) * 100) : 0;
          return (
            <div key={enrollment.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">{enrollment.user.name}</h2>
              <p className="text-sm text-white/70">البريد: {enrollment.user.email}</p>
              <p className="mt-2 text-sm text-white/70">نسبة الإنجاز: {percentage}%</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
