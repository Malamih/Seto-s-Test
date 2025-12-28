import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface CoursesPageProps {
  searchParams?: {
    query?: string;
    category?: string;
    price?: string;
    rating?: string;
  };
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const query = searchParams?.query?.trim() ?? "";
  const category = searchParams?.category ?? "all";
  const price = searchParams?.price ?? "all";
  const rating = Number(searchParams?.rating ?? "0");

  const categories = await prisma.category.findMany();
  const courses = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
      ...(query
        ? {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } }
            ]
          }
        : {}),
      ...(category !== "all" ? { category: { slug: category } } : {}),
      ...(price === "free" ? { price: 0 } : {}),
      ...(price === "paid" ? { price: { gt: 0 } } : {})
    },
    include: {
      category: true,
      instructor: true,
      reviews: true
    }
  });

  const filtered = courses.filter((course) => {
    const avgRating = course.reviews.length
      ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length
      : 0;
    return avgRating >= rating;
  });

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">الدورات التدريبية</h1>
        <p className="text-white/70">ابحث في الدورات حسب المجال أو السعر أو التقييم.</p>
      </header>

      <form className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
        <input
          name="query"
          defaultValue={query}
          placeholder="ابحث عن دورة"
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/40"
        />
        <select
          name="category"
          defaultValue={category}
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm"
        >
          <option value="all">كل التصنيفات</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          name="price"
          defaultValue={price}
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm"
        >
          <option value="all">كل الأسعار</option>
          <option value="free">مجاني</option>
          <option value="paid">مدفوع</option>
        </select>
        <select
          name="rating"
          defaultValue={rating}
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm"
        >
          <option value="0">كل التقييمات</option>
          <option value="3">3 نجوم فأعلى</option>
          <option value="4">4 نجوم فأعلى</option>
          <option value="5">5 نجوم</option>
        </select>
        <button
          className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold md:col-span-4"
          type="submit"
        >
          تطبيق الفلاتر
        </button>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((course) => {
          const avgRating = course.reviews.length
            ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length
            : 0;
          return (
            <article key={course.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="mt-2 text-sm text-white/70">{course.description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
                <span>{course.category.name}</span>
                <span>مدرب: {course.instructor.name}</span>
                <span>التقييم: {avgRating.toFixed(1)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold">${course.price}</span>
                <Link
                  href={`/courses/${course.id}`}
                  className="rounded-xl bg-[#9e28b5] px-4 py-2 text-sm font-semibold"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
