import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp } from './App.js'

const mockQuestions = [
  {
    id: 1,
    question: 'Q1?',
    options: { A: 'Opt A', B: 'Opt B', C: 'Opt C', D: 'Opt D' },
    answer: 'A',
    topic: 'test',
  },
  {
    id: 2,
    question: 'Q2?',
    options: { A: 'Opt A', B: 'Opt B', C: 'Opt C', D: 'Opt D' },
    answer: 'B',
    topic: 'test',
  },
  {
    id: 3,
    question: 'Q3?',
    options: { A: 'Opt A', B: 'Opt B', C: 'Opt C', D: 'Opt D' },
    answer: 'C',
    topic: 'test',
  },
]

function makeContainer() {
  return document.createElement('div')
}

describe('createApp — initial render', () => {
  it('renders a QuestionCard on start', () => {
    const container = makeContainer()
    createApp(container, mockQuestions)
    expect(container.querySelector('.question-card')).not.toBeNull()
  })

  it('shows the first question initially', () => {
    const container = makeContainer()
    createApp(container, mockQuestions)
    expect(container.querySelector('.question-progress').textContent).toBe('Question 1 of 3')
  })

  it('does not show the quiz-complete view initially', () => {
    const container = makeContainer()
    createApp(container, mockQuestions)
    expect(container.querySelector('.quiz-complete')).toBeNull()
  })
})

describe('createApp — navigation', () => {
  it('advances to question 2 after selecting an answer and clicking Next', () => {
    const container = makeContainer()
    createApp(container, mockQuestions)

    container.querySelector('[data-answer-key="A"]').click()
    container.querySelector('button.next-button').click()

    expect(container.querySelector('.question-progress').textContent).toBe('Question 2 of 3')
  })

  it('shows "Finish Quiz" button on the last question', () => {
    const container = makeContainer()
    createApp(container, mockQuestions)

    // Q1: answer + next
    container.querySelector('[data-answer-key="A"]').click()
    container.querySelector('button.next-button').click()

    // Q2: answer + next
    container.querySelector('[data-answer-key="B"]').click()
    container.querySelector('button.next-button').click()

    const nextBtn = container.querySelector('button.next-button')
    expect(nextBtn.textContent).toBe('Finish Quiz')
  })
})

describe('createApp — quiz completion (#17)', () => {
  it('transitions to quiz-complete view after Finish Quiz is clicked on last question', () => {
    const container = makeContainer()
    createApp(container, mockQuestions)

    container.querySelector('[data-answer-key="A"]').click()
    container.querySelector('button.next-button').click()

    container.querySelector('[data-answer-key="B"]').click()
    container.querySelector('button.next-button').click()

    container.querySelector('[data-answer-key="C"]').click()
    container.querySelector('button.next-button').click()

    expect(container.querySelector('.quiz-complete')).not.toBeNull()
    expect(container.querySelector('.question-card')).toBeNull()
  })

  it('displays "Quiz Complete!" heading after completion', () => {
    const container = makeContainer()
    createApp(container, mockQuestions)

    container.querySelector('[data-answer-key="A"]').click()
    container.querySelector('button.next-button').click()
    container.querySelector('[data-answer-key="B"]').click()
    container.querySelector('button.next-button').click()
    container.querySelector('[data-answer-key="C"]').click()
    container.querySelector('button.next-button').click()

    expect(container.querySelector('.quiz-complete__heading').textContent).toBe('Quiz Complete!')
  })

  it('preserves all selected answers in quiz-complete summary', () => {
    const container = makeContainer()
    createApp(container, mockQuestions)

    container.querySelector('[data-answer-key="A"]').click()
    container.querySelector('button.next-button').click()
    container.querySelector('[data-answer-key="B"]').click()
    container.querySelector('button.next-button').click()
    container.querySelector('[data-answer-key="C"]').click()
    container.querySelector('button.next-button').click()

    const summary = container.querySelector('.quiz-complete__summary')
    expect(summary.textContent).toBe('You answered 3 of 3 questions.')
  })

  it('does not allow navigation once quiz is complete', () => {
    const container = makeContainer()
    const { engine } = createApp(container, mockQuestions)

    container.querySelector('[data-answer-key="A"]').click()
    container.querySelector('button.next-button').click()
    container.querySelector('[data-answer-key="B"]').click()
    container.querySelector('button.next-button').click()
    container.querySelector('[data-answer-key="C"]').click()
    container.querySelector('button.next-button').click()

    // engine status must be 'complete'
    expect(engine.getState().status).toBe('complete')
    // no question card is present to navigate with
    expect(container.querySelector('.question-card')).toBeNull()
  })

  it('engine isComplete() returns true after Finish Quiz', () => {
    const container = makeContainer()
    const { engine } = createApp(container, mockQuestions)

    container.querySelector('[data-answer-key="A"]').click()
    container.querySelector('button.next-button').click()
    container.querySelector('[data-answer-key="B"]').click()
    container.querySelector('button.next-button').click()
    container.querySelector('[data-answer-key="C"]').click()
    container.querySelector('button.next-button').click()

    expect(engine.isComplete()).toBe(true)
  })
})
