# CV Evaluation AI API

A simple API based on Express.js and TypeScript for evaluating CVs using RAG (Retrieval-Augmented Generation) approach with DeepSeek model from OpenRouter.

**Tech Stack**: Express.js, TypeScript, Prisma, PostgreSQL, OpenRouter, Vector Embeddings.

## How to Run

### 1. Clone & Enter Directory

```bash
git clone https://github.com/amrylil/cv_evaluation_api.git
cd cv-evaluation-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example file `.env.example` to `.env`, then fill in the values.

```bash
cp .env.example .env
```

See details below.

### 4. Setup Database (Migrate & Seed)

This command will set up the database schema and populate it with initial data.

```bash
npm run db:setup
```

### 5. Run Server

```bash
npm run dev
```

The server will start and you can access the API documentation at:
http://localhost:3000/api/v1/docs

## Environment Variables (`.env`)

Fill your `.env` file as follows:

```
# Database connection URL for Prisma
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# API Key from OpenRouter.ai
OPENROUTER_API_KEY="sk-or-v1-..."

# Model Name (Optional, default already exists)
DEEPSEEK_MODEL_NAME="deepseek/deepseek-chat"

# Server Port
PORT=3000
```

## Explanation Why `.env` Is Included (Pushed)

For ease of demonstration and testing of this project, the `.env` file is intentionally included in the repository. The purpose is so that anyone who clones this project can immediately see what variables are needed without having to search around.

**Warning**: In real-world production projects, the `.env` file **must** be added to `.gitignore` to protect sensitive credentials such as API keys and database connection details.

## Main Commands

- `npm run dev`: Run development server.
- `npm run db:setup`: Run database migration and seeding in one command.
