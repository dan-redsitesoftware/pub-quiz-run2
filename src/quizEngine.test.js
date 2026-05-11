import { describe, it, expect, beforeEach } from 'vitest'
import { createQuizEngine } from './quizEngine.js'

// Minimal question bank for testing (mirrors the schema from src/data/questions.js)
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

describe('createQuizEngine', () => {
  it('throws when called with an empty array', () => {
    expect(() => createQuizEngine([])).toThrow()
  })

  it('throws when called with a non-array', () => {
    expect(() => createQuizEngine(null)).toThrow()
    expect(() => createQuizEngine('questions')).toThrow()
  })
})

describe('QuizEngine — initial state', () => {
  it('starts with status idle', () => {
    const engine = createQuizEngine(mockQuestions)
    expect(engine.getState().status).toBe('idle')
  })

  it('starts with currentQuestionIndex 0', () => {
    const engine = createQuizEngine(mockQuestions)
    expect(engine.getState().currentQuestionIndex).toBe(0)
  })

  it('initialises selectedAnswers to all-null with correct length', () => {
    const engine = createQuizEngine(mockQuestions)
    const { selectedAnswers } = engine.getState()
    expect(selectedAnswers).toHaveLength(mockQuestions.length)
    expect(selectedAnswers.every(a => a === null)).toBe(true)
  })
})

describe('startQuiz()', () => {
  it('sets status to active', () => {
    const engine = createQuizEngine(mockQuestions)
    engine.startQuiz()
    expect(engine.getState().status).toBe('active')
  })

  it('resets index to 0 when called again mid-quiz', () => {
    const engine = createQuizEngine(mockQuestions)
    engine.startQuiz()
    engine.nextQuestion()
    engine.startQuiz()
    expect(engine.getState().currentQuestionIndex).toBe(0)
  })

  it('clears any previously recorded answers', () => {
    const engine = createQuizEngine(mockQuestions)
    engine.startQuiz()
    engine.selectAnswer(0, 'A')
    engine.startQuiz()
    expect(engine.getState().selectedAnswers[0]).toBeNull()
  })
})

describe('selectAnswer()', () => {
  let engine

  beforeEach(() => {
    engine = createQuizEngine(mockQuestions)
    engine.startQuiz()
  })

  it('records the answer at the correct index', () => {
    engine.selectAnswer(0, 'C')
    expect(engine.getState().selectedAnswers[0]).toBe('C')
  })

  it('allows updating an already-answered question', () => {
    engine.selectAnswer(0, 'A')
    engine.selectAnswer(0, 'C')
    expect(engine.getState().selectedAnswers[0]).toBe('C')
  })

  it('records answers for non-current questions (random access allowed)', () => {
    engine.selectAnswer(2, 'D')
    expect(engine.getState().selectedAnswers[2]).toBe('D')
  })

  it('has no effect when quiz is idle', () => {
    const idleEngine = createQuizEngine(mockQuestions)
    idleEngine.selectAnswer(0, 'A')
    expect(idleEngine.getState().selectedAnswers[0]).toBeNull()
  })

  it('has no effect for an out-of-range question index', () => {
    engine.selectAnswer(-1, 'A')
    engine.selectAnswer(99, 'A')
    const { selectedAnswers } = engine.getState()
    expect(selectedAnswers.every(a => a === null)).toBe(true)
  })
})

describe('nextQuestion()', () => {
  let engine

  beforeEach(() => {
    engine = createQuizEngine(mockQuestions)
    engine.startQuiz()
  })

  it('advances currentQuestionIndex by 1', () => {
    engine.nextQuestion()
    expect(engine.getState().currentQuestionIndex).toBe(1)
  })

  it('does not wrap around — index stays at last question after reaching the end', () => {
    engine.nextQuestion() // → 1
    engine.nextQuestion() // → 2 (last question, still active)
    const index = engine.getState().currentQuestionIndex
    engine.nextQuestion() // called on last question → status becomes complete, index stays
    expect(engine.getState().currentQuestionIndex).toBe(index)
  })

  it('marks the quiz complete when called on the last question', () => {
    engine.nextQuestion() // → 1
    engine.nextQuestion() // → 2 (last)
    engine.nextQuestion() // called on last question → complete
    expect(engine.getState().status).toBe('complete')
  })

  it('has no effect when the quiz is idle', () => {
    const idleEngine = createQuizEngine(mockQuestions)
    idleEngine.nextQuestion()
    expect(idleEngine.getState().currentQuestionIndex).toBe(0)
    expect(idleEngine.getState().status).toBe('idle')
  })

  it('has no effect when the quiz is already complete', () => {
    engine.nextQuestion() // → 1
    engine.nextQuestion() // → 2
    engine.nextQuestion() // → complete
    const snapshot = engine.getState()
    engine.nextQuestion() // no-op — already complete
    expect(engine.getState()).toEqual(snapshot)
  })
})

describe('isComplete()', () => {
  it('returns false before the quiz starts', () => {
    const engine = createQuizEngine(mockQuestions)
    expect(engine.isComplete()).toBe(false)
  })

  it('returns false during an active quiz', () => {
    const engine = createQuizEngine(mockQuestions)
    engine.startQuiz()
    expect(engine.isComplete()).toBe(false)
  })

  it('returns true after all questions have been stepped through', () => {
    const engine = createQuizEngine(mockQuestions)
    engine.startQuiz()
    engine.nextQuestion() // → 1
    engine.nextQuestion() // → 2 (last)
    engine.nextQuestion() // called on last question → complete
    expect(engine.isComplete()).toBe(true)
  })
})

describe('getState()', () => {
  it('returns a copy of selectedAnswers — mutations do not affect internal state', () => {
    const engine = createQuizEngine(mockQuestions)
    engine.startQuiz()
    const snapshot = engine.getState()
    snapshot.selectedAnswers[0] = 'Z'
    expect(engine.getState().selectedAnswers[0]).toBeNull()
  })
})

describe('linear flow enforcement', () => {
  it('cannot go back — index only ever increments', () => {
    const engine = createQuizEngine(mockQuestions)
    engine.startQuiz()
    engine.nextQuestion() // → 1
    // There is no prevQuestion(); index can only go forward
    expect(engine.getState().currentQuestionIndex).toBe(1)
    expect(engine).not.toHaveProperty('prevQuestion')
  })
})
