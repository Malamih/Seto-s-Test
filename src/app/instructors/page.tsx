import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Instructor = { id: string; name: string };

export default async function InstructorsPage() {
  const instructors: Instructor[] = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    select: { id: true, name: true }
  });

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">المدربون</h1>
        <p className="text-white/70">تعرف على خبراء المنصة.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {instructors.map((instructor: Instructor) => (
          <div key={instructor.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold">{instructor.name}</h2>
            <Link href={`/instructors/${instructor.id}`} className="mt-2 inline-flex text-sm text-white/70">
              عرض الملف
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
