import { PrismaClient, KnowledgeBase } from "@prisma/client";
import { IKnowledgeRepository } from "../contract";
import cosineSimilarity from "../../../utils/similarity";

export class KnowledgeRepository implements IKnowledgeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async store(content: string, embedding: number[]): Promise<KnowledgeBase> {
    const embeddingVector = `[${embedding.join(",")}]`;

    const result = await this.prisma.$queryRawUnsafe<KnowledgeBase[]>(
      `
    INSERT INTO knowledge_base (content, embedding)
    VALUES ($1, $2::vector)
    RETURNING *
  `,
      content,
      embeddingVector
    );

    return result[0];
  }

  async getAll(): Promise<KnowledgeBase[]> {
    return this.prisma.knowledgeBase.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async searchRelevantChunks(queryEmbedding: number[], topK: number = 5) {
    const embeddingVector = `[${queryEmbedding.join(",")}]`;

    const result = await this.prisma.$queryRaw<
      { content: string; score: number }[]
    >`SELECT content, embedding <#> ${embeddingVector}::vector AS score
  FROM knowledge_base
  ORDER BY embedding <#> ${embeddingVector}::vector
  LIMIT ${topK}`;

    return result;
  }

  async findById(id: string): Promise<KnowledgeBase | null> {
    return this.prisma.knowledgeBase.findUnique({
      where: { id },
    });
  }

  async update(id: string, content: string): Promise<KnowledgeBase> {
    return this.prisma.knowledgeBase.update({
      where: { id },
      data: { content },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.knowledgeBase.delete({
      where: { id },
    });
  }
}
