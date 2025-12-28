const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Thinkra@12345", 10);

  await prisma.comment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();

  const admin = await prisma.user.upsert({
    where: { email: "admin@thinkra.local" },
    update: {},
    create: {
      name: "مشرف المنصة",
      email: "admin@thinkra.local",
      passwordHash,
      role: "ADMIN"
    }
  });

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@thinkra.local" },
    update: {},
    create: {
      name: "مدربة Thinkra",
      email: "instructor@thinkra.local",
      passwordHash,
      role: "INSTRUCTOR"
    }
  });

  const student = await prisma.user.upsert({
    where: { email: "student@thinkra.local" },
    update: {},
    create: {
      name: "طالبة Thinkra",
      email: "student@thinkra.local",
      passwordHash,
      role: "STUDENT"
    }
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "digital-skills" },
      update: {},
      create: { name: "المهارات الرقمية", slug: "digital-skills" }
    }),
    prisma.category.upsert({
      where: { slug: "leadership" },
      update: {},
      create: { name: "القيادة", slug: "leadership" }
    }),
    prisma.category.upsert({
      where: { slug: "soft-skills" },
      update: {},
      create: { name: "المهارات الناعمة", slug: "soft-skills" }
    })
  ]);

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "أساسيات التحول الرقمي",
        description: "دورة شاملة حول أدوات التحول الرقمي وإدارة التغيير.",
        price: 299,
        thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        status: "PUBLISHED",
        categoryId: categories[0].id,
        instructorId: instructor.id
      }
    }),
    prisma.course.create({
      data: {
        title: "قيادة الفرق عن بعد",
        description: "تعلم أفضل الممارسات لإدارة فرق العمل الموزعة.",
        price: 199,
        thumbnailUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        status: "PUBLISHED",
        categoryId: categories[1].id,
        instructorId: instructor.id
      }
    }),
    prisma.course.create({
      data: {
        title: "مهارات التواصل الفعال",
        description: "طوّر مهاراتك في التواصل وبناء العلاقات المهنية.",
        price: 149,
        thumbnailUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
        status: "PUBLISHED",
        categoryId: categories[2].id,
        instructorId: instructor.id
      }
    })
  ]);

  for (const course of courses) {
    for (let index = 1; index <= 4; index += 1) {
      await prisma.lesson.create({
        data: {
          title: `الدرس ${index}: ${course.title}`,
          order: index,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          attachmentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          courseId: course.id
        }
      });
    }
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: courses[0].id
    }
  });

  const courseLessons = await prisma.lesson.findMany({
    where: { courseId: courses[0].id },
    orderBy: { order: "asc" }
  });

  for (const lesson of courseLessons) {
    await prisma.progress.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        isCompleted: lesson.order <= 2
      }
    });
  }

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "دورة رائعة ومحتوى غني بالتطبيقات العملية.",
      userId: student.id,
      courseId: courses[0].id
    }
  });

  await prisma.comment.create({
    data: {
      content: "هل يمكن مشاركة ملف القالب المستخدم في الدرس الثاني؟",
      userId: student.id,
      courseId: courses[0].id,
      lessonId: courseLessons[1].id
    }
  });

  await prisma.notification.create({
    data: {
      title: "تذكير بالدرس القادم",
      message: "لا تنس حضور الدرس المباشر يوم الخميس الساعة 7 مساءً.",
      userId: student.id
    }
  });

  await prisma.liveSession.create({
    data: {
      title: "جلسة مباشرة: أسئلة وأجوبة",
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
      meetingUrl: "https://meet.google.com/thinkra-session",
      instructorId: instructor.id,
      courseId: courses[0].id
    }
  });

  await prisma.payment.create({
    data: {
      amount: courses[0].price,
      currency: "USD",
      status: "PAID",
      provider: "mock",
      userId: student.id,
      courseId: courses[0].id
    }
  });

  await prisma.certificate.create({
    data: {
      code: "THINKRA-2024-0001",
      userId: student.id,
      courseId: courses[0].id
    }
  });

  await prisma.notification.create({
    data: {
      title: "إصدار الشهادة",
      message: "تم إصدار شهادتك لدورة أساسيات التحول الرقمي.",
      userId: student.id
    }
  });

  await prisma.user.update({
    where: { id: admin.id },
    data: {
      notifications: {
        create: {
          title: "تنبيه إداري",
          message: "تم إضافة دورات جديدة بانتظار الموافقة."
        }
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
