export type Category =
  | "Languages"
  | "Design"
  | "Cooking"
  | "Photography"
  | "Programming"
  | "Makeup"
  | "Academic";

export type Level = "Beginner" | "Intermediate" | "Expert" | "Pro";

export type LearningStyle = "Conversational" | "Visual" | "Hands-on" | "Theoretical";

export type AvailabilitySlot = "Morning" | "Afternoon" | "Evening" | "Weekend";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  country: string;
  language: string;
  credits: number;
  hoursTaught: number;
  hoursLearned: number;
  rating: number;
  reviews: number;
  badges: Level[];
  verified: boolean;
  premium: boolean;
  teaches: string[];
  learning: string[];
  availability: AvailabilitySlot[];
  styles: LearningStyle[];
}

export interface Skill {
  id: string;
  title: string;
  category: Category;
  description: string;
  level: Level;
  creditsPerHour: number;
  tutorId: string;
  tags: string[];
  styles: LearningStyle[];
  rating: number;
  reviews: number;
  thumbnail: string;
}

export interface Session {
  id: string;
  skillId: string;
  tutorId: string;
  learnerId: string;
  participants: string[];
  startsAt: string;
  durationHours: number;
  status: "upcoming" | "completed" | "cancelled";
  type: "private" | "group" | "cultural";
  notes?: string;
  rating?: number;
}

export interface Certificate {
  id: string;
  userId: string;
  skill: string;
  category: Category;
  hours: number;
  issuedAt: string;
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
