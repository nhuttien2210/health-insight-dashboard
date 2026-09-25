# Health Insight Dashboard

A responsive, mobile-first personal health dashboard that provides deep insights through a context-aware AI assistant.

---

## 🏗 Architecture Overview

The application is built with a modern React stack, focusing on performance, modularity, and explicit data flow:

- **Core:** React 19 + TypeScript + Vite.
- **State Management:**
  - **Zustand** for lightweight global UI states (e.g., Theme preference, Assistant chat history).
  - **React Query** for server-state caching and synchronization. The dashboard data is fetched once per time-range and cached, allowing both the UI and the Assistant to share the exact same origin data instantly.
- **Styling:** CSS variables (utilising `oklch` for dynamic themes) + Tailwind CSS v4.
- **Folder Structure:** Feature-sliced design (`/features/dashboard`, `/features/assistant`). This encapsulates UI, hooks, and stores within their respective domains.
- **Mock Service Worker (MSW):** The API layer is simulated using a deterministic mock engine (`/workers/mocks`) that generates stable, seed-based health data so the dashboard behaves like a real production app without needing a live backend.

---

## 💎 Key Product Decisions

### 1. Mobile-First, Premium Aesthetics

The dashboard is designed to look and feel like a curated, native application rather than a web template.

- **Responsive Layout Stability:** By using CSS `divide-y` and unified React grids, the layout flawlessly transitions from a single column on mobile to multi-column layouts on tablets (`md:` breakpoint).

### 2. Context-Aware Assistant Integration

Instead of a generic floating chatbot, the AI Assistant is deeply integrated into the app's state.

- It reads the **same React Query cache** as the dashboard. If the user is looking at their 30-day view, the Assistant's data context is strictly limited to those 30 days. It never hallucinates data outside of the user's active viewport.

### 3. Performance & Lazy Loading

- The LLM logic and Assistant UI components are heavily sandboxed. The Assistant is lazy-loaded via `React.lazy` and `<Suspense>` in the App Layout, ensuring the main Dashboard bundle remains lightweight and fast for initial paint.

---

## 🧠 LLM & Prompt Approach

We rejected the traditional "chatbot that writes Markdown paragraphs" approach in favor of a strictly structured JSON contract to ensure type safety, predictability, and a native UI feel.

### 1. Strict Data Grounding

The System Prompt (`assistant.prompt.ts`) dynamically ingests a sterilized snapshot of the user's `HealthContext`. The system rules strictly forbid the model from diagnosing medical conditions, inventing data, or making assumptions outside of the provided JSON payload.

### 2. Structured JSON Contract (`assistant.schema.ts`)

The LLM is prompted to serialize its response into a Zod-validated JSON object containing:

- **`answer`:** The conversational response.
- **`highlights`:** Extracted key metrics with sentiment classifications (`positive`, `neutral`, `attention`).
- **`suggestions`:** Actionable steps for the user.
- **`followUpQuestions`:** Anticipated next questions.

### 3. Native Rendering Strategy (`ChatMessageItem.tsx`)

Because the AI's response is structured data, the UI can render it gracefully:

- **Highlights** become color-coded badges, allowing users to scan metrics instantly.
- **Suggestions** are mapped to actionable UI lists.
- **Follow-up questions** are mapped to interactive pill buttons, drastically lowering typing friction on mobile screens.

### 4. Self-Healing Error Pipeline

If the LLM occasionally fails to return valid JSON, the Assistant service catches the parsing error and automatically dispatches a single background corrective retry (`REPAIR_INSTRUCTION`) before surfacing an error to the user, ensuring maximum reliability.

---

## 🚀 Setup Instructions

1. **Clone the repository and install dependencies:**
   This project uses `bun` (recommended) but falls back to `npm` safely.

   ```bash
   bun install
   # or
   npm install
   ```

2. **Configure your environment variables:**
   Duplicate the provided `.env.example` file and rename it to `.env`:

   ```bash
   cp .env.example .env
   ```

   Add your Gemini API key (see Environment Variables section below).

3. **Run the development server:**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

---

## ⚙️ Environment Variables

The application requires certain environment variables to run locally (configured in your `.env` file):

| Variable                   | Description                                                                                                                                                                               | Default              |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------- |
| \`VITE_GEMINI_API_KEY\`    | **(Required)** Your Google AI Studio API key. Create one for free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).                                                    | _None_               |
| \`VITE_GEMINI_MODEL\`      | _(Optional)_ The specific Google Gemini model to use for the assistant.                                                                                                                   | \`gemini-3.5-flash-lite\` |
| \`VITE_MOCK_FAILURE_RATE\` | _(Optional)_ Set between `0` and `1` (e.g. `0.3` for 30%) to force a percentage of API requests to purposefully fail. Useful for demonstrating the error recovery UI and skeleton states. | \`0\`                |
