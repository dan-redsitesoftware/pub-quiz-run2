import { describe, it, expect, vi } from 'vitest'
import { createWelcomeScreen } from './WelcomeScreen.js'

const noop = () => {}

describe('createWelcomeScreen — validation', () => {
  it('throws when onStart is not a function', () => {
    expect(() => createWelcomeScreen({ onStart: null })).toThrow('WelcomeScreen: onStart must be a function')
  })

  it('throws when onStart is undefined', () => {
    expect(() => createWelcomeScreen({ onStart: undefined })).toThrow()
  })
})

describe('createWelcomeScreen — rendering', () => {
  it('returns a div with class welcome-screen', () => {
    const el = createWelcomeScreen({ onStart: noop })
    expect(el.tagName).toBe('DIV')
    expect(el.classList.contains('welcome-screen')).toBe(true)
  })

  it('displays the app title "Pub Quiz"', () => {
    const el = createWelcomeScreen({ onStart: noop })
    const title = el.querySelector('.welcome-screen__title')
    expect(title).not.toBeNull()
    expect(title.textContent).toBe('Pub Quiz')
  })

  it('renders a Start Quiz button', () => {
    const el = createWelcomeScreen({ onStart: noop })
    const btn = el.querySelector('.welcome-screen__start-btn')
    expect(btn).not.toBeNull()
    expect(btn.textContent).toBe('Start Quiz')
  })

  it('calls onStart when Start Quiz button is clicked', () => {
    const onStart = vi.fn()
    const el = createWelcomeScreen({ onStart })
    el.querySelector('.welcome-screen__start-btn').click()
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('does not call onStart before button is clicked', () => {
    const onStart = vi.fn()
    createWelcomeScreen({ onStart })
    expect(onStart).not.toHaveBeenCalled()
  })
})
