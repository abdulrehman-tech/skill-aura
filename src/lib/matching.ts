import type { AvailabilitySlot, LearningStyle, Skill, User } from "./types";
import { skills } from "../data/skills";
import { users } from "../data/users";

export interface MatchInput {
  skillQuery: string;
  category?: string;
  availability?: AvailabilitySlot;
  style?: LearningStyle;
}

export interface MatchResult {
  skill: Skill;
  tutor: User;
  score: number;
  reasons: string[];
}

export function matchTutors(input: MatchInput): MatchResult[] {
  const q = input.skillQuery.toLowerCase().trim();
  const results: MatchResult[] = [];

  for (const skill of skills) {
    const tutor = users.find((u) => u.id === skill.tutorId);
    if (!tutor) continue;

    let score = 0;
    const reasons: string[] = [];

    if (q && (skill.title.toLowerCase().includes(q) || skill.tags.some((t) => t.toLowerCase().includes(q)))) {
      score += 5;
      reasons.push(`Matches "${input.skillQuery}"`);
    } else if (q) {
      continue;
    }

    if (input.category && skill.category === input.category) {
      score += 3;
      reasons.push(`Category: ${input.category}`);
    }

    if (input.availability && tutor.availability.includes(input.availability)) {
      score += 2;
      reasons.push(`Available ${input.availability}`);
    }

    if (input.style && (skill.styles.includes(input.style) || tutor.styles.includes(input.style))) {
      score += 2;
      reasons.push(`${input.style} learning style`);
    }

    score += skill.rating;
    if (tutor.verified) {
      score += 0.5;
      reasons.push("Verified tutor");
    }

    results.push({ skill, tutor, score, reasons });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 8);
}
