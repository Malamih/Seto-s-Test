import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

interface CheckoutPageProps {
  params: { id: string };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: { lessons: true }
  });

  if (!course) {
    return <p>الدورة غير موجودة.</p>;
  }

  async function handleCheckout() {
    "use server";
    const session = await requireSession();
    const userId = session.user.id as string;

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId: course.id } },
      update: {},
      create: {
        userId,
        courseId: course.id
      }
    });

    await prisma.payment.create({
      data: {
        amount: course.price,
        currency: "USD",
        status: "PAID",
        provider: "mock",
        userId,
        courseId: course.id
      }
    });

    for (const lesson of course.lessons) {
      await prisma.progress.upsert({
        where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId: lesson.id } },
        update: {},
        create: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id
        }
      });
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">إتمام الدفع</h1>
        <p className="text-white/70">محاكاة عملية الدفع (جاهزة لربط Stripe لاحقًا).</p>
      </header>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
        <p className="text-lg font-semibold">{course.title}</p>
        <p className="text-white/70">المبلغ الإجمالي: ${course.price}</p>
        <form action={handleCheckout}>
          <button className="w-full rounded-xl bg-[#9e28b5] px-4 py-3 text-sm font-semibold" type="submit">
            تأكيد الدفع وإتمام الاشتراك
          </button>
        </form>
        <p className="text-xs text-white/60">
          TODO: ربط بوابة دفع حقيقية (Stripe) وتفعيل حالات الدفع المختلفة.
        </p>
      </div>
    </section>
  );
}
