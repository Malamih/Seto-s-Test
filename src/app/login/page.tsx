"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

const roleRedirects: Record<string, string> = {
  STUDENT: "/dashboard",
  INSTRUCTOR: "/instructor",
  ADMIN: "/admin"
};

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const result = await signIn("credentials", { redirect: false, email, password });
    if (result?.error) {
      setError("بيانات الدخول غير صحيحة.");
      setLoading(false);
      return;
    }

    const sessionResponse = await fetch("/api/auth/session");
    const session = await sessionResponse.json();
    const role = session?.user?.role as string | undefined;
    window.location.href = roleRedirects[role ?? "STUDENT"] ?? "/dashboard";
  }

  return (
    <section className="mx-auto w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">تسجيل الدخول</h1>
        <p className="text-white/70">أدخل بياناتك للوصول.</p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="email">البريد الإلكتروني</label>
          <input id="email" name="email" type="email" required className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="password">كلمة المرور</label>
          <input id="password" name="password" type="password" required className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3" />
        </div>
        {error ? <p className="text-sm text-red-200">{error}</p> : null}
        <button type="submit" className="w-full rounded-xl bg-[#9e28b5] px-4 py-3 text-sm font-semibold">
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>
      </form>
    </section>
  );
}
