# StreamForge — Technical Documentation & Developer Guide

> Single-Host Live Streaming Platform | Version 1.0 | May 2026

Welcome to the StreamForge developer guide. This document outlines the architectural decisions, folder structures, and coding standards required to build, maintain, and scale the StreamForge platform. 

## 1. System Architecture & Tech Stack

StreamForge is structured as a standard multi-directory repository, separated cleanly into a frontend client and a backend API. We explicitly avoid over-engineering (e.g., no Nx monorepo) to maintain simplicity and agility.

### Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js
- **Real-Time / Media**: LiveKit (WebRTC), Socket.io
- **Database / ORM**: PostgreSQL (Neon), Prisma ORM
- **Authentication**: JWT & bcryptjs

---

## 2. Root Folder Structure

The project is divided into two root directories:

```text
streamforge/
├── frontend/                # Next.js Application
└── backend/                 # Express.js Application
```

---

## 3. Frontend Architecture (Next.js)

To maintain a clean, scalable, and highly readable frontend, we strictly enforce a **Hybrid Component Architecture (Views + UI)** with a hard **Separation of Concerns**. This pairs perfectly with `shadcn/ui`.

### Core Rules for Next.js
1. **No UI Components in Routes**: The `app/` directory is **strictly for routing and page composition**. Do not define UI components or complex logic inside `page.tsx` or `layout.tsx`. Delegate everything to the `components/views/` directory.
2. **Separation of Logic and UI**: Never mix data fetching, business logic, and UI rendering in the same file. 
3. **Small & Reusable**: Keep components under ~150 lines. If a component grows, split it into smaller sub-components.

### Folder Structure

```text
frontend/src/
├── app/                      # Strictly Routing (Next.js App Router)
│   ├── (auth)/login/page.tsx # Composes the Login view
│   ├── dashboard/page.tsx    # Composes the Dashboard view
│   └── layout.tsx
├── components/               
│   ├── ui/                   # Generic building blocks (Auto-populated by shadcn/ui - Button, Input)
│   ├── layout/               # Structural components (Navbar, Footer, Sidebar)
│   └── views/                # Screen-specific grouped components
│       ├── login/            # Domain: Login Screen
│       │   ├── LoginForm.tsx
│       │   └── FormFields.tsx
│       ├── dashboard/        # Domain: Dashboard Screen
│       │   ├── DashboardStats.tsx
│       │   └── RoomCard.tsx
│       └── stream/           # Domain: Live Broadcast Screen
├── lib/                      # Global configurations (e.g., Axios instance, LiveKit config, utils for shadcn)
└── hooks/                    # Business logic and global hooks (e.g., useAuth, useLogin, useWindowSize)
```

### Component Implementation Pattern

**1. The UI Component (Pure View)**
Focuses entirely on layout, styling, and rendering props. No API calls. Utilizes `shadcn/ui` from the `ui/` folder.
```tsx
// components/views/login/LoginForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginFormProps } from '@/types';

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input name="email" type="email" required />
      <Input name="password" type="password" required />
      {error && <span className="text-destructive">{error}</span>}
      <Button type="submit" disabled={isLoading}>Login</Button>
    </form>
  );
}
```

**2. The Custom Hook (Logic)**
Handles state, API requests, and business logic.
```tsx
// hooks/useLogin.ts
import { useState } from 'react';
import { loginApi } from '@/lib/api';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // API Call & Token management logic here
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}
```

**3. The Page Route (Composition)**
Assembles the logic and UI inside the App Router.
```tsx
// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/views/login/LoginForm';
import { useLogin } from '@/hooks/useLogin';

export default function LoginPage() {
  const { handleLogin, isLoading, error } = useLogin();
  return <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />;
}
```

---

## 4. Backend Architecture (Express.js Modular Monolith)

The backend avoids a disorganized "spaghetti" structure by using a **Modular Monolithic** approach. Each business domain is encapsulated in its own module.

### Folder Structure

```text
backend/src/
├── config/                 # DB, Server, Socket configs
├── middlewares/            # Global middlewares (e.g., error handler, auth verifier)
├── modules/                # Feature modules
│   ├── auth/
│   │   ├── auth.controller.ts  # HTTP Request/Response handling
│   │   ├── auth.service.ts     # Business logic, Prisma DB calls
│   │   ├── auth.routes.ts      # Express route definitions
│   │   └── auth.schema.ts      # Zod validation schemas
│   ├── rooms/
│   ├── streams/
│   └── chat/
├── server.ts               # Express App initialization
└── main.ts                 # Entry point
```

### Backend Principles
1. **Fat Services, Skinny Controllers**: Controllers should only extract request data (params, body), pass it to the Service, and return the formatted HTTP response. **All business logic lives in the Service.**
2. **Centralized Error Handling**: Do not send raw `res.status(500)` everywhere. Throw custom API Error classes in the Service, let the controller catch them via `next(err)`, and handle them in a global error middleware.
3. **Validation at the Gates**: Use Zod or similar middleware at the Route level to sanitize and validate request bodies before they hit the controller.

---

## 5. Global Coding Standards

To ensure long-term maintainability, all developers must adhere to these rules:

1. **Strict TypeScript**: Never use `any`. Define interfaces/types for all data models, component props, and API responses.
2. **Descriptive Naming**: Use clear, human-readable names. Avoid cryptic abbreviations.
   - Good: `handleUserLogin`, `hasStreamEnded`
   - Bad: `hdlUsrLg`, `streamSt`
3. **Early Returns**: Reduce code nesting by returning early in functions (Guard Clauses).
4. **No Magic Strings/Numbers**: Extract repeated strings and numbers into a `constants.ts` file or environment variables.
5. **Self-Documenting Code**: Code should explain *what* it does. Use comments only to explain *why* something is done if it involves complex or non-obvious business logic.
6. **Error Handling**: Every async operation on the frontend and backend must be wrapped in proper try/catch blocks. Never swallow errors silently.

---

## 6. React 19 & Next.js App Router Best Practices

With Next.js utilizing React 19, we must take advantage of the new hooks and features to drastically reduce boilerplate code, especially around forms and state management.

### 1. Form Actions (No more `e.preventDefault()`)
React 19 integrates natively with standard HTML `<form>` elements. You can now pass an async function directly to the `action` prop. This eliminates the need for manual event handling and boilerplate state.

```tsx
// ❌ OLD WAY (React 18)
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  await api.submit(data);
  setIsLoading(false);
};
<form onSubmit={handleSubmit}>

// ✅ NEW WAY (React 19)
const submitData = async (formData: FormData) => {
  "use server"; // If using Next.js Server Actions
  // process formData
};
<form action={submitData}>
```

### 2. `useActionState` (Replaces `useState` for Forms)
Instead of manually tracking `isLoading`, `error`, and `data` states, use `useActionState`. It takes your action function and an initial state, returning the current state, a new action to attach to the form, and the pending status.

```tsx
import { useActionState } from "react";

async function loginAction(prevState: any, formData: FormData) {
  // Call API, return new state (e.g., error messages or success)
  return { error: "Invalid credentials" }; 
}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### 3. `useFormStatus` (For Child Components)
If you have a deeply nested submit button, you no longer need to pass `isPending` via props or context. `useFormStatus` hooks into the parent `<form>` automatically.

```tsx
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}
```

### 4. `useOptimistic` (Instant UI Updates)
When a user sends a chat message or reacts with an emoji, the UI should update *instantly* before the server responds. React 19's `useOptimistic` handles this beautifully and automatically rolls back if the server request fails.

```tsx
import { useOptimistic } from "react";

export function ChatList({ messages, sendMessageAction }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, newMessage]
  );

  return (
    <ul>
      {optimisticMessages.map((msg) => <li key={msg.id}>{msg.text}</li>)}
    </ul>
  );
}
```

### 5. The `use` API (Read Promises & Context Dynamically)
React 19 introduces the `use` API. Unlike traditional hooks, `use` can be called *inside conditionals or loops*. It allows you to unwrap Promises (like data fetching) or read from React Context without needing `useEffect` or `useContext`.

```tsx
import { use, Suspense } from "react";

// Fetching Data dynamically
function RoomDetails({ roomPromise }) {
  const room = use(roomPromise); // Suspends the component until promise resolves
  return <h1>{room.title}</h1>;
}

// Consuming Context conditionally
function AdminPanel({ isAdmin }) {
  if (!isAdmin) return null;
  const theme = use(ThemeContext); // Valid in React 19!
  return <div className={theme}>Admin tools</div>;
}
```

By leveraging these React 19 features in our Next.js frontend, we will eliminate dozens of unnecessary `useState` and `useEffect` calls, resulting in a much cleaner, faster, and more maintainable codebase.
