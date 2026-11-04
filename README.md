# learning.

Project 1: the frontend learning website. This folder is separate from any personal project.

## Run

From this folder run `python -m http.server 8000`, then open http://localhost:8000. The pages also support opening index.html directly.

## Pages

- index.html: photographic hero, site overview, and links to all sections.
- quotes.html: 15 quotes and a randomly selected hero quote. The shuffle button selects a different quote.
- project.html: six project ideas, learning topics, and a link to the completed memory game.
- machine.html: a self-switching useless machine, memory matching (6/8/10 pairs), and a five-round reaction challenge.
- nav.js: the single shared navigation definition, injected into every page with current-page highlighting.

All games support native keyboard buttons and touch. Memory records are stored per difficulty on this device when local storage is available. Games remain playable without storage.

## Verification

Run `node tests/site.test.cjs`. It checks memory completion, difficulty, records and resets, reaction rounds and early clicks, machine behaviour, quote count, random quote changes, and local file references.

## Submission status

Website items 1–8 are implemented. Git is installed. External submission requirements still need verification: AI extension in VS Code, a valid independent Git repository, the public GitHub repository, latest code pushed, public deployment, and a separate webtech.landrock.io entry with four website screenshots.

The original .git was a zero-byte file. It has been preserved as .git-empty-backup and a valid independent repository has now been initialised inside my-site. GitHub connection, push, and publishing still require account access. Do not initialise the outer web-projects folder.

Suggested GitHub Pages publishing: publish the main branch at the repository root. Do not combine this learning site with Project 2. Capture the Home, Quotes, Projects, and Playground pages from the actual browser for submission.

