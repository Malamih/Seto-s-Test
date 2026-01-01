# Thinkra MVP

منصة تعليم عربية مبنية باستخدام Next.js (App Router) + TypeScript + TailwindCSS + Prisma (SQLite).

## الإعداد المحلي
1. انسخ ملف البيئة:
   ```bash
   cp .env.example .env
   ```
2. ثبّت الاعتمادات وشغّل Prisma:
   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```
3. شغّل المشروع:
   ```bash
   npm run dev
   ```

## حسابات تجريبية
كلمة المرور لجميع الحسابات: `Thinkra123`
- admin@thinkra.local (ADMIN)
- instructor@thinkra.local (INSTRUCTOR)
- student@thinkra.local (STUDENT)

## المتغيرات البيئية
- `DATABASE_URL` = `file:./dev.db`
- `NEXTAUTH_SECRET` = مفتاح سري للجلسات
- `NEXTAUTH_URL` = رابط التطبيق المحلي
- `APP_URL` = رابط التطبيق (للاستخدام في أي روابط داخلية)

## نشر على Vercel
- تأكد من تعيين نفس المتغيرات البيئية داخل إعدادات المشروع.
- شغّل `npx prisma migrate deploy` و`npx prisma db seed` ضمن خط النشر إذا كنت تريد البيانات التجريبية.

## المسارات الرئيسية
- `/` الصفحة الرئيسية
- `/courses` الدورات
- `/instructors` المدربون
- `/login` تسجيل الدخول
- `/dashboard` لوحة الطالب
- `/instructor` لوحة المدرب
- `/admin` لوحة الإدارة
