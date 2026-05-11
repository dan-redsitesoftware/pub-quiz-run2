/**
 * QuizComplete — results screen shown when all questions have been answered.
 *
 * Props:
 *   questions       {Array}             — the full question bank (for answer review)
 *   selectedAnswers {Array<string|null>} — collected answers, one per question (null if skipped)
 *   score           {number}            — number of correct answers
 *   onRestart       {function}          — called when the user clicks 'Play Again'
 *
 * Returns a <div class="quiz-complete"> element ready to mount into the DOM.
 */

/**
 * Creates and returns a QuizComplete DOM element.
 *
 * @param {object} props
 * @param {Array<{question: string, options: object, answer: string}>} props.questions
 * @param {Array<string|null>} props.selectedAnswers
 * @param {number} props.score
 * @param {function} props.onRestart
 * @returns {HTMLElement}
 */
export function createQuizComplete({ questions, selectedAnswers, score, onRestart }) {
  if (!Array.isArray(questions) || questions.length < 1) {
    throw new Error('QuizComplete: questions must be a non-empty array')
  }
  if (!Array.isArray(selectedAnswers)) {
    throw new Error('QuizComplete: selectedAnswers must be an array')
  }
  if (!Number.isInteger(score) || score < 0) {
    throw new Error('QuizComplete: score must be a non-negative integer')
  }
  if (typeof onRestart !== 'function') {
    throw new Error('QuizComplete: onRestart must be a function')
  }

  const totalQuestions = questions.length
  const percentage = Math.round((score / totalQuestions) * 100)

  const container = document.createElement('div')
  container.className = 'quiz-complete'

  // Heading
  const heading = document.createElement('h1')
  heading.className = 'quiz-complete__heading'
  heading.textContent = 'Quiz Complete!'
  container.appendChild(heading)

  // Score fraction and percentage
  const scoreSummary = document.createElement('p')
  scoreSummary.className = 'quiz-complete__score'
  scoreSummary.textContent = `Your score: ${score}/${totalQuestions} (${percentage}%)`
  container.appendChild(scoreSummary)

  // Per-question review
  const reviewHeading = document.createElement('h2')
  reviewHeading.className = 'quiz-complete__review-heading'
  reviewHeading.textContent = 'Answer Review'
  container.appendChild(reviewHeading)

  const reviewList = document.createElement('ol')
  reviewList.className = 'quiz-complete__review-list'

  questions.forEach((q, i) => {
    const userAnswer = selectedAnswers[i]
    const isCorrect = userAnswer === q.answer

    const li = document.createElement('li')
    li.className = `quiz-complete__review-item quiz-complete__review-item--${isCorrect ? 'correct' : 'incorrect'}`

    const questionText = document.createElement('p')
    questionText.className = 'quiz-complete__review-question'
    questionText.textContent = q.question
    li.appendChild(questionText)

    const resultLine = document.createElement('p')
    resultLine.className = 'quiz-complete__review-result'
    const icon = isCorrect ? '✅' : '❌'
    const userAnswerText = userAnswer ? `${userAnswer}: ${q.options[userAnswer]}` : 'No answer'
    resultLine.textContent = `${icon} Your answer: ${userAnswerText}`
    li.appendChild(resultLine)

    if (!isCorrect) {
      const correctLine = document.createElement('p')
      correctLine.className = 'quiz-complete__review-correct'
      correctLine.textContent = `Correct answer: ${q.answer}: ${q.options[q.answer]}`
      li.appendChild(correctLine)
    }

    reviewList.appendChild(li)
  })

  container.appendChild(reviewList)

  // Play Again button
  const restartButton = document.createElement('button')
  restartButton.className = 'quiz-complete__restart'
  restartButton.textContent = 'Play Again'
  restartButton.addEventListener('click', onRestart)
  container.appendChild(restartButton)

  return container
}
