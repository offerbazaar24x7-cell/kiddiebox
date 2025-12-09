
export enum UserRole {
  GUEST = 'guest',
  STUDENT = 'student',
  ADMIN = 'admin',
  TUTOR = 'tutor',
  PARTNER = 'partner'
}

export enum ProductType {
  COURSE = 'Course',
  DIGITAL = 'Digital Product'
}

export interface Product {
  id: string;
  title: string;
  instructor: string;
  price: number;
  discountPrice?: number;
  image: string;
  videoUrl?: string; // YouTube link
  downloadUrl?: string; // Google Drive or file link
  description: string;
  category: string;
  ageRange: string; // e.g. "2-4", "8-12"
  type: ProductType;
  syllabus?: string[]; // Pipe separated in "DB" but array here
  rating: number;
  reviews: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Simulated auth
  avatar?: string;
}

export interface CartItem extends Product {
  cartId: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  productId: string;
  purchaseDate: string;
  pricePaid: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isTutor: boolean;
}

export interface AIRecommendation {
  text: string;
  recommendedProductIds: string[];
}

export interface AppConfig {
  payment: {
    enabled: boolean;
    provider: string; // Changed to string for custom vendors
    apiKey: string;
    secretKey: string;
  };
  shipping: {
    enabled: boolean;
    provider: string; // Changed to string for custom vendors
    email: string;
    password: string;
  };
}
