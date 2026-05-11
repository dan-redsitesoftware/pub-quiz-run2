import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createQuestionCard } from './QuestionCard.js'

// jsdom environment is required for DOM manipulation
// configured via vitest.config.js (environment: 'jsdom')

const mockQuestion = {
  id: 1,
  question: 'What is the capital of France?',
  options: { A: 'Berlin', B: 'Madrid', C: 'Paris', D: 'Rome' },
  answer: 'C',
}

function makeCard(overrides = {}) {
  return createQuestionCard({
    question: mockQuestion,
    questionIndex: 0,
    totalQuestions: 10,
    selectedAnswer: null,
    onAnswerSelect: vi.fn(),
    ...overrides,
  })
}

describe('createQuestionCard — validation', () => {
  it('throws when question is missing', () => {
    expect(() => makeCard({ question: null })).toThrow()
  })

  it('throws when questionIndex is negative', () => {
    expect(() => makeCard({ questionIndex: -1 })).toThrow()
  })

  it('throws when totalQuestions is zero', () => {
    expect(() => makeCard({ totalQuestions: 0 })).toThrow()
  })

  it('throws when onAnswerSelect is not a function', () => {
    expect(() => makeCard({ onAnswerSelect: null })).toThrow()
  })
})

describe('createQuestionCard — rendering', () => {
  let card

  beforeEach(() => {
    card = makeCard()
  })

  it('returns a div with class question-card', () => {
    expect(card.tagName).toBe('DIV')
    expect(card.classList.contains('question-card')).toBe(true)
  })

  it('displays the question text', () => {
    const heading = card.querySelector('.question-text')
    expect(heading).not.toBeNull()
    expect(heading.textContent).toBe(mockQuestion.question)
  })

  it('displays "Question 1 of 10" for questionIndex 0 and totalQuestions 10', () => {
    const progress = card.querySelector('.question-progress')
    expect(progress).not.toBeNull()
    expect(progress.textContent).toBe('Question 1 of 10')
  })

  it('displays "Question 3 of 10" for questionIndex 2', () => {
    const c = makeCard({ questionIndex: 2, totalQuestions: 10 })
    expect(c.querySelector('.question-progress').textContent).toBe('Question 3 of 10')
  })

  it('renders exactly 4 answer buttons', () => {
    const buttons = card.querySelectorAll('button.answer-button')
    expect(buttons).toHaveLength(4)
  })

  it('renders answer buttons labelled A through D', () => {
    const buttons = [...card.querySelectorAll('button.answer-button')]
    const keys = buttons.map(b => b.dataset.answerKey)
    expect(keys).toEqual(['A', 'B', 'C', 'D'])
  })

  it('includes option text in each button', () => {
    const buttons = [...card.querySelectorAll('button.answer-button')]
    expect(buttons[0].textContent).toContain('Berlin')
    expect(buttons[1].textContent).toContain('Madrid')
    expect(buttons[2].textContent).toContain('Paris')
    expect(buttons[3].textContent).toContain('Rome')
  })

  it('renders buttons as type="button"', () => {
    const buttons = card.querySelectorAll('button.answer-button')
    for (const btn of buttons) {
      expect(btn.type).toBe('button')
    }
  })
})

describe('createQuestionCard — selectedAnswer', () => {
  it('marks selected button with --selected class when selectedAnswer is set', () => {
    const card = makeCard({ selectedAnswer: 'C' })
    const selected = card.querySelector('[data-answer-key="C"]')
    expect(selected.classList.contains('answer-button--selected')).toBe(true)
  })

  it('does not mark other buttons as selected', () => {
    const card = makeCard({ selectedAnswer: 'C' })
    for (const key of ['A', 'B', 'D']) {
      const btn = card.querySelector(`[data-answer-key="${key}"]`)
      expect(btn.classList.contains('answer-button--selected')).toBe(false)
    }
  })

  it('sets aria-pressed="true" on the selected button', () => {
    const card = makeCard({ selectedAnswer: 'B' })
    const btn = card.querySelector('[data-answer-key="B"]')
    expect(btn.getAttribute('aria-pressed')).toBe('true')
  })

  it('sets aria-pressed="false" on unselected buttons', () => {
    const card = makeCard({ selectedAnswer: 'B' })
    const btn = card.querySelector('[data-answer-key="A"]')
    expect(btn.getAttribute('aria-pressed')).toBe('false')
  })

  it('applies no selected class when selectedAnswer is null', () => {
    const card = makeCard({ selectedAnswer: null })
    const selected = card.querySelectorAll('.answer-button--selected')
    expect(selected).toHaveLength(0)
  })
})

describe('createQuestionCard — interaction', () => {
  it('calls onAnswerSelect with questionIndex and key when a button is clicked', () => {
    const onAnswerSelect = vi.fn()
    const card = makeCard({ questionIndex: 2, onAnswerSelect })
    const btnC = card.querySelector('[data-answer-key="C"]')
    btnC.click()
    expect(onAnswerSelect).toHaveBeenCalledOnce()
    expect(onAnswerSelect).toHaveBeenCalledWith(2, 'C')
  })

  it('calls onAnswerSelect with correct key for each button', () => {
    const onAnswerSelect = vi.fn()
    const card = makeCard({ questionIndex: 0, onAnswerSelect })
    for (const key of ['A', 'B', 'C', 'D']) {
      card.querySelector(`[data-answer-key="${key}"]`).click()
    }
    expect(onAnswerSelect).toHaveBeenCalledTimes(4)
    expect(onAnswerSelect).toHaveBeenNthCalledWith(1, 0, 'A')
    expect(onAnswerSelect).toHaveBeenNthCalledWith(2, 0, 'B')
    expect(onAnswerSelect).toHaveBeenNthCalledWith(3, 0, 'C')
    expect(onAnswerSelect).toHaveBeenNthCalledWith(4, 0, 'D')
  })
})
