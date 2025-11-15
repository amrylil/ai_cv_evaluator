import { z } from "../../../config/zod-openapi";

export const createKnowledgeRequestSchema = z.object({
  content: z
    .string()
    .min(1)
    .openapi({ example: "Menguasai Node.js dan PostgreSQL" }),
});

export const createKnowledgeResponseSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({ example: "d3b07384-1234-5678-9101-abcdefabcdef" }),
  content: z.string(),
  embedding: z.array(z.number()),
  createdAt: z.string().datetime(),
});

export const knowledgeResponseSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  createdAt: z.string().datetime(),
});

export const searchKnowledgeResponseSchema = z.object({
  content: z.string(),
  score: z.number(),
});

export type CreateKnowledgeRequestDto = z.infer<
  typeof createKnowledgeRequestSchema
>;
export type CreateKnowledgeResponseDto = z.infer<
  typeof createKnowledgeResponseSchema
>;
export type KnowledgeResponseDto = z.infer<typeof knowledgeResponseSchema>;
export type SearchKnowledgeResponseDto = z.infer<
  typeof searchKnowledgeResponseSchema
>;
