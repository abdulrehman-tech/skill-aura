import type { Session } from "../lib/types";

const inDays = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

export const sessions: Session[] = [
  { id: "se1", skillId: "s2", tutorId: "u3", learnerId: "u4", participants: ["u3", "u4"], startsAt: inDays(2), durationHours: 1, status: "upcoming", type: "private" },
  { id: "se2", skillId: "s5", tutorId: "u6", learnerId: "u7", participants: ["u6", "u7", "u12"], startsAt: inDays(4), durationHours: 1.5, status: "upcoming", type: "group" },
  { id: "se3", skillId: "s1", tutorId: "u1", learnerId: "u11", participants: ["u1", "u11"], startsAt: inDays(-7), durationHours: 1, status: "completed", type: "cultural", rating: 5, notes: "Excellent — very patient and clear." },
  { id: "se4", skillId: "s3", tutorId: "u2", learnerId: "u10", participants: ["u2", "u10"], startsAt: inDays(-14), durationHours: 2, status: "completed", type: "private", rating: 5 },
  { id: "se5", skillId: "s6", tutorId: "u5", learnerId: "u12", participants: ["u5", "u12"], startsAt: inDays(7), durationHours: 1, status: "upcoming", type: "private" },
  { id: "se6", skillId: "s4", tutorId: "u4", learnerId: "u1", participants: ["u4", "u1", "u8"], startsAt: inDays(-21), durationHours: 1, status: "completed", type: "group", rating: 4 },
];
