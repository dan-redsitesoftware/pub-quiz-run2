/**
 * QuestionCard — renders a single quiz question with its four answer options.
 *
 * Props (all required):
 *   question        {object}        — question object from the question bank
 *   question.id     {number}
 *   question.question {string}      — the question text
 *   question.options  {object}      — { A, B, C, D } answer text
 *   questionIndex   {number}        — zero-based index of this question
 *   totalQuestions  {number}        — total number of questions in the quiz
 *   selectedAnswer  {string|null}   — currently selected option key, or null
 *   onAnswerSelect  {function}      — called with (questionIndex, answerKey) when an option is chosen
 *
 * Returns a <div class="question-card"> element ready to mount into the DOM.
 * No correct/incorrect styling is applied — answer reveal is deferred to the results screen.
 */

const ANSWER_KEYS = ['A', 'B', 'C', 'D']

/**
 * Creates and returns a QuestionCard DOM element.
 *
 * @param {object} props
 * @param {{id: number, question: string, options: {A: string, B: string, C: string, D: string}}} props.question
 * @param {number} props.questionIndex
 * @param {number} props.totalQuestions
 * @param {string|null} props.selectedAnswer
 * @param {function(number, string): void} props.onAnswerSelect
 * @returns {HTMLElement}
 */
export function createQuestionCard({ question, questionIndex, totalQuestions, selectedAnswer, onAnswerSelect }) {
  if (!question || typeof question.question !== 'string') {
    throw new Error('QuestionCard: question must be a valid question object')
  }
  if (!Number.isInteger(questionIndex) || questionIndex < 0) {
    throw new Error('QuestionCard: questionIndex must be a non-negative integer')
  }
  if (!Number.isInteger(totalQuestions) || totalQuestions < 1) {
    throw new Error('QuestionCard: totalQuestions must be a positive integer')
  }
  if (typeof onAnswerSelect !== 'function') {
    throw new Error('QuestionCard: onAnswerSelect must be a function')
  }

  const card = document.createElement('div')
  card.className = 'question-card'

  // Progress indicator: "Question N of M"
  const progress = document.createElement('p')
  progress.className = 'question-progress'
  progress.textContent = `Question ${questionIndex + 1} of ${totalQuestions}`
  card.appendChild(progress)

  // Question text
  const questionText = document.createElement('h2')
  questionText.className = 'question-text'
  questionText.textContent = question.question
  card.appendChild(questionText)

  // Answer options
  const optionsList = document.createElement('ul')
  optionsList.className = 'answer-options'

  for (const key of ANSWER_KEYS) {
    const li = document.createElement('li')
    li.className = 'answer-option'

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'answer-button' + (selectedAnswer === key ? ' answer-button--selected' : '')
    button.dataset.answerKey = key
    button.setAttribute('aria-pressed', String(selectedAnswer === key))
    button.textContent = `${key}: ${question.options[key]}`

    button.addEventListener('click', () => {
      onAnswerSelect(questionIndex, key)
    })

    li.appendChild(button)
    optionsList.appendChild(li)
  }

  card.appendChild(optionsList)

  return card
}
