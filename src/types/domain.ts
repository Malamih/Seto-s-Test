export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  instructorId: string;
  createdAt: Date;
};

export type Lesson = {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  courseId: string;
};

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  progressPercent: number;
  createdAt: Date;
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  courseId: string;
  createdAt: Date;
};
