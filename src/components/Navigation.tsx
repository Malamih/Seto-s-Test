import Link from "next/link";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/courses", label: "الدورات" },
  { href: "/about", label: "عن المنصة" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/signup", label: "إنشاء حساب" },
  { href: "/signin", label: "تسجيل الدخول" }
];

export default function Navigation() {
  return (
    <header className="border-b border-white/10 bg-[#0f206c]/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9e28b5] text-lg font-bold">
            ث
          </div>
          <div>
            <p className="text-lg font-bold">Thinkra</p>
            <p className="text-xs text-white/70">منصة التعلم الذكية</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/80 hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
