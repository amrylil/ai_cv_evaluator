import { extractTextFromPdf } from "../../../utils/textExtractor";
import { IEvaluationService } from "../contract";
import { EvaluationStatus } from "@prisma/client";
import {
  EvaluationResponseDto,
  evaluationResponseSchema,
  evaluationResultSchema,
} from "../dtos/evaluation.dto";

import { KnowledgeService } from "./knowledge.usecase";
import { handlePrompt } from "../../../utils/handlePrompt";
import { EvaluationRepository } from "../repositories/evaluation.repository";
import { sanitizeLLM } from "../../../utils/outputSanitize";
import { callGemini } from "../../../utils/gemini";

export class EvaluationService implements IEvaluationService {
  private repo: EvaluationRepository;
  private knowledgeService: KnowledgeService;

  constructor() {
    this.repo = new EvaluationRepository();
    this.knowledgeService = new KnowledgeService();
  }

  async uploadDocuments(
    cvPath: string,
    cvName: string,
    projectPath: string,
    projectName: string
  ) {
    const cvText = await extractTextFromPdf(cvPath);
    const projectText = await extractTextFromPdf(projectPath);

    const cvDoc = await this.repo.createDocument(cvName, cvText);
    const projectDoc = await this.repo.createDocument(projectName, projectText);

    const task = await this.repo.createTask(cvDoc.id, projectDoc.id);

    return {
      taskId: task.id,
      cvDocumentId: cvDoc.id,
      projectDocumentId: projectDoc.id,
    };
  }

  async getAll() {
    const tasks = await this.repo.getAll();

    return tasks.map((task) =>
      evaluationResponseSchema.parse({
        id: task.id,
        status: task.status,
        result: task.result ?? undefined,
        errorMessage: task.errorMessage ?? null,
      })
    );
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
    const projectText = task.projectDocument?.extractedText ?? "";

    const jdText = jobDescription ?? "";

    const relevantChunks = await this.knowledgeService.search(jdText, 5);
    const context = relevantChunks.map((c) => c.content).join("\n---\n");

    const prompt = handlePrompt(jdText, context, cvText, projectText);

    try {
      const rawResponse = await callGemini(prompt);

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
