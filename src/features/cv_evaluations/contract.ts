import {
  Document,
  EvaluationTask,
  EvaluationStatus,
  KnowledgeBase,
} from "@prisma/client";
import {
  EvaluationResponseDto,
  UploadCvResponseDto,
} from "./dtos/evaluation.dto";
import {
  CreateKnowledgeRequestDto,
  CreateKnowledgeResponseDto,
  KnowledgeResponseDto,
  SearchKnowledgeResponseDto,
} from "./dtos/knowledge.dto";

export interface IKnowledgeRepository {
  store(content: string, embedding: number[]): Promise<KnowledgeBase>;

  getAll(): Promise<KnowledgeBase[]>;

  searchRelevantChunks(
    queryEmbedding: number[],
    topK?: number
  ): Promise<{ content: string; score: number }[]>;

  findById(id: string): Promise<KnowledgeBase | null>;

  update(id: string, content: string): Promise<KnowledgeBase>;

  delete(id: string): Promise<void>;
}

export interface IEvaluationRepository {
  createDocument(filename: string, extractedText: string): Promise<Document>;
  createTask(documentId: number): Promise<EvaluationTask>;
  updateTask(
    taskId: string,
    status: EvaluationStatus,
    result?: any,
    errorMessage?: string
  ): Promise<EvaluationTask>;
  findTaskById(
    taskId: string
  ): Promise<(EvaluationTask & { cvDocument: Document | null }) | null>;
}

export interface IKnowledgeService {
  create(dto: CreateKnowledgeRequestDto): Promise<CreateKnowledgeResponseDto>;
  getAll(): Promise<KnowledgeResponseDto[]>;
  search(query: string, topK?: number): Promise<SearchKnowledgeResponseDto[]>;
  getById(id: string): Promise<KnowledgeResponseDto | null>;
  update(id: string, content: string): Promise<KnowledgeResponseDto>;
  delete(id: string): Promise<void>;
}

export interface IEvaluationService {
  uploadCv(filePath: string, filename: string): Promise<UploadCvResponseDto>;
  getResult(taskId: string): Promise<EvaluationResponseDto>;
  runEvaluation(
    taskId: string,
    jobDescription: string
  ): Promise<EvaluationResponseDto>;
}
