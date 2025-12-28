import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type CourseWithLessons = Prisma.CourseGetPayload<{ include: { lessons: true } }>;

interface CourseLessonsProps {
  params: { id: string };
}

export default async function CourseLessonsPage({ params }: CourseLessonsProps) {
  const session = await requireRole(["INSTRUCTOR"]);
  const course: CourseWithLessons | null = await prisma.course.findFirst({
    where: { id: params.id, instructorId: session.user.id as string },
    include: { lessons: { orderBy: { order: "asc" } } }
  });

  if (!course) {
    return <p>الدورة غير متاحة.</p>;
  }

  async function addLesson(formData: FormData) {
    "use server";
    await requireRole(["INSTRUCTOR"]);
    const title = formData.get("title")?.toString().trim();
    const order = Number(formData.get("order")?.toString() ?? 0);
    const videoUrl = formData.get("videoUrl")?.toString().trim();
    const attachmentUrl = formData.get("attachmentUrl")?.toString().trim();

    if (!title || !videoUrl) {
      return;
    }

    await prisma.lesson.create({
      data: {
        title,
        order,
        videoUrl,
        attachmentUrl: attachmentUrl || null,
        courseId: course.id
      }
    });

    redirect(`/instructor/courses/${course.id}/lessons`);
  }

  async function deleteLesson(formData: FormData) {
    "use server";
    await requireRole(["INSTRUCTOR"]);
    const lessonId = formData.get("lessonId")?.toString();
    if (!lessonId) return;

    await prisma.lesson.delete({ where: { id: lessonId } });
    redirect(`/instructor/courses/${course.id}/lessons`);
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">دروس {course.title}</h1>
        <p className="text-white/70">قم بترتيب الدروس وإضافة ملفات مرفقة.</p>
      </header>
      <form action={addLesson} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <input
          name="title"
          placeholder="عنوان الدرس"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="order"
            type="number"
            placeholder="ترتيب الدرس"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
          />
          <input
            name="videoUrl"
            placeholder="رابط الفيديو"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
          />
        </div>
        <input
          name="attachmentUrl"
          placeholder="رابط الملف المرفق (اختياري)"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <button className="w-full rounded-xl bg-[#9e28b5] px-4 py-3 text-sm font-semibold" type="submit">
          إضافة الدرس
        </button>
      </form>
      <div className="space-y-4">
        {course.lessons.map((lesson: CourseWithLessons["lessons"][number]) => (
          <div key={lesson.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold">{lesson.title}</h2>
            <p className="text-sm text-white/70">الترتيب: {lesson.order}</p>
            <form action={deleteLesson} className="mt-3">
              <input type="hidden" name="lessonId" value={lesson.id} />
              <button className="rounded-xl border border-red-200/40 px-3 py-1 text-xs text-red-100" type="submit">
                حذف الدرس
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
