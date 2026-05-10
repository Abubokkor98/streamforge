# Global Antigravity Rules — StreamForge Project

## 1. Project Architecture
1. **Repository Structure**: Use an **Nx Monorepo** structure. Keep the applications in `frontend/` (Next.js) and `backend/` (Express.js) at the workspace root, managed via Nx and npm workspaces.
2. **Frontend Component Architecture**: Follow the **Hybrid (Views + UI)** approach.
   - Place generic, shared components (like shadcn/ui) strictly in `frontend/src/components/ui/`.
   - Place screen-specific components in `frontend/src/components/views/[domain]/` (e.g., `views/login/LoginForm.tsx`).
   - Place global structural wrappers in `frontend/src/components/layout/`.
   - Do NOT place UI components inside the `app/` router directory. The `app/` directory is strictly for routing and composing views.
3. **Backend Architecture**: Follow a **Modular Monolith** pattern in Express.js.
   - Group by feature in `backend/src/modules/[domain]/`.
   - Maintain strict layer separation: Route -> Controller -> Service.
   - Controllers handle HTTP transport; Services handle business logic and Prisma DB calls.

## 2. React 19 & Next.js Implementation
1. **Modern Form Handling**: NEVER use `e.preventDefault()` or manual `useState` for loading/error tracking on forms. 
   - ALWAYS use React 19 native `<form action={fn}>`.
   - ALWAYS use `useActionState` to handle form submission states (pending, error, success data).
2. **Child Form States**: ALWAYS use `useFormStatus` in child components (like submit buttons) to read the pending state without prop-drilling.
3. **Instant UI Updates**: Use `useOptimistic` for real-time interactions (like chat messages or emoji reactions) to update the UI before the server responds.
4. **Dynamic Unwrapping**: Use the React 19 `use()` API to dynamically unwrap Promises and Contexts (e.g., `const theme = use(ThemeContext)`) instead of `useEffect` or `useContext` when applicable.

## 3. Strict Coding Standards (TypeScript & Maintainability)
1. **Strict TypeScript**: Never use `any`. Create interfaces/types for all data models, component props, and API payloads.
2. **Separation of Concerns**: Never mix UI, business logic, and data fetching in the same file. Use custom hooks (`use*.ts`) for stateful or API logic. Components should focus purely on rendering UI.
3. **Component Size**: Keep components small and single-purpose. Split files that exceed ~100 lines.
4. **Clean JSX**: Do not place business logic, complex filtering, or calculations inside JSX. Prepare all data before the `return` statement.
5. **Readability**: Use descriptive, human-readable names. Avoid abbreviations. Prefer readability over clever/complex code.
6. **Early Returns**: Use early return patterns to reduce nesting.
7. **No Magic Values**: Do not use magic numbers or strings. Extract them into constants.
8. **Error Handling**: Handle all async errors with proper try/catch blocks. Never ignore errors silently.
9. **File Order**: Maintain this file order inside components: Imports → Types → Hooks/State → Handlers → Derived variables → JSX.
10. **Self-Documenting Code**: Write code assuming another developer will maintain it long-term. Add comments only when the reasoning is not obvious.
