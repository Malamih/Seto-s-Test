import type { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type CommentWithRelations = Prisma.CommentGetPayload<{
  include: { user: true; course: true; lesson: true };
}>;

export default async function InstructorCommentsPage() {
  const session = await requireRole(["INSTRUCTOR"]);
  const comments: CommentWithRelations[] = await prisma.comment.findMany({
    where: { course: { instructorId: session.user.id as string } },
    include: { user: true, course: true, lesson: true },
    orderBy: { createdAt: "desc" }
  });

  async function replyToComment(formData: FormData) {
    "use server";
    await requireRole(["INSTRUCTOR"]);
    const commentId = formData.get("commentId")?.toString();
    const reply = formData.get("reply")?.toString().trim();
    if (!commentId || !reply) return;

    await prisma.comment.update({
      where: { id: commentId },
      data: { reply }
    });

    redirect("/instructor/comments");
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">تعليقات الطلاب</h1>
        <p className="text-white/70">تابع الأسئلة ورد على استفسارات الطلاب.</p>
      </header>
      <div className="space-y-4">
        {comments.map((comment: CommentWithRelations) => (
          <article key={comment.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/70">
              <p>الطالب: {comment.user.name}</p>
              <p>الدورة: {comment.course.title}</p>
              {comment.lesson ? <p>الدرس: {comment.lesson.title}</p> : null}
            </div>
            <p className="mt-3 text-sm">{comment.content}</p>
            <form action={replyToComment} className="mt-4 space-y-2">
              <input type="hidden" name="commentId" value={comment.id} />
              <textarea
                name="reply"
                rows={2}
                defaultValue={comment.reply ?? ""}
                placeholder="أضف ردك هنا"
                className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-sm placeholder:text-white/40"
              />
              <button className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold" type="submit">
                حفظ الرد
              </button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
