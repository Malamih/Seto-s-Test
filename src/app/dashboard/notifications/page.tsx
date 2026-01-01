import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type NotificationItem = { id: string; title: string; message: string };

export default async function NotificationsPage() {
  const session = await requireRole(["STUDENT"]);
  const notifications: NotificationItem[] = await prisma.notification.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, message: true }
  });

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">الإشعارات</h1>
        <p className="text-white/70">جميع التنبيهات والتحديثات الخاصة بك.</p>
      </header>
      <div className="space-y-4">
        {notifications.map((notification: NotificationItem) => (
          <div key={notification.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">{notification.title}</h2>
            <p className="mt-2 text-sm text-white/70">{notification.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
