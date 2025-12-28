import { Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

type CourseWithDetails = Prisma.CourseGetPayload<{
  include: {
    category: true;
    instructor: true;
    lessons: true;
    reviews: { include: { user: true } };
    comments: { include: { user: true } };
    liveSessions: true;
  };
}>;

interface CourseDetailsProps {
  params: { id: string };
}

export default async function CourseDetails({ params }: CourseDetailsProps) {
  const course: CourseWithDetails | null = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      instructor: true,
      lessons: { orderBy: { order: "asc" } },
      reviews: { include: { user: true } },
      comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
      liveSessions: true
    }
  });

  if (!course) {
    return <p>الدورة غير متاحة حاليًا.</p>;
  }

  const avgRating = course.reviews.length
    ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length
    : 0;

  async function addComment(formData: FormData) {
    "use server";
    const session = await requireSession();
    const content = formData.get("content")?.toString().trim();
    if (!content) return;

    await prisma.comment.create({
      data: {
        content,
        userId: session.user.id as string,
        courseId: course.id
      }
    });
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-10">
      <header className="space-y-3">
        <p className="text-sm text-white/70">{course.category.name}</p>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-white/80">{course.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          <span>المدرب: {course.instructor.name}</span>
          <span>التقييم: {avgRating.toFixed(1)}</span>
          <span>السعر: ${course.price}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/courses/${course.id}/checkout`}
            className="rounded-xl bg-[#9e28b5] px-5 py-2 text-sm font-semibold"
          >
            اشترك الآن
          </Link>
          <Link
            href={`/instructors/${course.instructor.id}`}
            className="rounded-xl border border-white/30 px-5 py-2 text-sm font-semibold"
          >
            صفحة المدرب
          </Link>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">محتوى الدورة</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {course.lessons.map((lesson: CourseWithDetails["lessons"][number]) => (
                <li key={lesson.id}>• {lesson.title}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">التقييمات</h2>
            <div className="mt-4 space-y-4 text-sm text-white/70">
              {course.reviews.map((review: CourseWithDetails["reviews"][number]) => (
                <div key={review.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="font-semibold">{review.user.name}</p>
                  <p>التقييم: {review.rating} نجوم</p>
                  <p className="mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">النقاشات</h2>
            <form action={addComment} className="mt-4 space-y-3">
              <textarea
                name="content"
                rows={3}
                className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-sm placeholder:text-white/40"
                placeholder="أضف سؤالًا أو تعليقًا"
              />
              <button className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold" type="submit">
                إرسال التعليق
              </button>
            </form>
            <div className="mt-6 space-y-3 text-sm text-white/70">
              {course.comments.map((comment: CourseWithDetails["comments"][number]) => (
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
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">جلسات مباشرة</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {course.liveSessions.map((session: CourseWithDetails["liveSessions"][number]) => (
                <li key={session.id}>• {session.title}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
