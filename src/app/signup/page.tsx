import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export default function SignupPage() {
  async function handleSignup(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!name || !email || !password) {
      return;
    }

    const existingCount = await prisma.user.count({ where: { email } });
    if (existingCount > 0) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "STUDENT"
      }
    });

    redirect("/login");
  }

  return (
    <section className="mx-auto w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">إنشاء حساب</h1>
        <p className="text-white/70">ابدأ رحلة التعلم الآن.</p>
      </header>
      <form action={handleSignup} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="name">الاسم الكامل</label>
          <input id="name" name="name" required className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="email">البريد الإلكتروني</label>
          <input id="email" name="email" type="email" required className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="password">كلمة المرور</label>
          <input id="password" name="password" type="password" required className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3" />
        </div>
        <button type="submit" className="w-full rounded-xl bg-[#9e28b5] px-4 py-3 text-sm font-semibold">
          إنشاء الحساب
        </button>
      </form>
    </section>
  );
}
