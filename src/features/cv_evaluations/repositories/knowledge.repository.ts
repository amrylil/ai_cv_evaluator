import { PrismaClient, KnowledgeBase } from "@prisma/client";
import { IKnowledgeRepository } from "../contract";
import cosineSimilarity from "../../../utils/similarity";

export class KnowledgeRepository implements IKnowledgeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async store(content: string, embedding: number[]): Promise<KnowledgeBase> {
    return this.prisma.knowledgeBase.create({
      data: { content, embedding },
    });
  }

  async getAll(): Promise<KnowledgeBase[]> {
    return this.prisma.knowledgeBase.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async searchRelevantChunks(queryEmbedding: number[], topK: number = 5) {
    const all = await this.prisma.knowledgeBase.findMany();

    return all
      .map((item) => ({
        content: item.content,
        score: cosineSimilarity(queryEmbedding, item.embedding as number[]),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
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
