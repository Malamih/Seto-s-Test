import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Course = { id: string; title: string };
type Session = { id: string; title: string; startsAt: Date; course: Course };

export default async function InstructorSessionsPage() {
  const session = await requireRole(["INSTRUCTOR"]);
  const courses: Course[] = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    select: { id: true, title: true }
  });
  const sessions: Session[] = await prisma.liveSession.findMany({
    where: { course: { instructorId: session.user.id } },
    select: { id: true, title: true, startsAt: true, course: { select: { id: true, title: true } } },
    orderBy: { startsAt: "asc" }
  });

  async function createSession(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const startsAt = String(formData.get("startsAt") || "");
    const courseId = String(formData.get("courseId") || "");
    if (!title || !startsAt || !courseId) return;

    await prisma.liveSession.create({
      data: { title, startsAt: new Date(startsAt), courseId }
    });
    redirect("/instructor/sessions");
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">الجلسات المباشرة</h1>
      <form action={createSession} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
        <input name="title" placeholder="عنوان الجلسة" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
        <input name="startsAt" type="datetime-local" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2" />
        <select name="courseId" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2">
          {courses.map((course: Course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
        <button type="submit" className="w-full rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">إنشاء جلسة</button>
      </form>

      <div className="space-y-3">
        {sessions.map((item: Session) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm text-white/70">الدورة: {item.course.title}</p>
            <p className="text-sm text-white/70">الوقت: {item.startsAt.toLocaleString("ar")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
