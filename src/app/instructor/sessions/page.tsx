import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type CourseListItem = Prisma.CourseGetPayload<{}>;
type LiveSessionWithCourse = Prisma.LiveSessionGetPayload<{ include: { course: true } }>;

export default async function InstructorSessionsPage() {
  const session = await requireRole(["INSTRUCTOR"]);
  const instructorId = session.user.id as string;
  const courses: CourseListItem[] = await prisma.course.findMany({
    where: { instructorId }
  });
  const sessions: LiveSessionWithCourse[] = await prisma.liveSession.findMany({
    where: { instructorId },
    include: { course: true },
    orderBy: { scheduledAt: "asc" }
  });

  async function createSession(formData: FormData) {
    "use server";
    await requireRole(["INSTRUCTOR"]);
    const title = formData.get("title")?.toString().trim();
    const scheduledAt = formData.get("scheduledAt")?.toString();
    const meetingUrl = formData.get("meetingUrl")?.toString().trim();
    const courseId = formData.get("courseId")?.toString();

    if (!title || !scheduledAt || !meetingUrl || !courseId) return;

    await prisma.liveSession.create({
      data: {
        title,
        meetingUrl,
        scheduledAt: new Date(scheduledAt),
        instructorId,
        courseId
      }
    });

    redirect("/instructor/sessions");
  }

  async function deleteSession(formData: FormData) {
    "use server";
    await requireRole(["INSTRUCTOR"]);
    const sessionId = formData.get("sessionId")?.toString();
    if (!sessionId) return;

    await prisma.liveSession.delete({ where: { id: sessionId } });
    redirect("/instructor/sessions");
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">الجلسات المباشرة</h1>
        <p className="text-white/70">أنشئ جلسات مباشرة لطلابك وشارك رابط الاجتماع.</p>
      </header>
      <form action={createSession} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <input
          name="title"
          placeholder="عنوان الجلسة"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <input
          name="scheduledAt"
          type="datetime-local"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <input
          name="meetingUrl"
          placeholder="رابط الاجتماع"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        />
        <select
          name="courseId"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
        >
          {courses.map((course: CourseListItem) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <button className="w-full rounded-xl bg-[#9e28b5] px-4 py-3 text-sm font-semibold" type="submit">
          إنشاء الجلسة
        </button>
      </form>
      <div className="space-y-4">
        {sessions.map((sessionItem: LiveSessionWithCourse) => (
          <article key={sessionItem.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">{sessionItem.title}</h2>
            <p className="text-sm text-white/70">الدورة: {sessionItem.course.title}</p>
            <p className="text-sm text-white/70">الموعد: {sessionItem.scheduledAt.toLocaleString("ar")}</p>
            <p className="text-sm text-white/70">الرابط: {sessionItem.meetingUrl}</p>
            <form action={deleteSession} className="mt-3">
              <input type="hidden" name="sessionId" value={sessionItem.id} />
              <button className="rounded-xl border border-red-200/40 px-3 py-1 text-xs text-red-100" type="submit">
                حذف الجلسة
              </button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
