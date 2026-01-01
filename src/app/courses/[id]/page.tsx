import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Lesson = { id: string; title: string; order: number };
type Review = { id: string; rating: number; comment: string; user: { name: string } };
type CourseDetail = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: { name: string };
  instructor: { id: string; name: string };
  lessons: Lesson[];
  reviews: Review[];
};

interface CourseDetailProps {
  params: { id: string };
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const course: CourseDetail | null = await prisma.course.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      category: { select: { name: true } },
      instructor: { select: { id: true, name: true } },
      lessons: { select: { id: true, title: true, order: true }, orderBy: { order: "asc" } },
      reviews: { select: { id: true, rating: true, comment: true, user: { select: { name: true } } } }
    }
  });

  if (!course) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-2">
        <p className="text-sm text-white/70">{course.category.name}</p>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-white/70">{course.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          <span>السعر: ${course.price}</span>
          <span>المدرب: {course.instructor.name}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/courses/${course.id}`} className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold">
            اشتراك في الدورة
          </Link>
          <Link href={`/instructors/${course.instructor.id}`} className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold">
            ملف المدرب
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">الدروس</h2>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          {course.lessons.map((lesson: Lesson) => (
            <li key={lesson.id}>• {lesson.title}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">التقييمات</h2>
        <div className="mt-4 space-y-3 text-sm text-white/70">
          {course.reviews.map((review: Review) => (
            <div key={review.id} className="rounded-xl border border-white/10 bg-white/10 p-4">
              <p className="font-semibold">{review.user.name}</p>
              <p>التقييم: {review.rating}</p>
              <p className="mt-1">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
