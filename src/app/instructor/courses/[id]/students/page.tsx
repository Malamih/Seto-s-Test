import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Enrollment = { id: string; progressPercent: number; user: { name: string; email: string } };

type Course = { id: string; title: string };

interface StudentsPageProps {
  params: { id: string };
}

export default async function StudentsPage({ params }: StudentsPageProps) {
  const session = await requireRole(["INSTRUCTOR"]);
  const course: Course | null = await prisma.course.findFirst({
    where: { id: params.id, instructorId: session.user.id },
    select: { id: true, title: true }
  });

  if (!course) {
    notFound();
  }

  const enrollments: Enrollment[] = await prisma.enrollment.findMany({
    where: { courseId: course.id },
    select: {
      id: true,
      progressPercent: true,
      user: { select: { name: true, email: true } }
    }
  });

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">طلاب {course.title}</h1>
      <div className="space-y-3">
        {enrollments.map((enrollment: Enrollment) => (
          <div key={enrollment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold">{enrollment.user.name}</h2>
            <p className="text-sm text-white/70">{enrollment.user.email}</p>
            <p className="text-sm text-white/70">التقدم: {enrollment.progressPercent}%</p>
          </div>
        ))}
      </div>
    </section>
  );
}
