import { describe, it, expect } from 'vitest'
import { createQuizComplete } from './QuizComplete.js'

describe('createQuizComplete — validation', () => {
  it('throws when totalQuestions is zero', () => {
    expect(() => createQuizComplete({ totalQuestions: 0, selectedAnswers: [] })).toThrow()
  })

  it('throws when selectedAnswers is not an array', () => {
    expect(() => createQuizComplete({ totalQuestions: 3, selectedAnswers: null })).toThrow()
  })
})

describe('createQuizComplete — rendering', () => {
  it('returns a div with class quiz-complete', () => {
    const el = createQuizComplete({ totalQuestions: 3, selectedAnswers: ['A', 'B', 'C'] })
    expect(el.tagName).toBe('DIV')
    expect(el.classList.contains('quiz-complete')).toBe(true)
  })

  it('displays "Quiz Complete!" heading', () => {
    const el = createQuizComplete({ totalQuestions: 3, selectedAnswers: ['A', 'B', 'C'] })
    const heading = el.querySelector('.quiz-complete__heading')
    expect(heading).not.toBeNull()
    expect(heading.textContent).toBe('Quiz Complete!')
  })

  it('displays answered count summary when all questions answered', () => {
    const el = createQuizComplete({ totalQuestions: 3, selectedAnswers: ['A', 'B', 'C'] })
    const summary = el.querySelector('.quiz-complete__summary')
    expect(summary).not.toBeNull()
    expect(summary.textContent).toBe('You answered 3 of 3 questions.')
  })

  it('counts only non-null answers in the summary', () => {
    const el = createQuizComplete({ totalQuestions: 3, selectedAnswers: ['A', null, 'C'] })
    const summary = el.querySelector('.quiz-complete__summary')
    expect(summary.textContent).toBe('You answered 2 of 3 questions.')
  })

  it('handles all-null selectedAnswers', () => {
    const el = createQuizComplete({ totalQuestions: 2, selectedAnswers: [null, null] })
    const summary = el.querySelector('.quiz-complete__summary')
    expect(summary.textContent).toBe('You answered 0 of 2 questions.')
  })
})
