import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Course = { id: string; title: string; description: string };
type Instructor = { id: string; name: string; courses: Course[] };

interface InstructorPageProps {
  params: { id: string };
}

export default async function InstructorPage({ params }: InstructorPageProps) {
  const instructor: Instructor | null = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      courses: {
        where: { status: "PUBLISHED" },
        select: { id: true, title: true, description: true }
      }
    }
  });

  if (!instructor) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{instructor.name}</h1>
        <p className="text-white/70">مدرب معتمد على منصة Thinkra.</p>
      </header>
      <div className="space-y-4">
        {instructor.courses.map((course: Course) => (
          <article key={course.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="mt-2 text-sm text-white/70">{course.description}</p>
            <Link href={`/courses/${course.id}`} className="mt-2 inline-flex text-sm text-white/70">
              عرض الدورة
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
