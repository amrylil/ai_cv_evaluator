# CV Evaluation AI API

A simple API built with **Express.js** and **TypeScript** to evaluate CVs and project files using a **RAG (Retrieval-Augmented Generation)** approach with **Gemini 2.5 Flash** LLM. The system supports asynchronous evaluation with **BullMQ + Redis**, vector-based retrieval from PostgreSQL with **pgvector**, and flexible Knowledge Base management.

**Tech Stack**: Express.js, TypeScript, Prisma, PostgreSQL + pgvector, Redis, BullMQ, Gemini 2.5 Flash LLM.

---

## System Requirements

Before running the project, ensure you have installed:

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** ≥ 16 with **pgvector** extension
- **Redis** ≥ 7 (for BullMQ queue processing)

---

## How to Run

### 1. Clone & Enter Directory

```bash
git clone https://github.com/amrylil/ai_cv_evaluator.git
cd ai_cv_evaluator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example file `.env.example` to `.env`, then fill in all required values:

```bash
cp .env.example .env
```

- `DATABASE_URL` → PostgreSQL connection string
- `HOST_REDIS` & `PORT_REDIS` → Redis connection for BullMQ
- `GEMINI_API_KEY` → Stored securely in PDF submission (do not include in repo)
- `PORT` → Server port (default `3000`)

**Note**: For security, the LLM API key is not stored in the repository. Use the value provided in the PDF submission when testing locally.

### 4. Setup Database (Migrate & Seed)

This command will create tables, apply migrations, and populate initial Knowledge Base data:

```bash
npm run db:setup
```

### 5. Run Server

```bash
npm run dev
```

The server will start and API documentation is available at: http://localhost:3000/api/v1/docs

The Swagger docs include all endpoints: uploading CVs/projects, evaluating tasks, fetching evaluation results, and managing the Knowledge Base (CRUD).

---

## Main Endpoints

- `POST /evaluations/upload` → Upload one or multiple CV/project files (PDF or supported formats)
- `POST /evaluations/{id}/evaluate` → Trigger asynchronous RAG evaluation for a specific task
- `GET /evaluations/result/{id}` → Retrieve detailed evaluation results with status tracking (`queued`, `processing`, `completed`, `failed`)
- `/knowledge` → CRUD endpoints for Knowledge Base management

---

## Notes

- **Async Queue**: All evaluations are processed asynchronously with BullMQ + Redis, allowing real-time status updates.
- **Vector Search**: Knowledge Base entries are converted to embeddings and stored in PostgreSQL with pgvector for fast RAG retrieval.
- **LLM Evaluation**: Gemini 2.5 Flash LLM evaluates CVs/projects based on the retrieved context and returns structured JSON results.
- **Swagger Docs**: Full interactive documentation available to test all endpoints.

---

## Development Commands

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Start development server                   |
| `npm run db:setup` | Run migrations and seed initial data       |
| `npm run build`    | Compile TypeScript to JavaScript (`dist/`) |
| `npm run start`    | Run compiled production server             |
