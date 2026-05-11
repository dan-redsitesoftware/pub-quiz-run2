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
  {
    id: 2,
    question: 'Which river is the longest in the world?',
    options: { A: 'Amazon', B: 'Yangtze', C: 'Mississippi', D: 'Nile' },
    answer: 'D',
  },
  {
    id: 3,
    question: 'In which year did World War II end?',
    options: { A: '1943', B: '1945', C: '1947', D: '1950' },
    answer: 'B',
  },
  {
    id: 4,
    question: 'Which continent is the Sahara Desert located on?',
    options: { A: 'Asia', B: 'South America', C: 'Africa', D: 'Australia' },
    answer: 'C',
  },
  {
    id: 5,
    question: 'Who was the first person to walk on the Moon?',
    options: { A: 'Buzz Aldrin', B: 'Yuri Gagarin', C: 'John Glenn', D: 'Neil Armstrong' },
    answer: 'D',
  },
  {
    id: 6,
    question: 'What is the chemical symbol for gold?',
    options: { A: 'Go', B: 'Gd', C: 'Au', D: 'Ag' },
    answer: 'C',
  },
  {
    id: 7,
    question: 'How many planets are in our solar system?',
    options: { A: '7', B: '8', C: '9', D: '10' },
    answer: 'B',
  },
  {
    id: 8,
    question: 'What does CPU stand for?',
    options: { A: 'Central Processing Unit', B: 'Computer Processing Unit', C: 'Central Program Utility', D: 'Core Processing Unit' },
    answer: 'A',
  },
  {
    id: 9,
    question: 'Which element has the atomic number 1?',
    options: { A: 'Helium', B: 'Oxygen', C: 'Carbon', D: 'Hydrogen' },
    answer: 'D',
  },
];

export default questions;
