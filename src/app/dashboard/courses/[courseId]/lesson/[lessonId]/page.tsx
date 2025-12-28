import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type LessonWithRelations = Prisma.LessonGetPayload<{
  include: { course: true; comments: { include: { user: true } } };
}>;

interface LessonPageProps {
  params: { courseId: string; lessonId: string };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await requireRole(["STUDENT"]);
  const userId = session.user.id as string;

  const lesson: LessonWithRelations | null = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      course: true,
      comments: { include: { user: true }, orderBy: { createdAt: "desc" } }
    }
  });

  if (!lesson) {
    return <p>الدرس غير متاح.</p>;
  }

  async function markComplete() {
    "use server";
    await requireRole(["STUDENT"]);
    const current = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: params.courseId } }
    });
    if (!current) return;

    await prisma.progress.updateMany({
      where: { enrollmentId: current.id, lessonId: params.lessonId },
      data: { isCompleted: true }
    });
  }

  async function addComment(formData: FormData) {
    "use server";
    await requireRole(["STUDENT"]);
    const content = formData.get("content")?.toString().trim();
    if (!content) return;

    await prisma.comment.create({
      data: {
        content,
        userId,
        courseId: params.courseId,
        lessonId: params.lessonId
      }
    });
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-2">
        <p className="text-sm text-white/70">{lesson.course.title}</p>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-white/70">
          <span>فيديو: {lesson.videoUrl}</span>
          {lesson.attachmentUrl ? <span>ملف مرفق متاح</span> : null}
        </div>
      </header>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">مشغل الدرس</h2>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-sm text-white/70">
          ضع رابط الفيديو هنا داخل مشغل مخصص (يدعم Vimeo/YouTube).
        </div>
        {lesson.attachmentUrl ? (
          <Link
            href={lesson.attachmentUrl}
            className="mt-4 inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm"
          >
            تحميل المرفق
          </Link>
        ) : null}
        <form action={markComplete} className="mt-6">
          <button className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold" type="submit">
            وضع علامة مكتمل
          </button>
        </form>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">المناقشة</h2>
        <form action={addComment} className="mt-4 space-y-3">
          <textarea
            name="content"
            rows={3}
            className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-sm placeholder:text-white/40"
            placeholder="اكتب تعليقك هنا"
          />
          <button className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold" type="submit">
            إضافة تعليق
          </button>
        </form>
        <div className="mt-6 space-y-3 text-sm text-white/70">
          {lesson.comments.map((comment: LessonWithRelations["comments"][number]) => (
            <div key={comment.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="font-semibold">{comment.user.name}</p>
              <p className="mt-1">{comment.content}</p>
              {comment.reply ? (
                <p className="mt-2 text-xs text-white/60">رد المدرب: {comment.reply}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
