/**
 * App — top-level orchestrator for the pub quiz.
 *
 * Manages quiz lifecycle: shows QuestionCard while the quiz is active and
 * transitions to QuizComplete once the engine marks status as 'complete'.
 *
 * Usage:
 *   import { createApp } from './App.js'
 *   const app = createApp(document.getElementById('root'), questions)
 *
 * @param {HTMLElement} container    — DOM node to render into
 * @param {Array}       questions    — question bank to pass to the engine
 * @param {object}      [deps]       — optional dependency overrides for testing
 */

import { createQuizEngine } from './quizEngine.js'
import { createQuestionCard } from './components/QuestionCard.js'
import { createQuizComplete } from './components/QuizComplete.js'

export function createApp(container, questions, deps = {}) {
  const {
    quizEngine = createQuizEngine,
    questionCard = createQuestionCard,
    quizComplete = createQuizComplete,
  } = deps

  const engine = quizEngine(questions)
  engine.startQuiz()

  function render() {
    container.innerHTML = ''
    const state = engine.getState()

    if (state.status === 'complete') {
      const completeView = quizComplete({
        totalQuestions: questions.length,
        selectedAnswers: state.selectedAnswers,
      })
      container.appendChild(completeView)
      return
    }

    const currentQuestion = questions[state.currentQuestionIndex]
    const isLastQuestion = state.currentQuestionIndex === questions.length - 1

    const card = questionCard({
      question: currentQuestion,
      questionIndex: state.currentQuestionIndex,
      totalQuestions: questions.length,
      selectedAnswer: state.selectedAnswers[state.currentQuestionIndex],
      isLastQuestion,
      onAnswerSelect: (index, key) => {
        engine.selectAnswer(index, key)
        render()
      },
      onNext: () => {
        engine.nextQuestion()
        render()
      },
    })

    container.appendChild(card)
  }

  render()

  return { engine }
}
