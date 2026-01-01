import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Lesson = { id: string; title: string; order: number };
type ProgressItem = { lessonId: string; isCompleted: boolean; lesson: Lesson };
type Course = { id: string; title: string };
type EnrollmentWithProgress = { course: Course; progress: ProgressItem[] };

interface CourseProgressProps {
  params: { courseId: string };
}

export default async function CourseProgressPage({ params }: CourseProgressProps) {
  const session = await requireRole(["STUDENT"]);
  const userId = session.user.id as string;

  const enrollment: EnrollmentWithProgress | null = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: params.courseId } },
    select: {
      course: { select: { id: true, title: true } },
      progress: {
        select: {
          lessonId: true,
          isCompleted: true,
          lesson: { select: { id: true, title: true, order: true } }
        }
      }
    }
  });

  if (!enrollment) {
    notFound();
  }

  const lessons = enrollment.progress.sort((a, b) => a.lesson.order - b.lesson.order);
  const completed = lessons.filter((lesson) => lesson.isCompleted).length;
  const percentage = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{enrollment.course.title}</h1>
        <p className="text-white/70">نسبة الإنجاز: {percentage}%</p>
      </header>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">الدروس</h2>
        <ul className="mt-4 space-y-3 text-sm text-white/70">
          {lessons.map((item: ProgressItem) => (
            <li key={item.lessonId} className="flex items-center justify-between">
              <span>{item.lesson.title}</span>
              <Link
                href={`/dashboard/courses/${params.courseId}/lesson/${item.lessonId}`}
                className="rounded-xl border border-white/20 px-3 py-1 text-xs"
              >
                {item.isCompleted ? "مكتمل" : "ابدأ الدرس"}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
