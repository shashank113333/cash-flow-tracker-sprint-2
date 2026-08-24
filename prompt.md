# AI Prompts Used for Sprint 02 (Cash-Flow Tracker)

During this sprint, I utilized AI to understand the logic and best practices for Vanilla JavaScript. Below is a summary of the assistance I took:

1. Understanding Vanilla JS DOM Manipulation:

*Prompt:* "How do I dynamically create list items and update their values in the DOM without using React?"
*AI Help:* The AI explained how to use `document.createElement`, `.innerHTML`, and `.appendChild` to render the expenses dynamically.

2. Implementing LocalStorage (Data Persistence):

*Prompt:* "My LocalStorage is returning [object Object]. How do I save and retrieve an array of objects correctly?"
*AI Help:* The AI reminded me of FAQ #2 and explained how to use `JSON.stringify()` when saving to `localStorage.setItem` and `JSON.parse()` when retrieving data.

3. Integrating External APIs & Chart.js:

*Prompt:* "How do I fetch the live currency rate from the Frankfurter API and update my Chart.js instance?"
*AI Help:* The AI provided the `fetch` logic using async/await and explained how to use `myChart.destroy()` before creating a new chart to prevent duplication bugs (FAQ #8).

4. UI Layout:

*Prompt:* "How can I structure my dashboard using Tailwind CSS utility classes?"
*AI Help:* The AI suggested a Grid layout for the summary cards and a Flexbox layout for the input sections to make the UI responsive.

5. Custom CSS for Input Fields:
*Prompt:* "How do I remove the default up/down arrows (spinners) from `<input type="number">` fields across different browsers?"
*AI Help:* The AI provided the specific CSS pseudo-classes (`::-webkit-inner-spin-button` for Chrome/Safari and `-moz-appearance: textfield` for Firefox) to hide the default browser spinners, making the UI look cleaner.

6. HTML Layout & Sticky Footer:
*Prompt:* "In my HTML, the footer floats up when there are no expenses on the screen. How do I force the footer to always stay at the bottom of the page using Tailwind CSS?"
*AI Help:* The AI recommended applying `flex flex-col min-h-screen` to the `<body>` tag, `flex-grow` to the `<main>` content container, and `mt-auto` to the `<footer>`. This created a perfect sticky footer layout.