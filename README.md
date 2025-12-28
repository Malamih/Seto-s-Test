# Thinkra MVP

منصة تعليمية عربية مبنية بـ Next.js (App Router) + TypeScript + TailwindCSS + Prisma + NextAuth.

## المتطلبات
- Node.js 18+
- SQLite (يأتي ضمن Prisma عند استخدام ملف محلي)

## التشغيل محليًا
1. انسخ ملف البيئة:
   ```bash
   cp .env.example .env
   ```
2. ثبّت الاعتمادات ثم جهّز قاعدة البيانات:
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

## حسابات تجريبية (كلمة المرور: `Thinkra@12345`)
- admin@thinkra.local (ADMIN)
- instructor@thinkra.local (INSTRUCTOR)
- student@thinkra.local (STUDENT)

## أهم المسارات
- `/` الصفحة الرئيسية العامة
- `/courses` قائمة الدورات
- `/courses/[id]` تفاصيل الدورة
- `/instructors/[id]` ملف المدرب
- `/signin` تسجيل الدخول
- `/signup` إنشاء حساب
- `/dashboard` لوحة الطالب
- `/instructor` لوحة المدرب
- `/admin` لوحة الإدارة

## ملاحظات الدفع
يتم استخدام عملية دفع وهمية (Mock) لإنشاء Payment وتسجيل الطالب في الدورة. ربط Stripe لاحقًا مذكور داخل صفحة الدفع.
