import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface InstructorPageProps {
  params: { id: string };
}

export default async function InstructorPage({ params }: InstructorPageProps) {
  const instructor = await prisma.user.findUnique({
    where: { id: params.id },
    include: { courses: { where: { status: "PUBLISHED" } } }
  });

  if (!instructor) {
    return <p>المدرب غير موجود.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">{instructor.name}</h1>
        <p className="text-white/70">خبير معتمد في تصميم البرامج التدريبية.</p>
      </header>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-lg font-semibold">الدورات المقدمة</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {instructor.courses.map((course) => (
            <article key={course.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <h3 className="font-semibold">{course.title}</h3>
              <p className="mt-2 text-sm text-white/70">{course.description}</p>
              <Link
                href={`/courses/${course.id}`}
                className="mt-3 inline-flex text-sm text-white/80"
              >
                عرض الدورة
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
