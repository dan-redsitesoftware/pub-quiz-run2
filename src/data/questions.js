/**
 * Pub Quiz Question Bank
 *
 * Schema for each question object:
 * {
 *   id:       number  — unique identifier for the question
 *   question: string  — the question text
 *   options:  object  — answer choices, keyed A / B / C / D
 *   answer:   string  — the correct key ('A' | 'B' | 'C' | 'D')
 * }
 */

const questions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: { A: 'Berlin', B: 'Madrid', C: 'Paris', D: 'Rome' },
    answer: 'C',
  },
];

export default questions;
