/*
 * The launch film's clock — one place for every cut, every typed line and
 * every sound, so picture and audio can never drift apart.
 *
 * The soundtrack (remotion/audio/compose.py) runs at 120 BPM: a bar is two
 * seconds, 60 frames. Every scene starts on a bar line, so each cut lands
 * on a downbeat, and the music's sections change where the story does.
 */

export const FILM = { fps: 30, width: 1920, height: 1080, frames: 1800 };

/** One bar of the soundtrack, in frames. */
export const BAR = 60;

export const SCENES = {
  intro: { from: 0, frames: 2 * BAR },
  sheets: { from: 2 * BAR, frames: 3 * BAR },
  roadmap: { from: 5 * BAR, frames: 3 * BAR },
  practice: { from: 8 * BAR, frames: 4 * BAR },
  tutor: { from: 12 * BAR, frames: 5 * BAR },
  simulation: { from: 17 * BAR, frames: 5 * BAR },
  progress: { from: 22 * BAR, frames: 3 * BAR },
  exams: { from: 25 * BAR, frames: 2 * BAR },
  outro: { from: 27 * BAR, frames: 3 * BAR },
} as const;

export type SceneKey = keyof typeof SCENES;

/** A line typed on screen: scene-local start frame, frames per character. */
export type Typing = { scene: SceneKey; at: number; text: string; every: number };

export const TYPING = {
  plan: { scene: "sheets", at: 104, text: "w Twój plan nauki", every: 2 },
  question: { scene: "tutor", at: 22, text: "Nie wiem, jak zacząć zadanie 10.", every: 2 },
  url: { scene: "outro", at: 56, text: "examax.app", every: 3 },
} satisfies Record<string, Typing>;

/** The characters of a typed line visible at a scene-local frame. */
export function typed(line: Typing, frame: number): string {
  const count = Math.max(0, Math.floor((frame - line.at) / line.every) + 1);
  return line.text.slice(0, Math.min(line.text.length, count));
}

/** The frame a typed line finishes on, scene-local. */
export function typedEnd(line: Typing): number {
  return line.at + (line.text.length - 1) * line.every;
}

/* Beats inside scenes that both the picture and the sound hang on (scene-local frames). */
export const BEATS = {
  introTile: 4,
  introSlide: 34,
  sheetsCard: 16,
  sheetsPill: 98,
  roadmapCards: [30, 42, 54],
  practiceCard: 12,
  practiceClick: 78,
  practiceCorrect: 86,
  practiceChips: [112, 124],
  tutorSend: 90,
  tutorChoice: 206,
  tutorReply: 232,
  simulationClick: 162,
  simulationScore: 174,
  simulationResult: 196,
  progressTip: 98,
  examsMarks: [12, 18, 24, 30],
  outroCards: [0, 4, 8, 12],
} as const;

/** Where a scene-local frame sits on the film's own clock. */
export const at = (scene: SceneKey, frame: number) => SCENES[scene].from + frame;

export type Cue = { at: number; sound: "click" | "pop" | "whoosh" | "success" | "key-1" | "key-2" | "key-3"; volume: number };

function keys(line: Typing): Cue[] {
  return Array.from(line.text, (char, i) => ({ char, i }))
    .filter(({ char }) => char !== " ")
    .map(({ i }) => ({
      at: at(line.scene, line.at + i * line.every),
      sound: (["key-1", "key-2", "key-3"] as const)[(i * 7) % 3],
      volume: 0.32,
    }));
}

/** Every sound effect in the film, on the film's clock. The music runs underneath, start to end. */
export const CUES: Cue[] = [
  { at: at("intro", BEATS.introTile), sound: "pop", volume: 0.5 },
  { at: at("intro", BEATS.introSlide), sound: "whoosh", volume: 0.35 },
  { at: at("sheets", 0), sound: "whoosh", volume: 0.3 },
  { at: at("sheets", BEATS.sheetsCard), sound: "pop", volume: 0.4 },
  { at: at("sheets", BEATS.sheetsPill), sound: "whoosh", volume: 0.3 },
  ...keys(TYPING.plan),
  { at: at("roadmap", 0), sound: "whoosh", volume: 0.3 },
  ...BEATS.roadmapCards.map((frame) => ({ at: at("roadmap", frame), sound: "pop" as const, volume: 0.3 })),
  { at: at("practice", 0), sound: "whoosh", volume: 0.3 },
  { at: at("practice", BEATS.practiceCard), sound: "pop", volume: 0.35 },
  { at: at("practice", BEATS.practiceClick), sound: "click", volume: 0.6 },
  { at: at("practice", BEATS.practiceCorrect), sound: "success", volume: 0.5 },
  ...BEATS.practiceChips.map((frame) => ({ at: at("practice", frame), sound: "pop" as const, volume: 0.3 })),
  { at: at("tutor", 0), sound: "whoosh", volume: 0.3 },
  ...keys(TYPING.question),
  { at: at("tutor", BEATS.tutorSend), sound: "click", volume: 0.55 },
  { at: at("tutor", BEATS.tutorChoice), sound: "click", volume: 0.55 },
  { at: at("tutor", BEATS.tutorReply), sound: "pop", volume: 0.35 },
  { at: at("simulation", 0), sound: "whoosh", volume: 0.3 },
  { at: at("simulation", BEATS.simulationClick), sound: "click", volume: 0.6 },
  { at: at("simulation", BEATS.simulationScore), sound: "pop", volume: 0.4 },
  { at: at("simulation", BEATS.simulationResult), sound: "success", volume: 0.5 },
  { at: at("progress", 0), sound: "whoosh", volume: 0.3 },
  { at: at("progress", BEATS.progressTip), sound: "pop", volume: 0.35 },
  { at: at("exams", 0), sound: "whoosh", volume: 0.3 },
  ...BEATS.examsMarks.map((frame) => ({ at: at("exams", frame), sound: "pop" as const, volume: 0.28 })),
  ...keys(TYPING.url),
];
