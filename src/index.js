/**
 * Entry point — wires the Question Bank into the App.
 *
 * Imports the question bank from src/data/questions.js and passes it to
 * createApp, which initialises the QuizEngine and mounts the UI.
 */

import questions from './data/questions.js'
import { createApp } from './App.js'

const root = document.getElementById('root')
createApp(root, questions)
