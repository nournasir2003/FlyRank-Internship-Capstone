# FlyRank Capstone Rules

## Project Stack

- Next.js 16 (App Router)
- React 19
- JavaScript (ES6+)
- Tailwind CSS v4
- ESLint

## Development Commands

- Use `npm run dev` to start the development server.
- Use `npm run build` to create a production build.
- Run `npm run lint` before committing changes.

## Architecture

- Use the App Router (`app/` directory).
- Prefer Server Components by default.
- Use Client Components only when browser interactivity is required (`"use client"`).
- Keep layouts inside `app/layout.jsx`.
- Keep pages inside the `app/` directory using `page.jsx`.
- Organize reusable UI components inside `components/`.

## Code Style

- Use functional React components only.
- Keep components small, focused, and reusable.
- Use async/await instead of promise chains where practical.
- Use meaningful variable and function names.
- Remove unused imports, variables, and code.
- Keep files clean and easy to read.

## Styling

- Use Tailwind CSS for styling.
- Reuse utility classes when possible.
- Avoid inline styles unless absolutely necessary.
- Keep spacing and typography consistent.

## Data Fetching

- Use Server Components for data fetching whenever possible.
- Use `fetch()` with appropriate caching options.
- Use Client Components only when state, effects, or browser APIs are required.

## Project Structure

- `app/` → routes and layouts
- `components/` → reusable UI components
- `public/` → static assets
- `lib/` → helper functions and utilities

## Git Workflow

- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`, `chore:`).
- Never commit `node_modules/`.
- Keep `README.md` updated with setup instructions.
- Run `npm run lint` before committing.
- Run `npm run build` before opening a Pull Request.

## Do Not

- Do not install unnecessary dependencies.
- Do not commit secrets or `.env.local`.
- Do not modify generated files unless necessary.
- Do not convert Server Components into Client Components without a reason.

## Project-Specific Rules

- Keep reusable logic outside page components when appropriate.
- Use controlled form inputs with client-side validation.
- Verify every AI-generated feature by running the application locally.
- Ensure the application builds successfully before submitting.
