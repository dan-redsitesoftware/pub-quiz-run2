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
    question: 'Which country won the 2018 FIFA World Cup?',
    options: { A: 'Argentina', B: 'Croatia', C: 'Germany', D: 'France' },
    answer: 'D',
  },
  {
    id: 3,
    question: 'How many Grand Slam singles titles has Serena Williams won in her career?',
    options: { A: '15', B: '19', C: '23', D: '27' },
    answer: 'C',
  },
  {
    id: 4,
    question: 'Which film won the Academy Award for Best Picture at the 2020 Oscars ceremony?',
    options: { A: '1917', B: 'Joker', C: 'Once Upon a Time in Hollywood', D: 'Parasite' },
    answer: 'D',
  },
  {
    id: 5,
    question: 'Which artist released the best-selling album "Thriller" in 1982?',
    options: { A: 'Prince', B: 'Michael Jackson', C: 'Madonna', D: 'David Bowie' },
    answer: 'B',
  },
];

export default questions;
