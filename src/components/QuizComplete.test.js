import { describe, it, expect, vi } from 'vitest'
import { createQuizComplete } from './QuizComplete.js'

const mockQuestions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: { A: 'Berlin', B: 'Madrid', C: 'Paris', D: 'Rome' },
    answer: 'C',
  },
  {
    id: 2,
    question: 'What is 2 + 2?',
    options: { A: '3', B: '4', C: '5', D: '6' },
    answer: 'B',
  },
  {
    id: 3,
    question: 'What colour is the sky?',
    options: { A: 'Red', B: 'Green', C: 'Yellow', D: 'Blue' },
    answer: 'D',
  },
]

const noop = () => {}

describe('createQuizComplete — validation', () => {
  it('throws when questions is empty', () => {
    expect(() => createQuizComplete({ questions: [], selectedAnswers: [], score: 0, onRestart: noop })).toThrow()
  })

  it('throws when questions is not an array', () => {
    expect(() => createQuizComplete({ questions: null, selectedAnswers: [], score: 0, onRestart: noop })).toThrow()
  })

  it('throws when selectedAnswers is not an array', () => {
    expect(() => createQuizComplete({ questions: mockQuestions, selectedAnswers: null, score: 0, onRestart: noop })).toThrow()
  })

  it('throws when score is negative', () => {
    expect(() => createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'B', 'D'], score: -1, onRestart: noop })).toThrow()
  })

  it('throws when onRestart is not a function', () => {
    expect(() => createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'B', 'D'], score: 3, onRestart: null })).toThrow()
  })
})

describe('createQuizComplete — rendering', () => {
  it('returns a div with class quiz-complete', () => {
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'A', 'D'], score: 2, onRestart: noop })
    expect(el.tagName).toBe('DIV')
    expect(el.classList.contains('quiz-complete')).toBe(true)
  })

  it('displays "Quiz Complete!" heading', () => {
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'B', 'D'], score: 3, onRestart: noop })
    const heading = el.querySelector('.quiz-complete__heading')
    expect(heading).not.toBeNull()
    expect(heading.textContent).toBe('Quiz Complete!')
  })

  it('displays score as fraction and percentage', () => {
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'B', 'D'], score: 3, onRestart: noop })
    const scoreSummary = el.querySelector('.quiz-complete__score')
    expect(scoreSummary).not.toBeNull()
    expect(scoreSummary.textContent).toContain('3/3')
    expect(scoreSummary.textContent).toContain('100%')
  })

  it('calculates percentage correctly for partial score', () => {
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'A', 'A'], score: 1, onRestart: noop })
    const scoreSummary = el.querySelector('.quiz-complete__score')
    expect(scoreSummary.textContent).toContain('1/3')
    expect(scoreSummary.textContent).toContain('33%')
  })

  it('displays a review list with one item per question', () => {
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'B', 'A'], score: 2, onRestart: noop })
    const items = el.querySelectorAll('.quiz-complete__review-item')
    expect(items).toHaveLength(mockQuestions.length)
  })

  it('marks correct answers with correct CSS class', () => {
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'B', 'D'], score: 3, onRestart: noop })
    const items = el.querySelectorAll('.quiz-complete__review-item--correct')
    expect(items).toHaveLength(3)
  })

  it('marks incorrect answers with incorrect CSS class', () => {
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['A', 'A', 'A'], score: 0, onRestart: noop })
    const items = el.querySelectorAll('.quiz-complete__review-item--incorrect')
    expect(items).toHaveLength(3)
  })

  it('shows correct answer text for incorrectly answered questions', () => {
    // Question 0 answer is 'C' (Paris); user chose 'A' (Berlin)
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['A', 'B', 'D'], score: 2, onRestart: noop })
    const correctLines = el.querySelectorAll('.quiz-complete__review-correct')
    expect(correctLines).toHaveLength(1)
    expect(correctLines[0].textContent).toContain('Paris')
  })

  it('does not show correct-answer line for questions answered correctly', () => {
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'B', 'D'], score: 3, onRestart: noop })
    const correctLines = el.querySelectorAll('.quiz-complete__review-correct')
    expect(correctLines).toHaveLength(0)
  })

  it('renders a Play Again button', () => {
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'B', 'D'], score: 3, onRestart: noop })
    const btn = el.querySelector('.quiz-complete__restart')
    expect(btn).not.toBeNull()
    expect(btn.textContent).toBe('Play Again')
  })

  it('calls onRestart when Play Again button is clicked', () => {
    const onRestart = vi.fn()
    const el = createQuizComplete({ questions: mockQuestions, selectedAnswers: ['C', 'B', 'D'], score: 3, onRestart })
    el.querySelector('.quiz-complete__restart').click()
    expect(onRestart).toHaveBeenCalledOnce()
  })
})

