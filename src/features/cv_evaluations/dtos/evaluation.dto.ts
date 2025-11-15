import { z } from "../../../config/zod-openapi";
import { EvaluationStatus } from "@prisma/client";

/**
 * Schema untuk upload CV request
 */
export const uploadCvRequestSchema = z.object({
  file: z.any().openapi({
    type: "string",
    format: "binary",
    example: "cv.pdf",
    description: "CV file to upload",
  }),
});

/**
 * Schema response setelah upload CV (task created)
 */
export const uploadCvResponseSchema = z.object({
  id: z.string().uuid().openapi({
    example: "b1f37c7e-7d64-4c31-bc13-2f64b3dce34f",
  }),
  status: z.nativeEnum(EvaluationStatus).openapi({ example: "queued" }),
});

/**
 * Schema untuk hasil evaluasi CV
 */
export const evaluationResultSchema = z.object({
  cv_match_rate: z.number().openapi({ example: 0.82 }),
  cv_feedback: z
    .string()
    .openapi({ example: "Strong backend skills, needs more AI experience" }),
  project_score: z.number().openapi({ example: 7.5 }),
  project_feedback: z.string().openapi({
    example: "Good coverage of projects, missing details on scope",
  }),
  overall_summary: z
    .string()
    .openapi({ example: "Strong candidate for backend junior roles" }),
});

/**
 * Schema untuk response getResult atau runEvaluation
 */
export const evaluationResponseSchema = z.object({
  id: z.string().uuid().openapi({
    example: "b1f37c7e-7d64-4c31-bc13-2f64b3dce34f",
  }),
  status: z.nativeEnum(EvaluationStatus).openapi({ example: "completed" }),
  result: evaluationResultSchema.optional(),
  errorMessage: z.string().nullable().optional(),
});

/**
 * TypeScript types
 */
export type UploadCvRequestDto = z.infer<typeof uploadCvRequestSchema>;
export type UploadCvResponseDto = z.infer<typeof uploadCvResponseSchema>;
export type EvaluationResultDto = z.infer<typeof evaluationResultSchema>;
export type EvaluationResponseDto = z.infer<typeof evaluationResponseSchema>;
