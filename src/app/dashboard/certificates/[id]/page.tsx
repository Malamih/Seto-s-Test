import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

interface CertificatePageProps {
  params: { id: string };
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const session = await requireRole(["STUDENT"]);
  const certificate = await prisma.certificate.findUnique({
    where: { id: params.id },
    include: { course: true, user: true }
  });

  if (!certificate || certificate.userId !== session.user.id) {
    return <p>الشهادة غير متاحة.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm text-white/70">شهادة إتمام</p>
        <h1 className="mt-2 text-3xl font-bold">{certificate.course.title}</h1>
        <p className="mt-4 text-white/80">نمنح هذه الشهادة للمتدرب</p>
        <p className="mt-2 text-xl font-semibold">{certificate.user.name}</p>
        <p className="mt-4 text-sm text-white/70">رمز الشهادة: {certificate.code}</p>
      </div>
    </section>
  );
}
