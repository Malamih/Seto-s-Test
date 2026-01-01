import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type Certificate = { id: string; course: { title: string } };

export default async function DashboardCertificatesPage() {
  const session = await requireRole(["STUDENT"]);
  const certificates: Certificate[] = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    select: { id: true, course: { select: { title: true } } }
  });

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">الشهادات</h1>
      <div className="space-y-3">
        {certificates.map((certificate: Certificate) => (
          <div key={certificate.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold">{certificate.course.title}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}
