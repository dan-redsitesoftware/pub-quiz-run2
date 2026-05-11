/**
 * QuizComplete — stub results screen shown when all questions have been answered.
 *
 * Props:
 *   totalQuestions  {number}        — total number of questions in the quiz
 *   selectedAnswers {Array<string|null>} — collected answers, one per question (null if skipped)
 *
 * Returns a <div class="quiz-complete"> element ready to mount into the DOM.
 * Full scoring / answer reveal is out of scope for this task; this is a placeholder.
 */

/**
 * Creates and returns a QuizComplete DOM element.
 *
 * @param {object} props
 * @param {number} props.totalQuestions
 * @param {Array<string|null>} props.selectedAnswers
 * @returns {HTMLElement}
 */
export function createQuizComplete({ totalQuestions, selectedAnswers }) {
  if (!Number.isInteger(totalQuestions) || totalQuestions < 1) {
    throw new Error('QuizComplete: totalQuestions must be a positive integer')
  }
  if (!Array.isArray(selectedAnswers)) {
    throw new Error('QuizComplete: selectedAnswers must be an array')
  }

  const answeredCount = selectedAnswers.filter(a => a !== null).length

  const container = document.createElement('div')
  container.className = 'quiz-complete'

  const heading = document.createElement('h1')
  heading.className = 'quiz-complete__heading'
  heading.textContent = 'Quiz Complete!'
  container.appendChild(heading)

  const summary = document.createElement('p')
  summary.className = 'quiz-complete__summary'
  summary.textContent = `You answered ${answeredCount} of ${totalQuestions} questions.`
  container.appendChild(summary)

  return container
}
