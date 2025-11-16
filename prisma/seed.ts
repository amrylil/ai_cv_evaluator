import { PrismaClient } from "@prisma/client";
import { embedText } from "../src/utils/vectorStore";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const knowledgeData = [
  {
    content:
      "Opening for a Backend Engineer in Yogyakarta, remote, full-time. Level: Associate (0-3 years). Salary IDR 7,500,000 - IDR 8,700,000.",
  },
  { content: "Tech stack: Node.js, Ruby on Rails, LLM, Docker, Kubernetes." },
  {
    content:
      "Responsibilities: building new product features, handling bugs, maintaining backend performance, and writing clean code.",
  },
  {
    content:
      "Additional focus: integrating AI/LLM systems into the product, RAG (Retrieval-Augmented Generation), model chaining, async workers.",
  },
  {
    content:
      "Qualifications: backend experience (Node.js, Django, Rails), databases (MySQL, PostgreSQL, MongoDB), REST API, security, cloud (AWS, GCP, Azure).",
  },
  {
    content:
      "Additional skills: auth & authorization, scalable app design, DB schema, unit tests, automated testing.",
  },
  {
    content:
      "Preferred qualifications: familiarity with LLM APIs, embeddings, vector DB, prompt design. A formal degree is not emphasized.",
  },
  {
    content:
      "Work culture: remote-friendly, self-managed, full support from the CTO, flexible work location within Indonesia.",
  },
];

async function main() {
  await prisma.knowledgeBase.deleteMany({});

  for (const item of knowledgeData) {
    console.log(
      `- Membuat embedding untuk: "${item.content.substring(0, 40)}..."`
    );

    const embeddingVector = await embedText(item.content);
    const vectorString = `[${embeddingVector.join(",")}]`;

    await prisma.$queryRawUnsafe(
      `
      INSERT INTO knowledge_base (id, content, embedding, updated_at)
      VALUES ($1, $2, $3::vector, CURRENT_TIMESTAMP)
    `,
      randomUUID(),
      item.content,
      vectorString
    );
  }

  console.log("✅ Seeding selesai.");
}
main()
  .catch((e) => {
    console.error("❌ Gagal menjalankan seeder:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
