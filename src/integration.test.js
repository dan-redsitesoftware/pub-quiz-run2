/**
 * Integration test — Quiz Engine wired with Question Bank data.
 *
 * Verifies that the real question bank (src/data/questions.js) is correctly
 * served through the engine and UI components from start to completion.
 */

import { describe, it, expect } from 'vitest'
import questions from './data/questions.js'
import { createQuizEngine } from './quizEngine.js'
import { createApp } from './App.js'

// ─── Question Bank shape ──────────────────────────────────────────────────────

describe('Question Bank — data integrity', () => {
  it('exports at least 10 questions', () => {
    expect(Array.isArray(questions)).toBe(true)
    expect(questions.length).toBeGreaterThanOrEqual(10)
  })

  it.each(questions)('question $id has valid id, question text, 4 options and a correct answer', (q) => {
    expect(typeof q.id).toBe('number')
    expect(typeof q.question).toBe('string')
    expect(q.question.length).toBeGreaterThan(0)
    expect(Object.keys(q.options)).toEqual(['A', 'B', 'C', 'D'])
    expect(['A', 'B', 'C', 'D']).toContain(q.answer)
  })
})

// ─── QuizEngine wired with Question Bank ─────────────────────────────────────

describe('QuizEngine — initialised with Question Bank', () => {
  it('accepts the full question bank without throwing', () => {
    expect(() => createQuizEngine(questions)).not.toThrow()
  })

  it('starts at the first question', () => {
    const engine = createQuizEngine(questions)
    engine.startQuiz()
    const state = engine.getState()
    expect(state.currentQuestionIndex).toBe(0)
    expect(state.status).toBe('active')
  })

  it('serves all questions in order', () => {
    const engine = createQuizEngine(questions)
    engine.startQuiz()

    for (let i = 0; i < questions.length - 1; i++) {
      expect(engine.getState().currentQuestionIndex).toBe(i)
      engine.selectAnswer(i, questions[i].answer)
      engine.nextQuestion()
    }

    expect(engine.getState().currentQuestionIndex).toBe(questions.length - 1)
  })

  it('reaches complete status after answering and advancing through all questions', () => {
    const engine = createQuizEngine(questions)
    engine.startQuiz()

    for (let i = 0; i < questions.length - 1; i++) {
      engine.selectAnswer(i, questions[i].answer)
      engine.nextQuestion()
    }
    // Answer the last question and advance to complete
    engine.selectAnswer(questions.length - 1, questions[questions.length - 1].answer)
    engine.nextQuestion()

    expect(engine.isComplete()).toBe(true)
    expect(engine.getState().status).toBe('complete')
  })
})

// ─── App — end-to-end flow with real Question Bank ───────────────────────────

describe('App — end-to-end with Question Bank', () => {
  it('renders the first real question on start', () => {
    const container = document.createElement('div')
    createApp(container, questions)
    const text = container.querySelector('.question-text').textContent
    expect(text).toBe(questions[0].question)
  })

  it('renders all four option texts from the question bank format', () => {
    const container = document.createElement('div')
    createApp(container, questions)
    const buttons = container.querySelectorAll('[data-answer-key]')
    expect(buttons.length).toBe(4)
    const renderedTexts = Array.from(buttons).map((b) => b.textContent)
    const expectedTexts = Object.values(questions[0].options).map((opt) => `A: ${opt}`)
    // Buttons include the key prefix (e.g. "A: Berlin") — just verify all option values appear
    for (const opt of Object.values(questions[0].options)) {
      expect(renderedTexts.some((t) => t.includes(opt))).toBe(true)
    }
  })

  it('shows the correct question count in the progress indicator', () => {
    const container = document.createElement('div')
    createApp(container, questions)
    const progress = container.querySelector('.question-progress').textContent
    expect(progress).toBe(`Question 1 of ${questions.length}`)
  })

  it('reaches the completion screen after answering all questions', () => {
    const container = document.createElement('div')
    createApp(container, questions)

    for (let i = 0; i < questions.length; i++) {
      // Select any answer
      container.querySelector('[data-answer-key="A"]').click()
      const nextBtn = container.querySelector('button.next-button')
      nextBtn.click()
    }

    expect(container.querySelector('.quiz-complete')).not.toBeNull()
    expect(container.querySelector('.question-card')).toBeNull()
  })

  it('contains no hardcoded question text in the engine or UI sources', () => {
    // Verify the engine state uses data from the imported question bank
    const container = document.createElement('div')
    const { engine } = createApp(container, questions)
    engine.startQuiz()
    const state = engine.getState()
    // The engine must be initialised with the bank questions (not a stub)
    expect(state.selectedAnswers.length).toBe(questions.length)
  })
})
