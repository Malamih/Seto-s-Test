const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Thinkra123", 10);

  await prisma.notification.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "مدير المنصة",
      email: "admin@thinkra.local",
      passwordHash,
      role: "ADMIN"
    }
  });

  const instructor = await prisma.user.create({
    data: {
      name: "مدرب المنصة",
      email: "instructor@thinkra.local",
      passwordHash,
      role: "INSTRUCTOR"
    }
  });

  const student = await prisma.user.create({
    data: {
      name: "طالب المنصة",
      email: "student@thinkra.local",
      passwordHash,
      role: "STUDENT"
    }
  });

  const categories = await prisma.category.createMany({
    data: [
      { name: "القيادة", slug: "leadership" },
      { name: "التقنية", slug: "tech" },
      { name: "المهارات الشخصية", slug: "soft-skills" }
    ]
  });

  const categoryList = await prisma.category.findMany();

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "أساسيات القيادة",
        description: "تعلّم مبادئ القيادة الحديثة وإدارة الفرق.",
        price: 199,
        status: "PUBLISHED",
        categoryId: categoryList[0].id,
        instructorId: instructor.id
      }
    }),
    prisma.course.create({
      data: {
        title: "مقدمة في تطوير الويب",
        description: "ابدأ رحلتك في بناء مواقع ويب حديثة.",
        price: 149,
        status: "PUBLISHED",
        categoryId: categoryList[1].id,
        instructorId: instructor.id
      }
    }),
    prisma.course.create({
      data: {
        title: "مهارات التواصل الفعال",
        description: "طوّر مهاراتك في التواصل والعرض.",
        price: 129,
        status: "PUBLISHED",
        categoryId: categoryList[2].id,
        instructorId: instructor.id
      }
    }),
    prisma.course.create({
      data: {
        title: "إدارة الوقت والإنتاجية",
        description: "خطط يومك بذكاء وحقق أهدافك بسرعة.",
        price: 99,
        status: "PUBLISHED",
        categoryId: categoryList[2].id,
        instructorId: instructor.id
      }
    })
  ]);

  for (const course of courses) {
    for (let index = 1; index <= 3; index += 1) {
      await prisma.lesson.create({
        data: {
          title: `الدرس ${index}`,
          content: "محتوى الدرس النصي هنا.",
          order: index,
          videoUrl: "https://example.com/video",
          courseId: course.id
        }
      });
    }
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: courses[0].id,
      progressPercent: 40
    }
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "دورة ممتازة ومحتوى رائع.",
      userId: student.id,
      courseId: courses[0].id
    }
  });

  await prisma.comment.create({
    data: {
      content: "هل هناك تمارين إضافية؟",
      userId: student.id,
      courseId: courses[0].id,
      reply: "نعم، سيتم إضافتها في القسم التالي."
    }
  });

  await prisma.notification.create({
    data: {
      userId: student.id,
      title: "مرحبا بك",
      body: "تم تسجيلك في الدورة بنجاح."
    }
  });

  await prisma.certificate.create({
    data: {
      userId: student.id,
      courseId: courses[0].id
    }
  });

  await prisma.liveSession.create({
    data: {
      title: "جلسة أسئلة وأجوبة",
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      courseId: courses[0].id
    }
  });

  console.log({ admin: admin.email, instructor: instructor.email, student: student.email, enrollment: enrollment.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
