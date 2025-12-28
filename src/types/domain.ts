export type Category = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  status?: string;
  categoryId?: string;
  instructorId?: string;
};

export type Lesson = {
  id: string;
  title: string;
  order: number;
  videoUrl: string;
  attachmentUrl?: string | null;
  courseId: string;
};

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  courseId: string;
};
