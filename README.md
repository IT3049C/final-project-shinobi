# GameHub

GameHub is a browser-based mini-game platform built with React and Vite. It combines multiple game experiences behind a single lobby, shared player identity, and a consistent visual system.

## Overview

GameHub provides a unified entry point for multiple games while keeping each game feature modular.

Core goals:

- Let players set a profile (name + avatar) once and use it across games
- Keep game logic isolated by feature
- Support both local and online-style room workflows where applicable
- Maintain an arcade-style interface with preview panels and responsive layouts

## Features

- Home lobby with game selection and interactive preview cards
- Persistent player profile using browser storage
- Game feature set:
   - Rock Paper Scissors
   - Wordle
   - Tic Tac Toe
   - Trivia
   - Pokemon guessing game
- Shared room components for multiplayer-style game flows
- End-to-end test coverage for core user journeys

## Game Modes

- Local single-device gameplay
- Online room workflows for supported games (room create/join/wait/play flows)

## Technology Stack

- React
- React Router
- Vite
- Playwright
- ESLint
- animate.css

External APIs used:

- PokeAPI
- Open Trivia Database
- Random Word API
- DictionaryAPI

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

### Build + preview production locally

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Testing

Run the Playwright suite:

```bash
npm run test
```

Current focus is end-to-end user flow validation for hub and key game journeys.

## Deployment

This project is configured as a static Vite deployment with base path `/final-project-shinobi/` in [vite.config.js](vite.config.js).

Deployment checklist:

1. Build the app.

```bash
npm run build
```

2. Publish the generated [dist](dist) folder to your static host.
3. Ensure host routing falls back to `index.html` for client-side routes.
4. If using GitHub Pages, keep the repository path aligned with the configured Vite base path.

## Course Submission Appendix

### Group Members

- Apiwat Anachai
- Kymani Jarrett

### Checklist

- [x] frequent commits to github.
- [x] filled out the self-evaluation.

### Self Grading Guide

I should get **(20)** out of 20 on this assignment.

### Self-Reflection

**How long it took me to finish this?**

- It took us ~3-4 days of work to complete this project.

**What do you think of this completion time?**

- We believe that this is an appropriate amount of time given the level of complexity and the volume of features that needed to be implemented.

**In hindsight, what would you do differently?**

- In hindsight, we would split work into smaller tasks earlier and finalize the core game logic first before polishing the UI. We probably should've added a shared utilities layer sooner to reduce any duplicated styling and repeated useStates across game pages.

**What resources did you use?**

- React documentation, React Router documentation, and Vite documentation for architecture/setup.
- MDN docs for event handling, async fetch patterns, and CSS behavior.
- API references for PokeAPI, DictionaryAPI, and Random Word API.
- animate.css documentation for Wordle-style animation classes and timing.