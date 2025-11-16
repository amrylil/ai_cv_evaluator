import { z } from "../../../config/zod-openapi";
import { EvaluationStatus } from "@prisma/client";

/**
 * Request: Upload 2 documents (CV + Project)
 */
export const uploadDocumentsRequestSchema = z.object({
  cv: z.any().openapi({
    type: "string",
    format: "binary",
    example: "cv.pdf",
    description: "Candidate CV file",
  }),
  project: z.any().openapi({
    type: "string",
    format: "binary",
    example: "project.pdf",
    description: "Candidate Project Document file",
  }),
});

/**
 * Response: Task created with 2 documents
 */
export const uploadDocumentsResponseSchema = z.object({
  taskId: z.string().uuid().openapi({
    example: "b1f37c7e-7d64-4c31-bc13-2f64b3dce34f",
  }),
  cvDocumentId: z.number().openapi({ example: 10 }),
  projectDocumentId: z.number().openapi({ example: 11 }),
  status: z
    .nativeEnum(EvaluationStatus)
    .openapi({ example: "queued" })
    .optional(),
});

/**
 * Result from LLM evaluation
 */
export const evaluationResultSchema = z.object({
  cv_match_rate: z.number(),
  cv_feedback: z.string(),
  project_score: z.number(),
  project_feedback: z.string(),
  overall_summary: z.string(),
});

/**
 * Get result / run evaluation response
 */
export const evaluationResponseSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(EvaluationStatus),
  result: evaluationResultSchema.optional(),
  errorMessage: z.string().nullable().optional(),
});

/**
 * Types
 */
export type UploadDocumentsRequestDto = z.infer<
  typeof uploadDocumentsRequestSchema
>;
export type UploadDocumentsResponseDto = z.infer<
  typeof uploadDocumentsResponseSchema
>;
export type EvaluationResultDto = z.infer<typeof evaluationResultSchema>;
export type EvaluationResponseDto = z.infer<typeof evaluationResponseSchema>;
