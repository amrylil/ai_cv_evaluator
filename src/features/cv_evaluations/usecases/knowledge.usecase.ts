import { IKnowledgeRepository, IKnowledgeService } from "../contract";
import {
  CreateKnowledgeRequestDto,
  CreateKnowledgeResponseDto,
  KnowledgeResponseDto,
  SearchKnowledgeResponseDto,
} from "../dtos/knowledge.dto";
import { embedText } from "../../../utils/vectorStore";
import { KnowledgeRepository } from "../repositories/knowledge.repository";

export class KnowledgeService implements IKnowledgeService {
  private repo: IKnowledgeRepository;

  constructor() {
    this.repo = new KnowledgeRepository();
  }

  async create(
    dto: CreateKnowledgeRequestDto
  ): Promise<CreateKnowledgeResponseDto> {
    const embedding = await embedText(dto.content);
    const created = await this.repo.store(dto.content, embedding);
    return {
      id: created.id,
      content: created.content,
      embedding: created.embedding as number[],
      createdAt: created.createdAt.toISOString(),
    };
  }

  async getAll(): Promise<KnowledgeResponseDto[]> {
    const all = await this.repo.getAll();
    return all.map((k) => ({
      id: k.id,
      content: k.content,
      createdAt: k.createdAt.toISOString(),
    }));
  }

  async search(query: string, topK = 5): Promise<SearchKnowledgeResponseDto[]> {
    const queryEmbedding = await embedText(query);
    return this.repo.searchRelevantChunks(queryEmbedding, topK);
  }

  async getById(id: string): Promise<KnowledgeResponseDto | null> {
    const found = await this.repo.findById(id);
    if (!found) return null;
    return {
      id: found.id,
      content: found.content,
      createdAt: found.createdAt.toISOString(),
    };
  }

  async update(id: string, content: string): Promise<KnowledgeResponseDto> {
    const updated = await this.repo.update(id, content);
    return {
      id: updated.id,
      content: updated.content,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
