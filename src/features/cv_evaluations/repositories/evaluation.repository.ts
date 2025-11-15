import { PrismaClient, EvaluationStatus } from "@prisma/client";
import { IEvaluationRepository } from "../contract";

export class EvaluationRepository implements IEvaluationRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createDocument(filename: string, extractedText: string) {
    return this.prisma.document.create({
      data: { originalFilename: filename, extractedText },
    });
  }

  async createTask(documentId: number) {
    return this.prisma.evaluationTask.create({
      data: { cvDocumentId: documentId, status: EvaluationStatus.queued },
    });
  }

  async updateTask(
    taskId: string,
    status: EvaluationStatus,
    result?: any,
    errorMessage?: string
  ) {
    return this.prisma.evaluationTask.update({
      where: { id: taskId },
      data: {
        status,
        result,
        errorMessage,
        completedAt: status === EvaluationStatus.completed ? new Date() : null,
      },
    });
  }

  async findTaskById(taskId: string) {
    return this.prisma.evaluationTask.findUnique({
      where: { id: taskId },
      include: { cvDocument: true },
    });
  }
}
