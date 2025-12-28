export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-4xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-white/70">تواصل معنا</p>
        <h1 className="text-3xl font-bold">نحن هنا لمساعدتك</h1>
        <p className="text-white/80">
          أرسل استفسارك وسنعود لك خلال 24 ساعة.
        </p>
      </header>
      <form className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <input
          placeholder="الاسم الكامل"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm placeholder:text-white/40"
        />
        <input
          placeholder="البريد الإلكتروني"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm placeholder:text-white/40"
        />
        <textarea
          rows={4}
          placeholder="كيف يمكننا مساعدتك؟"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm placeholder:text-white/40"
        />
        <button className="w-full rounded-xl bg-[#9e28b5] px-4 py-3 text-sm font-semibold" type="submit">
          إرسال الرسالة
        </button>
      </form>
    </section>
  );
}
