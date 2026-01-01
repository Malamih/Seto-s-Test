import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Lesson = { id: string; title: string; order: number };

type Course = { id: string; title: string; lessons: Lesson[] };

interface LessonsPageProps {
  params: { id: string };
}

export default async function LessonsPage({ params }: LessonsPageProps) {
  const session = await requireRole(["INSTRUCTOR"]);
  const course: Course | null = await prisma.course.findFirst({
    where: { id: params.id, instructorId: session.user.id },
    select: {
      id: true,
      title: true,
      lessons: { select: { id: true, title: true, order: true }, orderBy: { order: "asc" } }
    }
  });

  if (!course) {
    notFound();
  }

  async function addLesson(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const order = Number(formData.get("order") || 0);
    const content = String(formData.get("content") || "");
    const videoUrl = String(formData.get("videoUrl") || "");

    if (!title) return;

    await prisma.lesson.create({
      data: {
        title,
        order,
        content,
        videoUrl: videoUrl || null,
        courseId: course.id
      }
    });

    redirect(`/instructor/courses/${course.id}/lessons`);
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">دروس {course.title}</h1>
      <form action={addLesson} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
        <input name="title" placeholder="عنوان الدرس" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
        <input name="order" type="number" placeholder="ترتيب الدرس" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
        <textarea name="content" placeholder="محتوى الدرس" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
        <input name="videoUrl" placeholder="رابط الفيديو" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
        <button type="submit" className="w-full rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">إضافة درس</button>
      </form>

      <div className="space-y-3">
        {course.lessons.map((lesson: Lesson) => (
          <div key={lesson.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold">{lesson.title}</h2>
            <p className="text-sm text-white/70">الترتيب: {lesson.order}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
