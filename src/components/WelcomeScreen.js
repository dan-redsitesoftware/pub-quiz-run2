/**
 * WelcomeScreen — the first screen shown when the app loads.
 *
 * Displays the app title and a prominent "Start Quiz" button.
 * Clicking the button calls the provided onStart callback so the
 * parent (App) can transition to the first question.
 *
 * Props:
 *   onStart {function} — called when the user clicks "Start Quiz"
 *
 * Returns a <div class="welcome-screen"> element ready to mount into the DOM.
 */

/**
 * Creates and returns a WelcomeScreen DOM element.
 *
 * @param {object}   props
 * @param {function} props.onStart — callback invoked on "Start Quiz" click
 * @returns {HTMLElement}
 */
export function createWelcomeScreen({ onStart }) {
  if (typeof onStart !== 'function') {
    throw new Error('WelcomeScreen: onStart must be a function')
  }

  const wrapper = document.createElement('div')
  wrapper.className = 'welcome-screen'

  const title = document.createElement('h1')
  title.className = 'welcome-screen__title'
  title.textContent = 'Pub Quiz'
  wrapper.appendChild(title)

  const tagline = document.createElement('p')
  tagline.className = 'welcome-screen__tagline'
  tagline.textContent = 'Test your knowledge — one question at a time.'
  wrapper.appendChild(tagline)

  const startButton = document.createElement('button')
  startButton.className = 'welcome-screen__start-btn'
  startButton.textContent = 'Start Quiz'
  startButton.addEventListener('click', onStart)
  wrapper.appendChild(startButton)

  return wrapper
}
