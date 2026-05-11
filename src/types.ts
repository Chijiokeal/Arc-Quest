export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

export type PathId = "basics" | "wallet" | "stablecoins" | "testnet" | "building" | "deploying";

export interface LearningPath {
  id: PathId;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  time: string;
  xp: number;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  xp: number;
}
