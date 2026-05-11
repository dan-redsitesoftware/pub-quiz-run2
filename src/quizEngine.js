/**
 * QuizEngine — pure state module for managing quiz progress.
 *
 * Usage:
 *   import { createQuizEngine } from './quizEngine.js'
 *   import questions from './data/questions.js'
 *
 *   const engine = createQuizEngine(questions)
 *   engine.startQuiz()
 *   engine.selectAnswer(0, 'C')
 *   engine.nextQuestion()
 *   engine.isComplete() // false until all questions exhausted
 *
 * State shape:
 *   currentQuestionIndex  number   — zero-based index of the active question
 *   selectedAnswers       array    — one entry per question, null until answered
 *   status                string   — 'idle' | 'active' | 'complete'
 */

/**
 * Creates a new quiz engine instance initialised from the given question bank.
 *
 * @param {Array<{id: number, question: string, options: object, answer: string}>} questions
 * @returns {{ startQuiz, selectAnswer, nextQuestion, isComplete, getState }}
 */
export function createQuizEngine(questions) {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('questions must be a non-empty array')
  }

  const state = {
    currentQuestionIndex: 0,
    selectedAnswers: new Array(questions.length).fill(null),
    status: 'idle', // 'idle' | 'active' | 'complete'
  }

  /** Reset and begin the quiz. */
  function startQuiz() {
    state.currentQuestionIndex = 0
    state.selectedAnswers = new Array(questions.length).fill(null)
    state.status = 'active'
  }

  /**
   * Record the player's answer for a given question.
   * Has no effect if the quiz is not active or the index is out of range.
   *
   * @param {number} questionIndex - Index of the question being answered
   * @param {string} answerKey     - Selected option key, e.g. 'A' | 'B' | 'C' | 'D'
   */
  function selectAnswer(questionIndex, answerKey) {
    if (state.status !== 'active') return
    if (questionIndex < 0 || questionIndex >= questions.length) return
    state.selectedAnswers[questionIndex] = answerKey
  }

  /**
   * Advance to the next question.
   * When called on the last question, marks the quiz as complete.
   * Has no effect if the quiz is not active.
   */
  function nextQuestion() {
    if (state.status !== 'active') return
    if (state.currentQuestionIndex < questions.length - 1) {
      state.currentQuestionIndex++
    } else {
      state.status = 'complete'
    }
  }

  /** Returns true once all questions have been stepped through. */
  function isComplete() {
    return state.status === 'complete'
  }

  /** Returns a snapshot of the current state (selectedAnswers is a shallow copy). */
  function getState() {
    return {
      currentQuestionIndex: state.currentQuestionIndex,
      selectedAnswers: [...state.selectedAnswers],
      status: state.status,
    }
  }

  return { startQuiz, selectAnswer, nextQuestion, isComplete, getState }
}
