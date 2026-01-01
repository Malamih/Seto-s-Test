import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Comment = {
  id: string;
  content: string;
  reply: string | null;
  user: { name: string };
  course: { title: string };
};

export default async function InstructorCommentsPage() {
  const session = await requireRole(["INSTRUCTOR"]);
  const comments: Comment[] = await prisma.comment.findMany({
    where: { course: { instructorId: session.user.id } },
    select: {
      id: true,
      content: true,
      reply: true,
      user: { select: { name: true } },
      course: { select: { title: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  async function saveReply(formData: FormData) {
    "use server";
    const id = String(formData.get("commentId") || "");
    const reply = String(formData.get("reply") || "");
    if (!id) return;

    await prisma.comment.update({ where: { id }, data: { reply } });
    redirect("/instructor/comments");
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">تعليقات الطلاب</h1>
      <div className="space-y-4">
        {comments.map((comment: Comment) => (
          <div key={comment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/70">{comment.course.title}</p>
            <p className="mt-2 font-semibold">{comment.user.name}</p>
            <p className="text-sm text-white/70">{comment.content}</p>
            <form action={saveReply} className="mt-3 space-y-2">
              <input type="hidden" name="commentId" value={comment.id} />
              <textarea
                name="reply"
                defaultValue={comment.reply ?? ""}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm"
                placeholder="أضف ردك هنا"
              />
              <button type="submit" className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">
                حفظ الرد
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
