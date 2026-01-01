import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type Notification = { id: string; title: string; body: string };

export default async function DashboardNotificationsPage() {
  const session = await requireRole(["STUDENT"]);
  const notifications: Notification[] = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, body: true }
  });

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">الإشعارات</h1>
      <div className="space-y-3">
        {notifications.map((notification: Notification) => (
          <div key={notification.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold">{notification.title}</h2>
            <p className="text-sm text-white/70">{notification.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
