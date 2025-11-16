import { callOpenRouter } from "../../../utils/deepseek";
import { extractTextFromPdf } from "../../../utils/textExtractor";
import { IEvaluationService } from "../contract";
import { EvaluationStatus } from "@prisma/client";
import {
  UploadCvResponseDto,
  uploadCvResponseSchema,
  EvaluationResponseDto,
  evaluationResponseSchema,
  evaluationResultSchema,
} from "../dtos/evaluation.dto";

import { KnowledgeService } from "./knowledge.usecase";
import { handlePrompt } from "../../../utils/handlePrompt";
import { EvaluationRepository } from "../repositories/evaluation.repository";
import { sanitizeLLM } from "../../../utils/outputSanitize";

export class EvaluationService implements IEvaluationService {
  private repo: EvaluationRepository;
  private knowledgeService: KnowledgeService;

  constructor() {
    this.repo = new EvaluationRepository();
    this.knowledgeService = new KnowledgeService();
  }

  async uploadCv(
    filePath: string,
    filename: string
  ): Promise<UploadCvResponseDto> {
    const extractedText = await extractTextFromPdf(filePath);
    const document = await this.repo.createDocument(filename, extractedText);
    const task = await this.repo.createTask(document.id);

    return uploadCvResponseSchema.parse({
      id: task.id,
      status: task.status,
    });
  }

  async getResult(taskId: string): Promise<EvaluationResponseDto> {
    const task = await this.repo.findTaskById(taskId);
    if (!task) throw new Error("Task not found");

    return evaluationResponseSchema.parse({
      id: task.id,
      status: task.status,
      result: task.result
        ? evaluationResultSchema.parse(task.result)
        : undefined,
      errorMessage: task.errorMessage ?? null,
    });
  }

async runEvaluation(taskId: string, jobDescription?: string) {
  const task = await this.repo.findTaskById(taskId);
  if (!task) throw new Error("Task not found");

  if (task.status === EvaluationStatus.completed) {
    return evaluationResponseSchema.parse({
      id: task.id,
      status: task.status,
      result: task.result
        ? evaluationResultSchema.parse(task.result)
        : undefined,
      errorMessage: task.errorMessage ?? null,
    });
  }

  await this.repo.updateTask(taskId, EvaluationStatus.processing);

  const cvText = task.cvDocument?.extractedText ?? "";
  const jdText = jobDescription ?? "";

  const relevantChunks = await this.knowledgeService.search(jdText, 5);
  const context = relevantChunks.map((c) => c.content).join("\n---\n");

  const prompt = handlePrompt(jdText, context, cvText);

  try {
    const rawResponse = await callOpenRouter(prompt);

    const cleaned = sanitizeLLM(rawResponse);

    const parsedJson = JSON.parse(cleaned);

    const parsed = evaluationResultSchema.parse(parsedJson);

    const updated = await this.repo.updateTask(
      taskId,
      EvaluationStatus.completed,
      parsed
    );

    return evaluationResponseSchema.parse({
      id: updated.id,
      status: updated.status,
      result: parsed,
      errorMessage: null,
    });

  } catch (err) {
    const updated = await this.repo.updateTask(
      taskId,
      EvaluationStatus.failed,
      null,
      (err as Error).message
    );

    return evaluationResponseSchema.parse({
      id: updated.id,
      status: updated.status,
      result: undefined,
      errorMessage: (err as Error).message,
    });
  }
}

}
